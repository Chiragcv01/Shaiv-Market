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

// -------------------------------------------------------------
// REVERSE SIP / TARGET CORPUS CALCULATOR ("Know Your SIP Amount")
// -------------------------------------------------------------
export interface TargetSipResult {
  targetCorpus: number;
  timePeriodYears: number;
  expectedReturnRate: number;
  annualStepUpPercent: number;
  requiredMonthlySip: number;
  finalMonthlySip: number;
  flatRequiredMonthlySip: number;
  monthlySavingsAtStart: number;
  totalInvested: number;
  totalGains: number;
  investedPercentage: number;
  returnsPercentage: number;
  lumpsumAlternative: number;
  yearlyMilestones: Array<{
    year: string;
    yearNum: number;
    monthlySip: number;
    yearlyInvested: number;
    invested: number;
    corpus: number;
    gains: number;
    progressPercent: number;
  }>;
}

export function calculateTargetSip(
  targetCorpus: number,
  timePeriodYears: number,
  expectedReturnRate: number,
  annualStepUpPercent: number = 0
): TargetSipResult {
  const r = expectedReturnRate / (12 * 100);
  const totalMonths = timePeriodYears * 12;
  
  // Calculate Flat SIP base for comparison
  let flatRequiredMonthlySip = 0;
  if (r === 0) {
    flatRequiredMonthlySip = targetCorpus / totalMonths;
  } else {
    flatRequiredMonthlySip = (targetCorpus * r) / ((Math.pow(1 + r, totalMonths) - 1) * (1 + r));
  }

  let requiredMonthlySip = flatRequiredMonthlySip;

  if (annualStepUpPercent > 0) {
    // With annual step-up: Calculate compounding multiplier K where Target = Initial_SIP * K
    let compoundMultiplier = 0;
    let currentStepMultiplier = 1;
    for (let yr = 1; yr <= timePeriodYears; yr++) {
      for (let m = 1; m <= 12; m++) {
        const remainingMonths = totalMonths - ((yr - 1) * 12 + m) + 1;
        compoundMultiplier += currentStepMultiplier * Math.pow(1 + r, remainingMonths);
      }
      currentStepMultiplier *= (1 + annualStepUpPercent / 100);
    }
    requiredMonthlySip = compoundMultiplier > 0 ? targetCorpus / compoundMultiplier : 0;
  }

  // Generate Year-by-Year Milestones
  let currentMonthly = requiredMonthlySip;
  let cumulativeInvested = 0;
  let runningCorpus = 0;
  let finalYearMonthly = requiredMonthlySip;
  const yearlyMilestones: TargetSipResult['yearlyMilestones'] = [];

  for (let yr = 1; yr <= timePeriodYears; yr++) {
    let yearInvested = 0;
    finalYearMonthly = currentMonthly;
    for (let m = 1; m <= 12; m++) {
      yearInvested += currentMonthly;
      cumulativeInvested += currentMonthly;
      runningCorpus = (runningCorpus + currentMonthly) * (1 + r);
    }

    const progress = Math.min(100, Math.round((runningCorpus / targetCorpus) * 100));
    yearlyMilestones.push({
      year: `Yr ${yr}`,
      yearNum: yr,
      monthlySip: Math.round(currentMonthly),
      yearlyInvested: Math.round(yearInvested),
      invested: Math.round(cumulativeInvested),
      corpus: Math.round(runningCorpus),
      gains: Math.round(Math.max(0, runningCorpus - cumulativeInvested)),
      progressPercent: progress
    });

    if (annualStepUpPercent > 0) {
      currentMonthly *= (1 + annualStepUpPercent / 100);
    }
  }

  const finalInvested = Math.round(cumulativeInvested);
  const finalCorpus = Math.round(runningCorpus);
  const totalGains = Math.max(0, finalCorpus - finalInvested);
  const lumpsumAlternative = Math.round(targetCorpus / Math.pow(1 + expectedReturnRate / 100, timePeriodYears));
  const roundedRequiredMonthly = Math.round(requiredMonthlySip);
  const roundedFlatRequired = Math.round(flatRequiredMonthlySip);

  return {
    targetCorpus,
    timePeriodYears,
    expectedReturnRate,
    annualStepUpPercent,
    requiredMonthlySip: roundedRequiredMonthly,
    finalMonthlySip: Math.round(finalYearMonthly),
    flatRequiredMonthlySip: roundedFlatRequired,
    monthlySavingsAtStart: Math.max(0, roundedFlatRequired - roundedRequiredMonthly),
    totalInvested: finalInvested,
    totalGains,
    investedPercentage: finalCorpus > 0 ? Math.round((finalInvested / finalCorpus) * 100) : 50,
    returnsPercentage: finalCorpus > 0 ? Math.round((totalGains / finalCorpus) * 100) : 50,
    lumpsumAlternative,
    yearlyMilestones
  };
}

