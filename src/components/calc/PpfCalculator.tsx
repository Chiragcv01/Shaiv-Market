import React, { useMemo, useState } from 'react';
import { SmartNumberInput } from '../SmartNumberInput';
import { CalcFrame, Hero, SplitBar, GrowthChart, YearTable, CalcCta, Note } from './kit';
import { ppf } from '../../utils/calcMath';
import { formatINRFull, formatINRShort } from '../../utils/money';

export const PPF_RATE = 7.1; // Oct-Dec 2026 quarter, set by the government every quarter

export const PpfCalculator: React.FC = () => {
  const [yearly, setYearly] = useState(150000);
  const [rate, setRate] = useState(PPF_RATE);
  const [years, setYears] = useState(15);
  const dep = Math.min(150000, Math.max(500, yearly));
  const res = useMemo(() => ppf(dep, rate, years), [dep, rate, years]);

  return (
    <CalcFrame
      id="ppf-calculator"
      inputs={<>
        <SmartNumberInput id="pp-yearly" label="Yearly deposit" value={yearly} onChange={setYearly} min={500} max={150000} step={500} isCurrency
          presets={[{ label: '₹50,000', value: 50000 }, { label: '₹1 L', value: 100000 }, { label: '₹1.5 L (max)', value: 150000 }]}
          helperText="PPF allows ₹500 to ₹1,50,000 in a financial year." />
        <SmartNumberInput id="pp-rate" label="Interest rate" value={rate} onChange={setRate} min={5} max={10} step={0.1} suffix="%"
          helperText={`${PPF_RATE}% is the rate for October to December 2026. The government reviews it every quarter.`} />
        <SmartNumberInput id="pp-years" label="Account period" value={years} onChange={setYears} min={15} max={50} step={5} suffix=" yrs"
          presets={[{ label: '15 yrs', value: 15 }, { label: '20 yrs', value: 20 }, { label: '25 yrs', value: 25 }, { label: '30 yrs', value: 30 }]}
          helperText="15 years, then optional extensions in blocks of 5." />
      </>}
      results={<>
        <Hero label={`PPF maturity value after ${years} years`} value={res.maturity}
          sub={<>Interest, maturity and (under the old tax regime) the deposit itself are tax-free, so this whole amount is yours.</>}
          stats={[
            { label: 'You deposit', value: formatINRShort(res.invested) },
            { label: 'Interest earned', value: formatINRShort(res.interest), tone: 'gold' },
            { label: 'Monthly equivalent', value: `${formatINRFull(dep / 12)}/mo` }
          ]} />
        <SplitBar parts={[{ label: 'Deposits', value: res.invested, color: '#3F6E96' }, { label: 'Interest', value: res.interest, color: '#E3B65C' }]} />
        <GrowthChart title="PPF balance by year"
          data={res.rows.map((r) => ({ label: `Yr ${r.year}`, balance: Math.round(r.balance), invested: dep * r.year }))}
          series={[{ key: 'balance', name: 'Balance', color: '#E3B65C' }, { key: 'invested', name: 'Deposited', color: '#3F6E96', dashed: true, fill: false }]} />
        <Note>Assumes the full deposit is made by 5 April each year, so it earns interest for the whole year, and the rate stays at {rate}% throughout. In practice the rate can change every quarter.</Note>
      </>}
      below={<div className="space-y-5">
        <YearTable caption="PPF schedule" columns={['Year', 'Deposit', 'Interest that year', 'Balance']}
          rows={res.rows.map((r) => [r.year, formatINRFull(r.deposit), formatINRFull(r.interest), formatINRFull(r.balance)])} />
        <CalcCta text="PPF is a great safe anchor. Pairing it with an equity SIP for long goals can do more than either alone." whatsappText="Hi Chirag, I used the PPF calculator. Can you show me how PPF and an equity SIP would work together for my goal?" />
      </div>}
    />
  );
};
