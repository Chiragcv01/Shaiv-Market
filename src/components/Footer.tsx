import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck, CheckCircle, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { ActiveScreen } from '../types';
import { useApp } from '../context/AppContext';

interface FooterProps {
  onNavigate?: (screen: ActiveScreen) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { siteSettings, currentUser } = useApp();

  return (
    <footer className="bg-[#191c1e] text-[#eff1f3] font-normal text-sm w-full mt-auto border-t border-[#424750]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              {siteSettings.logoImageUrl ? (
                <img src={siteSettings.logoImageUrl} alt={siteSettings.companyName} className="w-11 h-11 rounded-full bg-white object-contain p-0.5" />
              ) : (
                <div className="w-7 h-7 rounded-md bg-[#006d42] flex items-center justify-center text-white text-sm font-bold">
                  {siteSettings.logoInitial || 'S'}
                </div>
              )}
              <span className="text-xl font-bold text-white tracking-tight">{siteSettings.companyName}</span>
            </div>
            <p className="text-[#c2c6d1] text-xs leading-relaxed max-w-sm">
              {siteSettings.footerAboutText || 'Empowering investors with goal-based wealth planning, required SIP target calculators, and personal guidance from an AMFI registered mutual fund distributor.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#96f6bd]">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#96f6bd]" />
              <span>AMFI Registered Mutual Fund Distributor ({siteSettings.sebiRegNumber || 'ARN-337289'})</span>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-4">
              Financial Planning
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onNavigate?.('about')}
                  className="text-[#c2c6d1] hover:text-white transition-colors text-left cursor-pointer"
                >
                  About Founder & Accreditation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('insights')}
                  className="text-[#c2c6d1] hover:text-white transition-colors text-left cursor-pointer"
                >
                  Goal Planner & Strategy Desk
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('calculators')}
                  className="text-[#c2c6d1] hover:text-white transition-colors text-left cursor-pointer"
                >
                  Know Your Required SIP Amount
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('calculators')}
                  className="text-[#c2c6d1] hover:text-white transition-colors text-left cursor-pointer"
                >
                  SIP Wealth & SWP Calculators
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('testimonials')}
                  className="text-[#c2c6d1] hover:text-white transition-colors text-left cursor-pointer"
                >
                  Client Reviews & Stories
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Admin Links */}
          <div>
            <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-4">
              Connect With Us
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onNavigate?.('booking')}
                  className="text-[#c2c6d1] hover:text-white transition-colors text-left cursor-pointer font-medium text-[#96f6bd]"
                >
                  Schedule 1-on-1 Meeting
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('open-account')}
                  className="text-[#c2c6d1] hover:text-white transition-colors text-left cursor-pointer"
                >
                  Register & Onboard Investor
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('contact')}
                  className="text-[#c2c6d1] hover:text-white transition-colors text-left cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Connect Info */}
          <div>
            <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-4">
              Direct Contact
            </h4>
            <div className="flex flex-col gap-3 text-xs text-[#c2c6d1]">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#96f6bd] shrink-0" />
                <a href={`mailto:${siteSettings.advisoryEmail}`} className="hover:text-white transition-colors">
                  {siteSettings.advisoryEmail}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#96f6bd] shrink-0" />
                <span>{siteSettings.supportPhone} (Mon - Fri)</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#96f6bd] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{siteSettings.headquartersAddress}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#424750]/50 text-[#8c9199] text-xs flex flex-col md:flex-row justify-between items-center gap-4">
          <p>{siteSettings.footerCopyrightText || `© 2026 ${siteSettings.companyName}. All rights reserved. AMFI Registered Mutual Fund Distributor. Mutual fund investments are subject to market risks, read all scheme related documents carefully.`}</p>
          <div className="flex items-center gap-4 shrink-0 text-[#96f6bd]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>256-Bit SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              <span>AMFI ARN: {siteSettings.sebiRegNumber || 'ARN-337289'}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
