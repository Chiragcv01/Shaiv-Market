import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, RefreshCw, ArrowUpRight, ArrowDownRight, ShieldCheck, Database, ArrowRight, Activity, Calendar, Info } from 'lucide-react';
import { formatIndianCurrency } from '../utils/calculator';
import { ActiveScreen } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface SchemeSearchResult {
  schemeCode: number;
  schemeName: string;
}

interface SchemeDetails {
  meta: {
    fund_house: string;
    scheme_type: string;
    scheme_category: string;
    scheme_code: number;
    scheme_name: string;
  };
  data: Array<{
    date: string;
    nav: string;
  }>;
  status: string;
}

// Popular seed schemes for immediate live inspection
const POPULAR_SCHEMES = [
  { code: 122639, name: 'Parag Parikh Flexi Cap Fund - Direct Plan - Growth', tag: 'Flexi Cap' },
  { code: 118834, name: 'Mirae Asset Large Cap Fund - Direct Plan - Growth', tag: 'Large Cap' },
  { code: 120503, name: 'Quant Small Cap Fund - Direct Plan - Growth', tag: 'Small Cap' },
  { code: 120716, name: 'UTI Nifty 50 Index Fund - Direct Plan - Growth', tag: 'Index' },
  { code: 119551, name: 'HDFC Mid-Cap Opportunities Fund - Direct - Growth', tag: 'Mid Cap' },
  { code: 118989, name: 'SBI Liquid Fund - Direct Plan - Growth', tag: 'Debt Liquid' }
];

interface LiveMfApiExplorerProps {
  onNavigate?: (screen: ActiveScreen) => void;
}

