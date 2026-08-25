// Utility to interact with live public Indian Mutual Fund APIs (mfapi.in)
// Free, public, no auth required, provides live NAVs & historical series for all Indian AMCs

export interface MfSearchItem {
  schemeCode: number;
  schemeName: string;
}

export interface MfNavPoint {
  date: string;
  nav: string;
}

export interface MfSchemeDetails {
  meta: {
    fund_house: string;
    scheme_type: string;
    scheme_category: string;
    scheme_code: number;
    scheme_name: string;
    isin_growth?: string;
    isin_div_reinvestment?: string;
  };
  data: MfNavPoint[];
  status: string;
}

export interface SchemeReturnSummary {
  schemeCode: number;
  schemeName: string;
  fundHouse: string;
  category: string;
  latestNav: number;
  navDate: string;
  return1Y?: number;
  return3Y?: number;
  return5Y?: number;
  navHistory: { date: string; nav: number }[];
}

// Popular schemes cached as fallback or instant initial list
export const POPULAR_SCHEME_CODES = [
  { code: 122639, name: 'Parag Parikh Flexi Cap Fund - Direct Plan - Growth', category: 'Flexi Cap', tag: 'Top Recommended' },
  { code: 118989, name: 'HDFC Top 100 Fund - Direct Plan - Growth', category: 'Large Cap', tag: 'Core Large Cap' },
  { code: 120503, name: 'SBI Small Cap Fund - Direct Plan - Growth', category: 'Small Cap', tag: 'High Growth' },
  { code: 120847, name: 'Mirae Asset Large Cap Fund - Direct Plan - Growth', category: 'Large Cap', tag: 'Institutional Core' },
  { code: 147623, name: 'Quant Active Fund - Direct Plan - Growth', category: 'Multi Cap', tag: 'Quantitative Alpha' },
  { code: 120716, name: 'ICICI Prudential Bluechip Fund - Direct Plan - Growth', category: 'Large Cap', tag: 'Bluechip Pillar' },
  { code: 119598, name: 'Nippon India Small Cap Fund - Direct Plan - Growth', category: 'Small Cap', tag: 'Market Leader' },
  { code: 118778, name: 'Kotak Emerging Equity Fund - Direct Plan - Growth', category: 'Mid Cap', tag: 'Mid Cap Pick' }
];

export async function searchMutualFunds(query: string): Promise<MfSearchItem[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const res = await fetch(`https://api.mfapi.in/mf/search?q=${encodeURIComponent(query.trim())}`);
    if (!res.ok) throw new Error('Search failed');
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, 15) : [];
  } catch (error) {
    console.warn('MF API search error:', error);
    // Local fallback filter
    return POPULAR_SCHEME_CODES
      .filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
      .map((s) => ({ schemeCode: s.code, schemeName: s.name }));
  }
}

export async function getSchemeDetails(schemeCode: number | string): Promise<MfSchemeDetails | null> {
  try {
    const res = await fetch(`https://api.mfapi.in/mf/${schemeCode}`);
    if (!res.ok) throw new Error('Scheme fetch failed');
    const data: MfSchemeDetails = await res.json();
    return data;
  } catch (error) {
    console.warn(`Failed to fetch scheme details for ${schemeCode}:`, error);
    return null;
  }
}

// Calculate CAGR returns from historical NAVs
export function calculateSchemeReturns(schemeData: MfSchemeDetails): SchemeReturnSummary {
  const meta = schemeData.meta;
  const navPoints = schemeData.data || [];

  const latestPoint = navPoints[0];
  const latestNav = latestPoint ? parseFloat(latestPoint.nav) : 0;
  const navDate = latestPoint ? latestPoint.date : 'N/A';

  // Helper to find NAV around N years ago
  const findNavNYearsAgo = (years: number): number | null => {
    if (!latestPoint || navPoints.length < 2) return null;
    const [d, m, y] = latestPoint.date.split('-').map(Number);
    const targetYear = y - years;
    const targetDateStr = `${d < 10 ? '0' + d : d}-${m < 10 ? '0' + m : m}-${targetYear}`;

    // Find nearest item
    const found = navPoints.find((p) => {
      const [, , itemYear] = p.date.split('-').map(Number);
      return itemYear === targetYear;
    });

    return found ? parseFloat(found.nav) : null;
  };

  const nav1Y = findNavNYearsAgo(1);
  const nav3Y = findNavNYearsAgo(3);
  const nav5Y = findNavNYearsAgo(5);

  const return1Y = nav1Y && nav1Y > 0 ? ((latestNav - nav1Y) / nav1Y) * 100 : undefined;
  const return3Y = nav3Y && nav3Y > 0 ? (Math.pow(latestNav / nav3Y, 1 / 3) - 1) * 100 : undefined;
  const return5Y = nav5Y && nav5Y > 0 ? (Math.pow(latestNav / nav5Y, 1 / 5) - 1) * 100 : undefined;

  // Build clean chart history (sample last 30-50 points)
  const navHistory = navPoints
    .slice(0, 60)
    .reverse()
    .map((p) => ({
      date: p.date,
      nav: parseFloat(p.nav)
    }));

  return {
    schemeCode: meta.scheme_code,
    schemeName: meta.scheme_name,
    fundHouse: meta.fund_house,
    category: meta.scheme_category || meta.scheme_type,
    latestNav,
    navDate,
    return1Y: return1Y ? parseFloat(return1Y.toFixed(2)) : undefined,
    return3Y: return3Y ? parseFloat(return3Y.toFixed(2)) : undefined,
    return5Y: return5Y ? parseFloat(return5Y.toFixed(2)) : undefined,
    navHistory
  };
}
