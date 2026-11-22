import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import { ShopProvider } from '@shared/shop.jsx';
import Checkout from '@shared/Checkout.jsx';
import { SITE } from './data.js';

createRoot(document.getElementById('root')).render(
  <MotionConfig reducedMotion="user">
    <ShopProvider site={SITE}><Checkout merchant="Vinarija Điko" /></ShopProvider>
  </MotionConfig>
);
