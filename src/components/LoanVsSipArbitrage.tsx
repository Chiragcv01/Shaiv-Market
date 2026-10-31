import React, { useState, useMemo } from 'react';
import { WhatsAppResultButton } from './calc/kit';
import { formatINRShort as inr } from '../utils/money';
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
      prepayWealth: item.sipCorpusStrategy1,
      sipWealth: item.sipCorpusStrategy2
    }));
  }, [result.comparisonChart]);

  // Comparison Bar Chart Dataset
  const comparisonData = useMemo(() => [
    {
      strategy: 'Option A: Prepay, then SIP',
      benefit: Math.round(result.prepayThenInvestWealth),
      label: `Wealth after ${tenureYears} yrs: ${formatIndianCurrency(result.prepayThenInvestWealth)}`,
      color: '#ba1a1a'
    },
    {
      strategy: 'Option B: SIP from day one',
      benefit: Math.round(result.sipMaturityWealth),
      label: `Wealth after ${tenureYears} yrs: ${formatIndianCurrency(result.sipMaturityWealth)}`,
      color: '#8A6420'
    }
  ], [result, tenureYears]);

  return (
    <div id="loan-vs-sip-card" className="w-full bg-white border border-[#D3DCE6] rounded-3xl shadow-xs overflow-hidden space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-[#f0f4f9] via-[#F6F8FB] to-[#EEF3F8] border-b border-[#D3DCE6]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#E3ECF5] text-[#0F2740] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Scale className="w-3.5 h-3.5 text-[#8A6420]" />
              <span>Smart Financial Arbitrage Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2740] tracking-tight">
              Prepay Home Loan or Invest in SIP?
            </h2>
            <p className="text-xs sm:text-sm text-[#43566B] mt-1 max-w-3xl">
              Understand the exact mathematical difference between clearing your loan early vs compounding your surplus savings in an Equity Mutual Fund.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-[#D3DCE6] shadow-2xs self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('simulator')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-[#0F2740] text-white shadow-xs'
                  : 'text-[#43566B] hover:text-[#13263B] hover:bg-[#EEF2F6]'
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
                  ? 'bg-[#0F2740] text-white shadow-xs'
                  : 'text-[#43566B] hover:text-[#13263B] hover:bg-[#EEF2F6]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#8A6420]" />
              <span>Simple Explainer Story</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('decision-guide')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'decision-guide'
                  ? 'bg-[#0F2740] text-white shadow-xs'
                  : 'text-[#43566B] hover:text-[#13263B] hover:bg-[#EEF2F6]'
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
                  ? 'bg-[#0F2740] text-white shadow-xs'
                  : 'text-[#43566B] hover:text-[#13263B] hover:bg-[#EEF2F6]'
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
          <div className="p-4 bg-[#FBF6EA] border border-[#F6E7C1] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#8A6420] text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-[#8A6420] block text-sm">
                  The one rule that decides it:
                </span>
                <span className="text-[#43566B]">
                  Your loan costs <strong>{interestRate}%</strong>. You are assuming the SIP earns <strong>{expectedMfReturn}%</strong>. If the SIP really beats the loan rate over the whole period, investing wins; if it doesn't, prepaying wins. Only the loan rate is certain.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('explainer')}
              className="text-[#8A6420] font-extrabold hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
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
                icon={<Building className="w-4 h-4 text-[#0F2740]" />}
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
              <div className="grid grid-cols-1 gap-4">
                
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
                  icon={<Clock className="w-4 h-4 text-[#0F2740]" />}
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
              <div className="p-3 bg-[#F6F8FB] border border-[#E4EAF0] rounded-xl flex items-center justify-between text-xs">
                <span className="text-[#43566B] font-medium">Calculated Regular Monthly EMI:</span>
                <span className="font-extrabold text-[#0F2740] font-mono text-sm bg-white px-2.5 py-0.5 rounded border border-[#D3DCE6]">
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
                icon={<Wallet className="w-4 h-4 text-[#8A6420]" />}
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
                max={15.0}
                step={0.5}
                suffix="%"
                icon={<TrendingUp className="w-4 h-4 text-[#8A6420]" />}
                minLabel="9%"
                midLabel="12% (Equity, assumed)"
                maxLabel="15%"
                themeColor="green"
                presets={[
                  { label: '11% (Balanced)', value: 11 },
                  { label: '13% (Flexicap)', value: 13 },
                  { label: '15%', value: 15 }
                ]}
              />

            </div>

            {/* Right Verdict, Comparison & Timeline Chart (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Verdict Hero Card */}
              <div className="bg-gradient-to-br from-[#0F2740] to-[#00203d] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-5">
                <div className="absolute top-0 right-0 w-72 h-72 bg-[#8A6420] rounded-full blur-3xl opacity-25 -mr-20 -mt-20 pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#F3D58E] bg-white/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-[#F3D58E]" />
                      Higher wealth: {result.verdict}
                    </span>
                    <span className="text-xs text-[#E3ECF5]">
                      Horizon: {tenureYears} Years
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                      {result.verdict === 'Invest in SIP' ? 'Investing the extra in a SIP' : 'Prepaying the loan first'} leaves you{' '}
                      <span className="text-[#F3D58E]">
                        {formatIndianCurrency(result.netWealthAdvantage)}
                      </span>{' '}
                      richer after {tenureYears} years
                    </h3>
                    <p className="text-xs sm:text-sm text-[#E3ECF5] mt-2 leading-relaxed">
                      Both plans spend the same ₹{(result.regularEMI + extraMonthlySavings).toLocaleString('en-IN')} a month and are debt-free on the same date. Prepaying saves <span className="text-white font-bold">{formatIndianCurrency(result.interestSaved)}</span> of interest and closes the loan in {result.prepayTenureYears} years; after that the full EMI goes into a SIP. Returns are assumed, not guaranteed, and tax on gains is not included.
                    </p>
                  </div>

                  {/* Golden Milestone: Crossover Point */}
                  <div className="bg-white/10 border border-white/20 rounded-2xl p-4 flex items-start gap-3 text-xs">
                    <div className="w-8 h-8 rounded-lg bg-[#F3D58E] text-[#0F2740] flex items-center justify-center shrink-0 font-extrabold text-sm">
                      Yr {crossoverData.crossoverYear}
                    </div>
                    <div>
                      <span className="font-extrabold text-[#F3D58E] text-sm block">
                        Crossover point (year {crossoverData.crossoverYear})
                      </span>
                      <p className="text-[#E3ECF5] mt-0.5 leading-snug">
                        Around year {crossoverData.crossoverYear}, at the assumed return, your SIP value passes the remaining loan. From then on you could redeem and close the loan, or let the SIP keep growing.
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
                      <div className="text-xs text-[#E3ECF5] flex justify-between">
                        <span>Interest Saved:</span>
                        <span className="font-bold text-white">{formatIndianCurrency(result.interestSaved)}</span>
                      </div>
                      <div className="text-xs text-[#E3ECF5] flex justify-between">
                        <span>Then SIP of EMI grows to:</span>
                        <span className="font-bold text-white">{formatIndianCurrency(result.prepayThenInvestWealth)}</span>
                      </div>
                    </div>

                    {/* Strategy B */}
                    <div className="bg-[#8A6420]/30 border border-[#F3D58E]/30 rounded-xl p-3.5 space-y-1.5">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#F3D58E] block">
                        Strategy B: Invest in SIP
                      </span>
                      <div className="text-lg font-black text-[#F3D58E]">
                        {formatIndianCurrency(result.sipMaturityWealth)} <span className="text-xs font-normal text-white">Corpus</span>
                      </div>
                      <div className="text-xs text-[#E3ECF5] flex justify-between">
                        <span>Your SIP Capital:</span>
                        <span className="font-bold text-white">{formatIndianCurrency(result.sipInvestedAmount)}</span>
                      </div>
                      <div className="text-xs text-[#E3ECF5] flex justify-between">
                        <span>Pure Compounded Gain:</span>
                        <span className="font-bold text-[#F3D58E]">+{formatIndianCurrency(result.sipNetProfit)}</span>
                      </div>
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <WhatsAppResultButton calc="home loan prepayment vs SIP calculator" result={`${inr(loanAmount)} loan at ${interestRate}%, extra ${inr(extraMonthlySavings)}/month: "${result.verdict}" comes out ahead by ${inr(result.netWealthAdvantage)} at an assumed ${expectedMfReturn}% SIP return (illustrative, not guaranteed)`} className="flex-1 min-w-[200px]" />
                    <button
                      type="button"
                      onClick={() => onNavigate?.('open-account')}
                      className="flex-1 min-w-[200px] bg-[#8A6420] hover:bg-[#6F501A] text-white font-extrabold text-xs sm:text-sm py-3.5 px-5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <span>Start This SIP With Us</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate?.('booking')}
                      className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5 text-[#F3D58E]" />
                      <span>Book an intro call</span>
                    </button>
                  </div>

                </div>
              </div>

              {/* Visual Comparative Charts */}
              <div className="bg-[#F6F8FB] border border-[#D3DCE6] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-[#0F2740] flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-[#8A6420]" />
                    <span>Visual Arbitrage Simulation</span>
                  </div>
                  
                  {/* Chart view selector */}
                  <div className="flex items-center gap-1 bg-[#EDF1F5] p-1 rounded-lg border border-[#D3DCE6] text-xs">
                    <button
                      type="button"
                      onClick={() => setChartView('timeline')}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                        chartView === 'timeline' ? 'bg-[#0F2740] text-white shadow-2xs' : 'text-[#43566B]'
                      }`}
                    >
                      Timeline Growth
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartView('comparison')}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                        chartView === 'comparison' ? 'bg-[#0F2740] text-white shadow-2xs' : 'text-[#43566B]'
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
                            <stop offset="5%" stopColor="#8A6420" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#8A6420" stopOpacity={0.0} />
                          </linearGradient>
                          <linearGradient id="loanGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ba1a1a" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#ba1a1a" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="year" stroke="#6B7C8F" fontSize={11} />
                        <YAxis
                          stroke="#6B7C8F"
                          fontSize={11}
                          tickFormatter={(v) => v >= 10000000 ? `₹${(v / 10000000).toFixed(1)}Cr` : `₹${(v / 100000).toFixed(0)}L`}
                        />
                        <Tooltip
                          formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                          contentStyle={{
                            backgroundColor: '#0F2740',
                            borderRadius: '12px',
                            color: '#fff',
                            border: 'none',
                            fontSize: '12px'
                          }}
                        />
                        <Legend
                          verticalAlign="top"
                          height={32}
                          formatter={(val) => <span className="text-xs font-semibold text-[#13263B]">{val}</span>}
                        />
                        <Area
                          type="monotone"
                          dataKey="sipWealth"
                          name="Strategy B: SIP Wealth Corpus"
                          stroke="#8A6420"
                          strokeWidth={2.5}
                          fill="url(#sipGrad)"
                        />
                        <Area
                          type="monotone"
                          dataKey="prepayWealth"
                          name="Strategy A: SIP after loan closes"
                          stroke="#3F6E96"
                          strokeWidth={2}
                          fill="none"
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
                        <XAxis dataKey="strategy" stroke="#13263B" fontSize={12} fontWeight={600} />
                        <YAxis
                          stroke="#6B7C8F"
                          fontSize={11}
                          tickFormatter={(v) => v >= 10000000 ? `₹${(v / 10000000).toFixed(1)}Cr` : `₹${(v / 100000).toFixed(0)}L`}
                        />
                        <Tooltip
                          formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Net Financial Value']}
                          contentStyle={{
                            backgroundColor: '#0F2740',
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
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F2740]">
              The Story of Two Friends: Rahul vs. Priya
            </h3>
            <p className="text-xs sm:text-sm text-[#43566B] leading-relaxed">
              Both Rahul and Priya took a <strong>₹45 Lakh Home Loan</strong> at <strong>8.75% interest for 15 years</strong> (Regular EMI: ~₹45,000/month). Both had an extra <strong>₹15,000/month surplus savings</strong>. See what happened when they chose different paths.
            </p>
          </div>

          {/* 3 Step Visual Story Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="bg-[#F6F8FB] border border-[#D3DCE6] rounded-2xl p-5 space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-[#ba1a1a] text-white flex items-center justify-center font-black text-lg">
                1
              </div>
              <h4 className="text-base font-extrabold text-[#13263B]">
                Rahul Chooses: Loan Prepayment
              </h4>
              <p className="text-xs text-[#43566B] leading-relaxed">
                Rahul puts his extra ₹15,000 every month into his home loan (paying ₹60,000/mo).
              </p>
              <div className="bg-white p-3 rounded-xl border border-[#E4EAF0] space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6B7C8F]">Loan closed in:</span>
                  <span className="font-bold text-[#8A6420]">9.2 Years (5.8 yrs early)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7C8F]">Total Interest Saved:</span>
                  <span className="font-bold text-[#8A6420]">~₹15.6 Lakhs</span>
                </div>
                <div className="flex justify-between border-t border-[#E4EAF0] pt-1">
                  <span className="text-[#6B7C8F]">Then SIPs ₹60,000/mo; value at Yr 15:</span>
                  <span className="font-bold text-[#0F2740]">~₹64.3 Lakhs</span>
                </div>
              </div>
              <div className="text-[11px] text-rose-700 font-semibold bg-rose-50 p-2 rounded-lg border border-rose-200">
                Rahul is debt-free 5.8 years earlier, but his investing starts late, so it has less time to compound.
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FBF6EA] border-2 border-[#F6E7C1] rounded-2xl p-5 space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-[#8A6420] text-white flex items-center justify-center font-black text-lg">
                2
              </div>
              <h4 className="text-base font-extrabold text-[#8A6420]">
                Priya Chooses: Equity SIP Arbitrage
              </h4>
              <p className="text-xs text-[#43566B] leading-relaxed">
                Priya pays her normal EMI (₹45,000) and invests her extra ₹15,000 into a Flexi-cap Mutual Fund SIP compounding at ~13% CAGR.
              </p>
              <div className="bg-white p-3 rounded-xl border border-[#F6E7C1] space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6B7C8F]">Total Invested in SIP:</span>
                  <span className="font-bold text-[#13263B]">₹27.0 Lakhs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7C8F]">SIP Maturity at Yr 15:</span>
                  <span className="font-extrabold text-[#8A6420]">~₹83.4 Lakhs</span>
                </div>
                <div className="flex justify-between border-t border-[#F6E7C1] pt-1">
                  <span className="text-[#6B7C8F]">Pure Wealth Gain:</span>
                  <span className="font-extrabold text-[#8A6420]">+₹56.4 Lakhs</span>
                </div>
              </div>
              <div className="text-[11px] text-[#8A6420] font-semibold bg-[#F6E7C1] p-2 rounded-lg border border-[#a7f3d0]">
                Priya keeps the loan longer but her money compounds for the full 15 years. Under the old tax regime, home loan interest may also be deductible.
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#E3ECF5]/40 border border-[#C9DAEA] rounded-2xl p-5 space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-[#0F2740] text-white flex items-center justify-center font-black text-lg">
                3
              </div>
              <h4 className="text-base font-extrabold text-[#0F2740]">
                The Grand Finale Comparison
              </h4>
              <p className="text-xs text-[#43566B] leading-relaxed">
                At Year 15, both Rahul and Priya own their house 100% debt-free. But look at their bank accounts:
              </p>
              <div className="bg-white p-3 rounded-xl border border-[#C9DAEA] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6B7C8F]">Rahul&apos;s Bank Balance:</span>
                  <span className="font-bold text-[#13263B]">~₹64.3 Lakhs in mutual funds</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7C8F]">Priya&apos;s Bank Balance:</span>
                  <span className="font-bold text-[#8A6420]">~₹83.4 Lakhs in mutual funds</span>
                </div>
                <div className="flex justify-between border-t border-[#C9DAEA] pt-1.5 font-extrabold text-[#0F2740] text-sm">
                  <span>Priya&apos;s Net Advantage:</span>
                  <span className="text-[#8A6420]">~₹19.1 Lakhs, at an assumed 13%</span>
                </div>
              </div>
              <div className="text-[11px] text-[#0F2740] font-medium bg-white/80 p-2 rounded-lg border border-[#C9DAEA]">
                <strong>Key takeaway:</strong> the SIP wins only if it earns more than the loan rate. At 8.75% returns the two plans end up exactly equal, and equity returns are never guaranteed. Prepaying is a certain 8.75%.
              </div>
            </div>

          </div>

          {/* Golden Rule Explainer Banner */}
          <div className="bg-[#0F2740] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#F3D58E] uppercase tracking-wider">
                Why does this happen?
              </span>
              <h4 className="text-lg sm:text-xl font-bold">
                It comes down to the gap between two rates
              </h4>
              <p className="text-xs sm:text-sm text-[#E3ECF5] max-w-2xl leading-relaxed">
                Prepaying earns you exactly the loan rate (8.75%), with no risk. An equity SIP may compound faster over long periods, and that gap is what Priya captures. If markets return less than the loan rate over your tenure, prepaying wins instead.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('simulator')}
              className="px-6 py-3.5 bg-[#8A6420] hover:bg-[#6F501A] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
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
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F2740]">
              Should You Prepay or Invest? Complete Rulebook
            </h3>
            <p className="text-xs sm:text-sm text-[#43566B]">
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
                  <span className="text-xs text-[#6B7C8F]">High interest, low risk appetite, or near retirement</span>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-[#13263B]">
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
            <div className="bg-[#FBF6EA] border-2 border-[#F6E7C1] rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#8A6420] text-white flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#8A6420]">
                    When You SHOULD Invest in Mutual Fund SIP
                  </h4>
                  <span className="text-xs text-[#6B7C8F]">Long horizon, young investor, wealth maximizer</span>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-[#13263B]">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#8A6420] shrink-0 mt-0.5" />
                  <span><strong>Low-Interest Home Loan (&lt;9%):</strong> Home loans are the cheapest leverage in India.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#8A6420] shrink-0 mt-0.5" />
                  <span><strong>Time Horizon &gt; 7 Years:</strong> Gives equity compounding full power to outpace debt rates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#8A6420] shrink-0 mt-0.5" />
                  <span><strong>Section 24(b) Tax Deductions:</strong> Save up to ₹60,000/yr in income tax on your home loan interest.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#8A6420] shrink-0 mt-0.5" />
                  <span><strong>Emergency Liquidity:</strong> Money put into a loan cannot be withdrawn if you lose a job, but an SIP portfolio can be redeemed anytime!</span>
                </li>
              </ul>
            </div>

          </div>

          {/* The 50:50 Hybrid Strategy Recommendation */}
          <div className="bg-[#F6F8FB] border border-[#D3DCE6] rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-[#0F2740] font-bold text-sm">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>A Common Middle Path: The 50:50 Hybrid</span>
            </div>
            <p className="text-xs text-[#43566B] leading-relaxed">
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
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F2740]">
              Frequently Asked Questions (Loan vs SIP)
            </h3>
            <p className="text-xs sm:text-sm text-[#43566B]">
              Common doubts, tax impacts, and liquidity questions clarified.
            </p>
          </div>

          <div className="space-y-3">
            
            <div className="bg-[#F6F8FB] p-4 rounded-xl border border-[#E4EAF0] space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-[#0F2740]">
                1. What if the stock market crashes during my loan tenure?
              </h4>
              <p className="text-xs text-[#43566B] leading-relaxed">
                Markets can fall sharply, sometimes for a year or more. Longer holding periods have historically lowered the chance of a loss, but they do not remove it, and past returns do not guarantee future ones. A SIP does buy more units when prices are low. If a fall would make you stop the SIP or sell in panic, prepaying is the safer choice for you.
              </p>
            </div>

            <div className="bg-[#F6F8FB] p-4 rounded-xl border border-[#E4EAF0] space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-[#0F2740]">
                2. Can I use my Mutual Fund SIP corpus to close the loan later?
              </h4>
              <p className="text-xs text-[#43566B] leading-relaxed">
                <strong>Yes.</strong> Many people keep this as an option: if the SIP grows faster than the loan shrinks, there comes a year (the crossover point) when the fund value exceeds the outstanding loan, and you can redeem to close it. Remember that redeeming may trigger capital gains tax and that the crossover year depends on actual returns.
              </p>
            </div>

            <div className="bg-[#F6F8FB] p-4 rounded-xl border border-[#E4EAF0] space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-[#0F2740]">
                3. What is the tax benefit advantage under Section 24(b)?
              </h4>
              <p className="text-xs text-[#43566B] leading-relaxed">
                Under the old tax regime, interest on a self-occupied home loan can be deducted up to ₹2,00,000 a year. In the 30% slab (plus 4% cess) that is worth up to about ₹62,400 a year. The new regime does not allow this deduction for a self-occupied home, so check which regime you file under.
              </p>
            </div>

            <div className="bg-[#F6F8FB] p-4 rounded-xl border border-[#E4EAF0] space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-[#0F2740]">
                4. What about personal loans or car loans? Should I prepay them?
              </h4>
              <p className="text-xs text-[#43566B] leading-relaxed">
                <strong>Always prepay personal loans and credit cards immediately.</strong> Personal loans charge 12-16% interest with no tax deduction. Only cheap, tax-deductible debt like Home Loans (8.5-9%) should be kept running alongside SIPs.
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
