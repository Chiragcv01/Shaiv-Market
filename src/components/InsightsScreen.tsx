import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { takePendingTab } from '../utils/deepLink';
import { ActiveScreen, InsightArticle } from '../types';
import { ArticleCover } from './visuals/ArticleCover';
import { useApp } from '../context/AppContext';
import { GoalPlanner } from './GoalPlanner';
import { RequiredSipCalculator } from './RequiredSipCalculator';
import { SwpCalculator } from './SwpCalculator';
import { LoanVsSipArbitrage } from './LoanVsSipArbitrage';
import { FireCalculator } from './FireCalculator';
import { EmergencyFundShield } from './EmergencyFundShield';
import {
  Target,
  Wallet,
  Scale,
  Flame,
  ShieldCheck,
  BookOpen,
  Clock,
  ArrowRight,
  SlidersHorizontal,
  X,
  Sparkles,
  Layers,
  Calculator
} from 'lucide-react';

interface InsightsScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

type ToolTabId = 'required-sip' | 'goal' | 'swp' | 'loan-vs-sip' | 'fire' | 'emergency';

interface ToolMeta {
  id: ToolTabId;
  label: string;
  shortLabel: string;
  icon: any;
  tagline: string;
}

const WEALTH_TOOLS: ToolMeta[] = [
  {
    id: 'required-sip',
    label: 'Required SIP Amount',
    shortLabel: 'Target SIP',
    icon: Target,
    tagline: 'Calculate SIP needed for your dream corpus'
  },
  {
    id: 'goal',
    label: 'Goal Planner',
    shortLabel: 'Life Goals',
    icon: Sparkles,
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
    id: 'emergency',
    label: 'Emergency Shield',
    shortLabel: 'Safety Buffer',
    icon: ShieldCheck,
    tagline: 'Liquid & Overnight Reserve Strategy'
  }
];

