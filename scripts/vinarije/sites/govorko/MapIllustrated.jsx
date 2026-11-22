/* Ilustrirana karta: Dusina → Metković. Projekcija: lon 17.30–17.72, lat 42.98–43.24 → 1000×846.
 * Ruta se iscrtava dok skrolaš, a kašeta s grožđem putuje od vinograda do podruma. */
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'motion/react';
import { useShop } from '@shared/shop.jsx';

const W = 1000, H = 846;
const P = (lat, lon) => [((lon - 17.30) / 0.42) * W, ((43.24 - lat) / 0.26) * H];

const PLACES = [
  { id: 'dusina', ll: [43.1775, 17.4048], main: true, dx: 18, dy: -14 },
  { id: 'metkovic', ll: [43.0540, 17.6486], main: true, dx: -20, dy: -18, anchor: 'end' },
  { id: 'vrgorac', ll: [43.2058, 17.3725], dx: 14, dy: -10 },
  { id: 'ploce', ll: [43.0547, 17.4339], dx: 14, dy: 22 },
  { id: 'opuzen', ll: [43.0150, 17.5650], dx: 14, dy: 22 },
  { id: 'bacina', ll: [43.0700, 17.4050], dx: 0, dy: -20, anchor: 'middle' }
];
const ROUTE = 'M249.5 203 C 330 236, 430 262, 520 330 S 640 470, 700 520 S 790 585, 829.9 605.2';
const RIVER = 'M357 700 C 400 700, 470 716, 520 728 S 600 742, 631 732 S 700 680, 738 651 S 800 618, 829.9 605.2 S 880 570, 905 554 S 960 515, 1000 492';
const COAST = 'M0 374 C 40 392, 80 420, 102 439 S 170 505, 230 540 S 300 585, 318 603 C 330 630, 340 668, 357 700 C 390 740, 450 790, 560 846';

