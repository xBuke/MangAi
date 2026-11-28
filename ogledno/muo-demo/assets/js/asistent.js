// „Pitaj Muzej” – AI asistent oglednog prijedloga.
// Učitava se tek na prvi klik (app.js → import()), pa ne utječe na učitavanje stranice; stranica je u cijelosti upotrebljiva i bez njega.
// Odgovore daje poslužiteljska funkcija /api/muo-pitaj isključivo iz sadržaja stranice. Pitanja se nigdje ne spremaju;
// razgovor ostaje samo u ovoj kartici preglednika (sessionStorage) da preživi prelazak na stranicu izvora.
const BODY = document.body;
const BASE = BODY.dataset.base || '/';
const EN = BODY.dataset.lang === 'en';
const tx = (hr, en) => (EN ? en : hr);
const API = BODY.dataset.askApi || '/api/muo-pitaj';
const KEY = 'muo-pitaj';
const MAX = 300;
const CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
const SUGGEST = EN
  ? ['Is the Museum open today?', 'How much are tickets?', 'What can I see right now?', 'How do I book a school group?', 'Is the venue wheelchair accessible?']
  : ['Je li Muzej danas otvoren?', 'Koliko koštaju ulaznice?', 'Što se sada može vidjeti?', 'Kako najaviti školsku grupu?', 'Je li prostor pristupačan za kolica?'];

let panel; let log; let form; let input; let sendBtn; let suggest; let clearBtn;
let busy = false;
let history = [];

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const linkAttrs = (path) => `href="${esc(BASE + path)}"${EN && !/^en\//.test(path) ? ' hreflang="hr"' : ''}`;

