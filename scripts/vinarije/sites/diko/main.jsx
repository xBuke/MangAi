import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import { ShopProvider } from '@shared/shop.jsx';
import { SITE } from './data.js';
import App from './App.jsx';
import '@shared/base.css';
import './style.css';

createRoot(document.getElementById('root')).render(
  <MotionConfig reducedMotion="user">
    <ShopProvider site={SITE}><App /></ShopProvider>
  </MotionConfig>
);
