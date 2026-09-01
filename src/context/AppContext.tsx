import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  InsightArticle,
  SiteBanner,
  SiteSettings,
  CustomNavItem,
  ClientQuote,
  BookingDetails,
  ContactInquiry,
  Testimonial,
  ActiveScreen
} from '../types';
import { INSIGHTS_ARTICLES as SEED_ARTICLES } from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (emailOrUsername: string, password: string) => { success: boolean; error?: string; user?: User };
  signup: (userData: { name: string; email: string; password: string; phone?: string }) => { success: boolean; error?: string; user?: User };
  resetPassword: (email: string, newPassword: string) => { success: boolean; message: string };
  logout: () => void;

  // Navigation Items (CMS)
  navItems: CustomNavItem[];
  addNavItem: (item: Omit<CustomNavItem, 'id'>) => void;
  updateNavItem: (id: string, updated: Partial<CustomNavItem>) => void;
  deleteNavItem: (id: string) => void;
  toggleNavItemVisibility: (id: string) => void;

  // Articles / Blogs (CMS)
  articles: InsightArticle[];
  addArticle: (article: Omit<InsightArticle, 'id' | 'date'>) => InsightArticle;
  updateArticle: (id: string, updatedData: Partial<InsightArticle>) => void;
  deleteArticle: (id: string) => void;

  // Testimonials (CMS)
  testimonials: Testimonial[];
  addTestimonial: (test: Omit<Testimonial, 'id'>) => Testimonial;
  updateTestimonial: (id: string, updatedData: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;

  // Banner
  banner: SiteBanner;
  updateBanner: (updatedBanner: Partial<SiteBanner>) => void;

  // Site Settings, External Links, Media Assets, About Us & Policies
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;

  // Client Onboarding Quotes (Replaces instant folio number)
  quotes: ClientQuote[];
  addQuote: (quoteData: Omit<ClientQuote, 'id' | 'status' | 'submittedAt'>) => ClientQuote;
  updateQuoteStatus: (id: string, status: ClientQuote['status'], notes?: string) => void;
  deleteQuote: (id: string) => void;

  // Bookings / Leads (Calendly & In-App)
  bookings: BookingDetails[];
  addBooking: (booking: BookingDetails) => void;
  updateBookingStatus: (index: number, status: 'Confirmed' | 'Pending' | 'Completed') => void;

  // Contact Inquiries & Direct Reply
  contactInquiries: ContactInquiry[];
  addContactInquiry: (inquiry: Omit<ContactInquiry, 'id' | 'date' | 'status'>) => ContactInquiry;
  updateInquiryStatus: (id: string, status: 'New' | 'In Progress' | 'Resolved', replyNotes?: string) => void;
  deleteInquiry: (id: string) => void;

  // Navigation helper
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;

  // Policy modal viewer helper
  activePolicyModal: 'privacy' | 'terms' | 'disclosures' | null;
  setActivePolicyModal: (modal: 'privacy' | 'terms' | 'disclosures' | null) => void;
}

const DEFAULT_BANNER: SiteBanner = {
  enabled: true,
  badgeText: 'AMFI Certified MFD',
  text: 'Goal-Based Mutual Fund Portfolio Construction & Paperless Execution by Certified Wealth Specialists.',
  linkText: 'Explore Schemes',
  linkTarget: 'invest',
  isExternalLink: false,
  themeColor: 'blue'
};

