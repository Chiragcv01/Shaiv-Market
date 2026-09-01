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
  ShieldCheck,
  Calendar,
  Percent
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
  const [annualStepUp, setAnnualStepUp] = useState<number>(0);
  const [chartView, setChartView] = useState<'area' | 'donut'>('area');

  // Quick Preset Targets
  const TARGET_PRESETS = [
    { label: '₹25 Lakh', value: 2500000, desc: 'Car / Wedding / Seed Capital' },
    { label: '₹50 Lakh', value: 5000000, desc: 'Child Higher Education' },
    { label: '₹1 Crore', value: 10000000, desc: 'Dream Home / Early Wealth' },
    { label: '₹2.5 Crore', value: 25000000, desc: 'Retirement Corpus' },
    { label: '₹5 Crore', value: 50000000, desc: 'Generational Freedom' }
  ];

  const YEAR_PRESETS = [3, 5, 10, 12, 15, 20, 25];

  // Calculation
  const result = useMemo(() => {
    return calculateTargetSip(targetCorpus, targetYears, expectedReturnRate, annualStepUp);
  }, [targetCorpus, targetYears, expectedReturnRate, annualStepUp]);

  // Chart data
  const chartData = useMemo(() => {
    return result.yearlyMilestones.map((m) => ({
      year: `Yr ${m.yearNum}`,
      invested: m.invested,
      corpus: m.corpus,
      returns: m.gains,
      target: targetCorpus
    }));
  }, [result, targetCorpus]);

  const pieData = [
    { name: 'Your Investment', value: result.totalInvested, color: '#003461' },
    { name: 'Compound Returns (Gains)', value: result.totalGains, color: '#006d42' }
  ];

  return (
    <div id="required-sip-calculator" className="bg-white border border-[#c2c6d1] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs space-y-8 animate-in fade-in">
      
      {/* Top Banner / Explanation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e0e3e5]">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#d3e4fe] text-[#003461] px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Target className="w-3.5 h-3.5 text-[#006d42]" />
            <span>Target Goal SIP Math</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#003461] tracking-tight">
            Know Your Required Monthly SIP Amount
          </h2>
          <p className="text-xs sm:text-sm text-[#424750] mt-1 max-w-2xl">
            Set your target wealth goal and time horizon. We calculate the exact monthly investment required to reach your target corpus via disciplined mutual fund compounding.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setChartView('area')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              chartView === 'area'
                ? 'bg-[#003461] text-white shadow-2xs'
                : 'bg-[#eceef0] text-[#424750] hover:bg-[#e0e3e5]'
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
                ? 'bg-[#003461] text-white shadow-2xs'
                : 'bg-[#eceef0] text-[#424750] hover:bg-[#e0e3e5]'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Share Breakdown</span>
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
            icon={<Target className="w-4 h-4 text-[#003461]" />}
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
            icon={<Clock className="w-4 h-4 text-[#006d42]" />}
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
            max={20}
            step={0.5}
            suffix="%"
            icon={<Percent className="w-4 h-4 text-[#003461]" />}
            minLabel="6% (Debt/FD)"
            midLabel="13% (Equity Average)"
            maxLabel="20% (High Growth)"
            themeColor="blue"
            presets={[
              { label: 'Conservative (10%)', value: 10 },
              { label: 'Balanced (12%)', value: 12 },
              { label: 'Aggressive (14%)', value: 14 }
            ]}
          />

          {/* Annual Step-Up Option */}
          <SmartNumberInput
            id="req-step-up"
            label="Annual SIP Step-Up (Optional)"
            value={annualStepUp}
            onChange={(val) => setAnnualStepUp(val)}
            min={0}
            max={25}
            step={1}
            suffix="%"
            icon={<Sparkles className="w-4 h-4 text-[#006d42]" />}
            minLabel="0% (Fixed SIP)"
            maxLabel="+25% / Yr"
            themeColor="green"
            presets={[
              { label: 'No Step-Up', value: 0 },
              { label: '+5% / Yr', value: 5 },
              { label: '+10% / Yr', value: 10 },
              { label: '+15% / Yr', value: 15 }
            ]}
            helperText="Stepping up your SIP by 10% annually dramatically reduces your starting monthly investment requirement!"
          />

        </div>

        {/* Right Column: Hero Results & Interactive Chart (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Key Result Highlight Box */}
          <div className="bg-gradient-to-br from-[#003461] to-[#002647] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#004b87] rounded-full blur-3xl opacity-30 -mr-16 -mt-16 pointer-events-none" />
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#96f6bd] bg-white/10 px-3 py-1 rounded-full">
                  Calculated Monthly Investment
                </span>
                <span className="text-xs text-[#d3e4fe]">
                  Target: {formatIndianCurrency(targetCorpus)} in {targetYears} Yrs
                </span>
              </div>

              <div>
                <div className="text-xs text-[#d3e4fe] font-medium">Required Monthly SIP</div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mt-1">
                  ₹{Math.round(result.requiredMonthlySip).toLocaleString('en-IN')}
                  <span className="text-sm sm:text-base font-normal text-[#96f6bd] ml-2">/ month</span>
                </div>
                {annualStepUp > 0 && (
                  <p className="text-[11px] text-[#96f6bd] mt-1">
                    *Starting SIP amount. Increases by {annualStepUp}% every 12 months.
                  </p>
                )}
              </div>

              {/* Stat Grid */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/15">
                <div>
                  <span className="text-[10px] text-[#d3e4fe] uppercase font-bold block">Total You Invest</span>
                  <span className="text-sm sm:text-base font-bold text-white">
                    {formatIndianCurrency(result.totalInvested)}
                  </span>
                  <span className="text-[10px] text-[#96f6bd] block">
                    ({result.investedPercentage.toFixed(0)}% of Goal)
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-[#d3e4fe] uppercase font-bold block">Compound Wealth Gain</span>
                  <span className="text-sm sm:text-base font-bold text-[#96f6bd]">
                    {formatIndianCurrency(result.totalGains)}
                  </span>
                  <span className="text-[10px] text-[#96f6bd] block">
                    ({result.returnsPercentage.toFixed(0)}% of Goal)
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-[#d3e4fe] uppercase font-bold block">Final Maturity Corpus</span>
                  <span className="text-sm sm:text-base font-bold text-white">
                    {formatIndianCurrency(targetCorpus)}
                  </span>
                  <span className="text-[10px] text-white/80 block">
                    100% Achieved
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
                  className="flex-1 min-w-[180px] bg-[#006d42] hover:bg-[#005231] text-white font-bold text-xs sm:text-sm py-3 px-5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>Start This SIP with Advisor</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('booking')}
                  className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#96f6bd]" />
                  <span>Book Free Consultation</span>
                </button>
              </div>
            </div>
          </div>

          {/* Chart Display Container */}
          <div className="bg-[#f7f9fb] border border-[#c2c6d1] rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#003461]">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#006d42]" />
                {chartView === 'area' ? 'Wealth Accumulation Timeline' : 'Capital vs Compounded Returns'}
              </span>
              <span className="text-[11px] text-[#727781]">
                Compounding at {expectedReturnRate}% CAGR
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              {chartView === 'area' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="corpusGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#006d42" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#006d42" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#003461" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#003461" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" stroke="#727781" fontSize={11} />
                    <YAxis
                      stroke="#727781"
                      fontSize={11}
                      tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
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
                    <Area
                      type="monotone"
                      dataKey="corpus"
                      name="Accumulated Wealth"
                      stroke="#006d42"
                      strokeWidth={2.5}
                      fill="url(#corpusGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="invested"
                      name="Total Invested"
                      stroke="#003461"
                      strokeWidth={2}
                      fill="url(#investedGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
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
                        backgroundColor: '#003461',
                        borderRadius: '12px',
                        color: '#fff',
                        border: 'none',
                        fontSize: '12px'
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(val) => <span className="text-xs font-semibold text-[#191c1e]">{val}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Quick Milestone Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#e0e3e5] text-center text-xs">
              <div className="bg-white p-2 rounded-lg border border-[#e0e3e5]">
                <div className="text-[10px] text-[#727781] uppercase font-bold">In 3 Years</div>
                <div className="font-bold text-[#003461]">
                  {formatIndianCurrency(result.yearlyMilestones[Math.min(2, result.yearlyMilestones.length - 1)]?.corpus || 0)}
                </div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-[#e0e3e5]">
                <div className="text-[10px] text-[#727781] uppercase font-bold">In 5 Years</div>
                <div className="font-bold text-[#003461]">
                  {formatIndianCurrency(result.yearlyMilestones[Math.min(4, result.yearlyMilestones.length - 1)]?.corpus || 0)}
                </div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-[#e0e3e5]">
                <div className="text-[10px] text-[#727781] uppercase font-bold">In 10 Years</div>
                <div className="font-bold text-[#003461]">
                  {formatIndianCurrency(result.yearlyMilestones[Math.min(9, result.yearlyMilestones.length - 1)]?.corpus || 0)}
                </div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-[#e0e3e5]">
                <div className="text-[10px] text-[#727781] uppercase font-bold">Target Maturity</div>
                <div className="font-bold text-[#006d42]">
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
