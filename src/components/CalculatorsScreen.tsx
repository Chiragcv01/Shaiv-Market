import React from 'react';
import { ActiveScreen } from '../types';
import { InvestmentCalculator } from './InvestmentCalculator';
import {
  Calculator,
  TrendingUp,
  Percent,
  Calendar,
  ShieldCheck,
  Zap,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

interface CalculatorsScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const CalculatorsScreen: React.FC<CalculatorsScreenProps> = ({ onNavigate }) => {
  return (
    <div id="calculators-screen" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 md:py-16">
      
      {/* Header */}
      <div className="text-center md:text-left mb-8 md:mb-12">
        <div className="inline-flex items-center gap-2 bg-[#d3e4fe] text-[#003461] px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-2">
          <Calculator className="w-4 h-4" />
          Financial Planning Suite
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#003461] mb-2">
          Wealth Growth & SIP Calculators
        </h1>
        <p className="text-base text-[#424750] max-w-3xl leading-relaxed">
          Simulate monthly SIP compounding, lump sum returns, and annual step-up increments with real-time institutional growth models.
        </p>
      </div>

      {/* Main Calculator */}
      <div className="mb-14">
        <InvestmentCalculator
          onNavigate={onNavigate}
          onInvestNow={() => onNavigate('open-account')}
        />
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
