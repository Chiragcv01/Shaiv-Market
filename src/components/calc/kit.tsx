import React, { useEffect, useRef, useState } from 'react';
import { animate, motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { ArrowRight, MessageCircle, ChevronDown } from 'lucide-react';
import { formatINRFull, formatINRShort } from '../../utils/money';
import { navigateTo } from '../../utils/navigate';

/** Two-column calculator frame: inputs on the left, results on the right. */
export const CalcFrame: React.FC<{ id: string; inputs: React.ReactNode; results: React.ReactNode; below?: React.ReactNode }> = ({ id, inputs, results, below }) => (
  <div id={id} className="w-full rounded-3xl bg-white ring-1 ring-[#D3DCE6] shadow-xs overflow-hidden">
    <div className="grid lg:grid-cols-12">
      <div className="lg:col-span-5 p-5 sm:p-7 space-y-4 border-b lg:border-b-0 lg:border-r border-[#E4EAF0]">{inputs}</div>
      <div className="lg:col-span-7 p-5 sm:p-7 space-y-6 bg-[#FAFBFD]">{results}</div>
    </div>
    {below && <div className="border-t border-[#E4EAF0] p-5 sm:p-7">{below}</div>}
  </div>
);

/** Number that glides to its new value. Renders the final value on the server. */
export const Tween: React.FC<{ value: number; format?: (v: number) => string; className?: string }> = ({ value, format = formatINRFull, className }) => {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const c = animate(from.current, value, { duration: 0.55, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => { from.current = v; setShown(v); } });
    return () => c.stop();
  }, [value]);
  return <span className={className}>{format(shown)}</span>;
};

/** The big answer card. */
export const Hero: React.FC<{ label: string; value: number; format?: (v: number) => string; sub?: React.ReactNode; stats?: { label: string; value: React.ReactNode; tone?: 'gold' | 'plain' }[] }> = ({ label, value, format, sub, stats }) => (
  <div className="relative overflow-hidden rounded-3xl bg-[#0F2740] text-white p-6 sm:p-7">
    <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-[#E3B65C]/20 blur-3xl pointer-events-none" />
    <p className="relative text-sm text-white/70">{label}</p>
    <p className="relative font-display text-4xl sm:text-5xl font-semibold mt-1 text-[#F3D58E] tabular-nums" aria-live="polite">
      <Tween value={value} format={format} />
    </p>
    {sub && <p className="relative mt-2 text-sm text-white/80 leading-relaxed">{sub}</p>}
    {stats && stats.length > 0 && (
      <dl className="relative mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white/[0.07] ring-1 ring-white/10 p-3">
            <dt className="text-[11px] text-white/60">{s.label}</dt>
            <dd className={`mt-0.5 font-semibold tabular-nums ${s.tone === 'gold' ? 'text-[#F3D58E]' : 'text-white'}`}>{s.value}</dd>
          </div>
        ))}
      </dl>
    )}
  </div>
);

