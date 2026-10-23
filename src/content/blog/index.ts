import { parseMd, Faq } from '../md';

export type BlogFaq = Faq;
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
  const { meta, html, toc, faq, words } = parseMd(raw, file);
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
    html,
    faq
  };
}

export const POSTS: BlogPost[] = Object.entries(files)
  .map(([file, raw]) => parse(raw, file))
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.order - b.order));

export const postBySlug = (slug: string) => POSTS.find((p) => p.slug === slug);
