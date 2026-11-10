/* MangAI demo primjeri – zajednički sustav.
 * Svaki demo učita svoj podatkovni file (window.MANGAI_DEMO = { hr: {...}, en: {...} }) i ovaj file.
 * Lijevo: razgovor s asistentom (što vidi klijent). Desno: nadzorna ploča vlasnika koja se ažurira.
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
      home: '/', allDemos: '/#primjeri', contact: '/#contact',
      allDemosLabel: 'Svi primjeri', contactLabel: 'Pošalji upit',
      clientSees: 'Što vidi vaš klijent', youSee: 'Što vidite vi',
      typing: 'piše…', restart: 'Kreni ispočetka', newBadge: 'Novo',
      conversations: 'Razgovori koje je obradio asistent', automations: 'Automatizacije',
      demoNote: 'Demo s izmišljenim podacima. Prava verzija radi se prema vašim procesima, sustavima i izgledu.',
      featuresTitle: 'Što asistent radi', otherDemos: 'Ostali primjeri', on: 'uključeno', off: 'isključeno',
      langSwitch: 'EN', langHref: '?lang=en', online: 'na mreži'
    },
    en: {
      home: '/en/', allDemos: '/en/#examples', contact: '/en/#contact',
      allDemosLabel: 'All examples', contactLabel: 'Send an enquiry',
      clientSees: 'What your client sees', youSee: 'What you see',
      typing: 'typing…', restart: 'Start over', newBadge: 'New',
      conversations: 'Conversations handled by the assistant', automations: 'Automations',
      demoNote: 'Demo with made-up data. The real version is built around your processes, systems and branding.',
      featuresTitle: 'What the assistant does', otherDemos: 'Other examples', on: 'on', off: 'off',
      langSwitch: 'HR', langHref: '?', online: 'online'
    }
  }[lang];

  var DEMOS = [
    { id: 'salon', hr: 'Beauty salon', en: 'Beauty salon' },
    { id: 'nekretnine', hr: 'Nekretnine', en: 'Real estate' },
    { id: 'ordinacija', hr: 'Ordinacija', en: 'Clinic' },
    { id: 'odvjetnik', hr: 'Odvjetnički ured', en: 'Law office' },
    { id: 'agencija', hr: 'Marketinška agencija', en: 'Marketing agency' },
    { id: 'opcina', hr: 'Općina i grad', en: 'Municipality' },
    { id: 'apartmani', hr: 'Apartmani i turizam', en: 'Holiday rentals' }
  ];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- Stranica ---------- */

  document.title = data.pageTitle + ' | MangAI';
  var root = document.getElementById('demo-root');
  var vertical = root.getAttribute('data-vertical');

  root.innerHTML =
    '<header class="site-header"><div class="wrap">' +
      '<a href="' + UI.home + '" class="logo" aria-label="MangAI">Mang<span>AI</span></a>' +
      '<div class="demo-head-actions">' +
        '<a class="demo-lang" href="' + UI.langHref + '">' + UI.langSwitch + '</a>' +
        '<a class="demo-head-link" href="' + UI.allDemos + '">' + UI.allDemosLabel + '</a>' +
        '<a class="btn btn-primary nav-cta" href="' + UI.contact + '">' + UI.contactLabel + '</a>' +
      '</div>' +
    '</div></header>' +
    '<main id="main" class="demo-page"><div class="wrap">' +
      '<div class="demo-intro">' +
        '<p class="demo-kicker">Demo</p>' +
        '<h1>' + esc(data.title) + '</h1>' +
        '<p class="demo-lead">' + esc(data.lead) + '</p>' +
      '</div>' +
      '<div class="demo-stage">' +
        '<section class="demo-client" aria-labelledby="demo-client-title">' +
          '<h2 id="demo-client-title" class="demo-col-title">' + UI.clientSees + '</h2>' +
          '<div class="phone">' +
            '<div class="phone-head">' +
              '<span class="phone-avatar" aria-hidden="true">' + esc(data.assistantInitial || data.business.charAt(0)) + '</span>' +
              '<span><strong>' + esc(data.assistant) + '</strong><small>' + esc(data.channel) + ' · ' + UI.online + '</small></span>' +
            '</div>' +
            '<div class="phone-msgs" id="phone-msgs" aria-live="polite"></div>' +
            '<div class="phone-options" id="phone-options"></div>' +
          '</div>' +
        '</section>' +
        '<section class="demo-owner" aria-labelledby="demo-owner-title">' +
          '<h2 id="demo-owner-title" class="demo-col-title">' + UI.youSee + '</h2>' +
          '<div class="board">' +
            '<div class="board-head"><strong>' + esc(data.business) + '</strong><span>' + esc(data.boardSubtitle) + '</span></div>' +
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
    '</div></main>';

  /* ---------- Nadzorna ploča ---------- */

  var kpiEl = document.getElementById('kpis');
  var headEl = document.getElementById('table-head');
  var bodyEl = document.getElementById('table-body');
  var inboxEl = document.getElementById('inbox');
  var autosEl = document.getElementById('autos');
  var toastEl = document.getElementById('board-toast');
  var kpiValues = {};

  function renderKpis() {
    kpiEl.innerHTML = data.kpis.map(function (k) {
      var v = kpiValues[k.key] != null ? kpiValues[k.key] : k.value;
      return '<div class="kpi" data-key="' + esc(k.key) + '"><dt>' + esc(k.label) + '</dt><dd>' + esc(v) + (k.suffix ? esc(k.suffix) : '') + '</dd></div>';
    }).join('');
  }

  function rowHtml(cells, isNew) {
    return '<tr' + (isNew ? ' class="is-new"' : '') + '>' + cells.map(function (c, i) {
      var badge = isNew && i === 0 ? ' <span class="badge-new">' + UI.newBadge + '</span>' : '';
      return '<td>' + esc(c) + badge + '</td>';
    }).join('') + '</tr>';
  }

  function inboxHtml(item, isNew) {
    return '<li' + (isNew ? ' class="is-new"' : '') + '>' +
      '<div class="inbox-top"><strong>' + esc(item.who) + '</strong><span>' + esc(item.time) + '</span></div>' +
      '<p>' + esc(item.summary) + '</p>' +
      (item.tag ? '<span class="tag">' + esc(item.tag) + '</span>' : '') +
      (isNew ? ' <span class="badge-new">' + UI.newBadge + '</span>' : '') +
    '</li>';
  }

  function resetBoard() {
    kpiValues = {};
    renderKpis();
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
  }

  function applyEvent(ev) {
    if (!ev) return;
    if (ev.row) bodyEl.insertAdjacentHTML('afterbegin', rowHtml(ev.row, true));
    if (ev.inbox) inboxEl.insertAdjacentHTML('afterbegin', inboxHtml(ev.inbox, true));
    if (ev.kpi) {
      Object.keys(ev.kpi).forEach(function (key) {
        var base = data.kpis.filter(function (k) { return k.key === key; })[0];
        if (!base) return;
        var cur = kpiValues[key] != null ? kpiValues[key] : base.value;
        kpiValues[key] = Number(cur) + ev.kpi[key];
      });
      renderKpis();
      Object.keys(ev.kpi).forEach(function (key) {
        var el = kpiEl.querySelector('[data-key="' + key + '"]');
        if (el) el.classList.add('is-new');
      });
    }
    if (ev.toast) {
      toastEl.textContent = ev.toast;
      toastEl.hidden = false;
    }
  }

  /* ---------- Razgovor ---------- */

  var msgsEl = document.getElementById('phone-msgs');
  var optsEl = document.getElementById('phone-options');
  var timer = null;

  function addMsg(text, who) {
    var div = document.createElement('div');
    div.className = 'msg msg-' + who;
    div.textContent = text;
    msgsEl.appendChild(div);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function showTyping() {
    var t = document.createElement('div');
    t.className = 'msg msg-bot msg-typing';
    t.innerHTML = '<span></span><span></span><span></span><em class="sr-only">' + UI.typing + '</em>';
    msgsEl.appendChild(t);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return t;
  }

  function setOptions(options) {
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
        runStep(o.next);
      });
      optsEl.appendChild(b);
    });
  }

  function runStep(id) {
    var step = data.chat.steps[id];
    if (!step) return;
    var queue = (step.bot || []).slice();
    var delay = reduceMotion ? 0 : 650;

    function next() {
      if (!queue.length) {
        applyEvent(step.event);
        var opts = step.options ? step.options.slice() : [];
        if (step.end) opts.push({ label: UI.restart, restart: true });
        setOptions(opts);
        return;
      }
      var text = queue.shift();
      if (!delay) { addMsg(text, 'bot'); next(); return; }
      var typing = showTyping();
      timer = setTimeout(function () {
        typing.remove();
        addMsg(text, 'bot');
        next();
      }, delay);
    }
    next();
  }

  function start() {
    clearTimeout(timer);
    msgsEl.innerHTML = '';
    optsEl.innerHTML = '';
    resetBoard();
    if (data.chat.opener) addMsg(data.chat.opener, 'user');
    runStep(data.chat.start);
  }

  start();
})();
