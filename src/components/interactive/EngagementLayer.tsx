import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { MessageCircle, X, CalendarCheck } from 'lucide-react';
import { ActiveScreen } from '../../types';

const QUICK = [
  'I want to start a SIP',
  'Please review my existing portfolio',
  'I want to save tax with ELSS',
  'Help me plan for retirement'
];

const safeSession = {
  get(k: string) { try { return sessionStorage.getItem(k); } catch { return null; } },
  set(k: string, v: string) { try { sessionStorage.setItem(k, v); } catch { /* ignore */ } }
};

/** Floating WhatsApp launcher + a one-time "before you go" free review offer. */
export const EngagementLayer: React.FC<{
  whatsapp: string;
  founder: string;
  photo?: string;
  onNavigate: (s: ActiveScreen) => void;
  activeScreen: ActiveScreen;
}> = ({ whatsapp, founder, photo, onNavigate, activeScreen }) => {
  const [showFab, setShowFab] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [offer, setOffer] = useState(false);
  const arrived = useRef(Date.now());
  const firstName = founder.split(' ')[0] || 'us';

  const { scrollY, scrollYProgress } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => { if (y > 500) setShowFab(true); });
  useEffect(() => { const t = setTimeout(() => setShowFab(true), 6000); return () => clearTimeout(t); }, []);

  const trigger = () => {
    if (safeSession.get('sm_offer_seen') || activeScreen === 'booking' || activeScreen === 'admin') return;
    if (Date.now() - arrived.current < 20000) return;
    safeSession.set('sm_offer_seen', '1');
    setOffer(true);
  };

  // desktop: pointer heads for the tab bar / close button
  useEffect(() => {
    const onOut = (e: MouseEvent) => { if (!e.relatedTarget && e.clientY <= 4) trigger(); };
    document.addEventListener('mouseout', onOut);
    return () => document.removeEventListener('mouseout', onOut);
  });
  // mobile: read most of the page and lingered
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (p > 0.75 && window.matchMedia('(pointer: coarse)').matches) trigger();
  });

  const waLink = (msg: string) => `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi ${firstName}, ${msg.charAt(0).toLowerCase()}${msg.slice(1)}.`)}`;

  return (
    <>
      {/* WhatsApp launcher */}
      {whatsapp && (
        <div className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-[60] flex flex-col items-end gap-3">
          <AnimatePresence>
            {chatOpen && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className="w-[300px] rounded-2xl bg-white shadow-[0_24px_70px_-20px_rgba(10,29,48,0.5)] overflow-hidden origin-bottom-right"
                role="dialog"
                aria-label={`Message ${firstName} on WhatsApp`}
              >
                <div className="bg-[#0F2740] text-white p-4 flex items-center gap-3">
                  {photo ? <img src={photo} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-[#E3B65C]" />
                    : <span className="w-10 h-10 rounded-full bg-[#E3B65C]" />}
                  <div className="min-w-0">
                    <p className="font-semibold leading-tight">{founder}</p>
                    <p className="text-xs text-white/65">AMFI Registered MFD, usually replies the same day</p>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <p className="text-xs text-[#6B7C8F] px-1">Pick a message to start:</p>
                  {QUICK.map((m, i) => (
                    <motion.a
                      key={m}
                      href={waLink(m)}
                      target="_blank"
                      rel="noreferrer"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className="block rounded-xl bg-[#EEF3F8] hover:bg-[#E3ECF5] px-3 py-2.5 text-sm text-[#0F2740] transition-colors"
                    >
                      {m}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showFab && (
              <motion.button
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                onClick={() => setChatOpen((v) => !v)}
                aria-expanded={chatOpen}
                aria-label={chatOpen ? 'Close WhatsApp options' : `Chat with ${firstName} on WhatsApp`}
                className="relative w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.7)] flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F2740]"
              >
                {!chatOpen && (
                  <motion.span aria-hidden className="absolute inset-0 rounded-full bg-[#25D366]"
                    animate={{ scale: [1, 1.6], opacity: [0.5, 0] }} transition={{ duration: 1.8, repeat: 3, delay: 0.6 }} />
                )}
                <AnimatePresence mode="wait" initial={false}>
                  {chatOpen ? (
                    <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                      <X className="w-6 h-6" />
                    </motion.span>
                  ) : (
                    <motion.span key="wa" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                      <MessageCircle className="w-6 h-6" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* one-time free review offer */}
      <AnimatePresence>
        {offer && (
          <motion.aside
            initial={{ opacity: 0, x: -40, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed left-4 bottom-4 sm:left-6 sm:bottom-6 z-[60] w-[min(360px,calc(100vw-6rem))] rounded-2xl bg-[#0F2740] text-white p-5 shadow-[0_30px_80px_-20px_rgba(10,29,48,0.7)]"
            aria-label="Free portfolio review offer"
          >
            <button onClick={() => setOffer(false)} aria-label="Dismiss"
              className="absolute top-3 right-3 p-1 text-white/60 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            <p className="font-display text-2xl font-semibold leading-tight pr-6">Before you go: a free 15-minute portfolio review.</p>
            <p className="mt-2 text-sm text-white/75">{firstName} will look at your current funds and goals. No charges, no obligation.</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => { setOffer(false); onNavigate('booking'); }}
                className="inline-flex items-center gap-2 rounded-xl bg-[#E3B65C] hover:bg-[#EDC77A] text-[#0F2740] font-semibold px-4 py-2.5 text-sm cursor-pointer">
                <CalendarCheck className="w-4 h-4" /> Book my review
              </button>
              {whatsapp && (
                <a href={waLink('I would like a free portfolio review')} target="_blank" rel="noreferrer" onClick={() => setOffer(false)}
                  className="rounded-xl ring-1 ring-white/25 hover:ring-white/60 px-4 py-2.5 text-sm">WhatsApp</a>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};
