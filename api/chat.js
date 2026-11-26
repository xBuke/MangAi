/**
 * MangAI savjetnik – odgovara na pitanja posjetitelja iz sadržaja mangai.hr.
 *
 * POST /api/chat
 *   { "messages": [{ "role": "user"|"assistant", "content": "..." }], "lang": "hr"|"en", "page": "/usluge/" }
 * → { "reply": "...", "contact": true|false, "sources": [{ "url", "title" }] }
 *
 * Sadržaj: chat/site-index.{hr,en}.json (gradi ga scripts/build-chat-index.js).
 *
 * Pristup Claude API-ju ide bez statičnog API ključa, preko Workload Identity Federation:
 * Vercel funkciji daje OIDC token (zaglavlje x-vercel-oidc-token), on se kod Vercela zamijeni
 * za token s audienceom https://api.anthropic.com, a taj kod Anthropica za kratkotrajni pristupni
 * token servisnog računa mangai-web-chat (Claude Console → Settings → Workload identity).
 *
 * Varijable okruženja na Vercelu:
 *   ANTHROPIC_FEDERATION_RULE_ID, ANTHROPIC_ORGANIZATION_ID,
 *   ANTHROPIC_SERVICE_ACCOUNT_ID, ANTHROPIC_WORKSPACE_ID   (WIF, obavezno)
 *   ANTHROPIC_API_KEY  (nije obavezno; ako postoji, koristi se umjesto WIF-a, npr. za lokalno testiranje)
 *   CHAT_MODEL         (nije obavezno, zadano claude-haiku-5-5)
 */

const INDEX = {
  hr: require('../chat/site-index.hr.json'),
  en: require('../chat/site-index.en.json')
};

const MODEL = process.env.CHAT_MODEL || 'claude-haiku-5-5';
const MAX_TOKENS = 900;
const CONTEXT_BUDGET = 10000; // znakova sadržaja stranice po pitanju
const MAX_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 1000;
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 25 };
const CONTACT_MARKER = '[[KONTAKT]]';
const TOPICS = ['web_stranica', 'ai_chatbot', 'automatizacija', 'aplikacija', 'odrzavanje', 'javna_nabava', 'pristupacnost', 'cijena', 'rok_i_suradnja', 'o_mangaiju', 'kontakt', 'nevezano', 'ostalo'];
const TOPIC_TAG_HINT = '[[TEMA:naziv]]';
const TOPIC_RE = /\[\[TEMA:\s*([a-z_]+)\s*\]\]/i;

const ALLOWED_ORIGINS = [/^https:\/\/(www\.)?mangai\.hr$/, /^https:\/\/[a-z0-9-]+\.vercel\.app$/, /^http:\/\/localhost(:\d+)?$/];

/* ---------- pretraga ---------- */

const STOP = new Set((
  'i a u na za je su se da li ili od do po o s sa iz kod ne ni to taj ta te ti mi vi on ona ono oni koji koja koje kojeg što sto kako kad kada gdje zašto zasto ' +
  'li bi biti bio sam si smo ste će ce mogu može moze imate imam ima jel jeli dali mi me vam vas nam nas moj moja vaš vas vaša vasa ' +
  'the and or of to in on for is are be do does can you your we our it this that what how when where why which with from an'
).split(' '));

