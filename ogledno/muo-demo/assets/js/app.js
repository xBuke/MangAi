// MUO – ogledni prijedlog portala. Vanilla JS, GSAP + Lenis. U produkciji iste komponente postaju React komponente (Next.js), a podaci dolaze iz Payload CMS-a.
import { EVENTS, WALL, HOURS, ITEMS, PERIODS, MATERIALS, TYPE_EN, AUD_EN } from './data.js';
import { objectSvg } from './objects.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const root = document.documentElement;
const BODY = document.body;
const BASE = BODY.dataset.base || '/';
const PAGE = BODY.dataset.page;
const LANG = BODY.dataset.lang || 'hr';
const EN = LANG === 'en';
const tx = (hr, en) => (EN ? en : hr);
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
const MONTHS = EN ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] : ['sij', 'velj', 'ožu', 'tra', 'svi', 'lip', 'srp', 'kol', 'ruj', 'lis', 'stu', 'pro'];
const MONTHS_FULL = EN ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] : ['siječanj', 'veljača', 'ožujak', 'travanj', 'svibanj', 'lipanj', 'srpanj', 'kolovoz', 'rujan', 'listopad', 'studeni', 'prosinac'];
const DAYS = EN ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] : ['nedjelja', 'ponedjeljak', 'utorak', 'srijeda', 'četvrtak', 'petak', 'subota'];
const DOW_SHORT = EN ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : ['pon', 'uto', 'sri', 'čet', 'pet', 'sub', 'ned'];
// Hrvatska množina: 1 predmet, 2–4 predmeta, 5+ predmeta (11–14 uvijek treći oblik)
const plHr = (n, one, few, many) => { const a = n % 10; const b = n % 100; if (a === 1 && b !== 11) return one; if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few; return many; };
const nOf = (n, hr, en) => `${n} ${EN ? (n === 1 ? en[0] : en[1]) : plHr(n, hr[0], hr[1], hr[2])}`;
const PRICE_EN = { 'Uz ulaznicu': 'With admission ticket', 'Ulaz slobodan': 'Free entry', '[cijena]': '[price]', 'Ulaznica sajma': 'Fair ticket' };
const evTitle = (e) => (EN ? e.titleEn || e.title : e.title);
const evType = (t) => (EN ? TYPE_EN[t] || t : t);
const evAud = (a) => (EN ? AUD_EN[a] || a : a);
const evPrice = (p) => (EN ? PRICE_EN[p] || p : p);
const EV_URL = BASE + (EN ? 'en/exhibitions-and-events/' : 'izlozbe-i-dogadanja/');
const debounce = (fn, ms) => { let h; return (...a) => { clearTimeout(h); h = setTimeout(() => fn(...a), ms); }; };
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
const chrome = () => $$('[data-chrome]');
function openPanel(name) {
  const p = $(`[data-panel="${name}"]`);
  if (!p) return;
  const opener = document.activeElement;
  closePanels(false);
  lastFocus = opener;
  p.inert = false;
  p.classList.add(name === 'menu' ? 'is-open' : 'open');
  p.setAttribute('aria-hidden', 'false');
  if (name !== 'menu') backdrop.classList.add('open');
  chrome().forEach((el) => { el.inert = true; });
  $$(`[data-open="${name}"][aria-expanded]`).forEach((b) => b.setAttribute('aria-expanded', 'true'));
  lenis?.stop();
  if (name === 'saved') renderSaved();
  if (name === 'search') resetSearch();
  if (name === 'menu' && motion()) G.from($$('nav a', p), { yPercent: 100, opacity: 0, stagger: 0.06, duration: 0.8, ease: 'expo.out', delay: 0.25 });
  requestAnimationFrame(() => { (p.querySelector('input:not([tabindex="-1"]), button, a') || p).focus(); });
}
function closePanels(restore = true) {
  const wasOpen = $$('[data-panel].open, [data-panel].is-open').length > 0;
  $$('[data-panel]').forEach((p) => { p.classList.remove('open', 'is-open'); p.setAttribute('aria-hidden', 'true'); p.inert = true; });
  backdrop?.classList.remove('open');
  chrome().forEach((el) => { el.inert = false; });
  $$('[data-open][aria-expanded]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
  lenis?.start();
  if (restore && wasOpen && lastFocus && document.contains(lastFocus)) lastFocus.focus?.();
}
// Asistent „Pitaj Muzej”: kod i stil učitavaju se tek na prvi klik, pa ne opterećuju učitavanje stranice
let askMod = null; let askLoading = false;
async function openAsk(btn) {
  if (askLoading) return;
  try {
    if (!askMod) {
      askLoading = true;
      await new Promise((res) => { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = BASE + 'assets/css/asistent.css'; l.onload = res; l.onerror = res; document.head.append(l); });
      askMod = await import(BASE + 'assets/js/asistent.js');
      askMod.mount();
    }
    btn?.focus();
    openPanel('ask');
    askMod.opened();
  } catch (err) {
    toast(tx('Asistent se nije uspio učitati. Stranica radi i bez njega.', 'The assistant could not be loaded. The site works without it.'));
  } finally { askLoading = false; }
}
document.addEventListener('click', (e) => { const b = e.target.closest('[data-ask]'); if (b) { e.preventDefault(); openAsk(b); } });
if (new URLSearchParams(location.search).has('pitaj')) window.addEventListener('load', () => openAsk($('[data-ask]')));

document.addEventListener('click', (e) => {
  const o = e.target.closest('[data-open]');
  if (o) { e.preventDefault(); const n = o.dataset.open; if (n === 'cookies') showCookie(true); else openPanel(n); return; }
  if (e.target.closest('[data-close]') || e.target === backdrop) closePanels();
  if (e.target.closest('.search') && !e.target.closest('.search-box')) closePanels();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePanels();
  if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName))) { e.preventDefault(); openPanel('search'); }
  // Zamka fokusa: dok je dijalog otvoren, Tab kruži unutar njega
  if (e.key === 'Tab') {
    const p = $('[data-panel].open, [data-panel].is-open'); if (!p) return;
    const f = $$('a[href], button:not([disabled]), input:not([tabindex="-1"]), select, textarea, [tabindex="0"]', p).filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0]; const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    else if (!p.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
  }
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
      if (k === 'motion') { toast(s[k] ? tx('Animacije su smanjene.', 'Motion reduced.') : tx('Animacije su uključene – osvježavam stranicu.', 'Motion enabled – reloading the page.')); updateMotionState(); if (!s[k]) setTimeout(() => location.reload(), 900); else { root.classList.remove('motion'); lenis?.destroy(); lenis = null; G && G.globalTimeline.clear(); ST && ST.getAll().forEach((t) => t.kill(true)); $$('[data-reveal],[data-clip]').forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; }); } }
    });
  });
}