// -------------------------------------------------------------
// 1. GOAL-BASED WEALTH PLANNER
// -------------------------------------------------------------
export interface GoalPlanningResult {
  targetFutureValue: number;
  currentSavingsFutureValue: number;
  remainingTarget: number;
  requiredMonthlySIP: number;
  requiredLumpsumToday: number;
  equityAllocationPercent: number;
  debtAllocationPercent: number;
  yearlyRoadmap: Array<{
    year: number;
    invested: number;
    expectedCorpus: number;
    targetProgress: number;
  }>;
}

export function calculateGoalPlan(
  targetTodayCost: number,
  yearsToGoal: number,
  inflationRate: number,
  expectedReturnRate: number,
  existingSavings: number = 0
): GoalPlanningResult {
  // Future Cost with Inflation: FV = PV * (1 + inflation)^years
  const targetFutureValue = targetTodayCost * Math.pow(1 + inflationRate / 100, yearsToGoal);
  
  // Future value of existing savings
  const currentSavingsFutureValue = existingSavings * Math.pow(1 + expectedReturnRate / 100, yearsToGoal);
  const remainingTarget = Math.max(0, targetFutureValue - currentSavingsFutureValue);

  // Required Monthly SIP: M = Target * [r / ((1 + r)^n - 1)] / (1 + r)
  const r = expectedReturnRate / (12 * 100);
  const n = yearsToGoal * 12;
  let requiredMonthlySIP = 0;
  if (remainingTarget > 0 && n > 0) {
    if (r === 0) {
      requiredMonthlySIP = remainingTarget / n;
    } else {
      requiredMonthlySIP = (remainingTarget * r) / ((Math.pow(1 + r, n) - 1) * (1 + r));
    }
  }

  // Required Lumpsum Today
  const requiredLumpsumToday = remainingTarget / Math.pow(1 + expectedReturnRate / 100, yearsToGoal);

  // Asset allocation recommendation based on time horizon
  let equityAllocationPercent = 75;
  let debtAllocationPercent = 25;
  if (yearsToGoal <= 3) {
    equityAllocationPercent = 20;
    debtAllocationPercent = 80;
  } else if (yearsToGoal <= 5) {
    equityAllocationPercent = 50;
    debtAllocationPercent = 50;
  } else if (yearsToGoal <= 10) {
    equityAllocationPercent = 75;
    debtAllocationPercent = 25;
  } else {
    equityAllocationPercent = 85;
    debtAllocationPercent = 15;
  }

  // Yearly Roadmap
  const yearlyRoadmap = [];
  let cumulativeInvested = existingSavings;
  let runningCorpus = existingSavings;

  for (let yr = 1; yr <= yearsToGoal; yr++) {
    for (let m = 1; m <= 12; m++) {
      cumulativeInvested += requiredMonthlySIP;
      runningCorpus = (runningCorpus + requiredMonthlySIP) * (1 + r);
    }
    const targetProgress = Math.min(100, (runningCorpus / targetFutureValue) * 100);
    yearlyRoadmap.push({
      year: yr,
      invested: Math.round(cumulativeInvested),
      expectedCorpus: Math.round(runningCorpus),
      targetProgress: Math.round(targetProgress)
    });
  }

  return {
    targetFutureValue: Math.round(targetFutureValue),
    currentSavingsFutureValue: Math.round(currentSavingsFutureValue),
    remainingTarget: Math.round(remainingTarget),
    requiredMonthlySIP: Math.round(requiredMonthlySIP),
    requiredLumpsumToday: Math.round(requiredLumpsumToday),
    equityAllocationPercent,
    debtAllocationPercent,
    yearlyRoadmap
  };
}