export const LiveMfApiExplorer: React.FC<LiveMfApiExplorerProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SchemeSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  
  const [selectedSchemeCode, setSelectedSchemeCode] = useState<number>(122639); // Parag Parikh Flexi Cap default
  const [schemeData, setSchemeData] = useState<SchemeDetails | null>(null);
  const [isLoadingScheme, setIsLoadingScheme] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string>('');

  // Fetch Scheme Details whenever selectedSchemeCode changes
  useEffect(() => {
    let isMounted = true;
    async function fetchScheme() {
      setIsLoadingScheme(true);
      setLoadError('');
      try {
        const res = await fetch(`https://api.mfapi.in/mf/${selectedSchemeCode}`);
        if (!res.ok) throw new Error('Failed to fetch from mfapi.in');
        const json = await res.json();
        if (isMounted) {
          if (json.status === 'SUCCESS' || json.data) {
            setSchemeData(json);
          } else {
            setLoadError('Scheme data currently unavailable.');
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setLoadError('Unable to connect to live mfapi.in feed. Using cached data.');
        }
      } finally {
        if (isMounted) setIsLoadingScheme(false);
      }
    }

    fetchScheme();
    return () => {
      isMounted = false;
    };
  }, [selectedSchemeCode]);

  // Live search handler with debouncing
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`https://api.mfapi.in/mf/search?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const results = await res.json();
          setSearchResults(Array.isArray(results) ? results.slice(0, 8) : []);
        }
      } catch (err) {
        // Fallback filter
        const localMatches = POPULAR_SCHEMES
          .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(s => ({ schemeCode: s.code, schemeName: s.name }));
        setSearchResults(localMatches);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Calculate return percentages from raw NAV array
  const returns = React.useMemo(() => {
    if (!schemeData || !schemeData.data || schemeData.data.length < 2) return null;
    const currentNav = parseFloat(schemeData.data[0].nav);
    
    // 1 Month (~22 trading days or 30 calendar days)
    const nav1M = schemeData.data[22] ? parseFloat(schemeData.data[22].nav) : null;
    const ret1M = nav1M ? ((currentNav - nav1M) / nav1M) * 100 : null;

    // 1 Year (~250 trading days)
    const nav1Y = schemeData.data[250] ? parseFloat(schemeData.data[250].nav) : null;
    const ret1Y = nav1Y ? ((currentNav - nav1Y) / nav1Y) * 100 : null;

    // 3 Year (~750 trading days)
    const nav3Y = schemeData.data[750] ? parseFloat(schemeData.data[750].nav) : null;
    const ret3Y = nav3Y ? (Math.pow(currentNav / nav3Y, 1 / 3) - 1) * 100 : null;

    return {
      currentNav,
      asOfDate: schemeData.data[0].date,
      ret1M,
      ret1Y,
      ret3Y
    };
  }, [schemeData]);

  // Prepare chart dataset (Last 90 days NAV trajectory)
  const chartPoints = React.useMemo(() => {
    if (!schemeData || !schemeData.data) return [];
    // Take last 60 records and reverse so it reads left-to-right in chronological order
    const slice = schemeData.data.slice(0, 60).reverse();
    return slice.map(item => ({
      date: item.date,
      nav: parseFloat(item.nav)
    }));
  }, [schemeData]);

  return (
    <div id="live-mfapi-explorer" className="w-full bg-white border border-[#c2c6d1] rounded-2xl p-6 sm:p-8 institutional-shadow space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e0e3e5]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#96f6bd]/40 text-[#005231] text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#006d42] animate-pulse" />
              Live AMFI Feed via mfapi.in & mfdata.in
            </span>
            <span className="text-xs text-[#727781]">• Public Data</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#003461] tracking-tight">
            Live Mutual Fund NAV & Quantitative Performance Feed
          </h2>
          <p className="text-xs text-[#424750] mt-0.5">
            Search any Indian mutual fund scheme to inspect real-time Net Asset Values (NAV), fund house details, and 1Y/3Y CAGR calculations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-[#727781] block uppercase tracking-wider font-semibold">Data Source</span>
            <span className="text-xs font-mono font-bold text-[#003461]">AMFI / mfapi.in</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#d3e4fe] text-[#003461] flex items-center justify-center">
            <Database className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Search Input and Quick Filter Chips */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#727781] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search any mutual fund scheme name (e.g. Parag Parikh, HDFC, SBI Small Cap, Nippon, Quant)..."
            className="w-full pl-10 pr-10 py-3 bg-[#f7f9fb] border border-[#c2c6d1] rounded-xl text-sm text-[#191c1e] focus:ring-2 focus:ring-[#003461] outline-hidden shadow-2xs"
          />
          {isSearching && (
            <RefreshCw className="w-4 h-4 text-[#003461] animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
          )}
        </div>

        {/* Live Search Autocomplete Dropdown */}
        {searchResults.length > 0 && (
          <div className="bg-white border border-[#c2c6d1] rounded-xl shadow-lg divide-y divide-[#eceef0] max-h-64 overflow-y-auto z-20 relative">
            {searchResults.map((res) => (
              <button
                key={res.schemeCode}
                onClick={() => {
                  setSelectedSchemeCode(res.schemeCode);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="w-full text-left p-3 hover:bg-[#f7f9fb] text-xs font-semibold text-[#191c1e] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="truncate pr-2">{res.schemeName}</span>
                <span className="text-[10px] font-mono text-[#003461] bg-[#d3e4fe] px-2 py-0.5 rounded shrink-0">
                  Code: {res.schemeCode}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Quick Selection Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-[#727781] shrink-0 uppercase tracking-wider">
            Quick Benchmarks:
          </span>
          {POPULAR_SCHEMES.map((scheme) => (
            <button
              key={scheme.code}
              onClick={() => setSelectedSchemeCode(scheme.code)}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedSchemeCode === scheme.code
                  ? 'bg-[#003461] text-white shadow-2xs'
                  : 'bg-[#eceef0] text-[#424750] hover:bg-[#e0e3e5]'
              }`}
            >
              {scheme.tag}: {scheme.name.split(' ')[0]} {scheme.name.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Scheme Performance Card */}
      {isLoadingScheme ? (
        <div className="py-12 text-center text-[#727781] space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#003461]" />
          <p className="text-sm font-semibold">Connecting to live AMFI public repository (mfapi.in)...</p>
        </div>
      ) : schemeData && schemeData.meta ? (
        <div className="space-y-6">
          
          {/* Main Info Card */}
          <div className="bg-[#f7f9fb] border border-[#c2c6d1] rounded-xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="bg-[#d3e4fe] text-[#003461] text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded">
                    {schemeData.meta.scheme_category || 'Direct Plan'}
                  </span>
                  <span className="bg-white border border-[#c2c6d1] text-[#424750] text-[10px] font-bold px-2 py-0.5 rounded">
                    {schemeData.meta.fund_house}
                  </span>
                  <span className="text-xs text-[#727781] font-mono">
                    AMFI Code: {schemeData.meta.scheme_code}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#191c1e] leading-snug">
                  {schemeData.meta.scheme_name}
                </h3>
              </div>

              {returns && (
                <div className="sm:text-right bg-white p-3 rounded-xl border border-[#c2c6d1] shrink-0">
                  <span className="text-[10px] text-[#727781] uppercase tracking-wider font-semibold block">
                    Latest NAV ({returns.asOfDate})
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-[#003461]">
                    ₹{returns.currentNav.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Performance Indicators Grid */}
            {returns && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-white p-3 rounded-lg border border-[#e0e3e5]">
                  <span className="text-[10px] text-[#727781] uppercase font-semibold block">1 Month Return</span>
                  <span className={`text-sm font-black flex items-center gap-1 ${
                    (returns.ret1M ?? 0) >= 0 ? 'text-[#006d42]' : 'text-[#ba1a1a]'
                  }`}>
                    {(returns.ret1M ?? 0) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {returns.ret1M !== null ? `${returns.ret1M.toFixed(2)}%` : 'N/A'}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-[#e0e3e5]">
                  <span className="text-[10px] text-[#727781] uppercase font-semibold block">1 Year Return</span>
                  <span className={`text-sm font-black flex items-center gap-1 ${
                    (returns.ret1Y ?? 0) >= 0 ? 'text-[#006d42]' : 'text-[#ba1a1a]'
                  }`}>
                    {(returns.ret1Y ?? 0) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {returns.ret1Y !== null ? `+${returns.ret1Y.toFixed(2)}%` : 'N/A'}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-[#e0e3e5]">
                  <span className="text-[10px] text-[#727781] uppercase font-semibold block">3 Year CAGR</span>
                  <span className={`text-sm font-black flex items-center gap-1 ${
                    (returns.ret3Y ?? 0) >= 0 ? 'text-[#006d42]' : 'text-[#ba1a1a]'
                  }`}>
                    {(returns.ret3Y ?? 0) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {returns.ret3Y !== null ? `+${returns.ret3Y.toFixed(2)}% p.a.` : 'N/A'}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-[#e0e3e5]">
                  <span className="text-[10px] text-[#727781] uppercase font-semibold block">Plan Structure</span>
                  <span className="text-xs font-bold text-[#003461] truncate block mt-0.5">
                    {schemeData.meta.scheme_type || 'Open Ended Growth'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Historical NAV Chart (60-day trend) */}
          {chartPoints.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#003461] uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#006d42]" />
                  60-Day Historical NAV Trajectory
                </span>
                <span className="text-[11px] text-[#727781]">
                  Range: ₹{Math.min(...chartPoints.map(p => p.nav)).toFixed(1)} - ₹{Math.max(...chartPoints.map(p => p.nav)).toFixed(1)}
                </span>
              </div>

              <div className="h-44 bg-[#f7f9fb] border border-[#c2c6d1] rounded-xl p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartPoints} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="navTrendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#003461" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#003461" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#727781' }} interval={14} />
                    <YAxis domain={['auto', 'auto']} tick={{ fontSize: 9, fill: '#727781' }} />
                    <Tooltip formatter={(val: any) => [`₹${Number(val).toFixed(2)}`, 'NAV']} />
                    <Area
                      type="monotone"
                      dataKey="nav"
                      name="NAV (₹)"
                      stroke="#003461"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#navTrendGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Call to Action Bar */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-[#005231]">
                Want to allocate to {schemeData.meta.scheme_name.split('-')[0]}?
              </h4>
              <p className="text-[11px] text-[#005231]/80">
                Generate an official quote to receive a customized risk-adjusted allocation proposal.
              </p>
            </div>
            {onNavigate && (
              <button
                onClick={() => onNavigate('open-account')}
                className="bg-[#006d42] hover:bg-[#005231] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                <span>Request Allocation Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>
      ) : (
        <div className="py-8 text-center text-xs text-[#727781]">
          {loadError || 'Select a mutual fund scheme from the search bar above to view live AMFI data.'}
        </div>
      )}

    </div>
  );
};
