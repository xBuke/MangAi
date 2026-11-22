/* Jedna komponenta za sve stranice: ruta (iz prerendera ili adrese) bira stranicu. */
import { MotionConfig } from 'motion/react';
import { ShopProvider } from '@shared/shop.jsx';
import { DemoBar } from '@shared/ui.jsx';
import { useSmoothScroll } from '@shared/fx.jsx';
import { GSAP } from '@shared/gsap.js';
import { SITE } from './data.js';
import { Header, Footer, ListDrawer } from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Wines from './pages/Wines.jsx';
import Wine from './pages/Wine.jsx';
import Vineyard from './pages/Vineyard.jsx';
import Family from './pages/Family.jsx';
import Gifts from './pages/Gifts.jsx';
import Visit from './pages/Visit.jsx';

const PAGES = { home: Home, wines: Wines, wine: Wine, vineyard: Vineyard, family: Family, gifts: Gifts, visit: Visit };
/* stranice koje počinju fotografijom preko cijelog ekrana: zaglavlje je prozirno iznad nje */
const OVERLAY = { home: true, vineyard: true, family: true, visit: true };

function Shell({ route }) {
  useSmoothScroll(-84, GSAP);
  const Page = PAGES[route.key];
  return (
    <div className={'site page-' + route.key}>
      <DemoBar />
      <Header route={route} overlay={!!OVERLAY[route.key]} />
      <main id="sadrzaj" tabIndex={-1}>
        <Page route={route} />
      </main>
      <Footer route={route} />
      <ListDrawer route={route} />
    </div>
  );
}

export default function App({ route }) {
  return (
    <MotionConfig reducedMotion="user">
      <ShopProvider site={SITE} initialLang={route.lang} hydrate>
        <Shell route={route} />
      </ShopProvider>
    </MotionConfig>
  );
}
