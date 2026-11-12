#!/usr/bin/env node
/**
 * Generira statičke stranice bloga iz posts.json (HR i EN) u izgledu početne stranice.
 *
 * Pokretanje (iz korijena projekta, bez npm install):
 *   node scripts/generate-blog.js
 *
 * Ulaz:  blog/posts.json (HR), en/blog/posts.json (EN)
 * Izlaz: blog/index.html, blog/<slug>.html, blog/post.html (stari linkovi),
 *        en/blog/index.html, en/blog/<slug>.html, en/blog/post.html, sitemap.xml
 *        + zasebne stranice iz scripts/pages-hr.js (usluge/, javni-sektor/, primjeri/, o-meni/, kontakt/)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://mangai.hr';
const BRAND = 'MangAI';
const { pages: PAGES_HR, pricingCards } = require('./pages-hr.js');

/* ---------- pomoćne funkcije ---------- */

function esc(text) {
  if (text === undefined || text === null) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function truncate(text, maxLen = 160) {
  if (!text) return '';
  const s = String(text).trim();
  if (s.length <= maxLen) return s;
  const cut = s.lastIndexOf(' ', maxLen);
  return (cut > 0 ? s.slice(0, cut) : s.slice(0, maxLen)) + '…';
}

/** Stari oblik internih linkova (post.html?slug=x, "ai-x") pretvara u x.html */
function fixInternalLinks(html) {
  if (!html) return '';
  let out = html.replace(/href=["']post\.html\?slug=([a-z0-9-]+)["']/gi, 'href="$1.html"');
  out = out.replace(/href=["'](ai-[a-z0-9-]+)["']/g, (_, slug) =>
    slug.endsWith('.html') ? `href="${slug}"` : `href="${slug}.html"`
  );
  return out;
}

/** Usklađuje stari zapis naziva (MangAi) s novim (MangAI) */
function fixBrand(text) {
  return text ? String(text).replace(/MangAi\b/g, BRAND) : text;
}

function formatDate(iso, locale) {
  try {
    return new Date(iso).toLocaleDateString(locale === 'en' ? 'en-GB' : 'hr-HR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso || '';
  }
}

function readPosts(file) {
  if (!fs.existsSync(file)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn('Ne mogu pročitati', file, e.message);
    return [];
  }
}

const byDateDesc = (a, b) => (b.date || '').localeCompare(a.date || '');

/** Favicon i ikone – isti blok ide i u ručno pisane stranice (index.html, pravne stranice) */
const ICON_LINKS = `    <link rel="icon" href="/favicon.ico" sizes="48x48">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">`;

function jsonLd(obj) {
  return `    <script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n    </script>\n`;
}

/** crumbs: [[href, naziv], ...], zadnja stavka (href null) je trenutna stranica s URL-om canonical */
function breadcrumbSchema(crumbs, canonical) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map(([href, name], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: href ? SITE + href : canonical,
    })),
  };
}

/* ---------- tekstovi po jeziku ---------- */

const L = {
  hr: {
    lang: 'hr',
    ogLocale: 'hr_HR',
    home: '/',
    blog: '/blog/',
    skip: 'Preskoči na sadržaj',
    homeAria: `${BRAND}, početna`,
    menu: 'Otvori izbornik',
    navAria: 'Glavni izbornik',
    nav: [['/usluge/', 'Usluge'], ['/cijene/', 'Cijene'], ['/primjeri/', 'Primjeri'], ['/javni-sektor/', 'Javni sektor'], ['/blog/', 'Blog']],
    cta: 'Pošalji upit',
    contact: '/kontakt/',
    tagline: 'Web stranice, aplikacije i AI rješenja za obrte, tvrtke, udruge i javne naručitelje.',
    bizTitle: 'Podaci o obrtu',
    country: '',
    pagesTitle: 'Stranice',
    footerLinks: [['/cijene/', 'Cijene'], ['/primjeri/', 'Primjeri'], ['/javni-sektor/', 'Javni sektor'], ['/o-meni/', 'O meni'], ['/kontakt/', 'Kontakt'], ['/blog/', 'Blog'], ['/uvjeti-poslovanja.html', 'Uvjeti poslovanja'], ['/privacy_hr.html', 'Pravila privatnosti'], ['/terms_hr.html', 'Uvjeti korištenja']],
    servicesTitle: 'Usluge',
    footerServices: [['/usluge/izrada-web-stranica/', 'Izrada web stranica'], ['/usluge/ai-chatbot/', 'AI chatbot'], ['/usluge/ai-automatizacija/', 'AI automatizacija'], ['/usluge/aplikacije-po-mjeri/', 'Aplikacije po mjeri'], ['/usluge/odrzavanje/', 'Održavanje i hosting']],
    homeLabel: 'Početna',
    otherLangLabel: 'English',
    indexTitle: `Blog o AI automatizaciji i web stranicama | ${BRAND}`,
    indexDesc: 'Praktični vodiči o AI alatima, automatizaciji i web rješenjima za obrte, male tvrtke i ustanove u Hrvatskoj.',
    indexH1: 'Blog',
    indexIntro: 'Praktični vodiči o AI alatima, automatizaciji i web rješenjima za obrte, male tvrtke i ustanove u Hrvatskoj.',
    updated: 'Ažurirano',
    minRead: 'min čitanja',
    readMore: 'Pročitaj članak',
    toc: 'Sadržaj',
    faq: 'Česta pitanja',
    related: 'Povezani članci',
    back: 'Svi članci',
    ctaTitle: 'Želite ovo u svom poslovanju?',
    ctaText: 'Opišite ukratko što trebate i dobit ćete pisani prijedlog s cijenom i rokom. Prvi razgovor je besplatan.',
    ctaBtn: 'Pošalji upit',
    advisorBtn: 'Pokreni savjetnika',
    titleKey: 'title_hr',
    excerptKey: 'excerpt_hr',
    metaTitleKey: 'meta_title_hr',
    metaDescKey: 'meta_description_hr',
    contentKey: 'content_html_hr',
    faqKey: 'faq_hr',
    redirectTitle: `Članak | ${BRAND}`,
  },
  en: {
    lang: 'en',
    ogLocale: 'en_GB',
    home: '/en/',
    blog: '/en/blog/',
    skip: 'Skip to content',
    homeAria: `${BRAND}, home`,
    menu: 'Open menu',
    navAria: 'Main menu',
    nav: [['/en/#services', 'Services'], ['/en/#examples', 'Examples'], ['/en/#public-sector', 'Public sector'], ['/en/blog/', 'Blog']],
    cta: 'Send an enquiry',
    contact: '/en/#contact',
    tagline: 'Websites, apps and AI solutions for businesses, associations and public bodies.',
    bizTitle: 'Business details',
    country: ', Croatia',
    pagesTitle: 'Pages',
    footerLinks: [['/en/blog/', 'Blog'], ['/privacy.html', 'Privacy policy'], ['/terms.html', 'Terms of use'], ['/en/terms-of-business.html', 'Terms of business']],
    homeLabel: 'Home',
    otherLangLabel: 'Hrvatski',
    indexTitle: `Blog | ${BRAND} – AI, web and automation for businesses in Croatia`,
    indexDesc: 'Practical guides on AI tools, automation and web solutions for small businesses and institutions in Croatia.',
    indexH1: 'Blog',
    indexIntro: 'Practical guides on AI tools, automation and web solutions for small businesses and institutions in Croatia.',
    updated: 'Updated',
    minRead: 'min read',
    readMore: 'Read the article',
    toc: 'Contents',
    faq: 'Common questions',
    related: 'Related articles',
    back: 'All articles',
    ctaTitle: 'Want this in your business?',
    ctaText: 'Describe briefly what you need and you will get a written proposal with price and deadline. The first call is free.',
    ctaBtn: 'Send an enquiry',
    advisorBtn: 'Start the advisor',
    titleKey: 'title_en',
    excerptKey: 'excerpt_en',
    metaTitleKey: 'meta_title_en',
    metaDescKey: 'meta_description_en',
    contentKey: 'content_html_en',
    faqKey: 'faq_en',
    redirectTitle: `Article | ${BRAND}`,
  },
};

/* ---------- zajednički dijelovi stranice ---------- */

function head(t, { title, description, canonical, hrUrl, enUrl, type = 'website', extra = '', robots = 'index,follow', css = '/blog/blog.css' }) {
  const alternates = [
    hrUrl ? `    <link rel="alternate" hreflang="hr" href="${hrUrl}">` : '',
    enUrl ? `    <link rel="alternate" hreflang="en" href="${enUrl}">` : '',
  ].filter(Boolean).join('\n');
  return `<!DOCTYPE html>
<html lang="${t.lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}">
    <meta name="robots" content="${robots}">
    ${canonical ? `<link rel="canonical" href="${canonical}">` : ''}
${alternates}
    <meta name="theme-color" content="#ECEFEA">
    <meta property="og:type" content="${type}">
    <meta property="og:site_name" content="${BRAND}">
    <meta property="og:locale" content="${t.ogLocale}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(description)}">
    ${canonical ? `<meta property="og:url" content="${canonical}">` : ''}
    <meta property="og:image" content="${SITE}/assets/og.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(title)}">
    <meta name="twitter:description" content="${esc(description)}">
    <meta name="twitter:image" content="${SITE}/assets/og.png">
${ICON_LINKS}
    <link rel="preload" href="/assets/fonts/bricolage-grotesque-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/assets/fonts/public-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="/assets/fonts/fonts.css">
    <link rel="stylesheet" href="/chat-widget.css">
    <link rel="stylesheet" href="/home.css">
${[].concat(css).map((href) => `    <link rel="stylesheet" href="${href}">`).join('\n')}
${extra}</head>`;
}

function header(t, otherLangUrl, current = t.blog) {
  const navLinks = t.nav
    .map(([href, label]) => `<a href="${href}"${href === current ? ' aria-current="page"' : ''}>${label}</a>`)
    .join('\n                    ');
  const switcher = t.lang === 'hr'
    ? `<span aria-current="page">HR</span><span aria-hidden="true">/</span><a href="${otherLangUrl}" hreflang="en" lang="en">EN</a>`
    : `<a href="${otherLangUrl}" hreflang="hr" lang="hr">HR</a><span aria-hidden="true">/</span><span aria-current="page">EN</span>`;
  return `
<body>
    <a class="skip-link" href="#main">${t.skip}</a>
    <header class="site-header">
        <div class="wrap">
            <a href="${t.home}" class="logo" aria-label="${t.homeAria}">Mang<span>AI</span></a>
            <button type="button" class="nav-toggle" aria-label="${t.menu}" aria-expanded="false" aria-controls="nav-menu">
                <span class="nav-toggle-icon"></span>
            </button>
            <div class="nav-menu-panel" id="nav-menu">
                <nav class="nav" aria-label="${t.navAria}">
                    ${navLinks}
                    <span class="lang-switcher">${switcher}</span>
                </nav>
                <a href="${t.contact}" class="btn btn-primary nav-cta">${t.cta}</a>
            </div>
        </div>
    </header>
    <div class="nav-menu-backdrop" id="nav-menu-backdrop" aria-hidden="true"></div>
`;
}

function footer(t, otherLangUrl, scripts = '') {
  const links = t.footerLinks
    .map(([href, label]) => `<li><a href="${href}">${label}</a></li>`)
    .join('\n                        ');
  const otherLang = t.lang === 'hr' ? 'en' : 'hr';
  const servicesCol = t.footerServices
    ? `
                <div>
                    <h2><a href="/usluge/">${t.servicesTitle}</a></h2>
                    <ul>
                        ${t.footerServices.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join('\n                        ')}
                    </ul>
                </div>`
    : '';
  return `
    <footer class="site-footer">
        <div class="wrap">
            <div class="footer-grid${t.footerServices ? ' footer-grid-4' : ''}">
                <div>
                    <a href="${t.home}" class="logo">Mang<span>AI</span></a>
                    <p class="footer-tag">${t.tagline}</p>
                </div>
                <div>
                    <h2>${t.bizTitle}</h2>
                    <address>
                        MANGAI, obrt za računalno programiranje i savjetovanje, vl. Marko Škorić<br>
                        Vukovarska 5, 20340 Ploče${t.country}<br>
                        <a href="tel:+385923557476">+385 92 355 7476</a><br>
                        <a href="mailto:marko@mangai.hr">marko@mangai.hr</a>
                    </address>
                </div>
${servicesCol}
                <div>
                    <h2>${t.pagesTitle}</h2>
                    <ul>
                        ${links}
                        <li><a href="${otherLangUrl}" hreflang="${otherLang}" lang="${otherLang}">${t.otherLangLabel}</a></li>
                    </ul>
                </div>
            </div>
            <p class="footer-bottom">&copy; <span id="year">${new Date().getFullYear()}</span> ${BRAND}</p>
        </div>
    </footer>

    <div id="mangai-chat-root"></div>
    <script>document.getElementById('year').textContent = new Date().getFullYear();</script>
    <script src="/nav.js"></script>
${scripts}    <script src="/chat-widget.js" defer></script>
</body>
</html>
`;
}

/* ---------- popis članaka ---------- */

function indexPage(t, posts, otherLangUrl) {
  const sorted = posts.slice().sort(byDateDesc);
  const canonical = SITE + t.blog;
  const cards = sorted
    .map((p) => {
      const url = `${p.slug}.html`;
      return `                <li class="blog-card">
                    <p class="blog-card-meta">${t.updated} ${esc(formatDate(p.date, t.lang))} <span aria-hidden="true">–</span> ${esc(p.reading_time_minutes || 5)} ${t.minRead}</p>
                    <h2 class="blog-card-title"><a href="${url}">${esc(fixBrand(p[t.titleKey] || p.slug))}</a></h2>
                    <p class="blog-card-excerpt">${esc(fixBrand(p[t.excerptKey] || ''))}</p>
                    <a href="${url}" class="blog-card-link" aria-hidden="true" tabindex="-1">${t.readMore}</a>
                </li>`;
    })
    .join('\n');
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: t.indexTitle,
    description: t.indexDesc,
    url: canonical,
    inLanguage: t.lang,
    publisher: { '@id': `${SITE}/#obrt` },
    blogPost: sorted.map((p) => ({
      '@type': 'BlogPosting',
      headline: fixBrand(p[t.titleKey] || p.slug),
      url: `${canonical}${p.slug}.html`,
      datePublished: p.date,
    })),
  };
  return (
    head(t, {
      title: t.indexTitle,
      description: t.indexDesc,
      canonical,
      hrUrl: `${SITE}/blog/`,
      enUrl: `${SITE}/en/blog/`,
      extra: `    <script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n    </script>\n`,
    }) +
    header(t, otherLangUrl) +
    `
    <main id="main" class="blog-index">
        <div class="wrap">
            <div class="section-head">
                <h1>${t.indexH1}</h1>
                <p>${t.indexIntro}</p>
            </div>
            <ol class="blog-list" reversed>
${cards}
            </ol>
        </div>
    </main>
` +
    footer(t, otherLangUrl)
  );
}

/* ---------- pojedini članak ---------- */

function postPage(t, post, posts, otherLangUrl) {
  const canonical = `${SITE}${t.blog}${post.slug}.html`;
  const title = fixBrand(post[t.titleKey] || post.slug);
  const metaTitle = fixBrand(post[t.metaTitleKey] || title) + ` | ${BRAND}`;
  const description = truncate(fixBrand(post[t.metaDescKey] || post[t.excerptKey] || ''));
  const content = fixBrand(fixInternalLinks(post[t.contentKey] || ''));
  const dateStr = formatDate(post.date, t.lang);
  const faq = Array.isArray(post[t.faqKey]) ? post[t.faqKey] : [];
  const related = posts
    .filter((p) => p.slug !== post.slug)
    .sort(byDateDesc)
    .slice(0, 3);

  const faqHtml = faq.length
    ? `
                    <section class="post-faq" aria-labelledby="post-faq-title">
                        <h2 id="post-faq-title">${t.faq}</h2>
                        ${faq.map((f) => `<details><summary>${esc(fixBrand(f.q))}</summary><p>${esc(fixBrand(f.a))}</p></details>`).join('\n                        ')}
                    </section>`
    : '';

  const relatedHtml = related.length
    ? `
            <section class="post-related" aria-labelledby="post-related-title">
                <h2 id="post-related-title">${t.related}</h2>
                <ul>
                    ${related.map((r) => `<li><a href="${r.slug}.html">${esc(fixBrand(r[t.titleKey] || r.slug))}</a></li>`).join('\n                    ')}
                </ul>
                <p><a href="${t.blog}">${t.back}</a></p>
            </section>`
    : '';

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description,
      datePublished: post.date,
      dateModified: post.date,
      inLanguage: t.lang,
      mainEntityOfPage: canonical,
      image: `${SITE}/assets/og.png`,
      author: { '@type': 'Person', name: 'Marko Škorić', url: SITE + t.home },
      publisher: { '@id': `${SITE}/#obrt` },
      keywords: Array.isArray(post.keywords) ? post.keywords.join(', ') : post.keywords || undefined,
    },
  ];
  schemas.push(breadcrumbSchema([[t.home, t.homeLabel], [t.blog, 'Blog'], [null, title]], canonical));
  if (faq.length) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({
        '@type': 'Question',
        name: fixBrand(f.q),
        acceptedAnswer: { '@type': 'Answer', text: fixBrand(f.a) },
      })),
    });
  }
  const extra = schemas
    .map((s) => `    <script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n    </script>\n`)
    .join('');

  return (
    head(t, {
      title: metaTitle,
      description,
      canonical,
      hrUrl: t.lang === 'hr' ? canonical : otherLangUrl.startsWith(SITE + '/blog/') ? otherLangUrl : null,
      enUrl: t.lang === 'en' ? canonical : otherLangUrl.startsWith(SITE + '/en/blog/') ? otherLangUrl : null,
      type: 'article',
      extra,
    }) +
    header(t, otherLangUrl) +
    `
    <main id="main" class="post">
        <div class="wrap">
            <p class="post-breadcrumb"><a href="${t.blog}">Blog</a></p>
            <header class="post-header">
                <h1>${esc(title)}</h1>
                <p class="post-meta">${t.updated} ${esc(dateStr)} <span aria-hidden="true">–</span> ${esc(post.reading_time_minutes || 5)} ${t.minRead}</p>
            </header>
            <div class="post-layout">
                <aside id="post-toc" class="post-toc" data-post-toc aria-label="${t.toc}">
                    <button type="button" id="toc-toggle" class="post-toc-toggle" aria-expanded="false" aria-controls="post-toc-list">${t.toc}</button>
                    <p class="post-toc-title">${t.toc}</p>
                    <nav id="post-toc-list" class="post-toc-list" hidden></nav>
                </aside>
                <article class="post-body">
                    <div id="post-content" class="prose" data-post-content>${content}</div>${faqHtml}
                    <section class="post-cta">
                        <h2>${t.ctaTitle}</h2>
                        <p>${t.ctaText}</p>
                        <div class="post-cta-actions">
                            <a href="${t.contact}" class="btn btn-primary">${t.ctaBtn}</a>
                            <button type="button" class="btn btn-ghost" data-open-chat="1">${t.advisorBtn}</button>
                        </div>
                    </section>
                </article>
            </div>${relatedHtml}
        </div>
    </main>
` +
    footer(t, otherLangUrl, '    <script src="/blog/blog-toc.js"></script>\n')
  );
}

