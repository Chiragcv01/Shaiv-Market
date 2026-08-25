export type ActiveScreen =
  | 'home'
  | 'invest'
  | 'calculators'
  | 'insights'
  | 'booking'
  | 'open-account'
  | 'about'
  | 'testimonials'
  | 'contact'
  | 'admin'
  | 'auth';

export type AuthMode = 'login' | 'signup' | 'forgot-password';

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  accountType?: string;
  quoteId?: string;
  createdAt: string;
}

export interface CustomNavItem {
  id: string;
  label: string;
  screenId?: ActiveScreen;
  externalUrl?: string;
  isVisible: boolean;
  order: number;
  isCustom?: boolean;
}

export interface InsightArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  summary: string;
  author: string;
  content?: string;
  featured?: boolean;
  imageUrl?: string;
  imageAlt?: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  locationOrRole?: string;
  avatarUrl?: string;
  avatarAlt?: string;
  rating: number;
  text: string;
  investmentType?: string;
  videoUrl?: string; // e.g. YouTube or direct video embed link
  verified?: boolean;
  date?: string;
  // Backward compatibility alias properties
  reviewText?: string;
  clientPhotoUrl?: string;
  clientPhotoAlt?: string;
  clientRole?: string;
  clientLocation?: string;
  isVerified?: boolean;
}

export interface SiteBanner {
  enabled: boolean;
  text: string;
  badgeText: string;
  linkText: string;
  linkTarget: ActiveScreen | string;
  isExternalLink?: boolean;
  themeColor: 'blue' | 'green' | 'amber' | 'ruby';
}

export interface SiteSettings {
  companyName: string;
  tagline: string;
  logoInitial: string;
  logoImageUrl: string;
  supportPhone: string;
  supportEmail: string;
  advisoryEmail: string;
  complianceEmail: string;
  headquartersAddress: string;
  sebiRegNumber: string; // AMFI ARN Registration (e.g. ARN-284912)
  avgAnnualReturn: string;
  // External Referral & Booking Links
  mfReferralLink: string;
  mfReferralLinkTitle: string;
  enableMfReferralDirect: boolean;
  calendlyUrl: string;
  enableCalendlyBooking: boolean;
  whatsappSupportNumber: string;
  // CRM & Webhook Integration URLs
  leadWebhookUrl: string; // Zapier / Make / Pabbly / Custom Webhook for instant lead notifications
  googleSheetsSyncUrl: string; // Google Apps Script Web App URL for auto-populating leads in Google Sheets
  adminNotificationEmail: string; // Email to receive lead alerts
  // Homepage Media & Visual Assets
  homepageHeroImageUrl?: string;
  homepageHeroImageAlt?: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
  homepageFeatureImageUrl?: string;
  homepageFeatureImageAlt?: string;
  // Homepage Content & Headings CMS
  heroBadgeText?: string;
  heroHeading?: string;
  heroSubheading?: string;
  heroPrimaryCtaText?: string;
  heroSecondaryCtaText?: string;
  heroFloatingCardTitle?: string;
  heroFloatingCardValue?: string;
  heroTrustText?: string;
  founderSectionHeading?: string;
  founderSectionSubheading?: string;
  calcHeading?: string;
  calcSubheading?: string;
  testimonialBadge?: string;
  testimonialHeading?: string;
  insightsBadge?: string;
  insightsHeading?: string;
  consultationBadge?: string;
  consultationHeading?: string;
  consultationSubheading?: string;
  consultationCtaText?: string;
  footerAboutText?: string;
  footerCopyrightText?: string;
  // About Us, Founder & AMFI Certification
  founderName: string;
  founderTitle: string;
  founderBio: string;
  founderExperience: string;
  founderQualification: string;
  founderPhotoUrl: string;
  founderPhotoAlt: string;
  arnCertificateUrl: string;
  arnCertificateAlt: string;
  aboutStory: string;
  aboutMission: string;
  // Legal Policies
  privacyPolicy: string;
  termsOfService: string;
  riskDisclosures: string;
}

export interface ClientQuote {
  id: string; // Reference Lead ID (e.g. SM-LEAD-8492)
  fullName: string;
  phone: string;
  email?: string;
  city?: string;
  investmentAmount?: number;
  investmentType?: 'sip' | 'lumpsum';
  selectedFund?: string;
  investmentGoal?: string;
  status: 'New Lead' | 'Contacted' | 'Meeting Scheduled' | 'Folio Opened' | 'Archived';
  submittedAt: string;
  notes?: string;
  webhookStatus?: 'Delivered' | 'Pending' | 'Offline';
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: 'New' | 'In Progress' | 'Resolved';
  adminReplyNotes?: string;
  repliedAt?: string;
}

export type CalculatorType = 'sip' | 'target-sip' | 'lumpsum' | 'step-up' | 'sip-lumpsum';

export interface Advisor {
  id: string;
  name: string;
  role: string;
  rating: number;
  reviewsCount: number;
  experience: string;
  avatarUrl: string;
  specialties: string[];
  bio: string;
}

export interface PortfolioFund {
  id: string;
  name: string;
  category: 'Large Cap' | 'Flexi Cap' | 'Balanced' | 'Debt' | 'Small Cap' | 'Thematic';
  risk: 'Low' | 'Moderate' | 'High' | 'Very High';
  cagr3Y: number;
  cagr5Y: number;
  aum: string;
  expenseRatio: string;
  rating: number;
  minSip: number;
  description: string;
  topHoldings: string[];
  schemeCode?: number;
}

export interface BookingDetails {
  id?: string;
  advisorId: string;
  advisorName?: string;
  date: string;
  timeSlot: string;
  clientName: string;
  clientEmail?: string;
  clientPhone: string;
  topic: string;
  notes?: string;
  status?: 'Confirmed' | 'Pending' | 'Completed';
  createdAt?: string;
}

export interface AccountFormData {
  fullName: string;
  phone: string;
  email?: string;
  city?: string;
  investmentType?: 'sip' | 'lumpsum';
  investmentAmount?: number;
  selectedFund?: string;
  investmentGoal?: string;
}


