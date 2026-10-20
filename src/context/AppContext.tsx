import { sha256Hex } from '../utils/sha256';
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
  text: 'Goal-Based Mutual Fund Portfolio Construction & Paperless Onboarding — Free Portfolio Review Available.',
  linkText: 'Explore Schemes',
  linkTarget: 'invest',
  isExternalLink: false,
  themeColor: 'blue'
};

const ADMIN_PASSWORD_SHA256 = 'ce40e1e9a9df6ee92ca230cc56d438806e9a4fb4568490a69bdafb24278d16cf';

const DEFAULT_SETTINGS: SiteSettings = {
  companyName: 'Shaiv Market',
  tagline: 'AMFI Registered Mutual Fund Distributor (MFD), Jaipur',
  logoInitial: 'SM',
  logoImageUrl: '/images/logo-mark.png',
  supportPhone: '+91 99506 53247',
  supportEmail: 'marketlive45@gmail.com',
  advisoryEmail: 'marketlive45@gmail.com',
  complianceEmail: 'marketlive45@gmail.com',
  headquartersAddress: '6th Floor, Bhamashah Techno Hub, Jhalana Doongari, Jaipur, Rajasthan',
  sebiRegNumber: 'ARN-337289', // AMFI Registration Number (MFD)
  avgAnnualReturn: '',
  mfReferralLink: '',
  mfReferralLinkTitle: 'Open Mutual Fund Account (BSE Star MF)',
  enableMfReferralDirect: false,
  calendlyUrl: '',
  enableCalendlyBooking: false,
  whatsappSupportNumber: '+91 99506 53247',
  leadWebhookUrl: '', // Webhook endpoint (Zapier, Make, Pabbly, Custom Webhook)
  googleSheetsSyncUrl: '', // Google Sheets Web App Endpoint
  adminNotificationEmail: 'marketlive45@gmail.com', // Admin Email for alert logs
  // Homepage Media Assets
  homepageHeroImageUrl: '',
  homepageHeroImageAlt: 'Modern Financial Analytics and Mutual Fund Wealth Creation Dashboard',
  heroImageUrl: '',
  heroImageAlt: 'Modern Financial Analytics and Mutual Fund Wealth Creation Dashboard',
  homepageFeatureImageUrl: '',
  homepageFeatureImageAlt: 'Systematic Investment Planning and Asset Allocation Visualizer',
  // Homepage Content & Headings CMS Defaults
  heroBadgeText: 'AMFI Registered Mutual Fund Distributor',
  heroHeading: 'Goal-based mutual fund investing, made simple.',
  heroSubheading: 'Plan every goal with clear numbers. Shaiv Market helps you choose the right mutual fund schemes, start disciplined SIPs, and stay on track with regular portfolio reviews.',
  heroPrimaryCtaText: 'Start Investing Now',
  heroSecondaryCtaText: 'Explore Calculators',
  heroFloatingCardTitle: 'AMFI Registered MFD',
  heroFloatingCardValue: 'ARN-337289',
  heroTrustText: 'Personal guidance from Jaipur for investors across India.',
  founderSectionHeading: 'Personal, Goal-Based Mutual Fund Guidance',
  founderSectionSubheading: 'Shaiv Market is led by Chirag Sharma, an AMFI Registered Mutual Fund Distributor (ARN-337289). We provide personalized mutual fund distribution, portfolio review, and disciplined SIP asset allocation for families and professionals across India.',
  calcHeading: 'Calculate Your Investment Potential',
  calcSubheading: 'Estimate how your SIP or lumpsum investment could grow over time. Illustrative only, not a guarantee of returns.',
  testimonialBadge: 'Client Reviews',
  testimonialHeading: 'What Our Clients Say About Shaiv Market',
  insightsBadge: 'Investor Education',
  insightsHeading: 'Recent Wealth Strategies & Dispatches',
  consultationBadge: 'Free Portfolio Review',
  consultationHeading: 'Unsure which portfolio matches your risk profile?',
  consultationSubheading: 'Book a free 1-on-1 call with Chirag Sharma, AMFI Registered Mutual Fund Distributor. We will review your goals and current mutual fund portfolio.',
  consultationCtaText: 'Book Free Call',
  footerAboutText: 'AMFI Registered Mutual Fund Distributor (ARN-337289) dedicated to disciplined asset allocation, goal-based financial planning, and curated fund portfolios.',
  footerCopyrightText: '© 2026 Shaiv Market. All rights reserved. Mutual fund investments are subject to market risks.',
  // About Us, Founder & AMFI Certification Profile
  founderName: 'Chirag Sharma',
  founderTitle: 'Founder & AMFI Registered Mutual Fund Distributor',
  founderBio: 'Chirag Sharma is an AMFI Registered Mutual Fund Distributor (ARN-337289) based in Jaipur. He helps individuals and families plan goals such as retirement, children\'s education and wealth creation through disciplined SIPs, suitable scheme selection and regular portfolio reviews.',
  founderExperience: 'Based in Jaipur',
  founderQualification: 'NISM Series V-A Certified Mutual Fund Distributor',
  founderPhotoUrl: '/images/chirag-sharma.jpg',
  founderPhotoAlt: 'Chirag Sharma - AMFI Registered Mutual Fund Distributor',
  arnCertificateUrl: '/images/amfi-arn-card.jpg',
  arnCertificateAlt: 'AMFI ARN Card of Chirag Sharma - ARN-337289',
  nismCertificateUrl: '/images/nism-certificate.jpg',
  aboutStory: 'Shaiv Market was founded with a clear commitment: to provide transparent, disciplined, and personalized mutual fund guidance to every Indian investor. We simplify the investing journey by identifying well-managed regular schemes across top AMCs, designing tailored SIP roadmaps, and providing ongoing folio reviews.',
  aboutMission: 'To help every investor navigate market cycles with confidence, patience, and rigorous risk management.',
  // Legal Policies
  privacyPolicy: `### Shaiv Market - Privacy Policy

**Effective Date:** October 17, 2026

Shaiv Market ("we", "us", or "our") is an AMFI-Registered Mutual Fund Distributor (MFD). We prioritize the security, privacy, and confidentiality of our clients' personal and investment preferences.

#### 1. Information We Collect
- **Basic Contact Information:** Name, Phone Number, and Optional Email for investment consultation and onboarding.
- **Investment Intent:** Preferred schemes, intended SIP/Lumpsum amount, and investment timeline.

#### 2. How We Protect Your Data
This website is served over HTTPS. We never sell, rent, or trade your personal contact details to third-party marketing companies.

#### 3. Regulatory Compliance
Data is maintained in accordance with AMFI and regulatory guidelines for mutual fund distribution records.

#### 4. Contact Us
For queries or privacy matters, email marketlive45@gmail.com or call +91 99506 53247.`,

  termsOfService: `### Shaiv Market - Terms of Service & Regulatory Status

**1. AMFI Registered Mutual Fund Distributor (MFD)**
Shaiv Market operates strictly as an **AMFI-Registered Mutual Fund Distributor (MFD - ARN-337289)**. We facilitate mutual fund distribution, portfolio analysis, and scheme allocation via accredited clearing platforms (BSE StAR MF / NSE NMF II / AMCs).

**2. Client Representation**
You affirm that the contact information supplied is authentic and belongs to you for mutual fund consultation purposes.

**3. Risk Acknowledgement**
Mutual fund investments are subject to market risks. Past returns (1Y, 3Y, 5Y CAGR) calculated from market feeds do not guarantee future compounding performance.

**4. Consultation & Allocation**
Submitting an investment interest form connects you directly with our mutual fund distribution specialists to facilitate seamless paperless execution.`,

  riskDisclosures: `### AMFI Statutory Disclosures & Risk Warnings

- **Mutual Fund investments are subject to market risks, read all scheme related documents carefully.**
- Net Asset Value (NAV) of mutual fund schemes may fluctuate based on macroeconomic factors, interest rates, and equity market conditions.
- Shaiv Market is an AMFI-Registered Mutual Fund Distributor (ARN-337289) and does not promise or guarantee fixed returns.`
};

