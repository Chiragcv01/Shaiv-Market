import React from 'react';
import { motion } from 'motion/react';

/** Animated, brand-coloured cover graphic for articles (replaces stock photos). */
export const ArticleCover: React.FC<{ seed?: string; className?: string }> = ({ seed = '', className = '' }) => {
  const variant = [...seed].reduce((a, c) => a + c.charCodeAt(0), 0) % 3;
  const vp = { once: true, amount: 0.4 } as const;

  return (
    <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-[#003461] to-[#004b87] ${className}`}>
      <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden>
        {[40, 80, 120].map((yy) => (
          <line key={yy} x1="0" x2="400" y1={yy} y2={yy} stroke="#fff" strokeOpacity="0.07" />
        ))}

        {variant === 0 && (
          // compounding curve
          <>
            <motion.path d="M20,140 C120,138 200,125 260,95 C310,70 350,40 380,18" fill="none" stroke="#96f6bd" strokeWidth="4" strokeLinecap="round"
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={vp} transition={{ duration: 1.8, ease: 'easeOut' }} />
            <motion.path d="M20,140 L380,96" fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="2" strokeDasharray="6 6"
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={vp} transition={{ duration: 1.8, ease: 'easeOut' }} />
            <motion.circle cx="380" cy="18" r="6" fill="#96f6bd" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={vp} transition={{ delay: 1.7 }} />
          </>
        )}

        {variant === 1 && (
          // growing bars
          <>
            {[30, 45, 40, 62, 58, 80, 76, 98, 110, 125].map((h, i) => (
              <motion.rect key={i} x={30 + i * 35} width="20" rx="3" fill={i > 6 ? '#96f6bd' : '#ffffff'} fillOpacity={i > 6 ? 0.9 : 0.35}
                initial={{ y: 150, height: 0 }} whileInView={{ y: 150 - h, height: h }} viewport={vp}
                transition={{ delay: i * 0.08, duration: 0.6, ease: 'easeOut' }} />
            ))}
          </>
        )}

        {variant === 2 && (
          // allocation rings
          <>
            {[
              { r: 55, frac: 0.6, c: '#96f6bd' },
              { r: 40, frac: 0.3, c: '#ffffff' },
              { r: 25, frac: 0.1, c: '#c9a24a' }
            ].map((ring, i) => (
              <g key={i} transform="rotate(-90 300 80)">
                <circle cx="300" cy="80" r={ring.r} fill="none" stroke="#fff" strokeOpacity="0.1" strokeWidth="9" />
                <motion.circle cx="300" cy="80" r={ring.r} fill="none" stroke={ring.c} strokeWidth="9" strokeLinecap="round"
                  initial={{ pathLength: 0 }} whileInView={{ pathLength: ring.frac }} viewport={vp}
                  transition={{ delay: i * 0.2, duration: 1.4, ease: 'easeOut' }} />
              </g>
            ))}
            {['Equity', 'Debt', 'Gold'].map((t, i) => (
              <motion.text key={t} x="40" y={60 + i * 26} fill="#fff" fontSize="15" fontWeight="700"
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: [0, 0.9], x: 40 }} viewport={vp} transition={{ delay: 0.3 + i * 0.2 }}>
                {t}
              </motion.text>
            ))}
          </>
        )}
      </svg>
    </div>
  );
};
