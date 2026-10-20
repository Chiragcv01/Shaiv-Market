import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { AppProvider } from './context/AppContext';
import { setSsrPath } from './seo/ssr';
import { setPendingTab } from './utils/deepLink';
import { routeForPath, ROUTES, SITE_URL } from './seo/routes';
import { headHtml } from './seo/head';
import { HOME_FAQ, CALC_FAQ } from './seo/faq';

export function render(path: string): string {
  setSsrPath(path);
  const r = routeForPath(path);
  if (r.tab) setPendingTab(r.tab);
  return renderToString(
    <StrictMode>
      <AppProvider>
        <App />
      </AppProvider>
    </StrictMode>
  );
}

export { ROUTES, SITE_URL, headHtml, routeForPath, HOME_FAQ, CALC_FAQ };
