import React, { useState } from 'react';
import { ActiveScreen, InsightArticle } from '../types';
import { useApp } from '../context/AppContext';
import { GoalPlanner } from './GoalPlanner';
import { SwpCalculator } from './SwpCalculator';
import { LoanVsSipArbitrage } from './LoanVsSipArbitrage';
import { FireCalculator } from './FireCalculator';
import { MfTaxEstimator } from './MfTaxEstimator';
import { EmergencyFundShield } from './EmergencyFundShield';
import {
  Target,
  Wallet,
  Scale,
  Flame,
  FileSpreadsheet,
  ShieldCheck,
  BookOpen,
  Clock,
  ArrowRight,
  SlidersHorizontal,
  X,
  Sparkles,
  Layers
} from 'lucide-react';

interface InsightsScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

type ToolTabId = 'goal' | 'swp' | 'loan-vs-sip' | 'fire' | 'tax' | 'emergency';

interface ToolMeta {
  id: ToolTabId;
  label: string;
  shortLabel: string;
  icon: any;
  tagline: string;
}

const WEALTH_TOOLS: ToolMeta[] = [
  {
    id: 'goal',
    label: 'Goal Planner',
    shortLabel: 'Goals',
    icon: Target,
    tagline: 'Education, Home & Retirement Roadmaps'
  },
  {
    id: 'swp',
    label: 'SWP & Pension',
    shortLabel: 'SWP Payouts',
    icon: Wallet,
    tagline: 'Monthly Income & Capital Longevity'
  },
  {
    id: 'loan-vs-sip',
    label: 'Loan vs SIP Arbitrage',
    shortLabel: 'Loan vs SIP',
    icon: Scale,
    tagline: 'Prepay Loan or Invest in Mutual Funds'
  },
  {
    id: 'fire',
    label: 'FIRE Calculator',
    shortLabel: 'FIRE Number',
    icon: Flame,
    tagline: 'Financial Independence & Early Retirement'
  },
  {
    id: 'tax',
    label: 'Capital Gains Tax',
    shortLabel: 'Tax Estimator',
    icon: FileSpreadsheet,
    tagline: 'Budget 2024-26 LTCG & STCG Rules'
  },
  {
    id: 'emergency',
    label: 'Emergency Shield',
    shortLabel: 'Safety Buffer',
    icon: ShieldCheck,
    tagline: 'Liquid & Overnight Reserve Strategy'
  }
];

