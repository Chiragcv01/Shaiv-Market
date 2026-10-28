import { ActiveScreen } from '../types';
import { POSTS } from '../content/blog';
import { unsplash } from '../utils/unsplash';
import { RESOURCES } from '../content/resources';

export const SITE_URL = 'https://shaivmarket.com';

export interface RouteMeta {
  path: string;
  screen: ActiveScreen;
  tab?: string;           // calculator tab id for /calculators/*
  slug?: string;          // blog post or resource slug
  title: string;
  description: string;
  name: string;           // breadcrumb name
  index: boolean;         // include in sitemap + allow indexing
  priority?: number;
  changefreq?: 'weekly' | 'monthly';
  image?: string;         // share image (og:image), 1200x630
}

export type CalcGroup = 'Grow your money' | 'Plan a goal' | 'Retirement' | 'Tax, loans and safe savings';

export interface CalcRoute {
  tab: string;
  slug: string;
  name: string;      // H1 and breadcrumb
  short: string;     // tab label
  blurb: string;     // one line for cards
  group: CalcGroup;
  title: string;
  description: string;
}

// Order here is the order of the calculator tabs.
export const CALC_ROUTES: CalcRoute[] = [
  {
    tab: 'required-sip', slug: 'required-sip-calculator', name: 'Target SIP calculator', short: 'Target SIP', group: 'Plan a goal',
    blurb: 'How much SIP do I need for ₹1 crore, or any amount?',
    title: 'Target SIP Calculator: How Much SIP for ₹1 Crore or Any Goal | Shaiv Market',
    description: 'Enter a target amount and years, get the exact monthly SIP you need, with or without a yearly step-up. Year-by-year schedule included. Free, no sign-up.'
  },
  {
    tab: 'sip-compounder', slug: 'sip-calculator', name: 'SIP calculator', short: 'SIP', group: 'Grow your money',
    blurb: 'What will my monthly SIP grow to?',
    title: 'SIP Calculator: Mutual Fund SIP Returns, Year by Year | Shaiv Market',
    description: 'Calculate what your monthly SIP could grow to, with invested amount, gains and a year-by-year chart. Switch to step-up, lumpsum or SIP plus lumpsum.'
  },
  {
    tab: 'step-up-sip', slug: 'step-up-sip-calculator', name: 'Step-up SIP calculator', short: 'Step-up SIP', group: 'Grow your money',
    blurb: 'Raise your SIP every year. See how much more you end up with.',
    title: 'Step-Up SIP Calculator: Returns with a Yearly SIP Increase | Shaiv Market',
    description: 'See what a SIP that rises 5%, 10% or 15% every year grows to, compared with a flat SIP. Year-by-year SIP amount and value. Free top-up SIP calculator.'
  },
  {
    tab: 'lumpsum', slug: 'lumpsum-calculator', name: 'Lumpsum calculator', short: 'Lumpsum', group: 'Grow your money',
    blurb: 'What will a one-time investment be worth?',
    title: 'Lumpsum Calculator: One-Time Mutual Fund Investment Returns | Shaiv Market',
    description: 'Find the future value of a one-time investment, how long it takes to double, and what it is worth in today\'s money after inflation. Free lumpsum calculator.'
  },
  {
    tab: 'goal', slug: 'goal-planner', name: 'Goal planner', short: 'Goal planner', group: 'Plan a goal',
    blurb: 'Child education, a home, a car: the SIP each goal needs.',
    title: 'Goal Planner: SIP for Child Education, Home and Any Life Goal | Shaiv Market',
    description: "Plan your child's education, a home down payment or any goal. Adjust for inflation, count what you have saved, and get the monthly SIP each goal needs."
  },
  {
    tab: 'retirement', slug: 'retirement-calculator', name: 'Retirement calculator', short: 'Retirement', group: 'Retirement',
    blurb: 'How big a corpus, and how much SIP, to retire comfortably?',
    title: 'Retirement Calculator India: Corpus and Monthly SIP Needed | Shaiv Market',
    description: 'Work out the retirement corpus you need, adjusted for inflation and life expectancy, and the monthly SIP to build it. See your money from today to age 85 and beyond.'
  },
  {
    tab: 'swp', slug: 'swp-calculator', name: 'SWP calculator', short: 'SWP', group: 'Retirement',
    blurb: 'A monthly pension from your mutual funds. How long will it last?',
    title: 'SWP Calculator: Monthly Pension from Mutual Funds | Shaiv Market',
    description: 'Calculate a monthly income from a systematic withdrawal plan, with an optional yearly increase, and see how long your corpus lasts. Free SWP calculator.'
  },
  {
    tab: 'fire', slug: 'fire-calculator', name: 'FIRE calculator', short: 'FIRE', group: 'Retirement',
    blurb: 'Financial independence, retire early: your number and timeline.',
    title: 'FIRE Calculator India: Corpus to Retire Early and SIP Needed | Shaiv Market',
    description: 'Find the corpus for financial independence and early retirement in India, based on your expenses, inflation and withdrawal rate, and the monthly SIP to get there.'
  },
  {
    tab: 'sip-delay', slug: 'sip-delay-cost-calculator', name: 'Cost of delay calculator', short: 'Cost of delay', group: 'Grow your money',
    blurb: 'What waiting 1, 3 or 5 years to start a SIP really costs.',
    title: 'SIP Delay Cost Calculator: What Waiting to Invest Costs You | Shaiv Market',
    description: 'See how much smaller your corpus gets if you start your SIP 1, 3, 5 or 10 years late, and the bigger SIP you would need to catch up. Free cost of delay calculator.'
  },
  {
    tab: 'inflation', slug: 'inflation-calculator', name: 'Inflation calculator', short: 'Inflation', group: 'Plan a goal',
    blurb: 'What will it cost later? What will my money be worth?',
    title: 'Inflation Calculator India: Future Cost and Value of Money | Shaiv Market',
    description: 'Calculate the future cost of anything at your chosen inflation rate, or what a sum of money will really be worth in 10, 20 or 30 years. Free inflation calculator.'
  },
  {
    tab: 'cagr', slug: 'cagr-calculator', name: 'CAGR calculator', short: 'CAGR', group: 'Grow your money',
    blurb: 'The true yearly growth rate between two values.',
    title: 'CAGR Calculator: Compound Annual Growth Rate of an Investment | Shaiv Market',
    description: 'Calculate the CAGR of a mutual fund, stock, property or business from start value, end value and years. Also shows absolute return and doubling time.'
  },
  {
    tab: 'ppf', slug: 'ppf-calculator', name: 'PPF calculator', short: 'PPF', group: 'Tax, loans and safe savings',
    blurb: 'PPF maturity at 7.1% for 15, 20, 25 or 30 years.',
    title: 'PPF Calculator 2026: Maturity Value at 7.1% Interest | Shaiv Market',
    description: 'Calculate your PPF maturity amount and interest at the current 7.1% rate, for 15 years or with 5-year extensions. Year-by-year PPF schedule included.'
  },
  {
    tab: 'mf-tax', slug: 'mutual-fund-tax-calculator', name: 'Mutual fund tax calculator', short: 'MF tax', group: 'Tax, loans and safe savings',
    blurb: 'LTCG or STCG? Tax on your mutual fund redemption.',
    title: 'Mutual Fund Tax Calculator: LTCG and STCG for FY 2026-27 | Shaiv Market',
    description: 'Estimate the capital gains tax on selling equity or debt mutual funds: 12.5% LTCG above ₹1.25 lakh, 20% STCG, or your slab rate, with cess. Free calculator.'
  },
  {
    tab: 'loan-sip', slug: 'home-loan-prepayment-vs-sip', name: 'Home loan prepayment vs SIP calculator', short: 'Home loan vs SIP', group: 'Tax, loans and safe savings',
    blurb: 'Prepay the loan or invest the surplus? A fair comparison.',
    title: 'Home Loan Prepayment vs SIP Calculator: Which Leaves You Richer? | Shaiv Market',
    description: 'Should you prepay your home loan or invest in a SIP? A fair, same-money comparison of interest saved and wealth built, for your own loan and rate.'
  },
  {
    tab: 'emergency', slug: 'emergency-fund-calculator', name: 'Emergency fund calculator', short: 'Emergency fund', group: 'Plan a goal',
    blurb: 'How big a safety buffer, and where to keep it.',
    title: 'Emergency Fund Calculator: How Much Should You Keep? | Shaiv Market',
    description: 'Calculate how many months of expenses to keep as an emergency fund, your shortfall, and how to split it across savings, overnight and liquid funds.'
  }
];

