/* Pregenerira svaku rutu u vlastiti index.html (HR + EN), s naslovom, opisom, canonical/hreflang
 * i strukturiranim podacima, pa React na klijentu samo hidrira. Pokreće se nakon oba Vite builda. */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, '../../../../ogledno/govorko');
const ssrDir = resolve(here, '.ssr');
const S = await import(pathToFileURL(resolve(ssrDir, 'entry-server.js')).href);
const ORIGIN = process.env.SITE_ORIGIN || 'https://mangai.hr';
const tpl = readFileSync(resolve(out, 'index.html'), 'utf8');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const abs = (p) => ORIGIN + p;
const firstSentences = (s, n = 2) => s.split(/(?<=\.)\s+/).slice(0, n).join(' ');

function meta(r) {
  if (r.key === 'wine') {
    const w = S.WINES.find((x) => x.id === r.wine);
    const kind = w.kind[r.lang];
    const title = `${w.name}${w.year ? ' ' + w.year : ''} — ${kind} | Vina Govorko`;
    return [title, firstSentences(w.desc[r.lang]), w];
  }
  const [title, desc] = S.META[r.key][r.lang];
  return [title, desc, null];
}

function jsonLd(r, title, desc, w) {
  const url = abs(S.href(r.key, r.lang, r.wine));
  if (r.key === 'home') {
    return {
      '@context': 'https://schema.org', '@type': 'Winery', name: 'Vina Govorko', url, description: desc,
      image: abs(S.BASE + 'og.jpg'), logo: abs(S.BASE + 'img/logo.png'), telephone: S.CONTACT.phone, email: S.CONTACT.email,
      address: { '@type': 'PostalAddress', streetAddress: S.CONTACT.street, postalCode: '20350', addressLocality: 'Metković', addressCountry: 'HR' }
    };
  }
  if (w) {
    return {
      '@context': 'https://schema.org', '@type': 'Product', name: `${w.name}${w.year ? ' ' + w.year : ''}`, description: w.desc[r.lang],
      image: abs(S.BASE + `img/boca-${w.id}-1100.webp`), brand: { '@type': 'Brand', name: 'Vina Govorko' }, category: w.kind[r.lang], url
    };
  }
  return null;
}

/* fotografija na vrhu svake stranice: učitava se odmah (preload), da hero nije prazan */
const HERO = { home: 'vinograd-jesen', vineyard: 'trsovi-ljeto', family: 'plavka-stari-trs', visit: 'rezidba-zima', wines: 'boce-nebo', gifts: 'kofer-6-boca' };
function preload(r) {
  if (r.key === 'wine') return `<link rel="preload" as="image" href="${S.BASE}img/boca-${r.wine}-1100.webp" fetchpriority="high">`;
  const n = HERO[r.key], m = S.IMG[n];
  const set = m.w.map((w) => `${S.BASE}img/${n}-${w}.webp ${w}w`).join(', ');
  const sizes = r.key === 'wines' ? '(max-width: 900px) 100vw, 35vw' : r.key === 'gifts' ? '(max-width: 900px) 100vw, 45vw' : '100vw';
  return `<link rel="preload" as="image" imagesrcset="${set}" imagesizes="${sizes}" fetchpriority="high">`;
}

const urls = [];
for (const r of S.ROUTES) {
  const [title, desc, w] = meta(r);
  const self = S.href(r.key, r.lang, r.wine);
  const hr = S.href(r.key, 'hr', r.wine), en = S.href(r.key, 'en', r.wine);
  const ld = jsonLd(r, title, desc, w);
  const head = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}">`,
    preload(r),
    `<link rel="canonical" href="${abs(self)}">`,
    `<link rel="alternate" hreflang="hr" href="${abs(hr)}">`,
    `<link rel="alternate" hreflang="en" href="${abs(en)}">`,
    `<link rel="alternate" hreflang="x-default" href="${abs(hr)}">`,
    `<meta property="og:type" content="${w ? 'product' : 'website'}">`,
    `<meta property="og:site_name" content="Vina Govorko">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    `<meta property="og:url" content="${abs(self)}">`,
    `<meta property="og:image" content="${abs(S.BASE + 'og.jpg')}">`,
    `<meta property="og:locale" content="${r.lang === 'en' ? 'en_GB' : 'hr_HR'}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    ld ? `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>` : ''
  ].join('\n');
  const html = tpl
    .replace('<html lang="hr">', `<html lang="${r.lang}">`)
    .replace('<!--app-head-->', head)
    .replace('<!--app-html-->', S.render(r))
    .replace('<!--app-data-->', `<script>window.__ROUTE__=${JSON.stringify(r)}</script>`);
  const dir = resolve(out, r.path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, 'index.html'), html);
  urls.push(abs(self));
}

writeFileSync(resolve(out, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n') + '\n</urlset>\n');
rmSync(ssrDir, { recursive: true, force: true });
console.log(`prerender: ${urls.length} stranica → ${out}`);