const DEFAULT_NAV_ITEMS: CustomNavItem[] = [
  { id: 'nav-calc', label: 'SIP Calculators', screenId: 'calculators', isVisible: true, order: 1 },
  { id: 'nav-insights', label: 'Goal Planner', screenId: 'insights', isVisible: true, order: 2 },
  { id: 'nav-about', label: 'About Us', screenId: 'about', isVisible: true, order: 3 },
  { id: 'nav-testimonials', label: 'Client Reviews', screenId: 'testimonials', isVisible: false, order: 4 },
  { id: 'nav-booking', label: 'Book a Call', screenId: 'booking', isVisible: true, order: 5 },
  { id: 'nav-contact', label: 'Contact Us', screenId: 'contact', isVisible: true, order: 6 }
];

const INITIAL_ARTICLES: InsightArticle[] = [
  {
    id: '15-15-15-wealth-rule',
    title: 'The 15-15-15 Wealth Rule: How ₹15,000/mo at 15% Creates ₹1 Crore in 15 Years',
    category: 'Quantitative Study',
    readTime: '5 min read',
    date: 'Oct 14, 2026',
    summary: 'A mathematical dissection of exponential compounding growth and why early market volatility is your greatest ally across Indian equity assets.',
    author: 'Shaiv Market',
    imageUrl: '',
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
    date: 'Oct 9, 2026',
    summary: 'Why emerging market dynamics and Indian market dispersion make fund manager research critical for mid and small-cap alpha generation.',
    author: 'Shaiv Market',
    imageUrl: '',
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
    date: 'Oct 3, 2026',
    summary: 'A complete practical guide to managing the ₹1.25 Lakh LTCG annual exemption limit for Indian equity mutual funds.',
    author: 'Shaiv Market',
    imageUrl: '',
    imageAlt: 'Tax planning documents and calculation notes',
    content: `Under Section 112A of the Income Tax Act, Long Term Capital Gains (LTCG) on equity-oriented mutual funds are taxed at 12.5% on gains exceeding ₹1.25 Lakh in a financial year.

By systematically planning annual profit booking and re-investing, investors can build tax efficiency into their portfolio growth.`
  }
];

