import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { takePendingTab } from '../utils/deepLink';
import { routeForPath, pathForScreen, CALC_ROUTES } from '../seo/routes';
import { currentPath } from '../seo/ssr';
import { applyHead } from '../seo/head';
import { CALC_FAQ } from '../seo/faq';
import { FaqSection } from './interactive/FaqSection';
import { ActiveScreen } from '../types';
import { RequiredSipCalculator } from './RequiredSipCalculator';
import { InvestmentCalculator } from './InvestmentCalculator';
import { GoalPlanner } from './GoalPlanner';
import { SwpCalculator } from './SwpCalculator';
import { LoanVsSipArbitrage } from './LoanVsSipArbitrage';
import { FireCalculator } from './FireCalculator';
import { EmergencyFundShield } from './EmergencyFundShield';
import {
  Calculator,
  TrendingUp,
  Target,
  Wallet,
  Scale,
  Flame,
  ShieldCheck,
  Zap,
  ArrowRight,
  HelpCircle,
  Sparkles,
  Calendar
} from 'lucide-react';

interface CalculatorsScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

type CalculatorTab = 'required-sip' | 'sip-compounder' | 'goal' | 'swp' | 'loan-sip' | 'fire' | 'emergency';

export const CalculatorsScreen: React.FC<CalculatorsScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<CalculatorTab>(() => (routeForPath(currentPath()).tab as CalculatorTab) || (takePendingTab() as CalculatorTab) || 'required-sip');

  // keep the URL on /calculators/<calculator> so each calculator is its own indexable page
  const firstSync = React.useRef(true);
  React.useEffect(() => {
    const target = pathForScreen('calculators', activeTab);
    const here = window.location.pathname;
    if (!here.startsWith('/calculators')) return;
    if (firstSync.current) {
      firstSync.current = false;
      if (here === target || (activeTab === 'required-sip' && here === '/calculators')) return;
    }
    if (here !== target) window.history.replaceState({}, '', target);
    applyHead(routeForPath(target));
  }, [activeTab]);
  React.useEffect(() => {
    const onTab = (e: Event) => setActiveTab((e as CustomEvent).detail as CalculatorTab);
    window.addEventListener('sm:tab', onTab);
    return () => window.removeEventListener('sm:tab', onTab);
  }, []);
  const calcMeta = CALC_ROUTES.find((c) => c.tab === activeTab);

  const tabs: { id: CalculatorTab; label: string; icon: any; tag?: string }[] = [
    { id: 'required-sip', label: 'Know Required SIP Amount', icon: Target, tag: 'Goal Target' },
    { id: 'sip-compounder', label: 'SIP Wealth Compounder', icon: Calculator, tag: 'Popular' },
    { id: 'goal', label: 'Life Goal Planner', icon: TrendingUp },
    { id: 'swp', label: 'SWP Monthly Pension', icon: Wallet },
    { id: 'loan-sip', label: 'Home Loan vs SIP', icon: Scale, tag: 'High ROI' },
    { id: 'fire', label: 'FIRE Freedom Calculator', icon: Flame },
    { id: 'emergency', label: 'Emergency Safety Buffer', icon: ShieldCheck }
  ];

  return (
    <div id="calculators-screen" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 md:py-16">
      
      {/* Header */}
      <div className="mb-8 max-w-3xl">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#0F2740] leading-[1.05]">
          {currentPath() === '/calculators' && activeTab === 'required-sip' ? 'Free SIP, SWP and goal calculators' : calcMeta?.name}
        </h1>
        <p className="mt-2 font-display text-xl text-[#3F6E96]">Seven calculators. Pick a question, move the sliders, get your number.</p>
        <p className="mt-3 text-base text-[#43566B] leading-relaxed">
          From "how much SIP do I need?" to "should I prepay my home loan?". Every result is illustrative, at the return you choose.
        </p>
      </div>

      {/* Calculator tabs with a sliding highlight */}
      <div role="tablist" aria-label="Calculators" className="flex gap-1.5 overflow-x-auto scrollbar-none p-1.5 mb-8 rounded-2xl bg-[#EEF3F8]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shrink-0 cursor-pointer transition-colors
                focus-visible:outline-2 focus-visible:outline-[#E3B65C] ${isActive ? 'text-white' : 'text-[#43566B] hover:text-[#0F2740]'}`}
            >
              {isActive && (
                <motion.span layoutId="calc-tab" className="absolute inset-0 rounded-xl bg-[#0F2740] shadow-md"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }} />
              )}
              <Icon className={`relative w-4 h-4 ${isActive ? 'text-[#E3B65C]' : 'text-[#6B7C8F]'}`} />
              <span className="relative whitespace-nowrap">{tab.label}</span>
              {tab.tag && (
                <span className={`relative text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-[#E3B65C] text-[#0F2740]' : 'bg-white text-[#8A6420]'}`}>
                  {tab.tag}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Calculator Component */}
      <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        className="mb-14"
        initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
        transition={{ duration: 0.25 }}
      >
        {activeTab === 'required-sip' && (
          <RequiredSipCalculator
            onNavigate={onNavigate}
            onStartSip={() => onNavigate('open-account')}
          />
        )}

        {activeTab === 'sip-compounder' && (
          <InvestmentCalculator
            onNavigate={onNavigate}
            onInvestNow={() => onNavigate('open-account')}
          />
        )}

        {activeTab === 'goal' && (
          <GoalPlanner
            onNavigate={onNavigate}
            onPlanGoal={() => onNavigate('open-account')}
          />
        )}

        {activeTab === 'swp' && (
          <SwpCalculator
            onNavigate={onNavigate}
          />
        )}

        {activeTab === 'loan-sip' && (
          <LoanVsSipArbitrage
            onNavigate={onNavigate}
          />
        )}

        {activeTab === 'fire' && (
          <FireCalculator
            onNavigate={onNavigate}
          />
        )}

        {activeTab === 'emergency' && (
          <EmergencyFundShield
            onNavigate={onNavigate}
          />
        )}
      </motion.div>
      </AnimatePresence>

      {/* Questions people ask about this calculator */}
      {CALC_FAQ[activeTab]?.length > 0 && (
        <FaqSection compact id="calc-faq" items={CALC_FAQ[activeTab]} title={`${calcMeta?.name}: common questions`} />
      )}

      {/* Educational Guide Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white border border-[#D3DCE6] rounded-2xl p-6 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#E3ECF5] text-[#0F2740] flex items-center justify-center mb-4">
            <Target className="w-5 h-5 text-[#0F2740]" />
          </div>
          <h3 className="text-base font-bold text-[#13263B] mb-2">
            Target Goal Precision
          </h3>
          <p className="text-xs text-[#43566B] leading-relaxed mb-4">
            Instead of arbitrary investing, calculate the exact monthly SIP needed to fund life milestones like a ₹1 Crore home downpayment or child higher education.
          </p>
          <div className="text-xs font-bold text-[#8A6420]">
            Reverse SIP Compounder
          </div>
        </div>

        <div className="bg-white border border-[#D3DCE6] rounded-2xl p-6 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#F3D58E] text-[#8A6420] flex items-center justify-center mb-4">
            <Zap className="w-5 h-5 text-[#8A6420]" />
          </div>
          <h3 className="text-base font-bold text-[#13263B] mb-2">
            Rupee-Cost Averaging
          </h3>
          <p className="text-xs text-[#43566B] leading-relaxed mb-4">
            SIP removes the stress of timing market peaks by automatically purchasing more mutual fund units when valuations are lower.
          </p>
          <div className="text-xs font-bold text-[#0F2740]">
            Protects against volatility
          </div>
        </div>

        <div className="bg-white border border-[#D3DCE6] rounded-2xl p-6 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#E3ECF5] text-[#0F2740] flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5 text-[#8A6420]" />
          </div>
          <h3 className="text-base font-bold text-[#13263B] mb-2">
            The Power of Step-Up SIP
          </h3>
          <p className="text-xs text-[#43566B] leading-relaxed mb-4">
            Increasing your monthly investment by just 10% annually with salary hikes can boost your final accumulated corpus by up to 80%.
          </p>
          <div className="text-xs font-bold text-[#8A6420]">
            Accelerated Compounding
          </div>
        </div>

      </div>

    </div>
  );
};
