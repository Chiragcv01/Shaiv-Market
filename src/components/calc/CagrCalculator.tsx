import React, { useMemo, useState } from 'react';
import { SmartNumberInput } from '../SmartNumberInput';
import { CalcFrame, Hero, GrowthChart, CalcCta, Note } from './kit';
import { cagr } from '../../utils/calcMath';
import { formatINRShort } from '../../utils/money';

export const CagrCalculator: React.FC = () => {
  const [start, setStart] = useState(100000);
  const [end, setEnd] = useState(250000);
  const [years, setYears] = useState(5);
  const res = useMemo(() => cagr(start, end, years), [start, end, years]);
  const steps = Math.max(1, Math.ceil(years));
  const data = Array.from({ length: steps + 1 }, (_, i) => {
    const t = Math.min(i, years);
    return { label: i === 0 ? 'Start' : `Yr ${Number(t.toFixed(1))}`, value: Math.round(start * Math.pow(1 + res.cagr / 100, t)) };
  });

  return (
    <CalcFrame
      id="cagr-calculator"
      inputs={<>
        <SmartNumberInput id="cg-start" label="Starting value" value={start} onChange={setStart} min={1000} max={100000000} step={1000} isCurrency />
        <SmartNumberInput id="cg-end" label="Ending value" value={end} onChange={setEnd} min={1000} max={1000000000} step={1000} isCurrency />
        <SmartNumberInput id="cg-years" label="Time between them" value={years} onChange={setYears} min={0.5} max={50} step={0.5} suffix=" yrs"
          helperText="Use decimals for part years, e.g. 3.5." />
      </>}
      results={<>
        <Hero label="Compound annual growth rate (CAGR)" value={res.cagr} format={(v) => `${v.toFixed(2)}%`}
          sub={<>{formatINRShort(start)} growing to {formatINRShort(end)} in {years} years is the same as growing <strong className="text-[#F3D58E]">{res.cagr.toFixed(2)}%</strong> every single year.</>}
          stats={[
            { label: 'Absolute return', value: `${res.absolute.toFixed(1)}%` },
            { label: 'Simple yearly average', value: `${(res.absolute / years).toFixed(1)}%` },
            { label: 'Doubles every', value: Number.isFinite(res.doubling) ? `${res.doubling.toFixed(1)} yrs` : 'n/a', tone: 'gold' }
          ]} />
        <GrowthChart title="The smooth path CAGR assumes" data={data} series={[{ key: 'value', name: 'Value at CAGR', color: '#E3B65C' }]} />
        <Note>CAGR is right for a single investment with one start and one end value. For SIPs, or money added and withdrawn at different times, XIRR is the correct measure.</Note>
      </>}
      below={<CalcCta text="Comparing your fund's CAGR with its benchmark tells you more than comparing it with a friend's fund." calc="CAGR calculator" result={`${formatINRShort(start)} to ${formatINRShort(end)} in ${years} years = ${res.cagr.toFixed(2)}% a year`} />}
    />
  );
};