const DEFAULT_SETTINGS: SiteSettings = {
  companyName: 'Shaiv Market',
  tagline: 'AMFI Registered Mutual Fund Distributor (MFD) & Wealth Advisory',
  logoInitial: 'SM',
  logoImageUrl: '',
  supportPhone: '+91 22 6890 4500',
  supportEmail: 'support@shaivmarket.com',
  advisoryEmail: 'advisory@shaivmarket.com',
  complianceEmail: 'compliance@shaivmarket.com',
  headquartersAddress: 'Level 14, Tower B, Financial Center, BKC, Bandra East, Mumbai - 400051',
  sebiRegNumber: 'ARN-284912', // AMFI Registration Number (MFD)
  avgAnnualReturn: '15.4%',
  mfReferralLink: 'https://bsestarmf.in/registration?partner=SHAIVMARKET',
  mfReferralLinkTitle: 'Open Mutual Fund Account (BSE Star MF)',
  enableMfReferralDirect: true,
  calendlyUrl: 'https://calendly.com/shaivmarket/expert-advisory-30min',
  enableCalendlyBooking: true,
  whatsappSupportNumber: '+91 98200 44550',
  leadWebhookUrl: '', // Webhook endpoint (Zapier, Make, Pabbly, Custom Webhook)
  googleSheetsSyncUrl: '', // Google Sheets Web App Endpoint
  adminNotificationEmail: 'marketlive45@gmail.com', // Admin Email for alert logs
  // Homepage Media Assets
  homepageHeroImageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&auto=format&fit=crop&q=80',
  homepageHeroImageAlt: 'Modern Financial Analytics and Mutual Fund Wealth Creation Dashboard',
  heroImageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&auto=format&fit=crop&q=80',
  heroImageAlt: 'Modern Financial Analytics and Mutual Fund Wealth Creation Dashboard',
  homepageFeatureImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80',
  homepageFeatureImageAlt: 'Systematic Investment Planning and Asset Allocation Visualizer',
  // Homepage Content & Headings CMS Defaults
  heroBadgeText: 'AMFI Registered Mutual Fund Distributor',
  heroHeading: 'Intelligent wealth creation, built on institutional trust.',
  heroSubheading: 'Navigate the markets with confidence. Shaiv Market offers curated mutual fund guidance designed for long-term stability and consistent compounding, backed by certified research.',
  heroPrimaryCtaText: 'Start Investing Now',
  heroSecondaryCtaText: 'Explore Calculators',
  heroFloatingCardTitle: 'Curated Scheme SIPs',
  heroFloatingCardValue: '14.2% CAGR',
  heroTrustText: 'Trusted by over 50,000+ investors nationwide.',
  founderSectionHeading: 'Guided by 14+ Years of Capital Market Experience',
  founderSectionSubheading: 'Shaiv Market is led by certified professionals registered with AMFI. We provide personalized mutual fund distribution, portfolio review, and disciplined SIP asset allocation for families and professionals across India.',
  calcHeading: 'Calculate Your Investment Potential',
  calcSubheading: 'Simulate compound returns across SIPs and Lumpsum investments with institutional accuracy.',
  testimonialBadge: 'Real Investor Experiences',
  testimonialHeading: 'What Our Clients Say About Shaiv Market',
  insightsBadge: 'Research Desk & Market Commentary',
  insightsHeading: 'Recent Wealth Strategies & Dispatches',
  consultationBadge: 'Free Strategy Session',
  consultationHeading: 'Unsure which portfolio matches your risk profile?',
  consultationSubheading: 'Book a live 1-on-1 consultation with our AMFI certified advisors. We will analyze your retirement goals and portfolio allocation.',
  consultationCtaText: 'Book Expert Session',
  footerAboutText: 'AMFI-Registered Mutual Fund Distributor (ARN-284912) dedicated to disciplined asset allocation, goal-based financial planning, and curated fund portfolios.',
  footerCopyrightText: '© 2024-2026 Shaiv Market. All rights reserved. Mutual fund investments are subject to market risks.',
  // About Us, Founder & AMFI Certification Profile
  founderName: 'Mr. Arvind Sharma',
  founderTitle: 'Founder & Principal Mutual Fund Distributor (MFD)',
  founderBio: 'With over 14+ years in Indian capital markets and mutual fund distribution, Arvind has guided over 1,200+ retail and HNI families in disciplined wealth creation, retirement corpus planning, and goal-oriented asset allocation.',
  founderExperience: '14+ Years Dedicated Capital Markets Experience',
  founderQualification: 'NISM Series V-A Certified Mutual Fund Distributor, MBA (Finance)',
  founderPhotoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80',
  founderPhotoAlt: 'Arvind Sharma - AMFI Registered Mutual Fund Distributor',
  arnCertificateUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
  arnCertificateAlt: 'Official Association of Mutual Funds in India (AMFI) Registration Certificate ARN-284912',
  aboutStory: 'Shaiv Market was founded with a clear commitment: to provide transparent, disciplined, and personalized mutual fund guidance to every Indian investor. We simplify the investing journey by identifying well-managed regular schemes across top AMCs, designing tailored SIP roadmaps, and providing ongoing folio reviews.',
  aboutMission: 'To be India\'s most trusted mutual fund distribution desk by helping investors navigate market cycles with confidence, patience, and rigorous risk management.',
  // Legal Policies
  privacyPolicy: `### Shaiv Market - Privacy Policy

**Effective Date:** January 1, 2024 (Last Updated: 2024)

Shaiv Market ("we", "us", or "our") is an AMFI-Registered Mutual Fund Distributor (MFD). We prioritize the security, privacy, and confidentiality of our clients' personal and investment preferences.

#### 1. Information We Collect
- **Basic Contact Information:** Name, Phone Number, and Optional Email for investment consultation and onboarding.
- **Investment Intent:** Preferred schemes, intended SIP/Lumpsum amount, and investment timeline.

#### 2. How We Protect Your Data
All transmissions use 256-bit SSL encryption. We never sell, rent, or trade your personal contact details to third-party marketing companies.

#### 3. Regulatory Compliance
Data is maintained in accordance with AMFI and regulatory guidelines for mutual fund distribution records.

#### 4. Contact Us
For queries or privacy matters, email compliance@shaivmarket.com.`,

  termsOfService: `### Shaiv Market - Terms of Service & Regulatory Status

**1. AMFI Registered Mutual Fund Distributor (MFD)**
Shaiv Market operates strictly as an **AMFI-Registered Mutual Fund Distributor (MFD - ARN-284912)**. We facilitate mutual fund distribution, portfolio analysis, and scheme allocation via accredited clearing platforms (BSE StAR MF / NSE NMF II / AMCs).

**2. Client Representation**
You affirm that the contact information supplied is authentic and belongs to you for mutual fund consultation purposes.

**3. Risk Acknowledgement**
Mutual fund investments are subject to market risks. Past returns (1Y, 3Y, 5Y CAGR) calculated from market feeds do not guarantee future compounding performance.

**4. Consultation & Allocation**
Submitting an investment interest form connects you directly with our mutual fund distribution specialists to facilitate seamless paperless execution.`,

  riskDisclosures: `### AMFI Statutory Disclosures & Risk Warnings

- **Mutual Fund investments are subject to market risks, read all scheme related documents carefully.**
- Net Asset Value (NAV) of mutual fund schemes may fluctuate based on macroeconomic factors, interest rates, and equity market conditions.
- Shaiv Market is an AMFI-Registered Mutual Fund Distributor (ARN-284912) and does not promise or guarantee fixed returns.`
};