// -------------------------------------------------------------
// 2. SYSTEMATIC WITHDRAWAL PLAN (SWP) / PENSION CALCULATOR
// -------------------------------------------------------------
export interface SwpResult {
  initialCorpus: number;
  totalWithdrawn: number;
  finalCorpus: number;
  totalGainOrLoss: number;
  exhaustedYear: number | null;
  yearlySchedule: Array<{
    year: number;
    withdrawnThisYear: number;
    cumulativeWithdrawn: number;
    interestEarned: number;
    closingBalance: number;
  }>;
}

export function calculateSWP(
  initialCorpus: number,
  monthlyWithdrawal: number,
  expectedReturnRate: number,
  tenureYears: number,
  annualInflationStepUp: number = 0
): SwpResult {
  const monthlyRate = expectedReturnRate / (12 * 100);
  let balance = initialCorpus;
  let totalWithdrawn = 0;
  let currentMonthlyWithdrawal = monthlyWithdrawal;
  let exhaustedYear: number | null = null;

  const yearlySchedule = [];

  for (let yr = 1; yr <= tenureYears; yr++) {
    let withdrawnThisYear = 0;
    let interestEarnedThisYear = 0;

    for (let m = 1; m <= 12; m++) {
      if (balance <= 0) {
        balance = 0;
        if (exhaustedYear === null) exhaustedYear = yr;
        break;
      }

      // 1 month return earned on current balance
      const monthlyInterest = balance * monthlyRate;
      interestEarnedThisYear += monthlyInterest;
      balance += monthlyInterest;

      // Withdraw at end of month
      const actualWithdrawal = Math.min(balance, currentMonthlyWithdrawal);
      balance -= actualWithdrawal;
      withdrawnThisYear += actualWithdrawal;
      totalWithdrawn += actualWithdrawal;
    }

    yearlySchedule.push({
      year: yr,
      withdrawnThisYear: Math.round(withdrawnThisYear),
      cumulativeWithdrawn: Math.round(totalWithdrawn),
      interestEarned: Math.round(interestEarnedThisYear),
      closingBalance: Math.round(balance)
    });

    if (annualInflationStepUp > 0) {
      currentMonthlyWithdrawal *= (1 + annualInflationStepUp / 100);
    }
  }

  const finalCorpus = Math.round(Math.max(0, balance));
  const totalGainOrLoss = Math.round(finalCorpus + totalWithdrawn - initialCorpus);

  return {
    initialCorpus,
    totalWithdrawn: Math.round(totalWithdrawn),
    finalCorpus,
    totalGainOrLoss,
    exhaustedYear,
    yearlySchedule
  };
}

// -------------------------------------------------------------
// 3. HOME LOAN PREPAYMENT VS. MUTUAL FUND SIP ENGINE
// -------------------------------------------------------------
export interface LoanVsSipResult {
  regularEMI: number;
  totalRegularInterest: number;
  totalRegularPayment: number;
  
  // Strategy 1: Prepay Loan
  prepayTenureYears: number;
  prepayInterestPaid: number;
  interestSaved: number;
  yearsSaved: number;

  // Strategy 2: Keep Loan + Invest Extra in SIP
  sipInvestedAmount: number;
  sipMaturityWealth: number;
  sipNetProfit: number;

  // Comparative Verdict
  netWealthAdvantage: number; // Positive means SIP generates more surplus
  verdict: 'Invest in SIP' | 'Prepay Loan';
  comparisonChart: Array<{
    year: number;
    loanRemainingStrategy1: number;
    sipCorpusStrategy2: number;
  }>;
}

