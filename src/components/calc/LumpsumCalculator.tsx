import React, { useMemo, useState } from 'react';
import { SmartNumberInput } from '../SmartNumberInput';
import { CalcFrame, Hero, SplitBar, GrowthChart, YearTable, CalcCta, Note, yrs } from './kit';
import { lumpsum } from '../../utils/calcMath';
import { formatINRFull, formatINRShort } from '../../utils/money';

export const LumpsumCalculator: React.FC = () => {
  const [amount, setAmount] = useState(500000);
  const [ret, setRet] = useState(12);
  const [years, setYears] = useState(10);
  const [infl, setInfl] = useState(6);
  const res = useMemo(() => lumpsum(amount, ret, years, infl), [amount, ret, years, infl]);

  return (
    <CalcFrame
      id="lumpsum-calculator"
      inputs={<>
        <SmartNumberInput id="ls-amount" label="One-time investment" value={amount} onChange={setAmount} min={1000} max={50000000} step={1000} isCurrency
          presets={[{ label: '₹1 L', value: 100000 }, { label: '₹5 L', value: 500000 }, { label: '₹25 L', value: 2500000 }]} />
        <SmartNumberInput id="ls-ret" label="Expected return (yearly)" value={ret} onChange={setRet} min={1} max={15} step={0.5} suffix="%" />
        <SmartNumberInput id="ls-years" label="Investment period" value={years} onChange={setYears} min={1} max={40} step={1} suffix=" yrs" />
        <SmartNumberInput id="ls-infl" label="Inflation (to see real value)" value={infl} onChange={setInfl} min={0} max={12} step={0.5} suffix="%"
          helperText="Used only for the 'in today's money' figure." />
      </>}
      results={<>
        <Hero label={`₹${amount.toLocaleString('en-IN')} invested once could become`} value={res.value}
          sub={<>At {ret}% a year your money doubles roughly every <strong className="text-[#F3D58E]">{yrs(Number(res.doubling.toFixed(1)))}</strong>. In today's money, after {infl}% inflation, that is about {formatINRShort(res.real)}.</>}
          stats={[
            { label: 'You invest', value: formatINRShort(amount) },
            { label: 'Estimated gains', value: formatINRShort(res.gains), tone: 'gold' },
            { label: 'Growth multiple', value: `${(res.value / amount).toFixed(2)}x` }
          ]} />
        <SplitBar parts={[{ label: 'Invested', value: amount, color: '#3F6E96' }, { label: 'Gains', value: res.gains, color: '#E3B65C' }]} />
        <GrowthChart title="How the lumpsum grows"
          data={[{ label: 'Now', value: amount, invested: amount }, ...res.rows.map((r) => ({ label: `Yr ${r.year}`, value: Math.round(r.value), invested: amount }))]}
          series={[{ key: 'value', name: 'Value', color: '#E3B65C' }, { key: 'invested', name: 'Invested', color: '#3F6E96', dashed: true, fill: false }]} />
        <Note>Compounded once a year at a constant rate. Market-linked returns move up and down and are not guaranteed.</Note>
      </>}
      below={<div className="space-y-5">
        <YearTable caption="Value at the end of each year" columns={['Year', 'Value', 'Gain so far', 'In today’s money']}
          rows={res.rows.map((r) => [r.year, formatINRFull(r.value), formatINRFull(r.value - amount), formatINRFull(r.value / Math.pow(1 + infl / 100, r.year))])} />
        <CalcCta text="Got a bonus or a maturity amount to invest? A lumpsum is often better spread through an STP over a few months." calc="lumpsum calculator" result={`${formatINRShort(amount)} once for ${years} years at an assumed ${ret}% ≈ ${formatINRShort(res.value)} (illustrative, not guaranteed)`} />
      </div>}
    />
  );
};
