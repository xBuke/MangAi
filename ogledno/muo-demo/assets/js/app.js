// MUO – ogledni prijedlog portala. Vanilla JS (prenosivo u WordPress temu), GSAP + Lenis.
import { EVENTS, EXHIBITIONS, WALL, HOURS, EVENT_TYPES } from './data.js';
import { objectSvg } from './objects.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const root = document.documentElement;
const BODY = document.body;
const BASE = BODY.dataset.base || '/';
const PAGE = BODY.dataset.page;
const LANG = BODY.dataset.lang || 'hr';
const G = window.gsap;
if (!G) root.classList.remove('motion');
const motion = () => root.classList.contains('motion') && !!G;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

if (G) {
  const plugins = [window.ScrollTrigger, window.Flip, window.SplitText, window.Draggable, window.InertiaPlugin].filter(Boolean);
  G.registerPlugin(...plugins);
}
const ST = window.ScrollTrigger;

/* ---------------- Pomoćne ---------------- */
const norm = (s) => (s || '').toString().toLowerCase().replace(/đ/g, 'd').normalize('NFD').replace(/[̀-ͯ]/g, '');
const pad = (n) => String(n).padStart(2, '0');
const MONTHS = ['sij', 'velj', 'ožu', 'tra', 'svi', 'lip', 'srp', 'kol', 'ruj', 'lis', 'stu', 'pro'];
const MONTHS_FULL = ['siječanj', 'veljača', 'ožujak', 'travanj', 'svibanj', 'lipanj', 'srpanj', 'kolovoz', 'rujan', 'listopad', 'studeni', 'prosinac'];
const DAYS = ['nedjelja', 'ponedjeljak', 'utorak', 'srijeda', 'četvrtak', 'petak', 'subota'];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const HEART = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 20s-7-4.4-9.2-9A5 5 0 0 1 12 6a5 5 0 0 1 9.2 5c-2.2 4.6-9.2 9-9.2 9z"/></svg>';
const CAL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 10h18M8 3v4M16 3v4M12 13v5M9.5 15.5h5"/></svg>';
const TYPE_COLOR = { Izložba: '#1F4E4A', Radionica: '#D9A441', Vodstvo: '#2E3E9E', Predavanje: '#3B2A20', Promocija: '#9C6B3C', Koncert: '#C2452D' };
const TYPE_MOTIF = { Izložba: 'plakat', Radionica: 'tkanina', Vodstvo: 'vaza', Predavanje: 'kutija', Promocija: 'kutija', Koncert: 'violina' };

function toast(msg) {
  let t = $('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    t.setAttribute('role', 'status');
    Object.assign(t.style, { position: 'fixed', left: '50%', bottom: '1.5rem', transform: 'translateX(-50%) translateY(150%)', background: '#111', color: '#fff', padding: '.8rem 1.2rem', borderRadius: '999px', zIndex: 300, fontWeight: 600, fontSize: '.9375rem', transition: 'transform .5s cubic-bezier(.22,1,.36,1)', maxWidth: 'calc(100% - 2rem)', textAlign: 'center' });
    document.body.appendChild(t);
  }
  t.textContent = msg;
  requestAnimationFrame(() => { t.style.transform = 'translateX(-50%) translateY(0)'; });
  clearTimeout(t._h);
  t._h = setTimeout(() => { t.style.transform = 'translateX(-50%) translateY(150%)'; }, 2800);
}

// Datumi događanja relativno na danas (ogledni podaci)
const today = new Date(); today.setHours(0, 0, 0, 0);
const events = EVENTS.map((e) => {
  const d = new Date(today); d.setDate(d.getDate() + e.day);
  const [h, m] = e.time.split(':').map(Number);
  const start = new Date(d); start.setHours(h, m, 0, 0);
  const end = new Date(start.getTime() + e.dur * 60000);
  return { ...e, date: d, start, end, past: end < new Date() };
}).sort((a, b) => a.start - b.start);

/* ---------------- Status „otvoreno danas” ---------------- */
function zagrebNow() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Zagreb', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t)?.value;
  const dow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { dow, mins: Number(get('hour')) * 60 + Number(get('minute')) };
}
function initStatus() {
  const { dow, mins } = zagrebNow();
  const toM = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
  const h = HOURS[dow];
  let open = false; let text;
  const en = LANG === 'en';
  if (h && mins >= toM(h[0]) && mins < toM(h[1])) { open = true; text = en ? `open today until ${h[1]}` : `otvoreno danas do ${h[1]}`; }
  else {
    let nd = dow; let label = '';
    for (let i = 0; i < 8; i++) {
      const cand = (dow + i) % 7; const hh = HOURS[cand];
      if (hh && (i > 0 || mins < toM(hh[0]))) { nd = cand; label = i === 0 ? (en ? 'today' : 'danas') : i === 1 ? (en ? 'tomorrow' : 'sutra') : (en ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][cand] : DAYS[cand]); break; }
    }
    text = en ? `closed · opens ${label} at ${HOURS[nd][0]}` : `zatvoreno · otvara ${label} u ${HOURS[nd][0]}`;
  }
  $$('[data-status-text]').forEach((el) => { el.textContent = text; });
  $$('[data-status-dot]').forEach((el) => el.classList.toggle('closed', !open));
  $$('[data-hours] tr').forEach((tr) => tr.classList.toggle('today', Number(tr.dataset.dow) === dow));
}

/* ---------------- Ploče (izbornik, pretraga, Moja zbirka…) ---------------- */
let lenis = null;
let lastFocus = null;
const backdrop = $('[data-backdrop]');
function openPanel(name) {
  const p = $(`[data-panel="${name}"]`);
  if (!p) return;
  closePanels(false);
  lastFocus = document.activeElement;
  p.classList.add(name === 'menu' ? 'is-open' : 'open');
  p.setAttribute('aria-hidden', 'false');
  if (name !== 'menu' && name !== 'search') backdrop.classList.add('open');
  if (name === 'search') backdrop.classList.add('open');
  $$(`[data-open="${name}"]`).forEach((b) => b.setAttribute('aria-expanded', 'true'));
  lenis?.stop();
  if (name === 'saved') renderSaved();
  if (name === 'menu' && motion()) G.from($$('nav a', p), { yPercent: 100, opacity: 0, stagger: 0.06, duration: 0.8, ease: 'expo.out', delay: 0.25 });
  setTimeout(() => { (p.querySelector('input, button, a') || p).focus(); }, 60);
}
function closePanels(restore = true) {
  $$('[data-panel]').forEach((p) => { p.classList.remove('open', 'is-open'); p.setAttribute('aria-hidden', 'true'); });
  backdrop?.classList.remove('open');
  $$('[data-open]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
  lenis?.start();
  if (restore && lastFocus) lastFocus.focus?.();
}
document.addEventListener('click', (e) => {
  const o = e.target.closest('[data-open]');
  if (o) { e.preventDefault(); const n = o.dataset.open; if (n === 'cookies') showCookie(true); else openPanel(n); return; }
  if (e.target.closest('[data-close]') || e.target === backdrop) closePanels();
  if (e.target.closest('.search') && !e.target.closest('.search-box')) closePanels();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePanels();
  if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName))) { e.preventDefault(); openPanel('search'); }
});
$$('.mobile-menu nav a').forEach((a) => a.addEventListener('click', () => closePanels(false)));

