import React, { useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion
} from 'motion/react';
import { requiredMonthlySip, formatINRShort } from '../../utils/money';

interface Goal {
  years: number;
  title: string;
  detail: string;
  target: number;
  rate: number;
  fundHint: string;
}

const GOALS: Goal[] = [
  {
    years: 2,
    title: 'Emergency fund',
    detail: 'Six months of household expenses, parked where you can reach it within days.',
    target: 300000,
    rate: 0.065,
    fundHint: 'Liquid and short-duration debt funds'
  },
  {
    years: 7,
    title: 'Home down payment',
    detail: 'The 20% a bank expects you to bring before it lends the rest.',
    target: 2000000,
    rate: 0.1,
    fundHint: 'Hybrid and large-cap funds'
  },
  {
    years: 12,
    title: "Your child's higher education",
    detail: 'College fees rise faster than most prices. Starting early keeps the monthly amount small.',
    target: 2500000,
    rate: 0.12,
    fundHint: 'Flexi-cap and multi-cap funds'
  },
  {
    years: 25,
    title: 'Retirement',
    detail: 'A corpus that can pay you a monthly income once the salary stops.',
    target: 30000000,
    rate: 0.12,
    fundHint: 'Diversified equity, shifting to debt near the end'
  }
];

const HORIZON = 25;

export const GoalJourney: React.FC<{ onPlan: () => void }> = ({ onPlan }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 65%', 'end 65%'] });
  const stops = GOALS.map((g) => g.years / HORIZON);
  const fill = useTransform(scrollYProgress, [0, 0.2, 0.45, 0.7, 0.95], [0, stops[0], stops[1], stops[2], stops[3]]);
  const fillPct = useTransform(fill, (f) => `${f * 100}%`);
  const [active, setActive] = useState(0);

  useMotionValueEvent(fill, 'change', (f) => {
    let idx = 0;
    stops.forEach((s, i) => { if (f >= s - 0.005) idx = i; });
    setActive(idx);
  });

  const goal = GOALS[active];
  const sip = requiredMonthlySip(goal.target, goal.years, goal.rate);

  return (
    <section className="bg-[#EEF3F8] py-16 md:py-24" aria-labelledby="goal-journey-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="max-w-2xl mb-10 md:mb-14">
          <h2 id="goal-journey-heading" className="font-display text-3xl sm:text-[44px] leading-[1.1] font-semibold text-[#0F2740]">
            Every goal has a number. Here is what four common ones cost each month.
          </h2>
          <p className="mt-4 text-[#43566B] text-base sm:text-lg">
            Scroll through the years. Each goal shows the monthly SIP it needs, at a return suited to how far away it is.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Mobile: compact sticky progress bar */}
          <div className="lg:hidden sticky top-[var(--header-h,84px)] z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-[#0F2740] text-white shadow-lg">
            <div className="relative h-1.5 rounded-full bg-white/15">
              <motion.div className="absolute left-0 top-0 h-1.5 rounded-full bg-[#E3B65C]" style={{ width: fillPct }} />
              {GOALS.map((g, i) => (
                <span key={g.title} className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2
                  ${i <= active ? 'bg-[#E3B65C] border-[#E3B65C]' : 'bg-[#0F2740] border-white/40'}`}
                  style={{ left: `${(g.years / HORIZON) * 100}%` }} />
              ))}
            </div>
            <p className="mt-2 text-sm flex justify-between gap-3">
              <span className="text-white/75 truncate">{goal.title}, {goal.years}y</span>
              <span className="font-display font-semibold text-[#E3B65C] tabular-nums whitespace-nowrap">{formatINRShort(sip)}/month</span>
            </p>
          </div>

          {/* Desktop: sticky dial */}
          <div className="hidden lg:block lg:col-span-6 lg:order-2">
            <div className="lg:sticky lg:top-28 rounded-3xl bg-[#0F2740] text-white p-6 sm:p-8 overflow-hidden">
              {/* timeline */}
              <div className="relative h-14">
                <div className="absolute left-0 right-0 top-6 h-1.5 rounded-full bg-white/10" />
                <motion.div className="absolute left-0 top-6 h-1.5 rounded-full bg-[#E3B65C]" style={{ width: fillPct }} />
                {GOALS.map((g, i) => (
                  <div key={g.title} className="absolute top-0 -translate-x-1/2 flex flex-col items-center" style={{ left: `${(g.years / HORIZON) * 100}%` }}>
                    <span className={`text-[11px] mb-1 tabular-nums transition-colors ${i <= active ? 'text-[#E3B65C]' : 'text-white/45'}`}>{g.years}y</span>
                    <span className={`w-4 h-4 rounded-full border-2 transition-all duration-300
                      ${i < active ? 'bg-[#E3B65C] border-[#E3B65C]' : i === active ? 'bg-[#0F2740] border-[#E3B65C] scale-125' : 'bg-[#0F2740] border-white/30'}`} />
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={goal.title}
                  initial={reduced ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -14 }}
                  transition={{ duration: 0.28 }}
                  className="mt-8"
                >
                  <p className="text-[#9DB4CC] text-sm">{goal.title}, in {goal.years} years</p>
                  <p className="font-display text-[56px] sm:text-[72px] leading-none font-semibold tabular-nums mt-2">
                    {formatINRShort(sip)}
                    <span className="text-xl sm:text-2xl font-normal text-[#9DB4CC]"> / month</span>
                  </p>
                  <p className="mt-4 text-sm text-white/80">
                    to build <strong className="text-white">{formatINRShort(goal.target)}</strong>, assuming {(goal.rate * 100).toFixed(1).replace('.0', '')}% a year.
                  </p>
                  <p className="mt-1 text-sm text-[#E3B65C]">{goal.fundHint}</p>
                </motion.div>
              </AnimatePresence>

              <button onClick={onPlan}
                className="mt-8 rounded-xl bg-[#E3B65C] hover:bg-[#EDC77A] text-[#0F2740] font-semibold px-5 py-3 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                Plan my own goal
              </button>
              <p className="mt-4 text-[11px] text-white/45">Illustrative amounts and assumed returns. Not a promise of returns.</p>
            </div>
          </div>

          {/* Scrolling goal stories */}
          <div ref={listRef} className="lg:col-span-6 lg:order-1 space-y-6 lg:space-y-[28vh] lg:py-[8vh]">
            {GOALS.map((g, i) => (
              <article
                key={g.title}
                className={`rounded-2xl p-6 sm:p-7 transition-all duration-500
                  ${i === active ? 'bg-white shadow-[0_20px_50px_-25px_rgba(15,39,64,0.35)]' : 'bg-white/50'}`}
              >
                <p className="text-sm text-[#3F6E96] tabular-nums">In {g.years} years</p>
                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#0F2740] mt-1">{g.title}</h3>
                <p className="mt-2 text-[#43566B] leading-relaxed">{g.detail}</p>
                <p className="mt-4 text-sm text-[#0F2740]">
                  Target <strong>{formatINRShort(g.target)}</strong>, needs about{' '}
                  <strong>{formatINRShort(requiredMonthlySip(g.target, g.years, g.rate))} a month</strong>
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
