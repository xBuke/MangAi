import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useSpring, useInView, LayoutGroup } from 'motion/react';
import { useShop, RemoteImg } from '@shared/shop.jsx';
import Bottle from '@shared/Bottle.jsx';
import { useSmoothScroll, SplitText, ScrollWords, Reveal, CountUp, Magnetic, Tilt, Scramble, scrollToId } from '@shared/fx.jsx';
import { LangSwitch, CartButton, CartDrawer, FlyLayer, DemoBar, AddButton, CornerGlass } from '@shared/ui.jsx';
import HSteps from '@shared/HSteps.jsx';
import { GSAP, gsap, useGSAP, ScrollTrigger } from '@shared/gsap.js';
import Inquiry, { openInquiry } from '@shared/Inquiry.jsx';
import MapIllustrated from './MapIllustrated.jsx';

const IMG = {
  logo: 'https://vinarnice.hr/media/680572/logo-50x50.png?width=160',
  hero: 'https://vinarnice.hr/media/701050/vinograd.jpg?width=1800',
  heroS: 'https://vinarnice.hr/media/701050/vinograd.jpg?width=900',
  story: 'https://www.vinskeprice.com/wp-content/uploads/2020/12/IMG_5092.jpg',
  grapes: 'https://vinarnice.hr/media/701047/grozde-crno.jpg?width=1000',
  strip: [
    ['https://vinarnice.hr/media/701046/boce.jpg?width=700', 'Boce Vina Govorko'],
    ['https://juliofrangenfoto.com/wp-content/uploads/2021/04/Vina-Govorko-7.jpg', 'Vina Govorko'],
    ['https://vinarnice.hr/media/701048/grozde.jpg?width=700', 'Grožđe'],
    ['https://vinarnice.hr/media/680578/vina-govorko_slika-1.jpeg?width=700', 'Vina Govorko'],
    ['https://juliofrangenfoto.com/wp-content/uploads/2021/04/Dispet-3-647x1024-1.jpg', 'Dišpet'],
    ['https://vinarnice.hr/media/701045/boce-kutija.jpg?width=700', 'Boce u kutiji']
  ]
};

const CartIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h14v16H5z M8.5 9h7 M8.5 12.5h7 M8.5 16h4" /></svg>
);

function Header() {
  const { t } = useShop();
  const { scrollY, scrollYProgress } = useScroll();
  const [hidden, setHidden] = useState(false);
  useMotionValueEvent(scrollY, 'change', (v) => {
    const prev = scrollY.getPrevious() || 0;
    setHidden(v > prev && v > 400);
  });
  const prog = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });
  return (
    <motion.header className="top" animate={{ y: hidden ? '-110%' : '0%' }} transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}>
      <a className="brand" href="#top" aria-label="Vina Govorko">
        <RemoteImg wrap="span" className="brand-logo" src={IMG.logo} alt="" width="34" height="34" />
        <span className="brand-word">Govorko</span>
      </a>
      <nav className="nav" aria-label="Glavna navigacija">
        <a href="#prica">{t('nav.story')}</a>
        <a href="#godina">{t('nav.vineyard')}</a>
        <a href="#vina">{t('nav.wines')}</a>
        <a href="#karta">{t('map.kicker')}</a>
        <a href="#posjet">{t('nav.visit')}</a>
        <a href="#upit">{t('nav.inq')}</a>
      </nav>
      <div className="top-tools">
        <LangSwitch />
        <CartButton icon={CartIcon} />
      </div>
      <motion.span className="top-progress" style={{ scaleX: prog }} aria-hidden="true" />
    </motion.header>
  );
}

/* hero: rječnička natuknica koja se sama "premeće" kroz riječi iz kraja.
 * Na scroll (GSAP pin + scrub) fotografija iz luka naraste preko cijelog ekrana, a tekst prijeđe u svijetlo. */