export function calculateLoanVsSip(
  loanAmount: number,
  interestRate: number,
  tenureYears: number,
  extraMonthlySavings: number,
  expectedMfReturn: number = 12.5
): LoanVsSipResult {
  const r = interestRate / (12 * 100);
  const n = tenureYears * 12;
  
  // Monthly EMI = P * r * (1+r)^n / ((1+r)^n - 1)
  const regularEMI = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalRegularPayment = regularEMI * n;
  const totalRegularInterest = totalRegularPayment - loanAmount;

  // Strategy 1: Paying (regularEMI + extraMonthlySavings) towards loan
  let prepayBalance = loanAmount;
  let prepayTotalInterest = 0;
  let prepayMonths = 0;
  const enhancedMonthlyPayment = regularEMI + extraMonthlySavings;

  while (prepayBalance > 0 && prepayMonths < n) {
    const monthlyInt = prepayBalance * r;
    prepayTotalInterest += monthlyInt;
    const principalPaid = enhancedMonthlyPayment - monthlyInt;
    prepayBalance -= principalPaid;
    prepayMonths++;
    if (prepayBalance <= 0) break;
  }

  const prepayTenureYears = Number((prepayMonths / 12).toFixed(1));
  const interestSaved = Math.max(0, totalRegularInterest - prepayTotalInterest);
  const yearsSaved = Number((tenureYears - prepayTenureYears).toFixed(1));

  // Strategy 2: Regular Loan EMI + Extra Monthly Savings in SIP for original tenure
  const sipResult = calculateSIP(extraMonthlySavings, expectedMfReturn, tenureYears);
  const sipInvestedAmount = sipResult.investedAmount;
  const sipMaturityWealth = sipResult.totalValue;
  const sipNetProfit = sipResult.estimatedReturns;

  // Net Wealth Advantage:
  // Under Strategy 2, you pay full interest on loan but build an enormous SIP corpus.
  // Surplus = SIP Maturity Wealth - (Total Regular Interest - Prepay Total Interest)
  const netWealthAdvantage = Math.round(sipMaturityWealth - interestSaved - sipInvestedAmount);
  const verdict = sipNetProfit > interestSaved ? 'Invest in SIP' : 'Prepay Loan';

  // Build Year-by-Year Comparison Chart
  const comparisonChart = [];
  let s1Bal = loanAmount;
  const sipMonthlyRate = expectedMfReturn / (12 * 100);
  let s2SipValue = 0;

  for (let yr = 1; yr <= tenureYears; yr++) {
    for (let m = 1; m <= 12; m++) {
      if (s1Bal > 0) {
        const intAmt = s1Bal * r;
        const princ = enhancedMonthlyPayment - intAmt;
        s1Bal = Math.max(0, s1Bal - princ);
      }
      s2SipValue = (s2SipValue + extraMonthlySavings) * (1 + sipMonthlyRate);
    }

    comparisonChart.push({
      year: yr,
      loanRemainingStrategy1: Math.round(s1Bal),
      sipCorpusStrategy2: Math.round(s2SipValue)
    });
  }

  return {
    regularEMI: Math.round(regularEMI),
    totalRegularInterest: Math.round(totalRegularInterest),
    totalRegularPayment: Math.round(totalRegularPayment),
    prepayTenureYears,
    prepayInterestPaid: Math.round(prepayTotalInterest),
    interestSaved: Math.round(interestSaved),
    yearsSaved,
    sipInvestedAmount: Math.round(sipInvestedAmount),
    sipMaturityWealth: Math.round(sipMaturityWealth),
    sipNetProfit: Math.round(sipNetProfit),
    netWealthAdvantage,
    verdict,
    comparisonChart
  };
}

// -------------------------------------------------------------
// 4. FIRE (FINANCIAL INDEPENDENCE, RETIRE EARLY) CALCULATOR
// -------------------------------------------------------------
export interface FireResult {
  currentMonthlyExpense: number;
  annualExpenseToday: number;
  futureAnnualExpenseAtRetirement: number;
  fireCorpusRequired: number; // Standard 25x / 30x rule
  leanFireCorpus: number;
  fatFireCorpus: number;
  yearsToFire: number;
  fireAge: number;
  existingSavingsFutureValue: number;
  monthlySavingsRequired: number;
  isFireAchievable: boolean;
  savingsRatePercent: number;
}