// Odgovor stiže kao običan tekst s poveznicama [naziv](putanja), **podebljanim** i crticama; sve ostalo se prikazuje doslovno.
function render(text) {
  const inline = (s) => esc(s)
    .replace(/\[([^\]]{1,120})\]\(([^)\s]{0,200})\)/g, (m, label, href) => {
      if (/^mailto:muo@muo\.hr$/i.test(href)) return `<a href="mailto:muo@muo.hr">${label}</a>`;
      if (/^[a-z]+:|^\/\//i.test(href)) return label; // vanjske adrese ne prikazujemo kao poveznice
      return `<a ${linkAttrs(href.replace(/^\.?\//, ''))}>${label}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  const out = []; let list = [];
  const flush = () => { if (list.length) { out.push('<ul>' + list.map((l) => `<li>${l}</li>`).join('') + '</ul>'); list = []; } };
  String(text).split(/\n+/).map((l) => l.trim()).filter(Boolean).forEach((l) => {
    const m = /^[-•*]\s+(.*)$/.exec(l);
    if (m) list.push(inline(m[1])); else { flush(); out.push(`<p>${inline(l)}</p>`); }
  });
  flush();
  return out.join('');
}

function bubble(m) {
  const el = document.createElement('div');
  el.className = 'ask-msg ask-msg--' + (m.role === 'user' ? 'user' : 'bot') + (m.error ? ' ask-msg--error' : '');
  if (m.role === 'user') {
    el.innerHTML = `<span class="visually-hidden">${tx('Vaše pitanje', 'Your question')}: </span><p>${esc(m.content)}</p>`;
  } else {
    const src = (m.sources || []).length
      ? `<p class="ask-src">${tx('Izvor', 'Source')}: ${m.sources.map((s) => `<a ${linkAttrs(s.url)}>${esc(s.title)}</a>`).join(' · ')}</p>` : '';
    const contact = m.unknown
      ? `<p class="ask-src">${tx('Pitajte Muzej izravno', 'Ask the Museum directly')}: <a href="mailto:muo@muo.hr">muo@muo.hr</a> · <a ${linkAttrs('muzej/#odjeli')}>${tx('Odjeli i kontakti', 'Departments and contacts')}</a></p>` : '';
    el.innerHTML = `<span class="ask-who"><span class="visually-hidden">${tx('Odgovor', 'Answer')}: </span><span aria-hidden="true">${tx('AI asistent', 'AI assistant')}</span></span>${render(m.content)}${src}${contact}`;
  }
  return el;
}

function add(m, store = true) {
  const el = bubble(m);
  log.append(el);
  log.scrollTop = log.scrollHeight;
  if (store && !m.error) {
    history.push({ role: m.role, content: m.content, sources: m.sources, unknown: m.unknown });
    history = history.slice(-12);
    try { sessionStorage.setItem(KEY, JSON.stringify(history)); } catch (e) { /* privatni način rada */ }
  }
  refresh();
  return el;
}

function refresh() {
  suggest.hidden = history.length > 0;
  clearBtn.hidden = history.length === 0;
}

function setBusy(on) {
  busy = on;
  sendBtn.disabled = on;
  log.setAttribute('aria-busy', on ? 'true' : 'false');
}

async function ask(q) {
  q = q.trim().slice(0, MAX);
  if (!q || busy) return;
  add({ role: 'user', content: q });
  input.value = '';
  setBusy(true);
  const wait = document.createElement('div');
  wait.className = 'ask-msg ask-msg--bot ask-wait';
  wait.innerHTML = `<p>${tx('Tražim odgovor na stranici…', 'Looking for the answer on the site…')}</p>`;
  log.append(wait); log.scrollTop = log.scrollHeight;
  let m;
  try {
    const r = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lang: EN ? 'en' : 'hr',
        page: location.pathname.replace(BASE, ''),
        messages: history.filter((h) => !h.error).slice(-8).map((h) => ({ role: h.role, content: h.content })),
      }),
    });
    if (r.status === 429) m = { role: 'assistant', error: true, content: tx('Previše pitanja u kratkom vremenu. Pokušajte ponovno za nekoliko minuta.', 'Too many questions in a short time. Please try again in a few minutes.') };
    else if (!r.ok) throw new Error(String(r.status));
    else {
      const d = await r.json();
      m = { role: 'assistant', content: String(d.reply || ''), sources: Array.isArray(d.sources) ? d.sources.slice(0, 3) : [], unknown: !!d.unknown };
      if (!m.content) throw new Error('empty');
    }
  } catch (e) {
    m = { role: 'assistant', error: true, content: tx(
      'Asistent trenutačno nije dostupan. Stranica radi i bez njega: pogledajte [Posjet](posjet/) ili [pretragu](pretraga/).',
      'The assistant is not available right now. The site works without it: see [Visit](posjet/) or [search](en/search/).') };
  }
  wait.remove();
  add(m);
  setBusy(false);
  if (panel.classList.contains('open')) input.focus();
}

export function mount() {
  if (panel) return;
  panel = document.createElement('div');
  panel.className = 'drawer ask';
  panel.dataset.panel = 'ask';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-labelledby', 'ask-h');
  panel.setAttribute('aria-describedby', 'ask-note');
  panel.setAttribute('aria-hidden', 'true');
  panel.inert = true;
  panel.innerHTML = `
  <div class="drawer-head"><h2 id="ask-h">${tx('Pitaj Muzej', 'Ask the Museum')}</h2><button class="icon-btn" type="button" data-close aria-label="${tx('Zatvori', 'Close')}">${CLOSE}</button></div>
  <p class="ask-note" id="ask-note"><span class="ask-badge">${tx('AI asistent · ogledni prijedlog', 'AI assistant · design proposal')}</span> ${tx(
    'Odgovara umjetna inteligencija, isključivo iz sadržaja ove ogledne stranice, i uz odgovor daje poveznicu na izvor. Radno vrijeme, cijene i termini ovdje su primjeri. Ne upisujte osobne podatke; pitanja se ne spremaju.',
    'Answers come from artificial intelligence, only from the content of this design proposal, with a link to the source. Opening hours, prices and dates here are examples. Please do not enter personal data; questions are not stored.')}</p>
  <div class="ask-log" role="log" aria-live="polite" aria-relevant="additions" aria-label="${tx('Razgovor s asistentom', 'Conversation with the assistant')}" tabindex="0"></div>
  <div class="ask-suggest" role="group" aria-labelledby="ask-sug-h"><p id="ask-sug-h">${tx('Ponuđena pitanja', 'Suggested questions')}</p>${SUGGEST.map((q) => `<button type="button" class="ask-chip" data-ask-q>${esc(q)}</button>`).join('')}</div>
  <form class="ask-form" novalidate>
    <label for="ask-q">${tx('Vaše pitanje', 'Your question')}</label>
    <div class="ask-row"><input id="ask-q" type="text" maxlength="${MAX}" autocomplete="off" enterkeyhint="send" aria-describedby="ask-hint"><button class="btn" type="submit">${tx('Pošalji', 'Send')}</button></div>
    <p class="ask-hint" id="ask-hint">${tx(`Najviše ${MAX} znakova. Stranica radi i bez asistenta.`, `Up to ${MAX} characters. The site works without the assistant.`)} <button type="button" class="linklike" data-ask-clear hidden>${tx('Obriši razgovor', 'Clear conversation')}</button></p>
  </form>`;
  document.body.append(panel);
  log = panel.querySelector('.ask-log'); form = panel.querySelector('form'); input = panel.querySelector('#ask-q');
  sendBtn = form.querySelector('[type=submit]'); suggest = panel.querySelector('.ask-suggest'); clearBtn = panel.querySelector('[data-ask-clear]');
  try { history = JSON.parse(sessionStorage.getItem(KEY) || '[]').filter((m) => m && typeof m.content === 'string'); } catch (e) { history = []; }
  history.forEach((m) => log.append(bubble(m)));
  refresh();
  form.addEventListener('submit', (e) => { e.preventDefault(); ask(input.value); });
  panel.addEventListener('click', (e) => {
    const q = e.target.closest('[data-ask-q]');
    if (q) { ask(q.textContent); return; }
    if (e.target.closest('[data-ask-clear]')) {
      history = []; log.innerHTML = '';
      try { sessionStorage.removeItem(KEY); } catch (err) { /* */ }
      refresh(); input.focus();
    }
  });
}

// Poziva app.js nakon otvaranja panela: na računalu fokus ide u polje za pitanje; na dodirnim uređajima ostaje
// na gumbu „Zatvori” da tipkovnica ne prekrije ponuđena pitanja.
export function opened() {
  log.scrollTop = log.scrollHeight;
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) setTimeout(() => input.focus(), 60);
}