/* ---------------- Pristupačnost ---------------- */
function initA11y() {
  let s = {}; try { s = JSON.parse(localStorage.getItem('muo-a11y') || '{}'); } catch (e) { /* */ }
  const cls = { motion: 'reduce-motion', text: 'a11y-text', contrast: 'a11y-contrast', links: 'a11y-links' };
  $$('[data-a11y]').forEach((b) => {
    const k = b.dataset.a11y;
    b.setAttribute('aria-checked', s[k] ? 'true' : 'false');
    b.addEventListener('click', () => {
      s[k] = !s[k];
      b.setAttribute('aria-checked', s[k] ? 'true' : 'false');
      root.classList.toggle(cls[k], s[k]);
      try { localStorage.setItem('muo-a11y', JSON.stringify(s)); } catch (e) { /* */ }
      if (k === 'motion') { toast(s[k] ? 'Animacije su smanjene.' : 'Animacije su uključene – osvježavam stranicu.'); if (!s[k]) setTimeout(() => location.reload(), 900); else { root.classList.remove('motion'); lenis?.destroy(); lenis = null; G && G.globalTimeline.clear(); ST && ST.getAll().forEach((t) => t.kill(true)); $$('[data-reveal],[data-clip]').forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; }); } }
    });
  });
}

/* ---------------- Kolačići ---------------- */
const consent = () => { try { return localStorage.getItem('muo-consent'); } catch (e) { return null; } };
function showCookie(force) { const c = $('[data-cookie]'); if (!c) return; if (force || !consent()) setTimeout(() => c.classList.add('show'), force ? 0 : 1800); }
function initCookies() {
  showCookie(false);
  $$('[data-consent]').forEach((b) => b.addEventListener('click', () => {
    try { localStorage.setItem('muo-consent', b.dataset.consent); } catch (e) { /* */ }
    $('[data-cookie]').classList.remove('show');
    toast(b.dataset.consent === 'all' ? 'Hvala! Privola je spremljena.' : 'Koristimo samo nužne kolačiće.');
  }));
}

/* ---------------- Moja zbirka ---------------- */
const getSaved = () => { try { return JSON.parse(localStorage.getItem('muo-saved') || '[]'); } catch (e) { return []; } };
const setSaved = (a) => { try { localStorage.setItem('muo-saved', JSON.stringify(a)); } catch (e) { /* */ } };
function syncSaved(bump) {
  const s = getSaved(); const ids = new Set(s.map((x) => x.id));
  $$('[data-save]').forEach((b) => { try { b.setAttribute('aria-pressed', ids.has(JSON.parse(b.dataset.save).id) ? 'true' : 'false'); } catch (e) { /* */ } });
  $$('[data-save-count]').forEach((c) => {
    c.textContent = s.length; c.classList.toggle('has', s.length > 0);
    if (bump && motion()) G.fromTo(c, { scale: 1.8 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, .4)' });
  });
}
function renderSaved() {
  const ul = $('[data-saved-list]'); if (!ul) return;
  const s = getSaved();
  ul.innerHTML = s.length ? s.map((x) => `<li><a class="thumb" href="${esc(x.url)}" style="background:${esc(x.color)}" aria-hidden="true" tabindex="-1">${objectSvg(x.motif, x.color === '#D9A441' || x.color === '#F2E6D0' ? '#111' : '#fff')}</a><a href="${esc(x.url)}" style="font-weight:600;text-decoration:none">${esc(x.title)}</a><button class="icon-btn" type="button" data-unsave="${esc(x.id)}" aria-label="Ukloni ${esc(x.title)}">✕</button></li>`).join('')
    : '<li class="empty" style="display:block"><strong>Još ništa spremljeno.</strong>Dodirnite srce na izložbi, događanju ili predmetu.</li>';
  if (motion()) G.from($$('li', ul), { x: 30, opacity: 0, stagger: 0.05, duration: 0.6, ease: 'expo.out' });
}
function initSaved() {
  // Uvoz podijeljene zbirke ?moja=…
  const p = new URLSearchParams(location.search).get('moja');
  if (p) {
    try {
      const incoming = JSON.parse(decodeURIComponent(escape(atob(p))));
      const cur = getSaved(); const ids = new Set(cur.map((x) => x.id));
      incoming.forEach((x) => { if (!ids.has(x.id)) cur.push(x); });
      setSaved(cur); toast(`Uvezeno ${incoming.length} spremljenih stavki.`);
    } catch (e) { /* */ }
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-save]');
    if (b) {
      e.preventDefault(); e.stopPropagation();
      const item = JSON.parse(b.dataset.save); let s = getSaved();
      const has = s.some((x) => x.id === item.id);
      s = has ? s.filter((x) => x.id !== item.id) : [...s, item];
      setSaved(s); syncSaved(!has);
      toast(has ? 'Uklonjeno iz Moje zbirke.' : 'Spremljeno u Moju zbirku ♥');
      if (!has && motion()) G.fromTo(b, { scale: 0.8 }, { scale: 1, duration: 0.7, ease: 'elastic.out(1, .35)' });
      return;
    }
    const u = e.target.closest('[data-unsave]');
    if (u) { setSaved(getSaved().filter((x) => x.id !== u.dataset.unsave)); syncSaved(); renderSaved(); }
  });
  $('[data-clear-saved]')?.addEventListener('click', () => { setSaved([]); syncSaved(); renderSaved(); });
  $('[data-share-saved]')?.addEventListener('click', async () => {
    const s = getSaved(); if (!s.length) { toast('Moja zbirka je prazna.'); return; }
    const url = `${location.origin}${BASE}?moja=${btoa(unescape(encodeURIComponent(JSON.stringify(s))))}`;
    try { await navigator.clipboard.writeText(url); toast('Poveznica kopirana – pošaljite je prijateljima.'); } catch (e) { prompt('Kopirajte poveznicu:', url); }
  });
  syncSaved();
}

