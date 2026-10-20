/** Future value of a monthly SIP (payment at start of each month). */
export function sipFutureValue(monthly: number, years: number, annualRate: number): number {
  if (years <= 0) return 0;
  const r = annualRate / 12;
  const n = years * 12;
  if (r === 0) return monthly * n;
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}

/** Monthly SIP needed to reach a target. */
export function requiredMonthlySip(target: number, years: number, annualRate: number): number {
  const r = annualRate / 12;
  const n = years * 12;
  if (r === 0) return target / n;
  return target / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
}

/** Indian short format: ₹4,500 · ₹12.4 L · ₹1.25 Cr */
export function formatINRShort(v: number): string {
  const abs = Math.abs(v);
  if (abs >= 1e7) return `₹${(v / 1e7).toFixed(abs >= 1e9 ? 0 : 2)} Cr`;
  if (abs >= 1e5) return `₹${(v / 1e5).toFixed(1)} L`;
  return `₹${Math.round(v).toLocaleString('en-IN')}`;
}

export function formatINRFull(v: number): string {
  return `₹${Math.round(v).toLocaleString('en-IN')}`;
}
