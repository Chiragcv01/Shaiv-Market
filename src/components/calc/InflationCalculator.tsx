import React, { useMemo, useState } from 'react';
import { SmartNumberInput } from '../SmartNumberInput';
import { CalcFrame, Hero, GrowthChart, YearTable, CalcCta, Note, Segmented } from './kit';
import { inflation } from '../../utils/calcMath';
import { sipFutureValue } from '../../utils/money';
import { formatINRFull, formatINRShort } from '../../utils/money';

type Mode = 'cost' | 'value' | 'past' | 'sip';

const THIS_YEAR = new Date().getFullYear();

export const InflationCalculator: React.FC = () => {
  const [mode, setMode] = useState<Mode>('cost');
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(6);
  const [years, setYears] = useState(10);
  const [thenYear, setThenYear] = useState(2014);
  const [sip, setSip] = useState(10000);
  const [ret, setRet] = useState(12);
  const yearsAgo = Math.max(1, THIS_YEAR - thenYear);
  const res = useMemo(() => inflation(amount, rate, mode === 'past' ? yearsAgo : years), [amount, rate, years, mode, yearsAgo]);
  // SIP with inflation: nominal corpus, and the same corpus in today's money
  const sipRes = useMemo(() => {
    const nominal = sipFutureValue(sip, years, ret / 100);
    const k = Math.pow(1 + rate / 100, years);
    const rows = Array.from({ length: years }, (_, i) => {
      const y = i + 1;
      const v = sipFutureValue(sip, y, ret / 100);
      return { year: y, invested: sip * 12 * y, nominal: v, real: v / Math.pow(1 + rate / 100, y) };
    });
    return { nominal, real: nominal / k, invested: sip * 12 * years, realRate: ((1 + ret / 100) / (1 + rate / 100) - 1) * 100, rows };
  }, [sip, years, ret, rate]);

  const resultLine =
    mode === 'sip'
      ? `${formatINRShort(sip)}/month for ${years} years at an assumed ${ret}% ≈ ${formatINRShort(sipRes.nominal)}, worth ${formatINRShort(sipRes.real)} in today's money at ${rate}% inflation (illustrative, not guaranteed)`
      : mode === 'past'
        ? `${formatINRShort(amount)} in ${thenYear} ≈ ${formatINRShort(res.future)} in ${THIS_YEAR} money at an assumed ${rate}% average inflation`
        : `${formatINRShort(amount)} at ${rate}% inflation for ${years} years: costs ${formatINRShort(res.future)} then, buys only ${formatINRShort(res.power)} of today's goods`;
  const doubleYrs = (Math.log(2) / Math.log(1 + rate / 100)).toFixed(1);

  return (
    <CalcFrame
      id="inflation-calculator"
      inputs={<>
        <Segmented<Mode> label="What do you want to know?" value={mode} onChange={setMode}
          options={[
            { id: 'cost', label: 'Future cost of something' },
            { id: 'value', label: 'What money will be worth' },
            { id: 'past', label: 'Old money in today\'s rupees' },
            { id: 'sip', label: 'SIP with inflation' }
          ]} />
        {mode === 'sip' ? (<>
          <SmartNumberInput id="in-sip" label="Monthly SIP" value={sip} onChange={setSip} min={500} max={1000000} step={500} isCurrency
            presets={[{ label: '₹5,000', value: 5000 }, { label: '₹10,000', value: 10000 }, { label: '₹25,000', value: 25000 }]} />
          <SmartNumberInput id="in-ret" label="Assumed return (yearly)" value={ret} onChange={setRet} min={1} max={15} step={0.5} suffix="%"
            presets={[{ label: '8%', value: 8 }, { label: '10%', value: 10 }, { label: '12%', value: 12 }]} helperText="An assumption, not a guarantee." />
        </>) : (
          <SmartNumberInput id="in-amount" label={mode === 'cost' ? 'Cost today' : mode === 'past' ? `Amount in ${thenYear}` : 'Amount of money'} value={amount} onChange={setAmount} min={1000} max={100000000} step={1000} isCurrency
            presets={[{ label: '₹1 L', value: 100000 }, { label: '₹10 L', value: 1000000 }, { label: '₹1 Cr', value: 10000000 }]} />
        )}
        <SmartNumberInput id="in-rate" label={mode === 'past' ? 'Average inflation since then (yearly)' : 'Inflation rate (yearly)'} value={rate} onChange={setRate} min={1} max={15} step={0.5} suffix="%"
          presets={[{ label: '4%', value: 4 }, { label: '6%', value: 6 }, { label: '8%', value: 8 }, { label: '10%', value: 10 }]}
          helperText={mode === 'past'
            ? 'An assumed average. Actual inflation varied every year; check official CPI data for an exact figure.'
            : 'General prices often use 5-6%. Education and medical costs have tended to rise faster, so many planners use 8-10% for them.'} />
        {mode === 'past' ? (
          <SmartNumberInput id="in-then" label="Year of the old amount" value={thenYear} onChange={setThenYear} min={1960} max={THIS_YEAR - 1} step={1}
            presets={[{ label: '2000', value: 2000 }, { label: '2010', value: 2010 }, { label: '2014', value: 2014 }, { label: '2020', value: 2020 }]} />
        ) : (
          <SmartNumberInput id="in-years" label="Years from now" value={years} onChange={setYears} min={1} max={40} step={1} suffix=" yrs" />
        )}
      </>}
      results={<>
        {mode === 'cost' && (
          <Hero label={`Something that costs ${formatINRShort(amount)} today will cost, in ${years} years`} value={res.future}
            sub={<>Prices rise <strong className="text-[#F3D58E]">{(res.future / amount).toFixed(2)}x</strong> at {rate}% a year. Plan goals in these future rupees, not today's.</>}
            stats={[{ label: 'Cost today', value: formatINRShort(amount) }, { label: 'Extra you will pay', value: formatINRShort(res.future - amount), tone: 'gold' }, { label: 'Prices double in', value: `${doubleYrs} yrs` }]} />
        )}
        {mode === 'value' && (
          <Hero label={`${formatINRShort(amount)} in ${years} years will buy what this buys today`} value={res.power}
            sub={<>Money kept idle loses about <strong className="text-[#F3D58E]">{Math.round((1 - res.power / amount) * 100)}%</strong> of its buying power over {years} years at {rate}% inflation.</>}
            stats={[{ label: 'Face value', value: formatINRShort(amount) }, { label: 'Buying power lost', value: formatINRShort(amount - res.power), tone: 'gold' }, { label: 'Halves in', value: `${doubleYrs} yrs` }]} />
        )}
        {mode === 'past' && (
          <Hero label={`${formatINRShort(amount)} in ${thenYear} is worth, in ${THIS_YEAR} rupees`} value={res.future}
            sub={<>Over {yearsAgo} years at an assumed <strong className="text-[#F3D58E]">{rate}%</strong> average inflation, prices rose {(res.future / amount).toFixed(2)}x. To keep the same buying power, that money needed to grow at least this much.</>}
            stats={[{ label: `Amount in ${thenYear}`, value: formatINRShort(amount) }, { label: 'Years', value: `${yearsAgo}` }, { label: 'Buying power lost if kept idle', value: `${Math.round((1 - res.power / amount) * 100)}%`, tone: 'gold' }]} />
        )}
        {mode === 'sip' && (
          <Hero label={`${formatINRShort(sip)}/month for ${years} years, in today's money`} value={sipRes.real}
            sub={<>At an assumed {ret}% return the SIP grows to about <strong className="text-[#F3D58E]">{formatINRShort(sipRes.nominal)}</strong>. At {rate}% inflation that buys what {formatINRShort(sipRes.real)} buys today. Assumed rates, not guaranteed.</>}
            stats={[{ label: 'You invest', value: formatINRShort(sipRes.invested) }, { label: 'Future value (nominal)', value: formatINRShort(sipRes.nominal) }, { label: 'Real return', value: `${sipRes.realRate.toFixed(1)}% a year`, tone: 'gold' }]} />
        )}
        {mode === 'sip' ? (
          <GrowthChart title="SIP value: nominal vs today's money"
            data={sipRes.rows.map((r) => ({ label: `Yr ${r.year}`, n: Math.round(r.nominal), real: Math.round(r.real) }))}
            series={[{ key: 'n', name: 'Nominal value', color: '#E3B65C' }, { key: 'real', name: 'In today\'s money', color: '#3F6E96' }]} />
        ) : (
          <GrowthChart title={mode === 'value' ? 'Buying power over the years' : 'Cost over the years'}
            data={res.rows.map((r) => ({ label: r.year === 0 ? (mode === 'past' ? String(thenYear) : 'Now') : mode === 'past' ? String(thenYear + r.year) : `Yr ${r.year}`, v: Math.round(mode === 'value' ? r.power : r.cost) }))}
            series={[{ key: 'v', name: mode === 'value' ? 'Value in today’s money' : 'Cost', color: mode === 'value' ? '#3F6E96' : '#C2410C' }]} />
        )}
        <Note>Uses a steady yearly rate. Actual inflation changes every year and differs by city and by what you buy.</Note>
      </>}
      below={<div className="space-y-5">
        {mode === 'sip' ? (
          <YearTable caption="Year by year" columns={['Year', 'Invested', 'Value (nominal)', 'In today’s money']}
            rows={sipRes.rows.map((r) => [r.year, formatINRFull(r.invested), formatINRFull(r.nominal), formatINRFull(r.real)])} />
        ) : mode === 'past' ? (
          <YearTable caption="Year by year" columns={['Year', `Value of ${formatINRShort(amount)} from ${thenYear}`]}
            rows={res.rows.slice(1).map((r) => [thenYear + r.year, formatINRFull(r.cost)])} />
        ) : (
          <YearTable caption="Year by year" columns={['Year', 'Future cost', 'Buying power of today’s amount']}
            rows={res.rows.slice(1).map((r) => [r.year, formatINRFull(r.cost), formatINRFull(r.power)])} />
        )}
        <CalcCta text="A goal that grows with inflation needs a plan that grows faster. Let's map yours." calc="inflation calculator" result={resultLine} />
      </div>}
    />
  );
};
