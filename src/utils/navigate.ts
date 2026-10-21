// Client-side navigation to any path: pushes history and lets App react through its popstate handler.
export function navigateTo(path: string) {
  if (typeof window === 'undefined') return;
  const [p, hash] = path.split('#');
  if (window.location.pathname !== p) window.history.pushState({}, '', p || '/');
  window.dispatchEvent(new PopStateEvent('popstate'));
  if (hash) {
    setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 400);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/** Re-render when the URL path changes (back/forward or navigateTo). */
import { useEffect, useState } from 'react';
import { currentPath } from '../seo/ssr';
export function usePath() {
  const [path, setPath] = useState(currentPath());
  useEffect(() => {
    const on = () => setPath(window.location.pathname);
    window.addEventListener('popstate', on);
    return () => window.removeEventListener('popstate', on);
  }, []);
  return path;
}
