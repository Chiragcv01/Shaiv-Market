import React from 'react';
import { motion } from 'motion/react';
import { Calculator, Target, User, CalendarCheck, Search } from 'lucide-react';
import { ActiveScreen } from '../types';

const LINKS: { label: string; hint: string; screen: ActiveScreen; Icon: React.ElementType }[] = [
  { label: 'SIP and goal calculators', hint: 'Required SIP, SWP, FIRE and more', screen: 'calculators', Icon: Calculator },
  { label: 'Goal planner and guides', hint: 'Plan a goal, read the basics of mutual funds', screen: 'insights', Icon: Target },
  { label: 'About Chirag Sharma', hint: 'AMFI ARN-337289, NISM certified', screen: 'about', Icon: User },
  { label: 'Book a free call', hint: 'Portfolio review, no charges', screen: 'booking', Icon: CalendarCheck }
];

export const NotFoundScreen: React.FC<{ onNavigate: (s: ActiveScreen) => void; onSearch: () => void }> = ({ onNavigate, onSearch }) => (
  <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24">
    <p className="font-display text-[96px] sm:text-[140px] leading-none font-semibold text-[#E3ECF5] select-none" aria-hidden>404</p>
    <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#0F2740] -mt-6 sm:-mt-10">This page has moved</h1>
    <p className="mt-4 text-lg text-[#43566B] max-w-2xl">
      Shaiv Market has a new website. Older articles and tools now live on the pages below, or search for what you were looking for.
    </p>
    <button onClick={onSearch}
      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0F2740] hover:bg-[#1D4268] text-white font-semibold px-5 py-3 cursor-pointer">
      <Search className="w-4 h-4" /> Search the site
    </button>
    <div className="mt-10 grid sm:grid-cols-2 gap-3">
      {LINKS.map(({ label, hint, screen, Icon }) => (
        <motion.button key={label} onClick={() => onNavigate(screen)} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
          className="flex items-center gap-4 text-left rounded-2xl bg-white ring-1 ring-[#D3DCE6] hover:ring-[#0F2740] p-4 cursor-pointer">
          <span className="w-11 h-11 rounded-xl bg-[#EEF3F8] text-[#0F2740] flex items-center justify-center shrink-0"><Icon className="w-5 h-5" /></span>
          <span>
            <span className="block font-semibold text-[#0F2740]">{label}</span>
            <span className="block text-sm text-[#6B7C8F]">{hint}</span>
          </span>
        </motion.button>
      ))}
    </div>
  </section>
);
