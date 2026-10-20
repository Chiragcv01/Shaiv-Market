import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react';
import { Pizza, Coffee, Tv, Clapperboard, Car, ShoppingBag, Dumbbell, Check } from 'lucide-react';
import { ScrubNumber, unitStep } from './ScrubNumber';
import { sipFutureValue, formatINRShort } from '../../utils/money';

const HABITS = [
  { id: 'food', label: 'Food delivery twice a week', amount: 3200, Icon: Pizza },
  { id: 'coffee', label: 'Café coffee four days a week', amount: 2400, Icon: Coffee },
  { id: 'ott', label: 'OTT apps you barely open', amount: 600, Icon: Tv },
  { id: 'movie', label: 'Weekend movie and snacks', amount: 2000, Icon: Clapperboard },
  { id: 'cab', label: 'Cabs instead of metro or bus', amount: 2500, Icon: Car },
  { id: 'shop', label: 'Impulse online shopping', amount: 3000, Icon: ShoppingBag },
  { id: 'gym', label: 'Gym membership you skip', amount: 1500, Icon: Dumbbell }
];

const COIN_VALUE = 250;
const RATE = 0.12;

// jar geometry
const JW = 240, JH = 300;
const FLOOR = 268, COIN_RX = 15, COIN_RY = 5.5, ROW_H = 10, PER_ROW = 5;

