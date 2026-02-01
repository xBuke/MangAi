(function () {
  var CANONICAL_BASE = 'https://mangai.hr/blog/post.html?slug=';
  var EN_BASE = 'https://mangai.hr/en/blog/post.html?slug=';
  var OG_IMAGE_FALLBACK = 'https://mangai.hr/assets/og-blog.png';

  function getSlug() {
    var params = new URLSearchParams(window.location.search);
    return params.get('slug') || '';
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function setMeta(name, content) {
    var el = document.querySelector('meta[name="' + name + '"]');
    if (el) el.setAttribute('content', content);
  }

  function setMetaProperty(property, content) {
    var el = document.querySelector('meta[property="' + property + '"]');
    if (el) el.setAttribute('content', content);
  }

  function setJsonLd(data) {
    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  function buildToc(containerEl, contentEl) {
    var headings = contentEl.querySelectorAll('h2, h3');
    var nav = document.getElementById('post-toc-list');
    var toc = document.getElementById('post-toc');
    var toggle = document.getElementById('toc-toggle');
    if (!nav || !toc) return;

    if (headings.length === 0) {
      if (toggle) toggle.style.display = 'none';
      return;
    }

    var fragment = document.createDocumentFragment();
    headings.forEach(function (h, i) {
      var id = 'heading-' + i;
      if (!h.id) h.id = id;
      var a = document.createElement('a');
      a.href = '#' + id;
      a.textContent = h.textContent;
      a.className = h.tagName === 'H3' ? 'toc-h3' : '';
      fragment.appendChild(a);
    });
    nav.appendChild(fragment);

    var isNarrow = typeof window !== 'undefined' && window.innerWidth <= 900;
    nav.hidden = isNarrow;
    toggle.setAttribute('aria-expanded', 'false');
    toc.classList.remove('is-open');

    function closeToc() {
      toc.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      if (isNarrow) nav.hidden = true;
    }

    function openToc() {
      toc.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      if (isNarrow) nav.hidden = false;
    }

    toggle.addEventListener('click', function () {
      var expanded = toc.classList.contains('is-open');
      if (expanded) closeToc();
      else openToc();
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeToc();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeToc();
    });

    document.addEventListener('click', function (e) {
      if (!toc.classList.contains('is-open')) return;
      if (isNarrow) return;
      if (toc.contains(e.target) || toggle.contains(e.target)) return;
      closeToc();
    });
  }

  function injectRelatedPosts(posts, currentSlug) {
    var container = document.getElementById('post-related-links');
    if (!container) return;
    var others = (posts || []).filter(function (p) { return p.slug !== currentSlug; })
      .sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
    var toShow = others.slice(0, 3);
    if (toShow.length === 0) {
      container.innerHTML = '<a href="index.html">Natrag na blog</a>';
      return;
    }
    var html = toShow.map(function (p) {
      var title = p.title_hr || p.slug;
      return '<a href="post.html?slug=' + encodeURIComponent(p.slug) + '">' + escapeHtml(title) + '</a>';
    }).join(', ');
    container.innerHTML = html;
  }

  function injectPost(post, allPosts) {
    document.getElementById('post-title').textContent = post.title_hr;
    document.getElementById('post-date').textContent = 'Ažurirano: ' + formatDate(post.date);
    document.getElementById('post-author').textContent = post.author;
    document.getElementById('post-reading-time').textContent =
      post.reading_time_minutes + ' min čitanja';

    var coverEl = document.getElementById('post-cover');
    if (post.cover_image) {
      coverEl.innerHTML = '<img src="' + escapeAttr(post.cover_image) + '" alt="">';
      coverEl.style.display = 'block';
    }

    var contentEl = document.getElementById('post-content');
    contentEl.innerHTML = post.content_html_hr || '';

    buildToc(null, contentEl);
    document.getElementById('post-root').hidden = false;
    if (allPosts && post.slug) injectRelatedPosts(allPosts, post.slug);
  }

  function formatDate(iso) {
    try {
      var d = new Date(iso);
      return d.toLocaleDateString('hr-HR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return iso;
    }
  }

  function escapeAttr(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function addHreflang(hrUrl, enUrl) {
    var existing = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existing.forEach(function (l) { l.remove(); });
    var hr = document.createElement('link');
    hr.rel = 'alternate';
    hr.hreflang = 'hr';
    hr.href = hrUrl;
    document.head.appendChild(hr);
    var en = document.createElement('link');
    en.rel = 'alternate';
    en.hreflang = 'en';
    en.href = enUrl;
    document.head.appendChild(en);
  }

  function updateSeo(post) {
    var title = post.title_hr + ' – MangAi';
    document.title = title;
    setMeta('description', post.excerpt_hr);
    setMeta('keywords', (post.keywords || []).join(', '));

    var slug = post.slug;
    var url = CANONICAL_BASE + encodeURIComponent(slug);
    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = url;

    setMetaProperty('og:title', post.title_hr);
    setMetaProperty('og:description', post.excerpt_hr);
    setMetaProperty('og:url', url);
    setMetaProperty('og:type', 'article');
    if (post.cover_image) setMetaProperty('og:image', post.cover_image);
    else setMetaProperty('og:image', OG_IMAGE_FALLBACK);

    var twitterTitle = document.querySelector('meta[name="twitter:title"]');
    var twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterTitle) twitterTitle.setAttribute('content', post.title_hr);
    if (twitterDesc) twitterDesc.setAttribute('content', post.excerpt_hr);

    addHreflang(url, EN_BASE + encodeURIComponent(slug));

    var enLink = document.getElementById('lang-switcher-en');
    if (enLink) enLink.href = '../en/blog/post.html?slug=' + encodeURIComponent(slug);
  }

  function injectJsonLd(post) {
    var url = CANONICAL_BASE + encodeURIComponent(post.slug);
    setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title_hr,
      name: post.title_hr,
      description: post.excerpt_hr,
      datePublished: post.date,
      author: {
        '@type': 'Organization',
        name: post.author || 'MangAi'
      },
      publisher: {
        '@type': 'Organization',
        name: 'MangAi'
      },
      url: url,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url
      }
    });
  }

  function showError() {
    var root = document.getElementById('post-root');
    if (root) {
      root.innerHTML =
        '<div class="post-noscript">Članak nije pronađen. <a href="index.html">Povratak na blog</a>.</div>';
      root.hidden = false;
    }
  }

  var slug = getSlug();
  if (!slug) {
    showError();
    return;
  }

  fetch('posts.json')
    .then(function (res) {
      if (!res.ok) throw new Error('Not found');
      return res.json();
    })
    .then(function (posts) {
      var post = Array.isArray(posts)
        ? posts.find(function (p) { return p.slug === slug; })
        : null;
      if (!post) {
        showError();
        return;
      }
      injectPost(post, posts);
      updateSeo(post);
      injectJsonLd(post);
    })
    .catch(showError);
})();
