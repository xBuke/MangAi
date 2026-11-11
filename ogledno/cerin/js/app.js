/* Restoran Čerin — sav JS stranice (bez biblioteka) */
(() => {
  'use strict';
  const C = window.CERIN || { lang: 'hr', root: '', res: {}, gallery: {}, nav: {} };
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const API = C.root + 'api/';
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

  /* ── Plutajući gumb "Rezerviraj" na mobitelu */
  const fab = $('.fab');
  const hero = $('.hero');
  const reserve = $('#reserve');
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

  /* ── Karta (učitava se tek na klik — brža stranica, bez Google kolačića unaprijed) */
  const map = $('.map');
  if (map) $('.map__btn', map).addEventListener('click', () => {
    map.innerHTML = `<iframe src="${map.dataset.embed}" title="Google Maps — Čerin, Prižba" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`;
  });

  /* ── Rezervacije */
  const form = $('#rf');
  if (!form) return;
  const R = C.res;
  const F = (n) => form.elements[n];
  const dayMsg = $('#rf-day');
  const errBox = $('.rf__err', form);
  const okBox = $('.rf__ok', form);
  const submitBtn = $('button[type=submit]', form);
  let settings = null;     // s poslužitelja
  let daySlots = null;     // [{time, left}]
  let offline = !!C.demo;  // demo ili API nedostupan

  const pad = (n) => String(n).padStart(2, '0');
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = new Date();
  F('date').min = iso(today);
  const maxD = new Date(); maxD.setDate(maxD.getDate() + 365); F('date').max = iso(maxD);

  const defaultSlots = () => { const s = []; for (let m = 18 * 60; m <= 22 * 60 + 30; m += 30) s.push({ time: `${pad(m / 60 | 0)}:${pad(m % 60)}`, left: 99 }); return s; };

  const fmtDate = (s) => {
    const [y, m, d] = s.split('-').map(Number);
    try { return new Intl.DateTimeFormat(C.lang === 'hr' ? 'hr-HR' : C.lang, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(y, m - 1, d)); }
    catch { return s; }
  };

  const setDayMsg = (txt) => { dayMsg.hidden = !txt; dayMsg.textContent = txt || ''; };

  const fillGuests = (max) => {
    const sel = F('guests');
    const cur = Number(sel.value) || 2;
    sel.innerHTML = '';
    for (let i = 1; i <= max; i++) sel.add(new Option(`${i} ${i === 1 ? R.person : R.people}`, i, false, i === Math.min(cur, max)));
  };

  const renderTimes = () => {
    const sel = F('time');
    const prev = sel.value;
    const g = Number(F('guests').value) || 1;
    sel.innerHTML = '';
    if (!F('date').value || !daySlots) { sel.add(new Option(R.pickDate, '')); sel.disabled = true; return; }
    const now = new Date();
    const isToday = F('date').value === iso(now);
    const minLead = (settings && settings.minLeadMinutes) || 0;
    let any = false;
    sel.add(new Option('—', ''));
    daySlots.forEach((s) => {
      const [h, m] = s.time.split(':').map(Number);
      const past = isToday && h * 60 + m < now.getHours() * 60 + now.getMinutes() + minLead;
      const full = s.left < g;
      const o = new Option(full ? `${s.time} — ${R.full}` : s.time, s.time);
      o.disabled = past || full;
      if (past) o.hidden = true;
      if (!o.disabled) any = true;
      sel.add(o);
    });
    sel.disabled = !any;
    if (prev && [...sel.options].some((o) => o.value === prev && !o.disabled)) sel.value = prev;
    if (!any) setDayMsg(R.noSlots);
  };

  const loadDay = async () => {
    const date = F('date').value;
    setDayMsg('');
    daySlots = null;
    renderTimes();
    if (!date) return;
    if (offline) { daySlots = defaultSlots(); renderTimes(); return; }
    try {
      const r = await fetch(`${API}availability?date=${date}`, { headers: { Accept: 'application/json' } });
      if (!r.ok) throw 0;
      const j = await r.json();
      if (!j.open) { setDayMsg(j.reason === 'off' ? R.off : R.closed); daySlots = []; renderTimes(); return; }
      daySlots = j.slots;
      renderTimes();
    } catch { daySlots = defaultSlots(); renderTimes(); }
  };

  (async () => {
    if (C.demo) { fillGuests(10); return; }
    try {
      const r = await fetch(`${API}availability`, { headers: { Accept: 'application/json' } });
      if (!r.ok) throw 0;
      settings = await r.json();
      fillGuests(settings.maxParty || 10);
      if (settings.online === false) {
        setDayMsg(R.off);
        $$('input, select, textarea, button[type=submit]', form).forEach((el) => { el.disabled = true; });
      }
      if (settings.maxDate) F('date').max = settings.maxDate;
    } catch { /* API nije dostupan: forma i dalje radi s osnovnim terminima, a greška se prikaže pri slanju */ }
  })();

  F('date').addEventListener('change', loadDay);
  F('guests').addEventListener('change', () => {
    renderTimes();
    const max = Number(F('guests').options[F('guests').options.length - 1]?.value || 10);
    if (Number(F('guests').value) === max) setDayMsg(R.large.replace('{n}', max));
    else if (dayMsg.textContent.includes(String(max))) setDayMsg('');
  });

  const fieldErr = (name, msg) => {
    const el = F(name);
    const wrap = el.closest('.f, .chk');
    if (!wrap) return;
    wrap.classList.toggle('is-bad', !!msg);
    let e = $('.err', wrap);
    if (msg && !e && wrap.classList.contains('f')) { e = document.createElement('small'); e.className = 'err'; wrap.append(e); }
    if (e) e.textContent = msg || '';
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
  };
  $$('input, select, textarea', form).forEach((el) => el.addEventListener('input', () => fieldErr(el.name, '')));

  const validate = () => {
    const bad = [];
    ['date', 'time', 'name', 'phone', 'email'].forEach((n) => { if (!String(F(n).value).trim()) bad.push([n, R.req]); });
    const em = F('email').value.trim();
    if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) bad.push(['email', R.badEmail]);
    const ph = F('phone').value.replace(/[\s()./-]/g, '');
    if (ph && !/^\+?\d{7,15}$/.test(ph)) bad.push(['phone', R.badPhone]);
    if (!F('consent').checked) bad.push(['consent', R.req]);
    ['date', 'time', 'name', 'phone', 'email', 'consent'].forEach((n) => fieldErr(n, ''));
    bad.forEach(([n, m]) => fieldErr(n, m));
    if (bad.length) F(bad[0][0]).focus();
    return !bad.length;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errBox.hidden = true;
    if (!validate()) return;
    const data = Object.fromEntries(new FormData(form));
    data.guests = Number(data.guests);
    data.consent = !!F('consent').checked;
    data.lang = C.lang;
    submitBtn.disabled = true;
    const label = submitBtn.textContent;
    submitBtn.textContent = R.sending;
    try {
      let code;
      if (C.demo) {
        await new Promise((r) => setTimeout(r, 700));
        code = 'DEMO' + Math.random().toString(36).slice(2, 5).toUpperCase();
      } else {
        const r = await fetch(`${API}reservations`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
        const j = await r.json().catch(() => ({}));
        if (!r.ok || !j.ok) {
          if (j.field) { fieldErr(j.field, j.message || R.req); F(j.field)?.focus(); }
          if (j.reason === 'full') { await loadDay(); }
          throw new Error(j.message || R.err);
        }
        code = j.code;
      }
      $('.rf__code', okBox).textContent = code;
      $('.rf__sum', okBox).textContent = `${fmtDate(data.date)} · ${data.time} · ${data.guests} ${data.guests === 1 ? R.person : R.people}`;
      okBox.hidden = false;
      okBox.focus();
    } catch (err) {
      errBox.textContent = err && err.message && err.message !== '0' ? err.message : R.err;
      errBox.hidden = false;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = label;
    }
  });

  $('.rf__again', okBox).addEventListener('click', () => {
    okBox.hidden = true;
    F('date').value = ''; F('note').value = ''; F('consent').checked = false;
    daySlots = null; renderTimes(); setDayMsg('');
    F('date').focus();
  });
})();
