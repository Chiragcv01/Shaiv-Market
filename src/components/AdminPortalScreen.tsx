import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ActiveScreen, InsightArticle, SiteBanner, SiteSettings, CustomNavItem, ClientQuote, Testimonial, ContactInquiry } from '../types';
import {
  ShieldCheck,
  FileText,
  Megaphone,
  Link as LinkIcon,
  Settings,
  Users,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Calendar,
  Phone,
  Mail,
  Save,
  Clock,
  Sparkles,
  MessageSquare,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  Compass,
  FileSpreadsheet,
  Check,
  X,
  Lock,
  Image,
  Star,
  Award,
  Video,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminPortalScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

type AdminTab =
  | 'bookings'
  | 'quotes'
  | 'inquiries'
  | 'homepage'
  | 'branding'
  | 'media'
  | 'about'
  | 'testimonials'
  | 'navbar'
  | 'banners'
  | 'links'
  | 'blogs'
  | 'policies';

export const AdminPortalScreen: React.FC<AdminPortalScreenProps> = ({ onNavigate }) => {
  const {
    currentUser,
    login,
    logout,
    articles,
    addArticle,
    updateArticle,
    deleteArticle,
    banner,
    updateBanner,
    siteSettings,
    updateSiteSettings,
    quotes,
    updateQuoteStatus,
    bookings,
    updateBookingStatus,
    navItems,
    addNavItem,
    deleteNavItem,
    toggleNavItemVisibility,
    testimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    contactInquiries,
    updateInquiryStatus
  } = useApp();

  // Admin login credentials state
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [isSubmittingAdminAuth, setIsSubmittingAdminAuth] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTab>('homepage');
  const [successToast, setSuccessToast] = useState<string>('');

  // Settings State Form
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({ ...siteSettings });

  // Banner State Form
  const [bannerForm, setBannerForm] = useState<SiteBanner>({ ...banner });

  // Blog Editor State
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [articleForm, setArticleForm] = useState({
    title: '',
    category: 'Mutual Funds',
    readTime: '4 min read',
    summary: '',
    author: currentUser?.name || 'Shaiv Market Research Desk',
    content: '',
    featured: false,
    imageUrl: '',
    imageAlt: ''
  });
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

  // Testimonial Editor State
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [testimonialForm, setTestimonialForm] = useState<Omit<Testimonial, 'id'>>({
    clientName: '',
    locationOrRole: 'Individual Investor, Mumbai',
    avatarUrl: '',
    avatarAlt: '',
    rating: 5,
    text: '',
    investmentType: 'SIP in Equity Funds',
    videoUrl: '',
    verified: true
  });
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);

  // New Nav Item Form
  const [newNavLabel, setNewNavLabel] = useState('');
  const [newNavType, setNewNavType] = useState<'screen' | 'external'>('screen');
  const [newNavScreen, setNewNavScreen] = useState<ActiveScreen>('invest');
  const [newNavExternalUrl, setNewNavExternalUrl] = useState('');
  const [isAddingNav, setIsAddingNav] = useState(false);

  // Filters
  const [quoteStatusFilter, setQuoteStatusFilter] = useState<string>('all');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>('all');

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    try {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    } catch {}
    setTimeout(() => setSuccessToast(''), 4000);
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(settingsForm);
    showNotification('Platform settings & configurations updated!');
  };

  // Save Banner
  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    updateBanner(bannerForm);
    showNotification('Announcement banner settings published!');
  };

  // Article Actions
  const handleOpenAddArticle = () => {
    setEditingArticleId(null);
    setArticleForm({
      title: '',
      category: 'Mutual Funds',
      readTime: '4 min read',
      summary: '',
      author: currentUser?.name || 'Shaiv Market Research Desk',
      content: '',
      featured: false,
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
      imageAlt: 'Market analysis chart'
    });
    setIsArticleModalOpen(true);
  };

  const handleOpenEditArticle = (art: InsightArticle) => {
    setEditingArticleId(art.id);
    setArticleForm({
      title: art.title,
      category: art.category,
      readTime: art.readTime,
      summary: art.summary,
      author: art.author,
      content: art.content || '',
      featured: !!art.featured,
      imageUrl: art.imageUrl || '',
      imageAlt: art.imageAlt || ''
    });
    setIsArticleModalOpen(true);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm.title.trim() || !articleForm.summary.trim()) return;

    if (editingArticleId) {
      updateArticle(editingArticleId, articleForm);
      showNotification('Article updated successfully!');
    } else {
      addArticle(articleForm);
      showNotification('New research article published!');
    }
    setIsArticleModalOpen(false);
  };

  const handleDeleteArticle = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteArticle(id);
      showNotification('Article removed from portal.');
    }
  };

  // Testimonial Actions
  const handleOpenAddTestimonial = () => {
    setEditingTestimonialId(null);
    setTestimonialForm({
      clientName: '',
      locationOrRole: 'Salaried Professional, Pune',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      avatarAlt: 'Client Profile Picture',
      rating: 5,
      text: '',
      investmentType: 'SIP in Flexi Cap Fund',
      videoUrl: '',
      verified: true
    });
    setIsTestimonialModalOpen(true);
  };

  const handleOpenEditTestimonial = (test: Testimonial) => {
    setEditingTestimonialId(test.id);
    setTestimonialForm({
      clientName: test.clientName,
      locationOrRole: test.locationOrRole || '',
      avatarUrl: test.avatarUrl || '',
      avatarAlt: test.avatarAlt || '',
      rating: test.rating || 5,
      text: test.text || '',
      investmentType: test.investmentType || '',
      videoUrl: test.videoUrl || '',
      verified: test.verified ?? true
    });
    setIsTestimonialModalOpen(true);
  };

  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialForm.clientName.trim() || !testimonialForm.text.trim()) return;

    if (editingTestimonialId) {
      updateTestimonial(editingTestimonialId, testimonialForm);
      showNotification('Testimonial updated successfully!');
    } else {
      addTestimonial(testimonialForm);
      showNotification('New client review added!');
    }
    setIsTestimonialModalOpen(false);
  };

  const handleDeleteTestimonial = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete testimonial by "${name}"?`)) {
      deleteTestimonial(id);
      showNotification('Testimonial removed.');
    }
  };

  // Navbar Management
  const handleAddNavItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNavLabel.trim()) return;

    const newItem: CustomNavItem = {
      id: 'nav-' + Date.now(),
      label: newNavLabel.trim(),
      isVisible: true,
      order: navItems.length + 1,
      screenId: newNavType === 'screen' ? newNavScreen : undefined,
      externalUrl: newNavType === 'external' ? newNavExternalUrl : undefined,
      isCustom: true
    };

    addNavItem(newItem);
    setNewNavLabel('');
    setNewNavExternalUrl('');
    setIsAddingNav(false);
    showNotification('Navbar menu item added successfully!');
  };

  const filteredQuotes = quotes.filter((q) => {
    if (quoteStatusFilter === 'all') return true;
    return q.status === quoteStatusFilter;
  });

  const filteredInquiries = contactInquiries.filter((inq) => {
    if (inquiryStatusFilter === 'all') return true;
    return inq.status === inquiryStatusFilter;
  });

  const tabs: { id: AdminTab; label: string; icon: any; count?: number }[] = [
    { id: 'bookings', label: 'Scheduled Meetings & Bookings', icon: Calendar, count: bookings.length },
    { id: 'quotes', label: 'Client Registrations & Leads', icon: FileSpreadsheet, count: quotes.length },
    { id: 'inquiries', label: 'Contact Inquiries Desk', icon: MessageSquare, count: contactInquiries.length },
    { id: 'homepage', label: 'Homepage Headings & Text CMS', icon: Sparkles },
    { id: 'branding', label: 'Platform & Branding', icon: Settings },
    { id: 'media', label: 'Homepage Images & Media', icon: Image },
    { id: 'about', label: 'About Us & Founder CMS', icon: Award },
    { id: 'testimonials', label: 'Testimonials CMS', icon: Star, count: testimonials.length },
    { id: 'navbar', label: 'Navbar Manager', icon: Compass, count: navItems.length },
    { id: 'banners', label: 'Top Banners', icon: Megaphone },
    { id: 'links', label: 'Referrals & Calendly', icon: LinkIcon },
    { id: 'blogs', label: 'Blogs & Insights', icon: FileText, count: articles.length },
    { id: 'policies', label: 'Policies & Compliance', icon: ShieldCheck }
  ];

  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginError('');
    if (!adminUsername.trim() || !adminPassword.trim()) {
      setAdminLoginError('Please enter both admin username and password.');
      return;
    }

    setIsSubmittingAdminAuth(true);
    const res = login(adminUsername, adminPassword);
    setIsSubmittingAdminAuth(false);

    if (res.success && res.user?.role === 'admin') {
      showNotification('Welcome, Master Administrator!');
      setAdminUsername('');
      setAdminPassword('');
    } else {
      setAdminLoginError(res.error || 'Access Denied: Invalid administrator credentials.');
    }
  };


  // If user is not authenticated as admin, show secure Admin Login Screen
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div id="admin-login-screen" className="w-full max-w-md mx-auto px-4 py-16">
        <div className="bg-white border border-[#c2c6d1] rounded-2xl p-8 shadow-md institutional-shadow">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-[#003461] text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Lock className="w-7 h-7 text-[#96f6bd]" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#006d42] bg-[#96f6bd]/30 px-3 py-0.5 rounded-full inline-block mb-1">
              Admin & Content Control CMS
            </span>
            <h1 className="text-2xl font-black text-[#003461] tracking-tight">
              {siteSettings.companyName} Admin Login
            </h1>
            <p className="text-xs text-[#424750] mt-1">
              Sign in to manage homepage text, headings, images, testimonials, blogs, and leads.
            </p>
          </div>

          {adminLoginError && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-[#ba1a1a] flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{adminLoginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5" htmlFor="admin-username-input">
                Admin Username
              </label>
              <input
                id="admin-username-input"
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="admin"
                className="w-full border border-[#c2c6d1] rounded-xl px-4 py-2.5 bg-[#f7f9fb] text-sm text-[#191c1e] focus:ring-2 focus:ring-[#003461] outline-hidden"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5" htmlFor="admin-password-input">
                Master Password
              </label>
              <input
                id="admin-password-input"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full border border-[#c2c6d1] rounded-xl px-4 py-2.5 bg-[#f7f9fb] text-sm text-[#191c1e] focus:ring-2 focus:ring-[#003461] outline-hidden"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={isSubmittingAdminAuth}
              className="w-full bg-[#003461] hover:bg-[#004b87] active:bg-[#002647] text-white font-bold text-sm py-3 px-4 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4 text-[#96f6bd]" />
              <span>{isSubmittingAdminAuth ? 'Verifying...' : 'Authenticate & Open Control Panel'}</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#e0e3e5] text-center">
            <button
              onClick={() => onNavigate('home')}
              className="text-xs text-[#003461] hover:underline font-semibold"
            >
              ← Return to Public Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-portal-screen" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8 animate-in fade-in">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#003461] text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-[#96f6bd] animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-[#96f6bd]" />
          <span className="text-xs sm:text-sm font-semibold">{successToast}</span>
        </div>
      )}

      {/* Top Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#c2c6d1]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#006d42] text-white text-[10px] font-black uppercase rounded-md tracking-wider">
              Super Admin Active
            </span>
            <span className="text-xs text-[#727781] font-mono">ARN: {siteSettings.sebiRegNumber || '337289'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#003461] tracking-tight mt-1">
            {siteSettings.companyName} Administration Portal
          </h1>
          <p className="text-xs sm:text-sm text-[#424750] mt-0.5">
            Full platform control: Customize branding, homepage & blog images, about founder credentials, client testimonials, reply to inquiries & manage leads.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('home')}
            className="px-4 py-2 bg-white hover:bg-[#eceef0] border border-[#c2c6d1] rounded-xl text-xs font-bold text-[#191c1e] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 text-[#006d42]" />
            <span>View Live Site</span>
          </button>
          <button
            onClick={() => {
              logout();
              showNotification('Administrator logged out successfully.');
            }}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-[#ba1a1a] border border-red-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <X className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex gap-2 overflow-x-auto py-3 border-b border-[#e0e3e5] scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#003461] text-white shadow-xs'
                  : 'bg-white text-[#424750] hover:bg-[#eceef0] border border-[#c2c6d1]/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#96f6bd]' : 'text-[#727781]'}`} />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#e0e3e5] text-[#003461]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 0: HOMEPAGE HEADINGS, TEXTS & MEDIA CMS */}
      {activeTab === 'homepage' && (
        <div className="py-4 space-y-8 animate-in fade-in">
          <form onSubmit={handleSaveSettings} className="space-y-8">
            
            {/* Top Save Bar */}
            <div className="bg-white border border-[#c2c6d1] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm sticky top-24 z-30">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-[#006d42] text-white text-[10px] font-black uppercase rounded-md tracking-wider">
                    Live CMS Active
                  </span>
                  <span className="text-xs text-[#727781]">Changes update instantly across the entire website</span>
                </div>
                <h2 className="text-xl font-black text-[#003461] tracking-tight mt-0.5">
                  Homepage Content, Headings & Media CMS
                </h2>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="px-4 py-2.5 bg-[#f7f9fb] hover:bg-[#e0e3e5] border border-[#c2c6d1] text-[#003461] font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Preview Homepage
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-[#006d42] hover:bg-[#005231] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-transform active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Changes</span>
                </button>
              </div>
            </div>

            {/* 1. HERO SECTION CMS */}
            <div className="bg-white border border-[#c2c6d1] rounded-2xl p-6 sm:p-8 space-y-6 institutional-shadow">
              <div className="flex items-center justify-between pb-4 border-b border-[#e0e3e5]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#003461] text-[#96f6bd] flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#003461]">Hero Section (Top Main Banner)</h3>
                    <p className="text-xs text-[#727781]">Customize the main headline, tagline, CTAs, trust metric, floating CAGR card & hero banner image.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                    Hero Top Pill Badge Text
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroBadgeText || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroBadgeText: e.target.value })}
                    placeholder="AMFI Registered Mutual Fund Distributor"
                    className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden font-medium"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                    Hero Main Headline (H1 Title)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroHeading || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroHeading: e.target.value })}
                    placeholder="Intelligent wealth creation, built on institutional trust."
                    className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-base bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden font-extrabold text-[#003461]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                    Hero Sub-paragraph / Narrative Description
                  </label>
                  <textarea
                    rows={3}
                    value={settingsForm.heroSubheading || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroSubheading: e.target.value })}
                    placeholder="Navigate the markets with confidence. Shaiv Market offers curated mutual fund portfolios..."
                    className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                    Primary CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroPrimaryCtaText || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroPrimaryCtaText: e.target.value })}
                    placeholder="Start Investing Now"
                    className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden font-bold text-[#006d42]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                    Secondary CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroSecondaryCtaText || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroSecondaryCtaText: e.target.value })}
                    placeholder="View Portfolios"
                    className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                    Floating Card Title
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroFloatingCardTitle || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroFloatingCardTitle: e.target.value })}
                    placeholder="Curated Scheme SIPs"
                    className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                    Floating Card Metric / CAGR Value
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroFloatingCardValue || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroFloatingCardValue: e.target.value })}
                    placeholder="14.2% CAGR"
                    className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden font-bold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                    Trust Bar Metric Text
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroTrustText || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroTrustText: e.target.value })}
                    placeholder="Trusted by over 50,000+ investors nationwide."
                    className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                  />
                </div>
              </div>

              {/* Hero Banner Image & Presets */}
              <div className="pt-6 border-t border-[#e0e3e5] space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#003461] uppercase tracking-wider flex items-center gap-1.5">
                    <Image className="w-4 h-4 text-[#006d42]" />
                    <span>Hero Banner Right Graphic</span>
                  </h4>
                  <span className="text-[11px] text-[#727781]">Paste custom URL or choose a high-res preset</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-5 h-48 rounded-xl overflow-hidden border border-[#c2c6d1] bg-[#f7f9fb] relative">
                    <img
                      src={settingsForm.homepageHeroImageUrl || settingsForm.heroImageUrl || "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&auto=format&fit=crop&q=80"}
                      alt="Hero Banner Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      Live Preview
                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1">
                        Hero Image URL
                      </label>
                      <input
                        type="url"
                        value={settingsForm.homepageHeroImageUrl || settingsForm.heroImageUrl || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSettingsForm({ ...settingsForm, homepageHeroImageUrl: val, heroImageUrl: val });
                        }}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full px-3.5 py-2 border border-[#c2c6d1] rounded-xl text-xs bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1">
                        Image Alt Text (SEO)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.homepageHeroImageAlt || settingsForm.heroImageAlt || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSettingsForm({ ...settingsForm, homepageHeroImageAlt: val, heroImageAlt: val });
                        }}
                        placeholder="Modern Financial Analytics and Wealth Creation Dashboard"
                        className="w-full px-3.5 py-2 border border-[#c2c6d1] rounded-xl text-xs bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                      />
                    </div>

                    {/* Quick Presets Picker */}
                    <div>
                      <span className="text-[11px] font-bold text-[#727781] block mb-1.5">Quick 1-Click High-Res Presets:</span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { name: 'Stock Terminal', url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&auto=format&fit=crop&q=80' },
                          { name: 'Financial HQ', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80' },
                          { name: 'Wealth Growth', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80' },
                          { name: 'Market Board', url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80' }
                        ].map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => {
                              setSettingsForm({
                                ...settingsForm,
                                homepageHeroImageUrl: preset.url,
                                heroImageUrl: preset.url,
                                homepageHeroImageAlt: preset.name + ' - Shaiv Market'
                              });
                            }}
                            className="px-2.5 py-1 bg-white border border-[#c2c6d1] hover:border-[#003461] text-[#003461] text-[11px] font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
                          >
                            + {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. FOUNDER & ACCREDITATION SECTION */}
            <div className="bg-white border border-[#c2c6d1] rounded-2xl p-6 sm:p-8 space-y-6 institutional-shadow">
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#e0e3e5]">
                <div className="w-8 h-8 rounded-lg bg-[#003461] text-[#96f6bd] flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#003461]">Founder & AMFI Accreditation Banner</h3>
                  <p className="text-xs text-[#727781]">Customize headings and narrative for the founder highlight section on the homepage.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                    Founder Section Headline
                  </label>
                  <input
                    type="text"
                    value={settingsForm.founderSectionHeading || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, founderSectionHeading: e.target.value })}
                    placeholder="Guided by 14+ Years of Capital Market Experience"
                    className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden font-bold text-[#003461]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                    Founder Section Sub-heading / Overview
                  </label>
                  <textarea
                    rows={3}
                    value={settingsForm.founderSectionSubheading || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, founderSectionSubheading: e.target.value })}
                    placeholder="Shaiv Market is led by certified professionals registered with AMFI. We provide personalized mutual fund distribution..."
                    className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* 3. INVESTMENT CALCULATOR SECTION */}
            <div className="bg-white border border-[#c2c6d1] rounded-2xl p-6 sm:p-8 space-y-6 institutional-shadow">
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#e0e3e5]">
                <div className="w-8 h-8 rounded-lg bg-[#003461] text-[#96f6bd] flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#003461]">Investment Potential Calculator Section</h3>
                  <p className="text-xs text-[#727781]">Change the heading and description above the interactive SIP/Lumpsum calculator.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                    Calculator Section Heading
                  </label>
                  <input
                    type="text"
                    value={settingsForm.calcHeading || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, calcHeading: e.target.value })}
                    placeholder="Calculate Your Investment Potential"
                    className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                    Calculator Section Subtitle
                  </label>
                  <input
                    type="text"
                    value={settingsForm.calcSubheading || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, calcSubheading: e.target.value })}
                    placeholder="Simulate compound returns across SIPs and Lumpsum investments with institutional accuracy."
                    className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* 4. CLIENT TESTIMONIALS SECTION */}
            <div className="bg-white border border-[#c2c6d1] rounded-2xl p-6 sm:p-8 space-y-6 institutional-shadow">
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#e0e3e5]">
                <div className="w-8 h-8 rounded-lg bg-[#003461] text-[#96f6bd] flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#003461]">Client Testimonials Section</h3>
                  <p className="text-xs text-[#727781]">Customize the title and badge above client reviews on the homepage.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                    Testimonial Badge Text
                  </label>
                  <input
                    type="text"
                    value={settingsForm.testimonialBadge || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, testimonialBadge: e.target.value })}
                    placeholder="Real Investor Experiences"
                    className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                    Testimonial Section Heading
                  </label>
                  <input
                    type="text"
                    value={settingsForm.testimonialHeading || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, testimonialHeading: e.target.value })}
                    placeholder="What Our Clients Say About Shaiv Market"
                    className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden font-bold"
                  />
                </div>
              </div>
            </div>

            {/* 5. RESEARCH & INSIGHTS BLOG PREVIEW */}
            <div className="bg-white border border-[#c2c6d1] rounded-2xl p-6 sm:p-8 space-y-6 institutional-shadow">
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#e0e3e5]">
                <div className="w-8 h-8 rounded-lg bg-[#003461] text-[#96f6bd] flex items-center justify-center font-bold text-sm">
                  5
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#003461]">Research Desk & Insights Preview Section</h3>
                  <p className="text-xs text-[#727781]">Change the headings for the market commentary and research blog preview.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                    Insights Badge Text
                  </label>
                  <input
                    type="text"
                    value={settingsForm.insightsBadge || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, insightsBadge: e.target.value })}
                    placeholder="Research Desk & Market Commentary"
                    className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                    Insights Section Heading
                  </label>
                  <input
                    type="text"
                    value={settingsForm.insightsHeading || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, insightsHeading: e.target.value })}
                    placeholder="Recent Wealth Strategies & Dispatches"
                    className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden font-bold"
                  />
                </div>
              </div>
            </div>

            {/* 6. ADVISOR CONSULTATION TEASER BANNER */}
            <div className="bg-white border border-[#c2c6d1] rounded-2xl p-6 sm:p-8 space-y-6 institutional-shadow">
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#e0e3e5]">
                <div className="w-8 h-8 rounded-lg bg-[#003461] text-[#96f6bd] flex items-center justify-center font-bold text-sm">
                  6
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#003461]">Strategy Session Consultation Banner</h3>
                  <p className="text-xs text-[#727781]">Customize the bottom call-to-action banner for booking 1-on-1 advisor sessions.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                    Banner Badge Text
                  </label>
                  <input
                    type="text"
                    value={settingsForm.consultationBadge || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, consultationBadge: e.target.value })}
                    placeholder="Free Strategy Session"
                    className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={settingsForm.consultationCtaText || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, consultationCtaText: e.target.value })}
                    placeholder="Book Expert Session"
                    className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden font-bold text-[#006d42]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                    Banner Heading
                  </label>
                  <input
                    type="text"
                    value={settingsForm.consultationHeading || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, consultationHeading: e.target.value })}
                    placeholder="Unsure which portfolio matches your risk profile?"
                    className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden font-bold text-[#003461]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                    Banner Subtitle Narrative
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.consultationSubheading || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, consultationSubheading: e.target.value })}
                    placeholder="Book a live 1-on-1 consultation with our AMFI certified advisors. We will analyze your retirement goals..."
                    className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* 7. FOOTER CONTENT CMS */}
            <div className="bg-white border border-[#c2c6d1] rounded-2xl p-6 sm:p-8 space-y-6 institutional-shadow">
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#e0e3e5]">
                <div className="w-8 h-8 rounded-lg bg-[#003461] text-[#96f6bd] flex items-center justify-center font-bold text-sm">
                  7
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#003461]">Global Footer Text & Copyright</h3>
                  <p className="text-xs text-[#727781]">Customize footer brand description and compliance copyright notice.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                    Footer About Narrative
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.footerAboutText || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, footerAboutText: e.target.value })}
                    placeholder="AMFI-Registered Mutual Fund Distributor dedicated to disciplined asset allocation..."
                    className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden leading-relaxed"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                    Footer Copyright & Regulatory Text
                  </label>
                  <input
                    type="text"
                    value={settingsForm.footerCopyrightText || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, footerCopyrightText: e.target.value })}
                    placeholder="© 2024-2026 Shaiv Market. All rights reserved. Mutual fund investments are subject to market risks."
                    className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-xs bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Save Bar */}
            <div className="pt-4 flex items-center justify-end gap-4">
              <button
                type="submit"
                className="px-8 py-3.5 bg-[#006d42] hover:bg-[#005231] text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg cursor-pointer transition-transform active:scale-95"
              >
                <Save className="w-5 h-5" />
                <span>Save All Homepage Content</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 1: BRANDING & GENERAL SETTINGS */}
      {activeTab === 'branding' && (
        <div className="py-4 space-y-6">
          <form onSubmit={handleSaveSettings} className="bg-white border border-[#c2c6d1] rounded-2xl p-6 sm:p-8 space-y-6 institutional-shadow">
            <div className="flex items-center justify-between pb-4 border-b border-[#e0e3e5]">
              <div>
                <h2 className="text-lg font-bold text-[#003461]">Platform Identity & AMFI Registration</h2>
                <p className="text-xs text-[#727781]">Change the platform title, AMFI ARN number, corporate logo, and contact info.</p>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#003461] hover:bg-[#004b87] text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Identity Changes</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                  Platform / Company Name
                </label>
                <input
                  type="text"
                  value={settingsForm.companyName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, companyName: e.target.value })}
                  placeholder="e.g. Shaiv Market"
                  required
                  className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden font-bold text-[#003461]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                  Tagline / Sub-heading
                </label>
                <input
                  type="text"
                  value={settingsForm.tagline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                  placeholder="e.g. AMFI Registered Mutual Fund Distributor"
                  className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden text-[#191c1e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                  Logo Initial / Monogram (2-3 chars)
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={settingsForm.logoInitial}
                  onChange={(e) => setSettingsForm({ ...settingsForm, logoInitial: e.target.value.toUpperCase() })}
                  placeholder="SM"
                  className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                  AMFI ARN Registration Number
                </label>
                <input
                  type="text"
                  value={settingsForm.sebiRegNumber}
                  onChange={(e) => setSettingsForm({ ...settingsForm, sebiRegNumber: e.target.value })}
                  placeholder="ARN-337289"
                  className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                  Official Support Email
                </label>
                <input
                  type="email"
                  value={settingsForm.supportEmail}
                  onChange={(e) => setSettingsForm({ ...settingsForm, supportEmail: e.target.value })}
                  placeholder="invest@shaivmarket.com"
                  className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                  Institutional Phone Desk
                </label>
                <input
                  type="text"
                  value={settingsForm.supportPhone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, supportPhone: e.target.value })}
                  placeholder="+91 22 6890 4500"
                  className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                  WhatsApp Support / Advisory Number (with Country Code)
                </label>
                <input
                  type="text"
                  value={settingsForm.whatsappSupportNumber || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappSupportNumber: e.target.value })}
                  placeholder="+91 98200 44550"
                  className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden text-[#006d42] font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                  Registered Office Address
                </label>
                <input
                  type="text"
                  value={settingsForm.headquartersAddress}
                  onChange={(e) => setSettingsForm({ ...settingsForm, headquartersAddress: e.target.value })}
                  placeholder="Level 14, Tower B, Financial Center, BKC, Mumbai"
                  className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#e0e3e5] flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#006d42] hover:bg-[#005231] text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save All Identity Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: HOMEPAGE & MEDIA CMS */}
      {activeTab === 'media' && (
        <div className="py-4 space-y-6">
          <form onSubmit={handleSaveSettings} className="bg-white border border-[#c2c6d1] rounded-2xl p-6 sm:p-8 space-y-6 institutional-shadow">
            <div className="flex items-center justify-between pb-4 border-b border-[#e0e3e5]">
              <div>
                <h2 className="text-lg font-bold text-[#003461]">Homepage Images & Media CMS</h2>
                <p className="text-xs text-[#727781]">Replace hero graphics, feature screenshots, and provide accessible Alt text.</p>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#003461] hover:bg-[#004b87] text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Media Assets</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Hero Image Block */}
              <div className="bg-[#f7f9fb] border border-[#c2c6d1] rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#003461] uppercase tracking-wider">
                  <Image className="w-4 h-4" />
                  <span>Homepage Main Hero Banner</span>
                </div>

                <div className="w-full h-44 rounded-xl overflow-hidden border border-[#c2c6d1] bg-white relative">
                  <img
                    src={settingsForm.homepageHeroImageUrl || "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&auto=format&fit=crop&q=80"}
                    alt={settingsForm.homepageHeroImageAlt || "Hero preview"}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1">
                    Hero Image URL
                  </label>
                  <input
                    type="url"
                    value={settingsForm.homepageHeroImageUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, homepageHeroImageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2 border border-[#c2c6d1] rounded-xl text-xs bg-white focus:ring-2 focus:ring-[#003461] outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1">
                    Image Alt Text (SEO & Accessibility)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.homepageHeroImageAlt || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, homepageHeroImageAlt: e.target.value })}
                    placeholder="Shaiv Market Institutional Wealth Management HQ"
                    className="w-full px-3.5 py-2 border border-[#c2c6d1] rounded-xl text-xs bg-white focus:ring-2 focus:ring-[#003461] outline-hidden"
                  />
                </div>
              </div>

              {/* Feature Showcase Image Block */}
              <div className="bg-[#f7f9fb] border border-[#c2c6d1] rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#003461] uppercase tracking-wider">
                  <Image className="w-4 h-4" />
                  <span>Homepage Analytics / Feature Banner</span>
                </div>

                <div className="w-full h-44 rounded-xl overflow-hidden border border-[#c2c6d1] bg-white relative">
                  <img
                    src={settingsForm.homepageFeatureImageUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80"}
                    alt={settingsForm.homepageFeatureImageAlt || "Feature preview"}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1">
                    Feature Image URL
                  </label>
                  <input
                    type="url"
                    value={settingsForm.homepageFeatureImageUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, homepageFeatureImageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2 border border-[#c2c6d1] rounded-xl text-xs bg-white focus:ring-2 focus:ring-[#003461] outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1">
                    Feature Image Alt Text
                  </label>
                  <input
                    type="text"
                    value={settingsForm.homepageFeatureImageAlt || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, homepageFeatureImageAlt: e.target.value })}
                    placeholder="Mutual fund sector distribution and asset allocation charts"
                    className="w-full px-3.5 py-2 border border-[#c2c6d1] rounded-xl text-xs bg-white focus:ring-2 focus:ring-[#003461] outline-hidden"
                  />
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-[#e0e3e5] flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#006d42] hover:bg-[#005231] text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save All Images</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: ABOUT US & FOUNDER CMS */}
      {activeTab === 'about' && (
        <div className="py-4 space-y-6">
          <form onSubmit={handleSaveSettings} className="bg-white border border-[#c2c6d1] rounded-2xl p-6 sm:p-8 space-y-6 institutional-shadow">
            <div className="flex items-center justify-between pb-4 border-b border-[#e0e3e5]">
              <div>
                <h2 className="text-lg font-bold text-[#003461]">About Us, Founder Profile & AMFI Certificate CMS</h2>
                <p className="text-xs text-[#727781]">Update your founder details, credentials, experience, certificate image, and mission narrative.</p>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#003461] hover:bg-[#004b87] text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save About Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                  Founder Full Name
                </label>
                <input
                  type="text"
                  value={settingsForm.founderName || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, founderName: e.target.value })}
                  placeholder="Mr. Arvind Sharma"
                  className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                  Founder Designation / Title
                </label>
                <input
                  type="text"
                  value={settingsForm.founderTitle || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, founderTitle: e.target.value })}
                  placeholder="Founder & Principal Mutual Fund Distributor (MFD)"
                  className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                  Experience Highlight
                </label>
                <input
                  type="text"
                  value={settingsForm.founderExperience || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, founderExperience: e.target.value })}
                  placeholder="14+ Years Dedicated Capital Markets Experience"
                  className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden text-[#006d42] font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                  Qualifications & Certifications
                </label>
                <input
                  type="text"
                  value={settingsForm.founderQualification || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, founderQualification: e.target.value })}
                  placeholder="NISM Series V-A Certified Mutual Fund Distributor, MBA (Finance)"
                  className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                  Founder Photo URL
                </label>
                <input
                  type="url"
                  value={settingsForm.founderPhotoUrl || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, founderPhotoUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-xs bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                  Founder Photo Alt Text
                </label>
                <input
                  type="text"
                  value={settingsForm.founderPhotoAlt || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, founderPhotoAlt: e.target.value })}
                  placeholder="Arvind Sharma - AMFI Registered Mutual Fund Distributor"
                  className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-xs bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                  AMFI ARN Certificate Image URL
                </label>
                <input
                  type="url"
                  value={settingsForm.arnCertificateUrl || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, arnCertificateUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-xs bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                  Certificate Image Alt Text
                </label>
                <input
                  type="text"
                  value={settingsForm.arnCertificateAlt || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, arnCertificateAlt: e.target.value })}
                  placeholder="Official AMFI Registration Certificate ARN-337289"
                  className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-xs bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                  Founder Bio & Executive Background
                </label>
                <textarea
                  rows={3}
                  value={settingsForm.founderBio || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, founderBio: e.target.value })}
                  placeholder="Executive background description..."
                  className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-xs bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                  About Story & Platform Journey
                </label>
                <textarea
                  rows={4}
                  value={settingsForm.aboutStory || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, aboutStory: e.target.value })}
                  placeholder="Write the company story and journey here..."
                  className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-xs bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                  Mission Statement
                </label>
                <textarea
                  rows={2}
                  value={settingsForm.aboutMission || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, aboutMission: e.target.value })}
                  placeholder="Our mission is..."
                  className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-xs bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                />
              </div>

            </div>

            <div className="pt-4 border-t border-[#e0e3e5] flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#006d42] hover:bg-[#005231] text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save About Us CMS</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: CLIENT TESTIMONIALS CMS */}
      {activeTab === 'testimonials' && (
        <div className="py-4 space-y-6">
          <div className="bg-white border border-[#c2c6d1] rounded-2xl p-6 sm:p-8 institutional-shadow space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e0e3e5]">
              <div>
                <h2 className="text-lg font-bold text-[#003461]">Client Testimonials & Video Stories CMS</h2>
                <p className="text-xs text-[#727781]">Add, edit, or delete client testimonials, photos, ratings, and video embed links.</p>
              </div>
              <button
                onClick={handleOpenAddTestimonial}
                className="px-4 py-2.5 bg-[#006d42] hover:bg-[#005231] text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Testimonial</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((test) => (
                <div
                  key={test.id}
                  className="bg-[#f7f9fb] border border-[#c2c6d1] rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: test.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      {test.videoUrl && (
                        <span className="bg-[#ba1a1a]/10 text-[#ba1a1a] text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          <span>Video</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#424750] italic line-clamp-3">
                      "{test.text}"
                    </p>

                    <div className="flex items-center gap-3 pt-2">
                      {test.avatarUrl ? (
                        <img
                          src={test.avatarUrl}
                          alt={test.avatarAlt || test.clientName}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full object-cover border border-[#c2c6d1]"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#d3e4fe] text-[#003461] flex items-center justify-center font-bold text-xs">
                          {test.clientName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-bold text-[#191c1e] flex items-center gap-1">
                          <span>{test.clientName}</span>
                          {test.verified && <CheckCircle2 className="w-3 h-3 text-[#006d42]" />}
                        </div>
                        <div className="text-[11px] text-[#727781]">{test.locationOrRole}</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#e0e3e5] flex items-center justify-between">
                    <span className="text-[10px] text-[#003461] font-semibold">{test.investmentType}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditTestimonial(test)}
                        className="p-1.5 bg-white hover:bg-[#eceef0] border border-[#c2c6d1] rounded-lg text-[#003461] transition-colors cursor-pointer"
                        title="Edit Testimonial"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTestimonial(test.id, test.clientName)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-[#ba1a1a] transition-colors cursor-pointer"
                        title="Delete Testimonial"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CONTACT INQUIRIES & MESSAGING DESK */}
      {activeTab === 'inquiries' && (
        <div className="py-4 space-y-6">
          <div className="bg-white border border-[#c2c6d1] rounded-2xl p-6 sm:p-8 institutional-shadow space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e0e3e5]">
              <div>
                <h2 className="text-lg font-bold text-[#003461]">Contact Inquiries Desk</h2>
                <p className="text-xs text-[#727781]">View client tickets and send instant 1-click replies via WhatsApp or Email.</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#424750]">Status:</span>
                <select
                  value={inquiryStatusFilter}
                  onChange={(e) => setInquiryStatusFilter(e.target.value)}
                  className="px-3 py-1.5 border border-[#c2c6d1] rounded-xl text-xs bg-[#f7f9fb] text-[#191c1e]"
                >
                  <option value="all">All Inquiries ({contactInquiries.length})</option>
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            {filteredInquiries.length === 0 ? (
              <div className="text-center py-12 text-[#727781] text-xs">
                No contact inquiries found matching the selected filter.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInquiries.map((inq) => {
                  const whatsappMessage = encodeURIComponent(
                    `Hello ${inq.name},\nThank you for reaching out to ${siteSettings.companyName} regarding "${inq.subject}". Our AMFI-registered mutual fund desk is here to assist you.`
                  );
                  const cleanPhone = inq.phone.replace(/[^0-9]/g, '');

                  return (
                    <div
                      key={inq.id}
                      className="bg-[#f7f9fb] border border-[#c2c6d1] rounded-2xl p-5 sm:p-6 space-y-4 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#e0e3e5]">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-[#003461] bg-[#d3e4fe] px-2.5 py-0.5 rounded-md">
                            {inq.id}
                          </span>
                          <h3 className="font-bold text-sm text-[#191c1e]">{inq.name}</h3>
                          <span className="text-xs text-[#727781]">• {inq.date}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={inq.status}
                            onChange={(e) => updateInquiryStatus(inq.id, e.target.value as any)}
                            className={`text-xs font-bold px-3 py-1 rounded-lg border outline-hidden ${
                              inq.status === 'New'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : inq.status === 'In Progress'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : 'bg-green-50 text-green-800 border-green-300'
                            }`}
                          >
                            <option value="New">New Ticket</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-[11px] text-[#727781] uppercase font-bold block">Contact Details</span>
                          <div className="font-semibold text-[#191c1e] mt-1">{inq.phone}</div>
                          {inq.email && <div className="text-[#424750]">{inq.email}</div>}
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-[11px] text-[#727781] uppercase font-bold block">Subject & Inquiry</span>
                          <div className="font-bold text-[#003461] mt-1">{inq.subject}</div>
                          <div className="text-[#424750] mt-1 whitespace-pre-wrap">{inq.message}</div>
                        </div>
                      </div>

                      {/* Instant Direct Reply Actions */}
                      <div className="pt-3 border-t border-[#e0e3e5] flex flex-wrap items-center justify-between gap-3">
                        <div className="text-[11px] text-[#727781]">
                          Quick Dispatch Options:
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                          {/* 1-Click WhatsApp Reply */}
                          {inq.phone && (
                            <a
                              href={`https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${whatsappMessage}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => updateInquiryStatus(inq.id, 'In Progress')}
                              className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Reply via WhatsApp</span>
                            </a>
                          )}

                          {/* 1-Click Email Reply */}
                          {inq.email && (
                            <a
                              href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject)} - ${encodeURIComponent(siteSettings.companyName)}&body=Hello ${encodeURIComponent(inq.name)},%0D%0A%0D%0AThank you for contacting ${encodeURIComponent(siteSettings.companyName)}.`}
                              onClick={() => updateInquiryStatus(inq.id, 'In Progress')}
                              className="px-3.5 py-1.5 bg-[#003461] hover:bg-[#004b87] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs cursor-pointer"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Reply via Email</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: NAVBAR MANAGER */}
      {activeTab === 'navbar' && (
        <div className="py-4 space-y-6">
          <div className="bg-white border border-[#c2c6d1] rounded-2xl p-6 sm:p-8 space-y-6 institutional-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e0e3e5]">
              <div>
                <h2 className="text-lg font-bold text-[#003461]">Navbar Menu Items Manager</h2>
                <p className="text-xs text-[#727781]">Add custom menu tabs, rename items, toggle visibility, or delete custom links.</p>
              </div>
              <button
                onClick={() => setIsAddingNav(true)}
                className="px-4 py-2.5 bg-[#006d42] hover:bg-[#005231] text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Nav Link</span>
              </button>
            </div>

            {isAddingNav && (
              <form onSubmit={handleAddNavItem} className="p-4 bg-[#f7f9fb] border border-[#003461] rounded-xl space-y-3 animate-in fade-in">
                <div className="text-xs font-bold text-[#003461] uppercase tracking-wider">Create New Menu Item</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#424750] mb-1">Label</label>
                    <input
                      type="text"
                      value={newNavLabel}
                      onChange={(e) => setNewNavLabel(e.target.value)}
                      placeholder="e.g. NRI Desk"
                      required
                      className="w-full px-3 py-1.5 border border-[#c2c6d1] rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#424750] mb-1">Destination Type</label>
                    <select
                      value={newNavType}
                      onChange={(e) => setNewNavType(e.target.value as any)}
                      className="w-full px-3 py-1.5 border border-[#c2c6d1] rounded-lg text-xs bg-white"
                    >
                      <option value="screen">Internal Screen</option>
                      <option value="external">External Web URL</option>
                    </select>
                  </div>
                  {newNavType === 'screen' ? (
                    <div>
                      <label className="block text-[11px] font-bold text-[#424750] mb-1">Screen</label>
                      <select
                        value={newNavScreen}
                        onChange={(e) => setNewNavScreen(e.target.value as any)}
                        className="w-full px-3 py-1.5 border border-[#c2c6d1] rounded-lg text-xs bg-white"
                      >
                        <option value="calculators">Calculators</option>
                        <option value="insights">Goal Planner & Insights</option>
                        <option value="about">About Us</option>
                        <option value="testimonials">Client Reviews</option>
                        <option value="booking">Book Advisory</option>
                        <option value="contact">Contact Us</option>
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[11px] font-bold text-[#424750] mb-1">External URL</label>
                      <input
                        type="url"
                        value={newNavExternalUrl}
                        onChange={(e) => setNewNavExternalUrl(e.target.value)}
                        placeholder="https://bsestarmf.in"
                        required
                        className="w-full px-3 py-1.5 border border-[#c2c6d1] rounded-lg text-xs bg-white font-mono"
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNav(false)}
                    className="px-3 py-1.5 text-xs text-[#424750] hover:bg-[#e0e3e5] rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#006d42] text-white text-xs font-bold rounded-lg shadow-xs"
                  >
                    Add to Navbar
                  </button>
                </div>
              </form>
            )}

            <div className="divide-y divide-[#e0e3e5] border border-[#c2c6d1] rounded-xl overflow-hidden">
              {navItems.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between bg-white hover:bg-[#f7f9fb] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#003461] bg-[#d3e4fe] px-2 py-0.5 rounded">
                      Order #{item.order}
                    </span>
                    <span className="text-sm font-bold text-[#191c1e]">{item.label}</span>
                    {item.screenId && (
                      <span className="text-[11px] text-[#727781] bg-[#eceef0] px-2 py-0.5 rounded">
                        Screen: {item.screenId}
                      </span>
                    )}
                    {item.externalUrl && (
                      <span className="text-[11px] text-[#006d42] bg-[#96f6bd]/30 px-2 py-0.5 rounded flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        {item.externalUrl}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleNavItemVisibility(item.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        item.isVisible
                          ? 'bg-[#96f6bd]/40 text-[#006d42] border border-[#006d42]/30'
                          : 'bg-[#eceef0] text-[#727781]'
                      }`}
                    >
                      {item.isVisible ? 'Visible' : 'Hidden'}
                    </button>
                    {item.isCustom && (
                      <button
                        onClick={() => deleteNavItem(item.id)}
                        className="p-1.5 text-[#ba1a1a] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete custom link"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: TOP ANNOUNCEMENT BANNERS */}
      {activeTab === 'banners' && (
        <div className="py-4 space-y-6">
          <form onSubmit={handleSaveBanner} className="bg-white border border-[#c2c6d1] rounded-2xl p-6 sm:p-8 space-y-6 institutional-shadow">
            <div className="flex items-center justify-between pb-4 border-b border-[#e0e3e5]">
              <div>
                <h2 className="text-lg font-bold text-[#003461]">Top Announcement Banner</h2>
                <p className="text-xs text-[#727781]">Configure the site-wide notice or announcement top banner.</p>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#003461] hover:bg-[#004b87] text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Publish Banner</span>
              </button>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-3 p-3 bg-[#f7f9fb] border border-[#c2c6d1] rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={bannerForm.enabled}
                  onChange={(e) => setBannerForm({ ...bannerForm, enabled: e.target.checked })}
                  className="w-4 h-4 rounded text-[#003461]"
                />
                <span className="text-xs font-bold text-[#191c1e]">Enable Announcement Banner across all pages</span>
              </label>

              <div>
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                  Banner Text Message
                </label>
                <input
                  type="text"
                  value={bannerForm.text}
                  onChange={(e) => setBannerForm({ ...bannerForm, text: e.target.value })}
                  placeholder="Market Update: Q3 corporate earnings review is now live."
                  className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                    Action Button Label (Optional)
                  </label>
                  <input
                    type="text"
                    value={bannerForm.linkText || ''}
                    onChange={(e) => setBannerForm({ ...bannerForm, linkText: e.target.value })}
                    placeholder="e.g. Read Insights"
                    className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                    Button Target Screen
                  </label>
                  <select
                    value={bannerForm.linkTarget as string || 'insights'}
                    onChange={(e) => setBannerForm({ ...bannerForm, linkTarget: e.target.value as any })}
                    className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                  >
                    <option value="insights">Holdings & Insights</option>
                    <option value="invest">Mutual Funds Explorer</option>
                    <option value="booking">Book Advisory Session</option>
                    <option value="calculators">Calculators</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#e0e3e5] flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#006d42] hover:bg-[#005231] text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Banner</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 8: REFERRALS, CALENDLY & WEBHOOKS */}
      {activeTab === 'links' && (
        <div className="py-4 space-y-6">
          <form onSubmit={handleSaveSettings} className="bg-white border border-[#c2c6d1] rounded-2xl p-6 sm:p-8 space-y-6 institutional-shadow">
            <div className="flex items-center justify-between pb-4 border-b border-[#e0e3e5]">
              <div>
                <h2 className="text-lg font-bold text-[#003461]">BSE/NSE Referral, Calendly & Lead Webhook URLs</h2>
                <p className="text-xs text-[#727781]">Configure external onboarding links, calendar links, and Zapier/Google Sheets endpoints.</p>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#003461] hover:bg-[#004b87] text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Integrations</span>
              </button>
            </div>

            <div className="space-y-6">
              
              {/* Calendly */}
              <div className="bg-[#f7f9fb] border border-[#c2c6d1] rounded-2xl p-5 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsForm.enableCalendlyBooking}
                    onChange={(e) => setSettingsForm({ ...settingsForm, enableCalendlyBooking: e.target.checked })}
                    className="w-4 h-4 rounded text-[#003461]"
                  />
                  <span className="text-xs font-bold text-[#003461] uppercase tracking-wider">Enable Calendly Direct Booking Link</span>
                </label>

                <div>
                  <label className="block text-[11px] font-bold text-[#424750] uppercase mb-1">
                    Calendly Meeting URL
                  </label>
                  <input
                    type="url"
                    value={settingsForm.calendlyUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, calendlyUrl: e.target.value })}
                    placeholder="https://calendly.com/your-username/30min"
                    className="w-full px-4 py-2 border border-[#c2c6d1] rounded-xl text-xs bg-white font-mono"
                  />
                </div>
              </div>

              {/* BSE / NSE Referral */}
              <div className="bg-[#f7f9fb] border border-[#c2c6d1] rounded-2xl p-5 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsForm.enableMfReferralDirect}
                    onChange={(e) => setSettingsForm({ ...settingsForm, enableMfReferralDirect: e.target.checked })}
                    className="w-4 h-4 rounded text-[#003461]"
                  />
                  <span className="text-xs font-bold text-[#003461] uppercase tracking-wider">Enable Direct BSE StAR / NSE NMF Referral Button on Hero</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#424750] uppercase mb-1">Button Title</label>
                    <input
                      type="text"
                      value={settingsForm.mfReferralLinkTitle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, mfReferralLinkTitle: e.target.value })}
                      placeholder="Open Account on BSE StAR MF"
                      className="w-full px-3 py-2 border border-[#c2c6d1] rounded-xl text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#424750] uppercase mb-1">Referral Link URL</label>
                    <input
                      type="url"
                      value={settingsForm.mfReferralLink}
                      onChange={(e) => setSettingsForm({ ...settingsForm, mfReferralLink: e.target.value })}
                      placeholder="https://bsestarmf.in/referral?arn=337289"
                      className="w-full px-3 py-2 border border-[#c2c6d1] rounded-xl text-xs bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Lead Webhook / Zapier */}
              <div className="bg-[#f7f9fb] border border-[#c2c6d1] rounded-2xl p-5 space-y-3">
                <div className="text-xs font-bold text-[#003461] uppercase tracking-wider flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[#006d42]" />
                  <span>Real-time Lead Webhooks (Zapier / Make / Custom Server)</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#424750] uppercase mb-1">Webhook Endpoint URL</label>
                  <input
                    type="url"
                    value={settingsForm.leadWebhookUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, leadWebhookUrl: e.target.value })}
                    placeholder="https://hooks.zapier.com/hooks/catch/..."
                    className="w-full px-4 py-2 border border-[#c2c6d1] rounded-xl text-xs bg-white font-mono"
                  />
                  <p className="text-[10px] text-[#727781] mt-1">Whenever a client selects a mutual fund and enters their phone/name, instant JSON lead payload is dispatched to this endpoint.</p>
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-[#e0e3e5] flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#006d42] hover:bg-[#005231] text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save All Links</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB: SCHEDULED MEETINGS & BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="py-4 space-y-6">
          <div className="bg-white border border-[#c2c6d1] rounded-2xl p-6 sm:p-8 institutional-shadow space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e0e3e5]">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-[#d3e4fe] text-[#003461] px-2.5 py-0.5 rounded-full text-xs font-bold mb-1">
                  <Calendar className="w-3.5 h-3.5 text-[#006d42]" />
                  <span>Real-Time Meeting Schedule</span>
                </div>
                <h2 className="text-lg font-bold text-[#003461]">Client Consultation Bookings ({bookings.length})</h2>
                <p className="text-xs text-[#727781]">Clients who scheduled 1-on-1 sessions. Use 1-click WhatsApp, Call, or Email to connect with them instantly.</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#006d42] bg-[#f0fdf4] border border-[#bbf7d0] px-3 py-1.5 rounded-xl">
                  {bookings.filter(b => b.status === 'Confirmed' || !b.status).length} Active Sessions
                </span>
              </div>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-12 text-[#727781] text-xs">
                No meeting bookings received yet.
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((b, idx) => {
                  const cleanPhone = b.clientPhone.replace(/\D/g, '');
                  const waMsg = encodeURIComponent(
                    `Hello ${b.clientName}, I am reaching out from ${siteSettings.companyName} regarding your scheduled consultation on ${b.date} at ${b.timeSlot} for "${b.topic}". Let me know if you would like to connect now!`
                  );

                  return (
                    <div key={b.id || idx} className="bg-[#f7f9fb] border border-[#c2c6d1] rounded-2xl p-5 space-y-4 hover:border-[#003461] transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#e0e3e5]">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-[#003461] bg-[#d3e4fe] px-2.5 py-0.5 rounded-md">
                            {b.id || `BK-${idx + 101}`}
                          </span>
                          <span className="font-bold text-base text-[#191c1e]">{b.clientName}</span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#006d42]/10 text-[#006d42]">
                            {b.topic || 'General Portfolio Advisory'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#727781]">Status:</span>
                          <select
                            value={b.status || 'Confirmed'}
                            onChange={(e) => {
                              updateBookingStatus(idx, e.target.value as any);
                              showNotification(`Meeting status updated to ${e.target.value}`);
                            }}
                            className="text-xs font-bold px-3 py-1 rounded-lg border bg-white text-[#003461]"
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                        <div>
                          <span className="text-[10px] text-[#727781] uppercase font-bold block mb-0.5">Date & Time</span>
                          <div className="font-extrabold text-[#003461] flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#006d42]" />
                            <span>{b.date} • {b.timeSlot}</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] text-[#727781] uppercase font-bold block mb-0.5">Contact Phone</span>
                          <div className="font-bold text-[#191c1e] flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-[#003461]" />
                            <span>{b.clientPhone}</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] text-[#727781] uppercase font-bold block mb-0.5">Email Address</span>
                          <div className="font-semibold text-[#424750] truncate flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-[#727781]" />
                            <span>{b.clientEmail || 'Not provided'}</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] text-[#727781] uppercase font-bold block mb-0.5">Assigned Advisor</span>
                          <div className="font-semibold text-[#003461] truncate">
                            {b.advisorName || 'Mr. Arvind Sharma (Founder Desk)'}
                          </div>
                        </div>
                      </div>

                      {b.notes && (
                        <div className="bg-white p-3 rounded-xl border border-[#e0e3e5] text-xs text-[#424750]">
                          <span className="font-bold text-[#191c1e]">Client Note / Query: </span>
                          <span>{b.notes}</span>
                        </div>
                      )}

                      {/* Direct Connect Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#e0e3e5]">
                        <a
                          href={`https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${waMsg}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp Client</span>
                        </a>

                        <a
                          href={`tel:${cleanPhone}`}
                          className="bg-[#003461] hover:bg-[#004b87] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call Client</span>
                        </a>

                        {b.clientEmail && (
                          <a
                            href={`mailto:${b.clientEmail}?subject=Regarding Your Consultation Session with ${siteSettings.companyName}`}
                            className="bg-white border border-[#c2c6d1] hover:bg-[#eceef0] text-[#003461] text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Send Email</span>
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(
                              `Client: ${b.clientName}\nPhone: ${b.clientPhone}\nEmail: ${b.clientEmail || 'N/A'}\nDate: ${b.date} at ${b.timeSlot}\nTopic: ${b.topic}`
                            );
                            showNotification('Client details copied to clipboard!');
                          }}
                          className="bg-[#eceef0] hover:bg-[#e0e3e5] text-[#424750] text-xs font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer"
                        >
                          Copy Details
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 9: CLIENT QUOTES & LEADS */}
      {activeTab === 'quotes' && (
        <div className="py-4 space-y-6">
          <div className="bg-white border border-[#c2c6d1] rounded-2xl p-6 sm:p-8 institutional-shadow space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e0e3e5]">
              <div>
                <h2 className="text-lg font-bold text-[#003461]">Client Registrations & Scheme Quotes ({quotes.length})</h2>
                <p className="text-xs text-[#727781]">Clients who registered for mutual fund onboarding and personalized SIP quotes.</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#424750]">Filter:</span>
                <select
                  value={quoteStatusFilter}
                  onChange={(e) => setQuoteStatusFilter(e.target.value)}
                  className="px-3 py-1.5 border border-[#c2c6d1] rounded-xl text-xs bg-[#f7f9fb] text-[#191c1e]"
                >
                  <option value="all">All Leads ({quotes.length})</option>
                  <option value="New Lead">New Leads</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Meeting Scheduled">Meeting Scheduled</option>
                  <option value="Folio Opened">Folio Opened</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            {filteredQuotes.length === 0 ? (
              <div className="text-center py-12 text-[#727781] text-xs">
                No quote submissions found matching filter.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuotes.map((q) => {
                  const cleanPhone = q.phone.replace(/\D/g, '');
                  const waMsg = encodeURIComponent(
                    `Hello ${q.fullName}, thank you for registering with ${siteSettings.companyName} for your ${q.investmentGoal || 'wealth creation'} goal. Your reference ID is ${q.id}. How can we assist with your mutual fund investment today?`
                  );

                  return (
                    <div key={q.id} className="bg-[#f7f9fb] border border-[#c2c6d1] rounded-2xl p-5 space-y-3 hover:border-[#003461] transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#e0e3e5]">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-[#003461] bg-[#d3e4fe] px-2.5 py-0.5 rounded-md">
                            {q.id}
                          </span>
                          <span className="font-bold text-sm text-[#191c1e]">{q.fullName}</span>
                          {q.city && (
                            <span className="text-xs text-[#727781]">({q.city})</span>
                          )}
                          <span className="text-xs text-[#727781]">• {q.submittedAt}</span>
                        </div>

                        <select
                          value={q.status}
                          onChange={(e) => updateQuoteStatus(q.id, e.target.value as any)}
                          className="text-xs font-bold px-3 py-1 rounded-lg border bg-white text-[#003461]"
                        >
                          <option value="New Lead">New Lead</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Meeting Scheduled">Meeting Scheduled</option>
                          <option value="Folio Opened">Folio Opened</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] text-[#727781] uppercase font-bold block">Phone</span>
                          <div className="font-bold text-[#191c1e]">{q.phone}</div>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#727781] uppercase font-bold block">Target Goal / Fund</span>
                          <div className="font-bold text-[#003461] truncate">{q.investmentGoal || q.selectedFund || 'Mutual Fund SIP'}</div>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#727781] uppercase font-bold block">Investment Amount</span>
                          <div className="font-bold text-[#006d42]">₹{q.investmentAmount?.toLocaleString('en-IN') || 0} ({q.investmentType || 'SIP'})</div>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#727781] uppercase font-bold block">Email</span>
                          <div className="font-semibold text-[#424750] truncate">{q.email || 'N/A'}</div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#e0e3e5]">
                        <a
                          href={`https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${waMsg}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 shadow-2xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        <a
                          href={`tel:${cleanPhone}`}
                          className="bg-[#003461] hover:bg-[#004b87] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 shadow-2xs"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>

                        {q.email && (
                          <a
                            href={`mailto:${q.email}?subject=Your Mutual Fund Investment Request - ${siteSettings.companyName}`}
                            className="bg-white border border-[#c2c6d1] hover:bg-[#eceef0] text-[#003461] text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Email</span>
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(
                              `Lead: ${q.fullName}\nPhone: ${q.phone}\nEmail: ${q.email || 'N/A'}\nCity: ${q.city || 'N/A'}\nAmount: ₹${q.investmentAmount} (${q.investmentType})\nGoal: ${q.investmentGoal}`
                            );
                            showNotification('Lead details copied to clipboard!');
                          }}
                          className="text-[11px] bg-[#eceef0] hover:bg-[#e0e3e5] text-[#424750] px-2.5 py-1.5 rounded-lg cursor-pointer ml-auto"
                        >
                          Copy Lead
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 10: BLOGS & RESEARCH INSIGHTS */}
      {activeTab === 'blogs' && (
        <div className="py-4 space-y-6">
          <div className="bg-white border border-[#c2c6d1] rounded-2xl p-6 sm:p-8 institutional-shadow space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e0e3e5]">
              <div>
                <h2 className="text-lg font-bold text-[#003461]">Research Articles & Market Insights CMS</h2>
                <p className="text-xs text-[#727781]">Publish educational reports, commentary, and scheme reviews with custom cover images and alt text.</p>
              </div>
              <button
                onClick={handleOpenAddArticle}
                className="px-4 py-2.5 bg-[#006d42] hover:bg-[#005231] text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Write New Article</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((art) => (
                <div key={art.id} className="bg-[#f7f9fb] border border-[#c2c6d1] rounded-2xl overflow-hidden flex flex-col justify-between">
                  {art.imageUrl && (
                    <div className="w-full h-36 overflow-hidden bg-white border-b border-[#e0e3e5]">
                      <img
                        src={art.imageUrl}
                        alt={art.imageAlt || art.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-[#d3e4fe] text-[#003461] rounded">
                        {art.category}
                      </span>
                      <span className="text-[10px] text-[#727781]">{art.readTime}</span>
                    </div>
                    <h3 className="font-bold text-sm text-[#191c1e] line-clamp-2">{art.title}</h3>
                    <p className="text-xs text-[#424750] line-clamp-2">{art.summary}</p>
                  </div>

                  <div className="p-4 bg-white border-t border-[#e0e3e5] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#727781]">{art.author}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditArticle(art)}
                        className="p-1.5 text-[#003461] hover:bg-[#eceef0] rounded-lg transition-colors cursor-pointer"
                        title="Edit Article"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(art.id, art.title)}
                        className="p-1.5 text-[#ba1a1a] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 11: POLICIES & COMPLIANCE */}
      {activeTab === 'policies' && (
        <div className="py-4 space-y-6">
          <form onSubmit={handleSaveSettings} className="bg-white border border-[#c2c6d1] rounded-2xl p-6 sm:p-8 space-y-6 institutional-shadow">
            <div className="flex items-center justify-between pb-4 border-b border-[#e0e3e5]">
              <div>
                <h2 className="text-lg font-bold text-[#003461]">Privacy Policy, Terms & Statutory Disclosures</h2>
                <p className="text-xs text-[#727781]">Update regulatory disclosures and compliance clauses displayed across the platform.</p>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#003461] hover:bg-[#004b87] text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Policies</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                  Privacy Policy & Data Security
                </label>
                <textarea
                  rows={4}
                  value={settingsForm.privacyPolicy || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, privacyPolicy: e.target.value })}
                  placeholder="Enter privacy policy..."
                  className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-xs bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                  Terms of Service (AMFI Registered MFD Status)
                </label>
                <textarea
                  rows={4}
                  value={settingsForm.termsOfService || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, termsOfService: e.target.value })}
                  placeholder="Enter terms of service..."
                  className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-xs bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5">
                  AMFI Statutory Risk Disclosures
                </label>
                <textarea
                  rows={3}
                  value={settingsForm.riskDisclosures || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, riskDisclosures: e.target.value })}
                  placeholder="Mutual Fund investments are subject to market risks..."
                  className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-xs bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden font-mono"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#e0e3e5] flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#006d42] hover:bg-[#005231] text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save All Compliance Policies</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ARTICLE EDITOR MODAL (With Image URL & Alt Text) */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-4 border border-[#c2c6d1] shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#e0e3e5]">
              <h3 className="text-base font-bold text-[#003461]">
                {editingArticleId ? 'Edit Research Article' : 'Publish New Market Article'}
              </h3>
              <button
                onClick={() => setIsArticleModalOpen(false)}
                className="p-1 text-[#727781] hover:text-[#191c1e] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1">
                  Article Title
                </label>
                <input
                  type="text"
                  value={articleForm.title}
                  onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                  placeholder="e.g. The Power of SIP Compounding in Quality Mutual Funds"
                  required
                  className="w-full px-4 py-2 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={articleForm.category}
                    onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                    className="w-full px-4 py-2 border border-[#c2c6d1] rounded-xl text-xs bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                  >
                    <option value="Mutual Funds">Mutual Funds</option>
                    <option value="Market Insights">Market Insights</option>
                    <option value="Asset Allocation">Asset Allocation</option>
                    <option value="Tax Planning (ELSS)">Tax Planning (ELSS)</option>
                    <option value="Retirement Corpus">Retirement Corpus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={articleForm.readTime}
                    onChange={(e) => setArticleForm({ ...articleForm, readTime: e.target.value })}
                    placeholder="4 min read"
                    className="w-full px-4 py-2 border border-[#c2c6d1] rounded-xl text-xs bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                  />
                </div>
              </div>

              {/* Cover Image & Alt Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={articleForm.imageUrl}
                    onChange={(e) => setArticleForm({ ...articleForm, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-4 py-2 border border-[#c2c6d1] rounded-xl text-xs bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1">
                    Cover Image Alt Text
                  </label>
                  <input
                    type="text"
                    value={articleForm.imageAlt}
                    onChange={(e) => setArticleForm({ ...articleForm, imageAlt: e.target.value })}
                    placeholder="SIP Growth Chart Illustration"
                    className="w-full px-4 py-2 border border-[#c2c6d1] rounded-xl text-xs bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1">
                  Executive Summary
                </label>
                <textarea
                  rows={2}
                  value={articleForm.summary}
                  onChange={(e) => setArticleForm({ ...articleForm, summary: e.target.value })}
                  placeholder="Short summary..."
                  required
                  className="w-full px-4 py-2 border border-[#c2c6d1] rounded-xl text-xs bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1">
                  Article Body (Markdown Supported)
                </label>
                <textarea
                  rows={6}
                  value={articleForm.content}
                  onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                  placeholder="Write full article here..."
                  className="w-full px-4 py-2 border border-[#c2c6d1] rounded-xl text-xs bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#e0e3e5]">
                <label className="flex items-center gap-2 text-xs font-bold text-[#006d42] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={articleForm.featured}
                    onChange={(e) => setArticleForm({ ...articleForm, featured: e.target.checked })}
                    className="rounded text-[#006d42]"
                  />
                  <span>Mark as Featured</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsArticleModalOpen(false)}
                    className="px-4 py-2 border border-[#c2c6d1] rounded-xl text-xs font-bold text-[#424750] hover:bg-[#eceef0] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#006d42] text-white rounded-xl text-xs font-bold hover:bg-[#005231] cursor-pointer"
                  >
                    Save Article
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TESTIMONIAL EDITOR MODAL */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-4 border border-[#c2c6d1] shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#e0e3e5]">
              <h3 className="text-base font-bold text-[#003461]">
                {editingTestimonialId ? 'Edit Testimonial' : 'Add Client Testimonial & Review'}
              </h3>
              <button
                onClick={() => setIsTestimonialModalOpen(false)}
                className="p-1 text-[#727781] hover:text-[#191c1e] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={testimonialForm.clientName}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, clientName: e.target.value })}
                    placeholder="e.g. Priya Iyer"
                    required
                    className="w-full px-3.5 py-2 border border-[#c2c6d1] rounded-xl text-xs bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1">
                    Role & Location
                  </label>
                  <input
                    type="text"
                    value={testimonialForm.locationOrRole}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, locationOrRole: e.target.value })}
                    placeholder="Senior IT Consultant, Bengaluru"
                    className="w-full px-3.5 py-2 border border-[#c2c6d1] rounded-xl text-xs bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1">
                    Investment Category / Goal
                  </label>
                  <input
                    type="text"
                    value={testimonialForm.investmentType}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, investmentType: e.target.value })}
                    placeholder="Monthly SIP & Tax Saver (ELSS)"
                    className="w-full px-3.5 py-2 border border-[#c2c6d1] rounded-xl text-xs bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1">
                    Star Rating (1 to 5)
                  </label>
                  <select
                    value={testimonialForm.rating}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 border border-[#c2c6d1] rounded-xl text-xs bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1">
                    Client Photo URL
                  </label>
                  <input
                    type="url"
                    value={testimonialForm.avatarUrl}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, avatarUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2 border border-[#c2c6d1] rounded-xl text-xs bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1">
                    Photo Alt Text
                  </label>
                  <input
                    type="text"
                    value={testimonialForm.avatarAlt}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, avatarAlt: e.target.value })}
                    placeholder="Priya Iyer Investor Profile"
                    className="w-full px-3.5 py-2 border border-[#c2c6d1] rounded-xl text-xs bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1">
                  Video URL (YouTube or Direct Video Embed Link - Optional)
                </label>
                <input
                  type="url"
                  value={testimonialForm.videoUrl}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2 border border-[#c2c6d1] rounded-xl text-xs bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-[#006d42] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={testimonialForm.verified}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, verified: e.target.checked })}
                    className="rounded text-[#006d42]"
                  />
                  <span>Show Verified Investor Badge</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1">
                  Client Review / Testimonial Text
                </label>
                <textarea
                  rows={4}
                  value={testimonialForm.text}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, text: e.target.value })}
                  placeholder="Write the investor's experience and words here..."
                  required
                  className="w-full px-4 py-2 border border-[#c2c6d1] rounded-xl text-xs bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#e0e3e5]">
                <button
                  type="button"
                  onClick={() => setIsTestimonialModalOpen(false)}
                  className="px-4 py-2 border border-[#c2c6d1] rounded-xl text-xs font-bold text-[#424750] hover:bg-[#eceef0] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#006d42] text-white rounded-xl text-xs font-bold hover:bg-[#005231] cursor-pointer"
                >
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
