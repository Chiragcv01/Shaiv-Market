import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { ActiveScreen } from '../types';
import { useApp } from '../context/AppContext';
import { Bell, Menu, X, ExternalLink, ChevronRight, SlidersHorizontal, Search, Phone, MessageCircle } from 'lucide-react';
import { pathForScreen } from '../seo/routes';

interface NavbarProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenSearch: () => void;
  notificationCount?: number;
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

export const Navbar: React.FC<NavbarProps> = ({
  activeScreen,
  onNavigate,
  onOpenNotifications,
  onOpenProfile,
  onOpenSearch,
  notificationCount = 2
}) => {
  const headerRef = useRef<HTMLElement>(null);
  const { currentUser, banner, siteSettings, navItems } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  // hide on scroll down, reveal on scroll up
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    if (mobileMenuOpen) return;
    if (y > prev + 4 && y > 240) setHidden(true);
    else if (y < prev - 4 || y < 240) setHidden(false);
  });

  // expose the visible header height so sticky elements sit just below it
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const set = () => {
      document.documentElement.style.setProperty('--header-h', hidden ? '0px' : `${el.offsetHeight}px`);
      // full height at the top of the page, used to pad the content below the fixed header
      if (window.scrollY < 10) document.documentElement.style.setProperty('--header-full', `${el.offsetHeight}px`);
    };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, [hidden]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const visibleNavItems = [...navItems.filter((i) => i.screenId !== 'blog'), { id: 'nav-blog', label: 'Blog', screenId: 'blog' as ActiveScreen, isVisible: true, order: 2.5 }]
    .filter((i) => i.isVisible).sort((a, b) => a.order - b.order);
  const go = (screen: ActiveScreen) => { onNavigate(screen); setMobileMenuOpen(false); };
  const wa = (siteSettings.whatsappSupportNumber || '').replace(/[^0-9]/g, '');
  const phone = (siteSettings.supportPhone || '').replace(/[^0-9+]/g, '');

  return (
    <motion.header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 w-full z-50"
      animate={{ y: hidden ? '-100%' : '0%' }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
    >
      {/* announcement banner, collapses once you scroll */}
      <AnimatePresence initial={false}>
        {banner.enabled && !scrolled && (
          <motion.div
            id="site-announcement-banner"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full overflow-hidden bg-[#0A1D30] text-white"
          >
            <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-center gap-2.5 text-xs">
              {banner.badgeText && (
                <span className="hidden sm:inline bg-[#E3B65C] text-[#0F2740] font-semibold text-[10px] px-2 py-0.5 rounded-sm shrink-0">{banner.badgeText}</span>
              )}
              <span className="text-white/85 truncate">{banner.text}</span>
              {banner.linkText && (
                <button
                  onClick={() => {
                    if (typeof banner.linkTarget === 'string' && (banner.linkTarget.startsWith('http') || banner.isExternalLink)) {
                      window.open(banner.linkTarget, '_blank');
                    } else {
                      go((banner.linkTarget as ActiveScreen) || 'insights');
                    }
                  }}
                  className="font-semibold text-[#E3B65C] hover:text-white inline-flex items-center gap-0.5 cursor-pointer whitespace-nowrap shrink-0"
                >
                  {banner.linkText}
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`w-full transition-all duration-300 ${scrolled ? 'bg-white/85 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(15,39,64,0.25)]' : 'bg-white/95 backdrop-blur-md'} border-b border-[#D3DCE6]/60`}>
        <div className={`max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300 ${scrolled ? 'h-16' : 'h-18 sm:h-20'}`}>
          <div className="flex items-center gap-3 sm:gap-5 lg:gap-8 min-w-0">
            <a id="nav-logo" href="/" aria-label={`${siteSettings.companyName} home`} onClick={(e) => { if (e.metaKey || e.ctrlKey) return; e.preventDefault(); go('home'); }} className="flex items-center gap-2.5 text-left group cursor-pointer shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-[#E3B65C]">
              {siteSettings.logoImageUrl ? (
                <motion.img
                  src={siteSettings.logoImageUrl}
                  alt=""
                  whileHover={{ rotate: -8, scale: 1.06 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className={`object-contain rounded-full bg-white shrink-0 transition-all duration-300 ${scrolled ? 'w-9 h-9' : 'w-10 h-10 sm:w-12 sm:h-12'}`}
                />
              ) : (
                <span className="w-9 h-9 rounded-lg bg-[#0F2740] flex items-center justify-center text-white font-bold">{siteSettings.logoInitial || 'SM'}</span>
              )}
              <span className="flex flex-col min-w-0">
                <span className="font-display text-lg sm:text-2xl font-semibold text-[#0F2740] leading-none truncate">{siteSettings.companyName}</span>
                <span className="hidden sm:block text-[11px] text-[#8A6420] mt-0.5 truncate max-w-[240px]">
                  AMFI Registered MFD, {siteSettings.sebiRegNumber}
                </span>
              </span>
            </a>

            <nav className="hidden xl:flex items-center text-sm font-medium" onMouseLeave={() => setHovered(null)}>
              {visibleNavItems.map((item) => {
                if (item.externalUrl) {
                  return (
                    <a key={item.id} href={item.externalUrl} target="_blank" rel="noreferrer"
                      className="px-3 py-2 text-[#43566B] hover:text-[#0F2740] inline-flex items-center gap-1">
                      {item.label}<ExternalLink className="w-3 h-3" />
                    </a>
                  );
                }
                const target = item.screenId || 'home';
                const active = activeScreen === target;
                return (
                  <a
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    href={pathForScreen(target)}
                    onClick={(e) => { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); go(target); }}
                    onMouseEnter={() => setHovered(item.id)}
                    aria-current={active ? 'page' : undefined}
                    className={`relative px-3 py-2 rounded-lg cursor-pointer whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-[#E3B65C]
                      ${active ? 'text-[#0F2740]' : 'text-[#43566B] hover:text-[#0F2740]'}`}
                  >
                    {hovered === item.id && (
                      <motion.span layoutId="nav-hover" className="absolute inset-0 rounded-lg bg-[#EEF3F8]"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }} />
                    )}
                    <span className="relative">{item.label}</span>
                    {active && (
                      <motion.span layoutId="nav-active" className="absolute left-3 right-3 -bottom-0.5 h-[3px] rounded-full bg-[#E3B65C]"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }} />
                    )}
                  </a>
                );
              })}
              {currentUser?.role === 'admin' && (
                <button id="nav-link-admin" onClick={() => go('admin')}
                  className={`ml-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer
                    ${activeScreen === 'admin' ? 'bg-[#0F2740] text-white' : 'bg-[#E3ECF5] text-[#0F2740]'}`}>
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Admin
                </button>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={onOpenSearch}
              aria-label="Search the site"
              className="inline-flex items-center gap-2 rounded-lg p-2 sm:pl-3 sm:pr-2 sm:py-2 text-[#43566B] hover:text-[#0F2740] hover:bg-[#EEF3F8] sm:ring-1 sm:ring-[#D3DCE6] cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[#E3B65C]"
            >
              <Search className="w-4 h-4" />
              <span className="hidden md:inline text-sm">Search</span>
              <kbd className="hidden md:inline text-[11px] rounded bg-[#EEF3F8] px-1.5 py-0.5 text-[#6B7C8F]">{isMac ? '⌘K' : 'Ctrl K'}</kbd>
            </button>

            <button id="nav-notifications-btn" onClick={onOpenNotifications} aria-label="Updates"
              className="relative p-2 text-[#43566B] hover:text-[#0F2740] hover:bg-[#EEF3F8] rounded-lg cursor-pointer">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {notificationCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E3B65C] rounded-full ring-2 ring-white" />}
            </button>

            {currentUser && (
              <button id="nav-profile-btn" onClick={onOpenProfile} title={currentUser.name}
                className="w-8 h-8 rounded-full bg-[#0F2740] text-white text-xs font-bold cursor-pointer">
                {currentUser.name.charAt(0)}
              </button>
            )}

            <motion.button
              id="nav-open-account-btn"
              onClick={() => go('open-account')}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="hidden sm:inline-flex items-center rounded-lg bg-[#E3B65C] hover:bg-[#EDC77A] text-[#0F2740] font-semibold text-sm px-4 py-2.5 cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F2740]"
            >
              Start a SIP
            </motion.button>

            <button id="nav-mobile-menu-toggle" onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen}
              className="xl:hidden p-2 text-[#0F2740] hover:bg-[#EEF3F8] rounded-lg cursor-pointer">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* full-screen mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="xl:hidden fixed inset-x-0 bottom-0 bg-[#0F2740] text-white overflow-y-auto"
            style={{ top: 'var(--header-h, 80px)' }}
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.ul className="px-6 pt-8 space-y-1"
              initial="hidden" animate="show"
              variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } } }}>
              {[{ id: 'home', label: 'Home', screenId: 'home' as ActiveScreen }, ...visibleNavItems].map((item) => {
                const target = (item.screenId || 'home') as ActiveScreen;
                const active = activeScreen === target;
                return (
                  <motion.li key={item.id} variants={{ hidden: { opacity: 0, x: 24 }, show: { opacity: 1, x: 0 } }}>
                    <a href={pathForScreen(target)} onClick={(e) => { e.preventDefault(); go(target); }}
                      className={`w-full text-left font-display text-[34px] leading-tight py-1.5 cursor-pointer flex items-center justify-between
                        ${active ? 'text-[#E3B65C]' : 'text-white/90 hover:text-white'}`}>
                      {item.label}
                      {active && <span className="w-2.5 h-2.5 rounded-full bg-[#E3B65C]" />}
                    </a>
                  </motion.li>
                );
              })}
              {currentUser?.role === 'admin' && (
                <motion.li variants={{ hidden: { opacity: 0, x: 24 }, show: { opacity: 1, x: 0 } }}>
                  <button onClick={() => go('admin')} className="w-full text-left font-display text-2xl py-2 text-[#9DB4CC] cursor-pointer">Admin</button>
                </motion.li>
              )}
            </motion.ul>

            <motion.div className="px-6 py-8 grid grid-cols-2 gap-3"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <button onClick={() => go('open-account')}
                className="col-span-2 rounded-xl bg-[#E3B65C] text-[#0F2740] font-semibold py-3.5 cursor-pointer">Start a SIP</button>
              {wa && (
                <a href={`https://wa.me/${wa}?text=${encodeURIComponent('Hi Chirag, I would like to know more about investing with Shaiv Market.')}`}
                  target="_blank" rel="noreferrer"
                  className="rounded-xl ring-1 ring-white/20 py-3 inline-flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" /> WhatsApp
                </a>
              )}
              {phone && (
                <a href={`tel:${phone}`} className="rounded-xl ring-1 ring-white/20 py-3 inline-flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4 text-[#E3B65C]" /> Call
                </a>
              )}
              <p className="col-span-2 text-xs text-white/50 mt-2">{siteSettings.companyName}, AMFI Registered MFD, {siteSettings.sebiRegNumber}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
