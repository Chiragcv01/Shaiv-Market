import { marked } from 'marked';

export interface BlogFaq { q: string; a: string }
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;      // ISO
  updated: string;   // ISO
  category: string;
  keywords: string[];
  answer: string;    // the short, direct answer shown at the top
  minutes: number;
  order: number;
  toc: { id: string; text: string }[];
  html: string;
  faq: BlogFaq[];
}

// Each post is a markdown file with a simple front matter block and an optional
// "## Questions people ask" section at the end, whose ### questions become the FAQ.
const files = import.meta.glob('./*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

function parse(raw: string, file: string): BlogPost {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`Missing front matter in ${file}`);
  const meta: Record<string, string> = {};
  m[1].split('\n').forEach((line) => {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"|"$/g, '').replace(/\\"/g, '"');
  });
  let body = m[2].trim();

  const faq: BlogFaq[] = [];
  const faqStart = body.search(/^## Questions people ask/m);
  if (faqStart >= 0) {
    const faqBlock = body.slice(faqStart);
    faqBlock.split(/^### /m).slice(1).forEach((chunk) => {
      const [q, ...rest] = chunk.split('\n');
      const a = rest.join('\n').trim().replace(/\s+/g, ' ').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
      if (q.trim() && a) faq.push({ q: q.trim(), a });
    });
  }

  const slugify = (t: string) => t.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z#0-9]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const toc: { id: string; text: string }[] = [];
  const words = body.replace(/[#>*|`-]/g, ' ').split(/\s+/).filter(Boolean).length;
  const html = (marked.parse(body, { async: false, gfm: true }) as string).replace(/<h2>(.*?)<\/h2>/g, (_, t: string) => {
    const id = slugify(t);
    toc.push({ id, text: t.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'") });
    return `<h2 id="${id}">${t}</h2>`;
  });

  return {
    slug: meta.slug,
    title: meta.title,
    description: meta.description,
    date: meta.date,
    updated: meta.updated || meta.date,
    category: meta.category || 'Guides',
    keywords: (meta.keywords || '').split(',').map((k) => k.trim()).filter(Boolean),
    answer: meta.answer || '',
    minutes: Math.max(3, Math.round(words / 220)),
    order: Number(meta.order || 99),
    toc,
    html: html
      // tables scroll on phones
      .replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, '</table></div>')
      // external links open in a new tab
      .replace(/<a href="(https?:\/\/(?!shaivmarket\.com)[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"'),
    faq
  };
}

export const POSTS: BlogPost[] = Object.entries(files)
  .map(([file, raw]) => parse(raw, file))
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.order - b.order));

export const postBySlug = (slug: string) => POSTS.find((p) => p.slug === slug);
