import React, { useState } from 'react';
import { ActiveScreen } from './types';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeScreen } from './components/HomeScreen';
import { BookingScreen } from './components/BookingScreen';
import { OpenAccountScreen } from './components/OpenAccountScreen';
import { InvestScreen } from './components/InvestScreen';
import { CalculatorsScreen } from './components/CalculatorsScreen';
import { InsightsScreen } from './components/InsightsScreen';
import { ContactUsScreen } from './components/ContactUsScreen';
import { AboutUsScreen } from './components/AboutUsScreen';
import { TestimonialsScreen } from './components/TestimonialsScreen';
import { AdminPortalScreen } from './components/AdminPortalScreen';
import { AuthScreen } from './components/AuthScreen';
import { NotificationModal } from './components/NotificationModal';
import { AccountProfileModal } from './components/AccountProfileModal';

export default function App() {
  const { activeScreen, setActiveScreen } = useApp();
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [notificationCount, setNotificationCount] = useState<number>(2);

  // Scroll to top when changing screens
  const handleNavigate = (screen: ActiveScreen) => {
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] flex flex-col font-sans selection:bg-[#003461] selection:text-white">
      
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
        {activeScreen === 'home' && (
          <HomeScreen onNavigate={handleNavigate} />
        )}

        {activeScreen === 'booking' && (
          <BookingScreen onNavigate={handleNavigate} />
        )}

        {activeScreen === 'open-account' && (
          <OpenAccountScreen onNavigate={handleNavigate} />
        )}

        {activeScreen === 'invest' && (
          <InvestScreen onNavigate={handleNavigate} />
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

      {/* Institutional SEBI-registered Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}

