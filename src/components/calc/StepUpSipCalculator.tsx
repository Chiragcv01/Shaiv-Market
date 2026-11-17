import React, { useMemo, useState } from 'react';
import { SmartNumberInput } from '../SmartNumberInput';
import { CalcFrame, Hero, SplitBar, GrowthChart, YearTable, CalcCta, Note, Segmented } from './kit';
import { stepUpSip } from '../../utils/calcMath';
import { formatINRFull, formatINRShort } from '../../utils/money';

export const StepUpSipCalculator: React.FC = () => {
  const [monthly, setMonthly] = useState(10000);
  const [step, setStep] = useState(10);
  const [ret, setRet] = useState(12);
  const [years, setYears] = useState(20);
  const [stepType, setStepType] = useState<'pct' | 'amt'>('pct');
  const [stepAmt, setStepAmt] = useState(1000);
  const [lump, setLump] = useState(0);
  const [infl, setInfl] = useState(6);
  const res = useMemo(
    () => stepUpSip(monthly, step, ret, years, { fixedStep: stepType === 'amt' ? stepAmt : undefined, lumpsum: lump }),
    [monthly, step, ret, years, stepType, stepAmt, lump]
  );
  const extra = res.value - res.flatValue;
  const realValue = res.value / Math.pow(1 + infl / 100, years);
  const stepLabel = stepType === 'amt' ? `₹${stepAmt.toLocaleString('en-IN')} yearly step-up` : `${step}% yearly step-up`;

  return (
    <CalcFrame
      id="step-up-sip-calculator"
      inputs={<>
        <SmartNumberInput id="su-monthly" label="Starting monthly SIP" value={monthly} onChange={setMonthly} min={500} max={500000} step={500} isCurrency
          presets={[{ label: '₹5,000', value: 5000 }, { label: '₹10,000', value: 10000 }, { label: '₹25,000', value: 25000 }]} />
        <Segmented<'pct' | 'amt'> label="Step up by" value={stepType} onChange={setStepType}
          options={[{ id: 'pct', label: 'Percentage' }, { id: 'amt', label: 'Fixed ₹ amount' }]} />
        {stepType === 'pct' ? (
          <SmartNumberInput id="su-step" label="Yearly step-up" value={step} onChange={setStep} min={0} max={50} step={1} suffix="%"
            presets={[{ label: '5%', value: 5 }, { label: '10%', value: 10 }, { label: '15%', value: 15 }]} helperText="How much you raise the SIP each year, usually in line with your salary hike." />
        ) : (
          <SmartNumberInput id="su-step-amt" label="Yearly step-up amount" value={stepAmt} onChange={setStepAmt} min={0} max={100000} step={500} isCurrency
            presets={[{ label: '₹500', value: 500 }, { label: '₹1,000', value: 1000 }, { label: '₹2,500', value: 2500 }]} helperText="Added to the monthly SIP every year, e.g. ₹10,000 → ₹11,000 → ₹12,000." />
        )}
        <SmartNumberInput id="su-ret" label="Assumed return (yearly)" value={ret} onChange={setRet} min={1} max={15} step={0.5} suffix="%" />
        <SmartNumberInput id="su-years" label="Investment period" value={years} onChange={setYears} min={1} max={40} step={1} suffix=" yrs" />
        <SmartNumberInput id="su-lump" label="One-time lumpsum today (optional)" value={lump} onChange={setLump} min={0} max={100000000} step={10000} isCurrency
          presets={[{ label: 'None', value: 0 }, { label: '₹1 L', value: 100000 }, { label: '₹5 L', value: 500000 }]} />
        <SmartNumberInput id="su-infl" label="Inflation (to show today's value)" value={infl} onChange={setInfl} min={0} max={12} step={0.5} suffix="%"
          presets={[{ label: '5%', value: 5 }, { label: '6%', value: 6 }, { label: '7%', value: 7 }]} />
      </>}
      results={<>
        <Hero label={`Your step-up SIP could grow to, in ${years} years`} value={res.value}
          sub={<>That is <strong className="text-[#F3D58E]">{formatINRShort(extra)}</strong> more than a flat ₹{monthly.toLocaleString('en-IN')} SIP{lump > 0 ? ' with the same lumpsum' : ''}, which would reach {formatINRShort(res.flatValue)}. At {infl}% inflation, {formatINRShort(res.value)} buys what about {formatINRShort(realValue)} buys today. Assumed rates, not guaranteed.</>}
          stats={[
            { label: 'You invest', value: formatINRShort(res.invested) },
            { label: 'Estimated gains', value: formatINRShort(res.gains), tone: 'gold' },
            { label: `SIP in year ${years}`, value: `${formatINRFull(res.lastMonthly)}/mo` },
            { label: "In today's money", value: formatINRShort(realValue) }
          ]} />
        <SplitBar parts={[{ label: 'Invested', value: res.invested, color: '#3F6E96' }, { label: 'Gains', value: res.gains, color: '#E3B65C' }]} />
        <GrowthChart title="Step-up vs flat SIP, year by year"
          data={res.rows.map((r) => ({ label: `Yr ${r.year}`, stepup: Math.round(r.value), flat: Math.round(r.flat), invested: Math.round(r.invested) }))}
          series={[{ key: 'stepup', name: 'Step-up SIP', color: '#E3B65C' }, { key: 'flat', name: 'Flat SIP', color: '#3F6E96', fill: false }, { key: 'invested', name: 'Invested (step-up)', color: '#9AA8B7', dashed: true, fill: false }]} />
        <Note>Assumes the return you chose, every year, and SIP instalments at the start of each month. Real returns vary and are not guaranteed.</Note>
      </>}
      below={<div className="space-y-5">
        <YearTable caption="Year-by-year schedule" columns={['Year', 'Monthly SIP', 'Invested so far', 'Value at year end']}
          rows={res.rows.map((r) => [r.year, formatINRFull(r.monthly!), formatINRFull(r.invested), formatINRFull(r.value)])} />
        <CalcCta text="Want the step-up set to auto-increase every year, so you never have to remember?" calc="step-up SIP calculator" result={`${formatINRShort(monthly)}/month with a ${stepLabel}${lump > 0 ? ` + ${formatINRShort(lump)} lumpsum` : ''} for ${years} years at an assumed ${ret}% ≈ ${formatINRShort(res.value)} (≈ ${formatINRShort(realValue)} in today's money; illustrative, not guaranteed)`} />
      </div>}
    />
  );
};
