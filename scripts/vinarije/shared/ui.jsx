import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useShop } from './shop.jsx';
import Bottle from './Bottle.jsx';
import { lockScroll } from './fx.jsx';

export function LangSwitch() {
  const { lang, setLang, t } = useShop();
  return (
    <div className="lang" role="group" aria-label={t('lang.aria')}>
      {['hr', 'en'].map((l) => (
        <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}>
          {lang === l && <motion.span layoutId="lang-pill" className="lang-pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
          <span className="lang-txt">{l.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}

export function CartButton({ icon }) {
  const { count, openCart, t, cartTarget, bumpKey } = useShop();
  return (
    <button type="button" className="cart-btn" ref={cartTarget} onClick={openCart} aria-label={t('cart.open')}>
      {icon}
      <AnimatePresence>
        {count > 0 && (
          <motion.span key={'c' + bumpKey} className="cart-count"
            initial={{ scale: 0.4 }} animate={{ scale: [1.45, 1] }} exit={{ scale: 0 }}
            transition={{ duration: 0.45 }}>{count}</motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

/* boce koje lete od gumba "Dodaj" do košarice */
export function FlyLayer() {
  const { flights, product, site } = useShop();
  return (
    <div className="fly-layer" aria-hidden="true">
      <AnimatePresence>
        {flights.map((f) => {
          const p = product(f.pid);
          const sx = f.from.left + f.from.width / 2 - 20, sy = f.from.top + f.from.height / 2 - 44;
          const ex = f.to.left + f.to.width / 2 - 20, ey = f.to.top + f.to.height / 2 - 44;
          return (
            <motion.div key={f.id} className="fly-bottle"
              initial={{ x: sx, y: sy, scale: 1, rotate: 0, opacity: 1 }}
              animate={{ x: [sx, (sx + ex) / 2, ex], y: [sy, Math.min(sy, ey) - 120, ey], scale: [1, 0.8, 0.25], rotate: [0, -20, 18], opacity: [1, 1, 0.2] }}
              transition={{ duration: 0.8, ease: 'easeInOut', times: [0, 0.45, 1] }}>
              <Bottle p={p} font={site.labelFont} sub={site.labelSub} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export function CartDrawer({ closeIcon }) {
  const { drawerOpen, closeCart, lines, subtotal, shipping, money, t, L, setQty, site } = useShop();
  const closeRef = useRef(null);
  const lastFocus = useRef(null);
  useEffect(() => {
    if (drawerOpen) {
      lastFocus.current = document.activeElement;
      lockScroll(true);
      setTimeout(() => closeRef.current && closeRef.current.focus(), 30);
      const onKey = (e) => { if (e.key === 'Escape') closeCart(); };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    } else {
      lockScroll(false);
      if (lastFocus.current) lastFocus.current.focus();
    }
  }, [drawerOpen, closeCart]);

  const left = site.freeShippingFrom - subtotal;
  const pct = Math.min(1, subtotal / site.freeShippingFrom);
  return (
    <AnimatePresence>
      {drawerOpen && (
        <div className="drawer">
          <motion.div className="drawer-scrim" onClick={closeCart} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside className="drawer-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 36 }}>
            <div className="drawer-head">
              <h2 id="cart-title">{t('cart.title')}</h2>
              <button type="button" className="drawer-close" ref={closeRef} onClick={closeCart} aria-label={t('cart.close')}>
                {closeIcon || <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>}
              </button>
            </div>
            <div className="cart-items" data-lenis-prevent>
              {!lines.length && <p className="cart-empty">{t('cart.empty')}</p>}
              <AnimatePresence initial={false}>
                {lines.map((l) => (
                  <motion.div key={l.p.id} className="cart-line" layout
                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60, height: 0, paddingTop: 0, paddingBottom: 0 }}>
                    <div className="cart-thumb"><Bottle p={l.p} font={site.labelFont} sub={site.labelSub} /></div>
                    <div className="cart-info">
                      <strong>{l.p.name}</strong><span>{L(l.p.kind)} · {l.p.vol}</span>
                      <div className="qty" role="group" aria-label={t('cart.qty')}>
                        <button type="button" onClick={() => setQty(l.p.id, l.q - 1)} aria-label="−">−</button>
                        <output>{l.q}</output>
                        <button type="button" onClick={() => setQty(l.p.id, l.q + 1)} aria-label="+">+</button>
                      </div>
                    </div>
                    <div className="cart-price">{money(l.q * l.p.price)}
                      <button type="button" className="cart-remove" onClick={() => setQty(l.p.id, 0)}>{t('cart.remove')}</button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="drawer-foot">
              <div className="ship-meter" aria-hidden="true"><motion.span animate={{ scaleX: pct }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} /></div>
              <p className="cart-note">{subtotal > 0 && left > 0 ? t('cart.freeLeft').replace('{x}', money(left)) : (subtotal > 0 ? t('cart.freeOk') : '')}</p>
              <div className="sum-row"><span>{t('cart.subtotal')}</span><span>{money(subtotal)}</span></div>
              <div className="sum-row"><span>{t('cart.shipping')}</span><span>{subtotal === 0 ? '—' : (shipping === 0 ? t('cart.free') : money(shipping))}</span></div>
              <div className="sum-row sum-total"><span>{t('cart.total')}</span><span>{money(subtotal + shipping)}</span></div>
              <a className="btn btn-main btn-block" href="checkout.html" aria-disabled={!lines.length}
                onClick={(e) => { if (!lines.length) e.preventDefault(); }}>{t('cart.checkout')}</a>
              <p className="cart-age">{t('cart.age')}</p>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

export function DemoBar() {
  const { t } = useShop();
  return <div className="demo-bar"><span>{t('demo.bar')}</span> <a href="https://mangai.hr/">{t('demo.link')}</a></div>;
}

/* gumb "Dodaj u košaricu" s potvrdom */
export function AddButton({ p, className = 'btn-add', sourceRef }) {
  const { add, t } = useShop();
  const ref = useRef(null);
  const [done, setDone] = useStateTimeout();
  return (
    <button type="button" ref={ref} className={className + (done ? ' done' : '')}
      onClick={() => { add(p.id, (sourceRef && sourceRef.current) || ref.current); setDone(); }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={done ? 'd' : 'a'} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.18 }}>
          {done ? t('shop.added') : t('shop.add')}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function useStateTimeout(ms = 1300) {
  const [v, setV] = useState(false);
  const tm = useRef();
  useEffect(() => () => clearTimeout(tm.current), []);
  return [v, () => { setV(true); clearTimeout(tm.current); tm.current = setTimeout(() => setV(false), ms); }];
}