export default function MapIllustrated() {
  const { t } = useShop();
  const ref = useRef(null);
  const routeRef = useRef(null);
  const [sel, setSel] = useState('dusina');
  const crateRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'center 0.45'] });
  const draw = useTransform(scrollYProgress, [0, 1], [0, 1]);

  /* kašeta se pomiče izravno u DOM-u (bez React re-rendera cijele karte na svaki scroll) */
  const lenRef = useRef(0);
  const place = (v) => {
    const el = routeRef.current, c = crateRef.current;
    if (!el || !c) return;
    if (!lenRef.current) lenRef.current = el.getTotalLength();
    const pt = el.getPointAtLength(Math.max(0, Math.min(1, v)) * lenRef.current);
    c.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
  };
  useMotionValueEvent(draw, 'change', place);
  useEffect(() => { place(draw.get()); }, [draw]);

  const active = PLACES.find((p) => p.id === sel);
  return (
    <section className="map" id="karta" ref={ref} aria-labelledby="map-title">
      <div className="map-head">
        <p className="kicker">{t('map.kicker')}</p>
        <h2 id="map-title">{t('map.title')}</h2>
        <p className="map-lead">{t('map.lead')}</p>
      </div>
      <div className="map-grid">
        <div className="map-canvas">
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t('map.title')}>
            <defs>
              <pattern id="m-field" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-24)">
                <line x1="0" y1="0" x2="0" y2="14" stroke="#a6ae8a" strokeWidth="2" opacity=".55" />
              </pattern>
              <pattern id="m-polje" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
                <line x1="0" y1="0" x2="0" y2="10" stroke="#b9a35c" strokeWidth="1.6" opacity=".55" />
              </pattern>
              <pattern id="m-sea" width="40" height="16" patternUnits="userSpaceOnUse">
                <path d="M0 8 q 10 -6 20 0 t 20 0" fill="none" stroke="#9eb3ae" strokeWidth="1.2" opacity=".7" />
              </pattern>
            </defs>
            {/* more i Pelješac */}
            <path d={COAST + ' L 0 846 Z'} fill="#cfdcd6" />
            <path d={COAST + ' L 0 846 Z'} fill="url(#m-sea)" />
            <path d="M0 781 C 60 786, 150 796, 205 812 S 250 836, 262 846 L 0 846 Z" fill="#e1e5d9" stroke="#1c2b27" strokeOpacity=".25" />
            <path d={COAST} fill="none" stroke="#1c2b27" strokeWidth="1.6" strokeOpacity=".6" />
            {/* brda (Rilić) */}
            {[0, 1, 2, 3].map((i) => (
              <ellipse key={i} cx={210 + i * 4} cy={395 - i * 4} rx={120 - i * 26} ry={62 - i * 13} fill="none" stroke="#1c2b27" strokeOpacity={0.12 + i * 0.05} strokeWidth="1.2" transform="rotate(-28 210 395)" />
            ))}
            {[0, 1, 2].map((i) => (
              <ellipse key={'e' + i} cx={520} cy={170} rx={150 - i * 40} ry={70 - i * 18} fill="none" stroke="#1c2b27" strokeOpacity={0.1 + i * 0.05} strokeWidth="1.2" transform="rotate(-8 520 170)" />
            ))}
            {/* Vrgoračko polje */}
            <ellipse cx="250" cy="165" rx="95" ry="44" fill="url(#m-polje)" transform="rotate(14 250 165)" />
            <text x="300" y="132" className="map-lbl-soft">{t('map.polje')}</text>
            {/* delta Neretve */}
            <path d="M420 640 C 520 610, 650 600, 790 600 C 850 640, 800 700, 720 760 C 620 800, 470 770, 400 720 Z" fill="url(#m-field)" />
            <text x="560" y="790" className="map-lbl-soft">{t('map.delta')}</text>
            {/* Baćinska jezera */}
            {[[228, 540, 12, 7], [252, 552, 10, 6], [272, 566, 13, 7], [246, 574, 8, 5], [292, 578, 9, 5], [262, 590, 7, 4], [282, 596, 8, 4]].map(([cx, cy, rx, ry], i) => (
              <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="#9eb3ae" stroke="#1c2b27" strokeOpacity=".35" />
            ))}
            {/* Neretva */}
            <path id="m-river" d={RIVER} fill="none" stroke="#7fa0a6" strokeWidth="7" strokeLinecap="round" opacity=".85" />
            <text className="map-river"><textPath href="#m-river" startOffset="36%">{t('map.river')}</textPath></text>
            <text x="70" y="680" className="map-sea">{t('map.sea')}</text>

            {/* ruta */}
            <path d={ROUTE} fill="none" stroke="#1c2b27" strokeOpacity=".15" strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
            <motion.path ref={routeRef} d={ROUTE} fill="none" stroke="#d9691a" strokeWidth="3.5" strokeLinecap="round" style={{ pathLength: draw }} />
            <text x="612" y="372" className="map-dist" transform="rotate(46 612 372)">{t('map.dist')}</text>
            <g ref={crateRef} transform="translate(249.5 203)" className="map-crate">
              <rect x="-11" y="-9" width="22" height="14" rx="2" fill="#d9691a" />
              <circle cx="-5" cy="-11" r="4" fill="#43182d" /><circle cx="2" cy="-12" r="4" fill="#571f3a" /><circle cx="7" cy="-9" r="3.5" fill="#43182d" />
            </g>

            {/* mjesta */}
            {PLACES.map((pl) => {
              const [x, y] = P(pl.ll[0], pl.ll[1]);
              const on = sel === pl.id;
              return (
                <g key={pl.id} className={'map-pin' + (on ? ' on' : '') + (pl.main ? ' main' : '')} transform={`translate(${x} ${y})`}
                  role="button" tabIndex={0} aria-pressed={on} aria-label={t(`pl.${pl.id}.n`)}
                  onClick={() => setSel(pl.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(pl.id); } }}>
                  <g className="pin-in">
                    {pl.main && <circle className="pin-pulse" r="10" />}
                    <circle r="26" fill="transparent" />
                    <circle className="pin-dot" r={pl.main ? 9 : 7} />
                    <text x={pl.dx} y={pl.dy} textAnchor={pl.anchor || 'start'} className="pin-lbl">{t(`pl.${pl.id}.n`)}</text>
                  </g>
                </g>
              );
            })}
          </svg>
          <p className="map-note">{t('map.note')}</p>
        </div>

        <aside className="map-card" aria-live="polite">
          <ul className="map-list">
            {PLACES.map((pl) => (
              <li key={pl.id}>
                <button type="button" aria-pressed={sel === pl.id} onClick={() => setSel(pl.id)}>
                  {sel === pl.id && <motion.span layoutId="map-sel" className="map-sel" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                  <span>{t(`pl.${pl.id}.n`)}</span>
                </button>
              </li>
            ))}
          </ul>
          <AnimatePresence mode="wait">
            <motion.div key={active.id} className="map-info" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
              <p className="map-role">{t(`pl.${active.id}.r`)}</p>
              <h3>{t(`pl.${active.id}.n`)}</h3>
              <p>{t(`pl.${active.id}.p`)}</p>
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>
    </section>
  );
}
