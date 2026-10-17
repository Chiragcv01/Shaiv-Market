import React, { useState, useMemo } from 'react';
import {
  calculateLoanVsSip,
  formatIndianCurrency,
  formatRawIndianNumber
} from '../utils/calculator';
import { ActiveScreen } from '../types';
import { SmartNumberInput } from './SmartNumberInput';
import {
  Scale,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  HelpCircle,
  BookOpen,
  Sparkles,
  Calculator,
  Percent,
  Clock,
  Wallet,
  Zap,
  ArrowUpRight,
  Flame,
  Info,
  ChevronRight,
  Layers,
  Award,
  Check,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line
} from 'recharts';

interface LoanVsSipProps {
  onNavigate?: (screen: ActiveScreen) => void;
}

export const LoanVsSipArbitrage: React.FC<LoanVsSipProps> = ({ onNavigate }) => {
  // Navigation tabs within this module
  const [activeTab, setActiveTab] = useState<'simulator' | 'explainer' | 'decision-guide' | 'faqs'>('simulator');

  // Input states
  const [loanAmount, setLoanAmount] = useState<number>(4500000); // ₹45 Lakhs
  const [interestRate, setInterestRate] = useState<number>(8.75); // 8.75% home loan rate
  const [tenureYears, setTenureYears] = useState<number>(15); // 15 years
  const [extraMonthlySavings, setExtraMonthlySavings] = useState<number>(15000); // Extra ₹15,000
  const [expectedMfReturn, setExpectedMfReturn] = useState<number>(13.0); // 13.0% MF CAGR
  const [strategyMode, setStrategyMode] = useState<'compare' | 'prepay' | 'sip' | 'hybrid'>('compare');
  const [chartView, setChartView] = useState<'comparison' | 'timeline'>('timeline');

  // Calculation results
  const result = useMemo(() => {
    return calculateLoanVsSip(
      loanAmount,
      interestRate,
      tenureYears,
      extraMonthlySavings,
      expectedMfReturn
    );
  }, [loanAmount, interestRate, tenureYears, extraMonthlySavings, expectedMfReturn]);

  // Crossover Year calculation (Year when SIP wealth > Remaining Loan in Strategy 2)
  const crossoverData = useMemo(() => {
    const monthlyLoanRate = interestRate / (12 * 100);
    const monthlySipRate = expectedMfReturn / (12 * 100);
    let remainingNormalLoan = loanAmount;
    let accumulatedSip = 0;
    let crossoverYear = -1;

    for (let y = 1; y <= tenureYears; y++) {
      for (let m = 1; m <= 12; m++) {
        const intPortion = remainingNormalLoan * monthlyLoanRate;
        const princPortion = result.regularEMI - intPortion;
        remainingNormalLoan = Math.max(0, remainingNormalLoan - princPortion);
        accumulatedSip = (accumulatedSip + extraMonthlySavings) * (1 + monthlySipRate);
      }
      if (accumulatedSip >= remainingNormalLoan && crossoverYear === -1) {
        crossoverYear = y;
      }
    }

    return {
      crossoverYear: crossoverYear === -1 ? Math.ceil(tenureYears * 0.6) : crossoverYear,
      crossoverSipValue: accumulatedSip,
      crossoverLoanValue: remainingNormalLoan
    };
  }, [loanAmount, interestRate, tenureYears, extraMonthlySavings, expectedMfReturn, result.regularEMI]);

  // Timeline dataset for Area Chart
  const timelineData = useMemo(() => {
    return result.comparisonChart.map((item) => ({
      year: `Yr ${item.year}`,
      loanBalance: item.loanRemainingStrategy1,
      sipWealth: item.sipCorpusStrategy2
    }));
  }, [result.comparisonChart]);

  // Comparison Bar Chart Dataset
  const comparisonData = useMemo(() => [
    {
      strategy: 'Option A: Prepay Loan',
      benefit: Math.round(result.interestSaved),
      label: `Interest Saved: ${formatIndianCurrency(result.interestSaved)}`,
      color: '#ba1a1a'
    },
    {
      strategy: 'Option B: Mutual Fund SIP',
      benefit: Math.round(result.sipMaturityWealth),
      label: `SIP Corpus Built: ${formatIndianCurrency(result.sipMaturityWealth)}`,
      color: '#006d42'
    }
  ], [result]);

  return (
    <div id="loan-vs-sip-card" className="w-full bg-white border border-[#c2c6d1] rounded-3xl shadow-xs overflow-hidden space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-[#f0f4f9] via-[#f7f9fb] to-[#e8f1ff] border-b border-[#c2c6d1]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#d3e4fe] text-[#003461] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Scale className="w-3.5 h-3.5 text-[#006d42]" />
              <span>Smart Financial Arbitrage Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#003461] tracking-tight">
              Prepay Home Loan or Invest in SIP?
            </h2>
            <p className="text-xs sm:text-sm text-[#424750] mt-1 max-w-3xl">
              Understand the exact mathematical difference between clearing your loan early vs compounding your surplus savings in an Equity Mutual Fund.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-[#c2c6d1] shadow-2xs self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('simulator')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-[#003461] text-white shadow-xs'
                  : 'text-[#424750] hover:text-[#191c1e] hover:bg-[#f0f2f4]'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Live Simulator</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('explainer')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'explainer'
                  ? 'bg-[#003461] text-white shadow-xs'
                  : 'text-[#424750] hover:text-[#191c1e] hover:bg-[#f0f2f4]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#006d42]" />
              <span>Simple Explainer Story</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('decision-guide')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'decision-guide'
                  ? 'bg-[#003461] text-white shadow-xs'
                  : 'text-[#424750] hover:text-[#191c1e] hover:bg-[#f0f2f4]'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Decision Guide</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('faqs')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'faqs'
                  ? 'bg-[#003461] text-white shadow-xs'
                  : 'text-[#424750] hover:text-[#191c1e] hover:bg-[#f0f2f4]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FAQs</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: LIVE SIMULATOR & INTERACTIVE CALCULATOR */}
      {/* ======================================================== */}
      {activeTab === 'simulator' && (
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Quick Concept Summary Bar */}
          <div className="p-4 bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#006d42] text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-[#006d42] block text-sm">
                  The Core Financial Arbitrage Rule:
                </span>
                <span className="text-[#424750]">
                  Home Loan costs <strong>{interestRate}%</strong> interest, while Equity SIP compounds at <strong>{expectedMfReturn}%</strong>. The net spread of <strong>+{(expectedMfReturn - interestRate).toFixed(2)}%</strong> creates massive compound wealth.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('explainer')}
              className="text-[#006d42] font-extrabold hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span>See visual story</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left Controls (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Loan Amount */}
              <SmartNumberInput
                id="loan-amount"
                label="Home Loan Outstanding Amount"
                value={loanAmount}
                onChange={(val) => setLoanAmount(val)}
                min={500000}
                max={30000000}
                step={100000}
                isCurrency={true}
                icon={<Building className="w-4 h-4 text-[#003461]" />}
                minLabel="₹5 Lakh"
                midLabel="₹50 Lakh"
                maxLabel="₹3 Crore"
                themeColor="blue"
                presets={[
                  { label: '₹25 Lakh', value: 2500000 },
                  { label: '₹45 Lakh', value: 4500000 },
                  { label: '₹75 Lakh', value: 7500000 },
                  { label: '₹1.2 Crore', value: 12000000 }
                ]}
                helperText="Type any exact value like 4500000 or 50 Lakh"
              />

              {/* Grid: Interest Rate & Loan Tenure */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Interest Rate */}
                <SmartNumberInput
                  id="loan-interest-rate"
                  label="Loan Interest Rate (p.a.)"
                  value={interestRate}
                  onChange={(val) => setInterestRate(val)}
                  min={7.0}
                  max={13.0}
                  step={0.1}
                  suffix="%"
                  icon={<Percent className="w-4 h-4 text-[#ba1a1a]" />}
                  minLabel="7% (Repo Base)"
                  maxLabel="13% (NBFC/High)"
                  themeColor="amber"
                  presets={[
                    { label: '8.50%', value: 8.50 },
                    { label: '8.75%', value: 8.75 },
                    { label: '9.25%', value: 9.25 }
                  ]}
                />

                {/* Remaining Tenure */}
                <SmartNumberInput
                  id="loan-tenure-years"
                  label="Remaining Loan Tenure"
                  value={tenureYears}
                  onChange={(val) => setTenureYears(Math.max(1, val))}
                  min={1}
                  max={30}
                  step={1}
                  suffix=" Yrs"
                  icon={<Clock className="w-4 h-4 text-[#003461]" />}
                  minLabel="1 Yr"
                  maxLabel="30 Yrs"
                  themeColor="blue"
                  presets={[
                    { label: '10 Yrs', value: 10 },
                    { label: '15 Yrs', value: 15 },
                    { label: '20 Yrs', value: 20 }
                  ]}
                />

              </div>

              {/* Regular EMI Info Badge */}
              <div className="p-3 bg-[#f7f9fb] border border-[#e0e3e5] rounded-xl flex items-center justify-between text-xs">
                <span className="text-[#424750] font-medium">Calculated Regular Monthly EMI:</span>
                <span className="font-extrabold text-[#003461] font-mono text-sm bg-white px-2.5 py-0.5 rounded border border-[#c2c6d1]">
                  ₹{formatRawIndianNumber(result.regularEMI)} / mo
                </span>
              </div>

              {/* Extra Monthly Savings Surplus */}
              <SmartNumberInput
                id="loan-extra-savings"
                label="Extra Monthly Surplus Savings (for Prepay or SIP)"
                value={extraMonthlySavings}
                onChange={(val) => setExtraMonthlySavings(val)}
                min={2000}
                max={200000}
                step={1000}
                isCurrency={true}
                icon={<Wallet className="w-4 h-4 text-[#006d42]" />}
                minLabel="₹2,000/mo"
                midLabel="₹25,000/mo"
                maxLabel="₹2 Lakh/mo"
                themeColor="green"
                presets={[
                  { label: '₹5,000/mo', value: 5000 },
                  { label: '₹10,000/mo', value: 10000 },
                  { label: '₹15,000/mo', value: 15000 },
                  { label: '₹25,000/mo', value: 25000 }
                ]}
                helperText="Amount you have left after paying regular EMI each month."
              />

              {/* Expected Mutual Fund Return */}
              <SmartNumberInput
                id="loan-mf-return"
                label="Expected Mutual Fund SIP Return (CAGR)"
                value={expectedMfReturn}
                onChange={(val) => setExpectedMfReturn(val)}
                min={9.0}
                max={16.0}
                step={0.5}
                suffix="%"
                icon={<TrendingUp className="w-4 h-4 text-[#006d42]" />}
                minLabel="9% (Conservative)"
                midLabel="13% (Equity Average)"
                maxLabel="16% (High Alpha)"
                themeColor="green"
                presets={[
                  { label: '11% (Balanced)', value: 11 },
                  { label: '13% (Flexicap)', value: 13 },
                  { label: '15% (Midcap)', value: 15 }
                ]}
              />

            </div>

            {/* Right Verdict, Comparison & Timeline Chart (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Verdict Hero Card */}
              <div className="bg-gradient-to-br from-[#003461] to-[#00203d] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-5">
                <div className="absolute top-0 right-0 w-72 h-72 bg-[#006d42] rounded-full blur-3xl opacity-25 -mr-20 -mt-20 pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#96f6bd] bg-white/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-[#96f6bd]" />
                      Mathematical Winner: {result.verdict}
                    </span>
                    <span className="text-xs text-[#d3e4fe]">
                      Horizon: {tenureYears} Years
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                      Investing in Mutual Fund SIP gives{' '}
                      <span className="text-[#96f6bd]">
                        +{formatIndianCurrency(result.netWealthAdvantage)}
                      </span>{' '}
                      Extra Net Wealth!
                    </h3>
                    <p className="text-xs sm:text-sm text-[#d3e4fe] mt-2 leading-relaxed">
                      While prepaying saves <span className="text-white font-bold">{formatIndianCurrency(result.interestSaved)}</span> in bank interest, investing that same ₹{extraMonthlySavings.toLocaleString('en-IN')}/mo in an equity SIP creates a staggering <span className="text-[#96f6bd] font-bold">{formatIndianCurrency(result.sipMaturityWealth)}</span> corpus!
                    </p>
                  </div>

                  {/* Golden Milestone: Crossover Point */}
                  <div className="bg-white/10 border border-white/20 rounded-2xl p-4 flex items-start gap-3 text-xs">
                    <div className="w-8 h-8 rounded-lg bg-[#96f6bd] text-[#003461] flex items-center justify-center shrink-0 font-extrabold text-sm">
                      Yr {crossoverData.crossoverYear}
                    </div>
                    <div>
                      <span className="font-extrabold text-[#96f6bd] text-sm block">
                        Golden Crossover Freedom Point (Year {crossoverData.crossoverYear})
                      </span>
                      <p className="text-[#d3e4fe] mt-0.5 leading-snug">
                        By Year {crossoverData.crossoverYear}, your SIP portfolio value will surpass your entire remaining home loan! You have the complete freedom to prepay the remaining loan in 1 click or let it keep compounding.
                      </p>
                    </div>
                  </div>

                  {/* Dual Strategy Comparison Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    
                    {/* Strategy A */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-1.5">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-300 block">
                        Strategy A: Prepay Loan
                      </span>
                      <div className="text-lg font-black text-white">
                        {result.prepayTenureYears} Yrs <span className="text-xs font-normal text-rose-200">({result.yearsSaved} yrs early)</span>
                      </div>
                      <div className="text-xs text-[#d3e4fe] flex justify-between">
                        <span>Interest Saved:</span>
                        <span className="font-bold text-white">{formatIndianCurrency(result.interestSaved)}</span>
                      </div>
                      <div className="text-xs text-[#d3e4fe] flex justify-between">
                        <span>Wealth Created:</span>
                        <span className="font-bold text-rose-300">₹0 (All in bricks)</span>
                      </div>
                    </div>

                    {/* Strategy B */}
                    <div className="bg-[#006d42]/30 border border-[#96f6bd]/30 rounded-xl p-3.5 space-y-1.5">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#96f6bd] block">
                        Strategy B: Invest in SIP
                      </span>
                      <div className="text-lg font-black text-[#96f6bd]">
                        {formatIndianCurrency(result.sipMaturityWealth)} <span className="text-xs font-normal text-white">Corpus</span>
                      </div>
                      <div className="text-xs text-[#d3e4fe] flex justify-between">
                        <span>Your SIP Capital:</span>
                        <span className="font-bold text-white">{formatIndianCurrency(result.sipInvestedAmount)}</span>
                      </div>
                      <div className="text-xs text-[#d3e4fe] flex justify-between">
                        <span>Pure Compounded Gain:</span>
                        <span className="font-bold text-[#96f6bd]">+{formatIndianCurrency(result.sipNetProfit)}</span>
                      </div>
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => onNavigate?.('open-account')}
                      className="flex-1 min-w-[200px] bg-[#006d42] hover:bg-[#005231] text-white font-extrabold text-xs sm:text-sm py-3.5 px-5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <span>Start This SIP With Us</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate?.('booking')}
                      className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5 text-[#96f6bd]" />
                      <span>Book Strategy Call</span>
                    </button>
                  </div>

                </div>
              </div>

              {/* Visual Comparative Charts */}
              <div className="bg-[#f7f9fb] border border-[#c2c6d1] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-[#003461] flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-[#006d42]" />
                    <span>Visual Arbitrage Simulation</span>
                  </div>
                  
                  {/* Chart view selector */}
                  <div className="flex items-center gap-1 bg-[#eceef0] p-1 rounded-lg border border-[#c2c6d1] text-xs">
                    <button
                      type="button"
                      onClick={() => setChartView('timeline')}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                        chartView === 'timeline' ? 'bg-[#003461] text-white shadow-2xs' : 'text-[#424750]'
                      }`}
                    >
                      Timeline Growth
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartView('comparison')}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                        chartView === 'comparison' ? 'bg-[#003461] text-white shadow-2xs' : 'text-[#424750]'
                      }`}
                    >
                      Net Financial Benefit
                    </button>
                  </div>
                </div>

                {chartView === 'timeline' ? (
                  <div className="h-64 sm:h-72 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="sipGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#006d42" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#006d42" stopOpacity={0.0} />
                          </linearGradient>
                          <linearGradient id="loanGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ba1a1a" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#ba1a1a" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="year" stroke="#727781" fontSize={11} />
                        <YAxis
                          stroke="#727781"
                          fontSize={11}
                          tickFormatter={(v) => v >= 10000000 ? `₹${(v / 10000000).toFixed(1)}Cr` : `₹${(v / 100000).toFixed(0)}L`}
                        />
                        <Tooltip
                          formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                          contentStyle={{
                            backgroundColor: '#003461',
                            borderRadius: '12px',
                            color: '#fff',
                            border: 'none',
                            fontSize: '12px'
                          }}
                        />
                        <Legend
                          verticalAlign="top"
                          height={32}
                          formatter={(val) => <span className="text-xs font-semibold text-[#191c1e]">{val}</span>}
                        />
                        <Area
                          type="monotone"
                          dataKey="sipWealth"
                          name="Strategy B: SIP Wealth Corpus"
                          stroke="#006d42"
                          strokeWidth={2.5}
                          fill="url(#sipGrad)"
                        />
                        <Area
                          type="monotone"
                          dataKey="loanBalance"
                          name="Strategy A: Prepay Remaining Loan Balance"
                          stroke="#ba1a1a"
                          strokeWidth={2}
                          fill="url(#loanGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 sm:h-72 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comparisonData} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
                        <XAxis dataKey="strategy" stroke="#191c1e" fontSize={12} fontWeight={600} />
                        <YAxis
                          stroke="#727781"
                          fontSize={11}
                          tickFormatter={(v) => v >= 10000000 ? `₹${(v / 10000000).toFixed(1)}Cr` : `₹${(v / 100000).toFixed(0)}L`}
                        />
                        <Tooltip
                          formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Net Financial Value']}
                          contentStyle={{
                            backgroundColor: '#003461',
                            borderRadius: '12px',
                            color: '#fff',
                            border: 'none',
                            fontSize: '12px'
                          }}
                        />
                        <Bar dataKey="benefit" name="Net Financial Value (₹)" radius={[8, 8, 0, 0]}>
                          {comparisonData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: STEP-BY-STEP SIMPLE EXPLAINER (STORY MODE) */}
      {/* ======================================================== */}
      {activeTab === 'explainer' && (
        <div className="p-6 sm:p-8 space-y-8 animate-in fade-in">
          
          {/* Story Introduction Header */}
          <div className="max-w-3xl space-y-2">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#003461]">
              The Story of Two Friends: Rahul vs. Priya
            </h3>
            <p className="text-xs sm:text-sm text-[#424750] leading-relaxed">
              Both Rahul and Priya took a <strong>₹45 Lakh Home Loan</strong> at <strong>8.75% interest for 15 years</strong> (Regular EMI: ~₹45,000/month). Both had an extra <strong>₹15,000/month surplus savings</strong>. See what happened when they chose different paths.
            </p>
          </div>

          {/* 3 Step Visual Story Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="bg-[#f7f9fb] border border-[#c2c6d1] rounded-2xl p-5 space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-[#ba1a1a] text-white flex items-center justify-center font-black text-lg">
                1
              </div>
              <h4 className="text-base font-extrabold text-[#191c1e]">
                Rahul Chooses: Loan Prepayment
              </h4>
              <p className="text-xs text-[#424750] leading-relaxed">
                Rahul puts his extra ₹15,000 every month into his home loan (paying ₹60,000/mo).
              </p>
              <div className="bg-white p-3 rounded-xl border border-[#e0e3e5] space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#727781]">Loan closed in:</span>
                  <span className="font-bold text-[#006d42]">9.5 Years (5.5 yrs early)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#727781]">Total Interest Saved:</span>
                  <span className="font-bold text-[#006d42]">~₹16.5 Lakhs</span>
                </div>
                <div className="flex justify-between border-t border-[#e0e3e5] pt-1">
                  <span className="text-[#727781]">Liquid Wealth at Yr 15:</span>
                  <span className="font-bold text-rose-600">₹0 (Only flat ownership)</span>
                </div>
              </div>
              <div className="text-[11px] text-rose-700 font-semibold bg-rose-50 p-2 rounded-lg border border-rose-200">
                ⚠️ Rahul is debt-free earlier, but his savings were locked inside concrete walls with zero liquidity.
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#f0fdf4] border-2 border-[#bbf7d0] rounded-2xl p-5 space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-[#006d42] text-white flex items-center justify-center font-black text-lg">
                2
              </div>
              <h4 className="text-base font-extrabold text-[#006d42]">
                Priya Chooses: Equity SIP Arbitrage
              </h4>
              <p className="text-xs text-[#424750] leading-relaxed">
                Priya pays her normal EMI (₹45,000) and invests her extra ₹15,000 into a Flexi-cap Mutual Fund SIP compounding at ~13% CAGR.
              </p>
              <div className="bg-white p-3 rounded-xl border border-[#bbf7d0] space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#727781]">Total Invested in SIP:</span>
                  <span className="font-bold text-[#191c1e]">₹27.0 Lakhs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#727781]">SIP Maturity at Yr 15:</span>
                  <span className="font-extrabold text-[#006d42]">~₹81.8 Lakhs</span>
                </div>
                <div className="flex justify-between border-t border-[#bbf7d0] pt-1">
                  <span className="text-[#727781]">Pure Wealth Gain:</span>
                  <span className="font-extrabold text-[#006d42]">+₹54.8 Lakhs</span>
                </div>
              </div>
              <div className="text-[11px] text-[#006d42] font-semibold bg-[#d1fae5] p-2 rounded-lg border border-[#a7f3d0]">
                ✨ Priya built an ₹81.8 Lakh liquid portfolio AND claimed up to ₹2 Lakh/year in Sec 24(b) tax deductions!
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#d3e4fe]/40 border border-[#b8d5fc] rounded-2xl p-5 space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-[#003461] text-white flex items-center justify-center font-black text-lg">
                3
              </div>
              <h4 className="text-base font-extrabold text-[#003461]">
                The Grand Finale Comparison
              </h4>
              <p className="text-xs text-[#424750] leading-relaxed">
                At Year 15, both Rahul and Priya own their house 100% debt-free. But look at their bank accounts:
              </p>
              <div className="bg-white p-3 rounded-xl border border-[#b8d5fc] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#727781]">Rahul&apos;s Bank Balance:</span>
                  <span className="font-bold text-[#191c1e]">Saved ₹16.5L in interest</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#727781]">Priya&apos;s Bank Balance:</span>
                  <span className="font-bold text-[#006d42]">₹81.8 Lakhs Cash in Mutual Funds</span>
                </div>
                <div className="flex justify-between border-t border-[#b8d5fc] pt-1.5 font-extrabold text-[#003461] text-sm">
                  <span>Priya&apos;s Net Advantage:</span>
                  <span className="text-[#006d42]">+₹38.3 Lakhs richer!</span>
                </div>
              </div>
              <div className="text-[11px] text-[#003461] font-medium bg-white/80 p-2 rounded-lg border border-[#b8d5fc]">
                💡 <strong>Key Takeaway:</strong> Debt is fixed interest (~8.75%), but equity compounding (~13%) creates exponential wealth over 10-15 years.
              </div>
            </div>

          </div>

          {/* Golden Rule Explainer Banner */}
          <div className="bg-[#003461] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#96f6bd] uppercase tracking-wider">
                Why does this happen?
              </span>
              <h4 className="text-lg sm:text-xl font-bold">
                The Power of Compounding Spread (+4.25% Net Margin)
              </h4>
              <p className="text-xs sm:text-sm text-[#d3e4fe] max-w-2xl leading-relaxed">
                When you prepay a home loan, your effective return is capped at the loan interest rate (8.75%). When you invest in a disciplined equity SIP, you compound at 12-14%. Over a decade, that 4-5% annual compounding difference creates millions in surplus wealth.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('simulator')}
              className="px-6 py-3.5 bg-[#006d42] hover:bg-[#005231] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
            >
              Simulate Your Own Loan Numbers
            </button>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: DECISION RULEBOOK (WHEN TO PREPAY VS SIP) */}
      {/* ======================================================== */}
      {activeTab === 'decision-guide' && (
        <div className="p-6 sm:p-8 space-y-8 animate-in fade-in">
          
          <div className="max-w-3xl space-y-2">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#003461]">
              Should You Prepay or Invest? Complete Rulebook
            </h3>
            <p className="text-xs sm:text-sm text-[#424750]">
              While math favors SIP, emotional comfort and loan types also matter. Use this checklist to choose what is right for your life stage.
            </p>
          </div>

          {/* Two-Column Comparison Rulebook */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* When to PREPAY */}
            <div className="bg-[#fff5f5] border-2 border-[#fecaca] rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#ba1a1a] text-white flex items-center justify-center font-bold">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#ba1a1a]">
                    When You SHOULD Prepay Your Loan
                  </h4>
                  <span className="text-xs text-[#727781]">High interest, low risk appetite, or near retirement</span>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-[#191c1e]">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#ba1a1a] shrink-0 mt-0.5" />
                  <span><strong>High-Cost Debt:</strong> Personal loans (12-16%) or credit card dues (36-42%) must ALWAYS be prepaid first.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#ba1a1a] shrink-0 mt-0.5" />
                  <span><strong>Approaching Retirement (&lt;5 Yrs):</strong> You should enter retirement 100% debt-free without active EMIs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#ba1a1a] shrink-0 mt-0.5" />
                  <span><strong>Severe Stress / Anxiety:</strong> If having debt gives you sleepless nights, debt freedom is worth the math sacrifice.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#ba1a1a] shrink-0 mt-0.5" />
                  <span><strong>No Tax Benefit:</strong> If you are under the New Tax Regime and cannot claim Section 24(b) interest deduction.</span>
                </li>
              </ul>
            </div>

            {/* When to INVEST IN SIP */}
            <div className="bg-[#f0fdf4] border-2 border-[#bbf7d0] rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#006d42] text-white flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#006d42]">
                    When You SHOULD Invest in Mutual Fund SIP
                  </h4>
                  <span className="text-xs text-[#727781]">Long horizon, young investor, wealth maximizer</span>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-[#191c1e]">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#006d42] shrink-0 mt-0.5" />
                  <span><strong>Low-Interest Home Loan (&lt;9%):</strong> Home loans are the cheapest leverage in India.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#006d42] shrink-0 mt-0.5" />
                  <span><strong>Time Horizon &gt; 7 Years:</strong> Gives equity compounding full power to outpace debt rates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#006d42] shrink-0 mt-0.5" />
                  <span><strong>Section 24(b) Tax Deductions:</strong> Save up to ₹60,000/yr in income tax on your home loan interest.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#006d42] shrink-0 mt-0.5" />
                  <span><strong>Emergency Liquidity:</strong> Money put into a loan cannot be withdrawn if you lose a job, but an SIP portfolio can be redeemed anytime!</span>
                </li>
              </ul>
            </div>

          </div>

          {/* The 50:50 Hybrid Strategy Recommendation */}
          <div className="bg-[#f7f9fb] border border-[#c2c6d1] rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-[#003461] font-bold text-sm">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>The Financial Planner&apos;s Secret: The 50:50 Golden Hybrid</span>
            </div>
            <p className="text-xs text-[#424750] leading-relaxed">
              If you are torn between emotional debt freedom and mathematical wealth: <strong>Split your surplus 50:50!</strong>
              <br />
              For example, with ₹15,000 extra per month: Put <strong>₹7,500 towards loan principal reduction</strong> and <strong>₹7,500 into an Equity Mutual Fund SIP</strong>. You reduce your loan tenure by ~3.5 years while simultaneously building a ₹40+ Lakh investment fund!
            </p>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: FREQUENTLY ASKED QUESTIONS */}
      {/* ======================================================== */}
      {activeTab === 'faqs' && (
        <div className="p-6 sm:p-8 space-y-4 animate-in fade-in">
          <div className="max-w-3xl space-y-1 mb-6">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#003461]">
              Frequently Asked Questions (Loan vs SIP)
            </h3>
            <p className="text-xs sm:text-sm text-[#424750]">
              Common doubts, tax impacts, and liquidity questions clarified.
            </p>
          </div>

          <div className="space-y-3">
            
            <div className="bg-[#f7f9fb] p-4 rounded-xl border border-[#e0e3e5] space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-[#003461]">
                1. What if the stock market crashes during my loan tenure?
              </h4>
              <p className="text-xs text-[#424750] leading-relaxed">
                Short-term market volatility is normal. Over a 10 to 15-year loan tenure, Indian equity indices (Nifty 50) have never delivered negative returns over rolling 7+ year periods, averaging 12-14% CAGR. SIP also allows you to buy more units when markets are down (Rupee Cost Averaging).
              </p>
            </div>

            <div className="bg-[#f7f9fb] p-4 rounded-xl border border-[#e0e3e5] space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-[#003461]">
                2. Can I use my Mutual Fund SIP corpus to close the loan later?
              </h4>
              <p className="text-xs text-[#424750] leading-relaxed">
                <strong>Yes, absolutely!</strong> In fact, this is the smartest strategy. Because SIP compounds faster than loan amortisation, around Year 7-9 (the Crossover Point), your SIP fund will exceed your remaining loan balance. You can redeem and close the loan in one cheque if you wish!
              </p>
            </div>

            <div className="bg-[#f7f9fb] p-4 rounded-xl border border-[#e0e3e5] space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-[#003461]">
                3. What is the tax benefit advantage under Section 24(b)?
              </h4>
              <p className="text-xs text-[#424750] leading-relaxed">
                Under the Old Tax Regime, you can deduct up to ₹2,00,000 per year on home loan interest paid. In a 30% tax bracket, this saves you ~₹62,400 in cash taxes every single year. Prepaying your loan early kills this tax shield.
              </p>
            </div>

            <div className="bg-[#f7f9fb] p-4 rounded-xl border border-[#e0e3e5] space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-[#003461]">
                4. What about personal loans or car loans? Should I prepay them?
              </h4>
              <p className="text-xs text-[#424750] leading-relaxed">
                <strong>Always prepay personal loans and credit cards immediately.</strong> Personal loans charge 12-16% interest with no tax deduction. Only cheap, tax-deductible debt like Home Loans (8.5-9%) should be kept running alongside SIPs.
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
