// Service worker oglednog primjera (scope: /ogledno/okrug-demo/). Generira se pri buildu iz
// scripts/sw-predlozak.js – popis datoteka i verziju upisuje scripts/sw-integration.mjs.
const BASE = '/ogledno/okrug-demo/';
const VERZIJA = '3595dbb6ea8d';
const DATOTEKE = ["_astro/Karta.astro_astro_type_script_index_0_lang.CRNiG3E_.js","_astro/_id_.astro_astro_type_script_index_0_lang.DGUz9sRu.js","_astro/karta.DjYaVqop.js","_astro/maplibre-gl-worker.Boc9pDRP.mjs","_astro/maplibre-gl.8qRUISz9.css","_astro/napredak.27EN44xG.js","de/","de/pristupacnost/","de/ruta/centar/","de/ruta/juzne-uvale/","de/tocka/bocici/","de/tocka/kuzmica-uvala/","de/tocka/labadusa/","de/tocka/ljetnikovac-racettini/","de/tocka/lucica-toc/","de/tocka/mavarcica/","de/tocka/opcina/","de/tocka/otocic-fumija/","de/tocka/plaza-copacabana/","de/tocka/sv-karlo/","de/tocka/sv-kriz/","de/tocka/sv-tudor/","de/tocka/tatinja/","de/tocka/uvala-duga/","en/","en/pristupacnost/","en/ruta/centar/","en/ruta/juzne-uvale/","en/tocka/bocici/","en/tocka/kuzmica-uvala/","en/tocka/labadusa/","en/tocka/ljetnikovac-racettini/","en/tocka/lucica-toc/","en/tocka/mavarcica/","en/tocka/opcina/","en/tocka/otocic-fumija/","en/tocka/plaza-copacabana/","en/tocka/sv-karlo/","en/tocka/sv-kriz/","en/tocka/sv-tudor/","en/tocka/tatinja/","en/tocka/uvala-duga/","ikone/ikona-180.png","ikone/ikona-192.png","ikone/ikona-512.png","ikone/ikona-maskable-512.png","ikone/ikona-maskable.svg","ikone/ikona.svg","ilustracije/crkva.svg","ilustracije/lucica.svg","ilustracije/otok.svg","ilustracije/plaza.svg","ilustracije/uvala.svg","ilustracije/zgrada.svg","","manifest.webmanifest","pristupacnost/","qr/","ruta/centar/","ruta/juzne-uvale/","t/bocici/","t/labadusa/","t/lucica-toc/","t/mavarcica/","t/opcina/","t/plaza-copacabana/","t/sv-karlo/","t/sv-kriz/","t/sv-tudor/","t/tatinja/","t/uvala-duga/","tocka/bocici/","tocka/kuzmica-uvala/","tocka/labadusa/","tocka/ljetnikovac-racettini/","tocka/lucica-toc/","tocka/mavarcica/","tocka/opcina/","tocka/otocic-fumija/","tocka/plaza-copacabana/","tocka/sv-karlo/","tocka/sv-kriz/","tocka/sv-tudor/","tocka/tatinja/","tocka/uvala-duga/"];
const CACHE_STRANICA = `okrug-staza-${VERZIJA}`;
const CACHE_KARTE = 'okrug-karta-v1'; // puni ga gumb „Spremi za šetnju bez signala” (src/scripts/offline.ts)
const KARTA_HOST = 'tiles.openfreemap.org';
const CACHE_SLIKA = 'okrug-slike-v1'; // fotografije s Wikimedia Commonsa, spremaju se kad se prvi put prikažu
const SLIKE_HOST = 'upload.wikimedia.org';

// Pri prvom posjetu spremi sve stranice, CSS, JS i ilustracije.
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(CACHE_STRANICA)
      .then((c) => Promise.all(DATOTEKE.map((u) => c.add(new Request(BASE + u, { cache: 'reload' })))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((k) => Promise.all(k.filter((n) => n.startsWith('okrug-staza-') && n !== CACHE_STRANICA).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  );
});

function mrezaUzRok(zahtjev, ms) {
  return new Promise((ok, greska) => {
    const rok = setTimeout(() => greska(new Error('rok')), ms);
    fetch(zahtjev).then(
      (o) => (clearTimeout(rok), ok(o)),
      (g) => (clearTimeout(rok), greska(g)),
    );
  });
}

async function stranica(zahtjev) {
  const cache = await caches.open(CACHE_STRANICA);
  try {
    const o = await mrezaUzRok(zahtjev, 4000);
    if (o.ok) cache.put(zahtjev, o.clone());
    return o;
  } catch {
    return (
      (await cache.match(zahtjev, { ignoreSearch: true })) ||
      (await cache.match(BASE)) ||
      new Response('Bez signala / No signal / Kein Signal', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
    );
  }
}

async function izCachea(zahtjev, naziv) {
  const cache = await caches.open(naziv);
  const spremljeno = await cache.match(zahtjev, { ignoreSearch: naziv === CACHE_STRANICA });
  if (spremljeno) return spremljeno;
  const o = await fetch(zahtjev);
  if (o.ok && naziv === CACHE_STRANICA) cache.put(zahtjev, o.clone());
  return o;
}

async function mrezaPaCache(zahtjev, naziv) {
  const cache = await caches.open(naziv);
  try {
    const o = await mrezaUzRok(zahtjev, 4000);
    // Stil i TileJSON osvježavamo samo ako je korisnik već spremio kartu.
    if (o.ok && (await cache.match(zahtjev))) cache.put(zahtjev, o.clone());
    return o;
  } catch (g) {
    const spremljeno = await cache.match(zahtjev);
    if (spremljeno) return spremljeno;
    throw g;
  }
}

// Fotografije: prvo cache, inače mreža (i spremi). Odgovori su „opaque” (bez CORS-a), pa ih spremamo bez provjere statusa.
async function slika(zahtjev) {
  const cache = await caches.open(CACHE_SLIKA);
  const spremljeno = await cache.match(zahtjev, { ignoreVary: true });
  if (spremljeno) return spremljeno;
  const o = await fetch(zahtjev);
  if (o.ok || o.type === 'opaque') cache.put(zahtjev, o.clone()).catch(() => {});
  return o;
}

self.addEventListener('fetch', (e) => {
  const zahtjev = e.request;
  if (zahtjev.method !== 'GET') return;
  const url = new URL(zahtjev.url);

  if (url.origin === self.location.origin && url.pathname.startsWith(BASE)) {
    if (url.pathname.endsWith('.zip')) return;
    if (zahtjev.mode === 'navigate') e.respondWith(stranica(zahtjev));
    else e.respondWith(izCachea(zahtjev, CACHE_STRANICA));
    return;
  }

  if (url.hostname === SLIKE_HOST) {
    e.respondWith(slika(zahtjev));
    return;
  }

  if (url.hostname === KARTA_HOST) {
    // Pločice, glyphovi i sprite imaju verziju u adresi: prvo cache. Stil i TileJSON: prvo mreža.
    if (/\.(pbf|png|json)$/.test(url.pathname)) e.respondWith(izCachea(zahtjev, CACHE_KARTE));
    else e.respondWith(mrezaPaCache(zahtjev, CACHE_KARTE));
  }
});
