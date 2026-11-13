// Service worker oglednog primjera (scope: /ogledno/novigrad-staza/). Generira se pri buildu iz
// scripts/sw-predlozak.js – popis datoteka i verziju upisuje scripts/sw-integration.mjs.
const BASE = '/ogledno/novigrad-staza/';
const VERZIJA = 'a51f7f10b37f';
const DATOTEKE = ["_astro/Karta.astro_astro_type_script_index_0_lang.CO4sCjdn.js","_astro/Kraj.astro_astro_type_script_index_0_lang.ChQ0bF2I.js","_astro/_id_.astro_astro_type_script_index_0_lang.CnUcMKp-.js","_astro/_id_.astro_astro_type_script_index_0_lang.N5rXCZuo.js","_astro/karta.GIqz-vvO.js","_astro/maplibre-gl-worker.Boc9pDRP.mjs","_astro/maplibre-gl.8qRUISz9.css","_astro/napredak.CW1TgXsY.js","_astro/zalazak.Bv5HMXqe.js","de/","de/pristupacnost/","de/ruta/javorovac/","de/ruta/komarnica-vinogradi/","de/tocka/crkva/","de/tocka/javorovac/","de/tocka/komarnica/","de/tocka/sv-klara/","de/tocka/trg/","de/tocka/vinogradi/","en/","en/pristupacnost/","en/ruta/javorovac/","en/ruta/komarnica-vinogradi/","en/tocka/crkva/","en/tocka/javorovac/","en/tocka/komarnica/","en/tocka/sv-klara/","en/tocka/trg/","en/tocka/vinogradi/","ikone/ikona-180.png","ikone/ikona-192.png","ikone/ikona-512.png","ikone/ikona-maskable-512.png","ikone/ikona-maskable.svg","ikone/ikona.svg","ilustracije/crkva.svg","ilustracije/kapela.svg","ilustracije/potok.svg","ilustracije/suma.svg","ilustracije/trg.svg","ilustracije/vinograd.svg","","manifest.webmanifest","prijedlog/","pristupacnost/","qr/","ruta/javorovac/","ruta/komarnica-vinogradi/","t/crkva/","t/komarnica/","t/sv-klara/","t/trg/","t/vinogradi/","tocka/crkva/","tocka/javorovac/","tocka/komarnica/","tocka/sv-klara/","tocka/trg/","tocka/vinogradi/"];
const CACHE_STRANICA = `novigrad-staza-${VERZIJA}`;
const CACHE_KARTE = 'novigrad-karta-v1'; // puni ga gumb „Spremi za šetnju bez signala” (src/scripts/offline.ts)
const KARTA_HOST = 'tiles.openfreemap.org';
const CACHE_SLIKA = 'novigrad-slike-v1'; // fotografije s Wikimedia Commonsa, spremaju se kad se prvi put prikažu
const SLIKE_HOST = 'upload.wikimedia.org';
const CACHE_ZVUKA = 'novigrad-audio-v1'; // zvučni zapisi: sprema ih stranica kad korisnik pokrene zapis ili „Spremi za šetnju”

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
      .then((k) => Promise.all(k.filter((n) => n.startsWith('novigrad-staza-') && n !== CACHE_STRANICA).map((n) => caches.delete(n))))
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

// Fotografije (lokalne u slike/ i satelit/, ili s Wikimedije): prvo cache, inače mreža (i spremi).
// Odgovori s Wikimedije su „opaque” (bez CORS-a), pa ih spremamo bez provjere statusa.
// Bez mreže: ako tražena veličina nije spremljena, vrati drugu veličinu iste fotografije.
async function slika(zahtjev) {
  const cache = await caches.open(CACHE_SLIKA);
  const spremljeno = await cache.match(zahtjev, { ignoreVary: true });
  if (spremljeno) return spremljeno;
  try {
    const o = await fetch(zahtjev);
    if (o.ok || o.type === 'opaque') cache.put(zahtjev, o.clone()).catch(() => {});
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
    if (url.pathname.startsWith(BASE + 'slike/') || url.pathname.startsWith(BASE + 'satelit/')) {
      e.respondWith(slika(zahtjev));
      return;
    }
    if (url.pathname.startsWith(BASE + 'audio/')) {
      e.respondWith(zvuk(zahtjev));
      return;
    }
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