export const InsightsScreen: React.FC<InsightsScreenProps> = ({ onNavigate }) => {
  const { articles, currentUser } = useApp();
  const [activeTool, setActiveTool] = useState<ToolTabId>('goal');
  const [selectedArticle, setSelectedArticle] = useState<InsightArticle | null>(null);

  const featuredArticle = articles.find((a) => a.featured) || articles[0];
  const gridArticles = articles.filter((a) => a.id !== featuredArticle?.id);

  return (
    <div id="insights-screen" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 md:py-16 space-y-12">
      
      {/* Header with Admin shortcut */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#d3e4fe] text-[#003461] px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#003461]" />
            Free Institutional Advisory & Wealth Suite
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#003461] mb-2">
            Financial Planning Tools & Research Desk
          </h1>
          <p className="text-sm sm:text-base text-[#424750] max-w-3xl leading-relaxed">
            Professional calculators for milestone goal mapping, systematic retirement withdrawals (SWP), home loan vs. SIP decisions, FIRE milestones, and capital gains tax planning.
          </p>
        </div>

        {currentUser?.role === 'admin' && (
          <button
            onClick={() => onNavigate('admin')}
            className="bg-[#003461] hover:bg-[#004b87] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 self-start md:self-auto cursor-pointer shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Manage & Write Articles</span>
          </button>
        )}
      </div>

      {/* 1. Interactive Tool Navigator Tabs */}
      <div className="space-y-6">
        <div className="bg-[#f7f9fb] border border-[#c2c6d1] rounded-2xl p-2 sm:p-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {WEALTH_TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => setActiveTool(tool.id)}
                  className={`p-3 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between gap-2 border ${
                    isActive
                      ? 'bg-[#003461] text-white border-[#003461] shadow-md scale-[1.02]'
                      : 'bg-white text-[#191c1e] border-[#e0e3e5] hover:bg-[#eceef0]'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isActive ? 'bg-white/20 text-[#96f6bd]' : 'bg-[#d3e4fe] text-[#003461]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block leading-tight">
                      {tool.label}
                    </span>
                    <span className={`text-[10px] line-clamp-1 mt-0.5 ${
                      isActive ? 'text-white/80' : 'text-[#727781]'
                    }`}>
                      {tool.tagline}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Render Selected Tool */}
        <div className="transition-all duration-300">
          {activeTool === 'goal' && <GoalPlanner onNavigate={onNavigate} />}
          {activeTool === 'swp' && <SwpCalculator onNavigate={onNavigate} />}
          {activeTool === 'loan-vs-sip' && <LoanVsSipArbitrage onNavigate={onNavigate} />}
          {activeTool === 'fire' && <FireCalculator onNavigate={onNavigate} />}
          {activeTool === 'tax' && <MfTaxEstimator onNavigate={onNavigate} />}
          {activeTool === 'emergency' && <EmergencyFundShield onNavigate={onNavigate} />}
        </div>
      </div>

      {/* 2. Research Desk Header */}
      <div className="pt-4 border-t border-[#c2c6d1]">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-[#003461]" />
          <h2 className="text-2xl font-extrabold text-[#003461]">
            Research Publications & Wealth Advisory Dispatches
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#424750]">
          Institutional investment insights, market commentary, and asset allocation papers authored by certified mutual fund specialists.
        </p>
      </div>

      {/* 3. Featured Lead Article */}
      {featuredArticle && (
        <div className="bg-white border border-[#c2c6d1] rounded-2xl p-6 sm:p-10 institutional-shadow grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="bg-[#93f3bb] text-[#007146] text-xs font-bold px-3 py-1 rounded-md">
              Lead Research Study
            </span>
            <h2
              onClick={() => setSelectedArticle(featuredArticle)}
              className="text-2xl sm:text-3xl font-extrabold text-[#191c1e] tracking-tight leading-tight cursor-pointer hover:text-[#003461] transition-colors"
            >
              {featuredArticle.title}
            </h2>
            <p className="text-sm sm:text-base text-[#424750] leading-relaxed">
              {featuredArticle.summary}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#727781] pt-2">
              <span className="font-semibold text-[#003461]">{featuredArticle.author}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {featuredArticle.readTime}</span>
              <span>•</span>
              <span>{featuredArticle.date}</span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#f7f9fb] border border-[#c2c6d1] rounded-xl p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#003461] uppercase tracking-wider">
                Key Strategic Takeaways
              </h4>
              <ul className="text-xs text-[#424750] space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006d42] mt-1.5 shrink-0" />
                  <span>Rupee-cost averaging minimizes timing risk during cyclical volatility.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006d42] mt-1.5 shrink-0" />
                  <span>Disciplined SIP step-ups compound wealth significantly faster than static SIPs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006d42] mt-1.5 shrink-0" />
                  <span>Strategic rebalancing into liquid debt mitigates retirement drawdowns.</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedArticle(featuredArticle)}
                className="flex-1 bg-white border border-[#c2c6d1] hover:bg-[#eceef0] text-[#003461] font-bold text-xs py-3 rounded-lg transition-colors text-center cursor-pointer"
              >
                Read Full Paper
              </button>
              <button
                onClick={() => onNavigate('calculators')}
                className="flex-1 bg-[#003461] hover:bg-[#004b87] text-white font-bold text-xs py-3 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Simulate SIP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Articles */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gridArticles.map((article) => (
            <article
              key={article.id}
              className="bg-white border border-[#c2c6d1] rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {article.imageUrl && (
                  <div className="w-full h-44 overflow-hidden bg-[#f7f9fb] border-b border-[#e0e3e5] relative group">
                    <img
                      src={article.imageUrl}
                      alt={article.imageAlt || article.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-2 left-2 bg-[#003461]/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {article.category}
                    </span>
                  </div>
                )}

                <div className="p-5 sm:p-6">
                  {!article.imageUrl && (
                    <div className="flex justify-between items-center mb-3">
                      <span className="bg-[#eceef0] text-[#003461] text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                        {article.category}
                      </span>
                      <span className="text-[11px] text-[#727781] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>
                  )}

                  {article.imageUrl && (
                    <div className="flex justify-between items-center mb-2 text-[11px] text-[#727781]">
                      <span>{article.author}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                    </div>
                  )}

                  <h3
                    onClick={() => setSelectedArticle(article)}
                    className="text-base sm:text-lg font-bold text-[#191c1e] mb-2 leading-snug cursor-pointer hover:text-[#003461] transition-colors"
                  >
                    {article.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#424750] leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>
                </div>
              </div>

              <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-[#eceef0] flex items-center justify-between">
                <span className="text-xs text-[#727781]">{article.date}</span>
                <button
                  onClick={() => setSelectedArticle(article)}
                  className="text-xs font-bold text-[#003461] hover:text-[#006d42] flex items-center gap-1 cursor-pointer"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Full Article Modal Reader */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-[#c2c6d1] max-h-[90vh] overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#e0e3e5] pb-4">
              <div className="flex items-center gap-2">
                <span className="bg-[#d3e4fe] text-[#003461] text-xs font-bold px-3 py-1 rounded-md">
                  {selectedArticle.category}
                </span>
                <span className="text-xs text-[#727781] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {selectedArticle.readTime}
                </span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1 text-[#727781] hover:text-[#191c1e] text-lg font-bold cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedArticle.imageUrl && (
              <div className="w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-[#e0e3e5] bg-[#f7f9fb]">
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.imageAlt || selectedArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#003461] leading-tight mb-3">
                {selectedArticle.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-[#727781] pb-4 border-b border-[#eceef0]">
                <span className="font-semibold text-[#191c1e]">{selectedArticle.author}</span>
                <span>•</span>
                <span>Published on {selectedArticle.date}</span>
              </div>
            </div>

            <div className="prose prose-sm max-w-none text-[#424750] leading-relaxed whitespace-pre-line space-y-4">
              <p className="font-medium text-base text-[#191c1e]">
                {selectedArticle.summary}
              </p>
              <div className="pt-2 text-sm leading-relaxed">
                {selectedArticle.content || `Modern portfolio theory underscores the importance of minimizing emotional friction when navigating cyclical drawdowns. By automating strategic allocations across low-tracking error index schemes and high-alpha diversified active funds, capital remains protected against inflation whilst capturing long-term corporate earnings compounding.`}
              </div>
            </div>

            <div className="p-4 bg-[#f7f9fb] border border-[#c2c6d1] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-[#003461]">Questions on this strategy?</div>
                <div className="text-xs text-[#727781]">Speak with our certified research analysts directly.</div>
              </div>
              <button
                onClick={() => {
                  setSelectedArticle(null);
                  onNavigate('booking');
                }}
                className="bg-[#003461] hover:bg-[#004b87] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors shrink-0 cursor-pointer"
              >
                Book 1-on-1 Discussion
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