/* ---------- zasebne stranice (usluge, javni sektor, primjeri, o meni, kontakt) ---------- */

function pagePage(t, page) {
  const canonical = SITE + page.path;
  const crumbsHtml = page.crumbs
    .map(([href, name]) => (href ? `<a href="${href}">${esc(name)}</a>` : `<span aria-current="page">${esc(name)}</span>`))
    .join('<span class="crumb-sep" aria-hidden="true">/</span>');
  const faqHtml = page.faq.length
    ? `
        <section class="section" aria-labelledby="faq-title">
            <div class="wrap">
                <div class="section-head">
                    <h2 id="faq-title">${t.faq}</h2>
                </div>
                <div class="faq">
                    ${page.faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('\n                    ')}
                </div>
            </div>
        </section>`
    : '';
  const ctaHtml = page.cta
    ? `
        <section class="section page-cta-band">
            <div class="wrap">
                <div class="post-cta page-cta">
                    <h2>${t.ctaTitle}</h2>
                    <p>${t.ctaText}</p>
                    <div class="post-cta-actions">
                        <a href="${t.contact}" class="btn btn-primary">${t.ctaBtn}</a>
                        <a href="tel:+385923557476" class="btn btn-ghost">Nazovi 092 355 7476</a>
                    </div>
                </div>
            </div>
        </section>`
    : '';
  const heroActions = page.heroActions
    ? `
                <div class="hero-actions">
                    <a href="${t.contact}" class="btn btn-primary">${t.cta}</a>
                    <a href="tel:+385923557476" class="btn btn-ghost">Nazovi 092 355 7476</a>
                </div>`
    : '';

  const schemas = [...page.schema, breadcrumbSchema(page.crumbs, canonical)];
  if (page.faq.length) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    });
  }

  return (
    head(t, {
      title: `${page.metaTitle} | ${BRAND}`,
      description: page.description,
      canonical,
      hrUrl: canonical,
      css: ['/blog/blog.css', '/pages.css'],
      extra: schemas.map(jsonLd).join(''),
    }) +
    header(t, '/en/', page.nav) +
    `
    <main id="main" class="page">
        <section class="page-hero">
            <div class="wrap">
                <nav class="crumbs" aria-label="Putanja">${crumbsHtml}</nav>
                <h1>${esc(page.h1)}</h1>
                <p class="page-lead">${esc(page.lead)}</p>${heroActions}
            </div>
        </section>
${page.body}
${faqHtml}
${ctaHtml}
    </main>
` +
    footer(t, '/en/', page.scripts)
  );
}

