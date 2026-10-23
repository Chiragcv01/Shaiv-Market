// Pure maths for the newer calculators. Conventions match the existing SIP tools:
// monthly rate = annual rate / 12, SIP instalments at the start of each month.

export interface YearRow { year: number; invested: number; value: number; monthly?: number }

/** Step-up SIP: monthly amount rises by stepUp% once a year. */
export function stepUpSip(monthly: number, stepUpPct: number, annualRetPct: number, years: number) {
  const r = annualRetPct / 1200;
  let value = 0, invested = 0, flat = 0, sip = monthly;
  const rows: (YearRow & { flat: number })[] = [];
  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      value = (value + sip) * (1 + r);
      flat = (flat + monthly) * (1 + r);
      invested += sip;
    }
    rows.push({ year: y, invested, value, monthly: sip, flat });
    sip = sip * (1 + stepUpPct / 100);
  }
  const lastMonthly = rows.length ? rows[rows.length - 1].monthly! : monthly;
  return { value, invested, gains: value - invested, flatValue: flat, flatInvested: monthly * 12 * years, lastMonthly, rows };
}

/** One-time investment compounding yearly. */
export function lumpsum(amount: number, annualRetPct: number, years: number, inflationPct = 0) {
  const g = 1 + annualRetPct / 100;
  const value = amount * Math.pow(g, years);
  const real = value / Math.pow(1 + inflationPct / 100, years);
  const doubling = annualRetPct > 0 ? Math.log(2) / Math.log(g) : Infinity;
  const rows: YearRow[] = [];
  for (let y = 1; y <= Math.ceil(years); y++) rows.push({ year: y, invested: amount, value: amount * Math.pow(g, y) });
  return { value, gains: value - amount, real, doubling, rows };
}

/** Plain monthly SIP future value. */
export function sipValue(monthly: number, annualRetPct: number, months: number) {
  const r = annualRetPct / 1200;
  if (months <= 0) return 0;
  if (r === 0) return monthly * months;
  return monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
}

/** Monthly SIP needed for a target, optionally with a yearly step-up. */
export function sipForTarget(target: number, annualRetPct: number, years: number, stepUpPct = 0) {
  if (target <= 0 || years <= 0) return 0;
  const r = annualRetPct / 1200;
  let factor = 0, mult = 1;
  // value of ₹1 starting SIP (stepping up yearly) at the end of `years`
  let v = 0;
  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) v = (v + mult) * (1 + r);
    mult *= 1 + stepUpPct / 100;
  }
  factor = v;
  return factor > 0 ? target / factor : 0;
}

/** Present value, at retirement, of yearly withdrawals that rise with inflation (paid at the start of each year). */
export function retirementCorpus(firstYearSpend: number, years: number, postRetPct: number, inflationPct: number) {
  const r = postRetPct / 100, g = inflationPct / 100;
  if (years <= 0) return 0;
  if (Math.abs(r - g) < 1e-9) return firstYearSpend * years;
  return firstYearSpend * (1 + r) / (r - g) * (1 - Math.pow((1 + g) / (1 + r), years));
}

export function retirementPlan(p: {
  age: number; retireAge: number; lifeAge: number; monthlySpend: number; inflation: number;
  preRet: number; postRet: number; savings: number; stepUp: number;
}) {
  const yearsToGo = Math.max(1, p.retireAge - p.age);
  const yearsInRetirement = Math.max(1, p.lifeAge - p.retireAge);
  const spendAtRetirement = p.monthlySpend * Math.pow(1 + p.inflation / 100, yearsToGo);
  const corpus = retirementCorpus(spendAtRetirement * 12, yearsInRetirement, p.postRet, p.inflation);
  const savingsGrown = p.savings * Math.pow(1 + p.preRet / 100, yearsToGo);
  const gap = Math.max(0, corpus - savingsGrown);
  const sip = sipForTarget(gap, p.preRet, yearsToGo, p.stepUp);

  // life path: build up, then draw down
  const rows: { age: number; value: number; phase: 'build' | 'draw' }[] = [{ age: p.age, value: p.savings, phase: 'build' }];
  const r = p.preRet / 1200;
  let sipBal = 0, m = sip, bal = p.savings;
  for (let y = 1; y <= yearsToGo; y++) {
    for (let k = 0; k < 12; k++) sipBal = (sipBal + m) * (1 + r);
    m *= 1 + p.stepUp / 100;
    bal = p.savings * Math.pow(1 + p.preRet / 100, y) + sipBal; // savings compound yearly, as in the corpus maths
    rows.push({ age: p.age + y, value: bal, phase: 'build' });
  }
  let spend = spendAtRetirement * 12;
  let lastsTo = p.lifeAge;
  for (let y = 1; y <= yearsInRetirement; y++) {
    bal = (bal - spend) * (1 + p.postRet / 100);
    spend *= 1 + p.inflation / 100;
    if (bal < 0 && lastsTo === p.lifeAge) lastsTo = p.retireAge + y - 1;
    rows.push({ age: p.retireAge + y, value: Math.max(0, bal), phase: 'draw' });
  }
  return { yearsToGo, yearsInRetirement, spendAtRetirement, corpus, savingsGrown, gap, sip, rows };
}

