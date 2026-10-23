import React, { useEffect } from 'react';
import { CALC_ROUTES, SITE_URL, pathForScreen } from '../seo/routes';
import { CalculatorById } from './CalculatorsScreen';
import { ActiveScreen } from '../types';

/** Bare calculator for other websites to show in an iframe (/embed/<slug>). Not indexed. */
export const EmbedView: React.FC<{ slug: string }> = ({ slug }) => {
  const c = CALC_ROUTES.find((x) => x.slug === slug);
  const open = (path: string) => window.open(`${SITE_URL}${path}?utm_source=embed&utm_medium=calculator&utm_campaign=${slug}`, '_blank', 'noopener');

  useEffect(() => {
    document.title = c ? `${c.name} | Shaiv Market` : 'Calculator | Shaiv Market';
    let m = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!m) { m = document.createElement('meta'); m.name = 'robots'; document.head.appendChild(m); }
    m.content = 'noindex, follow';

    // every in-site link opens the full site in a new tab instead of navigating inside the frame
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a');
      const href = a?.getAttribute('href');
      if (a && href && href.startsWith('/')) { e.preventDefault(); e.stopPropagation(); open(href); }
    };
    document.addEventListener('click', onClick, true);

    // tell the host page our height so its iframe can fit the calculator
    const post = () => window.parent?.postMessage({ smHeight: document.documentElement.scrollHeight, smSlug: slug }, '*');
    const ro = new ResizeObserver(post);
    ro.observe(document.body);
    post();
    return () => { document.removeEventListener('click', onClick, true); ro.disconnect(); };
  }, [slug, c]);

  if (!c) {
    return (
      <p className="p-6 text-sm text-[#43566B]">
        This calculator was not found. See all calculators at{' '}
        <a href={`${SITE_URL}/calculators`} target="_blank" rel="noopener" className="text-[#8A6420] underline">shaivmarket.com/calculators</a>.
      </p>
    );
  }

  const onNavigate = (s: ActiveScreen) => open(pathForScreen(s));

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-[#13263B] p-3 sm:p-5 font-sans">
      <div className="flex items-center justify-between gap-3 mb-4">
        <p className="font-display text-xl sm:text-2xl font-semibold text-[#0F2740]">{c.name}</p>
        <a href={`/calculators/${c.slug}`} className="shrink-0 inline-flex items-center gap-2 text-xs text-[#43566B] hover:text-[#0F2740]">
          <img src="/images/logo-mark.png" alt="" className="w-6 h-6 rounded-full bg-white" />
          <span>by <strong className="text-[#0F2740]">Shaiv Market</strong></span>
        </a>
      </div>
      <CalculatorById tab={c.tab} onNavigate={onNavigate} />
      <p className="mt-4 text-[11px] text-[#6B7C8F] leading-relaxed">
        Calculator by <a href="/about" className="underline">Chirag Sharma</a>, AMFI registered mutual fund distributor (ARN-337289), Jaipur.
        Results are illustrations at assumed rates, not guarantees. Mutual fund investments are subject to market risks, read all scheme related documents carefully.
      </p>
    </div>
  );
};
