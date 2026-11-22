/* Ilustrirana karta: vinogradi u vrgoračkom kraju (Dusina), vinarija u Metkoviću, Neretva i more.
 * Točke su gumbi; odabrana točka pokazuje opis. Približne pozicije, nije geodetska karta. */
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CONTACT } from '../data.js';
import { EASE } from './Bits.jsx';

const PTS = [
  { id: 'dusina', x: 247, y: 173, main: true,
    name: 'Dusina', role: { hr: 'Vinogradi', en: 'Vineyards' },
    text: { hr: 'Stari trsovi plavke, zlatarice, maraštine i trbljana, i novi nasadi trnka, pošipa i merlota. Vinogorje Vrgorac.', en: 'Old vines of Plavka, Zlatarica, Maraština and Trbljan, and new plantings of Trnak, Pošip and Merlot. Vrgorac wine region.' } },
  { id: 'metkovic', x: 579, y: 376, main: true,
    name: 'Metković', role: { hr: 'Vinarija i podrum', en: 'Winery and cellar' },
    text: { hr: 'Ovdje nastaje vino i ovdje dogovaramo degustacije. ' + CONTACT.street + '.', en: 'This is where the wine is made and where we host tastings. ' + CONTACT.street + '.' } },
  { id: 'vrgorac', x: 178, y: 112, name: 'Vrgorac', role: { hr: 'Grad', en: 'Town' },
    text: { hr: 'Središte vinogorja, jednog od najvećih u Hrvatskoj.', en: 'The heart of the wine region, one of the largest in Croatia.' } },
  { id: 'ploce', x: 266, y: 374, name: 'Ploče', role: { hr: 'Luka', en: 'Port' },
    text: { hr: 'Ušće Neretve i more, nedaleko od naših vinograda.', en: 'The Neretva delta and the sea, not far from our vineyards.' } }
];

export default function MapRegion({ lang }) {
  const [sel, setSel] = useState('dusina');
  const T = (o) => o[lang] || o.hr;
  const p = PTS.find((x) => x.id === sel);
  return (
    <div className="map">
      <div className="map-canvas">
      <svg viewBox="0 0 800 520" className="map-svg" aria-hidden="true">
        <defs>
          <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(241,236,227,.07)" strokeWidth="1" />
          </pattern>
        </defs>
        <path d="M0 230 L150 300 L266 380 L300 470 L420 520 L0 520 Z" fill="#17222a" />
        <path d="M0 230 L150 300 L266 380 L300 470 L420 520" fill="none" stroke="rgba(111,138,147,.5)" strokeWidth="1.2" />
        <path d="M40 60 C120 20 260 30 330 80 C390 120 360 210 300 240 C230 270 120 250 70 200 C30 160 10 100 40 60Z" fill="url(#hatch)" stroke="rgba(241,236,227,.12)" strokeDasharray="4 6" />
        <motion.path d="M800 260 C700 300 640 330 579 376 C540 405 500 425 458 442 C400 462 340 470 296 484"
          fill="none" stroke="#6f8a93" strokeWidth="5" strokeLinecap="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2.2, ease: EASE }} />
        <motion.path d="M247 173 C330 240 450 300 579 376" fill="none" stroke="#c8a35e" strokeWidth="1.6" strokeDasharray="6 7"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.8, ease: EASE, delay: 0.6 }} />
        <text x="560" y="455" className="map-river">Neretva</text>
        <text x="60" y="440" className="map-sea">{lang === 'en' ? 'Adriatic Sea' : 'Jadransko more'}</text>
        <text x="70" y="40" className="map-area">{lang === 'en' ? 'Vrgorac wine region' : 'Vinogorje Vrgorac'}</text>
      </svg>
      {PTS.map((x) => (
        <button key={x.id} type="button" className={'map-pin' + (x.main ? ' main' : '') + (sel === x.id ? ' on' : '')}
          style={{ left: (x.x / 800) * 100 + '%', top: (x.y / 520) * 100 + '%' }} aria-pressed={sel === x.id} onClick={() => setSel(x.id)}>
          <span className="map-dot" aria-hidden="true" />
          <span className="map-label">{x.name}</span>
        </button>
      ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={p.id} className="map-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} aria-live="polite">
          <p className="map-card-role">{T(p.role)}</p>
          <p className="map-card-name">{p.name}</p>
          <p className="map-card-text">{T(p.text)}</p>
          {p.id === 'metkovic' && <a className="link-arrow small" href={CONTACT.maps} target="_blank" rel="noopener">{lang === 'en' ? 'Directions' : 'Upute za dolazak'} →</a>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
