import React, { useRef, useState } from 'react';

interface ScrubNumberProps {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  /** returns the next value one step away in `dir` */
  step: (v: number, dir: 1 | -1) => number;
  format: (v: number) => string;
  label: string;
  pxPerStep?: number;
  onFirstUse?: () => void;
  className?: string;
}

/**
 * A number you change by dragging it sideways (or with arrow keys),
 * like a physical dial written into the sentence.
 */
export const ScrubNumber: React.FC<ScrubNumberProps> = ({
  value, onChange, min, max, step, format, label, pxPerStep = 9, onFirstUse, className = ''
}) => {
  const start = useRef<{ x: number; v: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  const walk = (from: number, steps: number) => {
    let v = from;
    const dir = steps > 0 ? 1 : -1;
    for (let i = 0; i < Math.abs(steps); i++) {
      const next = clamp(step(v, dir));
      if (next === v) break;
      v = next;
    }
    return v;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLSpanElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { x: e.clientX, v: value };
    setDragging(true);
    onFirstUse?.();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (!start.current) return;
    const steps = Math.trunc((e.clientX - start.current.x) / pxPerStep);
    const next = steps === 0 ? start.current.v : walk(start.current.v, steps);
    if (next !== value) onChange(next);
  };

  const end = () => {
    start.current = null;
    setDragging(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    let dir: 1 | -1 | 0 = 0;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') dir = 1;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') dir = -1;
    if (!dir) return;
    e.preventDefault();
    onFirstUse?.();
    onChange(walk(value, (e.shiftKey ? 5 : 1) * dir));
  };

  return (
    <span
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={format(value)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={end}
      onPointerCancel={end}
      onKeyDown={onKeyDown}
      style={{ touchAction: 'pan-y' }}
      className={`scrub relative inline-flex items-baseline select-none whitespace-nowrap rounded-md px-1 -mx-0.5 tabular-nums
        cursor-ew-resize outline-none transition-colors
        text-[#E3B65C] decoration-[#E3B65C]/70 underline decoration-dotted decoration-2 underline-offset-[0.18em]
        hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#E3B65C] focus-visible:bg-white/10
        ${dragging ? 'bg-white/15' : ''} ${className}`}
    >
      {format(value)}
    </span>
  );
};

/** Step helpers */
export const amountStep = (v: number, dir: 1 | -1) => {
  const size = v < 5000 || (dir === -1 && v <= 5000) ? 500 : v < 25000 || (dir === -1 && v <= 25000) ? 1000 : 5000;
  return v + dir * size;
};
export const unitStep = (size: number) => (v: number, dir: 1 | -1) => +(v + dir * size).toFixed(2);