function Hero() {
  const { t, L, site } = useShop();
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3 });
  const words = useMemo(() => {
    const byId = Object.fromEntries(site.products.map((p) => [p.id, p]));
    return [
      { id: 'dispet', w: 'dišpet', pos: t('hero.pos'), s1: t('hero.d1'), s2: t('hero.d2'), ex: t('hero.ex') },
      ...['delozija', 'bokun', 'brankic'].map((id) => {
        const p = byId[id];
        return { id, w: p.name.toLowerCase(), pos: L(p.pos), s1: L(p.meaning), s2: L(p.kind).toLowerCase() + ' ' + t('w.from') + ' ' + L(p.grapes) + '.', ex: '' };
      })
    ];
  }, [t, L, site]);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const running = !paused && inView;
  useEffect(() => {
    if (!running || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setTimeout(() => setI((n) => (n + 1) % words.length), 5200);
    return () => clearTimeout(id);
  }, [i, running, words.length]);
  const cur = words[i];

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const light = { '--hero-ink': '#eceee6', '--hero-soft': 'rgba(236,238,230,.78)', '--hero-line': 'rgba(236,238,230,.35)', '--hero-btn': '#eceee6', '--hero-btn-ink': '#1c2b27', '--hero-acc': '#f3b27a' };
    mm.add({ desk: '(min-width: 961px) and (prefers-reduced-motion: no-preference)', mob: '(max-width: 960px) and (prefers-reduced-motion: no-preference)' }, (ctx) => {
      const from = ctx.conditions.desk
        ? 'inset(5% 6% 17% 59% round 220px 220px 4px 4px)'
        : 'inset(40% 6% 12% 6% round 140px 140px 4px 4px)';
      gsap.fromTo('.hero-media', { clipPath: ctx.conditions.desk ? 'inset(100% 6% 17% 59% round 220px 220px 4px 4px)' : 'inset(100% 6% 12% 6% round 140px 140px 4px 4px)' }, { clipPath: from, duration: 1.3, ease: 'power3.inOut', delay: 0.15 });
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top top', end: '+=120%', scrub: 0.6, pin: true, anticipatePin: 1 } });
      tl.fromTo('.hero-media', { clipPath: from }, { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)', ease: 'power1.inOut', duration: 1, immediateRender: false }, 0)
        .fromTo('.hero-media img', { scale: 1.2 }, { scale: 1.02, ease: 'none', duration: 1 }, 0)
        .to('.hero-shade', { opacity: 1, duration: 0.5 }, 0.3)
        .to(ref.current, { ...light, duration: 0.35 }, 0.22)
        .to('.hero-fade', { opacity: 0, y: -16, duration: 0.3, stagger: 0.04 }, 0.15)
        .to('.hero-cap', { opacity: 0, duration: 0.2 }, 0);
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.hero-media', { clipPath: 'none' });
      gsap.set('.hero-shade', { opacity: 1 });
      gsap.set(ref.current, light);
    });
  }, { scope: ref });

  return (
    <section className="hero" ref={ref} aria-labelledby="hero-word" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <div className="hero-media">
        <RemoteImg wrap="div" className="fill" src={IMG.hero} srcSet={`${IMG.heroS} 900w, ${IMG.hero} 1800w`} sizes="100vw" alt="Vinograd Govorko u Dusini" fetchpriority="high" />
        <span className="hero-shade" />
      </div>
      <p className="hero-cap" aria-hidden="true">Dusina, vinogorje Vrgorac</p>
      <div className="hero-entry">
        <h1 className="hw" id="hero-word"><Scramble text={cur.w} /></h1>
        <AnimatePresence mode="wait">
          <motion.div key={cur.id} initial="h" animate="s" exit="x" variants={{ s: { transition: { staggerChildren: 0.08 } } }}>
            <motion.p className="hw-pos" variants={{ h: { opacity: 0, y: 10 }, s: { opacity: 1, y: 0 }, x: { opacity: 0 } }}>{cur.pos}</motion.p>
            <ol className="hw-senses">
              <motion.li variants={{ h: { opacity: 0, y: 12 }, s: { opacity: 1, y: 0 }, x: { opacity: 0 } }}>{cur.s1}</motion.li>
              <motion.li className="hero-fade hw-s2" variants={{ h: { opacity: 0, y: 12 }, s: { opacity: 1, y: 0 }, x: { opacity: 0 } }}>{cur.s2}</motion.li>
            </ol>
            {cur.ex && <motion.p className="hw-ex hero-fade" variants={{ h: { opacity: 0 }, s: { opacity: 1 }, x: { opacity: 0 } }}>{cur.ex}</motion.p>}
          </motion.div>
        </AnimatePresence>
        <div className="hw-switch" role="group" aria-label={t('hero.word')}>
          {words.map((w, n) => (
            <button key={w.id} type="button" aria-pressed={n === i} aria-label={w.w} onClick={() => setI(n)}>
              <span className="hw-bar">{n === i && running && <motion.span key={'b' + i} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 5.2, ease: 'linear' }} />}{n === i && !running && <span style={{ transform: 'scaleX(1)' }} />}</span>
              <span className="hw-lbl">{w.w}</span>
            </button>
          ))}
        </div>
        <p className="hero-lead">{t('hero.lead')}</p>
        <div className="hero-cta">
          <Magnetic><a className="btn btn-hero" href="#vina">{t('hero.cta')}</a></Magnetic>
          <Magnetic><a className="btn btn-hero-line" href="#prica">{t('hero.cta2')}</a></Magnetic>
        </div>
      </div>
    </section>
  );
}

