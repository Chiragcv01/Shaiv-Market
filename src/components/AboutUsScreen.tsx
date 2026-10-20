import React, { useState } from 'react';
import { ActiveScreen } from '../types';
import { useApp } from '../context/AppContext';
import { Tilt } from './interactive/Tilt';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  ExternalLink,
  ZoomIn,
  X,
  Sparkles,
  FileCheck,
  Building,
  Users,
  Compass,
  ArrowRight
} from 'lucide-react';

interface AboutUsScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const AboutUsScreen: React.FC<AboutUsScreenProps> = ({ onNavigate }) => {
  const { siteSettings } = useApp();
  const [certView, setCertView] = useState<{ src: string; title: string } | null>(null);

  return (
    <div id="about-us-screen" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 md:py-16 space-y-16">
      
      {/* 1. HEADER & MISSION HERO */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#d3e4fe] text-[#003461] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-[#006d42]" />
          <span>AMFI Registered Mutual Fund Distributor • {siteSettings.sebiRegNumber || 'ARN-337289'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#003461] tracking-tight">
          Empowering Financial Freedom Through Disciplined Investing
        </h1>
        <p className="text-base sm:text-lg text-[#424750] leading-relaxed">
          {siteSettings.aboutMission || 'To be your most trusted mutual fund distribution partner, guiding families and business leaders with goal-based asset allocation and lifelong support.'}
        </p>
      </div>

      {/* 2. FOUNDER & PRINCIPAL DISTRIBUTOR PROFILE */}
      <section className="bg-white border border-[#c2c6d1] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xs">
        <div className="grid md:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Founder Photo */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-sm aspect-4/5 rounded-2xl overflow-hidden shadow-lg border border-[#e0e3e5] bg-[#f7f9fb] group">
              {siteSettings.founderPhotoUrl ? (<img
                src={siteSettings.founderPhotoUrl}
                alt={siteSettings.founderPhotoAlt || `${siteSettings.founderName} - AMFI Registered Distributor`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              />) : (<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#003461] to-[#004b87] text-white text-6xl font-extrabold tracking-tight">{(siteSettings.founderName || 'Chirag Sharma').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}</div>)}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#003461]/90 via-[#003461]/60 to-transparent p-5 text-white">
                <p className="text-lg font-extrabold leading-tight">{siteSettings.founderName || 'Chirag Sharma'}</p>
                <p className="text-xs text-[#96f6bd] font-semibold">{siteSettings.founderTitle || 'Principal Mutual Fund Distributor'}</p>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <span className="bg-[#f0f4f8] text-[#003461] text-xs font-bold px-3 py-1 rounded-md border border-[#c2c6d1]/60">
                {siteSettings.founderExperience || 'Based in Jaipur'}
              </span>
              <span className="bg-[#96f6bd]/20 text-[#006d42] text-xs font-bold px-3 py-1 rounded-md border border-[#96f6bd]/40">
                {siteSettings.sebiRegNumber || 'ARN-337289'}
              </span>
            </div>
          </div>

          {/* Founder Bio & Qualifications */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold text-[#006d42] uppercase tracking-wider">Meet the Founder</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#003461] mt-1">
                {siteSettings.founderName || 'Chirag Sharma'}
              </h2>
              <p className="text-sm font-semibold text-[#727781] mt-0.5">
                {siteSettings.founderQualification || 'NISM Series V-A Certified Mutual Fund Distributor'}
              </p>
            </div>

            <div className="text-[#424750] text-sm sm:text-base leading-relaxed space-y-4">
              <p>
                {siteSettings.founderBio || 'Chirag Sharma helps individuals and families in constructing goal-aligned mutual fund portfolios and achieving peace of mind across market cycles.'}
              </p>
              <p>
                "At {siteSettings.companyName}, we believe that investing is not about chasing the hottest stock tip or predicting next week's headlines. True wealth creation is the mathematical outcome of staying invested in quality mutual fund schemes, letting compounding do the heavy lifting, and having a trusted distributor by your side to manage risk during drawdowns."
              </p>
            </div>

            {/* Credential Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#f7f9fb] border border-[#e0e3e5] rounded-xl p-4 flex items-start gap-3">
                <Award className="w-5 h-5 text-[#006d42] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#003461]">AMFI Accredited Distributor</h4>
                  <p className="text-xs text-[#727781] mt-0.5">Compliant with AMFI Code of Conduct & NISM Certification.</p>
                </div>
              </div>
              <div className="bg-[#f7f9fb] border border-[#e0e3e5] rounded-xl p-4 flex items-start gap-3">
                <Users className="w-5 h-5 text-[#003461] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#003461]">Personal Service</h4>
                  <p className="text-xs text-[#727781] mt-0.5">Direct access to your distributor for every query, review and transaction.</p>
                </div>
              </div>
            </div>

            {/* Quick Action buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => onNavigate('booking')}
                className="bg-[#003461] hover:bg-[#004b87] text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule a 1-on-1 Discussion</span>
              </button>
              <button
                onClick={() => siteSettings.arnCertificateUrl ? setCertView({ src: siteSettings.arnCertificateUrl, title: 'AMFI ARN Card' }) : window.open('https://www.amfiindia.com/locate-distributor', '_blank', 'noopener')}
                className="bg-white border border-[#c2c6d1] hover:bg-[#f7f9fb] text-[#003461] text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <FileCheck className="w-4 h-4 text-[#006d42]" />
                <span>View Certificates</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 3. AMFI REGISTRATION & REGULATORY ACCREDITATION */}
      <section className="bg-[#f7f9fb] border border-[#c2c6d1] rounded-3xl p-6 sm:p-10">
        <div className="grid md:grid-cols-12 gap-8 items-start">

          <div className="md:col-span-7 space-y-4 md:sticky md:top-28">
            <div className="inline-flex items-center gap-1.5 bg-[#96f6bd]/30 text-[#006d42] px-3 py-1 rounded-md text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Official AMFI Verification</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#003461]">
              Regulatory Registration & Compliance
            </h2>
            <p className="text-sm text-[#424750] leading-relaxed">
              {siteSettings.companyName} is officially registered with the Association of Mutual Funds in India (AMFI) as an authorized Mutual Fund Distributor under ARN-{siteSettings.sebiRegNumber?.replace('ARN-', '') || '337289'}. All transactions are routed securely through accredited platforms like BSE StAR MF and AMC direct infrastructure.
            </p>
            <ul className="text-xs sm:text-sm text-[#424750] space-y-2.5 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#006d42] shrink-0" />
                <span><strong>ARN Code:</strong> {siteSettings.sebiRegNumber || 'ARN-337289'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#006d42] shrink-0" />
                <span><strong>Clearing & Execution:</strong> BSE StAR MF / NSE NMF II Platform</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#006d42] shrink-0" />
                <span><strong>Client Safety:</strong> Monies are transferred directly to AMC bank accounts without intermediary holding.</span>
              </li>
            </ul>
          </div>

          {/* Certificates */}
          <div className="md:col-span-5 grid grid-cols-1 gap-4">
            {[
              { src: siteSettings.arnCertificateUrl, title: 'AMFI ARN Card', sub: `${siteSettings.sebiRegNumber || 'ARN-337289'} · Valid till 13-Aug-2028` },
              { src: siteSettings.nismCertificateUrl, title: 'NISM Series V-A Certificate', sub: 'Mutual Fund Distributors Certification Examination' }
            ].filter((c) => c.src).map((c) => (
              <Tilt key={c.title} className="rounded-2xl">
              <button
                type="button"
                onClick={() => setCertView({ src: c.src as string, title: c.title })}
                className="group text-left w-full rounded-2xl overflow-hidden border-2 border-[#003461]/20 hover:border-[#003461] bg-white p-2 shadow-sm transition-all cursor-pointer"
              >
                <div className="relative aspect-[3/2] rounded-xl overflow-hidden bg-[#f7f9fb]">
                  <img src={c.src} alt={`${c.title} - ${siteSettings.founderName}`} loading="lazy" className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-300" />
                  <div className="absolute inset-0 bg-[#003461]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-bold text-xs">
                    <ZoomIn className="w-5 h-5" />
                    <span>View Certificate</span>
                  </div>
                </div>
                <div className="px-2 py-2">
                  <p className="text-xs font-bold text-[#003461]">{c.title}</p>
                  <p className="text-[11px] text-[#727781]">{c.sub}</p>
                </div>
              </button>
              </Tilt>
            ))}
            <a href="https://www.amfiindia.com/locate-distributor" target="_blank" rel="noopener noreferrer" className="text-[11px] font-semibold text-[#006d42] hover:underline text-center">
              Verify ARN on amfiindia.com ↗
            </a>
          </div>

        </div>
      </section>

      {/* 4. OUR STORY & 4 PILLARS */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#006d42] uppercase tracking-wider">Our Core Philosophy</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#003461]">
            Why Investors Choose {siteSettings.companyName}
          </h2>
          <p className="text-xs sm:text-sm text-[#424750]">
            {siteSettings.aboutStory || 'We bring institutional discipline and clarity to everyday mutual fund investors.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-[#c2c6d1] rounded-2xl p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#d3e4fe] text-[#003461] flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="text-base font-bold text-[#003461]">Quantitative Scheme Curation</h3>
            <p className="text-xs text-[#424750] leading-relaxed">
              We analyze rolling returns, fund manager tenure, Sharpe ratio, and portfolio overlap rather than blindly chasing yesterday's top performers.
            </p>
          </div>

          <div className="bg-white border border-[#c2c6d1] rounded-2xl p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#d3e4fe] text-[#003461] flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="text-base font-bold text-[#003461]">Goal-Based Allocation</h3>
            <p className="text-xs text-[#424750] leading-relaxed">
              Every rupee is mapped to a tangible milestone—retirement corpus, children's global education, or financial independence (FIRE).
            </p>
          </div>

          <div className="bg-white border border-[#c2c6d1] rounded-2xl p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#d3e4fe] text-[#003461] flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="text-base font-bold text-[#003461]">Behavioral Volatility Shield</h3>
            <p className="text-xs text-[#424750] leading-relaxed">
              Market corrections are normal. We provide regular reviews and calm guidance to keep your compounding engine running without emotional panic.
            </p>
          </div>

          <div className="bg-white border border-[#c2c6d1] rounded-2xl p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#96f6bd]/40 text-[#006d42] flex items-center justify-center font-bold">
              4
            </div>
            <h3 className="text-base font-bold text-[#003461]">100% Paperless Execution</h3>
            <p className="text-xs text-[#424750] leading-relaxed">
              Fast onboarding via BSE StAR MF and direct AMC clearing. Zero physical paperwork, instant folio generation, and complete transparency.
            </p>
          </div>
        </div>
      </section>

      {/* 5. CONTACT & BOOKING CTA */}
      <div className="bg-[#003461] text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to structure your wealth with confidence?
          </h3>
          <p className="text-xs sm:text-sm text-[#d3e4fe] leading-relaxed">
            Get in touch with our certified distribution desk today. We will review your existing portfolio and create a personalized roadmap.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <button
            onClick={() => onNavigate('contact')}
            className="bg-white hover:bg-[#eceef0] text-[#003461] font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all cursor-pointer shadow-sm"
          >
            Send Inquiry
          </button>
          <button
            onClick={() => onNavigate('booking')}
            className="bg-[#006d42] hover:bg-[#005231] text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Book 30-Min Call</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CERTIFICATE LIGHTBOX MODAL */}
      {certView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-[#c2c6d1] relative space-y-4 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#e0e3e5] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#006d42]" />
                <span className="font-bold text-base text-[#003461]">{certView.title}</span>
                <span className="text-xs bg-[#d3e4fe] text-[#003461] font-mono px-2 py-0.5 rounded font-bold">
                  {siteSettings.sebiRegNumber || 'ARN-337289'}
                </span>
              </div>
              <button
                onClick={() => setCertView(null)}
                className="p-1 text-[#727781] hover:text-[#191c1e] text-lg font-bold cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-[#c2c6d1] bg-[#f7f9fb] flex justify-center">
              <img
                src={certView.src}
                alt={siteSettings.arnCertificateAlt || 'Official AMFI Registration Certificate'}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] object-contain w-full"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-[#727781] pt-2 gap-2">
              <p>Registered Entity: {siteSettings.companyName} • AMFI Registered Mutual Fund Distributor</p>
              <button
                onClick={() => setCertView(null)}
                className="bg-[#003461] text-white px-4 py-2 rounded-lg font-bold cursor-pointer"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