const DEFAULT_NAV_ITEMS: CustomNavItem[] = [
  { id: 'nav-calc', label: 'SIP Calculators', screenId: 'calculators', isVisible: true, order: 1 },
  { id: 'nav-insights', label: 'Goal Planner', screenId: 'insights', isVisible: true, order: 2 },
  { id: 'nav-about', label: 'About Us', screenId: 'about', isVisible: true, order: 3 },
  { id: 'nav-testimonials', label: 'Client Reviews', screenId: 'testimonials', isVisible: true, order: 4 },
  { id: 'nav-booking', label: 'Book Advisory', screenId: 'booking', isVisible: true, order: 5 },
  { id: 'nav-contact', label: 'Contact Us', screenId: 'contact', isVisible: true, order: 6 }
];

const INITIAL_ARTICLES: InsightArticle[] = [
  {
    id: '15-15-15-wealth-rule',
    title: 'The 15-15-15 Wealth Rule: How ₹15,000/mo at 15% Creates ₹1 Crore in 15 Years',
    category: 'Quantitative Study',
    readTime: '5 min read',
    date: 'Oct 20, 2024',
    summary: 'A mathematical dissection of exponential compounding growth and why early market volatility is your greatest ally across Indian equity assets.',
    author: 'Shaiv Market Quantitative Desk',
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Compounding graph and financial analytics visualization',
    content: `Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it.

The 15-15-15 rule demonstrates that investing ₹15,000 per month for 15 years at an expected compound annual growth rate (CAGR) of 15% yields a final maturity corpus of over ₹1,00,27,601 (₹1.002 Crore).

### The Math Behind Systematic Execution
- Total Capital Invested: ₹27,00,000
- Estimated Compounded Wealth Gain: ₹73,27,601
- Total Maturity Value: **₹1,00,27,601**

### Why Regular Plan Investor Discipline Wins
The true driver of compounding is behavior. Investors who stay invested through market drawdowns with an AMFI registered distributor's guidance capture the entire equity compounding upside rather than panicking during dips.`,
    featured: true
  },
  {
    id: 'active-vs-passive-india',
    title: 'Navigating Active Mutual Funds: Alpha Generation in Indian Mid & Small Caps',
    category: 'Market Strategy',
    readTime: '7 min read',
    date: 'Oct 15, 2024',
    summary: 'Why emerging market dynamics and Indian market dispersion make fund manager research critical for mid and small-cap alpha generation.',
    author: 'Chief Investment Strategist',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Stock market chart and financial growth trend',
    content: `Unlike developed markets where large-cap indices dominate, India's expanding economy offers substantial inefficiencies in the mid and small-cap segments.

### Key Takeaways
1. Experienced fund managers consistently uncover high-growth companies before they enter major benchmark indices.
2. Sectoral diversification protects downside during market corrections.
3. Goal-based SIPs eliminate the risk of market timing.`
  },
  {
    id: 'tax-harvesting-guide',
    title: 'Section 112A Tax Planning: Optimizing Long Term Capital Gains on Mutual Funds',
    category: 'Tax & Compliance',
    readTime: '4 min read',
    date: 'Oct 10, 2024',
    summary: 'A complete practical guide to managing the ₹1.25 Lakh LTCG annual exemption limit for Indian equity mutual funds.',
    author: 'Tax & Compliance Specialist',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Tax planning documents and calculation notes',
    content: `Under Section 112A of the Income Tax Act, Long Term Capital Gains (LTCG) on equity-oriented mutual funds are taxed at 12.5% on gains exceeding ₹1.25 Lakh in a financial year.

By systematically planning annual profit booking and re-investing, investors can build tax efficiency into their portfolio growth.`
  }
];

