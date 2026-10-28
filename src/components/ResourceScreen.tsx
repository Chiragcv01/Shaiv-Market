import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, MessageCircle, ShieldCheck, Calculator } from 'lucide-react';
import { resourceBySlug, RESOURCES } from '../content/resources';
import { postBySlug } from '../content/blog';
import { CALC_ROUTES } from '../seo/routes';
import { useApp } from '../context/AppContext';
import { navigateTo, usePath } from '../utils/navigate';

const fmtDate = (iso: string) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

const go = (href: string) => (e: React.MouseEvent) => { e.preventDefault(); navigateTo(href); };

/** Internal links inside the article HTML navigate without a full reload. */
const interceptLinks = (e: React.MouseEvent) => {
  const a = (e.target as HTMLElement).closest('a');
  const href = a?.getAttribute('href');
  if (!a || !href || !href.startsWith('/') || a.target === '_blank' || e.metaKey || e.ctrlKey) return;
  e.preventDefault();
  navigateTo(href);
};

const POPULAR = ['sip-compounder', 'required-sip', 'step-up-sip', 'lumpsum', 'retirement', 'swp'];

export const ResourceScreen: React.FC = () => {
  const path = usePath();
  const r = resourceBySlug(path.replace(/^\/|\/$/g, '').toLowerCase()) || RESOURCES[0];
  const { siteSettings } = useApp();
  const [active, setActive] = useState(r.toc[0]?.id);
  const bodyRef = useRef<HTMLDivElement>(null);
  const related = r.related.map((s) => postBySlug(s)).filter(Boolean);
  const others = RESOURCES.filter((x) => x.slug !== r.slug);

  useEffect(() => {
    const heads = bodyRef.current?.querySelectorAll('h2[id]');
    if (!heads?.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: '-20% 0px -70% 0px' });
    heads.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [r.slug]);

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 md:py-14">
      <nav aria-label="Breadcrumb" className="text-sm text-[#6B7C8F] flex items-center gap-1 flex-wrap">
        <a href="/" onClick={go('/')} className="hover:text-[#0F2740]">Home</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#43566B]">{r.h1}</span>
      </nav>

      <header className="max-w-3xl mt-5">
        <h1 className="font-display text-[34px] sm:text-5xl font-semibold text-[#0F2740] leading-[1.08]">{r.h1}</h1>
        <div className="mt-5 flex items-center gap-3">
          {siteSettings.founderPhotoUrl && <img src={siteSettings.founderPhotoUrl} alt="Chirag Sharma" className="w-11 h-11 rounded-full object-cover ring-2 ring-[#E3B65C]" />}
          <div className="text-sm">
            <p className="text-[#0F2740] font-semibold">Chirag Sharma <span className="font-normal text-[#6B7C8F]">AMFI registered MFD, ARN-337289</span></p>
            <p className="text-[#6B7C8F]">Updated {fmtDate(r.updated)}</p>
          </div>
        </div>
      </header>

      <div className="mt-10 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 min-w-0">
          {r.answer && (
            <aside className="rounded-2xl bg-[#0F2740] text-white p-6 sm:p-7 mb-10">
              <p className="text-sm font-semibold text-[#E3B65C]">The short answer</p>
              <p className="mt-2 text-lg leading-relaxed text-white/90">{r.answer}</p>
            </aside>
          )}
          <div ref={bodyRef} className="blog-body" onClick={interceptLinks} dangerouslySetInnerHTML={{ __html: r.html }} />

          <div className="mt-12 rounded-3xl bg-[#FBF6EA] ring-1 ring-[#F3D58E] p-6 sm:p-8">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#0F2740]">Want this worked out for your own numbers?</h2>
            <p className="mt-2 text-[#43566B]">A free 30-minute call with Chirag. Bring your current investments; leave with a plan.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="/book-free-consultation" onClick={go('/book-free-consultation')} className="rounded-xl bg-[#0F2740] hover:bg-[#1D4268] text-white font-semibold px-5 py-3">Book a free call</a>
              <a href={`https://wa.me/919950653247?text=${encodeURIComponent(`Hi Chirag, I was reading the ${r.h1} on your website and have a question.`)}`} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold px-5 py-3">
                <MessageCircle className="w-4 h-4" /> Ask on WhatsApp
              </a>
            </div>
          </div>

          <div className="mt-8 flex items-start gap-4 rounded-2xl ring-1 ring-[#D3DCE6] bg-white p-5">
            {siteSettings.founderPhotoUrl && <img src={siteSettings.founderPhotoUrl} alt="" className="w-16 h-16 rounded-2xl object-cover" />}
            <div>
              <p className="font-display text-lg font-semibold text-[#0F2740]">About the author</p>
              <p className="text-sm text-[#43566B] mt-1">
                Chirag Sharma is an AMFI registered mutual fund distributor (ARN-337289, EUIN E641362) and NISM Series V-A certified, based at Bhamashah Techno Hub, Jhalana Doongari, Jaipur.
              </p>
              <a href="/about" onClick={go('/about')} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#8A6420] hover:underline">
                <ShieldCheck className="w-4 h-4" /> See credentials
              </a>
            </div>
          </div>

          <p className="mt-6 text-xs text-[#6B7C8F] leading-relaxed">
            Mutual fund investments are subject to market risks, read all scheme related documents carefully. Figures are illustrations at assumed returns and are not guaranteed. Shaiv Market is an AMFI registered mutual fund distributor, not a SEBI registered investment adviser.
          </p>
        </div>

        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h,80px)+24px)] space-y-6 transition-[top] duration-300">
            {r.toc.length > 2 && (
              <nav aria-label="On this page" className="rounded-2xl bg-white ring-1 ring-[#D3DCE6] p-5 hidden lg:block">
                <p className="text-sm font-semibold text-[#0F2740] mb-3">On this page</p>
                <ul className="space-y-1">
                  {r.toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(t.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                        className={`relative block pl-4 py-1.5 text-sm transition-colors ${active === t.id ? 'text-[#0F2740] font-medium' : 'text-[#6B7C8F] hover:text-[#0F2740]'}`}>
                        {active === t.id && <motion.span layoutId="res-toc-dot" className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 rounded-full bg-[#E3B65C]" />}
                        {t.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            <div className="rounded-2xl bg-white ring-1 ring-[#D3DCE6] p-5">
              <p className="text-sm font-semibold text-[#0F2740] mb-3 inline-flex items-center gap-2"><Calculator className="w-4 h-4 text-[#8A6420]" /> Free calculators</p>
              <ul className="space-y-2 text-sm">
                {POPULAR.map((tab) => CALC_ROUTES.find((c) => c.tab === tab)).filter(Boolean).map((c) => (
                  <li key={c!.slug}><a href={`/calculators/${c!.slug}`} onClick={go(`/calculators/${c!.slug}`)} className="text-[#43566B] hover:text-[#0F2740] hover:underline">{c!.name}</a></li>
                ))}
                <li><a href="/calculators" onClick={go('/calculators')} className="font-semibold text-[#8A6420] hover:underline">All {CALC_ROUTES.length} calculators</a></li>
              </ul>
            </div>
            {(related.length > 0 || others.length > 0) && (
              <div className="rounded-2xl bg-white ring-1 ring-[#D3DCE6] p-5">
                <p className="text-sm font-semibold text-[#0F2740] mb-3">Read next</p>
                <ul className="space-y-2 text-sm">
                  {related.map((p) => (
                    <li key={p!.slug}><a href={`/blog/${p!.slug}`} onClick={go(`/blog/${p!.slug}`)} className="text-[#43566B] hover:text-[#0F2740] hover:underline">{p!.title}</a></li>
                  ))}
                  {others.map((o) => (
                    <li key={o.slug}><a href={`/${o.slug}`} onClick={go(`/${o.slug}`)} className="text-[#43566B] hover:text-[#0F2740] hover:underline">{o.h1}</a></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
};