/* ---------------- Dijeljenje, obrasci ---------------- */
function initShare() {
  $$('[data-share]').forEach((b) => b.addEventListener('click', async () => {
    const data = { title: document.title, url: location.href };
    if (navigator.share) { try { await navigator.share(data); } catch (e) { /* */ } }
    else { try { await navigator.clipboard.writeText(location.href); toast('Poveznica kopirana.'); } catch (e) { /* */ } }
  }));
}
function initForms() {
  const nl = $('[data-newsletter]');
  nl?.addEventListener('submit', (e) => {
    e.preventDefault();
    const em = nl.email.value.trim(); const msg = $('[data-nl-msg]');
    if (nl.website.value) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) { msg.style.color = '#FFB4A8'; msg.textContent = 'Upišite ispravnu e-mail adresu.'; nl.email.focus(); return; }
    msg.style.color = '#B7F0CF'; msg.textContent = `Gotovo! Na ${em} poslali smo poveznicu za potvrdu prijave (double opt-in).`; nl.reset();
  });
  const gf = $('[data-group-form]');
  gf?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (gf.website.value) return;
    const errs = {};
    if (!gf.name.value.trim()) errs.name = 'Upišite ime i prezime.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(gf.email.value.trim())) errs.email = 'Upišite ispravnu e-mail adresu.';
    if (!gf.date.value) errs.date = 'Odaberite datum.';
    else if (new Date(gf.date.value) < today) errs.date = 'Datum ne može biti u prošlosti.';
    if (!gf.gdpr.checked) errs.gdpr = 'Potrebna je privola za obradu podataka.';
    $$('[data-err]', gf).forEach((s) => { s.textContent = errs[s.dataset.err] || ''; });
    $$('input, select, textarea', gf).forEach((i) => i.setAttribute('aria-invalid', errs[i.name] ? 'true' : 'false'));
    const first = Object.keys(errs)[0];
    if (first) { gf[first].focus(); return; }
    $('[data-form-ok]', gf).innerHTML = `<div class="ok-box"><strong>Najava je zaprimljena.</strong> Potvrdu i detalje poslat ćemo na ${esc(gf.email.value)}. (Demo – u produkciji obrazac šalje e-mail Muzeju i sprema upit u CMS.)</div>`;
    gf.reset();
  });
}

/* ---------------- Pretraga ---------------- */
function initSearch() {
  const input = $('[data-search-input]'); const out = $('[data-search-results]');
  if (!input) return;
  const idx = (window.MUO_INDEX || []).map((x) => ({ ...x, n: norm(x.title + ' ' + (x.extra || '') + ' ' + x.type) }));
  let active = -1;
  const hl = (title, q) => {
    const nt = norm(title); const i = nt.indexOf(q);
    if (i < 0 || !q) return esc(title);
    return esc(title.slice(0, i)) + '<mark>' + esc(title.slice(i, i + q.length)) + '</mark>' + esc(title.slice(i + q.length));
  };
  input.addEventListener('input', () => {
    const q = norm(input.value.trim()); active = -1;
    if (!q) { out.innerHTML = '<p class="search-hint">Upišite pojam. Pretraga radi i bez dijakritičkih znakova – „casa” pronalazi „čaša”.</p>'; return; }
    const words = q.split(/\s+/);
    const hits = idx.filter((x) => words.every((w) => x.n.includes(w))).slice(0, 24);
    if (!hits.length) { out.innerHTML = `<p class="search-hint"><strong>Nema rezultata za „${esc(input.value)}”.</strong><br>Pokušajte s općenitijim pojmom, npr. „radionica”, „staklo” ili „posjet”.</p>`; return; }
    const groups = {};
    hits.forEach((h) => { (groups[h.type] = groups[h.type] || []).push(h); });
    out.innerHTML = Object.entries(groups).map(([type, list]) => `<div class="search-group"><h3>${esc(type)} · ${list.length}</h3>${list.map((h) => `<a href="${h.url ? BASE + h.url : '#'}"><span>${hl(h.title, words[0])}</span><span class="muted" aria-hidden="true">→</span></a>`).join('')}</div>`).join('');
    if (motion()) G.from($$('.search-group a', out), { y: 8, opacity: 0, stagger: 0.02, duration: 0.3 });
  });
  input.addEventListener('keydown', (e) => {
    const links = $$('a', out); if (!links.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); active = (active + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
      links.forEach((l, i) => l.classList.toggle('active', i === active)); links[active].scrollIntoView({ block: 'nearest' });
    }
    if (e.key === 'Enter' && links[Math.max(active, 0)]) { location.href = links[Math.max(active, 0)].href; }
  });
}

