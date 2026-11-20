/* MangAI demo primjeri – zajednički sustav.
 * Svaki demo učita svoj podatkovni file (window.MANGAI_DEMO = { hr: {...}, en: {...} }) i ovaj file.
 * Lijevo: razgovor s asistentom, na WhatsAppu ili u prozoru web stranice (što vidi klijent).
 * Desno: nadzorna ploča vlasnika. Kartica upita puni se dok razgovor traje, a na kraju se
 * ispišu radnje koje je asistent obavio i novi red sjedne u tablicu.
 */
(function () {
  'use strict';

  var params = new URLSearchParams(location.search);
  var lang = params.get('lang') === 'en' ? 'en' : 'hr';
  var data = window.MANGAI_DEMO && (window.MANGAI_DEMO[lang] || window.MANGAI_DEMO.hr);
  if (!data) return;
  document.documentElement.lang = lang;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var UI = {
    hr: {
      home: '/', allDemos: '/primjeri/', contact: '/kontakt/',
      allDemosLabel: 'Svi primjeri', contactLabel: 'Pošalji upit',
      clientSees: 'Što vidi vaš klijent', youSee: 'Što u istom trenutku vidite vi',
      typing: 'piše…', restart: 'Kreni ispočetka', newBadge: 'Novo',
      conversations: 'Razgovori koje je obradio asistent', automations: 'Automatizacije',
      demoNote: 'Demo s izmišljenim podacima i brojkama. Stvarni asistent odgovara iz vaših podataka, a kad nije siguran, prepušta razgovor vama. Povezivanje s kalendarom, WhatsAppom ili sustavom za rezervacije ovisi o alatima koje već koristite, pa to provjerimo na prvom razgovoru i upišemo u ponudu.',
      featuresTitle: 'Što asistent radi', otherDemos: 'Ostali primjeri',
      langSwitch: 'EN', langHref: '?lang=en', online: 'na mreži',
      live: 'Uživo', recordKicker: 'Asistent upravo bilježi', waiting: 'čeka odgovor',
      saved: 'Spremljeno', didTitle: 'Što je asistent napravio', pick: 'Odaberite odgovor',
      replied: 'Asistent je odgovorio za 3 sekunde', assistant: 'AI asistent', hint: 'Odgovarajte kao klijent i pratite ploču desno.',
      hintMobile: 'Odgovarajte kao klijent, a ploča vlasnika je ispod.', seeBoard: 'Pogledajte što je stiglo vlasniku'
    },
    en: {
      home: '/en/', allDemos: '/en/#examples', contact: '/en/#contact',
      allDemosLabel: 'All examples', contactLabel: 'Send an enquiry',
      clientSees: 'What your client sees', youSee: 'What you see at the same moment',
      typing: 'typing…', restart: 'Start over', newBadge: 'New',
      conversations: 'Conversations handled by the assistant', automations: 'Automations',
      demoNote: 'Demo with made-up data and figures. A real assistant answers from your own information and hands the conversation to you when it is unsure. Connecting to your calendar, WhatsApp or booking system depends on the tools you already use, so we check that on the first call and put it in the quote.',
      featuresTitle: 'What the assistant does', otherDemos: 'Other examples',
      langSwitch: 'HR', langHref: '?', online: 'online',
      live: 'Live', recordKicker: 'The assistant is recording', waiting: 'waiting for a reply',
      saved: 'Saved', didTitle: 'What the assistant did', pick: 'Choose a reply',
      replied: 'The assistant replied in 3 seconds', assistant: 'AI assistant', hint: 'Reply as the client and watch the board on the right.',
      hintMobile: 'Reply as the client; the owner’s board is below.', seeBoard: 'See what reached the owner'
    }
  }[lang];

  var DEMOS = [
    { id: 'salon', hr: 'Beauty salon', en: 'Beauty salon' },
    { id: 'apartmani', hr: 'Apartmani i turizam', en: 'Holiday rentals' },
    { id: 'ordinacija', hr: 'Ordinacija', en: 'Clinic' },
    { id: 'odvjetnik', hr: 'Odvjetnički ured', en: 'Law office' },
    { id: 'nekretnine', hr: 'Nekretnine', en: 'Real estate' },
    { id: 'opcina', hr: 'Općina i grad', en: 'Municipality' }
  ];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var theme = data.theme || {};
  var chrome = theme.chrome === 'browser' ? 'browser' : 'whatsapp';
  var record = data.record || null;
  var rec = {};

  /** Zamijeni {ključ} vrijednošću iz kartice upita */
  function fill(text) {
    return String(text == null ? '' : text).replace(/\{(\w+)\}/g, function (m, key) {
      return rec[key] != null ? rec[key] : m;
    });
  }

  /* ---------- Stranica ---------- */

  document.title = data.pageTitle + ' | MangAI';
  var root = document.getElementById('demo-root');
  var vertical = root.getAttribute('data-vertical');
  root.className = 'demo demo-' + chrome;
  if (theme.accent) root.style.setProperty('--demo-accent', theme.accent);
  if (theme.soft) root.style.setProperty('--demo-soft', theme.soft);

  var initial = esc(data.assistantInitial || data.business.charAt(0));
  var chatHead =
    '<div class="phone-head">' +
      '<span class="phone-avatar" aria-hidden="true">' + initial + '</span>' +
      '<span><strong>' + esc(data.assistant) + '</strong><small>' + (chrome === 'browser' ? UI.assistant : esc(data.channel)) + ' · ' + UI.online + '</small></span>' +
    '</div>';
  var chatBody =
    '<div class="phone-msgs" id="phone-msgs" aria-live="polite"></div>' +
    '<div class="phone-options" id="phone-options" aria-label="' + UI.pick + '"></div>';

  var device;
  if (chrome === 'browser') {
    var site = data.site || {};
    device =
      '<div class="browser">' +
        '<div class="browser-bar" aria-hidden="true"><span class="browser-dots"><i></i><i></i><i></i></span><span class="browser-url">' + esc(site.url || '') + '</span></div>' +
        '<div class="browser-site" aria-hidden="true">' +
          '<div class="site-nav"><strong>' + esc(data.business) + '</strong>' + (site.nav || []).map(function (n) { return '<span>' + esc(n) + '</span>'; }).join('') + '</div>' +
          '<div class="site-hero"><p>' + esc(site.tagline || '') + '</p><i></i><i></i></div>' +
          '<div class="site-cards"><i></i><i></i><i></i></div>' +
        '</div>' +
        '<div class="widget">' + chatHead + chatBody + '</div>' +
      '</div>';
  } else {
    device = '<div class="phone">' + chatHead + chatBody + '</div>';
  }

  var LOGO = '<svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect width="16" height="16" rx="3" fill="#0D1514"/><rect x="10" y="1" width="2" height="1" fill="#8FD16A"/><rect x="8" y="2" width="3" height="1" fill="#8FD16A"/><rect x="11" y="2" width="1" height="1" fill="#5FA544"/><rect x="8" y="3" width="2" height="1" fill="#8FD16A"/><rect x="10" y="3" width="1" height="1" fill="#5FA544"/><rect x="6" y="4" width="3" height="1" fill="#FFC93C"/><rect x="9" y="4" width="1" height="1" fill="#0D1514"/><rect x="4" y="5" width="8" height="1" fill="#FFC93C"/><rect x="3" y="6" width="1" height="1" fill="#FFC93C"/><rect x="4" y="6" width="2" height="1" fill="#FFF1C2"/><rect x="6" y="6" width="7" height="1" fill="#FFC93C"/><rect x="3" y="7" width="1" height="1" fill="#FFC93C"/><rect x="4" y="7" width="1" height="1" fill="#FFF1C2"/><rect x="5" y="7" width="8" height="1" fill="#FFC93C"/><rect x="13" y="7" width="1" height="1" fill="#F08A2C"/><rect x="2" y="8" width="11" height="1" fill="#FFC93C"/><rect x="13" y="8" width="1" height="1" fill="#F08A2C"/><rect x="2" y="9" width="10" height="1" fill="#FFC93C"/><rect x="12" y="9" width="2" height="1" fill="#F08A2C"/><rect x="2" y="10" width="1" height="1" fill="#F08A2C"/><rect x="3" y="10" width="8" height="1" fill="#FFC93C"/><rect x="11" y="10" width="3" height="1" fill="#F08A2C"/><rect x="3" y="11" width="1" height="1" fill="#F08A2C"/><rect x="4" y="11" width="6" height="1" fill="#FFC93C"/><rect x="10" y="11" width="3" height="1" fill="#F08A2C"/><rect x="13" y="11" width="1" height="1" fill="#D96E12"/><rect x="3" y="12" width="3" height="1" fill="#F08A2C"/><rect x="6" y="12" width="2" height="1" fill="#FFC93C"/><rect x="8" y="12" width="4" height="1" fill="#F08A2C"/><rect x="12" y="12" width="1" height="1" fill="#D96E12"/><rect x="4" y="13" width="1" height="1" fill="#D96E12"/><rect x="5" y="13" width="6" height="1" fill="#F08A2C"/><rect x="11" y="13" width="1" height="1" fill="#D96E12"/><rect x="6" y="14" width="4" height="1" fill="#D96E12"/></svg>';
  var ARR = '<span class="arr" aria-hidden="true"><i></i><i></i></span>';
  var NAV = lang === 'en' ? [['/en/#services','Services'],['/en/#examples','Examples'],['/en/#public-sector','Public sector'],['/en/#how','About'],['/en/blog/','Blog']] : [['/usluge/','Usluge'],['/primjeri/','Primjeri'],['/javni-sektor/','Javni sektor'],['/o-meni/','O meni'],['/blog/','Blog']];
  var langSw = lang === 'en'
    ? '<a href="?" hreflang="hr" lang="hr">HR</a> / <span aria-current="page">EN</span>'
    : '<span aria-current="page">HR</span> / <a href="?lang=en" hreflang="en" lang="en">EN</a>';
  var navCur = lang === 'en' ? '/en/#examples' : '/primjeri/';
  var headerHtml =
    '<header class="nav"><div class="nav-row">' +
      '<a href="' + UI.home + '" class="logo" aria-label="MangAI">' + LOGO + '<span class="logo-word" aria-hidden="true">Mang<b>AI</b></span></a>' +
      '<nav class="nav-pill" aria-label="' + (lang === 'en' ? 'Main menu' : 'Glavni izbornik') + '">' +
        NAV.map(function (n) { return '<a href="' + n[0] + '"' + (n[0] === navCur ? ' aria-current="page"' : '') + '>' + n[1] + '</a>'; }).join('') +
      '</nav>' +
      '<div class="nav-right"><span class="lang">' + langSw + '</span>' +
        '<a href="' + UI.contact + '" class="btn">' + UI.contactLabel + ' ' + ARR + '</a>' +
        '<button type="button" class="nav-toggle" aria-label="' + (lang === 'en' ? 'Open menu' : 'Otvori izbornik') + '" aria-expanded="false" aria-controls="nav-menu"><span></span></button>' +
      '</div>' +
    '</div></header>' +
    '<div class="m-menu" id="nav-menu">' +
      NAV.concat([[UI.contact, lang === 'en' ? 'Contact' : 'Kontakt']]).map(function (n) { return '<a class="m-link" href="' + n[0] + '">' + n[1] + '</a>'; }).join('') +
      '<div class="m-foot"><a href="' + UI.contact + '" class="btn">' + UI.contactLabel + ' ' + ARR + '</a><span class="lang">' + langSw + '</span></div>' +
    '</div><div id="nav-menu-backdrop" aria-hidden="true"></div>';

  var footCols = lang === 'en'
    ? [['Explore', [['/en/#services','Services'],['/en/#examples','Examples'],['/en/#public-sector','Public sector'],['/en/blog/','Blog']]],
       ['Legal', [['/en/terms-of-business.html','Terms of business'],['/privacy.html','Privacy policy'],['/terms.html','Terms of use']]],
       ['Contact', [['tel:+385923557476','+385 92 355 7476'],['mailto:marko@mangai.hr','marko@mangai.hr']]]]
    : [['Usluge', [['/usluge/izrada-web-stranica/','Izrada web stranica'],['/usluge/ai-chatbot/','AI chatbot'],['/usluge/ai-automatizacija/','AI automatizacija'],['/usluge/aplikacije-po-mjeri/','Aplikacije po mjeri'],['/usluge/odrzavanje/','Održavanje i hosting']]],
       ['Stranice', [['/primjeri/','Primjeri'],['/javni-sektor/','Javni sektor'],['/o-meni/','O meni'],['/kontakt/','Kontakt'],['/blog/','Blog']]],
       ['Kontakt', [['tel:+385923557476','+385 92 355 7476'],['mailto:marko@mangai.hr','marko@mangai.hr'],['/uvjeti-poslovanja.html','Uvjeti poslovanja'],['/privacy_hr.html','Pravila privatnosti']]]];
  var footerHtml =
    '<footer class="site-foot"><div class="foot-blocks" data-foot-blocks aria-hidden="true"></div><div class="footer">' +
      '<div class="foot-main"><div class="mascot" data-mascot><a class="bubble" href="' + UI.contact + '">' + (lang === 'en' ? 'Let’s<br>talk!' : 'Javite<br>se!') + '</a></div>' +
        '<div class="foot-cols">' + footCols.map(function (c) {
          return '<div><h2>' + c[0] + '</h2><ul>' + c[1].map(function (l) { return '<li><a href="' + l[0] + '">' + l[1] + '</a></li>'; }).join('') + '</ul></div>';
        }).join('') + '</div></div>' +
      '<div class="foot-bottom"><p class="foot-word" aria-hidden="true">MangAI</p><p class="foot-legal">MangAI, obrt za računalno programiranje i savjetovanje, vl. Marko Škorić · Vukovarska 5, 20340 Ploče · MBO: 99415437<br>&copy; ' + new Date().getFullYear() + ' MangAI</p></div>' +
    '</div></footer>';

  root.innerHTML =
    headerHtml +
    '<main id="main" class="demo-page">' +
      '<section class="page-hero"><div class="wrap">' +
        '<nav class="crumbs" aria-label="' + (lang === 'en' ? 'Breadcrumb' : 'Putanja') + '"><a href="' + UI.home + '">' + (lang === 'en' ? 'Home' : 'Početna') + '</a><span class="crumb-sep" aria-hidden="true">/</span><a href="' + UI.allDemos + '">' + UI.allDemosLabel + '</a><span class="crumb-sep" aria-hidden="true">/</span><span aria-current="page">' + esc(data.business) + '</span></nav>' +
        '<p class="demo-kicker"><span class="live-dot" aria-hidden="true"></span>Demo · ' + esc(data.business) + '</p>' +
        '<h1>' + esc(data.title) + '</h1>' +
        '<p class="page-lead">' + esc(data.lead) + '</p>' +
        '<p class="demo-hint"><span class="hint-wide">' + UI.hint + '</span><span class="hint-narrow">' + UI.hintMobile + '</span></p>' +
      '</div></section>' +
      '<section class="section demo-section"><div class="wrap">' +
      '<div class="demo-stage">' +
        '<section class="demo-client" aria-labelledby="demo-client-title">' +
          '<h2 id="demo-client-title" class="demo-col-title">' + UI.clientSees + '</h2>' +
          '<div class="device">' + device + '</div>' +
          '<a class="see-board" id="see-board" href="#demo-board" hidden>' + UI.seeBoard + ' ↓</a>' +
        '</section>' +
        '<section class="demo-owner" aria-labelledby="demo-owner-title">' +
          '<h2 id="demo-owner-title" class="demo-col-title">' + UI.youSee + '</h2>' +
          '<div class="board" id="demo-board">' +
            '<div class="board-head"><strong>' + esc(data.business) + '</strong><span class="board-live"><span class="live-dot" aria-hidden="true"></span>' + UI.live + ' · ' + esc(data.boardSubtitle) + '</span></div>' +
            (record ? '<div class="record" id="record" aria-live="polite"></div>' : '') +
            '<div class="board-toast" id="board-toast" role="status" hidden></div>' +
            '<dl class="kpis" id="kpis"></dl>' +
            '<h3 class="board-title">' + esc(data.tableTitle) + '</h3>' +
            '<div class="table-wrap"><table class="board-table"><thead><tr id="table-head"></tr></thead><tbody id="table-body"></tbody></table></div>' +
            '<h3 class="board-title">' + UI.conversations + '</h3>' +
            '<ul class="inbox" id="inbox"></ul>' +
            '<h3 class="board-title">' + UI.automations + '</h3>' +
            '<ul class="autos" id="autos"></ul>' +
          '</div>' +
        '</section>' +
      '</div>' +
      '<p class="demo-note">' + UI.demoNote + '</p>' +
      '<section class="demo-features">' +
        '<h2>' + UI.featuresTitle + '</h2>' +
        '<ul>' + data.features.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>' +
        '<a class="btn btn-primary" href="' + UI.contact + '">' + esc(data.cta) + '</a>' +
      '</section>' +
      '<nav class="demo-others" aria-label="' + UI.otherDemos + '">' +
        '<h2>' + UI.otherDemos + '</h2>' +
        '<ul>' + DEMOS.filter(function (d) { return d.id !== vertical; }).map(function (d) {
          return '<li><a href="/demo/' + d.id + '/' + (lang === 'en' ? '?lang=en' : '') + '">' + esc(d[lang]) + '</a></li>';
        }).join('') + '</ul>' +
      '</nav>' +
    '</div></section></main>' +
    footerHtml;

  /* ---------- Nadzorna ploča ---------- */

  var kpiEl = document.getElementById('kpis');
  var headEl = document.getElementById('table-head');
  var bodyEl = document.getElementById('table-body');
  var inboxEl = document.getElementById('inbox');
  var autosEl = document.getElementById('autos');
  var toastEl = document.getElementById('board-toast');
  var recordEl = document.getElementById('record');
  var seeBoardEl = document.getElementById('see-board');
  var kpiValues = {};
  var timers = [];

  function later(fn, ms) {
    var t = setTimeout(fn, reduceMotion ? 0 : ms);
    timers.push(t);
    return t;
  }

  function renderKpis() {
    kpiEl.innerHTML = data.kpis.map(function (k) {
      var v = kpiValues[k.key] != null ? kpiValues[k.key] : k.value;
      return '<div class="kpi" data-key="' + esc(k.key) + '"><dt>' + esc(k.label) + '</dt><dd>' + esc(v) + (k.suffix ? esc(k.suffix) : '') + '</dd></div>';
    }).join('');
  }

  function rowHtml(cells, isNew) {
    return '<tr' + (isNew ? ' class="is-new"' : '') + '>' + cells.map(function (c, i) {
      var badge = isNew && i === 0 ? ' <span class="badge-new">' + UI.newBadge + '</span>' : '';
      return '<td>' + esc(fill(c)) + badge + '</td>';
    }).join('') + '</tr>';
  }

  function inboxHtml(item, isNew) {
    return '<li' + (isNew ? ' class="is-new"' : '') + '>' +
      '<div class="inbox-top"><strong>' + esc(fill(item.who)) + '</strong><span>' + esc(item.time) + '</span></div>' +
      '<p>' + esc(fill(item.summary)) + '</p>' +
      (item.tag ? '<span class="tag">' + esc(item.tag) + '</span>' : '') +
      (isNew ? ' <span class="badge-new">' + UI.newBadge + '</span>' : '') +
    '</li>';
  }

  /* Kartica upita: polja se pune kako razgovor napreduje */
  function renderRecord(justSet, done, actions) {
    if (!recordEl) return;
    var fields = record.fields;
    var filled = fields.filter(function (f) { return rec[f.key] != null; }).length;
    recordEl.className = 'record' + (done ? ' is-done' : '');
    recordEl.innerHTML =
      '<div class="record-head">' +
        '<span class="record-kicker">' + (done ? '<span class="record-check" aria-hidden="true">✓</span>' + UI.saved : UI.recordKicker) + '</span>' +
        '<span class="record-count">' + filled + ' / ' + fields.length + '</span>' +
      '</div>' +
      '<strong class="record-title">' + esc(record.title) + '</strong>' +
      '<div class="record-bar" aria-hidden="true"><i style="width:' + Math.round(filled / fields.length * 100) + '%"></i></div>' +
      '<dl class="record-fields">' + fields.map(function (f) {
        var has = rec[f.key] != null;
        var isNew = justSet && justSet.indexOf(f.key) !== -1;
        return '<div class="' + (has ? 'is-set' : 'is-empty') + (isNew ? ' is-new' : '') + '"><dt>' + esc(f.label) + '</dt>' +
          '<dd>' + (has ? esc(rec[f.key]) : '<span class="record-wait">' + UI.waiting + '</span>') + '</dd></div>';
      }).join('') + '</dl>' +
      (actions && actions.length ? '<div class="record-did"><span>' + UI.didTitle + '</span><ol id="record-actions"></ol></div>' : '');
  }

  function playActions(actions, after) {
    var list = document.getElementById('record-actions');
    if (!list || !actions || !actions.length) { if (after) after(); return; }
    actions.forEach(function (a, i) {
      later(function () {
        var li = document.createElement('li');
        li.textContent = a;
        list.appendChild(li);
        if (i === actions.length - 1 && after) later(after, 450);
      }, 500 * (i + 1));
    });
  }

  function countUp(el, from, to, suffix) {
    if (reduceMotion || from === to) { el.textContent = to + suffix; return; }
    var steps = Math.min(12, Math.abs(to - from));
    var i = 0;
    (function tick() {
      i += 1;
      el.textContent = Math.round(from + (to - from) * (i / steps)) + suffix;
      if (i < steps) timers.push(setTimeout(tick, 60));
    })();
  }

  function resetBoard() {
    kpiValues = {};
    rec = {};
    if (record && record.initial) Object.keys(record.initial).forEach(function (k) { rec[k] = record.initial[k]; });
    renderKpis();
    renderRecord(record && record.initial ? Object.keys(record.initial) : null);
    headEl.innerHTML = data.columns.map(function (c) { return '<th scope="col">' + esc(c) + '</th>'; }).join('');
    bodyEl.innerHTML = data.rows.map(function (r) { return rowHtml(r, false); }).join('');
    inboxEl.innerHTML = data.inbox.map(function (i) { return inboxHtml(i, false); }).join('');
    autosEl.innerHTML = data.automations.map(function (a, idx) {
      var id = 'auto-' + idx;
      return '<li><label for="' + id + '"><span>' + esc(a.label) + '</span>' +
        '<input type="checkbox" role="switch" id="' + id + '"' + (a.on ? ' checked' : '') + '>' +
        '<span class="switch" aria-hidden="true"></span></label></li>';
    }).join('');
    toastEl.hidden = true;
    if (seeBoardEl) seeBoardEl.hidden = true;
  }

  function applyEvent(ev) {
    if (!ev) return;
    var justSet = [];
    if (ev.set) Object.keys(ev.set).forEach(function (k) { rec[k] = ev.set[k]; justSet.push(k); });
    renderRecord(justSet, true, ev.actions);
    if (seeBoardEl) seeBoardEl.hidden = false;

    playActions(ev.actions, function () {
      if (ev.row) bodyEl.insertAdjacentHTML('afterbegin', rowHtml(ev.row, true));
      if (ev.inbox) inboxEl.insertAdjacentHTML('afterbegin', inboxHtml(ev.inbox, true));
      if (ev.kpi) {
        Object.keys(ev.kpi).forEach(function (key) {
          var base = data.kpis.filter(function (k) { return k.key === key; })[0];
          if (!base) return;
          var cur = Number(kpiValues[key] != null ? kpiValues[key] : base.value);
          kpiValues[key] = cur + ev.kpi[key];
          var el = kpiEl.querySelector('[data-key="' + key + '"]');
          if (el) {
            el.classList.add('is-new');
            countUp(el.querySelector('dd'), cur, kpiValues[key], base.suffix || '');
          }
        });
      }
      if (ev.toast) {
        toastEl.textContent = ev.toast;
        toastEl.hidden = false;
      }
    });
  }

  /* ---------- Razgovor ---------- */

  var msgsEl = document.getElementById('phone-msgs');
  var optsEl = document.getElementById('phone-options');
  var repliedShown = false;

  function scrollDown() { msgsEl.scrollTop = msgsEl.scrollHeight; }

  function addMsg(text, who) {
    var div = document.createElement('div');
    div.className = 'msg msg-' + who;
    div.textContent = fill(text);
    if (who === 'user' && chrome === 'whatsapp') {
      var ticks = document.createElement('span');
      ticks.className = 'msg-ticks';
      ticks.setAttribute('aria-hidden', 'true');
      ticks.textContent = '✓✓';
      div.appendChild(ticks);
    }
    msgsEl.appendChild(div);
    scrollDown();
  }

  function addChip(text, cls) {
    var div = document.createElement('div');
    div.className = 'msg-chip' + (cls ? ' ' + cls : '');
    div.textContent = text;
    msgsEl.appendChild(div);
    scrollDown();
  }

  function showTyping() {
    var t = document.createElement('div');
    t.className = 'msg msg-bot msg-typing';
    t.innerHTML = '<span></span><span></span><span></span><em class="sr-only">' + UI.typing + '</em>';
    msgsEl.appendChild(t);
    scrollDown();
    return t;
  }

  function setOptions(options, field) {
    optsEl.innerHTML = '';
    (options || []).forEach(function (o) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'opt' + (o.restart ? ' opt-restart' : '');
      b.textContent = o.label;
      b.addEventListener('click', function () {
        optsEl.innerHTML = '';
        if (o.restart) { start(); return; }
        addMsg(o.label, 'user');
        if (field) {
          rec[field] = o.label;
          renderRecord([field]);
        }
        runStep(o.next);
      });
      optsEl.appendChild(b);
    });
  }

  function runStep(id) {
    var step = data.chat.steps[id];
    if (!step) return;
    var queue = (step.bot || []).slice();
    var delay = reduceMotion ? 0 : 750;

    function next() {
      if (!queue.length) {
        applyEvent(step.event);
        var opts = step.options ? step.options.slice() : [];
        if (step.end) opts.push({ label: UI.restart, restart: true });
        setOptions(opts, step.field);
        return;
      }
      var text = queue.shift();
      function say() {
        addMsg(text, 'bot');
        if (!repliedShown) { repliedShown = true; addChip(UI.replied, 'msg-chip-fast'); }
        next();
      }
      if (!delay) { say(); return; }
      var typing = showTyping();
      later(function () { typing.remove(); say(); }, delay);
    }
    next();
  }

  function start() {
    timers.forEach(clearTimeout);
    timers = [];
    msgsEl.innerHTML = '';
    optsEl.innerHTML = '';
    repliedShown = false;
    resetBoard();
    if (data.when) addChip(data.when);
    if (data.chat.opener) addMsg(data.chat.opener, 'user');
    later(function () { runStep(data.chat.start); }, 500);
  }

  start();
})();
