import { useEffect, useRef } from 'react';
import { useShop, RemoteImg } from '@shared/shop.jsx';
import { useSmoothScroll, Reveal, CountUp, VelocityMarquee, scrollToId, Magnetic } from '@shared/fx.jsx';
import { LangSwitch, CartButton, CartDrawer, FlyLayer, DemoBar, FootCredit } from '@shared/ui.jsx';
import Inquiry, { openInquiry } from '@shared/Inquiry.jsx';
import { GSAP, gsap, SplitText, useGSAP, ScrollTrigger } from '@shared/gsap.js';
import Hero from './Hero.jsx';
import GlassYear from '@shared/GlassYear.jsx';
import WinePicker from './WinePicker.jsx';
import Gallery from './Gallery.jsx';
import MapLive from './MapLive.jsx';

const LOGO = 'https://res.cloudinary.com/dcfelth94/images/f_auto,q_auto,c_limit,w_96/v1749516188/224019853_104292008576408_2247716177356569512_n/224019853_104292008576408_2247716177356569512_n.jpg?_i=AA';
const CartIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h14v16H5z M8.5 9h7 M8.5 12.5h7 M8.5 16h4" /></svg>
);

function Header() {
  const { t } = useShop();
  return (
    <header className="top">
      <a className="brand" href="#top" aria-label="Vinarija Điko">
        <RemoteImg wrap="span" className="brand-logo" src={LOGO} alt="" width="36" height="36" />
        <span className="brand-word">Điko</span>
      </a>
      <nav className="nav" aria-label="Glavna navigacija">
        <a href="#ime">{t('nav.name')}</a>
        <a href="#berba">{t('nav.process')}</a>
        <a href="#vina">{t('nav.wines')}</a>
        <a href="#nagrade">{t('nav.awards')}</a>
        <a href="#karta">{t('nav.map')}</a>
        <a href="#upit">{t('nav.inq')}</a>
      </nav>
      <div className="top-tools"><LangSwitch /><CartButton icon={CartIcon} /></div>
    </header>
  );
}

function Name() {
  const { t, lang } = useShop();
  const ref = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const split = SplitText.create('.name-title', { type: 'chars,words', mask: 'chars' });
      gsap.from(split.chars, {
        yPercent: 110, stagger: 0.025, duration: 0.9, ease: 'power4.out',
        scrollTrigger: { trigger: '.name-title', start: 'top 82%' }
      });
      gsap.from('.name-lead', { opacity: 0.15, y: 20, scrollTrigger: { trigger: '.name-lead', start: 'top 85%', end: 'top 55%', scrub: true } });
      return () => split.revert();
    });
  }, { scope: ref, dependencies: [lang], revertOnUpdate: true });
  const facts = [
    { to: 3, k: 'num.k1', pre: '~' },
    { to: 2021, from: 2000, k: 'num.k2', plain: true },
    { to: 6, k: 'num.k3' },
    { to: 4, k: 'num.k4' }
  ];
  return (
    <section className="name" id="ime" ref={ref} aria-labelledby="name-title">
      <h2 id="name-title" className="name-title" key={lang}>{t('name.title')}</h2>
      <div className="name-text">
        <p className="name-lead">{t('name.p1')}</p>
        <Reveal><p>{t('name.p2')}</p></Reveal>
        <Reveal><p className="name-sorts">{t('name.k2')}: {t('name.v2')} · {t('name.v4')}</p></Reveal>
      </div>
      <div className="name-facts">
        {facts.map((f, n) => (
          <Reveal key={f.k} className="nf" delay={n * 0.08}>
            <p className="nf-v">{f.pre || ''}<CountUp to={f.to} from={f.from || 0} duration={1.6} format={(v) => String(Math.round(v))} /></p>
            <p className="nf-k">{t(f.k)}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Awards() {
  const { t } = useShop();
  const names = ['Decanter', 'Sabatina', 'Vinistra'];
  return (
    <section className="awards" id="nagrade" aria-labelledby="awards-title">
      <h2 id="awards-title">{t('awards.title')}</h2>
      <ul className="sr-list">{names.map((n) => <li key={n}>{n}</li>)}</ul>
      <div aria-hidden="true">
        <VelocityMarquee baseVelocity={-2.2} className="aw-row">
          {[...names, ...names].map((n, i) => <span key={i} className={'aw' + (i % 2 ? ' aw-out' : '')}>{n}<i>✦</i></span>)}
        </VelocityMarquee>
        <VelocityMarquee baseVelocity={1.6} className="aw-row aw-row-2">
          {[...names, ...names].map((n, i) => <span key={i} className={'aw' + (i % 2 ? '' : ' aw-out')}>{n}<i>✦</i></span>)}
        </VelocityMarquee>
      </div>
      <Reveal><p className="aw-note">{t('awards.note')}</p></Reveal>
    </section>
  );
}

function Visit() {
  const { t, setInqType } = useShop();
  return (
    <section className="visit" id="dusina" aria-labelledby="visit-title">
      <div className="visit-coords" aria-hidden="true">
        <CountUp to={43} duration={1.2} format={(v) => String(Math.round(v))} />°10′39″ N<br />
        <CountUp to={17} duration={1.2} format={(v) => String(Math.round(v))} />°24′17″ E
      </div>
      <div className="visit-body">
        <h2 id="visit-title">{t('visit.title')}</h2>
        <p>{t('visit.lead')}</p>
        <dl className="contact">
          <Reveal><dt>{t('visit.addr')}</dt><dd>Dusina 52, 21276 Vrgorac</dd></Reveal>
          <Reveal delay={0.05}><dt>{t('visit.phone')}</dt><dd><a href="tel:+385919279021">+385 91 927 9021</a></dd></Reveal>
          <Reveal delay={0.1}><dt>{t('visit.mail')}</dt><dd><a href="mailto:vinarijadiko@gmail.com">vinarijadiko@gmail.com</a></dd></Reveal>
          <Reveal delay={0.15}><dt>{t('visit.social')}</dt><dd><a href="https://www.instagram.com/vinarijadiko/" target="_blank" rel="noopener">Instagram</a>, <a href="https://www.facebook.com/p/Vinarija-%C4%90iko-100071089855512/" target="_blank" rel="noopener">Facebook</a></dd></Reveal>
        </dl>
        <div className="visit-btns">
          <Magnetic><button type="button" className="btn btn-dark" onClick={() => openInquiry(setInqType, 'visit')}>{t('visit.inq')}</button></Magnetic>
          <Magnetic><a className="btn btn-line" href="https://www.google.com/maps/dir/?api=1&destination=43.1774755,17.4048056" target="_blank" rel="noopener">{t('visit.map')}</a></Magnetic>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  useSmoothScroll(-70, GSAP);
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
        <Name />
        <GlassYear id="berba" kickerKey="proc.kicker" titleKey="proc.title" prefix="proc.p" steps={6}
          wine="#5b1a2a" glass="rgba(35,39,29,.6)" berries={['#9aa35e', '#b9b46a', '#7d3a46', '#5b1a2a']} />
        <WinePicker />
        <Awards />
        <Gallery />
        <MapLive />
        <Inquiry winery="Vinarija Điko" email="vinarijadiko@gmail.com" whatsapp="385919279021" />
        <Visit />
      </main>
      <footer className="foot">
        <p className="foot-mark" aria-hidden="true"><span className="mark-bar" />Diko</p>
        <p>{t('foot.opg')}</p>
        <p className="foot-age">{t('cart.age')}</p>
        <FootCredit />
      </footer>
      <CartDrawer />
      <FlyLayer />
    </>
  );
}
