import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import confetti from 'canvas-confetti';

/** Drawn check mark with a gold confetti burst, for "done" moments. */
export const SuccessBurst: React.FC<{ size?: number }> = ({ size = 88 }) => {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => {
      confetti({
        particleCount: 110, spread: 80, startVelocity: 40, origin: { y: 0.45 },
        colors: ['#E3B65C', '#F3D58E', '#7FA6C9', '#0F2740', '#ffffff'], disableForReducedMotion: true
      });
    }, 350);
    return () => clearTimeout(t);
  }, [reduced]);

  return (
    <motion.svg width={size} height={size} viewBox="0 0 100 100" aria-hidden
      initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}>
      <motion.circle cx="50" cy="50" r="44" fill="#0F2740"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.35 }} style={{ originX: '50%', originY: '50%' }} />
      <motion.circle cx="50" cy="50" r="44" fill="none" stroke="#E3B65C" strokeWidth="4"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.1 }} />
      <motion.path d="M30 52 L44 66 L71 37" fill="none" stroke="#E3B65C" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, delay: 0.45, ease: 'easeOut' }} />
    </motion.svg>
  );
};
