import React, { useMemo, useState } from 'react';
import { SmartNumberInput } from '../SmartNumberInput';
import { CalcFrame, Hero, GrowthChart, YearTable, CalcCta, Note } from './kit';
import { delayCost } from '../../utils/calcMath';
import { formatINRFull, formatINRShort } from '../../utils/money';

export const SipDelayCalculator: React.FC = () => {
  const [monthly, setMonthly] = useState(10000);
  const [ret, setRet] = useState(12);
  const [horizon, setHorizon] = useState(25);
  const [delay, setDelay] = useState(5);
  const d = Math.min(delay, horizon - 1);
  const res = useMemo(() => delayCost(monthly, ret, horizon, d), [monthly, ret, horizon, d]);
  const table = [0, 1, 2, 3, 5, 7, 10, 15].filter((x) => x < horizon).map((x) => delayCost(monthly, ret, horizon, x));

  return (
    <CalcFrame
      id="sip-delay-cost-calculator"
      inputs={<>
        <SmartNumberInput id="dl-monthly" label="Monthly SIP" value={monthly} onChange={setMonthly} min={500} max={500000} step={500} isCurrency
          presets={[{ label: '₹5,000', value: 5000 }, { label: '₹10,000', value: 10000 }, { label: '₹25,000', value: 25000 }]} />
        <SmartNumberInput id="dl-horizon" label="Years until you need the money" value={horizon} onChange={setHorizon} min={3} max={40} step={1} suffix=" yrs"
          helperText="Counted from today, e.g. the years left to retirement." />
        <SmartNumberInput id="dl-delay" label="If you wait for" value={delay} onChange={setDelay} min={1} max={20} step={1} suffix=" yrs"
          presets={[{ label: '1 yr', value: 1 }, { label: '3 yrs', value: 3 }, { label: '5 yrs', value: 5 }, { label: '10 yrs', value: 10 }]} />
        <SmartNumberInput id="dl-ret" label="Expected return (yearly)" value={ret} onChange={setRet} min={1} max={15} step={0.5} suffix="%" />
      </>}
      results={<>
        <Hero label={`Waiting ${d} ${d === 1 ? 'year' : 'years'} to start costs you`} value={res.cost}
          sub={<>Start today and ₹{monthly.toLocaleString('en-IN')} a month could reach <strong className="text-[#F3D58E]">{formatINRShort(res.now)}</strong>. Start {d} years later and it reaches {formatINRShort(res.later)}, though you would have invested only {formatINRShort(monthly * 12 * d)} less.</>}
          stats={[
            { label: 'Start today', value: formatINRShort(res.now), tone: 'gold' },
            { label: `Start in ${d} yrs`, value: formatINRShort(res.later) },
            { label: 'SIP needed to catch up', value: Number.isFinite(res.catchUp) ? `${formatINRFull(res.catchUp)}/mo` : 'n/a' }
          ]} />
        <GrowthChart title="Same SIP, two start dates"
          data={res.rows.map((r) => ({ label: `Yr ${r.year}`, now: Math.round(r.now), later: Math.round(r.later) }))}
          series={[{ key: 'now', name: 'Start today', color: '#E3B65C' }, { key: 'later', name: `Start after ${d} yrs`, color: '#3F6E96' }]} />
        <Note>Both SIPs end on the same date. The difference comes from the years of compounding you give up, not from the instalments you skip.</Note>
      </>}
      below={<div className="space-y-5">
        <YearTable caption={`What different delays cost (₹${monthly.toLocaleString('en-IN')}/month, ${horizon}-year goal, ${ret}%)`} columns={['Delay', 'Final value', 'Cost of waiting', 'SIP to catch up']}
          rows={table.map((t, i) => {
            const x = [0, 1, 2, 3, 5, 7, 10, 15].filter((y) => y < horizon)[i];
            return [x === 0 ? 'Start today' : `${x} ${x === 1 ? 'year' : 'years'}`, formatINRFull(t.later), formatINRFull(t.cost), Number.isFinite(t.catchUp) ? `${formatINRFull(t.catchUp)}/mo` : 'n/a'];
          })} initial={8} />
        <CalcCta text="The cheapest year to start is this one. Paperless KYC takes about ten minutes." calc="cost-of-delay calculator" result={`${formatINRShort(monthly)}/month at an assumed ${ret}%: waiting ${d} years costs ${formatINRShort(res.cost)} (illustrative, not guaranteed)`} />
      </div>}
    />
  );
};
