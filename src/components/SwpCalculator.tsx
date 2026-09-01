import React, { useState, useMemo } from 'react';
import { SmartNumberInput } from './SmartNumberInput';
import {
  calculateSWP,
  formatIndianCurrency,
  formatRawIndianNumber
} from '../utils/calculator';
import { ActiveScreen } from '../types';
import {
  Wallet,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  HelpCircle
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
  Legend
} from 'recharts';

interface SwpCalculatorProps {
  onNavigate?: (screen: ActiveScreen) => void;
}

export const SwpCalculator: React.FC<SwpCalculatorProps> = ({ onNavigate }) => {
  const [initialCorpus, setInitialCorpus] = useState<number>(5000000); // 50 Lakhs
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState<number>(35000); // 35k/mo
  const [expectedReturn, setExpectedReturn] = useState<number>(8.5); // 8.5% conservative hybrid
  const [tenureYears, setTenureYears] = useState<number>(20);
  const [inflationStepUp, setInflationStepUp] = useState<number>(0); // Annual increase in pension
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  const swp = useMemo(() => {
    return calculateSWP(
      initialCorpus,
      monthlyWithdrawal,
      expectedReturn,
      tenureYears,
      inflationStepUp
    );
  }, [initialCorpus, monthlyWithdrawal, expectedReturn, tenureYears, inflationStepUp]);

  // Compute sustainability ratio (Monthly withdrawal as % of initial corpus)
  const annualWithdrawalRate = ((monthlyWithdrawal * 12) / initialCorpus) * 100;
  const isSafeWithdrawalRate = annualWithdrawalRate <= (expectedReturn - 2);

  return (
    <div id="swp-calculator-card" className="w-full bg-white border border-[#c2c6d1] rounded-2xl shadow-sm overflow-hidden">
      
      {/* Header Bar */}
      <div className="p-6 bg-[#f7f9fb] border-b border-[#c2c6d1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#d3e4fe] text-[#003461] px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-1">
            <Wallet className="w-3.5 h-3.5" />
            Systematic Withdrawal Plan (SWP)
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#003461]">
            Monthly Pension & Capital Sustainability Simulator
          </h3>
          <p className="text-xs text-[#424750] mt-0.5">
            Ideal for retirees, HNI living off investments, and regular cash-flow planning with maximum tax efficiency.
          </p>
        </div>

        {/* Chart vs Table Toggle */}
        <div className="flex bg-[#eceef0] p-1 rounded-xl border border-[#c2c6d1] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('chart')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'chart' ? 'bg-[#003461] text-white shadow-2xs' : 'text-[#424750] hover:text-[#003461]'
            }`}
          >
            Growth Chart
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'table' ? 'bg-[#003461] text-white shadow-2xs' : 'text-[#424750] hover:text-[#003461]'
            }`}
          >
            Yearly Statement
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#c2c6d1]">
        
        {/* Controls Column (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-4">
          
          {/* Input 1: Total Initial Corpus */}
          <SmartNumberInput
            id="swp-initial-corpus"
            label="Total Investment Corpus to Park"
            value={initialCorpus}
            onChange={(val) => setInitialCorpus(val)}
            min={100000}
            max={100000000}
            step={100000}
            isCurrency={true}
            icon={<Wallet className="w-4 h-4 text-[#003461]" />}
            minLabel="₹1 Lakh"
            midLabel="₹2.5 Crore"
            maxLabel="₹10 Crore"
            themeColor="blue"
            presets={[
              { label: '₹25 Lakh', value: 2500000 },
              { label: '₹50 Lakh', value: 5000000 },
              { label: '₹1 Crore', value: 10000000 },
              { label: '₹2.5 Crore', value: 25000000 }
            ]}
            helperText="Type any exact amount like 3000000 or 50 Lakh"
          />

          {/* Input 2: Monthly SWP Withdrawal Amount */}
          <SmartNumberInput
            id="swp-monthly-payout"
            label="Desired Monthly SWP Payout (Pension)"
            value={monthlyWithdrawal}
            onChange={(val) => setMonthlyWithdrawal(val)}
            min={1000}
            max={1000000}
            step={1000}
            isCurrency={true}
            icon={<Calendar className="w-4 h-4 text-[#006d42]" />}
            minLabel="₹1,000/mo"
            midLabel="₹1,00,000/mo"
            maxLabel="₹10 Lakh/mo"
            themeColor="green"
            presets={[
              { label: '₹25,000/mo', value: 25000 },
              { label: '₹50,000/mo', value: 50000 },
              { label: '₹75,000/mo', value: 75000 },
              { label: '₹1 Lakh/mo', value: 100000 }
            ]}
          />

          {/* Grid: Expected Return & Tenure */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <SmartNumberInput
              id="swp-return-rate"
              label="Expected Return (p.a.)"
              value={expectedReturn}
              onChange={(val) => setExpectedReturn(val)}
              min={5}
              max={16}
              step={0.5}
              suffix="%"
              icon={<TrendingUp className="w-4 h-4 text-[#003461]" />}
              minLabel="5% (Conservative)"
              maxLabel="16% (Aggressive)"
              themeColor="blue"
              presets={[
                { label: '7% Debt', value: 7 },
                { label: '8.5% Hybrid', value: 8.5 },
                { label: '11% Equity', value: 11 }
              ]}
            />

            <SmartNumberInput
              id="swp-tenure-years"
              label="Withdrawal Period"
              value={tenureYears}
              onChange={(val) => setTenureYears(Math.max(1, val))}
              min={1}
              max={40}
              step={1}
              suffix=" Yrs"
              icon={<Layers className="w-4 h-4 text-[#003461]" />}
              minLabel="1 Yr"
              maxLabel="40 Yrs"
              themeColor="blue"
              presets={[
                { label: '10 Yrs', value: 10 },
                { label: '15 Yrs', value: 15 },
                { label: '20 Yrs', value: 20 },
                { label: '25 Yrs', value: 25 }
              ]}
            />

          </div>

          {/* Input: Annual Inflation Step-Up in Pension */}
          <SmartNumberInput
            id="swp-inflation-stepup"
            label="Annual Increase in Monthly Payout (Inflation Step-Up)"
            value={inflationStepUp}
            onChange={(val) => setInflationStepUp(val)}
            min={0}
            max={12}
            step={1}
            suffix="%"
            icon={<TrendingUp className="w-4 h-4 text-amber-600" />}
            minLabel="0% (Flat Pension)"
            maxLabel="+12% / Yr"
            themeColor="amber"
            presets={[
              { label: '0% Flat', value: 0 },
              { label: '+5% Inflation', value: 5 },
              { label: '+7% High', value: 7 }
            ]}
            helperText="Set 5-6% if you want your monthly pension to grow with inflation every year."
          />

          {/* Visual Canvas (Chart or Table) */}
          {viewMode === 'chart' ? (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#003461] uppercase tracking-wider">
                  Remaining Balance & Cumulative Payouts:
                </span>
                <span className="text-[11px] text-[#727781]">
                  Withdrawal Rate: {annualWithdrawalRate.toFixed(1)}% p.a.
                </span>
              </div>
              <div className="h-48 w-full bg-[#f7f9fb] rounded-xl p-2 border border-[#e0e3e5]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={swp.yearlySchedule} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#003461" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#003461" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="withdrawnGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#006d42" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#006d42" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" tickFormatter={(v) => `Yr ${v}`} tick={{ fontSize: 10, fill: '#727781' }} />
                    <YAxis tickFormatter={(v) => formatIndianCurrency(v).replace('₹ ', '')} tick={{ fontSize: 10, fill: '#727781' }} />
                    <Tooltip
                      formatter={(val: any, name: any) => [
                        `₹ ${Number(val).toLocaleString('en-IN')}`,
                        name === 'closingBalance' ? 'Remaining Corpus' : 'Cumulative Withdrawn'
                      ]}
                      labelFormatter={(l) => `Year ${l}`}
                    />
                    <Legend
                      formatter={(val) => val === 'closingBalance' ? 'Remaining Corpus' : 'Cumulative Payouts'}
                      wrapperStyle={{ fontSize: '11px' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="closingBalance"
                      stroke="#003461"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#balanceGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="cumulativeWithdrawn"
                      stroke="#006d42"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#withdrawnGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="pt-2 max-h-56 overflow-y-auto border border-[#e0e3e5] rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#eceef0] text-[#003461] font-bold sticky top-0">
                  <tr>
                    <th className="p-2">Year</th>
                    <th className="p-2">Payout This Yr</th>
                    <th className="p-2">Cumulative Payout</th>
                    <th className="p-2">Interest Earned</th>
                    <th className="p-2">Remaining Corpus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eceef0]">
                  {swp.yearlySchedule.map((row) => (
                    <tr key={row.year} className="hover:bg-[#f7f9fb]">
                      <td className="p-2 font-bold">Year {row.year}</td>
                      <td className="p-2 text-[#006d42] font-semibold">{formatIndianCurrency(row.withdrawnThisYear)}</td>
                      <td className="p-2 text-[#424750]">{formatIndianCurrency(row.cumulativeWithdrawn)}</td>
                      <td className="p-2 text-[#003461]">{formatIndianCurrency(row.interestEarned)}</td>
                      <td className="p-2 font-bold text-[#191c1e]">{formatIndianCurrency(row.closingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

        {/* Output Summary Column (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-[#f7f9fb] flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            
            {/* Sustainability Badge */}
            {swp.exhaustedYear ? (
              <div className="bg-[#fff0f0] border border-[#ffc2c2] text-[#ba1a1a] p-4 rounded-xl flex items-start gap-3 text-xs">
                <AlertTriangle className="w-5 h-5 shrink-0 text-[#ba1a1a] mt-0.5" />
                <div>
                  <span className="font-extrabold block">Caution: Capital Exhaustion Risk</span>
                  <span>
                    At ₹{formatRawIndianNumber(monthlyWithdrawal)}/mo with {inflationStepUp}% step-up, the capital runs out in <strong>Year {swp.exhaustedYear}</strong>. Lower monthly withdrawal to sustain indefinitely.
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#006d42] p-4 rounded-xl flex items-start gap-3 text-xs">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-[#006d42] mt-0.5" />
                <div>
                  <span className="font-extrabold block">100% Sustainable SWP Model</span>
                  <span>
                    Your annual withdrawal ({annualWithdrawalRate.toFixed(1)}%) is well within portfolio returns ({expectedReturn}%). Corpus continues growing while providing regular income!
                  </span>
                </div>
              </div>
            )}

            {/* Key Metric 1: Total Pension Withdrawn */}
            <div className="bg-white border border-[#c2c6d1] rounded-2xl p-5 shadow-xs">
              <span className="text-[11px] font-bold text-[#727781] uppercase tracking-wider block mb-1">
                Total Cashflow Withdrawn Over {tenureYears} Years:
              </span>
              <div className="text-3xl font-black text-[#006d42] tracking-tight">
                {formatIndianCurrency(swp.totalWithdrawn)}
              </div>
              <p className="text-[11px] text-[#424750] mt-1">
                Monthly income paid directly to your bank account with minimal LTCG tax.
              </p>
            </div>

            {/* Key Metric 2: Final Remaining Balance */}
            <div className="bg-[#003461] text-white rounded-2xl p-5 shadow-md">
              <span className="text-[11px] font-bold text-[#96f6bd] uppercase tracking-wider block mb-1">
                Remaining Balance at End of {tenureYears} Years:
              </span>
              <div className="text-3xl font-black tracking-tight text-white">
                {formatIndianCurrency(swp.finalCorpus)}
              </div>
              <p className="text-xs text-white/80 mt-1">
                Available as inheritance wealth or future emergency buffer.
              </p>
            </div>

            {/* Breakdown Snapshot */}
            <div className="bg-white border border-[#c2c6d1] rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#727781]">Initial Corpus Invested:</span>
                <span className="font-bold text-[#191c1e]">{formatIndianCurrency(swp.initialCorpus)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#727781]">Total Growth / Profit Created:</span>
                <span className="font-bold text-[#006d42]">+{formatIndianCurrency(swp.totalGainOrLoss)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#eceef0]">
                <span className="text-[#727781]">Total Economic Value (Withdrawn + Balance):</span>
                <span className="font-extrabold text-[#003461]">{formatIndianCurrency(swp.totalWithdrawn + swp.finalCorpus)}</span>
              </div>
            </div>

          </div>

          {/* Action CTA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate?.('open-account')}
              className="w-full bg-[#003461] hover:bg-[#004b87] text-white font-extrabold text-sm py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Setup Customized SWP Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-center text-[#727781] mt-2">
              BSE StAR MF Execution • Tailored Hybrid & Balanced Advantage Funds
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
