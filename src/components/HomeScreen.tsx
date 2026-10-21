import React from 'react';
import { ActiveScreen } from '../types';
import { InvestmentCalculator } from './InvestmentCalculator';
import { CompoundingPlayground } from './interactive/CompoundingPlayground';
import { GoalJourney } from './interactive/GoalJourney';
import { HabitJar } from './interactive/HabitJar';
import { RiskQuiz } from './interactive/RiskQuiz';
import { FaqSection } from './interactive/FaqSection';
import { HOME_FAQ } from '../seo/faq';
import { POSTS } from '../content/blog';
import { navigateTo } from '../utils/navigate';
import { motion } from 'motion/react';
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
      <section className="bg-white border-y border-[#E4EAF0] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="bg-[#F6F8FB] border border-[#D3DCE6] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xs">
            <div className="grid md:grid-cols-12 gap-8 items-center">
              
              <div className="md:col-span-4 flex justify-center">
                <div className="relative w-48 sm:w-56 aspect-4/5 rounded-2xl overflow-hidden border-2 border-[#0F2740]/20 shadow-md bg-white">
                  {siteSettings.founderPhotoUrl ? (<img
                    src={siteSettings.founderPhotoUrl}
                    alt={siteSettings.founderPhotoAlt || `${siteSettings.founderName} - Founder`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />) : (<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0F2740] to-[#1D4268] text-white text-6xl font-extrabold tracking-tight">{(siteSettings.founderName || 'Chirag Sharma').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}</div>)}
                  <div className="absolute bottom-0 inset-x-0 bg-[#0F2740]/90 text-white p-2.5 text-center">
                    <p className="text-xs font-bold">{siteSettings.founderName || 'Chirag Sharma'}</p>
                    <p className="text-[10px] text-[#F3D58E]">{siteSettings.sebiRegNumber || 'ARN-337289'}</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 bg-[#E3ECF5] text-[#0F2740] px-3 py-1 rounded-md text-xs font-bold">
                  <Award className="w-4 h-4 text-[#8A6420]" />
                  <span>Founder's Desk & AMFI Accreditation</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2740] leading-tight">
                  {siteSettings.founderSectionHeading || 'Personal, Goal-Based Mutual Fund Guidance'}
                </h2>

                <p className="text-sm text-[#43566B] leading-relaxed">
                  {siteSettings.founderSectionSubheading || siteSettings.founderBio || `${siteSettings.companyName} is led by certified professionals registered with AMFI. We provide personalized mutual fund distribution, portfolio review, and disciplined SIP asset allocation for families and professionals across India.`}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => onNavigate('about')}
                    className="bg-[#0F2740] hover:bg-[#1D4268] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Read Founder Story & View Certificate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate('contact')}
                    className="bg-white border border-[#D3DCE6] hover:bg-[#EDF1F5] text-[#0F2740] text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
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

      {/* 2c. HABITS TO WEALTH */}
      <HabitJar onStart={() => onNavigate('open-account')} />

      {/* 2d. RISK PROFILE QUIZ */}
      <RiskQuiz onBook={() => onNavigate('booking')} />

      {/* 2e. FAQ: direct answers for search and AI assistants */}
      <FaqSection
        items={HOME_FAQ}
        title="Questions investors ask before they start"
        intro="Straight answers about SIPs, fees, documents and how to verify a distributor."
      />

      {/* 3. COMPREHENSIVE INVESTMENT CALCULATOR SECTION */}
      <section className="bg-[#F6F8FB] py-14 md:py-20 border-b border-[#E4EAF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#13263B] tracking-tight mb-3">
              {siteSettings.calcHeading || 'Calculate Your Investment Potential'}
            </h2>
            <p className="text-sm sm:text-base text-[#43566B]">
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
            <div className="text-xs font-bold text-[#8A6420] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{siteSettings.testimonialBadge || 'Real Investor Experiences'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2740]">
              {siteSettings.testimonialHeading || `What Our Clients Say About ${siteSettings.companyName}`}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('testimonials')}
            className="text-xs sm:text-sm font-bold text-[#0F2740] hover:text-[#1D4268] flex items-center gap-1 cursor-pointer"
          >
            <span>View All Stories ({testimonials.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {topTestimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#D3DCE6] rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {item.investmentType && (
                    <span className="bg-[#EEF3F8] text-[#0F2740] text-[10px] font-bold px-2 py-0.5 rounded">
                      {item.investmentType}
                    </span>
                  )}
                </div>

                <div className="relative mb-4">
                  <Quote className="w-6 h-6 text-[#0F2740]/15 absolute -top-2 -left-1 pointer-events-none" />
                  <p className="text-xs sm:text-sm text-[#43566B] leading-relaxed italic pl-3">
                    "{item.text || item.reviewText || ''}"
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#EDF1F5] flex items-center gap-3">
                {item.avatarUrl || item.clientPhotoUrl ? (
                  <img
                    src={item.avatarUrl || item.clientPhotoUrl}
                    alt={item.avatarAlt || item.clientPhotoAlt || item.clientName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-[#D3DCE6]"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#E3ECF5] text-[#0F2740] flex items-center justify-center font-bold text-xs">
                    {item.clientName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-[#13263B] flex items-center gap-1">
                    <span>{item.clientName}</span>
                    {(item.verified ?? item.isVerified ?? true) && <CheckCircle2 className="w-3 h-3 text-[#8A6420]" />}
                  </p>
                  <p className="text-[11px] text-[#6B7C8F]">
                    {item.locationOrRole || [item.clientRole, item.clientLocation].filter(Boolean).join(' • ') || 'Verified Investor'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>)}

      {/* 5. LATEST GUIDES FROM THE BLOG */}
      <section className="bg-[#F6F8FB] border-t border-[#E4EAF0] py-16 md:py-20" aria-labelledby="home-blog-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <h2 id="home-blog-heading" className="font-display text-3xl sm:text-[40px] font-semibold text-[#0F2740] leading-tight max-w-2xl">
              Guides that answer the questions people ask before investing
            </h2>
            <a href="/blog" onClick={(e) => { e.preventDefault(); navigateTo('/blog'); }} className="text-sm font-semibold text-[#8A6420] hover:underline shrink-0">
              All {POSTS.length} guides
            </a>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {POSTS.slice(0, 3).map((p) => (
              <motion.a key={p.slug} href={`/blog/${p.slug}`} onClick={(e) => { e.preventDefault(); navigateTo(`/blog/${p.slug}`); }}
                whileHover={{ y: -4 }} className="group rounded-3xl bg-white ring-1 ring-[#D3DCE6] hover:ring-[#0F2740] overflow-hidden flex flex-col">
                <div className="h-36"><ArticleCover seed={p.slug} /></div>
                <div className="p-6">
                  <p className="text-xs font-semibold text-[#8A6420]">{p.category}</p>
                  <h3 className="font-display text-xl font-semibold text-[#0F2740] mt-1 leading-snug group-hover:underline decoration-[#E3B65C] decoration-2 underline-offset-4">{p.title}</h3>
                  <p className="mt-2 text-sm text-[#43566B] line-clamp-3">{p.description}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ADVISOR CONSULTATION TEASER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 md:py-20">
        <div className="bg-[#0F2740] rounded-3xl p-8 sm:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#1D4268] rounded-full blur-3xl opacity-40 -mr-20 -mt-20 pointer-events-none" />

          <div className="max-w-xl space-y-3 z-10">
            <span className="bg-[#E3ECF5] text-[#0A1D30] text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
              {siteSettings.consultationBadge || 'Free Strategy Session'}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              {siteSettings.consultationHeading || 'Unsure which portfolio matches your risk profile?'}
            </h2>
            <p className="text-sm sm:text-base text-[#E3ECF5] leading-relaxed">
              {siteSettings.consultationSubheading || 'Book a free 1-on-1 call with our AMFI registered distributor. We will review your retirement goals and portfolio allocation.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 z-10 w-full lg:w-auto shrink-0">
            <button
              onClick={() => onNavigate('booking')}
              className="bg-[#8A6420] hover:bg-[#6F501A] text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
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

