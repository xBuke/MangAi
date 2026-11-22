/* Zaglavlje, izbornik na mobitelu, lista upita i podnožje — zajedničko svim stranicama */
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useShop } from '@shared/shop.jsx';
import { QtyStepper, FootCredit } from '@shared/ui.jsx';
import { lockScroll } from '@shared/fx.jsx';
import { href, twin, asset, WINE_IDS } from '../routes.js';
import { CONTACT, WINES } from '../data.js';
import { BottleImg } from './Img.jsx';

const NAV = ['wines', 'vineyard', 'family', 'gifts', 'visit'];
const EASE = [0.2, 0.75, 0.15, 1];

export function Crest({ className = 'crest' }) {
  return <img className={className} src={asset('img/grb.webp')} alt="" width="120" height="120" />;
}

function Brand({ route }) {
  return (
    <a className="brand" href={href('home', route.lang)} aria-label="Vina Govorko">
      <Crest className="brand-crest" />
      <span className="brand-word">Vina Govorko</span>
    </a>
  );
}

function LangLinks({ route }) {
  return (
    <div className="lang-links" aria-label="Jezik / Language">
      <a href={route.lang === 'hr' ? undefined : twin(route)} aria-current={route.lang === 'hr' ? 'true' : undefined} hrefLang="hr" lang="hr">HR</a>
      <span aria-hidden="true">/</span>
      <a href={route.lang === 'en' ? undefined : twin(route)} aria-current={route.lang === 'en' ? 'true' : undefined} hrefLang="en" lang="en">EN</a>
    </div>
  );
}

