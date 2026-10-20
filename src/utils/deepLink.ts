// Tiny one-shot hand-off so the search palette can open a specific tab or section
// on a screen that hasn't mounted yet.
let pendingTab: string | null = null;
let pendingScroll: string | null = null;

export const setPendingTab = (t: string) => { pendingTab = t; };
export const takePendingTab = () => { const t = pendingTab; pendingTab = null; return t; };

export const setPendingScroll = (id: string) => { pendingScroll = id; };
export const takePendingScroll = () => { const s = pendingScroll; pendingScroll = null; return s; };

export function scrollToId(id: string, tries = 20) {
  const el = document.getElementById(id);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top, behavior: 'smooth' });
  } else if (tries > 0) {
    setTimeout(() => scrollToId(id, tries - 1), 60);
  }
}
