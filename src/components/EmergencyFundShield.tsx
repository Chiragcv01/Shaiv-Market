import React, { useState, useMemo } from 'react';
import {
  calculateEmergencyFund,
  formatIndianCurrency,
  formatRawIndianNumber
} from '../utils/calculator';
import { ActiveScreen } from '../types';
import {
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  PieChart as PieIcon,
  Layers,
  HelpCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';

interface EmergencyFundShieldProps {
  onNavigate?: (screen: ActiveScreen) => void;
}

export const EmergencyFundShield: React.FC<EmergencyFundShieldProps> = ({ onNavigate }) => {
  const [rentOrEmi, setRentOrEmi] = useState<number>(30000);
  const [groceriesAndUtilities, setGroceriesAndUtilities] = useState<number>(20000);
  const [familyAndEducation, setFamilyAndEducation] = useState<number>(15000);
  const [insuranceMonthly, setInsuranceMonthly] = useState<number>(5000);
  const [currentLiquidSavings, setCurrentLiquidSavings] = useState<number>(150000);

  const shield = useMemo(() => {
    return calculateEmergencyFund(
      rentOrEmi,
      groceriesAndUtilities,
      familyAndEducation,
      insuranceMonthly,
      currentLiquidSavings
    );
  }, [rentOrEmi, groceriesAndUtilities, familyAndEducation, insuranceMonthly, currentLiquidSavings]);

  const coverageMonths = shield.totalMonthlyMandatoryExpense > 0
    ? Number((currentLiquidSavings / shield.totalMonthlyMandatoryExpense).toFixed(1))
    : 0;

  // Donut chart dataset of mandatory outflows
  const expensePieData = useMemo(() => [
    { name: 'Rent / Home EMI', value: rentOrEmi, color: '#003461' },
    { name: 'Groceries & Bills', value: groceriesAndUtilities, color: '#006d42' },
    { name: 'Family & Education', value: familyAndEducation, color: '#e28743' },
    { name: 'Insurance Premiums', value: insuranceMonthly, color: '#727781' }
  ].filter(item => item.value > 0), [rentOrEmi, groceriesAndUtilities, familyAndEducation, insuranceMonthly]);

  const formatTooltipValue = (val: any) => {
    return `₹ ${Number(val).toLocaleString('en-IN')}`;
  };

  return (
    <div id="emergency-fund-shield-card" className="w-full bg-white border border-[#c2c6d1] rounded-2xl shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="p-6 bg-[#f7f9fb] border-b border-[#c2c6d1]">
        <div className="inline-flex items-center gap-1.5 bg-[#d3e4fe] text-[#003461] px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          Financial Health & Resilience
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#003461]">
          Emergency Fund & Liquid Reserve Cushion Analyzer
        </h3>
        <p className="text-xs text-[#424750] mt-0.5 max-w-3xl">
          Before taking equity market risks, safeguard your family with an inflation-resilient liquid reserve parked in high-safety Overnight and Liquid Mutual Funds.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#c2c6d1]">
        
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-5">
          
          <span className="text-xs font-bold text-[#003461] uppercase tracking-wider block">
            Monthly Mandatory Living Outflows:
          </span>

          {/* Slider 1: Rent / Home Loan EMI */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#424750]">House Rent or Home Loan EMI</span>
              <span className="font-bold text-[#003461] bg-[#eceef0] px-2 py-0.5 rounded-md">
                ₹ {formatRawIndianNumber(rentOrEmi)}/mo
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={150000}
              step={2000}
              value={rentOrEmi}
              onChange={(e) => setRentOrEmi(Number(e.target.value))}
              className="w-full h-1.5 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer accent-[#003461]"
            />
          </div>

          {/* Slider 2: Groceries & Utilities */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#424750]">Groceries, Electricity, Bills & Fuel</span>
              <span className="font-bold text-[#003461] bg-[#eceef0] px-2 py-0.5 rounded-md">
                ₹ {formatRawIndianNumber(groceriesAndUtilities)}/mo
              </span>
            </div>
            <input
              type="range"
              min={5000}
              max={100000}
              step={2000}
              value={groceriesAndUtilities}
              onChange={(e) => setGroceriesAndUtilities(Number(e.target.value))}
              className="w-full h-1.5 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer accent-[#003461]"
            />
          </div>

          {/* Slider 3: Child Education & Family */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#424750]">School/Tuition Fees & Medical</span>
              <span className="font-bold text-[#003461] bg-[#eceef0] px-2 py-0.5 rounded-md">
                ₹ {formatRawIndianNumber(familyAndEducation)}/mo
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100000}
              step={2000}
              value={familyAndEducation}
              onChange={(e) => setFamilyAndEducation(Number(e.target.value))}
              className="w-full h-1.5 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer accent-[#003461]"
            />
          </div>

          {/* Slider 4: Insurance Premiums */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#424750]">Term & Health Insurance Premiums (Monthly)</span>
              <span className="font-bold text-[#003461] bg-[#eceef0] px-2 py-0.5 rounded-md">
                ₹ {formatRawIndianNumber(insuranceMonthly)}/mo
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={30000}
              step={500}
              value={insuranceMonthly}
              onChange={(e) => setInsuranceMonthly(Number(e.target.value))}
              className="w-full h-1.5 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer accent-[#003461]"
            />
          </div>

          {/* Slider 5: Current Liquid Reserve Available */}
          <div className="space-y-2 pt-2 border-t border-[#e0e3e5]">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#006d42]">Current Savings in Bank / Liquid Funds</span>
              <span className="font-extrabold text-sm text-[#006d42] bg-[#f0fdf4] border border-[#bbf7d0] px-2.5 py-1 rounded-md">
                {formatIndianCurrency(currentLiquidSavings)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={3000000}
              step={25000}
              value={currentLiquidSavings}
              onChange={(e) => setCurrentLiquidSavings(Number(e.target.value))}
              className="w-full h-2 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer accent-[#006d42]"
            />
            <div className="flex justify-between text-[10px] text-[#727781]">
              <span>₹0</span>
              <span>₹15 Lakh</span>
              <span>₹30 Lakh</span>
            </div>
          </div>

          {/* Visual Donut Chart of Monthly Expenses */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-[#003461] uppercase tracking-wider flex items-center gap-1.5">
              <PieIcon className="w-3.5 h-3.5 text-[#006d42]" />
              Monthly Essential Outflows Distribution:
            </span>
            <div className="h-40 w-full bg-[#f7f9fb] rounded-xl p-2 border border-[#e0e3e5]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={36}
                    outerRadius={56}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {expensePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatTooltipValue} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Output Verdict (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-[#f7f9fb] flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            
            {/* Health Score Banner */}
            <div className="bg-[#003461] text-white rounded-2xl p-6 shadow-md space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#96f6bd] uppercase tracking-wider">
                  Emergency Readiness Shield
                </span>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  coverageMonths >= 6 ? 'bg-[#006d42] text-white' : coverageMonths >= 3 ? 'bg-[#ffeed9] text-[#9c4100]' : 'bg-[#ba1a1a] text-white'
                }`}>
                  {coverageMonths >= 6 ? 'Excellent Shield' : coverageMonths >= 3 ? 'Moderate Buffer' : 'At Risk'}
                </span>
              </div>

              <div>
                <div className="text-3xl font-black tracking-tight text-white">
                  {coverageMonths} Months Cushion
                </div>
                <span className="text-xs text-white/80 block mt-0.5">
                  Total Monthly Outflow: {formatIndianCurrency(shield.totalMonthlyMandatoryExpense)} / month
                </span>
              </div>

              {/* Progress bar to 6-month standard */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-white/80">
                  <span>Target: 6 Months Recommended</span>
                  <span>{Math.min(100, Math.round((coverageMonths / 6) * 100))}%</span>
                </div>
                <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, (coverageMonths / 6) * 100)}%` }}
                    className={`h-full ${coverageMonths >= 6 ? 'bg-[#96f6bd]' : 'bg-[#ffd28e]'}`}
                  />
                </div>
              </div>
            </div>

            {/* Target Tier Cushions */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white border border-[#c2c6d1] rounded-xl p-3 text-center space-y-1">
                <span className="text-[10px] font-bold text-[#727781] block">3-Month Basic</span>
                <span className="text-xs font-extrabold text-[#003461] block">{formatIndianCurrency(shield.threeMonthCushion)}</span>
              </div>

              <div className="bg-[#d3e4fe] border border-[#b8d5fc] rounded-xl p-3 text-center space-y-1">
                <span className="text-[10px] font-bold text-[#003461] block">6-Month Optimal</span>
                <span className="text-xs font-extrabold text-[#003461] block">{formatIndianCurrency(shield.sixMonthCushion)}</span>
              </div>

              <div className="bg-white border border-[#c2c6d1] rounded-xl p-3 text-center space-y-1">
                <span className="text-[10px] font-bold text-[#727781] block">12-Month Rock-Solid</span>
                <span className="text-xs font-extrabold text-[#006d42] block">{formatIndianCurrency(shield.twelveMonthCushion)}</span>
              </div>
            </div>

            {/* Where to park recommendation */}
            <div className="bg-white border border-[#c2c6d1] rounded-xl p-4 text-xs space-y-2">
              <strong className="text-[#003461] block">Where to Park Your Emergency Reserve?</strong>
              <div className="space-y-1 text-[#424750] text-[11px] leading-relaxed">
                <div>• <strong>50% in Liquid Mutual Funds:</strong> Instant T+0 withdrawal up to ₹50,000 via IMPS + higher yield than bank savings.</div>
                <div>• <strong>30% in Ultra Short Duration Funds:</strong> Earn stable 6.5% - 7.2% with sovereign/AAA paper safety.</div>
                <div>• <strong>20% in Savings Bank:</strong> Immediate debit card ATM access for acute emergencies.</div>
              </div>
            </div>

          </div>

          {/* Action CTA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate?.('open-account')}
              className="w-full bg-[#006d42] hover:bg-[#005231] text-white font-extrabold text-sm py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Setup Liquid Reserve Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-center text-[#727781] mt-2">
              AMFI Certified Distribution (ARN-337289) • Zero Exit-Load Liquid Funds
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
