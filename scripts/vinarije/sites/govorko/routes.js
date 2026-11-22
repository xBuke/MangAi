/* Sve stranice Govorko stranice. Svaka ruta se pri buildu pregenerira u svoj index.html
 * (prerender.mjs), tako da svaka stranica ima vlastiti URL, naslov i opis za tražilice. */
export const WINE_IDS = ['dispet', 'delozija', 'brankic', 'bokun', 'posip', 'trnak', 'arija'];

const SLUGS = {
  home: { hr: '', en: 'en/' },
  wines: { hr: 'vina/', en: 'en/wines/' },
  vineyard: { hr: 'vinograd/', en: 'en/vineyard/' },
  family: { hr: 'obitelj/', en: 'en/family/' },
  gifts: { hr: 'pokloni/', en: 'en/gifts/' },
  visit: { hr: 'posjet/', en: 'en/visit/' }
};

export const BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) || '/';

/* relativna putanja rute (bez BASE) */
export function pathOf(key, lang = 'hr', wine) {
  if (key === 'wine') return SLUGS.wines[lang] + wine + '/';
  return SLUGS[key][lang];
}
export const href = (key, lang, wine) => BASE + pathOf(key, lang, wine);
export const asset = (p) => BASE + p;

export const ROUTES = [];
for (const lang of ['hr', 'en']) {
  for (const key of Object.keys(SLUGS)) ROUTES.push({ key, lang, path: pathOf(key, lang) });
  for (const wine of WINE_IDS) ROUTES.push({ key: 'wine', lang, wine, path: pathOf('wine', lang, wine) });
}

/* ista stranica na drugom jeziku (za HR/EN prekidač i hreflang) */
export const twin = (r) => href(r.key, r.lang === 'hr' ? 'en' : 'hr', r.wine);

/* za lokalni razvoj (vite dev): ruta iz adrese */
export function matchRoute(pathname) {
  let p = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname.replace(/^\//, '');
  p = p.replace(/index\.html$/, '');
  if (p && !p.endsWith('/')) p += '/';
  return ROUTES.find((r) => r.path === p) || ROUTES[0];
}
