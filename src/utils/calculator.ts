export interface CalculationResult {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
  investedPercentage: number;
  returnsPercentage: number;
}

export function calculateSIP(
  monthlyInvestment: number,
  expectedReturnRate: number,
  timePeriodYears: number
): CalculationResult {
  const r = expectedReturnRate / (12 * 100);
  const n = timePeriodYears * 12;
  
  // Future Value of SIP: M * [((1 + r)^n - 1) / r] * (1 + r)
  let totalValue = 0;
  if (r === 0) {
    totalValue = monthlyInvestment * n;
  } else {
    totalValue = monthlyInvestment * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  }

  const investedAmount = monthlyInvestment * n;
  const estimatedReturns = Math.max(0, totalValue - investedAmount);
  
  const investedPercentage = totalValue > 0 ? (investedAmount / totalValue) * 100 : 50;
  const returnsPercentage = totalValue > 0 ? (estimatedReturns / totalValue) * 100 : 50;

  return {
    investedAmount,
    estimatedReturns,
    totalValue,
    investedPercentage,
    returnsPercentage
  };
}

export function calculateLumpsum(
  principal: number,
  expectedReturnRate: number,
  timePeriodYears: number
): CalculationResult {
  const r = expectedReturnRate / 100;
  const totalValue = principal * Math.pow(1 + r, timePeriodYears);
  const investedAmount = principal;
  const estimatedReturns = Math.max(0, totalValue - investedAmount);

  const investedPercentage = totalValue > 0 ? (investedAmount / totalValue) * 100 : 50;
  const returnsPercentage = totalValue > 0 ? (estimatedReturns / totalValue) * 100 : 50;

  return {
    investedAmount,
    estimatedReturns,
    totalValue,
    investedPercentage,
    returnsPercentage
  };
}

export function calculateStepUpSIP(
  initialMonthly: number,
  expectedReturnRate: number,
  timePeriodYears: number,
  annualStepUpPercent: number = 10
): CalculationResult {
  const r = expectedReturnRate / (12 * 100);
  let totalInvested = 0;
  let totalValue = 0;
  
  let currentMonthly = initialMonthly;

  for (let year = 1; year <= timePeriodYears; year++) {
    for (let month = 1; month <= 12; month++) {
      const remainingMonths = (timePeriodYears * 12) - ((year - 1) * 12 + month) + 1;
      totalInvested += currentMonthly;
      totalValue += currentMonthly * Math.pow(1 + r, remainingMonths);
    }
    currentMonthly = currentMonthly * (1 + annualStepUpPercent / 100);
  }

  const estimatedReturns = Math.max(0, totalValue - totalInvested);
  const investedPercentage = totalValue > 0 ? (totalInvested / totalValue) * 100 : 50;
  const returnsPercentage = totalValue > 0 ? (estimatedReturns / totalValue) * 100 : 50;

  return {
    investedAmount: totalInvested,
    estimatedReturns,
    totalValue,
    investedPercentage,
    returnsPercentage
  };
}

export function calculateSipPlusLumpsum(
  monthlyInvestment: number,
  initialLumpsum: number,
  expectedReturnRate: number,
  timePeriodYears: number
): CalculationResult {
  const sipResult = calculateSIP(monthlyInvestment, expectedReturnRate, timePeriodYears);
  const lumpsumResult = calculateLumpsum(initialLumpsum, expectedReturnRate, timePeriodYears);

  const totalInvested = sipResult.investedAmount + lumpsumResult.investedAmount;
  const totalValue = sipResult.totalValue + lumpsumResult.totalValue;
  const estimatedReturns = Math.max(0, totalValue - totalInvested);

  const investedPercentage = totalValue > 0 ? (totalInvested / totalValue) * 100 : 50;
  const returnsPercentage = totalValue > 0 ? (estimatedReturns / totalValue) * 100 : 50;

  return {
    investedAmount: totalInvested,
    estimatedReturns,
    totalValue,
    investedPercentage,
    returnsPercentage
  };
}

/**
 * Format standard Indian currency figures (Crores, Lakhs, Thousands)
 */
export function formatIndianCurrency(amount: number): string {
  if (isNaN(amount) || amount === 0) return '₹ 0';

  if (amount >= 10000000) {
    // 1 Crore = 10,000,000
    const inCrores = amount / 10000000;
    return `₹ ${inCrores >= 10 ? inCrores.toFixed(1) : inCrores.toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    // 1 Lakh = 100,000
    const inLakhs = amount / 100000;
    return `₹ ${inLakhs >= 10 ? inLakhs.toFixed(1) : inLakhs.toFixed(2)} L`;
  } else {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }
}

export function formatRawIndianNumber(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(amount);
}
