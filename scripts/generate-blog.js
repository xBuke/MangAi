#!/usr/bin/env node
/**
 * Generate static blog post HTML files from posts.json
 *
 * Usage: node scripts/generate-blog.js
 *
 * Reads blog/posts.json (HR) and en/blog/posts.json (EN), outputs:
 * - blog/<slug>.html for each HR post
 * - en/blog/<slug>.html for each EN post
 *
 * No npm install required. Run from project root.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE_BASE = 'https://mangai.hr';

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function truncateExcerpt(text, maxLen = 160) {
  if (!text) return '';
  const s = String(text).trim();
  if (s.length <= maxLen) return s;
  const cut = s.lastIndexOf(' ', maxLen);
  return (cut > 0 ? s.slice(0, cut) : s.slice(0, maxLen)) + '…';
}

/** Transform post.html?slug=X or href="slug" to X.html in HTML content */
function transformInternalLinks(html) {
  if (!html) return '';
  let out = html.replace(
    /href=["']post\.html\?slug=([a-z0-9-]+)["']/gi,
    'href="$1.html"'
  );
  out = out.replace(
    /href=["'](ai-[a-z0-9-]+)["']/g,
    (_, slug) => (slug.endsWith('.html') ? `href="${slug}"` : `href="${slug}.html"`)
  );
  return out;
}

function formatDateHR(iso) {
  try {
    return new Date(iso).toLocaleDateString('hr-HR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso || '';
  }
}

function formatDateEN(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso || '';
  }
}

function getRelatedPosts(posts, currentSlug, count = 3, locale) {
  const titleKey = locale === 'en' ? 'title_en' : 'title_hr';
  return posts
    .filter((p) => p.slug !== currentSlug)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .slice(0, count)
    .map((p) => ({
      slug: p.slug,
      title: p[titleKey] || p.slug,
    }));
}

function generateHrPostHtml(post, allPosts) {
  const canonical = `${SITE_BASE}/blog/${post.slug}.html`;
  const title = (post.title_hr || post.slug) + ' | MangAi';
  const description = truncateExcerpt(post.excerpt_hr);
  const content = transformInternalLinks(post.content_html_hr || '', 'hr');
  const related = getRelatedPosts(allPosts, post.slug, 3, 'hr');
  const dateStr = formatDateHR(post.date);

  let faqSection = '';
  if (post.faq_hr && Array.isArray(post.faq_hr) && post.faq_hr.length > 0) {
    faqSection = `
    <section class="post-faq" aria-label="Često postavljana pitanja">
      <h2 class="post-faq-title">Često postavljana pitanja</h2>
      <dl class="post-faq-list">
        ${post.faq_hr
          .map(
            (item) =>
              `<dt class="post-faq-q">${escapeHtml(item.q || '')}</dt><dd class="post-faq-a">${escapeHtml(item.a || '')}</dd>`
          )
          .join('')}
      </dl>
    </section>`;
  }

  const relatedLinks =
    related.length > 0
      ? related
          .map(
            (r) =>
              `<a href="${r.slug}.html">${escapeHtml(r.title)}</a>`
          )
          .join(', ')
      : '<a href="index.html">Natrag na blog</a>';

  return `<!DOCTYPE html>
<html lang="hr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="${canonical}">
    <meta property="og:title" content="${escapeHtml(post.title_hr || '')}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${canonical}">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="${escapeHtml(post.title_hr || '')}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <link rel="icon" href="/favicon.ico">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/style.css">
    <link rel="stylesheet" href="/blog/blog.css">
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="nav-bar">
                <a href="/" class="logo">MangAi</a>
                <button type="button" class="nav-toggle" aria-label="Otvori izbornik" aria-expanded="false" aria-controls="nav-menu">
                    <span class="nav-toggle-icon"></span>
                </button>
                <div class="nav-menu-panel" id="nav-menu">
                    <nav class="nav">
                        <a href="/#services">Usluge</a>
                        <a href="/#approach">Pristup</a>
                        <a href="/#difference">Razlika</a>
                        <a href="/#contact">Stupimo u kontakt</a>
                        <a href="/blog/">Blog</a>
                        <span class="lang-switcher">
                            <span aria-current="page">HR</span>
                            <span class="lang-sep" aria-hidden="true">|</span>
                            <a href="${SITE_BASE}/en/blog/${post.slug}.html" id="lang-switcher-en">EN</a>
                        </span>
                    </nav>
                    <a href="/#contact" class="btn-nav-cta">
                        <span>Rezerviraj konzultacije</span>
                        <svg class="btn-nav-cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </a>
                </div>
            </div>
        </div>
    </header>
    <div class="nav-menu-backdrop" id="nav-menu-backdrop" aria-hidden="true"></div>

    <main class="post-main">
        <div class="blog-container post-layout">
            <article class="post-article">
                <header class="post-header">
                    <h1 class="post-title">${escapeHtml(post.title_hr || post.slug)}</h1>
                    <div class="post-meta">
                        <span>Ažurirano: ${escapeHtml(dateStr)}</span>
                        <span class="post-meta-sep">·</span>
                        <span>${escapeHtml(post.author || 'MangAi')}</span>
                        <span class="post-meta-sep">·</span>
                        <span>${post.reading_time_minutes || 5} min čitanja</span>
                    </div>
                </header>
                <div class="post-body-wrapper">
                    <aside id="post-toc" class="post-toc" data-post-toc aria-label="Sadržaj članka">
                        <nav id="post-toc-list" class="post-toc-list" hidden></nav>
                    </aside>
                    <div class="post-content-col">
                        <button type="button" id="toc-toggle" class="post-toc-toggle-btn" aria-expanded="false" aria-controls="post-toc-list">Sadržaj</button>
                        <div id="post-content" class="post-content prose" data-post-content>${content}</div>
                        ${faqSection}
                    </div>
                </div>
                <footer class="post-footer">
                    <section class="post-related">
                        <h2 class="post-related-title">Povezani članci</h2>
                        <p class="post-related-links">${relatedLinks}</p>
                    </section>
                    <section class="post-cta">
                        <h2 class="post-cta-title">Želiš ovo implementirati u svom poslovanju?</h2>
                        <p class="post-cta-text">MangAi razvija AI alate i automatizacije za firme u Hrvatskoj i regiji.</p>
                        <a href="/#contact" class="post-cta-btn">Rezerviraj konzultacije</a>
                    </section>
                </footer>
            </article>
        </div>
    </main>

    <footer class="blog-footer">
        <div class="blog-container">
            <p>&copy; ${new Date().getFullYear()} MangAi. Sva prava pridržana.</p>
            <a href="index.html">Natrag na blog</a>
        </div>
    </footer>

    <script src="blog-nav.js"><\/script>
    <script src="blog-toc.js"><\/script>
</body>
</html>
`;
}

function generateEnPostHtml(post, allPosts) {
  const canonical = `${SITE_BASE}/en/blog/${post.slug}.html`;
  const title = (post.title_en || post.slug) + ' | MangAi';
  const description = truncateExcerpt(post.excerpt_en);
  const content = transformInternalLinks(post.content_html_en || '');
  const related = getRelatedPosts(allPosts, post.slug, 3, 'en');
  const dateStr = formatDateEN(post.date);

  let faqSection = '';
  if (post.faq_en && Array.isArray(post.faq_en) && post.faq_en.length > 0) {
    faqSection = `
    <section class="post-faq" aria-label="Frequently asked questions">
      <h2 class="post-faq-title">Frequently asked questions</h2>
      <dl class="post-faq-list">
        ${post.faq_en
          .map(
            (item) =>
              `<dt class="post-faq-q">${escapeHtml(item.q || '')}</dt><dd class="post-faq-a">${escapeHtml(item.a || '')}</dd>`
          )
          .join('')}
      </dl>
    </section>`;
  }

  const relatedLinks =
    related.length > 0
      ? related
          .map(
            (r) =>
              `<a href="${r.slug}.html">${escapeHtml(r.title)}</a>`
          )
          .join(', ')
      : '<a href="index.html">Back to blog</a>';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="${canonical}">
    <meta property="og:title" content="${escapeHtml(post.title_en || '')}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${canonical}">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="${escapeHtml(post.title_en || '')}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <link rel="icon" href="/favicon.ico">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/style.css">
    <link rel="stylesheet" href="/blog/blog.css">
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="nav-bar">
                <a href="/en/" class="logo">MangAi</a>
                <button type="button" class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="nav-menu">
                    <span class="nav-toggle-icon"></span>
                </button>
                <div class="nav-menu-panel" id="nav-menu">
                    <nav class="nav">
                        <a href="/en/#services">Services</a>
                        <a href="/en/#approach">Approach</a>
                        <a href="/en/#difference">Difference</a>
                        <a href="/en/#contact">Get in Touch</a>
                        <a href="/en/blog/">Blog</a>
                        <span class="lang-switcher">
                            <a href="${SITE_BASE}/blog/${post.slug}.html" id="lang-switcher-hr">HR</a>
                            <span class="lang-sep" aria-hidden="true">|</span>
                            <span aria-current="page">EN</span>
                        </span>
                    </nav>
                    <a href="/en/#contact" class="btn-nav-cta">
                        <span>Book a consultation</span>
                        <svg class="btn-nav-cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </a>
                </div>
            </div>
        </div>
    </header>
    <div class="nav-menu-backdrop" id="nav-menu-backdrop" aria-hidden="true"></div>

    <main class="post-main">
        <div class="blog-container post-layout">
            <article class="post-article">
                <header class="post-header">
                    <h1 class="post-title">${escapeHtml(post.title_en || post.slug)}</h1>
                    <div class="post-meta">
                        <span>Updated: ${escapeHtml(dateStr)}</span>
                        <span class="post-meta-sep">·</span>
                        <span>${escapeHtml(post.author || 'MangAi')}</span>
                        <span class="post-meta-sep">·</span>
                        <span>${post.reading_time_minutes || 5} min read</span>
                    </div>
                </header>
                <div class="post-body-wrapper">
                    <aside id="post-toc" class="post-toc" data-post-toc aria-label="Table of contents">
                        <nav id="post-toc-list" class="post-toc-list" hidden></nav>
                    </aside>
                    <div class="post-content-col">
                        <button type="button" id="toc-toggle" class="post-toc-toggle-btn" aria-expanded="false" aria-controls="post-toc-list">Contents</button>
                        <div id="post-content" class="post-content prose" data-post-content>${content}</div>
                        ${faqSection}
                    </div>
                </div>
                <footer class="post-footer">
                    <section class="post-related">
                        <h2 class="post-related-title">Related posts</h2>
                        <p class="post-related-links">${relatedLinks}</p>
                    </section>
                    <section class="post-cta">
                        <h2 class="post-cta-title">Want to implement this in your business?</h2>
                        <p class="post-cta-text">MangAi builds AI tools and automation for businesses in Croatia and the region.</p>
                        <a href="/en/#contact" class="post-cta-btn">Book a consultation</a>
                    </section>
                </footer>
            </article>
        </div>
    </main>

    <footer class="blog-footer">
        <div class="blog-container">
            <p>&copy; ${new Date().getFullYear()} MangAi. All rights reserved.</p>
            <a href="index.html">Back to blog</a>
        </div>
    </footer>

    <script src="/blog/blog-nav.js"><\/script>
    <script src="/blog/blog-toc.js"><\/script>
</body>
</html>
`;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function main() {
  let hrPosts = [];
  let enPosts = [];

  const hrPath = path.join(ROOT, 'blog', 'posts.json');
  const enPath = path.join(ROOT, 'en', 'blog', 'posts.json');

  if (fs.existsSync(hrPath)) {
    try {
      hrPosts = JSON.parse(fs.readFileSync(hrPath, 'utf8'));
      if (!Array.isArray(hrPosts)) hrPosts = [];
    } catch (e) {
      console.warn('Could not parse blog/posts.json:', e.message);
    }
  }

  if (fs.existsSync(enPath)) {
    try {
      enPosts = JSON.parse(fs.readFileSync(enPath, 'utf8'));
      if (!Array.isArray(enPosts)) enPosts = [];
    } catch (e) {
      console.warn('Could not parse en/blog/posts.json:', e.message, '- skipping EN posts');
    }
  }

  const blogDir = path.join(ROOT, 'blog');
  const enBlogDir = path.join(ROOT, 'en', 'blog');
  ensureDir(blogDir);
  ensureDir(enBlogDir);

  for (const post of hrPosts) {
    if (post.slug) {
      const outPath = path.join(blogDir, post.slug + '.html');
      fs.writeFileSync(outPath, generateHrPostHtml(post, hrPosts), 'utf8');
      console.log('Generated:', outPath);
    }
  }

  for (const post of enPosts) {
    if (post.slug) {
      const outPath = path.join(enBlogDir, post.slug + '.html');
      fs.writeFileSync(outPath, generateEnPostHtml(post, enPosts), 'utf8');
      console.log('Generated:', outPath);
    }
  }

  // Generate sitemap.xml
  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: SITE_BASE + '/', lastmod: today, priority: '1.0', changefreq: 'weekly' },
    { loc: SITE_BASE + '/blog/', lastmod: today, priority: '0.8', changefreq: 'weekly' },
    ...hrPosts.map((p) => ({ loc: SITE_BASE + '/blog/' + p.slug + '.html', lastmod: (p.date || today).slice(0, 10), priority: '0.7', changefreq: 'monthly' })),
    { loc: SITE_BASE + '/en/', lastmod: today, priority: '1.0', changefreq: 'weekly' },
    { loc: SITE_BASE + '/en/blog/', lastmod: today, priority: '0.8', changefreq: 'weekly' },
    ...enPosts.map((p) => ({ loc: SITE_BASE + '/en/blog/' + p.slug + '.html', lastmod: (p.date || today).slice(0, 10), priority: '0.7', changefreq: 'monthly' })),
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  console.log('Updated:', sitemapPath);

  console.log('Done. Run again after editing posts.json to regenerate.');
}

main();