function Story() {
  const { t } = useShop();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const rot = useTransform(scrollYProgress, [0, 1], [-3, 2]);
  return (
    <section className="story" id="prica" ref={ref} aria-labelledby="story-title">
      <motion.figure className="story-photo" style={{ rotate: rot }}>
        <motion.div style={{ y, scale: 1.15 }} className="fill-wrap">
          <RemoteImg wrap="div" className="fill" src={IMG.story} alt="" loading="lazy" />
        </motion.div>
        <figcaption>{t('story.cap')}</figcaption>
      </motion.figure>
      <div className="story-text">
        <SplitText as="h2" className="story-title" text={t('story.title')} stagger={0.018} />
        <ScrollWords className="story-big" text={t('story.p1')} />
        <Reveal><p>{t('story.p2')}</p></Reveal>
        <Reveal delay={0.1}><p>{t('story.p3')}</p></Reveal>
        <Reveal delay={0.2}><p className="sign">{t('story.sign')}</p></Reveal>
      </div>
    </section>
  );
}

function Numbers() {
  const { t } = useShop();
  const items = [
    { to: 50, suffix: '+', k: 'num.k1' },
    { to: 8000, k: 'num.k2' },
    { to: 2000, k: 'num.k3' },
    { to: 2015, from: 1990, k: 'num.k4', plain: true }
  ];
  return (
    <section className="numbers" aria-label={t('num.title')}>
      {items.map((it, n) => (
        <Reveal key={it.k} className="num" delay={n * 0.08}>
          <p className="num-v"><CountUp to={it.to} from={it.from || 0} format={(v) => (it.plain ? String(Math.round(v)) : Math.round(v).toLocaleString('hr-HR')) + (it.suffix || '')} /></p>
          <p className="num-k">{t(it.k)}</p>
        </Reveal>
      ))}
    </section>
  );
}

function Vineyard() {
  const { t } = useShop();
  return (
    <section className="vineyard" id="vinograd" aria-labelledby="vy-title">
      <div className="vy-head">
        <SplitText as="h2" text={t('vy.title')} stagger={0.02} />
        <Reveal><p>{t('vy.lead')}</p></Reveal>
      </div>
      <div className="vy-grid">
        <dl className="facts">
          {[1, 2, 3, 4, 5].map((n) => (
            <Reveal key={n} delay={n * 0.06}><dt>{t('vy.k' + n)}</dt><dd>{t('vy.v' + n)}</dd></Reveal>
          ))}
        </dl>
        <Reveal className="vy-photo-wrap"><RemoteImg className="vy-photo" src={IMG.grapes} alt="Crno grožđe u vinogradu" loading="lazy" /></Reveal>
      </div>
      <blockquote className="vy-note"><ScrollWords as="p" text={t('vy.note')} /></blockquote>
    </section>
  );
}