export const InsightsScreen: React.FC<InsightsScreenProps> = ({ onNavigate }) => {
  const { articles, currentUser } = useApp();
  const [activeTool, setActiveTool] = useState<ToolTabId>(() => (takePendingTab() as ToolTabId) || 'goal');
  const [selectedArticle, setSelectedArticle] = useState<InsightArticle | null>(null);

  const featuredArticle = articles.find((a) => a.featured) || articles[0];
  const gridArticles = articles.filter((a) => a.id !== featuredArticle?.id);

  return (
    <div id="goal-planner-screen" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 md:py-16 space-y-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#0F2740] leading-[1.05] mb-3">
            Plan a goal. See the exact monthly amount it needs.
          </h1>
          <p className="text-sm sm:text-base text-[#43566B] max-w-3xl leading-relaxed">
            Scientifically map your life milestones: Child education, dream home down payment, early retirement corpus, and systematic monthly pension cash flows.
          </p>
        </div>

        {currentUser?.role === 'admin' && (
          <button
            onClick={() => onNavigate('admin')}
            className="bg-[#0F2740] hover:bg-[#1D4268] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 self-start md:self-auto cursor-pointer shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Manage Content</span>
          </button>
        )}
      </div>

      {/* 1. Interactive Tool Navigator Tabs */}
      <div className="space-y-6">
        <div className="bg-[#F6F8FB] border border-[#D3DCE6] rounded-2xl p-2 sm:p-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {WEALTH_TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => setActiveTool(tool.id)}
                  role="tab"
                  aria-selected={isActive}
                  className={`relative p-3 rounded-xl text-left transition-colors cursor-pointer flex flex-col justify-between gap-2 border focus-visible:outline-2 focus-visible:outline-[#E3B65C] ${
                    isActive
                      ? 'text-white border-transparent'
                      : 'bg-white text-[#13263B] border-[#E4EAF0] hover:bg-[#EDF1F5]'
                  }`}
                >
                  {isActive && (
                    <motion.span layoutId="tool-tab" className="absolute inset-0 rounded-xl bg-[#0F2740] shadow-lg"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }} />
                  )}
                  <div className={`relative w-8 h-8 rounded-lg flex items-center justify-center ${
                    isActive ? 'bg-white/20 text-[#F3D58E]' : 'bg-[#E3ECF5] text-[#0F2740]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="relative">
                    <div className="font-bold text-xs sm:text-sm line-clamp-1">{tool.label}</div>
                    <div className={`text-[10px] line-clamp-1 ${isActive ? 'text-[#E3ECF5]' : 'text-[#6B7C8F]'}`}>
                      {tool.tagline}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Tool Renderer */}
        <AnimatePresence mode="wait">
        <motion.div
          key={activeTool}
          className="mt-6"
          initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
          transition={{ duration: 0.25 }}
        >
          {activeTool === 'required-sip' && (
            <RequiredSipCalculator
              onNavigate={onNavigate}
              onStartSip={() => onNavigate('open-account')}
            />
          )}

          {activeTool === 'goal' && (
            <GoalPlanner
              onNavigate={onNavigate}
              onPlanGoal={() => onNavigate('open-account')}
            />
          )}

          {activeTool === 'swp' && (
            <SwpCalculator
              onNavigate={onNavigate}
            />
          )}

          {activeTool === 'loan-vs-sip' && (
            <LoanVsSipArbitrage
              onNavigate={onNavigate}
            />
          )}

          {activeTool === 'fire' && (
            <FireCalculator
              onNavigate={onNavigate}
            />
          )}

          {activeTool === 'emergency' && (
            <EmergencyFundShield
              onNavigate={onNavigate}
            />
          )}
        </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. Educational Research Articles & Wealth Guides */}
      {articles.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-[#E4EAF0]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F2740]">
                Wealth Strategies & Compounding Guides
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7C8F]">
                Educational analysis on rupee-cost averaging, asset allocation, and goal discipline.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="bg-white border border-[#D3DCE6] hover:border-[#0F2740] rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                {(
                  <div className="w-full h-36 overflow-hidden bg-[#F6F8FB] border-b border-[#E4EAF0]">
                    {art.imageUrl ? (<img
                      src={art.imageUrl}
                      alt={art.imageAlt || art.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />) : (<ArticleCover seed={art.id} />)}
                  </div>
                )}
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-[#E3ECF5] text-[#0F2740] rounded">
                      {art.category}
                    </span>
                    <span className="text-[10px] text-[#6B7C8F] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {art.readTime}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[#13263B] line-clamp-2 hover:text-[#0F2740]">
                    {art.title}
                  </h3>
                  <p className="text-xs text-[#43566B] line-clamp-3 leading-relaxed">
                    {art.summary}
                  </p>
                </div>
                <div className="px-5 py-3 bg-[#F6F8FB] border-t border-[#EDF1F5] flex items-center justify-between text-xs text-[#6B7C8F]">
                  <span>{art.author}</span>
                  <span className="text-[#8A6420] font-semibold flex items-center gap-1">
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-[#D3DCE6] relative space-y-6">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#EDF1F5] hover:bg-[#E4EAF0] text-[#13263B] flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {(
              <div className="w-full h-56 rounded-2xl overflow-hidden bg-[#F6F8FB] border border-[#E4EAF0]">
                {selectedArticle.imageUrl ? (<img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.imageAlt || selectedArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />) : (<ArticleCover seed={selectedArticle.id} />)}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#E3ECF5] text-[#0F2740] text-xs font-bold px-3 py-0.5 rounded-full">
                  {selectedArticle.category}
                </span>
                <span className="text-xs text-[#6B7C8F]">• {selectedArticle.date}</span>
                <span className="text-xs text-[#6B7C8F]">• {selectedArticle.readTime}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2740]">
                {selectedArticle.title}
              </h2>
              <p className="text-xs text-[#6B7C8F] mt-1">Author: {selectedArticle.author}</p>
            </div>

            <div className="text-sm text-[#43566B] leading-relaxed whitespace-pre-line space-y-4 border-t border-[#E4EAF0] pt-4">
              {selectedArticle.content || selectedArticle.summary}
            </div>

            <div className="pt-4 border-t border-[#E4EAF0] flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2.5 bg-[#0F2740] text-white text-xs font-bold rounded-xl"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
