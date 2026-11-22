import { useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { useShop } from '@shared/shop.jsx';
import { Reveal } from '@shared/fx.jsx';
import { Photo, BottleImg } from '../components/Img.jsx';
import { Crumbs, AddToList, EASE } from '../components/Bits.jsx';
import { WINES } from '../data.js';
import { href, asset } from '../routes.js';

const GROUPS = { all: () => true, white: (w) => w.type === 'white', pink: (w) => w.type === 'rose' || w.type === 'sparkling', red: (w) => w.type === 'red' };

export default function Wines({ route }) {
  const { t, L } = useShop();
  const lang = route.lang;
  const T = (hr, en) => (lang === 'en' ? en : hr);
  const [f, setF] = useState('all');
  const shown = WINES.filter(GROUPS[f]);

  return (
    <>
      <section className="wines-head wrap">
        <div className="wh-text">
          <Crumbs route={route} items={[[t('nav.wines')]]} />
          <motion.h1 className="enter" style={{ '--d': '0s' }}>{T('Naša vina', 'Our wines')}</motion.h1>
          <motion.p className="enter lead" style={{ '--d': '0.15s' }}>
            {T('Sedam vina iz Vinogorja Vrgorac. Bijela od zlatarice, maraštine, trbljana i pošipa, rosé i pjenušac od plavke te crna od plavke, merlota i trnka.', 'Seven wines from the Vrgorac wine region. Whites from Zlatarica, Maraština, Trbljan and Pošip, a rosé and a sparkling wine from Plavka, and reds from Plavka, Merlot and Trnak.')}
          </motion.p>
        </div>
        <motion.div className="enter wh-img" style={{ '--d': '0.1s' }}>
          <Photo name="boce-nebo" eager sizes="(max-width: 900px) 100vw, 35vw" alt={T('Boce Govorko s čašom i čepovima na nebu', 'Govorko bottles with a glass and corks against the sky')} />
        </motion.div>
      </section>

      <div className="grid-zone">
      <div className="filter-bar">
        <div className="wrap filter-in">
          <LayoutGroup id="filter">
            <div className="filters" role="group" aria-label={T('Filtriraj vina', 'Filter wines')}>
              {Object.keys(GROUPS).map((k) => (
                <button key={k} type="button" aria-pressed={f === k} className={'filter' + (f === k ? ' on' : '')} onClick={() => setF(k)}>
                  {f === k && <motion.span layoutId="filter-pill" className="filter-pill" transition={{ duration: 0.4, ease: EASE }} />}
                  <span className="filter-txt">{t('f.' + k)} <small>{WINES.filter(GROUPS[k]).length}</small></span>
                </button>
              ))}
            </div>
          </LayoutGroup>
          <p className="filter-note">{T('Cijene i dostupnost javljamo na upit.', 'Prices and availability on request.')}</p>
        </div>
      </div>

      <section className="wrap wine-grid-sec" aria-live="polite">
        <motion.ul layout className="wine-grid">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((w, i) => (
              <motion.li key={w.id} layout className="wcard"
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.55, ease: EASE, delay: i * 0.04 }}>
                <a className="wcard-link" href={href('wine', lang, w.id)}>
                  <div className="wcard-bottle"><BottleImg id={w.id} alt={(lang === 'en' ? 'Bottle of ' : 'Boca vina ') + w.name} /></div>
                  <div className="wcard-body">
                    <div className="wcard-top"><h2>{w.name}</h2><span className="wcard-year">{w.year}</span></div>
                    <p className="wcard-kind">{L(w.kind)}</p>
                    <p className="wcard-grapes">{L(w.grapes)}</p>
                    <p className="wcard-meaning"><em>{w.name.toLowerCase()}</em> — {L(w.meaning)}</p>
                  </div>
                </a>
                <div className="wcard-foot">
                  <AddToList id={w.id} className="btn-text" compact />
                  <a className="link-arrow small" href={href('wine', lang, w.id)} tabIndex={-1} aria-hidden="true">{T('Detalji', 'Details')} →</a>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </section>
      </div>

      <section className="trade">
        <div className="wrap trade-in">
          <Reveal>
            <p className="kicker">{T('Za restorane, vinoteke i trgovine', 'For restaurants, wine shops and retailers')}</p>
            <h2>{T('Katalog svih vina na jednom mjestu', 'All our wines in one catalogue')}</h2>
            <p className="lead">{T('Sorte, alkohol, vinifikacija i temperatura posluživanja za vinsku kartu. Preuzmi katalog i javi nam se za ponudu.', 'Grapes, alcohol, winemaking and serving temperature for your wine list. Download the catalogue and ask us for an offer.')}</p>
          </Reveal>
          <Reveal delay={0.1} className="trade-btns">
            <a className="btn btn-bone" href={asset('vina-govorko-katalog.pdf')} download>{t('w.sheet')}</a>
            <a className="btn btn-line" href={href('visit', lang) + '?upit=b2b#upit'}>{T('Upit za suradnju', 'Trade inquiry')}</a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
