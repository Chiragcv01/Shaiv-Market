// GA4 events (gtag is loaded in index.html). Safe to call during prerender or with an ad blocker.
export function track(event: string, params: Record<string, string | number> = {}) {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  try {
    gtag?.('event', event, params);
  } catch {}
}

const WA_NUMBER = '919950653247';

/** WhatsApp link that carries a calculator result to Chirag, as plan section 12 expects. */
export function resultWhatsAppLink(calc: string, result: string) {
  const text = `Hi Chirag, my ${calc} result from shaivmarket.com: ${result}. I'd like to know how to set this up.`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}
