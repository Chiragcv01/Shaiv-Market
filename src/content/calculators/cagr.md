---
tab: cagr
answer: "CAGR (compound annual growth rate) is the steady yearly rate that turns a starting value into an ending value. Formula: CAGR = (Ending value ÷ Starting value)^(1 ÷ years) − 1. ₹1 lakh growing to ₹2.5 lakh in 5 years is a CAGR of 20.11%, even though the absolute return is 150%. For a SIP, use the SIP return (XIRR) option above instead: CAGR on total invested understates a SIP's return. The calculator also works in reverse: future value at an assumed CAGR, or the amount you need to invest today."
related: direct-vs-regular-mutual-fund, sip-vs-fd, sip-for-1-crore
updated: 2026-11-13
---
## The CAGR formula

**CAGR = (Ending value ÷ Starting value)<sup>1 ÷ years</sup> − 1**

For ₹1 lakh becoming ₹2.5 lakh in 5 years: (2.5)<sup>0.2</sup> − 1 = 0.2011, or **20.11% a year**.

In Excel or Google Sheets: `=(End/Start)^(1/Years)-1`, or `=RRI(Years, Start, End)`.

## Four ways to use this calculator

| Option | You enter | You get | Typical question |
|---|---|---|---|
| **CAGR** | Start value, end value, years | Yearly growth rate | "My ₹1 lakh became ₹2.5 lakh in 5 years. What is the CAGR?" |
| **Future value** | Amount today, assumed CAGR, years | Value at the end | "What will ₹1 lakh be worth in 10 years at 12%?" |
| **Amount needed today** | Target, assumed CAGR, years | Present value | "How much should I invest today to have ₹10 lakh in 10 years?" |
| **SIP return (XIRR)** | Monthly SIP, years, current value | Annualised SIP return | "How do I calculate CAGR for my SIP?" |

Every answer also shows the absolute return, the monthly equivalent rate and a year-wise table. Future figures use an **assumed rate, not a guaranteed one**.

## How to calculate CAGR for a SIP

You can't plug a SIP into the CAGR formula directly. CAGR assumes all the money went in on day one. In a SIP, the first instalment is invested for the full period but the last one for only a month, so dividing today's value by the total invested **understates** the return.

The right measure for a SIP is **XIRR**: the yearly rate that makes every instalment, on its own date, grow to today's value. It is what your mutual fund statement (CAS) shows.

**Example:** ₹10,000 a month for 5 years is ₹6 lakh invested. If it is worth ₹8.2 lakh today:

- CAGR on total invested, treating ₹6 lakh as one lumpsum: **6.45%**, which is misleading
- XIRR, counting when each instalment went in: **12.44% a year**, which is the true return

Pick **SIP return (XIRR)** above, enter your monthly SIP, how long it has run and its current value. For irregular SIPs, top-ups or withdrawals, use Excel's `=XIRR(values, dates)` with investments as negative numbers and today's value as a positive number.

## Reverse CAGR: future value and present value

The same formula runs backwards:

- **Future value** = Amount today × (1 + CAGR)<sup>years</sup>. ₹1 lakh at an assumed 12% for 10 years ≈ **₹3.11 lakh**.
- **Present value** (amount needed today) = Target ÷ (1 + CAGR)<sup>years</sup>. To have ₹10 lakh in 10 years at an assumed 12%, invest about **₹3.22 lakh today**.

Both are illustrations at an assumed rate, not guaranteed returns. If you would rather invest monthly towards a target, the [required SIP calculator](/calculators/required-sip-calculator) gives the SIP amount.

## Monthly CAGR

To turn a yearly CAGR into a monthly rate: **(1 + CAGR)<sup>1/12</sup> − 1**. A 12% yearly CAGR is about **0.95% a month**, not 1%, because monthly growth compounds. The calculator shows this as "Monthly equivalent".

## CAGR for 2x, 3x, 5x and 10x

How fast money has to grow to multiply over a period (CAGR, % a year):

| Multiple | 3 years | 5 years | 7 years | 10 years | 15 years |
|---|---|---|---|---|---|
| 2x | 26.0% | 14.9% | 10.4% | 7.2% | 4.7% |
| 3x | 44.2% | 24.6% | 17.0% | 11.6% | 7.6% |
| 5x | 71.0% | 38.0% | 25.8% | 17.5% | 11.3% |
| 10x | 115.4% | 58.5% | 38.9% | 25.9% | 16.6% |

