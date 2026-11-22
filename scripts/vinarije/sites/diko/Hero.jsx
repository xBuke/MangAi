/* Hero: "Điko" znak + fotografija u prozorčiću koja na scroll naraste preko cijelog ekrana (GSAP ScrollTrigger, pin + scrub). */
import { useRef } from 'react';
import { useShop, RemoteImg } from '@shared/shop.jsx';
import { Magnetic } from '@shared/fx.jsx';
import { gsap, useGSAP } from './gsap-setup.js';

const HERO = 'https://res.cloudinary.com/dcfelth94/images/f_auto,q_auto,c_limit,w_3840/v1749516202/469555413_855819850090283_8033303084818724469_n/469555413_855819850090283_8033303084818724469_n.jpg?_i=AA';

export default function Hero() {
  const { t } = useShop();
  const ref = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.mark-l', { yPercent: 105, duration: 1.1, ease: 'power4.out', stagger: 0.07, delay: 0.15 });
      gsap.from('.mark-bar', { scaleX: 0, transformOrigin: '0% 50%', duration: 1.2, ease: 'expo.inOut', delay: 0.55 });
      gsap.from('.hero-media', { opacity: 0, scale: 0.92, duration: 1.2, ease: 'power3.out', delay: 0.3 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: 'top top', end: '+=140%', scrub: 0.7, pin: true, anticipatePin: 1 }
      });
      tl.fromTo('.hero-media', { clipPath: 'inset(12% 5% 34% 44% round 10px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power1.inOut', duration: 1 }, 0)
        .fromTo('.hero-media img', { scale: 1.35 }, { scale: 1.02, ease: 'none', duration: 1 }, 0)
        .fromTo('.hero-shade', { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.35)
        .to(ref.current, { '--hero-ink': '#deddd6', '--hero-line': 'rgba(222,221,214,.35)', '--hero-btn': '#deddd6', '--hero-btn-ink': '#23271d', duration: 0.4 }, 0.4)
        .to('.hero-scroll', { opacity: 0, y: 20, duration: 0.2 }, 0)
        .fromTo('.hero-tag', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3 }, 0.62);
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(ref.current, { '--hero-ink': '#deddd6', '--hero-line': 'rgba(222,221,214,.35)', '--hero-btn': '#deddd6', '--hero-btn-ink': '#23271d' });
      gsap.set('.hero-shade', { opacity: 1 });
      gsap.set('.hero-scroll', { opacity: 0 });
    });
  }, { scope: ref });

  return (
    <section className="hero" ref={ref} aria-labelledby="hero-mark">
      <div className="hero-media">
        <RemoteImg wrap="div" className="fill" src={HERO} alt="Vinograd Vinarije Điko u Dusini" fetchpriority="high" />
        <span className="hero-shade" />
      </div>
      <div className="hero-in">
        <p className="hero-tag">Dusina · Vrgorac · 43°10′ N</p>
        <h1 className="mark" id="hero-mark">
          <span className="sr">Điko</span>
          <span className="mark-word" aria-hidden="true">
            <span className="mark-bar" />
            {['D', 'i', 'k', 'o'].map((c, i) => <span key={i} className="mark-clip"><span className="mark-l">{c}</span></span>)}
          </span>
        </h1>
        <div className="hero-foot">
          <p>{t('hero.line')}</p>
          <Magnetic><a className="btn btn-light" href="#vina">{t('hero.cta')}</a></Magnetic>
        </div>
      </div>
      <p className="hero-scroll" aria-hidden="true">{t('hero.scroll')} <span>↓</span></p>
    </section>
  );
}
