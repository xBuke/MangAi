/**
 * Demo app: landing + dashboard, language + tab persistence, contact links, integration modal.
 * Requires: DemoI18n, DemoMockData. Contact: HR -> https://www.mangai.hr/#contact, EN -> https://www.mangai.hr/en/#contact
 */
(function () {
  var STORAGE_LANG = 'demo_lang';
  var STORAGE_TAB_PREFIX = 'demo_tab_';
  var STORAGE_AUTOMATIONS_PREFIX = 'demo_automations_';
  var STORAGE_STATE_NEKRETNINE = 'state_nekretnine';
  var STORAGE_STATE_SALON = 'state_salon';
  var STORAGE_STATE_ORDINACIJA = 'state_ordinacija';
  var STORAGE_STATE_ODVJETNIK = 'state_odvjetnik';
  var STORAGE_STATE_AGENCIJA = 'state_agencija';
  var SKELETON_MS = 300;
  var AUTOMATION_KEYS = ['followup', 'reminders', 'confirmations', 'nurture', 'digest'];
  var AUTOMATION_KEYS_NEKRETNINE = ['followup', 'reminder', 'tagging', 'digest', 'reactivation'];
  var AUTOMATION_KEYS_SALON = ['autoConfirm', 'reminder24h', 'followUp', 'offerSlot', 'reactivation'];
  var AUTOMATION_KEYS_ORDINACIJA = ['reminder24h', 'autoConfirm', 'followUp', 'triageTagging', 'reactivation'];
  var AUTOMATION_KEYS_AGENCIJA = ['leadFollowup', 'weeklyReport', 'approvalReminder', 'crmSync', 'campaignTag'];
  var VALID_TABS = ['overview', 'inbox', 'leads', 'bookings', 'viewings', 'properties', 'clients', 'services', 'team', 'triage', 'patients', 'instructions', 'campaigns', 'tasks', 'approvals', 'cases', 'documents', 'deadlines', 'automations', 'settings'];
  var TABS_BY_VERTICAL = {
    nekretnine: ['overview', 'inbox', 'leads', 'viewings', 'properties', 'automations', 'settings'],
    salon: ['overview', 'inbox', 'bookings', 'clients', 'services', 'team', 'automations', 'settings'],
    ordinacija: ['overview', 'inbox', 'triage', 'bookings', 'patients', 'instructions', 'automations', 'settings'],
    agencija: ['overview', 'inbox', 'leads', 'clients', 'campaigns', 'tasks', 'approvals', 'automations', 'settings'],
    odvjetnik: ['overview', 'inbox', 'clients', 'cases', 'documents', 'deadlines', 'automations', 'settings']
  };
  var TAB_ALIASES_ODVJETNIK = { slucajevi: 'cases', dokumenti: 'documents', rokovi: 'deadlines' };
  var DEBUG = typeof location !== 'undefined' && new URLSearchParams(location.search).get('debug') === '1';

  function getAllowedTabs(vertical) {
    var allowed = vertical && TABS_BY_VERTICAL[vertical];
    return allowed || VALID_TABS;
  }

  function normalizeTabForVertical(vertical, tab) {
    if (!tab) return 'overview';
    if (vertical === 'odvjetnik' && TAB_ALIASES_ODVJETNIK[tab]) return TAB_ALIASES_ODVJETNIK[tab];
    return tab;
  }

  function getUrlViewAndTab(vertical) {
    var params = new URLSearchParams(typeof location !== 'undefined' && location.search);
    var view = params.get('view');
    var tabRaw = params.get('tab') || 'overview';
    var tab = normalizeTabForVertical(vertical, tabRaw);
    var allowed = getAllowedTabs(vertical);
    if (allowed.indexOf(tab) === -1) tab = 'overview';
    return { view: view === 'dashboard' ? 'dashboard' : null, tab: tab };
  }

  function updateUrlDashboard(vertical, tab) {
    try {
      var url = location.pathname + '?view=dashboard&tab=' + encodeURIComponent(tab);
      history.replaceState({}, '', url);
    } catch (e) {}
  }

  function updateUrlLanding() {
    try {
      history.replaceState({}, '', location.pathname);
    } catch (e) {}
  }

  function ensureDashboardContent(vertical, lang) {
    var content = document.getElementById('demo-content');
    if (!content || content.querySelector('.demo-pane')) return;
    var panes =
      '<a href="#" id="demo-back-to-landing" class="demo-back-link"></a>' +
      '<div id="demo-pane-overview" class="demo-pane"></div>' +
      '<div id="demo-pane-inbox" class="demo-pane"></div>' +
      (vertical === 'odvjetnik' ? '<div id="demo-pane-clients" class="demo-pane"></div><div id="demo-pane-cases" class="demo-pane"></div><div id="demo-pane-documents" class="demo-pane"></div><div id="demo-pane-deadlines" class="demo-pane"></div>' : '') +
      (vertical === 'ordinacija' ? '' : vertical === 'salon' ? '' : vertical === 'odvjetnik' ? '' : '<div id="demo-pane-leads" class="demo-pane"></div>') +
      (vertical === 'ordinacija' ? '<div id="demo-pane-triage" class="demo-pane"></div>' : '') +
      (hasBookings(vertical) ? '<div id="demo-pane-bookings" class="demo-pane"></div>' : '') +
      (vertical === 'ordinacija' ? '<div id="demo-pane-patients" class="demo-pane"></div><div id="demo-pane-instructions" class="demo-pane"></div>' : '') +
      (vertical === 'salon' ? '<div id="demo-pane-clients" class="demo-pane"></div><div id="demo-pane-services" class="demo-pane"></div><div id="demo-pane-team" class="demo-pane"></div>' : '') +
      (vertical === 'agencija' ? '<div id="demo-pane-clients" class="demo-pane"></div><div id="demo-pane-campaigns" class="demo-pane"></div><div id="demo-pane-tasks" class="demo-pane"></div><div id="demo-pane-approvals" class="demo-pane"></div>' : '') +
      (hasViewings(vertical) ? '<div id="demo-pane-viewings" class="demo-pane"></div>' : '') +
      (hasProperties(vertical) ? '<div id="demo-pane-properties" class="demo-pane"></div>' : '') +
      '<div id="demo-pane-automations" class="demo-pane"></div>' +
      '<div id="demo-pane-settings" class="demo-pane"></div>';
    content.innerHTML = panes;
    var backLink = document.getElementById('demo-back-to-landing');
    if (backLink && window.DemoI18n) backLink.textContent = window.DemoI18n.tCommon('backToLanding', lang);
    backLink.href = '#';
    renderTopbar(vertical, lang);
    var sidebar = document.getElementById('demo-sidebar-nav');
    if (sidebar) renderSidebar(vertical, lang);
    ensureDrawerElements(vertical);
  }

  function getVertical() {
    var body = document.body;
    return (body && body.getAttribute('data-vertical')) || 'nekretnine';
  }

  function getLang() {
    try {
      var v = localStorage.getItem(STORAGE_LANG);
      if (v === 'en' || v === 'hr') return v;
    } catch (e) {}
    return 'hr';
  }

  function setLang(lang) {
    try {
      localStorage.setItem(STORAGE_LANG, lang);
    } catch (e) {}
  }

  function getStoredTab(vertical) {
    try {
      var allowed = getAllowedTabs(vertical);
      var v = localStorage.getItem(STORAGE_TAB_PREFIX + vertical);
      if (v) {
        v = normalizeTabForVertical(vertical, v);
        if (allowed.indexOf(v) >= 0) return v;
      }
    } catch (e) {}
    return 'overview';
  }

  function setStoredTab(vertical, tab) {
    try {
      localStorage.setItem(STORAGE_TAB_PREFIX + vertical, tab);
    } catch (e) {}
  }

  function getAutomationsState(vertical) {
    try {
      var raw = localStorage.getItem(STORAGE_AUTOMATIONS_PREFIX + vertical);
      if (raw) {
        var o = JSON.parse(raw);
        if (o && typeof o === 'object') return o;
      }
    } catch (e) {}
    var def = {};
    var keys = vertical === 'nekretnine' ? AUTOMATION_KEYS_NEKRETNINE : vertical === 'salon' ? AUTOMATION_KEYS_SALON : vertical === 'ordinacija' ? AUTOMATION_KEYS_ORDINACIJA : vertical === 'agencija' ? AUTOMATION_KEYS_AGENCIJA : (vertical === 'odvjetnik' ? AUTOMATION_KEYS : AUTOMATION_KEYS);
    keys.forEach(function (k) {
      def[k] = false;
    });
    return def;
  }

  function setAutomationsState(vertical, state) {
    try {
      localStorage.setItem(STORAGE_AUTOMATIONS_PREFIX + vertical, JSON.stringify(state));
    } catch (e) {}
  }

  function getNekretnineState() {
    try {
      var raw = localStorage.getItem(STORAGE_STATE_NEKRETNINE);
      if (raw) {
        var o = JSON.parse(raw);
        if (o && typeof o === 'object') return o;
      }
    } catch (e) {}
    return { leads: null, viewings: null, properties: null };
  }

  function setNekretnineState(state) {
    try {
      localStorage.setItem(STORAGE_STATE_NEKRETNINE, JSON.stringify(state));
    } catch (e) {}
  }

  function getSalonState() {
    try {
      var raw = localStorage.getItem(STORAGE_STATE_SALON);
      if (raw) {
        var o = JSON.parse(raw);
        if (o && typeof o === 'object') return o;
      }
    } catch (e) {}
    return { bookings: null, clientNotes: {}, services: {} };
  }

  function setSalonState(state) {
    try {
      localStorage.setItem(STORAGE_STATE_SALON, JSON.stringify(state));
    } catch (e) {}
  }

  function getOrdinacijaState() {
    try {
      var raw = localStorage.getItem(STORAGE_STATE_ORDINACIJA);
      if (raw) {
        var o = JSON.parse(raw);
        if (o && typeof o === 'object') return o;
      }
    } catch (e) {}
    return { triage: null, appointments: null, patients: null, patientNotes: {}, patientHistory: {}, automations: null };
  }

  function setOrdinacijaState(state) {
    try {
      localStorage.setItem(STORAGE_STATE_ORDINACIJA, JSON.stringify(state));
    } catch (e) {}
  }

  function getAgencijaState() {
    try {
      var raw = localStorage.getItem(STORAGE_STATE_AGENCIJA);
      if (raw) {
        var o = JSON.parse(raw);
        if (o && typeof o === 'object') return o;
      }
    } catch (e) {}
    return { leads: null, campaigns: null, tasks: null, approvals: null, automations: null };
  }

  function setAgencijaState(state) {
    try {
      localStorage.setItem(STORAGE_STATE_AGENCIJA, JSON.stringify(state));
    } catch (e) {}
  }

  function getAgencijaData(vertical, dataKey) {
    if (vertical !== 'agencija') return [];
    var base = window.DemoMockData && window.DemoMockData.getVerticalData(vertical);
    var baseArr = (base && base[dataKey]) ? (Array.isArray(base[dataKey]) ? JSON.parse(JSON.stringify(base[dataKey])) : [].concat(base[dataKey])) : [];
    var state = getAgencijaState();
    var stored = state[dataKey];
    if (Array.isArray(stored) && stored.length) return JSON.parse(JSON.stringify(stored));
    return baseArr;
  }

  function getOrdinacijaData(vertical, dataKey) {
    if (vertical !== 'ordinacija') return [];
    var base = window.DemoMockData && window.DemoMockData.getVerticalData(vertical);
    var baseArr = (base && base[dataKey]) ? (Array.isArray(base[dataKey]) ? base[dataKey].slice() : [].concat(base[dataKey])) : [];
    var state = getOrdinacijaState();
    var stored = state[dataKey];
    if (Array.isArray(stored) && stored.length) return JSON.parse(JSON.stringify(stored));
    if (dataKey === 'patients' && baseArr.length) {
      baseArr.forEach(function (p) {
        p.notes = (state.patientNotes && state.patientNotes[p.id]) != null ? state.patientNotes[p.id] : (p.notes || '');
        p.history = (state.patientHistory && state.patientHistory[p.id]) != null ? state.patientHistory[p.id] : (p.history || []);
      });
    }
    return baseArr;
  }

  function getSalonBookings(vertical) {
    if (vertical !== 'salon') return [];
    var base = window.DemoMockData && window.DemoMockData.getVerticalData(vertical);
    var baseArr = (base && base.bookings) ? base.bookings.slice() : [];
    var state = getSalonState();
    if (Array.isArray(state.bookings) && state.bookings.length) return state.bookings;
    return baseArr;
  }

  function getSalonServices(vertical) {
    if (vertical !== 'salon') return [];
    var base = window.DemoMockData && window.DemoMockData.getVerticalData(vertical);
    var baseArr = (base && base.services) ? base.services.map(function (s) { return Object.assign({}, s); }) : [];
    var state = getSalonState();
    var overrides = state.services || {};
    baseArr.forEach(function (s) {
      if (overrides[s.id]) {
        if (typeof overrides[s.id].onlineBooking === 'boolean') s.onlineBooking = overrides[s.id].onlineBooking;
        if (typeof overrides[s.id].popular === 'boolean') s.popular = overrides[s.id].popular;
      }
    });
    return baseArr;
  }

  function getClientNotes(clientId) {
    var state = getSalonState();
    var notes = state.clientNotes || {};
    return notes[clientId] != null ? String(notes[clientId]) : '';
  }

  function setClientNotes(clientId, text) {
    var state = getSalonState();
    state.clientNotes = state.clientNotes || {};
    state.clientNotes[clientId] = text;
    state.bookings = state.bookings || getSalonBookings('salon');
    setSalonState(state);
  }

  function getNekretnineData(vertical, dataKey) {
    var base = window.DemoMockData && window.DemoMockData.getVerticalData(vertical);
    var baseArr = (base && base[dataKey]) || [];
    if (vertical !== 'nekretnine') return baseArr;
    var state = getNekretnineState();
    var stored = state[dataKey];
    if (Array.isArray(stored)) return stored;
    return baseArr;
  }

  function contactUrl() {
    return window.DemoI18n ? window.DemoI18n.getContactUrl(getLang()) : 'https://www.mangai.hr/#contact';
  }

  function hasBookings(vertical) {
    return vertical === 'salon' || vertical === 'ordinacija';
  }

  function hasViewings(vertical) {
    return vertical === 'nekretnine';
  }

  function hasProperties(vertical) {
    return vertical === 'nekretnine';
  }

  function renderFooter(lang) {
    var footer = document.getElementById('demo-footer');
    if (footer && window.DemoI18n) {
      footer.textContent = window.DemoI18n.tCommon('footerThemeNote', lang);
    }
  }

  function renderLanding(vertical, lang) {
    var root = document.getElementById('demo-landing');
    if (!root) return;
    var i18n = window.DemoI18n;
    if (!i18n) return;
    var data = i18n.getVerticalData(vertical, lang);
    if (!data) return;

    var heroTitle = data.heroTitle || '';
    var heroSubtitle = data.heroSubtitle || '';
    var features = data.features || [];
    var disclaimerText = (i18n.tCommon('demoDisclaimer', lang) || '').replace(/\n/g, '<br>');
    var disclaimerHtml = disclaimerText
      ? '<div class="demo-disclaimer" role="note">' + disclaimerText + '</div>'
      : '';

    var featuresHtml = features
      .map(function (f) {
        var bullets = (f.bullets || [])
          .map(function (b) {
            return '<li>' + escapeHtml(b) + '</li>';
          })
          .join('');
        var ctaLabel = f.cta || '';
        var tab = f.tab || 'overview';
        return (
          '<div class="demo-feature-card">' +
          '<h3>' +
          escapeHtml(f.title) +
          '</h3>' +
          '<ul>' +
          bullets +
          '</ul>' +
          '<button type="button" class="demo-feature-cta" data-demo-tab="' +
          escapeAttr(tab) +
          '">' +
          escapeHtml(ctaLabel) +
          '</button>' +
          '</div>'
        );
      })
      .join('');

    root.innerHTML =
      '<div class="demo-hero">' +
      '<h1>' +
      escapeHtml(heroTitle) +
      '</h1>' +
      '<p>' +
      escapeHtml(heroSubtitle) +
      '</p>' +
      '</div>' +
      '<div class="demo-features">' +
      featuresHtml +
      '</div>' +
      disclaimerHtml;
  }

  function renderTopbar(vertical, lang) {
    var topbar = document.getElementById('demo-topbar');
    if (!topbar || !window.DemoI18n) return;
    var c = window.DemoI18n.tCommon.bind(null);
    var url = contactUrl();
    var isEn = lang === 'en';

    var disclaimerBanner = vertical === 'odvjetnik'
      ? '<div class="demo-topbar-disclaimer">' + escapeHtml(c('disclaimerLegal', lang)) + '</div>'
      : '';
    var hamburgerSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    topbar.innerHTML =
      disclaimerBanner +
      '<div class="demo-topbar-left">' +
      '<button type="button" class="demo-hamburger" id="demo-hamburger" aria-label="Open menu">' + hamburgerSvg + '</button>' +
      '<span class="demo-badge">' +
      escapeHtml(c('demoMode', lang)) +
      '</span>' +
      '<div class="demo-lang-toggle" role="group" aria-label="Language">' +
      '<button type="button" data-lang="hr" class="' +
      (isEn ? '' : 'is-active') +
      '">HR</button>' +
      '<button type="button" data-lang="en" class="' +
      (isEn ? 'is-active' : '') +
      '">EN</button>' +
      '</div>' +
      '<a href="' +
      escapeAttr(url) +
      '" class="demo-btn-contact">' +
      escapeHtml(c('contact', lang)) +
      '</a>' +
      '<button type="button" class="demo-btn-text" id="demo-reset">' +
      escapeHtml(c('resetDemo', lang)) +
      '</button>' +
      '</div>' +
      '<div class="demo-topbar-right">' +
      '<a href="#" id="demo-back-to-landing" class="demo-btn-text">' +
      escapeHtml(c('backToLanding', lang)) +
      '</a>' +
      '</div>';
  }

  function renderSidebar(vertical, lang) {
    var sidebar = document.getElementById('demo-sidebar-nav');
    if (!sidebar || !window.DemoI18n) return;
    var c = window.DemoI18n.tCommon.bind(null);
    var tabs;
    if (vertical === 'salon') {
      tabs = [
        { id: 'overview', key: 'tabOverview' },
        { id: 'inbox', key: 'tabInbox' },
        { id: 'bookings', key: 'tabBookings' },
        { id: 'clients', key: 'tabClients' },
        { id: 'services', key: 'tabServices' },
        { id: 'team', key: 'tabTeam' },
        { id: 'automations', key: 'tabAutomations' },
        { id: 'settings', key: 'tabSettings' },
      ];
    } else if (vertical === 'ordinacija') {
      tabs = [
        { id: 'overview', key: 'tabOverview' },
        { id: 'inbox', key: 'tabInbox' },
        { id: 'triage', key: 'tabTriaza' },
        { id: 'bookings', key: 'tabTermini' },
        { id: 'patients', key: 'tabPacijenti' },
        { id: 'instructions', key: 'tabUpute' },
        { id: 'automations', key: 'tabAutomations' },
        { id: 'settings', key: 'tabSettings' },
      ];
    } else if (vertical === 'odvjetnik') {
      tabs = [
        { id: 'overview', key: 'tabOverview' },
        { id: 'inbox', key: 'tabInbox' },
        { id: 'clients', key: 'tabClients' },
        { id: 'cases', key: 'tabCases' },
        { id: 'documents', key: 'tabDocuments' },
        { id: 'deadlines', key: 'tabDeadlines' },
        { id: 'automations', key: 'tabAutomations' },
        { id: 'settings', key: 'tabSettings' },
      ];
    } else {
      tabs = [
        { id: 'overview', key: 'tabOverview' },
        { id: 'inbox', key: 'tabInbox' },
        { id: 'leads', key: 'tabLeads' },
      ];
      if (hasBookings(vertical)) tabs.push({ id: 'bookings', key: 'tabBookings' });
      if (hasViewings(vertical)) tabs.push({ id: 'viewings', key: 'tabViewings' });
      if (hasProperties(vertical)) tabs.push({ id: 'properties', key: 'tabProperties' });
      tabs.push({ id: 'automations', key: 'tabAutomations' }, { id: 'settings', key: 'tabSettings' });
    }

    var current = getStoredTab(vertical);
    var urlTab = (function () {
      var p = new URLSearchParams(typeof location !== 'undefined' && location.search);
      if (p.get('view') !== 'dashboard') return null;
      var t = p.get('tab');
      if (t) t = normalizeTabForVertical(vertical, t);
      var allowed = getAllowedTabs(vertical);
      return t && allowed.indexOf(t) !== -1 ? t : null;
    })();
    if (urlTab !== null) current = urlTab;
    if (vertical === 'salon') {
      if (['leads', 'viewings', 'properties', 'triage', 'patients', 'instructions'].indexOf(current) >= 0) current = 'overview';
    } else if (vertical === 'ordinacija') {
      if (['leads', 'viewings', 'properties', 'clients', 'services', 'team'].indexOf(current) >= 0) current = 'overview';
    } else if (vertical === 'odvjetnik') {
      if (['leads', 'bookings', 'viewings', 'properties', 'campaigns', 'tasks', 'approvals'].indexOf(current) >= 0) current = 'overview';
    } else if (vertical === 'agencija') {
      if (['bookings', 'viewings', 'properties', 'services', 'team', 'triage', 'patients', 'instructions'].indexOf(current) >= 0) current = 'overview';
    } else {
      if (current === 'bookings' && !hasBookings(vertical)) current = 'overview';
      if (current === 'viewings' && !hasViewings(vertical)) current = 'overview';
      if (current === 'properties' && !hasProperties(vertical)) current = 'overview';
      if (['triage', 'patients', 'instructions', 'clients', 'campaigns', 'tasks', 'approvals'].indexOf(current) >= 0) current = 'overview';
    }
    sidebar.innerHTML = tabs
      .map(function (t) {
        return (
          '<button type="button" data-tab="' +
          t.id +
          '" class="' +
          (t.id === current ? 'is-active' : '') +
          '">' +
          escapeHtml(c(t.key, lang)) +
          '</button>'
        );
      })
      .join('');

    if (DEBUG) {
      var allowed = getAllowedTabs(vertical);
      var dataTabs = tabs.map(function (t) { return t.id; });
      console.log('[demo] vertical:', vertical, '| allowed tabs:', allowed);
      console.log('[demo] sidebar data-tab values:', dataTabs);
      dataTabs.forEach(function (dt) {
        if (allowed.indexOf(dt) === -1) {
          console.warn('[demo] sidebar tab "' + dt + '" not in TABS_BY_VERTICAL[' + vertical + ']');
        }
      });
    }
  }

  function renderOverview(vertical, lang) {
    var pane = document.getElementById('demo-pane-overview');
    if (!pane || !window.DemoMockData) return;
    var labels = window.DemoMockData.getKpiLabels(vertical, lang);
    var d = window.DemoMockData.getVerticalData(vertical);
    var kpis = (d && d.kpis) || [];
    var labelKeys = ['kpi1', 'kpi2', 'kpi3', 'kpi4'];

    var cardsHtml = labelKeys
      .slice(0, kpis.length)
      .map(function (key, i) {
        var kpi = kpis[i] || {};
        var val = kpi.value != null ? kpi.value : '-';
        var suffix = kpi.suffix || '';
        var label = labels[key] || key;
        return (
          '<div class="demo-kpi-card">' +
          '<div class="demo-kpi-label">' +
          escapeHtml(label) +
          '</div>' +
          '<div class="demo-kpi-value">' +
          escapeHtml(String(val)) +
          (suffix ? '<span>' + escapeHtml(suffix) + '</span>' : '') +
          '</div>' +
          '</div>'
        );
      })
      .join('');

    var chartValues = [24, 18, 32, 28, 22];
    var maxVal = Math.max.apply(null, chartValues);
    var chartBars = chartValues
      .map(function (v, i) {
        var h = maxVal ? Math.round((v / maxVal) * 120) : 0;
        return (
          '<rect x="' +
          (60 + i * 70) +
          '" y="' +
          (180 - h) +
          '" width="40" height="' +
          h +
          '" fill="rgba(80,250,123,0.6)" rx="4"/>'
        );
      })
      .join('');

    pane.innerHTML =
      '<div class="demo-kpi-grid">' +
      cardsHtml +
      '</div>' +
      '<div class="demo-chart-wrap">' +
      '<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      chartBars +
      '</svg>' +
      '</div>';
  }

  function renderInbox(vertical, lang) {
    var pane = document.getElementById('demo-pane-inbox');
    if (!pane || !window.DemoMockData) return;
    var d = window.DemoMockData.getVerticalData(vertical);
    var threads = (d && d.inbox) || [];
    var c = window.DemoI18n && window.DemoI18n.tCommon.bind(null);
    var q1 = c ? c('quickReply1', lang) : 'Reply 1';
    var q2 = c ? c('quickReply2', lang) : 'Reply 2';
    var q3 = c ? c('quickReply3', lang) : 'Reply 3';

    var listHtml = threads
      .map(function (t, i) {
        var cls = i === 0 ? ' demo-inbox-item is-selected' : ' demo-inbox-item';
        if (t.unread) cls += ' unread';
        return (
          '<button type="button" class="' +
          cls.trim() +
          '" data-thread-id="' +
          t.id +
          '">' +
          '<span class="name">' +
          escapeHtml(t.name) +
          '</span>' +
          '<span class="preview">' +
          escapeHtml(t.preview) +
          '</span>' +
          '<span class="time">' +
          escapeHtml(t.time) +
          '</span>' +
          '</button>'
        );
      })
      .join('');

    var first = threads[0];
    var detailHtml = first
      ? '<div class="demo-inbox-detail">' +
        '<p><strong>' +
        escapeHtml(first.name) +
        '</strong> · ' +
        escapeHtml(first.time) +
        '</p>' +
        '<p style="color:var(--demo-muted);font-size:0.9375rem;margin-top:0.5rem">' +
        escapeHtml(first.preview) +
        '</p>' +
        '<div class="demo-quick-replies">' +
        '<h4>Predlošci odgovora</h4>' +
        '<button type="button">' +
        escapeHtml(q1) +
        '</button>' +
        '<button type="button">' +
        escapeHtml(q2) +
        '</button>' +
        '<button type="button">' +
        escapeHtml(q3) +
        '</button>' +
        '</div>' +
        '</div>'
      : '<div class="demo-inbox-detail-placeholder">Odaberi razgovor</div>';

    pane.innerHTML =
      '<div class="demo-inbox-layout">' +
      '<div class="demo-inbox-list">' +
      listHtml +
      '</div>' +
      '<div class="demo-inbox-detail-wrap">' +
      detailHtml +
      '</div>' +
      '</div>';
  }

  function renderLeads(vertical, lang) {
    var pane = document.getElementById('demo-pane-leads');
    if (!pane || !window.DemoMockData || !window.DemoI18n) return;
    var rows = vertical === 'nekretnine'
      ? getNekretnineData(vertical, 'leads')
      : ((window.DemoMockData.getVerticalData(vertical) || {}).leads || []);
    var c = window.DemoI18n.tCommon.bind(null);
    var statusMap = {
      new: c('statusNew', lang),
      qualified: c('statusQualified', lang),
      booked: c('statusBooked', lang),
      closed: c('statusClosed', lang),
    };
    var purchaseRentMap = { buy: c('purchaseRentBuy', lang), rent: c('purchaseRentRent', lang) };
    var nextStepMap = { contact: c('nextStepContact', lang), viewing: c('nextStepViewing', lang), '-': c('nextStepDash', lang) };

    if (vertical === 'nekretnine') {
      var trs = rows
        .map(function (r) {
          var statusLabel = statusMap[r.status] || r.status;
          var prLabel = purchaseRentMap[r.purchaseRent] || r.purchaseRent;
          var nextLabel = nextStepMap[r.nextStep] || r.nextStep || '-';
          var actions = '';
          if (r.status !== 'qualified') actions += '<button type="button" class="demo-btn-sm demo-btn-outline" data-lead-action="qualify" data-lead-id="' + r.id + '">' + escapeHtml(c('actionQualify', lang)) + '</button> ';
          if (r.status !== 'closed') actions += '<button type="button" class="demo-btn-sm demo-btn-outline" data-lead-action="schedule" data-lead-id="' + r.id + '">' + escapeHtml(c('actionScheduleViewing', lang)) + '</button> ';
          if (r.status !== 'closed') actions += '<button type="button" class="demo-btn-sm demo-btn-outline" data-lead-action="close" data-lead-id="' + r.id + '">' + escapeHtml(c('actionCloseLead', lang)) + '</button>';
          var colName = c('leadColName', lang);
          var colPr = c('leadColPurchaseRent', lang);
          var colLoc = c('leadColLocations', lang);
          var colBud = c('leadColBudget', lang);
          var colRooms = c('leadColRooms', lang);
          var colStatus = c('leadColStatus', lang);
          var colNext = c('leadColNextStep', lang);
          var colActs = c('leadColActions', lang);
          return (
            '<tr data-lead-id="' + r.id + '">' +
            '<td data-label="' + escapeAttr(colName) + '">' + escapeHtml(r.name) + '</td>' +
            '<td data-label="' + escapeAttr(colPr) + '">' + escapeHtml(prLabel) + '</td>' +
            '<td data-label="' + escapeAttr(colLoc) + '">' + escapeHtml(r.locations || '-') + '</td>' +
            '<td data-label="' + escapeAttr(colBud) + '">' + escapeHtml(r.budget || '-') + '</td>' +
            '<td data-label="' + escapeAttr(colRooms) + '">' + escapeHtml(r.rooms || '-') + '</td>' +
            '<td data-label="' + escapeAttr(colStatus) + '"><span class="demo-status-pill ' + escapeAttr(r.status) + '">' + escapeHtml(statusLabel) + '</span></td>' +
            '<td data-label="' + escapeAttr(colNext) + '">' + escapeHtml(nextLabel) + '</td>' +
            '<td class="demo-leads-actions" data-label="">' + actions + '</td>' +
            '</tr>'
          );
        })
        .join('');
      pane.innerHTML =
        '<div class="demo-leads-table-wrap">' +
        '<table class="demo-leads-table">' +
        '<thead><tr>' +
        '<th>' + escapeHtml(c('leadColName', lang)) + '</th>' +
        '<th>' + escapeHtml(c('leadColPurchaseRent', lang)) + '</th>' +
        '<th>' + escapeHtml(c('leadColLocations', lang)) + '</th>' +
        '<th>' + escapeHtml(c('leadColBudget', lang)) + '</th>' +
        '<th>' + escapeHtml(c('leadColRooms', lang)) + '</th>' +
        '<th>' + escapeHtml(c('leadColStatus', lang)) + '</th>' +
        '<th>' + escapeHtml(c('leadColNextStep', lang)) + '</th>' +
        '<th>' + escapeHtml(c('leadColActions', lang)) + '</th>' +
        '</tr></thead><tbody>' + trs + '</tbody></table>' +
        '</div>';
    } else {
      var trs = rows
        .map(function (r) {
          var statusLabel = statusMap[r.status] || r.status;
          return (
            '<tr>' +
            '<td data-label="Name">' + escapeHtml(r.name) + '</td>' +
            '<td data-label="Intent">' + escapeHtml(r.intent) + '</td>' +
            '<td data-label="Budget">' + escapeHtml(r.budget) + '</td>' +
            '<td data-label="Status"><span class="demo-status-pill ' + escapeAttr(r.status) + '">' + escapeHtml(statusLabel) + '</span></td>' +
            '</tr>'
          );
        })
        .join('');
      pane.innerHTML =
        '<div class="demo-leads-table-wrap">' +
        '<table class="demo-leads-table">' +
        '<thead><tr><th>Name</th><th>Intent</th><th>Budget</th><th>Status</th></tr></thead>' +
        '<tbody>' + trs + '</tbody></table>' +
        '</div>';
    }
  }

  function parseSalonDate(dateStr) {
    if (!dateStr) return null;
    var parts = String(dateStr).split('.');
    if (parts.length !== 3) return null;
    var d = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10) - 1;
    var y = parseInt(parts[2], 10);
    var date = new Date(y, m, d);
    return isNaN(date.getTime()) ? null : date;
  }

  function filterSalonBookings(list, filter, todayDate) {
    if (filter === 'all') return list;
    var today = todayDate || new Date();
    today.setHours(0, 0, 0, 0);
    var weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);
    return list.filter(function (b) {
      var bDate = parseSalonDate(b.date);
      if (!bDate) return false;
      bDate.setHours(0, 0, 0, 0);
      if (filter === 'today') return bDate.getTime() === today.getTime();
      if (filter === 'week') return bDate >= today && bDate < weekEnd;
      return true;
    });
  }

  function renderBookings(vertical, lang) {
    var pane = document.getElementById('demo-pane-bookings');
    if (!pane || !window.DemoMockData) return;
    var list = vertical === 'salon' ? getSalonBookings(vertical) : vertical === 'ordinacija' ? getOrdinacijaData(vertical, 'appointments') : (function () {
      var d = window.DemoMockData.getVerticalData(vertical);
      return (d && d.bookings) || [];
    })();
    var c = window.DemoI18n && window.DemoI18n.tCommon.bind(null);
    if (!c) return;

    if (vertical === 'ordinacija') {
      var statusMapOrd = {
        booked: c('appointStatusBooked', lang),
        confirmed: c('appointStatusConfirmed', lang),
        completed: c('appointStatusCompleted', lang),
        cancelled: c('appointStatusCancelled', lang),
        noshow: c('appointStatusNoshow', lang),
      };
      var cardsOrd = list.map(function (b) {
        var statusLabel = statusMapOrd[b.status] || b.status;
        var dateTimeStr = (b.dateLabel || b.date) + ' ' + (b.time || '');
        var actions = '';
        if (b.status === 'booked') {
          actions += '<button type="button" class="demo-btn-sm demo-btn-outline" data-appoint-action="confirm" data-appoint-id="' + b.id + '">' + escapeHtml(c('actionConfirm', lang)) + '</button> ';
          actions += '<button type="button" class="demo-btn-sm demo-btn-outline" data-appoint-action="cancel" data-appoint-id="' + b.id + '">' + escapeHtml(c('actionCancel', lang)) + '</button> ';
        }
        if (b.status === 'booked' || b.status === 'confirmed') {
          actions += '<button type="button" class="demo-btn-sm demo-btn-outline" data-appoint-action="completed" data-appoint-id="' + b.id + '">' + escapeHtml(c('actionMarkCompleted', lang)) + '</button> ';
          actions += '<button type="button" class="demo-btn-sm demo-btn-outline" data-appoint-action="noshow" data-appoint-id="' + b.id + '">' + escapeHtml(c('actionNoshow', lang)) + '</button> ';
        }
        return (
          '<div class="demo-booking-card demo-ordinacija-appointment" data-appoint-id="' + b.id + '">' +
          '<div class="demo-booking-info">' +
          '<span class="client">' + escapeHtml(b.client) + '</span>' +
          '<div class="meta">' + escapeHtml(b.service) + ' · ' + escapeHtml(dateTimeStr) + '</div>' +
          '</div>' +
          '<div class="demo-booking-actions">' +
          '<span class="demo-status-pill ' + escapeAttr(b.status) + '">' + escapeHtml(statusLabel) + '</span> ' +
          actions +
          '</div>' +
          '</div>'
        );
      }).join('');
      pane.innerHTML = '<div class="demo-bookings-list">' + (cardsOrd || '<p style="color:var(--demo-muted)">' + escapeHtml(c('noAppointments', lang)) + '</p>') + '</div>';
      return;
    }

    if (vertical === 'salon') {
      var filter = (pane.getAttribute('data-booking-filter') || 'week');
      var filtered = filterSalonBookings(list, filter);
      var statusMap = {
        pending: c('statusPending', lang),
        confirmed: c('statusConfirmed', lang),
        completed: c('statusCompleted', lang),
        cancelled: c('statusCancelled', lang),
        noshow: c('statusNoshow', lang),
      };
      var filterHtml =
        '<div class="demo-booking-filters">' +
        '<button type="button" class="demo-filter-btn' + (filter === 'today' ? ' is-active' : '') + '" data-booking-filter="today">' + escapeHtml(c('salonFilterToday', lang)) + '</button>' +
        '<button type="button" class="demo-filter-btn' + (filter === 'week' ? ' is-active' : '') + '" data-booking-filter="week">' + escapeHtml(c('salonFilterWeek', lang)) + '</button>' +
        '<button type="button" class="demo-filter-btn' + (filter === 'all' ? ' is-active' : '') + '" data-booking-filter="all">' + escapeHtml(c('salonFilterAll', lang)) + '</button>' +
        '</div>';
      var trs = filtered.map(function (b) {
        var statusLabel = statusMap[b.status] || b.status;
        var dateTimeStr = (b.dateLabel || b.date) + ' ' + (b.time || '');
        var actions = '';
        if (b.status === 'pending') {
          actions += '<button type="button" class="demo-btn-sm demo-btn-outline" data-booking-action="confirm" data-booking-id="' + b.id + '">' + escapeHtml(c('actionConfirm', lang)) + '</button> ';
          actions += '<button type="button" class="demo-btn-sm demo-btn-outline" data-booking-action="cancel" data-booking-id="' + b.id + '">' + escapeHtml(c('actionCancel', lang)) + '</button> ';
        }
        if (b.status === 'pending' || b.status === 'confirmed') {
          actions += '<button type="button" class="demo-btn-sm demo-btn-outline" data-booking-action="completed" data-booking-id="' + b.id + '">' + escapeHtml(c('actionMarkCompleted', lang)) + '</button> ';
          actions += '<button type="button" class="demo-btn-sm demo-btn-outline" data-booking-action="noshow" data-booking-id="' + b.id + '">' + escapeHtml(c('actionNoshow', lang)) + '</button> ';
        }
        if (b.status === 'pending' || b.status === 'confirmed') {
          actions += '<button type="button" class="demo-btn-sm demo-btn-outline" data-booking-action="reminder" data-booking-id="' + b.id + '">' + escapeHtml(c('actionSendReminder', lang)) + '</button>';
        }
        var colClient = c('salonColClient', lang);
        var colService = c('salonColService', lang);
        var colDt = c('salonColDateTime', lang);
        var colStaff = c('salonColStaff', lang);
        var colStatus = c('salonColStatus', lang);
        return (
          '<tr data-booking-id="' + b.id + '">' +
          '<td data-label="' + escapeAttr(colClient) + '">' + escapeHtml(b.client) + '</td>' +
          '<td data-label="' + escapeAttr(colService) + '">' + escapeHtml(b.service) + '</td>' +
          '<td data-label="' + escapeAttr(colDt) + '">' + escapeHtml(dateTimeStr) + '</td>' +
          '<td data-label="' + escapeAttr(colStaff) + '">' + escapeHtml(b.staff || '-') + '</td>' +
          '<td data-label="' + escapeAttr(colStatus) + '"><span class="demo-status-pill ' + escapeAttr(b.status) + '">' + escapeHtml(statusLabel) + '</span></td>' +
          '<td class="demo-leads-actions demo-bookings-actions" data-label="">' + actions + '</td>' +
          '</tr>'
        );
      }).join('');
      pane.setAttribute('data-booking-filter', filter);
      pane.innerHTML =
        filterHtml +
        '<div class="demo-leads-table-wrap">' +
        '<table class="demo-leads-table demo-bookings-table">' +
        '<thead><tr>' +
        '<th>' + escapeHtml(c('salonColClient', lang)) + '</th>' +
        '<th>' + escapeHtml(c('salonColService', lang)) + '</th>' +
        '<th>' + escapeHtml(c('salonColDateTime', lang)) + '</th>' +
        '<th>' + escapeHtml(c('salonColStaff', lang)) + '</th>' +
        '<th>' + escapeHtml(c('salonColStatus', lang)) + '</th>' +
        '<th></th>' +
        '</tr></thead><tbody>' + trs + '</tbody></table>' +
        '</div>';
      return;
    }

    var cards = list
      .map(function (b) {
        var actions =
          b.status === 'pending'
            ? '<button type="button" class="primary">' +
              escapeHtml(c('actionConfirm', lang)) +
              '</button><button type="button">' +
              escapeHtml(c('actionCancel', lang)) +
              '</button>'
            : b.status === 'confirmed'
              ? '<span style="color:var(--demo-accent);font-size:0.8125rem">' + escapeHtml(c('statusConfirmed', lang)) + '</span>'
              : '<span style="color:var(--demo-muted);font-size:0.8125rem">' + escapeHtml(c('statusCancelled', lang)) + '</span>';
        return (
          '<div class="demo-booking-card">' +
          '<div class="demo-booking-info">' +
          '<span class="client">' +
          escapeHtml(b.client) +
          '</span>' +
          '<div class="meta">' +
          escapeHtml(b.service) +
          ' · ' +
          escapeHtml(b.date) +
          ' ' +
          escapeHtml(b.time) +
          '</div>' +
          '</div>' +
          '<div class="demo-booking-actions">' +
          actions +
          '</div>' +
          '</div>'
        );
      })
      .join('');

    pane.innerHTML = '<div class="demo-bookings-list">' + (cards || '<p style="color:var(--demo-muted)">' + escapeHtml(c('noBookings', lang)) + '</p>') + '</div>';
  }

  function renderTriage(vertical, lang) {
    var pane = document.getElementById('demo-pane-triage');
    if (!pane || vertical !== 'ordinacija' || !window.DemoI18n) return;
    var items = getOrdinacijaData(vertical, 'triage');
    var c = window.DemoI18n.tCommon.bind(null);
    var urgencyMap = { low: c('urgencyLow', lang), medium: c('urgencyMedium', lang), high: c('urgencyHigh', lang) };
    var cards = items.map(function (t) {
      var urgencyLabel = urgencyMap[t.urgency] || t.urgency;
      var actions = '';
      if (t.status === 'pending') {
        actions += '<button type="button" class="demo-btn-sm demo-btn-outline" data-triage-action="call" data-triage-id="' + t.id + '">' + escapeHtml(c('triageActionCall', lang)) + '</button> ';
        actions += '<button type="button" class="demo-btn-sm demo-btn-outline" data-triage-action="book" data-triage-id="' + t.id + '">' + escapeHtml(c('triageActionBook', lang)) + '</button> ';
        actions += '<button type="button" class="demo-btn-sm demo-btn-outline" data-triage-action="sendInstructions" data-triage-id="' + t.id + '">' + escapeHtml(c('triageActionSendInstructions', lang)) + '</button>';
      } else {
        actions += '<span style="color:var(--demo-muted);font-size:0.8125rem">' + (t.status === 'contacted' ? escapeHtml(c('statusConfirmed', lang)) : '') + '</span>';
      }
      return (
        '<div class="demo-triage-card" data-triage-id="' + t.id + '">' +
        '<div class="demo-triage-main">' +
        '<span class="demo-triage-patient">' + escapeHtml(t.patient) + '</span>' +
        '<span class="demo-urgency-badge demo-urgency-' + escapeAttr(t.urgency) + '">' + escapeHtml(urgencyLabel) + '</span>' +
        '</div>' +
        '<div class="demo-triage-meta">' +
        '<strong>' + escapeHtml(c('triageColSymptoms', lang)) + '</strong> ' + escapeHtml(t.symptoms) +
        '</div>' +
        '<div class="demo-triage-meta">' +
        '<strong>' + escapeHtml(c('triageColRecommendation', lang)) + '</strong> ' + escapeHtml(t.recommendation) +
        '</div>' +
        '<div class="demo-triage-actions">' + actions + '</div>' +
        '</div>'
      );
    }).join('');
    pane.innerHTML = '<div class="demo-triage-list">' + (cards || '<p style="color:var(--demo-muted)">' + escapeHtml(c('noTriage', lang)) + '</p>') + '</div>';
  }

  function renderPatients(vertical, lang) {
    var pane = document.getElementById('demo-pane-patients');
    if (!pane || vertical !== 'ordinacija' || !window.DemoI18n) return;
    var patients = getOrdinacijaData(vertical, 'patients');
    var c = window.DemoI18n.tCommon.bind(null);
    var listHtml = patients.map(function (p, i) {
      var cls = i === 0 ? ' demo-patient-item is-selected' : ' demo-patient-item';
      return (
        '<button type="button" class="' + cls.trim() + '" data-patient-id="' + p.id + '">' +
        '<span class="name">' + escapeHtml(p.name) + '</span>' +
        '<span class="meta">' + escapeHtml(p.lastVisit || '-') + ' · ' + escapeHtml(String(p.visitCount)) + '</span>' +
        '</button>'
      );
    }).join('');
    var first = patients[0];
    var detailHtml = first
      ? '<div class="demo-patient-detail">' +
        '<h4>' + escapeHtml(first.name) + '</h4>' +
        '<p class="demo-patient-meta">' + escapeHtml(c('patientHistory', lang)) + '</p>' +
        '<ul class="demo-patient-history">' + (first.history && first.history.length ? first.history.map(function (h) { return '<li>' + escapeHtml(h) + '</li>'; }).join('') : '<li class="demo-muted">—</li>') + '</ul>' +
        '<label class="demo-patient-notes-label">' + escapeHtml(c('patientNotes', lang)) + '</label>' +
        '<textarea class="demo-input demo-notes-textarea" data-patient-notes-id="' + first.id + '" rows="4">' + escapeHtml(first.notes || '') + '</textarea>' +
        '</div>'
      : '<div class="demo-patient-detail-placeholder">' + escapeHtml(c('noPatients', lang)) + '</div>';
    pane.innerHTML =
      '<div class="demo-inbox-layout">' +
      '<div class="demo-inbox-list demo-patient-list">' + listHtml + '</div>' +
      '<div class="demo-patient-detail-wrap">' + detailHtml + '</div>' +
      '</div>';
  }

  function renderInstructions(vertical, lang) {
    var pane = document.getElementById('demo-pane-instructions');
    if (!pane || vertical !== 'ordinacija' || !window.DemoMockData || !window.DemoI18n) return;
    var base = window.DemoMockData.getVerticalData(vertical);
    var instructions = (base && base.instructions) || [];
    var c = window.DemoI18n.tCommon.bind(null);
    var patients = getOrdinacijaData(vertical, 'patients');
    var patientOpts = patients.map(function (p) { return '<option value="' + p.id + '">' + escapeHtml(p.name) + '</option>'; }).join('');
    var cards = instructions.map(function (inst) {
      return (
        '<div class="demo-instruction-card" data-instruction-id="' + inst.id + '">' +
        '<h4>' + escapeHtml(inst.service) + '</h4>' +
        '<p class="demo-instruction-title">' + escapeHtml(inst.title) + '</p>' +
        '<p class="demo-instruction-body">' + escapeHtml(inst.body) + '</p>' +
        '<div class="demo-instruction-actions">' +
        '<select class="demo-input demo-instruction-patient-select" data-instruction-id="' + inst.id + '"><option value="">— ' + escapeHtml(c('sendToPatient', lang)) + ' —</option>' + patientOpts + '</select> ' +
        '<button type="button" class="demo-btn-sm demo-btn-outline demo-send-instruction-btn" data-instruction-id="' + inst.id + '">' + escapeHtml(c('sendToPatient', lang)) + '</button>' +
        '</div>' +
        '</div>'
      );
    }).join('');
    pane.innerHTML = '<div class="demo-instructions-list">' + (cards || '<p style="color:var(--demo-muted)">' + escapeHtml(c('noInstructions', lang)) + '</p>') + '</div>';
  }

  function renderViewings(vertical, lang) {
    var pane = document.getElementById('demo-pane-viewings');
    if (!pane || vertical !== 'nekretnine') return;
    var viewings = getNekretnineData(vertical, 'viewings');
    var properties = getNekretnineData(vertical, 'properties');
    var propMap = {};
    properties.forEach(function (p) {
      propMap[p.id] = p;
    });
    var c = window.DemoI18n && window.DemoI18n.tCommon.bind(null);
    var statusMap = {
      scheduled: c('viewingStatusScheduled', lang),
      confirmed: c('viewingStatusConfirmed', lang),
      done: c('viewingStatusDone', lang),
      noshow: c('viewingStatusNoshow', lang),
    };

    var cards = viewings.map(function (v) {
      var prop = propMap[v.propertyId];
      var propName = prop ? prop.name : 'Nekretnina #' + v.propertyId;
      var statusLabel = statusMap[v.status] || v.status;
      var actions = '';
      if (v.status === 'scheduled') actions += '<button type="button" class="demo-btn-sm demo-btn-outline" data-viewing-action="confirm" data-viewing-id="' + v.id + '">' + escapeHtml(c('actionConfirm', lang)) + '</button> ';
      if (v.status === 'scheduled' || v.status === 'confirmed') {
        actions += '<button type="button" class="demo-btn-sm demo-btn-outline" data-viewing-action="done" data-viewing-id="' + v.id + '">' + escapeHtml(c('actionMarkDone', lang)) + '</button> ';
        actions += '<button type="button" class="demo-btn-sm demo-btn-outline" data-viewing-action="noshow" data-viewing-id="' + v.id + '">' + escapeHtml(c('actionNoshow', lang)) + '</button>';
      }
      return (
        '<div class="demo-viewing-card" data-viewing-id="' + v.id + '">' +
        '<div class="demo-viewing-info">' +
        '<span class="demo-viewing-datetime">' + escapeHtml(v.dateTime) + '</span>' +
        '<span class="demo-viewing-prop">' + escapeHtml(propName) + '</span>' +
        '<span class="demo-viewing-client">' + escapeHtml(v.client) + '</span>' +
        '<span class="demo-viewing-agent">' + escapeHtml(v.agent) + '</span>' +
        '<span class="demo-status-pill ' + escapeAttr(v.status) + '">' + escapeHtml(statusLabel) + '</span>' +
        '</div>' +
        (actions ? '<div class="demo-viewing-actions">' + actions + '</div>' : '') +
        '</div>'
      );
    }).join('');

    pane.innerHTML =
      '<div class="demo-viewings-list">' +
      (cards || '<p style="color:var(--demo-muted)">' + escapeHtml(c('noViewings', lang)) + '</p>') +
      '</div>';
  }

  function renderProperties(vertical, lang) {
    var pane = document.getElementById('demo-pane-properties');
    if (!pane || vertical !== 'nekretnine') return;
    var properties = getNekretnineData(vertical, 'properties');
    var c = window.DemoI18n && window.DemoI18n.tCommon.bind(null);
    var statusMap = {
      active: c('propStatusActive', lang),
      sold: c('propStatusSold', lang),
      rented: c('propStatusRented', lang),
    };

    var cards = properties.map(function (p) {
      var statusLabel = statusMap[p.status] || p.status;
      return (
        '<div class="demo-property-card" data-property-id="' + p.id + '">' +
        '<div class="demo-property-preview"></div>' +
        '<div class="demo-property-info">' +
        '<h4>' + escapeHtml(p.name) + '</h4>' +
        '<p class="demo-property-meta">' + escapeHtml(p.location) + ' · ' + escapeHtml(p.price) + ' · ' + escapeHtml(p.type) + '</p>' +
        '<span class="demo-status-pill ' + escapeAttr(p.status) + '">' + escapeHtml(statusLabel) + '</span>' +
        '</div>' +
        '</div>'
      );
    }).join('');

    pane.innerHTML =
      '<div class="demo-properties-grid" id="demo-properties-grid">' + cards + '</div>' +
      '<div id="demo-property-detail" class="demo-property-detail-backdrop" style="display:none" aria-hidden="true">' +
      '<div class="demo-property-detail-inner">' +
      '<button type="button" class="demo-property-detail-close" id="demo-property-detail-close">&times;</button>' +
      '<div class="demo-property-detail-photos"></div>' +
      '<div class="demo-property-detail-facts"></div>' +
      '<div class="demo-property-connect-lead">' +
      '<label>' + escapeHtml(c('propConnectLead', lang)) + '</label>' +
      '<select class="demo-connect-lead-select"><option value="">—</option></select>' +
      '</div>' +
      '</div>' +
      '</div>';
  }

  function renderClients(vertical, lang) {
    var pane = document.getElementById('demo-pane-clients');
    if (!pane || vertical !== 'salon' || !window.DemoMockData || !window.DemoI18n) return;
    var d = window.DemoMockData.getVerticalData(vertical);
    var clients = (d && d.clients) || [];
    var c = window.DemoI18n.tCommon.bind(null);
    var listHtml = clients.map(function (cl) {
      var lastVisit = cl.lastVisit != null ? escapeHtml(cl.lastVisit) : '—';
      return (
        '<button type="button" class="demo-client-row" data-client-id="' + cl.id + '">' +
        '<span class="demo-client-name">' + escapeHtml(cl.name) + '</span>' +
        '<span class="demo-client-meta">' + lastVisit + '</span>' +
        '<span class="demo-client-meta">' + escapeHtml(String(cl.visitCount)) + '</span>' +
        '<span class="demo-client-meta">' + escapeHtml(cl.preferredService || '—') + '</span>' +
        '</button>'
      );
    }).join('');
    pane.innerHTML =
      '<div class="demo-clients-layout">' +
      '<div class="demo-clients-list">' +
      '<div class="demo-clients-list-header">' +
      '<span>' + escapeHtml(c('leadColName', lang)) + '</span>' +
      '<span>' + escapeHtml(c('clientsColLastVisit', lang)) + '</span>' +
      '<span>' + escapeHtml(c('clientsColVisitCount', lang)) + '</span>' +
      '<span>' + escapeHtml(c('clientsColPreferredService', lang)) + '</span>' +
      '</div>' +
      listHtml +
      '</div>' +
      '<div id="demo-client-panel" class="demo-client-panel demo-client-panel-empty">' +
      '<p class="demo-client-panel-placeholder">' + escapeHtml(c('noClients', lang)) + '</p>' +
      '</div>' +
      '</div>';
  }

  function renderClientPanel(clientId, vertical, lang) {
    var panel = document.getElementById('demo-client-panel');
    if (!panel || vertical !== 'salon' || !window.DemoMockData || !window.DemoI18n) return;
    var d = window.DemoMockData.getVerticalData(vertical);
    var clients = (d && d.clients) || [];
    var client = clients.find(function (c) { return c.id === clientId; });
    if (!client) {
      panel.className = 'demo-client-panel demo-client-panel-empty';
      panel.innerHTML = '<p class="demo-client-panel-placeholder">' + escapeHtml(window.DemoI18n.tCommon('noClients', lang)) + '</p>';
      return;
    }
    var c = window.DemoI18n.tCommon.bind(null);
    var notes = getClientNotes(clientId);
    var bookings = getSalonBookings(vertical).filter(function (b) { return b.clientId === clientId || b.client === client.name; });
    var historyHtml = bookings.length
      ? '<ul class="demo-client-history">' + bookings.slice(0, 10).map(function (b) {
          return '<li>' + escapeHtml(b.service) + ' · ' + escapeHtml(b.dateLabel || b.date) + ' ' + escapeHtml(b.time) + ' · ' + escapeHtml(b.status) + '</li>';
        }).join('') + '</ul>'
      : '<p class="demo-muted" style="font-size:0.875rem">' + escapeHtml(c('noBookings', lang)) + '</p>';
    panel.className = 'demo-client-panel';
    panel.innerHTML =
      '<div class="demo-client-panel-header">' +
      '<h3>' + escapeHtml(client.name) + '</h3>' +
      '</div>' +
      '<div class="demo-client-panel-section">' +
      '<h4>' + escapeHtml(c('clientBookingHistory', lang)) + '</h4>' +
      historyHtml +
      '</div>' +
      '<div class="demo-client-panel-section">' +
      '<h4>' + escapeHtml(c('clientNotes', lang)) + '</h4>' +
      '<textarea class="demo-input demo-client-notes" data-client-id="' + clientId + '" rows="4" placeholder="' + escapeAttr(c('clientNotes', lang)) + '">' + escapeHtml(notes) + '</textarea>' +
      '</div>';
    var notesEl = panel.querySelector('.demo-client-notes');
    if (notesEl) {
      notesEl.addEventListener('blur', function () {
        var cid = parseInt(notesEl.getAttribute('data-client-id'), 10);
        if (cid) setClientNotes(cid, notesEl.value);
      });
    }
  }

  function renderServices(vertical, lang) {
    var pane = document.getElementById('demo-pane-services');
    if (!pane || vertical !== 'salon' || !window.DemoI18n) return;
    var services = getSalonServices(vertical);
    var c = window.DemoI18n.tCommon.bind(null);
    var rows = services.map(function (s) {
      return (
        '<div class="demo-service-row" data-service-id="' + s.id + '">' +
        '<div class="demo-service-info">' +
        '<span class="demo-service-name">' + escapeHtml(s.name) + '</span>' +
        '<span class="demo-service-meta">' + escapeHtml(s.duration) + '</span>' +
        '<span class="demo-service-meta">' + escapeHtml(s.price) + '</span>' +
        '</div>' +
        '<div class="demo-service-toggles">' +
        '<label class="demo-service-toggle-label">' +
        '<span>' + escapeHtml(c('serviceOnlineBooking', lang)) + '</span>' +
        '<button type="button" class="demo-toggle ' + (s.onlineBooking ? 'is-on' : '') + '" data-service-toggle="online" data-service-id="' + s.id + '" aria-pressed="' + s.onlineBooking + '"></button>' +
        '</label>' +
        '<label class="demo-service-toggle-label">' +
        '<span>' + escapeHtml(c('servicePopular', lang)) + '</span>' +
        '<button type="button" class="demo-toggle ' + (s.popular ? 'is-on' : '') + '" data-service-toggle="popular" data-service-id="' + s.id + '" aria-pressed="' + s.popular + '"></button>' +
        '</label>' +
        '</div>' +
        '</div>'
      );
    }).join('');
    pane.innerHTML =
      '<div class="demo-services-list">' +
      '<div class="demo-services-list-header">' +
      '<span>' + escapeHtml(c('servicesColName', lang)) + '</span>' +
      '<span>' + escapeHtml(c('servicesColDuration', lang)) + '</span>' +
      '<span>' + escapeHtml(c('servicesColPrice', lang)) + '</span>' +
      '<span></span>' +
      '</div>' +
      rows +
      '</div>';
  }

  function renderTeam(vertical, lang) {
    var pane = document.getElementById('demo-pane-team');
    if (!pane || vertical !== 'salon' || !window.DemoMockData || !window.DemoI18n) return;
    var d = window.DemoMockData.getVerticalData(vertical);
    var staff = (d && d.staff) || [];
    var c = window.DemoI18n.tCommon.bind(null);
    var rows = staff.map(function (s) {
      var blocks = (s.availability || []).map(function (slot) {
        return '<span class="demo-availability-block">' + escapeHtml(slot) + '</span>';
      }).join('');
      return (
        '<div class="demo-team-row">' +
        '<div class="demo-team-info">' +
        '<span class="demo-team-name">' + escapeHtml(s.name) + '</span>' +
        '<span class="demo-team-meta">' + escapeHtml(s.specialty) + '</span>' +
        '<span class="demo-team-meta">' + escapeHtml(s.workingHours) + '</span>' +
        '</div>' +
        '<div class="demo-team-availability">' +
        '<span class="demo-availability-label">' + escapeHtml(c('staffTodayAvailability', lang)) + ':</span> ' +
        blocks +
        '</div>' +
        '</div>'
      );
    }).join('');
    pane.innerHTML =
      '<div class="demo-team-list">' +
      '<div class="demo-team-list-header">' +
      '<span>' + escapeHtml(c('staffColName', lang)) + '</span>' +
      '<span>' + escapeHtml(c('staffColSpecialty', lang)) + '</span>' +
      '<span>' + escapeHtml(c('staffColWorkingHours', lang)) + '</span>' +
      '</div>' +
      rows +
      '</div>';
  }

  function renderAgencijaClients(vertical, lang) {
    var pane = document.getElementById('demo-pane-clients');
    if (!pane || vertical !== 'agencija' || !window.DemoI18n) return;
    var clients = getAgencijaData(vertical, 'clients');
    var c = window.DemoI18n.tCommon.bind(null);
    var listHtml = clients.map(function (cl, i) {
      var kpiStr = (cl.spend != null ? cl.spend + '\u20AC' : '-') + ' / ' + (cl.leads != null ? cl.leads : '-') + ' / CPA ' + (cl.cpa != null ? cl.cpa : '-');
      return (
        '<button type="button" class="demo-client-row' + (i === 0 ? ' is-selected' : '') + '" data-client-id="' + cl.id + '" data-vertical="agencija">' +
        '<span class="demo-client-name">' + escapeHtml(cl.name) + '</span>' +
        '<span class="demo-client-meta">' + escapeHtml(cl.package || '-') + ' \u00B7 ' + escapeHtml(cl.channels || '-') + '</span>' +
        '<span class="demo-status-pill ' + escapeAttr(cl.status) + '">' + escapeHtml(cl.status === 'active' ? c('campaignStatusActive', lang) : c('campaignStatusPaused', lang)) + '</span>' +
        '<span class="demo-client-kpi">' + escapeHtml(kpiStr) + '</span>' +
        '</button>'
      );
    }).join('');
    var first = clients[0];
    var detailHtml = first
      ? '<div class="demo-client-detail">' +
        '<h4>' + escapeHtml(first.name) + '</h4>' +
        '<div class="demo-client-detail-kpis">' +
        '<div class="demo-kpi-card"><div class="demo-kpi-label">' + escapeHtml(c('clientDetailSpend', lang)) + '</div><div class="demo-kpi-value">' + (first.spend != null ? first.spend + '\u20AC' : '-') + '</div></div>' +
        '<div class="demo-kpi-card"><div class="demo-kpi-label">' + escapeHtml(c('clientDetailLeads', lang)) + '</div><div class="demo-kpi-value">' + (first.leads != null ? first.leads : '-') + '</div></div>' +
        '<div class="demo-kpi-card"><div class="demo-kpi-label">' + escapeHtml(c('clientDetailCpa', lang)) + '</div><div class="demo-kpi-value">' + (first.cpa != null ? first.cpa : '-') + '</div></div>' +
        '</div>' +
        '<p class="demo-client-note"><strong>' + escapeHtml(c('clientDetailNote', lang)) + '</strong><br>' + escapeHtml(first.note || '-') + '</p>' +
        '</div>'
      : '<div class="demo-client-detail-placeholder">' + escapeHtml(c('noClients', lang)) + '</div>';
    pane.innerHTML =
      '<div class="demo-clients-layout">' +
      '<div class="demo-clients-list">' + listHtml + '</div>' +
      '<div class="demo-clients-detail-wrap">' + detailHtml + '</div>' +
      '</div>';
  }

  function renderCampaigns(vertical, lang) {
    var pane = document.getElementById('demo-pane-campaigns');
    if (!pane || vertical !== 'agencija' || !window.DemoI18n) return;
    var campaigns = getAgencijaData(vertical, 'campaigns');
    var c = window.DemoI18n.tCommon.bind(null);
    var statusMap = { active: c('campaignStatusActive', lang), paused: c('campaignStatusPaused', lang), draft: c('campaignStatusDraft', lang) };
    var colName = c('campaignColName', lang);
    var colChannel = c('campaignColChannel', lang);
    var colBudget = c('campaignColBudget', lang);
    var colStatus = c('campaignColStatus', lang);
    var colMod = c('campaignColLastModified', lang);
    var trs = campaigns.map(function (cam) {
      var statusLabel = statusMap[cam.status] || cam.status;
      var actions = '<button type="button" class="demo-btn-sm demo-btn-outline" data-campaign-action="draft" data-campaign-id="' + cam.id + '">' + escapeHtml(c('campaignActionDraft', lang)) + '</button> ';
      if (cam.status === 'active') actions += '<button type="button" class="demo-btn-sm demo-btn-outline" data-campaign-action="pause" data-campaign-id="' + cam.id + '">' + escapeHtml(c('campaignActionPause', lang)) + '</button>';
      else if (cam.status === 'paused') actions += '<button type="button" class="demo-btn-sm demo-btn-outline" data-campaign-action="resume" data-campaign-id="' + cam.id + '">' + escapeHtml(c('campaignActionResume', lang)) + '</button>';
      return (
        '<tr data-campaign-id="' + cam.id + '">' +
        '<td data-label="' + escapeAttr(colName) + '">' + escapeHtml(cam.name) + '</td>' +
        '<td data-label="' + escapeAttr(colChannel) + '">' + escapeHtml(cam.channel || '-') + '</td>' +
        '<td data-label="' + escapeAttr(colBudget) + '">' + (cam.budget != null ? cam.budget + '\u20AC' : '-') + '</td>' +
        '<td data-label="' + escapeAttr(colStatus) + '"><span class="demo-status-pill ' + escapeAttr(cam.status) + '">' + escapeHtml(statusLabel) + '</span></td>' +
        '<td data-label="' + escapeAttr(colMod) + '">' + escapeHtml(cam.lastModified || '-') + '</td>' +
        '<td class="demo-leads-actions" data-label="">' + actions + '</td>' +
        '</tr>'
      );
    }).join('');
    pane.innerHTML =
      '<div class="demo-leads-table-wrap">' +
      '<table class="demo-leads-table">' +
      '<thead><tr>' +
      '<th>' + escapeHtml(c('campaignColName', lang)) + '</th>' +
      '<th>' + escapeHtml(c('campaignColChannel', lang)) + '</th>' +
      '<th>' + escapeHtml(c('campaignColBudget', lang)) + '</th>' +
      '<th>' + escapeHtml(c('campaignColStatus', lang)) + '</th>' +
      '<th>' + escapeHtml(c('campaignColLastModified', lang)) + '</th>' +
      '<th></th></tr></thead><tbody>' + trs + '</tbody></table>' +
      '</div>';
  }

  function renderTasks(vertical, lang) {
    var pane = document.getElementById('demo-pane-tasks');
    if (!pane || vertical !== 'agencija' || !window.DemoI18n) return;
    var tasks = getAgencijaData(vertical, 'tasks');
    var c = window.DemoI18n.tCommon.bind(null);
    var cols = ['todo', 'in_progress', 'done'];
    var colKeys = ['taskColTodo', 'taskColInProgress', 'taskColDone'];
    var html = cols.map(function (col, colIdx) {
      var items = tasks.filter(function (t) { return t.column === col; });
      var cards = items.map(function (t) {
        var prevBtn = (col === 'in_progress' || col === 'done') ? '<button type="button" class="demo-btn-sm demo-task-move" data-task-id="' + t.id + '" data-task-dir="prev">' + escapeHtml(c('taskMovePrev', lang)) + '</button>' : '';
        var nextBtn = (col === 'todo' || col === 'in_progress') ? '<button type="button" class="demo-btn-sm demo-task-move" data-task-id="' + t.id + '" data-task-dir="next">' + escapeHtml(c('taskMoveNext', lang)) + '</button>' : '';
        return (
          '<div class="demo-task-card" data-task-id="' + t.id + '">' +
          '<div class="demo-task-title">' + escapeHtml(t.title) + '</div>' +
          '<div class="demo-task-actions">' + prevBtn + ' ' + nextBtn + '</div>' +
          '</div>'
        );
      }).join('');
      return (
        '<div class="demo-task-column">' +
        '<h4>' + escapeHtml(c(colKeys[colIdx], lang)) + '</h4>' +
        '<div class="demo-task-cards">' + cards + '</div>' +
        '</div>'
      );
    }).join('');
    pane.innerHTML = '<div class="demo-tasks-kanban">' + html + '</div>';
  }

  function renderApprovals(vertical, lang) {
    var pane = document.getElementById('demo-pane-approvals');
    if (!pane || vertical !== 'agencija' || !window.DemoI18n) return;
    var approvals = getAgencijaData(vertical, 'approvals').filter(function (a) { return a.status === 'pending' || a.status === 'changes_requested'; });
    var c = window.DemoI18n.tCommon.bind(null);
    var typeMap = { creative: c('approvalTypeCreative', lang), copy: c('approvalTypeCopy', lang), landing: c('approvalTypeLanding', lang) };
    var statusMap = { pending: c('approvalStatusPending', lang), approved: c('approvalStatusApproved', lang), changes_requested: c('approvalStatusChanges', lang) };
    var rows = approvals.map(function (a) {
      var typeLabel = typeMap[a.type] || a.type;
      var statusLabel = statusMap[a.status] || a.status;
      var actions = '';
      if (a.status === 'pending' || a.status === 'changes_requested') {
        actions += '<button type="button" class="demo-btn-sm demo-btn-outline" data-approval-action="approve" data-approval-id="' + a.id + '">' + escapeHtml(c('approvalActionApprove', lang)) + '</button> ';
        actions += '<button type="button" class="demo-btn-sm demo-btn-outline" data-approval-action="changes" data-approval-id="' + a.id + '">' + escapeHtml(c('approvalActionRequestChanges', lang)) + '</button>';
      }
      return (
        '<div class="demo-approval-card" data-approval-id="' + a.id + '">' +
        '<div class="demo-approval-info">' +
        '<span class="demo-approval-asset">' + escapeHtml(a.assetName || a.clientName) + '</span>' +
        '<span class="demo-approval-client">' + escapeHtml(a.clientName) + '</span>' +
        '<span class="demo-approval-type">' + escapeHtml(typeLabel) + '</span>' +
        '<span class="demo-status-pill ' + escapeAttr(a.status) + '">' + escapeHtml(statusLabel) + '</span>' +
        '</div>' +
        (actions ? '<div class="demo-approval-actions">' + actions + '</div>' : '') +
        '</div>'
      );
    }).join('');
    pane.innerHTML = '<div class="demo-approvals-list">' + (rows || '<p style="color:var(--demo-muted)">' + escapeHtml(c('approvalStatusApproved', lang)) + '</p>') + '</div>';
  }

  function renderAutomations(vertical, lang) {
    var pane = document.getElementById('demo-pane-automations');
    if (!pane) return;
    var state = getAutomationsState(vertical);
    var c = window.DemoI18n && window.DemoI18n.tCommon.bind(null);
    var keys, labels;
    if (vertical === 'nekretnine') {
      keys = AUTOMATION_KEYS_NEKRETNINE;
      labels = keys.map(function (k) {
        return c('automNek' + k.charAt(0).toUpperCase() + k.slice(1), lang);
      });
    } else if (vertical === 'odvjetnik') {
      keys = AUTOMATION_KEYS_ODVJETNIK;
      labels = [
        c('automLawReminders', lang),
        c('automLawFollowup', lang),
        c('automLawDocuments', lang),
        c('automLawEmailSummary', lang),
        c('automLawTagging', lang),
      ];
    } else if (vertical === 'agencija') {
      keys = AUTOMATION_KEYS_AGENCIJA;
      labels = [
        c('automAgenLeadFollowup', lang),
        c('automAgenWeeklyReport', lang),
        c('automAgenApprovalReminder', lang),
        c('automAgenCrmSync', lang),
        c('automAgenCampaignTag', lang),
      ];
    } else {
      keys = AUTOMATION_KEYS;
      labels =
        lang === 'en'
          ? ['Follow-up after inquiry', 'Appointment reminders', 'Confirmations', 'Lead nurture', 'Weekly digest']
          : ['Follow-up nakon upita', 'Podsjetnici za termine', 'Potvrde', 'Njegovanje leadova', 'Tjedni sažetak'];
    }

    var rows = (vertical === 'agencija' ? keys : vertical === 'odvjetnik' ? keys : vertical === 'nekretnine' ? keys : AUTOMATION_KEYS).map(function (key, i) {
      var on = state[key] === true;
      var label = vertical === 'nekretnine' ? labels[i] : labels[i];
      return (
        '<div class="demo-automation-row">' +
        '<label>' + escapeHtml(label) + '</label>' +
        '<button type="button" class="demo-toggle ' + (on ? 'is-on' : '') +
        '" data-automation="' + escapeAttr(key) + '" aria-pressed="' + on + '"></button>' +
        '</div>'
      );
    }).join('');

    pane.innerHTML = '<div class="demo-automations-list">' + rows + '</div>';
  }

  function renderSettings(vertical, lang) {
    var pane = document.getElementById('demo-pane-settings');
    if (!pane || !window.DemoI18n) return;
    var c = window.DemoI18n.tCommon.bind(null);
    pane.innerHTML =
      '<div class="demo-settings-section">' +
      '<h3>' +
      escapeHtml(c('integrationSectionTitle', lang)) +
      '</h3>' +
      '<div class="demo-integration-btns">' +
      '<button type="button" class="demo-integration-btn" data-integration="calendar">' +
      escapeHtml(c('integrationConnectCalendar', lang)) +
      '</button>' +
      '<button type="button" class="demo-integration-btn" data-integration="whatsapp">' +
      escapeHtml(c('integrationConnectWhatsApp', lang)) +
      '</button>' +
      '</div>' +
      '</div>';
  }

  function closeDrawer() {
    document.body.classList.remove('demo-drawer-open');
    var overlay = document.getElementById('demo-drawer-overlay');
    if (overlay) overlay.classList.remove('is-visible');
  }

  function openDrawer() {
    document.body.classList.add('demo-drawer-open');
    var overlay = document.getElementById('demo-drawer-overlay');
    if (overlay) overlay.classList.add('is-visible');
  }

  function ensureDrawerElements(vertical) {
    var dashboard = document.getElementById('demo-dashboard');
    if (!dashboard) return;
    if (!document.getElementById('demo-drawer-overlay')) {
      var overlay = document.createElement('div');
      overlay.id = 'demo-drawer-overlay';
      overlay.className = 'demo-drawer-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      dashboard.insertBefore(overlay, dashboard.firstChild);
      overlay.addEventListener('click', closeDrawer);
    }
    var sidebar = document.querySelector('.demo-sidebar');
    if (sidebar && !document.getElementById('demo-drawer-close')) {
      var closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.id = 'demo-drawer-close';
      closeBtn.className = 'demo-drawer-close';
      closeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>';
      closeBtn.setAttribute('aria-label', 'Close menu');
      sidebar.insertBefore(closeBtn, sidebar.firstChild);
      closeBtn.addEventListener('click', closeDrawer);
    }
    var hamburger = document.getElementById('demo-hamburger');
    if (hamburger && !hamburger._drawerBound) {
      hamburger._drawerBound = true;
      hamburger.addEventListener('click', function () {
        if (document.body.classList.contains('demo-drawer-open')) closeDrawer();
        else openDrawer();
      });
    }
  }

  function showPane(vertical, tabId) {
    var panes = document.querySelectorAll('.demo-pane');
    var navButtons = document.querySelectorAll('.demo-sidebar-nav button[data-tab]');
    panes.forEach(function (p) {
      p.classList.remove('is-visible');
      if (p.id === 'demo-pane-' + tabId) p.classList.add('is-visible');
    });
    navButtons.forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-tab') === tabId);
    });
    setStoredTab(vertical, tabId);
    closeDrawer();
  }

  function showDashboard(vertical, openTab, lang) {
    var landing = document.getElementById('demo-landing-wrap');
    var dashboard = document.getElementById('demo-dashboard');
    if (!landing || !dashboard) return;
    landing.style.display = 'none';
    dashboard.classList.add('is-visible');

    var tab = openTab || getStoredTab(vertical);
    if (tab === 'bookings' && !hasBookings(vertical)) tab = 'overview';
    if (tab === 'viewings' && !hasViewings(vertical)) tab = 'overview';
    if (tab === 'properties' && !hasProperties(vertical)) tab = 'overview';
    if (vertical === 'ordinacija' && ['leads', 'viewings', 'properties'].indexOf(tab) >= 0) tab = 'overview';
    if (vertical === 'odvjetnik' && ['leads', 'bookings', 'viewings', 'properties'].indexOf(tab) >= 0) tab = 'overview';
    showPane(vertical, tab);
    renderOverview(vertical, lang);
    renderInbox(vertical, lang);
    if (vertical !== 'ordinacija' && vertical !== 'odvjetnik') renderLeads(vertical, lang);
    if (vertical === 'odvjetnik') {
      renderOdvjetnikClients(vertical, lang);
      renderOdvjetnikCases(vertical, lang);
      renderOdvjetnikDocuments(vertical, lang);
      renderOdvjetnikDeadlines(vertical, lang);
    }
    if (hasBookings(vertical)) renderBookings(vertical, lang);
    if (vertical === 'ordinacija') {
      renderTriage(vertical, lang);
      renderPatients(vertical, lang);
      renderInstructions(vertical, lang);
    }
    if (vertical === 'salon') {
      renderClients(vertical, lang);
      renderServices(vertical, lang);
      renderTeam(vertical, lang);
    }
    if (vertical === 'agencija') {
      renderAgencijaClients(vertical, lang);
      renderCampaigns(vertical, lang);
      renderTasks(vertical, lang);
      renderApprovals(vertical, lang);
    }
    if (hasViewings(vertical)) renderViewings(vertical, lang);
    if (hasProperties(vertical)) renderProperties(vertical, lang);
    renderAutomations(vertical, lang);
    renderSettings(vertical, lang);
    window.scrollTo(0, 0);
  }

  function showLanding(vertical) {
    var landing = document.getElementById('demo-landing-wrap');
    var dashboard = document.getElementById('demo-dashboard');
    if (!landing || !dashboard) return;
    dashboard.classList.remove('is-visible');
    landing.style.display = '';
    window.scrollTo(0, 0);
  }

  function escapeHtml(s) {
    if (s == null) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function escapeAttr(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function renderDebugBox(vertical, urlViewAndTab) {
    if (!DEBUG || typeof location === 'undefined') return;
    var pathAndSearch = location.pathname + location.search;
    var detectedVertical = (document.body && document.body.getAttribute('data-vertical')) || '(none)';
    var params = new URLSearchParams(location.search);
    var requestedTab = params.get('tab') || '(none)';
    var normalizedTab = urlViewAndTab ? urlViewAndTab.tab : '(n/a)';
    var allowedTabs = getAllowedTabs(vertical);
    var dashboardActive = urlViewAndTab && urlViewAndTab.view === 'dashboard';
    var sidebarBtns = document.querySelectorAll('.demo-sidebar-nav button[data-tab]');
    var sidebarTabs = [].map.call(sidebarBtns, function (b) { return b.getAttribute('data-tab'); }).join(', ') || '(none)';
    var id = 'demo-debug-box';
    var el = document.getElementById(id);
    if (!el) {
      el = document.createElement('div');
      el.id = id;
      el.setAttribute('style', 'position:fixed;bottom:12px;right:12px;max-width:320px;padding:10px;font:11px/1.4 monospace;background:#1a1a1a;color:#eee;border:1px solid #444;border-radius:6px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.4);');
      document.body.appendChild(el);
    }
    el.innerHTML =
      '<div style="font-weight:bold;margin-bottom:6px;">Debug (debug=1)</div>' +
      '<div>1) path+search: ' + escapeHtml(pathAndSearch) + '</div>' +
      '<div>2) vertical: ' + escapeHtml(detectedVertical) + '</div>' +
      '<div>3) requested tab: ' + escapeHtml(requestedTab) + '</div>' +
      '<div>4) normalized tab: ' + escapeHtml(normalizedTab) + '</div>' +
      '<div>5) allowed tabs: ' + escapeHtml(allowedTabs.join(', ')) + '</div>' +
      '<div>6) dashboard active: ' + (dashboardActive ? 'true' : 'false') + '</div>' +
      '<div>7) sidebar data-tab: ' + escapeHtml(sidebarTabs) + '</div>';
  }

  function applyLeadStatusChange(vertical, leadId, newStatus) {
    if (vertical !== 'nekretnine') return;
    var base = window.DemoMockData && window.DemoMockData.getVerticalData(vertical);
    var leads = (base && base.leads) ? JSON.parse(JSON.stringify(base.leads)) : [];
    var state = getNekretnineState();
    if (Array.isArray(state.leads) && state.leads.length) leads = JSON.parse(JSON.stringify(state.leads));
    var lead = leads.find(function (l) { return l.id === leadId; });
    if (lead) {
      lead.status = newStatus;
      lead.nextStep = newStatus === 'closed' ? '-' : newStatus === 'qualified' ? 'viewing' : lead.nextStep;
      state.leads = leads;
      state.viewings = state.viewings || getNekretnineData(vertical, 'viewings');
      state.properties = state.properties || getNekretnineData(vertical, 'properties');
      setNekretnineState(state);
    }
  }

  function applySalonBookingAction(vertical, bookingId, action) {
    if (vertical !== 'salon') return;
    var state = getSalonState();
    var base = window.DemoMockData && window.DemoMockData.getVerticalData(vertical);
    var list = (state.bookings && state.bookings.length) ? state.bookings.slice() : (base && base.bookings) ? base.bookings.map(function (b) { return Object.assign({}, b); }) : [];
    var b = list.find(function (x) { return x.id === bookingId; });
    if (!b) return;
    if (action === 'confirm') b.status = 'confirmed';
    else if (action === 'cancel') b.status = 'cancelled';
    else if (action === 'completed') b.status = 'completed';
    else if (action === 'noshow') b.status = 'noshow';
    state.bookings = list;
    state.clientNotes = state.clientNotes || {};
    state.services = state.services || {};
    setSalonState(state);
  }

  function openReminderModal(lang) {
    var c = window.DemoI18n && window.DemoI18n.tCommon.bind(null);
    if (!c) return;
    var msg = c('reminderSentMessage', lang);
    var closeLabel = c('modalClose', lang);
    var existing = document.getElementById('demo-reminder-modal');
    if (existing) existing.remove();
    var backdrop = document.createElement('div');
    backdrop.id = 'demo-reminder-modal';
    backdrop.className = 'demo-modal-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.innerHTML =
      '<div class="demo-modal">' +
      '<h3>' + escapeHtml(msg) + '</h3>' +
      '<div class="demo-modal-actions">' +
      '<button type="button" class="demo-btn-cta demo-reminder-close">' + escapeHtml(closeLabel) + '</button>' +
      '</div></div>';
    document.body.appendChild(backdrop);
    function close() { backdrop.remove(); }
    backdrop.addEventListener('click', function (ev) { if (ev.target === backdrop) close(); });
    backdrop.querySelector('.demo-reminder-close').addEventListener('click', close);
  }

  function applyViewingStatusChange(vertical, viewingId, action) {
    if (vertical !== 'nekretnine') return;
    var statusMap = { confirm: 'confirmed', done: 'done', noshow: 'noshow' };
    var newStatus = statusMap[action];
    if (!newStatus) return;
    var base = window.DemoMockData && window.DemoMockData.getVerticalData(vertical);
    var viewings = (base && base.viewings) ? JSON.parse(JSON.stringify(base.viewings)) : [];
    var state = getNekretnineState();
    if (Array.isArray(state.viewings) && state.viewings.length) viewings = JSON.parse(JSON.stringify(state.viewings));
    var v = viewings.find(function (x) { return x.id === viewingId; });
    if (v) {
      v.status = newStatus;
      state.viewings = viewings;
      state.leads = state.leads || getNekretnineData(vertical, 'leads');
      state.properties = state.properties || getNekretnineData(vertical, 'properties');
      setNekretnineState(state);
    }
  }

  function addViewing(vertical, viewing) {
    var state = getNekretnineState();
    var viewings = (state.viewings || getNekretnineData(vertical, 'viewings')).slice();
    var maxId = viewings.reduce(function (m, x) { return x.id > m ? x.id : m; }, 0);
    viewing.id = maxId + 1;
    viewings.push(viewing);
    state.viewings = viewings;
    state.leads = state.leads || getNekretnineData(vertical, 'leads');
    state.properties = state.properties || getNekretnineData(vertical, 'properties');
    setNekretnineState(state);
  }

  function openScheduleViewingModal(vertical, leadId, lang) {
    var leads = getNekretnineData(vertical, 'leads');
    var properties = getNekretnineData(vertical, 'properties');
    var lead = leads.find(function (l) { return l.id === leadId; });
    if (!lead) return;
    var c = window.DemoI18n && window.DemoI18n.tCommon.bind(null);
    var opts = properties.filter(function (p) { return p.status === 'active'; }).map(function (p) {
      return '<option value="' + p.id + '">' + escapeHtml(p.name) + '</option>';
    }).join('');
    var existing = document.getElementById('demo-schedule-viewing-modal');
    if (existing) existing.remove();
    var backdrop = document.createElement('div');
    backdrop.id = 'demo-schedule-viewing-modal';
    backdrop.className = 'demo-modal-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.innerHTML =
      '<div class="demo-modal">' +
      '<h3>' + escapeHtml(c('scheduleViewingTitle', lang)) + '</h3>' +
      '<p style="color:var(--demo-muted);font-size:0.875rem;margin-bottom:1rem">' + escapeHtml(lead.name) + '</p>' +
      '<div class="demo-form-group"><label>' + escapeHtml(c('scheduleViewingDate', lang)) + '</label><input type="text" class="demo-input" id="demo-sv-date" value="10.2.2026" /></div>' +
      '<div class="demo-form-group"><label>' + escapeHtml(c('scheduleViewingTime', lang)) + '</label><input type="text" class="demo-input" id="demo-sv-time" value="14:00" /></div>' +
      '<div class="demo-form-group"><label>' + escapeHtml(c('scheduleViewingProperty', lang)) + '</label><select class="demo-input" id="demo-sv-property"><option value="">—</option>' + opts + '</select></div>' +
      '<div class="demo-modal-actions">' +
      '<button type="button" class="demo-btn-cancel">' + escapeHtml(c('modalClose', lang)) + '</button>' +
      '<button type="button" class="demo-btn-cta demo-schedule-submit">' + escapeHtml(c('scheduleViewingSubmit', lang)) + '</button>' +
      '</div></div>';
    document.body.appendChild(backdrop);
    function close() {
      backdrop.remove();
    }
    backdrop.addEventListener('click', function (ev) {
      if (ev.target === backdrop) close();
    });
    backdrop.querySelector('.demo-btn-cancel').addEventListener('click', close);
    backdrop.querySelector('.demo-schedule-submit').addEventListener('click', function () {
      var dateVal = document.getElementById('demo-sv-date').value;
      var timeVal = document.getElementById('demo-sv-time').value;
      var propId = parseInt(document.getElementById('demo-sv-property').value, 10);
      var prop = properties.find(function (p) { return p.id === propId; });
      addViewing(vertical, {
        dateTime: dateVal + ' ' + timeVal,
        propertyId: propId,
        client: lead.name,
        agent: 'Marina L.',
        status: 'scheduled',
      });
      close();
      renderViewings(vertical, lang);
    });
  }

  function openPropertyDetail(vertical, propId, lang) {
    var properties = getNekretnineData(vertical, 'properties');
    var prop = properties.find(function (p) { return p.id === propId; });
    if (!prop) return;
    var c = window.DemoI18n && window.DemoI18n.tCommon.bind(null);
    var statusMap = { active: c('propStatusActive', lang), sold: c('propStatusSold', lang), rented: c('propStatusRented', lang) };
    var leads = getNekretnineData(vertical, 'leads');
    var leadOpts = leads.filter(function (l) { return l.status !== 'closed'; }).map(function (l) {
      return '<option value="' + l.id + '">' + escapeHtml(l.name) + '</option>';
    }).join('');
    var panel = document.getElementById('demo-property-detail');
    if (!panel) return;
    panel.querySelector('.demo-property-detail-photos').innerHTML =
      '<div class="demo-property-photo-placeholder"></div>';
    panel.querySelector('.demo-property-detail-facts').innerHTML =
      '<h4>' + escapeHtml(prop.name) + '</h4>' +
      '<p><strong>' + escapeHtml(prop.location) + '</strong></p>' +
      '<p>' + escapeHtml(prop.price) + ' · ' + escapeHtml(prop.type) + '</p>' +
      '<span class="demo-status-pill ' + escapeAttr(prop.status) + '">' + escapeHtml(statusMap[prop.status] || prop.status) + '</span>';
    panel.querySelector('.demo-connect-lead-select').innerHTML = '<option value="">—</option>' + leadOpts;
    panel.style.display = 'block';
  }

  function applyTriageStatusChange(vertical, triageId, newStatus) {
    if (vertical !== 'ordinacija') return;
    var base = window.DemoMockData && window.DemoMockData.getVerticalData(vertical);
    var triage = (base && base.triage) ? JSON.parse(JSON.stringify(base.triage)) : [];
    var state = getOrdinacijaState();
    if (Array.isArray(state.triage) && state.triage.length) triage = JSON.parse(JSON.stringify(state.triage));
    var item = triage.find(function (t) { return t.id === triageId; });
    if (item) {
      item.status = newStatus;
      state.triage = triage;
      state.appointments = state.appointments || getOrdinacijaData(vertical, 'appointments');
      state.patients = state.patients || getOrdinacijaData(vertical, 'patients');
      state.patientNotes = state.patientNotes || {};
      state.patientHistory = state.patientHistory || {};
      setOrdinacijaState(state);
    }
  }

  function applyAppointmentStatusChange(vertical, appointId, action) {
    if (vertical !== 'ordinacija') return;
    var statusMap = { confirm: 'confirmed', cancel: 'cancelled', completed: 'completed', noshow: 'noshow' };
    var newStatus = statusMap[action];
    if (!newStatus) return;
    var base = window.DemoMockData && window.DemoMockData.getVerticalData(vertical);
    var appointments = (base && base.appointments) ? JSON.parse(JSON.stringify(base.appointments)) : [];
    var state = getOrdinacijaState();
    if (Array.isArray(state.appointments) && state.appointments.length) appointments = JSON.parse(JSON.stringify(state.appointments));
    var a = appointments.find(function (x) { return x.id === appointId; });
    if (a) {
      a.status = newStatus;
      state.appointments = appointments;
      state.triage = state.triage || getOrdinacijaData(vertical, 'triage');
      state.patients = state.patients || getOrdinacijaData(vertical, 'patients');
      state.patientNotes = state.patientNotes || {};
      state.patientHistory = state.patientHistory || {};
      setOrdinacijaState(state);
    }
  }

  function addAppointmentOrdinacija(vertical, appointment) {
    var state = getOrdinacijaState();
    var appointments = (state.appointments && state.appointments.length) ? state.appointments.slice() : getOrdinacijaData(vertical, 'appointments').slice();
    var maxId = appointments.reduce(function (m, x) { return x.id > m ? x.id : m; }, 0);
    appointment.id = maxId + 1;
    appointments.push(appointment);
    state.appointments = appointments;
    state.triage = state.triage || getOrdinacijaData(vertical, 'triage');
    state.patients = state.patients || getOrdinacijaData(vertical, 'patients');
    state.patientNotes = state.patientNotes || {};
    state.patientHistory = state.patientHistory || {};
    setOrdinacijaState(state);
  }

  function setPatientNotesOrdinacija(vertical, patientId, text) {
    var state = getOrdinacijaState();
    state.patientNotes = state.patientNotes || {};
    state.patientNotes[patientId] = text;
    state.triage = state.triage || getOrdinacijaData(vertical, 'triage');
    state.appointments = state.appointments || getOrdinacijaData(vertical, 'appointments');
    state.patients = state.patients || getOrdinacijaData(vertical, 'patients');
    state.patientHistory = state.patientHistory || {};
    setOrdinacijaState(state);
  }

  function addPatientHistoryEntry(vertical, patientId, entry) {
    var state = getOrdinacijaState();
    state.patientHistory = state.patientHistory || {};
    if (!state.patientHistory[patientId]) state.patientHistory[patientId] = [];
    state.patientHistory[patientId].push(entry);
    state.triage = state.triage || getOrdinacijaData(vertical, 'triage');
    state.appointments = state.appointments || getOrdinacijaData(vertical, 'appointments');
    state.patients = state.patients || getOrdinacijaData(vertical, 'patients');
    state.patientNotes = state.patientNotes || {};
    setOrdinacijaState(state);
  }

  function openScheduleAppointmentModalOrdinacija(vertical, triageItem, lang) {
    var c = window.DemoI18n && window.DemoI18n.tCommon.bind(null);
    if (!c) return;
    var existing = document.getElementById('demo-schedule-appointment-modal');
    if (existing) existing.remove();
    var backdrop = document.createElement('div');
    backdrop.id = 'demo-schedule-appointment-modal';
    backdrop.className = 'demo-modal-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.innerHTML =
      '<div class="demo-modal">' +
      '<h3>' + escapeHtml(c('scheduleAppointmentTitle', lang)) + '</h3>' +
      '<p style="color:var(--demo-muted);font-size:0.875rem;margin-bottom:1rem">' + escapeHtml(triageItem.patient) + '</p>' +
      '<div class="demo-form-group"><label>Datum</label><input type="text" class="demo-input" id="demo-sa-date" value="10.2.2026" /></div>' +
      '<div class="demo-form-group"><label>Vrijeme</label><input type="text" class="demo-input" id="demo-sa-time" value="14:00" /></div>' +
      '<div class="demo-form-group"><label>Usluga</label><input type="text" class="demo-input" id="demo-sa-service" value="' + escapeAttr(triageItem.recommendation || 'Pregled') + '" /></div>' +
      '<div class="demo-modal-actions">' +
      '<button type="button" class="demo-btn-cancel">' + escapeHtml(c('modalClose', lang)) + '</button>' +
      '<button type="button" class="demo-btn-cta demo-schedule-appointment-submit">' + escapeHtml(c('scheduleAppointmentSubmit', lang)) + '</button>' +
      '</div></div>';
    document.body.appendChild(backdrop);
    function close() { backdrop.remove(); }
    backdrop.addEventListener('click', function (ev) { if (ev.target === backdrop) close(); });
    backdrop.querySelector('.demo-btn-cancel').addEventListener('click', close);
    backdrop.querySelector('.demo-schedule-appointment-submit').addEventListener('click', function () {
      var dateVal = document.getElementById('demo-sa-date').value;
      var timeVal = document.getElementById('demo-sa-time').value;
      var serviceVal = document.getElementById('demo-sa-service').value || 'Pregled';
      var patients = getOrdinacijaData(vertical, 'patients');
      var patient = patients.find(function (p) { return p.name === triageItem.patient; });
      var patientId = patient ? patient.id : triageItem.id;
      addAppointmentOrdinacija(vertical, {
        patientId: patientId,
        client: triageItem.patient,
        service: serviceVal,
        date: dateVal.replace(/(\d+)\.(\d+)\.(\d+)/, '$1.$2.$3'),
        dateLabel: dateVal,
        time: timeVal,
        status: 'booked',
      });
      close();
      renderBookings(vertical, lang);
    });
  }

  function showInstructionsSentModal(lang) {
    var c = window.DemoI18n && window.DemoI18n.tCommon.bind(null);
    if (!c) return;
    var existing = document.getElementById('demo-instructions-sent-modal');
    if (existing) existing.remove();
    var backdrop = document.createElement('div');
    backdrop.id = 'demo-instructions-sent-modal';
    backdrop.className = 'demo-modal-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.innerHTML =
      '<div class="demo-modal">' +
      '<h3>' + escapeHtml(c('instructionsSentTitle', lang)) + '</h3>' +
      '<p>' + escapeHtml(c('instructionsSentMessage', lang)) + '</p>' +
      '<div class="demo-modal-actions">' +
      '<button type="button" class="demo-btn-cta demo-instructions-sent-close">' + escapeHtml(c('modalClose', lang)) + '</button>' +
      '</div></div>';
    document.body.appendChild(backdrop);
    backdrop.querySelector('.demo-instructions-sent-close').addEventListener('click', function () { backdrop.remove(); });
    backdrop.addEventListener('click', function (ev) { if (ev.target === backdrop) backdrop.remove(); });
  }

  function openAddCaseNoteModal(vertical, caseId, lang) {
    var c = window.DemoI18n && window.DemoI18n.tCommon.bind(null);
    if (!c) return;
    var state = getOdvjetnikState();
    var caseNotes = state.caseNotes || {};
    var existing = document.getElementById('demo-case-note-modal');
    if (existing) existing.remove();
    var backdrop = document.createElement('div');
    backdrop.id = 'demo-case-note-modal';
    backdrop.className = 'demo-modal-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.innerHTML =
      '<div class="demo-modal">' +
      '<h3>' + escapeHtml(c('caseAddNote', lang)) + '</h3>' +
      '<textarea class="demo-input demo-notes-textarea" id="demo-case-note-text" rows="4" placeholder="Unesite bilješku..."></textarea>' +
      '<div class="demo-modal-actions">' +
      '<button type="button" class="demo-btn-cancel demo-case-note-cancel">' + escapeHtml(c('modalClose', lang)) + '</button>' +
      '<button type="button" class="demo-btn-cta demo-case-note-submit">' + (lang === 'en' ? 'Save' : 'Spremi') + '</button>' +
      '</div></div>';
    document.body.appendChild(backdrop);
    var textarea = document.getElementById('demo-case-note-text');
    if (caseNotes[caseId]) textarea.value = caseNotes[caseId];
    function close() { backdrop.remove(); }
    backdrop.addEventListener('click', function (ev) { if (ev.target === backdrop) close(); });
    backdrop.querySelector('.demo-case-note-cancel').addEventListener('click', close);
    backdrop.querySelector('.demo-case-note-submit').addEventListener('click', function () {
      var note = textarea.value.trim();
      state = getOdvjetnikState();
      state.caseNotes = state.caseNotes || {};
      if (!state.caseNotes[caseId]) state.caseNotes[caseId] = '';
      state.caseNotes[caseId] += (state.caseNotes[caseId] ? '\n' : '') + note;
      var cases = (state.cases && state.cases.length) ? state.cases.slice() : (window.DemoMockData.getVerticalData(vertical).cases || []).slice();
      var cs = cases.find(function (x) { return x.id === caseId; });
      if (cs) cs.zadnjaAktivnost = new Date().toLocaleDateString('hr-HR', { day: 'numeric', month: 'numeric', year: 'numeric' });
      state.cases = cases;
      setOdvjetnikState(state);
      close();
      renderOdvjetnikCases(vertical, lang);
    });
  }

  function openDocGenerateModal(vertical, docId, lang) {
    var c = window.DemoI18n && window.DemoI18n.tCommon.bind(null);
    if (!c) return;
    var base = window.DemoMockData.getVerticalData(vertical);
    var docs = (getOdvjetnikState().documents && getOdvjetnikState().documents.length) ? getOdvjetnikState().documents.slice() : (base.documents || []).slice();
    var doc = docs.find(function (x) { return x.id === docId; });
    if (!doc) return;
    var previewText = lang === 'en'
      ? 'This is a mock draft preview. In production, AI would generate document content based on case context.'
      : 'Ovo je pretpregled nacrta. U produkciji bi AI generirao sadržaj dokumenta na temelju konteksta slučaja.';
    var existing = document.getElementById('demo-doc-generate-modal');
    if (existing) existing.remove();
    var backdrop = document.createElement('div');
    backdrop.id = 'demo-doc-generate-modal';
    backdrop.className = 'demo-modal-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.innerHTML =
      '<div class="demo-modal">' +
      '<h3>' + escapeHtml(c('docActionGenerate', lang)) + '</h3>' +
      '<p style="color:var(--demo-muted);font-size:0.875rem;margin-bottom:1rem">' + escapeHtml(previewText) + '</p>' +
      '<div class="demo-modal-actions">' +
      '<button type="button" class="demo-btn-cancel demo-doc-generate-cancel">' + escapeHtml(c('modalClose', lang)) + '</button>' +
      '<button type="button" class="demo-btn-cta demo-doc-generate-ok">' + (lang === 'en' ? 'Done' : 'Gotovo') + '</button>' +
      '</div></div>';
    document.body.appendChild(backdrop);
    function close() { backdrop.remove(); }
    backdrop.addEventListener('click', function (ev) { if (ev.target === backdrop) close(); });
    backdrop.querySelector('.demo-doc-generate-cancel').addEventListener('click', close);
    backdrop.querySelector('.demo-doc-generate-ok').addEventListener('click', function () {
      var state = getOdvjetnikState();
      var docsList = (state.documents && state.documents.length) ? state.documents.slice() : (base.documents || []).slice();
      var d = docsList.find(function (x) { return x.id === docId; });
      if (d) {
        d.status = 'draft';
        state.documents = docsList;
        setOdvjetnikState(state);
      }
      close();
      renderOdvjetnikDocuments(vertical, lang);
    });
  }

  function openIntegrationModal(lang) {
    lang = lang || getLang();
    var i18n = window.DemoI18n;
    if (!i18n) return;
    var c = i18n.tCommon.bind(null);
    var url = contactUrl();
    var title = c('integrationModalTitle', lang);
    var text = c('integrationModalText', lang);
    var ctaLabel = c('integrationModalCta', lang);
    var closeLabel = c('modalClose', lang);

    var existing = document.getElementById('demo-integration-modal');
    if (existing) existing.remove();

    var backdrop = document.createElement('div');
    backdrop.id = 'demo-integration-modal';
    backdrop.className = 'demo-modal-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.innerHTML =
      '<div class="demo-modal">' +
      '<h3>' +
      escapeHtml(title) +
      '</h3>' +
      '<p>' +
      escapeHtml(text) +
      '</p>' +
      '<div class="demo-modal-actions">' +
      '<button type="button" class="demo-btn-cancel">' +
      escapeHtml(closeLabel) +
      '</button>' +
      '<a href="' +
      escapeAttr(url) +
      '" class="demo-btn-cta">' +
      escapeHtml(ctaLabel) +
      '</a>' +
      '</div>' +
      '</div>';

    document.body.appendChild(backdrop);

    function close() {
      backdrop.remove();
    }

    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) close();
    });
    var cancelBtn = backdrop.querySelector('.demo-btn-cancel');
    if (cancelBtn) cancelBtn.addEventListener('click', close);
  }

  function init() {
    var vertical = getVertical();
    var lang = getLang();

    renderLanding(vertical, lang);
    renderTopbar(vertical, lang);
    renderSidebar(vertical, lang);
    renderFooter(lang);

    var url = getUrlViewAndTab(vertical);
    var landingWrap = document.getElementById('demo-landing-wrap');
    var dashboard = document.getElementById('demo-dashboard');

    if (url.view === 'dashboard' && dashboard) {
      setStoredTab(vertical, url.tab);
      ensureDashboardContent(vertical, lang);
      showDashboard(vertical, url.tab, lang);
      bindDashboardEvents(vertical, lang);
      updateUrlDashboard(vertical, url.tab);
    } else if (dashboard) {
      showPane(vertical, getStoredTab(vertical));
      renderOverview(vertical, lang);
      renderInbox(vertical, lang);
      if (vertical !== 'ordinacija' && vertical !== 'salon') renderLeads(vertical, lang);
      if (hasBookings(vertical)) renderBookings(vertical, lang);
      if (vertical === 'salon') {
        renderClients(vertical, lang);
        renderServices(vertical, lang);
        renderTeam(vertical, lang);
      }
      if (vertical === 'ordinacija') {
        renderTriage(vertical, lang);
        renderPatients(vertical, lang);
        renderInstructions(vertical, lang);
      }
      if (hasViewings(vertical)) renderViewings(vertical, lang);
      if (hasProperties(vertical)) renderProperties(vertical, lang);
      renderAutomations(vertical, lang);
      renderSettings(vertical, lang);
    }

    document.addEventListener('click', function (e) {
      var target = e.target;
      if (!target || !target.closest) return;

      var featureCta = target.closest('.demo-feature-cta[data-demo-tab]');
      if (featureCta && landingWrap && dashboard) {
        e.preventDefault();
        var tab = featureCta.getAttribute('data-demo-tab');
        var content = document.getElementById('demo-content');
        if (content) {
          content.innerHTML = '<div class="demo-skeleton" style="height:200px;width:100%"></div>';
          content.style.minHeight = '200px';
        }
        setTimeout(function () {
          if (content) {
            content.style.minHeight = '';
            content.innerHTML =
              '<a href="#" id="demo-back-to-landing" class="demo-back-link"></a>' +
              '<div id="demo-pane-overview" class="demo-pane"></div>' +
              '<div id="demo-pane-inbox" class="demo-pane"></div>' +
              (vertical === 'odvjetnik' ? '<div id="demo-pane-clients" class="demo-pane"></div><div id="demo-pane-cases" class="demo-pane"></div><div id="demo-pane-documents" class="demo-pane"></div><div id="demo-pane-deadlines" class="demo-pane"></div>' : '') +
              (vertical === 'ordinacija' ? '' : vertical === 'salon' ? '' : vertical === 'odvjetnik' ? '' : '<div id="demo-pane-leads" class="demo-pane"></div>') +
              (vertical === 'ordinacija' ? '<div id="demo-pane-triage" class="demo-pane"></div>' : '') +
              (hasBookings(vertical) ? '<div id="demo-pane-bookings" class="demo-pane"></div>' : '') +
              (vertical === 'ordinacija' ? '<div id="demo-pane-patients" class="demo-pane"></div><div id="demo-pane-instructions" class="demo-pane"></div>' : '') +
              (vertical === 'salon' ? '<div id="demo-pane-clients" class="demo-pane"></div><div id="demo-pane-services" class="demo-pane"></div><div id="demo-pane-team" class="demo-pane"></div>' : '') +
              (vertical === 'agencija' ? '<div id="demo-pane-clients" class="demo-pane"></div><div id="demo-pane-campaigns" class="demo-pane"></div><div id="demo-pane-tasks" class="demo-pane"></div><div id="demo-pane-approvals" class="demo-pane"></div>' : '') +
              (hasViewings(vertical) ? '<div id="demo-pane-viewings" class="demo-pane"></div>' : '') +
              (hasProperties(vertical) ? '<div id="demo-pane-properties" class="demo-pane"></div>' : '') +
              '<div id="demo-pane-automations" class="demo-pane"></div>' +
              '<div id="demo-pane-settings" class="demo-pane"></div>';
            var backLink = document.getElementById('demo-back-to-landing');
            if (backLink && window.DemoI18n) {
              backLink.textContent = window.DemoI18n.tCommon('backToLanding', lang);
              backLink.href = '#';
            }
          }
          renderTopbar(vertical, lang);
          var sidebar = document.getElementById('demo-sidebar-nav');
          if (sidebar) renderSidebar(vertical, lang);
          ensureDrawerElements(vertical);
          showDashboard(vertical, tab, lang);
          bindDashboardEvents(vertical, lang);
          updateUrlDashboard(vertical, tab);
        }, SKELETON_MS);
        return;
      }

      var langBtn = target.closest('.demo-lang-toggle button[data-lang]');
      if (langBtn) {
        e.preventDefault();
        var newLang = langBtn.getAttribute('data-lang');
        setLang(newLang);
        var v = getVertical();
        renderLanding(v, newLang);
        renderTopbar(v, newLang);
        renderSidebar(v, newLang);
        renderFooter(newLang);
        renderOverview(v, newLang);
        renderInbox(v, newLang);
        if (v !== 'odvjetnik') renderLeads(v, newLang);
        if (v === 'odvjetnik') {
          renderOdvjetnikClients(v, newLang);
          renderOdvjetnikCases(v, newLang);
          renderOdvjetnikDocuments(v, newLang);
          renderOdvjetnikDeadlines(v, newLang);
        }
        if (v === 'salon') {
          renderClients(v, newLang);
          renderServices(v, newLang);
          renderTeam(v, newLang);
        }
        if (v === 'agencija') {
          renderAgencijaClients(v, newLang);
          renderCampaigns(v, newLang);
          renderTasks(v, newLang);
          renderApprovals(v, newLang);
        }
        if (hasBookings(v)) renderBookings(v, newLang);
        if (hasViewings(v)) renderViewings(v, newLang);
        if (hasProperties(v)) renderProperties(v, newLang);
        renderAutomations(v, newLang);
        renderSettings(v, newLang);
        var backLink = document.getElementById('demo-back-to-landing');
        if (backLink && window.DemoI18n) backLink.textContent = window.DemoI18n.tCommon('backToLanding', newLang);
        var contactLink = document.querySelector('.demo-topbar .demo-btn-contact');
        if (contactLink) contactLink.href = contactUrl();
        bindDashboardEvents(v, newLang);
        return;
      }

      var tabBtn = target.closest('.demo-sidebar-nav button[data-tab]');
      if (tabBtn) {
        e.preventDefault();
        var tabId = tabBtn.getAttribute('data-tab');
        showPane(vertical, tabId);
        updateUrlDashboard(vertical, tabId);
        closeDrawer();
        return;
      }

      var backToLanding = target.closest('#demo-back-to-landing');
      if (backToLanding) {
        e.preventDefault();
        showLanding(vertical);
        updateUrlLanding();
        return;
      }

      var resetBtn = target.closest('#demo-reset');
      if (resetBtn) {
        e.preventDefault();
        setStoredTab(vertical, 'overview');
        setAutomationsState(vertical, {});
        try {
          localStorage.removeItem(STORAGE_STATE_NEKRETNINE);
          if (vertical === 'salon') localStorage.removeItem(STORAGE_STATE_SALON);
          if (vertical === 'ordinacija') localStorage.removeItem(STORAGE_STATE_ORDINACIJA);
          if (vertical === 'odvjetnik') localStorage.removeItem(STORAGE_STATE_ODVJETNIK);
          if (vertical === 'agencija') localStorage.removeItem(STORAGE_STATE_AGENCIJA);
        } catch (err) {}
        showLanding(vertical);
        return;
      }

      var bookingFilter = target.closest('.demo-filter-btn[data-booking-filter]');
      if (bookingFilter && vertical === 'salon') {
        e.preventDefault();
        var filter = bookingFilter.getAttribute('data-booking-filter');
        var pane = document.getElementById('demo-pane-bookings');
        if (pane && filter) {
          pane.setAttribute('data-booking-filter', filter);
          document.querySelectorAll('.demo-booking-filters .demo-filter-btn').forEach(function (btn) {
            btn.classList.toggle('is-active', btn.getAttribute('data-booking-filter') === filter);
          });
          renderBookings(vertical, getLang());
        }
        return;
      }

      var bookingAction = target.closest('[data-booking-action][data-booking-id]');
      if (bookingAction && vertical === 'salon') {
        e.preventDefault();
        var action = bookingAction.getAttribute('data-booking-action');
        var bookingId = parseInt(bookingAction.getAttribute('data-booking-id'), 10);
        if (action === 'reminder') {
          openReminderModal(getLang());
        } else {
          applySalonBookingAction(vertical, bookingId, action);
          renderBookings(vertical, getLang());
        }
        return;
      }

      var appointAction = target.closest('[data-appoint-action][data-appoint-id]');
      if (appointAction && vertical === 'ordinacija') {
        e.preventDefault();
        var act = appointAction.getAttribute('data-appoint-action');
        var appointId = parseInt(appointAction.getAttribute('data-appoint-id'), 10);
        applyAppointmentStatusChange(vertical, appointId, act);
        renderBookings(vertical, getLang());
        return;
      }

      var triageActionBtn = target.closest('[data-triage-action][data-triage-id]');
      if (triageActionBtn && vertical === 'ordinacija') {
        e.preventDefault();
        var triageAct = triageActionBtn.getAttribute('data-triage-action');
        var triageId = parseInt(triageActionBtn.getAttribute('data-triage-id'), 10);
        var triageItems = getOrdinacijaData(vertical, 'triage');
        var triageItem = triageItems.find(function (t) { return t.id === triageId; });
        if (triageAct === 'call') {
          applyTriageStatusChange(vertical, triageId, 'contacted');
          renderTriage(vertical, getLang());
        } else if (triageAct === 'book' && triageItem) {
          openScheduleAppointmentModalOrdinacija(vertical, triageItem, getLang());
          renderTriage(vertical, getLang());
        } else if (triageAct === 'sendInstructions') {
          showInstructionsSentModal(getLang());
          if (triageItem) applyTriageStatusChange(vertical, triageId, 'contacted');
          renderTriage(vertical, getLang());
        }
        return;
      }

      var sendInstructionBtn = target.closest('.demo-send-instruction-btn');
      if (sendInstructionBtn && vertical === 'ordinacija') {
        e.preventDefault();
        var instId = parseInt(sendInstructionBtn.getAttribute('data-instruction-id'), 10);
        var selectEl = document.querySelector('.demo-instruction-patient-select[data-instruction-id="' + instId + '"]');
        var patientId = selectEl ? parseInt(selectEl.value, 10) : 0;
        var base = window.DemoMockData && window.DemoMockData.getVerticalData(vertical);
        var inst = (base && base.instructions) ? base.instructions.find(function (i) { return i.id === instId; }) : null;
        if (patientId && inst) {
          addPatientHistoryEntry(vertical, patientId, 'Upute poslane: ' + (inst.title || inst.service));
          renderPatients(vertical, getLang());
        }
        showInstructionsSentModal(getLang());
        return;
      }

      var patientItem = target.closest('.demo-patient-item[data-patient-id]');
      if (patientItem && vertical === 'ordinacija') {
        e.preventDefault();
        var pid = parseInt(patientItem.getAttribute('data-patient-id'), 10);
        var patients = getOrdinacijaData(vertical, 'patients');
        var patient = patients.find(function (p) { return p.id === pid; });
        document.querySelectorAll('.demo-patient-item').forEach(function (el) { el.classList.remove('is-selected'); });
        patientItem.classList.add('is-selected');
        var wrap = document.querySelector('.demo-patient-detail-wrap');
        if (wrap && patient && window.DemoI18n) {
          var c = window.DemoI18n.tCommon.bind(null);
          var lang = getLang();
          wrap.innerHTML =
            '<div class="demo-patient-detail">' +
            '<h4>' + escapeHtml(patient.name) + '</h4>' +
            '<p class="demo-patient-meta">' + escapeHtml(c('patientHistory', lang)) + '</p>' +
            '<ul class="demo-patient-history">' + (patient.history && patient.history.length ? patient.history.map(function (h) { return '<li>' + escapeHtml(h) + '</li>'; }).join('') : '<li class="demo-muted">—</li>') + '</ul>' +
            '<label class="demo-patient-notes-label">' + escapeHtml(c('patientNotes', lang)) + '</label>' +
            '<textarea class="demo-input demo-notes-textarea" data-patient-notes-id="' + patient.id + '" rows="4">' + escapeHtml(patient.notes || '') + '</textarea>' +
            '</div>';
        }
        return;
      }

      var clientRow = target.closest('.demo-client-row[data-client-id]');
      if (clientRow && vertical === 'salon') {
        e.preventDefault();
        var clientId = parseInt(clientRow.getAttribute('data-client-id'), 10);
        document.querySelectorAll('.demo-client-row').forEach(function (r) { r.classList.remove('is-active'); });
        clientRow.classList.add('is-active');
        renderClientPanel(clientId, vertical, getLang());
        return;
      }

      var serviceToggle = target.closest('.demo-toggle[data-service-toggle][data-service-id]');
      if (serviceToggle && vertical === 'salon') {
        e.preventDefault();
        var serviceId = parseInt(serviceToggle.getAttribute('data-service-id'), 10);
        var toggleType = serviceToggle.getAttribute('data-service-toggle');
        var state = getSalonState();
        state.services = state.services || {};
        state.services[serviceId] = state.services[serviceId] || {};
        var services = getSalonServices(vertical);
        var svc = services.find(function (s) { return s.id === serviceId; });
        if (svc) {
          var next = !serviceToggle.classList.contains('is-on');
          if (toggleType === 'online') state.services[serviceId].onlineBooking = next;
          if (toggleType === 'popular') state.services[serviceId].popular = next;
          setSalonState(state);
          serviceToggle.classList.toggle('is-on', next);
          serviceToggle.setAttribute('aria-pressed', next);
        }
        return;
      }

      var integrationBtn = target.closest('.demo-integration-btn');
      if (integrationBtn) {
        e.preventDefault();
        openIntegrationModal(getLang());
        return;
      }

      var inboxConvertBtn = target.closest('.demo-inbox-convert-case');
      if (inboxConvertBtn && vertical === 'odvjetnik') {
        e.preventDefault();
        var inquiryId = parseInt(inboxConvertBtn.getAttribute('data-inquiry-id'), 10);
        if (inquiryId) {
          var base = window.DemoMockData.getVerticalData(vertical);
          var inquiries = (base && base.inbox) || [];
          var inv = inquiries.find(function (x) { return x.id === inquiryId; });
          if (inv) {
            var cases = getOdvjetnikData(vertical, 'cases').length ? getOdvjetnikData(vertical, 'cases') : (base.cases || []).slice();
            var maxId = cases.reduce(function (m, x) { return x.id > m ? x.id : m; }, 0);
            cases.push({
              id: maxId + 1,
              vrsta: 'ugovorno',
              faza: 'new',
              prioritet: 'srednji',
              klijentId: 0,
              klijent: inv.name,
              zadnjaAktivnost: new Date().toLocaleDateString('hr-HR', { day: 'numeric', month: 'numeric', year: 'numeric' }),
              fromInquiryId: inquiryId,
            });
            var state = getOdvjetnikState();
            state.cases = cases;
            setOdvjetnikState(state);
            renderOdvjetnikCases(vertical, getLang());
            showPane(vertical, 'cases');
            updateUrlDashboard(vertical, 'cases');
          }
        }
        return;
      }

      var inboxItem = target.closest('.demo-inbox-item');
      if (inboxItem) {
        var items = document.querySelectorAll('.demo-inbox-item');
        items.forEach(function (el) {
          el.classList.remove('is-selected');
        });
        inboxItem.classList.add('is-selected');
        var tid = inboxItem.getAttribute('data-thread-id');
        var threads = vertical === 'odvjetnik'
          ? (getOdvjetnikData(vertical, 'inbox').length ? getOdvjetnikData(vertical, 'inbox') : ((window.DemoMockData.getVerticalData(vertical) || {}).inbox || []))
          : ((window.DemoMockData.getVerticalData(vertical) || {}).inbox || []);
        if (vertical === 'odvjetnik' && threads.length) {
          threads = threads.slice().sort(function (a, b) {
            var prio = { hitno: 0, standard: 1 };
            return (prio[a.tag] ?? 1) - (prio[b.tag] ?? 1);
          });
        }
        var t = threads.filter(function (x) {
          return String(x.id) === String(tid);
        })[0];
        var wrap = document.querySelector('.demo-inbox-detail-wrap');
        var lang = getLang();
        if (wrap && t && window.DemoI18n) {
          var c = window.DemoI18n.tCommon.bind(null);
          var q1 = c('quickReply1', lang);
          var q2 = c('quickReply2', lang);
          var q3 = c('quickReply3', lang);
          var quickRepliesTitle = c('quickRepliesTitle', lang);
          var convertLabel = c('actionConvertToCase', lang);
          var convertBtn = vertical === 'odvjetnik'
            ? '<div class="demo-inbox-convert-wrap"><button type="button" class="demo-btn-sm demo-btn-outline demo-inbox-convert-case" data-inquiry-id="' + t.id + '">' + escapeHtml(convertLabel) + '</button></div>'
            : '';
          wrap.innerHTML =
            '<div class="demo-inbox-detail">' +
            '<p><strong>' +
            escapeHtml(t.name) +
            '</strong> · ' +
            escapeHtml(t.time) +
            '</p>' +
            '<p style="color:var(--demo-muted);font-size:0.9375rem;margin-top:0.5rem">' +
            escapeHtml(t.preview) +
            '</p>' +
            '<div class="demo-quick-replies">' +
            '<h4>' + escapeHtml(quickRepliesTitle) + '</h4>' +
            '<button type="button">' + escapeHtml(q1) + '</button>' +
            '<button type="button">' + escapeHtml(q2) + '</button>' +
            '<button type="button">' + escapeHtml(q3) + '</button>' +
            convertBtn +
            '</div>' +
            '</div>';
        }
        return;
      }

      var toggleBtn = target.closest('.demo-toggle');
      if (toggleBtn) {
        var key = toggleBtn.getAttribute('data-automation');
        if (key) {
          var state = getAutomationsState(vertical);
          state[key] = !toggleBtn.classList.contains('is-on');
          setAutomationsState(vertical, state);
          toggleBtn.classList.toggle('is-on', state[key]);
          toggleBtn.setAttribute('aria-pressed', state[key]);
        }
        return;
      }

      var leadAction = target.closest('[data-lead-action]');
      if (leadAction && (vertical === 'nekretnine' || vertical === 'agencija')) {
        e.preventDefault();
        var action = leadAction.getAttribute('data-lead-action');
        var leadId = parseInt(leadAction.getAttribute('data-lead-id'), 10);
        if (vertical === 'nekretnine') {
          if (action === 'qualify') {
            applyLeadStatusChange(vertical, leadId, 'qualified');
            renderLeads(vertical, getLang());
          } else if (action === 'close') {
            applyLeadStatusChange(vertical, leadId, 'closed');
            renderLeads(vertical, getLang());
          } else if (action === 'schedule') {
            openScheduleViewingModal(vertical, leadId, getLang());
          }
        } else if (vertical === 'agencija') {
          if (action === 'qualify') {
            applyAgencijaLeadStatus(vertical, leadId, 'qualified');
            renderLeads(vertical, getLang());
          } else if (action === 'requestInfo') {
            applyAgencijaLeadStatus(vertical, leadId, 'info_requested');
            renderLeads(vertical, getLang());
          } else if (action === 'close') {
            applyAgencijaLeadStatus(vertical, leadId, 'closed');
            renderLeads(vertical, getLang());
          }
        }
        return;
      }

      var campaignAction = target.closest('[data-campaign-action]');
      if (campaignAction && vertical === 'agencija') {
        e.preventDefault();
        var cAction = campaignAction.getAttribute('data-campaign-action');
        var campaignId = parseInt(campaignAction.getAttribute('data-campaign-id'), 10);
        if (cAction === 'draft') {
          openDraftModal(getLang());
        } else if (cAction === 'pause') {
          applyAgencijaCampaignStatus(vertical, campaignId, 'paused');
          renderCampaigns(vertical, getLang());
        } else if (cAction === 'resume') {
          applyAgencijaCampaignStatus(vertical, campaignId, 'active');
          renderCampaigns(vertical, getLang());
        }
        return;
      }

      var taskMoveBtn = target.closest('.demo-task-move');
      if (taskMoveBtn && vertical === 'agencija') {
        e.preventDefault();
        var taskId = parseInt(taskMoveBtn.getAttribute('data-task-id'), 10);
        var dir = taskMoveBtn.getAttribute('data-task-dir');
        applyAgencijaTaskMove(vertical, taskId, dir);
        renderTasks(vertical, getLang());
        return;
      }

      var approvalAction = target.closest('[data-approval-action]');
      if (approvalAction && vertical === 'agencija') {
        e.preventDefault();
        var aAction = approvalAction.getAttribute('data-approval-action');
        var approvalId = parseInt(approvalAction.getAttribute('data-approval-id'), 10);
        if (aAction === 'approve') {
          applyAgencijaApproval(vertical, approvalId, 'approve');
          renderApprovals(vertical, getLang());
        } else if (aAction === 'changes') {
          openApprovalFeedbackModal(vertical, approvalId, getLang());
        }
        return;
      }

      var agencijaClientRow = target.closest('.demo-client-row[data-vertical="agencija"]');
      if (agencijaClientRow && vertical === 'agencija') {
        e.preventDefault();
        var clientId = parseInt(agencijaClientRow.getAttribute('data-client-id'), 10);
        var clients = getAgencijaData(vertical, 'clients');
        var client = clients.find(function (c) { return c.id === clientId; });
        if (!client) return;
        document.querySelectorAll('.demo-client-row[data-vertical="agencija"]').forEach(function (r) { r.classList.remove('is-selected'); });
        agencijaClientRow.classList.add('is-selected');
        var c = window.DemoI18n && window.DemoI18n.tCommon.bind(null);
        var wrap = document.querySelector('.demo-clients-detail-wrap');
        if (wrap && c) {
          wrap.innerHTML =
            '<div class="demo-client-detail">' +
            '<h4>' + escapeHtml(client.name) + '</h4>' +
            '<div class="demo-client-detail-kpis">' +
            '<div class="demo-kpi-card"><div class="demo-kpi-label">' + escapeHtml(c('clientDetailSpend', getLang())) + '</div><div class="demo-kpi-value">' + (client.spend != null ? client.spend + '\u20AC' : '-') + '</div></div>' +
            '<div class="demo-kpi-card"><div class="demo-kpi-label">' + escapeHtml(c('clientDetailLeads', getLang())) + '</div><div class="demo-kpi-value">' + (client.leads != null ? client.leads : '-') + '</div></div>' +
            '<div class="demo-kpi-card"><div class="demo-kpi-label">' + escapeHtml(c('clientDetailCpa', getLang())) + '</div><div class="demo-kpi-value">' + (client.cpa != null ? client.cpa : '-') + '</div></div>' +
            '</div>' +
            '<p class="demo-client-note"><strong>' + escapeHtml(c('clientDetailNote', getLang())) + '</strong><br>' + escapeHtml(client.note || '-') + '</p>' +
            '</div>';
        }
        return;
      }

      var viewingAction = target.closest('[data-viewing-action]');
      if (viewingAction && vertical === 'nekretnine') {
        e.preventDefault();
        var vAction = viewingAction.getAttribute('data-viewing-action');
        var viewingId = parseInt(viewingAction.getAttribute('data-viewing-id'), 10);
        applyViewingStatusChange(vertical, viewingId, vAction);
        renderViewings(vertical, getLang());
        return;
      }

      var propertyCard = target.closest('.demo-property-card');
      if (propertyCard && vertical === 'nekretnine') {
        e.preventDefault();
        var propId = parseInt(propertyCard.getAttribute('data-property-id'), 10);
        openPropertyDetail(vertical, propId, getLang());
        return;
      }

      var propDetailBackdrop = target.closest('#demo-property-detail');
      var propDetailCloseBtn = target.closest('#demo-property-detail-close');
      if (propDetailCloseBtn || (propDetailBackdrop && target === propDetailBackdrop)) {
        e.preventDefault();
        var pd = document.getElementById('demo-property-detail');
        if (pd) pd.style.display = 'none';
        return;
      }
    });

    var backLink = document.getElementById('demo-back-to-landing');
    if (backLink) {
      backLink.addEventListener('click', function (e) {
        e.preventDefault();
        showLanding(vertical);
      });
    }

    document.addEventListener('focusout', function (e) {
      var ta = e.target && e.target.closest && e.target.closest('.demo-notes-textarea[data-patient-notes-id]');
      if (ta && getVertical() === 'ordinacija') {
        var patientId = parseInt(ta.getAttribute('data-patient-notes-id'), 10);
        if (patientId) setPatientNotesOrdinacija(getVertical(), patientId, ta.value);
      }
    });
  }

  function bindDashboardEvents(vertical, lang) {
    var backLink = document.getElementById('demo-back-to-landing');
    if (backLink) {
      backLink.onclick = function (e) {
        e.preventDefault();
        showLanding(vertical);
        updateUrlLanding();
      };
    }
    var contactLink = document.querySelector('.demo-topbar .demo-btn-contact');
    if (contactLink) contactLink.href = contactUrl();
    if (DEBUG) renderDebugBox(vertical, url);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