/* traka fotografija koju možeš povući mišem ili prstom */
function Strip() {
  const { t } = useShop();
  const wrap = useRef(null);
  const track = useRef(null);
  const [limit, setLimit] = useState(0);
  useEffect(() => {
    const calc = () => { if (wrap.current && track.current) setLimit(Math.max(0, track.current.scrollWidth - wrap.current.clientWidth)); };
    calc(); window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);
  return (
    <div className="strip" ref={wrap} role="region" aria-label={t('gal.aria')}>
      <motion.div className="strip-track" ref={track} drag="x" dragConstraints={{ left: -limit, right: 0 }} dragElastic={0.08} whileTap={{ cursor: 'grabbing' }}>
        {IMG.strip.map(([src, alt], n) => (
          <motion.div key={n} className="strip-item" whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
            <RemoteImg src={src} alt={alt} loading="lazy" draggable="false" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function Entry({ p }) {
  const { t, L, site } = useShop();
  const bottleRef = useRef(null);
  return (
    <motion.article layout className="entry" id={'vino-' + p.id}
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}>
      <Tilt className="entry-bottle" max={12}>
        <div ref={bottleRef}><Bottle p={p} font={site.labelFont} sub={site.labelSub} /></div>
        <span className="entry-shadow" />
      </Tilt>
      <div className="entry-body">
        <h3 className="entry-word">{p.name}</h3>
        <p className="entry-pos">{L(p.pos)}</p>
        <p className="entry-def"><span className="sense">1.</span> {L(p.meaning)}</p>
        <p className="entry-def"><span className="sense">2.</span> {L(p.kind).toLowerCase()} {t('w.from')} {L(p.grapes)}. {L(p.note)}</p>
        <div className="entry-buy">
          <span className="price-vol">{p.vol}</span>
          <AddButton p={p} sourceRef={bottleRef} />
        </div>
      </div>
    </motion.article>
  );
}

function Wines() {
  const { t, site } = useShop();
  const [f, setF] = useState('all');
  const types = ['all', 'white', 'rose', 'red', 'sparkling'];
  const list = site.products.filter((p) => f === 'all' || p.type === f);
  return (
    <section className="wines" id="vina" aria-labelledby="wines-title">
      <div className="wines-head">
        <div>
          <SplitText as="h2" text={t('wines.title')} stagger={0.02} className="wines-title" />
          <Reveal><p>{t('wines.lead')}</p></Reveal>
        </div>
        <div className="filters" role="group" aria-label={t('f.aria')}>
          {types.map((k) => (
            <button key={k} type="button" aria-pressed={f === k} onClick={() => setF(k)}>
              {f === k && <motion.span layoutId="filter-pill" className="filter-pill" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <span>{t('f.' + k)}</span>
            </button>
          ))}
        </div>
      </div>
      <LayoutGroup>
        <motion.div layout className="entries">
          <AnimatePresence mode="popLayout">
            {list.map((p) => <Entry key={p.id} p={p} />)}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
      <p className="ship-note">{t('shop.note')}</p>
    </section>
  );
}

function Visit() {
  const { t, setInqType } = useShop();
  return (
    <section className="visit" id="posjet" aria-labelledby="visit-title">
      <div>
        <SplitText as="h2" text={t('visit.title')} stagger={0.025} />
        <Reveal><p>{t('visit.lead')}</p></Reveal>
        <div className="visit-btns">
          <Magnetic><a className="btn btn-line" href="https://www.google.com/maps/search/?api=1&query=Kneza+Branimira+18+Metkovi%C4%87" target="_blank" rel="noopener">{t('visit.map')}</a></Magnetic>
          <Magnetic><a className="btn btn-line" href="https://www.google.com/maps/dir/?api=1&origin=43.1775,17.4048&destination=Kneza+Branimira+18+Metkovi%C4%87" target="_blank" rel="noopener">{t('visit.route')}</a></Magnetic>
          <Magnetic><button type="button" className="btn btn-main" onClick={() => openInquiry(setInqType, 'visit')}>{t('visit.inq')}</button></Magnetic>
        </div>
      </div>
      <dl className="contact">
        <Reveal><dt>{t('visit.addr')}</dt><dd>Kneza Branimira 18<br />20350 Metković</dd></Reveal>
        <Reveal delay={0.06}><dt>{t('visit.phone')}</dt><dd><a href="tel:+385989157997">+385 98 915 7997</a></dd></Reveal>
        <Reveal delay={0.12}><dt>{t('visit.mail')}</dt><dd><a href="mailto:vinagovorko@hotmail.com">vinagovorko@hotmail.com</a></dd></Reveal>
        <Reveal delay={0.18}><dt>{t('visit.social')}</dt><dd><a href="https://www.instagram.com/vinagovorko/" target="_blank" rel="noopener">Instagram</a> · <a href="https://www.facebook.com/vinagovorko/" target="_blank" rel="noopener">Facebook</a></dd></Reveal>
      </dl>
    </section>
  );
}

export default function App() {
  useSmoothScroll(-20, GSAP);
  const { t } = useShop();
  useEffect(() => {
    /* slike i fontovi mijenjaju visine → osvježi ScrollTrigger */
    const r = () => ScrollTrigger.refresh();
    window.addEventListener('load', r);
    document.fonts && document.fonts.ready.then(r);
    if (location.hash) setTimeout(() => scrollToId(location.hash.slice(1)), 500);
    return () => window.removeEventListener('load', r);
  }, []);
  return (
    <>
      <DemoBar />
      <Header />
      <main id="top">
        <Hero />
        <Story />
        <Numbers />
        <HSteps id="godina" kickerKey="year.kicker" titleKey="year.title" prefix="year.s" label="GOVORKO"
          arts={['prune', 'bud', 'flower', 'veraison', 'crate', 'barrel', 'bottle']}
          palette={[['#e1e5d9', '#1c2b27', '#d9691a'], ['#d3dbc2', '#1c2b27', '#5d6b3a'], ['#ebe6cf', '#1c2b27', '#8a6d1f'], ['#43182d', '#f3eaee', '#f3b27a'], ['#d9691a', '#1c2b27', '#43182d'], ['#2b211c', '#efe6dc', '#f3b27a'], ['#1c2b27', '#eceee6', '#f3b27a']]} />
        <Vineyard />
        <Strip />
        <Wines />
        <MapIllustrated />
        <Inquiry winery="Vina Govorko" email="vinagovorko@hotmail.com" whatsapp="385989157997" />
        <Visit />
      </main>
      <footer className="foot">
        <p className="foot-slogan"><SplitText text={t('foot.slogan')} stagger={0.03} /></p>
        <p>{t('foot.opg')}</p>
        <p className="foot-age">{t('cart.age')}</p>
      </footer>
      <CornerGlass wine="#5a1f3a" glass="rgba(28,43,39,.75)" />
      <CartDrawer />
      <FlyLayer />
    </>
  );
}
