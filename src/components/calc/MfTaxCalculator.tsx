import React, { useMemo, useState } from 'react';
import { SmartNumberInput } from '../SmartNumberInput';
import { CalcFrame, Hero, CalcCta, Note, Segmented } from './kit';
import { mfTax, FundKind } from '../../utils/calcMath';
import { formatINRFull, formatINRShort } from '../../utils/money';

export const MfTaxCalculator: React.FC = () => {
  const [kind, setKind] = useState<FundKind>('equity');
  const [buy, setBuy] = useState(500000);
  const [sell, setSell] = useState(800000);
  const [months, setMonths] = useState(30);
  const [slab, setSlab] = useState(30);
  const [used, setUsed] = useState(0);
  const res = useMemo(() => mfTax({ kind, buy, sell, months, slabPct: slab, exemptionUsed: used }), [kind, buy, sell, months, slab, used]);

  const rows: [string, string][] = [
    ['Capital gain', formatINRFull(res.gain)],
    ['Type of gain', res.kind],
    ...(res.exemption > 0 ? [['Exempt (₹1.25 lakh yearly limit)', `− ${formatINRFull(res.exemption)}`] as [string, string]] : []),
    ['Taxable gain', formatINRFull(res.taxable)],
    [`Tax at ${res.rate}%`, formatINRFull(res.tax)],
    ['Health and education cess (4%)', formatINRFull(res.cess)],
    ['Total tax', formatINRFull(res.total)],
    ['Gain in hand after tax', formatINRFull(res.net)]
  ];

  return (
    <CalcFrame
      id="mutual-fund-tax-calculator"
      inputs={<>
        <Segmented<FundKind> label="Fund type" value={kind} onChange={setKind}
          options={[{ id: 'equity', label: 'Equity fund (incl. ELSS, index)' }, { id: 'debt', label: 'Debt fund (bought after Mar 2023)' }]} />
        <SmartNumberInput id="tx-buy" label="Amount invested (cost)" value={buy} onChange={setBuy} min={1000} max={100000000} step={1000} isCurrency />
        <SmartNumberInput id="tx-sell" label="Redemption value" value={sell} onChange={setSell} min={1000} max={200000000} step={1000} isCurrency />
        {kind === 'equity' && (
          <SmartNumberInput id="tx-months" label="Held for" value={months} onChange={setMonths} min={1} max={240} step={1} suffix=" months"
            presets={[{ label: '6 mo', value: 6 }, { label: '12 mo', value: 12 }, { label: '13 mo', value: 13 }, { label: '3 yrs', value: 36 }]}
            helperText="More than 12 months counts as long term for equity funds." />
        )}
        {(kind === 'debt') && (
          <Segmented<string> label="Your income tax slab" value={String(slab)} onChange={(v) => setSlab(Number(v))}
            options={['5', '10', '15', '20', '25', '30'].map((s) => ({ id: s, label: `${s}%` }))} />
        )}
        {kind === 'equity' && months > 12 && (
          <SmartNumberInput id="tx-used" label="Equity LTCG already booked this year" value={used} onChange={setUsed} min={0} max={125000} step={1000} isCurrency
            helperText="The ₹1.25 lakh exemption is per financial year, across all your equity funds and shares." />
        )}
      </>}
      results={<>
        <Hero label="Estimated tax on this redemption" value={res.total}
          sub={res.gain > 0 ? <>On a gain of {formatINRFull(res.gain)}, an effective rate of <strong className="text-[#F3D58E]">{res.effective.toFixed(1)}%</strong>. You keep {formatINRFull(res.net)} of the gain.</> : <>There is no gain, so no tax. A capital loss can be set off against other capital gains and carried forward for 8 years if you file your return on time.</>}
        />
        <div className="rounded-2xl bg-white ring-1 ring-[#E4EAF0] overflow-hidden">
          <table className="w-full text-sm">
            <caption className="sr-only">Tax working</caption>
            <tbody>
              {rows.map(([k, v], i) => (
                <tr key={k} className={`border-t border-[#EEF2F6] first:border-t-0 ${i >= rows.length - 2 ? 'font-semibold text-[#0F2740]' : ''}`}>
                  <th scope="row" className="text-left font-normal text-[#43566B] px-4 py-2.5">{k}</th>
                  <td className="text-right px-4 py-2.5 tabular-nums text-[#0F2740]">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Note>For resident individuals, FY 2026-27. Surcharge, the old grandfathering for units bought before February 2018, hybrid, gold and international funds are not covered. Each SIP instalment has its own holding period (first in, first out). This is an estimate, not tax advice; confirm with your CA before you redeem.</Note>
      </>}
      below={<CalcCta text="Timing redemptions across financial years can use the ₹1.25 lakh exemption twice. Ask before you sell." calc="mutual fund tax calculator" result={`${formatINRShort(buy)} bought, ${formatINRShort(sell)} on sale after ${months} months: estimated tax ${formatINRShort(res.total)}`} />}
    />
  );
};
