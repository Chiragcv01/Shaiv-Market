import React, { useState, useMemo } from 'react';
import { SmartNumberInput } from './SmartNumberInput';
import {
  calculateGoalPlan,
  formatIndianCurrency,
  formatRawIndianNumber
} from '../utils/calculator';
import { ActiveScreen } from '../types';
import {
  GraduationCap,
  Palmtree,
  Home,
  HeartHandshake,
  Rocket,
  ArrowRight,
  TrendingUp,
  Target,
  ShieldCheck,
  CheckCircle2,
  PieChart as PieIcon,
  BarChart3,
  LineChart as LineIcon,
  Sparkles,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';

interface GoalPlannerProps {
  onNavigate?: (screen: ActiveScreen) => void;
  onPlanGoal?: (goalDetails: any) => void;
}

interface GoalPreset {
  id: string;
  name: string;
  icon: any;
  defaultCost: number;
  defaultYears: number;
  defaultInflation: number;
  defaultExpectedReturn: number;
  description: string;
}

const GOAL_PRESETS: GoalPreset[] = [
  {
    id: 'education',
    name: 'Child Higher Education',
    icon: GraduationCap,
    defaultCost: 2500000,
    defaultYears: 12,
    defaultInflation: 10,
    defaultExpectedReturn: 13,
    description: 'Finance premier engineering, medical, MBA, or ivy league overseas degree without education loan debt.'
  },
  {
    id: 'retirement',
    name: 'Retirement & Freedom',
    icon: Palmtree,
    defaultCost: 15000000,
    defaultYears: 20,
    defaultInflation: 6,
    defaultExpectedReturn: 12.5,
    description: 'Build an inflation-beating capital corpus to enjoy continuous pension dividends post-retirement.'
  },
  {
    id: 'home',
    name: 'Dream Home Downpayment',
    icon: Home,
    defaultCost: 3500000,
    defaultYears: 6,
    defaultInflation: 7,
    defaultExpectedReturn: 12,
    description: 'Accumulate substantial down-payment and registry charges to minimize your home loan EMI.'
  },
  {
    id: 'marriage',
    name: 'Child Marriage / Milestone',
    icon: HeartHandshake,
    defaultCost: 2000000,
    defaultYears: 10,
    defaultInflation: 8,
    defaultExpectedReturn: 12.5,
    description: 'Celebrate grand wedding milestones with planned compounding rather than distress asset sales.'
  },
  {
    id: 'crorepati',
    name: 'Target ₹1 Crore Milestone',
    icon: Rocket,
    defaultCost: 10000000,
    defaultYears: 15,
    defaultInflation: 0,
    defaultExpectedReturn: 13,
    description: 'Systematic discipline to reach your first 8-figure net worth milestone through equity compounding.'
  }
];

export const GoalPlanner: React.FC<GoalPlannerProps> = ({ onNavigate, onPlanGoal }) => {
  const [selectedGoalId, setSelectedGoalId] = useState<string>('education');
  const [chartVisualMode, setChartVisualMode] = useState<'area' | 'bar'>('area');
  
  const currentPreset = useMemo(() => {
    return GOAL_PRESETS.find((g) => g.id === selectedGoalId) || GOAL_PRESETS[0];
  }, [selectedGoalId]);

  // Input states
  const [targetCostToday, setTargetCostToday] = useState<number>(2500000);
  const [yearsToGoal, setYearsToGoal] = useState<number>(12);
  const [inflationRate, setInflationRate] = useState<number>(10);
  const [expectedReturn, setExpectedReturn] = useState<number>(13);
  const [existingSavings, setExistingSavings] = useState<number>(200000);

  // When preset changes, update defaults
  const handleSelectPreset = (preset: GoalPreset) => {
    setSelectedGoalId(preset.id);
    setTargetCostToday(preset.defaultCost);
    setYearsToGoal(preset.defaultYears);
    setInflationRate(preset.defaultInflation);
    setExpectedReturn(preset.defaultExpectedReturn);
  };

  // Perform calculation
  const plan = useMemo(() => {
    return calculateGoalPlan(
      targetCostToday,
      yearsToGoal,
      inflationRate,
      expectedReturn,
      existingSavings
    );
  }, [targetCostToday, yearsToGoal, inflationRate, expectedReturn, existingSavings]);

  const handleStartGoalSIP = () => {
    if (onPlanGoal) {
      onPlanGoal({
        goalName: currentPreset.name,
        targetCost: plan.targetFutureValue,
        monthlySIP: plan.requiredMonthlySIP,
        years: yearsToGoal
      });
    } else if (onNavigate) {
      onNavigate('open-account');
    }
  };

  const formatTooltipValue = (val: any) => {
    return `₹ ${Number(val).toLocaleString('en-IN')}`;
  };

  return (
    <div id="goal-planner-card" className="w-full bg-white border border-[#D3DCE6] rounded-2xl shadow-sm overflow-hidden">
      
      {/* Header Bar */}
      <div className="p-6 bg-[#F6F8FB] border-b border-[#D3DCE6]">
        <div className="inline-flex items-center gap-1.5 bg-[#E3ECF5] text-[#0F2740] px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-1">
          <Target className="w-3.5 h-3.5" />
          Goal-Based Financial Architecture
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F2740]">
          Inflation-Adjusted Life Goal Planner
        </h3>
        <p className="text-xs text-[#43566B] mt-0.5 max-w-3xl">
          Account for education, healthcare, and lifestyle inflation. Get the monthly SIP each goal needs, in future rupees.
        </p>
      </div>

      {/* Goal Preset Pills Selector */}
      <div className="p-4 sm:px-8 bg-[#ffffff] border-b border-[#E4EAF0] overflow-x-auto scrollbar-none flex gap-2">
        {GOAL_PRESETS.map((preset) => {
          const Icon = preset.icon;
          const isSelected = preset.id === selectedGoalId;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer border ${
                isSelected
                  ? 'bg-[#0F2740] text-white border-[#0F2740] shadow-xs'
                  : 'bg-[#F6F8FB] text-[#43566B] border-[#D3DCE6] hover:bg-[#EDF1F5]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-[#F3D58E]' : 'text-[#0F2740]'}`} />
              <span>{preset.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Inputs (7 cols) & Outputs/Charts (5 cols) */}
      <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#D3DCE6]">
        
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
          
          {/* Preset Context Callout */}
          <div className="p-3.5 bg-[#F6F8FB] rounded-xl border border-[#E4EAF0] text-xs text-[#43566B] leading-relaxed">
            <span className="font-bold text-[#0F2740]">{currentPreset.name}:</span> {currentPreset.description}
          </div>

          {/* Input 1: Goal Cost in Today's Value */}
          <SmartNumberInput
            id="goal-cost-today"
            label="Goal Cost in Today's Money"
            value={targetCostToday}
            onChange={(val) => setTargetCostToday(val)}
            min={100000}
            max={100000000}
            step={50000}
            isCurrency={true}
            icon={<Target className="w-4 h-4 text-[#0F2740]" />}
            minLabel="₹1 Lakh"
            midLabel="₹2.5 Crore"
            maxLabel="₹10 Crore"
            themeColor="blue"
            presets={[
              { label: '₹15 Lakh', value: 1500000 },
              { label: '₹30 Lakh', value: 3000000 },
              { label: '₹50 Lakh', value: 5000000 },
              { label: '₹1 Crore', value: 10000000 }
            ]}
            helperText="Type any exact amount like 3 Lakh, 2,50,890 or 1.5 Cr"
          />

          {/* Grid: Years to Goal & Inflation */}
          <div className="grid grid-cols-1 gap-4">
            
            {/* Years to Goal */}
            <SmartNumberInput
              id="goal-years"
              label="Time Horizon"
              value={yearsToGoal}
              onChange={(val) => setYearsToGoal(Math.max(1, val))}
              min={1}
              max={35}
              step={1}
              suffix=" Yrs"
              icon={<TrendingUp className="w-4 h-4 text-[#0F2740]" />}
              minLabel="1 Yr"
              maxLabel="35 Yrs"
              themeColor="blue"
              presets={[
                { label: '5 Yrs', value: 5 },
                { label: '10 Yrs', value: 10 },
                { label: '15 Yrs', value: 15 },
                { label: '20 Yrs', value: 20 }
              ]}
            />

            {/* Expected Inflation Rate */}
            <SmartNumberInput
              id="goal-inflation"
              label="Annual Inflation"
              value={inflationRate}
              onChange={(val) => setInflationRate(val)}
              min={0}
              max={15}
              step={0.5}
              suffix="%"
              icon={<TrendingUp className="w-4 h-4 text-amber-600" />}
              minLabel="0% (No Inflation)"
              maxLabel="15% (High)"
              themeColor="amber"
              presets={[
                { label: '6% (General)', value: 6 },
                { label: '8% (Lifestyle)', value: 8 },
                { label: '10% (Education)', value: 10 }
              ]}
            />

          </div>

          {/* Grid: Expected Returns & Existing Savings */}
          <div className="grid grid-cols-1 gap-4">
            
            {/* Expected MF Return */}
            <SmartNumberInput
              id="goal-return"
              label="Expected CAGR"
              value={expectedReturn}
              onChange={(val) => setExpectedReturn(val)}
              min={6}
              max={22}
              step={0.5}
              suffix="%"
              icon={<TrendingUp className="w-4 h-4 text-[#8A6420]" />}
              minLabel="6% (Debt)"
              maxLabel="22% (Equity)"
              themeColor="green"
              presets={[
                { label: '10% (Hybrid)', value: 10 },
                { label: '13% (Equity)', value: 13 },
                { label: '15% (Midcap)', value: 15 }
              ]}
            />

            {/* Existing Savings Dedicated to Goal */}
            <SmartNumberInput
              id="goal-existing-savings"
              label="Existing Savings Earmarked"
              value={existingSavings}
              onChange={(val) => setExistingSavings(val)}
              min={0}
              max={20000000}
              step={50000}
              isCurrency={true}
              icon={<ShieldCheck className="w-4 h-4 text-[#8A6420]" />}
              minLabel="₹0"
              maxLabel="₹2 Crore"
              themeColor="green"
              presets={[
                { label: '₹0', value: 0 },
                { label: '₹2 Lakh', value: 200000 },
                { label: '₹5 Lakh', value: 500000 },
                { label: '₹10 Lakh', value: 1000000 }
              ]}
            />

          </div>

          {/* Enhanced Growth Area Chart */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#0F2740] uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#8A6420]" />
                Corpus Accumulation Roadmap:
              </span>
              
              <div className="flex bg-[#E4EAF0] p-0.5 rounded-md border border-[#D3DCE6]">
                <button
                  type="button"
                  onClick={() => setChartVisualMode('area')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                    chartVisualMode === 'area' ? 'bg-[#0F2740] text-white' : 'text-[#43566B]'
                  }`}
                >
                  Area Curve
                </button>
                <button
                  type="button"
                  onClick={() => setChartVisualMode('bar')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                    chartVisualMode === 'bar' ? 'bg-[#0F2740] text-white' : 'text-[#43566B]'
                  }`}
                >
                  Yearly Bars
                </button>
              </div>
            </div>

            <div className="h-52 w-full bg-[#F6F8FB] rounded-xl p-2.5 border border-[#E4EAF0]">
              <ResponsiveContainer width="100%" height="100%">
                {chartVisualMode === 'area' ? (
                  <AreaChart data={plan.yearlyRoadmap} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="goalCorpusGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8A6420" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#8A6420" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="goalInvestedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0F2740" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0F2740" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" tickFormatter={(v) => `Yr ${v}`} tick={{ fontSize: 10, fill: '#6B7C8F' }} />
                    <YAxis
                      tickFormatter={(v) => v >= 10000000 ? `₹${(v / 10000000).toFixed(1)}Cr` : `₹${(v / 100000).toFixed(0)}L`}
                      tick={{ fontSize: 10, fill: '#6B7C8F' }}
                    />
                    <Tooltip formatter={formatTooltipValue} labelFormatter={(l) => `Year ${l}`} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '2px' }} />
                    <Area
                      type="monotone"
                      dataKey="expectedCorpus"
                      name="Projected Corpus"
                      stroke="#8A6420"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#goalCorpusGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="invested"
                      name="Cumulative Invested"
                      stroke="#0F2740"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#goalInvestedGrad)"
                    />
                  </AreaChart>
                ) : (
                  <BarChart data={plan.yearlyRoadmap} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <XAxis dataKey="year" tickFormatter={(v) => `Yr ${v}`} tick={{ fontSize: 10, fill: '#6B7C8F' }} />
                    <YAxis
                      tickFormatter={(v) => v >= 10000000 ? `₹${(v / 10000000).toFixed(1)}Cr` : `₹${(v / 100000).toFixed(0)}L`}
                      tick={{ fontSize: 10, fill: '#6B7C8F' }}
                    />
                    <Tooltip formatter={formatTooltipValue} labelFormatter={(l) => `Year ${l}`} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '2px' }} />
                    <Bar dataKey="invested" name="Invested Capital" fill="#0F2740" />
                    <Bar dataKey="expectedCorpus" name="Compounded Wealth" fill="#8A6420" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Output & Allocation Recommendation (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-[#F6F8FB] flex flex-col justify-between space-y-6">
          
          <div className="space-y-5">
            
            {/* Target Future Value Banner */}
            <div className="bg-white border border-[#D3DCE6] rounded-2xl p-5 shadow-xs">
              <span className="text-[11px] font-bold text-[#6B7C8F] uppercase tracking-wider block mb-1">
                Inflated Future Cost in {yearsToGoal} Years:
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#0F2740] tracking-tight">
                {formatIndianCurrency(plan.targetFutureValue)}
              </div>
              <p className="text-[11px] text-[#43566B] mt-1">
                Due to {inflationRate}% inflation, ₹{formatRawIndianNumber(targetCostToday)} today will equal this amount in year {new Date().getFullYear() + yearsToGoal}.
              </p>
            </div>

            {/* Required Monthly SIP Box */}
            <div className="bg-[#0F2740] text-white rounded-2xl p-5 shadow-md space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#F3D58E] uppercase tracking-wider">
                  Required Monthly SIP
                </span>
                <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  Recommended Plan
                </span>
              </div>
              <div className="text-3xl font-black tracking-tight text-white">
                ₹ {formatRawIndianNumber(plan.requiredMonthlySIP)}<span className="text-sm font-normal text-white/80">/month</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                At the return you assumed, this monthly SIP reaches your target. Review it once a year, since actual returns will differ.
              </p>
            </div>

            {/* Alternate: One-Time Lumpsum Option */}
            <div className="bg-white border border-[#D3DCE6] rounded-xl p-3.5 flex items-center justify-between text-xs">
              <div>
                <span className="text-[11px] text-[#6B7C8F] block">Or One-time Lumpsum Today:</span>
                <span className="font-extrabold text-[#13263B] text-sm">{formatIndianCurrency(plan.requiredLumpsumToday)}</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-[#6B7C8F] block">Time Remaining:</span>
                <span className="font-bold text-[#8A6420]">{yearsToGoal} Years ({yearsToGoal * 12} SIPs)</span>
              </div>
            </div>

            {/* Asset Allocation Strategy */}
            <div className="bg-white border border-[#D3DCE6] rounded-xl p-4 space-y-2.5">
              <span className="text-xs font-bold text-[#0F2740] block">
                Recommended Asset Allocation:
              </span>
              <div className="w-full h-3 bg-[#E4EAF0] rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${plan.equityAllocationPercent}%` }}
                  className="bg-[#8A6420] h-full"
                  title={`Equity: ${plan.equityAllocationPercent}%`}
                />
                <div
                  style={{ width: `${plan.debtAllocationPercent}%` }}
                  className="bg-[#0F2740] h-full"
                  title={`Debt/Hybrid: ${plan.debtAllocationPercent}%`}
                />
              </div>
              <div className="flex justify-between text-xs pt-0.5">
                <span className="flex items-center gap-1.5 text-[#8A6420] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#8A6420]" />
                  Equity Funds ({plan.equityAllocationPercent}%)
                </span>
                <span className="flex items-center gap-1.5 text-[#0F2740] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#0F2740]" />
                  Debt / Liquid ({plan.debtAllocationPercent}%)
                </span>
              </div>
            </div>

          </div>

          {/* Action CTA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleStartGoalSIP}
              className="w-full bg-[#8A6420] hover:bg-[#6F501A] text-white font-extrabold text-sm py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Start Goal SIP with Shaiv Market</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-center text-[#6B7C8F] mt-2">
              AMFI Certified Distribution (ARN-337289) • 100% Paperless Onboarding
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
