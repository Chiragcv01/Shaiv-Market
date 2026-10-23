import { parseMd, Faq } from '../md';

export interface CalcGuide {
  tab: string;
  answer: string;      // one-paragraph direct answer shown under the H1
  related: string[];   // blog slugs
  updated: string;
  html: string;
  toc: { id: string; text: string }[];
  faq: Faq[];
}

const files = import.meta.glob('./*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export const CALC_GUIDES: Record<string, CalcGuide> = Object.fromEntries(
  Object.entries(files).map(([file, raw]) => {
    const { meta, html, toc, faq } = parseMd(raw, file);
    return [meta.tab, {
      tab: meta.tab,
      answer: meta.answer || '',
      related: (meta.related || '').split(',').map((s) => s.trim()).filter(Boolean),
      updated: meta.updated || '2026-10-23',
      html,
      toc,
      faq
    }];
  })
);