/** A stacked split bar, e.g. invested vs gains. */
export const SplitBar: React.FC<{ parts: { label: string; value: number; color: string }[] }> = ({ parts }) => {
  const total = parts.reduce((a, p) => a + Math.max(0, p.value), 0) || 1;
  return (
    <div>
      <div className="flex h-3 rounded-full overflow-hidden bg-[#E4EAF0]">
        {parts.map((p) => (
          <motion.div key={p.label} className="h-full" style={{ background: p.color }}
            initial={false} animate={{ width: `${(Math.max(0, p.value) / total) * 100}%` }} transition={{ type: 'spring', stiffness: 160, damping: 26 }} />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#43566B]">
        {parts.map((p) => (
          <span key={p.label} className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
            {p.label}: <strong className="text-[#0F2740] tabular-nums">{formatINRShort(p.value)}</strong> ({Math.round((Math.max(0, p.value) / total) * 100)}%)
          </span>
        ))}
      </div>
    </div>
  );
};

export interface Series { key: string; name: string; color: string; dashed?: boolean; fill?: boolean }

/** Year-by-year area chart. */
export const GrowthChart: React.FC<{ data: Record<string, number | string | null>[]; series: Series[]; xKey?: string; height?: number; title?: string }> = ({ data, series, xKey = 'label', height = 260, title }) => (
  <figure className="rounded-2xl bg-white ring-1 ring-[#E4EAF0] p-4">
    {title && <figcaption className="text-sm font-semibold text-[#0F2740] mb-2">{title}</figcaption>}
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            {series.map((s) => (
              <linearGradient key={s.key} id={`g-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={s.color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid stroke="#EEF2F6" vertical={false} />
          <XAxis dataKey={xKey} stroke="#6B7C8F" fontSize={11} tickLine={false} axisLine={false} minTickGap={16} />
          <YAxis stroke="#6B7C8F" fontSize={11} tickLine={false} axisLine={false} width={64} tickFormatter={(v: number) => formatINRShort(v)} />
          <Tooltip
            formatter={(v: number | string, name: string) => [formatINRFull(Number(v)), name]}
            contentStyle={{ background: '#0F2740', border: 'none', borderRadius: 12, color: '#fff', fontSize: 12 }}
            labelStyle={{ color: '#F3D58E' }}
          />
          <Legend verticalAlign="top" height={30} iconType="circle" formatter={(v) => <span className="text-xs text-[#43566B]">{v}</span>} />
          {series.map((s) => (
            <Area key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={2.4}
              strokeDasharray={s.dashed ? '6 5' : undefined} fill={s.fill === false ? 'none' : `url(#g-${s.key})`} isAnimationActive />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </figure>
);

/** Schedule table that shows a few rows and expands. */
export const YearTable: React.FC<{ caption: string; columns: string[]; rows: (string | number)[][]; initial?: number }> = ({ caption, columns, rows, initial = 6 }) => {
  const [all, setAll] = useState(false);
  const shown = all || rows.length <= initial + 1 ? rows : [...rows.slice(0, initial), rows[rows.length - 1]];
  return (
    <div>
      <div className="table-wrap rounded-2xl ring-1 ring-[#E4EAF0] overflow-x-auto bg-white">
        <table className="w-full text-sm tabular-nums">
          <caption className="text-left px-4 pt-3 pb-1 text-sm font-semibold text-[#0F2740]">{caption}</caption>
          <thead>
            <tr className="text-left text-xs text-[#6B7C8F]">
              {columns.map((c) => <th key={c} scope="col" className="px-4 py-2 font-medium whitespace-nowrap">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {shown.map((r, i) => (
              <tr key={i} className="border-t border-[#EEF2F6]">
                {r.map((c, j) => <td key={j} className={`px-4 py-2 whitespace-nowrap ${j === 0 ? 'text-[#43566B]' : 'text-[#0F2740]'}`}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > initial + 1 && (
        <button type="button" onClick={() => setAll(!all)} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#8A6420] cursor-pointer">
          {all ? 'Show fewer years' : `Show all ${rows.length} rows`}
          <ChevronDown className={`w-4 h-4 transition-transform ${all ? 'rotate-180' : ''}`} />
        </button>
      )}
    </div>
  );
};

/** Segmented choice. */
export function Segmented<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { id: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div>
      <p className="text-xs font-bold text-[#13263B] uppercase tracking-wider mb-2">{label}</p>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#EEF3F8]">
        {options.map((o) => (
          <button key={o.id} type="button" role="radio" aria-checked={value === o.id} onClick={() => onChange(o.id)}
            className={`relative flex-1 min-w-fit px-3 py-2 rounded-lg text-sm font-medium cursor-pointer ${value === o.id ? 'text-white' : 'text-[#43566B] hover:text-[#0F2740]'}`}>
            {value === o.id && <motion.span layoutId={`seg-${label}`} className="absolute inset-0 rounded-lg bg-[#0F2740]" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
            <span className="relative">{o.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** Note line under results. */
export const Note: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-xs text-[#6B7C8F] leading-relaxed">{children}</p>
);

/** Next step after a result. */
export const CalcCta: React.FC<{ text: string; whatsappText: string }> = ({ text, whatsappText }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl bg-[#FBF6EA] ring-1 ring-[#F3D58E] p-4">
    <p className="flex-1 text-sm text-[#43566B]">{text}</p>
    <div className="flex gap-2 shrink-0">
      <a href="/book-free-consultation" onClick={(e) => { e.preventDefault(); navigateTo('/book-free-consultation'); }}
        className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F2740] hover:bg-[#1D4268] text-white text-sm font-semibold px-4 py-2.5">
        Free call <ArrowRight className="w-4 h-4" />
      </a>
      <a href={`https://wa.me/919950653247?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noreferrer"
        className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-sm font-semibold px-4 py-2.5">
        <MessageCircle className="w-4 h-4" /> WhatsApp
      </a>
    </div>
  </div>
);

export const pct = (v: number, d = 1) => `${v.toFixed(d)}%`;
export const yrs = (v: number) => `${Number.isInteger(v) ? v : v.toFixed(1)} ${v === 1 ? 'year' : 'years'}`;
