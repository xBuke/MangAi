/* Restoran Čerin — sav JS stranice (bez biblioteka) */
(() => {
  'use strict';
  const C = window.CERIN || { lang: 'hr', root: '', res: {}, gallery: {}, nav: {} };
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Zaglavlje i navigacija */
  const top = $('.top');
  const nav = $('#nav');
  const burger = $('.burger');
  const onScroll = () => top.classList.toggle('is-solid', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? C.nav.close : C.nav.menuBtn);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) setMenu(false); });

  // aktivna stavka izbornika
  const links = $$('.nav ul a');
  const secs = links.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach((s) => io.observe(s));

    const rv = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); rv.unobserve(en.target); }
    }), { rootMargin: '0px 0px -10% 0px' });
    $$('.reveal').forEach((el) => rv.observe(el));
  } else $$('.reveal').forEach((el) => el.classList.add('is-in'));

  /* ── Hero video: samo na većim ekranima, brzoj vezi i bez "reduce motion" */
  const vid = $('.hero__video');
  const conn = navigator.connection || {};
  if (vid && !reduced && !conn.saveData && !/2g/.test(conn.effectiveType || '') && innerWidth >= 768) {
    const start = () => {
      vid.src = vid.dataset.src;
      vid.addEventListener('canplay', () => { vid.play().then(() => vid.classList.add('is-on')).catch(() => {}); }, { once: true });
      vid.load();
    };
    addEventListener('load', () => ('requestIdleCallback' in window ? requestIdleCallback(start, { timeout: 2500 }) : setTimeout(start, 1500)), { once: true });
  }

  /* ── Plutajući gumb "Nazovite nas" na mobitelu */
  const fab = $('.fab');
  const hero = $('.hero');
  const reserve = $('#contact');
  if (fab && 'IntersectionObserver' in window) {
    let heroVis = true, resVis = false;
    const upd = () => fab.classList.toggle('is-on', !heroVis && !resVis);
    new IntersectionObserver(([e]) => { heroVis = e.isIntersecting; upd(); }, { threshold: 0.15 }).observe(hero);
    new IntersectionObserver(([e]) => { resVis = e.isIntersecting; upd(); }).observe(reserve);
    new IntersectionObserver(([e]) => { if (e.isIntersecting) { resVis = true; upd(); } }).observe($('.foot'));
  }

  /* ── Jelovnik: kartice */
  const tabs = $$('.tabs [role=tab]');
  const select = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.toggleAttribute('data-hidden', !on);
    });
    if (focus) tab.focus();
    tab.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
    const menuTop = $('.tabs').getBoundingClientRect().top;
    if (menuTop < 0 || menuTop > 80) {
      const y = $('.cats').getBoundingClientRect().top + scrollY - 140;
      if (scrollY > y) scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
    }
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', (e) => {
      const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (d) { e.preventDefault(); select(tabs[(i + d + tabs.length) % tabs.length], true); }
      if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
      if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
    });
  });

  /* ── Galerija + lightbox */
  const grid = $('.g__grid');
  const more = $('.g__more');
  if (more) more.addEventListener('click', () => {
    const open = grid.hasAttribute('data-collapsed');
    grid.toggleAttribute('data-collapsed', !open);
    more.setAttribute('aria-expanded', String(open));
    more.textContent = open ? C.gallery.less : C.gallery.more;
    if (!open) $('#gallery').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  });

  const lb = $('#lb');
  const items = $$('.g');
  let idx = 0, lastFocus = null;
  const fig = $('.lb__fig', lb);
  const show = (i) => {
    idx = (i + items.length) % items.length;
    const b = items[idx];
    fig.innerHTML = '<img alt=""><figcaption></figcaption>';
    const im = $('img', fig);
    im.src = b.dataset.full;
    im.alt = b.getAttribute('aria-label');
    $('figcaption', fig).textContent = `${b.getAttribute('aria-label')} · ${idx + 1}/${items.length}`;
  };
  const openLb = () => { lastFocus = document.activeElement; if (lb.showModal) lb.showModal(); else lb.setAttribute('open', ''); document.body.style.overflow = 'hidden'; };
  const closeLb = () => { lb.close ? lb.close() : lb.removeAttribute('open'); };
  if (lb) {
    lb.addEventListener('close', () => { document.body.style.overflow = ''; lb.classList.remove('is-video'); fig.innerHTML = ''; lastFocus && lastFocus.focus(); });
    items.forEach((b, i) => b.addEventListener('click', () => { lb.classList.remove('is-video'); show(i); openLb(); }));
    $('.lb__prev', lb).addEventListener('click', () => show(idx - 1));
    $('.lb__next', lb).addEventListener('click', () => show(idx + 1));
    $('[data-close]', lb).addEventListener('click', closeLb);
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
    lb.addEventListener('keydown', (e) => {
      if (lb.classList.contains('is-video')) return;
      if (e.key === 'ArrowRight') show(idx + 1);
      if (e.key === 'ArrowLeft') show(idx - 1);
    });
    let sx = null;
    lb.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      if (sx === null || lb.classList.contains('is-video')) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
      sx = null;
    });
    const vb = $('[data-video]');
    if (vb) vb.addEventListener('click', () => {
      lb.classList.add('is-video');
      fig.innerHTML = `<video src="${vb.dataset.video}" controls autoplay playsinline></video>`;
      openLb();
    });
  }
})();
