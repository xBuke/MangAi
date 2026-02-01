(function () {
  var CANONICAL_BASE = 'https://mangai.hr/en/blog/';
  var HR_BASE = 'https://mangai.hr/blog/';
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

  function buildToc(containerEl, contentEl) {
    var headings = contentEl.querySelectorAll('h2, h3');
    if (headings.length === 0) return;
    var nav = document.getElementById('post-toc-list');
    var toggle = document.querySelector('.post-toc-toggle');
    if (!nav) return;

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

    if (toggle) {
      toggle.setAttribute('aria-expanded', isNarrow ? 'false' : 'true');
      toggle.addEventListener('click', function () {
        var expanded = nav.hidden;
        nav.hidden = !expanded;
        toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      });
    }
  }

  function injectRelatedPosts(posts, currentSlug) {
    var container = document.getElementById('post-related-links');
    if (!container) return;
    var others = (posts || []).filter(function (p) { return p.slug !== currentSlug; })
      .sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
    var toShow = others.slice(0, 3);
    if (toShow.length === 0) {
      container.innerHTML = '<a href="index.html">Back to blog</a>';
      return;
    }
    var html = toShow.map(function (p) {
      var title = p.title_en || p.slug;
      return '<a href="' + p.slug + '.html">' + escapeHtml(title) + '</a>';
    }).join(', ');
    container.innerHTML = html;
  }

  function injectPost(post, allPosts) {
    document.getElementById('post-title').textContent = post.title_en;
    document.getElementById('post-date').textContent = 'Updated: ' + formatDate(post.date);
    document.getElementById('post-author').textContent = post.author;
    document.getElementById('post-reading-time').textContent =
      post.reading_time_minutes + ' min read';

    var coverEl = document.getElementById('post-cover');
    if (post.cover_image) {
      coverEl.innerHTML = '<img src="' + escapeAttr(post.cover_image) + '" alt="">';
      coverEl.style.display = 'block';
    }

    var contentEl = document.getElementById('post-content');
    contentEl.innerHTML = post.content_html_en || '';

    buildToc(null, contentEl);
    document.getElementById('post-root').hidden = false;
    if (allPosts && post.slug) injectRelatedPosts(allPosts, post.slug);

    var hrLink = document.getElementById('lang-switcher-hr');
    if (hrLink) hrLink.href = '../../blog/' + post.slug + '.html';
  }

  function formatDate(iso) {
    try {
      var d = new Date(iso);
      return d.toLocaleDateString('en-US', {
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

  function updateSeo(post) {
    var title = post.title_en + ' – MangAi';
    document.title = title;
    setMeta('description', post.excerpt_en);
    setMeta('keywords', (post.keywords || []).join(', '));

    var slug = post.slug;
    var url = CANONICAL_BASE + slug + '.html';
    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = url;

    setMetaProperty('og:title', post.title_en);
    setMetaProperty('og:description', post.excerpt_en);
    setMetaProperty('og:url', url);
    setMetaProperty('og:type', 'article');
    if (post.cover_image) setMetaProperty('og:image', post.cover_image);
    else setMetaProperty('og:image', OG_IMAGE_FALLBACK);

    var twitterTitle = document.querySelector('meta[name="twitter:title"]');
    var twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterTitle) twitterTitle.setAttribute('content', post.title_en);
    if (twitterDesc) twitterDesc.setAttribute('content', post.excerpt_en);

    addHreflang(HR_BASE + slug + '.html', url);
  }

  function injectJsonLd(post) {
    var url = CANONICAL_BASE + post.slug + '.html';
    setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title_en,
      name: post.title_en,
      description: post.excerpt_en,
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
        '<div class="post-noscript">Post not found. <a href="index.html">Back to blog</a>.</div>';
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