function ListButton() {
  const { t, count, bumpKey, openCart } = useShop();
  return (
    <button type="button" className="list-btn" onClick={openCart} aria-label={t('list.label') + (count ? ` (${count})` : '')}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M9 3h6v4.5c0 1.6 2.5 2.6 2.5 5.5v7.2a.8.8 0 0 1-.8.8H7.3a.8.8 0 0 1-.8-.8V13c0-2.9 2.5-3.9 2.5-5.5z M8 14h8" />
      </svg>
      <AnimatePresence>
        {count > 0 && (
          <motion.span key={'c' + bumpKey} className="list-count" initial={{ scale: 0.3 }} animate={{ scale: [1.5, 1] }} exit={{ scale: 0 }} transition={{ duration: 0.45 }}>{count}</motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export function Header({ route, overlay }) {
  const { t } = useShop();
  const ref = useRef(null);
  const bar = useRef(null);
  const [menu, setMenu] = useState(false);

  /* zaglavlje postaje puno nakon par piksela; traka napretka bez React re-rendera */
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (ref.current) ref.current.classList.toggle('solid', y > 40);
        const h = document.documentElement.scrollHeight - window.innerHeight;
        if (bar.current) bar.current.style.transform = `scaleX(${h > 0 ? Math.min(y / h, 1) : 0})`;
      });
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => { window.removeEventListener('scroll', on); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    lockScroll(menu);
    if (!menu) return;
    const k = (e) => { if (e.key === 'Escape') setMenu(false); };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [menu]);

  const cur = route.key === 'wine' ? 'wines' : route.key;
  return (
    <>
      <a className="skip" href="#sadrzaj">{t('nav.skip')}</a>
      <header ref={ref} className={'top' + (overlay ? ' over' : ' solid')}>
        <Brand route={route} />
        <nav className="nav" aria-label={t('nav.menu')}>
          {NAV.map((k) => (
            <a key={k} href={href(k, route.lang)} aria-current={cur === k ? 'page' : undefined}>{t('nav.' + k)}</a>
          ))}
        </nav>
        <div className="top-end">
          <LangLinks route={route} />
          <ListButton />
          <a className="btn btn-gold top-cta" href={href('visit', route.lang) + '#upit'}>{t('nav.inquiry')}</a>
          <button type="button" className="burger" aria-expanded={menu} aria-controls="mob-menu" aria-label={t('nav.menu')} onClick={() => setMenu((m) => !m)}>
            <span /><span />
          </button>
        </div>
        <span ref={bar} className="top-progress" aria-hidden="true" />
      </header>
      <AnimatePresence>
        {menu && (
          <motion.nav id="mob-menu" className="mob-menu" aria-label={t('nav.menu')}
            initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.55, ease: EASE }}>
            <ul>
              {['home', ...NAV].map((k, i) => (
                <motion.li key={k} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: EASE }}>
                  <a href={href(k, route.lang)} aria-current={cur === k ? 'page' : undefined}>{t('nav.' + k)}</a>
                </motion.li>
              ))}
            </ul>
            <div className="mob-menu-foot">
              <LangLinks route={route} />
              <a href={'tel:' + CONTACT.phone.replace(/\s/g, '')}>{CONTACT.phone}</a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

export function ListDrawer({ route }) {
  const { t, lines, drawerOpen, closeCart, bottles, L } = useShop();
  const closeRef = useRef(null);
  useEffect(() => {
    if (!drawerOpen) return;
    lockScroll(true);
    const last = document.activeElement;
    setTimeout(() => closeRef.current && closeRef.current.focus(), 40);
    const k = (e) => { if (e.key === 'Escape') closeCart(); };
    document.addEventListener('keydown', k);
    return () => { document.removeEventListener('keydown', k); lockScroll(false); if (last && last.focus) last.focus({ preventScroll: true }); };
  }, [drawerOpen, closeCart]);
  const total = lines.reduce((s, l) => s + l.q, 0);
  return (
    <AnimatePresence>
      {drawerOpen && (
        <motion.div className="drawer-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="drawer-shade" onClick={closeCart} />
          <motion.aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.5, ease: EASE }}>
            <div className="drawer-head">
              <h2 id="drawer-title">{t('list.label')}</h2>
              <button ref={closeRef} type="button" className="icon-btn" onClick={closeCart} aria-label={t('cart.close')}>
                <svg width="18" height="18" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M2 2l14 14M16 2 2 16" /></svg>
              </button>
            </div>
            {lines.length === 0 ? (
              <div className="drawer-empty">
                <p>{t('list.empty')}</p>
                <a className="btn btn-line" href={href('wines', route.lang)}>{t('list.browse')}</a>
              </div>
            ) : (
              <>
                <ul className="drawer-lines">
                  {lines.map((l) => (
                    <li key={l.p.id}>
                      <BottleImg id={l.p.id} alt="" className="drawer-bottle" />
                      <div>
                        <a href={href('wine', route.lang, l.p.id)} className="drawer-name">{l.p.name}</a>
                        <p className="drawer-kind">{L(l.p.kind)}{l.p.year ? ' · ' + l.p.year : ''}</p>
                      </div>
                      <QtyStepper id={l.p.id} q={l.q} />
                    </li>
                  ))}
                </ul>
                <div className="drawer-foot">
                  <p className="drawer-total"><span>{t('cart.total')}</span><strong>{bottles(total)}</strong></p>
                  <p className="drawer-note">{t('cart.note')}</p>
                  <a className="btn btn-bone" href={href('visit', route.lang) + '?upit=order#upit'}>{t('list.go')}</a>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Footer({ route }) {
  const { t } = useShop();
  const lang = route.lang;
  return (
    <footer className="foot">
      <div className="foot-in">
        <div className="foot-brand">
          <img src={asset('img/logo.webp')} alt="Vina Govorko" width="300" height="296" loading="lazy" />
        </div>
        <nav className="foot-col" aria-label={t('foot.wines')}>
          <p className="foot-h">{t('foot.wines')}</p>
          {WINE_IDS.map((id) => <a key={id} href={href('wine', lang, id)}>{WINES.find((w) => w.id === id).name}</a>)}
        </nav>
        <nav className="foot-col" aria-label={t('foot.winery')}>
          <p className="foot-h">{t('foot.winery')}</p>
          {['vineyard', 'family', 'gifts', 'visit'].map((k) => <a key={k} href={href(k, lang)}>{t('nav.' + k)}</a>)}
        </nav>
        <div className="foot-col">
          <p className="foot-h">{t('foot.contact')}</p>
          <a href={CONTACT.maps} target="_blank" rel="noopener">{CONTACT.street}<br />{CONTACT.city}</a>
          <a href={'tel:' + CONTACT.phone.replace(/\s/g, '')}>{CONTACT.phone}</a>
          <a href={'mailto:' + CONTACT.email}>{CONTACT.email}</a>
        </div>
      </div>
      <div className="foot-base">
        <p>{t('foot.age')}</p>
        <p>© Vina Govorko</p>
        <FootCredit />
      </div>
    </footer>
  );
}
