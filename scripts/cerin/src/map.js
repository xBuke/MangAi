/* Prava karta (MapLibre GL + OpenFreeMap), kao kod Điko: restoran i mjesta na Korčuli,
 * let kamere do odabranog mjesta, isprekidana linija od restorana i udaljenost zračnom linijom.
 * Ako se pločice ne učitaju, ostaje popis mjesta i poveznica na Google karte. */
import { Map as MLMap, Marker, NavigationControl, LngLatBounds, setWorkerUrl } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

const HOME = { id: 'cerin', ll: [16.791747, 42.906849] };
const PLACES = [
  HOME,
  { id: 'blato', ll: [16.7922, 42.9357] },
  { id: 'smokvica', ll: [16.8958, 42.9285] },
  { id: 'vela', ll: [16.7203, 42.9627] },
  { id: 'korcula', ll: [17.1356, 42.9604] }
];
const GMAPS = 'https://www.google.com/maps/dir/?api=1&destination=42.906849,16.791747';

function km([lon1, lat1], [lon2, lat2]) {
  const R = 6371, r = Math.PI / 180;
  const dLat = (lat2 - lat1) * r, dLon = (lon2 - lon1) * r;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/* boje karte u paleti Čerina: tamnoplavo more, pješčano kopno */
function tint(map) {
  for (const l of map.getStyle().layers) {
    const id = l.id;
    try {
      if (l.type === 'background') map.setPaintProperty(id, 'background-color', '#efe6d3');
      else if (l.type === 'fill' && /water|ocean|sea/.test(id)) map.setPaintProperty(id, 'fill-color', '#16324f');
      else if (l.type === 'fill' && /(park|wood|grass|landcover|landuse|forest|scrub)/.test(id)) map.setPaintProperty(id, 'fill-color', '#e4d8bd');
      else if (l.type === 'line' && /water|river|waterway/.test(id)) map.setPaintProperty(id, 'line-color', '#16324f');
      else if (l.type === 'line' && /(highway|road|street|motorway|trunk|primary|secondary|tertiary|minor)/.test(id) && !/casing/.test(id)) map.setPaintProperty(id, 'line-color', '#fbf8f2');
      else if (l.type === 'line' && /boundary/.test(id)) map.setLayoutProperty(id, 'visibility', 'none');
      else if (l.type === 'symbol' && /water/.test(id)) { map.setPaintProperty(id, 'text-color', '#c9d6e2'); map.setPaintProperty(id, 'text-halo-color', '#16324f'); }
      else if (l.type === 'symbol' && /(place|label)/.test(id)) { map.setPaintProperty(id, 'text-color', '#4b5a6b'); map.setPaintProperty(id, 'text-halo-color', '#efe6d3'); }
    } catch { /* sloj nema to svojstvo */ }
  }
}

export function initMap(section, T, lang) {
  const box = section.querySelector('.mapx__box');
  const list = section.querySelector('.mapx__places');
  const detail = section.querySelector('.mapx__detail');
  const loader = section.querySelector('.mapx__load');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loc = { hr: 'hr-HR', en: 'en-GB', de: 'de-DE', it: 'it-IT' }[lang] || 'hr-HR';
  const name = (id) => T.pl[id].n;
  let sel = 'cerin', map = null, ready = false;

  /* popis mjesta (radi i bez karte) */
  list.innerHTML = PLACES.map((pl) => {
    const d = pl.id === 'cerin' ? T.here : Math.round(km(HOME.ll, pl.ll)) + ' km';
    return `<li><button type="button" data-id="${pl.id}" aria-pressed="${pl.id === sel}"><span class="mp-n">${name(pl.id)}</span><span class="mp-d">${d}</span></button></li>`;
  }).join('');
  list.addEventListener('click', (e) => { const b = e.target.closest('button[data-id]'); if (b) select(b.dataset.id); });

  function renderDetail() {
    const pl = PLACES.find((p) => p.id === sel);
    const p = T.pl[sel];
    const dist = sel === 'cerin' ? '' : `<p class="md-km"><strong>${km(HOME.ll, pl.ll).toLocaleString(loc, { maximumFractionDigits: 1 })}</strong> ${T.dist}</p>`;
    detail.classList.remove('is-in');
    void detail.offsetWidth;
    detail.innerHTML = `<p class="md-r">${p.r}</p><h3>${p.n}</h3><p>${p.p}</p>${dist}` +
      (sel === 'cerin' ? `<a class="link" href="${GMAPS}" target="_blank" rel="noopener">${T.open} →</a>` : '');
    detail.classList.add('is-in');
  }

  function select(id) {
    sel = id;
    list.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.id === id)));
    box.querySelectorAll('.mk').forEach((n) => n.classList.toggle('on', n.dataset.id === id));
    renderDetail();
    if (!map || !ready) return;
    const pl = PLACES.find((p) => p.id === id);
    const src = map.getSource('route');
    if (id === 'cerin') {
      src && src.setData({ type: 'FeatureCollection', features: [] });
      map.flyTo({ center: HOME.ll, zoom: 13.2, pitch: reduce ? 0 : 52, bearing: -14, duration: reduce ? 0 : 2200, essential: true });
    } else {
      src && src.setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: [HOME.ll, pl.ll] } });
      const b = new LngLatBounds(HOME.ll, HOME.ll).extend(pl.ll);
      const pad = box.clientWidth < 500 ? 50 : 90;
      map.fitBounds(b, { padding: { top: pad, bottom: pad, left: pad, right: pad }, pitch: reduce ? 0 : 38, bearing: -8, duration: reduce ? 0 : 2000, maxZoom: 12.5 });
    }
  }
  renderDetail();

  function fail() {
    loader && loader.remove();
    if (box.querySelector('.mapx__fallback')) return;
    const f = document.createElement('div');
    f.className = 'mapx__fallback';
    f.innerHTML = `<p>${T.fallback}</p><a class="btn btn--gold" href="${GMAPS}" target="_blank" rel="noopener">${T.open}</a>`;
    box.appendChild(f);
  }

  try {
    setWorkerUrl(new URL(workerUrl, import.meta.url).href);
    map = new MLMap({
      container: box,
      style: 'https://tiles.openfreemap.org/styles/positron',
      center: [16.84, 42.93], zoom: 10.4, pitch: reduce ? 0 : 40, bearing: reduce ? 0 : -12,
      cooperativeGestures: true, attributionControl: { compact: true },
      locale: {
        'CooperativeGesturesHandler.WindowsHelpText': T.win,
        'CooperativeGesturesHandler.MacHelpText': T.mac,
        'CooperativeGesturesHandler.MobileHelpText': T.mob
      }
    });
  } catch (err) { console.warn('[karta]', err); fail(); return; }

  map.addControl(new NavigationControl({ visualizePitch: true }), 'top-right');
  const to = setTimeout(() => { if (!ready) fail(); }, 12000);
  map.on('error', (ev) => { console.warn('[karta]', ev && ev.error ? ev.error.message : ev); if (!map.isStyleLoaded() && !ready) { clearTimeout(to); fail(); } });
  map.on('load', () => {
    clearTimeout(to);
    tint(map);
    map.addSource('route', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
    map.addLayer({ id: 'route', type: 'line', source: 'route', paint: { 'line-color': '#c4891f', 'line-width': 2.6, 'line-dasharray': [2, 2] } });
    PLACES.forEach((pl) => {
      const n = document.createElement('button');
      n.type = 'button';
      n.className = 'mk' + (pl.id === 'cerin' ? ' mk-home' : '') + (pl.id === sel ? ' on' : '');
      n.dataset.id = pl.id;
      n.setAttribute('aria-label', name(pl.id));
      n.innerHTML = (pl.id === 'cerin'
        ? '<span class="mk-pin"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12c4-5 10-6 15-2l5-3-1 5 1 5-5-3c-5 4-11 3-15-2z" fill="currentColor"/></svg></span>'
        : '<span class="mk-dot"></span>') + `<span class="mk-lbl">${name(pl.id)}</span>`;
      n.addEventListener('click', (ev) => { ev.stopPropagation(); select(pl.id); });
      new Marker({ element: n, anchor: pl.id === 'cerin' ? 'bottom' : 'center' }).setLngLat(pl.ll).addTo(map);
    });
    ready = true;
    loader && loader.remove();
    box.classList.add('is-ready');
    select(sel);
  });
}
