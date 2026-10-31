import React, { useMemo, useState } from 'react';
import { SmartNumberInput } from '../SmartNumberInput';
import { CalcFrame, Hero, GrowthChart, YearTable, CalcCta, Note, Segmented } from './kit';
import { inflation } from '../../utils/calcMath';
import { formatINRFull, formatINRShort } from '../../utils/money';

type Mode = 'cost' | 'value';

export const InflationCalculator: React.FC = () => {
  const [mode, setMode] = useState<Mode>('cost');
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(6);
  const [years, setYears] = useState(10);
  const res = useMemo(() => inflation(amount, rate, years), [amount, rate, years]);

  return (
    <CalcFrame
      id="inflation-calculator"
      inputs={<>
        <Segmented<Mode> label="What do you want to know?" value={mode} onChange={setMode}
          options={[{ id: 'cost', label: 'Future cost of something' }, { id: 'value', label: 'What money will be worth' }]} />
        <SmartNumberInput id="in-amount" label={mode === 'cost' ? 'Cost today' : 'Amount of money'} value={amount} onChange={setAmount} min={1000} max={100000000} step={1000} isCurrency
          presets={[{ label: '₹1 L', value: 100000 }, { label: '₹10 L', value: 1000000 }, { label: '₹1 Cr', value: 10000000 }]} />
        <SmartNumberInput id="in-rate" label="Inflation rate (yearly)" value={rate} onChange={setRate} min={1} max={15} step={0.5} suffix="%"
          presets={[{ label: '4%', value: 4 }, { label: '6%', value: 6 }, { label: '8%', value: 8 }, { label: '10%', value: 10 }]}
          helperText="General prices often use 5-6%. Education and medical costs have tended to rise faster, so many planners use 8-10% for them." />
        <SmartNumberInput id="in-years" label="Years from now" value={years} onChange={setYears} min={1} max={40} step={1} suffix=" yrs" />
      </>}
      results={<>
        {mode === 'cost' ? (
          <Hero label={`Something that costs ${formatINRShort(amount)} today will cost, in ${years} years`} value={res.future}
            sub={<>Prices rise <strong className="text-[#F3D58E]">{(res.future / amount).toFixed(2)}x</strong> at {rate}% a year. Plan goals in these future rupees, not today's.</>}
            stats={[{ label: 'Cost today', value: formatINRShort(amount) }, { label: 'Extra you will pay', value: formatINRShort(res.future - amount), tone: 'gold' }, { label: 'Prices double in', value: `${(Math.log(2) / Math.log(1 + rate / 100)).toFixed(1)} yrs` }]} />
        ) : (
          <Hero label={`${formatINRShort(amount)} in ${years} years will buy what this buys today`} value={res.power}
            sub={<>Money kept idle loses about <strong className="text-[#F3D58E]">{Math.round((1 - res.power / amount) * 100)}%</strong> of its buying power over {years} years at {rate}% inflation.</>}
            stats={[{ label: 'Face value', value: formatINRShort(amount) }, { label: 'Buying power lost', value: formatINRShort(amount - res.power), tone: 'gold' }, { label: 'Halves in', value: `${(Math.log(2) / Math.log(1 + rate / 100)).toFixed(1)} yrs` }]} />
        )}
        <GrowthChart title={mode === 'cost' ? 'Cost over the years' : 'Buying power over the years'}
          data={res.rows.map((r) => ({ label: r.year === 0 ? 'Now' : `Yr ${r.year}`, v: Math.round(mode === 'cost' ? r.cost : r.power) }))}
          series={[{ key: 'v', name: mode === 'cost' ? 'Future cost' : 'Value in today’s money', color: mode === 'cost' ? '#C2410C' : '#3F6E96' }]} />
        <Note>Uses a steady yearly rate. Actual inflation changes every year and differs by city and by what you buy.</Note>
      </>}
      below={<div className="space-y-5">
        <YearTable caption="Year by year" columns={['Year', 'Future cost', 'Buying power of today’s amount']}
          rows={res.rows.slice(1).map((r) => [r.year, formatINRFull(r.cost), formatINRFull(r.power)])} />
        <CalcCta text="A goal that grows with inflation needs a plan that grows faster. Let's map yours." calc="inflation calculator" result={`${formatINRShort(amount)} at ${rate}% inflation for ${years} years: costs ${formatINRShort(res.future)} then, buys only ${formatINRShort(res.power)} of today's goods`} />
      </div>}
    />
  );
};
