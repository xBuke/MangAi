/* Prava karta (MapLibre GL + OpenFreeMap): vinarija i mjesta u okolici, let kamere do odabranog mjesta,
 * isprekidana linija od vinarije i udaljenost zračnom linijom. Ako se pločice ne učitaju, ostaje popis + link. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '@shared/shop.jsx';
import { SplitText } from '@shared/fx.jsx';

const HOME = { id: 'vinarija', ll: [17.4048056, 43.1774755] };
const PLACES = [
  HOME,
  { id: 'vrgorac', ll: [17.3725, 43.2058] },
  { id: 'bacina', ll: [17.4050, 43.0700] },
  { id: 'ploce', ll: [17.4339, 43.0547] },
  { id: 'opuzen', ll: [17.5650, 43.0150] },
  { id: 'makarska', ll: [17.0178, 43.2969] }
];

function km([lon1, lat1], [lon2, lat2]) {
  const R = 6371, r = Math.PI / 180;
  const dLat = (lat2 - lat1) * r, dLon = (lon2 - lon1) * r;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/* boje stila prilagođene paleti vinarije (kamen, zlato, merlot) */
function tint(map) {
  for (const l of map.getStyle().layers) {
    try {
      const id = l.id;
      if (l.type === 'background') map.setPaintProperty(id, 'background-color', '#e4e2d8');
      else if (l.type === 'fill' && /water/.test(id)) map.setPaintProperty(id, 'fill-color', '#b8c4be');
      else if (l.type === 'fill' && /(park|wood|grass|landcover|landuse)/.test(id)) map.setPaintProperty(id, 'fill-color', '#d6d5c4');
      else if (l.type === 'line' && /water|river|waterway/.test(id)) map.setPaintProperty(id, 'line-color', '#a8b8b2');
      else if (l.type === 'line' && /(highway|road|street|motorway|trunk|primary)/.test(id) && !/casing/.test(id)) map.setPaintProperty(id, 'line-color', '#f4f1e6');
    } catch { /* sloj nema tu boju */ }
  }
}

export default function MapLive() {
  const { t, lang } = useShop();
  const box = useRef(null);
  const mapRef = useRef(null);
  const mlRef = useRef(null);
  const [sel, setSel] = useState('vinarija');
  const [state, setState] = useState('idle'); // idle | loading | ready | error

  /* karta se učitava tek kad sekcija dođe blizu ekrana */
  useEffect(() => {
    const el = box.current; if (!el) return;
    let map;
    const io = new IntersectionObserver(async ([e]) => {
      if (!e.isIntersecting || mapRef.current) return;
      io.disconnect();
      setState('loading');
      try {
        const [{ default: ml }] = await Promise.all([import('maplibre-gl'), import('maplibre-gl/dist/maplibre-gl.css')]);
        mlRef.current = ml;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        map = new ml.Map({
          container: el, style: 'https://tiles.openfreemap.org/styles/positron',
          center: HOME.ll, zoom: 10.2, pitch: reduce ? 0 : 40, bearing: reduce ? 0 : -12,
          cooperativeGestures: true, attributionControl: { compact: true }
        });
        mapRef.current = map;
        map.addControl(new ml.NavigationControl({ visualizePitch: true }), 'top-right');
        const fail = setTimeout(() => setState((s) => (s === 'ready' ? s : 'error')), 9000);
        map.on('error', (ev) => { if (!map.isStyleLoaded()) { clearTimeout(fail); setState('error'); } });
        map.on('load', () => {
          clearTimeout(fail);
          tint(map);
          map.addSource('route', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
          map.addLayer({ id: 'route', type: 'line', source: 'route', paint: { 'line-color': '#9c7f2a', 'line-width': 2.5, 'line-dasharray': [2, 2] } });
          PLACES.forEach((pl) => {
            const node = document.createElement('button');
            node.type = 'button';
            node.className = 'mk' + (pl.id === 'vinarija' ? ' mk-home' : '');
            node.setAttribute('data-id', pl.id);
            node.innerHTML = pl.id === 'vinarija' ? '<span class="mk-d">Đ</span>' : '<span class="mk-dot"></span>';
            node.addEventListener('click', (ev) => { ev.stopPropagation(); setSel(pl.id); });
            new ml.Marker({ element: node, anchor: pl.id === 'vinarija' ? 'bottom' : 'center' }).setLngLat(pl.ll).addTo(map);
          });
          setState('ready');
        });
      } catch {
        setState('error');
      }
    }, { rootMargin: '400px' });
    io.observe(el);
    return () => { io.disconnect(); if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, []);

  /* odabir mjesta → let kamere, linija, oznaka */
  useEffect(() => {
    const map = mapRef.current;
    const pl = PLACES.find((p) => p.id === sel);
    document.querySelectorAll('.mk').forEach((n) => n.classList.toggle('on', n.getAttribute('data-id') === sel));
    if (!map || state !== 'ready') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const src = map.getSource('route');
    if (sel === 'vinarija') {
      src && src.setData({ type: 'FeatureCollection', features: [] });
      map.flyTo({ center: HOME.ll, zoom: 12.4, pitch: reduce ? 0 : 50, bearing: -12, duration: reduce ? 0 : 2200, essential: true });
    } else {
      src && src.setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: [HOME.ll, pl.ll] } });
      const b = new mlRef.current.LngLatBounds(HOME.ll, HOME.ll).extend(pl.ll);
      map.fitBounds(b, { padding: { top: 90, bottom: 90, left: 90, right: 90 }, pitch: reduce ? 0 : 35, bearing: -8, duration: reduce ? 0 : 2000, maxZoom: 12 });
    }
  }, [sel, state]);

  const active = PLACES.find((p) => p.id === sel);
  const dist = sel === 'vinarija' ? null : km(HOME.ll, active.ll);

  return (
    <section className="mapsec" id="karta" aria-labelledby="map-title">
      <div className="map-head">
        <p className="kicker">{t('map.kicker')}</p>
        <SplitText as="h2" text={t('map.title')} stagger={0.02} className="map-title" />
        <p>{t('map.lead')}</p>
      </div>
      <div className="map-wrap">
        <div className="map-box" ref={box} aria-label={t('map.title')} role="region">
          {state === 'error' && (
            <div className="map-fallback">
              <p>{t('map.fallback')}</p>
              <a className="btn btn-dark" href="https://www.google.com/maps/dir/?api=1&destination=43.1774755,17.4048056" target="_blank" rel="noopener">{t('visit.map')}</a>
            </div>
          )}
          {state === 'loading' && <div className="map-loading" aria-hidden="true" />}
        </div>
        <aside className="map-side">
          <ul className="map-places">
            {PLACES.map((pl) => (
              <li key={pl.id}>
                <button type="button" aria-pressed={sel === pl.id} onClick={() => setSel(pl.id)}>
                  <span className="mp-n">{t(`pl.${pl.id}.n`)}</span>
                  <span className="mp-d">{pl.id === 'vinarija' ? t('map.here') : Math.round(km(HOME.ll, pl.ll)) + ' km'}</span>
                </button>
              </li>
            ))}
          </ul>
          <AnimatePresence mode="wait">
            <motion.div key={sel} className="map-detail" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <p className="md-r">{t(`pl.${sel}.r`)}</p>
              <h3>{t(`pl.${sel}.n`)}</h3>
              <p>{t(`pl.${sel}.p`)}</p>
              {dist !== null && <p className="md-km"><strong>{dist.toLocaleString(lang === 'hr' ? 'hr-HR' : 'en-GB', { maximumFractionDigits: 1 })}</strong> {t('map.dist')}</p>}
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>
    </section>
  );
}
