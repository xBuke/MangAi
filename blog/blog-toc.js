/**
 * Blog TOC – builds table of contents from h2/h3 in post content.
 * Works for /blog/*.html and /en/blog/*.html static pages.
 */
(function () {
  var scope = document.querySelector('[data-post-content]') ||
    document.getElementById('post-content') ||
    document.querySelector('.post-content') ||
    document.querySelector('article');
  var tocContainer = document.querySelector('[data-post-toc]') ||
    document.getElementById('post-toc') ||
    document.querySelector('.post-toc');
  var nav = document.getElementById('post-toc-list');
  var toggle = document.getElementById('toc-toggle');

  if (!scope || !nav) return;

  var headings = scope.querySelectorAll('h2, h3');
  if (headings.length < 2) {
    if (tocContainer) tocContainer.style.display = 'none';
    if (toggle) toggle.style.display = 'none';
    return;
  }

  function slugify(text) {
    return String(text)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'h';
  }

  var used = {};
  function uniqueId(base) {
    var id = base;
    var n = 1;
    while (used[id]) {
      id = base + '-' + (++n);
    }
    used[id] = true;
    return id;
  }

  for (var i = 0; i < headings.length; i++) {
    var h = headings[i];
    var base = slugify(h.textContent);
    var id = uniqueId(base);
    if (!h.id) h.id = id;

    var a = document.createElement('a');
    a.href = '#' + id;
    a.textContent = h.textContent;
    if (h.tagName === 'H3') a.className = 'toc-h3';
    (function (targetId) {
      a.addEventListener('click', function (e) {
        var target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    })(id);
    nav.appendChild(a);
  }
  nav.removeAttribute('hidden');

  var isNarrow = window.innerWidth <= 900;
  if (isNarrow) nav.hidden = true;
  if (toggle) {
    toggle.setAttribute('aria-expanded', isNarrow ? 'false' : 'true');

    function closeToc() {
      if (tocContainer) tocContainer.classList.remove('is-open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
      if (isNarrow) nav.hidden = true;
    }

    function openToc() {
      if (tocContainer) tocContainer.classList.add('is-open');
      if (toggle) toggle.setAttribute('aria-expanded', 'true');
      nav.hidden = false;
    }

    toggle.addEventListener('click', function () {
      var open = tocContainer && tocContainer.classList.contains('is-open');
      if (open) closeToc();
      else openToc();
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeToc();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeToc();
    });

    document.addEventListener('click', function (e) {
      if (!tocContainer || !tocContainer.classList.contains('is-open')) return;
      if (isNarrow) return;
      if (tocContainer.contains(e.target) || toggle.contains(e.target)) return;
      closeToc();
    });
  }
})();