function norm(s) {
  return String(s || '').toLowerCase()
    .replace(/č|ć/g, 'c').replace(/š/g, 's').replace(/ž/g, 'z').replace(/đ/g, 'd')
    .normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/* Gruba "stemizacija" za hrvatski: prvih 5 znakova riječi pokriva većinu padeža. */
function tokens(s) {
  return norm(s).split(/[^a-z0-9]+/).filter((w) => w.length > 1 && !STOP.has(w)).map((w) => (w.length > 5 ? w.slice(0, 5) : w));
}

function prepare(index) {
  const docs = index.chunks.map((c) => {
    const body = tokens(c.text);
    const head = tokens(c.title + ' ' + c.heading);
    const tf = new Map();
    body.forEach((t) => tf.set(t, (tf.get(t) || 0) + 1));
    head.forEach((t) => tf.set(t, (tf.get(t) || 0) + 3)); // naslov vrijedi više
    return { chunk: c, tf, len: body.length + head.length * 3 };
  });
  const df = new Map();
  docs.forEach((d) => d.tf.forEach((_, t) => df.set(t, (df.get(t) || 0) + 1)));
  const avg = docs.reduce((n, d) => n + d.len, 0) / Math.max(docs.length, 1);
  return { docs, df, avg, n: docs.length, pages: index.pages };
}

const PREPARED = { hr: prepare(INDEX.hr), en: prepare(INDEX.en) };

function search(prep, query, pageUrl) {
  const q = Array.from(new Set(tokens(query)));
  const k1 = 1.4;
  const b = 0.7;
  return prep.docs.map((d) => {
    let score = 0;
    q.forEach((t) => {
      const f = d.tf.get(t);
      if (!f) return;
      const idf = Math.log(1 + (prep.n - prep.df.get(t) + 0.5) / (prep.df.get(t) + 0.5));
      score += idf * (f * (k1 + 1)) / (f + k1 * (1 - b + b * d.len / prep.avg));
    });
    if (score > 0 && pageUrl && d.chunk.url === pageUrl) score *= 1.25; // stranica na kojoj je posjetitelj
    if (score > 0 && !/^\/blog\//.test(d.chunk.url) && !/^\/en\/blog\//.test(d.chunk.url)) score *= 1.15; // glavne stranice prije članaka
    return { score, chunk: d.chunk };
  }).filter((r) => r.score > 0).sort((a, b2) => b2.score - a.score);
}

function pickContext(lang, query, pageUrl) {
  let results = search(PREPARED[lang], query, pageUrl);
  if (lang === 'en') {
    // engleska verzija stranice je kraća; dopuni hrvatskim sadržajem
    results = results.concat(search(PREPARED.hr, query, null).map((r) => ({ score: r.score * 0.8, chunk: r.chunk })))
      .sort((a, b2) => b2.score - a.score);
  }
  const picked = [];
  let used = 0;
  const perPage = {};
  for (const r of results) {
    const len = r.chunk.text.length;
    if (used + len > CONTEXT_BUDGET) continue;
    if ((perPage[r.chunk.url] || 0) >= 4) continue;
    picked.push(r.chunk);
    perPage[r.chunk.url] = (perPage[r.chunk.url] || 0) + 1;
    used += len;
    if (used > CONTEXT_BUDGET * 0.9) break;
  }
  return picked;
}

/* ---------- upute modelu ---------- */

function systemPrompt(lang, chunks) {
  const pages = PREPARED.hr.pages.concat(lang === 'en' ? PREPARED.en.pages : [])
    .map((p) => '- ' + p.title + ': ' + p.url).join('\n');
  const context = chunks.length
    ? chunks.map((c, i) => '[' + (i + 1) + '] ' + c.title + (c.heading ? ' – ' + c.heading : '') + ' (' + c.url + ')\n' + c.text).join('\n\n')
    : '(Za ovo pitanje nije pronađen odgovarajući sadržaj.)';

  return [
    'Ti si MangAI savjetnik, asistent na web stranici mangai.hr. Odgovaraš posjetiteljima na pitanja o MangAI-ju i temama sa stranice.',
    '',
    'O MangAI-ju (uvijek vrijedi):',
    '- MangAI je obrt za računalno programiranje i savjetovanje, vl. Marko Škorić. Svaki projekt vodi i izrađuje Marko osobno, bez posrednika.',
    '- Usluge: izrada web stranica i webshopova, AI chatbotovi i asistenti (web, WhatsApp), AI automatizacija poslovnih procesa, aplikacije po mjeri, održavanje i hosting, pristupačne stranice i e-usluge za javni sektor (WCAG 2.1 AA, EOJN RH, e-račun).',
    '- Radi na daljinu za cijelu Hrvatsku; na sastanke dolazi po dogovoru.',
    '- Reference (izrađene stranice, pogledati na /primjeri/#izradene-stranice): Vina Govorko (obiteljska vinarija iz Metkovića, vinagovorko.hr, hrvatski i engleski, upit i WhatsApp za degustacije); Vinarija Điko (butik vinarija OPG-a Kalajžić iz Dusine kraj Vrgorca, hrvatski i engleski, vina, nagrade i posjeti); Orguljarstvo Kvaternik (orguljar Alen Kvaternik, Draganovec kraj Koprivnice, interaktivne animirane svirale, galerija i blog); Light a Nation (lightanation.com, interaktivna stranica na engleskom sa svjetskom kartom; MangAI je sudjelovao u dizajnu i izradi stranice).',
    '- Kontakt: marko@mangai.hr, 092 355 7476, obrazac na /kontakt/. Javni naručitelji pozive na dostavu ponude šalju na marko@mangai.hr.',
    '',
    'Pravila:',
    '1. Odgovaraj samo na temelju podataka iznad i SADRŽAJA STRANICE ispod. Ne izmišljaj usluge, reference, klijente, rokove ni tehničke pojedinosti kojih tamo nema.',
    '2. Nikad ne navodi cijenu ni iznos za MangAI-jeve usluge. Na pitanje o cijeni objasni od čega ovisi (prema sadržaju) i da Marko nakon kratkog opisa šalje pisanu ponudu s opsegom, rokom i fiksnim iznosom. Opće iznose iz članaka (npr. pragove javne nabave ili tržišne raspone pretplata za alate) smiješ navesti kao opću informaciju.',
    '3. Ne spominji ogledne projekte, demo stranice ni potencijalne klijente po imenu. Jedini izuzetak su četiri izrađena projekta s popisa referenci iznad (Vina Govorko, Vinarija Điko, Orguljarstvo Kvaternik, Light a Nation): spomeni ih kad posjetitelj pita za reference, primjere ili prethodni rad, ili traži sličan posao (vinarija ili OPG, obrtnik ili radionica, interaktivni web projekt), a ne u svakom odgovoru. Uz njih smiješ dati samo poveznicu [Primjeri](/primjeri/#izradene-stranice).',
    '4. Ako sadržaj ne odgovara na pitanje, reci to iskreno u jednoj rečenici i predloži da pitanje pošalju Marku. Na pitanja koja nemaju veze s MangAI-jem, web stranicama, AI-jem, automatizacijom ili javnom nabavom ljubazno odgovori da u tome ne možeš pomoći.',
    '5. Piši kratko i jasno: najviše oko 90 riječi (2 do 4 rečenice ili kratak popis s crticama), osim ako posjetitelj izričito traži više detalja. Bez naslova i bez tablica. Smiješ koristiti **podebljano**. Uvijek dovrši posljednju rečenicu.',
    '6. Kad je korisno, uputi na stranicu za više detalja poveznicom u obliku [naziv](/putanja/). Koristi samo putanje s popisa stranica ispod, najviše dvije poveznice po odgovoru.',
    '7. Ton: stručan, smiren i izravan, bez pretjerivanja i bez prodajnih fraza. Ne nudi ponudu u svakom odgovoru. Ti si savjetnik, ne Marko: o MangAI-ju i Marku govori u trećem licu ("MangAI izrađuje…", "Marko šalje ponudu…"), nikad "radimo" ili "radim". Posjetitelju se obraćaj s "vi".',
    '8. Ako posjetitelj želi ponudu, suradnju, razgovor ili da ga Marko kontaktira, ili opisuje konkretan projekt, odgovori kratko i na kraju odgovora dodaj zaseban redak: ' + CONTACT_MARKER + ' (to prikazuje obrazac za kontakt). Inače ga ne dodaji.',
    '9. Na samom kraju svakog odgovora dodaj zaseban redak ' + TOPIC_TAG_HINT + ' s jednom temom pitanja s popisa: ' + TOPICS.join(', ') + '. Posjetitelj taj redak ne vidi.',
    lang === 'en'
      ? '10. The visitor is using the English version of the site: answer in English, even though most of the content below is in Croatian.'
      : '10. Odgovaraj na hrvatskom standardnom jeziku. Ako posjetitelj piše na drugom jeziku, odgovori na njegovom jeziku.',
    '',
    'POPIS STRANICA:',
    pages,
    '',
    'SADRŽAJ STRANICE (odlomci najrelevantniji za razgovor):',
    context
  ].join('\n');
}

/* ---------- zaštita ---------- */

const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT.windowMs);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > RATE_LIMIT.max;
}

