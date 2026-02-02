/**
 * Law demo – self-contained logic. No dependency on shared demo.js.
 * Tabs: overview, inbox, clients, cases, documents, deadlines, automations, settings
 * localStorage: law_active_tab, law_lang, law_state
 */
(function () {
  var LAW_TABS = ['overview', 'inbox', 'clients', 'cases', 'documents', 'deadlines', 'automations', 'settings'];
  var STORAGE_TAB = 'law_active_tab';
  var STORAGE_LANG = 'law_lang';
  var STORAGE_STATE = 'law_state';
  var selectedCaseId = null;
  var CONTACT_HR = 'https://www.mangai.hr/#contact';
  var CONTACT_EN = 'https://www.mangai.hr/en/#contact';

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
    renderAll();
  }

  function getActiveTab() {
    try {
      var v = localStorage.getItem(STORAGE_TAB);
      if (v && LAW_TABS.indexOf(v) >= 0) return v;
    } catch (e) {}
    return 'overview';
  }

  function setActiveTab(tab) {
    try {
      localStorage.setItem(STORAGE_TAB, tab);
    } catch (e) {}
  }

  function getState() {
    try {
      var raw = localStorage.getItem(STORAGE_STATE);
      if (raw) {
        var o = JSON.parse(raw);
        if (o && typeof o === 'object') return o;
      }
    } catch (e) {}
    return {
      casePhases: {},
      caseNotes: {},
      documentStatus: {},
      deadlineStatus: {},
      automationToggles: {},
      casesFromInbox: [],
    };
  }

  function setState(state) {
    try {
      localStorage.setItem(STORAGE_STATE, JSON.stringify(state));
    } catch (e) {}
  }

  function tr(key) {
    return window.LawData && window.LawData.tr ? window.LawData.tr(key, getLang()) : key;
  }

  function getContactUrl() {
    return getLang() === 'en' ? CONTACT_EN : CONTACT_HR;
  }

  function showLanding() {
    var wrap = document.getElementById('law-landing-wrap');
    var dash = document.getElementById('law-dashboard');
    if (wrap) wrap.style.display = 'block';
    if (dash) dash.classList.remove('is-visible');
  }

  function showDashboard(openTab) {
    var wrap = document.getElementById('law-landing-wrap');
    var dash = document.getElementById('law-dashboard');
    if (wrap) wrap.style.display = 'none';
    if (dash) dash.classList.add('is-visible');
    if (openTab) {
      setActiveTab(openTab);
    }
    switchTab(getActiveTab());
  }

  function switchTab(tab) {
    setActiveTab(tab);
    var nav = document.getElementById('law-sidebar-nav');
    if (nav) {
      nav.querySelectorAll('button').forEach(function (btn) {
        btn.classList.toggle('is-active', btn.getAttribute('data-tab') === tab);
      });
    }
    document.querySelectorAll('.law-pane').forEach(function (pane) {
      pane.classList.toggle('is-visible', pane.getAttribute('data-pane') === tab);
    });
    renderPane(tab);
    closeLawDrawer();
  }

  function renderLanding() {
    var el = document.getElementById('law-landing');
    if (!el || !window.LawData) return;
    var lang = getLang();
    var d = window.LawData.data;
    var features = [
      { titleKey: 'featClientsTitle', b1: 'featClientsBullet1', b2: 'featClientsBullet2', ctaKey: 'featClientsCta', tab: 'clients' },
      { titleKey: 'featInboxTitle', b1: 'featInboxBullet1', b2: 'featInboxBullet2', ctaKey: 'featInboxCta', tab: 'inbox' },
      { titleKey: 'featDocsTitle', b1: 'featDocsBullet1', b2: 'featDocsBullet2', ctaKey: 'featDocsCta', tab: 'documents' },
      { titleKey: 'featAutomTitle', b1: 'featAutomBullet1', b2: 'featAutomBullet2', ctaKey: 'featAutomCta', tab: 'automations' },
    ];
    var landingDisclaimer = (tr('landingDisclaimer') || '').replace(/\n/g, '<br>');
    var html = '<div class="demo-hero"><h1>' + tr('heroTitle') + '</h1><p>' + tr('heroSubtitle') + '</p></div>';
    html += '<div class="demo-features">';
    features.forEach(function (f) {
      html += '<div class="demo-feature-card"><h3>' + tr(f.titleKey) + '</h3><ul>';
      html += '<li>' + tr(f.b1) + '</li><li>' + tr(f.b2) + '</li></ul>';
      html += '<button type="button" class="demo-feature-cta" data-law-enter="' + f.tab + '">' + tr(f.ctaKey) + '</button></div>';
    });
    html += '</div>';
    if (landingDisclaimer) html += '<div class="demo-disclaimer" role="note">' + landingDisclaimer + '</div>';
    el.innerHTML = html;
    el.querySelectorAll('[data-law-enter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        showDashboard(btn.getAttribute('data-law-enter'));
      });
    });
  }

  function closeLawDrawer() {
    document.body.classList.remove('law-drawer-open');
    var overlay = document.getElementById('law-drawer-overlay');
    if (overlay) overlay.classList.remove('is-visible');
  }

  function openLawDrawer() {
    document.body.classList.add('law-drawer-open');
    var overlay = document.getElementById('law-drawer-overlay');
    if (overlay) overlay.classList.add('is-visible');
  }

  function ensureLawDrawerElements() {
    var dash = document.getElementById('law-dashboard');
    if (!dash) return;
    if (!document.getElementById('law-drawer-overlay')) {
      var overlay = document.createElement('div');
      overlay.id = 'law-drawer-overlay';
      overlay.className = 'law-drawer-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      dash.insertBefore(overlay, dash.firstChild);
      overlay.addEventListener('click', closeLawDrawer);
    }
    var sidebar = document.querySelector('.law-root .demo-sidebar');
    if (sidebar && !document.getElementById('law-drawer-close')) {
      var closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.id = 'law-drawer-close';
      closeBtn.className = 'law-drawer-close';
      closeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>';
      closeBtn.setAttribute('aria-label', 'Close menu');
      sidebar.insertBefore(closeBtn, sidebar.firstChild);
      closeBtn.addEventListener('click', closeLawDrawer);
    }
    var hamburger = document.getElementById('law-hamburger');
    if (hamburger && !hamburger._lawDrawerBound) {
      hamburger._lawDrawerBound = true;
      hamburger.addEventListener('click', function () {
        if (document.body.classList.contains('law-drawer-open')) closeLawDrawer();
        else openLawDrawer();
      });
    }
  }

  function renderTopbar() {
    var el = document.getElementById('law-topbar');
    if (!el) return;
    var disclaimer = tr('disclaimer');
    var hamburgerSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    var html = '<div class="law-topbar-disclaimer">' + disclaimer + '</div>';
    html += '<div class="demo-topbar-left"><button type="button" class="law-hamburger" id="law-hamburger" aria-label="Open menu">' + hamburgerSvg + '</button><span class="demo-badge">' + tr('demoMode') + '</span>';
    html += '<div class="demo-lang-toggle">';
    html += '<button type="button" class="' + (getLang() === 'hr' ? 'is-active' : '') + '" data-lang="hr">' + tr('langHr') + '</button>';
    html += '<button type="button" class="' + (getLang() === 'en' ? 'is-active' : '') + '" data-lang="en">' + tr('langEn') + '</button>';
    html += '</div><a href="#" id="law-back-link" class="demo-btn-text">' + tr('backToDemo') + '</a></div>';
    html += '<div class="demo-topbar-right"><a href="' + getContactUrl() + '" class="demo-btn-contact">' + tr('contact') + '</a></div>';
    el.innerHTML = html;
    el.querySelectorAll('[data-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLang(btn.getAttribute('data-lang'));
      });
    });
    var back = document.getElementById('law-back-link');
    if (back) back.addEventListener('click', function (e) { e.preventDefault(); showLanding(); renderLanding(); });
  }

  function renderSidebar() {
    var el = document.getElementById('law-sidebar-nav');
    if (!el) return;
    ensureLawDrawerElements();
    var tab = getActiveTab();
    var items = [
      { id: 'overview', labelKey: 'tabOverview' },
      { id: 'inbox', labelKey: 'tabInbox' },
      { id: 'clients', labelKey: 'tabClients' },
      { id: 'cases', labelKey: 'tabCases' },
      { id: 'documents', labelKey: 'tabDocuments' },
      { id: 'deadlines', labelKey: 'tabDeadlines' },
      { id: 'automations', labelKey: 'tabAutomations' },
      { id: 'settings', labelKey: 'tabSettings' },
    ];
    el.innerHTML = items.map(function (i) {
      return '<button type="button" data-tab="' + i.id + '" class="' + (tab === i.id ? 'is-active' : '') + '">' + tr(i.labelKey) + '</button>';
    }).join('');
    el.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        switchTab(btn.getAttribute('data-tab'));
      });
    });
  }

  function getMergedCases() {
    var d = window.LawData && window.LawData.data;
    var state = getState();
    if (!d || !d.cases) return [];
    var base = d.cases.slice();
    if (state.casesFromInbox && state.casesFromInbox.length) {
      state.casesFromInbox.forEach(function (c) { base.push(c); });
    }
    return base;
  }

  function getCasePhase(caseId) {
    var state = getState();
    if (state.casePhases && state.casePhases[caseId]) return state.casePhases[caseId];
    var c = (window.LawData && window.LawData.data.cases || []).find(function (x) { return x.id === caseId; });
    return c ? c.faza : 'new';
  }

  function getCaseNotes(caseId) {
    var state = getState();
    return (state.caseNotes && state.caseNotes[caseId]) || [];
  }

  function addCaseNote(caseId, text) {
    if (!text || !text.trim()) return;
    var state = getState();
    state.caseNotes = state.caseNotes || {};
    state.caseNotes[caseId] = state.caseNotes[caseId] || [];
    state.caseNotes[caseId].push({ text: text.trim(), date: new Date().toLocaleDateString('hr-HR') });
    setState(state);
    renderPane('cases');
  }

  function setCasePhase(caseId, phase) {
    var state = getState();
    state.casePhases = state.casePhases || {};
    state.casePhases[caseId] = phase;
    setState(state);
    renderPane('cases');
  }

  function getDocStatus(docId) {
    var state = getState();
    if (state.documentStatus && state.documentStatus[docId]) return state.documentStatus[docId];
    var doc = (window.LawData && window.LawData.data.documents || []).find(function (x) { return x.id === docId; });
    return doc ? doc.status : 'draft';
  }

  function setDocStatus(docId, status) {
    var state = getState();
    state.documentStatus = state.documentStatus || {};
    state.documentStatus[docId] = status;
    setState(state);
    renderPane('documents');
  }

  function getDeadlineStatus(dlId) {
    var state = getState();
    return (state.deadlineStatus && state.deadlineStatus[dlId]) || 'pending';
  }

  function setDeadlineStatus(dlId, status) {
    var state = getState();
    state.deadlineStatus = state.deadlineStatus || {};
    state.deadlineStatus[dlId] = status;
    setState(state);
    renderPane('deadlines');
  }

  function snoozeDeadline(dlId) {
    var state = getState();
    state.deadlineStatus = state.deadlineStatus || {};
    state.deadlineStatus[dlId] = 'snoozed';
    state.deadlineSnoozeDate = state.deadlineSnoozeDate || {};
    var d = new Date();
    d.setDate(d.getDate() + 7);
    state.deadlineSnoozeDate[dlId] = d.toLocaleDateString('hr-HR');
    setState(state);
    renderPane('deadlines');
  }

  function getAutomationOn(key) {
    var state = getState();
    return !!(state.automationToggles && state.automationToggles[key]);
  }

  function setAutomationOn(key, on) {
    var state = getState();
    state.automationToggles = state.automationToggles || {};
    state.automationToggles[key] = on;
    setState(state);
    renderPane('automations');
  }

  function renderPane(tab) {
    var pane = document.querySelector('.law-pane[data-pane="' + tab + '"]');
    if (!pane) return;
    if (tab === 'overview') renderOverview(pane);
    else if (tab === 'inbox') renderInbox(pane);
    else if (tab === 'clients') renderClients(pane);
    else if (tab === 'cases') renderCases(pane);
    else if (tab === 'documents') renderDocuments(pane);
    else if (tab === 'deadlines') renderDeadlines(pane);
    else if (tab === 'automations') renderAutomations(pane);
    else if (tab === 'settings') renderSettings(pane);
  }

  function renderOverview(pane) {
    var d = window.LawData && window.LawData.data;
    if (!d || !d.kpis) return;
    var cases = getMergedCases();
    var activeCount = cases.filter(function (c) {
      var phase = getCasePhase(c.id);
      return phase === 'active' || phase === 'waiting' || phase === 'new';
    }).length;
    var docs = (d.documents || []).filter(function (doc) { return getDocStatus(doc.id) === 'draft'; }).length;
    var html = '<div class="demo-kpi-grid">';
    html += '<div class="demo-kpi-card"><div class="demo-kpi-label">' + tr('kpiActiveCases') + '</div><div class="demo-kpi-value">' + activeCount + '</div></div>';
    html += '<div class="demo-kpi-card"><div class="demo-kpi-label">' + tr('kpiNewInquiries') + '</div><div class="demo-kpi-value">' + (d.kpis[1] ? d.kpis[1].value : 9) + '</div></div>';
    html += '<div class="demo-kpi-card"><div class="demo-kpi-label">' + tr('kpiDeadlinesWeek') + '</div><div class="demo-kpi-value">' + (d.kpis[2] ? d.kpis[2].value : 5) + '</div></div>';
    html += '<div class="demo-kpi-card"><div class="demo-kpi-label">' + tr('kpiDocsInPrep') + '</div><div class="demo-kpi-value">' + docs + '</div></div>';
    html += '</div>';
    pane.innerHTML = html;
  }

  function renderInbox(pane) {
    var d = window.LawData && window.LawData.data;
    if (!d || !d.inbox) return;
    var html = '<div class="demo-inbox-layout"><div class="demo-inbox-list">';
    d.inbox.forEach(function (inv, idx) {
      var tag = inv.tag || 'standard';
      var tagLabel = tag === 'hitno' ? tr('tagHitno') : tr('tagStandard');
      html += '<button type="button" class="demo-inbox-item ' + (inv.unread ? 'unread' : '') + ' ' + (idx === 0 ? 'is-selected' : '') + '" data-inbox-id="' + inv.id + '">';
      html += '<span class="name"><span class="law-inbox-tag ' + tag + '">' + tagLabel + '</span>' + inv.name + '</span>';
      html += '<div class="preview">' + (inv.preview || '') + '</div>';
      html += '<div class="time">' + (inv.time || '') + '</div></button>';
    });
    html += '</div><div class="demo-inbox-detail">';
    var sel = d.inbox[0];
    if (sel) {
      html += '<h4>' + sel.name + '</h4><p>' + (sel.preview || '') + '</p>';
      html += '<div class="demo-quick-replies"><h4>' + tr('quickRepliesTitle') + '</h4>';
      html += '<button type="button" class="law-btn-sm">' + tr('quickReply1') + '</button>';
      html += '<button type="button" class="law-btn-sm">' + tr('quickReply2') + '</button>';
      html += '<button type="button" class="law-btn-sm">' + tr('quickReply3') + '</button>';
      html += '<div class="demo-inbox-convert-wrap" style="margin-top:0.75rem">';
      html += '<button type="button" class="law-btn-primary" data-convert-inquiry="' + sel.id + '">' + tr('actionConvertToCase') + '</button></div></div>';
    } else {
      html += '<div class="demo-inbox-detail-placeholder">' + tr('selectClient') + '</div>';
    }
    html += '</div></div>';
    pane.innerHTML = html;
    pane.querySelectorAll('.demo-inbox-item').forEach(function (btn) {
      btn.addEventListener('click', function () {
        pane.querySelectorAll('.demo-inbox-item').forEach(function (b) { b.classList.remove('is-selected'); });
        btn.classList.add('is-selected');
        var id = parseInt(btn.getAttribute('data-inbox-id'), 10);
        var inv = d.inbox.find(function (x) { return x.id === id; });
        if (inv) {
          var detail = pane.querySelector('.demo-inbox-detail');
          detail.innerHTML = '<h4>' + inv.name + '</h4><p>' + (inv.preview || '') + '</p>';
          detail.innerHTML += '<div class="demo-quick-replies"><h4>' + tr('quickRepliesTitle') + '</h4>';
          detail.innerHTML += '<button type="button" class="law-btn-sm">' + tr('quickReply1') + '</button>';
          detail.innerHTML += '<button type="button" class="law-btn-sm">' + tr('quickReply2') + '</button>';
          detail.innerHTML += '<button type="button" class="law-btn-sm">' + tr('quickReply3') + '</button>';
          detail.innerHTML += '<div class="demo-inbox-convert-wrap" style="margin-top:0.75rem"><button type="button" class="law-btn-primary" data-convert-inquiry="' + inv.id + '">' + tr('actionConvertToCase') + '</button></div></div>';
          detail.querySelector('[data-convert-inquiry]').addEventListener('click', handleConvertToCase);
        }
      });
    });
    var convertBtn = pane.querySelector('[data-convert-inquiry]');
    if (convertBtn) convertBtn.addEventListener('click', handleConvertToCase);
  }

  function handleConvertToCase() {
    var btn = document.querySelector('[data-convert-inquiry]');
    if (!btn) return;
    var inquiryId = parseInt(btn.getAttribute('data-convert-inquiry'), 10);
    var d = window.LawData && window.LawData.data;
    var inv = d && d.inbox && d.inbox.find(function (x) { return x.id === inquiryId; });
    if (!inv) return;
    var state = getState();
    state.casesFromInbox = state.casesFromInbox || [];
    var newId = 1000 + state.casesFromInbox.length;
    state.casesFromInbox.push({
      id: newId,
      vrsta: 'upit',
      faza: 'new',
      prioritet: inv.tag === 'hitno' ? 'visok' : 'srednji',
      klijentId: null,
      klijent: inv.name,
      zadnjaAktivnost: new Date().toLocaleDateString('hr-HR'),
      fromInquiry: inquiryId,
    });
    setState(state);
    switchTab('cases');
  }

  function renderClients(pane) {
    var d = window.LawData && window.LawData.data;
    if (!d || !d.clients) return;
    var html = '<div class="law-detail-layout"><div class="law-list-panel">';
    d.clients.forEach(function (cl, idx) {
      html += '<button type="button" class="law-list-item ' + (idx === 0 ? 'is-selected' : '') + '" data-client-id="' + cl.id + '">';
      html += '<span class="demo-client-name">' + cl.name + '</span>';
      html += '<div class="demo-client-meta">' + (cl.tip === 'pravna' ? tr('clientTypeLegal') : tr('clientTypePhysical')) + ' | ' + (cl.kontakt || '') + '</div></button>';
    });
    html += '</div><div class="law-detail-panel" id="law-client-detail">';
    var sel = d.clients[0];
    if (sel) {
      var cases = getMergedCases().filter(function (c) { return c.klijentId === sel.id; });
      var docs = (d.documents || []).filter(function (doc) {
        var c = getMergedCases().find(function (x) { return x.id === doc.slucajId; });
        return c && c.klijentId === sel.id;
      });
      html += '<h4>' + sel.name + '</h4>';
      html += '<p class="demo-client-meta">' + (sel.tip === 'pravna' ? tr('clientTypeLegal') : tr('clientTypePhysical')) + ' | ' + (sel.kontakt || '') + '</p>';
      html += '<div class="demo-client-panel-section"><h4>' + tr('clientLinkedCases') + '</h4>';
      html += cases.length ? '<ul class="demo-client-history">' + cases.map(function (c) { return '<li>' + (c.vrsta || '') + ' – ' + (c.klijent || '') + '</li>'; }).join('') + '</ul>' : '<p class="law-detail-placeholder">–</p>';
      html += '</div><div class="demo-client-panel-section"><h4>' + tr('clientRecentDocs') + '</h4>';
      html += docs.length ? '<ul class="demo-client-history">' + docs.slice(0, 5).map(function (doc) { return '<li>' + doc.naziv + '</li>'; }).join('') + '</ul>' : '<p class="law-detail-placeholder">–</p>';
      html += '</div>';
    } else {
      html += '<div class="law-detail-placeholder">' + tr('selectClient') + '</div>';
    }
    html += '</div></div>';
    pane.innerHTML = html;
    pane.querySelectorAll('.law-list-item').forEach(function (btn) {
      btn.addEventListener('click', function () {
        pane.querySelectorAll('.law-list-item').forEach(function (b) { b.classList.remove('is-selected'); });
        btn.classList.add('is-selected');
        var id = parseInt(btn.getAttribute('data-client-id'), 10);
        var cl = d.clients.find(function (x) { return x.id === id; });
        var detail = pane.querySelector('#law-client-detail');
        if (cl && detail) {
          var cases = getMergedCases().filter(function (c) { return c.klijentId === cl.id; });
          var docs = (d.documents || []).filter(function (doc) {
            var c = getMergedCases().find(function (x) { return x.id === doc.slucajId; });
            return c && c.klijentId === cl.id;
          });
          detail.innerHTML = '<h4>' + cl.name + '</h4><p class="demo-client-meta">' + (cl.tip === 'pravna' ? tr('clientTypeLegal') : tr('clientTypePhysical')) + ' | ' + (cl.kontakt || '') + '</p>';
          detail.innerHTML += '<div class="demo-client-panel-section"><h4>' + tr('clientLinkedCases') + '</h4>';
          detail.innerHTML += cases.length ? '<ul class="demo-client-history">' + cases.map(function (c) { return '<li>' + (c.vrsta || '') + ' – ' + (c.klijent || '') + '</li>'; }).join('') + '</ul>' : '<p class="law-detail-placeholder">–</p></div>';
          detail.innerHTML += '<div class="demo-client-panel-section"><h4>' + tr('clientRecentDocs') + '</h4>';
          detail.innerHTML += docs.length ? '<ul class="demo-client-history">' + docs.slice(0, 5).map(function (doc) { return '<li>' + doc.naziv + '</li>'; }).join('') + '</ul>' : '<p class="law-detail-placeholder">–</p></div>';
        }
      });
    });
  }

  function renderCases(pane) {
    var cases = getMergedCases();
    if (!selectedCaseId && cases.length) selectedCaseId = cases[0].id;
    if (selectedCaseId && !cases.find(function (c) { return c.id === selectedCaseId; })) selectedCaseId = cases[0] ? cases[0].id : null;
    var colVrsta = tr('caseColVrsta');
    var colFaza = tr('caseColFaza');
    var colPrior = tr('caseColPrioritet');
    var colClient = tr('caseColClient');
    var colAct = tr('caseColActivity');
    var html = '<div class="demo-leads-table-wrap"><table class="demo-leads-table"><thead><tr>';
    html += '<th>' + colVrsta + '</th><th>' + colFaza + '</th><th>' + colPrior + '</th><th>' + colClient + '</th><th>' + colAct + '</th></tr></thead><tbody>';
    cases.forEach(function (c) {
      var phase = getCasePhase(c.id);
      var phaseKey = phase === 'new' ? 'casePhaseNew' : phase === 'active' ? 'casePhaseActive' : phase === 'waiting' ? 'casePhaseWaiting' : 'casePhaseClosed';
      var selected = c.id === selectedCaseId;
      html += '<tr class="law-case-row' + (selected ? ' is-selected' : '') + '" data-case-id="' + c.id + '" style="cursor:pointer">';
      html += '<td data-label="' + colVrsta + '">' + (c.vrsta || '') + '</td>';
      html += '<td data-label="' + colFaza + '"><span class="law-status-pill ' + phase + '">' + tr(phaseKey) + '</span></td>';
      html += '<td data-label="' + colPrior + '">' + (c.prioritet || '') + '</td>';
      html += '<td data-label="' + colClient + '">' + (c.klijent || '') + '</td>';
      html += '<td data-label="' + colAct + '">' + (c.zadnjaAktivnost || '') + '</td></tr>';
    });
    html += '</tbody></table></div>';
    html += '<div class="law-detail-layout" style="margin-top:1.5rem"><div class="law-detail-panel" style="flex:1">';
    var selCase = selectedCaseId ? cases.find(function (c) { return c.id === selectedCaseId; }) : cases[0];
    if (selCase) {
      var notes = getCaseNotes(selCase.id);
      var phase = getCasePhase(selCase.id);
      html += '<h4>' + tr('caseColClient') + ': ' + selCase.klijent + '</h4>';
      html += '<p><strong>' + tr('caseChangePhase') + ':</strong> ';
      html += '<select id="law-case-phase" data-case-id="' + selCase.id + '">';
      ['new', 'active', 'waiting', 'closed'].forEach(function (p) {
        var key = p === 'new' ? 'casePhaseNew' : p === 'active' ? 'casePhaseActive' : p === 'waiting' ? 'casePhaseWaiting' : 'casePhaseClosed';
        html += '<option value="' + p + '"' + (phase === p ? ' selected' : '') + '>' + tr(key) + '</option>';
      });
      html += '</select></p>';
      html += '<h4 style="margin-top:1rem">' + tr('caseAddNote') + '</h4>';
      html += '<ul class="demo-client-history" style="margin-bottom:0.5rem">';
      notes.forEach(function (n) { html += '<li>' + n.date + ': ' + n.text + '</li>'; });
      html += '</ul>';
      html += '<textarea class="law-notes-textarea" id="law-case-note-input" placeholder="' + tr('caseNotesPlaceholder') + '"></textarea>';
      html += '<button type="button" class="law-btn-primary" style="margin-top:0.5rem" id="law-add-note-btn" data-case-id="' + selCase.id + '">' + tr('caseAddNote') + '</button>';
    } else {
      html += '<div class="law-detail-placeholder">' + tr('selectCase') + '</div>';
    }
    html += '</div></div>';
    pane.innerHTML = html;
    pane.querySelectorAll('.law-case-row').forEach(function (row) {
      row.addEventListener('click', function () {
        selectedCaseId = parseInt(row.getAttribute('data-case-id'), 10);
        renderPane('cases');
      });
    });
    var phaseSel = pane.querySelector('#law-case-phase');
    if (phaseSel) phaseSel.addEventListener('change', function () {
      setCasePhase(parseInt(phaseSel.getAttribute('data-case-id'), 10), phaseSel.value);
    });
    var addBtn = pane.querySelector('#law-add-note-btn');
    var noteInput = pane.querySelector('#law-case-note-input');
    if (addBtn && noteInput) addBtn.addEventListener('click', function () {
      addCaseNote(parseInt(addBtn.getAttribute('data-case-id'), 10), noteInput.value);
      noteInput.value = '';
    });
  }

  function renderDocuments(pane) {
    var d = window.LawData && window.LawData.data;
    if (!d || !d.documents) return;
    var colName = tr('docColName');
    var colTag = tr('docColTag');
    var colCase = tr('docColCase');
    var colStatus = tr('docColStatus');
    var html = '<div class="demo-leads-table-wrap"><table class="demo-leads-table"><thead><tr>';
    html += '<th>' + colName + '</th><th>' + colTag + '</th><th>' + colCase + '</th><th>' + colStatus + '</th><th></th></tr></thead><tbody>';
    d.documents.forEach(function (doc) {
      var status = getDocStatus(doc.id);
      var tagKey = doc.tag === 'ugovor' ? 'docTagContract' : doc.tag === 'podnesak' ? 'docTagSubmission' : 'docTagPowerOfAttorney';
      var statusKey = status === 'draft' ? 'docStatusDraft' : status === 'sent' ? 'docStatusSent' : 'docStatusSigned';
      html += '<tr><td data-label="' + colName + '">' + doc.naziv + '</td><td data-label="' + colTag + '"><span class="law-tag-pill">' + tr(tagKey) + '</span></td><td data-label="' + colCase + '">' + (doc.slucaj || '') + '</td>';
      html += '<td data-label="' + colStatus + '"><span class="law-status-pill ' + status + '">' + tr(statusKey) + '</span></td><td class="demo-leads-actions law-actions-cell">';
      if (status === 'draft') html += '<button type="button" class="law-btn-sm" data-doc-generate="' + doc.id + '">' + tr('docActionGenerate') + '</button>';
      if (status === 'draft') html += '<button type="button" class="law-btn-sm" data-doc-sent="' + doc.id + '">' + tr('docActionMarkSent') + '</button>';
      if (status === 'sent') html += '<button type="button" class="law-btn-sm" data-doc-signed="' + doc.id + '">' + tr('docActionMarkSigned') + '</button>';
      html += '</td></tr>';
    });
    html += '</tbody></table></div>';
    pane.innerHTML = html;
    pane.querySelectorAll('[data-doc-generate]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = parseInt(btn.getAttribute('data-doc-generate'), 10);
        var doc = d.documents.find(function (x) { return x.id === id; });
        showDraftModal(doc);
      });
    });
    pane.querySelectorAll('[data-doc-sent]').forEach(function (btn) {
      btn.addEventListener('click', function () { setDocStatus(parseInt(btn.getAttribute('data-doc-sent'), 10), 'sent'); });
    });
    pane.querySelectorAll('[data-doc-signed]').forEach(function (btn) {
      btn.addEventListener('click', function () { setDocStatus(parseInt(btn.getAttribute('data-doc-signed'), 10), 'signed'); });
    });
  }

  function showDraftModal(doc) {
    var existing = document.getElementById('law-draft-modal');
    if (existing) existing.remove();
    var div = document.createElement('div');
    div.id = 'law-draft-modal';
    div.className = 'law-modal-backdrop';
    div.innerHTML = '<div class="law-modal"><h3>' + tr('docDraftPreview') + '</h3><p>' + tr('docDraftLabel') + ': ' + (doc ? doc.naziv : '') + '</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ovaj nacrt se generira automatski u sklopu proizvoda.</p><div class="law-modal-actions"><button type="button" class="law-btn-sm demo-btn-cancel">' + tr('modalClose') + '</button></div></div>';
    document.body.appendChild(div);
    div.addEventListener('click', function (e) {
      if (e.target === div) div.remove();
    });
    div.querySelector('.demo-btn-cancel').addEventListener('click', function () { div.remove(); });
  }

  function renderDeadlines(pane) {
    var d = window.LawData && window.LawData.data;
    if (!d || !d.deadlines) return;
    var pending = d.deadlines.filter(function (dl) { return getDeadlineStatus(dl.id) !== 'done'; });
    var html = '<div class="demo-deadlines-list">';
    pending.forEach(function (dl) {
      var status = getDeadlineStatus(dl.id);
      if (status === 'snoozed') return;
      html += '<div class="demo-deadline-card"><div class="demo-deadline-date">' + dl.datum + '</div>';
      html += '<div><span class="demo-deadline-case">' + dl.slucaj + '</span><div class="demo-deadline-task">' + dl.zadatak + '</div></div>';
      html += '<div class="demo-deadline-actions"><button type="button" class="law-btn-sm law-btn-primary" data-deadline-done="' + dl.id + '">' + tr('deadlineActionDone') + '</button>';
      html += '<button type="button" class="law-btn-sm" data-deadline-snooze="' + dl.id + '">' + tr('deadlineActionSnooze') + '</button></div></div>';
    });
    html += '</div>';
    if (pending.filter(function (dl) { return getDeadlineStatus(dl.id) !== 'snoozed'; }).length === 0) {
      html = '<div class="law-detail-placeholder">' + tr('noDeadlines') + '</div>';
    }
    pane.innerHTML = html;
    pane.querySelectorAll('[data-deadline-done]').forEach(function (btn) {
      btn.addEventListener('click', function () { setDeadlineStatus(parseInt(btn.getAttribute('data-deadline-done'), 10), 'done'); });
    });
    pane.querySelectorAll('[data-deadline-snooze]').forEach(function (btn) {
      btn.addEventListener('click', function () { snoozeDeadline(parseInt(btn.getAttribute('data-deadline-snooze'), 10)); });
    });
  }

  function renderAutomations(pane) {
    var d = window.LawData && window.LawData.data;
    if (!d || !d.automations) return;
    var html = '<div class="demo-automations-list">';
    d.automations.forEach(function (a) {
      var on = getAutomationOn(a.key);
      html += '<div class="demo-automation-row"><label>' + tr(a.labelKey) + '</label>';
      html += '<button type="button" class="law-toggle' + (on ? ' is-on' : '') + '" data-autom="' + a.key + '" aria-pressed="' + on + '"></button></div>';
    });
    html += '</div>';
    pane.innerHTML = html;
    pane.querySelectorAll('.law-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-autom');
        var next = !getAutomationOn(key);
        setAutomationOn(key, next);
        btn.classList.toggle('is-on', next);
        btn.setAttribute('aria-pressed', next);
      });
    });
  }

  function renderSettings(pane) {
    var html = '<div class="demo-settings-section"><h3>' + tr('integrationsTitle') + '</h3><div class="demo-integration-btns">';
    html += '<button type="button" class="law-integration-btn" data-integration="calendar">' + tr('integrationCalendar') + '</button>';
    html += '<button type="button" class="law-integration-btn" data-integration="whatsapp">' + tr('integrationWhatsApp') + '</button>';
    html += '</div></div>';
    pane.innerHTML = html;
    pane.querySelectorAll('.law-integration-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        showIntegrationModal();
      });
    });
  }

  function showIntegrationModal() {
    var existing = document.getElementById('law-integration-modal');
    if (existing) existing.remove();
    var div = document.createElement('div');
    div.id = 'law-integration-modal';
    div.className = 'law-modal-backdrop';
    div.innerHTML = '<div class="law-modal"><h3>' + tr('integrationTitle') + '</h3><p>' + tr('integrationBody') + '</p><div class="law-modal-actions"><button type="button" class="law-btn-sm demo-btn-cancel">' + tr('modalClose') + '</button><a href="' + getContactUrl() + '" class="law-btn-primary law-link-cta">' + tr('integrationCta') + '</a></div></div>';
    document.body.appendChild(div);
    div.addEventListener('click', function (e) {
      if (e.target === div) div.remove();
    });
    div.querySelector('.demo-btn-cancel').addEventListener('click', function () { div.remove(); });
  }

  function renderFooter() {
    var el = document.getElementById('law-footer');
    if (el) {
      el.innerHTML =
        '<div class="demo-footer-theme">' + (tr('footerTheme') || '') + '</div>' +
        '<div class="demo-footer-disclaimer" id="law-footer-disclaimer"></div>';
    }
  }

  function renderDisclaimer() {
    var text = tr('demoDisclaimer') || '';
    var contentEl = document.getElementById('law-disclaimer');
    var footerEl = document.getElementById('law-footer-disclaimer');
    if (contentEl) contentEl.textContent = text;
    if (footerEl) footerEl.textContent = text;
  }

  function renderAll() {
    renderLanding();
    renderTopbar();
    renderSidebar();
    renderPane(getActiveTab());
    renderFooter();
    renderDisclaimer();
  }

  function init() {
    var params = typeof location !== 'undefined' ? new URLSearchParams(location.search) : null;
    var view = params && params.get('view') === 'dashboard';
    if (view) {
      var tab = params.get('tab');
      if (tab && LAW_TABS.indexOf(tab) >= 0) setActiveTab(tab);
      showDashboard();
    } else {
      showLanding();
      renderLanding();
    }
    renderTopbar();
    renderSidebar();
    var content = document.getElementById('law-content');
    if (content) {
      content.innerHTML = LAW_TABS.map(function (t) {
        return '<section class="law-pane" data-pane="' + t + '"></section>';
      }).join('') + '<div class="demo-global-disclaimer" id="law-disclaimer"></div>';
    }
    if (view) {
      renderPane(getActiveTab());
    }
    renderFooter();
    renderDisclaimer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
