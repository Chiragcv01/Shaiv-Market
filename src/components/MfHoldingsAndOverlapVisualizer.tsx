import React, { useState, useMemo } from 'react';
import {
  Layers,
  PieChart as PieChartIcon,
  Briefcase,
  Search,
  Plus,
  Trash2,
  TrendingUp,
  Percent,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BarChart2,
  Building2,
  RefreshCw,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  SlidersHorizontal,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import { ActiveScreen } from '../types';

export interface HoldingItem {
  company: string;
  sector: string;
  weight: number; // percentage (e.g., 9.2)
  marketCap: 'Large Cap' | 'Mid Cap' | 'Small Cap' | 'Cash & Debt';
}

export interface SectorItem {
  sector: string;
  weight: number; // percentage (e.g. 28.5)
}

export interface PortfolioActivityItem {
  company: string;
  sector: string;
  action: 'Fresh Buy' | 'Increased Stake' | 'Trimmed' | 'Exited';
  change: string;
}

export interface MarketCapSplit {
  largeCap: number;
  midCap: number;
  smallCap: number;
  cashDebt: number;
}

export interface MutualFundPortfolio {
  schemeCode: number;
  schemeName: string;
  category: string;
  fundHouse: string;
  nav: number;
  returns1Y: number;
  returns3Y: number;
  turnoverRatio: string;
  marketCapSplit: MarketCapSplit;
  sectors: SectorItem[];
  recentActivity: PortfolioActivityItem[];
  holdings: HoldingItem[];
}

// Rich dataset of prominent Indian Mutual Funds with their complete portfolio holdings & sectoral distribution
export const RICH_MF_DATABASE: MutualFundPortfolio[] = [
  {
    schemeCode: 122639,
    schemeName: 'Parag Parikh Flexi Cap Fund - Regular Plan - Growth',
    category: 'Flexi Cap',
    fundHouse: 'PPFAS Mutual Fund',
    nav: 78.42,
    returns1Y: 26.8,
    returns3Y: 21.4,
    turnoverRatio: '14.2% (Low / High Conviction)',
    marketCapSplit: { largeCap: 64.2, midCap: 16.8, smallCap: 4.5, cashDebt: 14.5 },
    sectors: [
      { sector: 'Financial Services', weight: 28.6 },
      { sector: 'Information Technology', weight: 18.2 },
      { sector: 'Consumer Services', weight: 14.5 },
      { sector: 'Automobile & Auto', weight: 9.8 },
      { sector: 'Healthcare & Pharma', weight: 8.4 },
      { sector: 'Others & Cash', weight: 20.5 }
    ],
    recentActivity: [
      { company: 'HDFC Bank Ltd', sector: 'Financial Services', action: 'Increased Stake', change: '+1.4% (Added on dip)' },
      { company: 'Power Grid Corp', sector: 'Utilities', action: 'Increased Stake', change: '+0.8% weight' },
      { company: 'Coal India Ltd', sector: 'Metals & Mining', action: 'Trimmed', change: '-0.9% profit booking' },
      { company: 'Maruti Suzuki India', sector: 'Automobile & Auto', action: 'Fresh Buy', change: '+1.2% fresh entry' }
    ],
    holdings: [
      { company: 'HDFC Bank Ltd', sector: 'Financial Services', weight: 8.9, marketCap: 'Large Cap' },
      { company: 'Bajaj Holdings & Investment', sector: 'Financial Services', weight: 7.6, marketCap: 'Large Cap' },
      { company: 'Power Grid Corp of India', sector: 'Utilities', weight: 6.8, marketCap: 'Large Cap' },
      { company: 'ITC Ltd', sector: 'Consumer Goods', weight: 6.2, marketCap: 'Large Cap' },
      { company: 'Coal India Ltd', sector: 'Metals & Mining', weight: 5.4, marketCap: 'Large Cap' },
      { company: 'ICICI Bank Ltd', sector: 'Financial Services', weight: 5.1, marketCap: 'Large Cap' },
      { company: 'Alphabet Inc (Google)', sector: 'Information Technology', weight: 4.8, marketCap: 'Large Cap' },
      { company: 'Microsoft Corporation', sector: 'Information Technology', weight: 4.6, marketCap: 'Large Cap' },
      { company: 'Axis Bank Ltd', sector: 'Financial Services', weight: 4.2, marketCap: 'Large Cap' },
      { company: 'Maruti Suzuki India Ltd', sector: 'Automobile & Auto', weight: 3.9, marketCap: 'Large Cap' },
      { company: 'HCL Technologies Ltd', sector: 'Information Technology', weight: 3.4, marketCap: 'Large Cap' },
      { company: 'Tata Consultancy Services', sector: 'Information Technology', weight: 3.1, marketCap: 'Large Cap' },
      { company: 'Kotak Mahindra Bank Ltd', sector: 'Financial Services', weight: 2.8, marketCap: 'Large Cap' },
      { company: 'Sun Pharmaceutical Ltd', sector: 'Healthcare & Pharma', weight: 2.6, marketCap: 'Large Cap' },
      { company: 'Larsen & Toubro Ltd', sector: 'Capital Goods', weight: 2.4, marketCap: 'Large Cap' },
      { company: 'Cipla Ltd', sector: 'Healthcare & Pharma', weight: 2.2, marketCap: 'Large Cap' },
      { company: 'Tata Motors Ltd', sector: 'Automobile & Auto', weight: 2.0, marketCap: 'Large Cap' },
      { company: 'Dr. Reddy’s Laboratories', sector: 'Healthcare & Pharma', weight: 1.8, marketCap: 'Large Cap' },
      { company: 'Balkrishna Industries', sector: 'Automobile & Auto', weight: 1.6, marketCap: 'Mid Cap' },
      { company: 'Infosys Ltd', sector: 'Information Technology', weight: 1.5, marketCap: 'Large Cap' },
      { company: 'Zensar Technologies', sector: 'Information Technology', weight: 1.3, marketCap: 'Small Cap' },
      { company: 'State Bank of India', sector: 'Financial Services', weight: 1.2, marketCap: 'Large Cap' },
      { company: 'Mphasis Ltd', sector: 'Information Technology', weight: 1.0, marketCap: 'Mid Cap' },
      { company: 'TREPS / Cash Collateral', sector: 'Others & Cash', weight: 13.2, marketCap: 'Cash & Debt' }
    ]
  },
  {
    schemeCode: 118834,
    schemeName: 'Mirae Asset Large Cap Fund - Regular Plan - Growth',
    category: 'Large Cap',
    fundHouse: 'Mirae Asset Mutual Fund',
    nav: 112.65,
    returns1Y: 24.1,
    returns3Y: 16.8,
    turnoverRatio: '22.5% (Moderate)',
    marketCapSplit: { largeCap: 88.5, midCap: 8.2, smallCap: 0.0, cashDebt: 3.3 },
    sectors: [
      { sector: 'Financial Services', weight: 34.2 },
      { sector: 'Information Technology', weight: 12.6 },
      { sector: 'Oil, Gas & Energy', weight: 11.4 },
      { sector: 'Automobile & Auto', weight: 9.1 },
      { sector: 'Consumer Goods', weight: 8.3 },
      { sector: 'Others & Cash', weight: 24.4 }
    ],
    recentActivity: [
      { company: 'Bharti Airtel Ltd', sector: 'Telecom', action: 'Increased Stake', change: '+0.7% weighting' },
      { company: 'Reliance Industries', sector: 'Oil, Gas & Energy', action: 'Increased Stake', change: '+0.5% allocation' },
      { company: 'Tata Motors Ltd', sector: 'Automobile & Auto', action: 'Trimmed', change: '-0.4% rebalancing' },
      { company: 'HDFC Bank Ltd', sector: 'Financial Services', action: 'Fresh Buy', change: '+0.8% additions' }
    ],
    holdings: [
      { company: 'HDFC Bank Ltd', sector: 'Financial Services', weight: 9.8, marketCap: 'Large Cap' },
      { company: 'ICICI Bank Ltd', sector: 'Financial Services', weight: 8.7, marketCap: 'Large Cap' },
      { company: 'Reliance Industries Ltd', sector: 'Oil, Gas & Energy', weight: 8.2, marketCap: 'Large Cap' },
      { company: 'Infosys Ltd', sector: 'Information Technology', weight: 6.1, marketCap: 'Large Cap' },
      { company: 'Larsen & Toubro Ltd', sector: 'Capital Goods', weight: 5.4, marketCap: 'Large Cap' },
      { company: 'Tata Consultancy Services', sector: 'Information Technology', weight: 4.8, marketCap: 'Large Cap' },
      { company: 'State Bank of India', sector: 'Financial Services', weight: 4.2, marketCap: 'Large Cap' },
      { company: 'Bharti Airtel Ltd', sector: 'Telecom', weight: 3.9, marketCap: 'Large Cap' },
      { company: 'Axis Bank Ltd', sector: 'Financial Services', weight: 3.7, marketCap: 'Large Cap' },
      { company: 'Kotak Mahindra Bank', sector: 'Financial Services', weight: 3.2, marketCap: 'Large Cap' },
      { company: 'Mahindra & Mahindra', sector: 'Automobile & Auto', weight: 2.9, marketCap: 'Large Cap' },
      { company: 'ITC Ltd', sector: 'Consumer Goods', weight: 2.8, marketCap: 'Large Cap' },
      { company: 'Sun Pharmaceutical', sector: 'Healthcare & Pharma', weight: 2.5, marketCap: 'Large Cap' },
      { company: 'Maruti Suzuki India', sector: 'Automobile & Auto', weight: 2.3, marketCap: 'Large Cap' },
      { company: 'Titan Company Ltd', sector: 'Consumer Goods', weight: 2.1, marketCap: 'Large Cap' },
      { company: 'NTPC Ltd', sector: 'Energy & Power', weight: 1.9, marketCap: 'Large Cap' },
      { company: 'UltraTech Cement', sector: 'Construction', weight: 1.8, marketCap: 'Large Cap' },
      { company: 'Bajaj Finance Ltd', sector: 'Financial Services', weight: 1.7, marketCap: 'Large Cap' },
      { company: 'Hindustan Unilever Ltd', sector: 'Consumer Goods', weight: 1.6, marketCap: 'Large Cap' },
      { company: 'Tata Motors Ltd', sector: 'Automobile & Auto', weight: 1.5, marketCap: 'Large Cap' },
      { company: 'Asian Paints Ltd', sector: 'Consumer Goods', weight: 1.4, marketCap: 'Large Cap' },
      { company: 'Power Grid Corp', sector: 'Utilities', weight: 1.3, marketCap: 'Large Cap' },
      { company: 'Cash & Short Term Debt', sector: 'Others & Cash', weight: 3.3, marketCap: 'Cash & Debt' }
    ]
  },
  {
    schemeCode: 120503,
    schemeName: 'Quant Small Cap Fund - Regular Plan - Growth',
    category: 'Small Cap',
    fundHouse: 'Quant Mutual Fund',
    nav: 264.18,
    returns1Y: 38.5,
    returns3Y: 29.2,
    turnoverRatio: '84.6% (High / Momentum VLRT)',
    marketCapSplit: { largeCap: 18.2, midCap: 15.4, smallCap: 58.6, cashDebt: 7.8 },
    sectors: [
      { sector: 'Energy & Power', weight: 22.4 },
      { sector: 'Financial Services', weight: 19.1 },
      { sector: 'Metals & Mining', weight: 15.6 },
      { sector: 'Healthcare & Pharma', weight: 13.8 },
      { sector: 'Services & Logistics', weight: 11.2 },
      { sector: 'Others & Cash', weight: 17.9 }
    ],
    recentActivity: [
      { company: 'Jio Financial Services', sector: 'Financial Services', action: 'Increased Stake', change: '+2.1% VLRT pick' },
      { company: 'Steel Authority (SAIL)', sector: 'Metals & Mining', action: 'Fresh Buy', change: '+1.9% cycle bet' },
      { company: 'IRB Infrastructure', sector: 'Construction', action: 'Trimmed', change: '-1.1% momentum exit' },
      { company: 'Adani Power Ltd', sector: 'Energy & Power', action: 'Increased Stake', change: '+1.5% tactical allocation' }
    ],
    holdings: [
      { company: 'Reliance Industries Ltd', sector: 'Oil, Gas & Energy', weight: 7.9, marketCap: 'Large Cap' },
      { company: 'Jio Financial Services', sector: 'Financial Services', weight: 6.4, marketCap: 'Large Cap' },
      { company: 'Adani Power Ltd', sector: 'Energy & Power', weight: 5.8, marketCap: 'Large Cap' },
      { company: 'Steel Authority of India (SAIL)', sector: 'Metals & Mining', weight: 4.9, marketCap: 'Mid Cap' },
      { company: 'Bikaji Foods International', sector: 'Consumer Goods', weight: 4.5, marketCap: 'Small Cap' },
      { company: 'National Aluminium Co (NALCO)', sector: 'Metals & Mining', weight: 4.1, marketCap: 'Mid Cap' },
      { company: 'IRB Infrastructure Developers', sector: 'Construction', weight: 3.8, marketCap: 'Small Cap' },
      { company: 'Aegis Logistics Ltd', sector: 'Services & Logistics', weight: 3.6, marketCap: 'Mid Cap' },
      { company: 'Himadri Speciality Chemical', sector: 'Chemicals', weight: 3.2, marketCap: 'Small Cap' },
      { company: 'Arvind Ltd', sector: 'Textiles', weight: 2.9, marketCap: 'Small Cap' },
      { company: 'HFCL Ltd', sector: 'Telecom Equipment', weight: 2.7, marketCap: 'Small Cap' },
      { company: 'Plaza Wires Ltd', sector: 'Consumer Electricals', weight: 2.4, marketCap: 'Small Cap' },
      { company: 'Rallis India Ltd', sector: 'Agrochemicals', weight: 2.2, marketCap: 'Small Cap' },
      { company: 'Orchid Pharma Ltd', sector: 'Healthcare & Pharma', weight: 2.0, marketCap: 'Small Cap' },
      { company: 'Granules India Ltd', sector: 'Healthcare & Pharma', weight: 1.9, marketCap: 'Mid Cap' },
      { company: 'Piramal Pharma Ltd', sector: 'Healthcare & Pharma', weight: 1.8, marketCap: 'Mid Cap' },
      { company: 'Jindal Saw Ltd', sector: 'Metals & Mining', weight: 1.7, marketCap: 'Small Cap' },
      { company: 'Hindustan Copper Ltd', sector: 'Metals & Mining', weight: 1.6, marketCap: 'Mid Cap' },
      { company: 'Strides Pharma Science', sector: 'Healthcare & Pharma', weight: 1.5, marketCap: 'Small Cap' },
      { company: 'Titagarh Rail Systems', sector: 'Capital Goods', weight: 1.4, marketCap: 'Small Cap' },
      { company: 'Cash & Short Futures Hedge', sector: 'Others & Cash', weight: 7.8, marketCap: 'Cash & Debt' }
    ]
  },
  {
    schemeCode: 120716,
    schemeName: 'UTI Nifty 50 Index Fund - Regular Plan - Growth',
    category: 'Index Fund',
    fundHouse: 'UTI Mutual Fund',
    nav: 172.90,
    returns1Y: 22.8,
    returns3Y: 15.6,
    turnoverRatio: '8.1% (Ultra Low / Passive Index)',
    marketCapSplit: { largeCap: 99.4, midCap: 0.0, smallCap: 0.0, cashDebt: 0.6 },
    sectors: [
      { sector: 'Financial Services', weight: 33.1 },
      { sector: 'Information Technology', weight: 13.9 },
      { sector: 'Oil, Gas & Energy', weight: 11.8 },
      { sector: 'Consumer Goods', weight: 9.4 },
      { sector: 'Automobile & Auto', weight: 7.2 },
      { sector: 'Others & Cash', weight: 24.6 }
    ],
    recentActivity: [
      { company: 'Shriram Finance Ltd', sector: 'Financial Services', action: 'Fresh Buy', change: '+0.7% Nifty Inclusion' },
      { company: 'UPL Ltd', sector: 'Agrochemicals', action: 'Exited', change: 'Index Exclusion' },
      { company: 'HDFC Bank Ltd', sector: 'Financial Services', action: 'Increased Stake', change: '+0.3% Free-float weight' },
      { company: 'Reliance Industries', sector: 'Oil, Gas & Energy', action: 'Increased Stake', change: '+0.2% Market cap delta' }
    ],
    holdings: [
      { company: 'HDFC Bank Ltd', sector: 'Financial Services', weight: 11.2, marketCap: 'Large Cap' },
      { company: 'Reliance Industries Ltd', sector: 'Oil, Gas & Energy', weight: 9.4, marketCap: 'Large Cap' },
      { company: 'ICICI Bank Ltd', sector: 'Financial Services', weight: 7.9, marketCap: 'Large Cap' },
      { company: 'Infosys Ltd', sector: 'Information Technology', weight: 5.8, marketCap: 'Large Cap' },
      { company: 'Larsen & Toubro Ltd', sector: 'Capital Goods', weight: 4.5, marketCap: 'Large Cap' },
      { company: 'Tata Consultancy Services', sector: 'Information Technology', weight: 4.1, marketCap: 'Large Cap' },
      { company: 'ITC Ltd', sector: 'Consumer Goods', weight: 3.8, marketCap: 'Large Cap' },
      { company: 'Bharti Airtel Ltd', sector: 'Telecom', weight: 3.7, marketCap: 'Large Cap' },
      { company: 'Axis Bank Ltd', sector: 'Financial Services', weight: 3.3, marketCap: 'Large Cap' },
      { company: 'State Bank of India', sector: 'Financial Services', weight: 3.1, marketCap: 'Large Cap' },
      { company: 'Mahindra & Mahindra', sector: 'Automobile & Auto', weight: 2.8, marketCap: 'Large Cap' },
      { company: 'Kotak Mahindra Bank', sector: 'Financial Services', weight: 2.6, marketCap: 'Large Cap' },
      { company: 'Sun Pharmaceutical', sector: 'Healthcare & Pharma', weight: 2.3, marketCap: 'Large Cap' },
      { company: 'Tata Motors Ltd', sector: 'Automobile & Auto', weight: 2.1, marketCap: 'Large Cap' },
      { company: 'NTPC Ltd', sector: 'Energy & Power', weight: 2.0, marketCap: 'Large Cap' },
      { company: 'Maruti Suzuki India', sector: 'Automobile & Auto', weight: 1.9, marketCap: 'Large Cap' },
      { company: 'Titan Company Ltd', sector: 'Consumer Goods', weight: 1.8, marketCap: 'Large Cap' },
      { company: 'Power Grid Corp', sector: 'Utilities', weight: 1.7, marketCap: 'Large Cap' },
      { company: 'UltraTech Cement', sector: 'Construction', weight: 1.6, marketCap: 'Large Cap' },
      { company: 'Bajaj Finance Ltd', sector: 'Financial Services', weight: 1.5, marketCap: 'Large Cap' },
      { company: 'Oil & Natural Gas Corp (ONGC)', sector: 'Oil, Gas & Energy', weight: 1.4, marketCap: 'Large Cap' },
      { company: 'Coal India Ltd', sector: 'Metals & Mining', weight: 1.3, marketCap: 'Large Cap' },
      { company: 'Hindustan Unilever', sector: 'Consumer Goods', weight: 1.3, marketCap: 'Large Cap' },
      { company: 'Grasim Industries', sector: 'Textiles & Materials', weight: 1.2, marketCap: 'Large Cap' },
      { company: 'Tata Steel Ltd', sector: 'Metals & Mining', weight: 1.1, marketCap: 'Large Cap' },
      { company: 'Bajaj Finserv Ltd', sector: 'Financial Services', weight: 1.0, marketCap: 'Large Cap' },
      { company: 'Other 24 Nifty Index Constituents', sector: 'Diversified', weight: 12.8, marketCap: 'Large Cap' }
    ]
  },
  {
    schemeCode: 119551,
    schemeName: 'HDFC Mid-Cap Opportunities Fund - Regular Plan - Growth',
    category: 'Mid Cap',
    fundHouse: 'HDFC Mutual Fund',
    nav: 188.35,
    returns1Y: 34.2,
    returns3Y: 26.5,
    turnoverRatio: '19.4% (Disciplined Growth)',
    marketCapSplit: { largeCap: 15.6, midCap: 68.4, smallCap: 12.2, cashDebt: 3.8 },
    sectors: [
      { sector: 'Financial Services', weight: 21.4 },
      { sector: 'Capital Goods & Industrials', weight: 20.8 },
      { sector: 'Automobile & Auto', weight: 14.6 },
      { sector: 'Healthcare & Pharma', weight: 12.3 },
      { sector: 'Information Technology', weight: 9.5 },
      { sector: 'Others & Cash', weight: 21.4 }
    ],
    recentActivity: [
      { company: 'Bharat Electronics Ltd', sector: 'Capital Goods', action: 'Increased Stake', change: '+0.9% defence capex' },
      { company: 'Indian Hotels Co Ltd', sector: 'Consumer Services', action: 'Increased Stake', change: '+0.6% hospitality rally' },
      { company: 'Apollo Tyres Ltd', sector: 'Automobile & Auto', action: 'Trimmed', change: '-0.5% valuation target' },
      { company: 'Persistent Systems', sector: 'Information Technology', action: 'Fresh Buy', change: '+0.7% IT midcap pick' }
    ],
    holdings: [
      { company: 'Indian Hotels Co Ltd', sector: 'Consumer Services', weight: 4.8, marketCap: 'Mid Cap' },
      { company: 'Tata Communications Ltd', sector: 'Telecom', weight: 4.2, marketCap: 'Mid Cap' },
      { company: 'Bharat Electronics Ltd', sector: 'Capital Goods', weight: 3.9, marketCap: 'Large Cap' },
      { company: 'Federal Bank Ltd', sector: 'Financial Services', weight: 3.7, marketCap: 'Mid Cap' },
      { company: 'Balkrishna Industries Ltd', sector: 'Automobile & Auto', weight: 3.5, marketCap: 'Mid Cap' },
      { company: 'Max Financial Services', sector: 'Financial Services', weight: 3.4, marketCap: 'Mid Cap' },
      { company: 'Coforge Ltd', sector: 'Information Technology', weight: 3.1, marketCap: 'Mid Cap' },
      { company: 'Apollo Tyres Ltd', sector: 'Automobile & Auto', weight: 2.9, marketCap: 'Mid Cap' },
      { company: 'Sundram Fasteners Ltd', sector: 'Automobile & Auto', weight: 2.7, marketCap: 'Mid Cap' },
      { company: 'Persistent Systems Ltd', sector: 'Information Technology', weight: 2.6, marketCap: 'Mid Cap' },
      { company: 'AU Small Finance Bank', sector: 'Financial Services', weight: 2.4, marketCap: 'Mid Cap' },
      { company: 'Astral Ltd', sector: 'Building Materials', weight: 2.3, marketCap: 'Mid Cap' },
      { company: 'Supreme Industries Ltd', sector: 'Capital Goods', weight: 2.1, marketCap: 'Mid Cap' },
      { company: 'IPCA Laboratories Ltd', sector: 'Healthcare & Pharma', weight: 2.0, marketCap: 'Mid Cap' },
      { company: 'SKF India Ltd', sector: 'Capital Goods', weight: 1.9, marketCap: 'Mid Cap' },
      { company: 'Alkem Laboratories Ltd', sector: 'Healthcare & Pharma', weight: 1.8, marketCap: 'Mid Cap' },
      { company: 'Lupin Ltd', sector: 'Healthcare & Pharma', weight: 1.7, marketCap: 'Mid Cap' },
      { company: 'Cummins India Ltd', sector: 'Capital Goods', weight: 1.6, marketCap: 'Mid Cap' },
      { company: 'Solar Industries India', sector: 'Chemicals', weight: 1.5, marketCap: 'Mid Cap' },
      { company: 'Polycab India Ltd', sector: 'Capital Goods', weight: 1.4, marketCap: 'Mid Cap' },
      { company: 'Cash & Short Term Collateral', sector: 'Others & Cash', weight: 3.8, marketCap: 'Cash & Debt' }
    ]
  },
  {
    schemeCode: 119598,
    schemeName: 'SBI Bluechip Fund - Regular Plan - Growth',
    category: 'Large Cap',
    fundHouse: 'SBI Mutual Fund',
    nav: 96.12,
    returns1Y: 21.6,
    returns3Y: 14.9,
    turnoverRatio: '16.8% (Conservative Large Cap)',
    marketCapSplit: { largeCap: 84.1, midCap: 12.3, smallCap: 0.0, cashDebt: 3.6 },
    sectors: [
      { sector: 'Financial Services', weight: 31.8 },
      { sector: 'Automobile & Auto', weight: 13.2 },
      { sector: 'Information Technology', weight: 11.5 },
      { sector: 'Healthcare & Pharma', weight: 9.4 },
      { sector: 'Construction & Materials', weight: 8.1 },
      { sector: 'Others & Cash', weight: 26.0 }
    ],
    recentActivity: [
      { company: 'Mahindra & Mahindra', sector: 'Automobile & Auto', action: 'Increased Stake', change: '+0.8% SUV expansion' },
      { company: 'Sun Pharmaceutical', sector: 'Healthcare & Pharma', action: 'Increased Stake', change: '+0.5% US pipeline' },
      { company: 'State Bank of India', sector: 'Financial Services', action: 'Increased Stake', change: '+0.6% credit growth' },
      { company: 'Infosys Ltd', sector: 'Information Technology', action: 'Trimmed', change: '-0.4% profit taking' }
    ],
    holdings: [
      { company: 'HDFC Bank Ltd', sector: 'Financial Services', weight: 8.6, marketCap: 'Large Cap' },
      { company: 'ICICI Bank Ltd', sector: 'Financial Services', weight: 7.8, marketCap: 'Large Cap' },
      { company: 'Reliance Industries Ltd', sector: 'Oil, Gas & Energy', weight: 6.9, marketCap: 'Large Cap' },
      { company: 'Infosys Ltd', sector: 'Information Technology', weight: 5.2, marketCap: 'Large Cap' },
      { company: 'Larsen & Toubro Ltd', sector: 'Capital Goods', weight: 4.9, marketCap: 'Large Cap' },
      { company: 'Mahindra & Mahindra', sector: 'Automobile & Auto', weight: 4.2, marketCap: 'Large Cap' },
      { company: 'State Bank of India', sector: 'Financial Services', weight: 3.9, marketCap: 'Large Cap' },
      { company: 'ITC Ltd', sector: 'Consumer Goods', weight: 3.5, marketCap: 'Large Cap' },
      { company: 'Sun Pharmaceutical', sector: 'Healthcare & Pharma', weight: 3.3, marketCap: 'Large Cap' },
      { company: 'Tata Motors Ltd', sector: 'Automobile & Auto', weight: 3.1, marketCap: 'Large Cap' },
      { company: 'Bharti Airtel Ltd', sector: 'Telecom', weight: 2.9, marketCap: 'Large Cap' },
      { company: 'Bajaj Finance Ltd', sector: 'Financial Services', weight: 2.7, marketCap: 'Large Cap' },
      { company: 'Titan Company Ltd', sector: 'Consumer Goods', weight: 2.5, marketCap: 'Large Cap' },
      { company: 'Kotak Mahindra Bank', sector: 'Financial Services', weight: 2.4, marketCap: 'Large Cap' },
      { company: 'Tata Consultancy Services', sector: 'Information Technology', weight: 2.2, marketCap: 'Large Cap' },
      { company: 'Axis Bank Ltd', sector: 'Financial Services', weight: 2.1, marketCap: 'Large Cap' },
      { company: 'NTPC Ltd', sector: 'Energy & Power', weight: 1.9, marketCap: 'Large Cap' },
      { company: 'UltraTech Cement', sector: 'Construction', weight: 1.8, marketCap: 'Large Cap' },
      { company: 'Maruti Suzuki India', sector: 'Automobile & Auto', weight: 1.7, marketCap: 'Large Cap' },
      { company: 'Cipla Ltd', sector: 'Healthcare & Pharma', weight: 1.6, marketCap: 'Large Cap' },
      { company: 'Cash & Equivalent Deposits', sector: 'Others & Cash', weight: 3.6, marketCap: 'Cash & Debt' }
    ]
  },
  {
    schemeCode: 120594,
    schemeName: 'Nippon India Small Cap Fund - Regular Plan - Growth',
    category: 'Small Cap',
    fundHouse: 'Nippon India Mutual Fund',
    nav: 176.40,
    returns1Y: 36.8,
    returns3Y: 28.4,
    turnoverRatio: '26.4% (Deep Value & Micro-Cap)',
    marketCapSplit: { largeCap: 11.2, midCap: 18.5, smallCap: 66.8, cashDebt: 3.5 },
    sectors: [
      { sector: 'Capital Goods & Industrials', weight: 23.5 },
      { sector: 'Financial Services', weight: 14.2 },
      { sector: 'Chemicals & Materials', weight: 12.8 },
      { sector: 'Consumer Goods', weight: 10.9 },
      { sector: 'Healthcare & Pharma', weight: 9.6 },
      { sector: 'Others & Cash', weight: 29.0 }
    ],
    recentActivity: [
      { company: 'Apar Industries Ltd', sector: 'Capital Goods', action: 'Increased Stake', change: '+0.8% transformer boom' },
      { company: 'Multi Commodity Exchange (MCX)', sector: 'Financial Services', action: 'Increased Stake', change: '+0.7% options volumes' },
      { company: 'Tejas Networks Ltd', sector: 'Telecom', action: 'Fresh Buy', change: '+0.9% 4G/5G indigenous roll-out' },
      { company: 'Tube Investments', sector: 'Automobile & Auto', action: 'Trimmed', change: '-0.4% valuation trim' }
    ],
    holdings: [
      { company: 'Tube Investments of India', sector: 'Automobile & Auto', weight: 3.2, marketCap: 'Large Cap' },
      { company: 'HDFC Bank Ltd', sector: 'Financial Services', weight: 2.8, marketCap: 'Large Cap' },
      { company: 'Apar Industries Ltd', sector: 'Capital Goods', weight: 2.6, marketCap: 'Mid Cap' },
      { company: 'Voltamp Transformers Ltd', sector: 'Capital Goods', weight: 2.4, marketCap: 'Small Cap' },
      { company: 'Multi Commodity Exchange (MCX)', sector: 'Financial Services', weight: 2.3, marketCap: 'Mid Cap' },
      { company: 'Kirloskar Brothers Ltd', sector: 'Capital Goods', weight: 2.1, marketCap: 'Small Cap' },
      { company: 'KPIT Technologies Ltd', sector: 'Information Technology', weight: 2.0, marketCap: 'Mid Cap' },
      { company: 'CreditAccess Grameen Ltd', sector: 'Financial Services', weight: 1.9, marketCap: 'Small Cap' },
      { company: 'Tejas Networks Ltd', sector: 'Telecom', weight: 1.8, marketCap: 'Mid Cap' },
      { company: 'Birlasoft Ltd', sector: 'Information Technology', weight: 1.7, marketCap: 'Mid Cap' },
      { company: 'Carborundum Universal', sector: 'Capital Goods', weight: 1.6, marketCap: 'Mid Cap' },
      { company: 'KEC International Ltd', sector: 'Capital Goods', weight: 1.5, marketCap: 'Small Cap' },
      { company: 'Deepak Nitrite Ltd', sector: 'Chemicals', weight: 1.4, marketCap: 'Mid Cap' },
      { company: 'Navin Fluorine International', sector: 'Chemicals', weight: 1.3, marketCap: 'Mid Cap' },
      { company: 'PNC Infratech Ltd', sector: 'Construction', weight: 1.2, marketCap: 'Small Cap' },
      { company: 'Sonata Software Ltd', sector: 'Information Technology', weight: 1.1, marketCap: 'Small Cap' },
      { company: 'Elgi Equipments Ltd', sector: 'Capital Goods', weight: 1.0, marketCap: 'Small Cap' },
      { company: 'Magellanic Cloud Ltd', sector: 'Information Technology', weight: 0.9, marketCap: 'Small Cap' },
      { company: 'Fine Organic Industries', sector: 'Chemicals', weight: 0.9, marketCap: 'Mid Cap' },
      { company: 'JB Chemicals & Pharmaceuticals', sector: 'Healthcare & Pharma', weight: 0.8, marketCap: 'Small Cap' },
      { company: 'Cash & Short-Term Liquidity', sector: 'Others & Cash', weight: 3.5, marketCap: 'Cash & Debt' }
    ]
  },
  {
    schemeCode: 120828,
    schemeName: 'ICICI Prudential Bluechip Fund - Regular Plan - Growth',
    category: 'Large Cap',
    fundHouse: 'ICICI Prudential Mutual Fund',
    nav: 104.50,
    returns1Y: 23.4,
    returns3Y: 17.2,
    turnoverRatio: '28.1% (Tactical Quality Tilt)',
    marketCapSplit: { largeCap: 89.2, midCap: 7.6, smallCap: 0.0, cashDebt: 3.2 },
    sectors: [
      { sector: 'Financial Services', weight: 32.5 },
      { sector: 'Oil, Gas & Energy', weight: 14.1 },
      { sector: 'Information Technology', weight: 11.8 },
      { sector: 'Automobile & Auto', weight: 9.6 },
      { sector: 'Healthcare & Pharma', weight: 7.8 },
      { sector: 'Others & Cash', weight: 24.2 }
    ],
    recentActivity: [
      { company: 'ICICI Bank Ltd', sector: 'Financial Services', action: 'Increased Stake', change: '+0.9% core position' },
      { company: 'Larsen & Toubro', sector: 'Capital Goods', action: 'Increased Stake', change: '+0.6% infra capex' },
      { company: 'Infosys Ltd', sector: 'Information Technology', action: 'Trimmed', change: '-0.3% tech weight' },
      { company: 'Maruti Suzuki India', sector: 'Automobile & Auto', action: 'Fresh Buy', change: '+0.7% auto cycle' }
    ],
    holdings: [
      { company: 'ICICI Bank Ltd', sector: 'Financial Services', weight: 9.4, marketCap: 'Large Cap' },
      { company: 'Reliance Industries Ltd', sector: 'Oil, Gas & Energy', weight: 8.5, marketCap: 'Large Cap' },
      { company: 'HDFC Bank Ltd', sector: 'Financial Services', weight: 8.1, marketCap: 'Large Cap' },
      { company: 'Infosys Ltd', sector: 'Information Technology', weight: 5.7, marketCap: 'Large Cap' },
      { company: 'Larsen & Toubro Ltd', sector: 'Capital Goods', weight: 5.1, marketCap: 'Large Cap' },
      { company: 'Bharti Airtel Ltd', sector: 'Telecom', weight: 4.3, marketCap: 'Large Cap' },
      { company: 'Axis Bank Ltd', sector: 'Financial Services', weight: 3.8, marketCap: 'Large Cap' },
      { company: 'Maruti Suzuki India', sector: 'Automobile & Auto', weight: 3.5, marketCap: 'Large Cap' },
      { company: 'State Bank of India', sector: 'Financial Services', weight: 3.4, marketCap: 'Large Cap' },
      { company: 'Sun Pharmaceutical', sector: 'Healthcare & Pharma', weight: 3.0, marketCap: 'Large Cap' },
      { company: 'Tata Motors Ltd', sector: 'Automobile & Auto', weight: 2.8, marketCap: 'Large Cap' },
      { company: 'NTPC Ltd', sector: 'Energy & Power', weight: 2.5, marketCap: 'Large Cap' },
      { company: 'ITC Ltd', sector: 'Consumer Goods', weight: 2.4, marketCap: 'Large Cap' },
      { company: 'Oil & Natural Gas Corp (ONGC)', sector: 'Oil, Gas & Energy', weight: 2.2, marketCap: 'Large Cap' },
      { company: 'Tata Consultancy Services', sector: 'Information Technology', weight: 2.0, marketCap: 'Large Cap' },
      { company: 'UltraTech Cement', sector: 'Construction', weight: 1.9, marketCap: 'Large Cap' },
      { company: 'Mahindra & Mahindra', sector: 'Automobile & Auto', weight: 1.8, marketCap: 'Large Cap' },
      { company: 'Cipla Ltd', sector: 'Healthcare & Pharma', weight: 1.6, marketCap: 'Large Cap' },
      { company: 'Cash & Short-Term Treps', sector: 'Others & Cash', weight: 3.2, marketCap: 'Cash & Debt' }
    ]
  },
  {
    schemeCode: 120465,
    schemeName: 'Kotak Emerging Equity Fund - Regular Plan - Growth',
    category: 'Mid Cap',
    fundHouse: 'Kotak Mahindra Mutual Fund',
    nav: 128.90,
    returns1Y: 33.6,
    returns3Y: 25.1,
    turnoverRatio: '24.0% (Quality Midcap Growth)',
    marketCapSplit: { largeCap: 12.5, midCap: 72.8, smallCap: 11.2, cashDebt: 3.5 },
    sectors: [
      { sector: 'Capital Goods & Industrials', weight: 24.2 },
      { sector: 'Financial Services', weight: 18.5 },
      { sector: 'Consumer Goods', weight: 14.8 },
      { sector: 'Chemicals & Materials', weight: 11.6 },
      { sector: 'Healthcare & Pharma', weight: 10.2 },
      { sector: 'Others & Cash', weight: 20.7 }
    ],
    recentActivity: [
      { company: 'Supreme Industries', sector: 'Capital Goods', action: 'Increased Stake', change: '+0.8% volume growth' },
      { company: 'Solar Industries India', sector: 'Chemicals', action: 'Increased Stake', change: '+0.7% export order book' },
      { company: 'Schaeffler India', sector: 'Capital Goods', action: 'Trimmed', change: '-0.5% auto component cycle' },
      { company: 'Thermax Ltd', sector: 'Capital Goods', action: 'Fresh Buy', change: '+0.6% green energy transition' }
    ],
    holdings: [
      { company: 'Supreme Industries Ltd', sector: 'Capital Goods', weight: 4.6, marketCap: 'Mid Cap' },
      { company: 'Solar Industries India', sector: 'Chemicals', weight: 4.2, marketCap: 'Mid Cap' },
      { company: 'Cummins India Ltd', sector: 'Capital Goods', weight: 3.9, marketCap: 'Mid Cap' },
      { company: 'Persistent Systems Ltd', sector: 'Information Technology', weight: 3.6, marketCap: 'Mid Cap' },
      { company: 'Thermax Ltd', sector: 'Capital Goods', weight: 3.4, marketCap: 'Mid Cap' },
      { company: 'Schaeffler India Ltd', sector: 'Capital Goods', weight: 3.1, marketCap: 'Mid Cap' },
      { company: 'Balkrishna Industries Ltd', sector: 'Automobile & Auto', weight: 2.9, marketCap: 'Mid Cap' },
      { company: 'Federal Bank Ltd', sector: 'Financial Services', weight: 2.8, marketCap: 'Mid Cap' },
      { company: 'APL Apollo Tubes Ltd', sector: 'Capital Goods', weight: 2.6, marketCap: 'Mid Cap' },
      { company: 'Bharat Forge Ltd', sector: 'Automobile & Auto', weight: 2.5, marketCap: 'Mid Cap' },
      { company: 'Max Financial Services', sector: 'Financial Services', weight: 2.3, marketCap: 'Mid Cap' },
      { company: 'Atul Ltd', sector: 'Chemicals', weight: 2.1, marketCap: 'Mid Cap' },
      { company: 'Dixon Technologies Ltd', sector: 'Consumer Electronics', weight: 2.0, marketCap: 'Mid Cap' },
      { company: 'Kajaria Ceramics Ltd', sector: 'Building Materials', weight: 1.9, marketCap: 'Mid Cap' },
      { company: 'Apollo Hospitals Enterprise', sector: 'Healthcare & Pharma', weight: 1.8, marketCap: 'Large Cap' },
      { company: 'Sundram Fasteners Ltd', sector: 'Automobile & Auto', weight: 1.7, marketCap: 'Mid Cap' },
      { company: 'SKF India Ltd', sector: 'Capital Goods', weight: 1.6, marketCap: 'Mid Cap' },
      { company: 'Polycab India Ltd', sector: 'Capital Goods', weight: 1.5, marketCap: 'Mid Cap' },
      { company: 'Astral Ltd', sector: 'Building Materials', weight: 1.4, marketCap: 'Mid Cap' },
      { company: 'IPCA Laboratories', sector: 'Healthcare & Pharma', weight: 1.3, marketCap: 'Mid Cap' },
      { company: 'Cash & Short-Term Margin', sector: 'Others & Cash', weight: 3.5, marketCap: 'Cash & Debt' }
    ]
  },
  {
    schemeCode: 120505,
    schemeName: 'Tata Digital India Fund - Regular Plan - Growth',
    category: 'Thematic / Tech',
    fundHouse: 'Tata Mutual Fund',
    nav: 48.60,
    returns1Y: 28.4,
    returns3Y: 18.9,
    turnoverRatio: '32.1% (Tech Sector Focus)',
    marketCapSplit: { largeCap: 62.0, midCap: 26.5, smallCap: 8.5, cashDebt: 3.0 },
    sectors: [
      { sector: 'Information Technology', weight: 78.4 },
      { sector: 'Telecom & Tech Enablers', weight: 12.6 },
      { sector: 'Consumer Internet & AI', weight: 6.0 },
      { sector: 'Others & Cash', weight: 3.0 }
    ],
    recentActivity: [
      { company: 'Infosys Ltd', sector: 'Information Technology', action: 'Increased Stake', change: '+1.8% GenAI deal wins' },
      { company: 'Tata Consultancy Services', sector: 'Information Technology', action: 'Increased Stake', change: '+1.2% large deals' },
      { company: 'Coforge Ltd', sector: 'Information Technology', action: 'Increased Stake', change: '+0.9% cloud migrations' },
      { company: 'Wipro Ltd', sector: 'Information Technology', action: 'Trimmed', change: '-0.8% capital reallocation' }
    ],
    holdings: [
      { company: 'Infosys Ltd', sector: 'Information Technology', weight: 16.8, marketCap: 'Large Cap' },
      { company: 'Tata Consultancy Services', sector: 'Information Technology', weight: 14.5, marketCap: 'Large Cap' },
      { company: 'HCL Technologies Ltd', sector: 'Information Technology', weight: 9.8, marketCap: 'Large Cap' },
      { company: 'Tech Mahindra Ltd', sector: 'Information Technology', weight: 7.4, marketCap: 'Large Cap' },
      { company: 'Wipro Ltd', sector: 'Information Technology', weight: 6.8, marketCap: 'Large Cap' },
      { company: 'LTIMindtree Ltd', sector: 'Information Technology', weight: 6.2, marketCap: 'Large Cap' },
      { company: 'Persistent Systems Ltd', sector: 'Information Technology', weight: 5.5, marketCap: 'Mid Cap' },
      { company: 'Coforge Ltd', sector: 'Information Technology', weight: 5.1, marketCap: 'Mid Cap' },
      { company: 'KPIT Technologies Ltd', sector: 'Information Technology', weight: 4.6, marketCap: 'Mid Cap' },
      { company: 'Tata Communications Ltd', sector: 'Telecom', weight: 4.2, marketCap: 'Mid Cap' },
      { company: 'Tata Elxsi Ltd', sector: 'Information Technology', weight: 3.8, marketCap: 'Mid Cap' },
      { company: 'Birlasoft Ltd', sector: 'Information Technology', weight: 3.2, marketCap: 'Small Cap' },
      { company: 'Zensar Technologies', sector: 'Information Technology', weight: 2.8, marketCap: 'Small Cap' },
      { company: 'Cyient Ltd', sector: 'Information Technology', weight: 2.4, marketCap: 'Small Cap' },
      { company: 'Sonata Software Ltd', sector: 'Information Technology', weight: 2.1, marketCap: 'Small Cap' },
      { company: 'Cash & Short-Term Buffer', sector: 'Others & Cash', weight: 3.0, marketCap: 'Cash & Debt' }
    ]
  },
  {
    schemeCode: 120847,
    schemeName: 'Axis Bluechip Fund - Regular Plan - Growth',
    category: 'Large Cap',
    fundHouse: 'Axis Mutual Fund',
    nav: 56.40,
    returns1Y: 19.8,
    returns3Y: 13.5,
    turnoverRatio: '18.2% (Quality Bluechip)',
    marketCapSplit: { largeCap: 91.2, midCap: 5.4, smallCap: 0.0, cashDebt: 3.4 },
    sectors: [
      { sector: 'Financial Services', weight: 36.4 },
      { sector: 'Information Technology', weight: 14.8 },
      { sector: 'Consumer Goods', weight: 12.2 },
      { sector: 'Automobile & Auto', weight: 8.9 },
      { sector: 'Healthcare & Pharma', weight: 6.5 },
      { sector: 'Others & Cash', weight: 21.2 }
    ],
    recentActivity: [
      { company: 'ICICI Bank Ltd', sector: 'Financial Services', action: 'Increased Stake', change: '+0.8% weight' },
      { company: 'Titan Company Ltd', sector: 'Consumer Goods', action: 'Fresh Buy', change: '+0.7% retail expansion' },
      { company: 'Bajaj Finance Ltd', sector: 'Financial Services', action: 'Trimmed', change: '-0.5% valuation balance' }
    ],
    holdings: [
      { company: 'ICICI Bank Ltd', sector: 'Financial Services', weight: 9.6, marketCap: 'Large Cap' },
      { company: 'HDFC Bank Ltd', sector: 'Financial Services', weight: 9.1, marketCap: 'Large Cap' },
      { company: 'Infosys Ltd', sector: 'Information Technology', weight: 7.4, marketCap: 'Large Cap' },
      { company: 'Reliance Industries Ltd', sector: 'Oil, Gas & Energy', weight: 6.8, marketCap: 'Large Cap' },
      { company: 'Tata Consultancy Services', sector: 'Information Technology', weight: 5.2, marketCap: 'Large Cap' },
      { company: 'Bajaj Finance Ltd', sector: 'Financial Services', weight: 4.8, marketCap: 'Large Cap' },
      { company: 'Avenue Supermarts (DMart)', sector: 'Consumer Goods', weight: 4.4, marketCap: 'Large Cap' },
      { company: 'Kotak Mahindra Bank', sector: 'Financial Services', weight: 4.1, marketCap: 'Large Cap' },
      { company: 'Larsen & Toubro Ltd', sector: 'Capital Goods', weight: 3.9, marketCap: 'Large Cap' },
      { company: 'Titan Company Ltd', sector: 'Consumer Goods', weight: 3.5, marketCap: 'Large Cap' },
      { company: 'Mahindra & Mahindra', sector: 'Automobile & Auto', weight: 3.2, marketCap: 'Large Cap' },
      { company: 'Nestle India Ltd', sector: 'Consumer Goods', weight: 2.8, marketCap: 'Large Cap' },
      { company: 'Sun Pharmaceutical', sector: 'Healthcare & Pharma', weight: 2.5, marketCap: 'Large Cap' },
      { company: 'Maruti Suzuki India', sector: 'Automobile & Auto', weight: 2.3, marketCap: 'Large Cap' },
      { company: 'UltraTech Cement', sector: 'Construction', weight: 2.0, marketCap: 'Large Cap' },
      { company: 'Cash & Short-Term Debt', sector: 'Others & Cash', weight: 3.4, marketCap: 'Cash & Debt' }
    ]
  },
  {
    schemeCode: 120586,
    schemeName: 'Canara Robeco Emerging Equities - Regular Plan - Growth',
    category: 'Large & Mid Cap',
    fundHouse: 'Canara Robeco Mutual Fund',
    nav: 242.10,
    returns1Y: 29.5,
    returns3Y: 21.8,
    turnoverRatio: '17.6% (Disciplined Quality)',
    marketCapSplit: { largeCap: 52.4, midCap: 43.1, smallCap: 1.2, cashDebt: 3.3 },
    sectors: [
      { sector: 'Financial Services', weight: 29.8 },
      { sector: 'Automobile & Auto', weight: 13.5 },
      { sector: 'Capital Goods', weight: 12.8 },
      { sector: 'Healthcare & Pharma', weight: 11.2 },
      { sector: 'Information Technology', weight: 9.6 },
      { sector: 'Others & Cash', weight: 23.1 }
    ],
    recentActivity: [
      { company: 'Bharat Electronics Ltd', sector: 'Capital Goods', action: 'Increased Stake', change: '+0.8% order inflows' },
      { company: 'Trent Ltd', sector: 'Consumer Goods', action: 'Increased Stake', change: '+0.6% retail growth' },
      { company: 'HDFC Bank Ltd', sector: 'Financial Services', action: 'Increased Stake', change: '+0.5% allocation' }
    ],
    holdings: [
      { company: 'HDFC Bank Ltd', sector: 'Financial Services', weight: 6.8, marketCap: 'Large Cap' },
      { company: 'ICICI Bank Ltd', sector: 'Financial Services', weight: 6.2, marketCap: 'Large Cap' },
      { company: 'Reliance Industries Ltd', sector: 'Oil, Gas & Energy', weight: 5.4, marketCap: 'Large Cap' },
      { company: 'Larsen & Toubro Ltd', sector: 'Capital Goods', weight: 4.8, marketCap: 'Large Cap' },
      { company: 'Bharat Electronics Ltd', sector: 'Capital Goods', weight: 4.2, marketCap: 'Large Cap' },
      { company: 'Infosys Ltd', sector: 'Information Technology', weight: 3.9, marketCap: 'Large Cap' },
      { company: 'Trent Ltd', sector: 'Consumer Goods', weight: 3.7, marketCap: 'Large Cap' },
      { company: 'Indian Hotels Co Ltd', sector: 'Consumer Services', weight: 3.5, marketCap: 'Mid Cap' },
      { company: 'State Bank of India', sector: 'Financial Services', weight: 3.2, marketCap: 'Large Cap' },
      { company: 'Mahindra & Mahindra', sector: 'Automobile & Auto', weight: 3.0, marketCap: 'Large Cap' },
      { company: 'Max Financial Services', sector: 'Financial Services', weight: 2.8, marketCap: 'Mid Cap' },
      { company: 'Persistent Systems Ltd', sector: 'Information Technology', weight: 2.6, marketCap: 'Mid Cap' },
      { company: 'Federal Bank Ltd', sector: 'Financial Services', weight: 2.4, marketCap: 'Mid Cap' },
      { company: 'Supreme Industries Ltd', sector: 'Capital Goods', weight: 2.2, marketCap: 'Mid Cap' },
      { company: 'Sun Pharmaceutical', sector: 'Healthcare & Pharma', weight: 2.1, marketCap: 'Large Cap' },
      { company: 'Cash & Short-Term Treps', sector: 'Others & Cash', weight: 3.3, marketCap: 'Cash & Debt' }
    ]
  }
];

const SECTOR_COLORS = [
  '#003461',
  '#006d42',
  '#b45309',
  '#6b21a8',
  '#0e7490',
  '#be185d',
  '#374151',
  '#15803d',
  '#c2410c',
  '#4338ca'
];

interface MfHoldingsAndOverlapVisualizerProps {
  onNavigate?: (screen: ActiveScreen) => void;
  onSelectForProposal?: (schemeName: string) => void;
}

export const MfHoldingsAndOverlapVisualizer: React.FC<MfHoldingsAndOverlapVisualizerProps> = ({
  onNavigate,
  onSelectForProposal
}) => {
  // Selected Fund for detailed Single-Fund Inspection
  const [activeFundCode, setActiveFundCode] = useState<number>(122639);
  
  // Selected Funds for Multi-Fund Overlap Analysis (default 2 funds)
  const [selectedOverlapCodes, setSelectedOverlapCodes] = useState<number[]>([122639, 118834]);
  
  // Master fund search state
  const [fundSearchQuery, setFundSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  
  // In-fund holding filter query
  const [holdingFilterQuery, setHoldingFilterQuery] = useState<string>('');
  
  // View mode for holdings: 'top10' or 'all'
  const [holdingViewMode, setHoldingViewMode] = useState<'top10' | 'all'>('top10');

  const [activeTab, setActiveTab] = useState<'holdings' | 'overlap'>('holdings');

  // Currently inspected single fund
  const activeFund = useMemo(() => {
    return RICH_MF_DATABASE.find((f) => f.schemeCode === activeFundCode) || RICH_MF_DATABASE[0];
  }, [activeFundCode]);

  // Filtered funds based on user search in the main search bar
  const searchedFunds = useMemo(() => {
    if (!fundSearchQuery.trim()) return RICH_MF_DATABASE;
    const q = fundSearchQuery.toLowerCase();
    return RICH_MF_DATABASE.filter(
      (f) =>
        f.schemeName.toLowerCase().includes(q) ||
        f.fundHouse.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        f.schemeCode.toString().includes(q) ||
        f.holdings.some((h) => h.company.toLowerCase().includes(q))
    );
  }, [fundSearchQuery]);

  // Filtered holdings inside current fund
  const displayedHoldings = useMemo(() => {
    let list = activeFund.holdings;
    if (holdingFilterQuery.trim()) {
      const q = holdingFilterQuery.toLowerCase();
      list = list.filter(
        (h) =>
          h.company.toLowerCase().includes(q) ||
          h.sector.toLowerCase().includes(q) ||
          h.marketCap.toLowerCase().includes(q)
      );
    }
    if (holdingViewMode === 'top10' && !holdingFilterQuery.trim()) {
      return list.slice(0, 10);
    }
    return list;
  }, [activeFund, holdingFilterQuery, holdingViewMode]);

  // Helper to toggle a fund in overlap analysis
  const toggleOverlapFund = (code: number) => {
    if (selectedOverlapCodes.includes(code)) {
      if (selectedOverlapCodes.length <= 1) return; // Keep at least 1
      setSelectedOverlapCodes(selectedOverlapCodes.filter((c) => c !== code));
    } else {
      if (selectedOverlapCodes.length >= 5) return; // Max 5 funds
      setSelectedOverlapCodes([...selectedOverlapCodes, code]);
    }
  };

  // Overlap calculation engine
  const overlapAnalysis = useMemo(() => {
    const funds = RICH_MF_DATABASE.filter((f) => selectedOverlapCodes.includes(f.schemeCode));
    if (funds.length < 2) {
      return {
        commonStocks: [],
        overlapPercentage: 0,
        totalUniqueHoldings: funds[0]?.holdings.length || 0,
        funds
      };
    }

    // Map all stocks across selected funds
    const stockMap: {
      [stockName: string]: {
        company: string;
        sector: string;
        fundsPresent: { fundName: string; weight: number }[];
        minWeight: number;
        avgWeight: number;
      };
    } = {};

    funds.forEach((fund) => {
      fund.holdings.forEach((holding) => {
        if (holding.marketCap === 'Cash & Debt' || holding.company.toLowerCase().includes('cash')) {
          return;
        }
        const cleanName = holding.company.trim();
        if (!stockMap[cleanName]) {
          stockMap[cleanName] = {
            company: cleanName,
            sector: holding.sector,
            fundsPresent: [],
            minWeight: 0,
            avgWeight: 0
          };
        }
        stockMap[cleanName].fundsPresent.push({
          fundName: fund.schemeName.split('-')[0],
          weight: holding.weight
        });
      });
    });

    const allStocks = Object.values(stockMap);
    // Common stocks present in 2 or more selected funds
    const commonStocks = allStocks
      .filter((s) => s.fundsPresent.length >= 2)
      .map((s) => {
        const weights = s.fundsPresent.map((f) => f.weight);
        const minW = Math.min(...weights);
        const avgW = weights.reduce((a, b) => a + b, 0) / funds.length;
        return {
          ...s,
          minWeight: minW,
          avgWeight: avgW
        };
      })
      .sort((a, b) => b.avgWeight - a.avgWeight);

    // Common weighted overlap formula
    let totalOverlapScore = 0;
    if (funds.length === 2) {
      commonStocks.forEach((stock) => {
        totalOverlapScore += stock.minWeight;
      });
    } else {
      const sumCommonAvg = commonStocks.reduce((acc, curr) => acc + curr.avgWeight, 0);
      totalOverlapScore = Math.min(100, Math.round(sumCommonAvg * 1.8));
    }

    const overlapPercentage = Math.min(95, Math.round(totalOverlapScore * 2.2));

    return {
      commonStocks,
      overlapPercentage,
      totalUniqueHoldings: allStocks.length,
      funds
    };
  }, [selectedOverlapCodes]);

  return (
    <div id="mf-holdings-and-overlap-container" className="w-full space-y-6">
      
      {/* Header & Mode Switcher */}
      <div className="bg-white border border-[#c2c6d1] rounded-2xl p-6 institutional-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-[#d3e4fe] text-[#003461] text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#006d42]" />
              Portfolio Deep-Dive & Overlap Engine
            </span>
            <span className="text-xs text-[#727781]">• Quantitative Analytics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#003461] tracking-tight">
            Mutual Fund Holdings, Sector Distribution & Overlap Visualizer
          </h2>
          <p className="text-xs text-[#424750] mt-0.5">
            Search any mutual fund, inspect 100% of underlying stock holdings & recent buys/sells, and analyze multi-fund overlap score.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-[#f7f9fb] p-1.5 rounded-xl border border-[#c2c6d1] self-start md:self-auto">
          <button
            onClick={() => setActiveTab('holdings')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'holdings'
                ? 'bg-[#003461] text-white shadow-xs'
                : 'text-[#424750] hover:text-[#191c1e] hover:bg-[#e0e3e5]'
            }`}
          >
            <PieChartIcon className="w-3.5 h-3.5" />
            <span>Holdings & Sectors</span>
          </button>

          <button
            onClick={() => setActiveTab('overlap')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overlap'
                ? 'bg-[#006d42] text-white shadow-xs'
                : 'text-[#424750] hover:text-[#191c1e] hover:bg-[#e0e3e5]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Multi-Fund Overlap ({selectedOverlapCodes.length})</span>
          </button>
        </div>
      </div>

      {/* GLOBAL SEARCH & SELECTION BAR */}
      <div className="bg-white border border-[#c2c6d1] rounded-2xl p-5 institutional-shadow space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-[#003461] uppercase tracking-wider block">
              Search & Select Mutual Fund:
            </span>
            <span className="text-xs text-[#727781]">
              Search by fund name, AMC (HDFC, SBI, Quant, Parag Parikh, UTI, Nippon, etc.), or category.
            </span>
          </div>

          {/* Live Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#727781] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search any fund (e.g. Parag Parikh, Small Cap)..."
              value={fundSearchQuery}
              onChange={(e) => {
                setFundSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full pl-9 pr-8 py-2 bg-[#f7f9fb] border border-[#c2c6d1] rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#003461] transition-all"
            />
            {fundSearchQuery && (
              <button
                onClick={() => setFundSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#727781] hover:text-[#191c1e]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Fund Selector Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {searchedFunds.map((fund) => {
            const isInspected = activeFundCode === fund.schemeCode;
            const isInOverlap = selectedOverlapCodes.includes(fund.schemeCode);

            return (
              <div key={fund.schemeCode} className="inline-flex items-center shrink-0">
                <button
                  onClick={() => {
                    setActiveFundCode(fund.schemeCode);
                    if (activeTab === 'overlap') {
                      toggleOverlapFund(fund.schemeCode);
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border ${
                    activeTab === 'holdings'
                      ? isInspected
                        ? 'bg-[#003461] text-white border-[#003461] shadow-xs'
                        : 'bg-[#f7f9fb] text-[#424750] border-[#c2c6d1] hover:bg-[#eceef0]'
                      : isInOverlap
                      ? 'bg-[#006d42] text-white border-[#006d42] shadow-xs'
                      : 'bg-[#f7f9fb] text-[#424750] border-[#c2c6d1] hover:bg-[#eceef0]'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      (activeTab === 'holdings' && isInspected) || (activeTab === 'overlap' && isInOverlap)
                        ? 'bg-[#96f6bd]'
                        : 'bg-[#c2c6d1]'
                    }`}
                  />
                  <span>{fund.schemeName.split('-')[0]}</span>
                  <span className="text-[10px] opacity-80 font-mono">({fund.category})</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* TAB 1: INDIVIDUAL FUND HOLDINGS & SECTORAL DISTRIBUTION */}
      {activeTab === 'holdings' && (
        <div className="space-y-6">
          
          {/* Active Fund Overview Banner */}
          <div className="bg-[#f7f9fb] border border-[#c2c6d1] rounded-2xl p-6 institutional-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e0e3e5]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#d3e4fe] text-[#003461] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                    {activeFund.category}
                  </span>
                  <span className="text-xs font-bold text-[#424750]">
                    {activeFund.fundHouse}
                  </span>
                  <span className="text-xs text-[#727781] font-mono">
                    Code: {activeFund.schemeCode}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#191c1e]">
                  {activeFund.schemeName}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white p-3 rounded-xl border border-[#c2c6d1] text-right">
                  <span className="text-[10px] text-[#727781] uppercase font-semibold block">NAV</span>
                  <span className="text-lg font-black text-[#003461]">₹{activeFund.nav.toFixed(2)}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#c2c6d1] text-right">
                  <span className="text-[10px] text-[#727781] uppercase font-semibold block">3Y CAGR</span>
                  <span className="text-lg font-black text-[#006d42]">+{activeFund.returns3Y}%</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#c2c6d1] text-right">
                  <span className="text-[10px] text-[#727781] uppercase font-semibold block">Turnover</span>
                  <span className="text-xs font-bold text-[#424750]">{activeFund.turnoverRatio}</span>
                </div>
              </div>
            </div>

            {/* Visual Charts & Intelligence Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-start">
              
              {/* Sectoral Distribution & Recent Activity Card (5 Cols) */}
              <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-[#c2c6d1] flex flex-col space-y-5">
                
                {/* 1. Sector Allocation Header & Chart */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-xs font-bold text-[#003461] uppercase tracking-wider flex items-center gap-1.5">
                      <PieChartIcon className="w-3.5 h-3.5 text-[#006d42]" />
                      Sectoral Allocation Breakdown
                    </h4>
                    <span className="text-[11px] text-[#727781] font-mono">100% Total</span>
                  </div>
                  <p className="text-[11px] text-[#424750] mb-3">
                    Macro sector concentration and industrial allocation.
                  </p>

                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={activeFund.sectors}
                          dataKey="weight"
                          nameKey="sector"
                          cx="50%"
                          cy="50%"
                          innerRadius={42}
                          outerRadius={74}
                          paddingAngle={3}
                        >
                          {activeFund.sectors.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={SECTOR_COLORS[index % SECTOR_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => [`${value}%`, 'Allocation']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Sector Legend Grid */}
                  <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-[#eceef0]">
                    {activeFund.sectors.map((s, idx) => (
                      <div key={s.sector} className="flex items-center justify-between text-xs bg-[#f7f9fb] p-1.5 rounded-md">
                        <div className="flex items-center gap-1.5 truncate">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: SECTOR_COLORS[idx % SECTOR_COLORS.length] }}
                          />
                          <span className="text-[#191c1e] text-[11px] font-medium truncate">{s.sector}</span>
                        </div>
                        <span className="font-bold font-mono text-[#003461] text-[11px] ml-1">{s.weight}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Market Cap Classification Distribution */}
                <div className="pt-3 border-t border-[#eceef0]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-[#003461] uppercase tracking-wider flex items-center gap-1">
                      <BarChart2 className="w-3.5 h-3.5 text-[#006d42]" />
                      Market Cap Distribution
                    </span>
                  </div>

                  {/* Segmented Bar */}
                  <div className="w-full h-3 bg-[#e0e3e5] rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${activeFund.marketCapSplit.largeCap}%` }}
                      className="bg-[#003461] h-full"
                      title={`Large Cap: ${activeFund.marketCapSplit.largeCap}%`}
                    />
                    <div
                      style={{ width: `${activeFund.marketCapSplit.midCap}%` }}
                      className="bg-[#006d42] h-full"
                      title={`Mid Cap: ${activeFund.marketCapSplit.midCap}%`}
                    />
                    <div
                      style={{ width: `${activeFund.marketCapSplit.smallCap}%` }}
                      className="bg-[#b45309] h-full"
                      title={`Small Cap: ${activeFund.marketCapSplit.smallCap}%`}
                    />
                    <div
                      style={{ width: `${activeFund.marketCapSplit.cashDebt}%` }}
                      className="bg-[#727781] h-full"
                      title={`Cash/Debt: ${activeFund.marketCapSplit.cashDebt}%`}
                    />
                  </div>

                  {/* Market Cap Legend */}
                  <div className="grid grid-cols-4 gap-1 text-center pt-2 text-[10px]">
                    <div className="bg-[#f7f9fb] p-1 rounded">
                      <span className="text-[#727781] block">Large</span>
                      <span className="font-bold text-[#003461]">{activeFund.marketCapSplit.largeCap}%</span>
                    </div>
                    <div className="bg-[#f7f9fb] p-1 rounded">
                      <span className="text-[#727781] block">Mid</span>
                      <span className="font-bold text-[#006d42]">{activeFund.marketCapSplit.midCap}%</span>
                    </div>
                    <div className="bg-[#f7f9fb] p-1 rounded">
                      <span className="text-[#727781] block">Small</span>
                      <span className="font-bold text-[#b45309]">{activeFund.marketCapSplit.smallCap}%</span>
                    </div>
                    <div className="bg-[#f7f9fb] p-1 rounded">
                      <span className="text-[#727781] block">Cash</span>
                      <span className="font-bold text-[#424750]">{activeFund.marketCapSplit.cashDebt}%</span>
                    </div>
                  </div>
                </div>

                {/* 3. Recently Bought & Sold Stocks / Portfolio Changes */}
                <div className="pt-3 border-t border-[#eceef0] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#003461] uppercase tracking-wider flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-[#006d42]" />
                      Recent Buys, Sells & Adjustments
                    </span>
                    <span className="text-[10px] text-[#727781] bg-[#eceef0] px-1.5 py-0.5 rounded">
                      Monthly Disclosure
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {activeFund.recentActivity.map((act, i) => (
                      <div
                        key={i}
                        className="p-2 bg-[#f7f9fb] hover:bg-[#eceef0] rounded-lg border border-[#e0e3e5] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {act.action === 'Fresh Buy' || act.action === 'Increased Stake' ? (
                            <span className="w-5 h-5 rounded-full bg-[#96f6bd] text-[#003461] flex items-center justify-center shrink-0">
                              <ArrowUpRight className="w-3 h-3 text-[#006d42]" />
                            </span>
                          ) : (
                            <span className="w-5 h-5 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0">
                              <ArrowDownRight className="w-3 h-3 text-[#ba1a1a]" />
                            </span>
                          )}
                          <div className="min-w-0">
                            <span className="font-bold text-[#191c1e] truncate block text-[11px]">
                              {act.company}
                            </span>
                            <span className="text-[9px] text-[#727781]">{act.sector}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              act.action === 'Fresh Buy'
                                ? 'bg-[#96f6bd]/40 text-[#006d42]'
                                : act.action === 'Increased Stake'
                                ? 'bg-[#d3e4fe] text-[#003461]'
                                : 'bg-[#ffdad6]/60 text-[#ba1a1a]'
                            }`}
                          >
                            {act.action}
                          </span>
                          <span className="text-[10px] text-[#424750] block font-mono mt-0.5">
                            {act.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Complete Stock Holdings (Ranked List with View Toggle & Search) (7 Cols) */}
              <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-[#c2c6d1] flex flex-col space-y-4">
                
                {/* Header & Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#eceef0]">
                  <div>
                    <h4 className="text-xs font-bold text-[#003461] uppercase tracking-wider flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-[#006d42]" />
                      Underlying Portfolio Holdings
                    </h4>
                    <span className="text-[11px] text-[#006d42] font-semibold">
                      Total {activeFund.holdings.length} Active Positions • Top 5: {activeFund.holdings.slice(0, 5).reduce((a, b) => a + b.weight, 0).toFixed(1)}% Weight
                    </span>
                  </div>

                  {/* View Mode Toggle: Top 10 vs All Holdings */}
                  <div className="flex items-center gap-1 bg-[#f7f9fb] p-1 rounded-lg border border-[#c2c6d1] self-start sm:self-auto">
                    <button
                      onClick={() => {
                        setHoldingViewMode('top10');
                        setHoldingFilterQuery('');
                      }}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                        holdingViewMode === 'top10' && !holdingFilterQuery
                          ? 'bg-[#003461] text-white shadow-2xs'
                          : 'text-[#424750] hover:text-[#191c1e]'
                      }`}
                    >
                      Top 10
                    </button>
                    <button
                      onClick={() => setHoldingViewMode('all')}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                        holdingViewMode === 'all' || holdingFilterQuery
                          ? 'bg-[#006d42] text-white shadow-2xs'
                          : 'text-[#424750] hover:text-[#191c1e]'
                      }`}
                    >
                      All Holdings ({activeFund.holdings.length})
                    </button>
                  </div>
                </div>

                {/* In-Portfolio Search Filter Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#727781] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={`Filter among ${activeFund.holdings.length} stocks (e.g. HDFC, Infosys, Chemical, Mid Cap)...`}
                    value={holdingFilterQuery}
                    onChange={(e) => setHoldingFilterQuery(e.target.value)}
                    className="w-full pl-8 pr-7 py-1.5 bg-[#f7f9fb] border border-[#c2c6d1] rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#003461]"
                  />
                  {holdingFilterQuery && (
                    <button
                      onClick={() => setHoldingFilterQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#727781] hover:text-[#191c1e]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Scrollable Holdings List */}
                <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
                  {displayedHoldings.length === 0 ? (
                    <div className="p-8 text-center text-xs text-[#727781]">
                      No stocks matching &quot;{holdingFilterQuery}&quot; found in this fund.
                    </div>
                  ) : (
                    displayedHoldings.map((h, rank) => {
                      const actualRank = activeFund.holdings.findIndex((x) => x.company === h.company) + 1;
                      return (
                        <div
                          key={h.company}
                          className="p-2.5 bg-[#f7f9fb] hover:bg-[#eceef0] rounded-lg transition-colors border border-[#e0e3e5] space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-[#003461] text-white flex items-center justify-center font-bold text-[10px]">
                                {actualRank > 0 ? actualRank : rank + 1}
                              </span>
                              <span className="font-bold text-[#191c1e]">{h.company}</span>
                              <span className="text-[10px] text-[#727781] bg-white border border-[#c2c6d1] px-1.5 py-0.5 rounded">
                                {h.sector}
                              </span>
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                  h.marketCap === 'Large Cap'
                                    ? 'bg-[#d3e4fe] text-[#003461]'
                                    : h.marketCap === 'Mid Cap'
                                    ? 'bg-[#96f6bd]/40 text-[#006d42]'
                                    : h.marketCap === 'Small Cap'
                                    ? 'bg-[#ffdad6]/60 text-[#b45309]'
                                    : 'bg-[#eceef0] text-[#727781]'
                                }`}
                              >
                                {h.marketCap}
                              </span>
                            </div>
                            <span className="font-bold font-mono text-[#003461] text-xs">
                              {h.weight}%
                            </span>
                          </div>

                          {/* Bar progress */}
                          <div className="w-full bg-[#e0e3e5] h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#003461] h-full rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(100, (h.weight / 14) * 100)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Bottom Allocation Action */}
                <div className="pt-3 border-t border-[#eceef0] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-[#727781]">
                    Interested in allocating to <strong>{activeFund.schemeName.split('-')[0]}</strong>?
                  </span>
                  <button
                    onClick={() => {
                      if (onSelectForProposal) onSelectForProposal(activeFund.schemeName);
                      if (onNavigate) onNavigate('open-account');
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-[#006d42] hover:bg-[#005231] text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Request Portfolio Allocation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      )}

      {/* TAB 2: MULTI-FUND OVERLAP VISUALIZER */}
      {activeTab === 'overlap' && (
        <div className="space-y-6">
          
          {/* Overlap Selection & Search Dashboard */}
          <div className="bg-white border border-[#c2c6d1] rounded-2xl p-6 institutional-shadow space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#e0e3e5]">
              <div>
                <h3 className="text-sm font-bold text-[#003461] uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#006d42]" />
                  Select 2 to 5 Mutual Funds for Portfolio Overlap Analysis
                </h3>
                <p className="text-xs text-[#727781] mt-0.5">
                  Search and add any mutual fund from our master universe to compute common stock overlaps and redundancy risks.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-bold text-[#006d42] bg-[#96f6bd]/40 px-3 py-1 rounded-full">
                  {selectedOverlapCodes.length} of 5 Selected
                </span>
                {selectedOverlapCodes.length > 2 && (
                  <button
                    onClick={() => setSelectedOverlapCodes([RICH_MF_DATABASE[0].schemeCode, RICH_MF_DATABASE[1].schemeCode])}
                    className="text-[11px] text-[#ba1a1a] hover:underline font-semibold cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Currently Selected Comparison Basket Tags */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#727781] uppercase tracking-wider block">
                Active Comparison Basket:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedOverlapCodes.map((code) => {
                  const fund = RICH_MF_DATABASE.find((f) => f.schemeCode === code);
                  if (!fund) return null;
                  return (
                    <div
                      key={code}
                      className="inline-flex items-center gap-2 bg-[#003461] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#96f6bd]" />
                      <span>{fund.schemeName.split('-')[0]}</span>
                      <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
                        {fund.category}
                      </span>
                      <button
                        onClick={() => toggleOverlapFund(code)}
                        className="hover:bg-white/20 p-0.5 rounded-full transition-colors cursor-pointer text-[#ffdad6]"
                        title="Remove from comparison"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Manual In-Place Fund Search Input for Overlap */}
            <div className="pt-2">
              <div className="relative">
                <Search className="w-4 h-4 text-[#727781] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search and add fund by name, category, or AMC (e.g. Parag Parikh, HDFC, Quant, Index, Mid Cap)..."
                  value={fundSearchQuery}
                  onChange={(e) => setFundSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 bg-[#f7f9fb] border border-[#c2c6d1] rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#003461]"
                />
                {fundSearchQuery && (
                  <button
                    onClick={() => setFundSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#727781] hover:text-[#191c1e]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Available Fund Selector Grid */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-[#727781] uppercase tracking-wider block">
                {fundSearchQuery ? `Search Results (${searchedFunds.length} Funds):` : 'Available Mutual Funds Universe (Click to Add / Remove):'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {searchedFunds.map((fund) => {
                  const isSelected = selectedOverlapCodes.includes(fund.schemeCode);
                  return (
                    <button
                      key={fund.schemeCode}
                      onClick={() => toggleOverlapFund(fund.schemeCode)}
                      className={`p-2.5 rounded-xl text-xs text-left font-bold transition-all cursor-pointer flex items-center justify-between border ${
                        isSelected
                          ? 'bg-[#96f6bd]/20 text-[#003461] border-[#006d42] shadow-2xs'
                          : 'bg-[#f7f9fb] text-[#191c1e] border-[#c2c6d1] hover:bg-[#eceef0]'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <span className="truncate block text-xs font-bold text-[#191c1e]">
                          {fund.schemeName.split('-')[0]}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-[#727781]">
                          <span className="font-semibold">{fund.fundHouse}</span>
                          <span>•</span>
                          <span className="bg-[#e0e3e5] text-[#424750] px-1 rounded font-mono">{fund.category}</span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isSelected ? (
                          <span className="inline-flex items-center gap-1 bg-[#006d42] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                            <CheckCircle2 className="w-3 h-3 text-[#96f6bd]" />
                            Added
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 bg-[#d3e4fe] text-[#003461] text-[10px] px-2 py-0.5 rounded-full font-bold hover:bg-[#003461] hover:text-white transition-colors">
                            <Plus className="w-3 h-3" />
                            Select
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Overlap Summary Card */}
          <div className="bg-[#f7f9fb] border border-[#c2c6d1] rounded-2xl p-6 institutional-shadow space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Overlap Meter */}
              <div className="bg-white p-5 rounded-xl border border-[#c2c6d1] flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#727781] uppercase tracking-wider block">
                    Portfolio Overlap Score
                  </span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className={`text-4xl font-black ${
                      overlapAnalysis.overlapPercentage > 45 ? 'text-[#b45309]' : 'text-[#006d42]'
                    }`}>
                      {overlapAnalysis.overlapPercentage}%
                    </span>
                    <span className="text-xs font-semibold text-[#424750]">
                      {overlapAnalysis.overlapPercentage < 30
                        ? 'Low Overlap (Well Diversified)'
                        : overlapAnalysis.overlapPercentage < 50
                        ? 'Moderate Overlap'
                        : 'High Overlap (Redundant)'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#eceef0] text-[11px] text-[#424750]">
                  {overlapAnalysis.overlapPercentage < 35 ? (
                    <span className="text-[#006d42] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Excellent asset mix. Very minimal duplication in underlying stock picks.
                    </span>
                  ) : (
                    <span className="text-[#b45309] font-semibold">
                      Notice: These funds share several large-cap companies. Consider trimming duplication.
                    </span>
                  )}
                </div>
              </div>

              {/* Shared Stocks Count */}
              <div className="bg-white p-5 rounded-xl border border-[#c2c6d1] flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#727781] uppercase tracking-wider block">
                    Common Stock Holdings
                  </span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-black text-[#003461]">
                      {overlapAnalysis.commonStocks.length}
                    </span>
                    <span className="text-xs font-semibold text-[#424750]">
                      overlapping equities across {selectedOverlapCodes.length} funds
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#eceef0] text-[11px] text-[#727781]">
                  Total unique corporate positions across selected basket: <strong>{overlapAnalysis.totalUniqueHoldings}</strong>
                </div>
              </div>

              {/* Action Advisory Box */}
              <div className="bg-gradient-to-br from-[#003461] to-[#002647] text-white p-5 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#96f6bd] uppercase tracking-wider block">
                    Advisory Overlap Review
                  </span>
                  <p className="text-xs text-[#eff1f3] mt-2 leading-relaxed">
                    Need help rebalancing your mutual fund portfolio to eliminate redundant expense ratios and optimize alpha?
                  </p>
                </div>

                <button
                  onClick={() => onNavigate?.('open-account')}
                  className="mt-3 w-full bg-[#96f6bd] hover:bg-[#72e8a5] text-[#003461] font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Get Rebalancing Proposal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Common Stock Holdings Table */}
            <div className="bg-white rounded-xl border border-[#c2c6d1] overflow-hidden">
              <div className="p-4 bg-[#f7f9fb] border-b border-[#c2c6d1] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#003461] uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#006d42]" />
                    Overlapping Equities Breakdown
                  </h4>
                  <p className="text-[11px] text-[#727781]">
                    Constituents held concurrently by 2 or more of your chosen mutual funds.
                  </p>
                </div>
              </div>

              {overlapAnalysis.commonStocks.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#727781]">
                  No duplicate stock holdings detected between the selected funds. Perfect zero-overlap diversification!
                </div>
              ) : (
                <div className="overflow-x-auto max-h-[500px]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#c2c6d1] bg-[#f7f9fb] text-[#424750] sticky top-0">
                        <th className="py-3 px-4 font-bold uppercase tracking-wider">Company Name</th>
                        <th className="py-3 px-4 font-bold uppercase tracking-wider">Sector</th>
                        <th className="py-3 px-4 font-bold uppercase tracking-wider">Holding Funds</th>
                        <th className="py-3 px-4 font-bold uppercase tracking-wider text-right">Individual Weights</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e0e3e5]">
                      {overlapAnalysis.commonStocks.map((stock) => (
                        <tr key={stock.company} className="hover:bg-[#f7f9fb] transition-colors">
                          <td className="py-3 px-4 font-bold text-[#191c1e]">
                            {stock.company}
                          </td>
                          <td className="py-3 px-4">
                            <span className="bg-[#eceef0] text-[#424750] px-2 py-0.5 rounded text-[10px] font-medium">
                              {stock.sector}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {stock.fundsPresent.map((f) => (
                                <span
                                  key={f.fundName}
                                  className="bg-[#d3e4fe] text-[#003461] text-[10px] font-semibold px-2 py-0.5 rounded"
                                >
                                  {f.fundName}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2 font-mono text-xs">
                              {stock.fundsPresent.map((f) => (
                                <span key={f.fundName} className="text-[#003461] font-bold">
                                  {f.weight}%
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