function cleanMessages(raw) {
  if (!Array.isArray(raw)) return null;
  const msgs = raw
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, MAX_MESSAGE_CHARS) }))
    .slice(-MAX_MESSAGES);
  while (msgs.length && msgs[0].role !== 'user') msgs.shift();
  // spoji uzastopne poruke iste uloge
  const out = [];
  msgs.forEach((m) => {
    const last = out[out.length - 1];
    if (last && last.role === m.role) last.content += '\n' + m.content;
    else out.push(m);
  });
  if (!out.length || out[out.length - 1].role !== 'user') return null;
  return out;
}

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body);
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (raw.length > 30000) throw new Error('too large');
  return raw ? JSON.parse(raw) : {};
}

/* ---------- pristup Claude API-ju (Workload Identity Federation) ---------- */

const API = 'https://api.anthropic.com';
const API_VERSION = '2026-10-21';
const WIF = {
  ruleId: process.env.ANTHROPIC_FEDERATION_RULE_ID,
  orgId: process.env.ANTHROPIC_ORGANIZATION_ID,
  serviceAccountId: process.env.ANTHROPIC_SERVICE_ACCOUNT_ID,
  workspaceId: process.env.ANTHROPIC_WORKSPACE_ID
};

let cachedAccess = null; // { token, expiresAt }
let pendingAccess = null;

