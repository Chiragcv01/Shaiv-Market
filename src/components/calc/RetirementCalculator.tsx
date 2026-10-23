import React, { useMemo, useState } from 'react';
import { SmartNumberInput } from '../SmartNumberInput';
import { CalcFrame, Hero, GrowthChart, YearTable, CalcCta, Note } from './kit';
import { retirementPlan } from '../../utils/calcMath';
import { formatINRFull, formatINRShort } from '../../utils/money';

export const RetirementCalculator: React.FC = () => {
  const [age, setAge] = useState(30);
  const [retireAge, setRetireAge] = useState(60);
  const [lifeAge, setLifeAge] = useState(85);
  const [spend, setSpend] = useState(50000);
  const [savings, setSavings] = useState(500000);
  const [inflation, setInflation] = useState(6);
  const [preRet, setPreRet] = useState(12);
  const [postRet, setPostRet] = useState(8);
  const [stepUp, setStepUp] = useState(0);

  const ra = Math.max(age + 1, retireAge);
  const la = Math.max(ra + 1, lifeAge);
  const res = useMemo(() => retirementPlan({ age, retireAge: ra, lifeAge: la, monthlySpend: spend, inflation, preRet, postRet, savings, stepUp }),
    [age, ra, la, spend, inflation, preRet, postRet, savings, stepUp]);

  return (
    <CalcFrame
      id="retirement-calculator"
      inputs={<>
        <div className="grid grid-cols-1 gap-4">
          <SmartNumberInput id="rt-age" label="Your age" value={age} onChange={setAge} min={18} max={70} step={1} />
          <SmartNumberInput id="rt-retire" label="Retire at" value={retireAge} onChange={setRetireAge} min={30} max={80} step={1} />
          <SmartNumberInput id="rt-life" label="Plan till age" value={lifeAge} onChange={setLifeAge} min={60} max={100} step={1} />
        </div>
        <SmartNumberInput id="rt-spend" label="Monthly expenses today" value={spend} onChange={setSpend} min={5000} max={1000000} step={1000} isCurrency
          helperText="What your household spends in a month now. Leave out EMIs that will end before you retire." />
        <SmartNumberInput id="rt-savings" label="Retirement savings so far" value={savings} onChange={setSavings} min={0} max={50000000} step={10000} isCurrency
          helperText="Mutual funds, EPF, PPF and NPS you will use for retirement." />
        <SmartNumberInput id="rt-infl" label="Inflation" value={inflation} onChange={setInflation} min={2} max={12} step={0.5} suffix="%" />
        <div className="grid grid-cols-1 gap-4">
          <SmartNumberInput id="rt-pre" label="Return till retirement" value={preRet} onChange={setPreRet} min={4} max={18} step={0.5} suffix="%" />
          <SmartNumberInput id="rt-post" label="Return after retirement" value={postRet} onChange={setPostRet} min={3} max={12} step={0.5} suffix="%" />
        </div>
        <SmartNumberInput id="rt-step" label="Yearly SIP step-up" value={stepUp} onChange={setStepUp} min={0} max={20} step={1} suffix="%"
          presets={[{ label: 'None', value: 0 }, { label: '5%', value: 5 }, { label: '10%', value: 10 }]} />
      </>}
      results={<>
        <Hero label="Monthly SIP you need to start now" value={res.sip}
          sub={<>This builds a retirement corpus of <strong className="text-[#F3D58E]">{formatINRShort(res.corpus)}</strong> by age {ra}, enough to pay your expenses, rising with inflation, until age {la}.</>}
          stats={[
            { label: `Expenses at ${ra}`, value: `${formatINRShort(res.spendAtRetirement)}/mo` },
            { label: 'Corpus needed', value: formatINRShort(res.corpus), tone: 'gold' },
            { label: 'Savings will cover', value: formatINRShort(Math.min(res.savingsGrown, res.corpus)) }
          ]} />
        {res.gap <= 0 && (
          <p className="rounded-2xl bg-[#E8F5EE] text-[#1F6B43] p-4 text-sm">Your current savings, left to grow at {preRet}%, already cover the corpus you need. Keep them invested and review once a year.</p>
        )}
        <GrowthChart title="Your retirement money across your life"
          data={res.rows.map((r) => ({ label: `${r.age}`, build: r.phase === 'build' ? Math.round(r.value) : null, draw: r.phase === 'draw' || r.age === ra ? Math.round(r.value) : null }))}
          series={[{ key: 'build', name: 'Building up (SIP years)', color: '#E3B65C' }, { key: 'draw', name: 'Drawing down (retired)', color: '#3F6E96' }]} />
        <Note>The corpus pays a yearly amount that rises with inflation, from age {ra} to {la}, and earns {postRet}% meanwhile. Returns are assumptions, not promises. Pension, rent income and medical costs are not included.</Note>
      </>}
      below={<div className="space-y-5">
        <YearTable caption="Corpus by age" columns={['Age', 'Phase', 'Corpus at year end']}
          rows={res.rows.filter((r, i) => i === 0 || r.age % 5 === 0 || r.age === ra || i === res.rows.length - 1).map((r) => [r.age, r.phase === 'build' ? 'Saving' : 'Retired', formatINRFull(r.value)])} initial={8} />
        <CalcCta text="Retirement plans need EPF, NPS and insurance in the picture too. Get one plan that ties them together." whatsappText={`Hi Chirag, the retirement calculator says I need about ₹${Math.round(res.sip)} a month to retire at ${ra}. Can we plan this properly?`} />
      </div>}
    />
  );
};
