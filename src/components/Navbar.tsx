import React, { useState } from 'react';
import { ActiveScreen } from '../types';
import { useApp } from '../context/AppContext';
import {
  Bell,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  LogIn,
  SlidersHorizontal,
  FileText
} from 'lucide-react';

interface NavbarProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  notificationCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeScreen,
  onNavigate,
  onOpenNotifications,
  onOpenProfile,
  notificationCount = 2
}) => {
  const { currentUser, banner, siteSettings, navItems } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Visible nav items sorted by order
  const visibleNavItems = [...navItems]
    .filter((item) => item.isVisible)
    .sort((a, b) => a.order - b.order);

  const handleNavClick = (screen: ActiveScreen) => {
    onNavigate(screen);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 shadow-xs">
      
      {/* 1. TOP ANNOUNCEMENT BANNER (Managed by Admin) */}
      {banner.enabled && (
        <div
          id="site-announcement-banner"
          className={`w-full py-1.5 px-4 text-xs flex items-center justify-center gap-2 transition-colors ${
            banner.themeColor === 'green'
              ? 'bg-[#006d42] text-white'
              : banner.themeColor === 'amber'
              ? 'bg-amber-700 text-white'
              : banner.themeColor === 'ruby'
              ? 'bg-[#ba1a1a] text-white'
              : 'bg-[#003461] text-white'
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2.5 flex-wrap text-center">
            {banner.badgeText && (
              <span className="bg-white/20 text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm">
                {banner.badgeText}
              </span>
            )}
            <span className="font-normal text-xs">{banner.text}</span>
            {banner.linkText && (
              <button
                onClick={() => {
                  if (typeof banner.linkTarget === 'string' && (banner.linkTarget.startsWith('http') || banner.isExternalLink)) {
                    window.open(banner.linkTarget, '_blank');
                  } else {
                    handleNavClick((banner.linkTarget as ActiveScreen) || 'insights');
                  }
                }}
                className="underline font-bold text-xs hover:text-[#96f6bd] ml-1 flex items-center gap-1 cursor-pointer"
              >
                <span>{banner.linkText}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. MAIN NAVIGATION BAR */}
      <div className="bg-[#f7f9fb]/95 backdrop-blur-md border-b border-[#c2c6d1]/60 w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-2 sm:gap-4 w-full">
          
          {/* Brand Logo & Desktop Nav Links */}
          <div className="flex items-center gap-3 sm:gap-5 lg:gap-8 min-w-0">
            <button
              id="nav-logo"
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 sm:gap-2.5 text-left group focus:outline-hidden cursor-pointer shrink-0"
            >
              {siteSettings.logoImageUrl ? (
                <img
                  src={siteSettings.logoImageUrl}
                  alt={siteSettings.companyName}
                  className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-lg shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#003461] flex items-center justify-center text-white shadow-xs shrink-0">
                  <span className="font-extrabold text-sm sm:text-base leading-none tracking-tight">
                    {siteSettings.logoInitial || 'SM'}
                  </span>
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-base sm:text-xl lg:text-2xl font-black tracking-tight text-[#003461] group-hover:text-[#004b87] transition-colors leading-none truncate max-w-[130px] sm:max-w-[180px] md:max-w-none">
                  {siteSettings.companyName}
                </span>
                <span className="hidden sm:block text-[9px] sm:text-[10px] font-semibold text-[#006d42] tracking-wider uppercase mt-0.5 max-w-[140px] md:max-w-[200px] lg:max-w-[240px] truncate">
                  {siteSettings.tagline || 'AMFI Registered Mutual Fund Distributor'}
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links - Shown on xl screens (1280px+) where horizontal space easily accommodates all links */}
            <nav className="hidden xl:flex items-center gap-3.5 2xl:gap-5 text-[13px] 2xl:text-[14px] font-medium text-[#424750] shrink-0">
              {visibleNavItems.map((item) => {
                if (item.externalUrl) {
                  return (
                    <a
                      key={item.id}
                      href={item.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2 transition-colors duration-150 hover:text-[#006d42] text-[#424750] flex items-center gap-1 shrink-0 whitespace-nowrap"
                    >
                      <span>{item.label}</span>
                      <ExternalLink className="w-3 h-3 text-[#727781]" />
                    </a>
                  );
                }

                const screenTarget = item.screenId || 'home';
                const isActive = activeScreen === screenTarget;
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => handleNavClick(screenTarget)}
                    className={`relative py-2 transition-colors duration-150 hover:text-[#006d42] cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                      isActive ? 'text-[#003461] font-bold' : 'text-[#424750]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#003461] rounded-full" />
                    )}
                  </button>
                );
              })}

              {/* Show Admin Portal button ONLY if verified logged-in admin */}
              {currentUser?.role === 'admin' && (
                <button
                  id="nav-link-admin"
                  onClick={() => handleNavClick('admin')}
                  className={`relative py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                    activeScreen === 'admin'
                      ? 'bg-[#003461] text-white shadow-xs'
                      : 'bg-[#d3e4fe] text-[#003461] hover:bg-[#b8d5fc]'
                  }`}
                  title="Admin CMS & Operations Portal"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Admin CMS</span>
                </button>
              )}
            </nav>
          </div>

          {/* Right Action Icons & CTA - Fully adaptable on mobile, tablet, and desktop */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 lg:gap-3.5 shrink-0">
            
            {/* Notification Button */}
            <button
              id="nav-notifications-btn"
              onClick={onOpenNotifications}
              className="relative p-1.5 sm:p-2 text-[#424750] hover:text-[#003461] hover:bg-[#eceef0] rounded-full transition-colors focus:outline-hidden cursor-pointer shrink-0"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-2 h-2 bg-[#006d42] rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* User Profile / Auth Button */}
            {currentUser ? (
              <button
                id="nav-profile-btn"
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 pl-1.5 sm:pl-2.5 sm:pr-3 bg-white border border-[#c2c6d1] hover:border-[#003461] rounded-full transition-colors focus:outline-hidden cursor-pointer shadow-2xs shrink-0"
                title={`${currentUser.name} (${currentUser.role.toUpperCase()})`}
              >
                <div className="w-6 h-6 rounded-full bg-[#003461] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-[#191c1e] truncate max-w-[90px] xl:max-w-[110px] leading-tight">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] font-bold text-[#006d42] uppercase tracking-wider leading-none">
                    {currentUser.role === 'admin' ? 'Admin' : 'Client'}
                  </span>
                </div>
              </button>
            ) : (
              <button
                id="nav-login-btn"
                onClick={() => handleNavClick('auth')}
                className="flex items-center gap-1 sm:gap-1.5 text-xs font-bold text-[#003461] hover:text-[#004b87] bg-[#d3e4fe] hover:bg-[#c2d7f8] p-1.5 sm:px-3 sm:py-2 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Sign In / Register"
              >
                <LogIn className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Open Account CTA Button - Adaptable on ALL screens: never cuts off */}
            <button
              id="nav-open-account-btn"
              onClick={() => handleNavClick('open-account')}
              className="inline-flex items-center justify-center gap-1 sm:gap-1.5 bg-[#003461] text-white font-bold text-xs md:text-sm px-2.5 sm:px-3.5 lg:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-lg hover:bg-[#004b87] active:bg-[#002647] shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer shrink-0 whitespace-nowrap"
              title="Request Personalized Investment Quote"
            >
              <FileText className="w-3.5 h-3.5 shrink-0 text-[#96f6bd] hidden sm:inline" />
              {/* Mobile (<640px) & Tablet / Compact Desktop (<1024px) */}
              <span className="inline lg:hidden">Get Quote</span>
              {/* Large Desktop (>=1024px) */}
              <span className="hidden lg:inline">Get Investment Quote</span>
            </button>

            {/* Mobile / Tablet Menu Hamburger (active <1280px so header never crowds) */}
            <button
              id="nav-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 sm:p-2 text-[#424750] hover:text-[#003461] hover:bg-[#eceef0] rounded-lg focus:outline-hidden cursor-pointer shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Dropdown (<1280px) */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-[#c2c6d1] px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top-2 max-h-[calc(100vh-80px)] overflow-y-auto">
          {visibleNavItems.map((item) => {
            if (item.externalUrl) {
              return (
                <a
                  key={item.id}
                  href={item.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-base font-medium text-[#424750] hover:bg-[#f7f9fb]"
                >
                  <span>{item.label}</span>
                  <ExternalLink className="w-4 h-4 text-[#727781]" />
                </a>
              );
            }
            const screenTarget = item.screenId || 'home';
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(screenTarget)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                  activeScreen === screenTarget
                    ? 'bg-[#eceef0] text-[#003461] font-bold'
                    : 'text-[#424750] hover:bg-[#f7f9fb]'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`w-full text-left px-3 py-2.5 rounded-md text-base font-bold transition-colors flex items-center justify-between ${
                activeScreen === 'admin'
                  ? 'bg-[#003461] text-white'
                  : 'bg-[#d3e4fe] text-[#003461]'
              }`}
            >
              <span>Admin CMS & Settings</span>
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          )}

          {!currentUser && (
            <button
              onClick={() => handleNavClick('auth')}
              className="w-full text-left px-3 py-2.5 rounded-md text-base font-semibold text-[#003461] hover:bg-[#f7f9fb] flex items-center justify-between"
            >
              <span>Sign In / Register</span>
              <LogIn className="w-4 h-4" />
            </button>
          )}

          <div className="pt-2 border-t border-[#e0e3e5] space-y-2">
            <button
              onClick={() => handleNavClick('open-account')}
              className="w-full bg-[#003461] text-white font-bold text-sm py-3 rounded-lg hover:bg-[#004b87] text-center cursor-pointer flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-[#96f6bd]" />
              <span>Get Investment Quote</span>
            </button>
            {siteSettings.enableMfReferralDirect && siteSettings.mfReferralLink && (
              <a
                href={siteSettings.mfReferralLink}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-white border border-[#006d42] text-[#006d42] font-semibold text-xs py-2 rounded-lg text-center flex items-center justify-center gap-1.5"
              >
                <span>{siteSettings.mfReferralLinkTitle}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
};


