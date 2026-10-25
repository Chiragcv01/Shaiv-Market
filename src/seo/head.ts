import { RouteMeta, SITE_URL } from './routes';
import { schemaFor } from './schema';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const canonicalFor = (r: RouteMeta) => `${SITE_URL}${r.path === '/' ? '/' : r.path}`;
const OG_IMAGE = `${SITE_URL}/images/og-card.png`;

/** <head> tags for a route, as an HTML string (used when prerendering). */
export function headHtml(r: RouteMeta): string {
  const url = canonicalFor(r);
  const img = esc(r.image || OG_IMAGE);
  return [
    `<title>${esc(r.title)}</title>`,
    `<meta name="description" content="${esc(r.description)}" data-seo />`,
    `<meta name="robots" content="${r.index ? 'index, follow, max-image-preview:large, max-snippet:-1' : 'noindex, nofollow'}" data-seo />`,
    `<link rel="canonical" href="${url}" data-seo />`,
    `<link rel="alternate" hreflang="en-IN" href="${url}" data-seo />`,
    `<meta property="og:type" content="${r.slug ? 'article' : 'website'}" data-seo />`,
    `<meta property="og:site_name" content="Shaiv Market" data-seo />`,
    `<meta property="og:locale" content="en_IN" data-seo />`,
    `<meta property="og:url" content="${url}" data-seo />`,
    `<meta property="og:title" content="${esc(r.title)}" data-seo />`,
    `<meta property="og:description" content="${esc(r.description)}" data-seo />`,
    `<meta property="og:image" content="${img}" data-seo />`,
    `<meta property="og:image:width" content="1200" data-seo />`,
    `<meta property="og:image:height" content="630" data-seo />`,
    `<meta name="twitter:card" content="summary_large_image" data-seo />`,
    `<meta name="twitter:title" content="${esc(r.title)}" data-seo />`,
    `<meta name="twitter:description" content="${esc(r.description)}" data-seo />`,
    `<meta name="twitter:image" content="${img}" data-seo />`,
    `<meta name="geo.region" content="IN-RJ" data-seo />`,
    `<meta name="geo.placename" content="Jaipur" data-seo />`,
    `<script type="application/ld+json" data-seo>${JSON.stringify(schemaFor(r)).replace(/</g, '\\u003c')}</script>`
  ].join('\n    ');
}

/** Keep the live document's head in sync during client-side navigation. */
export function applyHead(r: RouteMeta) {
  if (typeof document === 'undefined') return;
  document.title = r.title;
  document.head.querySelectorAll('[data-seo]').forEach((el) => el.remove());
  const tpl = document.createElement('template');
  tpl.innerHTML = headHtml(r).replace(/<title>.*?<\/title>/, '');
  document.head.append(...Array.from(tpl.content.childNodes).filter((n) => n.nodeType === 1));
}