So "5x in 10 years" needs a CAGR of about 17.5%, and "10x in 5 years" about 58.5%. The higher the multiple and the shorter the time, the less realistic the rate.

## Absolute return to CAGR

| Absolute return | Over | CAGR |
|---|---|---|
| 50% | 3 years | 14.47% |
| 100% (doubled) | 5 years | 14.87% |
| 150% | 5 years | 20.11% |
| 200% (tripled) | 10 years | 11.61% |

Convert any absolute return with: **CAGR = (1 + absolute return)<sup>1 ÷ years</sup> − 1**.

## Why CAGR beats "average return"

Say an investment rises 50% in year one and falls 50% in year two. The average of the two years is 0%, which sounds like you broke even. You did not: ₹1 lakh became ₹1.5 lakh and then ₹75,000. The CAGR, −13.4% a year, tells the truth. Averages flatter volatile investments; CAGR doesn't.

## Using CAGR well

- **Compare like with like**: a fund's 5-year CAGR against its benchmark's 5-year CAGR over the same dates.
- **Watch the start date.** A CAGR measured from a market low looks brilliant; from a peak, poor. Look at several periods.
- **Past CAGR is not a forecast.** It describes what happened, not what will happen.
- **Works for anything with a start and an end value**: stocks, gold, property, an index, a business's revenue, or market size.

Want to project a one-time investment with inflation too? Try the [lumpsum calculator](/calculators/lumpsum-calculator). For what a sum will really buy in future, see the [inflation calculator](/calculators/inflation-calculator).

## Questions people ask

### How do I calculate CAGR for a SIP?
Don't use the lumpsum CAGR formula on total invested; it understates a SIP's return. Use XIRR, which counts when each instalment went in. Choose "SIP return (XIRR)" in the calculator above, or use Excel's XIRR function with your instalment dates. ₹10,000 a month for 5 years worth ₹8.2 lakh is an XIRR of about 12.44%, but only 6.45% if wrongly treated as one lumpsum.

### What is the CAGR formula?
CAGR = (Ending value ÷ Starting value)^(1 ÷ number of years) − 1. In Excel: =(End/Start)^(1/Years)-1 or =RRI(Years, Start, End).

### What is a reverse CAGR calculator?
It works the formula backwards. Given a starting amount, an assumed CAGR and years, it gives the future value: ₹1 lakh at an assumed 12% for 10 years is about ₹3.11 lakh. Given a target, it gives the amount needed today: about ₹3.22 lakh today for ₹10 lakh in 10 years at an assumed 12%. These are illustrations, not guaranteed returns.

### How do I calculate monthly CAGR?
Monthly rate = (1 + yearly CAGR)^(1/12) − 1. A 12% yearly CAGR is about 0.95% a month.

### What CAGR doubles money in 5 years?
About 14.9% a year. Money triples in 5 years at about 24.6%, and grows 5x in 10 years at about 17.5%.

### How do I calculate CAGR for 3 years?
Divide the ending value by the starting value, raise the result to the power 1/3, and subtract 1. ₹1 lakh growing to ₹1.5 lakh in 3 years is a CAGR of about 14.5%.

### What is the difference between CAGR and absolute return?
Absolute return is the total percentage gain over the whole period. CAGR spreads that gain into an equal yearly rate. 150% absolute over 5 years is about 20.1% CAGR.

### What is the difference between CAGR and XIRR?
CAGR is for one investment with one start and one end value. XIRR handles many investments or withdrawals on different dates, which is why it is used for SIPs. For a single lumpsum with no other cash flows, the two give the same answer.

### Can CAGR be negative?
Yes. If the ending value is below the starting value, the CAGR is negative. ₹1 lakh falling to ₹75,000 over 2 years is a CAGR of −13.4%.

### What is a good CAGR for mutual funds?
It depends on the fund category and the period. Compare a fund's CAGR with its benchmark index and similar funds over the same dates, rather than with a fixed number. Past CAGR does not guarantee future returns.
