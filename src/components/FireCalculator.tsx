import React, { useState, useMemo } from 'react';
import {
  calculateFIRE,
  formatIndianCurrency,
  formatRawIndianNumber
} from '../utils/calculator';
import { ActiveScreen } from '../types';
import {
  Flame,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';

interface FireCalculatorProps {
  onNavigate?: (screen: ActiveScreen) => void;
}

export const FireCalculator: React.FC<FireCalculatorProps> = ({ onNavigate }) => {
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [targetFireAge, setTargetFireAge] = useState<number>(45);
  const [monthlyExpense, setMonthlyExpense] = useState<number>(60000); // 60k/mo expenses
  const [monthlySavings, setMonthlySavings] = useState<number>(40000); // 40k/mo savings
  const [currentNetWorth, setCurrentNetWorth] = useState<number>(1500000); // 15 Lakh net worth
  const [monthlyIncome, setMonthlyIncome] = useState<number>(120000); // 1.2 Lakh monthly income
  const [inflationRate, setInflationRate] = useState<number>(6.0); // 6%
  const [expectedReturn, setExpectedReturn] = useState<number>(13.0); // 13% CAGR

  const fire = useMemo(() => {
    return calculateFIRE(
      currentAge,
      targetFireAge,
      monthlyExpense,
      monthlySavings,
      currentNetWorth,
      monthlyIncome,
      inflationRate,
      expectedReturn
    );
  }, [currentAge, targetFireAge, monthlyExpense, monthlySavings, currentNetWorth, monthlyIncome, inflationRate, expectedReturn]);

  // Generate Year-by-Year Net Worth Trajectory vs Target FIRE Number
  const fireChartData = useMemo(() => {
    const data = [];
    const monthlyRate = expectedReturn / 12 / 100;
    let runningNetWorth = currentNetWorth;
    const yearsToSimulate = Math.max(1, targetFireAge - currentAge);

    for (let yr = 0; yr <= yearsToSimulate; yr++) {
      const age = currentAge + yr;
      if (yr > 0) {
        for (let m = 1; m <= 12; m++) {
          runningNetWorth = (runningNetWorth + monthlySavings) * (1 + monthlyRate);
        }
      }
      data.push({
        ageLabel: `Age ${age}`,
        age,
        netWorth: Math.round(runningNetWorth),
        targetFire: fire.fireCorpusRequired,
        leanFire: fire.leanFireCorpus
      });
    }
    return data;
  }, [currentAge, targetFireAge, monthlySavings, currentNetWorth, expectedReturn, fire]);

  const formatTooltipValue = (val: any) => {
    return `₹ ${Number(val).toLocaleString('en-IN')}`;
  };

  return (
    <div id="fire-calculator-card" className="w-full bg-white border border-[#D3DCE6] rounded-2xl shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="p-6 bg-[#F6F8FB] border-b border-[#D3DCE6]">
        <div className="inline-flex items-center gap-1.5 bg-[#ffeed9] text-[#9c4100] px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-1">
          <Flame className="w-3.5 h-3.5 text-[#e25000]" />
          Financial Independence & Early Retirement (FIRE)
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F2740]">
          FIRE Number & Freedom Timeline Engine
        </h3>
        <p className="text-xs text-[#43566B] mt-0.5 max-w-3xl">
          Work out the corpus that could make work optional, based on your expenses, savings and timeline.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#D3DCE6]">
        
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
          
          {/* Age Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 bg-[#F6F8FB] p-3.5 rounded-xl border border-[#E4EAF0]">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#43566B]">Current Age</span>
                <span className="font-extrabold text-sm text-[#0F2740]">{currentAge} Years</span>
              </div>
              <input
                type="range"
                min={20}
                max={55}
                step={1}
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="w-full h-1.5 bg-[#E4EAF0] rounded-lg appearance-none cursor-pointer accent-[#0F2740]"
              />
            </div>

            <div className="space-y-1.5 bg-[#F6F8FB] p-3.5 rounded-xl border border-[#E4EAF0]">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#43566B]">Target FIRE Retirement Age</span>
                <span className="font-extrabold text-sm text-[#e25000]">{targetFireAge} Years</span>
              </div>
              <input
                type="range"
                min={currentAge + 1}
                max={65}
                step={1}
                value={targetFireAge}
                onChange={(e) => setTargetFireAge(Number(e.target.value))}
                className="w-full h-1.5 bg-[#E4EAF0] rounded-lg appearance-none cursor-pointer accent-[#e25000]"
              />
            </div>
          </div>

          {/* Slider 1: Monthly Living Expense */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#43566B]">Current Monthly Living Expenses</span>
              <span className="font-extrabold text-sm text-[#ba1a1a] bg-[#fff0f0] border border-[#ffc2c2] px-2.5 py-1 rounded-md">
                ₹ {formatRawIndianNumber(monthlyExpense)} / month
              </span>
            </div>
            <input
              type="range"
              min={15000}
              max={300000}
              step={5000}
              value={monthlyExpense}
              onChange={(e) => setMonthlyExpense(Number(e.target.value))}
              className="w-full h-2 bg-[#E4EAF0] rounded-lg appearance-none cursor-pointer accent-[#ba1a1a]"
            />
            <div className="flex justify-between text-[10px] text-[#6B7C8F]">
              <span>₹15,000/mo</span>
              <span>₹1,50,000/mo</span>
              <span>₹3,00,000/mo</span>
            </div>
          </div>

          {/* Slider 2: Monthly Investments */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#43566B]">Current Monthly Mutual Fund Investment</span>
              <span className="font-extrabold text-sm text-[#8A6420] bg-[#FBF6EA] border border-[#F6E7C1] px-2.5 py-1 rounded-md">
                ₹ {formatRawIndianNumber(monthlySavings)} / month
              </span>
            </div>
            <input
              type="range"
              min={5000}
              max={250000}
              step={2500}
              value={monthlySavings}
              onChange={(e) => setMonthlySavings(Number(e.target.value))}
              className="w-full h-2 bg-[#E4EAF0] rounded-lg appearance-none cursor-pointer accent-[#8A6420]"
            />
            <div className="flex justify-between text-[10px] text-[#6B7C8F]">
              <span>₹5,000/mo</span>
              <span>₹1,25,000/mo</span>
              <span>₹2,50,000/mo</span>
            </div>
          </div>

          {/* Slider 3: Current Accumulated Net Worth */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#43566B]">Current Liquid Savings / Net Worth</span>
              <span className="font-extrabold text-sm text-[#0F2740] bg-[#EDF1F5] px-2.5 py-1 rounded-md">
                {formatIndianCurrency(currentNetWorth)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={20000000}
              step={100000}
              value={currentNetWorth}
              onChange={(e) => setCurrentNetWorth(Number(e.target.value))}
              className="w-full h-2 bg-[#E4EAF0] rounded-lg appearance-none cursor-pointer accent-[#0F2740]"
            />
          </div>

          {/* FIRE Trajectory Area Chart */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-[#0F2740] uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#8A6420]" />
              Visual Freedom Curve (Net Worth vs Age):
            </span>
            <div className="h-44 w-full bg-[#F6F8FB] rounded-xl p-2.5 border border-[#E4EAF0]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={fireChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fireGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8A6420" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8A6420" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="ageLabel" tick={{ fontSize: 10, fill: '#6B7C8F' }} />
                  <YAxis
                    tickFormatter={(v) => v >= 10000000 ? `₹${(v / 10000000).toFixed(1)}Cr` : `₹${(v / 100000).toFixed(0)}L`}
                    tick={{ fontSize: 10, fill: '#6B7C8F' }}
                  />
                  <Tooltip formatter={formatTooltipValue} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '2px' }} />
                  <Area
                    type="monotone"
                    dataKey="netWorth"
                    name="Projected Net Worth"
                    stroke="#8A6420"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#fireGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3 FIRE Tiers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            
            <div className="bg-[#F6F8FB] border border-[#D3DCE6] rounded-xl p-3 space-y-1">
              <span className="text-[10px] font-bold text-[#6B7C8F] uppercase tracking-wider block">
                1. Lean FIRE (Frugal)
              </span>
              <div className="text-sm sm:text-base font-extrabold text-[#0F2740]">
                {formatIndianCurrency(fire.leanFireCorpus)}
              </div>
              <span className="text-[10px] text-[#43566B] block">
                Basic essentials covered
              </span>
            </div>

            <div className="bg-[#E3ECF5] border border-[#C9DAEA] rounded-xl p-3 space-y-1">
              <span className="text-[10px] font-bold text-[#0F2740] uppercase tracking-wider block">
                2. Standard FIRE (Target)
              </span>
              <div className="text-sm sm:text-base font-extrabold text-[#0F2740]">
                {formatIndianCurrency(fire.fireCorpusRequired)}
              </div>
              <span className="text-[10px] text-[#0F2740] block">
                Current lifestyle maintained
              </span>
            </div>

            <div className="bg-[#F6F8FB] border border-[#D3DCE6] rounded-xl p-3 space-y-1">
              <span className="text-[10px] font-bold text-[#6B7C8F] uppercase tracking-wider block">
                3. Fat FIRE (Luxurious)
              </span>
              <div className="text-sm sm:text-base font-extrabold text-[#8A6420]">
                {formatIndianCurrency(fire.fatFireCorpus)}
              </div>
              <span className="text-[10px] text-[#43566B] block">
                Frequent travel & luxury
              </span>
            </div>

          </div>

        </div>

        {/* Right Output & Strategy (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-[#F6F8FB] flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            
            {/* Main FIRE Target Banner */}
            <div className="bg-[#0F2740] text-white rounded-2xl p-6 shadow-md space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#F3D58E] uppercase tracking-wider">
                  Target FIRE Number (Corpus)
                </span>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Age {targetFireAge}
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {formatIndianCurrency(fire.fireCorpusRequired)}
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                At {inflationRate}% inflation, your annual expenses will be {formatIndianCurrency(fire.futureAnnualExpenseAtRetirement)}/year. At a 3.5% yearly withdrawal, this corpus is sized to last through a long early retirement. Returns are not guaranteed.
              </p>
            </div>

            {/* Savings Feasibility Assessment */}
            <div className="bg-white border border-[#D3DCE6] rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#43566B]">Monthly Savings Rate</span>
                <span className="font-extrabold text-[#8A6420]">{fire.savingsRatePercent}% of Income</span>
              </div>
              
              <div className="w-full h-2.5 bg-[#E4EAF0] rounded-full overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, fire.savingsRatePercent)}%` }}
                  className="bg-[#8A6420] h-full"
                />
              </div>

              <div className="text-xs pt-1 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#6B7C8F]">Required Monthly SIP:</span>
                  <span className="font-extrabold text-[#0F2740]">₹ {formatRawIndianNumber(fire.monthlySavingsRequired)} / mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7C8F]">Years to Financial Freedom:</span>
                  <span className="font-bold text-[#8A6420]">{fire.yearsToFire} Years</span>
                </div>
              </div>
            </div>

            {/* Rule of 25 Explanation */}
            <div className="bg-white border border-[#D3DCE6] rounded-xl p-4 text-xs text-[#43566B] space-y-1">
              <strong className="text-[#0F2740] block">The Indian Safe Withdrawal Rule (3.5%):</strong>
              <p className="leading-relaxed text-[11px]">
                Withdrawing about 3.5% of the corpus in the first year, then raising it with inflation, leaves room for weak market years over a retirement that may last 40 years or more. It is a planning rule of thumb, not a guarantee.
              </p>
            </div>

          </div>

          {/* Action CTA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate?.('open-account')}
              className="w-full bg-[#8A6420] hover:bg-[#6F501A] text-white font-extrabold text-sm py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Build Your FIRE Portfolio Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-center text-[#6B7C8F] mt-2">
              AMFI Certified Distribution (ARN-337289) • Personalized Goal Architecture
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