/* ---------- stari linkovi post.html?slug=… ---------- */

function legacyPage(t) {
  return (
    head(t, {
      title: t.redirectTitle,
      description: t.indexDesc,
      canonical: SITE + t.blog,
      robots: 'noindex,follow',
      extra: `    <script>(function(){var s=new URLSearchParams(location.search).get('slug');location.replace(s&&/^[a-z0-9-]+$/.test(s)?'${t.blog}'+s+'.html':'${t.blog}');}());</script>\n`,
    }) +
    header(t, t.lang === 'hr' ? '/en/blog/' : '/blog/') +
    `
    <main id="main" class="blog-index">
        <div class="wrap">
            <p><a href="${t.blog}">${t.back}</a></p>
        </div>
    </main>
` +
    footer(t, t.lang === 'hr' ? '/en/blog/' : '/blog/')
  );
}

/* ---------- main ---------- */

function write(file, html) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html, 'utf8');
  console.log('Generated:', path.relative(ROOT, file));
}

function main() {
  const hr = readPosts(path.join(ROOT, 'blog', 'posts.json'));
  const en = readPosts(path.join(ROOT, 'en', 'blog', 'posts.json'));
  const enSlugs = new Set(en.map((p) => p.slug));
  const hrSlugs = new Set(hr.map((p) => p.slug));

  write(path.join(ROOT, 'blog', 'index.html'), indexPage(L.hr, hr, '/en/blog/'));
  write(path.join(ROOT, 'en', 'blog', 'index.html'), indexPage(L.en, en, '/blog/'));
  write(path.join(ROOT, 'blog', 'post.html'), legacyPage(L.hr));
  write(path.join(ROOT, 'en', 'blog', 'post.html'), legacyPage(L.en));

  for (const p of hr) {
    if (!p.slug) continue;
    const other = enSlugs.has(p.slug) ? `${SITE}/en/blog/${p.slug}.html` : '/en/blog/';
    write(path.join(ROOT, 'blog', `${p.slug}.html`), postPage(L.hr, p, hr, other));
  }
  for (const p of en) {
    if (!p.slug) continue;
    const other = hrSlugs.has(p.slug) ? `${SITE}/blog/${p.slug}.html` : '/blog/';
    write(path.join(ROOT, 'en', 'blog', `${p.slug}.html`), postPage(L.en, p, en, other));
  }

  for (const page of PAGES_HR) {
    write(path.join(ROOT, ...page.path.split('/').filter(Boolean), 'index.html'), pagePage(L.hr, page));
  }

  // paketi na početnoj: blok između oznaka <!-- paketi:start --> i <!-- paketi:end --> u index.html
  const homeFile = path.join(ROOT, 'index.html');
  const home = fs.readFileSync(homeFile, 'utf8');
  const marked = /(<!-- paketi:start -->)[\s\S]*?(<!-- paketi:end -->)/;
  if (marked.test(home)) {
    fs.writeFileSync(homeFile, home.replace(marked, `$1\n                ${pricingCards('h3')}\n                $2`), 'utf8');
    console.log('Updated: index.html (paketi)');
  }

  // sitemap.xml
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: '/', lastmod: today, changefreq: 'weekly', priority: '1.0' },
    ...PAGES_HR.map((p) => ({ loc: p.path, lastmod: p.lastmod, changefreq: 'monthly', priority: p.path.split('/').filter(Boolean).length > 1 ? '0.8' : '0.9' })),
    { loc: '/blog/', lastmod: today, changefreq: 'weekly', priority: '0.8' },
    ...hr.map((p) => ({ loc: `/blog/${p.slug}.html`, lastmod: (p.date || today).slice(0, 10), changefreq: 'monthly', priority: '0.7' })),
    { loc: '/en/', lastmod: today, changefreq: 'weekly', priority: '0.9' },
    { loc: '/en/blog/', lastmod: today, changefreq: 'weekly', priority: '0.6' },
    ...en.map((p) => ({ loc: `/en/blog/${p.slug}.html`, lastmod: (p.date || today).slice(0, 10), changefreq: 'monthly', priority: '0.5' })),
    ...['uvjeti-poslovanja.html', 'en/terms-of-business.html', 'privacy_hr.html', 'terms_hr.html', 'privacy.html', 'terms.html'].map((f) => ({ loc: `/${f}`, lastmod: today, changefreq: 'yearly', priority: '0.2' })),
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${SITE}${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
  write(path.join(ROOT, 'sitemap.xml'), sitemap);
  console.log('Gotovo. Nakon izmjene posts.json pokreni ponovno.');
}

main();
