/* Galerija: sličica "preleti" u fotografiju preko cijelog ekrana (shared-element prijelaz, Motion layoutId). */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop, RemoteImg } from '@shared/shop.jsx';
import { lockScroll, SplitText } from '@shared/fx.jsx';

const C = (v, id) => `https://res.cloudinary.com/dcfelth94/images/f_auto,q_auto,c_limit,w_1400/${v}/${id}/${id}.jpg?_i=AA`;
const PHOTOS = [
  { src: C('v1749516200', '469491618_854813886857546_6303522316356232984_n'), alt: 'Vinograd u Dusini', cls: 'g1' },
  { src: C('v1749516186', '480043890_664173299295659_2215895580654467899_n'), alt: 'Vinarija Điko', cls: 'g2' },
  { src: C('v1749516191', '480029867_664172909295698_5870065943401571250_n'), alt: 'Vinarija Điko', cls: 'g3' },
  { src: C('v1749516194', '352292924_185168694187600_7042712951074960901_n'), alt: 'Vinarija Điko', cls: 'g4' },
  { src: 'https://www.corkcroatia.hr/wp-content/uploads/2025/07/20250627_142821-e1751727724955.jpg', alt: 'Vinarija Điko na TrnjakFestu', cls: 'g5' }
];

export default function Gallery() {
  const { t } = useShop();
  const [open, setOpen] = useState(null);
  const closeRef = useRef(null);
  const lastFocus = useRef(null);

  useEffect(() => {
    if (open === null) return;
    lockScroll(true);
    setTimeout(() => closeRef.current && closeRef.current.focus(), 50);
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((n) => (n + 1) % PHOTOS.length);
      if (e.key === 'ArrowLeft') setOpen((n) => (n - 1 + PHOTOS.length) % PHOTOS.length);
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); lockScroll(false); if (lastFocus.current) lastFocus.current.focus(); };
  }, [open]);

  return (
    <section className="gallery" aria-labelledby="gal-title">
      <SplitText as="h2" text={t('gal.title')} stagger={0.02} className="gal-title" />
      <div className="gal-grid">
        {PHOTOS.map((ph, n) => (
          <motion.button key={n} type="button" className={'gal-item ' + ph.cls} layoutId={'ph-' + n}
            onClick={(e) => { lastFocus.current = e.currentTarget; setOpen(n); }} aria-label={t('gal.open') + ': ' + ph.alt}
            whileHover="hover" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, delay: n * 0.06, ease: [0.2, 0.7, 0.2, 1] }}>
            <motion.div className="gal-zoom" variants={{ hover: { scale: 1.06 } }} transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}>
              <RemoteImg wrap="div" className="fill" src={ph.src.replace('w_1400', 'w_800')} alt="" loading="lazy" decoding="async" />
            </motion.div>
            <span className="gal-plus" aria-hidden="true">+</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label={PHOTOS[open].alt}
            initial={{ backgroundColor: 'rgba(20,22,16,0)' }} animate={{ backgroundColor: 'rgba(20,22,16,.92)' }} exit={{ backgroundColor: 'rgba(20,22,16,0)' }}
            transition={{ duration: 0.25 }} onClick={() => setOpen(null)}>
            <motion.div className="lb-frame" layoutId={'ph-' + open} onClick={(e) => e.stopPropagation()} transition={{ type: 'spring', stiffness: 340, damping: 34 }}>
              <RemoteImg wrap="div" className="fill contain" src={PHOTOS[open].src} alt={PHOTOS[open].alt} />
            </motion.div>
            <motion.div className="lb-ui" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(e) => e.stopPropagation()}>
              <button type="button" onClick={() => setOpen((open - 1 + PHOTOS.length) % PHOTOS.length)} aria-label={t('gal.prev')}>←</button>
              <span>{open + 1} / {PHOTOS.length}</span>
              <button type="button" onClick={() => setOpen((open + 1) % PHOTOS.length)} aria-label={t('gal.next')}>→</button>
              <button type="button" ref={closeRef} className="lb-close" onClick={() => setOpen(null)} aria-label={t('gal.close')}>✕</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
