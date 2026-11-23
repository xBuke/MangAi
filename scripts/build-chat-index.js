#!/usr/bin/env node
/**
 * Gradi indeks sadržaja stranice za MangAI savjetnika (chatbot).
 *
 * Pokretanje (iz korijena projekta, bez npm install):
 *   node scripts/build-chat-index.js
 *
 * Čita javne HTML stranice (početna, usluge, javni sektor, o meni, kontakt,
 * primjeri, blog, uvjeti, privatnost), izvlači tekst iz <main>, dijeli ga po
 * naslovima na odlomke i sprema u:
 *   chat/site-index.hr.json
 *   chat/site-index.en.json
 *
 * /api/chat iz tih datoteka bira odlomke relevantne za pitanje i šalje ih modelu.
 * Pokreće se automatski i na kraju scripts/generate-blog.js.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'chat');
const MAX_CHUNK = 1400;
const MIN_CHUNK = 200;

/* Stranice koje savjetnik smije koristiti. Ogledni projekti (ogledno/, demo/) namjerno nisu tu. */
const SOURCES = {
  hr: [
    'index.html',
    'usluge/index.html',
    'usluge/izrada-web-stranica/index.html',
    'usluge/ai-chatbot/index.html',
    'usluge/ai-automatizacija/index.html',
    'usluge/aplikacije-po-mjeri/index.html',
    'usluge/odrzavanje/index.html',
    'javni-sektor/index.html',
    'o-meni/index.html',
    'kontakt/index.html',
    'primjeri/index.html',
    'uvjeti-poslovanja.html',
    'privacy_hr.html',
    'blog/*.html'
  ],
  en: [
    'en/index.html',
    'en/terms-of-business.html',
    'privacy.html',
    'en/blog/*.html'
  ]
};

const SKIP_FILES = new Set(['index.html', 'post.html']); // unutar blog/ mapa: popis članaka i stari preusmjerivač

function expand(pattern) {
  if (!pattern.endsWith('/*.html')) {
    return fs.existsSync(path.join(ROOT, pattern)) ? [pattern] : [];
  }
  const dir = pattern.slice(0, -'/*.html'.length);
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs)
    .filter((f) => f.endsWith('.html') && !SKIP_FILES.has(f))
    .sort()
    .map((f) => dir + '/' + f);
}

function toUrl(file) {
  let p = '/' + file.replace(/\\/g, '/');
  if (p.endsWith('/index.html')) p = p.slice(0, -'index.html'.length);
  return p;
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', shy: '', ndash: '–', mdash: '—', hellip: '…', bdquo: '„', ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', laquo: '«', raquo: '»', euro: '€', middot: '·', times: '×', rarr: '→', larr: '←', copy: '©' };

function decode(s) {
  return s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') {
      const code = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    const v = ENTITIES[e.toLowerCase()];
    return v === undefined ? m : v;
  });
}

function stripBlock(html, tag) {
  const re = new RegExp('<' + tag + '\\b[^>]*>[\\s\\S]*?</' + tag + '>', 'gi');
  let prev;
  do { prev = html; html = html.replace(re, ' '); } while (html !== prev);
  return html;
}

function stripByClass(html, tag, cls) {
  const re = new RegExp('<' + tag + '\\b[^>]*class="[^"]*\\b' + cls + '\\b[^"]*"[^>]*>[\\s\\S]*?</' + tag + '>', 'gi');
  return html.replace(re, ' ');
}

function clean(text) {
  return decode(text).replace(/[ \t\r\f\v]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{2,}/g, '\n').trim();
}

function extract(html) {
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? clean(titleMatch[1].replace(/\s*[|–-]\s*MangAI\s*$/i, '')) : '';
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  const description = descMatch ? clean(descMatch[1]) : '';

  const mainMatch = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  let body = mainMatch ? mainMatch[1] : html;

  body = body.replace(/<!--[\s\S]*?-->/g, ' ');
  ['script', 'style', 'svg', 'noscript', 'template', 'form', 'nav', 'picture', 'figure'].forEach((t) => { body = stripBlock(body, t); });
  body = stripByClass(body, 'section', 'post-related');
  body = stripByClass(body, 'aside', 'post-toc');

  body = body
    .replace(/<h[1-3]\b[^>]*>([\s\S]*?)<\/h[1-3]>/gi, (m, t) => '\n\u0001' + t.replace(/<[^>]+>/g, ' ') + '\n')
    .replace(/<li\b[^>]*>/gi, '\n- ')
    .replace(/<(br|hr)\b[^>]*>/gi, '\n')
    .replace(/<\/(p|li|div|h[4-6]|tr|dt|dd|blockquote|section|article|aside|address|ul|ol|summary|details)>/gi, '\n')
    .replace(/<\/t[dh]>/gi, ' | ')
    .replace(/<[^>]+>/g, ' ');

  const lines = clean(body).split('\n');
  const sections = [];
  let current = { heading: '', lines: [] };
  lines.forEach((line) => {
    if (line.startsWith('\u0001')) {
      if (current.lines.length || current.heading) sections.push(current);
      current = { heading: clean(line.slice(1)), lines: [] };
    } else if (line && line !== '-') {
      current.lines.push(line);
    }
  });
  if (current.lines.length || current.heading) sections.push(current);

  return { title, description, sections: sections.filter((s) => s.lines.length) };
}

function chunkSections(sections) {
  const chunks = [];
  let buf = null;
  const flush = () => { if (buf && buf.text.trim()) chunks.push(buf); buf = null; };

  sections.forEach((s) => {
    let text = s.lines.join('\n');
    // predugi odlomak dijelimo po recima
    const parts = [];
    while (text.length > MAX_CHUNK) {
      let cut = text.lastIndexOf('\n', MAX_CHUNK);
      if (cut < MAX_CHUNK / 2) cut = text.lastIndexOf(' ', MAX_CHUNK);
      if (cut <= 0) cut = MAX_CHUNK;
      parts.push(text.slice(0, cut).trim());
      text = text.slice(cut).trim();
    }
    if (text) parts.push(text);

    parts.forEach((part, i) => {
      const heading = s.heading + (i > 0 ? ' (nastavak)' : '');
      if (buf && buf.text.length < MIN_CHUNK && buf.text.length + part.length < MAX_CHUNK) {
        buf.heading = buf.heading ? buf.heading + ' / ' + heading : heading;
        buf.text += '\n' + part;
        return;
      }
      flush();
      buf = { heading, text: part };
    });
  });
  flush();
  return chunks;
}

function build(lang) {
  const files = [];
  SOURCES[lang].forEach((p) => expand(p).forEach((f) => { if (!files.includes(f)) files.push(f); }));

  const pages = [];
  const chunks = [];
  files.forEach((file) => {
    const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
    if (/<meta\s+http-equiv="refresh"/i.test(html)) return; // preusmjerivači
    const { title, description, sections } = extract(html);
    const url = toUrl(file);
    pages.push({ url, title, description });
    chunkSections(sections).forEach((c) => {
      chunks.push({ url, title, heading: c.heading, text: c.text });
    });
  });

  const out = { lang, generated: new Date().toISOString(), pages, chunks };
  const outFile = path.join(OUT_DIR, 'site-index.' + lang + '.json');
  fs.writeFileSync(outFile, JSON.stringify(out) + '\n');
  const chars = chunks.reduce((n, c) => n + c.text.length, 0);
  console.log('chat/site-index.' + lang + '.json: ' + pages.length + ' stranica, ' + chunks.length + ' odlomaka, ' + Math.round(chars / 1000) + 'k znakova');
}

if (require.main === module) {
  build('hr');
  build('en');
}

module.exports = { build };
