import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, animate } from 'motion/react';
import { ShieldCheck, TrendingUp } from 'lucide-react';

/**
 * Animated illustration of SIP compounding (replaces stock hero photo).
 * Illustrative only — assumed return, not a promise.
 */
const MONTHLY = 10000;
const YEARS = 20;
const RATE = 0.12;

function buildSeries() {
  const r = RATE / 12;
  const pts: { year: number; invested: number; value: number }[] = [{ year: 0, invested: 0, value: 0 }];
  let value = 0;
  for (let m = 1; m <= YEARS * 12; m++) {
    value = (value + MONTHLY) * (1 + r);
    if (m % 12 === 0) pts.push({ year: m / 12, invested: MONTHLY * m, value });
  }
  return pts;
}

const formatLakh = (n: number) => `₹${(n / 100000).toFixed(1)} L`;

export const HeroGrowthChart: React.FC<{ arn?: string }> = ({ arn }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const series = useMemo(buildSeries, []);
  const final = series[series.length - 1];
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const c = animate(0, final.value, { duration: 2.4, ease: 'easeOut', onUpdate: (v) => setShown(v) });
    return () => c.stop();
  }, [inView, final.value]);

  // chart geometry
  const W = 520, H = 300, padL = 8, padR = 8, padT = 20, padB = 28;
  const maxV = final.value * 1.05;
  const x = (yr: number) => padL + (yr / YEARS) * (W - padL - padR);
  const y = (v: number) => padT + (1 - v / maxV) * (H - padT - padB);
  const line = (key: 'invested' | 'value') => series.map((p, i) => `${i ? 'L' : 'M'}${x(p.year).toFixed(1)},${y(p[key]).toFixed(1)}`).join(' ');
  const area = (key: 'invested' | 'value') => `${line(key)} L${x(YEARS)},${y(0)} L${x(0)},${y(0)} Z`;

  return (
    <div ref={ref} className="relative w-full h-full flex flex-col bg-gradient-to-br from-[#003461] via-[#00447c] to-[#002848] text-white p-5 sm:p-7 overflow-hidden">
      {/* soft animated glow */}
      <motion.div
        aria-hidden
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#96f6bd]/20 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#96f6bd]">Power of a ₹10,000 monthly SIP</p>
          <motion.p
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 tabular-nums"
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            {formatLakh(shown)}
          </motion.p>
          <p className="text-xs text-white/70 mt-1">
            after {YEARS} years · invested {formatLakh(final.invested)}
          </p>
        </div>
        <div className="shrink-0 w-10 h-10 rounded-full bg-[#96f6bd] text-[#003461] flex items-center justify-center shadow-md">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>

      <div className="relative flex-1 min-h-0 mt-4">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-full" role="img" aria-label="Illustrative SIP growth chart">
          <defs>
            <linearGradient id="hg-value" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#96f6bd" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#96f6bd" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="hg-inv" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <clipPath id="hg-reveal">
              <motion.rect x="0" y="0" height={H} initial={{ width: 0 }} animate={inView ? { width: W } : {}} transition={{ duration: 2.4, ease: 'easeOut' }} />
            </clipPath>
          </defs>

          {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} x1={padL} x2={W - padR} y1={padT + f * (H - padT - padB)} y2={padT + f * (H - padT - padB)} stroke="#ffffff" strokeOpacity="0.08" />
          ))}

          <g clipPath="url(#hg-reveal)">
            <path d={area('value')} fill="url(#hg-value)" />
            <path d={area('invested')} fill="url(#hg-inv)" />
          </g>
          <motion.path d={line('invested')} fill="none" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="2" strokeDasharray="5 5"
            initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 2.4, ease: 'easeOut' }} />
          <motion.path d={line('value')} fill="none" stroke="#96f6bd" strokeWidth="3" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 2.4, ease: 'easeOut' }} />
          <motion.circle cx={x(YEARS)} cy={y(final.value)} r="6" fill="#96f6bd"
            initial={{ scale: 0 }} animate={inView ? { scale: [0, 1.4, 1] } : {}} transition={{ delay: 2.3, duration: 0.6 }} />

          {[0, 5, 10, 15, 20].map((yr) => (
            <text key={yr} x={x(yr)} y={H - 6} fill="#ffffff" fillOpacity="0.55" fontSize="12" textAnchor={yr === 0 ? 'start' : yr === YEARS ? 'end' : 'middle'}>
              {yr === 0 ? 'Start' : `${yr}Y`}
            </text>
          ))}
        </svg>
      </div>

      <div className="relative flex flex-wrap items-center justify-between gap-2 mt-3">
        <div className="flex items-center gap-4 text-[11px] text-white/80">
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#96f6bd] rounded" />Portfolio value</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 border-t-2 border-dashed border-white/70" />Amount invested</span>
        </div>
        {arn && (
          <span className="flex items-center gap-1 text-[11px] font-bold bg-white/10 border border-white/20 rounded-md px-2 py-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#96f6bd]" /> AMFI Registered MFD · {arn}
          </span>
        )}
      </div>
      <p className="relative text-[10px] text-white/50 mt-2 leading-snug">
        Illustration at an assumed 12% p.a. return. Actual returns vary and are not guaranteed. Mutual fund investments are subject to market risks.
      </p>
    </div>
  );
};