/** What waiting before starting a SIP costs, at a fixed end date. */
export function delayCost(monthly: number, annualRetPct: number, horizonYears: number, delayYears: number) {
  const now = sipValue(monthly, annualRetPct, horizonYears * 12);
  const later = sipValue(monthly, annualRetPct, Math.max(0, horizonYears - delayYears) * 12);
  const r = annualRetPct / 1200;
  const n = Math.max(0, horizonYears - delayYears) * 12;
  const factor = n > 0 ? (r === 0 ? n : ((Math.pow(1 + r, n) - 1) / r) * (1 + r)) : 0;
  const catchUp = factor > 0 ? now / factor : Infinity;
  const rows: { year: number; now: number; later: number }[] = [];
  for (let y = 1; y <= horizonYears; y++) {
    rows.push({ year: y, now: sipValue(monthly, annualRetPct, y * 12), later: sipValue(monthly, annualRetPct, Math.max(0, y - delayYears) * 12) });
  }
  return { now, later, cost: now - later, catchUp, investedNow: monthly * horizonYears * 12, investedLater: monthly * n, rows };
}

/** Inflation: future cost and today's value of future money. */
export function inflation(amount: number, ratePct: number, years: number) {
  const f = Math.pow(1 + ratePct / 100, years);
  const rows: { year: number; cost: number; power: number }[] = [];
  for (let y = 0; y <= years; y++) {
    const k = Math.pow(1 + ratePct / 100, y);
    rows.push({ year: y, cost: amount * k, power: amount / k });
  }
  return { future: amount * f, power: amount / f, rows };
}

/** CAGR between two values. */
export function cagr(start: number, end: number, years: number) {
  if (start <= 0 || end <= 0 || years <= 0) return { cagr: 0, absolute: 0, doubling: Infinity };
  const c = Math.pow(end / start, 1 / years) - 1;
  return { cagr: c * 100, absolute: ((end - start) / start) * 100, doubling: c > 0 ? Math.log(2) / Math.log(1 + c) : Infinity };
}

/** PPF: yearly deposit at the start of each year, interest compounded yearly. */
export function ppf(yearly: number, ratePct: number, years: number) {
  const r = ratePct / 100;
  let bal = 0, invested = 0;
  const rows: { year: number; deposit: number; interest: number; balance: number }[] = [];
  for (let y = 1; y <= years; y++) {
    const opening = bal + yearly;
    const interest = opening * r;
    bal = opening + interest;
    invested += yearly;
    rows.push({ year: y, deposit: yearly, interest, balance: bal });
  }
  return { maturity: bal, invested, interest: bal - invested, rows };
}

export type FundKind = 'equity' | 'debt';

/** Capital gains tax on a mutual fund redemption (resident individual, FY 2026-27 rules). */
export function mfTax(p: { kind: FundKind; buy: number; sell: number; months: number; slabPct: number; exemptionUsed: number }) {
  const gain = p.sell - p.buy;
  const cess = 0.04;
  if (gain <= 0) return { gain, kind: gain < 0 ? 'Capital loss' : 'No gain', rate: 0, exemption: 0, taxable: 0, tax: 0, cess: 0, total: 0, net: gain, effective: 0 };
  let kind = '', rate = 0, exemption = 0;
  if (p.kind === 'equity') {
    if (p.months > 12) {
      kind = 'Long-term capital gain (LTCG)';
      rate = 12.5;
      exemption = Math.min(gain, Math.max(0, 125000 - p.exemptionUsed));
    } else {
      kind = 'Short-term capital gain (STCG)';
      rate = 20;
    }
  } else {
    kind = 'Taxed at your slab (debt fund bought on or after 1 April 2023)';
    rate = p.slabPct;
  }
  const taxable = Math.max(0, gain - exemption);
  const tax = taxable * rate / 100;
  const c = tax * cess;
  const total = tax + c;
  return { gain, kind, rate, exemption, taxable, tax, cess: c, total, net: gain - total, effective: (total / gain) * 100 };
}
