import React, { useState, useMemo } from 'react';
import { CalculatorType, ActiveScreen } from '../types';
import {
  calculateSIP,
  calculateLumpsum,
  calculateStepUpSIP,
  calculateSipPlusLumpsum,
  calculateTargetSip,
  formatIndianCurrency,
  formatRawIndianNumber
} from '../utils/calculator';
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Target,
  PieChart as PieIcon,
  LineChart as LineIcon,
  BarChart3,
  CheckCircle2,
  HelpCircle,
  Clock,
  Wallet
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface InvestmentCalculatorProps {
  onInvestNow?: (details: { type: CalculatorType; monthly: number; years: number; lumpsum?: number }) => void;
  onNavigate?: (screen: ActiveScreen) => void;
  onSelectFundForSIP?: (fundId: string) => void;
}

export const InvestmentCalculator: React.FC<InvestmentCalculatorProps> = ({
  onInvestNow,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<CalculatorType>('target-sip');
  const [chartMode, setChartMode] = useState<'growth' | 'bars' | 'donut'>('growth');

  // Regular SIP state
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(20000);
  const [expectedReturnRate, setExpectedReturnRate] = useState<number>(13.0);
  const [timePeriodYears, setTimePeriodYears] = useState<number>(15);
  
  // Target / Reverse SIP state ("Know Your SIP Amount")
  const [targetCorpus, setTargetCorpus] = useState<number>(10000000); // 1 Crore target default
  const [targetYears, setTargetYears] = useState<number>(15);
  const [targetReturnRate, setTargetReturnRate] = useState<number>(13.0);
  const [targetStepUp, setTargetStepUp] = useState<number>(0);

  // Lumpsum & Step-up states
  const [lumpsumAmount, setLumpsumAmount] = useState<number>(500000);
  const [stepUpPercent, setStepUpPercent] = useState<number>(10);

  // Quick Presets for Target Corpus
  const TARGET_PRESETS = [
    { label: '₹25 Lakhs', value: 2500000 },
    { label: '₹50 Lakhs', value: 5000000 },
    { label: '₹1 Crore', value: 10000000 },
    { label: '₹2.5 Crores', value: 25000000 },
    { label: '₹5 Crores', value: 50000000 }
  ];

  // Compute standard calculations
  const standardCalc = useMemo(() => {
    switch (activeTab) {
      case 'sip':
        return calculateSIP(monthlyInvestment, expectedReturnRate, timePeriodYears);
      case 'lumpsum':
        return calculateLumpsum(lumpsumAmount, expectedReturnRate, timePeriodYears);
      case 'step-up':
        return calculateStepUpSIP(monthlyInvestment, expectedReturnRate, timePeriodYears, stepUpPercent);
      case 'sip-lumpsum':
        return calculateSipPlusLumpsum(monthlyInvestment, lumpsumAmount, expectedReturnRate, timePeriodYears);
      default:
        return calculateSIP(monthlyInvestment, expectedReturnRate, timePeriodYears);
    }
  }, [activeTab, monthlyInvestment, expectedReturnRate, timePeriodYears, lumpsumAmount, stepUpPercent]);

  // Compute Target / Reverse SIP calculation
  const targetCalc = useMemo(() => {
    return calculateTargetSip(targetCorpus, targetYears, targetReturnRate, targetStepUp);
  }, [targetCorpus, targetYears, targetReturnRate, targetStepUp]);

  // Generate Year-by-Year Growth Chart Data
  const chartData = useMemo(() => {
    if (activeTab === 'target-sip') {
      return targetCalc.yearlyMilestones.map((m) => ({
        year: m.year,
        invested: m.invested,
        wealth: m.corpus,
        returns: m.gains,
        target: targetCorpus
      }));
    }

    const data = [];
    const monthlyRate = expectedReturnRate / 12 / 100;
    
    let currentInvested = 0;
    let currentTotal = 0;
    let currentMonthly = monthlyInvestment;

    if (activeTab === 'lumpsum' || activeTab === 'sip-lumpsum') {
      currentInvested = lumpsumAmount;
      currentTotal = lumpsumAmount;
    }

    for (let yr = 1; yr <= timePeriodYears; yr++) {
      if (activeTab === 'sip') {
        for (let m = 1; m <= 12; m++) {
          currentInvested += monthlyInvestment;
          currentTotal = (currentTotal + monthlyInvestment) * (1 + monthlyRate);
        }
      } else if (activeTab === 'lumpsum') {
        currentTotal = lumpsumAmount * Math.pow(1 + expectedReturnRate / 100, yr);
      } else if (activeTab === 'step-up') {
        for (let m = 1; m <= 12; m++) {
          currentInvested += currentMonthly;
          currentTotal = (currentTotal + currentMonthly) * (1 + monthlyRate);
        }
        currentMonthly = currentMonthly * (1 + stepUpPercent / 100);
      } else if (activeTab === 'sip-lumpsum') {
        for (let m = 1; m <= 12; m++) {
          currentInvested += monthlyInvestment;
          currentTotal = (currentTotal + monthlyInvestment) * (1 + monthlyRate);
        }
      }

      data.push({
        year: `Yr ${yr}`,
        invested: Math.round(currentInvested),
        wealth: Math.round(currentTotal),
        returns: Math.round(Math.max(0, currentTotal - currentInvested))
      });
    }

    return data;
  }, [activeTab, monthlyInvestment, expectedReturnRate, timePeriodYears, lumpsumAmount, stepUpPercent, targetCalc, targetCorpus]);

  // Donut chart dataset
  const donutData = useMemo(() => {
    if (activeTab === 'target-sip') {
      return [
        { name: 'Your Total Capital Outflow', value: targetCalc.totalInvested, color: '#003461' },
        { name: 'Compounded Market Gain', value: targetCalc.totalGains, color: '#006d42' }
      ];
    }
    return [
      { name: 'Your Total Invested', value: standardCalc.investedAmount, color: '#003461' },
      { name: 'Estimated Market Gains', value: standardCalc.estimatedReturns, color: '#006d42' }
    ];
  }, [activeTab, targetCalc, standardCalc]);

  const handleAction = () => {
    if (onInvestNow) {
      onInvestNow({
        type: activeTab,
        monthly: activeTab === 'target-sip' ? targetCalc.requiredMonthlySip : monthlyInvestment,
        years: activeTab === 'target-sip' ? targetYears : timePeriodYears,
        lumpsum: activeTab === 'lumpsum' || activeTab === 'sip-lumpsum' ? lumpsumAmount : undefined
      });
    } else if (onNavigate) {
      onNavigate('open-account');
    }
  };

  const formatTooltipValue = (val: any) => {
    return `₹ ${Number(val).toLocaleString('en-IN')}`;
  };

  return (
    <div id="investment-calculator" className="w-full">
      <div className="bg-[#ffffff] border border-[#c2c6d1] rounded-2xl shadow-sm overflow-hidden flex flex-col lg:flex-row">
        
        {/* Controls Area (Left / Top - 60% Width) */}
        <div className="w-full lg:w-7/12 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-[#c2c6d1]">
          
          {/* Main Navigation Tabs */}
          <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-none border-b border-[#e0e3e5]">
            <button
              id="calc-tab-target-sip"
              onClick={() => setActiveTab('target-sip')}
              className={`whitespace-nowrap px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'target-sip'
                  ? 'bg-[#003461] text-white shadow-xs'
                  : 'text-[#424750] bg-[#f0f4f8] hover:bg-[#e0e8f2] hover:text-[#003461]'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-[#96f6bd]" />
              <span>Know Your SIP (Target)</span>
            </button>

            <button
              id="calc-tab-sip"
              onClick={() => setActiveTab('sip')}
              className={`whitespace-nowrap px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${
                activeTab === 'sip'
                  ? 'bg-[#003461] text-white shadow-xs'
                  : 'text-[#424750] hover:bg-[#eceef0] hover:text-[#003461]'
              }`}
            >
              Monthly SIP
            </button>

            <button
              id="calc-tab-stepup"
              onClick={() => setActiveTab('step-up')}
              className={`whitespace-nowrap px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${
                activeTab === 'step-up'
                  ? 'bg-[#003461] text-white shadow-xs'
                  : 'text-[#424750] hover:bg-[#eceef0] hover:text-[#003461]'
              }`}
            >
              Step-up SIP (+10%)
            </button>

            <button
              id="calc-tab-lumpsum"
              onClick={() => setActiveTab('lumpsum')}
              className={`whitespace-nowrap px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${
                activeTab === 'lumpsum'
                  ? 'bg-[#003461] text-white shadow-xs'
                  : 'text-[#424750] hover:bg-[#eceef0] hover:text-[#003461]'
              }`}
            >
              Lumpsum One-Time
            </button>

            <button
              id="calc-tab-sip-lumpsum"
              onClick={() => setActiveTab('sip-lumpsum')}
              className={`whitespace-nowrap px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${
                activeTab === 'sip-lumpsum'
                  ? 'bg-[#003461] text-white shadow-xs'
                  : 'text-[#424750] hover:bg-[#eceef0] hover:text-[#003461]'
              }`}
            >
              SIP + Lumpsum
            </button>
          </div>

          {/* TAB 1: KNOW YOUR SIP AMOUNT (TARGET CORPUS CALCULATOR) */}
          {activeTab === 'target-sip' && (
            <div className="space-y-6">
              
              <div className="p-3.5 bg-[#d3e4fe]/60 border border-[#b8d5fc] rounded-xl flex items-start gap-2.5">
                <Target className="w-5 h-5 text-[#003461] shrink-0 mt-0.5" />
                <div className="text-xs text-[#003461] leading-relaxed">
                  <span className="font-bold">Reverse Goal Planner:</span> Set your dream wealth target (e.g. ₹1 Crore, ₹50 Lakhs) and time frame. We compute the exact monthly SIP amount needed to hit your milestone!
                </div>
              </div>

              {/* Target Corpus Slider & Presets */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="slider-target-corpus" className="text-sm sm:text-base font-bold text-[#191c1e] flex items-center gap-1.5">
                    <span>Target Dream Wealth Corpus</span>
                  </label>
                  <div className="bg-[#003461] px-3.5 py-1 rounded-md text-sm sm:text-base font-extrabold text-white shadow-2xs">
                    {formatIndianCurrency(targetCorpus)}
                  </div>
                </div>

                <input
                  id="slider-target-corpus"
                  type="range"
                  min="500000"
                  max="100000000"
                  step="500000"
                  value={targetCorpus}
                  onChange={(e) => setTargetCorpus(Number(e.target.value))}
                  aria-label="Target Corpus Amount"
                  className="w-full h-2 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer accent-[#003461]"
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] text-[#727781] mr-1 self-center">Presets:</span>
                  {TARGET_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setTargetCorpus(preset.value)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer border ${
                        targetCorpus === preset.value
                          ? 'bg-[#003461] text-white border-[#003461]'
                          : 'bg-white text-[#424750] border-[#c2c6d1] hover:bg-[#eceef0]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid: Target Years & Expected Return Rate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Target Years */}
                <div className="space-y-1.5 bg-[#f7f9fb] p-3.5 rounded-xl border border-[#e0e3e5]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#424750]">Time Horizon (Years)</span>
                    <span className="font-extrabold text-[#003461] bg-white px-2 py-0.5 rounded border border-[#c2c6d1]">
                      {targetYears} Years
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={targetYears}
                    onChange={(e) => setTargetYears(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer accent-[#003461]"
                  />
                  <div className="flex justify-between text-[10px] text-[#727781]">
                    <span>1 Yr</span>
                    <span>10 Yrs</span>
                    <span>30 Yrs</span>
                  </div>
                </div>

                {/* Expected Return Rate */}
                <div className="space-y-1.5 bg-[#f7f9fb] p-3.5 rounded-xl border border-[#e0e3e5]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#424750]">Expected CAGR (p.a.)</span>
                    <span className="font-extrabold text-[#006d42] bg-white px-2 py-0.5 rounded border border-[#c2c6d1]">
                      {targetReturnRate}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="20"
                    step="0.5"
                    value={targetReturnRate}
                    onChange={(e) => setTargetReturnRate(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer accent-[#006d42]"
                  />
                  <div className="flex justify-between text-[10px] text-[#727781]">
                    <span>8% (Debt)</span>
                    <span>13% (Equity Avg)</span>
                    <span>20% (Aggressive)</span>
                  </div>
                </div>

              </div>

              {/* Step-up Option Toggle / Slider */}
              <div className="space-y-2 bg-[#f7f9fb] p-3.5 rounded-xl border border-[#e0e3e5]">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#424750]">
                    Annual Step-up Increment ({targetStepUp > 0 ? `+${targetStepUp}% every year` : 'No Step-up (Flat SIP)'})
                  </span>
                  <span className="font-bold text-[#003461] bg-white px-2 py-0.5 rounded border border-[#c2c6d1]">
                    {targetStepUp}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="5"
                  value={targetStepUp}
                  onChange={(e) => setTargetStepUp(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer accent-[#003461]"
                />
                <div className="flex justify-between text-[10px] text-[#727781]">
                  <span>0% (Flat SIP)</span>
                  <span>+10% (Salary Linked)</span>
                  <span>+20%</span>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2, 3, 4, 5: REGULAR SIP, STEP-UP, LUMPSUM, SIP+LUMPSUM */}
          {activeTab !== 'target-sip' && (
            <div className="space-y-6">
              
              {/* Monthly Investment Slider */}
              {(activeTab === 'sip' || activeTab === 'step-up' || activeTab === 'sip-lumpsum') && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="slider-monthly" className="text-sm sm:text-base font-bold text-[#191c1e]">
                      Monthly SIP Investment
                    </label>
                    <div className="bg-[#003461] px-3.5 py-1 rounded-md text-sm sm:text-base font-extrabold text-white shadow-2xs">
                      ₹ {formatRawIndianNumber(monthlyInvestment)} / mo
                    </div>
                  </div>
                  <input
                    id="slider-monthly"
                    type="range"
                    min="1000"
                    max="200000"
                    step="1000"
                    value={monthlyInvestment}
                    onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                    aria-label="Monthly Investment Amount"
                    className="w-full h-2 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer accent-[#003461]"
                  />
                  <div className="flex justify-between text-[11px] font-semibold text-[#727781]">
                    <span>₹1,000</span>
                    <span>₹50,000</span>
                    <span>₹2 Lakh+</span>
                  </div>
                </div>
              )}

              {/* Lumpsum Amount Slider */}
              {(activeTab === 'lumpsum' || activeTab === 'sip-lumpsum') && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="slider-lumpsum" className="text-sm sm:text-base font-bold text-[#191c1e]">
                      {activeTab === 'sip-lumpsum' ? 'Initial One-time Lumpsum Base' : 'One-time Investment Capital'}
                    </label>
                    <div className="bg-[#003461] px-3.5 py-1 rounded-md text-sm sm:text-base font-extrabold text-white shadow-2xs">
                      ₹ {formatRawIndianNumber(lumpsumAmount)}
                    </div>
                  </div>
                  <input
                    id="slider-lumpsum"
                    type="range"
                    min="10000"
                    max="5000000"
                    step="10000"
                    value={lumpsumAmount}
                    onChange={(e) => setLumpsumAmount(Number(e.target.value))}
                    aria-label="Lumpsum Investment Amount"
                    className="w-full h-2 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer accent-[#003461]"
                  />
                  <div className="flex justify-between text-[11px] font-semibold text-[#727781]">
                    <span>₹10,000</span>
                    <span>₹25 Lakhs</span>
                    <span>₹50 Lakhs+</span>
                  </div>
                </div>
              )}

              {/* Step-up Rate Slider */}
              {activeTab === 'step-up' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="slider-stepup" className="text-sm sm:text-base font-bold text-[#191c1e]">
                      Annual Step-up Rate (% increase every year)
                    </label>
                    <div className="bg-[#e6e8ea] px-3 py-1 rounded-md border border-[#c2c6d1] text-sm sm:text-base font-bold text-[#003461]">
                      +{stepUpPercent}% yearly
                    </div>
                  </div>
                  <input
                    id="slider-stepup"
                    type="range"
                    min="5"
                    max="30"
                    step="5"
                    value={stepUpPercent}
                    onChange={(e) => setStepUpPercent(Number(e.target.value))}
                    aria-label="Annual Step-up Rate"
                    className="w-full h-2 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer accent-[#003461]"
                  />
                  <div className="flex justify-between text-[11px] font-semibold text-[#727781]">
                    <span>5%</span>
                    <span>10% (Standard Salary Growth)</span>
                    <span>30%</span>
                  </div>
                </div>
              )}

              {/* Expected Return Rate Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="slider-return" className="text-sm sm:text-base font-bold text-[#191c1e]">
                    Expected Return Rate (CAGR p.a.)
                  </label>
                  <div className="bg-[#e6e8ea] px-3 py-1 rounded-md border border-[#c2c6d1] text-sm sm:text-base font-bold text-[#006d42]">
                    {expectedReturnRate}% p.a.
                  </div>
                </div>
                <input
                  id="slider-return"
                  type="range"
                  min="6"
                  max="24"
                  step="0.5"
                  value={expectedReturnRate}
                  onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
                  aria-label="Expected Annual Return Rate"
                  className="w-full h-2 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer accent-[#006d42]"
                />
                <div className="flex justify-between text-[11px] font-semibold text-[#727781]">
                  <span>6% (FD/Debt)</span>
                  <span>12% - 15% (Equity MF Average)</span>
                  <span>24% (High Alpha)</span>
                </div>
              </div>

              {/* Time Period Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="slider-period" className="text-sm sm:text-base font-bold text-[#191c1e]">
                    Investment Time Horizon
                  </label>
                  <div className="bg-[#e6e8ea] px-3 py-1 rounded-md border border-[#c2c6d1] text-sm sm:text-base font-bold text-[#003461]">
                    {timePeriodYears} {timePeriodYears === 1 ? 'Year' : 'Years'}
                  </div>
                </div>
                <input
                  id="slider-period"
                  type="range"
                  min="1"
                  max="35"
                  step="1"
                  value={timePeriodYears}
                  onChange={(e) => setTimePeriodYears(Number(e.target.value))}
                  aria-label="Investment Time Period in Years"
                  className="w-full h-2 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer accent-[#003461]"
                />
                <div className="flex justify-between text-[11px] font-semibold text-[#727781]">
                  <span>1 Year</span>
                  <span>15 Years (Optimal Compounding)</span>
                  <span>35 Years</span>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Visual Charts & Results Area (Right / Bottom - 50% Width) */}
        <div className="w-full lg:w-5/12 bg-[#f7f9fb] p-6 sm:p-8 flex flex-col justify-between">
          
          {/* Chart Header & Mode Switcher */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#003461] flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#006d42]" />
                Interactive Visual Simulation
              </span>

              <div className="flex bg-[#e0e3e5] p-0.5 rounded-lg border border-[#c2c6d1]">
                <button
                  type="button"
                  onClick={() => setChartMode('growth')}
                  className={`px-2 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    chartMode === 'growth' ? 'bg-[#003461] text-white shadow-2xs' : 'text-[#424750]'
                  }`}
                  title="Growth Curve"
                >
                  <LineIcon className="w-3 h-3" />
                  <span>Growth</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChartMode('bars')}
                  className={`px-2 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    chartMode === 'bars' ? 'bg-[#003461] text-white shadow-2xs' : 'text-[#424750]'
                  }`}
                  title="Yearly Bars"
                >
                  <BarChart3 className="w-3 h-3" />
                  <span>Bars</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChartMode('donut')}
                  className={`px-2 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    chartMode === 'donut' ? 'bg-[#003461] text-white shadow-2xs' : 'text-[#424750]'
                  }`}
                  title="Donut Allocation"
                >
                  <PieIcon className="w-3 h-3" />
                  <span>Split</span>
                </button>
              </div>
            </div>

            {/* Visual Chart Canvas */}
            <div className="w-full h-52 bg-white border border-[#c2c6d1] rounded-xl p-2.5 shadow-2xs flex items-center justify-center">
              {chartMode === 'growth' && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="wealthGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#006d42" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#006d42" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#003461" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#003461" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#727781' }} />
                    <YAxis
                      tick={{ fontSize: 9, fill: '#727781' }}
                      tickFormatter={(val) => val >= 10000000 ? `₹${(val / 10000000).toFixed(1)}Cr` : `₹${(val / 100000).toFixed(0)}L`}
                    />
                    <Tooltip formatter={formatTooltipValue} />
                    <Area
                      type="monotone"
                      dataKey="wealth"
                      name="Total Wealth Created"
                      stroke="#006d42"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#wealthGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="invested"
                      name="Your Total Invested"
                      stroke="#003461"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#investedGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}

              {chartMode === 'bars' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#727781' }} />
                    <YAxis
                      tick={{ fontSize: 9, fill: '#727781' }}
                      tickFormatter={(val) => val >= 10000000 ? `₹${(val / 10000000).toFixed(1)}Cr` : `₹${(val / 100000).toFixed(0)}L`}
                    />
                    <Tooltip formatter={formatTooltipValue} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '2px' }} />
                    <Bar dataKey="invested" name="Invested Capital" fill="#003461" stackId="a" />
                    <Bar dataKey="returns" name="Compounded Gain" fill="#006d42" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {chartMode === 'donut' && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="48%"
                      innerRadius={46}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={formatTooltipValue} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '2px' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Metrics Summary Cards */}
          <div className="w-full space-y-2.5 my-4">
            
            {/* HERO METRIC: TARGET SIP VS REGULAR MATURITY */}
            {activeTab === 'target-sip' ? (
              <>
                <div className="p-4 bg-[#003461] text-white rounded-xl shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-[#96f6bd] uppercase tracking-wider block">
                      Required Monthly SIP Amount
                    </span>
                    <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                      ₹ {formatRawIndianNumber(targetCalc.requiredMonthlySip)}
                      <span className="text-xs font-normal text-white/80 ml-1">/ month</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded text-[11px] font-extrabold bg-[#93f3bb] text-[#005231]">
                      Target {formatIndianCurrency(targetCorpus)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-white border border-[#c2c6d1] rounded-xl">
                    <span className="text-[10px] text-[#727781] font-bold block">Your Total Capital</span>
                    <span className="text-xs sm:text-sm font-bold text-[#003461]">
                      {formatIndianCurrency(targetCalc.totalInvested)}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white border border-[#c2c6d1] rounded-xl">
                    <span className="text-[10px] text-[#727781] font-bold block">Compounded Gain</span>
                    <span className="text-xs sm:text-sm font-bold text-[#006d42]">
                      {formatIndianCurrency(targetCalc.totalGains)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 bg-[#003461] text-white rounded-xl shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-medium text-white/80 uppercase tracking-wider block">
                      Projected Maturity Corpus
                    </span>
                    <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#96f6bd]">
                      {formatIndianCurrency(standardCalc.totalValue)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded text-[10px] font-extrabold bg-white/20 uppercase tracking-wider text-white">
                      {(standardCalc.totalValue / (standardCalc.investedAmount || 1)).toFixed(1)}x Growth
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-white border border-[#c2c6d1] rounded-xl">
                    <span className="text-[10px] text-[#727781] font-bold block">Total Capital Invested</span>
                    <span className="text-xs sm:text-sm font-bold text-[#003461]">
                      {formatIndianCurrency(standardCalc.investedAmount)}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white border border-[#c2c6d1] rounded-xl">
                    <span className="text-[10px] text-[#727781] font-bold block">Estimated Wealth Gain</span>
                    <span className="text-xs sm:text-sm font-bold text-[#006d42]">
                      {formatIndianCurrency(standardCalc.estimatedReturns)}
                    </span>
                  </div>
                </div>
              </>
            )}

          </div>

          {/* CTA Action */}
          <button
            id="calc-invest-now-btn"
            onClick={handleAction}
            className="w-full bg-[#006d42] hover:bg-[#005231] active:bg-[#002647] text-white font-bold text-xs sm:text-sm py-3 px-5 rounded-xl shadow-xs hover:shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Start Disciplined SIP with Shaiv Market</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
