import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Target, Calculator, TrendingUp, Coins, Flag, Armchair, Wallet, Flame, Hourglass, ShoppingBasket,
  Activity, Landmark, Receipt, Scale, ShieldCheck, ArrowRight, ChevronRight, BookOpen, MessageCircle
} from 'lucide-react';
import { takePendingTab } from '../utils/deepLink';
import { usePath, navigateTo } from '../utils/navigate';
import { routeForPath, CALC_ROUTES, CALC_GROUPS, CalcRoute } from '../seo/routes';
import { CALC_FAQ } from '../seo/faq';
import { CALC_GUIDES } from '../content/calculators';
import { postBySlug } from '../content/blog';
import { FaqSection } from './interactive/FaqSection';
import { ActiveScreen } from '../types';
import { RequiredSipCalculator } from './RequiredSipCalculator';
import { InvestmentCalculator } from './InvestmentCalculator';
import { GoalPlanner } from './GoalPlanner';
import { SwpCalculator } from './SwpCalculator';
import { LoanVsSipArbitrage } from './LoanVsSipArbitrage';
import { FireCalculator } from './FireCalculator';
import { EmergencyFundShield } from './EmergencyFundShield';
import { StepUpSipCalculator } from './calc/StepUpSipCalculator';
import { LumpsumCalculator } from './calc/LumpsumCalculator';
import { RetirementCalculator } from './calc/RetirementCalculator';
import { SipDelayCalculator } from './calc/SipDelayCalculator';
import { InflationCalculator } from './calc/InflationCalculator';
import { CagrCalculator } from './calc/CagrCalculator';
import { PpfCalculator } from './calc/PpfCalculator';
import { MfTaxCalculator } from './calc/MfTaxCalculator';
import { ShareEmbed } from './calc/ShareEmbed';

export const CALC_ICONS: Record<string, React.ElementType> = {
  'required-sip': Target, 'sip-compounder': Calculator, 'step-up-sip': TrendingUp, lumpsum: Coins, goal: Flag,
  retirement: Armchair, swp: Wallet, fire: Flame, 'sip-delay': Hourglass, inflation: ShoppingBasket, cagr: Activity,
  ppf: Landmark, 'mf-tax': Receipt, 'loan-sip': Scale, emergency: ShieldCheck
};

/** Renders one calculator by tab id. Shared with the embed page. */
export const CalculatorById: React.FC<{ tab: string; onNavigate: (s: ActiveScreen) => void }> = ({ tab, onNavigate }) => {
  switch (tab) {
    case 'required-sip': return <RequiredSipCalculator onNavigate={onNavigate} onStartSip={() => onNavigate('open-account')} />;
    case 'sip-compounder': return <InvestmentCalculator onNavigate={onNavigate} onInvestNow={() => onNavigate('open-account')} />;
    case 'goal': return <GoalPlanner onNavigate={onNavigate} onPlanGoal={() => onNavigate('open-account')} />;
    case 'swp': return <SwpCalculator onNavigate={onNavigate} />;
    case 'loan-sip': return <LoanVsSipArbitrage onNavigate={onNavigate} />;
    case 'fire': return <FireCalculator onNavigate={onNavigate} />;
    case 'emergency': return <EmergencyFundShield onNavigate={onNavigate} />;
    case 'step-up-sip': return <StepUpSipCalculator />;
    case 'lumpsum': return <LumpsumCalculator />;
    case 'retirement': return <RetirementCalculator />;
    case 'sip-delay': return <SipDelayCalculator />;
    case 'inflation': return <InflationCalculator />;
    case 'cagr': return <CagrCalculator />;
    case 'ppf': return <PpfCalculator />;
    case 'mf-tax': return <MfTaxCalculator />;
    default: return null;
  }
};

const calcPath = (c: CalcRoute) => `/calculators/${c.slug}`;

