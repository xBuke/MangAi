/* MangAI savjetnik – vođeni razgovor s gumbima (bez slobodnog unosa).
 * Sadržaj: /chat/knowledge.hr.json i /chat/knowledge.en.json
 * Otvaranje: element s data-open-chat="1" (opcionalno data-chat-flow="..."), ili window.MangAIChat.open(flow)
 */
(function () {
  'use strict';

  var knowledge = null;
  var root = null;
  var panel = null;
  var launcher = null;
  var messagesEl = null;
  var quickRepliesEl = null;
  var formWrap = null;
  var flowState = null;
  var answers = [];
  var lastFocus = null;

  var CONTACT_SECTION_ID = 'contact';
  var CONTACT_FORM_ID = 'contact-form';
  var DEFAULT_FLOW = 'savjetnik';
  var FLOW_ALIASES = { ai_savjetnik: 'savjetnik', discovery: 'savjetnik' };
  var FORMSUBMIT_URL = 'https://formsubmit.co/info@mangai.hr';
  var IFRAME_NAME = 'mangai_form_iframe';

  var isEn = (function () {
    var path = (window.location && window.location.pathname) || '';
    var lang = (document.documentElement && document.documentElement.getAttribute('lang')) || '';
    return path.indexOf('/en') === 0 || lang === 'en';
  })();

  var KNOWLEDGE_URL = isEn ? '/chat/knowledge.en.json' : '/chat/knowledge.hr.json';
  var CONTACT_PAGE = isEn ? '/en/#contact' : '/#contact';

  var STRINGS = isEn ? {
    launcher: 'Advisor',
    launcherAria: 'Open the MangAI advisor',
    title: 'MangAI advisor',
    subtitle: 'A few questions, then Marko replies with a proposal',
    closeAria: 'Close the advisor',
    restart: 'Start over',
    formName: 'Full name',
    formEmail: 'Email',
    formPhone: 'Phone',
    formMessage: 'Your enquiry',
    optional: '(optional)',
    submitBtn: 'Send enquiry',
    sending: 'Sending…',
    successMessage: 'Your enquiry has been sent. Marko will get back to you within one to two working days.',
    fallbackMessage: 'I don\'t have a ready answer for that. Leave your details and Marko will reply in person.',
    fallbackCta: 'Leave my details',
    softCtaQuestion: 'Would you like Marko to send you a proposal and a quote?',
    softCtaYes: 'Yes, send a proposal',
    softCtaNo: 'Just looking',
    afterSoftCtaYes: 'Great. Leave your details below; I\'ve already filled in the enquiry from your answers.',
    afterSoftCtaNo: 'Of course. Pick a question below, or call +385 92 355 7476.',
    formErrorName: 'Enter your full name.',
    formErrorEmail: 'Enter a valid email address.',
    formErrorMessage: 'Describe briefly what you need.',
    footerText: 'Prefer to talk?',
    footerPhone: 'Call +385 92 355 7476',
    summaryFor: 'For',
    summaryNeed: 'Needs',
    summaryNote: 'Additional details:',
    subject: 'MangAI – enquiry from the advisor (EN)',
    page: 'Page'
  } : {
    launcher: 'Savjetnik',
    launcherAria: 'Otvori MangAI savjetnika',
    title: 'MangAI savjetnik',
    subtitle: 'Nekoliko pitanja, a zatim vam Marko šalje prijedlog',
    closeAria: 'Zatvori savjetnika',
    restart: 'Kreni ispočetka',
    formName: 'Ime i prezime',
    formEmail: 'E-pošta',
    formPhone: 'Telefon',
    formMessage: 'Vaš upit',
    optional: '(nije obavezno)',
    submitBtn: 'Pošalji upit',
    sending: 'Šaljem…',
    successMessage: 'Upit je poslan. Marko će vam se javiti unutar jednog do dva radna dana.',
    fallbackMessage: 'Na to nemam spreman odgovor. Ostavite kontakt i Marko će vam odgovoriti osobno.',
    fallbackCta: 'Ostavit ću kontakt',
    softCtaQuestion: 'Želite li da vam Marko pošalje prijedlog i ponudu?',
    softCtaYes: 'Da, pošaljite prijedlog',
    softCtaNo: 'Samo razgledavam',
    afterSoftCtaYes: 'U redu. Ostavite kontakt ispod; upit sam već ispunio prema vašim odgovorima.',
    afterSoftCtaNo: 'Naravno. Odaberite pitanje ispod ili nazovite 092 355 7476.',
    formErrorName: 'Upišite ime i prezime.',
    formErrorEmail: 'Upišite ispravnu adresu e-pošte.',
    formErrorMessage: 'Ukratko opišite što trebate.',
    footerText: 'Radije razgovarate?',
    footerPhone: 'Nazovite 092 355 7476',
    summaryFor: 'Za',
    summaryNeed: 'Treba',
    summaryNote: 'Dodatni opis:',
    subject: 'MangAI – upit iz savjetnika',
    page: 'Stranica'
  };

  var ICON_CHAT = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12z"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function normalize(text) {
    if (!text || typeof text !== 'string') return '';
    return text.toLowerCase().trim()
      .replace(/č/g, 'c').replace(/ć/g, 'c')
      .replace(/š/g, 's').replace(/ž/g, 'z').replace(/đ/g, 'd');
  }

  function resolveFlow(name) {
    name = name || DEFAULT_FLOW;
    return FLOW_ALIASES[name] || name;
  }

  function loadKnowledge(cb) {
    if (knowledge) { cb(knowledge); return; }
    fetch(KNOWLEDGE_URL)
      .then(function (r) { return r.json(); })
      .then(function (data) { knowledge = data; cb(knowledge); })
      .catch(function () { knowledge = { faqs: [], quick_replies: [], flows: {} }; cb(knowledge); });
  }

  function getReply(input) {
    var faqs = (knowledge && knowledge.faqs) || [];
    var qNorm = normalize(input);
    var i, j;
    if (!qNorm) return null;
    for (i = 0; i < faqs.length; i++) {
      if (normalize(faqs[i].q) === qNorm) return faqs[i].a;
    }
    for (i = 0; i < faqs.length; i++) {
      var tags = faqs[i].tags || [];
      for (j = 0; j < tags.length; j++) {
        if (qNorm.indexOf(normalize(tags[j])) !== -1) return faqs[i].a;
      }
    }
    return null;
  }

  /* ---------- DOM ---------- */

  function render() {
    root = document.getElementById('mangai-chat-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'mangai-chat-root';
      document.body.appendChild(root);
    }
    if (root.querySelector('.mangai-chat-panel')) return;

    launcher = document.createElement('button');
    launcher.type = 'button';
    launcher.className = 'mangai-chat-launcher';
    launcher.setAttribute('aria-label', STRINGS.launcherAria);
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-controls', 'mangai-chat-panel');
    launcher.innerHTML = ICON_CHAT + '<span class="mangai-chat-launcher-text">' + esc(STRINGS.launcher) + '</span>';
    root.appendChild(launcher);

    panel = document.createElement('div');
    panel.className = 'mangai-chat-panel';
    panel.id = 'mangai-chat-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'false');
    panel.setAttribute('aria-labelledby', 'mangai-chat-title');
    panel.hidden = true;
    panel.innerHTML =
      '<div class="mangai-chat-header">' +
        '<div class="mangai-chat-heading">' +
          '<p class="mangai-chat-title" id="mangai-chat-title">' + esc(STRINGS.title) + '</p>' +
          '<p class="mangai-chat-subtitle">' + esc(STRINGS.subtitle) + '</p>' +
        '</div>' +
        '<button type="button" class="mangai-chat-restart">' + esc(STRINGS.restart) + '</button>' +
        '<button type="button" class="mangai-chat-close" aria-label="' + esc(STRINGS.closeAria) + '">' + ICON_CLOSE + '</button>' +
      '</div>' +
      '<div class="mangai-chat-messages" aria-live="polite"></div>' +
      '<div class="mangai-chat-quick-replies"></div>' +
      '<form class="mangai-chat-form" id="mangai-chat-form" novalidate hidden>' +
        '<label for="mangai-chat-name">' + esc(STRINGS.formName) + '</label>' +
        '<input type="text" id="mangai-chat-name" autocomplete="name" required>' +
        '<label for="mangai-chat-email">' + esc(STRINGS.formEmail) + '</label>' +
        '<input type="email" id="mangai-chat-email" autocomplete="email" required>' +
        '<label for="mangai-chat-phone">' + esc(STRINGS.formPhone) + ' <span class="mangai-chat-optional">' + esc(STRINGS.optional) + '</span></label>' +
        '<input type="tel" id="mangai-chat-phone" autocomplete="tel">' +
        '<label for="mangai-chat-message">' + esc(STRINGS.formMessage) + '</label>' +
        '<textarea id="mangai-chat-message" rows="4" required></textarea>' +
        '<p class="mangai-chat-form-error" id="mangai-chat-form-error" role="alert" hidden></p>' +
        '<button type="submit" class="mangai-chat-submit">' + esc(STRINGS.submitBtn) + '</button>' +
      '</form>' +
      '<p class="mangai-chat-footer">' + esc(STRINGS.footerText) + ' <a href="tel:+385923557476">' + esc(STRINGS.footerPhone) + '</a></p>';
    root.appendChild(panel);

    messagesEl = panel.querySelector('.mangai-chat-messages');
    quickRepliesEl = panel.querySelector('.mangai-chat-quick-replies');
    formWrap = panel.querySelector('.mangai-chat-form');

    launcher.addEventListener('click', toggle);
    panel.querySelector('.mangai-chat-close').addEventListener('click', close);
    panel.querySelector('.mangai-chat-restart').addEventListener('click', function () { startFlow(DEFAULT_FLOW); });
    formWrap.addEventListener('submit', function (e) { e.preventDefault(); submitLeadForm(); });
    quickRepliesEl.addEventListener('click', onQuickReplyClick);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel && !panel.hidden) close();
    });
  }

  function appendMessage(text, isUser) {
    if (!messagesEl || !text) return;
    var div = document.createElement('div');
    div.className = 'mangai-chat-msg ' + (isUser ? 'mangai-chat-msg-user' : 'mangai-chat-msg-bot');
    var bubble = document.createElement('div');
    bubble.className = 'mangai-chat-msg-bubble';
    bubble.textContent = text;
    div.appendChild(bubble);
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function setQuickReplies(items, kind) {
    quickRepliesEl.innerHTML = '';
    quickRepliesEl.setAttribute('data-kind', kind || 'questions');
    (items || []).forEach(function (label) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mangai-chat-quick-reply';
      btn.textContent = label;
      btn.setAttribute(kind === 'options' ? 'data-option' : 'data-question', label);
      quickRepliesEl.appendChild(btn);
    });
    scrollMessages();
  }

  function scrollMessages() {
    if (!messagesEl) return;
    var go = function () { messagesEl.scrollTop = messagesEl.scrollHeight; };
    go();
    if (window.requestAnimationFrame) window.requestAnimationFrame(go);
  }

  function showDefaultQuestions() {
    flowState = null;
    setQuickReplies((knowledge && knowledge.quick_replies) || [], 'questions');
  }

  /* ---------- Forma ---------- */

  function buildSummary() {
    var lines = [];
    if (answers[0]) lines.push(STRINGS.summaryFor + ': ' + answers[0]);
    if (answers.length > 1) lines.push(STRINGS.summaryNeed + ': ' + answers.slice(1).join(', '));
    return lines.length ? lines.join('\n') + '\n\n' + STRINGS.summaryNote + ' ' : '';
  }

  function showLeadForm() {
    quickRepliesEl.innerHTML = '';
    var msg = document.getElementById('mangai-chat-message');
    if (msg && !msg.value) msg.value = buildSummary();
    formWrap.hidden = false;
    scrollMessages();
    var nameEl = document.getElementById('mangai-chat-name');
    if (nameEl) nameEl.focus();
    flowState = { step: 'lead_form' };
  }

  function hideLeadForm() {
    if (formWrap) formWrap.hidden = true;
  }

  function submitLeadForm() {
    var name = document.getElementById('mangai-chat-name').value.trim();
    var email = document.getElementById('mangai-chat-email').value.trim();
    var phone = document.getElementById('mangai-chat-phone').value.trim();
    var message = document.getElementById('mangai-chat-message').value.trim();
    var errorEl = document.getElementById('mangai-chat-form-error');
    var error = !name ? STRINGS.formErrorName
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? STRINGS.formErrorEmail
      : !message ? STRINGS.formErrorMessage
      : '';
    if (error) {
      errorEl.textContent = error;
      errorEl.hidden = false;
      return;
    }
    errorEl.hidden = true;

    var iframe = document.querySelector('iframe[name="' + IFRAME_NAME + '"]');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.name = IFRAME_NAME;
      iframe.title = 'form';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
    }
    var f = document.createElement('form');
    f.method = 'POST';
    f.action = FORMSUBMIT_URL;
    f.target = IFRAME_NAME;
    f.style.display = 'none';
    var fields = {
      ime: name,
      email: email,
      telefon: phone,
      upit: message,
      stranica: window.location.href,
      _subject: STRINGS.subject,
      _captcha: 'false',
      _template: 'table'
    };
    Object.keys(fields).forEach(function (k) {
      var input = document.createElement('input');
      input.type = 'hidden';
      input.name = k;
      input.value = fields[k];
      f.appendChild(input);
    });
    document.body.appendChild(f);
    f.submit();
    setTimeout(function () { f.remove(); }, 1000);

    hideLeadForm();
    formWrap.reset();
    appendMessage(STRINGS.successMessage, false);
    answers = [];
    showDefaultQuestions();
  }

  /* ---------- Tijek ---------- */

  function runFlowStep(flowName, stepId) {
    var flow = knowledge && knowledge.flows && knowledge.flows[flowName];
    if (!flow || !flow.steps) return;
    var step = null;
    for (var i = 0; i < flow.steps.length; i++) {
      if (flow.steps[i].id === stepId) { step = flow.steps[i]; break; }
    }
    if (!step) return;

    (step.messages || []).forEach(function (m) { appendMessage(m, false); });

    if (step.soft_cta) {
      appendMessage(step.soft_cta_question || STRINGS.softCtaQuestion, false);
      flowState = { flowName: flowName, step: 'soft_cta' };
      setQuickReplies([STRINGS.softCtaYes, STRINGS.softCtaNo], 'options');
      return;
    }
    if (step.options && step.options.length) {
      flowState = { flowName: flowName, stepId: stepId, next: step.next || {} };
      setQuickReplies(step.options, 'options');
      return;
    }
    showDefaultQuestions();
  }

  function handleOption(text) {
    appendMessage(text, true);

    if (flowState && flowState.step === 'fallback_cta') {
      showLeadForm();
      return;
    }
    if (flowState && flowState.step === 'soft_cta') {
      if (text === STRINGS.softCtaYes) {
        appendMessage(STRINGS.afterSoftCtaYes, false);
        showLeadForm();
      } else {
        appendMessage(STRINGS.afterSoftCtaNo, false);
        showDefaultQuestions();
      }
      return;
    }
    if (!flowState) return;

    answers.push(text);
    var nextId = (flowState.next || {})[text];
    if (nextId) runFlowStep(flowState.flowName, nextId);
    else showDefaultQuestions();
  }

  function handleQuestion(text) {
    appendMessage(text, true);
    var answer = getReply(text);
    if (answer) {
      appendMessage(answer, false);
      showDefaultQuestions();
    } else {
      appendMessage(STRINGS.fallbackMessage, false);
      flowState = { step: 'fallback_cta' };
      setQuickReplies([STRINGS.fallbackCta], 'options');
    }
  }

  function onQuickReplyClick(e) {
    var btn = e.target.closest('.mangai-chat-quick-reply');
    if (!btn || btn.disabled) return;
    e.preventDefault();
    Array.prototype.forEach.call(quickRepliesEl.children, function (b) { b.disabled = true; });
    var option = btn.getAttribute('data-option');
    var question = btn.getAttribute('data-question');
    if (option) handleOption(option);
    else if (question) handleQuestion(question);
  }

  function startFlow(flowName) {
    render();
    flowName = resolveFlow(flowName);
    hideLeadForm();
    loadKnowledge(function () {
      messagesEl.innerHTML = '';
      answers = [];
      flowState = null;
      var flow = knowledge.flows && knowledge.flows[flowName];
      if (!flow || !flow.steps || !flow.steps.length) {
        showDefaultQuestions();
        return;
      }
      runFlowStep(flowName, flow.steps[0].id);
    });
  }

  /* ---------- Otvaranje / zatvaranje ---------- */

  function open(flowName) {
    render();
    if (panel.hidden) {
      lastFocus = document.activeElement;
      panel.hidden = false;
      launcher.setAttribute('aria-expanded', 'true');
      document.body.classList.add('mangai-chat-open');
    }
    startFlow(flowName);
    setTimeout(function () {
      var first = panel.querySelector('.mangai-chat-quick-reply') || panel.querySelector('.mangai-chat-close');
      if (first) first.focus();
    }, 150);
  }

  function close() {
    if (!panel || panel.hidden) return;
    panel.hidden = true;
    launcher.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('mangai-chat-open');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  function toggle() {
    if (panel && !panel.hidden) close();
    else open(DEFAULT_FLOW);
  }

  function scrollToContact() {
    var section = document.getElementById(CONTACT_SECTION_ID);
    if (!section) { window.location.href = CONTACT_PAGE; return; }
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    var form = document.getElementById(CONTACT_FORM_ID);
    var first = form && form.querySelector('input:not([type="hidden"]), select, textarea');
    if (first) setTimeout(function () { first.focus(); }, 400);
  }

  window.MangAIChat = {
    open: open,
    close: close,
    toggle: toggle,
    openFromLauncher: toggle,
    startFlow: startFlow,
    scrollToContact: scrollToContact,
    ask: function (text) {
      open(DEFAULT_FLOW);
      loadKnowledge(function () { handleQuestion(text); });
    }
  };

  function init() {
    render();
    document.addEventListener('click', function (e) {
      var opener = e.target.closest('[data-open-chat="1"]');
      if (opener) {
        e.preventDefault();
        open(opener.getAttribute('data-chat-flow') || DEFAULT_FLOW);
        return;
      }
      if (e.target.closest('[data-chat-scroll-contact="1"]')) {
        e.preventDefault();
        scrollToContact();
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
