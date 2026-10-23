import { CALC_GUIDES } from '../content/calculators';

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

// Calculator FAQs live with each calculator's guide (src/content/calculators/*.md), so the
// visible FAQ, the FAQPage schema and llms-full.txt always say the same thing.
export const CALC_FAQ: Record<string, Faq[]> = Object.fromEntries(
  Object.entries(CALC_GUIDES).map(([tab, g]) => [tab, g.faq])
);

export const ABOUT_FAQ: Faq[] = HOME_FAQ.slice(0, 4);