/* ---------------- Kolačići ---------------- */
const consent = () => { try { return localStorage.getItem('muo-consent'); } catch (e) { return null; } };
// Dok je obavijest o kolačićima otvorena, plutajući gumbi se podižu iznad nje da ostanu vidljivi
(() => {
  const c = $('[data-cookie]'); if (!c) return;
  const lift = () => document.documentElement.style.setProperty('--fab-lift', c.classList.contains('show') ? `${c.offsetHeight + 16}px` : '0px');
  new MutationObserver(lift).observe(c, { attributes: true, attributeFilter: ['class'] });
  window.addEventListener('resize', lift);
})();
function showCookie(force) { const c = $('[data-cookie]'); if (!c) return; if (force || !consent()) setTimeout(() => c.classList.add('show'), force ? 0 : 1800); }
function initCookies() {
  showCookie(false);
  $$('[data-consent]').forEach((b) => b.addEventListener('click', () => {
    try { localStorage.setItem('muo-consent', b.dataset.consent); } catch (e) { /* */ }
    $('[data-cookie]').classList.remove('show');
    toast(b.dataset.consent === 'all' ? tx('Hvala! Privola je spremljena.', 'Thank you! Your consent is saved.') : tx('Koristimo samo nužne kolačiće.', 'Only necessary cookies are used.'));
  }));
}

/* ---------------- Moja zbirka ---------------- */
const getSaved = () => { try { return JSON.parse(localStorage.getItem('muo-saved') || '[]'); } catch (e) { return []; } };
const setSaved = (a) => { try { localStorage.setItem('muo-saved', JSON.stringify(a)); } catch (e) { /* */ } };
function syncSaved(bump) {
  const s = getSaved(); const ids = new Set(s.map((x) => x.id));
  $$('[data-save]').forEach((b) => { try { b.setAttribute('aria-pressed', ids.has(JSON.parse(b.dataset.save).id) ? 'true' : 'false'); } catch (e) { /* */ } });
  $$('[data-saved-label]').forEach((b) => b.setAttribute('aria-label', `${b.dataset.savedLabel} (${s.length})`));
  $$('[data-save-count]').forEach((c) => {
    c.dataset.n = s.length; c.classList.toggle('has', s.length > 0);
    if (bump && motion()) G.fromTo(c, { scale: 1.8 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, .4)' });
  });
}
function renderSaved() {
  const ul = $('[data-saved-list]'); if (!ul) return;
  const s = getSaved();
  ul.innerHTML = s.length ? s.map((x) => `<li><a class="thumb" href="${esc(x.url)}" style="background:${esc(x.color)}" aria-hidden="true" tabindex="-1">${objectSvg(x.motif, x.color === '#D9A441' || x.color === '#F2E6D0' ? '#111' : '#fff')}</a><a href="${esc(x.url)}" style="font-weight:600;text-decoration:none">${esc(x.title)}</a><button class="icon-btn" type="button" data-unsave="${esc(x.id)}" aria-label="${tx('Ukloni', 'Remove')} ${esc(x.title)}">✕</button></li>`).join('')
    : `<li class="empty" style="display:block"><strong>${tx('Još ništa spremljeno.', 'Nothing saved yet.')}</strong>${tx('Dodirnite srce na izložbi, događanju ili predmetu.', 'Tap the heart on an exhibition, event or object.')}</li>`;
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
      setSaved(cur); toast(tx(`Uvezeno spremljenih stavki: ${incoming.length}.`, `Imported saved items: ${incoming.length}.`));
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
      toast(has ? tx('Uklonjeno iz Moje zbirke.', 'Removed from My collection.') : tx('Spremljeno u Moju zbirku.', 'Saved to My collection.'));
      if (!has && motion()) G.fromTo(b, { scale: 0.8 }, { scale: 1, duration: 0.7, ease: 'elastic.out(1, .35)' });
      return;
    }
    const u = e.target.closest('[data-unsave]');
    if (u) { setSaved(getSaved().filter((x) => x.id !== u.dataset.unsave)); syncSaved(); renderSaved(); }
  });
  $('[data-clear-saved]')?.addEventListener('click', () => { setSaved([]); syncSaved(); renderSaved(); });
  $('[data-share-saved]')?.addEventListener('click', async () => {
    const s = getSaved(); if (!s.length) { toast(tx('Moja zbirka je prazna.', 'My collection is empty.')); return; }
    const url = `${location.origin}${BASE}?moja=${btoa(unescape(encodeURIComponent(JSON.stringify(s))))}`;
    try { await navigator.clipboard.writeText(url); toast(tx('Poveznica kopirana – pošaljite je prijateljima.', 'Link copied – share it with friends.')); } catch (e) { toast(tx('Kopiranje nije uspjelo u ovom pregledniku.', 'Copying is not available in this browser.')); }
  });
  syncSaved();
}

