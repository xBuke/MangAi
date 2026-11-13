// Service worker oglednog primjera (scope: /ogledno/hvar-audio/). Generira se pri buildu iz
// scripts/sw-predlozak.js – popis datoteka i verziju upisuje scripts/sw-integration.mjs.
const BASE = '/ogledno/hvar-audio/';
const VERZIJA = '1a3ab54ebb44';
const DATOTEKE = ["_astro/ClientRouter.astro_astro_type_script_index_0_lang.DQ4rs6Z5.js","_astro/Karta.astro_astro_type_script_index_0_lang.DcAjJZmg.js","_astro/Osnova.astro_astro_type_script_index_0_lang.BIdkzzci.js","_astro/client.BAnyAon0.js","_astro/client.ChiJXsfH.js","_astro/karta.ChD4LmzZ.js","_astro/maplibre-gl-worker.Boc9pDRP.mjs","_astro/maplibre-gl.8qRUISz9.css","_astro/page.DO0IQdyV.js","_astro/prefetch.CduMFg9b.js","de/","de/tocka/arsenal/","de/tocka/benediktinke/","de/tocka/fortica/","de/tocka/franjevci/","de/tocka/katedrala/","de/tocka/ljetnikovac-lucic/","de/tocka/loza/","de/tocka/pjaca/","en/","en/tocka/arsenal/","en/tocka/benediktinke/","en/tocka/fortica/","en/tocka/franjevci/","en/tocka/katedrala/","en/tocka/ljetnikovac-lucic/","en/tocka/loza/","en/tocka/pjaca/","ikone/ikona-180.png","ikone/ikona-192.png","ikone/ikona-512.png","ikone/ikona-maskable-512.png","ikone/ikona-maskable.svg","ikone/ikona.svg","ilustracije/arsenal.svg","ilustracije/crkva.svg","ilustracije/ljetnikovac.svg","ilustracije/loza.svg","ilustracije/samostan.svg","ilustracije/trg.svg","ilustracije/tvrdava.svg","","it/","it/tocka/arsenal/","it/tocka/benediktinke/","it/tocka/fortica/","it/tocka/franjevci/","it/tocka/katedrala/","it/tocka/ljetnikovac-lucic/","it/tocka/loza/","it/tocka/pjaca/","manifest.webmanifest","pristupacnost/","qr/","t/arsenal/","t/benediktinke/","t/fortica/","t/franjevci/","t/katedrala/","t/ljetnikovac-lucic/","t/loza/","t/pjaca/","tocka/arsenal/","tocka/benediktinke/","tocka/fortica/","tocka/franjevci/","tocka/katedrala/","tocka/ljetnikovac-lucic/","tocka/loza/","tocka/pjaca/","za-grad/"];
const CACHE_STRANICA = `hvar-audio-stranice-${VERZIJA}`;
const CACHE_KARTE = 'hvar-audio-karta-v1'; // puni ga gumb „Preuzmi vodič za slušanje bez signala” (src/scripts/offline.ts)
const KARTA_HOST = 'tiles.openfreemap.org';
const CACHE_SLIKA = 'hvar-audio-slike-v1'; // fotografije (lokalne kopije u slike/), spremaju se kad se prvi put prikažu
const CACHE_ZVUKA = 'hvar-audio-zvuk-v1'; // snimke: sprema ih player kad se snimka pokrene ili „Preuzmi vodič”

// Pri prvom posjetu spremi sve stranice (sva četiri jezika), CSS, JS i ilustracije.
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
      .then((k) => Promise.all(k.filter((n) => n.startsWith('hvar-audio-stranice-') && n !== CACHE_STRANICA).map((n) => caches.delete(n))))
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
      new Response('Bez signala / No signal / Kein Netz / Senza segnale', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
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

// Fotografije (lokalne kopije u slike/): prvo cache, inače mreža (i spremi).
// Bez mreže: ako tražena veličina nije spremljena, vrati drugu veličinu iste fotografije.
async function slika(zahtjev) {
  const cache = await caches.open(CACHE_SLIKA);
  const spremljeno = await cache.match(zahtjev, { ignoreVary: true });
  if (spremljeno) return spremljeno;
  try {
    const o = await fetch(zahtjev);
    if (o.ok) cache.put(zahtjev, o.clone()).catch(() => {});
    return o;
  } catch (g) {
    const osnova = /^(.*\/slike\/.+-)\d+\.webp$/.exec(zahtjev.url);
    if (osnova) for (const k of await cache.keys()) if (k.url.startsWith(osnova[1])) return cache.match(k);
    throw g;
  }
}

// Zvučni zapis: ako je spremljen, vraćamo ga iz cachea i sami režemo traženi dio (Range), jer <audio> traži dijelove.
async function zvuk(zahtjev) {
  const cache = await caches.open(CACHE_ZVUKA);
  const spremljeno = await cache.match(zahtjev.url);
  if (!spremljeno) return fetch(zahtjev);
  const raspon = /^bytes=(\d*)-(\d*)$/.exec(zahtjev.headers.get('range') || '');
  if (!raspon) return spremljeno;
  const sve = await spremljeno.arrayBuffer();
  const kraj = raspon[2] ? Math.min(Number(raspon[2]), sve.byteLength - 1) : sve.byteLength - 1;
  const pocetak = raspon[1] ? Number(raspon[1]) : sve.byteLength - Number(raspon[2]);
  if (pocetak > kraj || pocetak < 0) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${sve.byteLength}` } });
  return new Response(sve.slice(pocetak, kraj + 1), {
    status: 206,
    headers: {
      'Content-Type': spremljeno.headers.get('Content-Type') || 'audio/mpeg',
      'Content-Range': `bytes ${pocetak}-${kraj}/${sve.byteLength}`,
      'Content-Length': String(kraj - pocetak + 1),
      'Accept-Ranges': 'bytes',
    },
  });
}

self.addEventListener('fetch', (e) => {
  const zahtjev = e.request;
  if (zahtjev.method !== 'GET') return;
  const url = new URL(zahtjev.url);

  if (url.origin === self.location.origin && url.pathname.startsWith(BASE)) {
    if (url.pathname.endsWith('.zip')) return;
    if (url.pathname.startsWith(BASE + 'slike/')) {
      e.respondWith(slika(zahtjev));
      return;
    }
    if (url.pathname.startsWith(BASE + 'audio/')) {
      e.respondWith(zvuk(zahtjev));
      return;
    }
    // Stranice: obična navigacija ili dohvat koji radi ClientRouter (fetch s Accept: text/html).
    if (zahtjev.mode === 'navigate' || (zahtjev.headers.get('accept') || '').includes('text/html')) e.respondWith(stranica(zahtjev));
    else e.respondWith(izCachea(zahtjev, CACHE_STRANICA));
    return;
  }

  if (url.hostname === KARTA_HOST) {
    // Pločice, glyphovi i sprite imaju verziju u adresi: prvo cache. Stil i TileJSON: prvo mreža.
    if (/\.(pbf|png|json)$/.test(url.pathname)) e.respondWith(izCachea(zahtjev, CACHE_KARTE));
    else e.respondWith(mrezaPaCache(zahtjev, CACHE_KARTE));
  }
});
