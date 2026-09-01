import React, { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState<CalculatorTab>('required-sip');

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
      <div className="text-center md:text-left mb-8">
        <div className="inline-flex items-center gap-2 bg-[#d3e4fe] text-[#003461] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <Calculator className="w-4 h-4 text-[#006d42]" />
          Smart Financial Planning Suite
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#003461] mb-2">
          Interactive Wealth & SIP Calculators
        </h1>
        <p className="text-sm sm:text-base text-[#424750] max-w-3xl leading-relaxed">
          Easily calculate required monthly SIP amounts for your target goals, simulate compound wealth accumulation, plan SWP pensions, and evaluate loan prepayment vs. equity SIP returns.
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
      </div>

      {/* Educational Guide Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white border border-[#c2c6d1] rounded-2xl p-6 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#d3e4fe] text-[#003461] flex items-center justify-center mb-4">
            <Target className="w-5 h-5 text-[#003461]" />
          </div>
          <h3 className="text-base font-bold text-[#191c1e] mb-2">
            Target Goal Precision
          </h3>
          <p className="text-xs text-[#424750] leading-relaxed mb-4">
            Instead of arbitrary investing, calculate the exact monthly SIP needed to fund life milestones like a ₹1 Crore home downpayment or child higher education.
          </p>
          <div className="text-xs font-bold text-[#006d42]">
            Reverse SIP Compounder
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
            SIP removes the stress of timing market peaks by automatically purchasing more mutual fund units when valuations are lower.
          </p>
          <div className="text-xs font-bold text-[#003461]">
            Protects against volatility
          </div>
        </div>

        <div className="bg-white border border-[#c2c6d1] rounded-2xl p-6 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#d3e4fe] text-[#003461] flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5 text-[#006d42]" />
          </div>
          <h3 className="text-base font-bold text-[#191c1e] mb-2">
            The Power of Step-Up SIP
          </h3>
          <p className="text-xs text-[#424750] leading-relaxed mb-4">
            Increasing your monthly investment by just 10% annually with salary hikes can boost your final accumulated corpus by up to 80%.
          </p>
          <div className="text-xs font-bold text-[#006d42]">
            Accelerated Compounding
          </div>
        </div>

      </div>

    </div>
  );
};
