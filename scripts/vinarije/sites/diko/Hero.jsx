/* Hero: fotografija preko cijelog ekrana i "Điko" znak. Potez slova Đ ulazi s ruba stranice, slova izrone.
 * Bez pina, samo lagana paralaksa (transform), da bude lagano na mobitelu. */
import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { useShop, RemoteImg } from '@shared/shop.jsx';
import { Magnetic } from '@shared/fx.jsx';

const HERO = 'https://res.cloudinary.com/dcfelth94/images/f_auto,q_auto,c_limit,w_1800/v1749516202/469555413_855819850090283_8033303084818724469_n/469555413_855819850090283_8033303084818724469_n.jpg?_i=AA';
const HERO_S = HERO.replace('w_1800', 'w_900');
const ease = [0.2, 0.75, 0.15, 1];

export default function Hero() {
  const { t } = useShop();
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '16%']);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);

  return (
    <section className="hero" ref={ref} aria-labelledby="hero-mark">
      <motion.div className="hero-media" style={{ y: imgY }} initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 2.2, ease }}>
        <RemoteImg wrap="div" className="fill" src={HERO} srcSet={`${HERO_S} 900w, ${HERO} 1800w`} sizes="100vw" alt="Vinograd Vinarije Điko u Dusini" fetchpriority="high" />
      </motion.div>
      <span className="hero-shade" />
      <motion.div className="hero-in" style={{ y: textY }}>
        <motion.p className="hero-tag" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 0.85, y: 0 }} transition={{ delay: 0.9, duration: 0.7 }}>Dusina · Vrgorac · 43°10′ N</motion.p>
        <h1 className="mark" id="hero-mark">
          <span className="sr">Điko</span>
          <span className="mark-word" aria-hidden="true">
            <motion.span className="mark-bar" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.55, duration: 1.1, ease: [0.7, 0, 0.2, 1] }} style={{ originX: 0 }} />
            {['D', 'i', 'k', 'o'].map((c, i) => (
              <span key={i} className="mark-clip">
                <motion.span className="mark-l" initial={{ y: '105%' }} animate={{ y: '0%' }} transition={{ delay: 0.15 + i * 0.07, duration: 1, ease }}>{c}</motion.span>
              </span>
            ))}
          </span>
        </h1>
        <motion.div className="hero-foot" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8, ease }}>
          <p>{t('hero.line')}</p>
          <Magnetic><a className="btn btn-light" href="#vina">{t('hero.cta')}</a></Magnetic>
        </motion.div>
      </motion.div>
    </section>
  );
}
