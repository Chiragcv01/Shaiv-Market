import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';
import { Faq } from '../../seo/faq';

/** Visible FAQ accordion. Answers are always in the HTML (crawlers and AI read them); only the panel height animates. */
export const FaqSection: React.FC<{ items: Faq[]; title: string; intro?: string; dark?: boolean; id?: string; compact?: boolean }> = ({
  items, title, intro, dark = false, id = 'faq', compact = false
}) => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={dark ? 'bg-[#0F2740] text-white' : ''}>
      <div className={`${compact ? 'py-12' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 md:py-24'} grid lg:grid-cols-12 gap-10`}>
        <div className="lg:col-span-4">
          <h2 id={`${id}-heading`} className={`font-display text-3xl sm:text-[40px] leading-[1.1] font-semibold ${dark ? 'text-white' : 'text-[#0F2740]'}`}>{title}</h2>
          {intro && <p className={`mt-4 ${dark ? 'text-white/70' : 'text-[#43566B]'}`}>{intro}</p>}
        </div>
        <dl className="lg:col-span-8 divide-y divide-current/10">
          {items.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className={`py-1 ${dark ? 'border-white/10' : 'border-[#E4EAF0]'}`}>
                <dt>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`${id}-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className={`w-full flex items-start justify-between gap-6 py-4 text-left cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-[#E3B65C]`}
                  >
                    <span className={`font-display text-lg sm:text-xl font-medium ${dark ? 'text-white' : 'text-[#0F2740]'}`}>{f.q}</span>
                    <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className={`mt-1 shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${isOpen ? 'bg-[#E3B65C] text-[#0F2740]' : dark ? 'bg-white/10' : 'bg-[#EEF3F8] text-[#0F2740]'}`}>
                      <Plus className="w-4 h-4" />
                    </motion.span>
                  </button>
                </dt>
                <AnimatePresence initial={false}>
                  <motion.dd
                    id={`${id}-a-${i}`}
                    key="a"
                    initial={false}
                    animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className={`pb-5 pr-12 leading-relaxed ${dark ? 'text-white/75' : 'text-[#43566B]'}`}>{f.a}</p>
                  </motion.dd>
                </AnimatePresence>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
};