/** Switch calculator without jumping the page; App picks up the new URL through popstate. */
function switchTo(path: string) {
  if (window.location.pathname !== path) window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

const linkClick = (path: string, scroll = true) => (e: React.MouseEvent) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // let new-tab clicks through
  e.preventDefault();
  if (scroll) navigateTo(path); else switchTo(path);
};

const Breadcrumb: React.FC<{ current?: CalcRoute }> = ({ current }) => (
  <nav aria-label="Breadcrumb" className="text-sm text-[#6B7C8F] flex items-center gap-1 flex-wrap mb-5">
    <a href="/" onClick={linkClick('/')} className="hover:text-[#0F2740]">Home</a>
    <ChevronRight className="w-3.5 h-3.5" />
    {current ? (
      <>
        <a href="/calculators" onClick={linkClick('/calculators')} className="hover:text-[#0F2740]">Calculators</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#43566B]">{current.name}</span>
      </>
    ) : <span className="text-[#43566B]">Calculators</span>}
  </nav>
);

const CalcCard: React.FC<{ c: CalcRoute; i: number }> = ({ c, i }) => {
  const Icon = CALC_ICONS[c.tab] || Calculator;
  return (
    <motion.a
      href={calcPath(c)} onClick={linkClick(calcPath(c))}
      initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: Math.min(i, 6) * 0.04, type: 'spring', stiffness: 260, damping: 24 }}
      whileHover={{ y: -4 }}
      className="group relative flex items-start gap-4 rounded-2xl bg-white ring-1 ring-[#D3DCE6] hover:ring-[#0F2740] p-5 transition-shadow hover:shadow-[0_18px_40px_-20px_rgba(15,39,64,0.35)]"
    >
      <span className="w-11 h-11 shrink-0 rounded-xl bg-[#EEF3F8] group-hover:bg-[#0F2740] text-[#0F2740] group-hover:text-[#E3B65C] flex items-center justify-center transition-colors">
        <Icon className="w-5 h-5" />
      </span>
      <span className="min-w-0">
        <span className="block font-display text-lg font-semibold text-[#0F2740] leading-snug">{c.name}</span>
        <span className="block mt-1 text-sm text-[#43566B]">{c.blurb}</span>
      </span>
      <ArrowRight className="absolute right-4 top-5 w-4 h-4 text-[#9AA8B7] group-hover:text-[#8A6420] group-hover:translate-x-0.5 transition-all" />
    </motion.a>
  );
};

