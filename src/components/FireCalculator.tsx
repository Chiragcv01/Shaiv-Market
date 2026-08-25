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
    <div id="fire-calculator-card" className="w-full bg-white border border-[#c2c6d1] rounded-2xl shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="p-6 bg-[#f7f9fb] border-b border-[#c2c6d1]">
        <div className="inline-flex items-center gap-1.5 bg-[#ffeed9] text-[#9c4100] px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-1">
          <Flame className="w-3.5 h-3.5 text-[#e25000]" />
          Financial Independence & Early Retirement (FIRE)
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#003461]">
          FIRE Number & Freedom Timeline Engine
        </h3>
        <p className="text-xs text-[#424750] mt-0.5 max-w-3xl">
          Calculate your exact target corpus required to never have to work for money again, based on your current lifestyle and savings rate.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#c2c6d1]">
        
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
          
          {/* Age Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 bg-[#f7f9fb] p-3.5 rounded-xl border border-[#e0e3e5]">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#424750]">Current Age</span>
                <span className="font-extrabold text-sm text-[#003461]">{currentAge} Years</span>
              </div>
              <input
                type="range"
                min={20}
                max={55}
                step={1}
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="w-full h-1.5 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer accent-[#003461]"
              />
            </div>

            <div className="space-y-1.5 bg-[#f7f9fb] p-3.5 rounded-xl border border-[#e0e3e5]">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#424750]">Target FIRE Retirement Age</span>
                <span className="font-extrabold text-sm text-[#e25000]">{targetFireAge} Years</span>
              </div>
              <input
                type="range"
                min={currentAge + 1}
                max={65}
                step={1}
                value={targetFireAge}
                onChange={(e) => setTargetFireAge(Number(e.target.value))}
                className="w-full h-1.5 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer accent-[#e25000]"
              />
            </div>
          </div>

          {/* Slider 1: Monthly Living Expense */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#424750]">Current Monthly Living Expenses</span>
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
              className="w-full h-2 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer accent-[#ba1a1a]"
            />
            <div className="flex justify-between text-[10px] text-[#727781]">
              <span>₹15,000/mo</span>
              <span>₹1,50,000/mo</span>
              <span>₹3,00,000/mo</span>
            </div>
          </div>

          {/* Slider 2: Monthly Investments */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#424750]">Current Monthly Mutual Fund Investment</span>
              <span className="font-extrabold text-sm text-[#006d42] bg-[#f0fdf4] border border-[#bbf7d0] px-2.5 py-1 rounded-md">
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
              className="w-full h-2 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer accent-[#006d42]"
            />
            <div className="flex justify-between text-[10px] text-[#727781]">
              <span>₹5,000/mo</span>
              <span>₹1,25,000/mo</span>
              <span>₹2,50,000/mo</span>
            </div>
          </div>

          {/* Slider 3: Current Accumulated Net Worth */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#424750]">Current Liquid Savings / Net Worth</span>
              <span className="font-extrabold text-sm text-[#003461] bg-[#eceef0] px-2.5 py-1 rounded-md">
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
              className="w-full h-2 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer accent-[#003461]"
            />
          </div>

          {/* FIRE Trajectory Area Chart */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-[#003461] uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#006d42]" />
              Visual Freedom Curve (Net Worth vs Age):
            </span>
            <div className="h-44 w-full bg-[#f7f9fb] rounded-xl p-2.5 border border-[#e0e3e5]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={fireChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fireGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#006d42" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#006d42" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="ageLabel" tick={{ fontSize: 10, fill: '#727781' }} />
                  <YAxis
                    tickFormatter={(v) => v >= 10000000 ? `₹${(v / 10000000).toFixed(1)}Cr` : `₹${(v / 100000).toFixed(0)}L`}
                    tick={{ fontSize: 10, fill: '#727781' }}
                  />
                  <Tooltip formatter={formatTooltipValue} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '2px' }} />
                  <Area
                    type="monotone"
                    dataKey="netWorth"
                    name="Projected Net Worth"
                    stroke="#006d42"
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
            
            <div className="bg-[#f7f9fb] border border-[#c2c6d1] rounded-xl p-3 space-y-1">
              <span className="text-[10px] font-bold text-[#727781] uppercase tracking-wider block">
                1. Lean FIRE (Frugal)
              </span>
              <div className="text-sm sm:text-base font-extrabold text-[#003461]">
                {formatIndianCurrency(fire.leanFireCorpus)}
              </div>
              <span className="text-[10px] text-[#424750] block">
                Basic essentials covered
              </span>
            </div>

            <div className="bg-[#d3e4fe] border border-[#b8d5fc] rounded-xl p-3 space-y-1">
              <span className="text-[10px] font-bold text-[#003461] uppercase tracking-wider block">
                2. Standard FIRE (Target)
              </span>
              <div className="text-sm sm:text-base font-extrabold text-[#003461]">
                {formatIndianCurrency(fire.fireCorpusRequired)}
              </div>
              <span className="text-[10px] text-[#003461] block">
                Current lifestyle maintained
              </span>
            </div>

            <div className="bg-[#f7f9fb] border border-[#c2c6d1] rounded-xl p-3 space-y-1">
              <span className="text-[10px] font-bold text-[#727781] uppercase tracking-wider block">
                3. Fat FIRE (Luxurious)
              </span>
              <div className="text-sm sm:text-base font-extrabold text-[#006d42]">
                {formatIndianCurrency(fire.fatFireCorpus)}
              </div>
              <span className="text-[10px] text-[#424750] block">
                Frequent travel & luxury
              </span>
            </div>

          </div>

        </div>

        {/* Right Output & Strategy (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-[#f7f9fb] flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            
            {/* Main FIRE Target Banner */}
            <div className="bg-[#003461] text-white rounded-2xl p-6 shadow-md space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#96f6bd] uppercase tracking-wider">
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
                At {inflationRate}% inflation, your annual expenses will be {formatIndianCurrency(fire.futureAnnualExpenseAtRetirement)}/year. This corpus generates perpetual income.
              </p>
            </div>

            {/* Savings Feasibility Assessment */}
            <div className="bg-white border border-[#c2c6d1] rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#424750]">Monthly Savings Rate</span>
                <span className="font-extrabold text-[#006d42]">{fire.savingsRatePercent}% of Income</span>
              </div>
              
              <div className="w-full h-2.5 bg-[#e0e3e5] rounded-full overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, fire.savingsRatePercent)}%` }}
                  className="bg-[#006d42] h-full"
                />
              </div>

              <div className="text-xs pt-1 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#727781]">Required Monthly SIP:</span>
                  <span className="font-extrabold text-[#003461]">₹ {formatRawIndianNumber(fire.monthlySavingsRequired)} / mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#727781]">Years to Financial Freedom:</span>
                  <span className="font-bold text-[#006d42]">{fire.yearsToFire} Years</span>
                </div>
              </div>
            </div>

            {/* Rule of 25 Explanation */}
            <div className="bg-white border border-[#c2c6d1] rounded-xl p-4 text-xs text-[#424750] space-y-1">
              <strong className="text-[#003461] block">The Indian Safe Withdrawal Rule (3.5%):</strong>
              <p className="leading-relaxed text-[11px]">
                By investing your retirement corpus into a combination of Equity Flexi-Cap, Balanced Advantage, and Arbitrage funds, a 3.5% annual SWP withdrawal lets you live off capital gains without ever eroding the core principal.
              </p>
            </div>

          </div>

          {/* Action CTA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate?.('open-account')}
              className="w-full bg-[#006d42] hover:bg-[#005231] text-white font-extrabold text-sm py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Build Your FIRE Portfolio Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-center text-[#727781] mt-2">
              AMFI Certified Distribution (ARN-284912) • Personalized Goal Architecture
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
