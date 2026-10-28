import { parseMd, Faq } from '../md';

export interface Term { name: string; definition: string }
export interface Resource {
  slug: string;
  title: string;
  h1: string;
  description: string;
  answer: string;
  type: string;
  related: string[];
  updated: string;
  html: string;
  toc: { id: string; text: string }[];
  faq: Faq[];
  terms: Term[];
}

const files = import.meta.glob('./*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const slugify = (t: string) => t.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z#0-9]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const termId = (name: string) => `term-${slugify(name)}`;

const plain = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\s+/g, ' ').trim();

export const RESOURCES: Resource[] = Object.entries(files).map(([file, raw]) => {
  const parsed = parseMd(raw, file);
  const { meta, toc, faq } = parsed;
  // anchor every term so it can be linked to and cited
  const html = meta.type === 'glossary' ? parsed.html.replace(/<h3>(.*?)<\/h3>/g, (_, t: string) => `<h3 id="${termId(t.replace(/<[^>]+>/g, ''))}">${t}</h3>`) : parsed.html;
  // glossary terms: every ### heading outside the FAQ section, with the paragraph under it
  const body = raw.split(/\n---\n/).slice(1).join('\n---\n');
  const beforeFaq = body.split(/^## Questions people ask/m)[0];
  const terms: Term[] = meta.type === 'glossary'
    ? beforeFaq.split(/^### /m).slice(1).map((chunk) => {
        const [name, ...rest] = chunk.split('\n');
        return { name: name.trim(), definition: plain(rest.join(' ')) };
      }).filter((t) => t.name && t.definition)
    : [];
  return {
    slug: meta.slug,
    title: meta.title,
    h1: meta.h1 || meta.title,
    description: meta.description,
    answer: meta.answer || '',
    type: meta.type || 'page',
    related: (meta.related || '').split(',').map((s) => s.trim()).filter(Boolean),
    updated: meta.updated || '2026-10-28',
    html, toc, faq, terms
  };
});

export const resourceBySlug = (slug: string) => RESOURCES.find((r) => r.slug === slug);
