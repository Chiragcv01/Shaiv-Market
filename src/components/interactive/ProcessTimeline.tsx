import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';

const STEPS = [
  { title: 'A free 15-minute call', text: 'We talk about your goals, income, existing investments and what keeps you up at night about money.' },
  { title: 'Your risk profile and goal map', text: 'Each goal gets a target, a date and a monthly amount. You see the numbers before you commit to anything.' },
  { title: 'Paperless KYC and account', text: 'Aadhaar and PAN based KYC, done on your phone. Money goes straight from your bank to the fund house.' },
  { title: 'SIPs start, reviews every year', text: 'Your SIPs run on autopilot. Once a year, or whenever life changes, we review and rebalance together.' }
];

export const ProcessTimeline: React.FC<{ onBook: () => void }> = ({ onBook }) => {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 55%'] });
  const height = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const [reached, setReached] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (p) => setReached(Math.floor(p * STEPS.length + 0.2)));

  return (
    <section className="rounded-3xl bg-[#0F2740] text-white p-6 sm:p-10 lg:p-14" aria-labelledby="process-heading">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 lg:sticky lg:top-[calc(var(--header-h,80px)+24px)] self-start">
          <h2 id="process-heading" className="font-display text-3xl sm:text-[44px] leading-[1.08] font-semibold">
            How we work together, from first call to first SIP.
          </h2>
          <p className="mt-4 text-white/70">Most people go from hello to their first SIP within a week.</p>
          <button onClick={onBook}
            className="mt-6 rounded-xl bg-[#E3B65C] hover:bg-[#EDC77A] text-[#0F2740] font-semibold px-6 py-3.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            Start with step one
          </button>
        </div>

        <ol ref={ref} className="lg:col-span-7 relative pl-12 space-y-12">
          <span className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-white/10" aria-hidden />
          <motion.span className="absolute left-[15px] top-2 w-[2px] bg-[#E3B65C] origin-top" style={{ height }} aria-hidden />
          {STEPS.map((s, i) => {
            const on = i < reached;
            return (
              <li key={s.title} className="relative">
                <motion.span
                  className="absolute -left-12 top-0 w-8 h-8 rounded-full flex items-center justify-center font-display font-semibold text-sm"
                  animate={{ backgroundColor: on ? '#E3B65C' : '#14324F', color: on ? '#0F2740' : '#9DB4CC', scale: on ? 1.08 : 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {i + 1}
                </motion.span>
                <motion.div animate={{ opacity: on ? 1 : 0.45, x: on ? 0 : 6 }} transition={{ duration: 0.35 }}>
                  <h3 className="font-display text-2xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-white/75 leading-relaxed max-w-lg">{s.text}</p>
                </motion.div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};