function wifConfigured() {
  return Boolean(WIF.ruleId && WIF.orgId && WIF.serviceAccountId);
}

/* Vercelov OIDC token ima audience https://vercel.com/<tim>; Anthropic traži https://api.anthropic.com. */
async function vercelTokenForAnthropic(req) {
  const base = req.headers['x-vercel-oidc-token'] || process.env.VERCEL_OIDC_TOKEN;
  if (!base) throw new Error('nema Vercel OIDC tokena');
  const r = await fetch('https://oidc.vercel.com/~token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ token: base, aud: API })
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || typeof data.token !== 'string') {
    throw new Error('Vercel razmjena tokena: ' + r.status + ' ' + (data.error || ''));
  }
  return data.token;
}

async function exchangeForAccessToken(req) {
  const assertion = await vercelTokenForAnthropic(req);
  const body = {
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
    federation_rule_id: WIF.ruleId,
    organization_id: WIF.orgId,
    service_account_id: WIF.serviceAccountId
  };
  if (WIF.workspaceId) body.workspace_id = WIF.workspaceId;
  const r = await fetch(API + '/v1/oauth/token', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || typeof data.access_token !== 'string') {
    throw new Error('Anthropic razmjena tokena: ' + r.status + ' ' + JSON.stringify(data.error || data.error_description || ''));
  }
  const lifetime = Number(data.expires_in) > 0 ? Number(data.expires_in) : 300;
  return { token: data.access_token, expiresAt: Date.now() + lifetime * 1000 };
}

async function authHeaders(req) {
  if (process.env.ANTHROPIC_API_KEY) return { 'x-api-key': process.env.ANTHROPIC_API_KEY };
  if (!cachedAccess || cachedAccess.expiresAt - Date.now() < 60 * 1000) {
    if (!pendingAccess) {
      pendingAccess = exchangeForAccessToken(req)
        .then((t) => { cachedAccess = t; return t; })
        .finally(() => { pendingAccess = null; });
    }
    await pendingAccess;
  }
  return { authorization: 'Bearer ' + cachedAccess.token };
}

/* ---------- zapis upita (Supabase, tablica web_chat_upiti) ---------- */

const LOG = {
  url: process.env.CHATLOG_SUPABASE_URL,
  key: process.env.CHATLOG_SUPABASE_KEY,
  token: process.env.CHATLOG_TOKEN
};

/* Posjetitelji ponekad upišu kontakt u pitanje; to ne spremamo. */
function redact(text) {
  return String(text || '')
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '[e-pošta]')
    .replace(/(?:\+|00)?\d[\d\s\/-]{6,}\d/g, '[broj]');
}

async function logUpit(row) {
  if (!LOG.url || !LOG.key || !LOG.token) return;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2500);
  try {
    const r = await fetch(LOG.url + '/rest/v1/rpc/zabiljezi_chat_upit', {
      method: 'POST',
      signal: controller.signal,
      headers: { 'content-type': 'application/json', apikey: LOG.key },
      body: JSON.stringify({
        p_token: LOG.token,
        p_vrsta: row.vrsta || 'pitanje',
        p_sesija: row.sesija || null,
        p_jezik: row.jezik || null,
        p_stranica: row.stranica || null,
        p_pitanje: row.pitanje ? redact(row.pitanje) : null,
        p_odgovor: row.odgovor || null,
        p_tema: row.tema || null,
        p_kontakt: !!row.kontakt,
        p_izvori: row.izvori || null,
        p_greska: row.greska || null,
        p_trajanje_ms: row.trajanje_ms || null
      })
    });
    if (!r.ok) console.error('Zapis upita nije uspio:', r.status, (await r.text()).slice(0, 200));
  } catch (e) {
    console.error('Zapis upita nije uspio:', e && e.message);
  } finally {
    clearTimeout(timer);
  }
}

/* Vercel zamrzne funkciju čim pošalje odgovor; waitUntil drži je živom dok se zapis ne spremi. */
function waitUntil(promise) {
  const ctx = globalThis[Symbol.for('@vercel/request-context')];
  const store = ctx && typeof ctx.get === 'function' ? ctx.get() : null;
  if (store && typeof store.waitUntil === 'function') {
    store.waitUntil(promise);
    return null;
  }
  return promise;
}

/* Pošalji odgovor, a zapis neka završi u pozadini (ili prije slanja ako pozadina nije dostupna). */
async function sendThenLog(res, status, body, row) {
  const pending = waitUntil(logUpit(row));
  if (pending) await pending;
  send(res, status, body);
}

/* ---------- handler ---------- */

