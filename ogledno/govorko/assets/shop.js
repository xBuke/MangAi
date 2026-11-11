/* Zajednički shop engine za demo stranice vinarija (MangAI / ogledno)
 * Ovisi o window.SITE (definiran u assets/data.js svake stranice).
 * Košarica se čuva u localStorage (ako je dostupan), inače samo u memoriji.
 * Checkout je SIMULIRAN — ništa se ne naplaćuje. Za pravi Stripe vidi README.md. */
(function () {
  'use strict';
  var S = window.SITE;
  if (!S) return;

  var CART_KEY = 'cart_' + S.id;
  var LANG_KEY = 'lang_' + S.id;
  var memory = {};

  function store(key, val) {
    try {
      if (val === undefined) return JSON.parse(localStorage.getItem(key));
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      if (val === undefined) return memory[key] === undefined ? null : memory[key];
      memory[key] = val;
    }
  }

  /* ---------- jezik ---------- */
  var lang = store(LANG_KEY) || ((navigator.language || 'hr').slice(0, 2) === 'hr' ? 'hr' : (S.defaultLang || 'hr'));
  if (lang !== 'hr' && lang !== 'en') lang = 'hr';

  function t(key) {
    var d = S.i18n[lang] || {};
    return d[key] !== undefined ? d[key] : (S.i18n.hr[key] !== undefined ? S.i18n.hr[key] : key);
  }
  function L(obj) { return obj && typeof obj === 'object' ? (obj[lang] || obj.hr) : obj; }

  function money(n) {
    return new Intl.NumberFormat(lang === 'hr' ? 'hr-HR' : 'en-IE', { style: 'currency', currency: 'EUR' }).format(n);
  }

  function applyI18n() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) { el.innerHTML = t(el.getAttribute('data-i18n-html')); });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) { el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph'))); });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
    document.querySelectorAll('[data-lang-btn]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang-btn') === lang ? 'true' : 'false');
    });
    if (S.titles) document.title = L(S.titles);
  }

  function setLang(l) {
    lang = l; store(LANG_KEY, l);
    applyI18n(); renderProducts(); renderCart(); renderCheckout();
  }

  /* ---------- boca (SVG ilustracija) ---------- */
  var GLASS = { green: '#2f4a32', flint: '#d9dfd6', amber: '#5a3b1c', dark: '#1f2a22' };
  function bottleSVG(p, opts) {
    opts = opts || {};
    var b = p.bottle || {};
    var glass = GLASS[b.glass] || b.glass || GLASS.green;
    var wine = b.wine || '#6b1d2f';
    var lab = b.label || '#f3efe6';
    var ink = b.ink || '#1b1b1b';
    var cap = b.cap || '#1b1b1b';
    var showWine = b.glass === 'flint';
    var sparkling = p.type === 'sparkling';
    var id = 'g' + p.id + (opts.suffix || '');
    var name = p.name.length > 9 ? p.name.slice(0, 9) : p.name;
    var fs = name.length > 7 ? 11 : 13;
    var d = sparkling
      ? 'M46 6h28v30c0 10 16 18 16 34v176c0 6-4 10-10 10H40c-6 0-10-4-10-10V70c0-16 16-24 16-34z'
      : 'M49 6h22v44c0 12 19 20 19 38v158c0 6-4 10-10 10H40c-6 0-10-4-10-10V88c0-18 19-26 19-38z';
    return '<svg class="bottle" viewBox="0 0 120 262" role="img" aria-label="' + p.name + '">' +
      '<defs><linearGradient id="' + id + '" x1="0" x2="1">' +
      '<stop offset="0" stop-color="#fff" stop-opacity=".0"/><stop offset=".22" stop-color="#fff" stop-opacity=".28"/>' +
      '<stop offset=".34" stop-color="#fff" stop-opacity=".0"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient>' +
      '<clipPath id="k' + id + '"><path d="' + d + '"/></clipPath></defs>' +
      '<g clip-path="url(#k' + id + ')">' +
      '<path d="' + d + '" fill="' + glass + '"/>' +
      (showWine ? '<rect x="20" y="112" width="80" height="150" fill="' + wine + '" opacity=".92"/>' : '') +
      '<rect x="20" y="0" width="80" height="262" fill="url(#' + id + ')"/>' +
      '</g><g>' +
      '<rect x="' + (sparkling ? 44 : 47) + '" y="2" width="' + (sparkling ? 32 : 26) + '" height="' + (sparkling ? 34 : 26) + '" rx="3" fill="' + cap + '"/>' +
      '<rect x="34" y="132" width="52" height="78" rx="2" fill="' + lab + '"/>' +
      '<rect x="34" y="132" width="52" height="5" fill="' + (b.band || wine) + '"/>' +
      '<text x="60" y="' + (172) + '" text-anchor="middle" font-family="' + (S.labelFont || 'Georgia, serif') + '" font-size="' + fs + '" fill="' + ink + '">' + name + '</text>' +
      '<text x="60" y="190" text-anchor="middle" font-family="system-ui,sans-serif" font-size="5.5" letter-spacing=".6" fill="' + ink + '" opacity=".7">' + (S.labelSub || '') + '</text>' +
      '</g></svg>';
  }
  S.bottleSVG = bottleSVG;

  /* ---------- košarica ---------- */
  var cart = store(CART_KEY) || {};
  function save() { store(CART_KEY, cart); }
  function product(id) { for (var i = 0; i < S.products.length; i++) if (S.products[i].id === id) return S.products[i]; return null; }
  function lines() {
    return Object.keys(cart).map(function (id) { var p = product(id); return p ? { p: p, q: cart[id] } : null; }).filter(Boolean);
  }
  function count() { return lines().reduce(function (s, l) { return s + l.q; }, 0); }
  function subtotal() { return lines().reduce(function (s, l) { return s + l.q * l.p.price; }, 0); }
  function shipping() { var sub = subtotal(); return sub === 0 || sub >= S.freeShippingFrom ? 0 : S.shipping; }

  function add(id, q) {
    cart[id] = (cart[id] || 0) + (q || 1);
    if (cart[id] > 48) cart[id] = 48;
    save(); renderCart(); bump();
  }
  function setQty(id, q) { if (q <= 0) delete cart[id]; else cart[id] = Math.min(q, 48); save(); renderCart(); renderCheckout(); }

  function bump() {
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
    });
  }

  /* ---------- render: proizvodi ---------- */
  function renderProducts() {
    var root = document.getElementById('products');
    if (!root || !S.renderProduct) return;
    root.innerHTML = S.products.map(function (p) { return S.renderProduct(p, { t: t, L: L, money: money, bottle: bottleSVG, lang: lang }); }).join('');
  }

  /* ---------- render: ladica košarice ---------- */
  function renderCart() {
    var n = count();
    document.querySelectorAll('[data-cart-count]').forEach(function (el) { el.textContent = n; el.hidden = n === 0; });
    var list = document.getElementById('cart-items');
    if (!list) return;
    var ls = lines();
    if (!ls.length) {
      list.innerHTML = '<p class="cart-empty">' + t('cart.empty') + '</p>';
    } else {
      list.innerHTML = ls.map(function (l) {
        return '<div class="cart-line">' +
          '<div class="cart-thumb">' + bottleSVG(l.p, { suffix: 'c' }) + '</div>' +
          '<div class="cart-info"><strong>' + l.p.name + '</strong><span>' + L(l.p.kind) + ' · ' + l.p.vol + '</span>' +
          '<div class="qty" role="group" aria-label="' + t('cart.qty') + '">' +
          '<button type="button" data-dec="' + l.p.id + '" aria-label="−">−</button><output>' + l.q + '</output>' +
          '<button type="button" data-inc="' + l.p.id + '" aria-label="+">+</button></div></div>' +
          '<div class="cart-price">' + money(l.q * l.p.price) + '<button type="button" class="cart-remove" data-rm="' + l.p.id + '">' + t('cart.remove') + '</button></div>' +
          '</div>';
      }).join('');
    }
    var sub = subtotal(), sh = shipping();
    setText('cart-subtotal', money(sub));
    setText('cart-shipping', sub === 0 ? '—' : (sh === 0 ? t('cart.free') : money(sh)));
    setText('cart-total', money(sub + sh));
    var left = S.freeShippingFrom - sub;
    setText('cart-note', sub > 0 && left > 0 ? t('cart.freeLeft').replace('{x}', money(left)) : (sub > 0 ? t('cart.freeOk') : ''));
    var btn = document.getElementById('checkout-btn');
    if (btn) btn.setAttribute('aria-disabled', ls.length ? 'false' : 'true');
  }
  function setText(id, v) { var el = document.getElementById(id); if (el) el.textContent = v; }

  /* ---------- ladica otvori/zatvori ---------- */
  var lastFocus = null;
  function openCart() {
    var d = document.getElementById('cart-drawer'); if (!d) return;
    lastFocus = document.activeElement;
    d.hidden = false; requestAnimationFrame(function () { d.classList.add('open'); });
    document.body.classList.add('no-scroll');
    var c = d.querySelector('[data-close-cart]'); if (c) c.focus();
  }
  function closeCart() {
    var d = document.getElementById('cart-drawer'); if (!d) return;
    d.classList.remove('open');
    document.body.classList.remove('no-scroll');
    setTimeout(function () { d.hidden = true; }, 260);
    if (lastFocus) lastFocus.focus();
  }

  /* ---------- checkout (simulirani Stripe) ---------- */
  function renderCheckout() {
    var root = document.getElementById('co-summary');
    if (!root) return;
    var ls = lines();
    if (!ls.length && !document.body.classList.contains('paid')) {
      document.getElementById('co-form-wrap').hidden = true;
      document.getElementById('co-empty').hidden = false;
    }
    root.innerHTML = ls.map(function (l) {
      return '<div class="co-line"><div class="co-thumb">' + bottleSVG(l.p, { suffix: 's' }) +
        '<span class="co-q">' + l.q + '</span></div><div><strong>' + l.p.name + '</strong><span>' + L(l.p.kind) + ' · ' + l.p.vol + '</span></div>' +
        '<div class="co-lp">' + money(l.q * l.p.price) + '</div></div>';
    }).join('');
    var sub = subtotal(), sh = shipping();
    setText('co-subtotal', money(sub));
    setText('co-shipping', sh === 0 ? t('cart.free') : money(sh));
    setText('co-total', money(sub + sh));
    setText('co-pay-amount', money(sub + sh));
    setText('co-big-total', money(sub + sh));
  }

  function luhn(num) {
    var s = 0, alt = false;
    for (var i = num.length - 1; i >= 0; i--) {
      var n = +num[i]; if (alt) { n *= 2; if (n > 9) n -= 9; } s += n; alt = !alt;
    }
    return s % 10 === 0;
  }

  function initCheckout() {
    var form = document.getElementById('co-form');
    if (!form) return;
    var cardEl = form.querySelector('[name=card]');
    var expEl = form.querySelector('[name=exp]');
    var cvcEl = form.querySelector('[name=cvc]');
    cardEl.addEventListener('input', function () {
      var v = cardEl.value.replace(/\D/g, '').slice(0, 16);
      cardEl.value = v.replace(/(.{4})/g, '$1 ').trim();
    });
    expEl.addEventListener('input', function () {
      var v = expEl.value.replace(/\D/g, '').slice(0, 4);
      expEl.value = v.length > 2 ? v.slice(0, 2) + ' / ' + v.slice(2) : v;
    });
    cvcEl.addEventListener('input', function () { cvcEl.value = cvcEl.value.replace(/\D/g, '').slice(0, 4); });

    var fill = document.getElementById('co-fill-test');
    if (fill) fill.addEventListener('click', function () {
      cardEl.value = '4242 4242 4242 4242'; expEl.value = '12 / 34'; cvcEl.value = '123';
      cardEl.dispatchEvent(new Event('input'));
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var err = document.getElementById('co-error');
      err.textContent = ''; form.querySelectorAll('.invalid').forEach(function (x) { x.classList.remove('invalid'); });
      var fail = function (el, key) { if (el) { el.classList.add('invalid'); el.focus(); } err.textContent = t(key); return false; };
      var f = form.elements;
      if (!/^\S+@\S+\.\S+$/.test(f.email.value)) return fail(f.email, 'co.err.email');
      if (f.name.value.trim().length < 3) return fail(f.name, 'co.err.name');
      if (f.address.value.trim().length < 4) return fail(f.address, 'co.err.address');
      if (!/^\d{5}$/.test(f.zip.value.trim())) return fail(f.zip, 'co.err.zip');
      if (f.city.value.trim().length < 2) return fail(f.city, 'co.err.city');
      var num = cardEl.value.replace(/\s/g, '');
      if (num.length < 15 || !luhn(num)) return fail(cardEl, 'co.err.card');
      var m = expEl.value.replace(/\D/g, '');
      var mm = +m.slice(0, 2), yy = +m.slice(2);
      var now = new Date(), cy = now.getFullYear() % 100, cm = now.getMonth() + 1;
      if (m.length !== 4 || mm < 1 || mm > 12 || yy < cy || (yy === cy && mm < cm)) return fail(expEl, 'co.err.exp');
      if (cvcEl.value.length < 3) return fail(cvcEl, 'co.err.cvc');
      if (!f.age.checked) return fail(f.age, 'co.err.age');

      var btn = document.getElementById('co-pay');
      btn.disabled = true; btn.classList.add('loading');
      setTimeout(function () {
        btn.disabled = false; btn.classList.remove('loading');
        if (num === '4000000000000002') return fail(cardEl, 'co.err.declined');
        var orderNo = S.orderPrefix + '-' + (Date.now() % 100000).toString().padStart(5, '0');
        setText('co-order-no', orderNo);
        setText('co-order-email', f.email.value);
        document.body.classList.add('paid');
        document.getElementById('co-form-wrap').hidden = true;
        document.getElementById('co-success').hidden = false;
        cart = {}; save(); renderCart();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.getElementById('co-success').focus();
      }, 1600);
    });
  }

  /* ---------- delegirani klikovi ---------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-add],[data-inc],[data-dec],[data-rm],[data-open-cart],[data-close-cart],[data-lang-btn],#checkout-btn');
    if (!el) return;
    if (el.hasAttribute('data-add')) {
      add(el.getAttribute('data-add'), 1);
      var orig = el.getAttribute('data-label') || el.textContent;
      el.setAttribute('data-label', orig);
      el.textContent = t('shop.added'); el.classList.add('done');
      setTimeout(function () { el.textContent = t('shop.add'); el.classList.remove('done'); }, 1300);
    } else if (el.hasAttribute('data-inc')) { var id = el.getAttribute('data-inc'); setQty(id, (cart[id] || 0) + 1); }
    else if (el.hasAttribute('data-dec')) { var id2 = el.getAttribute('data-dec'); setQty(id2, (cart[id2] || 0) - 1); }
    else if (el.hasAttribute('data-rm')) { setQty(el.getAttribute('data-rm'), 0); }
    else if (el.hasAttribute('data-open-cart')) { e.preventDefault(); openCart(); }
    else if (el.hasAttribute('data-close-cart')) { closeCart(); }
    else if (el.hasAttribute('data-lang-btn')) { setLang(el.getAttribute('data-lang-btn')); }
    else if (el.id === 'checkout-btn' && el.getAttribute('aria-disabled') === 'true') { e.preventDefault(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { var d = document.getElementById('cart-drawer'); if (d && !d.hidden) closeCart(); }
  });

  /* ---------- slike koje se ne učitaju (hotlink) ---------- */
  document.querySelectorAll('img[data-remote]').forEach(function (img) {
    var mark = function () { var f = img.closest('figure, .ph'); if (f) f.classList.add('missing'); };
    if (img.complete && img.naturalWidth === 0) mark();
    img.addEventListener('error', mark);
  });

  window.SHOP = { t: t, L: L, money: money, add: add, openCart: openCart, lang: function () { return lang; } };

  applyI18n(); renderProducts(); renderCart(); renderCheckout(); initCheckout();
  if (S.onReady) S.onReady(window.SHOP);
})();
