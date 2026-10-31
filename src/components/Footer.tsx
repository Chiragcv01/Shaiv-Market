import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Mail, Phone, MapPin, ShieldCheck, CheckCircle, SlidersHorizontal, ArrowRight, MessageCircle } from 'lucide-react';
import { ActiveScreen } from '../types';
import { useApp } from '../context/AppContext';
import { CALC_ROUTES } from '../seo/routes';
import { navigateTo } from '../utils/navigate';

interface FooterProps {
  onNavigate?: (screen: ActiveScreen) => void;
}

const FOOTER_CALCS = ['sip-compounder', 'required-sip', 'step-up-sip', 'retirement', 'swp', 'ppf', 'mf-tax', 'loan-sip'];
const footerLink = (path: string) => (e: React.MouseEvent) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey) return;
  e.preventDefault();
  navigateTo(path);
};

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { siteSettings, currentUser } = useApp();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const wdth = useTransform(scrollYProgress, [0.3, 1], ["'wdth' 75", "'wdth' 125"]);
  const wordY = useTransform(scrollYProgress, [0.3, 1], ['40%', '0%']);
  const wa = (siteSettings.whatsappSupportNumber || '').replace(/[^0-9]/g, '');

  return (
    <footer ref={ref} className="bg-[#0A1D30] text-[#eff1f3] font-normal text-sm w-full mt-auto overflow-hidden">
      {/* closing CTA */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 md:py-20 grid md:grid-cols-12 gap-8 items-end">
          <h2 className="md:col-span-7 font-display text-4xl sm:text-6xl font-semibold leading-[1.02] text-white">
            Your first SIP can start this week.
          </h2>
          <div className="md:col-span-5 flex flex-wrap gap-3 md:justify-end">
            <motion.button
              onClick={() => onNavigate?.('booking')}
              whileHover={{ y: -3, boxShadow: '0 18px 40px -12px rgba(227,182,92,0.6)' }}
              whileTap={{ scale: 0.97 }}
              className="rounded-xl bg-[#E3B65C] text-[#0F2740] font-semibold px-7 py-4 text-base cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Book an intro call
            </motion.button>
            {wa && (
              <motion.a whileHover={{ y: -3 }} href={`https://wa.me/${wa}?text=${encodeURIComponent('Hi Chirag, I would like to start a SIP.')}`}
                target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl ring-1 ring-white/25 hover:ring-white/60 px-6 py-4 text-base text-white">
                <MessageCircle className="w-5 h-5 text-[#25D366]" /> WhatsApp
              </motion.a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              {siteSettings.logoImageUrl ? (
                <img src={siteSettings.logoImageUrl} alt={siteSettings.companyName} className="w-11 h-11 rounded-full bg-white object-contain p-0.5" />
              ) : (
                <div className="w-7 h-7 rounded-md bg-[#8A6420] flex items-center justify-center text-white text-sm font-bold">
                  {siteSettings.logoInitial || 'S'}
                </div>
              )}
              <span className="text-xl font-bold text-white tracking-tight">{siteSettings.companyName}</span>
            </div>
            <p className="text-[#D3DCE6] text-xs leading-relaxed max-w-sm">
              {siteSettings.footerAboutText || 'Empowering investors with goal-based wealth planning, required SIP target calculators, and personal guidance from an AMFI registered mutual fund distributor.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#F3D58E]">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#F3D58E]" />
              <span>AMFI Registered Mutual Fund Distributor ({siteSettings.sebiRegNumber || 'ARN-337289'})</span>
            </div>
          </div>

          {/* Calculators: real links so every calculator is linked from every page */}
          <div>
            <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-4">
              Free calculators
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
              {FOOTER_CALCS.map((tab) => {
                const c = CALC_ROUTES.find((x) => x.tab === tab)!;
                return (
                  <li key={tab}>
                    <a href={`/calculators/${c.slug}`} onClick={footerLink(`/calculators/${c.slug}`)} className="text-[#D3DCE6] hover:text-white transition-colors">{c.name}</a>
                  </li>
                );
              })}
              <li>
                <a href="/calculators" onClick={footerLink('/calculators')} className="font-medium text-[#F3D58E] hover:text-white transition-colors">All {CALC_ROUTES.length} calculators</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-4">
              Shaiv Market
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
              {[
                ['/book-intro-call', 'Book an intro call'],
                ['/about', 'About Chirag Sharma'],
                ['/blog', 'Blog: SIP, tax and goal guides'],
                ['/sip-returns-table', 'SIP returns table'],
                ['/mutual-fund-glossary', 'Mutual fund glossary'],
                ['/goal-planner', 'Goal SIP calculator and guides'],
                ['/start-sip', 'Start a SIP'],
                ['/contact', 'Contact us']
              ].map(([href, label], i) => (
                <li key={href}>
                  <a href={href} onClick={footerLink(href)} className={`hover:text-white transition-colors ${i === 0 ? 'font-medium text-[#F3D58E]' : 'text-[#D3DCE6]'}`}>{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Info */}
          <div>
            <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-4">
              Direct Contact
            </h4>
            <div className="flex flex-col gap-3 text-xs text-[#D3DCE6]">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#F3D58E] shrink-0" />
                <a href={`mailto:${siteSettings.advisoryEmail}`} className="hover:text-white transition-colors">
                  {siteSettings.advisoryEmail}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#F3D58E] shrink-0" />
                <span>{siteSettings.supportPhone} (Mon–Fri, Sat 10–2)</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#F3D58E] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{siteSettings.headquartersAddress}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#43566B]/50 text-[#8c9199] text-xs flex flex-col md:flex-row justify-between items-center gap-4">
          <p>{siteSettings.footerCopyrightText || `© 2026 ${siteSettings.companyName}. All rights reserved. AMFI Registered Mutual Fund Distributor. Mutual fund investments are subject to market risks, read all scheme related documents carefully.`}</p>
          <div className="flex items-center gap-4 shrink-0 text-[#F3D58E]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Secure HTTPS</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              <span>AMFI ARN: {siteSettings.sebiRegNumber || 'ARN-337289'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* wordmark that stretches as you reach the end of the page */}
      <motion.p aria-hidden style={{ fontVariationSettings: wdth, y: wordY }}
        className="font-display font-semibold text-center leading-[0.78] text-[19vw] text-white/[0.06] select-none whitespace-nowrap -mb-[2vw]">
        {siteSettings.companyName}
      </motion.p>
    </footer>
  );
};
