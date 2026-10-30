// Sends a lead to the server (/api/lead), which stores it and alerts the advisor.
// Without this, leads only lived in the visitor's own browser storage.

export type LeadPayload = {
  type: 'quote' | 'booking' | 'contact';
  ref: string;
  name: string;
  phone?: string;
  email?: string;
  details?: Record<string, string | number | undefined>;
};

export async function submitLead(lead: LeadPayload): Promise<boolean> {
  try {
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...lead, page: typeof window !== 'undefined' ? window.location.href : '' }),
      keepalive: true,
    });
    return res.ok;
  } catch {
    return false;
  }
}