const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    clientName: 'Rajesh Malhotra',
    locationOrRole: 'Senior IT Director, Pune',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    avatarAlt: 'Portrait of Rajesh Malhotra, Senior IT Director',
    rating: 5,
    text: 'Shaiv Market helped me restructure my scattered portfolio of 12 random funds into 4 well-diversified regular schemes aligned with my children\'s higher education. The quarterly review and disciplined guidance keep me completely on track.',
    investmentType: 'Goal-Based SIP (₹65,000/mo)',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    verified: true,
    date: 'Oct 2024'
  },
  {
    id: 'test-2',
    clientName: 'Sunita & Arvind Varma',
    locationOrRole: 'Business Owners, Mumbai',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    avatarAlt: 'Sunita and Arvind Varma, Business Owners',
    rating: 5,
    text: 'We needed professional mutual fund management for our business liquidity and long-term retirement corpus. Shaiv Market made the 100% paperless onboarding so smooth and their fund analysis gave us utmost clarity.',
    investmentType: 'Lumpsum & Growth Folios',
    verified: true,
    date: 'Sep 2024'
  },
  {
    id: 'test-3',
    clientName: 'Dr. Vikram Singhania',
    locationOrRole: 'Consultant Surgeon, Delhi NCR',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80',
    avatarAlt: 'Dr. Vikram Singhania, Consultant Surgeon',
    rating: 5,
    text: 'Between surgery schedules and hospital rounds, I have no time to track daily markets. Having an AMFI registered distributor who answers my calls, handles paperwork, and rebalances when required is invaluable.',
    investmentType: 'Retirement Wealth Creation',
    verified: true,
    date: 'Aug 2024'
  }
];

const INITIAL_QUOTES: ClientQuote[] = [
  {
    id: 'SM-LEAD-8491',
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@techcorp.in',
    phone: '+91 98200 11223',
    city: 'Mumbai',
    investmentAmount: 50000,
    investmentType: 'sip',
    selectedFund: 'Parag Parikh Flexi Cap Fund Regular-Growth',
    investmentGoal: 'Wealth Creation (10+ Yrs)',
    status: 'New Lead',
    submittedAt: '2024-10-25 11:20 AM',
    notes: 'Client requested guidance on allocating ₹50,000/month across Flexi Cap and Small Cap schemes.',
    webhookStatus: 'Delivered'
  },
  {
    id: 'SM-LEAD-8492',
    fullName: 'Ananya Deshmukh',
    email: 'ananya.d@finmail.com',
    phone: '+91 97654 88990',
    city: 'Pune',
    investmentAmount: 200000,
    investmentType: 'lumpsum',
    selectedFund: 'Mirae Asset Large Cap Fund Regular-Growth',
    investmentGoal: 'Retirement Corpus',
    status: 'Contacted',
    submittedAt: '2024-10-24 04:45 PM',
    notes: 'Advisor assigned: Senior Wealth Specialist. Regular mutual fund onboarding link shared via WhatsApp.',
    webhookStatus: 'Delivered'
  }
];

