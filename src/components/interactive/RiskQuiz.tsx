import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowLeft, RotateCcw } from 'lucide-react';

const QUESTIONS: { q: string; options: { label: string; score: number }[] }[] = [
  {
    q: 'How old are you?',
    options: [
      { label: 'Under 30', score: 4 },
      { label: '30 to 45', score: 3 },
      { label: '45 to 60', score: 2 },
      { label: 'Over 60', score: 1 }
    ]
  },
  {
    q: 'When will you need most of this money?',
    options: [
      { label: 'Within 3 years', score: 1 },
      { label: 'In 3 to 7 years', score: 2 },
      { label: 'In 7 to 15 years', score: 3 },
      { label: 'After 15 years', score: 4 }
    ]
  },
  {
    q: 'Your investment falls 20% in a month. What do you do?',
    options: [
      { label: 'Sell everything', score: 1 },
      { label: 'Sell some of it', score: 2 },
      { label: 'Wait it out', score: 3 },
      { label: 'Invest more while it is cheap', score: 4 }
    ]
  },
  {
    q: 'How steady is your income?',
    options: [
      { label: 'It changes a lot', score: 1 },
      { label: 'Fairly steady', score: 2.5 },
      { label: 'Very steady, with savings set aside', score: 4 }
    ]
  },
  {
    q: 'What matters more to you?',
    options: [
      { label: 'Protecting what I have', score: 1 },
      { label: 'A balance of both', score: 2.5 },
      { label: 'Growing it as much as possible', score: 4 }
    ]
  }
];

const PROFILES = [
  { max: 30, name: 'Conservative', text: 'You value stability. Most of your money sits in debt funds, with a small equity slice for growth.', horizon: '1 to 3 years' },
  { max: 45, name: 'Moderately conservative', text: 'Safety first, with some room for growth through large-cap and hybrid funds.', horizon: '3 to 5 years' },
  { max: 60, name: 'Balanced', text: 'An even hand between growth and stability, rebalanced once a year.', horizon: '5 to 7 years' },
  { max: 70, name: 'Growth', text: 'You can sit through market dips for long-term returns, mostly through diversified equity funds.', horizon: '7 to 10 years' },
  { max: 100, name: 'Aggressive growth', text: 'Long horizon, high comfort with swings. Equity-heavy, including some mid and small caps.', horizon: '10 years or more' }
];

const R = 80;
const C = 2 * Math.PI * R;

function mixFor(answers: (number | null)[]) {
  const given = answers.filter((a): a is number => a !== null);
  const avg = given.length ? given.reduce((a, b) => a + b, 0) / given.length : 2.5;
  const equity = Math.round((20 + ((avg - 1) / 3) * 60) / 5) * 5;
  const gold = 10;
  return { equity, debt: 100 - equity - gold, gold };
}

