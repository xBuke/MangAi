/* Zajednička lista za upit + jezik za demo stranice vinarija (MangAI / ogledno).
 * Lista (odabrana vina i broj boca) čuva se u localStorage po stranici, inače u memoriji.
 * Nema plaćanja: posjetitelj šalje upit e-mailom ili na WhatsApp vinarije (vidi Inquiry.jsx). */
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

/* initialLang: jezik određen URL-om (višestranična, unaprijed generirana stranica).
 * hydrate: stranica je pregenerirana na serveru — lista se čita tek nakon hidracije. */
export function ShopProvider({ site, children, initialLang, hydrate = false }) {
  const CART_KEY = 'upit_' + site.id;
  const LANG_KEY = 'lang_' + site.id;

  const [lang, setLangState] = useState(() => {
    if (initialLang) return initialLang;
    const saved = load(LANG_KEY);
    return saved === 'hr' || saved === 'en' ? saved : 'hr';
  });
  const [cart, setCart] = useState(() => (hydrate ? {} : load(CART_KEY) || {}));
  const cartReady = useRef(!hydrate);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [flights, setFlights] = useState([]);
  const [bumpKey, setBumpKey] = useState(0);
  const [inqType, setInqType] = useState('order');
  const cartTarget = useRef(null);

  useEffect(() => { if (cartReady.current) persist(CART_KEY, cart); }, [cart, CART_KEY]);
  useEffect(() => {
    if (cartReady.current) return;
    cartReady.current = true;
    const saved = load(CART_KEY);
    if (saved && Object.keys(saved).length) setCart(saved);
  }, [CART_KEY]);
  useEffect(() => {
    if (initialLang) return;
    persist(LANG_KEY, lang);
    document.documentElement.lang = lang;
    if (site.titles) document.title = site.titles[lang] || site.titles.hr;
  }, [lang, LANG_KEY, site, initialLang]);

  const t = useCallback((key) => {
    const d = site.i18n[lang] || {};
    return d[key] !== undefined ? d[key] : (site.i18n.hr[key] !== undefined ? site.i18n.hr[key] : key);
  }, [lang, site]);
  const L = useCallback((obj) => (obj && typeof obj === 'object' ? (obj[lang] || obj.hr) : obj), [lang]);

  /* hrvatska množina: 1 boca, 2–4 boce, 5+ boca (EN: bottle/bottles) */
  const bottles = useCallback((n) => {
    if (lang === 'en') return n + ' ' + (n === 1 ? t('b.one') : t('b.many'));
    const m10 = n % 10, m100 = n % 100;
    const k = m10 === 1 && m100 !== 11 ? 'b.one' : (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? 'b.few' : 'b.many');
    return n + ' ' + t(k);
  }, [lang, t]);

  const product = useCallback((id) => site.products.find((p) => p.id === id), [site]);
  const lines = useMemo(() => Object.keys(cart).map((id) => ({ p: product(id), q: cart[id] })).filter((l) => l.p), [cart, product]);
  const count = lines.reduce((s, l) => s + l.q, 0);

  const setQty = useCallback((id, q) => setCart((c) => {
    const n = { ...c };
    if (q <= 0) delete n[id]; else n[id] = Math.min(q, 240);
    return n;
  }), []);

  /* dodaj u upit; ako je dan izvorni element, boca "odleti" do ikone liste */
  const add = useCallback((id, fromEl) => {
    setCart((c) => ({ ...c, [id]: Math.min((c[id] || 0) + 1, 240) }));
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
    site, lang, setLang: setLangState, t, L, bottles,
    cart, lines, count, add, setQty, clear, product,
    drawerOpen, openCart: () => setDrawerOpen(true), closeCart: () => setDrawerOpen(false),
    flights, bumpKey, cartTarget, inqType, setInqType
  };
  return <ShopCtx.Provider value={value}>{children}</ShopCtx.Provider>;
}

/* placeholder kad se hotlinkana slika ne učita */
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
