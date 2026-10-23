import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { EmbedView } from './components/EmbedView';
import { AppProvider } from './context/AppContext.tsx';
import '@fontsource-variable/anek-latin/standard.css';
import './index.css';

const embed = window.location.pathname.match(/^\/embed\/([a-z0-9-]+)\/?$/);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {embed ? (
      <EmbedView slug={embed[1]} />
    ) : (
      <AppProvider>
        <App />
      </AppProvider>
    )}
  </StrictMode>,
);

