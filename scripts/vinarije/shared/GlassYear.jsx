/* Zakvačena sekcija s koracima berbe: dok skrolaš, grozd sazrijeva, bere se i čaša se puni.
 * Props: id, kickerKey, titleKey, prefix ('year.s' | 'proc.p'), steps, wine, glass, berries [4 boje sazrijevanja]. */
import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence, useSpring } from 'motion/react';
import { useShop } from './shop.jsx';
import { WineGlass, scrollToId } from './fx.jsx';

const BERRIES = [
  [0, 0], [-22, 4], [22, 4], [-40, 12], [40, 12],
  [-11, 28], [11, 28], [-31, 36], [31, 36], [0, 52],
  [-20, 58], [20, 58], [-9, 80], [9, 80], [0, 102]
];

function Berry({ x, y, i, progress, colors }) {
  const r = useTransform(progress, [0.1, 0.5], [3 + (i % 3), 12 + (i % 2) * 1.5]);
  const fill = useTransform(progress, [0.25, 0.45, 0.55, 0.62], colors);
  return <motion.circle cx={x} cy={y} r={r} style={{ fill }} />;
}

const DEF_BERRIES = ['#8ea25a', '#a8b45f', '#7a3c5e', '#43182d'];
export default function GlassYear({ id = 'godina', kickerKey = 'year.kicker', titleKey = 'year.title', prefix = 'year.s', steps: STEPS = 7, wine = '#5a1f3a', glass = 'rgba(28,43,39,.6)', berries = DEF_BERRIES, ctaTarget = 'vina' }) {
  const { t } = useShop();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => setStep(Math.min(STEPS - 1, Math.floor(v * STEPS * 0.999))));

  /* grozd: raste, mijenja boju, pa se "bere" i nestaje u čaši */
  const clusterY = useTransform(p, [0.6, 0.74], [0, 120]);
  const clusterScale = useTransform(p, [0, 0.12, 0.6, 0.74], [0.6, 0.85, 1, 0.35]);
  const clusterOpacity = useTransform(p, [0.64, 0.76], [1, 0]);
  const flowers = useTransform(p, [0.26, 0.34, 0.42], [0, 1, 0]);
  const leafRot = useTransform(p, [0, 1], [-8, 6]);
  const level = useTransform(p, [0.66, 0.98], [0, 1]);
  const stream = useTransform(p, [0.66, 0.7, 0.94, 0.98], [0, 1, 1, 0]);
  const rail = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const done = step === STEPS - 1;

  return (
    <section className="year" id={id} ref={ref} aria-labelledby={id + '-title'} style={{ height: `${STEPS * 85}vh` }}>
      <div className="year-pin">
        <div className="year-text">
          <p className="kicker">{t(kickerKey)}</p>
          <h2 id={id + '-title'}>{t(titleKey)}</h2>
          <ol className="year-rail">
            <motion.span className="year-rail-fill" style={{ scaleY: rail }} aria-hidden="true" />
            {Array.from({ length: STEPS }, (_, i) => (
              <li key={i} className={i === step ? 'on' : i < step ? 'past' : ''} aria-current={i === step ? 'step' : undefined}>
                <span className="yr-m">{t(`${prefix}${i + 1}.m`)}</span>
                <span className="yr-t">{t(`${prefix}${i + 1}.t`)}</span>
              </li>
            ))}
          </ol>
          <div className="year-copy" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.p key={step} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
                <span className="yc-head">{t(`${prefix}${step + 1}.m`)} · <b>{t(`${prefix}${step + 1}.t`)}</b></span>
                {t(`${prefix}${step + 1}.p`)}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <div className="year-stage" aria-hidden="true">
          <div className="year-step-no"><span>{String(step + 1).padStart(2, '0')}</span>/{String(STEPS).padStart(2, '0')}</div>
          <svg className="vine" viewBox="-120 -110 240 260">
            <path d="M-110 -80 C -60 -100, -20 -70, 0 -62 C 30 -52, 70 -88, 118 -70" fill="none" stroke="#6b5a3e" strokeWidth="5" strokeLinecap="round" />
            <motion.g style={{ rotate: leafRot, originX: '30px', originY: '-60px' }}>
              <path d="M30 -60 C 50 -98, 98 -98, 104 -58 C 108 -30, 70 -18, 52 -34 C 40 -24, 26 -36, 30 -60 Z" fill="#5f7a3f" />
              <path d="M32 -58 L 92 -64 M52 -60 L 70 -84 M60 -60 L 66 -36" stroke="#4a6130" strokeWidth="1.6" fill="none" />
            </motion.g>
            <motion.g style={{ y: clusterY, scale: clusterScale, opacity: clusterOpacity }}>
              <path d="M0 -62 C -2 -40, 2 -24, 0 -8" stroke="#6b5a3e" strokeWidth="4" fill="none" strokeLinecap="round" />
              {BERRIES.map(([x, y], i) => <Berry key={i} x={x} y={y} i={i} progress={p} colors={berries} />)}
              <motion.g style={{ opacity: flowers }}>
                {BERRIES.filter((_, i) => i % 2 === 0).map(([x, y], i) => <circle key={i} cx={x + 4} cy={y - 4} r="3" fill="#f2efc4" />)}
              </motion.g>
            </motion.g>
          </svg>
          <motion.span className="pour" style={{ scaleY: stream, opacity: stream }} />
          <WineGlass level={level} wine={wine} glass={glass} className="year-glass" />
          <AnimatePresence>
            {done && (
              <motion.div className="cheers" initial={{ opacity: 0, scale: 0.8, rotate: -6 }} animate={{ opacity: 1, scale: 1, rotate: -4 }} exit={{ opacity: 0 }}>
                {t('year.cheers')}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {done ? (
            <motion.button key="cta" type="button" className="btn btn-main year-cta" onClick={() => scrollToId(ctaTarget)}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{t('year.cta')}</motion.button>
          ) : (
            <motion.p key="hint" className="year-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {t('year.hint')} <span aria-hidden="true">↓</span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
