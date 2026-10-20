import React, { useState } from 'react';
import { ActiveScreen, Testimonial } from '../types';
import { useApp } from '../context/AppContext';
import {
  Star,
  ShieldCheck,
  Play,
  X,
  Quote,
  CheckCircle2,
  Video,
  User,
  ExternalLink,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface TestimonialsScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const TestimonialsScreen: React.FC<TestimonialsScreenProps> = ({ onNavigate }) => {
  const { testimonials, siteSettings } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'video' | 'sip' | 'retirement'>('all');
  const [activeVideoModal, setActiveVideoModal] = useState<Testimonial | null>(null);

  const filteredTestimonials = testimonials.filter((t) => {
    if (activeFilter === 'video') return Boolean(t.videoUrl);
    if (activeFilter === 'sip') return t.investmentType?.toLowerCase().includes('sip');
    if (activeFilter === 'retirement') return t.investmentType?.toLowerCase().includes('retirement');
    return true;
  });

  return (
    <div id="testimonials-screen" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 md:py-16 space-y-12">
      
      {/* 1. HEADER & TRUST SUMMARY */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#F3D58E]/30 text-[#8A6420] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>100% Real & Verified Investor Reviews</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F2740] tracking-tight">
          Client Stories & Wealth Journeys
        </h1>

        <p className="text-base sm:text-lg text-[#43566B] leading-relaxed">
          Discover how families, professionals, and business owners achieve their financial goals through disciplined mutual fund investing with {siteSettings.companyName}.
        </p>

        {/* Rating Score Banner */}
        {testimonials.length > 0 && (<div className="flex flex-wrap items-center justify-center gap-6 pt-2">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
            <span className="font-extrabold text-[#13263B] text-base ml-1">4.9 / 5.0</span>
          </div>
          <span className="text-xs text-[#6B7C8F]">•</span>
          <span className="text-xs font-semibold text-[#43566B]">{testimonials.length} Client Reviews</span>
          <span className="text-xs text-[#6B7C8F]">•</span>
          <span className="text-xs font-semibold text-[#8A6420]">Zero Direct Spam Policy</span>
        </div>)}
      </div>

      {/* 2. FILTER TABS */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-[#E4EAF0] pb-4">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-[#0F2740] text-white shadow-xs'
              : 'bg-[#F6F8FB] text-[#43566B] hover:bg-[#E4EAF0]'
          }`}
        >
          All Client Reviews ({testimonials.length})
        </button>

        <button
          onClick={() => setActiveFilter('video')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeFilter === 'video'
              ? 'bg-[#0F2740] text-white shadow-xs'
              : 'bg-[#F6F8FB] text-[#43566B] hover:bg-[#E4EAF0]'
          }`}
        >
          <Video className="w-3.5 h-3.5 text-[#ba1a1a]" />
          <span>Video Stories</span>
        </button>

        <button
          onClick={() => setActiveFilter('sip')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeFilter === 'sip'
              ? 'bg-[#0F2740] text-white shadow-xs'
              : 'bg-[#F6F8FB] text-[#43566B] hover:bg-[#E4EAF0]'
          }`}
        >
          SIP & Compounding
        </button>

        <button
          onClick={() => setActiveFilter('retirement')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeFilter === 'retirement'
              ? 'bg-[#0F2740] text-white shadow-xs'
              : 'bg-[#F6F8FB] text-[#43566B] hover:bg-[#E4EAF0]'
          }`}
        >
          Retirement Portfolios
        </button>
      </div>

      {/* 3. TESTIMONIALS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredTestimonials.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#D3DCE6] rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative group"
          >
            <div>
              
              {/* Top Row: Stars, Type & Video badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: item.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                {item.investmentType && (
                  <span className="bg-[#EEF3F8] text-[#0F2740] text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-[#D3DCE6]/50">
                    {item.investmentType}
                  </span>
                )}
              </div>

              {/* Video Thumbnail Trigger (if video exists) */}
              {item.videoUrl && (
                <div
                  onClick={() => setActiveVideoModal(item)}
                  className="mb-4 relative w-full h-36 rounded-xl overflow-hidden bg-[#0A1D30] cursor-pointer group/video border border-[#D3DCE6]"
                >
                  <img
                    src={item.avatarUrl || item.clientPhotoUrl || '/images/logo-mark.png'}
                    alt={item.avatarAlt || item.clientPhotoAlt || `${item.clientName} Video Testimonial`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-60 group-hover/video:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center shadow-lg group-hover/video:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[11px] text-white font-bold bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded">
                    <span>Watch Video Experience</span>
                    <span className="text-[#F3D58E]">Verified</span>
                  </div>
                </div>
              )}

              {/* Review Quote Text */}
              <div className="relative">
                <Quote className="w-8 h-8 text-[#0F2740]/10 absolute -top-3 -left-2 -z-0 pointer-events-none" />
                <p className="text-xs sm:text-sm text-[#43566B] leading-relaxed relative z-10 italic">
                  "{item.text || item.reviewText || ''}"
                </p>
              </div>

            </div>

            {/* Client Info Footer */}
            <div className="pt-5 mt-5 border-t border-[#EDF1F5] flex items-center justify-between">
              <div className="flex items-center gap-3">
                {item.avatarUrl || item.clientPhotoUrl ? (
                  <img
                    src={item.avatarUrl || item.clientPhotoUrl}
                    alt={item.avatarAlt || item.clientPhotoAlt || item.clientName}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full object-cover border border-[#D3DCE6]"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-[#E3ECF5] text-[#0F2740] flex items-center justify-center font-bold text-sm">
                    {item.clientName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#13263B] flex items-center gap-1.5">
                    <span>{item.clientName}</span>
                    {(item.verified ?? item.isVerified ?? true) && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8A6420]" title="Verified Client" />
                    )}
                  </h4>
                  <p className="text-[11px] text-[#6B7C8F]">
                    {item.locationOrRole || [item.clientRole, item.clientLocation].filter(Boolean).join(' • ') || 'Verified Investor'}
                  </p>
                </div>
              </div>

              {item.date && (
                <span className="text-[11px] text-[#6B7C8F] shrink-0">{item.date}</span>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* 4. CALL TO ACTION: START YOUR JOURNEY */}
      <div className="bg-gradient-to-r from-[#0F2740] to-[#1D4268] text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-white/15 text-white px-3 py-1 rounded-md text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#F3D58E]" />
            <span>Begin Your Compounding Journey</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to experience tailored wealth planning?
          </h3>
          <p className="text-xs sm:text-sm text-[#E3ECF5] leading-relaxed">
            Get a complimentary review of your mutual fund schemes and understand your true asset allocation.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <button
            onClick={() => onNavigate('open-account')}
            className="bg-[#8A6420] hover:bg-[#6F501A] text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <span>Start an SIP Today</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('booking')}
            className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl transition-all cursor-pointer"
          >
            Book 30-Min Call
          </button>
        </div>
      </div>

      {/* 5. VIDEO TESTIMONIAL MODAL PLAYER */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-[#D3DCE6] relative space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#E4EAF0] pb-3">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-[#ba1a1a]" />
                <span className="font-bold text-base text-[#0F2740]">
                  Video Story: {activeVideoModal.clientName}
                </span>
                <span className="text-xs text-[#6B7C8F] font-semibold">
                  ({activeVideoModal.locationOrRole || activeVideoModal.clientRole || 'Client'})
                </span>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-1 text-[#6B7C8F] hover:text-[#13263B] text-lg font-bold cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Video Container */}
            <div className="aspect-16/9 w-full rounded-xl overflow-hidden bg-black border border-[#D3DCE6] flex items-center justify-center">
              {activeVideoModal.videoUrl?.includes('youtube.com') || activeVideoModal.videoUrl?.includes('youtu.be') ? (
                <iframe
                  src={activeVideoModal.videoUrl.replace('watch?v=', 'embed/')}
                  title={`${activeVideoModal.clientName} Video Story`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : activeVideoModal.videoUrl?.endsWith('.mp4') ? (
                <video
                  controls
                  autoPlay
                  src={activeVideoModal.videoUrl}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="p-8 text-center text-white space-y-3">
                  <Play className="w-12 h-12 text-[#F3D58E] mx-auto" />
                  <p className="text-sm font-semibold">{activeVideoModal.text || activeVideoModal.reviewText}</p>
                  <a
                    href={activeVideoModal.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#F3D58E] font-bold underline"
                  >
                    <span>Open External Video Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-xs text-[#6B7C8F] pt-2">
              <p>"{activeVideoModal.text || activeVideoModal.reviewText}"</p>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="bg-[#0F2740] text-white px-4 py-2 rounded-lg font-bold cursor-pointer shrink-0"
              >
                Close Video
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
