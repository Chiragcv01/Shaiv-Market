import React, { useState } from 'react';
import { ActiveScreen } from '../types';
import { InvestmentCalculator } from './InvestmentCalculator';
import { GoalPlanner } from './GoalPlanner';
import { SwpCalculator } from './SwpCalculator';
import { LoanVsSipArbitrage } from './LoanVsSipArbitrage';
import { FireCalculator } from './FireCalculator';
import { MfTaxEstimator } from './MfTaxEstimator';
import { EmergencyFundShield } from './EmergencyFundShield';
import {
  Calculator,
  TrendingUp,
  Target,
  Wallet,
  Scale,
  Flame,
  FileSpreadsheet,
  ShieldCheck,
  Zap,
  ArrowRight,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface CalculatorsScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

type CalculatorTab = 'sip' | 'goal' | 'swp' | 'loan-sip' | 'fire' | 'tax' | 'emergency';

export const CalculatorsScreen: React.FC<CalculatorsScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('sip');

  const tabs: { id: CalculatorTab; label: string; icon: any; tag?: string }[] = [
    { id: 'sip', label: 'SIP & Target Amount', icon: Calculator, tag: 'Popular' },
    { id: 'goal', label: 'Life Goal Planner', icon: Target },
    { id: 'swp', label: 'SWP Monthly Pension', icon: Wallet },
    { id: 'loan-sip', label: 'Loan Prepay vs SIP', icon: Scale, tag: 'High ROI' },
    { id: 'fire', label: 'FIRE Freedom Number', icon: Flame },
    { id: 'tax', label: 'MF Capital Gains Tax', icon: FileSpreadsheet, tag: 'New Budget' },
    { id: 'emergency', label: 'Emergency Cushion', icon: ShieldCheck }
  ];

  return (
    <div id="calculators-screen" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 md:py-16">
      
      {/* Header */}
      <div className="text-center md:text-left mb-8">
        <div className="inline-flex items-center gap-2 bg-[#d3e4fe] text-[#003461] px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-2">
          <Calculator className="w-4 h-4" />
          Smart Financial Planning Suite
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#003461] mb-2">
          Interactive Wealth & SIP Calculators
        </h1>
        <p className="text-sm sm:text-base text-[#424750] max-w-3xl leading-relaxed">
          Simulate monthly SIP compounding, reverse target SIP amounts, inflation-adjusted life goals, SWP pensions, and loan arbitrage with institutional precision and visual charts.
        </p>
      </div>

      {/* Calculator Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2 mb-8 border-b border-[#c2c6d1]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 rounded-t-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer border-b-2 relative ${
                isActive
                  ? 'bg-white text-[#003461] border-[#003461] shadow-xs'
                  : 'bg-transparent text-[#727781] border-transparent hover:text-[#003461] hover:bg-[#eceef0]/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#006d42]' : 'text-[#727781]'}`} />
              <span>{tab.label}</span>
              {tab.tag && (
                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-[#f0fdf4] text-[#006d42] border border-[#bbf7d0]' : 'bg-[#e0e3e5] text-[#424750]'
                }`}>
                  {tab.tag}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Calculator Component */}
      <div className="mb-14">
        {activeTab === 'sip' && (
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

        {activeTab === 'tax' && (
          <MfTaxEstimator
            onNavigate={onNavigate}
          />
        )}

        {activeTab === 'emergency' && (
          <EmergencyFundShield
            onNavigate={onNavigate}
          />
        )}
      </div>

      {/* Educational Guide Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white border border-[#c2c6d1] rounded-2xl p-6 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#d3e4fe] text-[#003461] flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#191c1e] mb-2">
            The Magic of Step-Up SIP
          </h3>
          <p className="text-xs text-[#424750] leading-relaxed mb-4">
            Increasing your monthly investment by just 10% each year as your income grows can nearly double your final retirement corpus over 15 years.
          </p>
          <div className="text-xs font-bold text-[#006d42]">
            Recommended: +10% annual step-up
          </div>
        </div>

        <div className="bg-white border border-[#c2c6d1] rounded-2xl p-6 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#93f3bb] text-[#007146] flex items-center justify-center mb-4">
            <Zap className="w-5 h-5 text-[#006d42]" />
          </div>
          <h3 className="text-base font-bold text-[#191c1e] mb-2">
            Rupee-Cost Averaging
          </h3>
          <p className="text-xs text-[#424750] leading-relaxed mb-4">
            SIP removes the psychological stress of timing market peaks and troughs by automatically purchasing more mutual fund units when valuations are low.
          </p>
          <div className="text-xs font-bold text-[#003461]">
            Protects against market volatility
          </div>
        </div>

        <div className="bg-white border border-[#c2c6d1] rounded-2xl p-6 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#d3e4fe] text-[#003461] flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#191c1e] mb-2">
            Tax Efficiency (LTCG)
          </h3>
          <p className="text-xs text-[#424750] leading-relaxed mb-4">
            Equity mutual fund gains held over 12 months qualify for long-term capital gains tax benefits, with the first ₹1.25 Lakh per financial year exempted.
          </p>
          <div className="text-xs font-bold text-[#006d42]">
            Section 112A compliant
          </div>
        </div>

      </div>

    </div>
  );
};
