/* Sitni zajednički dijelovi: naslov stranice s fotografijom, gumb "Dodaj na listu", paralaksa */
import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useShop } from '@shared/shop.jsx';
import { gsap, useGSAP } from '@shared/gsap.js';
import { Photo } from './Img.jsx';
import { href } from '../routes.js';

export const EASE = [0.2, 0.75, 0.15, 1];

export function Crumbs({ route, items }) {
  const { t } = useShop();
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <a href={href('home', route.lang)}>{t('nav.home')}</a>
      {items.map(([label, url], i) => (
        <span key={i}><span aria-hidden="true"> / </span>{url ? <a href={url}>{label}</a> : <span aria-current="page">{label}</span>}</span>
      ))}
    </nav>
  );
}

/* fotografija preko cijele širine koja se lagano pomiče sporije od stranice */
export function ParallaxPhoto({ name, alt, className = '', strength = 12, sizes = '100vw', eager, children }) {
  const wrap = useRef(null);
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const img = wrap.current.querySelector('img');
    gsap.fromTo(img, { yPercent: -strength / 2 }, {
      yPercent: strength / 2, ease: 'none',
      scrollTrigger: { trigger: wrap.current, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  }, { scope: wrap });
  return (
    <div ref={wrap} className={'plx ' + className}>
      <Photo name={name} alt={alt} sizes={sizes} eager={eager} className="plx-img" style={{ height: `${100 + strength}%`, top: `-${strength / 2}%` }} />
      {children}
    </div>
  );
}

/* zaglavlje unutarnje stranice: fotografija, mrvice, naslov */
export function PageHero({ route, photo, alt, kicker, title, lead, crumbs, pos = 'center' }) {
  const ref = useRef(null);
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo(ref.current.querySelector('.ph-img'), { scale: 1.12 }, { scale: 1, duration: 2.2, ease: 'power2.out' });
    gsap.to(ref.current.querySelector('.ph-media'), {
      yPercent: 18, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true }
    });
  }, { scope: ref });
  return (
    <section ref={ref} className="page-hero">
      <div className="ph-media">
        <Photo name={photo} alt={alt} eager className="ph-img" style={{ objectPosition: pos }} />
      </div>
      <div className="ph-shade" />
      <div className="ph-in wrap">
        <Crumbs route={route} items={crumbs} />
        {kicker && <motion.p className="enter kicker" style={{ '--d': '0s' }}>{kicker}</motion.p>}
        <motion.h1 className="enter" style={{ '--d': '0.1s' }}>{title}</motion.h1>
        {lead && <motion.p className="enter ph-lead" style={{ '--d': '0.25s' }}>{lead}</motion.p>}
      </div>
    </section>
  );
}

export function AddToList({ id, className = 'btn btn-bone', compact = false }) {
  const { add, t, cart } = useShop();
  const [flash, setFlash] = useState(false);
  const inList = !!cart[id];
  return (
    <button type="button" className={className + (flash ? ' flash' : '')} onClick={() => { add(id); setFlash(true); setTimeout(() => setFlash(false), 1100); }}
      aria-live="polite">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        {inList ? <path d="m3 8.5 3.2 3L13 4.5" /> : <path d="M8 2v12M2 8h12" />}
      </svg>
      <span>{compact ? (inList ? '+1' : t('w.add')) : (inList ? t('w.added') + ' · +1' : t('w.add'))}</span>
    </button>
  );
}

export function SectionHead({ kicker, title, children, id }) {
  return (
    <div className="sec-head">
      <div>
        {kicker && <p className="kicker">{kicker}</p>}
        <h2 id={id}>{title}</h2>
      </div>
      {children && <div className="sec-head-side">{children}</div>}
    </div>
  );
}