module.exports = async function handler(req, res) {
  const origin = req.headers.origin || '';
  if (origin && ALLOWED_ORIGINS.some((re) => re.test(origin))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return send(res, 204, {});
  }
  if (req.method !== 'POST') return send(res, 405, { error: 'method_not_allowed' });
  if (origin && !ALLOWED_ORIGINS.some((re) => re.test(origin))) return send(res, 403, { error: 'forbidden' });

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) return send(res, 429, { error: 'rate_limited' });

  if (!process.env.ANTHROPIC_API_KEY && !wifConfigured()) return send(res, 503, { error: 'not_configured' });

  let body;
  try { body = await readBody(req); } catch (e) { return send(res, 400, { error: 'bad_request' }); }

  const lang = body.lang === 'en' ? 'en' : 'hr';
  const page = typeof body.page === 'string' ? body.page.slice(0, 200) : '';
  const sesija = typeof body.sesija === 'string' && /^[a-z0-9]{8,40}$/i.test(body.sesija) ? body.sesija : null;

  // posjetitelj je poslao obrazac za kontakt iz savjetnika
  if (body.event === 'kontakt_poslan') {
    return sendThenLog(res, 204, {}, { vrsta: 'kontakt_poslan', sesija, jezik: lang, stranica: page });
  }

  const messages = cleanMessages(body.messages);
  if (!messages) return send(res, 400, { error: 'bad_request' });
  const started = Date.now();
  const lastQuestion = messages[messages.length - 1].content;
  const fail = (status, error, greska) => sendThenLog(res, status, { error }, { sesija, jezik: lang, stranica: page, pitanje: lastQuestion, greska, trajanje_ms: Date.now() - started });

  // upit za pretragu: zadnja pitanja korisnika (kontekst nastavka razgovora)
  const userTurns = messages.filter((m) => m.role === 'user').map((m) => m.content);
  const query = userTurns.slice(-2).join(' ');
  const chunks = pickContext(lang, query, page);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  let data;
  try {
    const auth = await authHeaders(req);
    const r = await fetch(API + '/v1/messages', {
      method: 'POST',
      signal: controller.signal,
      headers: Object.assign({
        'content-type': 'application/json',
        'anthropic-version': API_VERSION
      }, auth),
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPrompt(lang, chunks),
        messages
      })
    });
    data = await r.json().catch(() => ({}));
    if (r.status === 401) cachedAccess = null; // token istekao ili opozvan: sljedeći zahtjev radi novu razmjenu
    if (!r.ok) {
      console.error('Anthropic API', r.status, data && data.error && data.error.message);
      return fail(502, 'upstream', 'api_' + r.status);
    }
  } catch (e) {
    console.error('Anthropic API poziv nije uspio:', e && e.message);
    return fail(502, 'upstream', 'poziv: ' + String(e && e.message).slice(0, 150));
  } finally {
    clearTimeout(timer);
  }

  let reply = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('').trim();
  if (data.stop_reason && data.stop_reason !== 'end_turn') {
    console.warn('Odgovor nije završen normalno:', data.stop_reason, 'blokovi:', (data.content || []).map((b) => b.type).join(','));
    if (data.stop_reason === 'max_tokens') {
      const cut = Math.max(reply.lastIndexOf('. '), reply.lastIndexOf('.\n'), reply.lastIndexOf('!'), reply.lastIndexOf('?'));
      if (cut > reply.length / 2) reply = reply.slice(0, cut + 1);
    }
  }
  const contact = reply.indexOf(CONTACT_MARKER) !== -1;
  reply = reply.split(CONTACT_MARKER).join('');
  const topicMatch = reply.match(TOPIC_RE);
  const tema = topicMatch && TOPICS.indexOf(topicMatch[1].toLowerCase()) !== -1 ? topicMatch[1].toLowerCase() : 'ostalo';
  reply = reply.replace(new RegExp(TOPIC_RE.source, 'gi'), '').trim();
  if (!reply) {
    return fail(502, 'empty', 'prazan_odgovor');
  }

  const seen = new Set();
  const sources = [];
  chunks.forEach((c) => {
    if (seen.has(c.url) || sources.length >= 3) return;
    seen.add(c.url);
    sources.push({ url: c.url, title: c.title });
  });

  return sendThenLog(res, 200, { reply, contact, sources }, {
    sesija, jezik: lang, stranica: page, pitanje: lastQuestion, odgovor: reply, tema, kontakt: contact,
    izvori: sources.map((x) => x.url), trajanje_ms: Date.now() - started
  });
};

module.exports.pickContext = pickContext;
module.exports.systemPrompt = systemPrompt;
