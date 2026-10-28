import React, { useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from 'motion/react';
import { ActiveScreen } from './types';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeScreen } from './components/HomeScreen';
import { BookingScreen } from './components/BookingScreen';
import { OpenAccountScreen } from './components/OpenAccountScreen';
import { CalculatorsScreen } from './components/CalculatorsScreen';
import { InsightsScreen } from './components/InsightsScreen';
import { ContactUsScreen } from './components/ContactUsScreen';
import { AboutUsScreen } from './components/AboutUsScreen';
import { TestimonialsScreen } from './components/TestimonialsScreen';
const AdminPortalScreen = React.lazy(() => import('./components/AdminPortalScreen').then((m) => ({ default: m.AdminPortalScreen })));
const AuthScreen = React.lazy(() => import('./components/AuthScreen').then((m) => ({ default: m.AuthScreen })));
import { NotificationModal } from './components/NotificationModal';
import { AccountProfileModal } from './components/AccountProfileModal';
import { CommandPalette } from './components/interactive/CommandPalette';
import { NotFoundScreen } from './components/NotFoundScreen';
import { BlogScreen } from './components/BlogScreen';
import { ResourceScreen } from './components/ResourceScreen';
import { EngagementLayer } from './components/interactive/EngagementLayer';
import { routeForPath, pathForScreen } from './seo/routes';
import { navigateTo } from './utils/navigate';
import { applyHead } from './seo/head';

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return <motion.div aria-hidden className="fixed top-0 left-0 right-0 h-[3px] bg-[#E3B65C] origin-left z-[70]" style={{ scaleX }} />;
}

export default function App() {
  const { activeScreen, setActiveScreen, siteSettings } = useApp();
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Ctrl/Cmd+K or "/" opens search
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /input|textarea|select/i.test((e.target as HTMLElement)?.tagName) || (e.target as HTMLElement)?.isContentEditable;
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setPaletteOpen((v) => !v); }
      else if (e.key === '/' && !typing) { e.preventDefault(); setPaletteOpen(true); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [notificationCount, setNotificationCount] = useState<number>(0);

  // Every screen has a real URL: push it when the screen changes, and keep <head> in sync
  React.useEffect(() => {
    const cur = routeForPath(window.location.pathname);
    if (cur.screen !== activeScreen) window.history.pushState({}, '', pathForScreen(activeScreen));
    applyHead(routeForPath(window.location.pathname));
  }, [activeScreen]);

  // Browser back / forward
  React.useEffect(() => {
    const onPop = () => {
      const r = routeForPath(window.location.pathname);
      setActiveScreen(r.screen);
      applyHead(r);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Scroll to top when changing screens
  const handleNavigate = (screen: ActiveScreen) => {
    // already on this screen but on a sub-page (a calculator, a blog post): go to the screen's main page
    const target = pathForScreen(screen);
    if (screen === activeScreen && window.location.pathname !== target) { navigateTo(target); return; }
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <MotionConfig reducedMotion="user">
    <ScrollProgress />
    <div className="min-h-screen w-full overflow-x-clip bg-[#F6F8FB] text-[#13263B] flex flex-col font-sans selection:bg-[#0F2740] selection:text-white">
      
      {/* Top Fixed Navigation Bar */}
      <Navbar
        activeScreen={activeScreen}
        onNavigate={handleNavigate}
        onOpenNotifications={() => {
          setIsNotificationOpen(true);
          setNotificationCount(0);
        }}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSearch={() => setPaletteOpen(true)}
        notificationCount={notificationCount}
      />

      {/* Main Screen Canvas */}
      <main className="flex-grow" style={{ paddingTop: 'var(--header-full, 80px)' }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeScreen}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeScreen === 'home' && (
              <HomeScreen onNavigate={handleNavigate} />
            )}

            {activeScreen === 'booking' && (
              <BookingScreen onNavigate={handleNavigate} />
            )}

            {activeScreen === 'open-account' && (
              <OpenAccountScreen onNavigate={handleNavigate} />
            )}

            {activeScreen === 'calculators' && (
              <CalculatorsScreen onNavigate={handleNavigate} />
            )}

            {activeScreen === 'insights' && (
              <InsightsScreen onNavigate={handleNavigate} />
            )}

            {activeScreen === 'contact' && (
              <ContactUsScreen onNavigate={handleNavigate} />
            )}

            {activeScreen === 'about' && (
              <AboutUsScreen onNavigate={handleNavigate} />
            )}

            {activeScreen === 'testimonials' && (
              <TestimonialsScreen onNavigate={handleNavigate} />
            )}

            {activeScreen === 'admin' && (
              <React.Suspense fallback={<div className="py-32 text-center text-[#6B7C8F]">Loading…</div>}><AdminPortalScreen onNavigate={handleNavigate} /></React.Suspense>
            )}

            {activeScreen === 'blog' && <BlogScreen />}

            {activeScreen === 'resource' && <ResourceScreen />}

            {activeScreen === 'not-found' && (
              <NotFoundScreen onNavigate={handleNavigate} onSearch={() => setPaletteOpen(true)} />
            )}

            {activeScreen === 'auth' && (
              <React.Suspense fallback={<div className="py-32 text-center text-[#6B7C8F]">Loading…</div>}><AuthScreen onNavigate={handleNavigate} /></React.Suspense>
            )}
      </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Modals */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onNavigate={handleNavigate}
      />

      <AccountProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onNavigate={handleNavigate}
      />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={handleNavigate}
        whatsapp={(siteSettings.whatsappSupportNumber || '').replace(/[^0-9]/g, '')}
        phone={(siteSettings.supportPhone || '').replace(/[^0-9+]/g, '')}
        email={siteSettings.supportEmail || ''}
      />
      {activeScreen !== 'admin' && (
        <EngagementLayer
          whatsapp={(siteSettings.whatsappSupportNumber || '').replace(/[^0-9]/g, '')}
          founder={siteSettings.founderName || 'Chirag Sharma'}
          photo={siteSettings.founderPhotoUrl}
          onNavigate={handleNavigate}
          activeScreen={activeScreen}
        />
      )}

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
    </MotionConfig>
  );
}

