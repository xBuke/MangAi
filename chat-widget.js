/* MangAI savjetnik – odgovara na pitanja iz sadržaja mangai.hr (AI, /api/chat),
 * a vođeni tijek "za koga je projekt → prijedlog → ponuda" ostaje kao sporedna opcija.
 *
 * Sadržaj za brze odgovore i vođeni tijek: /chat/knowledge.hr.json i /chat/knowledge.en.json
 * (koriste se i kao rezerva kad AI nije dostupan).
 * Otvaranje: element s data-open-chat="1" (s data-chat-flow="..." pokreće vođeni tijek),
 * ili window.MangAIChat.open() / .open('savjetnik') / .ask('pitanje').
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
  var inputForm = null;
  var inputEl = null;
  var sendBtn = null;
  var flowState = null;
  var answers = [];
  var history = [];       // razgovor s AI-jem: [{ role, content }]
  var transcript = [];    // prikazane poruke: [{ text, isUser, html }]
  var pending = false;
  var lastFocus = null;

  var CONTACT_SECTION_ID = 'contact';
  var CONTACT_FORM_ID = 'contact-form';
  var GUIDED_FLOW = 'savjetnik';
  var FLOW_ALIASES = { ai_savjetnik: 'savjetnik', discovery: 'savjetnik' };
  var FORMSUBMIT_AJAX_URL = 'https://formsubmit.co/ajax/info@mangai.hr';
  var CHAT_API = '/api/chat';
  var STORE_KEY = 'mangai-chat-v2';
  var MAX_HISTORY = 12;
  var MAX_INPUT = 1000;

  var isEn = (function () {
    var path = (window.location && window.location.pathname) || '';
    var lang = (document.documentElement && document.documentElement.getAttribute('lang')) || '';
    return path.indexOf('/en') === 0 || lang === 'en';
  })();

  var KNOWLEDGE_URL = isEn ? '/chat/knowledge.en.json' : '/chat/knowledge.hr.json';
  var CONTACT_PAGE = isEn ? '/en/#contact' : '/kontakt/';

  var STRINGS = isEn ? {
    launcher: 'Ask',
    launcherAria: 'Open the MangAI advisor',
    title: 'MangAI advisor',
    subtitle: 'Answers from this website',
    closeAria: 'Close the advisor',
    restart: 'New chat',
    welcome: 'Hello! Ask me anything about MangAI: websites, AI assistants, automation, public procurement or how a project works. I answer from the content of this site.',
    inputPlaceholder: 'Type your question…',
    inputLabel: 'Your question',
    sendAria: 'Send question',
    typing: 'Writing an answer',
    aiError: 'I can\'t answer right now.',
    rateLimited: 'You\'ve asked a lot of questions in a short time. Please wait a few minutes, or write to marko@mangai.hr.',
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
    contactCta: 'Leave my details',
    contactIntro: 'Leave your details below; I\'ve added your questions to the enquiry.',
    softCtaQuestion: 'Would you like Marko to send you a proposal and a quote?',
    softCtaYes: 'Yes, send a proposal',
    softCtaNo: 'Just looking',
    afterSoftCtaYes: 'Great. Leave your details below; I\'ve already filled in the enquiry from your answers.',
    afterSoftCtaNo: 'Of course. Ask me anything else below, or call +385 92 355 7476.',
    formErrorName: 'Enter your full name.',
    formErrorEmail: 'Enter a valid email address.',
    formErrorMessage: 'Describe briefly what you need.',
    sendError: 'The enquiry could not be sent. Please email marko@mangai.hr or call +385 92 355 7476.',
    footerText: 'Prefer to talk?',
    footerPhone: '+385 92 355 7476',
    footerOffer: 'Request a proposal',
    summaryFor: 'For',
    summaryNeed: 'Needs',
    summaryQuestions: 'Questions asked in the advisor:',
    summaryNote: 'Additional details:',
    subject: 'MangAI – enquiry from the advisor (EN)'
  } : {
    launcher: 'Pitajte',
    launcherAria: 'Otvori MangAI savjetnika',
    title: 'MangAI savjetnik',
    subtitle: 'Odgovori sa sadržaja ove stranice',
    closeAria: 'Zatvori savjetnika',
    restart: 'Novi razgovor',
    welcome: 'Dobar dan! Pitajte me bilo što o MangAI-ju: web stranice, AI asistenti, automatizacija, javna nabava ili kako teče suradnja. Odgovaram na temelju sadržaja ove stranice.',
    inputPlaceholder: 'Napišite pitanje…',
    inputLabel: 'Vaše pitanje',
    sendAria: 'Pošalji pitanje',
    typing: 'Pišem odgovor',
    aiError: 'Trenutno ne mogu odgovoriti.',
    rateLimited: 'Postavili ste puno pitanja u kratkom vremenu. Pričekajte nekoliko minuta ili pišite na marko@mangai.hr.',
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
    contactCta: 'Ostavit ću kontakt',
    contactIntro: 'Ostavite kontakt ispod; vaša pitanja sam već dodao u upit.',
    softCtaQuestion: 'Želite li da vam Marko pošalje prijedlog i ponudu?',
    softCtaYes: 'Da, pošaljite prijedlog',
    softCtaNo: 'Samo razgledavam',
    afterSoftCtaYes: 'U redu. Ostavite kontakt ispod; upit sam već ispunio prema vašim odgovorima.',
    afterSoftCtaNo: 'Naravno. Pitajte me ispod što god vas zanima ili nazovite 092 355 7476.',
    formErrorName: 'Upišite ime i prezime.',
    formErrorEmail: 'Upišite ispravnu adresu e-pošte.',
    formErrorMessage: 'Ukratko opišite što trebate.',
    sendError: 'Upit nije poslan. Pošaljite ga na marko@mangai.hr ili nazovite 092 355 7476.',
    footerText: 'Radije razgovarate?',
    footerPhone: '092 355 7476',
    footerOffer: 'Zatražite ponudu',
    summaryFor: 'Za',
    summaryNeed: 'Treba',
    summaryQuestions: 'Pitanja postavljena u savjetniku:',
    summaryNote: 'Dodatni opis:',
    subject: 'MangAI – upit iz savjetnika'
  };

  var ICON_CHAT = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12z"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  var ICON_SEND = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>';

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
    name = name || GUIDED_FLOW;
    return FLOW_ALIASES[name] || name;
  }

  function loadKnowledge(cb) {
    if (knowledge) { cb(knowledge); return; }
    fetch(KNOWLEDGE_URL)
      .then(function (r) { return r.json(); })
      .then(function (data) { knowledge = data; cb(knowledge); })
      .catch(function () { knowledge = { faqs: [], quick_replies: [], flows: {} }; cb(knowledge); });
  }

  /* Lokalni odgovor iz knowledge.json – rezerva kad AI nije dostupan. */
  function getLocalReply(input) {
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

  /* ---------- prikaz odgovora (siguran podskup markdowna) ---------- */

  function safeHref(url) {
    url = String(url || '').trim();
    if (/^\/(?!\/)/.test(url)) return url;
    if (/^https:\/\/(www\.)?mangai\.hr(\/|$)/i.test(url)) return url.replace(/^https:\/\/(www\.)?mangai\.hr/i, '') || '/';
    if (/^mailto:[^\s@]+@[^\s@]+$/i.test(url)) return url;
    if (/^tel:\+?[\d\s]+$/i.test(url)) return url;
    return null;
  }

  function inline(text) {
    var out = '';
    var re = /\[([^\]]+)\]\(([^)\s]+)\)/g;
    var last = 0;
    var m;
    while ((m = re.exec(text))) {
      out += inlinePlain(text.slice(last, m.index));
      var href = safeHref(m[2]);
      out += href ? '<a href="' + esc(href) + '">' + inlinePlain(m[1]) + '</a>' : inlinePlain(m[1]);
      last = re.lastIndex;
    }
    return out + inlinePlain(text.slice(last));
  }

  function inlinePlain(text) {
    return esc(text)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/([\w.+-]+@[\w-]+\.[\w.]+[a-z])/gi, '<a href="mailto:$1">$1</a>');
  }

  function renderMarkdown(text) {
    var lines = String(text).replace(/\r/g, '').split('\n');
    var html = '';
    var list = null;
    lines.forEach(function (raw) {
      var line = raw.trim();
      var item = line.match(/^(?:[-*•]|\d+[.)])\s+(.*)$/);
      if (item) {
        if (!list) { list = []; }
        list.push('<li>' + inline(item[1]) + '</li>');
        return;
      }
      if (list) { html += '<ul>' + list.join('') + '</ul>'; list = null; }
      if (line) html += '<p>' + inline(line.replace(/^#+\s*/, '')) + '</p>';
    });
    if (list) html += '<ul>' + list.join('') + '</ul>';
    return html;
  }

  /* ---------- pamćenje razgovora između stranica ---------- */

  function save() {
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify({
        lang: isEn ? 'en' : 'hr',
        history: history.slice(-MAX_HISTORY),
        transcript: transcript.slice(-40)
      }));
    } catch (e) { /* privatni način ili isključena pohrana */ }
  }

  function restore() {
    try {
      var data = JSON.parse(sessionStorage.getItem(STORE_KEY) || 'null');
      if (!data || data.lang !== (isEn ? 'en' : 'hr') || !data.transcript || !data.transcript.length) return false;
      history = data.history || [];
      transcript = [];
      messagesEl.innerHTML = '';
      data.transcript.forEach(function (m) { appendMessage(m.text, m.isUser, m.html); });
      return true;
    } catch (e) { return false; }
  }

  function clearStore() {
    try { sessionStorage.removeItem(STORE_KEY); } catch (e) { /* ništa */ }
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
      '<form class="mangai-chat-input" novalidate>' +
        '<label class="mangai-chat-sr" for="mangai-chat-question">' + esc(STRINGS.inputLabel) + '</label>' +
        '<textarea id="mangai-chat-question" rows="1" maxlength="' + MAX_INPUT + '" placeholder="' + esc(STRINGS.inputPlaceholder) + '"></textarea>' +
        '<button type="submit" class="mangai-chat-send" aria-label="' + esc(STRINGS.sendAria) + '">' + ICON_SEND + '</button>' +
      '</form>' +
      '<p class="mangai-chat-footer">' + esc(STRINGS.footerText) + ' <a href="tel:+385923557476">' + esc(STRINGS.footerPhone) + '</a>' +
        '<span class="mangai-chat-footer-sep" aria-hidden="true">·</span>' +
        '<button type="button" class="mangai-chat-offer">' + esc(STRINGS.footerOffer) + '</button></p>';
    root.appendChild(panel);

    messagesEl = panel.querySelector('.mangai-chat-messages');
    quickRepliesEl = panel.querySelector('.mangai-chat-quick-replies');
    formWrap = panel.querySelector('.mangai-chat-form');
    inputForm = panel.querySelector('.mangai-chat-input');
    inputEl = panel.querySelector('#mangai-chat-question');
    sendBtn = panel.querySelector('.mangai-chat-send');

    launcher.addEventListener('click', toggle);
    panel.querySelector('.mangai-chat-close').addEventListener('click', close);
    panel.querySelector('.mangai-chat-restart').addEventListener('click', function () { startChat(true); focusInput(); });
    panel.querySelector('.mangai-chat-offer').addEventListener('click', function () { startFlow(GUIDED_FLOW); });
    formWrap.addEventListener('submit', function (e) { e.preventDefault(); submitLeadForm(); });
    quickRepliesEl.addEventListener('click', onQuickReplyClick);
    inputForm.addEventListener('submit', function (e) { e.preventDefault(); submitInput(); });
    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); submitInput(); }
    });
    inputEl.addEventListener('input', autoGrow);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel && !panel.hidden) close();
    });
  }

  function autoGrow() {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + 'px';
    inputEl.style.overflowY = inputEl.scrollHeight > 120 ? 'auto' : 'hidden';
  }

  function focusInput() {
    if (inputEl && window.matchMedia && !window.matchMedia('(max-width: 560px)').matches) {
      setTimeout(function () { inputEl.focus(); }, 120);
    }
  }

  function appendMessage(text, isUser, asHtml) {
    if (!messagesEl || !text) return null;
    var div = document.createElement('div');
    div.className = 'mangai-chat-msg ' + (isUser ? 'mangai-chat-msg-user' : 'mangai-chat-msg-bot');
    var bubble = document.createElement('div');
    bubble.className = 'mangai-chat-msg-bubble' + (asHtml ? ' mangai-chat-md' : '');
    if (asHtml) bubble.innerHTML = renderMarkdown(text);
    else bubble.textContent = text;
    div.appendChild(bubble);
    messagesEl.appendChild(div);
    transcript.push({ text: text, isUser: !!isUser, html: !!asHtml });
    scrollMessages();
    return div;
  }

  function showTyping() {
    var div = document.createElement('div');
    div.className = 'mangai-chat-msg mangai-chat-msg-bot mangai-chat-typing';
    div.innerHTML = '<div class="mangai-chat-msg-bubble" role="status" aria-label="' + esc(STRINGS.typing) + '"><i></i><i></i><i></i></div>';
    messagesEl.appendChild(div);
    scrollMessages();
    return div;
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

  function clearQuickReplies() {
    quickRepliesEl.innerHTML = '';
  }

  function scrollMessages() {
    if (!messagesEl) return;
    var go = function () { messagesEl.scrollTop = messagesEl.scrollHeight; };
    go();
    if (window.requestAnimationFrame) window.requestAnimationFrame(go);
  }

  function showSuggestions() {
    flowState = null;
    setQuickReplies((knowledge && knowledge.quick_replies) || [], 'questions');
  }

  /* ---------- AI razgovor ---------- */

  function submitInput() {
    if (pending) return;
    var text = (inputEl.value || '').trim().slice(0, MAX_INPUT);
    if (!text) return;
    inputEl.value = '';
    autoGrow();
    askQuestion(text);
  }

  function setPending(on) {
    pending = on;
    sendBtn.disabled = on;
    inputForm.classList.toggle('is-pending', on);
  }

  function askQuestion(text) {
    hideLeadForm();
    clearQuickReplies();
    flowState = null;
    appendMessage(text, true);
    history.push({ role: 'user', content: text });
    history = history.slice(-MAX_HISTORY);
    save();

    setPending(true);
    var typing = showTyping();

    fetch(CHAT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history, lang: isEn ? 'en' : 'hr', page: window.location.pathname })
    })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (data) { return { status: r.status, data: data }; });
      })
      .then(function (res) {
        typing.remove();
        if (res.status === 200 && res.data && res.data.reply) {
          history.push({ role: 'assistant', content: res.data.reply });
          appendMessage(res.data.reply, false, true);
          if (res.data.contact) {
            flowState = { step: 'contact_cta' };
            setQuickReplies([STRINGS.contactCta], 'options');
          }
          save();
          return;
        }
        if (res.status === 429) {
          history.pop();
          appendMessage(STRINGS.rateLimited, false);
          save();
          return;
        }
        throw new Error('chat ' + res.status);
      })
      .catch(function (err) {
        if (typing.parentNode) typing.remove();
        if (window.console) console.warn('MangAI savjetnik: AI nije dostupan, koristim lokalne odgovore', err);
        history.pop(); // neodgovoreno pitanje ne ostaje u povijesti za AI
        loadKnowledge(function () {
          var local = getLocalReply(text);
          if (local) {
            appendMessage(local, false);
            showSuggestions();
          } else {
            appendMessage(STRINGS.aiError + ' ' + STRINGS.fallbackMessage, false);
            flowState = { step: 'fallback_cta' };
            setQuickReplies([STRINGS.fallbackCta], 'options');
          }
          save();
        });
      })
      .then(function () { setPending(false); });
  }

  /* ---------- Forma ---------- */

  function buildSummary() {
    var lines = [];
    if (answers[0]) lines.push(STRINGS.summaryFor + ': ' + answers[0]);
    if (answers.length > 1) lines.push(STRINGS.summaryNeed + ': ' + answers.slice(1).join(', '));
    var questions = history.filter(function (m) { return m.role === 'user'; }).map(function (m) { return '- ' + m.content; });
    if (questions.length) {
      if (lines.length) lines.push('');
      lines.push(STRINGS.summaryQuestions);
      lines = lines.concat(questions.slice(-5));
    }
    return lines.length ? lines.join('\n') + '\n\n' + STRINGS.summaryNote + ' ' : '';
  }

  function showLeadForm() {
    quickRepliesEl.innerHTML = '';
    var msg = document.getElementById('mangai-chat-message');
    if (msg) msg.value = buildSummary();
    formWrap.hidden = false;
    inputForm.hidden = true;
    scrollMessages();
    var nameEl = document.getElementById('mangai-chat-name');
    if (nameEl) nameEl.focus();
    flowState = { step: 'lead_form' };
  }

  function hideLeadForm() {
    if (formWrap) formWrap.hidden = true;
    if (inputForm) inputForm.hidden = false;
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

    var submitBtn = formWrap.querySelector('.mangai-chat-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = STRINGS.sending;

    var payload = {
      ime: name,
      email: email,
      telefon: phone,
      upit: message,
      stranica: window.location.href,
      _subject: STRINGS.subject,
      _template: 'table',
      _captcha: 'false'
    };

    fetch(FORMSUBMIT_AJAX_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (data) {
        var ok = data && (data.success === true || data.success === 'true');
        if (!ok) throw new Error((data && data.message) || 'send failed');
        hideLeadForm();
        formWrap.reset();
        appendMessage(STRINGS.successMessage, false);
        answers = [];
        flowState = null;
        save();
      })
      .catch(function (err) {
        if (window.console) console.warn('MangAI savjetnik: slanje nije uspjelo', err);
        errorEl.textContent = STRINGS.sendError;
        errorEl.hidden = false;
      })
      .then(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = STRINGS.submitBtn;
      });
  }

  /* ---------- Vođeni tijek (ponuda) ---------- */

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
      save();
      return;
    }
    if (step.options && step.options.length) {
      flowState = { flowName: flowName, stepId: stepId, next: step.next || {} };
      setQuickReplies(step.options, 'options');
      save();
      return;
    }
    clearQuickReplies();
    flowState = null;
    save();
  }

  function handleOption(text) {
    appendMessage(text, true);

    if (flowState && (flowState.step === 'fallback_cta' || flowState.step === 'contact_cta')) {
      if (flowState.step === 'contact_cta') appendMessage(STRINGS.contactIntro, false);
      showLeadForm();
      save();
      return;
    }
    if (flowState && flowState.step === 'soft_cta') {
      if (text === STRINGS.softCtaYes) {
        appendMessage(STRINGS.afterSoftCtaYes, false);
        showLeadForm();
      } else {
        appendMessage(STRINGS.afterSoftCtaNo, false);
        clearQuickReplies();
        flowState = null;
        focusInput();
      }
      save();
      return;
    }
    if (!flowState) return;

    answers.push(text);
    var nextId = (flowState.next || {})[text];
    if (nextId) runFlowStep(flowState.flowName, nextId);
    else { clearQuickReplies(); flowState = null; }
  }

  function onQuickReplyClick(e) {
    var btn = e.target.closest('.mangai-chat-quick-reply');
    if (!btn || btn.disabled || pending) return;
    e.preventDefault();
    Array.prototype.forEach.call(quickRepliesEl.children, function (b) { b.disabled = true; });
    var option = btn.getAttribute('data-option');
    var question = btn.getAttribute('data-question');
    if (option) handleOption(option);
    else if (question) askQuestion(question);
  }

  /* Novi razgovor: pozdrav, prijedlozi pitanja i polje za unos. */
  function startChat(reset) {
    render();
    hideLeadForm();
    loadKnowledge(function () {
      if (!reset && transcript.length) return;
      if (!reset && restore()) {
        flowState = null;
        return;
      }
      messagesEl.innerHTML = '';
      transcript = [];
      history = [];
      answers = [];
      flowState = null;
      clearStore();
      appendMessage(STRINGS.welcome, false);
      showSuggestions();
    });
  }

  /* Vođeni tijek prema ponudi; nastavlja se na postojeći razgovor. */
  function startFlow(flowName) {
    render();
    flowName = resolveFlow(flowName);
    hideLeadForm();
    loadKnowledge(function () {
      if (!transcript.length) restore();
      answers = [];
      flowState = null;
      var flow = knowledge.flows && knowledge.flows[flowName];
      if (!flow || !flow.steps || !flow.steps.length) {
        if (!transcript.length) startChat(true);
        return;
      }
      runFlowStep(flowName, flow.steps[0].id);
    });
  }

  /* ---------- Otvaranje / zatvaranje ---------- */

  function show() {
    render();
    if (panel.hidden) {
      lastFocus = document.activeElement;
      panel.hidden = false;
      launcher.setAttribute('aria-expanded', 'true');
      document.body.classList.add('mangai-chat-open');
    }
  }

  function open(flowName) {
    show();
    if (flowName) startFlow(flowName);
    else startChat(false);
    if (flowName) {
      setTimeout(function () {
        var first = panel.querySelector('.mangai-chat-quick-reply') || inputEl;
        if (first) first.focus();
      }, 150);
    } else {
      focusInput();
    }
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
    else open();
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
      show();
      startChat(false);
      loadKnowledge(function () { if (!pending) askQuestion(String(text || '').slice(0, MAX_INPUT)); });
    }
  };

  function init() {
    render();
    document.addEventListener('click', function (e) {
      var opener = e.target.closest('[data-open-chat="1"]');
      if (opener) {
        e.preventDefault();
        var question = opener.getAttribute('data-chat-question');
        if (question) { window.MangAIChat.ask(question); return; }
        open(opener.getAttribute('data-chat-flow') || null);
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
