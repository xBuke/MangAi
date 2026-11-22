/* Restoran Čerin — interaktivni efekti (GSAP + ScrollTrigger + Lenis), morska tema.
 * Stranica radi i bez ovoga (app.js); fx.js samo dodaje animacije, kartu i "Od mora do stola". */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { sceneSVG } from './scene.js';
import { school } from './school.js';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const C = window.CERIN || {};
const X = C.fx || {};
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const mm = (q) => window.matchMedia(q).matches;
const reduce = mm('(prefers-reduced-motion: reduce)');
const fine = mm('(hover: hover) and (pointer: fine)');
const small = () => window.innerWidth < 760;
const root = document.documentElement;
root.classList.add('fx');
if (reduce) root.classList.add('fx-reduce');

/* ───────── glatki scroll (samo miš; na dodiru ostaje nativni) */
let lenis = null;
if (!reduce && fine) {
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95, anchors: { offset: -84 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  /* izbornik i galerija zaključaju scroll preko body.style.overflow */
  new MutationObserver(() => (document.body.style.overflow === 'hidden' ? lenis.stop() : lenis.start()))
    .observe(document.body, { attributes: true, attributeFilter: ['style'] });
}
const scrollToEl = (el) => (lenis ? lenis.scrollTo(el, { offset: el === 0 ? 0 : -84 }) : el === 0 ? window.scrollTo({ top: 0, behavior: 'smooth' }) : el.scrollIntoView({ behavior: 'smooth' }));

/* ───────── pomoćno: riječi u maske (naslovi) */
function splitWords(el) {
  const text = el.textContent.trim();
  el.setAttribute('aria-label', text);
  el.innerHTML = text.split(/\s+/).map((w) => `<span class="w" aria-hidden="true"><span>${w}</span></span>`).join(' ');
  return $$('.w > span', el);
}

/* ───────── HERO: slova "Čerin", val ispod, paralaksa, valovi na dnu */
const hero = $('.hero');
if (hero) {
  const chars = $('.hero__chars');
  if (chars) chars.innerHTML = [...chars.textContent].map((c) => `<span class="ch"><span>${c}</span></span>`).join('');
  if (!reduce) {
    gsap.from('.hero__chars .ch > span', { yPercent: 118, rotate: 6, duration: 1.25, ease: 'expo.out', stagger: 0.075, delay: 0.1 });
    gsap.fromTo('.hero__line path', { strokeDashoffset: 420 }, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', delay: 0.55 });
    const st = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('.hero__media', { yPercent: 16, scale: 1.06, ease: 'none', scrollTrigger: st });
    gsap.to('.hero__in', { y: -90, opacity: 0.15, ease: 'none', scrollTrigger: { ...st, end: 'bottom 25%' } });
    /* slika lagano prati miš */
    if (fine) {
      /* slika i video imaju CSS animaciju (transform), pa pomak ide kroz CSS svojstvo translate */
      const m = { x: 0, y: 0 }, media = $('.hero__media');
      const set = () => media.style.setProperty('--hxy', `${m.x.toFixed(2)}px ${m.y.toFixed(2)}px`);
      hero.addEventListener('pointermove', (e) => {
        gsap.to(m, { x: (e.clientX / innerWidth - 0.5) * -24, y: (e.clientY / innerHeight - 0.5) * -16, duration: 1.2, ease: 'power3', overwrite: true, onUpdate: set });
      });
    }
  }
  new IntersectionObserver(([e]) => hero.classList.toggle('is-off', !e.isIntersecting)).observe(hero);
}

/* ───────── okno (napredak scrolla): more se diže dok skrolaš, klik = na vrh */
(function porthole() {
  const a = document.createElement('a');
  a.className = 'pp';
  a.href = '#top';
  a.setAttribute('aria-label', X.top || 'Top');
  const bolts = Array.from({ length: 6 }, (_, i) => { const r = (i / 6) * Math.PI * 2; return `<circle cx="${(30 + Math.cos(r) * 27.5).toFixed(1)}" cy="${(30 + Math.sin(r) * 27.5).toFixed(1)}" r="1.3"/>`; }).join('');
  let wave = 'M0 4';
  for (let x = 0; x < 120; x += 20) wave += ` q5 -4 10 0 t10 0`;
  a.innerHTML = `<svg viewBox="0 0 60 60" aria-hidden="true"><defs><clipPath id="pp-c"><circle cx="30" cy="30" r="23"/></clipPath></defs>
    <circle cx="30" cy="30" r="23" fill="#f6efe1"/>
    <g clip-path="url(#pp-c)"><g class="pp__water"><g class="pp__wave"><path d="${wave} V64 H0 Z" fill="#1d4c77"/></g>
      <g class="pp__fish"><path d="M-6 0c2-3 7-3 10-1l3-2-1 3 1 3-3-2c-3 2-8 2-10-1z" fill="#e7b24f" transform="translate(0 14)"/></g></g></g>
    <circle cx="30" cy="30" r="25" fill="none" stroke="#e7b24f" stroke-width="3.5"/><g fill="#a8741b">${bolts}</g>
    <path class="pp__up" d="M30 36 V24 M24.5 29.5 30 24l5.5 5.5" fill="none" stroke="#08131f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  document.body.appendChild(a);
  const water = $('.pp__water', a);
  const setY = gsap.quickSetter(water, 'y', 'px');
  setY(44);
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (s) => { setY(44 - s.progress * 40); a.classList.toggle('is-on', s.scroll() > innerHeight * 0.8); }
  });
  a.addEventListener('click', (e) => { e.preventDefault(); scrollToEl(0); });
})();

/* ───────── naslovi sekcija: riječi izranjaju */
if (!reduce) {
  $$('.story h2, .highlights h2, .menu h2, .wine h2, .gallery h2, .contact h2, .visit h2').forEach((h) => {
    const w = splitWords(h);
    gsap.from(w, { yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: h, start: 'top 88%' } });
  });
}

/* ───────── brojači (1985., 40) */
$$('.facts dt').forEach((dt) => {
  const m = dt.textContent.trim().match(/^(\d+)(\.?)$/);
  if (!m || reduce) return;
  const to = +m[1], from = to > 1000 ? to - 45 : 0, o = { v: from };
  dt.textContent = from + m[2];
  ScrollTrigger.create({
    trigger: dt, start: 'top 90%', once: true,
    onEnter: () => gsap.to(o, { v: to, duration: 1.8, ease: 'power3.out', onUpdate: () => { dt.textContent = Math.round(o.v) + m[2]; } })
  });
});

/* ───────── priča: fotografije "nekad/danas" na različitim brzinama */
if (!reduce) {
  gsap.fromTo('.ph--then', { y: 40 }, { y: -40, ease: 'none', scrollTrigger: { trigger: '.story__photos', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('.ph--now', { y: -20 }, { y: 50, ease: 'none', scrollTrigger: { trigger: '.story__photos', start: 'top bottom', end: 'bottom top', scrub: true } });
}

/* ───────── citat: riječi se pale dok skrolaš */
const quote = $('.quote p');
if (quote && !reduce) {
  const words = quote.textContent.trim().split(/\s+/);
  quote.setAttribute('aria-label', quote.textContent.trim());
  quote.innerHTML = words.map((w, i) => `<span aria-hidden="true" style="--i:${i}">${w}</span>`).join(' ');
  quote.classList.add('sw');
  ScrollTrigger.create({
    trigger: quote, start: 'top 85%', end: 'bottom 45%',
    onUpdate: (s) => quote.style.setProperty('--p', (s.progress * (words.length + 1)).toFixed(2))
  });
}

/* ───────── traka jela: brzina ovisi o brzini scrolla */
$$('.mq__row').forEach((row) => {
  const track = $('.mq__track', row);
  const dir = +row.dataset.dir || -1;
  let x = dir < 0 ? 0 : -50, vis = false, boost = 0, lastY = scrollY;
  new IntersectionObserver(([e]) => { vis = e.isIntersecting; }, { rootMargin: '60px' }).observe(row);
  gsap.ticker.add((_, dt) => {
    const dy = scrollY - lastY; lastY = scrollY;
    if (!vis || reduce) return;
    boost += (Math.min(8, Math.abs(dy) * 0.12) - boost) * 0.08;
    x += dir * (0.012 + boost * 0.02) * (dt / 16.67) * (small() ? 1.6 : 1);
    if (x <= -50) x += 50; if (x > 0) x -= 50;
    track.style.transform = `translate3d(${x}%,0,0)`;
  });
});

/* ───────── OD MORA DO STOLA */
(function seaToTable() {
  const sec = $('.st');
  if (!sec) return;
  const holder = $('[data-scene]', sec);
  holder.innerHTML = sceneSVG();
  const q = (s) => $(s, holder);
  const items = $$('.st__rail li', sec);
  const fill = $('.st__fill', sec);
  const no = $('.st__no b', sec);
  const stamp = $('.st__stamp', sec);
  const N = items.length;

  const boat = q('.s-boat'), sea = q('.s-sea'), sun = q('.s-sun'), line = q('.s-line');
  const fishO = q('.s-catch'), fishI = q('.s-catch-in');
  gsap.set(boat, { x: 64, y: 176 });
  gsap.set(fishO, { x: 112, y: 330 });
  gsap.set(fishI, { scale: 0.8, rotation: 0, transformOrigin: '50% 50%' });
  gsap.set([q('.s-grill'), q('.s-plate'), q('.s-side'), q('.s-glass'), q('.s-splash'), q('.s-table')], { opacity: 0 });
  gsap.set(q('.s-wine'), { scaleY: 0, transformOrigin: '50% 100%' });

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
  /* 1 · more */
  tl.to(boat, { x: 136, duration: 1, ease: 'sine.inOut' }, 0)
    .to(sun, { y: 24, duration: 2 }, 0)
    .to(fishO, { x: 180, y: 322, duration: 1, ease: 'sine.inOut' }, 0)
  /* 2 · ulov */
    .fromTo(line, { attr: { y2: -30 } }, { attr: { y2: 118 }, duration: 0.3, ease: 'power1.in' }, 1)
    .to(fishI, { rotation: -90, duration: 0.12 }, 1.3)
    .to(fishO, { y: 200, duration: 0.33, ease: 'power2.in' }, 1.4)
    .to(line, { attr: { y2: -4 }, duration: 0.33, ease: 'power2.in' }, 1.4)
    .to(line, { opacity: 0, duration: 0.04 }, 1.73)
    .fromTo(q('.s-splash'), { opacity: 0, scale: 0.4, transformOrigin: '50% 100%' }, { opacity: 1, scale: 1.15, duration: 0.12 }, 1.7)
    .to(q('.s-splash'), { opacity: 0, duration: 0.14 }, 1.84)
    .to(fishO, { x: 204, y: 110, duration: 0.27, ease: 'power2.out' }, 1.73)
    .to(fishI, { rotation: 200, scale: 1, duration: 0.27 }, 1.73)
  /* 3 · vatra */
    .to(sea, { y: 250, duration: 0.6, ease: 'power2.in' }, 2)
    .to(q('.s-night'), { opacity: 1, duration: 0.6 }, 2)
    .to(sun, { opacity: 0, duration: 0.4 }, 2)
    .to(q('.s-stars'), { opacity: 1, duration: 0.6 }, 2.35)
    .fromTo(q('.s-grill'), { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 2.45)
    .to(fishO, { x: 200, y: 236, duration: 0.5, ease: 'power2.inOut' }, 2.4)
    .to(fishI, { rotation: 360, scale: 1.5, duration: 0.5 }, 2.4)
    .to(q('.s-marks'), { opacity: 1, duration: 0.35 }, 2.62)
    .to(q('.s-body'), { attr: { fill: '#d49a4a' }, duration: 0.35 }, 2.62)
  /* 4 · stol */
    .to(q('.s-grill'), { opacity: 0, y: 100, duration: 0.4, ease: 'power2.in' }, 3)
    .to(q('.s-lights'), { opacity: 1, duration: 0.4 }, 3.15)
    .fromTo(q('.s-table'), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, 3.1)
    .fromTo(q('.s-plate'), { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.42, ease: 'back.out(1.5)' }, 3.2)
    .to(fishO, { x: 196, y: 254, duration: 0.4, ease: 'power2.out' }, 3.25)
    .to(fishI, { scale: 1.35, duration: 0.4 }, 3.25)
    .fromTo(q('.s-glass'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.3 }, 3.45)
    .fromTo(q('.s-side'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 }, 3.5)
    .to(q('.s-wine'), { scaleY: 1, duration: 0.4 }, 3.58)
    .to({}, { duration: 0.02 }, 3.98);

  let cur = -1;
  const setStep = (i) => {
    if (i === cur) return;
    cur = i;
    items.forEach((li, k) => { li.classList.toggle('is-on', k === i); li.classList.toggle('is-past', k < i); });
    if (no) no.textContent = String(i + 1).padStart(2, '0');
    /* ukrasne animacije scene rade samo u koraku u kojem se vide */
    sec.classList.toggle('is-sea', i <= 1); sec.classList.toggle('is-fire', i === 2); sec.classList.toggle('is-table', i === 3);
  };

  if (reduce) { tl.progress(1); sec.classList.add('is-done'); setStep(N - 1); return; }
  setStep(0);

  ScrollTrigger.create({
    trigger: sec, start: 'top top', end: 'bottom bottom',
    scrub: small() ? 0.25 : 0.8,
    animation: tl,
    onToggle: (s) => document.body.classList.toggle('st-live', s.isActive),
    onUpdate: (s) => {
      const p = s.progress;
      setStep(Math.min(N - 1, Math.floor(p * N * 0.9999)));
      fill.style.transform = `scaleY(${p.toFixed(3)})`;
      stamp.classList.toggle('is-on', p > 0.95);
      sec.classList.toggle('is-done', p > 0.95);
    }
  });
  /* klik na korak → skok na taj dio */
  items.forEach((li, i) => {
    li.addEventListener('click', () => {
      const r = sec.getBoundingClientRect();
      const y = scrollY + r.top + ((i + 0.5) / N) * (sec.offsetHeight - innerHeight);
      lenis ? lenis.scrollTo(y) : window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
  new IntersectionObserver(([e]) => sec.classList.toggle('is-live', e.isIntersecting)).observe(sec);
})();

/* ───────── preporuke: 3D nagib kartica */
if (fine && !reduce) {
  $$('.hl').forEach((card) => {
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3' });
    const ry = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3' });
    gsap.set(card, { transformPerspective: 900 });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      ry(px * 12); rx(-py * 10);
      card.style.setProperty('--mx', `${(px + 0.5) * 100}%`); card.style.setProperty('--my', `${(py + 0.5) * 100}%`);
    });
    card.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
}
if (!reduce) {
  gsap.from('.hl', { y: 60, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: '.hl__grid', start: 'top 85%' } });
}

/* ───────── jelovnik: jela ulaze jedno za drugim kad promijeniš karticu */
const tabs = $('.tabs');
if (tabs && !reduce) {
  tabs.addEventListener('click', (e) => {
    if (!e.target.closest('[role=tab]')) return;
    requestAnimationFrame(() => {
      const cat = $$('.cat').find((c) => !c.hasAttribute('data-hidden') && !c.hidden);
      if (!cat) return;
      gsap.fromTo($$('.dish, .cat__img', cat), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', stagger: 0.035, overwrite: true });
    });
  });
}

/* ───────── galerija: fotografije se otkrivaju kao zastor */
if (!reduce) {
  const lis = $$('.g__grid li');
  gsap.set(lis, { clipPath: 'inset(100% 0% 0% 0%)' });
  ScrollTrigger.batch(lis, {
    start: 'top 92%', once: true,
    onEnter: (b) => gsap.to(b, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'expo.out', stagger: 0.08 })
  });
  const more = $('.g__more');
  more && more.addEventListener('click', () => setTimeout(() => ScrollTrigger.refresh(), 60));
}

/* ───────── kontakt: jato ribica + magnetski gumbi */
const fishCanvas = $('.contact__fish');
if (fishCanvas) school(fishCanvas, { reduce });
if (!reduce) {
  gsap.from('.cc__list li', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: '.cc__list', start: 'top 88%' } });
}
if (fine && !reduce) {
  $$('.hero__cta .btn, .cc').forEach((el) => {
    const k = el.classList.contains('cc') ? 0.12 : 0.3;
    const qx = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'elastic.out(1, .5)' });
    const qy = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'elastic.out(1, .5)' });
    el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * k); qy((e.clientY - r.top - r.height / 2) * k); });
    el.addEventListener('pointerleave', () => { qx(0); qy(0); });
  });
}

/* ───────── karta (učita se tek kad se lokacija približi) */
const visit = $('.visit');
if (visit && X.map) {
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = new URL('../../css/maplibre-gl.css', import.meta.url).href;
    document.head.appendChild(css);
    import('./map.js').then((m) => m.initMap(visit, X.map, C.lang || 'hr')).catch((err) => {
      console.warn('[karta]', err);
      const box = $('.mapx__box', visit);
      box.innerHTML = `<div class="mapx__fallback"><p>${X.map.fallback}</p><a class="btn btn--gold" href="https://www.google.com/maps/dir/?api=1&destination=42.906849,16.791747" target="_blank" rel="noopener">${X.map.open}</a></div>`;
    });
  }, { rootMargin: '500px' });
  io.observe(visit);
}

/* ───────── posebni slučaj: slike učitane kasnije pomaknu raspored */
window.addEventListener('load', () => ScrollTrigger.refresh());
