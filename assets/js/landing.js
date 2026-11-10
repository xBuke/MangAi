/* MangAI – početna: naljepnice, animirani primjer razgovora, trake, tekst na scroll, CTA s tragom naljepnica.
   Sve je dekoracija: bez JS-a stranica radi i čita se normalno. */
(function () {
  'use strict';

  var doc = document.documentElement;
  var lang = (doc.getAttribute('lang') || 'hr').slice(0, 2) === 'en' ? 'en' : 'hr';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var SVGNS = 'http://www.w3.org/2000/svg';

  var C = {
    ink: '#0F2B27', paper: '#F8F9F6', mandarin: '#EE7A12', mango: '#FFC93C',
    sea: '#1F7FC0', leaf: '#86C35A', reed: '#2F6B4F', white: '#FFFFFF'
  };

  /* ---------- Naljepnice ---------- */
  var T = {
    hr: {
      booked: ['Termin zakazan ✓'],
      noFluff: ['Bez priče.', 'Samo rezultati.'],
      allDay: '0–24',
      answered: ['Odgovoreno ✓✓'],
      clicks: ['Manje klikanja'],
      manual: ['Ručno?', 'Ne, hvala.'],
      wcag: ['WCAG 2.1 AA'],
      einvoice: ['e-račun ✓'],
      ai: 'AI',
      local: ['Iz Ploča', 'za cijelu Hrvatsku'],
      crm: ['Upit je u CRM-u'],
      lang: ['Na jeziku gosta'],
      paper: ['Manje papira']
    },
    en: {
      booked: ['Booked ✓'],
      noFluff: ['No fluff.', 'Just results.'],
      allDay: '24/7',
      answered: ['Answered ✓✓'],
      clicks: ['Fewer clicks'],
      manual: ['By hand?', 'No thanks.'],
      wcag: ['WCAG 2.1 AA'],
      einvoice: ['e-invoice ✓'],
      ai: 'AI',
      local: ['From Ploče', 'to all of Croatia'],
      crm: ['Lead is in the CRM'],
      lang: ['In the guest’s language'],
      paper: ['Less paperwork']
    }
  }[lang];

  var DEFS = {
    booked:   { type: 'pill',   bg: C.mandarin, fg: C.ink,   lines: T.booked },
    noFluff:  { type: 'badge',  bg: C.ink,      fg: C.mango, lines: T.noFluff },
    allDay:   { type: 'burst',  bg: C.mango,    fg: C.ink,   text: T.allDay },
    answered: { type: 'bubble', bg: C.sea,      fg: C.white, lines: T.answered },
    clicks:   { type: 'pill',   bg: C.leaf,     fg: C.ink,   lines: T.clicks },
    manual:   { type: 'badge',  bg: C.paper,    fg: C.ink,   lines: T.manual },
    wcag:     { type: 'pill',   bg: C.reed,     fg: C.white, lines: T.wcag },
    einvoice: { type: 'pill',   bg: C.mango,    fg: C.ink,   lines: T.einvoice },
    ai:       { type: 'burst',  bg: C.mandarin, fg: C.ink,   text: T.ai },
    local:    { type: 'badge',  bg: C.sea,      fg: C.white, lines: T.local },
    crm:      { type: 'bubble', bg: C.leaf,     fg: C.ink,   lines: T.crm },
    lang:     { type: 'pill',   bg: C.sea,      fg: C.white, lines: T.lang },
    paper:    { type: 'badge',  bg: C.mango,    fg: C.ink,   lines: T.paper },
    mango:    { type: 'mango' }
  };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function svg(tag, attrs) {
    var n = document.createElementNS(SVGNS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  function burstPoints(cx, cy, rOut, rIn, n) {
    var pts = [];
    for (var i = 0; i < n * 2; i++) {
      var r = i % 2 ? rIn : rOut;
      var a = (Math.PI * i) / n - Math.PI / 2;
      pts.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1));
    }
    return pts.join(' ');
  }

  function mangoSvg() {
    var s = svg('svg', { viewBox: '0 0 150 170', class: 'stk-mango' });
    var defs = svg('defs', {});
    var id = 'mg' + Math.random().toString(36).slice(2, 7);
    var g = svg('linearGradient', { id: id, x1: '0', y1: '0', x2: '1', y2: '1' });
    g.appendChild(svg('stop', { offset: '0', 'stop-color': C.mango }));
    g.appendChild(svg('stop', { offset: '1', 'stop-color': C.mandarin }));
    defs.appendChild(g);
    s.appendChild(defs);

    var body = 'M76 30 C110 28 128 58 124 92 C120 124 98 142 72 140 C44 138 26 116 28 86 C30 54 46 32 76 30 Z';
    var leaf = 'M78 32 C84 12 104 4 120 10 C112 26 96 34 78 32 Z';
    var limbs = 'M64 138 L56 158 L44 158 M88 138 L100 152 L112 148 M30 98 L12 86 M122 92 L140 76';

    // bijeli obrub (izrezana naljepnica)
    s.appendChild(svg('path', { d: limbs, fill: 'none', stroke: '#fff', 'stroke-width': '16', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
    s.appendChild(svg('path', { d: body, fill: '#fff', stroke: '#fff', 'stroke-width': '14', 'stroke-linejoin': 'round' }));
    s.appendChild(svg('path', { d: leaf, fill: '#fff', stroke: '#fff', 'stroke-width': '12', 'stroke-linejoin': 'round' }));
    // boja
    s.appendChild(svg('path', { d: limbs, fill: 'none', stroke: C.ink, 'stroke-width': '6', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
    s.appendChild(svg('path', { d: body, fill: 'url(#' + id + ')', stroke: C.ink, 'stroke-width': '4' }));
    s.appendChild(svg('path', { d: leaf, fill: C.leaf, stroke: C.ink, 'stroke-width': '4', 'stroke-linejoin': 'round' }));
    s.appendChild(svg('path', { d: 'M80 32 C88 24 98 18 110 14', fill: 'none', stroke: C.ink, 'stroke-width': '3', 'stroke-linecap': 'round' }));
    // lice
    s.appendChild(svg('ellipse', { cx: '62', cy: '78', rx: '12', ry: '13', fill: '#fff', stroke: C.ink, 'stroke-width': '3.5' }));
    s.appendChild(svg('ellipse', { cx: '92', cy: '76', rx: '12', ry: '13', fill: '#fff', stroke: C.ink, 'stroke-width': '3.5' }));
    s.appendChild(svg('circle', { cx: '66', cy: '81', r: '5.5', fill: C.ink, class: 'stk-pupil' }));
    s.appendChild(svg('circle', { cx: '96', cy: '79', r: '5.5', fill: C.ink, class: 'stk-pupil' }));
    s.appendChild(svg('path', { d: 'M64 104 Q78 116 92 102', fill: 'none', stroke: C.ink, 'stroke-width': '4', 'stroke-linecap': 'round' }));
    s.appendChild(svg('ellipse', { cx: '48', cy: '100', rx: '7', ry: '4', fill: '#F25C3B', opacity: '.45' }));
    s.appendChild(svg('ellipse', { cx: '106', cy: '96', rx: '7', ry: '4', fill: '#F25C3B', opacity: '.45' }));
    return s;
  }

  function burstSvg(def) {
    var s = svg('svg', { viewBox: '0 0 120 120', class: 'stk-burst' });
    var pts = burstPoints(60, 60, 54, 44, 14);
    s.appendChild(svg('polygon', { points: pts, fill: '#fff', stroke: '#fff', 'stroke-width': '12', 'stroke-linejoin': 'round' }));
    s.appendChild(svg('polygon', { points: pts, fill: def.bg, stroke: C.ink, 'stroke-width': '3', 'stroke-linejoin': 'round' }));
    var t = svg('text', { x: '60', y: '61', 'text-anchor': 'middle', 'dominant-baseline': 'central', fill: def.fg, class: 'stk-burst-text' });
    t.textContent = def.text;
    if (def.text.length > 3) t.setAttribute('font-size', '27');
    s.appendChild(t);
    return s;
  }

  function makeSticker(key) {
    var def = DEFS[key];
    if (!def) return null;
    var wrap = el('span', 'stk stk-' + def.type);
    wrap.setAttribute('aria-hidden', 'true');
    if (def.type === 'mango') {
      wrap.appendChild(mangoSvg());
    } else if (def.type === 'burst') {
      wrap.appendChild(burstSvg(def));
    } else {
      var inner = el('span', 'stk-face');
      inner.style.background = def.bg;
      inner.style.color = def.fg;
      def.lines.forEach(function (line, i) {
        inner.appendChild(el('span', 'stk-line' + (i === 0 && def.lines.length > 1 ? ' stk-line-sm' : ''), line));
      });
      wrap.appendChild(inner);
    }
    return wrap;
  }

  /* Popuni statična mjesta: <span class="stk-slot" data-stk="booked"></span> */
  function fillSlots(root) {
    (root || document).querySelectorAll('.stk-slot[data-stk]').forEach(function (slot) {
      if (slot.firstChild) return;
      var s = makeSticker(slot.getAttribute('data-stk'));
      if (s) slot.appendChild(s);
      slot.setAttribute('aria-hidden', 'true');
    });
  }
  fillSlots();

  /* "Pljesak" naljepnica kad sekcija uđe u prikaz (jedan trenutak po sekciji) */
  var slapGroups = document.querySelectorAll('[data-slap]');
  if ('IntersectionObserver' in window && !reduce) {
    var slapObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-slapped');
        slapObs.unobserve(e.target);
      });
    }, { threshold: 0.35 });
    slapGroups.forEach(function (g) { slapObs.observe(g); });
  } else {
    slapGroups.forEach(function (g) { g.classList.add('is-slapped'); });
  }

  /* Oči maskote prate kursor */
  if (finePointer && !reduce) {
    var pupilRaf = 0, px = 0, py = 0;
    window.addEventListener('pointermove', function (e) {
      px = e.clientX; py = e.clientY;
      if (pupilRaf) return;
      pupilRaf = requestAnimationFrame(function () {
        pupilRaf = 0;
        document.querySelectorAll('.stk-slot .stk-mango').forEach(function (m) {
          var r = m.getBoundingClientRect();
          if (r.bottom < 0 || r.top > window.innerHeight) return;
          var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          var a = Math.atan2(py - cy, px - cx);
          var dx = Math.cos(a) * 3.5, dy = Math.sin(a) * 3.5;
          m.querySelectorAll('.stk-pupil').forEach(function (p) {
            p.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px)';
          });
        });
      });
    }, { passive: true });
  }

  /* ---------- Hero naslov: razdvoji retke za ulaznu animaciju ---------- */
  document.body.classList.add('js-landing');
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { document.body.classList.add('is-loaded'); });
  });

  /* ---------- Trake (marquee) ---------- */
  document.querySelectorAll('.marquee-track').forEach(function (track) {
    var list = track.querySelector('.marquee-list');
    if (!list) return;
    var copy = list.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelectorAll('a').forEach(function (a) { a.tabIndex = -1; });
    track.appendChild(copy);
    track.classList.add('is-running');
  });

  /* ---------- Primjer razgovora u heroju ---------- */
  var SCEN = {
    hr: {
      salon: {
        name: 'Salon Lana', via: 'AI asistent na WhatsAppu', stk: 'booked',
        msgs: [
          ['in', 'Bok! Imate li slobodan termin za šišanje u petak?'],
          ['out', 'Bok! U petak imam slobodno u 10:30 i u 16:00. Koji vam odgovara?'],
          ['in', '16:00 može 🙌'],
          ['out', 'Zapisano: petak u 16:00. Dan prije stiže vam podsjetnik.']
        ]
      },
      apartmani: {
        name: 'Apartmani Neretva', via: 'AI asistent na webu', stk: 'lang',
        msgs: [
          ['in', 'Hallo! Ist das Apartment vom 12. bis 15. Juli noch frei?'],
          ['out', 'Hallo! Ja, vom 12. bis 15. Juli ist es frei. Soll ich Ihnen den Buchungslink schicken?'],
          ['in', 'Ja, gerne!'],
          ['out', 'Hier ist der Link. Check-in ist ab 14 Uhr. Bis bald! 🌊']
        ]
      },
      opcina: {
        name: 'Općinski asistent', via: 'na web stranici općine', stk: 'allDay',
        msgs: [
          ['in', 'Do kada se predaju prijave za stipendije?'],
          ['out', 'Javni poziv za stipendije otvoren je do 30. studenoga. Obrazac i upute su na ovoj poveznici.'],
          ['in', 'Hvala, a gdje predajem dokumente?'],
          ['out', 'Prijavu možete poslati e-poštom ili predati u uredu, radnim danom od 8 do 15 h.']
        ]
      }
    },
    en: {
      salon: {
        name: 'Salon Lana', via: 'AI assistant on WhatsApp', stk: 'booked',
        msgs: [
          ['in', 'Hi! Do you have a slot for a haircut on Friday?'],
          ['out', 'Hi! On Friday I have 10:30 and 16:00 free. Which one suits you?'],
          ['in', '16:00 works 🙌'],
          ['out', 'Booked: Friday at 16:00. You’ll get a reminder the day before.']
        ]
      },
      apartmani: {
        name: 'Neretva Apartments', via: 'AI assistant on the website', stk: 'lang',
        msgs: [
          ['in', 'Hallo! Ist das Apartment vom 12. bis 15. Juli noch frei?'],
          ['out', 'Hallo! Ja, vom 12. bis 15. Juli ist es frei. Soll ich Ihnen den Buchungslink schicken?'],
          ['in', 'Ja, gerne!'],
          ['out', 'Hier ist der Link. Check-in ist ab 14 Uhr. Bis bald! 🌊']
        ]
      },
      opcina: {
        name: 'Municipal assistant', via: 'on the municipality website', stk: 'allDay',
        msgs: [
          ['in', 'When is the deadline for scholarship applications?'],
          ['out', 'The scholarship call is open until 30 November. The form and instructions are at this link.'],
          ['in', 'Thanks, where do I hand in the documents?'],
          ['out', 'You can email the application or bring it to the office, weekdays from 8:00 to 15:00.']
        ]
      }
    }
  }[lang];

  var card = document.querySelector('.chat-card');
  if (card) initChat(card);

  function initChat(card) {
    var nameEl = card.querySelector('.chat-name');
    var viaEl = card.querySelector('.chat-via');
    var log = card.querySelector('.chat-log');
    var stkHolder = card.querySelector('.chat-stk');
    var order = ['salon', 'apartmani', 'opcina'];
    var idx = 0, timer = 0, token = 0, visible = true, running = false;

    function clearTimers() { clearTimeout(timer); token++; }
    function wait(ms, t) {
      return new Promise(function (res) { timer = setTimeout(function () { if (t === token) res(); }, ms); });
    }

    function bubble(dir, text) {
      var b = el('p', 'msg msg-' + dir, text);
      log.appendChild(b);
      return b;
    }

    function renderStatic(key) {
      var s = SCEN[key];
      nameEl.textContent = s.name;
      viaEl.textContent = s.via;
      log.textContent = '';
      s.msgs.forEach(function (m) { bubble(m[0], m[1]).classList.add('is-in'); });
      stkHolder.textContent = '';
      var st = makeSticker(s.stk);
      if (st) { stkHolder.appendChild(st); stkHolder.classList.add('is-in'); }
    }

    function play(key) {
      var t = ++token;
      var s = SCEN[key];
      card.classList.add('is-switching');
      return wait(380, t).then(function () {
        nameEl.textContent = s.name;
        viaEl.textContent = s.via;
        log.textContent = '';
        stkHolder.textContent = '';
        stkHolder.classList.remove('is-in');
        card.classList.remove('is-switching');
        var p = wait(450, t);
        s.msgs.forEach(function (m) {
          p = p.then(function () {
            if (m[0] === 'out') {
              var typing = el('p', 'msg msg-out msg-typing');
              typing.innerHTML = '<span></span><span></span><span></span>';
              typing.setAttribute('aria-hidden', 'true');
              log.appendChild(typing);
              requestAnimationFrame(function () { typing.classList.add('is-in'); });
              return wait(900 + Math.min(m[1].length * 12, 900), t).then(function () {
                typing.remove();
                var b = bubble('out', m[1]);
                requestAnimationFrame(function () { b.classList.add('is-in'); });
                return wait(950, t);
              });
            }
            var b = bubble('in', m[1]);
            requestAnimationFrame(function () { b.classList.add('is-in'); });
            return wait(1100, t);
          });
        });
        return p.then(function () {
          var st = makeSticker(s.stk);
          if (st) stkHolder.appendChild(st);
          requestAnimationFrame(function () { stkHolder.classList.add('is-in'); });
          return wait(3200, t);
        });
      });
    }

    function loop() {
      if (!visible || document.hidden) { running = false; return; }
      running = true;
      var t = token + 1;
      play(order[idx]).then(function () {
        if (t !== token) return;
        idx = (idx + 1) % order.length;
        loop();
      });
    }

    if (reduce) {
      renderStatic(document.body.getAttribute('data-audience') === 'gov' ? 'opcina' : 'salon');
      document.addEventListener('mangai:audience', function (e) {
        renderStatic(e.detail === 'gov' ? 'opcina' : 'salon');
      });
      return;
    }

    if (document.body.getAttribute('data-audience') === 'gov') idx = 2;

    document.addEventListener('mangai:audience', function (e) {
      clearTimers();
      idx = e.detail === 'gov' ? 2 : 0;
      loop();
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible && !running) { clearTimers(); loop(); }
        if (!visible) { clearTimers(); running = false; }
      }, { threshold: 0.2 }).observe(card);
    } else {
      loop();
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { clearTimers(); running = false; }
      else if (visible && !running) loop();
    });
  }

  /* ---------- Tekst koji se "pali" dok skrolate ---------- */
  var scrubs = [];
  document.querySelectorAll('.scrub').forEach(function (p) {
    var words = p.textContent.trim().split(/\s+/);
    p.setAttribute('aria-label', p.textContent.trim().replace(/\s+/g, ' '));
    p.textContent = '';
    var spans = words.map(function (w, i) {
      var s = el('span', 'w', w);
      s.setAttribute('aria-hidden', 'true');
      p.appendChild(s);
      if (i < words.length - 1) p.appendChild(document.createTextNode(' '));
      return s;
    });
    scrubs.push({ p: p, spans: spans });
  });

  function updateScrubs() {
    var vh = window.innerHeight;
    scrubs.forEach(function (sc) {
      if (sc.p.offsetParent === null) return; // skriveno (druga publika)
      var r = sc.p.getBoundingClientRect();
      // 0 kad vrh teksta dođe na 85 % visine ekrana, 1 kad dno teksta dođe na 45 %
      var start = vh * 0.85, end = vh * 0.45;
      var prog = (start - r.top) / (r.height + start - end);
      prog = Math.max(0, Math.min(1, prog));
      var lit = Math.round(prog * sc.spans.length);
      sc.spans.forEach(function (s, i) { s.classList.toggle('is-lit', i < lit); });
    });
  }
  if (scrubs.length) {
    if (reduce) {
      scrubs.forEach(function (sc) { sc.spans.forEach(function (s) { s.classList.add('is-lit'); }); });
    } else {
      var scrubRaf = 0;
      var onScroll = function () {
        if (scrubRaf) return;
        scrubRaf = requestAnimationFrame(function () { scrubRaf = 0; updateScrubs(); });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      document.addEventListener('mangai:audience', onScroll);
      updateScrubs();
    }
  }

  /* ---------- CTA: naslov koji "diše" uz kursor + trag naljepnica ---------- */
  var cta = document.querySelector('.cta-band');
  if (cta) initCta(cta);

  function initCta(cta) {
    var layer = cta.querySelector('.trail-layer');
    var keys = ['booked', 'mango', 'noFluff', 'allDay', 'answered', 'clicks', 'manual', 'ai', 'crm', 'local', 'einvoice', 'paper', 'lang', 'wcag'];
    var k = 0;
    var live = [];
    var MAX = finePointer ? 16 : 8;

    function spawn(x, y, vx, vy, persistent) {
      var s = makeSticker(keys[k++ % keys.length]);
      if (!s) return;
      s.classList.add('trail-stk');
      var rot = (Math.random() * 30 - 15);
      s.style.left = x + 'px';
      s.style.top = y + 'px';
      layer.appendChild(s);
      live.push(s);
      while (live.length > MAX) {
        var old = live.shift();
        fade(old);
      }
      if (reduce) {
        s.style.transform = 'translate(-50%,-50%) rotate(' + rot + 'deg)';
        return;
      }
      var dx = Math.max(-60, Math.min(60, (vx || 0) * 6));
      var dy = Math.max(-60, Math.min(60, (vy || 0) * 6));
      s.animate([
        { transform: 'translate(-50%,-50%) scale(.2) rotate(' + (rot - 25) + 'deg)', opacity: 0 },
        { transform: 'translate(calc(-50% + ' + dx * 0.7 + 'px), calc(-50% + ' + dy * 0.7 + 'px)) scale(1.12) rotate(' + (rot + 4) + 'deg)', opacity: 1, offset: 0.45 },
        { transform: 'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + dy + 'px)) scale(1) rotate(' + rot + 'deg)', opacity: 1 }
      ], { duration: 520, easing: 'cubic-bezier(.2,.9,.3,1.2)', fill: 'forwards' });
      if (!persistent) {
        s._t = setTimeout(function () { fade(s); }, 1500);
      }
    }

    function fade(s) {
      if (!s || s._gone) return;
      s._gone = true;
      clearTimeout(s._t);
      var i = live.indexOf(s);
      if (i > -1) live.splice(i, 1);
      if (reduce || !s.animate) { s.remove(); return; }
      var cur = getComputedStyle(s).transform;
      var a = s.animate([
        { transform: cur === 'none' ? 'translate(-50%,-50%)' : cur, opacity: 1 },
        { transform: (cur === 'none' ? 'translate(-50%,-50%)' : cur) + ' scale(.3)', opacity: 0 }
      ], { duration: 320, easing: 'ease-in', fill: 'forwards' });
      a.onfinish = function () { s.remove(); };
    }

    // Trag za mišem
    var last = null;
    cta.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      if (e.target.closest('a, button')) { last = null; return; }
      var r = cta.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      if (!last) { last = { x: x, y: y, t: performance.now() }; return; }
      var dx = x - last.x, dy = y - last.y;
      var dist = Math.hypot(dx, dy);
      if (dist < 110) return;
      var dt = Math.max(16, performance.now() - last.t);
      spawn(x, y, (dx / dt) * 16, (dy / dt) * 16, false);
      last = { x: x, y: y, t: performance.now() };
    });
    cta.addEventListener('pointerleave', function () { last = null; });

    // Dodir: naljepnica gdje dodirnete
    cta.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse') return;
      if (e.target.closest('a, button')) return;
      var r = cta.getBoundingClientRect();
      spawn(e.clientX - r.left, e.clientY - r.top, 0, 0, false);
    });

    // Kad sekcija uđe u prikaz: naljepnice "polete" po rubu sekcije i ostanu, a naslov ostaje čitljiv
    var played = false;
    var SPOTS_DESK = [[.06, .62], [.09, .24], [.24, .1], [.42, .07], [.6, .09], [.79, .11], [.93, .3], [.94, .7], [.8, .9], [.18, .88]];
    var SPOTS_MOB = [[.2, .06], [.72, .07], [.82, .93], [.24, .94], [.52, .965]];
    function demoTrail() {
      if (played) return;
      played = true;
      var r = cta.getBoundingClientRect();
      var spots = r.width > 760 ? SPOTS_DESK : SPOTS_MOB;
      spots.forEach(function (pt, i) {
        setTimeout(function () {
          spawn(r.width * pt[0], r.height * pt[1], 2, 0, true);
        }, reduce ? 0 : 120 * i);
      });
    }
    if ('IntersectionObserver' in window) {
      var o = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { demoTrail(); o.disconnect(); }
      }, { threshold: 0.45 });
      o.observe(cta);
    } else {
      demoTrail();
    }

    // Naslov: debljina slova ovisi o udaljenosti kursora (varijabilni font)
    if (!finePointer || reduce) return;
    var chars = [];
    cta.querySelectorAll('[data-weight-rest]').forEach(function (line) {
      var rest = +line.getAttribute('data-weight-rest');
      var near = +line.getAttribute('data-weight-near');
      var text = line.textContent;
      line.textContent = '';
      Array.from(text).forEach(function (ch) {
        var s = el('span', 'ch', ch);
        s.setAttribute('aria-hidden', 'true');
        line.appendChild(s);
        chars.push({ el: s, rest: rest, near: near, x: 0, y: 0 });
      });
    });
    function measure() {
      chars.forEach(function (c) {
        var r = c.el.getBoundingClientRect();
        c.x = r.left + r.width / 2 + window.scrollX;
        c.y = r.top + r.height / 2 + window.scrollY;
      });
    }
    var mx = -9999, my = -9999, raf = 0, RADIUS = 260;
    function paint() {
      raf = 0;
      chars.forEach(function (c) {
        var d = Math.hypot(mx - c.x, my - c.y);
        var t = Math.max(0, 1 - d / RADIUS);
        t = t * t * (3 - 2 * t);
        c.el.style.fontWeight = Math.round(c.rest + (c.near - c.rest) * t);
      });
    }
    var measured = false;
    cta.addEventListener('pointerenter', function () { measure(); measured = true; });
    cta.addEventListener('pointermove', function (e) {
      if (!measured) { measure(); measured = true; }
      mx = e.pageX; my = e.pageY;
      if (!raf) raf = requestAnimationFrame(paint);
    });
    cta.addEventListener('pointerleave', function () {
      mx = my = -9999;
      if (!raf) raf = requestAnimationFrame(paint);
    });
    window.addEventListener('resize', function () { measured = false; });
    window.addEventListener('scroll', function () { measured = false; }, { passive: true });
  }

  /* ---------- Glatki scroll (Lenis), samo za miš i bez "reduced motion" ---------- */
  if (!reduce && finePointer && window.Lenis) {
    var lenis = new window.Lenis({
      lerp: 0.11,
      anchors: true,
      prevent: function (node) {
        return !!(node.closest && node.closest('#mangai-chat-root, .nav-menu-panel, select, textarea'));
      }
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    window.mangaiLenis = lenis;
  }
})();