const AllCalculators: React.FC<{ exclude?: string; heading: string; level?: 'h2' | 'h3' }> = ({ exclude, heading }) => (
  <section aria-labelledby="all-calcs-heading" className="mt-16">
    <h2 id="all-calcs-heading" className="font-display text-3xl sm:text-4xl font-semibold text-[#0F2740]">{heading}</h2>
    <div className="mt-8 space-y-10">
      {CALC_GROUPS.map((g) => {
        const list = CALC_ROUTES.filter((c) => c.group === g && c.tab !== exclude);
        if (!list.length) return null;
        return (
          <div key={g}>
            <h3 className="text-sm font-semibold text-[#8A6420] mb-3">{g}</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map((c, i) => <CalcCard key={c.tab} c={c} i={i} />)}
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

const Disclaimer = () => (
  <p className="mt-12 text-xs text-[#6B7C8F] leading-relaxed max-w-4xl">
    Calculator results are illustrations based on the returns and rates you enter. They are not guaranteed and are not investment advice.
    Mutual fund investments are subject to market risks, read all scheme related documents carefully. Shaiv Market is an AMFI registered
    mutual fund distributor (ARN-337289), not a SEBI registered investment adviser.
  </p>
);

const Hub: React.FC = () => {
  const guide = CALC_GUIDES.hub;
  return (
    <>
      <Breadcrumb />
      <header className="max-w-3xl">
        <h1 className="font-display text-4xl sm:text-6xl font-semibold text-[#0F2740] leading-[1.03]">Free mutual fund calculators</h1>
        <p className="mt-4 text-lg text-[#43566B] leading-relaxed">
          {guide?.answer || `${CALC_ROUTES.length} calculators for SIPs, goals, retirement, tax and loans.`}
        </p>
      </header>
      <AllCalculators heading="Pick a question" />
      {guide && (
        <div className="mt-16 grid lg:grid-cols-12 gap-10">
          <article className="lg:col-span-8 blog-body" dangerouslySetInnerHTML={{ __html: guide.html }} />
        </div>
      )}
      {CALC_FAQ.hub?.length > 0 && <FaqSection compact id="calc-faq" items={CALC_FAQ.hub} title="Questions about these calculators" />}
      <Disclaimer />
    </>
  );
};

const CalcPage: React.FC<{ c: CalcRoute; onNavigate: (s: ActiveScreen) => void }> = ({ c, onNavigate }) => {
  const guide = CALC_GUIDES[c.tab];
  const stripRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const strip = stripRef.current;
    const el = strip?.querySelector('[aria-current="page"]') as HTMLElement | null;
    if (!el || !strip) return;
    const left = el.getBoundingClientRect().left - strip.getBoundingClientRect().left + strip.scrollLeft;
    const target = left - (strip.clientWidth - el.offsetWidth) / 2; // centre the active calculator
    strip.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, [c.tab]);

  // links inside the guide stay in the app
  const onGuideClick = (e: React.MouseEvent) => {
    const a = (e.target as HTMLElement).closest('a');
    const href = a?.getAttribute('href');
    if (a && href && href.startsWith('/') && !e.metaKey && !e.ctrlKey) { e.preventDefault(); navigateTo(href); }
  };
  const related = (guide?.related || []).map(postBySlug).filter(Boolean);
  const updated = guide?.updated ? new Date(guide.updated).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  return (
    <>
      <Breadcrumb current={c} />
      <header className="max-w-3xl">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#0F2740] leading-[1.05]">{c.name}</h1>
        {guide?.answer && <p className="mt-3 text-base sm:text-lg text-[#43566B] leading-relaxed">{guide.answer}</p>}
        <p className="mt-3 text-sm text-[#6B7C8F] flex items-center gap-2">
          <img src="/images/chirag-sharma.jpg" alt="" className="w-6 h-6 rounded-full object-cover" />
          <span>By <a href="/about" onClick={linkClick('/about')} className="text-[#0F2740] font-medium hover:underline">Chirag Sharma</a>, AMFI registered MFD{updated && <> · Updated {updated}</>}</span>
        </p>
      </header>

      {/* every calculator, as real links */}
      <nav aria-label="Calculators" className="mt-7 mb-8 -mx-4 sm:mx-0">
        <div ref={stripRef} className="flex gap-1.5 overflow-x-auto scrollbar-none p-1.5 mx-4 sm:mx-0 rounded-2xl bg-[#EEF3F8]">
          {CALC_ROUTES.map((t) => {
            const Icon = CALC_ICONS[t.tab] || Calculator;
            const active = t.tab === c.tab;
            return (
              <a key={t.tab} href={calcPath(t)} onClick={linkClick(calcPath(t), false)} aria-current={active ? 'page' : undefined}
                className={`relative px-3.5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-[#E3B65C] ${active ? 'text-white' : 'text-[#43566B] hover:text-[#0F2740]'}`}>
                {active && <motion.span layoutId="calc-tab" className="absolute inset-0 rounded-xl bg-[#0F2740] shadow-md" transition={{ type: 'spring', stiffness: 450, damping: 35 }} />}
                <Icon className={`relative w-4 h-4 ${active ? 'text-[#E3B65C]' : 'text-[#6B7C8F]'}`} />
                <span className="relative whitespace-nowrap">{t.short}</span>
              </a>
            );
          })}
        </div>
      </nav>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={c.tab} initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }} transition={{ duration: 0.25 }}>
          <CalculatorById tab={c.tab} onNavigate={onNavigate} />
        </motion.div>
      </AnimatePresence>
      <ShareEmbed c={c} />

      {guide && (
        <div className="mt-16 grid lg:grid-cols-12 gap-10">
          <article className="lg:col-span-8 min-w-0 blog-body" onClick={onGuideClick} dangerouslySetInnerHTML={{ __html: guide.html }} />
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-h,80px)+24px)] space-y-5 transition-[top] duration-300">
              {guide.toc.length > 2 && (
                <nav aria-label="On this page" className="hidden lg:block rounded-2xl bg-white ring-1 ring-[#D3DCE6] p-5">
                  <p className="text-sm font-semibold text-[#0F2740] mb-2">On this page</p>
                  <ul className="space-y-1">
                    {guide.toc.map((t) => (
                      <li key={t.id}><a href={`#${t.id}`} className="block py-1 text-sm text-[#6B7C8F] hover:text-[#0F2740]">{t.text}</a></li>
                    ))}
                  </ul>
                </nav>
              )}
              {related.length > 0 && (
                <div className="rounded-2xl bg-white ring-1 ring-[#D3DCE6] p-5">
                  <p className="text-sm font-semibold text-[#0F2740] mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4 text-[#8A6420]" /> Read next</p>
                  <ul className="space-y-3">
                    {related.map((p) => (
                      <li key={p!.slug}>
                        <a href={`/blog/${p!.slug}`} onClick={linkClick(`/blog/${p!.slug}`)} className="text-sm text-[#0F2740] font-medium hover:underline decoration-[#E3B65C] decoration-2 underline-offset-4">{p!.title}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="rounded-2xl bg-[#0F2740] text-white p-5">
                <p className="font-display text-xl font-semibold">Want a second pair of eyes on your numbers?</p>
                <p className="mt-1 text-sm text-white/75">A free 30-minute call with Chirag Sharma, AMFI registered MFD in Jaipur.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a href="/book-free-consultation" onClick={linkClick('/book-free-consultation')} className="inline-flex items-center gap-1.5 rounded-xl bg-[#E3B65C] text-[#0F2740] text-sm font-semibold px-4 py-2.5">Book a call <ArrowRight className="w-4 h-4" /></a>
                  <a href={`https://wa.me/919950653247?text=${encodeURIComponent(`Hi Chirag, I was using the ${c.name} on shaivmarket.com and have a question.`)}`} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl ring-1 ring-white/30 text-sm font-semibold px-4 py-2.5"><MessageCircle className="w-4 h-4 text-[#25D366]" /> WhatsApp</a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {CALC_FAQ[c.tab]?.length > 0 && (
        <FaqSection compact id="calc-faq" items={CALC_FAQ[c.tab]} title={`${c.name}: questions people ask`} />
      )}

      <AllCalculators exclude={c.tab} heading="More free calculators" />
      <Disclaimer />
    </>
  );
};

interface CalculatorsScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const CalculatorsScreen: React.FC<CalculatorsScreenProps> = ({ onNavigate }) => {
  const path = usePath();
  const route = routeForPath(path);
  const current = route.screen === 'calculators' && route.tab ? CALC_ROUTES.find((c) => c.tab === route.tab) : undefined;

  // a calculator asked for from elsewhere (search palette, older buttons) while on /calculators
  useEffect(() => {
    const t = takePendingTab();
    if (t && !current) {
      const c = CALC_ROUTES.find((x) => x.tab === t);
      if (c) { window.history.replaceState({}, '', calcPath(c)); window.dispatchEvent(new PopStateEvent('popstate')); }
    }
  }, [path, current]);

  return (
    <div id="calculators-screen" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 md:py-14">
      {current ? <CalcPage c={current} onNavigate={onNavigate} /> : <Hub />}
    </div>
  );
};
