import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { AppProvider } from './context/AppContext';
import { setSsrPath } from './seo/ssr';
import { takePendingTab } from './utils/deepLink';
import { routeForPath, ROUTES, SITE_URL, CALC_ROUTES } from './seo/routes';
import { CALC_GUIDES } from './content/calculators';
import { RESOURCES } from './content/resources';
import { headHtml } from './seo/head';
import { HOME_FAQ, CALC_FAQ } from './seo/faq';

export function render(path: string): string {
  setSsrPath(path);
  takePendingTab(); // never carry a tab from one page's render into the next
  return renderToString(
    <StrictMode>
      <AppProvider>
        <App />
      </AppProvider>
    </StrictMode>
  );
}

export { ROUTES, SITE_URL, headHtml, routeForPath, HOME_FAQ, CALC_FAQ, CALC_ROUTES, CALC_GUIDES, RESOURCES };