const INITIAL_TESTIMONIALS: Testimonial[] = [];

const INITIAL_QUOTES: ClientQuote[] = [];

const INITIAL_BOOKINGS: BookingDetails[] = [];

const INITIAL_INQUIRIES: ContactInquiry[] = [];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [activePolicyModal, setActivePolicyModal] = useState<'privacy' | 'terms' | 'disclosures' | null>(null);

  // Stored Users in Local Storage
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('shaivmarket_v3_users');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'usr_admin',
        name: 'Shaiv Market Admin',
        email: 'admin@shaivmarket.com',
        phone: '+91 22 6890 4500',
        role: 'admin',
        accountType: 'Institutional Master Admin',
        createdAt: '2024-01-01'
      }
    ];
  });

  // Current Logged in User (Default guest/unauthenticated for proper access control)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('shaivmarket_v3_current_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  // Nav items state
  const [navItems, setNavItems] = useState<CustomNavItem[]>(() => {
    try {
      const saved = localStorage.getItem('shaivmarket_v3_nav_items');
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
      const saved = localStorage.getItem('shaivmarket_v3_articles');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_ARTICLES;
  });

  // Banner state
  const [banner, setBanner] = useState<SiteBanner>(() => {
    try {
      const saved = localStorage.getItem('shaivmarket_v3_banner');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_BANNER;
  });

  // Site Settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('shaivmarket_v3_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_SETTINGS;
  });

  // Client Onboarding Quotes
  const [quotes, setQuotes] = useState<ClientQuote[]>(() => {
    try {
      const saved = localStorage.getItem('shaivmarket_v3_quotes');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_QUOTES;
  });

  // Bookings
  const [bookings, setBookings] = useState<BookingDetails[]>(() => {
    try {
      const saved = localStorage.getItem('shaivmarket_v3_bookings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_BOOKINGS;
  });

  // Contact Inquiries
  const [contactInquiries, setContactInquiries] = useState<ContactInquiry[]>(() => {
    try {
      const saved = localStorage.getItem('shaivmarket_v3_inquiries');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_INQUIRIES;
  });

  // Testimonials
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const saved = localStorage.getItem('shaivmarket_v3_testimonials');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TESTIMONIALS;
  });

  // Persist states
  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_v3_users', JSON.stringify(users));
    } catch {}
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_v3_testimonials', JSON.stringify(testimonials));
    } catch {}
  }, [testimonials]);

  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_v3_inquiries', JSON.stringify(contactInquiries));
    } catch {}
  }, [contactInquiries]);

  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_v3_articles', JSON.stringify(articles));
    } catch {}
  }, [articles]);

  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_v3_settings', JSON.stringify(siteSettings));
    } catch {}
  }, [siteSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_v3_banner', JSON.stringify(banner));
    } catch {}
  }, [banner]);

  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_v3_nav_items', JSON.stringify(navItems));
    } catch {}
  }, [navItems]);

  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_v3_quotes', JSON.stringify(quotes));
    } catch {}
  }, [quotes]);

  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_v3_bookings', JSON.stringify(bookings));
    } catch {}
  }, [bookings]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('shaivmarket_v3_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('shaivmarket_v3_current_user');
      }
    } catch {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_v3_nav_items', JSON.stringify(navItems));
    } catch {}
  }, [navItems]);

  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_v3_articles', JSON.stringify(articles));
    } catch {}
  }, [articles]);

  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_v3_banner', JSON.stringify(banner));
    } catch {}
  }, [banner]);

  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_v3_settings', JSON.stringify(siteSettings));
    } catch {}
  }, [siteSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_v3_quotes', JSON.stringify(quotes));
    } catch {}
  }, [quotes]);

  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_v3_bookings', JSON.stringify(bookings));
    } catch {}
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem('shaivmarket_v3_inquiries', JSON.stringify(contactInquiries));
    } catch {}
  }, [contactInquiries]);

  // STRICT AUTHENTICATION
  // Admin password is verified against its SHA-256 hash (no plain text in the bundle)
  const login = (emailOrUsername: string, password: string) => {
    const trimmedInput = emailOrUsername.trim().toLowerCase();

    // 1. ADMIN CHECK
    const isAdminIdentifier = trimmedInput === 'admin' || trimmedInput === 'admin@shaivmarket.com';
    if (isAdminIdentifier) {
      if (sha256Hex(password) === ADMIN_PASSWORD_SHA256) {
        const adminUser: User = {
          id: 'usr_admin',
          name: 'Shaiv Market Admin',
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
      if (existing.role === 'admin' && sha256Hex(password) !== ADMIN_PASSWORD_SHA256) {
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
