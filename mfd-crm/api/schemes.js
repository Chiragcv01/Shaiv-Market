// GET /api/schemes — all open-ended schemes from AMFI's official NAVAll.txt
// (code, name, SEBI category, AMC, latest NAV, NAV date). CDN-cached 6h.
const AMFI = 'https://www.amfiindia.com/spages/NAVAll.txt';
const MON = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };

function parse(txt) {
  const cats = [], amcs = [], rows = [], ci = new Map(), ai = new Map();
  let cat = -1, amc = -1, open = false, asOf = '';
  for (const raw of txt.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    if (line.includes(';')) {
      const p = line.split(';');
      if (p.length < 6 || !/^\d+$/.test(p[0].trim()) || !open) continue;
      const nav = parseFloat(p[4]);
      const d = p[5].trim().split('-');
      const date = d.length === 3 ? `${d[2]}-${MON[d[1]] || '01'}-${d[0].padStart(2, '0')}` : '';
      if (date > asOf) asOf = date;
      rows.push([+p[0], p[3].trim().replace(/\s+/g, ' '), cat, amc, isFinite(nav) ? nav : null, date]);
      continue;
    }
    const m = line.match(/^(.*?Schemes?)\s*\((.+)\)\s*$/i);
    if (m) {
      open = /open ended/i.test(m[1]);
      const c = m[2].trim();
      if (!ci.has(c)) { ci.set(c, cats.length); cats.push(c); }
      cat = ci.get(c); continue;
    }
    if (!ai.has(line)) { ai.set(line, amcs.length); amcs.push(line); }
    amc = ai.get(line);
  }
  return { source: 'amfi', asOf, cats, amcs, rows };
}

async function get(url, tries = 3) {
  let err;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (shaiv-mfd-crm)' } });
      if (r.ok) return r;
      err = new Error('HTTP ' + r.status);
    } catch (e) { err = e; }
    await new Promise(s => setTimeout(s, 700 * (i + 1)));
  }
  throw err;
}

module.exports = async (req, res) => {
  try {
    const txt = await (await get(AMFI)).text();
    const out = parse(txt);
    if (out.rows.length < 3000) throw new Error('AMFI file incomplete: ' + out.rows.length);
    res.setHeader('Cache-Control', 'public, s-maxage=21600, stale-while-revalidate=86400');
    return res.status(200).json(out);
  } catch (e) {
    try { // fallback: mfapi full list (names only, no category)
      const j = await (await get('https://api.mfapi.in/mf')).json();
      const rows = (Array.isArray(j) ? j : []).map(s => [+s.schemeCode, String(s.schemeName || '').trim(), -1, -1, null, '']);
      res.setHeader('Cache-Control', 'public, s-maxage=21600, stale-while-revalidate=86400');
      return res.status(200).json({ source: 'mfapi', asOf: '', cats: [], amcs: [], rows, warn: String(e.message || e) });
    } catch (e2) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(502).json({ error: 'AMFI + mfapi both failed: ' + (e2.message || e2) });
    }
  }
};
module.exports.parse = parse;
