/* Godina u vinogradu: sedam mjeseci kao kartice. Klik ili strelice mijenjaju mjesec,
 * fotografija se otkriva zavjesom, a traka ispod pokazuje gdje smo u godini. */
import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useShop } from '@shared/shop.jsx';
import { SEASONS } from '../data.js';
import { Photo } from './Img.jsx';
import { EASE } from './Bits.jsx';

export default function Year({ lang }) {
  const { L } = useShop();
  const [i, setI] = useState(0);
  const tabs = useRef(null);
  const s = SEASONS[i];
  const go = (n, focus) => {
    const k = (n + SEASONS.length) % SEASONS.length;
    setI(k);
    if (focus && tabs.current) tabs.current.querySelectorAll('[role=tab]')[k].focus();
  };
  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1, true); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1, true); }
  };
  return (
    <div className="year">
      <div className="year-tabs" role="tablist" aria-label={lang === 'en' ? 'Months' : 'Mjeseci'} ref={tabs} onKeyDown={onKey}>
        {SEASONS.map((x, k) => (
          <button key={k} type="button" role="tab" id={'yt' + k} aria-selected={k === i} aria-controls="year-panel" tabIndex={k === i ? 0 : -1}
            className={'year-tab' + (k === i ? ' on' : '')} onClick={() => go(k)}>
            {L(x.month)}
          </button>
        ))}
        <motion.span className="year-bar" aria-hidden="true" animate={{ left: `${(i / SEASONS.length) * 100}%` }} style={{ width: `${100 / SEASONS.length}%` }} transition={{ duration: 0.5, ease: EASE }} />
      </div>
      <div className="year-panel" id="year-panel" role="tabpanel" aria-labelledby={'yt' + i}>
        <div className="year-media">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div key={i} className="year-img" initial={{ clipPath: 'inset(0 0 0 100%)' }} animate={{ clipPath: 'inset(0 0 0 0%)' }} exit={{ opacity: 0.6 }}
              transition={{ duration: 0.9, ease: EASE }}>
              <Photo name={s.img} alt={L(s.alt)} sizes="(max-width: 900px) 100vw, 58vw" />
            </motion.div>
          </AnimatePresence>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={i} className="year-text" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.45, ease: EASE }}>
            <p className="year-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</p>
            <h3>{L(s.title)}</h3>
            <p>{L(s.text)}</p>
            <div className="year-nav">
              <button type="button" className="icon-btn" onClick={() => go(i - 1)} aria-label={lang === 'en' ? 'Previous month' : 'Prethodni mjesec'}>←</button>
              <button type="button" className="icon-btn" onClick={() => go(i + 1)} aria-label={lang === 'en' ? 'Next month' : 'Sljedeći mjesec'}>→</button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