/* ---------------- Dijeljenje, obrasci ---------------- */
function initShare() {
  $$('[data-share]').forEach((b) => b.addEventListener('click', async () => {
    const data = { title: document.title, url: location.href };
    if (navigator.share) { try { await navigator.share(data); } catch (e) { /* */ } }
    else { try { await navigator.clipboard.writeText(location.href); toast(tx('Poveznica kopirana.', 'Link copied.')); } catch (e) { /* */ } }
  }));
}
function initForms() {
  const nl = $('[data-newsletter]');
  nl?.addEventListener('submit', (e) => {
    e.preventDefault();
    const em = nl.email.value.trim(); const msg = $('[data-nl-msg]');
    if (nl.website.value) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) { msg.style.color = '#FFB4A8'; msg.textContent = tx('Greška: upišite ispravnu e-mail adresu, npr. ime@domena.hr.', 'Error: enter a valid e-mail address, e.g. name@domain.com.'); nl.email.setAttribute('aria-invalid', 'true'); nl.email.focus(); return; }
    nl.email.removeAttribute('aria-invalid'); msg.style.color = '#B7F0CF'; msg.textContent = tx(`Ogledni prikaz: prijava nije poslana. U produkciji na ${em} stiže poveznica za potvrdu prijave (double opt-in).`, `Preview only: nothing was sent. In production a confirmation link (double opt-in) is e-mailed to ${em}.`); nl.reset();
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
    $$('[data-err]', gf).forEach((s) => { s.textContent = errs[s.dataset.err] ? `Greška: ${errs[s.dataset.err]}` : ''; });
    $$('input, select, textarea', gf).forEach((i) => i.setAttribute('aria-invalid', errs[i.name] ? 'true' : 'false'));
    const first = Object.keys(errs)[0];
    if (first) { gf[first].focus(); return; }
    $('[data-form-ok]', gf).innerHTML = `<div class="ok-box"><strong>Najava je zaprimljena.</strong> Potvrdu i detalje poslat ćemo na ${esc(gf.email.value)}. (Demo – u produkciji obrazac šalje e-mail Muzeju i sprema upit u CMS.)</div>`;
    gf.reset();
  });
}

/* ---------------- Pretraga ---------------- */
const TYPE_ORDER = ['page', 'exhibition', 'event', 'collection', 'object', 'news'];
const TYPE_LABEL = { page: tx('Stranice', 'Pages'), exhibition: tx('Izložbe', 'Exhibitions'), event: tx('Događanja', 'Events'), collection: tx('Zbirke', 'Collections'), object: tx('Predmeti', 'Objects'), news: tx('Novosti', 'News') };
const POPULAR = EN ? ['Opening hours', 'Tickets', 'Workshops', 'Glass', 'Group visit', 'Accessibility'] : ['Radno vrijeme', 'Ulaznice', 'Radionice', 'Staklo', 'Grupni posjet', 'Pristupačnost'];
const SEARCH_URL = BASE + (EN ? 'en/search/' : 'pretraga/');
const INDEX = (window.MUO_INDEX || []).map((x) => { const title = EN ? x.te : x.t; return { ...x, title, url: EN ? x.ue : x.u, nt: norm(title), n: norm(`${x.t} ${x.te} ${x.x || ''} ${TYPE_LABEL[x.k]}`) }; });
function searchIndex(q, type) {
  const words = norm(q).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return INDEX.filter((x) => (!type || x.k === type) && words.every((w) => x.n.includes(w)))
    .map((x) => ({ ...x, score: (x.nt.startsWith(words[0]) ? 4 : 0) + (words.every((w) => x.nt.includes(w)) ? 2 : 0) + (x.k === 'page' ? 1 : 0) - (x.past ? 2 : 0) }))
    .sort((a, b) => b.score - a.score || TYPE_ORDER.indexOf(a.k) - TYPE_ORDER.indexOf(b.k));
}
// Isticanje pogotka: norm() čuva duljinu teksta pa se pozicije poklapaju s izvornikom
function hl(title, q) {
  const w = norm(q).split(/\s+/).filter(Boolean)[0]; const nt = norm(title);
  const i = w ? nt.indexOf(w) : -1;
  if (i < 0 || nt.length !== title.length) return esc(title);
  return esc(title.slice(0, i)) + '<mark>' + esc(title.slice(i, i + w.length)) + '</mark>' + esc(title.slice(i + w.length));
}
const resultsLabel = (n) => nOf(n, ['rezultat', 'rezultata', 'rezultata'], ['result', 'results']);
const popularHtml = (attr) => `<div class="chips">${POPULAR.map((p) => `<button class="chip" type="button" ${attr}="${esc(p)}">${esc(p)}</button>`).join('')}</div>`;
let resetSearch = () => {};
function initSearch() {
  const input = $('[data-search-input]'); const list = $('[data-search-results]'); const foot = $('[data-search-foot]'); const status = $('[data-search-status]'); const form = $('[data-search-form]');
  if (!input) return;
  let active = -1; let opts = [];
  const setActive = (i) => {
    active = i;
    opts.forEach((o, k) => { o.setAttribute('aria-selected', k === i ? 'true' : 'false'); o.classList.toggle('active', k === i); });
    if (i >= 0) { input.setAttribute('aria-activedescendant', opts[i].id); opts[i].scrollIntoView({ block: 'nearest' }); } else input.removeAttribute('aria-activedescendant');
  };
  const say = debounce((t) => { status.textContent = t; }, 350);
  const render = () => {
    const q = input.value.trim(); active = -1; input.removeAttribute('aria-activedescendant');
    if (!q) {
      list.hidden = true; list.innerHTML = ''; opts = []; input.setAttribute('aria-expanded', 'false');
      foot.innerHTML = `<p class="search-hint">${tx('Upišite pojam. Pretraga radi i bez dijakritičkih znakova: „casa” pronalazi „čaša”.', 'Type a term. Search also works without diacritics: “casa” finds “čaša”.')}</p><div class="search-popular"><p class="label">${tx('Često traženo', 'Popular searches')}</p>${popularHtml('data-pop')}</div>`;
      say(''); return;
    }
    const hits = searchIndex(q, '');
    if (!hits.length) {
      list.hidden = true; list.innerHTML = ''; opts = []; input.setAttribute('aria-expanded', 'false');
      foot.innerHTML = `<div class="search-empty"><strong>${tx('Nema rezultata za', 'No results for')} „${esc(q)}”.</strong><p>${tx('Provjerite pravopis ili pokušajte s općenitijim pojmom.', 'Check the spelling or try a broader term.')}</p>${popularHtml('data-pop')}</div>`;
      say(tx(`Nema rezultata za ${q}.`, `No results for ${q}.`)); return;
    }
    const top = hits.slice(0, 8); const groups = {};
    top.forEach((h) => { (groups[h.k] = groups[h.k] || []).push(h); });
    let n = 0;
    list.innerHTML = TYPE_ORDER.filter((k) => groups[k]).map((k) => `<div class="search-group" role="group" aria-labelledby="sg-${k}"><div class="search-gh" id="sg-${k}">${TYPE_LABEL[k]}</div>${groups[k].map((h) => `<a role="option" aria-selected="false" id="so-${n++}" tabindex="-1" href="${BASE + h.url}"><span>${hl(h.title, q)}</span><span class="muted" aria-hidden="true">→</span></a>`).join('')}</div>`).join('');
    list.hidden = false; input.setAttribute('aria-expanded', 'true'); opts = $$('[role="option"]', list);
    foot.innerHTML = `<a class="search-all" href="${SEARCH_URL}?q=${encodeURIComponent(q)}">${tx('Prikaži sve rezultate', 'Show all results')} (${hits.length}) <span aria-hidden="true">→</span></a><span class="search-keys" aria-hidden="true"><kbd>↑</kbd><kbd>↓</kbd> ${tx('odabir', 'select')} · <kbd>Enter</kbd> ${tx('otvori', 'open')} · <kbd>Esc</kbd> ${tx('zatvori', 'close')}</span>`;
    say(`${resultsLabel(hits.length)}. ${tx('Strelicama gore i dolje birate prijedlog, Enter ga otvara.', 'Use the up and down arrows to choose a suggestion, Enter opens it.')}`);
  };
  resetSearch = () => { input.value = ''; render(); };
  input.addEventListener('input', render);
  foot.addEventListener('click', (e) => { const b = e.target.closest('[data-pop]'); if (b) { input.value = b.dataset.pop; render(); input.focus(); } });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!opts.length) return;
      e.preventDefault(); setActive(active < 0 ? (e.key === 'ArrowDown' ? 0 : opts.length - 1) : (active + (e.key === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length);
    } else if (e.key === 'Home' && opts.length && active >= 0) { e.preventDefault(); setActive(0); }
    else if (e.key === 'End' && opts.length && active >= 0) { e.preventDefault(); setActive(opts.length - 1); }
    else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); location.href = opts[active].href; }
  });
  form.addEventListener('submit', (e) => { if (!input.value.trim()) e.preventDefault(); });
  render();
}

