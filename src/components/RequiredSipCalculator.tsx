import React, { useState, useMemo } from 'react';
import { ActiveScreen } from '../types';
import { SmartNumberInput } from './SmartNumberInput';
import {
  calculateTargetSip,
  formatIndianCurrency,
  formatRawIndianNumber
} from '../utils/calculator';
import {
  Target,
  Sparkles,
  TrendingUp,
  Clock,
  Wallet,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  BarChart3,
  PieChart as PieIcon,
  Table as TableIcon,
  ShieldCheck,
  Calendar,
  Percent,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface RequiredSipCalculatorProps {
  onNavigate?: (screen: ActiveScreen) => void;
  onStartSip?: () => void;
}

export const RequiredSipCalculator: React.FC<RequiredSipCalculatorProps> = ({
  onNavigate,
  onStartSip
}) => {
  // Target Corpus State (Default: ₹1 Crore)
  const [targetCorpus, setTargetCorpus] = useState<number>(10000000);
  const [targetYears, setTargetYears] = useState<number>(15);
  const [expectedReturnRate, setExpectedReturnRate] = useState<number>(13.0);
  const [isStepUpEnabled, setIsStepUpEnabled] = useState<boolean>(true);
  const [annualStepUp, setAnnualStepUp] = useState<number>(10);
  const [chartView, setChartView] = useState<'area' | 'donut' | 'table'>('area');

  // Quick Preset Targets
  const TARGET_PRESETS = [
    { label: '₹25 Lakh', value: 2500000, desc: 'Car / Wedding / Seed Capital' },
    { label: '₹50 Lakh', value: 5000000, desc: 'Child Higher Education' },
    { label: '₹1 Crore', value: 10000000, desc: 'Dream Home / Early Wealth' },
    { label: '₹2.5 Crore', value: 25000000, desc: 'Retirement Corpus' },
    { label: '₹5 Crore', value: 50000000, desc: 'Generational Freedom' }
  ];

  const YEAR_PRESETS = [3, 5, 10, 12, 15, 20, 25];

  // Active step-up value depends on toggle
  const activeStepUpPercent = isStepUpEnabled ? annualStepUp : 0;

  // Calculation
  const result = useMemo(() => {
    return calculateTargetSip(targetCorpus, targetYears, expectedReturnRate, activeStepUpPercent);
  }, [targetCorpus, targetYears, expectedReturnRate, activeStepUpPercent]);

  // Chart data
  const chartData = useMemo(() => {
    return result.yearlyMilestones.map((m) => ({
      year: `Yr ${m.yearNum}`,
      monthlySip: m.monthlySip,
      invested: m.invested,
      corpus: m.corpus,
      returns: m.gains,
      target: targetCorpus
    }));
  }, [result, targetCorpus]);

  const pieData = [
    { name: 'Your Investment', value: result.totalInvested, color: '#0F2740' },
    { name: 'Compound Returns (Gains)', value: result.totalGains, color: '#8A6420' }
  ];

  return (
    <div id="required-sip-calculator" className="bg-white border border-[#D3DCE6] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs space-y-8 animate-in fade-in">
      
      {/* Top Banner / Explanation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E4EAF0]">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#E3ECF5] text-[#0F2740] px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Target className="w-3.5 h-3.5 text-[#8A6420]" />
            <span>Target Wealth SIP Calculator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2740] tracking-tight">
            Know Your Required Monthly SIP Amount
          </h2>
          <p className="text-xs sm:text-sm text-[#43566B] mt-1 max-w-2xl">
            Calculate the exact monthly SIP needed to build your target wealth. Enable <strong>Annual Step-Up SIP</strong> to start smaller today and step up as your income grows!
          </p>
        </div>

        {/* View switcher tabs */}
        <div className="flex items-center gap-1.5 self-start md:self-auto bg-[#EDF1F5] p-1 rounded-xl border border-[#D3DCE6]">
          <button
            type="button"
            onClick={() => setChartView('area')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              chartView === 'area'
                ? 'bg-[#0F2740] text-white shadow-2xs'
                : 'text-[#43566B] hover:text-[#13263B]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Growth Curve</span>
          </button>
          <button
            type="button"
            onClick={() => setChartView('donut')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              chartView === 'donut'
                ? 'bg-[#0F2740] text-white shadow-2xs'
                : 'text-[#43566B] hover:text-[#13263B]'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
          <button
            type="button"
            onClick={() => setChartView('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              chartView === 'table'
                ? 'bg-[#0F2740] text-white shadow-2xs'
                : 'text-[#43566B] hover:text-[#13263B]'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Yearly Schedule</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Controls on Left, Results & Charts on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* Left Column: Sliders & Preset Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Target Wealth Goal */}
          <SmartNumberInput
            id="req-target-corpus"
            label="Target Wealth Goal"
            value={targetCorpus}
            onChange={(val) => setTargetCorpus(val)}
            min={100000}
            max={100000000}
            step={50000}
            isCurrency={true}
            icon={<Target className="w-4 h-4 text-[#0F2740]" />}
            minLabel="₹1 Lakh"
            midLabel="₹50 Lakh"
            maxLabel="₹10 Crore"
            themeColor="blue"
            presets={TARGET_PRESETS}
            helperText="Tip: You can manually type exact amounts like 3 Lakh, 2,50,890 or 1.5 Cr above."
          />

          {/* Time Horizon (Years) */}
          <SmartNumberInput
            id="req-target-years"
            label="Time Period"
            value={targetYears}
            onChange={(val) => setTargetYears(Math.max(1, val))}
            min={1}
            max={35}
            step={1}
            suffix=" Yrs"
            icon={<Clock className="w-4 h-4 text-[#8A6420]" />}
            minLabel="1 Yr"
            midLabel="15 Yrs"
            maxLabel="35 Yrs"
            themeColor="green"
            presets={YEAR_PRESETS.map((y) => ({ label: `${y} Yrs`, value: y }))}
          />

          {/* Expected Annual Return Rate (%) */}
          <SmartNumberInput
            id="req-return-rate"
            label="Expected Return (CAGR)"
            value={expectedReturnRate}
            onChange={(val) => setExpectedReturnRate(val)}
            min={6}
            max={15}
            step={0.5}
            suffix="%"
            icon={<Percent className="w-4 h-4 text-[#0F2740]" />}
            minLabel="6% (Debt/FD)"
            midLabel="12% (Equity, assumed)"
            maxLabel="15%"
            themeColor="blue"
            presets={[
              { label: 'Conservative (10%)', value: 10 },
              { label: 'Balanced (12%)', value: 12 },
              { label: 'Aggressive (14%)', value: 14 }
            ]}
          />

          {/* Dedicated Annual Step-Up SIP Toggle & Configuration Box */}
          <div className="bg-[#FBF6EA] border-2 border-[#F6E7C1] rounded-2xl p-5 space-y-4">
            
            {/* Toggle Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#8A6420] text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#8A6420] uppercase tracking-wider">
                    Annual Step-Up SIP Mode
                  </h4>
                  <p className="text-[11px] text-[#43566B]">
                    Increase SIP yearly with your salary appraisal
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => {
                  if (!isStepUpEnabled) {
                    setIsStepUpEnabled(true);
                    if (annualStepUp === 0) setAnnualStepUp(10);
                  } else {
                    setIsStepUpEnabled(false);
                  }
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  isStepUpEnabled ? 'bg-[#8A6420]' : 'bg-[#D3DCE6]'
                }`}
                role="switch"
                aria-checked={isStepUpEnabled}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    isStepUpEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* If Step-Up is active */}
            {isStepUpEnabled ? (
              <div className="space-y-3 pt-2 border-t border-[#F6E7C1]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#13263B]">Annual Step-Up Percentage:</span>
                  <span className="font-extrabold text-[#8A6420] font-mono bg-white px-2 py-0.5 rounded border border-[#F6E7C1]">
                    +{annualStepUp}% Every Year
                  </span>
                </div>

                {/* Preset quick buttons */}
                <div className="flex flex-wrap gap-2">
                  {[5, 10, 15, 20, 25].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAnnualStepUp(val)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        annualStepUp === val
                          ? 'bg-[#8A6420] text-white border-[#8A6420] shadow-2xs'
                          : 'bg-white text-[#43566B] border-[#F6E7C1] hover:bg-white/80'
                      }`}
                    >
                      +{val}%
                    </button>
                  ))}
                </div>

                {/* Slider for custom step-up % */}
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={annualStepUp}
                  onChange={(e) => setAnnualStepUp(Number(e.target.value))}
                  className="w-full h-2 bg-[#F6E7C1] rounded-lg appearance-none cursor-pointer accent-[#8A6420]"
                />

                <div className="flex justify-between text-[10px] text-[#6B7C8F] font-mono">
                  <span>1% Min</span>
                  <span>10% (Recommended)</span>
                  <span>30% Max</span>
                </div>

                <p className="text-[11px] text-[#8A6420] font-medium bg-white/70 p-2 rounded-lg border border-[#F6E7C1] leading-snug">
                  ✨ <strong>Benefit:</strong> With +{annualStepUp}% annual step-up, you only need to start with <strong>{formatIndianCurrency(result.requiredMonthlySip)}/month</strong> in Year 1 instead of {formatIndianCurrency(result.flatRequiredMonthlySip)}/month!
                </p>
              </div>
            ) : (
              <div className="text-[11px] text-[#6B7C8F] italic pt-1 border-t border-[#F6E7C1]">
                Flat SIP mode active (same monthly installment every year). Toggle ON above to see Step-Up benefits.
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Hero Results & Interactive Chart (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Key Result Highlight Box */}
          <div className="bg-gradient-to-br from-[#0F2740] to-[#0A1D30] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1D4268] rounded-full blur-3xl opacity-30 -mr-16 -mt-16 pointer-events-none" />
            
            <div className="relative z-10 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#F3D58E] bg-white/10 px-3 py-1 rounded-full">
                  {isStepUpEnabled && annualStepUp > 0 ? `Step-Up SIP Plan (+${annualStepUp}%/Yr)` : 'Fixed / Flat SIP Plan'}
                </span>
                <span className="text-xs text-[#E3ECF5]">
                  Target: {formatIndianCurrency(targetCorpus)} in {targetYears} Yrs
                </span>
              </div>

              {/* Dual SIP Highlight Grid when Step-up is active */}
              {isStepUpEnabled && annualStepUp > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/10 p-4 rounded-2xl border border-white/15">
                  {/* Starting SIP */}
                  <div>
                    <span className="text-[11px] text-[#E3ECF5] font-medium flex items-center gap-1">
                      <ArrowRight className="w-3.5 h-3.5 text-[#F3D58E]" />
                      Starting Monthly SIP (Year 1)
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                      ₹{Math.round(result.requiredMonthlySip).toLocaleString('en-IN')}
                      <span className="text-xs font-normal text-[#F3D58E] ml-1">/ mo</span>
                    </div>
                    <span className="text-[10px] text-[#F3D58E] block mt-0.5">
                      First 12 months installment
                    </span>
                  </div>

                  {/* Final Year SIP */}
                  <div className="sm:border-l sm:border-white/15 sm:pl-4">
                    <span className="text-[11px] text-[#E3ECF5] font-medium flex items-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5 text-amber-300" />
                      Final Year Monthly SIP (Year {targetYears})
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-1">
                      ₹{Math.round(result.finalMonthlySip).toLocaleString('en-IN')}
                      <span className="text-xs font-normal text-white/80 ml-1">/ mo</span>
                    </div>
                    <span className="text-[10px] text-white/80 block mt-0.5">
                      Stepped-up installment in Yr {targetYears}
                    </span>
                  </div>
                </div>
              ) : (
                /* Flat SIP Single Card */
                <div>
                  <div className="text-xs text-[#E3ECF5] font-medium">Required Monthly SIP (Flat / Fixed)</div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mt-1">
                    ₹{Math.round(result.requiredMonthlySip).toLocaleString('en-IN')}
                    <span className="text-sm sm:text-base font-normal text-[#F3D58E] ml-2">/ month</span>
                  </div>
                  <p className="text-[11px] text-[#E3ECF5] mt-1">
                    Fixed monthly installment maintained throughout {targetYears} years.
                  </p>
                </div>
              )}

              {/* Comparison Callout if Step-Up is enabled */}
              {isStepUpEnabled && annualStepUp > 0 && result.monthlySavingsAtStart > 0 && (
                <div className="bg-[#8A6420]/60 border border-[#F3D58E]/40 rounded-xl p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F3D58E] shrink-0" />
                    <span>
                      Flat SIP would require <strong>₹{result.flatRequiredMonthlySip.toLocaleString('en-IN')}/mo</strong> from Day 1.
                    </span>
                  </div>
                  <span className="font-extrabold text-[#F3D58E] text-right shrink-0">
                    Saves ₹{result.monthlySavingsAtStart.toLocaleString('en-IN')}/mo today!
                  </span>
                </div>
              )}

              {/* Stat Grid */}
              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/15">
                <div>
                  <span className="text-[10px] text-[#E3ECF5] uppercase font-bold block">Total You Invest</span>
                  <span className="text-sm sm:text-base font-bold text-white">
                    {formatIndianCurrency(result.totalInvested)}
                  </span>
                  <span className="text-[10px] text-[#F3D58E] block">
                    ({result.investedPercentage.toFixed(0)}% of Goal)
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-[#E3ECF5] uppercase font-bold block">Compound Wealth Gain</span>
                  <span className="text-sm sm:text-base font-bold text-[#F3D58E]">
                    {formatIndianCurrency(result.totalGains)}
                  </span>
                  <span className="text-[10px] text-[#F3D58E] block">
                    ({result.returnsPercentage.toFixed(0)}% of Goal)
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-[#E3ECF5] uppercase font-bold block">Target Maturity Corpus</span>
                  <span className="text-sm sm:text-base font-bold text-white">
                    {formatIndianCurrency(targetCorpus)}
                  </span>
                  <span className="text-[10px] text-white/80 block">
                    100% Goal Met
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onStartSip) onStartSip();
                    else if (onNavigate) onNavigate('open-account');
                  }}
                  className="flex-1 min-w-[180px] bg-[#8A6420] hover:bg-[#6F501A] text-white font-bold text-xs sm:text-sm py-3 px-5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>Start This SIP With Us</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('booking')}
                  className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#F3D58E]" />
                  <span>Book an intro call</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Chart or Yearly Schedule Table */}
          <div className="bg-[#F6F8FB] border border-[#D3DCE6] rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#0F2740]">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#8A6420]" />
                {chartView === 'area' && 'Wealth Accumulation Timeline'}
                {chartView === 'donut' && 'Capital vs Compounded Returns'}
                {chartView === 'table' && 'Year-by-Year Step-Up Schedule'}
              </span>
              <span className="text-[11px] text-[#6B7C8F]">
                Compounding at {expectedReturnRate}% CAGR
              </span>
            </div>

            {/* VIEW 1: Area Chart */}
            {chartView === 'area' && (
              <div className="h-64 sm:h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="corpusGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8A6420" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#8A6420" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0F2740" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0F2740" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" stroke="#6B7C8F" fontSize={11} />
                    <YAxis
                      stroke="#6B7C8F"
                      fontSize={11}
                      tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
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
                    <Area
                      type="monotone"
                      dataKey="corpus"
                      name="Accumulated Wealth"
                      stroke="#8A6420"
                      strokeWidth={2.5}
                      fill="url(#corpusGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="invested"
                      name="Total Invested"
                      stroke="#0F2740"
                      strokeWidth={2}
                      fill="url(#investedGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* VIEW 2: Donut Chart */}
            {chartView === 'donut' && (
              <div className="h-64 sm:h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
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
                      verticalAlign="bottom"
                      height={36}
                      formatter={(val) => <span className="text-xs font-semibold text-[#13263B]">{val}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* VIEW 3: Detailed Step-Up Year-by-Year Schedule Table */}
            {chartView === 'table' && (
              <div className="overflow-x-auto max-h-72 pt-2 scrollbar-thin">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-[#EDF1F5] text-[#0F2740] font-bold sticky top-0 border-b border-[#D3DCE6]">
                    <tr>
                      <th className="py-2 px-3">Year</th>
                      <th className="py-2 px-3">Monthly SIP</th>
                      <th className="py-2 px-3">Annual Invested</th>
                      <th className="py-2 px-3">Cumulative Invested</th>
                      <th className="py-2 px-3 text-right">Portfolio Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4EAF0]">
                    {result.yearlyMilestones.map((m) => (
                      <tr key={m.yearNum} className="hover:bg-white transition-colors">
                        <td className="py-2 px-3 font-bold text-[#13263B]">Year {m.yearNum}</td>
                        <td className="py-2 px-3 font-semibold text-[#8A6420]">
                          ₹{m.monthlySip.toLocaleString('en-IN')} / mo
                        </td>
                        <td className="py-2 px-3 text-[#43566B]">
                          ₹{m.yearlyInvested.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2 px-3 font-mono text-[#0F2740]">
                          ₹{m.invested.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2 px-3 font-bold text-right text-[#8A6420]">
                          ₹{m.corpus.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Quick Milestone Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#E4EAF0] text-center text-xs">
              <div className="bg-white p-2 rounded-lg border border-[#E4EAF0]">
                <div className="text-[10px] text-[#6B7C8F] uppercase font-bold">In 3 Years</div>
                <div className="font-bold text-[#0F2740]">
                  {formatIndianCurrency(result.yearlyMilestones[Math.min(2, result.yearlyMilestones.length - 1)]?.corpus || 0)}
                </div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-[#E4EAF0]">
                <div className="text-[10px] text-[#6B7C8F] uppercase font-bold">In 5 Years</div>
                <div className="font-bold text-[#0F2740]">
                  {formatIndianCurrency(result.yearlyMilestones[Math.min(4, result.yearlyMilestones.length - 1)]?.corpus || 0)}
                </div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-[#E4EAF0]">
                <div className="text-[10px] text-[#6B7C8F] uppercase font-bold">In 10 Years</div>
                <div className="font-bold text-[#0F2740]">
                  {formatIndianCurrency(result.yearlyMilestones[Math.min(9, result.yearlyMilestones.length - 1)]?.corpus || 0)}
                </div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-[#E4EAF0]">
                <div className="text-[10px] text-[#6B7C8F] uppercase font-bold">Target Maturity</div>
                <div className="font-bold text-[#8A6420]">
                  {formatIndianCurrency(targetCorpus)}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
