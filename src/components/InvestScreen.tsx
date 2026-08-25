import React, { useState } from 'react';
import { ActiveScreen, PortfolioFund } from '../types';
import { PORTFOLIO_FUNDS } from '../data/mockData';
import {
  TrendingUp,
  ShieldCheck,
  Filter,
  CheckCircle,
  Star,
  Search,
  ArrowRight,
  Sparkles,
  PieChart,
  Info,
  ChevronDown
} from 'lucide-react';

interface InvestScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const InvestScreen: React.FC<InvestScreenProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFundDetail, setActiveFundDetail] = useState<PortfolioFund | null>(null);

  const categories = ['All', 'Large Cap', 'Flexi Cap', 'Balanced', 'Small Cap', 'Debt'];
  const risks = ['All', 'Low', 'Moderate', 'High', 'Very High'];

  const filteredFunds = PORTFOLIO_FUNDS.filter((fund) => {
    const matchesCategory = selectedCategory === 'All' || fund.category === selectedCategory;
    const matchesRisk = selectedRisk === 'All' || fund.risk === selectedRisk;
    const matchesSearch = fund.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          fund.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesRisk && matchesSearch;
  });

  return (
    <div id="invest-screen" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 md:py-16">
      
      {/* Header */}
      <div className="text-center md:text-left mb-8 md:mb-12">
        <div className="inline-flex items-center gap-2 bg-[#d3e4fe] text-[#003461] px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4 text-[#003461]" />
          SEBI Regulated Schemes
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#003461] mb-2">
          Curated Mutual Fund Portfolios
        </h1>
        <p className="text-base text-[#424750] max-w-3xl leading-relaxed">
          Scientifically constructed asset baskets designed to outperform benchmarks with lower downside volatility. Expert scheme allocation with paperless execution and ongoing advisory.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[#c2c6d1] rounded-2xl p-4 sm:p-6 mb-8 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#727781] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search funds or holdings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-[#c2c6d1] rounded-xl focus:ring-2 focus:ring-[#003461] outline-hidden bg-[#f7f9fb]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-[#727781] mr-1 uppercase">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#003461] text-white shadow-2xs'
                    : 'bg-[#eceef0] text-[#424750] hover:bg-[#e0e3e5]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Funds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFunds.map((fund) => (
          <div
            key={fund.id}
            id={`fund-card-${fund.id}`}
            className="bg-white border border-[#c2c6d1] rounded-2xl p-6 hover:shadow-md hover:border-[#003461]/60 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="bg-[#eceef0] text-[#003461] text-xs font-bold px-2.5 py-1 rounded-md">
                  {fund.category}
                </span>
                <div className="flex items-center gap-1 text-[#006d42]">
                  <Star className="w-3.5 h-3.5 fill-[#006d42]" />
                  <span className="text-xs font-bold">{fund.rating}.0 Rating</span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-[#191c1e] mb-2 leading-snug">
                {fund.name}
              </h3>
              <p className="text-xs text-[#424750] mb-4 leading-relaxed line-clamp-3">
                {fund.description}
              </p>

              {/* Performance Metrics Table */}
              <div className="bg-[#f7f9fb] border border-[#e0e3e5] rounded-xl p-3 mb-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-[10px] text-[#727781] block uppercase">3Y CAGR</span>
                  <span className="text-sm font-extrabold text-[#006d42]">+{fund.cagr3Y}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#727781] block uppercase">5Y CAGR</span>
                  <span className="text-sm font-extrabold text-[#003461]">+{fund.cagr5Y}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#727781] block uppercase">AUM</span>
                  <span className="text-xs font-bold text-[#191c1e]">{fund.aum}</span>
                </div>
              </div>

              {/* Top Holdings Tags */}
              <div className="mb-4">
                <span className="text-[11px] font-semibold text-[#727781] block mb-1.5">
                  Key Holdings:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {fund.topHoldings.slice(0, 3).map((holding, i) => (
                    <span
                      key={i}
                      className="bg-[#eceef0] text-[#191c1e] text-[11px] px-2 py-0.5 rounded-md font-medium"
                    >
                      {holding}
                    </span>
                  ))}
                  {fund.topHoldings.length > 3 && (
                    <span className="text-[11px] text-[#727781] py-0.5">
                      +{fund.topHoldings.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-[#eceef0] flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-[#727781] block">Min. Investment</span>
                <span className="text-sm font-bold text-[#191c1e]">₹ {fund.minSip}/mo</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveFundDetail(fund)}
                  className="p-2 text-[#003461] hover:bg-[#eceef0] rounded-lg transition-colors text-xs font-bold"
                  title="View fund details"
                >
                  <Info className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('open-account')}
                  className="bg-[#006d42] hover:bg-[#005231] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Invest</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Fund Detail Drawer / Modal */}
      {activeFundDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#c2c6d1] animate-in zoom-in-95 space-y-5">
            <div className="flex items-start justify-between border-b border-[#e0e3e5] pb-4">
              <div>
                <span className="bg-[#d3e4fe] text-[#003461] text-xs font-bold px-2.5 py-0.5 rounded-md">
                  {activeFundDetail.category}
                </span>
                <h3 className="text-xl font-bold text-[#003461] mt-1.5">
                  {activeFundDetail.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveFundDetail(null)}
                className="text-[#727781] hover:text-[#191c1e] text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-[#424750] leading-relaxed">
              {activeFundDetail.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#f7f9fb] rounded-xl border border-[#c2c6d1] text-center">
              <div>
                <span className="text-[11px] text-[#727781] block">3Y CAGR</span>
                <span className="text-base font-bold text-[#006d42]">+{activeFundDetail.cagr3Y}%</span>
              </div>
              <div>
                <span className="text-[11px] text-[#727781] block">5Y CAGR</span>
                <span className="text-base font-bold text-[#003461]">+{activeFundDetail.cagr5Y}%</span>
              </div>
              <div>
                <span className="text-[11px] text-[#727781] block">Expense Ratio</span>
                <span className="text-base font-bold text-[#191c1e]">{activeFundDetail.expenseRatio}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#727781] block">Risk Profile</span>
                <span className="text-base font-bold text-[#191c1e]">{activeFundDetail.risk}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-2">
                Top Portfolio Holdings
              </h4>
              <ul className="divide-y divide-[#eceef0] border border-[#e0e3e5] rounded-xl overflow-hidden">
                {activeFundDetail.topHoldings.map((stock, i) => (
                  <li key={i} className="p-2.5 text-xs font-medium text-[#191c1e] flex justify-between bg-white">
                    <span>{stock}</span>
                    <span className="text-[#006d42] font-semibold">Active Weight</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveFundDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-[#727781] hover:text-[#191c1e]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setActiveFundDetail(null);
                  onNavigate('open-account');
                }}
                className="bg-[#003461] hover:bg-[#004b87] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors"
              >
                Start Investment Folio
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
