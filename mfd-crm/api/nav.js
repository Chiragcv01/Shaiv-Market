// GET /api/nav?code=122640[&start=YYYY-MM-DD] — NAV history via mfapi.in, server-side with retries, CDN-cached 6h.
module.exports = async (req, res) => {
  const code = String((req.query && req.query.code) || '').replace(/\D/g, '');
  const start = String((req.query && req.query.start) || '');
  if (!code) return res.status(400).json({ error: 'code required' });
  let url = `https://api.mfapi.in/mf/${code}`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(start)) url += `?startDate=${start}&endDate=${new Date(Date.now() + 864e5).toISOString().slice(0, 10)}`;
  let err;
  for (let i = 0; i < 4; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (shaiv-mfd-crm)' } });
      if (r.ok) {
        const j = await r.json();
        if (j && Array.isArray(j.data) && j.data.length) {
          res.setHeader('Cache-Control', 'public, s-maxage=21600, stale-while-revalidate=86400');
          return res.status(200).json(j);
        }
        err = new Error('empty');
      } else err = new Error('HTTP ' + r.status);
    } catch (e) { err = e; }
    await new Promise(s => setTimeout(s, 600 * (i + 1)));
  }
  res.setHeader('Cache-Control', 'no-store');
  return res.status(502).json({ error: 'NAV fetch failed: ' + (err && err.message) });
};