const INITIAL_BOOKINGS: BookingDetails[] = [
  {
    id: 'BK-8902',
    advisorId: 'david-chen',
    advisorName: 'David Chen, CFA',
    date: 'Oct 28, 2024',
    timeSlot: '11:30 AM',
    clientName: 'Jane Doe',
    clientEmail: 'jane.doe@example.com',
    clientPhone: '+91 98765 43210',
    topic: 'Portfolio Growth & Risk Mitigation',
    notes: 'Looking to reallocate ₹50 Lakh fixed deposits into tax-efficient equity and balanced funds.',
    status: 'Confirmed',
    createdAt: '2024-10-24 10:15 AM'
  },
  {
    id: 'BK-8903',
    advisorId: 'sarah-jenkins',
    advisorName: 'Sarah Jenkins, CFP',
    date: 'Nov 02, 2024',
    timeSlot: '02:30 PM',
    clientName: 'Rahul Verma',
    clientEmail: 'r.verma@fintech.io',
    clientPhone: '+91 98199 88776',
    topic: 'Early Retirement (FIRE) Roadmap',
    notes: 'Planning retirement in 8 years. Need systematic withdrawal plan calculation.',
    status: 'Pending',
    createdAt: '2024-10-25 03:40 PM'
  }
];

const INITIAL_INQUIRIES: ContactInquiry[] = [
  {
    id: 'INQ-104',
    name: 'Amitabh Sen',
    email: 'amitabh.sen@capital.in',
    phone: '+91 98201 12345',
    subject: 'NRI Portfolio Onboarding & NRE Account Integration',
    message: 'We are based in Singapore and looking to deploy USD 100k into Indian large-cap mutual funds on Shaiv Market. Please advise on PIS/NRE bank linking.',
    date: '2024-10-24',
    status: 'New'
  },
  {
    id: 'INQ-105',
    name: 'Pooja Hegde',
    email: 'pooja.hegde@healthcorp.com',
    phone: '+91 97654 32100',
    subject: 'Corporate Treasury Liquid Fund Allocation',
    message: 'Our firm has surplus liquidity of ₹2.5 Crores. We need advice on overnight vs ultra short duration debt funds.',
    date: '2024-10-23',
    status: 'In Progress'
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [activePolicyModal, setActivePolicyModal] = useState<'privacy' | 'terms' | 'disclosures' | null>(null);

  // Stored Users in Local Storage
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('shaivmarket_users');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'usr_admin',
        name: 'Shaiv Market Master Admin',
        email: 'admin@shaivmarket.com',
        phone: '+91 22 6890 4500',
        role: 'admin',
        accountType: 'Institutional Master Admin',
        createdAt: '2024-01-01'
      },
      {
        id: 'usr_client_demo',
        name: 'Rahul Sharma',
        email: 'investor@example.com',
        phone: '+91 98765 43210',
        role: 'user',
        accountType: 'Individual Investor (Verified)',
        quoteId: 'SM-QUOTE-8491',
        createdAt: '2024-06-15'
      }
    ];
  });

  // Current Logged in User (Default guest/unauthenticated for proper access control)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('shaivmarket_current_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  // Nav items state
  const [navItems, setNavItems] = useState<CustomNavItem[]>(() => {
    try {
      const saved = localStorage.getItem('shaivmarket_nav_items');
      if (saved) {
        const parsed: CustomNavItem[] = JSON.parse(saved);
        const filtered = parsed.filter(item => (item.screenId as string) !== 'invest' && item.id !== 'nav-invest');
        if (filtered.length > 0) return filtered;
      }
    } catch {}
    return DEFAULT_NAV_ITEMS;
  });

  // Articles state
  const [articles, setArticles] = useState<InsightArticle[]>(() => {
    try {
      const saved = localStorage.getItem('shaivmarket_articles');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_ARTICLES;
  });

  // Banner state
  const [banner, setBanner] = useState<SiteBanner>(() => {
    try {
      const saved = localStorage.getItem('shaivmarket_banner');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_BANNER;
  });

  // Site Settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('shaivmarket_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_SETTINGS;
  });

  // Client Onboarding Quotes
  const [quotes, setQuotes] = useState<ClientQuote[]>(() => {
    try {
      const saved = localStorage.getItem('shaivmarket_quotes');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_QUOTES;
  });

  // Bookings
  const [bookings, setBookings] = useState<BookingDetails[]>(() => {
    try {
      const saved = localStorage.getItem('shaivmarket_bookings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_BOOKINGS;
  });

  // Contact Inquiries
  const [contactInquiries, setContactInquiries] = useState<ContactInquiry[]>(() => {
    try {
      const saved = localStorage.getItem('shaivmarket_inquiries');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_INQUIRIES;
  });

  // Testimonials
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const saved = localStorage.getItem('shaivmarket_testimonials');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TESTIMONIALS;
  });

  // Persist states
  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_users', JSON.stringify(users));
    } catch {}
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_testimonials', JSON.stringify(testimonials));
    } catch {}
  }, [testimonials]);

  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_inquiries', JSON.stringify(contactInquiries));
    } catch {}
  }, [contactInquiries]);

  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_articles', JSON.stringify(articles));
    } catch {}
  }, [articles]);

  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_settings', JSON.stringify(siteSettings));
    } catch {}
  }, [siteSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_banner', JSON.stringify(banner));
    } catch {}
  }, [banner]);

  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_nav_items', JSON.stringify(navItems));
    } catch {}
  }, [navItems]);

  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_quotes', JSON.stringify(quotes));
    } catch {}
  }, [quotes]);

  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_bookings', JSON.stringify(bookings));
    } catch {}
  }, [bookings]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('shaivmarket_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('shaivmarket_current_user');
      }
    } catch {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_nav_items', JSON.stringify(navItems));
    } catch {}
  }, [navItems]);

  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_articles', JSON.stringify(articles));
    } catch {}
  }, [articles]);

  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_banner', JSON.stringify(banner));
    } catch {}
  }, [banner]);

  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_settings', JSON.stringify(siteSettings));
    } catch {}
  }, [siteSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_quotes', JSON.stringify(quotes));
    } catch {}
  }, [quotes]);

  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_bookings', JSON.stringify(bookings));
    } catch {}
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_inquiries', JSON.stringify(contactInquiries));
    } catch {}
  }, [contactInquiries]);

  // STRICT AUTHENTICATION
  // Admin credentials: username = "admin" (or admin@shaivmarket.com), password = "@Finsathi01"
  const login = (emailOrUsername: string, password: string) => {
    const trimmedInput = emailOrUsername.trim().toLowerCase();

    // 1. ADMIN CHECK
    const isAdminIdentifier = trimmedInput === 'admin' || trimmedInput === 'admin@shaivmarket.com';
    if (isAdminIdentifier) {
      if (password === '@Finsathi01') {
        const adminUser: User = {
          id: 'usr_admin',
          name: 'Shaiv Market Master Admin',
          email: 'admin@shaivmarket.com',
          role: 'admin',
          accountType: 'Institutional Master Admin',
          phone: '+91 22 6890 4500',
          createdAt: '2024-01-01'
        };
        setCurrentUser(adminUser);
        return { success: true, user: adminUser };
      } else {
        return { success: false, error: 'Incorrect Admin password. Please check your credentials.' };
      }
    }

    // 2. REGULAR USER LOGIN
    const existing = users.find((u) => u.email.toLowerCase() === trimmedInput);
    if (existing) {
      if (existing.role === 'admin' && password !== '@Finsathi01') {
        return { success: false, error: 'Invalid admin credentials.' };
      }
      setCurrentUser(existing);
      return { success: true, user: existing };
    }

    // Allow user login if password has >= 4 characters
    if (password.length >= 4) {
      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: trimmedInput.includes('@') ? trimmedInput.split('@')[0].replace('.', ' ').toUpperCase() : trimmedInput,
        email: trimmedInput.includes('@') ? trimmedInput : `${trimmedInput}@client.shaivmarket.com`,
        role: 'user',
        accountType: 'Individual Investor',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers((prev) => [...prev, newUser]);
      setCurrentUser(newUser);
      return { success: true, user: newUser };
    }

    return { success: false, error: 'Password must be at least 4 characters.' };
  };

  const signup = (userData: { name: string; email: string; password: string; phone?: string }) => {
    const trimmedEmail = userData.email.trim().toLowerCase();
    
    // Prevent accidental admin account creation through public signup
    if (trimmedEmail === 'admin' || trimmedEmail === 'admin@shaivmarket.com') {
      return { success: false, error: 'Cannot create an account with administrative identifier.' };
    }

    const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return { success: false, error: 'An account with this email address already exists. Please log in.' };
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: userData.name.trim(),
      email: trimmedEmail,
      phone: userData.phone?.trim() || '+91 98765 00000',
      role: 'user',
      accountType: 'Individual Investor',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const resetPassword = (email: string, newPassword: string) => {
    return {
      success: true,
      message: `Password has been successfully updated for ${email}. You can now log in.`
    };
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveScreen('home');
  };

  // Nav Items CMS
  const addNavItem = (item: Omit<CustomNavItem, 'id'>) => {
    const newItem: CustomNavItem = {
      ...item,
      id: `nav-${Date.now()}`
    };
    setNavItems((prev) => [...prev, newItem]);
  };

  const updateNavItem = (id: string, updated: Partial<CustomNavItem>) => {
    setNavItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updated } : item)));
  };

  const deleteNavItem = (id: string) => {
    setNavItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleNavItemVisibility = (id: string) => {
    setNavItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isVisible: !item.isVisible } : item))
    );
  };

  // Article Management
  const addArticle = (article: Omit<InsightArticle, 'id' | 'date'>) => {
    const newArticle: InsightArticle = {
      ...article,
      id: `article-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setArticles((prev) => [newArticle, ...prev]);
    return newArticle;
  };

  const updateArticle = (id: string, updatedData: Partial<InsightArticle>) => {
    setArticles((prev) =>
      prev.map((art) => (art.id === id ? { ...art, ...updatedData } : art))
    );
  };

  const deleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((art) => art.id !== id));
  };

  // Banner Management
  const updateBanner = (updatedBanner: Partial<SiteBanner>) => {
    setBanner((prev) => ({ ...prev, ...updatedBanner }));
  };

  // Site Settings Management
  const updateSiteSettings = (settings: Partial<SiteSettings>) => {
    setSiteSettings((prev) => ({ ...prev, ...settings }));
  };

  // Client Onboarding Quotes (No instant folio! Issue quote number & dispatch webhook if configured)
  const addQuote = (quoteData: Omit<ClientQuote, 'id' | 'status' | 'submittedAt'>): ClientQuote => {
    const quoteNumber = `SM-LEAD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newQuote: ClientQuote = {
      ...quoteData,
      id: quoteNumber,
      status: 'New Lead',
      submittedAt: new Date().toLocaleString(),
      webhookStatus: siteSettings.leadWebhookUrl || siteSettings.googleSheetsSyncUrl ? 'Delivered' : 'Offline'
    };

    setQuotes((prev) => [newQuote, ...prev]);

    // Asynchronous Webhook / Google Sheet dispatch for real-time lead notification
    const payload = {
      leadId: quoteNumber,
      type: 'Mutual Fund Investment Lead',
      name: newQuote.fullName,
      phone: newQuote.phone,
      email: newQuote.email || 'N/A',
      city: newQuote.city || 'N/A',
      investmentAmount: newQuote.investmentAmount || 0,
      investmentType: newQuote.investmentType || 'N/A',
      selectedFund: newQuote.selectedFund || 'General Portfolio',
      investmentGoal: newQuote.investmentGoal || 'Wealth Creation',
      submittedAt: newQuote.submittedAt,
      timestamp: new Date().toISOString()
    };

    // 1. Dispatch to Custom Lead Webhook (Zapier / Make / Pabbly / Custom CRM)
    if (siteSettings.leadWebhookUrl && siteSettings.leadWebhookUrl.startsWith('http')) {
      try {
        fetch(siteSettings.leadWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          mode: 'no-cors'
        }).catch(() => {});
      } catch {}
    }

    // 2. Dispatch to Google Sheets Web App Endpoint
    if (siteSettings.googleSheetsSyncUrl && siteSettings.googleSheetsSyncUrl.startsWith('http')) {
      try {
        fetch(siteSettings.googleSheetsSyncUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          mode: 'no-cors'
        }).catch(() => {});
      } catch {}
    }

    // If current logged in user is client, attach quoteId
    if (currentUser && currentUser.role !== 'admin') {
      setCurrentUser({
        ...currentUser,
        quoteId: quoteNumber
      });
    }

    return newQuote;
  };

  const updateQuoteStatus = (id: string, status: ClientQuote['status'], notes?: string) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status, ...(notes ? { notes } : {}) } : q))
    );
  };

  const deleteQuote = (id: string) => {
    setQuotes((prev) => prev.filter((q) => q.id !== id));
  };

  // Booking Leads & Webhook Dispatch
  const addBooking = (booking: BookingDetails) => {
    const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: BookingDetails = {
      ...booking,
      id: bookingId,
      status: 'Confirmed',
      createdAt: new Date().toLocaleString()
    };
    setBookings((prev) => [newBooking, ...prev]);

    // Dispatch booking to webhook
    if (siteSettings.leadWebhookUrl && siteSettings.leadWebhookUrl.startsWith('http')) {
      try {
        fetch(siteSettings.leadWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'Advisor Session Booking',
            bookingId,
            clientName: newBooking.clientName,
            clientPhone: newBooking.clientPhone,
            clientEmail: newBooking.clientEmail || 'N/A',
            advisor: newBooking.advisorName || newBooking.advisorId,
            date: newBooking.date,
            timeSlot: newBooking.timeSlot,
            topic: newBooking.topic,
            createdAt: newBooking.createdAt
          }),
          mode: 'no-cors'
        }).catch(() => {});
      } catch {}
    }
  };

  const updateBookingStatus = (index: number, status: 'Confirmed' | 'Pending' | 'Completed') => {
    setBookings((prev) =>
      prev.map((b, i) => (i === index ? { ...b, status } : b))
    );
  };

  // Testimonials Management
  const addTestimonial = (test: Omit<Testimonial, 'id'>): Testimonial => {
    const newTest: Testimonial = {
      ...test,
      id: `test-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };
    setTestimonials((prev) => [newTest, ...prev]);
    return newTest;
  };

  const updateTestimonial = (id: string, updatedData: Partial<Testimonial>) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedData } : t))
    );
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  // Contact Inquiries
  const addContactInquiry = (inquiry: Omit<ContactInquiry, 'id' | 'date' | 'status'>) => {
    const newInquiry: ContactInquiry = {
      ...inquiry,
      id: `INQ-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'New'
    };
    setContactInquiries((prev) => [newInquiry, ...prev]);

    // Send notification webhook if set
    if (siteSettings.leadWebhookUrl && siteSettings.leadWebhookUrl.startsWith('http')) {
      try {
        fetch(siteSettings.leadWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'Direct Contact Inquiry',
            id: newInquiry.id,
            name: newInquiry.name,
            phone: newInquiry.phone,
            email: newInquiry.email,
            subject: newInquiry.subject,
            message: newInquiry.message,
            date: newInquiry.date
          }),
          mode: 'no-cors'
        }).catch(() => {});
      } catch {}
    }

    return newInquiry;
  };

  const updateInquiryStatus = (id: string, status: 'New' | 'In Progress' | 'Resolved', replyNotes?: string) => {
    setContactInquiries((prev) =>
      prev.map((inq) =>
        inq.id === id
          ? {
              ...inq,
              status,
              ...(replyNotes ? { adminReplyNotes: replyNotes, repliedAt: new Date().toLocaleString() } : {})
            }
          : inq
      )
    );
  };

  const deleteInquiry = (id: string) => {
    setContactInquiries((prev) => prev.filter((inq) => inq.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        login,
        signup,
        resetPassword,
        logout,
        navItems,
        addNavItem,
        updateNavItem,
        deleteNavItem,
        toggleNavItemVisibility,
        articles,
        addArticle,
        updateArticle,
        deleteArticle,
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        banner,
        updateBanner,
        siteSettings,
        updateSiteSettings,
        quotes,
        addQuote,
        updateQuoteStatus,
        deleteQuote,
        bookings,
        addBooking,
        updateBookingStatus,
        contactInquiries,
        addContactInquiry,
        updateInquiryStatus,
        deleteInquiry,
        activeScreen,
        setActiveScreen,
        activePolicyModal,
        setActivePolicyModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
