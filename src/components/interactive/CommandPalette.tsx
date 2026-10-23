import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Home, Calculator, Target, User, CalendarCheck, Mail, FileText, MessageCircle, Phone,
  Wallet, Scale, Flame, ShieldCheck, PieChart, Coins, BadgeCheck, CornerDownLeft, BookOpen
} from 'lucide-react';
import { ActiveScreen } from '../../types';
import { setPendingScroll, scrollToId } from '../../utils/deepLink';
import { CALC_ROUTES } from '../../seo/routes';
import { CALC_ICONS } from '../CalculatorsScreen';
import { POSTS } from '../../content/blog';
import { navigateTo } from '../../utils/navigate';

interface Cmd {
  id: string;
  label: string;
  hint: string;
  group: 'Pages' | 'Calculators' | 'Guides' | 'On the home page' | 'Get in touch';
  icon: React.ElementType;
  keywords?: string;
  run: () => void;
}

export const CommandPalette: React.FC<{
  open: boolean;
  onClose: () => void;
  onNavigate: (s: ActiveScreen) => void;
  whatsapp: string;
  phone: string;
  email: string;
}> = ({ open, onClose, onNavigate, whatsapp, phone, email }) => {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const go = (s: ActiveScreen) => () => onNavigate(s);
  const homeSection = (id: string) => () => { setPendingScroll(id); onNavigate('home'); setTimeout(() => scrollToId(id), 350); };

  const cmds: Cmd[] = useMemo(() => [
    { id: 'home', label: 'Home', hint: 'Start page', group: 'Pages', icon: Home, run: go('home') },
    { id: 'calcs', label: 'All calculators', hint: `${CALC_ROUTES.length} free calculators`, group: 'Pages', icon: Calculator, run: () => navigateTo('/calculators') },
    { id: 'planner', label: 'Goal planner', hint: 'Plan a life goal', group: 'Pages', icon: Target, keywords: 'insights articles', run: go('insights') },
    { id: 'about', label: 'About Chirag Sharma', hint: 'Founder, ARN and certificates', group: 'Pages', icon: User, keywords: 'founder arn nism amfi certificate', run: go('about') },
    { id: 'book', label: 'Book a free call', hint: 'Pick a date and time', group: 'Pages', icon: CalendarCheck, keywords: 'appointment meeting consultation', run: go('booking') },
    { id: 'quote', label: 'Get a free investment quote', hint: 'Share your goal, get a plan', group: 'Pages', icon: FileText, keywords: 'open account start sip invest', run: go('open-account') },
    { id: 'contact', label: 'Contact', hint: 'Form, phone, email, office', group: 'Pages', icon: Mail, run: go('contact') },
    { id: 'blog', label: 'Blog: all guides', hint: 'SIP, tax, retirement, KYC', group: 'Pages', icon: BookOpen, keywords: 'articles read learn', run: () => navigateTo('/blog') },
    ...POSTS.map((p) => ({ id: `post-${p.slug}`, label: p.title, hint: p.category, group: 'Guides' as const, icon: BookOpen, keywords: p.keywords.join(' '), run: () => navigateTo(`/blog/${p.slug}`) })),
    ...CALC_ROUTES.map((c) => ({
      id: `c-${c.tab}`, label: c.name, hint: c.blurb, group: 'Calculators' as const, icon: CALC_ICONS[c.tab] || Calculator,
      keywords: `${c.short} ${c.title}`, run: () => navigateTo(`/calculators/${c.slug}`)
    })),
    { id: 'quiz', label: 'Take the risk quiz', hint: 'Five questions, one minute', group: 'On the home page', icon: PieChart, keywords: 'risk profile investor type', run: homeSection('risk-quiz-heading') },
    { id: 'jar', label: 'Small spends jar', hint: 'Turn habits into a SIP', group: 'On the home page', icon: Coins, keywords: 'habits savings', run: homeSection('habit-jar-heading') },
    { id: 'goals', label: 'Life goals journey', hint: 'Education, home, retirement', group: 'On the home page', icon: Target, run: homeSection('goal-journey-heading') },
    ...(whatsapp ? [{ id: 'wa', label: 'WhatsApp Chirag', hint: 'Usually replies the same day', group: 'Get in touch' as const, icon: MessageCircle,
      run: () => window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hi Chirag, I found you on shaivmarket.com and would like to talk about investing.')}`, '_blank') }] : []),
    ...(phone ? [{ id: 'call', label: 'Call now', hint: phone, group: 'Get in touch' as const, icon: Phone, run: () => { window.location.href = `tel:${phone}`; } }] : []),
    ...(email ? [{ id: 'mail', label: 'Email', hint: email, group: 'Get in touch' as const, icon: Mail, run: () => { window.location.href = `mailto:${email}`; } }] : []),
    { id: 'arn', label: 'Verify ARN on AMFI', hint: 'amfiindia.com', group: 'Get in touch', icon: BadgeCheck, keywords: 'verify registration',
      run: () => window.open('https://www.amfiindia.com/locate-distributor', '_blank', 'noopener') }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [whatsapp, phone, email]);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return cmds;
    return cmds
      .map((c) => {
        const hay = `${c.label} ${c.hint} ${c.keywords || ''}`.toLowerCase();
        const score = c.label.toLowerCase().startsWith(t) ? 3 : hay.split(/\s+/).some((w) => w.startsWith(t)) ? 2 : hay.includes(t) ? 1 : 0;
        return { c, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.c);
  }, [q, cmds]);

  useEffect(() => { setSel(0); }, [q]);
  useEffect(() => {
    if (open) { setQ(''); setTimeout(() => inputRef.current?.focus(), 30); }
  }, [open]);
  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${sel}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [sel]);

  const run = (c?: Cmd) => { if (!c) return; onClose(); c.run(); };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(results.length - 1, s + 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
    if (e.key === 'Enter') { e.preventDefault(); run(results[sel]); }
    if (e.key === 'Escape') onClose();
  };

  let lastGroup = '';

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-[#0A1D30]/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search the site"
            className="relative w-full max-w-xl rounded-2xl bg-white shadow-[0_40px_120px_-20px_rgba(10,29,48,0.6)] overflow-hidden"
            initial={{ y: -16, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: -10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          >
            <div className="flex items-center gap-3 px-4 border-b border-[#E4EAF0]">
              <Search className="w-5 h-5 text-[#6B7C8F]" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKey}
                placeholder="Search calculators, pages, or try “retire early”"
                aria-label="Search"
                role="combobox"
                aria-expanded="true"
                aria-controls="cmdk-list"
                aria-activedescendant={results[sel] ? `cmdk-${results[sel].id}` : undefined}
                className="flex-1 py-4 text-base text-[#0F2740] placeholder:text-[#9AA8B7] outline-none bg-transparent"
              />
              <kbd className="text-[11px] rounded bg-[#EEF3F8] px-1.5 py-0.5 text-[#6B7C8F]">Esc</kbd>
            </div>
            <ul id="cmdk-list" ref={listRef} role="listbox" className="max-h-[52vh] overflow-y-auto p-2">
              {results.length === 0 && (
                <li className="px-3 py-8 text-center text-sm text-[#6B7C8F]">
                  Nothing matches “{q}”. Try “SIP”, “pension” or “call”.
                </li>
              )}
              {results.map((c, i) => {
                const header = c.group !== lastGroup ? c.group : null;
                lastGroup = c.group;
                const Icon = c.icon;
                const active = i === sel;
                return (
                  <React.Fragment key={c.id}>
                    {header && <li className="px-3 pt-3 pb-1 text-xs text-[#6B7C8F]">{header}</li>}
                    <li
                      id={`cmdk-${c.id}`}
                      role="option"
                      aria-selected={active}
                      data-idx={i}
                      onMouseMove={() => setSel(i)}
                      onClick={() => run(c)}
                      className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer"
                    >
                      {active && <motion.span layoutId="cmdk-sel" className="absolute inset-0 rounded-xl bg-[#0F2740]"
                        transition={{ type: 'spring', stiffness: 600, damping: 40 }} />}
                      <span className={`relative w-8 h-8 rounded-lg flex items-center justify-center ${active ? 'bg-[#E3B65C] text-[#0F2740]' : 'bg-[#EEF3F8] text-[#3F6E96]'}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="relative flex-1 min-w-0">
                        <span className={`block text-sm font-medium ${active ? 'text-white' : 'text-[#0F2740]'}`}>{c.label}</span>
                        <span className={`block text-xs truncate ${active ? 'text-white/65' : 'text-[#6B7C8F]'}`}>{c.hint}</span>
                      </span>
                      {active && <CornerDownLeft className="relative w-4 h-4 text-[#E3B65C]" />}
                    </li>
                  </React.Fragment>
                );
              })}
            </ul>
            <div className="px-4 py-2.5 border-t border-[#E4EAF0] text-[11px] text-[#6B7C8F] flex gap-4">
              <span>↑ ↓ to move</span><span>Enter to open</span><span className="ml-auto">Press / anywhere to search</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
