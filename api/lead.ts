// Vercel Function: receives every lead from the site (account form, call booking,
// contact form), stores it in Supabase and emails the advisor.
//
// Env vars (Vercel → Project → Settings → Environment Variables):
//   SUPABASE_URL, SUPABASE_KEY   – project URL + publishable/anon key (table is insert-only for anon)
//   RESEND_API_KEY               – optional, enables email alerts (resend.com)
//   LEAD_NOTIFY_EMAIL            – where alerts go (default marketlive45@gmail.com)
//   LEAD_FROM_EMAIL              – optional sender, e.g. "Shaiv Market <leads@shaivmarket.com>"
//   LEAD_WEBHOOK_URL             – optional extra forward (Zapier / Make / Google Apps Script)

type LeadType = 'quote' | 'booking' | 'contact';

const TYPE_LABEL: Record<LeadType, string> = {
  quote: 'New investment lead',
  booking: 'New call booking',
  contact: 'New contact enquiry',
};

const clip = (v: unknown, max = 500) =>
  typeof v === 'string' ? v.trim().slice(0, max) : typeof v === 'number' && isFinite(v) ? String(v) : '';

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON' }, 400);
  }

  // Honeypot: real visitors never fill this hidden field
  if (clip(body.website)) return json({ ok: true });

  const type = body.type as LeadType;
  if (!(type in TYPE_LABEL)) return json({ ok: false, error: 'Unknown lead type' }, 400);

  const name = clip(body.name, 120);
  const phone = clip(body.phone, 30);
  const email = clip(body.email, 160);
  if (!name || (!phone && !email)) return json({ ok: false, error: 'Name and phone/email required' }, 400);

  // Remaining fields are kept as details (strings/numbers only, capped)
  const details: Record<string, string> = {};
  const raw = body.details && typeof body.details === 'object' ? (body.details as Record<string, unknown>) : {};
  for (const [k, v] of Object.entries(raw).slice(0, 20)) {
    const val = clip(v, 2000);
    if (val) details[k.slice(0, 40)] = val;
  }

  const ref = clip(body.ref, 40);
  const page = clip(body.page, 300);
  const lead = { type, ref, name, phone, email, details, page };

  const results = await Promise.allSettled([store(lead), notify(lead), forward(lead)]);
  const [stored, emailed, forwarded] = results.map((r) => (r.status === 'fulfilled' ? r.value : false));
  results.forEach((r) => r.status === 'rejected' && console.error('lead delivery failed:', r.reason));

  if (!stored && !emailed && !forwarded) return json({ ok: false, error: 'Lead could not be delivered' }, 502);
  return json({ ok: true, stored, emailed });
}

type Lead = {
  type: LeadType;
  ref: string;
  name: string;
  phone: string;
  email: string;
  details: Record<string, string>;
  page: string;
};

async function store(lead: Lead) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;
  if (!url || !key) return false;
  const res = await fetch(`${url}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(lead),
  });
  if (!res.ok) throw new Error(`supabase ${res.status}: ${await res.text()}`);
  return true;
}

async function notify(lead: Lead) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const to = process.env.LEAD_NOTIFY_EMAIL || 'marketlive45@gmail.com';
  const from = process.env.LEAD_FROM_EMAIL || 'Shaiv Market Leads <onboarding@resend.dev>';

  const rows: [string, string][] = [
    ['Name', lead.name],
    ['Phone', lead.phone],
    ['Email', lead.email],
    ['Reference', lead.ref],
    ...Object.entries(lead.details),
    ['Page', lead.page],
  ].filter(([, v]) => v) as [string, string][];

  const phoneDigits = lead.phone.replace(/\D/g, '');
  const wa = phoneDigits ? `https://wa.me/${phoneDigits.length === 10 ? '91' + phoneDigits : phoneDigits}` : '';

  const html = `
    <h2 style="font-family:sans-serif">${TYPE_LABEL[lead.type]}</h2>
    <table style="font-family:sans-serif;border-collapse:collapse">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:4px 12px 4px 0;color:#666">${escapeHtml(k)}</td><td style="padding:4px 0"><b>${escapeHtml(v)}</b></td></tr>`
        )
        .join('')}
    </table>
    ${phoneDigits ? `<p style="font-family:sans-serif"><a href="tel:${phoneDigits}">Call</a> · <a href="${wa}">WhatsApp</a></p>` : ''}`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: to.split(',').map((s) => s.trim()),
      subject: `${TYPE_LABEL[lead.type]}: ${lead.name}${lead.phone ? ' (' + lead.phone + ')' : ''}`,
      html,
      ...(lead.email.includes('@') && !lead.email.endsWith('.shaivmarket.in') ? { reply_to: lead.email } : {}),
    }),
  });
  if (!res.ok) throw new Error(`resend ${res.status}: ${await res.text()}`);
  return true;
}

async function forward(lead: Lead) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return false;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...lead, submittedAt: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error(`webhook ${res.status}`);
  return true;
}
