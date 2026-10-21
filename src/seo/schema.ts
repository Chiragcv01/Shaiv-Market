import { RouteMeta, SITE_URL, ROUTES } from './routes';
import { HOME_FAQ, CALC_FAQ, ABOUT_FAQ, Faq } from './faq';
import { postBySlug, POSTS } from '../content/blog';

const ORG_ID = `${SITE_URL}/#organization`;
const PERSON_ID = `${SITE_URL}/#chirag-sharma`;
const SITE_ID = `${SITE_URL}/#website`;

export const organization = {
  '@type': ['FinancialService', 'LocalBusiness'],
  '@id': ORG_ID,
  name: 'Shaiv Market',
  alternateName: 'Shaiv Market Financial Management',
  description:
    'AMFI registered mutual fund distributor in Jaipur offering SIP planning, goal-based investing, portfolio reviews and paperless mutual fund onboarding across India.',
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo-full.png`,
  image: `${SITE_URL}/images/chirag-sharma.jpg`,
  telephone: '+91-9950653247',
  email: 'marketlive45@gmail.com',
  priceRange: 'Free consultation',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '6th Floor, Bhamashah Techno Hub, Jhalana Doongari',
    addressLocality: 'Jaipur',
    addressRegion: 'Rajasthan',
    postalCode: '302004',
    addressCountry: 'IN'
  },
  areaServed: [{ '@type': 'City', name: 'Jaipur' }, { '@type': 'State', name: 'Rajasthan' }, { '@type': 'Country', name: 'India' }],
  founder: { '@id': PERSON_ID },
  identifier: { '@type': 'PropertyValue', propertyID: 'AMFI Registration Number (ARN)', value: 'ARN-337289' },
  knowsAbout: ['Mutual funds', 'Systematic Investment Plan (SIP)', 'Systematic Withdrawal Plan (SWP)', 'Goal-based financial planning', 'Retirement planning', 'ELSS tax saving funds'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Mutual fund distribution services',
    itemListElement: [
      'Free portfolio review',
      'SIP planning and setup',
      'Goal-based investment planning',
      'Retirement and SWP planning',
      'Paperless KYC and mutual fund account opening',
      'Annual portfolio review and rebalancing'
    ].map((name) => ({ '@type': 'Offer', price: '0', priceCurrency: 'INR', itemOffered: { '@type': 'Service', name } }))
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-9950653247',
    contactType: 'customer service',
    areaServed: 'IN',
    availableLanguage: ['English', 'Hindi']
  }
};

export const person = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Chirag Sharma',
  jobTitle: 'AMFI Registered Mutual Fund Distributor',
  image: `${SITE_URL}/images/chirag-sharma.jpg`,
  url: `${SITE_URL}/about`,
  telephone: '+91-9950653247',
  worksFor: { '@id': ORG_ID },
  address: { '@type': 'PostalAddress', addressLocality: 'Jaipur', addressRegion: 'Rajasthan', addressCountry: 'IN' },
  identifier: [
    { '@type': 'PropertyValue', propertyID: 'AMFI ARN', value: 'ARN-337289' },
    { '@type': 'PropertyValue', propertyID: 'EUIN', value: 'E641362' }
  ],
  hasCredential: [
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'NISM Series V-A: Mutual Fund Distributors Certification',
      credentialCategory: 'certification',
      recognizedBy: { '@type': 'Organization', name: 'National Institute of Securities Markets (NISM)', url: 'https://www.nism.ac.in' },
      validUntil: '2028-08-13'
    },
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'AMFI Registration (ARN-337289)',
      credentialCategory: 'license',
      recognizedBy: { '@type': 'Organization', name: 'Association of Mutual Funds in India (AMFI)', url: 'https://www.amfiindia.com' },
      validFrom: '2025-08-18',
      validUntil: '2028-08-13'
    }
  ],
  knowsLanguage: ['English', 'Hindi']
};

const website = {
  '@type': 'WebSite',
  '@id': SITE_ID,
  url: SITE_URL,
  name: 'Shaiv Market',
  inLanguage: 'en-IN',
  publisher: { '@id': ORG_ID }
};

const faqPage = (url: string, items: Faq[]) => ({
  '@type': 'FAQPage',
  '@id': `${url}#faq`,
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
});

function breadcrumbs(route: RouteMeta) {
  const parts = route.path.split('/').filter(Boolean);
  const items = [{ name: 'Home', path: '/' }];
  let acc = '';
  parts.forEach((p) => {
    acc += `/${p}`;
    const r = ROUTES.find((x) => x.path === acc);
    if (r) items.push({ name: r.name, path: r.path });
  });
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${SITE_URL}${it.path === '/' ? '' : it.path}` }))
  };
}

export function faqFor(route: RouteMeta): Faq[] {
  if (route.screen === 'home') return HOME_FAQ;
  // must match the FAQ that is visible on the page
  if (route.screen === 'calculators') return CALC_FAQ[route.tab || 'required-sip'] || [];
  if (route.screen === 'about') return ABOUT_FAQ;
  if (route.screen === 'blog' && route.slug) return postBySlug(route.slug)?.faq || [];
  return [];
}

/** Full JSON-LD graph for a route. */
export function schemaFor(route: RouteMeta) {
  const url = `${SITE_URL}${route.path === '/' ? '' : route.path}`;
  const graph: object[] = [
    organization,
    person,
    website,
    {
      '@type': route.screen === 'about' ? 'AboutPage' : route.screen === 'contact' ? 'ContactPage' : 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: route.title,
      description: route.description,
      inLanguage: 'en-IN',
      isPartOf: { '@id': SITE_ID },
      about: { '@id': ORG_ID },
      ...(route.screen === 'about' ? { mainEntity: { '@id': PERSON_ID } } : {}),
      dateModified: new Date().toISOString().slice(0, 10)
    }
  ];
  if (route.path !== '/') graph.push(breadcrumbs(route));
  if (route.screen === 'calculators') {
    graph.push({
      '@type': 'WebApplication',
      name: route.tab ? route.name : 'Shaiv Market calculators',
      url,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Any (web browser)',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
      provider: { '@id': ORG_ID }
    });
  }
  if (route.screen === 'blog' && route.slug) {
    const p = postBySlug(route.slug);
    if (p) graph.push({
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      dateModified: p.updated,
      inLanguage: 'en-IN',
      mainEntityOfPage: { '@id': `${url}#webpage` },
      image: `${SITE_URL}/images/og-card.png`,
      author: { '@id': PERSON_ID },
      publisher: { '@id': ORG_ID },
      keywords: p.keywords.join(', '),
      articleSection: p.category,
      timeRequired: `PT${p.minutes}M`,
      abstract: p.answer
    });
  }
  if (route.screen === 'blog' && !route.slug) {
    graph.push({
      '@type': 'Blog',
      '@id': `${url}#blog`,
      name: 'Shaiv Market Blog',
      url,
      publisher: { '@id': ORG_ID },
      blogPost: POSTS.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: `${SITE_URL}/blog/${p.slug}`, datePublished: p.date, author: { '@id': PERSON_ID } }))
    });
  }
  const faq = faqFor(route);
  if (faq.length) graph.push(faqPage(url, faq));
  return { '@context': 'https://schema.org', '@graph': graph };
}