/* ---------------- Stranica rezultata pretrage ---------------- */
function initSearchPage() {
  const rootEl = $('[data-search-page]'); if (!rootEl) return;
  const input = $('[data-sp-q]'); const chipsEl = $('[data-sp-types]'); const out = $('[data-sp-results]'); const count = $('[data-sp-count]'); const reset = $('[data-sp-reset]');
  const qs = new URLSearchParams(location.search);
  const st = { q: (qs.get('q') || '').trim(), type: TYPE_ORDER.includes(qs.get('vrsta')) ? qs.get('vrsta') : '' };
  input.value = st.q;
  const say = debounce((t) => { count.textContent = t; }, 250);
  const render = () => {
    const all = searchIndex(st.q, ''); const per = {};
    all.forEach((h) => { per[h.k] = (per[h.k] || 0) + 1; });
    if (st.type && !per[st.type] && !st.q) st.type = '';
    $$('[data-sp-type]', chipsEl).forEach((c) => {
      const k = c.dataset.spType; const n = k ? per[k] || 0 : all.length;
      $('[data-n]', c).textContent = st.q ? `(${n})` : '';
      c.setAttribute('aria-pressed', k === st.type ? 'true' : 'false');
      c.disabled = !!st.q && !!k && n === 0 && k !== st.type;
    });
    const hits = st.type ? all.filter((h) => h.k === st.type) : all;
    reset.hidden = !(st.q || st.type);
    if (!st.q) {
      say(tx('Upišite pojam za pretragu.', 'Type a term to search.'));
      out.innerHTML = `<div class="empty"><strong>${tx('Što tražite?', 'What are you looking for?')}</strong>${tx('Upišite pojam ili odaberite jedan od čestih upita.', 'Type a term or pick a popular search.')}<div style="margin-top:1.25rem;display:flex;justify-content:center">${popularHtml('data-sp-pop')}</div></div>`;
    } else if (!hits.length) {
      say(tx(`Nema rezultata za „${st.q}”${st.type ? ` u vrsti ${TYPE_LABEL[st.type]}` : ''}.`, `No results for “${st.q}”${st.type ? ` in ${TYPE_LABEL[st.type]}` : ''}.`));
      out.innerHTML = `<div class="empty"><strong>${tx('Nema rezultata za', 'No results for')} „${esc(st.q)}”.</strong>${tx('Provjerite pravopis, uklonite filtar vrste ili pokušajte s općenitijim pojmom.', 'Check the spelling, remove the type filter or try a broader term.')}<div style="margin-top:1.25rem;display:flex;justify-content:center">${popularHtml('data-sp-pop')}</div></div>`;
    } else {
      say(`${resultsLabel(hits.length)} ${tx('za', 'for')} „${st.q}”${st.type ? ` · ${TYPE_LABEL[st.type]}` : ''}`);
      const groups = {}; hits.forEach((h) => { (groups[h.k] = groups[h.k] || []).push(h); });
      out.innerHTML = TYPE_ORDER.filter((k) => groups[k]).map((k) => `<section class="sp-group" aria-labelledby="sp-${k}"><h2 class="h3" id="sp-${k}">${TYPE_LABEL[k]} <span class="muted">· ${groups[k].length}</span></h2><ul class="sp-list">${groups[k].map((h) => `<li><a href="${BASE + h.url}"><span class="sp-title">${hl(h.title, st.q)}</span><span class="sp-type">${TYPE_LABEL[k]}${h.past ? ` · ${tx('arhiva', 'archive')}` : ''}</span></a></li>`).join('')}</ul></section>`).join('');
    }
    const url = new URL(location.href);
    st.q ? url.searchParams.set('q', st.q) : url.searchParams.delete('q');
    st.type ? url.searchParams.set('vrsta', st.type) : url.searchParams.delete('vrsta');
    history.replaceState(null, '', url);
    document.title = st.q ? `${st.q} – ${tx('Pretraga', 'Search')} – MUO` : `${tx('Pretraga', 'Search')} – MUO`;
  };
  $('[data-sp-form]').addEventListener('submit', (e) => { e.preventDefault(); st.q = input.value.trim(); render(); });
  input.addEventListener('input', debounce(() => { st.q = input.value.trim(); render(); }, 200));
  chipsEl.addEventListener('click', (e) => { const c = e.target.closest('[data-sp-type]'); if (c && !c.disabled) { st.type = c.dataset.spType; render(); } });
  out.addEventListener('click', (e) => { const b = e.target.closest('[data-sp-pop]'); if (b) { st.q = b.dataset.spPop; input.value = st.q; render(); input.focus(); } });
  reset.addEventListener('click', () => { st.q = ''; st.type = ''; input.value = ''; render(); input.focus(); });
  render();
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
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//MUO//Ogledni prijedlog//HR', 'BEGIN:VEVENT', `UID:${e.id}@muo-demo`, `DTSTAMP:${f(new Date())}`, `DTSTART;TZID=Europe/Zagreb:${f(e.start)}`, `DTEND;TZID=Europe/Zagreb:${f(e.end)}`, `SUMMARY:${evTitle(e)}`, `LOCATION:${e.place}`, 'DESCRIPTION:Muzej za umjetnost i obrt', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
}
function downloadIcs(id) {
  const e = events.find((x) => x.id === id); if (!e) return;
  const blob = new Blob([icsFor(e)], { type: 'text/calendar;charset=utf-8' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `muo-${id}.ics`; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  toast(tx('Preuzeta je .ics datoteka – otvorite je u svom kalendaru.', 'An .ics file was downloaded – open it in your calendar.'));
}
function gcal(e) {
  const f = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(evTitle(e))}&dates=${f(e.start)}/${f(e.end)}&location=${encodeURIComponent(e.place)}&details=${encodeURIComponent('Muzej za umjetnost i obrt')}`;
}
document.addEventListener('click', (e) => { const b = e.target.closest('[data-ics]'); if (b) { e.preventDefault(); downloadIcs(b.dataset.ics); } });

const evLink = (e) => (e.exhibition ? BASE + 'izlozbe/' + e.exhibition + '/' : `${EV_URL}?q=${encodeURIComponent(evTitle(e))}#dogadanja`);
const rowHtml = (e) => `<li class="ev-row" data-flip-id="${e.id}"><div class="ev-date"><b>${pad(e.date.getDate())}</b><small>${MONTHS[e.date.getMonth()]} · ${e.time}</small></div><div class="ev-type">${esc(evType(e.type))}</div><a class="ev-title" href="${evLink(e)}">${esc(evTitle(e))}</a><div class="ev-place">${esc(e.place)}</div><button class="icon-btn" type="button" data-ics="${e.id}" aria-label="${tx('Dodaj u kalendar', 'Add to calendar')}: ${esc(evTitle(e))}">${CAL}</button></li>`;
const cardHtml = (e) => {
  const c = TYPE_COLOR[e.type] || '#111'; const ink = c === '#D9A441' ? '#111' : '#fff';
  const save = esc(JSON.stringify({ id: 'e-' + e.id, title: evTitle(e), url: EV_URL, motif: TYPE_MOTIF[e.type], color: c }));
  return `<article class="ev-card" data-flip-id="${e.id}"><div class="card-media" style="--c:${c}"><span class="art">${objectSvg(TYPE_MOTIF[e.type], ink)}</span><span class="datebox"><b>${pad(e.date.getDate())}</b><small>${MONTHS[e.date.getMonth()]}</small></span><button class="save-btn" type="button" aria-pressed="false" data-save="${save}" aria-label="${tx('Spremi', 'Save')}: ${esc(evTitle(e))}">${HEART}</button></div><div class="ev-type">${esc(evType(e.type))} · ${DAYS[e.date.getDay()]} ${e.time}</div><h3 class="h3" style="font-size:1.4rem">${esc(evTitle(e))}</h3><p class="card-meta">${esc(e.place)}</p><div class="ev-tags"><span>${esc(evAud(e.audience))}</span><span>${esc(evPrice(e.price))}</span></div><div class="ev-actions">${e.past ? '' : `<button type="button" data-ics="${e.id}" aria-label="iCal: ${esc(evTitle(e))}">${CAL.replace('<svg', '<svg width="16" height="16"')} iCal</button><a href="${gcal(e)}" target="_blank" rel="noopener" aria-label="${tx('Google kalendar', 'Google Calendar')}: ${esc(evTitle(e))} (${tx('otvara se u novoj kartici', 'opens in a new tab')})">${tx('Google kalendar', 'Google Calendar')}</a>`}${e.exhibition ? `<a href="${BASE}izlozbe/${e.exhibition}/" aria-label="${tx('Izložba uz događanje', 'Related exhibition')}: ${esc(evTitle(e))}">${tx('Izložba', 'Exhibition')} →</a>` : ''}</div></article>`;
};

/* ---------------- Naslovnica: izvadak kalendara ---------------- */
function initHomeEvents() {
  const ul = $('[data-home-events]'); if (!ul) return;
  let type = '';
  const render = (animate) => {
    const list = events.filter((e) => !e.past && (!type || e.type === type)).slice(0, 5);
    const state = animate && motion() && window.Flip ? Flip.getState($$('.ev-row', ul)) : null;
    ul.innerHTML = list.length ? list.map(rowHtml).join('') : `<li class="empty" style="display:block;margin-top:1rem"><strong>${tx('Nema nadolazećih događanja ove vrste.', 'No upcoming events of this type.')}</strong>${tx('Pogledajte cijeli kalendar.', 'See the full calendar.')}</li>`;
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
  const resetBtns = $$('[data-reset]'); const panel = $('#panel-list');
  const qs = new URLSearchParams(location.search);
  const one = (v, allowed, d = '') => (allowed.includes(v) ? v : d);
  // Cijelo stanje filtara čita se iz adrese i upisuje natrag u nju (poveznica se može podijeliti)
  const st = {
    type: one(qs.get('tip'), Object.keys(TYPE_EN)), loc: one(qs.get('lok'), ['galerija', 'vanjska']), aud: one(qs.get('publika'), Object.keys(AUD_EN)),
    q: (qs.get('q') || '').trim(), per: one(qs.get('kada'), ['7', 'vikend', '30']), tab: one(qs.get('prikaz'), ['list', 'cal', 'arch'], 'list'), view: one(qs.get('pogled'), ['grid', 'list'], 'grid'),
    day: null, month: new Date(today.getFullYear(), today.getMonth(), 1),
  };
  const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const hay = (e) => norm(`${e.title} ${e.titleEn || ''} ${e.type} ${TYPE_EN[e.type]} ${e.audience} ${AUD_EN[e.audience]} ${e.place}`);

  const filtered = () => events.filter((e) => {
    if (st.tab === 'arch' ? !e.past : e.past) return false;
    if (st.type && e.type !== st.type) return false;
    if (st.loc && e.loc !== st.loc) return false;
    if (st.aud && e.audience !== st.aud) return false;
    if (st.q && !norm(st.q).split(/\s+/).every((w) => hay(e).includes(w))) return false;
    if (st.per && st.tab !== 'arch') {
      const diff = (e.date - today) / 86400000;
      if (st.per === '7' && diff > 7) return false;
      if (st.per === '30' && diff > 30) return false;
      if (st.per === 'vikend') { const dow = today.getDay(); const sat = new Date(today); sat.setDate(sat.getDate() + (dow === 0 ? -1 : 6 - dow)); const sun = new Date(sat); sun.setDate(sun.getDate() + 1); if (!(sameDay(e.date, sat) || sameDay(e.date, sun))) return false; }
    }
    if (st.tab === 'cal' && st.day && !sameDay(e.date, st.day)) return false;
    return true;
  });

  const renderMonth = () => {
    const m = st.month; const first = new Date(m); const startDow = (first.getDay() + 6) % 7;
    const days = []; const start = new Date(first); start.setDate(1 - startDow);
    for (let i = 0; i < 42; i++) { const d = new Date(start); d.setDate(start.getDate() + i); days.push(d); }
    const evs = events.filter((e) => !e.past);
    const ARROW = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="${d}"/></svg>`;
    monthEl.innerHTML = `<div class="month-head"><button class="icon-btn" type="button" data-m="-1" aria-label="${tx('Prethodni mjesec', 'Previous month')}">${ARROW('M15 6l-6 6 6 6')}</button><h3 aria-live="polite">${MONTHS_FULL[m.getMonth()]} ${m.getFullYear()}${EN ? '' : '.'}</h3><button class="icon-btn" type="button" data-m="1" aria-label="${tx('Sljedeći mjesec', 'Next month')}">${ARROW('M9 6l6 6-6 6')}</button></div>
      <div class="month" role="group" aria-label="${tx('Kalendar događanja', 'Events calendar')}">${DOW_SHORT.map((d) => `<div class="dow" aria-hidden="true">${d}</div>`).join('')}
      ${days.map((d) => { const de = evs.filter((e) => sameDay(e.date, d)); const sel = st.day && sameDay(d, st.day); const cls = ['day', d.getMonth() !== m.getMonth() ? 'out' : '', sameDay(d, today) ? 'today' : '', de.length ? 'has' : '', sel ? 'sel' : ''].join(' '); const label = `${d.getDate()}. ${MONTHS_FULL[d.getMonth()]}${de.length ? ', ' + nOf(de.length, ['događanje', 'događanja', 'događanja'], ['event', 'events']) : ''}`; return de.length ? `<button type="button" class="${cls}" data-day="${d.toISOString()}" aria-pressed="${sel ? 'true' : 'false'}"><span class="n">${d.getDate()}<span class="visually-hidden">${label.replace(/^\d+/, '')}:</span></span>${de.slice(0, 2).map((e) => `<span class="dot" style="border-left:3px solid ${TYPE_COLOR[e.type]}">${e.time} ${esc(evTitle(e))}</span>`).join('')}</button>` : `<div class="${cls}" aria-hidden="true"><span class="n">${d.getDate()}</span></div>`; }).join('')}</div>
      <p class="muted" style="margin-top:1rem">${st.day ? `${tx('Prikazujem', 'Showing')} ${st.day.getDate()}. ${MONTHS_FULL[st.day.getMonth()]} · <button type="button" class="linklike" data-day-clear>${tx('prikaži sve', 'show all')}</button>` : tx('Odaberite dan za prikaz događanja.', 'Choose a day to see its events.')}</p>`;
    if (motion()) G.from($$('.day', monthEl), { opacity: 0, y: 10, stagger: { each: 0.008, from: 'start' }, duration: 0.4, ease: 'power2.out' });
  };

  const activeCount = () => [st.type, st.loc, st.aud, st.q, st.per, st.day].filter(Boolean).length;
  const say = debounce((t) => { count.textContent = t; }, 250);
  const syncControls = () => {
    $$('[data-f-type]').forEach((x) => x.setAttribute('aria-pressed', x.dataset.fType === st.type ? 'true' : 'false'));
    $$('[data-f-per]').forEach((x) => x.setAttribute('aria-pressed', x.dataset.fPer === st.per ? 'true' : 'false'));
    $$('[data-view]').forEach((x) => x.setAttribute('aria-pressed', x.dataset.view === st.view ? 'true' : 'false'));
    $('[data-f-loc]').value = st.loc; $('[data-f-aud]').value = st.aud;
    if ($('[data-f-q]').value.trim() !== st.q) $('[data-f-q]').value = st.q;
  };
  const writeUrl = () => {
    const url = new URL(location.href);
    const set = (k, v, d = '') => { if (v && v !== d) url.searchParams.set(k, v); else url.searchParams.delete(k); };
    set('tip', st.type); set('lok', st.loc); set('publika', st.aud); set('q', st.q); set('kada', st.per); set('prikaz', st.tab, 'list'); set('pogled', st.view, 'grid');
    history.replaceState(null, '', url);
  };

  const render = (animate = true) => {
    const res = filtered();
    const n = res.length; const ac = activeCount();
    say(`${nOf(n, ['događanje', 'događanja', 'događanja'], ['event', 'events'])}${st.tab === 'arch' ? tx(' u arhivi', ' in the archive') : ''}${ac ? ` · ${tx('aktivnih filtara', 'active filters')}: ${ac}` : ''}`);
    resetBtns.forEach((b) => { if (!b.closest('[data-empty]')) b.hidden = ac === 0; });
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
    writeUrl();
  };

  $$('[data-f-type]').forEach((c) => c.addEventListener('click', () => { st.type = c.dataset.fType; syncControls(); render(); }));
  $$('[data-f-per]').forEach((c) => c.addEventListener('click', () => { st.per = c.dataset.fPer; syncControls(); render(); }));
  $('[data-f-loc]').addEventListener('change', (e) => { st.loc = e.target.value; render(); });
  $('[data-f-aud]').addEventListener('change', (e) => { st.aud = e.target.value; render(); });
  $('[data-f-q]').addEventListener('input', debounce((e) => { st.q = e.target.value.trim(); render(); }, 180));
  $('[data-filters]').addEventListener('submit', (e) => { e.preventDefault(); st.q = $('[data-f-q]').value.trim(); render(); });
  $$('[data-view]').forEach((b) => b.addEventListener('click', () => { st.view = b.dataset.view; syncControls(); render(false); }));
  resetBtns.forEach((b) => b.addEventListener('click', () => {
    Object.assign(st, { type: '', loc: '', aud: '', q: '', per: '', day: null });
    syncControls(); render(); $('[data-f-q]').focus();
  }));
  monthEl.addEventListener('click', (e) => {
    const mb = e.target.closest('[data-m]'); if (mb) { const dir = mb.dataset.m; st.month = new Date(st.month.getFullYear(), st.month.getMonth() + Number(dir), 1); renderMonth(); $(`[data-m="${dir}"]`, monthEl)?.focus(); return; }
    const d = e.target.closest('[data-day]'); if (d) { const iso = d.dataset.day; st.day = new Date(iso); render(); $(`[data-day="${iso}"]`, monthEl)?.focus(); return; }
    if (e.target.closest('[data-day-clear]')) { st.day = null; render(); $('[data-m="-1"]', monthEl)?.focus(); }
  });
  // Kartice (tabovi) s pomičnom crtom
  const ink = $('[data-tab-ink]');
  const moveInk = (t) => { ink.style.width = t.offsetWidth + 'px'; ink.style.transform = `translateX(${t.offsetLeft}px)`; };
  const tabs = $$('[data-tab]');
  const setTab = (name) => {
    st.tab = name; st.day = null;
    tabs.forEach((x) => { const on = x.dataset.tab === name; x.setAttribute('aria-selected', on ? 'true' : 'false'); x.tabIndex = on ? 0 : -1; if (on) { moveInk(x); panel.setAttribute('aria-labelledby', x.id); } });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => { setTab(t.dataset.tab); render(); });
    t.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length]; n.focus(); n.click(); } });
  });
  syncControls(); setTab(st.tab);
  requestAnimationFrame(() => moveInk($('[data-tab][aria-selected="true"]'))); addEventListener('resize', () => moveInk($('[data-tab][aria-selected="true"]')));
  document.fonts?.ready.then(() => moveInk($('[data-tab][aria-selected="true"]')));
  count.textContent = '';
  render(false);
  if (motion()) G.from($$('.ev-card', wrap), { opacity: 0, y: 40, stagger: 0.06, duration: 0.9, ease: 'expo.out', delay: 0.2 });
}

/* ---------------- Zbirke: pretraga i filtri predmeta ---------------- */
function initItems() {
  const grid = $('[data-item-grid]'); if (!grid) return;
  const count = $('[data-item-count]'); const empty = $('[data-item-empty]'); const resetBtns = $$('[data-item-reset]'); const section = $('#predmeti');
  const qs = new URLSearchParams(location.search);
  const colls = [...new Set(ITEMS.map((i) => i.coll)), ...$$('[data-coll-link]').map((a) => a.dataset.collLink)];
  const st = { coll: colls.includes(qs.get('zbirka')) ? qs.get('zbirka') : '', per: PERIODS[qs.get('razdoblje')] ? qs.get('razdoblje') : '', mat: MATERIALS[qs.get('materijal')] ? qs.get('materijal') : '', q: (qs.get('q') || '').trim() };
  const hay = (i) => norm(`${i.name} ${i.nameEn} ${i.collName} ${i.collNameEn} ${MATERIALS[i.material].hr} ${MATERIALS[i.material].en} ${PERIODS[i.period].hr} ${PERIODS[i.period].en}`);
  const say = debounce((t) => { count.textContent = t; }, 250);
  const sync = () => {
    $('[data-i-coll]').value = st.coll; $('[data-i-mat]').value = st.mat;
    $$('[data-i-per]').forEach((c) => c.setAttribute('aria-pressed', c.dataset.iPer === st.per ? 'true' : 'false'));
    if ($('[data-i-q]').value.trim() !== st.q) $('[data-i-q]').value = st.q;
  };
  const render = () => {
    const res = ITEMS.filter((i) => (!st.coll || i.coll === st.coll) && (!st.per || String(i.period) === st.per) && (!st.mat || i.material === st.mat) && (!st.q || norm(st.q).split(/\s+/).every((w) => hay(i).includes(w))));
    const ac = [st.coll, st.per, st.mat, st.q].filter(Boolean).length;
    say(`${nOf(res.length, ['predmet', 'predmeta', 'predmeta'], ['object', 'objects'])}${ac ? ` · ${tx('aktivnih filtara', 'active filters')}: ${ac}` : ''}`);
    resetBtns.forEach((b) => { if (!b.closest('[data-item-empty]')) b.hidden = ac === 0; });
    grid.innerHTML = res.map((i) => `<li><a class="item" href="${BASE}zbirke/predmet/"${EN ? ' hreflang="hr"' : ''}><span class="tile" style="background:${i.color};color:${i.ink};${i.color === '#ffffff' ? 'box-shadow:inset 0 0 0 1px #E3E3E3' : ''}">${objectSvg(i.motif, i.ink)}<span class="badge">${tx('primjer', 'sample')}</span></span><span class="name">${esc(EN ? i.nameEn : i.name)}</span><span class="card-meta">${esc(EN ? i.collNameEn : i.collName)} · ${PERIODS[i.period][LANG]} · ${MATERIALS[i.material][LANG]}</span></a></li>`).join('');
    grid.hidden = res.length === 0; empty.hidden = res.length > 0;
    const url = new URL(location.href);
    const set = (k, v) => { if (v) url.searchParams.set(k, v); else url.searchParams.delete(k); };
    set('zbirka', st.coll); set('razdoblje', st.per); set('materijal', st.mat); set('q', st.q);
    history.replaceState(null, '', url);
  };
  $('[data-i-coll]').addEventListener('change', (e) => { st.coll = e.target.value; render(); });
  $('[data-i-mat]').addEventListener('change', (e) => { st.mat = e.target.value; render(); });
  $$('[data-i-per]').forEach((c) => c.addEventListener('click', () => { st.per = c.dataset.iPer; sync(); render(); }));
  $('[data-i-q]').addEventListener('input', debounce((e) => { st.q = e.target.value.trim(); render(); }, 180));
  $('[data-item-filters]').addEventListener('submit', (e) => { e.preventDefault(); st.q = $('[data-i-q]').value.trim(); render(); });
  resetBtns.forEach((b) => b.addEventListener('click', () => { Object.assign(st, { coll: '', per: '', mat: '', q: '' }); sync(); render(); $('[data-i-q]').focus(); }));
  // Klik na zbirku filtrira predmete bez ponovnog učitavanja stranice
  $$('[data-coll-link]').forEach((a) => a.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault(); Object.assign(st, { coll: a.dataset.collLink, per: '', mat: '', q: '' }); sync(); render();
    history.replaceState(null, '', `${location.pathname}?zbirka=${st.coll}#predmeti`);
    if (lenis) lenis.scrollTo(section, { offset: -90 }); else section.scrollIntoView({ behavior: motion() ? 'smooth' : 'auto' });
    section.focus({ preventScroll: true });
  }));
  sync(); count.textContent = ''; render();
}

/* ---------------- Izložba: povezana događanja + lightbox ---------------- */
function initExhibition() {
  const rel = $('[data-related]');
  if (rel) {
    const list = events.filter((e) => e.exhibition === rel.dataset.related && !e.past);
    rel.innerHTML = list.length ? list.map(rowHtml).join('') : `<li class="empty" style="display:block"><strong>${tx('Uskoro novi programi.', 'New programmes coming soon.')}</strong>${tx('Prijavite se na newsletter i javit ćemo vam.', 'Subscribe to the newsletter and we will let you know.')}</li>`;
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
    a.innerHTML = `<span class="art">${objectSvg(it.motif, it.ink)}</span><span class="cap"><span>${esc(it.name)}</span><span style="font-weight:400">${esc(it.collection)}</span></span>`;
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
      // Čitaču zaslona naslov ostaje jedna cjelina: naziv je na <h1>, a razdvojena slova su skrivena
      const h1 = $('[data-hero-title]'); h1.setAttribute('aria-label', lines.map((l) => l.textContent.trim()).join(' ')); lines.forEach((l) => l.setAttribute('aria-hidden', 'true'));
      lines.forEach((l, i) => { const s = SplitText.create(l, { type: 'chars', aria: 'none' }); tl.from(s.chars, { yPercent: 115, rotate: 6, duration: 1.3, stagger: 0.035 }, 0.1 + i * 0.12); });
    }
    // Samo pomak, bez prozirnosti: tekst i gumbi imaju pun kontrast i tijekom ulazne animacije
    tl.from('[data-hero-fade]', { y: 30, duration: 1.1, stagger: 0.1 }, 0.5);
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
function updateMotionState() {
  const el = $('[data-motion-state]'); if (!el) return;
  const sys = matchMedia('(prefers-reduced-motion: reduce)').matches; const sw = root.classList.contains('reduce-motion');
  el.textContent = sys || sw
    ? tx(`Smanjeno kretanje je aktivno (${sys ? 'postavka sustava' : 'prekidač na stranici'}): animacije i prijelazi su isključeni, točka lijevo miruje.`, `Reduced motion is active (${sys ? 'system setting' : 'on-page switch'}): animations and transitions are off, the dot on the left is still.`)
    : tx('Animacije su uključene: sustav ne traži smanjeno kretanje. Uključite „Smanji animacije” u izborniku Pristupačnost i točka lijevo će stati.', 'Motion is on: the system does not request reduced motion. Turn on “Reduce motion” in the Accessibility menu and the dot on the left will stop.');
}
initStatus(); initA11y(); initCookies(); initSaved(); initShare(); initForms(); initSearch(); initSearchPage(); initHeader();
initHomeEvents(); initEventsPage(); initItems(); initExhibition(); initWall(); initViewer(); initLoupe(); initCompare(); initMap(); updateMotionState();
initMotion();
syncSaved();