export function calculateFIRE(
  currentAge: number,
  targetFireAge: number,
  monthlyExpense: number,
  monthlySavings: number,
  currentNetWorth: number,
  monthlyIncome: number,
  inflationRate: number = 6,
  preRetirementReturn: number = 12,
  swrPercent: number = 3.5 // Safe withdrawal rate (3.5% is institutional standard for India)
): FireResult {
  const yearsToRetirement = Math.max(1, targetFireAge - currentAge);
  const annualExpenseToday = monthlyExpense * 12;
  
  // Future Annual Expense with inflation
  const futureAnnualExpenseAtRetirement = annualExpenseToday * Math.pow(1 + inflationRate / 100, yearsToRetirement);

  // Standard FIRE Target = Future Annual Expense / SWR
  const fireCorpusRequired = Math.round(futureAnnualExpenseAtRetirement / (swrPercent / 100));
  const leanFireCorpus = Math.round(fireCorpusRequired * 0.75); // 75% of standard for frugal lifestyle
  const fatFireCorpus = Math.round(fireCorpusRequired * 1.35); // 135% for luxurious lifestyle

  // Future Value of Current Net Worth
  const existingSavingsFutureValue = currentNetWorth * Math.pow(1 + preRetirementReturn / 100, yearsToRetirement);
  const remainingTarget = Math.max(0, fireCorpusRequired - existingSavingsFutureValue);

  // Required Monthly Savings to reach target
  const r = preRetirementReturn / (12 * 100);
  const n = yearsToRetirement * 12;
  let monthlySavingsRequired = 0;
  if (remainingTarget > 0 && n > 0) {
    monthlySavingsRequired = (remainingTarget * r) / ((Math.pow(1 + r, n) - 1) * (1 + r));
  }

  // Future Wealth accumulated with CURRENT savings
  let accumulatedWithCurrentSavings = existingSavingsFutureValue;
  if (monthlySavings > 0) {
    const sipRes = calculateSIP(monthlySavings, preRetirementReturn, yearsToRetirement);
    accumulatedWithCurrentSavings += sipRes.totalValue;
  }

  const isFireAchievable = accumulatedWithCurrentSavings >= fireCorpusRequired;
  const savingsRatePercent = monthlyIncome > 0 ? Math.min(100, Math.round((monthlySavings / monthlyIncome) * 100)) : 0;

  return {
    currentMonthlyExpense: monthlyExpense,
    annualExpenseToday,
    futureAnnualExpenseAtRetirement: Math.round(futureAnnualExpenseAtRetirement),
    fireCorpusRequired,
    leanFireCorpus,
    fatFireCorpus,
    yearsToFire: yearsToRetirement,
    fireAge: targetFireAge,
    existingSavingsFutureValue: Math.round(existingSavingsFutureValue),
    monthlySavingsRequired: Math.round(monthlySavingsRequired),
    isFireAchievable,
    savingsRatePercent
  };
}

// -------------------------------------------------------------
// 5. MUTUAL FUND CAPITAL GAINS TAX ESTIMATOR (Budget 2024-26)
// -------------------------------------------------------------
export interface MfTaxResult {
  totalPurchaseCost: number;
  totalRedemptionValue: number;
  grossCapitalGain: number;
  isLoss: boolean;
  holdingPeriodMonths: number;
  gainType: 'Short Term (STCG)' | 'Long Term (LTCG)';
  applicableTaxRatePercent: number;
  exemptionAllowed: number; // ₹1,25,000 for Equity LTCG
  taxableGain: number;
  taxPayable: number;
  cessAmount: number; // 4% Health & Education Cess
  totalTaxWithCess: number;
  netInHandProfit: number;
  effectiveTaxRatePercent: number;
}

