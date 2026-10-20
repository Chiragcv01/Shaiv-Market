import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  MotionValue
} from 'motion/react';
import { ShieldCheck, MoveHorizontal } from 'lucide-react';
import { ScrubNumber, amountStep, unitStep } from './ScrubNumber';
import { sipFutureValue, formatINRShort } from '../../utils/money';

const DELAY_YEARS = 5;
const SAMPLES = 60;

// chart geometry (viewBox units)
const W = 640, H = 320, PAD_L = 4, PAD_R = 4, PAD_T = 18, PAD_B = 4;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;

interface Params { m: number; y: number; r: number; d: number }

function series({ m, y, r, d }: Params) {
  const delay = DELAY_YEARS * d;
  const top = sipFutureValue(m, y, r) * 1.12 || 1;
  const pts: { x: number; wealth: number; invested: number; late: number }[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const t = (i / SAMPLES) * y;
    pts.push({
      x: PAD_L + (i / SAMPLES) * PLOT_W,
      wealth: sipFutureValue(m, t, r),
      invested: m * 12 * t,
      late: t <= delay ? 0 : sipFutureValue(m, t - delay, r)
    });
  }
  const Y = (v: number) => PAD_T + (1 - v / top) * PLOT_H;
  const line = (k: 'wealth' | 'invested' | 'late') =>
    pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${Y(p[k]).toFixed(1)}`).join('');
  const base = `L${(PAD_L + PLOT_W).toFixed(1)},${Y(0).toFixed(1)}L${PAD_L},${Y(0).toFixed(1)}Z`;
  const gap =
    line('wealth') +
    [...pts].reverse().map((p) => `L${p.x.toFixed(1)},${Y(p.late).toFixed(1)}`).join('') +
    'Z';
  const last = pts[pts.length - 1];
  return {
    wealthLine: line('wealth'),
    wealthArea: line('wealth') + base,
    investedArea: line('invested') + base,
    investedLine: line('invested'),
    lateLine: line('late'),
    gap,
    endY: Y(last.wealth),
    lateEndY: Y(last.late),
    Y
  };
}

const useParam = (target: number, reduced: boolean) => {
  const mv = useMotionValue<number>(target);
  const spring = useSpring(mv, reduced ? { duration: 0 } : { stiffness: 140, damping: 22, mass: 0.6 });
  useEffect(() => { mv.set(target); }, [target, mv]);
  return spring;
};

const Money: React.FC<{ v: MotionValue<number> }> = ({ v }) => {
  const text = useTransform(v, (n: number) => formatINRShort(n));
  return <motion.span>{text}</motion.span>;
};

export const CompoundingPlayground: React.FC<{
  arn: string;
  onBook: () => void;
  onPlan: () => void;
}> = ({ arn, onBook, onPlan }) => {
  const reduced = !!useReducedMotion();
  const [monthly, setMonthly] = useState(10000);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(12);
  const [late, setLate] = useState(false);
  const [touched, setTouched] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const sM = useParam(monthly, reduced);
  const sY = useParam(years, reduced);
  const sR = useParam(rate / 100, reduced);
  const sD = useParam(late ? 1 : 0, reduced);

  const geo = useTransform([sM, sY, sR, sD], ([m, y, r, d]: number[]) => series({ m, y, r, d }));
  const wealthLine = useTransform(geo, (g) => g.wealthLine);
  const wealthArea = useTransform(geo, (g) => g.wealthArea);
  const investedArea = useTransform(geo, (g) => g.investedArea);
  const investedLine = useTransform(geo, (g) => g.investedLine);
  const lateLine = useTransform(geo, (g) => g.lateLine);
  const gap = useTransform(geo, (g) => g.gap);
  const endY = useTransform(geo, (g) => g.endY);
  const endTop = useTransform(endY, (v) => `${(v / H) * 100}%`);

  const final = useTransform([sM, sY, sR], ([m, y, r]: number[]) => sipFutureValue(m, y, r));
  const invested = useTransform([sM, sY], ([m, y]: number[]) => m * 12 * y);
  const growth = useTransform([final, invested], ([f, i]: number[]) => f - i);
  const lateFinal = useTransform([sM, sY, sR, sD], ([m, y, r, d]: number[]) => sipFutureValue(m, y - DELAY_YEARS * d, r));
  const lost = useTransform([final, lateFinal], ([f, l]: number[]) => f - l);
  const multiple = useTransform([final, invested], ([f, i]: number[]) => (i ? `${(f / i).toFixed(1)}×` : '–'));
  // the big number literally widens as it grows (Anek Latin width axis)
  const wdth = useTransform(final, (v) => {
    const t = Math.min(1, Math.max(0, (Math.log10(Math.max(v, 1)) - 5) / 3));
    return `'wdth' ${Math.round(78 + t * 42)}`;
  });

  // hover read-out uses exact (non-animated) values
  const readout = useMemo(() => {
    if (hover === null) return null;
    const t = hover * years;
    const g = series({ m: monthly, y: years, r: rate / 100, d: late ? 1 : 0 });
    const w = sipFutureValue(monthly, t, rate / 100);
    return {
      t,
      x: PAD_L + hover * PLOT_W,
      y: g.Y(w),
      wealth: w,
      invested: monthly * 12 * t,
      late: late ? (t <= DELAY_YEARS ? 0 : sipFutureValue(monthly, t - DELAY_YEARS, rate / 100)) : null
    };
  }, [hover, monthly, years, rate, late]);

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const box = svgRef.current?.getBoundingClientRect();
    if (!box) return;
    const f = ((e.clientX - box.left) / box.width * W - PAD_L) / PLOT_W;
    setHover(Math.min(1, Math.max(0, f)));
  };

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => ({ f, label: f === 0 ? 'Today' : `${Math.round(years * f)} yr` }));
  const firstUse = () => setTouched(true);

  return (
    <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      {/* Sentence-as-calculator */}
      <div className="lg:col-span-5 space-y-7">
        <p className="inline-flex items-center gap-2 text-[13px] text-[#B9CCE0]">
          <ShieldCheck className="w-4 h-4 text-[#E3B65C]" />
          AMFI Registered Mutual Fund Distributor, {arn}
        </p>

        <h1 className="font-display text-[34px] sm:text-[44px] xl:text-[50px] leading-[1.12] font-medium text-white text-pretty">
          Invest{' '}
          <ScrubNumber label="Monthly SIP amount" value={monthly} onChange={setMonthly} min={500} max={200000}
            step={amountStep} format={(v) => `₹${v.toLocaleString('en-IN')}`} onFirstUse={firstUse} pxPerStep={7} />{' '}
          a month for{' '}
          <ScrubNumber label="Number of years" value={years} onChange={setYears} min={1} max={40}
            step={unitStep(1)} format={(v) => `${v} ${v === 1 ? 'year' : 'years'}`} onFirstUse={firstUse} pxPerStep={12} />{' '}
          at{' '}
          <ScrubNumber label="Expected yearly return" value={rate} onChange={setRate} min={4} max={18}
            step={unitStep(0.5)} format={(v) => `${v}%`} onFirstUse={firstUse} pxPerStep={14} />{' '}
          a year, and it could grow to
          <motion.span
            className="block mt-2 text-[56px] sm:text-[76px] xl:text-[88px] leading-none font-semibold text-white tabular-nums tracking-tight"
            style={{ fontVariationSettings: wdth }}
          >
            <Money v={final} />
          </motion.span>
        </h1>

        <div className="h-6">
        <AnimatePresence>
          {!touched && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: reduced ? 0 : 1.6 }}
              className="inline-flex items-center gap-2 text-sm text-[#E3B65C]"
            >
              <motion.span
                animate={reduced ? {} : { x: [0, 6, -6, 0] }}
                transition={{ delay: 2.2, duration: 1.2, repeat: 2, repeatDelay: 1.5 }}
                className="inline-flex"
              >
                <MoveHorizontal className="w-4 h-4" />
              </motion.span>
              Drag any gold number sideways
            </motion.p>
          )}
        </AnimatePresence>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={onBook}
            className="rounded-xl bg-[#E3B65C] hover:bg-[#EDC77A] active:scale-[0.98] text-[#0F2740] font-semibold px-6 py-3.5 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            Book a free call
          </button>
          <button onClick={onPlan}
            className="rounded-xl border border-white/25 hover:border-white/60 hover:bg-white/5 text-white font-semibold px-6 py-3.5 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            Plan a goal
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="lg:col-span-7">
        <div className="rounded-3xl bg-[#14324F] ring-1 ring-white/10 p-4 sm:p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
          <div className="grid grid-cols-3 gap-3 sm:gap-6 pb-4 border-b border-white/10">
            <div>
              <p className="text-xs text-[#9DB4CC]">You put in</p>
              <p className="text-lg sm:text-2xl font-display font-semibold text-white tabular-nums"><Money v={invested} /></p>
            </div>
            <div>
              <p className="text-xs text-[#9DB4CC]">Growth on top</p>
              <p className="text-lg sm:text-2xl font-display font-semibold text-[#E3B65C] tabular-nums"><Money v={growth} /></p>
            </div>
            <div>
              <p className="text-xs text-[#9DB4CC]">Money multiplied</p>
              <p className="text-lg sm:text-2xl font-display font-semibold text-white tabular-nums"><motion.span>{multiple}</motion.span></p>
            </div>
          </div>

          <div className="relative mt-3">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${W} ${H}`}
              className="w-full h-[230px] sm:h-[300px] touch-pan-y"
              preserveAspectRatio="none"
              onPointerMove={onMove}
              onPointerDown={onMove}
              onPointerLeave={() => setHover(null)}
              role="img"
              aria-label={`Illustrative growth of a ₹${monthly} monthly SIP over ${years} years at ${rate}% a year`}
            >
              <defs>
                <linearGradient id="cp-wealth" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#E3B65C" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#E3B65C" stopOpacity="0" />
                </linearGradient>
                <pattern id="cp-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="8" stroke="#E3B65C" strokeOpacity="0.35" strokeWidth="3" />
                </pattern>
                <clipPath id="cp-reveal">
                  <motion.rect x="0" y="0" height={H} initial={{ width: reduced ? W : 0 }} animate={{ width: W }}
                    transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }} />
                </clipPath>
              </defs>

              {[0.25, 0.5, 0.75].map((f) => (
                <line key={f} x1={PAD_L} x2={W - PAD_R} y1={PAD_T + f * PLOT_H} y2={PAD_T + f * PLOT_H} stroke="#fff" strokeOpacity="0.06" />
              ))}

              <g clipPath="url(#cp-reveal)">
                <motion.path d={wealthArea} fill="url(#cp-wealth)" />
                <motion.path d={investedArea} fill="#3F6E96" fillOpacity="0.45" />
                <motion.path d={investedLine} fill="none" stroke="#7FA6C9" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                <motion.path d={gap} fill="url(#cp-hatch)" style={{ opacity: sD }} />
                <motion.path d={lateLine} fill="none" stroke="#fff" strokeOpacity="0.85" strokeWidth="2" strokeDasharray="6 5"
                  vectorEffect="non-scaling-stroke" style={{ opacity: sD }} />
                <motion.path d={wealthLine} fill="none" stroke="#E3B65C" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </g>

              {readout && (
                <g pointerEvents="none">
                  <line x1={readout.x} x2={readout.x} y1={PAD_T} y2={PAD_T + PLOT_H} stroke="#fff" strokeOpacity="0.35" vectorEffect="non-scaling-stroke" />
                </g>
              )}

            </svg>

            {/* end marker + hover dot live in HTML so they don't stretch with the SVG */}
            {!readout && (
              <motion.span
                className="absolute right-0 w-3.5 h-3.5 -mr-1.5 -mt-1.5 rounded-full bg-[#E3B65C] ring-4 ring-[#E3B65C]/25 pointer-events-none"
                style={{ top: endTop }}
                initial={{ scale: reduced ? 1 : 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.7 }}
              />
            )}
            {readout && (
              <>
                <span className="absolute w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-[#E3B65C] ring-4 ring-[#E3B65C]/25 pointer-events-none"
                  style={{ left: `${(readout.x / W) * 100}%`, top: `${(readout.y / H) * 100}%` }} />
                <div
                  className="absolute top-1 pointer-events-none rounded-xl bg-white text-[#0F2740] px-3 py-2 shadow-lg text-xs whitespace-nowrap"
                  style={{
                    left: `${(readout.x / W) * 100}%`,
                    transform: `translateX(${readout.x / W > 0.6 ? 'calc(-100% - 10px)' : '10px'})`
                  }}
                >
                  <p className="font-semibold">After {readout.t < 1 ? `${Math.round(readout.t * 12)} months` : `${readout.t.toFixed(1)} years`}</p>
                  <p>Value <strong className="tabular-nums">{formatINRShort(readout.wealth)}</strong></p>
                  <p className="text-[#3F6E96]">Invested <span className="tabular-nums">{formatINRShort(readout.invested)}</span></p>
                  {readout.late !== null && (
                    <p className="text-[#7A5A1C]">If started late <span className="tabular-nums">{formatINRShort(readout.late)}</span></p>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="relative h-5 mt-1 text-[11px] sm:text-xs text-[#9DB4CC] tabular-nums">
            {ticks.map((t) => (
              <span key={t.f} className="absolute top-0 whitespace-nowrap"
                style={{ left: `${t.f * 100}%`, transform: `translateX(${t.f === 0 ? '0' : t.f === 1 ? '-100%' : '-50%'})` }}>
                {t.label}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              type="button"
              aria-pressed={late}
              onClick={() => { setLate((v) => !v); firstUse(); }}
              className={`group inline-flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer
                focus-visible:outline-2 focus-visible:outline-[#E3B65C]
                ${late ? 'bg-white text-[#0F2740]' : 'bg-white/5 text-white hover:bg-white/10 ring-1 ring-white/15'}`}
            >
              <span className={`relative w-9 h-5 rounded-full transition-colors ${late ? 'bg-[#0F2740]' : 'bg-white/25'}`}>
                <motion.span layout className="absolute top-0.5 w-4 h-4 rounded-full bg-white"
                  style={{ left: late ? 18 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
              </span>
              What if I start {DELAY_YEARS} years later?
            </button>

            <AnimatePresence mode="wait">
              {late && (
                <motion.p
                  key="lost"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="text-sm text-white/85"
                >
                  Waiting costs about <strong className="font-display text-lg text-[#E3B65C] tabular-nums"><Money v={lost} /></strong>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-[#8FA7BF] max-w-2xl">
          Illustration only, using an assumed constant return. Mutual fund returns are not guaranteed and vary with markets.
          Mutual fund investments are subject to market risks, read all scheme related documents carefully.
        </p>
      </div>
    </div>
  );
};
