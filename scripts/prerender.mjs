// Renders every public route to static HTML after `vite build`, plus sitemap.xml and llms-full.txt.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = path.resolve('dist');
const ssr = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href);
const { render, ROUTES, SITE_URL, headHtml, HOME_FAQ, CALC_FAQ } = ssr;

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
// strip template's generic SEO tags; each page gets its own
const base = template
  .replace(/<title>[\s\S]*?<\/title>/, '<!--seo-head-->')
  .replace(/\s*<meta name="description"[^>]*>/g, '')
  .replace(/\s*<meta property="og:[^"]*"[^>]*>/g, '');

const today = new Date().toISOString().slice(0, 10);
let ok = 0;

for (const r of ROUTES) {
  if (!r.index) continue;
  let body = '';
  try {
    body = render(r.path);
  } catch (e) {
    console.error(`prerender failed for ${r.path}:`, e);
    process.exitCode = 1;
    continue;
  }
  const html = base.replace('<!--seo-head-->', headHtml(r)).replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  // flat files (about.html, calculators/swp-calculator.html) are served at clean URLs by Vercel (cleanUrls)
  const out = r.path === '/' ? path.join(dist, 'index.html') : path.join(dist, `${r.path.slice(1)}.html`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  ok++;
  console.log(`prerendered ${r.path} (${Math.round(html.length / 1024)} KB)`);
}

// custom 404 page (Vercel serves dist/404.html with a real 404 status)
const nf = ROUTES.find((r) => r.screen === 'not-found');
fs.writeFileSync(path.join(dist, '404.html'), base.replace('<!--seo-head-->', headHtml(nf)).replace('<div id="root"></div>', `<div id="root">${render(nf.path)}</div>`));

// app shell for private routes (admin, login): not indexable
const shellRoute = ROUTES.find((r) => r.path === '/sm-admin');
fs.writeFileSync(path.join(dist, 'shell.html'), base.replace('<!--seo-head-->', headHtml(shellRoute)));

// sitemap.xml
const urls = ROUTES.filter((r) => r.index).map((r) => `  <url>
    <loc>${SITE_URL}${r.path === '/' ? '/' : r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq || 'monthly'}</changefreq>
    <priority>${(r.priority ?? 0.5).toFixed(1)}</priority>
  </url>`).join('\n');
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`);

// llms-full.txt: every page summary + all FAQs, for AI assistants
const faqText = (list) => list.map((f) => `Q: ${f.q}\nA: ${f.a}`).join('\n\n');
const llmsFull = [
  fs.readFileSync(path.join(dist, 'llms.txt'), 'utf8').trim(),
  '\n## All pages\n',
  ...ROUTES.filter((r) => r.index).map((r) => `- [${r.name}](${SITE_URL}${r.path === '/' ? '/' : r.path}): ${r.description}`),
  '\n## Frequently asked questions\n',
  faqText(HOME_FAQ),
  ...Object.entries(CALC_FAQ).map(([k, v]) => `\n### ${k} calculator\n\n${faqText(v)}`)
].join('\n');
fs.writeFileSync(path.join(dist, 'llms-full.txt'), llmsFull + '\n');

console.log(`done: ${ok} pages, sitemap.xml, shell.html, llms-full.txt`);