/* ---------------- Zaglavlje ---------------- */
function initHeader() {
  const h = $('[data-header]'); let last = 0;
  const onScroll = () => {
    const y = window.scrollY;
    h.classList.toggle('is-scrolled', y > 10);
    h.classList.toggle('is-hidden', y > 300 && y > last && !$('.mobile-menu.is-open'));
    last = y;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
}

/* ---------------- Kartica događanja ---------------- */
function icsFor(e) {
  const f = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//MUO//Ogledni prijedlog//HR', 'BEGIN:VEVENT', `UID:${e.id}@muo-demo`, `DTSTAMP:${f(new Date())}`, `DTSTART;TZID=Europe/Zagreb:${f(e.start)}`, `DTEND;TZID=Europe/Zagreb:${f(e.end)}`, `SUMMARY:${e.title}`, `LOCATION:${e.place}`, 'DESCRIPTION:Muzej za umjetnost i obrt', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
}
function downloadIcs(id) {
  const e = events.find((x) => x.id === id); if (!e) return;
  const blob = new Blob([icsFor(e)], { type: 'text/calendar;charset=utf-8' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `muo-${id}.ics`; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  toast('Događanje je dodano – otvorite .ics datoteku u kalendaru.');
}
function gcal(e) {
  const f = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(e.title)}&dates=${f(e.start)}/${f(e.end)}&location=${encodeURIComponent(e.place)}&details=${encodeURIComponent('Muzej za umjetnost i obrt')}`;
}
document.addEventListener('click', (e) => { const b = e.target.closest('[data-ics]'); if (b) { e.preventDefault(); downloadIcs(b.dataset.ics); } });

const rowHtml = (e) => `<li class="ev-row" data-flip-id="${e.id}"><div class="ev-date"><b>${pad(e.date.getDate())}</b><small>${MONTHS[e.date.getMonth()]} · ${e.time}</small></div><div class="ev-type">${esc(e.type)}</div><a class="ev-title" href="${e.exhibition ? BASE + 'izlozbe/' + e.exhibition + '/' : BASE + 'izlozbe-i-dogadanja/'}">${esc(e.title)}</a><div class="ev-place">${esc(e.place)}</div><button class="icon-btn" type="button" data-ics="${e.id}" aria-label="Dodaj u kalendar: ${esc(e.title)}">${CAL}</button></li>`;
const cardHtml = (e) => {
  const c = TYPE_COLOR[e.type] || '#111'; const ink = c === '#D9A441' ? '#111' : '#fff';
  const save = esc(JSON.stringify({ id: 'e-' + e.id, title: e.title, url: BASE + 'izlozbe-i-dogadanja/', motif: TYPE_MOTIF[e.type], color: c }));
  return `<article class="ev-card" data-flip-id="${e.id}"><div class="card-media" style="--c:${c}"><span class="art">${objectSvg(TYPE_MOTIF[e.type], ink)}</span><span class="datebox"><b>${pad(e.date.getDate())}</b><small>${MONTHS[e.date.getMonth()]}</small></span><button class="save-btn" type="button" aria-pressed="false" data-save="${save}" aria-label="Spremi: ${esc(e.title)}">${HEART}</button></div><div class="ev-type">${esc(e.type)} · ${DAYS[e.date.getDay()]} ${e.time}</div><h3 class="h3" style="font-size:1.4rem">${esc(e.title)}</h3><p class="card-meta">${esc(e.place)}</p><div class="ev-tags"><span>${esc(e.audience)}</span><span>${esc(e.price)}</span></div><div class="ev-actions">${e.past ? '' : `<button type="button" data-ics="${e.id}">${CAL.replace('<svg', '<svg width="16" height="16"')} iCal</button><a href="${gcal(e)}" target="_blank" rel="noopener">Google kalendar</a>`}${e.exhibition ? `<a href="${BASE}izlozbe/${e.exhibition}/">Izložba →</a>` : ''}</div></article>`;
};

/* ---------------- Naslovnica: izvadak kalendara ---------------- */
function initHomeEvents() {
  const ul = $('[data-home-events]'); if (!ul) return;
  let type = '';
  const render = (animate) => {
    const list = events.filter((e) => !e.past && (!type || e.type === type)).slice(0, 5);
    const state = animate && motion() && window.Flip ? Flip.getState($$('.ev-row', ul)) : null;
    ul.innerHTML = list.length ? list.map(rowHtml).join('') : '<li class="empty" style="display:block;margin-top:1rem"><strong>Nema nadolazećih događanja ove vrste.</strong>Pogledajte cijeli kalendar.</li>';
    if (state) Flip.from(state, { targets: $$('.ev-row', ul), duration: 0.6, ease: 'expo.out', absolute: true, onEnter: (els) => G.fromTo(els, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 }), onLeave: (els) => G.to(els, { opacity: 0, duration: 0.25 }) });
  };
  $$('[data-home-chips] .chip').forEach((c) => c.addEventListener('click', () => {
    $$('[data-home-chips] .chip').forEach((x) => x.setAttribute('aria-pressed', x === c ? 'true' : 'false'));
    type = c.dataset.type; render(true); syncSaved();
  }));
  render(false);
}

/* ---------------- Stranica Izložbe i događanja ---------------- */
function initEventsPage() {
  const wrap = $('[data-ev-cards]'); if (!wrap) return;
  const list = $('[data-ev-list]'); const monthEl = $('[data-month]'); const empty = $('[data-empty]'); const count = $('[data-results-count]');
  const qs = new URLSearchParams(location.search);
  const st = { type: qs.get('tip') || '', loc: '', aud: '', q: qs.get('q') || '', per: '', tab: 'list', view: 'grid', day: null, month: new Date(today.getFullYear(), today.getMonth(), 1) };
  if (st.type) $$('[data-f-type]').forEach((c) => c.setAttribute('aria-pressed', c.dataset.fType === st.type ? 'true' : 'false'));
  if (st.q) $('[data-f-q]').value = st.q;
  const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const filtered = () => events.filter((e) => {
    if (st.tab === 'arch' ? !e.past : e.past) return false;
    if (st.type && e.type !== st.type) return false;
    if (st.loc && e.loc !== st.loc) return false;
    if (st.aud && e.audience !== st.aud) return false;
    if (st.q && !norm(e.title + ' ' + e.type + ' ' + e.audience + ' ' + e.place).includes(norm(st.q))) return false;
    if (st.per && st.tab !== 'arch') {
      const diff = (e.date - today) / 86400000;
      if (st.per === '7' && diff > 7) return false;
      if (st.per === '30' && diff > 30) return false;
      if (st.per === 'vikend') { const dow = today.getDay(); const toSat = (6 - dow + 7) % 7; const sat = new Date(today); sat.setDate(sat.getDate() + toSat); const sun = new Date(sat); sun.setDate(sun.getDate() + 1); if (!(sameDay(e.date, sat) || sameDay(e.date, sun))) return false; }
    }
    if (st.tab === 'cal' && st.day && !sameDay(e.date, st.day)) return false;
    return true;
  });

  const renderMonth = () => {
    const m = st.month; const first = new Date(m); const startDow = (first.getDay() + 6) % 7;
    const days = []; const start = new Date(first); start.setDate(1 - startDow);
    for (let i = 0; i < 42; i++) { const d = new Date(start); d.setDate(start.getDate() + i); days.push(d); }
    const evs = events.filter((e) => !e.past);
    monthEl.innerHTML = `<div class="month-head"><button class="icon-btn" type="button" data-m="-1" aria-label="Prethodni mjesec"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button><h3 aria-live="polite">${MONTHS_FULL[m.getMonth()]} ${m.getFullYear()}.</h3><button class="icon-btn" type="button" data-m="1" aria-label="Sljedeći mjesec"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button></div>
      <div class="month" role="grid" aria-label="Kalendar događanja">${['pon', 'uto', 'sri', 'čet', 'pet', 'sub', 'ned'].map((d) => `<div class="dow" role="columnheader">${d}</div>`).join('')}
      ${days.map((d) => { const de = evs.filter((e) => sameDay(e.date, d)); const cls = ['day', d.getMonth() !== m.getMonth() ? 'out' : '', sameDay(d, today) ? 'today' : '', de.length ? 'has' : '', st.day && sameDay(d, st.day) ? 'sel' : ''].join(' '); return `<button type="button" class="${cls}" ${de.length ? '' : 'disabled'} data-day="${d.toISOString()}" aria-label="${d.getDate()}. ${MONTHS_FULL[d.getMonth()]}${de.length ? ', ' + de.length + ' događanja' : ''}"><span class="n">${d.getDate()}</span>${de.slice(0, 2).map((e) => `<span class="dot" style="border-left:3px solid ${TYPE_COLOR[e.type]}">${e.time} ${esc(e.title)}</span>`).join('')}</button>`; }).join('')}</div>
      <p class="muted" style="margin-top:1rem">${st.day ? `Prikazujem ${st.day.getDate()}. ${MONTHS_FULL[st.day.getMonth()]} · <button type="button" data-day-clear style="background:none;border:0;text-decoration:underline;padding:0">prikaži sve</button>` : 'Odaberite dan za prikaz događanja.'}</p>`;
    if (motion()) G.from($$('.day', monthEl), { opacity: 0, y: 10, stagger: { each: 0.008, from: 'start' }, duration: 0.4, ease: 'power2.out' });
  };

  const render = (animate = true) => {
    const res = filtered();
    const n = res.length;
    count.textContent = `${n} ${n === 1 ? 'događanje' : n > 1 && n < 5 ? 'događanja' : 'događanja'}${st.tab === 'arch' ? ' u arhivi' : ''}`;
    const targetsSel = st.view === 'grid' ? '.ev-card' : '.ev-row';
    const state = animate && motion() && window.Flip ? Flip.getState($$(targetsSel, st.view === 'grid' ? wrap : list)) : null;
    wrap.hidden = st.view !== 'grid'; list.hidden = st.view !== 'list';
    if (st.view === 'grid') wrap.innerHTML = res.map(cardHtml).join(''); else list.innerHTML = res.map(rowHtml).join('');
    empty.hidden = n > 0;
    monthEl.hidden = st.tab !== 'cal';
    if (st.tab === 'cal') renderMonth();
    syncSaved();
    if (state) {
      Flip.from(state, { targets: $$(targetsSel, st.view === 'grid' ? wrap : list), duration: 0.7, ease: 'expo.out', absolute: true, stagger: 0.02, onEnter: (els) => G.fromTo(els, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.04, ease: 'expo.out' }), onLeave: (els) => G.to(els, { opacity: 0, scale: 0.9, duration: 0.3 }) });
    }
    // Izložbe prema kartici
    const exBlock = $('[data-ex-block]');
    exBlock.hidden = st.tab === 'cal';
    $$('[data-ex-cards] .card').forEach((c) => { c.hidden = st.tab === 'arch' ? c.dataset.exStatus !== 'archive' : c.dataset.exStatus === 'archive'; });
    const url = new URL(location.href); st.type ? url.searchParams.set('tip', st.type) : url.searchParams.delete('tip'); st.q ? url.searchParams.set('q', st.q) : url.searchParams.delete('q');
    history.replaceState(null, '', url);
  };

  $$('[data-f-type]').forEach((c) => c.addEventListener('click', () => { $$('[data-f-type]').forEach((x) => x.setAttribute('aria-pressed', x === c ? 'true' : 'false')); st.type = c.dataset.fType; render(); }));
  $$('[data-f-per]').forEach((c) => c.addEventListener('click', () => { $$('[data-f-per]').forEach((x) => x.setAttribute('aria-pressed', x === c ? 'true' : 'false')); st.per = c.dataset.fPer; render(); }));
  $('[data-f-loc]').addEventListener('change', (e) => { st.loc = e.target.value; render(); });
  $('[data-f-aud]').addEventListener('change', (e) => { st.aud = e.target.value; render(); });
  let qt; $('[data-f-q]').addEventListener('input', (e) => { clearTimeout(qt); qt = setTimeout(() => { st.q = e.target.value.trim(); render(); }, 180); });
  $$('[data-view]').forEach((b) => b.addEventListener('click', () => { $$('[data-view]').forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false')); st.view = b.dataset.view; render(false); }));
  $('[data-reset]').addEventListener('click', () => {
    Object.assign(st, { type: '', loc: '', aud: '', q: '', per: '', day: null });
    $$('[data-f-type]').forEach((x) => x.setAttribute('aria-pressed', x.dataset.fType === '' ? 'true' : 'false'));
    $$('[data-f-per]').forEach((x) => x.setAttribute('aria-pressed', x.dataset.fPer === '' ? 'true' : 'false'));
    $('[data-f-loc]').value = ''; $('[data-f-aud]').value = ''; $('[data-f-q]').value = ''; render();
  });
  monthEl.addEventListener('click', (e) => {
    const mb = e.target.closest('[data-m]'); if (mb) { st.month = new Date(st.month.getFullYear(), st.month.getMonth() + Number(mb.dataset.m), 1); renderMonth(); return; }
    const d = e.target.closest('[data-day]'); if (d && !d.disabled) { st.day = new Date(d.dataset.day); render(); return; }
    if (e.target.closest('[data-day-clear]')) { st.day = null; render(); }
  });
  // Kartice (tabovi) s pomičnom crtom
  const ink = $('[data-tab-ink]');
  const moveInk = (t) => { ink.style.width = t.offsetWidth + 'px'; ink.style.transform = `translateX(${t.offsetLeft}px)`; };
  const tabs = $$('[data-tab]');
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => { tabs.forEach((x) => { x.setAttribute('aria-selected', x === t ? 'true' : 'false'); x.tabIndex = x === t ? 0 : -1; }); st.tab = t.dataset.tab; st.day = null; moveInk(t); render(); });
    t.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length]; n.focus(); n.click(); } });
    t.tabIndex = i === 0 ? 0 : -1;
  });
  requestAnimationFrame(() => moveInk(tabs[0])); addEventListener('resize', () => moveInk($('[data-tab][aria-selected="true"]')));
  render(false);
  if (motion()) G.from($$('.ev-card', wrap), { opacity: 0, y: 40, stagger: 0.06, duration: 0.9, ease: 'expo.out', delay: 0.2 });
}

/* ---------------- Izložba: povezana događanja + lightbox ---------------- */
function initExhibition() {
  const rel = $('[data-related]');
  if (rel) {
    const list = events.filter((e) => e.exhibition === rel.dataset.related && !e.past);
    rel.innerHTML = list.length ? list.map(rowHtml).join('') : '<li class="empty" style="display:block"><strong>Uskoro novi programi.</strong>Prijavite se na newsletter i javit ćemo vam.</li>';
  }
  const gal = $('[data-gallery]'); const lb = $('[data-lightbox]');
  if (!gal || !lb) return;
  const objs = JSON.parse(gal.dataset.objects); let i = 0;
  const stage = $('[data-lb-stage]'); const cap = $('[data-lb-cap]');
  const show = (n, from) => {
    i = (n + objs.length) % objs.length;
    stage.style.background = i % 2 ? '#F2F0EC' : gal.dataset.color;
    stage.innerHTML = objectSvg(objs[i], i % 2 ? '#111' : gal.dataset.ink);
    cap.textContent = `Predmet ${i + 1} / ${objs.length} · ilustracija`;
    if (motion()) {
      if (from) { const r = from.getBoundingClientRect(); const s = stage.getBoundingClientRect(); G.fromTo(stage, { x: r.left + r.width / 2 - (s.left + s.width / 2), y: r.top + r.height / 2 - (s.top + s.height / 2), scale: r.width / s.width }, { x: 0, y: 0, scale: 1, duration: 0.8, ease: 'expo.out' }); }
      else G.fromTo($('svg', stage), { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' });
    }
  };
  let opener = null;
  $$('[data-lb]', gal).forEach((b) => b.addEventListener('click', () => { opener = b; lb.classList.add('open'); lenis?.stop(); show(Number(b.dataset.lb), b); $('[data-lb-close]').focus(); }));
  const close = () => { lb.classList.remove('open'); lenis?.start(); opener?.focus(); };
  $('[data-lb-close]').addEventListener('click', close);
  $('[data-lb-prev]').addEventListener('click', () => show(i - 1));
  $('[data-lb-next]').addEventListener('click', () => show(i + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => { if (!lb.classList.contains('open')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') show(i - 1); if (e.key === 'ArrowRight') show(i + 1); });
}

/* ---------------- Zid predmeta (beskonačno platno) ---------------- */
function initWall() {
  const wall = $('[data-wall]'); if (!wall) return;
  const plane = $('[data-wall-plane]'); const intro = $('[data-wall-intro]');
  const TW = 240; const TH = 300; const GAP = 28; const CW = TW + GAP; const CH = TH + GAP;
  const cols = Math.max(8, Math.ceil(innerWidth / CW) + 3); const rows = Math.max(6, Math.ceil(wall.offsetHeight / CH) + 3);
  const W = cols * CW; const H = rows * CH;
  const tiles = [];
  let k = 0;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const it = WALL[(k++ * 7) % WALL.length];
    const a = document.createElement('a');
    a.className = 'wall-tile'; a.href = BASE + 'zbirke/predmet/'; a.tabIndex = -1;
    a.style.background = it.color; a.style.color = it.ink;
    if (it.color === '#ffffff') a.style.border = '1px solid #333';
    a.innerHTML = `<span class="art">${objectSvg(it.motif, it.ink)}</span><span class="cap"><span>${esc(it.name)}</span><span style="opacity:.75">${esc(it.collection)}</span></span>`;
    a.setAttribute('aria-hidden', 'true');
    plane.appendChild(a);
    tiles.push({ el: a, bx: c * CW + (r % 2 ? CW / 2 : 0), by: r * CH });
  }
  const off = { x: -W / 2 + innerWidth / 2, y: -H / 2 + wall.offsetHeight / 2 };
  const wrapX = (v) => ((v % W) + W) % W - CW;
  const wrapY = (v) => ((v % H) + H) % H - CH;
  const draw = () => { for (const t of tiles) t.el.style.transform = `translate3d(${wrapX(t.bx + off.x)}px, ${wrapY(t.by + off.y)}px, 0)`; };
  draw();
  let touched = false;
  const hideIntro = () => { if (!touched) { touched = true; intro.classList.add('gone'); wall.classList.add('touched'); } };

  if (window.Draggable) {
    const proxy = document.createElement('div');
    let lx = 0; let ly = 0;
    Draggable.create(proxy, {
      type: 'x,y', trigger: wall, inertia: !!window.InertiaPlugin, allowContextMenu: true, clickableTest: () => false, minimumMovement: 6,
      onPress() { lx = this.x; ly = this.y; drift?.pause(); },
      onDrag() { off.x += this.x - lx; off.y += this.y - ly; lx = this.x; ly = this.y; draw(); hideIntro(); },
      onThrowUpdate() { off.x += this.x - lx; off.y += this.y - ly; lx = this.x; ly = this.y; draw(); },
      onClick(e) { const t = e.target.closest('.wall-tile'); if (t) location.href = t.href; },
    });
  }
  wall.addEventListener('wheel', (e) => { e.preventDefault(); off.x -= e.deltaX || (e.shiftKey ? e.deltaY : 0); off.y -= e.shiftKey ? 0 : e.deltaY; draw(); hideIntro(); }, { passive: false });
  wall.tabIndex = 0;
  wall.addEventListener('keydown', (e) => { const s = 80; const m = { ArrowLeft: [s, 0], ArrowRight: [-s, 0], ArrowUp: [0, s], ArrowDown: [0, -s] }[e.key]; if (m) { e.preventDefault(); off.x += m[0]; off.y += m[1]; draw(); hideIntro(); } });
  let drift = null;
  if (motion()) {
    // Ulazna animacija i polagano „lebdenje” dok korisnik ne dotakne zid
    G.from(tiles.map((t) => t.el), { opacity: 0, scale: 0.6, duration: 1.2, ease: 'expo.out', stagger: { amount: 0.8, from: 'center', grid: [rows, cols] } });
    G.from($$('.display, .kicker', intro), { yPercent: 60, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1, delay: 0.3 });
    let drifting = true;
    drift = { pause: () => { drifting = false; } };
    G.ticker.add(() => { if (drifting && !document.hidden) { off.x -= 0.35; off.y -= 0.12; draw(); } });
    if (finePointer) wall.addEventListener('pointermove', (e) => { const t = e.target.closest('.wall-tile'); $$('.wall-tile', plane).forEach((x) => { x.style.filter = t && x !== t ? 'saturate(.4) brightness(.6)' : ''; }); });
    wall.addEventListener('pointerleave', () => $$('.wall-tile', plane).forEach((x) => { x.style.filter = ''; }));
  }
  $('[data-wall-shuffle]')?.addEventListener('click', () => {
    const tgt = { x: off.x + (Math.random() - 0.5) * 3000, y: off.y + (Math.random() - 0.5) * 2000 };
    if (motion()) G.to(off, { ...tgt, duration: 1.6, ease: 'expo.inOut', onUpdate: draw }); else { Object.assign(off, tgt); draw(); }
    hideIntro();
  });
  addEventListener('resize', draw);
}

/* ---------------- Duboki zum ---------------- */
function initViewer() {
  const v = $('[data-viewer]'); if (!v) return;
  const stage = $('[data-viewer-stage]'); const label = $('[data-viewer-zoom]'); const box = $('[data-minimap-box]'); const hint = $('[data-viewer-hint]');
  const SIZE = 1600;
  const st = { s: 1, x: 0, y: 0 };
  let minS = 1; const maxS = 14;
  const fit = () => { minS = Math.max(v.clientWidth / SIZE, v.clientHeight / SIZE); };
  const clamp = () => {
    st.s = Math.min(maxS, Math.max(minS, st.s));
    const w = SIZE * st.s; const h = SIZE * st.s;
    st.x = Math.min(0, Math.max(v.clientWidth - w, st.x)); st.y = Math.min(0, Math.max(v.clientHeight - h, st.y));
  };
  const apply = () => {
    stage.style.transform = `translate(${st.x}px, ${st.y}px) scale(${st.s})`;
    label.textContent = `${Math.round((st.s / minS) * 100)} %`;
    if (box) { const k = 140 / (SIZE * st.s); Object.assign(box.style, { left: -st.x * k + 'px', top: -st.y * k + 'px', width: v.clientWidth * k + 'px', height: v.clientHeight * k + 'px' }); }
  };
  const zoomAt = (factor, cx, cy, animate) => {
    const ns = Math.min(maxS, Math.max(minS, st.s * factor)); const f = ns / st.s;
    const target = { s: ns, x: cx - (cx - st.x) * f, y: cy - (cy - st.y) * f };
    hint.style.opacity = 0;
    if (animate && motion()) { const tmp = { ...st }; G.to(tmp, { ...target, duration: 0.6, ease: 'expo.out', onUpdate: () => { Object.assign(st, tmp); clamp(); apply(); } }); }
    else { Object.assign(st, target); clamp(); apply(); }
  };
  fit(); st.s = minS; clamp(); apply();
  v.addEventListener('wheel', (e) => { e.preventDefault(); const r = v.getBoundingClientRect(); zoomAt(Math.exp(-e.deltaY * 0.0022), e.clientX - r.left, e.clientY - r.top, false); }, { passive: false });
  const pts = new Map(); let last = null; let pinch = null;
  v.addEventListener('pointerdown', (e) => { if (e.target.closest('button')) return; v.setPointerCapture(e.pointerId); pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); last = { x: e.clientX, y: e.clientY }; });
  v.addEventListener('pointermove', (e) => {
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const r = v.getBoundingClientRect();
    if (pts.size === 2) {
      const [a, b] = [...pts.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y); const c = { x: (a.x + b.x) / 2 - r.left, y: (a.y + b.y) / 2 - r.top };
      if (pinch) zoomAt(d / pinch, c.x, c.y, false);
      pinch = d; return;
    }
    st.x += e.clientX - last.x; st.y += e.clientY - last.y; last = { x: e.clientX, y: e.clientY }; clamp(); apply(); hint.style.opacity = 0;
  });
  const up = (e) => { pts.delete(e.pointerId); pinch = null; if (pts.size === 1) last = [...pts.values()][0]; };
  v.addEventListener('pointerup', up); v.addEventListener('pointercancel', up);
  v.addEventListener('dblclick', (e) => { const r = v.getBoundingClientRect(); zoomAt(2.2, e.clientX - r.left, e.clientY - r.top, true); });
  const center = () => [v.clientWidth / 2, v.clientHeight / 2];
  $('[data-zoom-in]').addEventListener('click', () => zoomAt(1.8, ...center(), true));
  $('[data-zoom-out]').addEventListener('click', () => zoomAt(1 / 1.8, ...center(), true));
  $('[data-zoom-reset]').addEventListener('click', () => zoomAt(minS / st.s, 0, 0, true));
  v.addEventListener('keydown', (e) => {
    const step = 60;
    if (e.key === '+' || e.key === '=') zoomAt(1.5, ...center(), true);
    else if (e.key === '-') zoomAt(1 / 1.5, ...center(), true);
    else if (e.key.startsWith('Arrow')) { e.preventDefault(); st.x += e.key === 'ArrowLeft' ? step : e.key === 'ArrowRight' ? -step : 0; st.y += e.key === 'ArrowUp' ? step : e.key === 'ArrowDown' ? -step : 0; clamp(); apply(); }
  });
  addEventListener('resize', () => { const rel = st.s / minS; fit(); st.s = minS * rel; clamp(); apply(); });
  // Uvodni „zum” prema detalju
  if (motion()) setTimeout(() => zoomAt(3, v.clientWidth * 0.55, v.clientHeight * 0.5, true), 900);
}

/* ---------------- Lupa (naslovnica) ---------------- */
function initLoupe() {
  const m = $('[data-loupe]'); if (!m || !finePointer) return;
  const lens = $('[data-loupe-lens]'); const inner = $('[data-loupe-inner]');
  const src = m.querySelector(':scope > svg');
  inner.appendChild(src.cloneNode(true));
  const Z = 3.2;
  m.addEventListener('pointerenter', () => lens.classList.add('on'));
  m.addEventListener('pointerleave', () => lens.classList.remove('on'));
  m.addEventListener('pointermove', (e) => {
    const r = m.getBoundingClientRect(); const x = e.clientX - r.left; const y = e.clientY - r.top;
    lens.style.left = x + 'px'; lens.style.top = y + 'px';
    inner.style.width = r.width + 'px'; inner.style.height = r.height + 'px';
    inner.style.transform = `translate(${95 - x * Z}px, ${95 - y * Z}px) scale(${Z})`;
  });
}

/* ---------------- Usporedba prije/poslije ---------------- */
function initCompare() {
  $$('[data-compare]').forEach((c) => {
    const i = $('[data-compare-input]', c);
    const set = (v) => c.style.setProperty('--pos', v + '%');
    i.addEventListener('input', () => set(i.value));
    if (motion() && ST) {
      ST.create({ trigger: c, start: 'top 70%', once: true, onEnter: () => { const o = { v: 85 }; G.fromTo(o, { v: 85 }, { v: 50, duration: 1.6, ease: 'expo.inOut', onUpdate: () => { set(o.v); i.value = o.v; } }); } });
    }
  });
}

/* ---------------- Karta (uz privolu) ---------------- */
function initMap() {
  const g = $('[data-map-gate]'); if (!g) return;
  $('[data-load-map]', g).addEventListener('click', () => {
    try { if (consent() !== 'all') localStorage.setItem('muo-consent-map', '1'); } catch (e) { /* */ }
    g.style.padding = '0';
    g.innerHTML = '<iframe title="Karta: MUO Galerija, Ilica 163a (približna lokacija)" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=15.9440%2C45.8105%2C15.9600%2C45.8170&amp;layer=mapnik&amp;marker=45.8137%2C15.9518"></iframe>';
  });
}

/* ================= ANIMACIJE ================= */
function initMotion() {
  if (!motion()) { $$('[data-reveal],[data-clip]').forEach((el) => { el.style.opacity = ''; el.style.transform = ''; el.style.clipPath = ''; }); return; }

  // Lenis glatki scroll povezan s GSAP-om
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true, anchors: true });
    lenis.on('scroll', ST.update);
    G.ticker.add((t) => lenis.raf(t * 1000));
    G.ticker.lagSmoothing(0);
  }

  // Razdvajanje naslova u retke i maskirano otkrivanje
  if (window.SplitText) {
    $$('[data-split]').forEach((el) => {
      const s = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
      G.from(s.lines, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: el, start: 'top 88%' } });
    });
  }
  ST.batch('[data-reveal]', { start: 'top 90%', onEnter: (els) => G.to(els, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.1, overwrite: true }) });
  $$('[data-clip]').forEach((el) => G.to(el, { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 88%' } }));

  // Brojke
  $$('[data-count]').forEach((el) => {
    const to = Number(el.dataset.count); const plain = el.hasAttribute('data-plain'); const o = { v: plain ? to - 140 : 0 };
    const fmt = (v) => (plain ? Math.round(v) : Math.round(v).toLocaleString('hr-HR'));
    el.textContent = fmt(o.v);
    G.to(o, { v: to, duration: 2.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' }, onUpdate: () => { el.textContent = fmt(o.v); } });
  });

  // Magnetni gumbi
  if (finePointer) $$('[data-magnetic]').forEach((b) => {
    const xTo = G.quickTo(b, 'x', { duration: 0.6, ease: 'elastic.out(1, .4)' }); const yTo = G.quickTo(b, 'y', { duration: 0.6, ease: 'elastic.out(1, .4)' });
    b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * 0.3); yTo((e.clientY - r.top - r.height / 2) * 0.4); });
    b.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });

  // Prilagođeni kursor s oznakom
  const cur = $('.cursor');
  if (finePointer && cur) {
    const cx = G.quickTo(cur, 'x', { duration: 0.35, ease: 'power3' }); const cy = G.quickTo(cur, 'y', { duration: 0.35, ease: 'power3' });
    addEventListener('pointermove', (e) => { cur.classList.add('on'); cx(e.clientX); cy(e.clientY); });
    document.addEventListener('pointerover', (e) => {
      const t = e.target.closest('[data-cursor]'); const hide = e.target.closest('[data-cursor-hide], .wall, .viewer, input, textarea, select');
      cur.style.opacity = hide ? 0 : '';
      cur.classList.toggle('label', !!t); $('span', cur).textContent = t ? t.dataset.cursor : '';
    });
    document.addEventListener('pointerleave', () => cur.classList.remove('on'));
  }

  // Logo: slova poskoče na hover
  $$('.logo').forEach((l) => l.addEventListener('pointerenter', () => G.fromTo($$('.logo-mark span', l), { yPercent: 0 }, { yPercent: -100, duration: 0.35, ease: 'power2.in', stagger: 0.05, yoyo: true, repeat: 1 })));

  // Hover na karticama mijenja naglasnu boju stranice (kao British Museum)
  $$('[data-accent]').forEach((c) => {
    c.addEventListener('pointerenter', () => { root.style.setProperty('--accent', c.dataset.accent); G.to(BODY, { backgroundColor: tint(c.dataset.accent, 0.93), duration: 0.6 }); });
    c.addEventListener('pointerleave', () => { root.style.removeProperty('--accent'); G.to(BODY, { backgroundColor: '#ffffff', duration: 0.6 }); });
  });

  // Veliki MUO u podnožju
  const big = $('[data-footer-big]');
  if (big) G.from($$('span', big), { yPercent: 100, duration: 1.2, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: big, start: 'top 95%' } });

  // Vremenska crta obnove
  $$('[data-timeline-bar]').forEach((b) => G.fromTo(b, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: b.parentElement, start: 'top 80%', end: 'bottom 50%', scrub: true } }));

  // Pinned „raširi fotografiju” (Nordiska)
  $$('[data-expand]').forEach((sec) => {
    const img = $('[data-expand-img]', sec); const pic = $('img', img); const txt = $('.expand-text', sec);
    const tl = G.timeline({ scrollTrigger: { trigger: sec, start: 'top top', end: '+=120%', scrub: 1, pin: true } });
    tl.to(img, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none' }, 0)
      .to(pic, { scale: 1, ease: 'none' }, 0)
      .from(txt, { yPercent: 40, opacity: 0, ease: 'power2.out', duration: 0.5 }, 0.45);
  });

  // Marquee koji reagira na brzinu i smjer scrolla
  const mq = $('[data-marquee]');
  if (mq) {
    const loop = G.to(mq, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 });
    let dir = 1;
    ST.create({ trigger: mq, start: 'top bottom', end: 'bottom top', onUpdate: (s) => { const v = s.getVelocity(); if (Math.abs(v) > 20) dir = v > 0 ? 1 : -1; G.to(loop, { timeScale: dir * (1 + Math.min(Math.abs(v) / 300, 6)), duration: 0.3, overwrite: true }); G.to(loop, { timeScale: dir, duration: 1.2, delay: 0.3, overwrite: false }); } });
  }

  // Vodoravne zbirke (Van Gogh): pin + boja pozadine prati zbirku
  const hs = $('[data-hscroll]');
  if (hs) {
    const track = $('[data-hscroll-track]'); const bar = $('[data-hscroll-bar]'); const items = $$('.hscroll-item', track);
    const mm = G.matchMedia();
    mm.add('(min-width: 901px)', () => {
      const dist = () => track.scrollWidth - innerWidth;
      let lastBg = '';
      const tw = G.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: hs, start: 'top top', end: () => '+=' + dist(), scrub: 1, pin: true, invalidateOnRefresh: true, onUpdate: (s) => {
        bar.style.transform = `scaleX(${s.progress})`;
        const center = innerWidth * 0.5; let best = items[0]; let bd = Infinity;
        for (const it of items) { const r = it.getBoundingClientRect(); const d = Math.abs(r.left + r.width / 2 - center); if (d < bd) { bd = d; best = it; } }
        const bg = best.dataset.bg; if (bg !== lastBg) { lastBg = bg; G.to(hs, { backgroundColor: shade(bg), duration: 0.6, overwrite: true }); }
      } } });
      items.forEach((it) => G.from($('.art', it), { rotate: -8, scale: 0.8, ease: 'none', scrollTrigger: { trigger: it, containerAnimation: tw, start: 'left right', end: 'left 40%', scrub: true } }));
      return () => { G.set(hs, { backgroundColor: '#111' }); };
    });
    mm.add('(max-width: 900px)', () => { hs.classList.add('no-pin'); return () => hs.classList.remove('no-pin'); });
  }

  // Hero naslovnice
  const hero = $('.hero');
  if (hero) {
    const frame = $('[data-hero-frame]'); const pic = frame && $('img', frame);
    const lines = $$('[data-hero-title] .line');
    const tl = G.timeline({ paused: true, defaults: { ease: 'expo.out' } });
    if (window.SplitText) {
      lines.forEach((l, i) => { const s = SplitText.create(l, { type: 'chars' }); tl.from(s.chars, { yPercent: 115, rotate: 6, duration: 1.3, stagger: 0.035 }, 0.1 + i * 0.12); });
    }
    tl.from('[data-hero-fade]', { y: 30, opacity: 0, duration: 1.1, stagger: 0.1 }, 0.5);
    if (frame) tl.fromTo(frame, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.5, ease: 'expo.inOut' }, 0.1).from(pic, { scale: 1.4, duration: 2, ease: 'expo.out' }, 0.3);
    if (pic) G.to(pic, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    G.to('[data-hero-title]', { yPercent: -25, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    const intro = $('.intro');
    if (intro && !root.classList.contains('no-intro')) {
      lenis?.stop();
      const il = G.timeline({ onComplete: () => { intro.remove(); lenis?.start(); try { sessionStorage.setItem('muo-intro', '1'); } catch (e) { /* */ } } });
      il.to($$('.intro-word span', intro), { yPercent: -105, duration: 1, ease: 'expo.out', stagger: 0.08 }, 0.2)
        .to('.intro-sub', { opacity: 1, duration: 0.6 }, 0.6)
        .to($$('.intro-word span', intro), { yPercent: -210, duration: 0.7, ease: 'expo.in', stagger: 0.05 }, 1.6)
        .to('.intro-sub', { opacity: 0, duration: 0.3 }, 1.7)
        .to(intro, { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' }, 2)
        .add(() => tl.play(), 2.35);
    } else { intro?.remove(); tl.play(); }
  }

  // Izložba: ulaz naslova
  const exArt = $('.ex-hero-art svg');
  if (exArt) G.from(exArt, { scale: 0.7, rotate: -10, opacity: 0, duration: 1.4, ease: 'expo.out', delay: 0.2 });
  addEventListener('load', () => ST.refresh());
}

function tint(hex, amt) { const n = parseInt(hex.slice(1), 16); const r = n >> 16; const g = (n >> 8) & 255; const b = n & 255; const m = (c) => Math.round(c + (255 - c) * amt); return `rgb(${m(r)}, ${m(g)}, ${m(b)})`; }
function shade(hex) { const n = parseInt(hex.slice(1), 16); const r = n >> 16; const g = (n >> 8) & 255; const b = n & 255; const m = (c) => Math.round(c * 0.55); return `rgb(${m(r)}, ${m(g)}, ${m(b)})`; }

/* ---------------- Pokretanje ---------------- */
if (root.classList.contains('no-intro') || !motion()) $('.intro')?.remove();
setTimeout(() => { const i = $('.intro'); if (i) { i.remove(); lenis?.start(); } }, 6000);
initStatus(); initA11y(); initCookies(); initSaved(); initShare(); initForms(); initSearch(); initHeader();
initHomeEvents(); initEventsPage(); initExhibition(); initWall(); initViewer(); initLoupe(); initCompare(); initMap();
initMotion();
syncSaved();
