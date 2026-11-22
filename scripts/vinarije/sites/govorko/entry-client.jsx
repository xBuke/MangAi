import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import { matchRoute } from './routes.js';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/eb-garamond/wght.css';
import '@fontsource-variable/eb-garamond/wght-italic.css';
import '@shared/base.css';
import './style.css';

const el = document.getElementById('root');
const pre = window.__ROUTE__;
if (pre && el.firstElementChild) hydrateRoot(el, <App route={pre} />);
else createRoot(el).render(<App route={matchRoute(window.location.pathname)} />);
