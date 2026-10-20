import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react';

/** Card that tilts toward the pointer, with a soft light sheen. */
export const Tilt: React.FC<{ children: React.ReactNode; className?: string; max?: number }> = ({
  children, className = '', max = 9
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 220, damping: 20 });
  const sy = useSpring(py, { stiffness: 220, damping: 20 });
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const sheen = useTransform([sx, sy], ([x, y]: number[]) =>
    `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.35), transparent 55%)`);

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <div style={{ perspective: 900 }} className={className}>
      <motion.div
        ref={ref}
        onPointerMove={(e) => {
          const b = ref.current!.getBoundingClientRect();
          px.set((e.clientX - b.left) / b.width);
          py.set((e.clientY - b.top) / b.height);
        }}
        onPointerLeave={() => { px.set(0.5); py.set(0.5); }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative h-full"
      >
        {children}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light" style={{ background: sheen }} />
      </motion.div>
    </div>
  );
};
