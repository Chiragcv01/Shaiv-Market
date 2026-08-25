import React, { useState, useMemo } from 'react';
import {
  calculateLoanVsSip,
  formatIndianCurrency,
  formatRawIndianNumber
} from '../utils/calculator';
import { ActiveScreen } from '../types';
import {
  Scale,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  HelpCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell
} from 'recharts';

interface LoanVsSipProps {
  onNavigate?: (screen: ActiveScreen) => void;
}

export const LoanVsSipArbitrage: React.FC<LoanVsSipProps> = ({ onNavigate }) => {
  const [loanAmount, setLoanAmount] = useState<number>(4500000); // 45 Lakhs Home loan
  const [interestRate, setInterestRate] = useState<number>(8.75); // 8.75% home loan rate
  const [tenureYears, setTenureYears] = useState<number>(15); // 15 years
  const [extraMonthlySavings, setExtraMonthlySavings] = useState<number>(15000); // Extra 15k
  const [expectedMfReturn, setExpectedMfReturn] = useState<number>(12.5); // 12.5% MF CAGR

  const result = useMemo(() => {
    return calculateLoanVsSip(
      loanAmount,
      interestRate,
      tenureYears,
      extraMonthlySavings,
      expectedMfReturn
    );
  }, [loanAmount, interestRate, tenureYears, extraMonthlySavings, expectedMfReturn]);

  // Comparison Bar Chart Dataset
  const comparisonData = useMemo(() => [
    {
      strategy: 'Option A (Prepay Loan)',
      interestSaved: Math.round(result.interestSaved),
      sipWealth: 0,
      totalBenefit: Math.round(result.interestSaved),
      color: '#ba1a1a'
    },
    {
      strategy: 'Option B (Invest in SIP)',
      interestSaved: 0,
      sipWealth: Math.round(result.sipMaturityWealth),
      totalBenefit: Math.round(result.sipMaturityWealth),
      color: '#006d42'
    }
  ], [result]);

  const formatTooltipValue = (val: any) => {
    return `₹ ${Number(val).toLocaleString('en-IN')}`;
  };

  return (
    <div id="loan-vs-sip-card" className="w-full bg-white border border-[#c2c6d1] rounded-2xl shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="p-6 bg-[#f7f9fb] border-b border-[#c2c6d1]">
        <div className="inline-flex items-center gap-1.5 bg-[#d3e4fe] text-[#003461] px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-1">
          <Scale className="w-3.5 h-3.5" />
          Financial Decision Engine
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#003461]">
          Home Loan Prepayment vs. Mutual Fund SIP Arbitrage
        </h3>
        <p className="text-xs text-[#424750] mt-0.5 max-w-3xl">
          Should you prepay your Home Loan early to become debt-free, or invest your surplus savings in a compounding Mutual Fund SIP? Discover the exact mathematical difference.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#c2c6d1]">
        
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
          
          {/* Slider 1: Loan Outstanding Amount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#424750]">Home Loan Outstanding / Amount</span>
              <span className="font-extrabold text-sm text-[#003461] bg-[#eceef0] px-2.5 py-1 rounded-md">
                {formatIndianCurrency(loanAmount)}
              </span>
            </div>
            <input
              type="range"
              min={500000}
              max={20000000}
              step={100000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer accent-[#003461]"
            />
            <div className="flex justify-between text-[10px] text-[#727781]">
              <span>₹5 Lakh</span>
              <span>₹1 Crore</span>
              <span>₹2 Crore</span>
            </div>
          </div>

          {/* Grid: Interest Rate & Loan Tenure */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Interest Rate */}
            <div className="space-y-1.5 bg-[#f7f9fb] p-3.5 rounded-xl border border-[#e0e3e5]">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#424750]">Home Loan Interest Rate</span>
                <span className="font-bold text-[#ba1a1a]">{interestRate}% p.a.</span>
              </div>
              <input
                type="range"
                min={7}
                max={13}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-1.5 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer accent-[#ba1a1a]"
              />
              <span className="text-[10px] text-[#727781] block">
                Standard bank home loan rates: 8.5% - 9.25%
              </span>
            </div>

            {/* Loan Tenure */}
            <div className="space-y-1.5 bg-[#f7f9fb] p-3.5 rounded-xl border border-[#e0e3e5]">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#424750]">Remaining Loan Tenure</span>
                <span className="font-bold text-[#003461]">{tenureYears} Years</span>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                step={1}
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-1.5 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer accent-[#003461]"
              />
              <span className="text-[10px] text-[#727781] block">
                Regular EMI: <strong>₹ {formatRawIndianNumber(result.regularEMI)}/mo</strong>
              </span>
            </div>

          </div>

          {/* Slider 3: Extra Monthly Savings Available */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#424750]">Extra Monthly Savings Available (for Prepayment or SIP)</span>
              <span className="font-extrabold text-sm text-[#006d42] bg-[#f0fdf4] border border-[#bbf7d0] px-2.5 py-1 rounded-md">
                ₹ {formatRawIndianNumber(extraMonthlySavings)} / month
              </span>
            </div>
            <input
              type="range"
              min={2000}
              max={100000}
              step={1000}
              value={extraMonthlySavings}
              onChange={(e) => setExtraMonthlySavings(Number(e.target.value))}
              className="w-full h-2 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer accent-[#006d42]"
            />
            <div className="flex justify-between text-[10px] text-[#727781]">
              <span>₹2,000/mo</span>
              <span>₹50,000/mo</span>
              <span>₹1,00,000/mo</span>
            </div>
          </div>

          {/* Slider 4: Expected Mutual Fund Return */}
          <div className="space-y-1.5 bg-[#f7f9fb] p-3.5 rounded-xl border border-[#e0e3e5]">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#424750]">Expected Mutual Fund SIP Return Rate</span>
              <span className="font-bold text-[#006d42]">+{expectedMfReturn}% CAGR</span>
            </div>
            <input
              type="range"
              min={9}
              max={16}
              step={0.5}
              value={expectedMfReturn}
              onChange={(e) => setExpectedMfReturn(Number(e.target.value))}
              className="w-full h-1.5 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer accent-[#006d42]"
            />
            <span className="text-[10px] text-[#727781] block">
              Historic broad Indian equity index (Nifty 50 / Flexi-cap) average: 12-14%
            </span>
          </div>

          {/* Visual Comparative Bar Chart */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-[#003461] uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-[#006d42]" />
              Visual Arbitrage Comparison (Interest Saved vs SIP Wealth Created):
            </span>
            <div className="h-44 w-full bg-[#f7f9fb] rounded-xl p-2.5 border border-[#e0e3e5]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <XAxis dataKey="strategy" tick={{ fontSize: 11, fill: '#191c1e', fontWeight: 600 }} />
                  <YAxis
                    tickFormatter={(v) => v >= 10000000 ? `₹${(v / 10000000).toFixed(1)}Cr` : `₹${(v / 100000).toFixed(0)}L`}
                    tick={{ fontSize: 10, fill: '#727781' }}
                  />
                  <Tooltip formatter={formatTooltipValue} />
                  <Bar dataKey="totalBenefit" name="Net Financial Value (₹)" radius={[6, 6, 0, 0]}>
                    {comparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side-by-Side Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            
            {/* Strategy 1 Card */}
            <div className="bg-[#f7f9fb] border border-[#c2c6d1] rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold text-[#ba1a1a] uppercase tracking-wider block">
                Option A: Prepay Loan
              </span>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#727781]">New Loan Tenure:</span>
                  <span className="font-bold text-[#191c1e]">{result.prepayTenureYears} Years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#727781]">Years Saved:</span>
                  <span className="font-bold text-[#006d42]">+{result.yearsSaved} Years Early</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#e0e3e5]">
                  <span className="text-[#727781]">Total Interest Saved:</span>
                  <span className="font-extrabold text-[#006d42]">{formatIndianCurrency(result.interestSaved)}</span>
                </div>
              </div>
            </div>

            {/* Strategy 2 Card */}
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold text-[#006d42] uppercase tracking-wider block">
                Option B: Regular EMI + SIP
              </span>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#727781]">Total SIP Invested:</span>
                  <span className="font-bold text-[#191c1e]">{formatIndianCurrency(result.sipInvestedAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#727781]">Final SIP Wealth:</span>
                  <span className="font-extrabold text-[#003461]">{formatIndianCurrency(result.sipMaturityWealth)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#bbf7d0]">
                  <span className="text-[#727781]">SIP Pure Gain/Profit:</span>
                  <span className="font-extrabold text-[#006d42]">+{formatIndianCurrency(result.sipNetProfit)}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Output Verdict (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-[#f7f9fb] flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            
            {/* Verdict Box */}
            <div className="bg-[#003461] text-white rounded-2xl p-6 shadow-md space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#96f6bd] uppercase tracking-wider">
                  Mathematical Verdict
                </span>
                <span className="bg-[#006d42] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                  Wealth Winner
                </span>
              </div>

              <div className="text-2xl font-black text-white leading-tight">
                Investing in Mutual Fund SIP wins by{' '}
                <span className="text-[#96f6bd]">{formatIndianCurrency(result.netWealthAdvantage)}</span>
              </div>

              <p className="text-xs text-white/80 leading-relaxed">
                Because Mutual Fund returns ({expectedMfReturn}%) exceed your loan interest ({interestRate}%), compound investing builds significantly more wealth than saving loan interest.
              </p>
            </div>

            {/* Financial Comparison Summary Table */}
            <div className="bg-white border border-[#c2c6d1] rounded-xl p-4 space-y-2.5 text-xs">
              <span className="font-bold text-[#003461] block">
                Direct Financial Impact:
              </span>
              <div className="flex justify-between py-1 border-b border-[#eceef0]">
                <span className="text-[#727781]">Benefit if you prepay loan:</span>
                <span className="font-bold text-[#191c1e]">Save {formatIndianCurrency(result.interestSaved)} in interest</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#eceef0]">
                <span className="text-[#727781]">Wealth if you invest in SIP:</span>
                <span className="font-bold text-[#006d42]">Accumulate {formatIndianCurrency(result.sipMaturityWealth)}</span>
              </div>
              <div className="flex justify-between py-1 font-extrabold text-[#003461]">
                <span>Net Extra Wealth in your Pocket:</span>
                <span>+{formatIndianCurrency(result.netWealthAdvantage)}</span>
              </div>
            </div>

            {/* Tax Benefit note */}
            <div className="bg-[#d3e4fe]/50 border border-[#b8d5fc] rounded-xl p-3 text-[11px] text-[#003461] leading-relaxed">
              <strong>Section 24(b) Advantage:</strong> Continuing your home loan allows claiming up to ₹2 Lakh annual tax deduction on interest paid, further increasing your actual SIP advantage.
            </div>

          </div>

          {/* Action CTA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate?.('open-account')}
              className="w-full bg-[#006d42] hover:bg-[#005231] text-white font-extrabold text-sm py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Start Monthly Wealth SIP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-center text-[#727781] mt-2">
              BSE StAR MF Paperless Setup • AMFI Registered Distributor ARN-284912
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
