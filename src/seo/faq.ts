export interface Faq { q: string; a: string }

export const HOME_FAQ: Faq[] = [
  {
    q: 'Who is Chirag Sharma of Shaiv Market?',
    a: 'Chirag Sharma is an AMFI registered mutual fund distributor based in Jaipur, Rajasthan, with ARN-337289 and EUIN E641362. He is NISM Series V-A certified and runs Shaiv Market, helping individuals and families plan SIPs and life goals across India.'
  },
  {
    q: 'Is Shaiv Market registered with AMFI, and how can I verify it?',
    a: 'Yes. Chirag Sharma holds AMFI Registration Number ARN-337289, valid until 13 August 2028. You can verify it on the official AMFI website (amfiindia.com) using the "Locate Distributor" search with the ARN.'
  },
  {
    q: 'Do you charge a fee for the consultation?',
    a: 'No. The first portfolio review call is free. As a mutual fund distributor, Shaiv Market is paid a commission by fund houses on regular plans; investors are not charged a separate advisory fee.'
  },
  {
    q: 'What is the difference between direct and regular mutual fund plans?',
    a: 'Both invest in the same portfolio. A direct plan has no distributor commission, so its expense ratio is lower. A regular plan includes the distributor commission in its expense ratio and comes with a distributor who handles scheme selection, paperwork, SIP setup and ongoing reviews for you.'
  },
  {
    q: 'How much SIP do I need to build ₹1 crore?',
    a: 'At an assumed 12% yearly return, about ₹10,000 a month for 20 years, ₹19,800 a month for 15 years, or ₹43,000 a month for 10 years. Returns are not guaranteed; use the required SIP calculator to try your own numbers.'
  },
  {
    q: 'What is the minimum amount to start a SIP?',
    a: 'Many mutual fund schemes accept SIPs from ₹500 a month, and some from ₹100. You can increase the amount later or add a yearly step-up.'
  },
  {
    q: 'Can I invest with Shaiv Market if I do not live in Jaipur?',
    a: 'Yes. KYC is paperless using Aadhaar and PAN, and consultations happen on video, phone or WhatsApp, so investors anywhere in India can invest. In-person meetings are available at the Jaipur office.'
  },
  {
    q: 'Which documents do I need to start investing in mutual funds?',
    a: 'Your PAN, Aadhaar, bank account details (a cancelled cheque or bank statement) and a photo. For a minor, the guardian’s details are needed too.'
  },
  {
    q: 'Are mutual fund returns guaranteed?',
    a: 'No. Mutual fund returns depend on market performance and can go up or down. Mutual fund investments are subject to market risks; read all scheme related documents carefully.'
  },
  {
    q: 'How are equity mutual fund gains taxed in India?',
    a: 'Gains on equity-oriented funds held for more than 12 months are long-term and taxed at 12.5% above ₹1.25 lakh in a financial year. Gains on units held for 12 months or less are taxed at 20%. These rates were unchanged in Budget 2026.'
  },
  {
    q: 'Where is the Shaiv Market office?',
    a: '6th Floor, Bhamashah Techno Hub, Jhalana Doongari, Jaipur, Rajasthan 302004. Call or WhatsApp +91 99506 53247 to fix a time.'
  }
];

export const CALC_FAQ: Record<string, Faq[]> = {
  'required-sip': [
    { q: 'How much SIP is needed for ₹1 crore in 15 years?', a: 'About ₹19,800 a month at an assumed 12% yearly return. At 10% it rises to roughly ₹23,900. The calculator shows the exact figure for any target, period and return.' },
    { q: 'Should I plan for inflation?', a: 'Yes. A goal that costs ₹25 lakh today can cost about ₹50 lakh in 12 years at 6% inflation. Set the target in future rupees, or raise your SIP every year with a step-up.' }
  ],
  'sip-compounder': [
    { q: 'What is a step-up SIP?', a: 'A step-up SIP raises your monthly amount by a fixed percentage every year, usually in line with salary increases. Even a 10% yearly step-up can grow the final corpus substantially.' },
    { q: 'How does a SIP grow over time?', a: 'Each instalment buys units at that day’s NAV and compounds from then on. Early instalments compound the longest, which is why time in the market matters more than the exact start date.' }
  ],
  goal: [
    { q: 'How do I plan for my child’s higher education?', a: 'Estimate today’s cost, inflate it at 8 to 10% a year to the year of admission, and work out the monthly SIP needed. Move gradually to safer funds in the last two or three years.' },
    { q: 'Can I plan several goals at once?', a: 'Yes. Plan each goal separately with its own amount, date and fund mix, so a near goal is not exposed to the same risk as a far one.' }
  ],
  swp: [
    { q: 'What is a systematic withdrawal plan (SWP)?', a: 'An SWP pays you a fixed amount from your mutual fund every month or quarter. The rest of the money stays invested, which can help the corpus last longer.' },
    { q: 'How is SWP income taxed?', a: 'Only the capital gain portion of each withdrawal is taxed, not the full amount. Tax depends on the fund type and how long the units were held.' }
  ],
  'loan-sip': [
    { q: 'Should I prepay my home loan or invest in a SIP?', a: 'Prepaying gives a certain saving equal to your loan rate. A SIP may earn more over long periods but is not guaranteed. Many people split surplus money between both; the calculator compares the two for your loan.' }
  ],
  fire: [
    { q: 'What is FIRE?', a: 'FIRE stands for Financial Independence, Retire Early: building a corpus large enough that its returns cover your living costs, so work becomes optional.' },
    { q: 'How big a corpus do I need to retire early in India?', a: 'A common rule of thumb is 30 to 33 times your yearly expenses, which assumes withdrawing about 3 to 3.5% a year. The calculator adjusts for inflation and your timeline.' }
  ],
  emergency: [
    { q: 'How much emergency fund should I keep?', a: 'Six months of essential expenses is a common starting point; twelve months if you have a single income, are self-employed or have dependants.' },
    { q: 'Where should I keep an emergency fund?', a: 'Somewhere safe and quick to access, such as a savings account, a sweep-in fixed deposit or a liquid mutual fund that can be redeemed within a working day.' }
  ]
};
