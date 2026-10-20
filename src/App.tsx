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
import { AdminPortalScreen } from './components/AdminPortalScreen';
import { AuthScreen } from './components/AuthScreen';
import { NotificationModal } from './components/NotificationModal';
import { AccountProfileModal } from './components/AccountProfileModal';

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return <motion.div aria-hidden className="fixed top-0 left-0 right-0 h-[3px] bg-[#E3B65C] origin-left z-[70]" style={{ scaleX }} />;
}

export default function App() {
  const { activeScreen, setActiveScreen } = useApp();
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [notificationCount, setNotificationCount] = useState<number>(0);

  // Private admin entry: only reachable at /sm-admin (not linked anywhere on the site)
  React.useEffect(() => {
    if (window.location.pathname.replace(/\/+$/, '') === '/sm-admin') {
      setActiveScreen('admin');
      const meta = document.createElement('meta');
      meta.name = 'robots';
      meta.content = 'noindex, nofollow';
      document.head.appendChild(meta);
    }
  }, []);

  // Scroll to top when changing screens
  const handleNavigate = (screen: ActiveScreen) => {
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <MotionConfig reducedMotion="user">
    <ScrollProgress />
    <div className="min-h-screen w-full overflow-x-clip bg-[#f7f9fb] text-[#191c1e] flex flex-col font-sans selection:bg-[#003461] selection:text-white">
      
      {/* Top Fixed Navigation Bar */}
      <Navbar
        activeScreen={activeScreen}
        onNavigate={handleNavigate}
        onOpenNotifications={() => {
          setIsNotificationOpen(true);
          setNotificationCount(0);
        }}
        onOpenProfile={() => setIsProfileOpen(true)}
        notificationCount={notificationCount}
      />

      {/* Main Screen Canvas */}
      <main className="flex-grow pt-20">
        <AnimatePresence mode="wait">
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
              <AdminPortalScreen onNavigate={handleNavigate} />
            )}

            {activeScreen === 'auth' && (
              <AuthScreen onNavigate={handleNavigate} />
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

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
    </MotionConfig>
  );
}

