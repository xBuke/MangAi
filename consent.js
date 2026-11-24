/*
 * MangAI – privola za kolačiće + Google Analytics 4
 *
 * Google Analytics se NE učitava dok posjetitelj ne klikne "Prihvati".
 * Odbijanje je jednako lako kao prihvaćanje; izbor se pamti 12 mjeseci
 * (localStorage "mangai_consent"), a može se promijeniti bilo kad preko
 * poveznice "Postavke kolačića" u podnožju ili gumba u pravilima privatnosti
 * (element s atributom data-cookie-settings).
 *
 * Događaji koji se šalju uz automatsko mjerenje GA4:
 *   generate_lead  – slanje kontakt forme
 *   contact_click  – klik na telefon / e-poštu (method: phone | email)
 *   chat_open      – otvaranje savjetnika
 * Drugi skripti mogu slati događaje preko window.mangaiTrack(ime, parametri).
 */
(function () {
  'use strict';

  var GA_ID = 'G-XXXXXXXXXX'; // GA4 Measurement ID (Admin → Data streams → mangai.hr)
  var KEY = 'mangai_consent';
  var VERSION = 1;
  var MAX_AGE = 365 * 24 * 60 * 60 * 1000;

  var lang = (document.documentElement.lang || 'hr').slice(0, 2) === 'en' ? 'en' : 'hr';
  var T = {
    hr: {
      title: 'Kolačići',
      text: 'Uz vaš pristanak koristim Google Analytics da vidim koliko ljudi posjećuje stranicu i što čitaju. Bez pristanka se ne učitava.',
      accept: 'Prihvati',
      reject: 'Odbij',
      more: 'Pravila privatnosti',
      privacy: '/privacy_hr.html',
      settings: 'Postavke kolačića',
      aria: 'Obavijest o kolačićima'
    },
    en: {
      title: 'Cookies',
      text: 'With your consent I use Google Analytics to see how many people visit the site and what they read. Nothing loads without consent.',
      accept: 'Accept',
      reject: 'Reject',
      more: 'Privacy policy',
      privacy: '/privacy.html',
      settings: 'Cookie settings',
      aria: 'Cookie notice'
    }
  }[lang];

  var gaReady = /^G-[A-Z0-9]{6,}$/.test(GA_ID) && GA_ID !== 'G-XXXXXXXXXX';
  var gaLoaded = false;

  // ---------- spremanje izbora ----------
  function readChoice() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var c = JSON.parse(raw);
      if (!c || c.v !== VERSION || typeof c.analytics !== 'boolean') return null;
      if (Date.now() - (c.ts || 0) > MAX_AGE) return null;
      return c;
    } catch (e) { return null; }
  }

  function saveChoice(analytics) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ v: VERSION, analytics: analytics, ts: Date.now() }));
    } catch (e) { /* privatni način rada i sl. – izbor vrijedi do kraja posjeta */ }
  }

  // ---------- Google Analytics ----------
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });

  function loadGA() {
    if (gaLoaded || !gaReady) return;
    gaLoaded = true;
    window.gtag = gtag;
    gtag('consent', 'update', { analytics_storage: 'granted' });
    gtag('js', new Date());
    gtag('config', GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
  }

  function removeGACookies() {
    var host = location.hostname;
    var parts = host.split('.');
    var domains = ['', host, '.' + host];
    if (parts.length > 2) domains.push('.' + parts.slice(-2).join('.'));
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name === '_ga' || name.indexOf('_ga_') === 0 || name === '_gid' || name === '_gat') {
        domains.forEach(function (d) {
          document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
        });
      }
    });
  }

  function applyChoice(analytics) {
    if (analytics) {
      loadGA();
    } else {
      if (gaLoaded) gtag('consent', 'update', { analytics_storage: 'denied' });
      removeGACookies();
    }
  }

  window.mangaiTrack = function (name, params) {
    if (gaLoaded) gtag('event', name, params || {});
  };

  // ---------- banner ----------
  var css = '' +
    '.mg-cc{position:fixed;left:20px;bottom:20px;z-index:1001;width:min(400px,calc(100vw - 40px));' +
    'background:#0D1514;color:#fff;border:1px solid #2A3634;border-radius:6px;padding:18px 18px 16px;' +
    'box-shadow:0 18px 48px rgba(0,0,0,.28);font-family:Geist,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;' +
    'font-size:14px;line-height:1.5;opacity:0;transform:translateY(12px);transition:opacity .35s cubic-bezier(.2,.8,.2,1),transform .35s cubic-bezier(.2,.8,.2,1)}' +
    '.mg-cc.is-in{opacity:1;transform:none}' +
    '.mg-cc h2{margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#FFC93C}' +
    '.mg-cc p{margin:0 0 14px;color:rgba(255,255,255,.86)}' +
    '.mg-cc p a{color:#fff;text-decoration:underline;text-underline-offset:3px}' +
    '.mg-cc-row{display:flex;gap:8px}' +
    '.mg-cc button{flex:1;height:38px;border-radius:4px;font:500 13px/1 Geist,ui-sans-serif,system-ui,sans-serif;' +
    'letter-spacing:.02em;text-transform:uppercase;cursor:pointer;transition:background .2s,color .2s,border-color .2s}' +
    '.mg-cc .mg-cc-yes{background:#FFC93C;color:#0F1D1B;border:1px solid #FFC93C}' +
    '.mg-cc .mg-cc-yes:hover{background:#fff;border-color:#fff}' +
    '.mg-cc .mg-cc-no{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.55)}' +
    '.mg-cc .mg-cc-no:hover{border-color:#fff;background:rgba(255,255,255,.08)}' +
    '.mg-cc button:focus-visible,.mg-cc a:focus-visible{outline:2px solid #FFC93C;outline-offset:2px}' +
    '.mg-cc-link{background:none;border:0;padding:0;font:inherit;color:inherit;cursor:pointer;text-align:left}' +
    '.mg-cc-link:hover{text-decoration:underline;text-underline-offset:3px}' +
    '@media (max-width:560px){.mg-cc{left:12px;right:12px;bottom:12px;width:auto}}' +
    '@media (prefers-reduced-motion:reduce){.mg-cc{transition:none}}';

  var banner = null;

  function injectCSS() {
    if (document.getElementById('mg-cc-css')) return;
    var st = document.createElement('style');
    st.id = 'mg-cc-css';
    st.textContent = css;
    document.head.appendChild(st);
  }

  function closeBanner() {
    if (!banner) return;
    var b = banner;
    banner = null;
    b.classList.remove('is-in');
    setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 350);
  }

  function choose(analytics) {
    saveChoice(analytics);
    applyChoice(analytics);
    closeBanner();
  }

  function showBanner() {
    if (banner) return;
    injectCSS();
    banner = document.createElement('section');
    banner.className = 'mg-cc';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', T.aria);
    banner.innerHTML =
      '<h2>' + T.title + '</h2>' +
      '<p>' + T.text + ' <a href="' + T.privacy + '">' + T.more + '</a></p>' +
      '<div class="mg-cc-row">' +
      '<button type="button" class="mg-cc-no">' + T.reject + '</button>' +
      '<button type="button" class="mg-cc-yes">' + T.accept + '</button>' +
      '</div>';
    banner.querySelector('.mg-cc-yes').addEventListener('click', function () { choose(true); });
    banner.querySelector('.mg-cc-no').addEventListener('click', function () { choose(false); });
    document.body.appendChild(banner);
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (banner) banner.classList.add('is-in'); }); });
  }

  window.mangaiCookieSettings = showBanner;

  // ---------- "Postavke kolačića" u podnožju ----------
  function addFooterLink() {
    var privacyLink = document.querySelector('footer a[href*="privacy"]');
    if (!privacyLink) return;
    var li = privacyLink.closest('li');
    if (!li || li.parentNode.querySelector('[data-cookie-settings]')) return;
    injectCSS();
    var item = document.createElement('li');
    item.innerHTML = '<button type="button" class="mg-cc-link" data-cookie-settings>' + T.settings + '</button>';
    li.parentNode.insertBefore(item, li.nextSibling);
  }

  // ---------- praćenje događaja ----------
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    if (t.closest('[data-cookie-settings]')) { e.preventDefault(); showBanner(); return; }
    var a = t.closest('a[href^="tel:"], a[href^="mailto:"]');
    if (a) {
      window.mangaiTrack('contact_click', { method: a.getAttribute('href').indexOf('tel:') === 0 ? 'phone' : 'email' });
      return;
    }
    if (t.closest('.mangai-chat-launcher')) window.mangaiTrack('chat_open');
  });

  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (f && f.id === 'contact-form') {
      window.mangaiTrack('generate_lead', { form: location.pathname });
    }
  }, true);

  // ---------- start ----------
  function init() {
    if (!gaReady) return; // bez ID-a nema ni banera ni poveznice
    addFooterLink();
    var c = readChoice();
    if (c) applyChoice(c.analytics);
    else showBanner();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
