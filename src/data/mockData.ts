import { Advisor, PortfolioFund } from '../types';

export const ADVISORS: Advisor[] = [
  {
    id: 'david-chen',
    name: 'David Chen',
    role: 'Wealth Management',
    rating: 4.9,
    reviewsCount: 124,
    experience: '14+ years in Private Wealth & Equity Asset Allocation',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    specialties: ['High Net Worth Strategies', 'Retirement Preservation', 'Multi-Asset Hedging'],
    bio: 'Former VP of Institutional Asset Management at Morgan Stanley, specializing in risk-weighted growth strategies for HNIs.'
  },
  {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins',
    role: 'Retirement Planning',
    rating: 4.8,
    reviewsCount: 98,
    experience: '11+ years in Pension Funds & Goal-Based Investing',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    specialties: ['Early Retirement (FIRE)', 'Tax-Efficient Withdrawal', 'Intergenerational Wealth'],
    bio: 'Certified Financial Planner (CFP) passionate about creating structured compounding roadmaps for long-term financial freedom.'
  },
  {
    id: 'rajesh-sharma',
    name: 'Rajesh Sharma',
    role: 'Tax & Quantitative Strategies',
    rating: 4.9,
    reviewsCount: 156,
    experience: '16+ years in Indian Capital Markets & SEBI Advisory',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    specialties: ['Section 80C Optimization', 'Factor-based Indexing', 'Debt Portfolio Laddering'],
    bio: 'Chartered Financial Analyst (CFA) with deep expertise in optimizing domestic capital gains tax and balanced fund selection.'
  }
];

export const PORTFOLIO_FUNDS: PortfolioFund[] = [
  {
    id: 'safewealth-bluechip',
    name: 'SafeWealth Bluechip Alpha Fund',
    category: 'Large Cap',
    risk: 'Moderate',
    cagr3Y: 15.4,
    cagr5Y: 14.2,
    aum: '₹ 14,850 Cr',
    expenseRatio: '0.65%',
    rating: 5,
    minSip: 1000,
    description: 'Invests in top 100 market-leading corporations with high return on equity (ROE), resilient cash flows, and fortress balance sheets.',
    topHoldings: ['HDFC Bank', 'Reliance Industries', 'ICICI Bank', 'Infosys', 'Tata Consultancy Services']
  },
  {
    id: 'safewealth-flexicap',
    name: 'SafeWealth Dynamic Flexi-Cap Fund',
    category: 'Flexi Cap',
    risk: 'High',
    cagr3Y: 17.8,
    cagr5Y: 16.1,
    aum: '₹ 9,420 Cr',
    expenseRatio: '0.78%',
    rating: 5,
    minSip: 1000,
    description: 'Unconstrained investment across large, mid, and small-cap opportunities to capitalize on dynamic cyclical market phases.',
    topHoldings: ['Larsen & Toubro', 'Bharti Airtel', 'Trent Ltd', 'Axis Bank', 'Mahindra & Mahindra']
  },
  {
    id: 'safewealth-balanced-advantage',
    name: 'SafeWealth Balanced Advantage Fund',
    category: 'Balanced',
    risk: 'Moderate',
    cagr3Y: 12.8,
    cagr5Y: 12.4,
    aum: '₹ 21,300 Cr',
    expenseRatio: '0.52%',
    rating: 5,
    minSip: 500,
    description: 'Dynamically manages equity and fixed income allocations using proprietary valuation models to minimize drawdown risks.',
    topHoldings: ['Government of India 7.18% Bonds', 'State Bank of India', 'ITC Ltd', 'Hindustan Unilever', 'AAA Corporate Bonds']
  },
  {
    id: 'safewealth-multicap-growth',
    name: 'SafeWealth High-Alpha Multi-Cap Fund',
    category: 'Small Cap',
    risk: 'Very High',
    cagr3Y: 22.4,
    cagr5Y: 19.8,
    aum: '₹ 6,210 Cr',
    expenseRatio: '0.85%',
    rating: 4,
    minSip: 1500,
    description: 'Designed for aggressive long-term wealth builders targeting exponential compounding in next-generation industry leaders.',
    topHoldings: ['Polycab India', 'Persistent Systems', 'Solar Industries', 'KPIT Tech', 'Coforge']
  },
  {
    id: 'safewealth-liquid-preservation',
    name: 'SafeWealth Ultra Short Duration Debt',
    category: 'Debt',
    risk: 'Low',
    cagr3Y: 7.4,
    cagr5Y: 7.1,
    aum: '₹ 18,900 Cr',
    expenseRatio: '0.22%',
    rating: 5,
    minSip: 500,
    description: 'Institutional-grade capital preservation and liquidity parking with overnight to 90-day sovereign and AAA instruments.',
    topHoldings: ['Treasury Bills (91 Days)', 'NABARD Bonds', 'REC Ltd AAA', 'HDFC Bank CD', 'PFC Commercial Paper']
  }
];

export const INSIGHTS_ARTICLES = [
  {
    id: 'sip-discipline-volatility',
    title: 'How Rupee Cost Averaging Shields Capital During Market Corrections',
    category: 'Investment Strategy',
    readTime: '4 min read',
    date: 'Oct 18, 2024',
    summary: 'Discover why systematic investment plans mathematically outshine lump-sum market timing over 10+ year compounding horizons.',
    author: 'David Chen, CFA'
  },
  {
    id: 'tax-saving-80c-guide',
    title: 'ELSS Mutual Funds vs. PPF: Tax-Efficiency Comparison Under New Regimes',
    category: 'Tax Planning',
    readTime: '6 min read',
    date: 'Oct 15, 2024',
    summary: 'A forensic breakdown of lock-in periods, inflation-adjusted post-tax returns, and capital allocation frameworks.',
    author: 'Rajesh Sharma, CA'
  },
  {
    id: 'macro-interest-rate-cycle',
    title: 'Navigating Fixed Income in a Pivoting Interest Rate Environment',
    category: 'Macro Outlook',
    readTime: '5 min read',
    date: 'Oct 10, 2024',
    summary: 'Analyzing duration strategies and yield curve spreads for conservative investors seeking superior risk-adjusted yields.',
    author: 'Sarah Jenkins, CFP'
  }
];