export const HabitJar: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const reduced = useReducedMotion();
  const [picked, setPicked] = useState<string[]>(['food', 'coffee']);
  const [years, setYears] = useState(20);

  const monthly = picked.reduce((s, id) => s + (HABITS.find((h) => h.id === id)?.amount || 0), 0);
  const corpus = sipFutureValue(monthly, years, RATE);

  const mv = useMotionValue(corpus);
  const spring = useSpring(mv, reduced ? { duration: 0 } : { stiffness: 90, damping: 20 });
  useEffect(() => { mv.set(corpus); }, [corpus, mv]);
  const corpusText = useTransform(spring, (v: number) => formatINRShort(v));

  // one coin per ₹500, stacked in the order habits were picked
  const coins = useMemo(() => {
    const list: { key: string; x: number; y: number; tone: number }[] = [];
    let i = 0;
    picked.forEach((id, hIdx) => {
      const h = HABITS.find((x) => x.id === id)!;
      const n = Math.ceil(h.amount / COIN_VALUE);
      for (let k = 0; k < n; k++, i++) {
        const row = Math.floor(i / PER_ROW);
        const col = i % PER_ROW;
        const offset = row % 2 ? 10 : -10;
        list.push({
          key: `${id}-${k}`,
          x: JW / 2 + (col - (PER_ROW - 1) / 2) * (COIN_RX * 2 + 2) + offset * 0.4,
          y: FLOOR - row * ROW_H,
          tone: hIdx % 3
        });
      }
    });
    return list;
  }, [picked]);

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const tones = [
    { face: '#E3B65C', edge: '#A9802F' },
    { face: '#EFCB7E', edge: '#B38B3B' },
    { face: '#D9A845', edge: '#9A7226' }
  ];

  const renderJar = (cls: string) => (
            <svg viewBox={`0 0 ${JW} ${JH}`} className={cls} role="img"
              aria-label={`Jar holding ${coins.length} coins, ₹${monthly} a month`}>
              {/* jar */}
              <path d="M70 18 h100 v22 c0 8 30 18 30 46 v170 c0 22 -14 34 -36 34 h-88 c-22 0 -36 -12 -36 -34 v-170 c0 -28 30 -38 30 -46 z"
                fill="#ffffff" fillOpacity="0.06" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2.5" />
              <rect x="64" y="8" width="112" height="16" rx="5" fill="#7FA6C9" fillOpacity="0.6" />
              <AnimatePresence>
              {coins.map((c, i) => {
                const t = tones[c.tone];
                return (
                  <motion.g
                    key={c.key}
                    initial={reduced ? false : { x: c.x, y: -40, opacity: 0 }}
                    animate={{ x: c.x, y: c.y, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 18, delay: (i % 8) * 0.03 }}
                  >
                    <ellipse cx="0" cy="3" rx={COIN_RX} ry={COIN_RY} fill={t.edge} />
                    <ellipse cx="0" cy="0" rx={COIN_RX} ry={COIN_RY} fill={t.face} />
                    <text x="0" y="2.5" textAnchor="middle" fontSize="7" fontWeight="700" fill={t.edge}>₹</text>
                  </motion.g>
                );
              })}
              </AnimatePresence>
              {coins.length === 0 && (
                <text x={JW / 2} y={FLOOR - 20} textAnchor="middle" fill="#9DB4CC" fontSize="13">Tap a habit to fill me</text>
              )}
            </svg>
  );

  return (
    <section className="bg-white py-16 md:py-24" aria-labelledby="habit-jar-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <div className="lg:col-span-6">
          <h2 id="habit-jar-heading" className="font-display text-3xl sm:text-[44px] leading-[1.1] font-semibold text-[#0F2740]">
            Small spends add up. Tap the ones you could skip.
          </h2>
          <p className="mt-4 text-[#43566B] text-base sm:text-lg max-w-xl">
            Each one drops its monthly cost into the jar. See what that money could become as a SIP instead.
          </p>

          <div className="lg:hidden sticky top-[calc(var(--header-h,84px)+8px)] z-10 mt-6 rounded-2xl bg-[#0F2740] text-white p-3 pr-4 flex items-center gap-3 shadow-[0_16px_40px_-16px_rgba(15,39,64,0.6)]">
            {renderJar('w-20 shrink-0')}
            <div className="min-w-0">
              <p className="text-xs text-[#9DB4CC] tabular-nums">₹{monthly.toLocaleString('en-IN')} a month for {years} years</p>
              <motion.p className="font-display text-[34px] leading-none font-semibold text-[#E3B65C] tabular-nums mt-1">{corpusText}</motion.p>
              <p className="text-[10px] text-white/50 mt-1">At an assumed 12% a year. Not guaranteed.</p>
            </div>
          </div>

          <div className="mt-6 lg:mt-8 grid sm:grid-cols-2 gap-3">
            {HABITS.map(({ id, label, amount, Icon }) => {
              const on = picked.includes(id);
              return (
                <motion.button
                  key={id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(id)}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-colors cursor-pointer
                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F2740]
                    ${on ? 'bg-[#0F2740] text-white' : 'bg-[#EEF3F8] text-[#0F2740] hover:bg-[#E2EAF2]'}`}
                >
                  <span className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${on ? 'bg-[#E3B65C] text-[#0F2740]' : 'bg-white text-[#3F6E96]'}`}>
                    {on ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium leading-snug">{label}</span>
                    <span className={`block text-xs tabular-nums ${on ? 'text-[#E3B65C]' : 'text-[#3F6E96]'}`}>₹{amount.toLocaleString('en-IN')} a month</span>
                  </span>
                </motion.button>
              );
            })}
          </div>
          <button onClick={onStart} disabled={!monthly}
            className="lg:hidden mt-6 w-full rounded-xl bg-[#E3B65C] disabled:opacity-40 text-[#0F2740] font-semibold px-5 py-3.5 cursor-pointer">
            Start a ₹{monthly.toLocaleString('en-IN')} SIP
          </button>
        </div>

        <div className="hidden lg:block lg:col-span-6">
          <div className="rounded-3xl bg-[#0F2740] text-white p-6 sm:p-8 grid sm:grid-cols-2 gap-6 items-center">
            {renderJar("w-full max-w-[260px] mx-auto")}

            <div>
              <p className="text-sm text-[#9DB4CC]">Redirected each month</p>
              <p className="font-display text-3xl font-semibold tabular-nums">₹{monthly.toLocaleString('en-IN')}</p>
              <p className="mt-5 font-display text-xl leading-snug text-white/90">
                Invested for{' '}
                <ScrubNumber label="Years invested" value={years} onChange={setYears} min={3} max={35}
                  step={unitStep(1)} format={(v) => `${v} years`} pxPerStep={12} />{' '}
                it could become
              </p>
              <motion.p className="font-display text-[48px] sm:text-[56px] leading-none font-semibold text-[#E3B65C] tabular-nums mt-1">
                {corpusText}
              </motion.p>
              <p className="mt-2 text-xs text-white/50">At an assumed 12% a year. Not guaranteed.</p>
              <button onClick={onStart} disabled={!monthly}
                className="mt-6 rounded-xl bg-[#E3B65C] hover:bg-[#EDC77A] disabled:opacity-40 text-[#0F2740] font-semibold px-5 py-3 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                Start a ₹{monthly.toLocaleString('en-IN')} SIP
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
