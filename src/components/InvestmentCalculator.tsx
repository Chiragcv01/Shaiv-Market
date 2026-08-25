import React, { useState, useMemo } from 'react';
import { CalculatorType, ActiveScreen } from '../types';
import {
  calculateSIP,
  calculateLumpsum,
  calculateStepUpSIP,
  calculateSipPlusLumpsum,
  formatIndianCurrency,
  formatRawIndianNumber
} from '../utils/calculator';
import { ArrowRight, Sparkles, TrendingUp, PieChart as PieIcon, LineChart as LineIcon } from 'lucide-react';
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

interface InvestmentCalculatorProps {
  onInvestNow?: (details: { type: CalculatorType; monthly: number; years: number; lumpsum?: number }) => void;
  onNavigate?: (screen: ActiveScreen) => void;
}

export const InvestmentCalculator: React.FC<InvestmentCalculatorProps> = ({
  onInvestNow,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<CalculatorType>('sip');
  const [chartMode, setChartMode] = useState<'growth' | 'donut'>('growth');

  // State values
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(25000);
  const [expectedReturnRate, setExpectedReturnRate] = useState<number>(12);
  const [timePeriodYears, setTimePeriodYears] = useState<number>(15);
  
  // For Lumpsum & Step-up
  const [lumpsumAmount, setLumpsumAmount] = useState<number>(100000);
  const [stepUpPercent, setStepUpPercent] = useState<number>(10);

  // Compute calculated metrics
  const calculation = useMemo(() => {
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

  // Generate Year-by-Year Growth Chart Data
  const chartData = useMemo(() => {
    const data = [];
    const monthlyRate = expectedReturnRate / 12 / 100;
    
    let currentInvested = 0;
    let currentTotal = 0;
    let currentMonthly = monthlyInvestment;

    if (activeTab === 'lumpsum') {
      currentInvested = lumpsumAmount;
      currentTotal = lumpsumAmount;
    } else if (activeTab === 'sip-lumpsum') {
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
  }, [activeTab, monthlyInvestment, expectedReturnRate, timePeriodYears, lumpsumAmount, stepUpPercent]);

  // Donut chart dataset
  const donutData = useMemo(() => [
    { name: 'Total Invested', value: calculation.investedAmount, color: '#d3e4fe' },
    { name: 'Estimated Returns', value: calculation.estimatedReturns, color: '#006d42' }
  ], [calculation]);

  const handleAction = () => {
    if (onInvestNow) {
      onInvestNow({
        type: activeTab,
        monthly: monthlyInvestment,
        years: timePeriodYears,
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
        
        {/* Controls Area (Left / Top) */}
        <div className="w-full lg:w-3/5 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-[#c2c6d1]">
          
          {/* Tabs */}
          <div className="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-none border-b border-[#e0e3e5]">
            <button
              id="calc-tab-sip"
              onClick={() => setActiveTab('sip')}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                activeTab === 'sip'
                  ? 'bg-[#003461] text-white shadow-xs'
                  : 'text-[#424750] hover:bg-[#eceef0] hover:text-[#003461]'
              }`}
            >
              Monthly SIP
            </button>
            <button
              id="calc-tab-lumpsum"
              onClick={() => setActiveTab('lumpsum')}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                activeTab === 'lumpsum'
                  ? 'bg-[#003461] text-white shadow-xs'
                  : 'text-[#424750] hover:bg-[#eceef0] hover:text-[#003461]'
              }`}
            >
              Lumpsum One-Time
            </button>
            <button
              id="calc-tab-stepup"
              onClick={() => setActiveTab('step-up')}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                activeTab === 'step-up'
                  ? 'bg-[#003461] text-white shadow-xs'
                  : 'text-[#424750] hover:bg-[#eceef0] hover:text-[#003461]'
              }`}
            >
              Step-up SIP
            </button>
            <button
              id="calc-tab-sip-lumpsum"
              onClick={() => setActiveTab('sip-lumpsum')}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                activeTab === 'sip-lumpsum'
                  ? 'bg-[#003461] text-white shadow-xs'
                  : 'text-[#424750] hover:bg-[#eceef0] hover:text-[#003461]'
              }`}
            >
              SIP + Lumpsum
            </button>
          </div>

          {/* Sliders Container */}
          <div className="space-y-6">
            
            {/* Monthly Investment Slider (when applicable) */}
            {(activeTab === 'sip' || activeTab === 'step-up' || activeTab === 'sip-lumpsum') && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="slider-monthly" className="text-sm sm:text-base font-semibold text-[#191c1e]">
                    Monthly Investment
                  </label>
                  <div className="bg-[#e6e8ea] px-3 py-1 rounded-md border border-[#c2c6d1] text-sm sm:text-base font-bold text-[#003461]">
                    ₹ {formatRawIndianNumber(monthlyInvestment)}
                  </div>
                </div>
                <input
                  id="slider-monthly"
                  type="range"
                  min="500"
                  max="100000"
                  step="500"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                  aria-label="Monthly Investment Amount"
                  className="w-full accent-[#003461] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-semibold text-[#727781]">
                  <span>₹ 500</span>
                  <span>₹ 50,000</span>
                  <span>₹ 1L+</span>
                </div>
              </div>
            )}

            {/* Lumpsum Amount Slider (when applicable) */}
            {(activeTab === 'lumpsum' || activeTab === 'sip-lumpsum') && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="slider-lumpsum" className="text-sm sm:text-base font-semibold text-[#191c1e]">
                    {activeTab === 'sip-lumpsum' ? 'Initial Lumpsum Capital' : 'One-time Investment'}
                  </label>
                  <div className="bg-[#e6e8ea] px-3 py-1 rounded-md border border-[#c2c6d1] text-sm sm:text-base font-bold text-[#003461]">
                    ₹ {formatRawIndianNumber(lumpsumAmount)}
                  </div>
                </div>
                <input
                  id="slider-lumpsum"
                  type="range"
                  min="5000"
                  max="2000000"
                  step="5000"
                  value={lumpsumAmount}
                  onChange={(e) => setLumpsumAmount(Number(e.target.value))}
                  aria-label="Lumpsum Investment Amount"
                  className="w-full accent-[#003461] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-semibold text-[#727781]">
                  <span>₹ 5,000</span>
                  <span>₹ 10L</span>
                  <span>₹ 20L+</span>
                </div>
              </div>
            )}

            {/* Step-up percentage slider (when applicable) */}
            {activeTab === 'step-up' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="slider-stepup" className="text-sm sm:text-base font-semibold text-[#191c1e]">
                    Annual Step-up Rate (% yearly increase)
                  </label>
                  <div className="bg-[#e6e8ea] px-3 py-1 rounded-md border border-[#c2c6d1] text-sm sm:text-base font-bold text-[#003461]">
                    {stepUpPercent}% yearly
                  </div>
                </div>
                <input
                  id="slider-stepup"
                  type="range"
                  min="2"
                  max="30"
                  step="1"
                  value={stepUpPercent}
                  onChange={(e) => setStepUpPercent(Number(e.target.value))}
                  aria-label="Annual Step-up Rate"
                  className="w-full accent-[#003461] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-semibold text-[#727781]">
                  <span>2%</span>
                  <span>10% (Recommended)</span>
                  <span>30%</span>
                </div>
              </div>
            )}

            {/* Expected Return Rate Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="slider-return" className="text-sm sm:text-base font-semibold text-[#191c1e]">
                  Expected Return Rate (CAGR p.a.)
                </label>
                <div className="bg-[#e6e8ea] px-3 py-1 rounded-md border border-[#c2c6d1] text-sm sm:text-base font-bold text-[#003461]">
                  {expectedReturnRate}%
                </div>
              </div>
              <input
                id="slider-return"
                type="range"
                min="1"
                max="30"
                step="0.5"
                value={expectedReturnRate}
                onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
                aria-label="Expected Annual Return Rate"
                className="w-full accent-[#003461] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-semibold text-[#727781]">
                <span>1% (Savings)</span>
                <span>12% - 15% (Equity MF Avg)</span>
                <span>30% (Aggressive)</span>
              </div>
            </div>

            {/* Time Period Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="slider-period" className="text-sm sm:text-base font-semibold text-[#191c1e]">
                  Investment Duration
                </label>
                <div className="bg-[#e6e8ea] px-3 py-1 rounded-md border border-[#c2c6d1] text-sm sm:text-base font-bold text-[#003461]">
                  {timePeriodYears} {timePeriodYears === 1 ? 'Year' : 'Years'}
                </div>
              </div>
              <input
                id="slider-period"
                type="range"
                min="1"
                max="40"
                step="1"
                value={timePeriodYears}
                onChange={(e) => setTimePeriodYears(Number(e.target.value))}
                aria-label="Investment Time Period in Years"
                className="w-full accent-[#003461] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-semibold text-[#727781]">
                <span>1 Yr</span>
                <span>15 Yrs (Long-term Wealth)</span>
                <span>40 Yrs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Charts & Results Area (Right / Bottom) */}
        <div className="w-full lg:w-2/5 bg-[#f7f9fb] p-6 sm:p-8 flex flex-col justify-between">
          
          {/* Chart Header & Mode Switcher */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#003461] flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#006d42]" />
                Visual Growth Projection
              </span>

              <div className="flex bg-[#e0e3e5] p-0.5 rounded-lg border border-[#c2c6d1]">
                <button
                  type="button"
                  onClick={() => setChartMode('growth')}
                  className={`px-2 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    chartMode === 'growth' ? 'bg-white text-[#003461] shadow-2xs' : 'text-[#727781]'
                  }`}
                  title="Growth Trajectory Curve"
                >
                  <LineIcon className="w-3 h-3" />
                  <span>Growth</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChartMode('donut')}
                  className={`px-2 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    chartMode === 'donut' ? 'bg-white text-[#003461] shadow-2xs' : 'text-[#727781]'
                  }`}
                  title="Allocation Breakdown"
                >
                  <PieIcon className="w-3 h-3" />
                  <span>Split</span>
                </button>
              </div>
            </div>

            {/* Visual Chart Canvas */}
            <div className="w-full h-48 bg-white border border-[#c2c6d1] rounded-xl p-2 shadow-2xs flex items-center justify-center">
              {chartMode === 'growth' ? (
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
                      tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
                    />
                    <Tooltip formatter={formatTooltipValue} />
                    <Area
                      type="monotone"
                      dataKey="wealth"
                      name="Total Wealth"
                      stroke="#006d42"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#wealthGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="invested"
                      name="Invested Amount"
                      stroke="#003461"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#investedGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={68}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={formatTooltipValue} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Metrics Summary Cards */}
          <div className="w-full space-y-2.5 my-4">
            
            {/* Total Estimated Value */}
            <div className="p-3.5 bg-[#003461] text-white rounded-xl shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-white/80 uppercase tracking-wider block">
                  Projected Maturity Corpus
                </span>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#96f6bd]">
                  {formatIndianCurrency(calculation.totalValue)}
                </span>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-white/20 uppercase tracking-wider">
                  {(calculation.totalValue / (calculation.investedAmount || 1)).toFixed(1)}x Growth
                </span>
              </div>
            </div>

            {/* Invested Amount */}
            <div className="flex justify-between items-center p-2.5 sm:p-3 bg-white border border-[#c2c6d1] rounded-xl shadow-2xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#003461]" />
                <span className="text-xs text-[#424750] font-semibold">Total Invested</span>
              </div>
              <span className="text-sm sm:text-base font-bold text-[#191c1e]">
                {formatIndianCurrency(calculation.investedAmount)}
              </span>
            </div>

            {/* Estimated Returns */}
            <div className="flex justify-between items-center p-2.5 sm:p-3 bg-white border border-[#c2c6d1] rounded-xl shadow-2xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#006d42]" />
                <span className="text-xs text-[#424750] font-semibold">Estimated Gains</span>
              </div>
              <span className="text-sm sm:text-base font-bold text-[#006d42]">
                {formatIndianCurrency(calculation.estimatedReturns)}
              </span>
            </div>
          </div>

          {/* CTA Action */}
          <button
            id="calc-invest-now-btn"
            onClick={handleAction}
            className="w-full bg-[#003461] hover:bg-[#004b87] active:bg-[#002647] text-white font-bold text-xs sm:text-sm py-3 px-5 rounded-xl shadow-xs hover:shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Get Quote & Start Investing</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