export function calculateMfTax(
  fundType: 'Equity' | 'Debt' | 'Hybrid',
  purchaseAmount: number,
  saleAmount: number,
  holdingPeriodMonths: number,
  investorTaxSlabPercent: number = 30,
  alreadyClaimedLtcgExemption: number = 0 // from other investments in FY
): MfTaxResult {
  const grossCapitalGain = saleAmount - purchaseAmount;
  const isLoss = grossCapitalGain <= 0;

  if (isLoss) {
    return {
      totalPurchaseCost: purchaseAmount,
      totalRedemptionValue: saleAmount,
      grossCapitalGain,
      isLoss: true,
      holdingPeriodMonths,
      gainType: holdingPeriodMonths > 12 ? 'Long Term (LTCG)' : 'Short Term (STCG)',
      applicableTaxRatePercent: 0,
      exemptionAllowed: 0,
      taxableGain: 0,
      taxPayable: 0,
      cessAmount: 0,
      totalTaxWithCess: 0,
      netInHandProfit: grossCapitalGain,
      effectiveTaxRatePercent: 0
    };
  }

  let gainType: 'Short Term (STCG)' | 'Long Term (LTCG)' = 'Short Term (STCG)';
  let applicableTaxRatePercent = 20; // Default equity STCG
  let exemptionAllowed = 0;

  if (fundType === 'Equity' || fundType === 'Hybrid') {
    if (holdingPeriodMonths > 12) {
      gainType = 'Long Term (LTCG)';
      applicableTaxRatePercent = 12.5; // New Finance Act 2024 rule
      const maxExemption = 125000;
      const availableExemption = Math.max(0, maxExemption - alreadyClaimedLtcgExemption);
      exemptionAllowed = Math.min(grossCapitalGain, availableExemption);
    } else {
      gainType = 'Short Term (STCG)';
      applicableTaxRatePercent = 20.0; // New Finance Act 2024 rule
      exemptionAllowed = 0;
    }
  } else {
    // Debt Mutual Funds (Purchased after April 1, 2023 are taxed at income tax slab rates)
    gainType = holdingPeriodMonths > 36 ? 'Long Term (LTCG)' : 'Short Term (STCG)';
    applicableTaxRatePercent = investorTaxSlabPercent;
    exemptionAllowed = 0;
  }

  const taxableGain = Math.max(0, grossCapitalGain - exemptionAllowed);
  const taxPayable = (taxableGain * applicableTaxRatePercent) / 100;
  const cessAmount = taxPayable * 0.04; // 4% cess
  const totalTaxWithCess = Math.round(taxPayable + cessAmount);
  const netInHandProfit = Math.round(grossCapitalGain - totalTaxWithCess);
  const effectiveTaxRatePercent = Number(((totalTaxWithCess / grossCapitalGain) * 100).toFixed(2));

  return {
    totalPurchaseCost: purchaseAmount,
    totalRedemptionValue: saleAmount,
    grossCapitalGain: Math.round(grossCapitalGain),
    isLoss: false,
    holdingPeriodMonths,
    gainType,
    applicableTaxRatePercent,
    exemptionAllowed: Math.round(exemptionAllowed),
    taxableGain: Math.round(taxableGain),
    taxPayable: Math.round(taxPayable),
    cessAmount: Math.round(cessAmount),
    totalTaxWithCess,
    netInHandProfit,
    effectiveTaxRatePercent
  };
}

// -------------------------------------------------------------
// 6. EMERGENCY FUND SAFETY CUSHION
// -------------------------------------------------------------
export interface EmergencyFundResult {
  totalMonthlyMandatoryExpense: number;
  tier3MonthsBasic: number;
  tier6MonthsRecommended: number;
  tier12MonthsRobust: number;
  savingsShortfall: number;
  suggestedAllocation: {
    overnightFunds: number; // 25% instant liquidity
    liquidFunds: number; // 50% high safety & better yield
    highYieldSavings: number; // 25% ATM/debit access
  };
}

export function calculateEmergencyFund(
  rentOrEmi: number,
  groceriesAndUtilities: number,
  familyAndEducation: number,
  insurancePremiumsMonthly: number,
  currentLiquidSavings: number
): EmergencyFundResult {
  const totalMonthlyMandatoryExpense = rentOrEmi + groceriesAndUtilities + familyAndEducation + insurancePremiumsMonthly;
  const tier3MonthsBasic = totalMonthlyMandatoryExpense * 3;
  const tier6MonthsRecommended = totalMonthlyMandatoryExpense * 6;
  const tier12MonthsRobust = totalMonthlyMandatoryExpense * 12;

  const savingsShortfall = Math.max(0, tier6MonthsRecommended - currentLiquidSavings);

  const suggestedAllocation = {
    overnightFunds: Math.round(tier6MonthsRecommended * 0.25),
    liquidFunds: Math.round(tier6MonthsRecommended * 0.50),
    highYieldSavings: Math.round(tier6MonthsRecommended * 0.25)
  };

  return {
    totalMonthlyMandatoryExpense: Math.round(totalMonthlyMandatoryExpense),
    tier3MonthsBasic: Math.round(tier3MonthsBasic),
    tier6MonthsRecommended: Math.round(tier6MonthsRecommended),
    tier12MonthsRobust: Math.round(tier12MonthsRobust),
    savingsShortfall: Math.round(savingsShortfall),
    suggestedAllocation
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

