import React, { useMemo, useState } from 'react';
import { SmartNumberInput } from '../SmartNumberInput';
import { CalcFrame, Hero, SplitBar, GrowthChart, YearTable, CalcCta, Note } from './kit';
import { stepUpSip } from '../../utils/calcMath';
import { formatINRFull, formatINRShort } from '../../utils/money';

export const StepUpSipCalculator: React.FC = () => {
  const [monthly, setMonthly] = useState(10000);
  const [step, setStep] = useState(10);
  const [ret, setRet] = useState(12);
  const [years, setYears] = useState(20);
  const res = useMemo(() => stepUpSip(monthly, step, ret, years), [monthly, step, ret, years]);
  const extra = res.value - res.flatValue;

  return (
    <CalcFrame
      id="step-up-sip-calculator"
      inputs={<>
        <SmartNumberInput id="su-monthly" label="Starting monthly SIP" value={monthly} onChange={setMonthly} min={500} max={500000} step={500} isCurrency
          presets={[{ label: '₹5,000', value: 5000 }, { label: '₹10,000', value: 10000 }, { label: '₹25,000', value: 25000 }]} />
        <SmartNumberInput id="su-step" label="Yearly step-up" value={step} onChange={setStep} min={0} max={50} step={1} suffix="%"
          presets={[{ label: '5%', value: 5 }, { label: '10%', value: 10 }, { label: '15%', value: 15 }]} helperText="How much you raise the SIP each year, usually in line with your salary hike." />
        <SmartNumberInput id="su-ret" label="Expected return (yearly)" value={ret} onChange={setRet} min={1} max={15} step={0.5} suffix="%" />
        <SmartNumberInput id="su-years" label="Investment period" value={years} onChange={setYears} min={1} max={40} step={1} suffix=" yrs" />
      </>}
      results={<>
        <Hero label={`Your step-up SIP could grow to, in ${years} years`} value={res.value}
          sub={<>That is <strong className="text-[#F3D58E]">{formatINRShort(extra)}</strong> more than a flat ₹{monthly.toLocaleString('en-IN')} SIP, which would reach {formatINRShort(res.flatValue)}.</>}
          stats={[
            { label: 'You invest', value: formatINRShort(res.invested) },
            { label: 'Estimated gains', value: formatINRShort(res.gains), tone: 'gold' },
            { label: `SIP in year ${years}`, value: `${formatINRFull(res.lastMonthly)}/mo` }
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
        <CalcCta text="Want the step-up set to auto-increase every year, so you never have to remember?" whatsappText={`Hi Chirag, I tried the step-up SIP calculator: ₹${monthly} a month with a ${step}% yearly step-up. Can you help me set it up?`} />
      </div>}
    />
  );
};
