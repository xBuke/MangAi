/* Zajednička košarica + jezik za demo stranice vinarija (MangAI / ogledno).
 * Košarica se čuva u localStorage po stranici (ako je dostupan), inače u memoriji.
 * Checkout je SIMULIRAN — ništa se ne naplaćuje. */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const memory = {};
function load(key) {
  try { return JSON.parse(localStorage.getItem(key)); }
  catch { return memory[key] ?? null; }
}
function persist(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); }
  catch { memory[key] = val; }
}

const ShopCtx = createContext(null);
export const useShop = () => useContext(ShopCtx);

export function ShopProvider({ site, children }) {
  const CART_KEY = 'cart_' + site.id;
  const LANG_KEY = 'lang_' + site.id;

  const [lang, setLangState] = useState(() => {
    const saved = load(LANG_KEY);
    if (saved === 'hr' || saved === 'en') return saved;
    return (navigator.language || 'hr').slice(0, 2) === 'hr' ? 'hr' : 'hr';
  });
  const [cart, setCart] = useState(() => load(CART_KEY) || {});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [flights, setFlights] = useState([]);
  const [bumpKey, setBumpKey] = useState(0);
  const cartTarget = useRef(null);

  useEffect(() => { persist(CART_KEY, cart); }, [cart, CART_KEY]);
  useEffect(() => {
    persist(LANG_KEY, lang);
    document.documentElement.lang = lang;
    if (site.titles && !site.titleKey) document.title = site.titles[lang] || site.titles.hr;
  }, [lang, LANG_KEY, site]);

  const t = useCallback((key) => {
    const d = site.i18n[lang] || {};
    return d[key] !== undefined ? d[key] : (site.i18n.hr[key] !== undefined ? site.i18n.hr[key] : key);
  }, [lang, site]);
  const L = useCallback((obj) => (obj && typeof obj === 'object' ? (obj[lang] || obj.hr) : obj), [lang]);
  const money = useCallback((n) => new Intl.NumberFormat(lang === 'hr' ? 'hr-HR' : 'en-IE', { style: 'currency', currency: 'EUR' }).format(n), [lang]);

  const product = useCallback((id) => site.products.find((p) => p.id === id), [site]);
  const lines = useMemo(() => Object.keys(cart).map((id) => ({ p: product(id), q: cart[id] })).filter((l) => l.p), [cart, product]);
  const count = lines.reduce((s, l) => s + l.q, 0);
  const subtotal = lines.reduce((s, l) => s + l.q * l.p.price, 0);
  const shipping = subtotal === 0 || subtotal >= site.freeShippingFrom ? 0 : site.shipping;

  const setQty = useCallback((id, q) => setCart((c) => {
    const n = { ...c };
    if (q <= 0) delete n[id]; else n[id] = Math.min(q, 48);
    return n;
  }), []);

  /* dodaj u košaricu; ako je dan izvorni element, boca "odleti" do ikone košarice */
  const add = useCallback((id, fromEl) => {
    setCart((c) => ({ ...c, [id]: Math.min((c[id] || 0) + 1, 48) }));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = cartTarget.current;
    if (fromEl && target && !reduce) {
      const a = fromEl.getBoundingClientRect();
      const b = target.getBoundingClientRect();
      const fid = Date.now() + Math.random();
      setFlights((f) => [...f, { id: fid, pid: id, from: a, to: b }]);
      setTimeout(() => { setFlights((f) => f.filter((x) => x.id !== fid)); setBumpKey((k) => k + 1); }, 820);
    } else {
      setBumpKey((k) => k + 1);
    }
  }, []);
  const clear = useCallback(() => setCart({}), []);

  const value = {
    site, lang, setLang: setLangState, t, L, money,
    cart, lines, count, subtotal, shipping, add, setQty, clear, product,
    drawerOpen, openCart: () => setDrawerOpen(true), closeCart: () => setDrawerOpen(false),
    flights, bumpKey, cartTarget
  };
  return <ShopCtx.Provider value={value}>{children}</ShopCtx.Provider>;
}

/* skriveni/vidljivi placeholder kad se hotlinkana slika ne učita */
export function RemoteImg({ className, wrap = 'figure', children, ...img }) {
  const [missing, setMissing] = useState(false);
  const Tag = wrap;
  return (
    <Tag className={(className || '') + ' ph' + (missing ? ' missing' : '')}>
      <img referrerPolicy="no-referrer" onError={() => setMissing(true)} {...img} />
      {children}
    </Tag>
  );
}
