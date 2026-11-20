/* MangAI v2 – naslovnica: mreža kockica, naslovi, marquee, usluge u pikselima, tunel slider, koraci, footer.
   Sve je dekoracija: bez JS-a stranica radi i čita se normalno. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var lang = (document.documentElement.getAttribute('lang') || 'hr').slice(0, 2);
  var COLORS = ['#FFC93C', '#F08A2C', '#8FD16A', '#5DB4F0'];
  var SVGNS = 'http://www.w3.org/2000/svg';

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function onView(el, cb, opts) {
    if (!('IntersectionObserver' in window)) { cb(); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { cb(e); io.disconnect(); } });
    }, opts || { threshold: 0.2 });
    io.observe(el);
  }

  /* ---------- Naslovi: slova ulaze sa strane, nasumičnim redom ---------- */
  function splitHeading(h) {
    var text = h.textContent.replace(/\s+/g, ' ').trim();
    var sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = text;

    var vis = document.createElement('span');
    vis.setAttribute('aria-hidden', 'true');
    // Prenesi postojeću strukturu (redovi .hero-row, <br>) i razdvoji samo tekst
    Array.prototype.slice.call(h.childNodes).forEach(function (n) { vis.appendChild(n); });
    var letters = [];
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span');
            w.className = 'w';
            Array.from(part).forEach(function (ch) {
              var l = document.createElement('span');
              l.className = 'l';
              var i = document.createElement('span');
              i.textContent = ch;
              l.appendChild(i);
              w.appendChild(l);
              letters.push(i);
            });
            frag.appendChild(w);
          });
          c.parentNode.replaceChild(frag, c);
        } else if (c.nodeType === 1 && c.tagName !== 'BR') {
          walk(c);
        }
      });
    })(vis);
    h.textContent = '';
    h.appendChild(sr);
    h.appendChild(vis);
    h.classList.add('split');
    if (reduce) return;
    h.classList.add('is-pending');
    letters.forEach(function (l) { l.style.setProperty('--d', rand(0, 0.8).toFixed(3) + 's'); });
    function play() {
      h.classList.add('is-play');
      requestAnimationFrame(function () { requestAnimationFrame(function () { h.classList.remove('is-pending'); }); });
    }
    if (h.getAttribute('data-split') === 'load') {
      (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { setTimeout(play, 120); });
    } else {
      onView(h, play, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
    }
  }
  $$('.page-hero h1, .blog-index .section-head h1, .legal h1').forEach(function (h) { if (!h.hasAttribute('data-split')) h.setAttribute('data-split', 'load'); });
  $$('[data-split]').forEach(splitHeading);

  /* ---------- Hero: mreža kockica koje se pale pod mišem ---------- */
  var gridEl = $('[data-grid]');
  if (gridEl) initGrid(gridEl, '.hero-row');
  $$('.page-hero').forEach(function (el) { initGrid(el, '.wrap > *'); });

  function initGrid(el, holeSel) {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    el.insertBefore(canvas, el.firstChild);
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W, H, cols, size, rows, blocks = [], map = {}, holes = [];
    var running = false, visible = true, last = -1, counter = 0, color = COLORS[0];

    function setup() {
      var r = el.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = W < 768 ? 8 : 20;
      size = W / cols;
      rows = Math.ceil(H / size);
      holes = $$(holeSel, el).map(function (row) {
        var rr = row.getBoundingClientRect();
        return { x: rr.left - r.left, y: rr.top - r.top, w: rr.width, h: rr.height };
      });
      var old = map;
      blocks = []; map = {};
      for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
          var bx = x * size, by = y * size;
          var inHole = holes.some(function (h) { return bx + size > h.x && bx < h.x + h.w && by + size > h.y && by < h.y + h.h; });
          if (inHole) continue;
          var key = x + ':' + y;
          var b = old[key] || { a: 0, c: COLORS[0], t: 0 };
          b.x = bx; b.y = by; b.k = key;
          blocks.push(b); map[key] = b;
        }
      }
      draw();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255,255,255,0.11)';
      var active = false, now = performance.now();
      for (var i = 0; i < blocks.length; i++) {
        var b = blocks[i];
        if (b.t) {
          // 0.1 s paljenje, 0.5 s drži, 2 s gasi
          var age = (now - b.t) / 1000;
          if (age < 0.1) b.a = age / 0.1;
          else if (age < 0.6) b.a = 1;
          else if (age < 2.6) b.a = 1 - (age - 0.6) / 2;
          else { b.a = 0; b.t = 0; }
          if (b.t) active = true;
        }
        if (b.a > 0) {
          ctx.globalAlpha = b.a;
          ctx.fillStyle = b.c;
          ctx.fillRect(b.x, b.y, size, size);
          ctx.globalAlpha = 1;
        }
        ctx.strokeRect(Math.round(b.x) + 0.5, Math.round(b.y) + 0.5, size, size);
      }
      return active;
    }

    function loop() {
      var active = draw();
      if (active && visible) requestAnimationFrame(loop);
      else running = false;
    }
    function kick() { if (!running) { running = true; requestAnimationFrame(loop); } }

    function light(b, c) {
      if (!b) return;
      b.c = c; b.t = performance.now();
      kick();
    }

    setup();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(setup);
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(setup, 120); });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) kick(); }).observe(el);
    }

    if (reduce) {
      // Mirna verzija: nekoliko upaljenih kockica, bez animacije
      blocks.forEach(function (b, i) { if (i % 23 === 7) { b.a = 0.85; b.c = COLORS[i % 4]; } });
      draw();
      return;
    }

    // Uvod: val kockica preko mreže
    setTimeout(function () {
      var pick = blocks.slice().sort(function () { return Math.random() - 0.5; }).slice(0, Math.round(blocks.length * 0.12));
      pick.forEach(function (b, i) {
        setTimeout(function () { light(b, COLORS[i % 4]); }, i * 18);
      });
    }, 350);

    if (finePointer) {
      el.addEventListener('pointermove', function (e) {
        var r = canvas.getBoundingClientRect();
        var x = Math.floor((e.clientX - r.left) / size), y = Math.floor((e.clientY - r.top) / size);
        var idx = y * cols + x;
        if (idx === last) return;
        last = idx;
        if (counter++ % 5 === 0) color = COLORS[Math.floor(Math.random() * COLORS.length)];
        light(map[x + ':' + y], color);
      });
      el.addEventListener('pointerleave', function () { last = -1; });
    } else {
      // Dodirni uređaji: kockice se same pale
      setInterval(function () {
        if (!visible || document.hidden || !blocks.length) return;
        light(blocks[Math.floor(Math.random() * blocks.length)], COLORS[Math.floor(Math.random() * 4)]);
      }, 160);
      el.addEventListener('pointerdown', function (e) {
        var r = canvas.getBoundingClientRect();
        var x = Math.floor((e.clientX - r.left) / size), y = Math.floor((e.clientY - r.top) / size);
        [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d, i) { light(map[(x + d[0]) + ':' + (y + d[1])], COLORS[i % 4]); });
      });
    }
  }

  /* ---------- Savjetnik se skriva dok je hero u prikazu ---------- */
  var heroSec = $('.hero');
  if (heroSec && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      document.body.classList.toggle('hero-in-view', es[0].intersectionRatio > 0.35);
    }, { threshold: [0, 0.35, 1] }).observe(heroSec);
  }

  /* ---------- Marquee koji mijenja smjer sa scrollom ---------- */
  $$('[data-marquee]').forEach(function (mq) {
    var track = $('.mq-track', mq), list = $('.mq-list', mq);
    if (!track || !list) return;
    var copy = list.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    track.appendChild(copy);
    if (reduce) return;
    var x = 0, dir = -1, speed = window.innerWidth < 600 ? 28 : 46, lastY = window.scrollY, lastT = 0, vis = true;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (Math.abs(y - lastY) > 2) dir = y > lastY ? -1 : 1;
      lastY = y;
    }, { passive: true });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }).observe(mq);
    function tick(t) {
      var dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 0;
      lastT = t;
      if (vis) {
        var w = list.offsetWidth;
        x += dir * speed * dt;
        if (x <= -w) x += w;
        if (x > 0) x -= w;
        track.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });

  /* ---------- Pikselne ilustracije ---------- */
  var ART = {
    web: [
      'gggggggggggggggg',
      'gawwgggggggggggg',
      'gggggggggggggggg',
      'g..............g',
      'g.aaaaaaa......g',
      'g.aaaa..1......g',
      'g..............g',
      'g.wwww..dddddd.g',
      'g.wwww..dddddd.g',
      'g.wwww..dddddd.g',
      'g..............g',
      'gggggggggggggggg'
    ],
    chat: [
      '.aaaaaaaaaaaa...',
      '.akkkkkkkkkka...',
      '.aaaaaaaaaaaa...',
      '.akkkkkkaaaaa...',
      '.aaaaaaaaaaaa...',
      '.aa.............',
      '................',
      '....wwwwwwwwwwww',
      '....ww1ww2ww3www',
      '....wwwwwwwwwwww',
      '.............ww.',
      '................'
    ],
    flow: [
      'aaaa........wwww',
      'aaaa........wwww',
      'aaaa........wwww',
      '.g............g.',
      '.g............g.',
      '.gg1ggggg2ggg3g.',
      '.......g........',
      '.......g........',
      '.....mmmmmm.....',
      '.....mmmmmm.....',
      '.....mmmmmm.....',
      '................'
    ],
    app: [
      'gggggggggggggggg',
      'g..............g',
      'g...........1..g',
      'g........2..a..g',
      'g.....3..a..a..g',
      'g..a..a..a..a..g',
      'g..a..a..a..a..g',
      'g..a..a..a..a..g',
      'g..............g',
      'g.wwwww..wwwww.g',
      'g..............g',
      'gggggggggggggggg'
    ],
    idea: [
      '1......aa......2',
      '.....aaaaaa.....',
      '....aawaaaaa....',
      '...aawaaaaaaa...',
      '3..aaaaaaaaaa..1',
      '...aaaaaaaaaa...',
      '....aaaaaaaa....',
      '.....aaaaaa.....',
      '.....gggggg.....',
      '.....wwwwww.....',
      '......gggg......',
      '2..............3'
    ],
    shield: [
      '......aaaa......',
      '..aaaaaaaaaaaa..',
      '..aaaaaaaaaaaa..',
      '..aaaaaaaaakaa..',
      '..aaaaaaaakkaa..',
      '..akaaaaakkaaa..',
      '..akkaaakkaaaa..',
      '...akkkkkaaaa...',
      '...aaakkaaaaa...',
      '....aaaaaaaa....',
      '.....aaaaaa.....',
      '.......aa.......'
    ],
    mail: [
      'kkkkkkkkkkkkkkkk',
      'kwwwwwwwwwwwwwwk',
      'kkwwwwwwwwwwwwkk',
      'kwkwwwwwwwwwwkwk',
      'kwwkwwwwwwwwkwwk',
      'kwwwkkwwwwkkwwwk',
      'kwwwwwkkkkwwwwwk',
      'kwwwwwwwwwwwwwwk',
      'kwwwwwwwwwwwwwwk',
      'kkkkkkkkkkkkkkkk'
    ],
    phone: [
      '...kkkkkkkk.....',
      '...kwwwwwwk..1..',
      '...kwkkkkwk...2.',
      '...kwkwwkwk.1..3',
      '...kwkwwkwk..2.3',
      '...kwkwwkwk.1..3',
      '...kwkkkkwk...2.',
      '...kwwwwwwk..1..',
      '...kwwkkwwk.....',
      '...kwwwwwwk.....',
      '...kkkkkkkk.....'
    ],
    bubble: [
      '..kkkkkkkkkkkk..',
      '.kwwwwwwwwwwwwk.',
      '.kwwwwwwwwwwwwk.',
      '.kww1ww2ww3wwwk.',
      '.kwwwwwwwwwwwwk.',
      '..kkkkwkkkkkkk..',
      '.....kwk........',
      '.....kk.........'
    ]
  };

  function renderArt(host) {
    var key = host.getAttribute('data-art');
    var bmp = ART[key];
    if (!bmp) return;
    var c = host.getAttribute('data-c') || COLORS[0];
    var onLight = /ccard/.test(host.parentNode.className);
    var pal = onLight
      ? { k: '#0F1D1B', w: '#FFFFFF', a: '#0F1D1B', g: '#0F1D1B', d: '#0F1D1B', m: '#0F1D1B', blink: '#0F1D1B' }
      : { k: '#0D1514', w: '#E9EEEC', a: c, g: '#3A4846', d: '#24302E', m: '#F08A2C', blink: c };
    if (key === 'flow') pal.m = c === '#F08A2C' ? '#FFC93C' : '#F08A2C';
    var h = bmp.length, w = bmp[0].length;
    var s = document.createElementNS(SVGNS, 'svg');
    s.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    s.setAttribute('shape-rendering', 'crispEdges');
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('class', 'pxa' + (reduce ? '' : ' is-hidden'));
    bmp.forEach(function (row, y) {
      Array.from(row).forEach(function (ch, x) {
        if (ch === '.') return;
        var r = document.createElementNS(SVGNS, 'rect');
        r.setAttribute('x', x); r.setAttribute('y', y);
        r.setAttribute('width', 1.02); r.setAttribute('height', 1.02);
        var fill = pal[ch];
        if (/[123]/.test(ch)) { fill = pal.blink; r.setAttribute('class', 'blink b' + ch); }
        r.setAttribute('fill', fill);
        r.style.transitionDelay = rand(0, 0.7).toFixed(2) + 's';
        s.appendChild(r);
      });
    });
    host.appendChild(s);
    if (!reduce) onView(host, function () { s.classList.remove('is-hidden'); }, { threshold: 0.3 });

    // Na hover se pikseli "preslože"
    var card = host.closest('a, button');
    if (card && finePointer && !reduce) {
      card.addEventListener('mouseenter', function () {
        s.classList.add('is-hidden');
        requestAnimationFrame(function () { requestAnimationFrame(function () { s.classList.remove('is-hidden'); }); });
      });
    }
  }
  $$('[data-art]').forEach(renderArt);

  /* ---------- Otkrivanje kartica ---------- */
  $$('[data-reveal]').forEach(function (w) {
    if (reduce) { w.classList.add('is-in'); return; }
    onView(w, function () { w.classList.add('is-in'); }, { threshold: 0.12 });
  });

  /* ---------- Koraci: pale se jedan za drugim ---------- */
  $$('[data-steps]').forEach(function (ol) {
    var items = $$('li', ol);
    onView(ol, function () {
      items.forEach(function (li, i) { setTimeout(function () { li.classList.add('is-lit'); }, reduce ? 0 : 280 * i); });
    }, { threshold: 0.35 });
  });

  /* ---------- Tunel slider s demo asistentima ---------- */
  var tunnel = $('[data-tunnel]');
  if (tunnel) initTunnel(tunnel);

  function initTunnel(root) {
    var source = $$('.t-source > li', root);
    if (!source.length) return;
    var ctrlTrack = $('.demo-ctrl-track');
    var views = {};
    ['left', 'main', 'right'].forEach(function (k) {
      var v = document.createElement('div');
      v.className = 't-view t-' + k;
      var strip = document.createElement('div');
      strip.className = 't-strip';
      v.appendChild(strip);
      if (k !== 'main') v.setAttribute('aria-hidden', 'true');
      root.appendChild(v);
      views[k] = { el: v, strip: strip, cards: [] };
    });

    var N = source.length, reps = 1, cw = 0, L = 0, offset = 0, vel = 0, dragging = false, hovering = false;
    var target = null, autoplay = !reduce, lastT = 0, mainLeft = 0, stageW = 0;

    function build() {
      stageW = root.getBoundingClientRect().width;
      var probe = document.createElement('div');
      probe.className = 't-card';
      root.appendChild(probe);
      cw = probe.getBoundingClientRect().width;
      probe.remove();
      reps = Math.max(2, Math.ceil((stageW * 2.2) / (cw * N)));
      L = cw * N * reps;
      ['left', 'main', 'right'].forEach(function (k) {
        var v = views[k];
        v.strip.textContent = '';
        v.cards = [];
        for (var r = 0; r < reps; r++) {
          source.forEach(function (li, i) {
            var card = document.createElement('div');
            card.className = 't-card' + (li.classList.contains('is-cta') ? ' is-cta' : '');
            card.setAttribute('style', li.getAttribute('style') || '');
            card.innerHTML = li.innerHTML;
            card._i = i;
            var a = card.querySelector('a');
            if (k !== 'main' || r > 0) { a.tabIndex = -1; if (k === 'main') a.setAttribute('aria-hidden', 'true'); }
            if (k === 'main' && r === 0) {
              a.addEventListener('focus', function () { goTo(i); });
            }
            a.addEventListener('click', function (e) { if (moved > 6) { e.preventDefault(); } });
            a.draggable = false;
            v.strip.appendChild(card);
            v.cards.push(card);
          });
        }
      });
      var mr = views.main.el.getBoundingClientRect(), rr = root.getBoundingClientRect();
      mainLeft = mr.left - rr.left;
      views.left.strip.style.transform = 'translate3d(0,0,0)';
      views.main.strip.style.transform = 'translate3d(' + (-mainLeft) + 'px,0,0)';
      views.right.strip.style.transform = 'translate3d(' + (-(mainLeft + mr.width)) + 'px,0,0)';
      render();
    }

    function wrap(x) { x = x % L; if (x < -cw) x += L; if (x >= L - cw) x -= L; return x; }
    function render() {
      ['left', 'main', 'right'].forEach(function (k) {
        views[k].cards.forEach(function (card, j) {
          var x = wrap(j * cw + offset);
          card.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
        });
      });
      updateActive();
    }

    // Kontrole iznad: nazivi djelatnosti
    var ctrlBtns = [];
    if (ctrlTrack) {
      for (var rr2 = 0; rr2 < 3; rr2++) {
        source.forEach(function (li, i) {
          var b = document.createElement('button');
          b.type = 'button';
          b.tabIndex = -1;
          b.textContent = li.getAttribute('data-name');
          b.addEventListener('click', function () { goTo(i); });
          ctrlTrack.appendChild(b);
          ctrlBtns.push({ b: b, i: i });
        });
      }
    }
    var active = -1;
    function centerIndex() {
      var c = stageW / 2, best = 0, bd = Infinity;
      views.main.cards.forEach(function (card, j) {
        var x = wrap(j * cw + offset) + cw / 2;
        var d = Math.abs(x - c);
        if (d < bd) { bd = d; best = j; }
      });
      return { j: best, i: best % N, d: bd };
    }
    function updateActive() {
      var ci = centerIndex();
      if (ci.i === active) return;
      active = ci.i;
      ctrlBtns.forEach(function (o) { o.b.classList.toggle('is-active', o.i === active); });
      if (ctrlTrack) {
        var mid = ctrlBtns[N + active].b;
        var box = ctrlTrack.parentNode.getBoundingClientRect().width;
        var x = -(mid.offsetLeft + mid.offsetWidth / 2 - box / 2);
        ctrlTrack.style.transition = reduce ? 'none' : 'transform .7s cubic-bezier(.65,0,.25,1)';
        ctrlTrack.style.transform = 'translate3d(' + x + 'px,0,0)';
      }
    }

    function goTo(i) {
      // najbliža kopija kartice i u centar
      var c = stageW / 2 - cw / 2, best = null, bd = Infinity;
      views.main.cards.forEach(function (card, j) {
        if (j % N !== i) return;
        var x = wrap(j * cw + offset);
        var d = c - x;
        if (Math.abs(d) < Math.abs(bd)) { bd = d; best = j; }
      });
      if (best === null) return;
      if (reduce) { offset += bd; render(); return; }
      target = offset + bd;
      vel = 0;
      pauseAuto(5000);
    }
    function step(dir) {
      var ci = centerIndex();
      goTo(((ci.i + dir) % N + N) % N);
    }
    var prev = $('[data-tunnel-prev]'), next = $('[data-tunnel-next]');
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });

    var pauseUntil = 0;
    function pauseAuto(ms) { pauseUntil = performance.now() + ms; }

    // Povlačenje
    var startX = 0, lastX = 0, lastMoveT = 0, moved = 0;
    root.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      dragging = true; moved = 0; target = null;
      startX = lastX = e.clientX; lastMoveT = performance.now(); vel = 0;
      root.classList.add('is-drag');
    });
    window.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - lastX;
      var now = performance.now();
      moved = Math.max(moved, Math.abs(e.clientX - startX));
      if (moved > 6 && root.setPointerCapture && !root._cap) { try { root.setPointerCapture(e.pointerId); root._cap = true; } catch (err) {} }
      offset += dx;
      vel = dx / Math.max(1, now - lastMoveT) * 16;
      lastX = e.clientX; lastMoveT = now;
      render();
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false; root._cap = false;
      root.classList.remove('is-drag');
      pauseAuto(4000);
      if (reduce) vel = 0;
    }
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    root.addEventListener('mouseenter', function () { hovering = true; });
    root.addEventListener('mouseleave', function () { hovering = false; });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { step(1); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { step(-1); e.preventDefault(); }
    });

    var vis = true;
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }).observe(root);

    function tick(t) {
      var dt = lastT ? Math.min(48, t - lastT) : 16;
      lastT = t;
      if (vis && !dragging) {
        var changed = false;
        if (target !== null) {
          var d = target - offset;
          offset += d * Math.min(1, 0.09 * dt / 16);
          if (Math.abs(d) < 0.5) { offset = target; target = null; }
          changed = true;
        } else if (Math.abs(vel) > 0.05) {
          offset += vel * dt / 16;
          vel *= Math.pow(0.94, dt / 16);
          changed = true;
        } else if (autoplay && !hovering && t > pauseUntil && !document.hidden) {
          offset -= 0.035 * dt;
          changed = true;
        }
        if (changed) render();
      }
      requestAnimationFrame(tick);
    }

    build();
    goToInstant(0);
    function goToInstant(i) { var c = stageW / 2 - cw / 2; offset = c - i * cw; render(); }
    requestAnimationFrame(tick);
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { var a = active < 0 ? 0 : active; build(); goToInstant(a); }, 150); });
  }

  /* ---------- Footer: pikselne stepenice ---------- */
  var fb = $('[data-foot-blocks]');
  if (fb) initFootBlocks(fb);
  function initFootBlocks(el) {
    var cells = [];
    function build() {
      var w = el.getBoundingClientRect().width || window.innerWidth;
      var cols = w < 600 ? 14 : w < 1000 ? 24 : 36;
      var rowsN = 5;
      el.style.setProperty('--cols', cols);
      el.textContent = '';
      cells = [];
      // Deterministički uzorak: što niže, to više punih kockica
      var seed = 7;
      function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
      for (var r = 0; r < rowsN; r++) {
        var p = [0.06, 0.16, 0.34, 0.6, 0.86][r];
        for (var c = 0; c < cols; c++) {
          var i = document.createElement('i');
          if (rnd() < p) i.className = 'on';
          el.appendChild(i);
          cells.push(i);
        }
      }
    }
    build();
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(build, 200); });
    if (reduce) return;
    var vis = false;
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }).observe(el);
    setInterval(function () {
      if (!vis || document.hidden) return;
      var off = cells.filter(function (c) { return !c.classList.contains('on'); });
      for (var k = 0; k < 4; k++) {
        var c = off[Math.floor(Math.random() * off.length)];
        if (!c) continue;
        c.classList.add('tw');
        (function (cc) { setTimeout(function () { cc.classList.remove('tw'); }, rand(500, 1600)); })(c);
      }
    }, 260);
  }

  /* ---------- Maskota u footeru (mango kojem oči prate kursor) ---------- */
  var mascotHost = $('[data-mascot]');
  if (mascotHost) {
    mascotHost.insertBefore(mangoSvg(), mascotHost.firstChild);
    if (finePointer && !reduce) {
      var raf = 0, px = 0, py = 0;
      window.addEventListener('pointermove', function (e) {
        px = e.clientX; py = e.clientY;
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = 0;
          var m = $('svg', mascotHost);
          var r = m.getBoundingClientRect();
          if (r.bottom < 0 || r.top > window.innerHeight) return;
          var a = Math.atan2(py - (r.top + r.height * 0.45), px - (r.left + r.width / 2));
          $$('.pupil', m).forEach(function (p) { p.setAttribute('transform', 'translate(' + (Math.cos(a) * 3.5).toFixed(1) + ' ' + (Math.sin(a) * 3.5).toFixed(1) + ')'); });
        });
      }, { passive: true });
    }
  }
  function svgEl(tag, attrs) { var n = document.createElementNS(SVGNS, tag); for (var k in attrs) n.setAttribute(k, attrs[k]); return n; }
  function mangoSvg() {
    var ink = '#0F1D1B';
    var s = svgEl('svg', { viewBox: '0 0 150 170', 'aria-hidden': 'true' });
    var defs = svgEl('defs', {});
    var g = svgEl('linearGradient', { id: 'mgf', x1: '0', y1: '0', x2: '1', y2: '1' });
    g.appendChild(svgEl('stop', { offset: '0', 'stop-color': '#FFD966' }));
    g.appendChild(svgEl('stop', { offset: '1', 'stop-color': '#F08A2C' }));
    defs.appendChild(g); s.appendChild(defs);
    var body = 'M76 30 C110 28 128 58 124 92 C120 124 98 142 72 140 C44 138 26 116 28 86 C30 54 46 32 76 30 Z';
    var leaf = 'M78 32 C84 12 104 4 120 10 C112 26 96 34 78 32 Z';
    var limbs = 'M64 138 L56 158 L44 158 M88 138 L100 152 L112 148 M30 98 L12 86 M122 92 L140 76';
    s.appendChild(svgEl('ellipse', { cx: '78', cy: '160', rx: '44', ry: '5', fill: 'rgba(15,29,27,.18)' }));
    s.appendChild(svgEl('path', { d: limbs, fill: 'none', stroke: ink, 'stroke-width': '6', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
    s.appendChild(svgEl('path', { d: body, fill: 'url(#mgf)', stroke: ink, 'stroke-width': '4' }));
    s.appendChild(svgEl('path', { d: leaf, fill: '#8FD16A', stroke: ink, 'stroke-width': '4', 'stroke-linejoin': 'round' }));
    s.appendChild(svgEl('path', { d: 'M80 32 C88 24 98 18 110 14', fill: 'none', stroke: ink, 'stroke-width': '3', 'stroke-linecap': 'round' }));
    s.appendChild(svgEl('ellipse', { cx: '62', cy: '78', rx: '12', ry: '13', fill: '#fff', stroke: ink, 'stroke-width': '3.5' }));
    s.appendChild(svgEl('ellipse', { cx: '92', cy: '76', rx: '12', ry: '13', fill: '#fff', stroke: ink, 'stroke-width': '3.5' }));
    s.appendChild(svgEl('circle', { cx: '64', cy: '80', r: '5.5', fill: ink, class: 'pupil' }));
    s.appendChild(svgEl('circle', { cx: '94', cy: '78', r: '5.5', fill: ink, class: 'pupil' }));
    s.appendChild(svgEl('path', { d: 'M64 104 Q78 116 92 102', fill: 'none', stroke: ink, 'stroke-width': '4', 'stroke-linecap': 'round' }));
    s.appendChild(svgEl('ellipse', { cx: '48', cy: '100', rx: '7', ry: '4', fill: '#F25C3B', opacity: '.45' }));
    s.appendChild(svgEl('ellipse', { cx: '106', cy: '96', rx: '7', ry: '4', fill: '#F25C3B', opacity: '.45' }));
    return s;
  }

  /* ---------- Nakon slanja forme: pokaži poruku o uspjehu ---------- */
  var sent = document.querySelector('#contact-success:not([hidden])');
  if (sent) {
    sent.setAttribute('tabindex', '-1');
    setTimeout(function () {
      var y = sent.getBoundingClientRect().top + window.scrollY - (window.innerHeight / 2) + sent.offsetHeight / 2;
      if (window.mangaiLenis) window.mangaiLenis.scrollTo(Math.max(0, y), { immediate: reduce });
      else window.scrollTo({ top: Math.max(0, y), behavior: reduce ? 'auto' : 'smooth' });
      try { sent.focus({ preventScroll: true }); } catch (e) {}
    }, 450);
  }

  /* ---------- Glatki scroll (Lenis), samo za miš ---------- */
  if (!reduce && finePointer && window.Lenis) {
    var lenis = new window.Lenis({
      lerp: 0.11,
      anchors: true,
      prevent: function (node) { return !!(node.closest && node.closest('#mangai-chat-root, .m-menu, select, textarea')); }
    });
    (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })(0);
    window.mangaiLenis = lenis;
  }
})();
