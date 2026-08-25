import React, { useState, useMemo } from 'react';
import {
  calculateMfTax,
  formatIndianCurrency,
  formatRawIndianNumber
} from '../utils/calculator';
import { ActiveScreen } from '../types';
import {
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Percent,
  CheckCircle2,
  BarChart3,
  PieChart as PieIcon,
  Info,
  Layers
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
  PieChart,
  Pie
} from 'recharts';

interface MfTaxEstimatorProps {
  onNavigate?: (screen: ActiveScreen) => void;
}

export const MfTaxEstimator: React.FC<MfTaxEstimatorProps> = ({ onNavigate }) => {
  const [fundType, setFundType] = useState<'Equity' | 'Debt' | 'Hybrid'>('Equity');
  const [purchaseAmount, setPurchaseAmount] = useState<number>(500000); // 5 Lakhs invested
  const [saleAmount, setSaleAmount] = useState<number>(850000); // 8.5 Lakhs sale value
  const [holdingPeriodMonths, setHoldingPeriodMonths] = useState<number>(24); // 24 months (LTCG)
  const [investorTaxSlab, setInvestorTaxSlab] = useState<number>(30); // 30% slab
  const [alreadyClaimedExemption, setAlreadyClaimedExemption] = useState<number>(0);

  const tax = useMemo(() => {
    return calculateMfTax(
      fundType,
      purchaseAmount,
      saleAmount,
      holdingPeriodMonths,
      investorTaxSlab,
      alreadyClaimedExemption
    );
  }, [fundType, purchaseAmount, saleAmount, holdingPeriodMonths, investorTaxSlab, alreadyClaimedExemption]);

  // Tax Breakdown Dataset for Visual Charts
  const breakdownData = useMemo(() => [
    {
      name: 'Original Principal',
      amount: purchaseAmount,
      fill: '#003461'
    },
    {
      name: 'Exempt Capital Gain',
      amount: tax.exemptionAllowed,
      fill: '#006d42'
    },
    {
      name: 'Taxable Capital Gain',
      amount: Math.max(0, tax.taxableGain),
      fill: '#e28743'
    },
    {
      name: 'Actual Tax to Pay',
      amount: tax.totalTaxWithCess,
      fill: '#ba1a1a'
    }
  ], [purchaseAmount, tax]);

  const formatTooltipValue = (val: any) => {
    return `₹ ${Number(val).toLocaleString('en-IN')}`;
  };

  return (
    <div id="mf-tax-estimator-card" className="w-full bg-white border border-[#c2c6d1] rounded-2xl shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="p-6 bg-[#f7f9fb] border-b border-[#c2c6d1]">
        <div className="inline-flex items-center gap-1.5 bg-[#d3e4fe] text-[#003461] px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-1">
          <FileSpreadsheet className="w-3.5 h-3.5" />
          Finance Act (Budget 2024-2026) Compliant
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#003461]">
          Mutual Fund Capital Gains Tax (LTCG & STCG) Estimator
        </h3>
        <p className="text-xs text-[#424750] mt-0.5 max-w-3xl">
          Calculate your exact tax liability and in-hand profit after the updated capital gains tax rules (12.5% Equity LTCG with ₹1.25L exemption, 20% Equity STCG, and Debt slab taxation).
        </p>
      </div>

      <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#c2c6d1]">
        
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
          
          {/* Fund Asset Class Category Selector */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#424750] block">
              1. Select Mutual Fund Asset Class:
            </span>
            <div className="grid grid-cols-3 gap-3">
              {(['Equity', 'Hybrid', 'Debt'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFundType(type)}
                  className={`p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                    fundType === type
                      ? 'bg-[#003461] text-white border-[#003461] shadow-xs'
                      : 'bg-white text-[#424750] border-[#c2c6d1] hover:bg-[#eceef0]'
                  }`}
                >
                  {type === 'Equity' && 'Equity & ELSS'}
                  {type === 'Hybrid' && 'Hybrid / Balanced'}
                  {type === 'Debt' && 'Debt / Liquid'}
                </button>
              ))}
            </div>
          </div>

          {/* Grid: Purchase Cost & Redemption Value */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#424750]">Total Purchase Amount</span>
                <span className="font-bold text-[#003461] bg-[#eceef0] px-2 py-0.5 rounded-md">
                  {formatIndianCurrency(purchaseAmount)}
                </span>
              </div>
              <input
                type="range"
                min={50000}
                max={10000000}
                step={50000}
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                className="w-full h-2 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer accent-[#003461]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#424750]">Total Redemption / Sale Value</span>
                <span className="font-bold text-[#006d42] bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.5 rounded-md">
                  {formatIndianCurrency(saleAmount)}
                </span>
              </div>
              <input
                type="range"
                min={purchaseAmount}
                max={20000000}
                step={50000}
                value={saleAmount}
                onChange={(e) => setSaleAmount(Number(e.target.value))}
                className="w-full h-2 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer accent-[#006d42]"
              />
            </div>

          </div>

          {/* Holding Period Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#424750]">Holding Period (Months)</span>
              <span className={`font-bold text-xs px-2.5 py-1 rounded-md ${
                tax.gainType.includes('Long Term') ? 'bg-[#f0fdf4] text-[#006d42]' : 'bg-[#fff0f0] text-[#ba1a1a]'
              }`}>
                {holdingPeriodMonths} Months ({tax.gainType})
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={60}
              step={1}
              value={holdingPeriodMonths}
              onChange={(e) => setHoldingPeriodMonths(Number(e.target.value))}
              className="w-full h-2 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer accent-[#003461]"
            />
            <div className="flex justify-between text-[10px] text-[#727781]">
              <span>1 Month (STCG)</span>
              <span>12 Months (LTCG Threshold for Equity)</span>
              <span>60 Months (5 Yrs)</span>
            </div>
          </div>

          {/* If Debt fund, show tax slab input */}
          {fundType === 'Debt' && (
            <div className="space-y-2 bg-[#f7f9fb] p-4 rounded-xl border border-[#e0e3e5]">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#424750]">Your Income Tax Slab Rate</span>
                <span className="font-bold text-[#003461]">{investorTaxSlab}%</span>
              </div>
              <div className="flex gap-2">
                {[10, 15, 20, 30].map((slab) => (
                  <button
                    key={slab}
                    type="button"
                    onClick={() => setInvestorTaxSlab(slab)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      investorTaxSlab === slab ? 'bg-[#003461] text-white' : 'bg-white border border-[#c2c6d1]'
                    }`}
                  >
                    {slab}%
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Visual Tax & Profit Flow Breakdown Bar Chart */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-[#003461] uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-[#006d42]" />
              Visual Capital & Tax Breakdown (₹):
            </span>
            <div className="h-40 w-full bg-[#f7f9fb] rounded-xl p-2.5 border border-[#e0e3e5]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdownData} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#191c1e', fontWeight: 600 }} />
                  <YAxis
                    tickFormatter={(v) => v >= 10000000 ? `₹${(v / 10000000).toFixed(1)}Cr` : `₹${(v / 100000).toFixed(0)}L`}
                    tick={{ fontSize: 10, fill: '#727781' }}
                  />
                  <Tooltip formatter={formatTooltipValue} />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                    {breakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Statutory Tax Rules Guide */}
          <div className="bg-[#f7f9fb] border border-[#e0e3e5] rounded-xl p-4 text-xs space-y-2">
            <span className="font-bold text-[#003461] block">
              Budget 2024-2026 Statutory Rules Summary:
            </span>
            <ul className="text-[#424750] space-y-1 text-[11px]">
              <li>• <strong>Equity Long-Term (LTCG &gt; 12 months):</strong> Taxed @ 12.5% on profits exceeding ₹1.25 Lakh per financial year.</li>
              <li>• <strong>Equity Short-Term (STCG &le; 12 months):</strong> Taxed flat @ 20%.</li>
              <li>• <strong>Debt Funds:</strong> Taxed at individual slab rates without indexation benefits.</li>
              <li>• <strong>Cess:</strong> 4% Health and Education cess applies to all tax liabilities.</li>
            </ul>
          </div>

        </div>

        {/* Right Output Verdict (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-[#f7f9fb] flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            
            {/* Net In-Hand Profit Banner */}
            <div className="bg-[#006d42] text-white rounded-2xl p-6 shadow-md space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#96f6bd] uppercase tracking-wider">
                  Net Post-Tax In-Hand Profit
                </span>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  After All Taxes
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {formatIndianCurrency(tax.netInHandProfit)}
              </div>
              <p className="text-xs text-white/80">
                Effective tax on total gain is only {tax.effectiveTaxRatePercent}%
              </p>
            </div>

            {/* Detailed Tax Computation Sheet */}
            <div className="bg-white border border-[#c2c6d1] rounded-2xl p-5 shadow-xs space-y-2.5 text-xs">
              <span className="font-bold text-[#003461] block pb-1 border-b border-[#eceef0]">
                Capital Gains Breakdown:
              </span>

              <div className="flex justify-between">
                <span className="text-[#727781]">Gross Capital Profit:</span>
                <span className="font-bold text-[#191c1e]">{formatIndianCurrency(tax.grossCapitalGain)}</span>
              </div>

              {tax.exemptionAllowed > 0 && (
                <div className="flex justify-between text-[#006d42]">
                  <span>Less: Section 112A Exemption:</span>
                  <span className="font-bold">- {formatIndianCurrency(tax.exemptionAllowed)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-[#727781]">Taxable Capital Gain:</span>
                <span className="font-bold text-[#191c1e]">{formatIndianCurrency(tax.taxableGain)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#727781]">Tax Rate ({tax.applicableTaxRatePercent}% + 4% cess):</span>
                <span className="font-bold text-[#ba1a1a]">{formatIndianCurrency(tax.totalTaxWithCess)}</span>
              </div>

              <div className="flex justify-between pt-2 border-t border-[#eceef0] font-extrabold text-[#003461] text-sm">
                <span>Net In-Hand Bank Credit:</span>
                <span>{formatIndianCurrency(purchaseAmount + tax.netInHandProfit)}</span>
              </div>
            </div>

            {/* Tax Harvest Tip */}
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-3.5 text-[11px] text-[#006d42] leading-relaxed">
              <strong>Tax Harvesting Strategy:</strong> You can systematically redeem and reinvest up to ₹1.25 Lakh in LTCG capital gains every financial year without paying a single rupee in tax!
            </div>

          </div>

          {/* Action CTA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate?.('booking')}
              className="w-full bg-[#003461] hover:bg-[#004b87] text-white font-extrabold text-sm py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Book Portfolio Tax-Harvesting Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-center text-[#727781] mt-2">
              AMFI Registered Distributor ARN-284912 • Professional Portfolio Allocation
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
