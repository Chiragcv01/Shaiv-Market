import React from 'react';
import { ActiveScreen } from '../types';
import { InvestmentCalculator } from './InvestmentCalculator';
import { CompoundingPlayground } from './interactive/CompoundingPlayground';
import { GoalJourney } from './interactive/GoalJourney';
import { ArticleCover } from './visuals/ArticleCover';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  User,
  ShieldCheck,
  Award,
  Calendar,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Clock,
  Star,
  Quote,
  CheckCircle2,
  Video,
  FileCheck
} from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
  onSelectFundForSIP?: (fundId: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onSelectFundForSIP
}) => {
  const { siteSettings, articles, testimonials } = useApp();
  const recentArticles = articles.slice(0, 2);
  const topTestimonials = testimonials.slice(0, 3);

  return (
    <div id="home-screen" className="w-full">
      
      {/* 1. HERO: the headline is the calculator */}
      <section className="relative bg-[#0F2740] overflow-hidden">
        <svg aria-hidden className="absolute -right-40 -top-40 w-[720px] h-[720px] opacity-[0.12] pointer-events-none" viewBox="0 0 200 200" fill="none">
          {[96, 84, 72, 60].map((r, i) => (
            <circle key={r} cx="100" cy="100" r={r} stroke={i === 0 ? '#E3B65C' : '#7FA6C9'} strokeWidth={i === 0 ? 1.2 : 2.4} />
          ))}
        </svg>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-20">
          <CompoundingPlayground
            arn={siteSettings.sebiRegNumber || 'ARN-337289'}
            onBook={() => onNavigate('booking')}
            onPlan={() => onNavigate('insights')}
          />
        </div>
      </section>

      {/* 2. FOUNDER & AMFI ACCREDITATION SHOWCASE BANNER */}
      <section className="bg-white border-y border-[#e0e3e5] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="bg-[#f7f9fb] border border-[#c2c6d1] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xs">
            <div className="grid md:grid-cols-12 gap-8 items-center">
              
              <div className="md:col-span-4 flex justify-center">
                <div className="relative w-48 sm:w-56 aspect-4/5 rounded-2xl overflow-hidden border-2 border-[#003461]/20 shadow-md bg-white">
                  {siteSettings.founderPhotoUrl ? (<img
                    src={siteSettings.founderPhotoUrl}
                    alt={siteSettings.founderPhotoAlt || `${siteSettings.founderName} - Founder`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />) : (<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#003461] to-[#004b87] text-white text-6xl font-extrabold tracking-tight">{(siteSettings.founderName || 'Chirag Sharma').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}</div>)}
                  <div className="absolute bottom-0 inset-x-0 bg-[#003461]/90 text-white p-2.5 text-center">
                    <p className="text-xs font-bold">{siteSettings.founderName || 'Chirag Sharma'}</p>
                    <p className="text-[10px] text-[#96f6bd]">{siteSettings.sebiRegNumber || 'ARN-337289'}</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 bg-[#d3e4fe] text-[#003461] px-3 py-1 rounded-md text-xs font-bold">
                  <Award className="w-4 h-4 text-[#006d42]" />
                  <span>Founder's Desk & AMFI Accreditation</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#003461] leading-tight">
                  {siteSettings.founderSectionHeading || 'Personal, Goal-Based Mutual Fund Guidance'}
                </h2>

                <p className="text-sm text-[#424750] leading-relaxed">
                  {siteSettings.founderSectionSubheading || siteSettings.founderBio || `${siteSettings.companyName} is led by certified professionals registered with AMFI. We provide personalized mutual fund distribution, portfolio review, and disciplined SIP asset allocation for families and professionals across India.`}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => onNavigate('about')}
                    className="bg-[#003461] hover:bg-[#004b87] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Read Founder Story & View Certificate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate('contact')}
                    className="bg-white border border-[#c2c6d1] hover:bg-[#eceef0] text-[#003461] text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Contact Founder Desk
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2b. LIFE GOALS, SCROLL-DRIVEN */}
      <GoalJourney onPlan={() => onNavigate('insights')} />

      {/* 3. COMPREHENSIVE INVESTMENT CALCULATOR SECTION */}
      <section className="bg-[#f7f9fb] py-14 md:py-20 border-b border-[#e0e3e5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#191c1e] tracking-tight mb-3">
              {siteSettings.calcHeading || 'Calculate Your Investment Potential'}
            </h2>
            <p className="text-sm sm:text-base text-[#424750]">
              {siteSettings.calcSubheading || 'Simulate compound returns across SIPs and Lumpsum investments with institutional accuracy.'}
            </p>
          </div>

          <InvestmentCalculator
            onNavigate={onNavigate}
            onSelectFundForSIP={onSelectFundForSIP}
          />
        </div>
      </section>

      {/* 4. CLIENT TESTIMONIALS PREVIEW SECTION */}
      {testimonials.length > 0 && (<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 md:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-bold text-[#006d42] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{siteSettings.testimonialBadge || 'Real Investor Experiences'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#003461]">
              {siteSettings.testimonialHeading || `What Our Clients Say About ${siteSettings.companyName}`}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('testimonials')}
            className="text-xs sm:text-sm font-bold text-[#003461] hover:text-[#004b87] flex items-center gap-1 cursor-pointer"
          >
            <span>View All Stories ({testimonials.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {topTestimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#c2c6d1] rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {item.investmentType && (
                    <span className="bg-[#f0f4f8] text-[#003461] text-[10px] font-bold px-2 py-0.5 rounded">
                      {item.investmentType}
                    </span>
                  )}
                </div>

                <div className="relative mb-4">
                  <Quote className="w-6 h-6 text-[#003461]/15 absolute -top-2 -left-1 pointer-events-none" />
                  <p className="text-xs sm:text-sm text-[#424750] leading-relaxed italic pl-3">
                    "{item.text || item.reviewText || ''}"
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#eceef0] flex items-center gap-3">
                {item.avatarUrl || item.clientPhotoUrl ? (
                  <img
                    src={item.avatarUrl || item.clientPhotoUrl}
                    alt={item.avatarAlt || item.clientPhotoAlt || item.clientName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-[#c2c6d1]"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#d3e4fe] text-[#003461] flex items-center justify-center font-bold text-xs">
                    {item.clientName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-[#191c1e] flex items-center gap-1">
                    <span>{item.clientName}</span>
                    {(item.verified ?? item.isVerified ?? true) && <CheckCircle2 className="w-3 h-3 text-[#006d42]" />}
                  </p>
                  <p className="text-[11px] text-[#727781]">
                    {item.locationOrRole || [item.clientRole, item.clientLocation].filter(Boolean).join(' • ') || 'Verified Investor'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>)}

      {/* 5. LATEST RESEARCH & INSIGHTS BLOG PREVIEW */}
      <section className="bg-[#f7f9fb] border-t border-[#e0e3e5] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="text-xs font-bold text-[#006d42] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{siteSettings.insightsBadge || 'Research Desk & Market Commentary'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#003461]">
                {siteSettings.insightsHeading || 'Recent Wealth Strategies & Dispatches'}
              </h2>
            </div>
            <button
              onClick={() => onNavigate('insights')}
              className="text-xs font-bold text-[#003461] hover:text-[#004b87] flex items-center gap-1 cursor-pointer"
            >
              <span>View All Insights ({articles.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => onNavigate('insights')}
                className="bg-white border border-[#c2c6d1] hover:border-[#003461] rounded-2xl overflow-hidden transition-all hover:shadow-md cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {(
                    <div className="w-full h-40 overflow-hidden bg-[#f7f9fb] border-b border-[#e0e3e5]">
                      {art.imageUrl ? (<img
                        src={art.imageUrl}
                        alt={art.imageAlt || art.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />) : (<ArticleCover seed={art.id} />)}
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-[#d3e4fe] text-[#003461] text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                        {art.category}
                      </span>
                      <span className="text-[11px] text-[#727781] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {art.readTime}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#191c1e] mb-2 leading-snug hover:text-[#003461]">
                      {art.title}
                    </h3>
                    <p className="text-xs text-[#424750] line-clamp-2 leading-relaxed">
                      {art.summary}
                    </p>
                  </div>
                </div>
                <div className="px-6 pb-5 pt-3 border-t border-[#eceef0] flex items-center justify-between text-xs text-[#727781]">
                  <span>{art.author}</span>
                  <span className="text-[#006d42] font-semibold flex items-center gap-1">
                    Read Article <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ADVISOR CONSULTATION TEASER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 md:py-20">
        <div className="bg-[#003461] rounded-3xl p-8 sm:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#004b87] rounded-full blur-3xl opacity-40 -mr-20 -mt-20 pointer-events-none" />

          <div className="max-w-xl space-y-3 z-10">
            <span className="bg-[#d3e4fe] text-[#001c38] text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
              {siteSettings.consultationBadge || 'Free Strategy Session'}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              {siteSettings.consultationHeading || 'Unsure which portfolio matches your risk profile?'}
            </h2>
            <p className="text-sm sm:text-base text-[#d3e4fe] leading-relaxed">
              {siteSettings.consultationSubheading || 'Book a free 1-on-1 call with our AMFI registered distributor. We will review your retirement goals and portfolio allocation.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 z-10 w-full lg:w-auto shrink-0">
            <button
              onClick={() => onNavigate('booking')}
              className="bg-[#006d42] hover:bg-[#005231] text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>{siteSettings.consultationCtaText || 'Book Expert Session'}</span>
            </button>
            {siteSettings.enableCalendlyBooking && siteSettings.calendlyUrl && (
              <a
                href={siteSettings.calendlyUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <span>Calendly Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

        </div>
      </section>

    </div>
  );
};

