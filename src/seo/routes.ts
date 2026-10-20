import { ActiveScreen } from '../types';

export const SITE_URL = 'https://shaivmarket.com';

export interface RouteMeta {
  path: string;
  screen: ActiveScreen;
  tab?: string;           // calculator tab id for /calculators/*
  title: string;
  description: string;
  name: string;           // breadcrumb name
  index: boolean;         // include in sitemap + allow indexing
  priority?: number;
  changefreq?: 'weekly' | 'monthly';
}

export const CALC_ROUTES: { tab: string; slug: string; name: string; title: string; description: string }[] = [
  {
    tab: 'required-sip', slug: 'required-sip-calculator', name: 'Required SIP calculator',
    title: 'Required SIP Calculator: How Much SIP for ₹1 Crore? | Shaiv Market',
    description: 'Find the exact monthly SIP you need to reach ₹50 lakh, ₹1 crore or any target, with inflation and step-up. Free calculator by an AMFI registered MFD in Jaipur.'
  },
  {
    tab: 'sip-compounder', slug: 'sip-calculator', name: 'SIP calculator',
    title: 'SIP Calculator with Step-Up and Lumpsum | Shaiv Market',
    description: 'See what your monthly SIP or lumpsum could grow to, year by year, with an annual step-up option. Free mutual fund SIP calculator for Indian investors.'
  },
  {
    tab: 'goal', slug: 'goal-planner', name: 'Life goal planner',
    title: 'Goal Planner: SIP for Child Education, Home and Retirement | Shaiv Market',
    description: "Plan your child's education, a home down payment or retirement. Adjust for inflation and get the monthly SIP each goal needs."
  },
  {
    tab: 'swp', slug: 'swp-calculator', name: 'SWP calculator',
    title: 'SWP Calculator: Monthly Pension from Mutual Funds | Shaiv Market',
    description: 'Calculate a monthly income from a systematic withdrawal plan and see how long your corpus lasts. Free SWP calculator for retirees in India.'
  },
  {
    tab: 'loan-sip', slug: 'home-loan-prepayment-vs-sip', name: 'Home loan prepayment vs SIP',
    title: 'Home Loan Prepayment vs SIP Calculator | Shaiv Market',
    description: 'Should you prepay your home loan or invest the money in a SIP? Compare interest saved against likely SIP growth for your own loan.'
  },
  {
    tab: 'fire', slug: 'fire-calculator', name: 'FIRE calculator',
    title: 'FIRE Calculator India: Retire Early Corpus and SIP | Shaiv Market',
    description: 'Work out the corpus you need for financial independence and early retirement in India, and the monthly SIP that gets you there.'
  },
  {
    tab: 'emergency', slug: 'emergency-fund-calculator', name: 'Emergency fund calculator',
    title: 'Emergency Fund Calculator: How Much Should You Keep? | Shaiv Market',
    description: 'Calculate how many months of expenses to keep as an emergency fund and where to park it, based on your income and family.'
  }
];

export const ROUTES: RouteMeta[] = [
  {
    path: '/', screen: 'home', name: 'Home', index: true, priority: 1, changefreq: 'weekly',
    title: 'Shaiv Market | Mutual Fund Distributor in Jaipur, Chirag Sharma (ARN-337289)',
    description: 'Plan SIPs and life goals with Chirag Sharma, AMFI registered mutual fund distributor in Jaipur (ARN-337289). Free portfolio review, SIP and goal calculators.'
  },
  {
    path: '/calculators', screen: 'calculators', name: 'Calculators', index: true, priority: 0.9, changefreq: 'monthly',
    title: 'SIP, SWP, FIRE and Goal Calculators | Shaiv Market',
    description: 'Seven free mutual fund calculators: required SIP, SIP growth with step-up, goal planner, SWP pension, home loan vs SIP, FIRE and emergency fund.'
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
  { path: '/reviews', screen: 'testimonials', name: 'Reviews', index: false, title: 'Client Reviews | Shaiv Market', description: 'Client reviews of Shaiv Market.' },
  { path: '/login', screen: 'auth', name: 'Login', index: false, title: 'Login | Shaiv Market', description: 'Login.' },
  { path: '/sm-admin', screen: 'admin', name: 'Admin', index: false, title: 'Admin | Shaiv Market', description: 'Admin.' }
];

const norm = (p: string) => (p.replace(/\/+$/, '') || '/').toLowerCase();

export function routeForPath(pathname: string): RouteMeta {
  return ROUTES.find((r) => r.path === norm(pathname)) || ROUTES[0];
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
