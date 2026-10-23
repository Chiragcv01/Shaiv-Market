import { marked } from 'marked';

export interface Faq { q: string; a: string }
export interface ParsedMd {
  meta: Record<string, string>;
  html: string;
  toc: { id: string; text: string }[];
  faq: Faq[];
  words: number;
}

const slugify = (t: string) => t.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z#0-9]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Markdown with a front matter block. A "## Questions people ask" section's ### headings become the FAQ. */
export function parseMd(raw: string, file: string): ParsedMd {
  const m = raw.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`Missing front matter in ${file}`);
  const meta: Record<string, string> = {};
  m[1].split('\n').forEach((line) => {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"|"$/g, '').replace(/\\"/g, '"');
  });
  const body = m[2].trim();

  const faq: Faq[] = [];
  const faqStart = body.search(/^## Questions people ask/m);
  if (faqStart >= 0) {
    body.slice(faqStart).split(/^### /m).slice(1).forEach((chunk) => {
      const [q, ...rest] = chunk.split('\n');
      const a = rest.join('\n').trim().replace(/\s+/g, ' ').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1');
      if (q.trim() && a) faq.push({ q: q.trim(), a });
    });
  }

  const toc: { id: string; text: string }[] = [];
  const words = body.replace(/[#>*|`-]/g, ' ').split(/\s+/).filter(Boolean).length;
  const html = (marked.parse(body, { async: false, gfm: true }) as string)
    .replace(/<h2>(.*?)<\/h2>/g, (_, t: string) => {
      const id = slugify(t);
      toc.push({ id, text: t.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'") });
      return `<h2 id="${id}">${t}</h2>`;
    })
    .replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, '</table></div>')
    .replace(/<a href="(https?:\/\/(?!shaivmarket\.com)[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');

  return { meta, html, toc, faq, words };
}
