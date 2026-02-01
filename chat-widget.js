(function () {
  'use strict';

  var knowledge = null;
  var panel = null;
  var launcher = null;
  var messagesEl = null;
  var quickRepliesEl = null;
  var flowState = null;
  var CONTACT_SECTION_ID = 'contact';
  var CONTACT_FORM_ID = 'contact-form';
  var KNOWLEDGE_URL = (function () {
    var s = document.currentScript && document.currentScript.src;
    if (s) {
      var i = s.lastIndexOf('/');
      return (i >= 0 ? s.slice(0, i + 1) : '') + 'chat/knowledge.hr.json';
    }
    return './chat/knowledge.hr.json';
  })();
  var FLOW_AI_SAVJETNIK = 'ai_savjetnik';
  var FORMSUBMIT_INFO = 'https://formsubmit.co/info@mangai.hr';
  var FORMSUBMIT_MARKO = 'https://formsubmit.co/marko@mangai.hr';
  var IFRAME_NAME = 'mangai_form_iframe';
  var MQ_MOBILE = 640;
  var quickRepliesBound = false;
  var lastQuickReplyClick = { ts: 0, text: '' };
  var QUICK_REPLY_DEBOUNCE_MS = 300;

  function normalizeHr(text) {
    if (!text || typeof text !== 'string') return '';
    var t = text.toLowerCase().trim();
    return t
      .replace(/č/g, 'c').replace(/ć/g, 'c')
      .replace(/š/g, 's').replace(/ž/g, 'z').replace(/đ/g, 'd');
  }

  function loadKnowledge(cb) {
    if (knowledge) {
      cb(knowledge);
      return;
    }
    fetch(KNOWLEDGE_URL)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        knowledge = data;
        cb(knowledge);
      })
      .catch(function () {
        knowledge = { faqs: [], quick_replies: [], flows: {} };
        cb(knowledge);
      });
  }

  function getReply(input, state) {
    state = state || {};
    var faqs = (state.faqs || knowledge?.faqs) || [];
    var q = (input || '').trim();
    var qNorm = normalizeHr(q);
    var i, faq, best;
    if (!q) return null;
    for (i = 0; i < faqs.length; i++) {
      faq = faqs[i];
      if (normalizeHr(faq.q) === qNorm) {
        return { answer: faq.a };
      }
    }
    for (i = 0; i < faqs.length; i++) {
      faq = faqs[i];
      var tags = faq.tags || [];
      for (var j = 0; j < tags.length; j++) {
        if (qNorm.indexOf(normalizeHr(tags[j])) !== -1) {
          if (!best) best = faq;
          break;
        }
      }
    }
    if (best) return { answer: best.a };
    return null;
  }

  function render() {
    var root = document.getElementById('mangai-chat-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'mangai-chat-root';
      root.setAttribute('aria-hidden', 'true');
      document.body.appendChild(root);
    }
    if (!root.querySelector('.mangai-chat-panel')) {
      launcher = document.createElement('button');
      launcher.type = 'button';
      launcher.className = 'mangai-chat-launcher';
      launcher.setAttribute('aria-label', 'Otvori MangAI Savjetnik');
      launcher.innerHTML = '<span class="mangai-chat-launcher-icon">💬</span>';
      root.appendChild(launcher);

      panel = document.createElement('div');
      panel.className = 'mangai-chat-panel';
      panel.hidden = true;
      panel.innerHTML =
        '<div class="mangai-chat-header">' +
        '  <span class="mangai-chat-title">MangAI Savjetnik</span>' +
        '  <button type="button" class="mangai-chat-close" aria-label="Zatvori">×</button>' +
        '</div>' +
        '<div class="mangai-chat-messages"></div>' +
        '<div class="mangai-chat-quick-replies"></div>' +
        '<div class="mangai-chat-form-wrap" id="mangai-chat-form-wrap" hidden>' +
        '  <label class="mangai-chat-form-label">Ime i prezime <span class="mangai-chat-required">*</span></label>' +
        '  <input type="text" class="mangai-chat-form-input" id="mangai-chat-name" name="name" required placeholder="Ime i prezime">' +
        '  <label class="mangai-chat-form-label">Email <span class="mangai-chat-required">*</span></label>' +
        '  <input type="email" class="mangai-chat-form-input" id="mangai-chat-email" name="email" required placeholder="email@primjer.hr">' +
        '  <label class="mangai-chat-form-label">Web stranica</label>' +
        '  <input type="url" class="mangai-chat-form-input" id="mangai-chat-website" name="website" placeholder="https://">' +
        '  <label class="mangai-chat-form-label">Poruka / opis projekta <span class="mangai-chat-required">*</span></label>' +
        '  <textarea class="mangai-chat-form-textarea" id="mangai-chat-message" name="message" required rows="3" placeholder="Opišite cilj i industriju..."></textarea>' +
        '  <label class="mangai-chat-form-label">Interes</label>' +
        '  <select class="mangai-chat-form-select" id="mangai-chat-interest" name="interest">' +
        '    <option value="Automatizacija">Automatizacija</option>' +
        '    <option value="Agenti">Agenti</option>' +
        '    <option value="Chatbot">Chatbot</option>' +
        '    <option value="Savjetovanje">Savjetovanje</option>' +
        '  </select>' +
        '  <div class="mangai-chat-form-buttons">' +
        '    <button type="button" class="mangai-chat-form-submit" id="mangai-chat-submit-info">Pošalji</button>' +
        '    <button type="button" class="mangai-chat-form-submit mangai-chat-form-submit-marko" id="mangai-chat-submit-marko">Pošalji Marku</button>' +
        '  </div>' +
        '  <p class="mangai-chat-form-error" id="mangai-chat-form-error" hidden></p>' +
        '</div>' +
        '<p class="mangai-chat-footer">⚡ Powered by MangAI · <a href="#contact" data-chat-scroll-contact="1">Rezerviraj konzultacije</a></p>';
      root.appendChild(panel);
      panel.hidden = true;
      document.body.classList.remove('mangai-chat-open');

      messagesEl = panel.querySelector('.mangai-chat-messages');
      quickRepliesEl = panel.querySelector('.mangai-chat-quick-replies');
      bindLeadFormSubmit();

      launcher.addEventListener('click', function () {
        if (panel && !panel.hidden) {
          window.MangAIChat.close();
        } else {
          window.MangAIChat.open(FLOW_AI_SAVJETNIK);
        }
      });
      panel.querySelector('.mangai-chat-close').addEventListener('click', function () {
        window.MangAIChat.close();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && panel && !panel.hidden) {
          window.MangAIChat.close();
        }
      });
    } else {
      launcher = root.querySelector('.mangai-chat-launcher');
      panel = root.querySelector('.mangai-chat-panel');
      messagesEl = panel && panel.querySelector('.mangai-chat-messages');
      quickRepliesEl = panel && panel.querySelector('.mangai-chat-quick-replies');
    }
  }

  var formSubmitIframe = null;
  var formSubmitForm = null;

  function ensureFormSubmitInfrastructure() {
    if (formSubmitIframe && document.body.contains(formSubmitIframe)) return;
    formSubmitIframe = document.createElement('iframe');
    formSubmitIframe.name = IFRAME_NAME;
    formSubmitIframe.setAttribute('style', 'display:none;');
    document.body.appendChild(formSubmitIframe);
    formSubmitForm = document.createElement('form');
    formSubmitForm.method = 'POST';
    formSubmitForm.target = IFRAME_NAME;
    formSubmitForm.style.display = 'none';
    formSubmitForm.innerHTML =
      '<input type="text" name="name">' +
      '<input type="email" name="email">' +
      '<input type="text" name="website">' +
      '<input type="hidden" name="interest">' +
      '<input type="hidden" name="message">' +
      '<input type="hidden" name="_subject" value="MangAI lead (chat widget)">' +
      '<input type="hidden" name="_captcha" value="false">' +
      '<input type="hidden" name="_template" value="table">';
    document.body.appendChild(formSubmitForm);
  }

  function showLeadForm() {
    var wrap = document.getElementById('mangai-chat-form-wrap');
    if (wrap) {
      wrap.hidden = false;
      quickRepliesEl.innerHTML = '';
      var nameEl = document.getElementById('mangai-chat-name');
      if (nameEl) nameEl.focus();
    }
  }

  function hideLeadForm() {
    var wrap = document.getElementById('mangai-chat-form-wrap');
    if (wrap) {
      wrap.hidden = true;
      setQuickReplies(knowledge ? knowledge.quick_replies : [], false);
    }
  }

  function submitLeadForm(toMarko) {
    var nameEl = document.getElementById('mangai-chat-name');
    var emailEl = document.getElementById('mangai-chat-email');
    var websiteEl = document.getElementById('mangai-chat-website');
    var messageEl = document.getElementById('mangai-chat-message');
    var interestEl = document.getElementById('mangai-chat-interest');
    var errorEl = document.getElementById('mangai-chat-form-error');
    var name = nameEl ? nameEl.value.trim() : '';
    var email = emailEl ? emailEl.value.trim() : '';
    var message = messageEl ? messageEl.value.trim() : '';
    var website = websiteEl ? websiteEl.value.trim() : '';
    var interest = interestEl ? (interestEl.value || '') : '';
    if (!name) {
      if (errorEl) { errorEl.textContent = 'Upišite ime i prezime.'; errorEl.hidden = false; }
      return;
    }
    if (!email) {
      if (errorEl) { errorEl.textContent = 'Upišite email.'; errorEl.hidden = false; }
      return;
    }
    if (!message) {
      if (errorEl) { errorEl.textContent = 'Upišite poruku / opis projekta.'; errorEl.hidden = false; }
      return;
    }
    if (errorEl) errorEl.hidden = true;
    ensureFormSubmitInfrastructure();
    var pageUrl = typeof window.location !== 'undefined' ? window.location.href : '';
    var body = 'Poruka: ' + message;
    if (website) body += '\n\nWeb: ' + website;
    body += '\n\nStranica: ' + pageUrl;
    formSubmitForm.action = toMarko ? FORMSUBMIT_MARKO : FORMSUBMIT_INFO;
    formSubmitForm.querySelector('input[name="name"]').value = name;
    formSubmitForm.querySelector('input[name="email"]').value = email;
    formSubmitForm.querySelector('input[name="website"]').value = website;
    formSubmitForm.querySelector('input[name="interest"]').value = interest;
    formSubmitForm.querySelector('input[name="message"]').value = body;
    formSubmitForm.submit();
    appendMessage('Poslano ✅ Hvala! Javit ćemo ti se uskoro.', false);
    hideLeadForm();
    flowState = null;
  }

  function bindLeadFormSubmit() {
    var btnInfo = document.getElementById('mangai-chat-submit-info');
    var btnMarko = document.getElementById('mangai-chat-submit-marko');
    if (btnInfo) btnInfo.addEventListener('click', function () { submitLeadForm(false); });
    if (btnMarko) btnMarko.addEventListener('click', function () { submitLeadForm(true); });
  }

  function scrollToContactAndFocus() {
    var section = document.getElementById(CONTACT_SECTION_ID);
    var form = document.getElementById(CONTACT_FORM_ID);
    var firstInput = form && form.querySelector('input:not([type="hidden"]), select, textarea');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (firstInput) {
      setTimeout(function () {
        firstInput.focus();
      }, 400);
    }
  }

  function appendMessage(text, isUser) {
    if (!messagesEl) return;
    var div = document.createElement('div');
    div.className = 'mangai-chat-msg' + (isUser ? ' mangai-chat-msg-user' : ' mangai-chat-msg-bot');
    var inner = document.createElement('div');
    inner.className = 'mangai-chat-msg-bubble';
    inner.textContent = text;
    div.appendChild(inner);
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function setQuickReplies(items, isOptions) {
    quickRepliesEl.innerHTML = '';
    if (!items || !items.length) return;
    items.forEach(function (label) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mangai-chat-quick-reply';
      btn.textContent = label;
      if (isOptions) {
        btn.dataset.option = label;
      } else {
        btn.dataset.question = label;
      }
      quickRepliesEl.appendChild(btn);
    });
  }

  function runFlowStep(flowName, stepId) {
    var flow = knowledge && knowledge.flows && knowledge.flows[flowName];
    if (!flow || !flow.steps) return;
    var steps = flow.steps;
    var step = steps.find(function (s) { return s.id === stepId; });
    if (!step) return;

    (step.messages || []).forEach(function (msg) {
      appendMessage(msg, false);
    });

    if (step.soft_cta) {
      flowState = { flowName: flowName, step: 'soft_cta' };
      setQuickReplies(['Da, želim', 'Samo razgledavam'], true);
      return;
    }

    if (step.options && step.options.length) {
      flowState = { flowName: flowName, stepId: stepId, next: step.next || {} };
      setQuickReplies(step.options, true);
      return;
    }

    flowState = null;
    setQuickReplies(knowledge.quick_replies || [], false);
  }

  function handleOptionClick(optionText) {
    if (!flowState) return;
    var flowName = flowState.flowName;
    var flow = knowledge && knowledge.flows && knowledge.flows[flowName];
    if (!flow) return;

    appendMessage(optionText, true);

    if (flowState.step === 'soft_cta') {
      if (optionText === 'Da, želim') {
        appendMessage('Ispuni podatke ispod i pošalji – javit ćemo ti se uskoro.', false);
        showLeadForm();
        flowState = { step: 'lead_form' };
        return;
      }
      if (optionText === 'Samo razgledavam') {
        appendMessage('Naravno 🙂 Ako želiš, pitaj me nešto ili klikni \'Rezerviraj konzultacije\' kad budeš spreman.', false);
        setQuickReplies(knowledge.quick_replies || [], false);
        flowState = null;
        return;
      }
    }

    var next = flowState.next || {};
    var nextStepId = next[optionText];
    if (nextStepId) {
      runFlowStep(flowName, nextStepId);
    } else {
      flowState = null;
      setQuickReplies(knowledge.quick_replies || [], false);
    }
  }

  function handleQuestionClick(questionText) {
    appendMessage(questionText, true);
    var result = getReply(questionText, { faqs: knowledge.faqs });
    if (result && result.answer) {
      appendMessage(result.answer, false);
    } else {
      appendMessage('Ne mogu pronaći točan odgovor na stranici. Želiš li da ti pripremimo besplatnu AI analizu?', false);
      setQuickReplies(['Da, prikaži formu'], true);
      flowState = { step: 'fallback_cta' };
      return;
    }
    setQuickReplies(knowledge.quick_replies || [], false);
  }

  function bindQuickReplies() {
    if (!quickRepliesEl) return;
    if (quickRepliesBound) return;
    quickRepliesBound = true;
    quickRepliesEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.mangai-chat-quick-reply');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      var option = btn.dataset.option;
      var question = btn.dataset.question;
      var text = option || question || '';
      if (!text) return;
      var now = Date.now();
      if (now - lastQuickReplyClick.ts < QUICK_REPLY_DEBOUNCE_MS && lastQuickReplyClick.text === text) {
        return;
      }
      lastQuickReplyClick.ts = now;
      lastQuickReplyClick.text = text;
      if (option) {
        if (flowState && flowState.step === 'fallback_cta' && option === 'Da, prikaži formu') {
          appendMessage(option, true);
          appendMessage('Ispuni podatke ispod i pošalji – javit ćemo ti se uskoro.', false);
          showLeadForm();
          flowState = { step: 'lead_form' };
          return;
        }
        handleOptionClick(option);
      } else if (question) {
        handleQuestionClick(question);
      }
    });
  }

  function startFlow(flowName) {
    render();
    hideLeadForm();
    loadKnowledge(function (k) {
      knowledge = k;
      messagesEl.innerHTML = '';
      quickRepliesEl.innerHTML = '';
      flowState = null;
      var flow = knowledge.flows && knowledge.flows[flowName];
      if (!flow || !flow.steps || !flow.steps.length) {
        setQuickReplies(knowledge.quick_replies || [], false);
        bindQuickReplies();
        return;
      }
      runFlowStep(flowName, flow.steps[0].id);
      bindQuickReplies();
    });
  }

  function open(flowName) {
    render();
    flowName = flowName || FLOW_AI_SAVJETNIK;
    var isOpen = panel && !panel.hidden;
    if (isOpen) {
      startFlow(flowName);
      return;
    }
    panel.hidden = false;
    launcher.setAttribute('aria-expanded', 'true');
    document.body.classList.add('mangai-chat-open');
    startFlow(flowName);
  }

  function close() {
    if (panel) {
      panel.hidden = true;
      if (launcher) launcher.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('mangai-chat-open');
    }
  }

  window.MangAIChat = {
    open: open,
    close: close,
    startFlow: startFlow,
    ask: function (questionText) {
      render();
      loadKnowledge(function () {
        open();
        appendMessage(questionText, true);
        var result = getReply(questionText, { faqs: knowledge.faqs });
        if (result && result.answer) {
          appendMessage(result.answer, false);
        } else {
          appendMessage('Ne mogu pronaći točan odgovor na stranici. Želiš li da ti pripremimo besplatnu AI analizu?', false);
          setQuickReplies(['Da, prikaži formu'], true);
          flowState = { step: 'fallback_cta' };
        }
        setQuickReplies(knowledge.quick_replies || [], false);
        bindQuickReplies();
      });
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    render();
    bindQuickReplies();
    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-open-chat="1"]');
      if (el) {
        e.preventDefault();
        var flow = el.getAttribute('data-chat-flow') || FLOW_AI_SAVJETNIK;
        window.MangAIChat.open(flow);
      }
      var toContact = e.target.closest('[data-chat-scroll-contact="1"]');
      if (toContact) {
        e.preventDefault();
        scrollToContactAndFocus();
      }
    });
  });
})();
