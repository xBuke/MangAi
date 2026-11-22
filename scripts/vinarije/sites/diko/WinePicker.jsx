/* Izbornik vina: popis lijevo, velika boca u sredini, pozadina sekcije preuzima boju vina. */
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '@shared/shop.jsx';
import Bottle from '@shared/Bottle.jsx';
import { Tilt, SplitText } from '@shared/fx.jsx';
import { AddButton } from '@shared/ui.jsx';

function isDark(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) < 140;
}

export default function WinePicker() {
  const { t, L, money, site } = useShop();
  const list = site.products;
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const tabs = useRef([]);
  const bottleRef = useRef(null);
  const p = list[i];
  const dark = isDark(p.tint);

  const go = (n, focus) => {
    const next = (n + list.length) % list.length;
    setDir(next > i ? 1 : -1);
    setI(next);
    if (focus) tabs.current[next] && tabs.current[next].focus();
  };
  const onKey = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); go(i + 1, true); }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1, true); }
    if (e.key === 'Home') { e.preventDefault(); go(0, true); }
    if (e.key === 'End') { e.preventDefault(); go(list.length - 1, true); }
  };

  return (
    <motion.section className={'wines' + (dark ? ' is-dark' : '')} id="vina" aria-labelledby="wines-title"
      animate={{ backgroundColor: p.tint }} transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}>
      <div className="wines-head">
        <SplitText as="h2" text={t('wines.title')} className="wines-title" stagger={0.05} />
        <p>{t('wines.lead')}</p>
      </div>
      <div className="picker">
        <div className="picker-list" role="tablist" aria-label={t('sel.aria')} aria-orientation="vertical" onKeyDown={onKey}>
          {list.map((w, n) => (
            <button key={w.id} ref={(el) => (tabs.current[n] = el)} role="tab" id={'tab-' + w.id} aria-controls="wine-panel"
              aria-selected={n === i} tabIndex={n === i ? 0 : -1} onClick={() => go(n)}>
              <span className="pk-no">{String(n + 1).padStart(2, '0')}</span>
              <span className="pk-name">{w.name}</span>
              {n === i && <motion.span layoutId="pk-line" className="pk-line" transition={{ type: 'spring', stiffness: 380, damping: 34 }} />}
            </button>
          ))}
        </div>

        <div className="picker-stage">
          <AnimatePresence mode="popLayout" custom={dir} initial={false}>
            <motion.div key={p.id} className="picker-bottle" custom={dir}
              initial={{ y: dir * 140, rotate: dir * 18, opacity: 0 }}
              animate={{ y: 0, rotate: 0, opacity: 1 }}
              exit={{ y: -dir * 140, rotate: -dir * 14, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 160, damping: 20 }}>
              <Tilt max={10}><div ref={bottleRef}><Bottle p={p} font={site.labelFont} sub={site.labelSub} /></div></Tilt>
            </motion.div>
          </AnimatePresence>
          <span className="picker-ring" aria-hidden="true" />
          <div className="picker-arrows">
            <button type="button" onClick={() => go(i - 1)} aria-label={t('sel.prev')}>←</button>
            <button type="button" onClick={() => go(i + 1)} aria-label={t('sel.next')}>→</button>
          </div>
        </div>

        <div className="picker-info" id="wine-panel" role="tabpanel" aria-labelledby={'tab-' + p.id}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={p.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }}>
              {p.tag && <span className="wine-tag">{L(p.tag)}</span>}
              <h3>{p.name}</h3>
              <p className="wine-meta">{L(p.kind)} · {L(p.grapes)}</p>
              <p className="wine-note">{L(p.note)}</p>
              <div className="wine-buy">
                <span className="price">{money(p.price)}</span><span className="vol">{p.vol}</span>
              </div>
              <AddButton p={p} sourceRef={bottleRef} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <p className="ship-note">{t('shop.note')}</p>
    </motion.section>
  );
}
