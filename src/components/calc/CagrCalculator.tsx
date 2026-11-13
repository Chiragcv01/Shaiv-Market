import React, { useMemo, useState } from 'react';
import { SmartNumberInput } from '../SmartNumberInput';
import { CalcFrame, Hero, GrowthChart, YearTable, CalcCta, Note, Segmented } from './kit';
import { cagr, cagrEndValue, cagrStartValue, sipXirr } from '../../utils/calcMath';
import { formatINRFull, formatINRShort } from '../../utils/money';

type Mode = 'cagr' | 'end' | 'start' | 'sip';

const pctFmt = (v: number) => `${v.toFixed(2)}%`;

export const CagrCalculator: React.FC = () => {
  const [mode, setMode] = useState<Mode>('cagr');
  const [start, setStart] = useState(100000);
  const [end, setEnd] = useState(250000);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(12);
  const [sip, setSip] = useState(10000);
  const [sipValue, setSipValue] = useState(820000);

  // Every mode boils down to one start value, one end value and one rate over `years`
  const view = useMemo(() => {
    if (mode === 'end') {
      const e = cagrEndValue(start, rate, years);
      return { s: start, e, c: rate };
    }
    if (mode === 'start') {
      const s = cagrStartValue(end, rate, years);
      return { s, e: end, c: rate };
    }
    if (mode === 'sip') {
      const invested = sip * Math.round(years * 12);
      return { s: invested, e: sipValue, c: sipXirr(sip, Math.round(years * 12), sipValue) };
    }
    const r = cagr(start, end, years);
    return { s: start, e: end, c: r.cagr };
  }, [mode, start, end, years, rate, sip, sipValue]);

  const absolute = view.s > 0 ? ((view.e - view.s) / view.s) * 100 : 0;
  const multiple = view.s > 0 ? view.e / view.s : 0;
  const monthly = (Math.pow(1 + view.c / 100, 1 / 12) - 1) * 100;
  const doubling = view.c > 0 ? Math.log(2) / Math.log(1 + view.c / 100) : Infinity;
  const naiveSipCagr = mode === 'sip' ? cagr(view.s, view.e, years).cagr : 0;

  const steps = Math.max(1, Math.ceil(years));
  const path = Array.from({ length: steps + 1 }, (_, i) => {
    const t = Math.min(i, years);
    return { t, value: view.s * Math.pow(1 + view.c / 100, t) };
  });

  const resultLine =
    mode === 'sip'
      ? `${formatINRShort(sip)}/month SIP for ${years} years now worth ${formatINRShort(sipValue)}: XIRR ${view.c.toFixed(2)}% a year`
      : mode === 'end'
        ? `${formatINRShort(start)} at an assumed ${rate}% CAGR for ${years} years ≈ ${formatINRShort(view.e)} (illustrative, not guaranteed)`
        : mode === 'start'
          ? `to reach ${formatINRShort(end)} in ${years} years at an assumed ${rate}% CAGR, invest ≈ ${formatINRShort(view.s)} today (illustrative, not guaranteed)`
          : `${formatINRShort(start)} to ${formatINRShort(end)} in ${years} years = ${view.c.toFixed(2)}% CAGR`;

  return (
    <CalcFrame
      id="cagr-calculator"
      inputs={<>
        <Segmented<Mode> label="What do you want to find?" value={mode} onChange={setMode}
          options={[
            { id: 'cagr', label: 'CAGR' },
            { id: 'end', label: 'Future value' },
            { id: 'start', label: 'Amount needed today' },
            { id: 'sip', label: 'SIP return (XIRR)' }
          ]} />
        {mode === 'sip' ? (<>
          <SmartNumberInput id="cg-sip" label="Monthly SIP" value={sip} onChange={setSip} min={500} max={1000000} step={500} isCurrency
            presets={[{ label: '₹5,000', value: 5000 }, { label: '₹10,000', value: 10000 }, { label: '₹25,000', value: 25000 }]} />
          <SmartNumberInput id="cg-sip-value" label="Current value of the SIP" value={sipValue} onChange={setSipValue} min={1000} max={1000000000} step={1000} isCurrency
            helperText="From your account statement or CAS." />
        </>) : (<>
          {mode !== 'start' && (
            <SmartNumberInput id="cg-start" label={mode === 'end' ? 'Amount invested today' : 'Starting value'} value={start} onChange={setStart} min={1000} max={100000000} step={1000} isCurrency />
          )}
          {mode !== 'end' && (
            <SmartNumberInput id="cg-end" label={mode === 'start' ? 'Target value' : 'Ending value'} value={end} onChange={setEnd} min={1000} max={1000000000} step={1000} isCurrency />
          )}
          {mode !== 'cagr' && (
            <SmartNumberInput id="cg-rate" label="Assumed CAGR (yearly)" value={rate} onChange={setRate} min={1} max={15} step={0.5} suffix="%"
              presets={[{ label: '8%', value: 8 }, { label: '10%', value: 10 }, { label: '12%', value: 12 }]}
              helperText="An assumption, not a guarantee." />
          )}
        </>)}
        <SmartNumberInput id="cg-years" label={mode === 'sip' ? 'SIP running for' : 'Time between them'} value={years} onChange={setYears} min={0.5} max={50} step={0.5} suffix=" yrs"
          helperText="Use decimals for part years, e.g. 3.5." />
      </>}
      results={<>
        {mode === 'cagr' && (
          <Hero label="Compound annual growth rate (CAGR)" value={view.c} format={pctFmt}
            sub={<>{formatINRShort(start)} growing to {formatINRShort(end)} in {years} years is the same as growing <strong className="text-[#F3D58E]">{view.c.toFixed(2)}%</strong> every single year.</>}
            stats={[
              { label: 'Absolute return', value: `${absolute.toFixed(1)}%` },
              { label: 'Monthly equivalent', value: `${monthly.toFixed(2)}%` },
              { label: 'Doubles every', value: Number.isFinite(doubling) ? `${doubling.toFixed(1)} yrs` : 'n/a', tone: 'gold' }
            ]} />
        )}
        {mode === 'end' && (
          <Hero label={`${formatINRShort(start)} at an assumed ${rate}% CAGR, after ${years} years`} value={view.e}
            sub={<>That is <strong className="text-[#F3D58E]">{multiple.toFixed(2)}x</strong> your money. Assumed rate, not guaranteed.</>}
            stats={[
              { label: 'Gain', value: formatINRShort(view.e - start), tone: 'gold' },
              { label: 'Absolute return', value: `${absolute.toFixed(0)}%` },
              { label: 'Doubles every', value: `${doubling.toFixed(1)} yrs` }
            ]} />
        )}
        {mode === 'start' && (
          <Hero label={`To have ${formatINRShort(end)} in ${years} years at an assumed ${rate}% CAGR, invest today`} value={view.s}
            sub={<>This is the present value of your target. Assumed rate, not guaranteed. Prefer to invest monthly? Use the <a className="underline" href="/calculators/required-sip-calculator">required SIP calculator</a>.</>}
            stats={[
              { label: 'Target', value: formatINRShort(end) },
              { label: 'Growth needed', value: `${multiple.toFixed(2)}x`, tone: 'gold' },
              { label: 'Monthly equivalent', value: `${monthly.toFixed(2)}%` }
            ]} />
        )}
        {mode === 'sip' && (
          <Hero label="Your SIP's annualised return (XIRR)" value={view.c} format={pctFmt}
            sub={<>{formatINRShort(sip)} a month for {years} years ({formatINRShort(view.s)} invested) is now {formatINRShort(sipValue)}. Treating it as one lumpsum would show only <strong className="text-[#F3D58E]">{naiveSipCagr.toFixed(2)}%</strong>, which understates a SIP.</>}
            stats={[
              { label: 'Invested', value: formatINRShort(view.s) },
              { label: 'Gain', value: formatINRShort(view.e - view.s), tone: 'gold' },
              { label: 'Absolute return', value: `${absolute.toFixed(1)}%` }
            ]} />
        )}
        {mode !== 'sip' && (
          <GrowthChart title={mode === 'cagr' ? 'The smooth path CAGR assumes' : 'Growth at the assumed CAGR'}
            data={path.map((p, i) => ({ label: i === 0 ? 'Start' : `Yr ${Number(p.t.toFixed(1))}`, value: Math.round(p.value) }))}
            series={[{ key: 'value', name: 'Value at CAGR', color: '#E3B65C' }]} />
        )}
        <Note>
          {mode === 'sip'
            ? 'XIRR assumes equal instalments at the start of each month. Your statement uses your actual dates, so it may differ slightly. Past returns do not guarantee future returns.'
            : 'CAGR is right for a single investment with one start and one end value. For SIPs, or money added and withdrawn at different times, use the SIP return (XIRR) option. Past CAGR is not a forecast.'}
        </Note>
      </>}
      below={<div className="space-y-5">
        {mode !== 'sip' && (
          <YearTable caption="Year-wise value at this CAGR" columns={['Year', 'Value', 'Growth that year']}
            rows={path.slice(1).map((p, i) => [Number(p.t.toFixed(1)), formatINRFull(p.value), formatINRFull(p.value - path[i].value)])} />
        )}
        <CalcCta text="Comparing a fund's CAGR with its benchmark over the same dates tells you more than comparing it with a friend's fund." calc="CAGR calculator" result={resultLine} />
      </div>}
    />
  );
};