export const RiskQuiz: React.FC<{ onBook: () => void }> = ({ onBook }) => {
  const reduced = useReducedMotion();
  const [answers, setAnswers] = useState<(number | null)[]>(QUESTIONS.map(() => null));
  const [step, setStep] = useState(0);
  const done = step >= QUESTIONS.length;
  const mix = mixFor(answers);
  const profile = PROFILES.find((p) => mix.equity <= p.max)!;

  const choose = (score: number) => {
    setAnswers((a) => a.map((v, i) => (i === step ? score : v)));
    setTimeout(() => setStep((s) => s + 1), reduced ? 0 : 220);
  };
  const restart = () => { setAnswers(QUESTIONS.map(() => null)); setStep(0); };

  const segments = [
    { name: 'Equity', value: mix.equity, color: '#E3B65C' },
    { name: 'Debt', value: mix.debt, color: '#7FA6C9' },
    { name: 'Gold', value: mix.gold, color: '#F4E3B8' }
  ];
  let acc = 0;

  return (
    <section className="bg-[#0F2740] text-white py-16 md:py-24" aria-labelledby="risk-quiz-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="max-w-2xl mb-10">
          <h2 id="risk-quiz-heading" className="font-display text-3xl sm:text-[44px] leading-[1.1] font-semibold">
            What kind of investor are you? Five questions, one minute.
          </h2>
          <p className="mt-4 text-[#B9CCE0] text-base sm:text-lg">Watch the mix change as you answer.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7 min-h-[360px]">
            {/* progress */}
            <div className="flex gap-1.5 mb-6" aria-hidden>
              {QUESTIONS.map((_, i) => (
                <span key={i} className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden">
                  <motion.span className="block h-full bg-[#E3B65C]" initial={false}
                    animate={{ width: answers[i] !== null ? '100%' : i === step ? '35%' : '0%' }} />
                </span>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {!done ? (
                <motion.div
                  key={step}
                  initial={reduced ? false : { opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduced ? undefined : { opacity: 0, x: -30 }}
                  transition={{ duration: 0.22 }}
                >
                  <p className="text-sm text-[#9DB4CC] tabular-nums">Question {step + 1} of {QUESTIONS.length}</p>
                  <h3 className="font-display text-2xl sm:text-3xl font-medium mt-2">{QUESTIONS[step].q}</h3>
                  <div className="mt-6 grid sm:grid-cols-2 gap-3">
                    {QUESTIONS[step].options.map((o) => {
                      const picked = answers[step] === o.score;
                      return (
                        <motion.button
                          key={o.label}
                          type="button"
                          onClick={() => choose(o.score)}
                          whileTap={{ scale: 0.97 }}
                          className={`rounded-2xl px-5 py-4 text-left font-medium transition-colors cursor-pointer
                            focus-visible:outline-2 focus-visible:outline-[#E3B65C]
                            ${picked ? 'bg-[#E3B65C] text-[#0F2740]' : 'bg-white/[0.07] hover:bg-white/[0.14] ring-1 ring-white/10'}`}
                        >
                          {o.label}
                        </motion.button>
                      );
                    })}
                  </div>
                  {step > 0 && (
                    <button onClick={() => setStep((s) => s - 1)}
                      className="mt-6 inline-flex items-center gap-1.5 text-sm text-[#B9CCE0] hover:text-white cursor-pointer">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={reduced ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-sm text-[#9DB4CC]">Your indicative profile</p>
                  <h3 className="font-display text-4xl sm:text-5xl font-semibold text-[#E3B65C] mt-1">{profile.name}</h3>
                  <p className="mt-4 text-lg text-white/85 max-w-xl">{profile.text}</p>
                  <p className="mt-2 text-sm text-[#B9CCE0]">Usually suits goals {profile.horizon} away.</p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <button onClick={onBook}
                      className="rounded-xl bg-[#E3B65C] hover:bg-[#EDC77A] text-[#0F2740] font-semibold px-6 py-3.5 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                      Discuss this mix on a free call
                    </button>
                    <button onClick={restart}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/25 hover:border-white/60 px-5 py-3.5 font-semibold cursor-pointer">
                      <RotateCcw className="w-4 h-4" /> Take it again
                    </button>
                  </div>
                  <p className="mt-5 text-[11px] text-white/45 max-w-xl">
                    An educational starting point, not a recommendation. A complete risk profile is done during onboarding before any investment.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* live allocation donut */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72">
              <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90" role="img"
                aria-label={`Indicative mix: ${mix.equity}% equity, ${mix.debt}% debt, ${mix.gold}% gold`}>
                <circle cx="100" cy="100" r={R} fill="none" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="26" />
                {segments.map((s) => {
                  const len = (s.value / 100) * C;
                  const start = acc;
                  acc += len;
                  return (
                    <motion.circle key={s.name} cx="100" cy="100" r={R} fill="none" stroke={s.color} strokeWidth="26"
                      initial={false}
                      animate={{ strokeDasharray: `${Math.max(len - 3, 0)} ${C}`, strokeDashoffset: -start }}
                      transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 90, damping: 16 }} />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <motion.span key={mix.equity} initial={reduced ? false : { scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="font-display text-5xl font-semibold tabular-nums">{mix.equity}%</motion.span>
                <span className="text-sm text-[#9DB4CC]">in equity</span>
              </div>
            </div>
            <ul className="mt-6 flex gap-6 text-sm">
              {segments.map((s) => (
                <li key={s.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                  {s.name} <strong className="tabular-nums">{s.value}%</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
