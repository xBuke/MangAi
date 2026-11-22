/* "Rječnik naših vina": odabereš ime, a desno se pokažu boca, značenje riječi i osnovni podaci.
 * Strelice gore/dolje (ili lijevo/desno) mijenjaju vino kad je fokus na popisu. */
import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useShop } from '@shared/shop.jsx';
import { WINES } from '../data.js';
import { href } from '../routes.js';
import { BottleImg } from './Img.jsx';

const EASE = [0.2, 0.75, 0.15, 1];

export default function Dictionary({ lang }) {
  const { t, L } = useShop();
  const [sel, setSel] = useState(0);
  const list = useRef(null);
  const w = WINES[sel];

  const onKey = (e) => {
    const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!d) return;
    e.preventDefault();
    const n = (sel + d + WINES.length) % WINES.length;
    setSel(n);
    const b = list.current && list.current.querySelectorAll('button')[n];
    if (b) b.focus();
  };

  return (
    <div className="dict">
      <div className="dict-list" ref={list} role="tablist" aria-orientation="vertical" aria-label={t('nav.wines')} onKeyDown={onKey}>
        {WINES.map((x, i) => (
          <button key={x.id} type="button" role="tab" id={'dt-' + x.id} aria-selected={i === sel} aria-controls="dict-panel"
            tabIndex={i === sel ? 0 : -1} className={'dict-row' + (i === sel ? ' on' : '')} onClick={() => setSel(i)}>
            {i === sel && <motion.span layoutId="dict-mark" className="dict-mark" transition={{ duration: 0.45, ease: EASE }} />}
            <span className="dict-name">{x.name}</span>
            <span className="dict-kind">{t('kind.' + x.type)}{x.year ? ' · ' + x.year : ''}</span>
          </button>
        ))}
      </div>
      <div className="dict-panel" id="dict-panel" role="tabpanel" aria-labelledby={'dt-' + w.id} aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={w.id} className="dict-in" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <motion.div className="dict-bottle" initial={{ y: 40, rotate: -4, opacity: 0 }} animate={{ y: 0, rotate: 0, opacity: 1 }} transition={{ duration: 0.8, ease: EASE }}>
              <BottleImg id={w.id} alt={(lang === 'en' ? 'Bottle of ' : 'Boca vina ') + w.name} />
            </motion.div>
            <div className="dict-text">
              <p className="dict-word">{w.name}</p>
              <p className="dict-pos">{L(w.pos)}</p>
              <motion.p className="dict-meaning" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6, ease: EASE }}>{L(w.meaning)}</motion.p>
              <p className="dict-story">{L(w.story)}</p>
              <dl className="dict-facts">
                <div><dt>{t('w.grapes')}</dt><dd>{L(w.grapes)}</dd></div>
                <div><dt>{t('w.abv')}</dt><dd>{w.abv ? w.abv + ' %' : '—'}</dd></div>
                <div><dt>{t('w.temp')}</dt><dd>{w.temp[0]}–{w.temp[1]} °C</dd></div>
              </dl>
              <a className="link-arrow" href={href('wine', lang, w.id)}>{t('w.more')} {w.name} <span aria-hidden="true">→</span></a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