export const CALC_GROUPS: CalcGroup[] = ['Grow your money', 'Plan a goal', 'Retirement', 'Tax, loans and safe savings'];

export const ROUTES: RouteMeta[] = [
  {
    path: '/', screen: 'home', name: 'Home', index: true, priority: 1, changefreq: 'weekly',
    title: 'Shaiv Market | Mutual Fund Distributor in Jaipur, Chirag Sharma (ARN-337289)',
    description: 'Plan SIPs and life goals with Chirag Sharma, AMFI registered mutual fund distributor in Jaipur (ARN-337289). Free portfolio review, SIP and goal calculators.'
  },
  {
    path: '/calculators', screen: 'calculators', name: 'Calculators', index: true, priority: 0.9, changefreq: 'monthly',
    title: 'Free Mutual Fund Calculators: SIP, SWP, PPF, Retirement, Tax | Shaiv Market',
    description: `${CALC_ROUTES.length} free calculators in one place: SIP, step-up SIP, target SIP, lumpsum, retirement, SWP, FIRE, PPF, mutual fund tax, CAGR, inflation and more.`
  },
  ...CALC_ROUTES.map((c) => ({
    path: `/calculators/${c.slug}`, screen: 'calculators' as ActiveScreen, tab: c.tab, name: c.name, index: true,
    priority: 0.8, changefreq: 'monthly' as const, title: c.title, description: c.description
  })),
  {
    path: '/goal-planner', screen: 'insights', name: 'Goal planner', index: true, priority: 0.8, changefreq: 'monthly',
    title: 'Goal-Based Investment Planner and Guides | Shaiv Market',
    description: 'Plan every life goal with the exact monthly SIP it needs, and read plain-language guides on SIPs, tax on mutual funds and more.'
  },
  {
    path: '/about', screen: 'about', name: 'About Chirag Sharma', index: true, priority: 0.8, changefreq: 'monthly',
    title: 'About Chirag Sharma, AMFI Registered MFD in Jaipur (ARN-337289) | Shaiv Market',
    description: 'Chirag Sharma is an AMFI registered mutual fund distributor (ARN-337289, EUIN E641362) and NISM Series V-A certified, based in Jaipur. See credentials and how he works.'
  },
  {
    path: '/book-free-consultation', screen: 'booking', name: 'Book a free consultation', index: true, priority: 0.9, changefreq: 'monthly',
    title: 'Book a Free Mutual Fund Consultation in Jaipur or Online | Shaiv Market',
    description: 'Book a free 30-minute call with Chirag Sharma to review your portfolio and plan your SIPs. Video, phone or WhatsApp. No charges.'
  },
  {
    path: '/contact', screen: 'contact', name: 'Contact', index: true, priority: 0.7, changefreq: 'monthly',
    title: 'Contact Shaiv Market, Jaipur | Phone, WhatsApp and Office',
    description: 'Call or WhatsApp +91 99506 53247, email, or visit the Jaipur office at Bhamashah Techno Hub, Jhalana Doongari. Talk directly to Chirag Sharma.'
  },
  {
    path: '/start-sip', screen: 'open-account', name: 'Start a SIP', index: true, priority: 0.8, changefreq: 'monthly',
    title: 'Start a SIP: Get a Free Investment Plan | Shaiv Market',
    description: 'Share your goal and budget and get a free mutual fund plan from an AMFI registered distributor. Paperless KYC, first SIP usually within a day.'
  },
  {
    path: '/blog', screen: 'blog', name: 'Blog', index: true, priority: 0.8, changefreq: 'weekly',
    title: 'Mutual Fund Blog: SIP, Tax and Goal Guides from Jaipur | Shaiv Market',
    description: 'Plain-language guides on SIPs, ELSS, SWP, KYC and choosing a mutual fund distributor in Jaipur, written by Chirag Sharma (AMFI ARN-337289).'
  },
  ...POSTS.map((p) => ({
    path: `/blog/${p.slug}`, screen: 'blog' as ActiveScreen, slug: p.slug, name: p.title, index: true,
    priority: 0.7, changefreq: 'monthly' as const, title: `${p.title} | Shaiv Market`, description: p.description,
    image: p.image ? unsplash(p.image.id, 1200, 630, 'jpg') : undefined
  })),
  ...RESOURCES.map((r) => ({
    path: `/${r.slug}`, screen: 'resource' as ActiveScreen, slug: r.slug, name: r.h1, index: true,
    priority: 0.8, changefreq: 'monthly' as const, title: `${r.title} | Shaiv Market`, description: r.description
  })),
  { path: '/reviews', screen: 'testimonials', name: 'Reviews', index: false, title: 'Client Reviews | Shaiv Market', description: 'Client reviews of Shaiv Market.' },
  { path: '/login', screen: 'auth', name: 'Login', index: false, title: 'Login | Shaiv Market', description: 'Login.' },
  { path: '/sm-admin', screen: 'admin', name: 'Admin', index: false, title: 'Admin | Shaiv Market', description: 'Admin.' },
  { path: '/404', screen: 'not-found', name: 'Page not found', index: false, title: 'Page not found | Shaiv Market', description: 'This page has moved. Find calculators, the goal planner and contact details for Shaiv Market.' }
];

const norm = (p: string) => (p.replace(/\/+$/, '') || '/').toLowerCase();

export function routeForPath(pathname: string): RouteMeta {
  return ROUTES.find((r) => r.path === norm(pathname)) || ROUTES.find((r) => r.screen === 'not-found')!;
}

export function pathForScreen(screen: ActiveScreen, tab?: string): string {
  if (screen === 'calculators' && tab) {
    const c = CALC_ROUTES.find((x) => x.tab === tab);
    if (c) return `/calculators/${c.slug}`;
  }
  return ROUTES.find((r) => r.screen === screen && !r.tab)?.path || '/';
}

export function routeFor(screen: ActiveScreen, tab?: string): RouteMeta {
  return routeForPath(pathForScreen(screen, tab));
}
