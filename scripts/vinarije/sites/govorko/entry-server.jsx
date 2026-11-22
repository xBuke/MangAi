import { renderToString } from 'react-dom/server';
import App from './App.jsx';

export { ROUTES, href, twin, BASE } from './routes.js';
export { META, WINES, CONTACT } from './data.js';
export { default as IMG } from './imgmeta.js';
export const render = (route) => renderToString(<App route={route} />);
