/**
 * Sadržaj zasebnih stranica (HR): usluge, javni sektor, primjeri, o meni, kontakt.
 * Generira ih scripts/generate-blog.js u <path>/index.html, zajedno s blogom i sitemapom.
 *
 * Polja stranice:
 *   path        URL stranice (sa završnom kosom crtom)
 *   nav         koja stavka izbornika je aktivna
 *   crumbs      [[href, naziv], ...] – zadnja stavka je trenutna stranica (href null)
 *   metaTitle   <title> bez " | MangAI" (dodaje se sam)
 *   description meta opis (do ~160 znakova)
 *   h1, lead    naslov i uvodni odlomak
 *   heroActions false = bez gumba u zaglavlju stranice
 *   body        HTML sekcija ispod zaglavlja
 *   faq         [{q, a}] – prikazuje se i ide u FAQPage shemu
 *   schema      dodatni JSON-LD objekti (BreadcrumbList i FAQPage dodaju se sami)
 *   cta         false = bez završnog poziva na kontakt
 *   scripts     dodatni <script> na kraju stranice
 *   lastmod     datum zadnje izmjene sadržaja (sitemap)
 */

const SITE = 'https://mangai.hr';
const PHONE_HREF = 'tel:+385923557476';
const LASTMOD = '2026-11-12';

const arrow = '<span aria-hidden="true">→</span>';

/** Popis "Povezano" na dnu stranice */
function related(title, links) {
  return `
        <section class="section page-related" aria-labelledby="related-title">
            <div class="wrap">
                <h2 id="related-title">${title}</h2>
                <ul class="link-list">
                    ${links.map(([href, label, note]) => `<li><a href="${href}">${label}</a>${note ? `<span>${note}</span>` : ''}</li>`).join('\n                    ')}
                </ul>
            </div>
        </section>`;
}

/** Četiri koraka suradnje (isti postupak kao na početnoj) */
function steps(items, title = 'Kako radim', intro = '') {
  return `
        <section class="section" aria-labelledby="steps-title">
            <div class="wrap">
                <div class="section-head">
                    <h2 id="steps-title">${title}</h2>
                    ${intro ? `<p>${intro}</p>` : ''}
                </div>
                <ol class="steps">
                    ${items.map(([h, p]) => `<li><h3>${h}</h3><p>${p}</p></li>`).join('\n                    ')}
                </ol>
            </div>
        </section>`;
}

const STEPS_DEFAULT = [
  ['Razgovor', 'Pola sata telefonom ili uživo. Opišete što vam treba, ja pitam ono što nedostaje. Besplatno.'],
  ['Ponuda', 'Pisana ponuda s opsegom, cijenom i rokom. Bez skrivenih stavki i nadoplata.'],
  ['Izrada', 'Radim u kratkim koracima i redovito vam pokazujem napredak, pa izmjene stižu na vrijeme.'],
  ['Predaja i podrška', 'Dobivate sustav, upute i pristupne podatke. Održavanje po dogovoru, mjesečno ili po potrebi.'],
];

function service(name, description, url, extra = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: SITE + url,
    provider: { '@id': `${SITE}/#obrt` },
    areaServed: { '@type': 'Country', name: 'Hrvatska' },
    inLanguage: 'hr',
    ...extra,
  };
}

/* ======================================================================
   /usluge/
   ====================================================================== */
const usluge = {
  path: '/usluge/',
  nav: '/usluge/',
  crumbs: [['/', 'Početna'], [null, 'Usluge']],
  metaTitle: 'Usluge: web stranice, AI chatbotovi i automatizacija',
  description: 'Izrada web stranica i webshopa, AI chatbotovi, AI automatizacija, aplikacije po mjeri i održavanje za obrte, male tvrtke i udruge. Pisana ponuda s fiksnom cijenom.',
  h1: 'Usluge',
  lead: 'Od jednostavne web stranice do aplikacije po mjeri. Radim sam, pa razgovarate s osobom koja posao i radi, a svaka ponuda ima opseg, cijenu i rok prije početka.',
  body: `
        <section class="section" aria-label="Popis usluga">
            <div class="wrap">
                <ul class="services-list">
                    <li>
                        <h2 class="h3"><a href="/usluge/izrada-web-stranica/">Izrada web stranica i webshopa</a></h2>
                        <p>Brza, pregledna stranica koja radi na mobitelu i dovodi upite, a ne samo stoji na internetu. Jednostavna stranica za obrt već od 390 €.</p>
                        <p class="examples"><strong>Primjeri:</strong> stranica obrta, apartmana ili salona, WooCommerce webshop, landing za kampanju.</p>
                        <p class="more"><a href="/usluge/izrada-web-stranica/">Više o izradi web stranica ${arrow}</a></p>
                    </li>
                    <li>
                        <h2 class="h3"><a href="/usluge/ai-chatbot/">AI chatbot i asistent</a></h2>
                        <p>Odgovara na česta pitanja iz vaših podataka, prima upite i rezervacije 0–24 te vam šalje sažetak.</p>
                        <p class="examples"><strong>Primjeri:</strong> rezervacije termina, upiti za nekretnine, asistent na webu ili WhatsAppu.</p>
                        <p class="more"><a href="/usluge/ai-chatbot/">Više o AI chatbotu ${arrow}</a></p>
                    </li>
                    <li>
                        <h2 class="h3"><a href="/usluge/ai-automatizacija/">AI automatizacija poslovanja</a></h2>
                        <p>Ponavljajuće zadatke prepuštate sustavu: podsjetnike, izvještaje, unos podataka i follow-up.</p>
                        <p class="examples"><strong>Primjeri:</strong> upiti iz forme ravno u tablicu ili CRM, automatski podsjetnici klijentima.</p>
                        <p class="more"><a href="/usluge/ai-automatizacija/">Više o automatizaciji ${arrow}</a></p>
                    </li>
                    <li>
                        <h2 class="h3"><a href="/usluge/aplikacije-po-mjeri/">Aplikacije po mjeri</a></h2>
                        <p>Interni alati i web aplikacije za točno vaš način rada, bez plaćanja funkcija koje ne koristite.</p>
                        <p class="examples"><strong>Primjeri:</strong> evidencija narudžbi, nadzorna ploča, portal za klijente, loyalty kartice.</p>
                        <p class="more"><a href="/usluge/aplikacije-po-mjeri/">Više o aplikacijama ${arrow}</a></p>
                    </li>
                    <li>
                        <h2 class="h3"><a href="/usluge/odrzavanje/">Održavanje i hosting</a></h2>
                        <p>Ažuriranja, sigurnosne kopije, hosting i manje izmjene, da stranica i sustavi rade i iduće godine.</p>
                        <p class="examples"><strong>Primjeri:</strong> mjesečni paket održavanja, preuzimanje postojeće stranice.</p>
                        <p class="more"><a href="/usluge/odrzavanje/">Više o održavanju ${arrow}</a></p>
                    </li>
                    <li id="savjetovanje">
                        <h2 class="h3">Savjetovanje i edukacija</h2>
                        <p>Gdje vam AI stvarno štedi vrijeme, a gdje nije vrijedan novca. Konkretno, za vaš posao, bez prodaje alata koji vam ne trebaju.</p>
                        <p class="examples"><strong>Primjeri:</strong> pregled procesa, plan uvođenja AI alata, radionica za zaposlenike o sigurnom korištenju AI-ja.</p>
                    </li>
                </ul>
            </div>
        </section>

        <section class="section gov" aria-labelledby="gov-teaser-title">
            <div class="wrap page-split">
                <div>
                    <h2 id="gov-teaser-title">Radite u općini, gradu ili ustanovi?</h2>
                    <p class="page-lead-dark">Pristupačne web stranice prema WCAG 2.1 AA, e-usluge za građane, AI asistent iz službenih dokumenata i održavanje. Uz e-račun, dokumentaciju i predaju izvornog koda.</p>
                </div>
                <p><a href="/javni-sektor/" class="btn btn-primary">Usluge za javne naručitelje</a></p>
            </div>
        </section>
${steps(STEPS_DEFAULT, 'Kako radim', 'Isti postupak za mali obrt i za ustanovu, samo s više ili manje papira.')}`,
  faq: [
    { q: 'Ne znam koja mi usluga treba. Što da napravim?', a: 'Opišite problem svojim riječima, npr. „propuštam pozive dok radim” ili „ručno prepisujem narudžbe”. Na prvom razgovoru, koji je besplatan, predložim najjednostavnije rješenje, a ponekad je to i gotov alat koji vam ne moram ja izrađivati.' },
    { q: 'Mogu li naručiti samo dio, npr. samo chatbot za postojeću stranicu?', a: 'Da. Chatbot, automatizacija ili održavanje mogu se dodati postojećoj stranici, bez obzira tko ju je izradio.' },
    { q: 'Radite li s programima koje već koristim?', a: 'U pravilu da. Povezujem web forme, e-poštu, tablice, kalendar i CRM, Google Workspace i Microsoft 365 te druge sustave koji imaju API.' },
    { q: 'Obračunavate li PDV?', a: 'Ne. Obrt nije u sustavu PDV-a, pa je cijena iz ponude ujedno i konačna cijena.' },
  ],
  schema: [{
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Usluge',
    url: `${SITE}/usluge/`,
    inLanguage: 'hr',
    about: { '@id': `${SITE}/#obrt` },
    hasPart: [
      { '@type': 'Service', name: 'Izrada web stranica i webshopa', url: `${SITE}/usluge/izrada-web-stranica/` },
      { '@type': 'Service', name: 'AI chatbot i asistent', url: `${SITE}/usluge/ai-chatbot/` },
      { '@type': 'Service', name: 'AI automatizacija poslovanja', url: `${SITE}/usluge/ai-automatizacija/` },
      { '@type': 'Service', name: 'Aplikacije po mjeri', url: `${SITE}/usluge/aplikacije-po-mjeri/` },
      { '@type': 'Service', name: 'Održavanje web stranica i hosting', url: `${SITE}/usluge/odrzavanje/` },
    ],
  }],
};

/* ======================================================================
   /usluge/izrada-web-stranica/
   ====================================================================== */
const web = {
  path: '/usluge/izrada-web-stranica/',
  nav: '/usluge/',
  crumbs: [['/', 'Početna'], ['/usluge/', 'Usluge'], [null, 'Izrada web stranica']],
  metaTitle: 'Izrada web stranica za obrte i male tvrtke, od 390 €',
  description: 'Izrada web stranica i webshopova za obrte, salone, apartmane i male tvrtke. Brza stranica za mobitel s upitima i rezervacijama, već od 390 € + 15 €/mj.',
  h1: 'Izrada web stranica za obrte i male tvrtke',
  lead: 'Brza, pregledna stranica koja radi na mobitelu i dovodi upite. Jednostavna stranica za obrt kreće od 390 € jednokratno, uz 15 € mjesečno za hosting i održavanje.',
  body: `
        <section class="section" aria-labelledby="ukljuceno-title">
            <div class="wrap page-split">
                <div class="prose">
                    <h2 id="ukljuceno-title">Što dobivate u osnovnoj stranici</h2>
                    <ul>
                        <li>stranicu prilagođenu mobitelu, jer s mobitela dolazi većina posjeta,</li>
                        <li>usluge s cijenama i trajanjem, radno vrijeme, kontakt i poveznicu na Google Karte,</li>
                        <li>obrazac za upit ili zahtjev za termin, koji vam stiže odmah,</li>
                        <li>galeriju fotografija vašeg prostora i rada,</li>
                        <li>osnovnu postavku za Google: naslove, opise, sitemap i prijavu u Google Search Console,</li>
                        <li>politiku privatnosti i usklađenost s GDPR-om,</li>
                        <li>vaše boje, logotip i tekstove, bez „izradio taj i taj” u podnožju.</li>
                    </ul>
                    <p>Mjesečnih 15 € pokriva hosting, tehničko održavanje i sitne izmjene, poput nove cijene, promjene radnog vremena ili zamjene fotografije. Ne morate ništa uređivati sami: pošaljete poruku i promjena je na stranici.</p>
                </div>
                <aside class="price-box" aria-label="Cijena">
                    <p class="price-label">Jednostavna stranica za obrt</p>
                    <p class="price">već od <strong>390 €</strong></p>
                    <p class="price-sub">jednokratno + <strong>15 €/mj</strong> za hosting i održavanje</p>
                    <p class="price-note">Obrt nije u sustavu PDV-a, pa je to konačna cijena. Točan opseg i rok dobivate u pisanoj ponudi.</p>
                    <a href="/kontakt/" class="btn btn-primary">Zatraži ponudu</a>
                </aside>
            </div>
        </section>

        <section class="section" aria-labelledby="dodaci-title">
            <div class="wrap">
                <div class="section-head">
                    <h2 id="dodaci-title">Dodaci kad zatrebaju</h2>
                    <p>Stranica može krenuti jednostavno, a dodatke uključite kad vidite da vam trebaju. Svaki se dogovara i naplaćuje zasebno.</p>
                </div>
                <ul class="services-list">
                    <li>
                        <h3>Online rezervacije</h3>
                        <p>Klijent zatraži termin za odabranu uslugu, a vi ga potvrdite. Kad posla bude više, prelazi se na pravi kalendar sa slobodnim terminima i podsjetnicima.</p>
                    </li>
                    <li>
                        <h3><a href="/usluge/ai-chatbot/">AI asistent na stranici</a></h3>
                        <p>Odgovara na pitanja o uslugama, cijenama i radnom vremenu iz vaših podataka, a kad ne zna, uzme ime i broj da vas klijent dobije na telefon.</p>
                    </li>
                    <li>
                        <h3>Loyalty kartica s levelima</h3>
                        <p>Digitalna kartica s QR kodom: vi upisujete posjete, a mušterija vidi svoj level i pogodnost. Stalnim mušterijama možete odmah dodijeliti viši level.</p>
                    </li>
                    <li>
                        <h3>Google Business profil</h3>
                        <p>Uređen profil na Google Kartama s točnim radnim vremenom, uslugama i fotografijama, povezan sa stranicom. Za lokalni posao često važniji od same stranice.</p>
                    </li>
                    <li>
                        <h3>Webshop</h3>
                        <p>WooCommerce ili trgovina po mjeri, s plaćanjem karticom, dostavom i e-računima. Cijena ovisi o broju proizvoda i načinu plaćanja, pa ide po ponudi.</p>
                    </li>
                    <li>
                        <h3>Više jezika</h3>
                        <p>Engleska, njemačka ili talijanska verzija za apartmane, restorane i sve koji rade s turistima.</p>
                    </li>
                </ul>
            </div>
        </section>

        <section class="section" aria-labelledby="dobra-title">
            <div class="wrap page-split">
                <div class="prose">
                    <h2 id="dobra-title">Što stranica mora raditi da se isplati</h2>
                    <p><strong>Učitati se odmah.</strong> Ako se stranica na mobitelu otvara nekoliko sekundi, dio ljudi odustane prije nego vidi cijene. Ciljam ocjenu 90 ili više u Googleovom alatu Lighthouse za mobitel.</p>
                    <p><strong>Dovesti do poziva ili upita.</strong> Telefon, obrazac i „Zatražite termin” vidljivi su bez traženja. Stranica koja samo lijepo izgleda ne donosi posao.</p>
                    <p><strong>Biti pronađena.</strong> Naslovi, opisi i podaci o tvrtki postavljeni su tako da ih Google razumije, a ime, adresa i telefon isti su na stranici i na Google Business profilu.</p>
                    <p><strong>Biti čitljiva svima.</strong> Dovoljan kontrast, jasni naslovi i obrasci s oznakama. To pomaže i starijim posjetiteljima i tražilicama.</p>
                    <p>Više o tome kako se pojaviti i u odgovorima ChatGPT-a i Googleovog AI sažetka pročitajte u <a href="/blog/vidljivost-u-ai-odgovorima-chatgpt-google.html">vodiču o vidljivosti u AI odgovorima</a>.</p>
                </div>
                <div class="prose">
                    <h2>Za koga radim stranice</h2>
                    <p>Najčešće za lokalne obrte koji danas imaju samo Facebook ili Google Karte: frizerske i kozmetičke salone, veterinare, servise, apartmane, restorane i udruge. Za njih je jednostavna stranica od 390 € zamišljena kao brz i povoljan početak.</p>
                    <p>Veće stranice, webshop i stranice javnih naručitelja rade se po mjeri, s pisanom ponudom i predajom izvornog koda. Za općine, gradove i ustanove pogledajte <a href="/javni-sektor/">usluge za javni sektor</a>.</p>
                </div>
            </div>
        </section>
${steps([
    ['Razgovor', 'Kratko telefonom ili uživo: što radite, tko su vam klijenti i što stranica treba postići. Besplatno.'],
    ['Ponuda i sadržaj', 'Pisana ponuda s cijenom i rokom. Pošaljete tekstove, cijene i fotografije, a ja pomognem s onim što nedostaje.'],
    ['Prva verzija', 'Pokažem stranicu na probnoj adresi, prođemo je zajedno na mobitelu i ispravim što treba.'],
    ['Objava', 'Stranica ide na vašu domenu, prijavim je Googleu i povežem s Google Business profilom.'],
  ], 'Kako nastaje stranica')}
${related('Povezano', [
    ['/usluge/ai-chatbot/', 'AI chatbot i asistent', 'odgovori i upiti 0–24 na vašoj stranici'],
    ['/usluge/odrzavanje/', 'Održavanje i hosting', 'za stranice koje sam izradio i one koje nisam'],
    ['/primjeri/', 'Primjeri po djelatnostima', 'isprobajte kako izgleda asistent za salon ili apartmane'],
  ])}`,
  faq: [
    { q: 'Koliko košta izrada web stranice?', a: 'Jednostavna stranica za obrt, s uslugama i cijenama, radnim vremenom, galerijom, kontaktom i obrascem za upit, kreće od 390 € jednokratno uz 15 € mjesečno. Veće stranice, webshop i dodatne funkcije idu po pisanoj ponudi s fiksnom cijenom.' },
    { q: 'Što uključuje 15 € mjesečno?', a: 'Hosting, tehničko održavanje i sitne izmjene, poput promjene cijena, radnog vremena, teksta ili fotografija. Održavanje se može otkazati uz otkazni rok od 30 dana.' },
    { q: 'Koliko traje izrada?', a: 'Najviše ovisi o tome koliko brzo stignu tekstovi, cijene i fotografije. Rok je naveden u ponudi, a jednostavna stranica ne traži mjesece rada.' },
    { q: 'Mogu li sam mijenjati sadržaj stranice?', a: 'Sitne izmjene uključene su u mjesečno održavanje, pa ih ne morate raditi sami. Ako želite sami uređivati sadržaj, dogovorimo stranicu s administracijom.' },
    { q: 'Hoće li se stranica vidjeti na Googleu?', a: 'Svaku stranicu postavljam s naslovima, opisima i sitemapom, prijavim je u Google Search Console i povežem s Google Business profilom. Pozicija ovisi i o konkurenciji, ali tehnički dio je ispravan od prvog dana.' },
  ],
  schema: [service(
    'Izrada web stranica',
    'Izrada web stranica i webshopova za obrte i male tvrtke: stranica za mobitel s uslugama, cijenama, radnim vremenom i obrascem za upit.',
    '/usluge/izrada-web-stranica/',
    {
      serviceType: 'Izrada web stranica',
      offers: {
        '@type': 'Offer',
        price: '390',
        priceCurrency: 'EUR',
        description: 'Jednostavna web stranica za obrt, jednokratno, uz 15 € mjesečno za hosting i održavanje.',
        url: `${SITE}/usluge/izrada-web-stranica/`,
      },
    }
  )],
};

/* ======================================================================
   /usluge/ai-chatbot/
   ====================================================================== */
const chatbot = {
  path: '/usluge/ai-chatbot/',
  nav: '/usluge/',
  crumbs: [['/', 'Početna'], ['/usluge/', 'Usluge'], [null, 'AI chatbot']],
  metaTitle: 'AI chatbot za web stranicu i WhatsApp',
  description: 'AI asistent koji odgovara iz vaših podataka, prima upite i rezervacije 0–24 i šalje vam sažetak. Na webu ili WhatsAppu, za salone, apartmane, ordinacije i urede.',
  h1: 'AI chatbot i asistent za vaš posao',
  lead: 'Asistent odgovara na česta pitanja iz vaših podataka, prima upite i rezervacije 0–24 i šalje vam sažetak. Kad ne zna odgovor, ne izmišlja, nego ponudi da vas klijent dobije na telefon.',
  body: `
        <section class="section" aria-labelledby="radi-title">
            <div class="wrap page-split">
                <div class="prose">
                    <h2 id="radi-title">Što asistent radi</h2>
                    <ul>
                        <li>odgovara iz vašeg cjenika, opisa usluga, radnog vremena, uvjeta i čestih pitanja,</li>
                        <li>postavi nekoliko pitanja da upit bude potpun: što, kada, za koga, okvirni budžet,</li>
                        <li>upiše upit ili zahtjev za termin i pošalje vam kratak sažetak,</li>
                        <li>odgovara na jeziku klijenta, pa i strancima na engleskom ili njemačkom,</li>
                        <li>prepušta razgovor vama kad nije siguran ili kad klijent to traži.</li>
                    </ul>
                    <h2>Što ne radi</h2>
                    <p>Ne izmišlja cijene i rokove kojih nema u podacima, ne obećava popuste koje niste odobrili i ne daje pravne ni medicinske savjete. To su pravila koja zapišemo zajedno i provjerimo na stvarnim pitanjima prije puštanja u rad.</p>
                </div>
                <div class="prose">
                    <h2>Gdje može raditi</h2>
                    <p><strong>Na vašoj web stranici</strong>, kao prozorčić u kutu. Dodaje se na novu stranicu ili na postojeću, uključujući WordPress.</p>
                    <p><strong>Na WhatsAppu</strong>, preko Metine WhatsApp Business Platforme. Za to trebaju verifikacija tvrtke i zaseban broj, a Meta naplaćuje poruke koje šaljete po predlošku, poput podsjetnika.</p>
                    <p><strong>Na Messengeru i Instagramu</strong> po dogovoru, jer Meta prije uključivanja traži pregled aplikacije.</p>
                    <p>Kako to izgleda iz perspektive klijenta i vlasnika, isprobajte u <a href="/primjeri/">primjerima po djelatnostima</a>.</p>
                </div>
            </div>
        </section>

        <section class="section" aria-labelledby="djelatnosti-title">
            <div class="wrap">
                <div class="section-head">
                    <h2 id="djelatnosti-title">Gdje se najbrže isplati</h2>
                    <p>Najveći učinak je tamo gdje upiti stižu navečer i vikendom, a vi ih ne stignete odmah odgovoriti.</p>
                </div>
                <ul class="demo-list">
                    <li><a href="/demo/salon/"><span class="demo-sector">Saloni i frizeri</span><span class="demo-what">Pitanja o uslugama i cijenama, zahtjevi za termin i podsjetnik dan prije.</span><span class="demo-open">Isprobaj demo</span></a></li>
                    <li><a href="/demo/apartmani/"><span class="demo-sector">Apartmani</span><span class="demo-what">Odgovori gostima na više jezika, slobodni datumi i upute za dolazak.</span><span class="demo-open">Isprobaj demo</span></a></li>
                    <li><a href="/demo/nekretnine/"><span class="demo-sector">Nekretnine</span><span class="demo-what">Pitanja o budžetu i rokovima, zakazivanje razgleda i sažetak za agenta.</span><span class="demo-open">Isprobaj demo</span></a></li>
                    <li><a href="/demo/ordinacija/"><span class="demo-sector">Ordinacije</span><span class="demo-what">Zahtjevi za termin, upute prije pregleda, a hitni slučajevi odmah na telefon ili 112.</span><span class="demo-open">Isprobaj demo</span></a></li>
                </ul>
            </div>
        </section>
${steps([
    ['Podaci', 'Skupimo cjenik, usluge, radno vrijeme, česta pitanja i uvjete. To je jedini izvor iz kojeg asistent odgovara.'],
    ['Pravila', 'Zapišemo što smije, a što ne: popusti, rokovi, osjetljive teme i kada razgovor ide vama.'],
    ['Testiranje', 'Prođemo stvarna pitanja vaših klijenata, uključujući ona nezgodna, i ispravim odgovore prije objave.'],
    ['Rad i praćenje', 'Asistent kreće s radom, a razgovore pregledavamo i dopunjujemo podatke kad se pojavi novo pitanje.'],
  ], 'Kako ga postavljam')}

        <section class="section" aria-labelledby="cijena-title">
            <div class="wrap page-split">
                <div class="prose">
                    <h2 id="cijena-title">Od čega se sastoji cijena</h2>
                    <p>Cijena ima jednokratni dio, za postavljanje, podatke, pravila i testiranje, te mjesečni dio: korištenje AI modela, hosting, održavanje i, ako asistent radi na WhatsAppu, Metine naknade za poruke po predlošku.</p>
                    <p>Svaka stavka u ponudi je navedena zasebno, pa unaprijed znate koliko plaćate mjesečno. Asistent se može naručiti uz novu web stranicu ili zasebno, za stranicu koju već imate.</p>
                    <p>Detaljniji pregled gotovih alata i rješenja po mjeri pročitajte u članku <a href="/blog/ai-chatbot-za-web-stranicu.html">AI chatbot za web stranicu i prodaju</a>.</p>
                </div>
                <div class="prose">
                    <h2>Zakon i privatnost</h2>
                    <p>Od 2. kolovoza 2026. Akt o umjetnoj inteligenciji traži da ljudi znaju da razgovaraju s AI sustavom, pa asistent to jasno kaže.</p>
                    <p>Kad asistent obrađuje osobne podatke, poput imena i broja telefona, sklapamo ugovor o obradi podataka, a podaci se čuvaju na poslužiteljima u EU.</p>
                </div>
            </div>
        </section>
${related('Povezano', [
    ['/usluge/ai-automatizacija/', 'AI automatizacija poslovanja', 'upiti iz chata ravno u tablicu, CRM ili kalendar'],
    ['/usluge/izrada-web-stranica/', 'Izrada web stranica', 'asistent kao dodatak novoj stranici'],
    ['/blog/ai-chatbot-za-web-stranicu.html', 'AI chatbot za web stranicu: što radi i koliko košta', 'vodič s pitanjima prije narudžbe'],
  ])}`,
  faq: [
    { q: 'Može li asistent raditi na stranici koju već imam?', a: 'Da. Dodaje se na većinu postojećih stranica, uključujući WordPress, bez izrade nove stranice.' },
    { q: 'Na kojim jezicima odgovara?', a: 'Na jeziku na kojem mu klijent piše: hrvatskom, engleskom, njemačkom, talijanskom i drugima. Zato je posebno koristan za apartmane i turizam.' },
    { q: 'Gdje vidim upite i razgovore?', a: 'Sažetak svakog upita stiže vam e-poštom ili u tablicu, CRM ili kalendar, ovisno o dogovoru. Razgovore možete pregledati i naknadno.' },
    { q: 'Zamjenjuje li asistent zaposlenika?', a: 'Ne. Preuzima ponavljajuća pitanja i upite izvan radnog vremena, a odluke, cijene i dogovori ostaju vama.' },
  ],
  schema: [service(
    'AI chatbot i asistent',
    'AI asistent za web stranicu i WhatsApp koji odgovara iz podataka tvrtke, prima upite i rezervacije 0–24 i šalje sažetak vlasniku.',
    '/usluge/ai-chatbot/',
    { serviceType: 'AI chatbot' }
  )],
};

/* ======================================================================
   /usluge/ai-automatizacija/
   ====================================================================== */
const automatizacija = {
  path: '/usluge/ai-automatizacija/',
  nav: '/usluge/',
  crumbs: [['/', 'Početna'], ['/usluge/', 'Usluge'], [null, 'AI automatizacija']],
  metaTitle: 'AI automatizacija poslovanja za male tvrtke i obrte',
  description: 'Upiti iz forme ravno u tablicu ili CRM, automatski podsjetnici, izvještaji i follow-up. AI automatizacija poslovnih procesa za male tvrtke i obrte u Hrvatskoj.',
  h1: 'AI automatizacija poslovanja',
  lead: 'Ponavljajuće zadatke prepuštate sustavu: prepisivanje upita, podsjetnike, izvještaje i follow-up. Krećemo od jednog procesa koji vam svaki tjedan oduzima najviše vremena.',
  body: `
        <section class="section" aria-labelledby="sto-title">
            <div class="wrap">
                <div class="section-head">
                    <h2 id="sto-title">Što se najčešće automatizira</h2>
                    <p>Poslovi koji se ponavljaju, imaju jasna pravila i danas traže prepisivanje iz jednog programa u drugi.</p>
                </div>
                <ul class="services-list">
                    <li>
                        <h3>Upiti ravno u tablicu ili CRM</h3>
                        <p>Upit s web forme, iz e-pošte ili s chata sam se upiše, razvrsta i dodijeli, a vi dobijete obavijest.</p>
                    </li>
                    <li>
                        <h3>Podsjetnici klijentima</h3>
                        <p>Podsjetnik za termin dan prije, za neplaćeni račun ili za redoviti servis, bez ručnog slanja.</p>
                    </li>
                    <li>
                        <h3>Ponude i follow-up</h3>
                        <p>Ponuda iz predloška u nekoliko klikova, a ako klijent ne odgovori, sustav vas podsjeti da se javite.</p>
                    </li>
                    <li>
                        <h3>Podaci iz dokumenata</h3>
                        <p>AI izvlači podatke iz narudžbi, računa ili e-pošte i upisuje ih u tablicu, a vi samo provjerite.</p>
                    </li>
                    <li>
                        <h3>Tjedni izvještaj</h3>
                        <p>Brojke iz tablica, webshopa i kalendara slože se u kratak sažetak koji stiže svaki ponedjeljak.</p>
                    </li>
                    <li>
                        <h3>Prijedlozi odgovora</h3>
                        <p>Na česta pitanja u e-pošti AI pripremi odgovor, a vi ga pročitate, ispravite i pošaljete.</p>
                    </li>
                </ul>
            </div>
        </section>

        <section class="section" aria-labelledby="prvi-title">
            <div class="wrap page-split">
                <div class="prose">
                    <h2 id="prvi-title">Kako odabrati prvi proces</h2>
                    <p>Zapišite tjedan dana sve što radite ručno, a ponavlja se. Za svaki posao procijenite koliko se često ponavlja, koliko vremena uzima i ima li jasna pravila. Prvi kandidat je posao koji je čest, dosadan i svaki put isti.</p>
                    <p>Prije početka zajedno izračunamo isplati li se: sati tjedno puta vrijednost vašeg sata, u odnosu na cijenu izrade. Ako se ne isplati, reći ću vam.</p>
                    <p>Dvanaest konkretnih primjera po djelatnostima pročitajte u članku <a href="/blog/automatizacija-poslovnih-procesa-primjeri.html">Automatizacija poslovnih procesa: 12 primjera</a>, a širi pregled u vodiču <a href="/blog/ai-automatizacija-poslovanja-hrvatska.html">AI automatizacija poslovanja u Hrvatskoj</a>.</p>
                </div>
                <div class="prose">
                    <h2>Alati i vaši sustavi</h2>
                    <p>Najčešće ne morate mijenjati programe koje koristite. Povezujem e-poštu, tablice, kalendar i CRM, Google Workspace, Microsoft 365, WhatsApp i druge sustave koji imaju API, uz alate poput n8n-a ili vlastiti kod.</p>
                    <p>AI modeli (Claude, ChatGPT, Gemini) koriste se tamo gdje treba pročitati, sažeti ili razvrstati tekst. Gdje su dovoljna obična pravila, AI ne treba i ne plaćate ga.</p>
                    <p>Osjetljive korake, poput slanja ponude klijentu ili plaćanja, sustav priprema, a vi odobravate.</p>
                </div>
            </div>
        </section>
${steps([
    ['Pregled procesa', 'Prođemo kako posao danas izgleda, korak po korak, i gdje se gubi vrijeme.'],
    ['Prijedlog i ponuda', 'Opis rješenja, procjena uštede, cijena i rok. Bez obveze.'],
    ['Izrada i test', 'Automatizacija se gradi i testira na vašim stvarnim podacima prije nego što preuzme posao.'],
    ['Predaja', 'Upute, dokumentacija i obavijest kad nešto ne prođe. Održavanje po dogovoru.'],
  ], 'Kako izgleda suradnja')}
${related('Povezano', [
    ['/usluge/ai-chatbot/', 'AI chatbot i asistent', 'upiti s weba i WhatsAppa koji se sami upisuju'],
    ['/usluge/aplikacije-po-mjeri/', 'Aplikacije po mjeri', 'kad tablica više nije dovoljna'],
    ['/blog/ai-implementacija-plan-roi-hrvatska.html', 'AI implementacija i ROI za male tvrtke', 'procjena spremnosti, plan i izračun povrata'],
  ])}`,
  faq: [
    { q: 'Moram li mijenjati programe koje koristim?', a: 'Najčešće ne. Automatizacija povezuje ono što već imate: e-poštu, tablice, kalendar, CRM ili webshop, preko njihovih API-ja.' },
    { q: 'Što ako automatizacija zakaže?', a: 'Svaka automatizacija javlja grešku kad neki korak ne prođe, pa ništa ne nestane tiho. Dobivate i dokumentaciju, tako da sustav može održavati i netko drugi.' },
    { q: 'Je li sigurno slati podatke AI modelu?', a: 'Koristim poslovne API-je pružatelja AI modela, šaljem samo podatke potrebne za zadatak i ne koristim alate koji vaše podatke koriste za treniranje modela. Kad se obrađuju osobni podaci, sklapamo ugovor o obradi podataka.' },
    { q: 'Koliko se može uštedjeti?', a: 'Ovisi o procesu. Zato prije početka računamo koliko sati tjedno posao uzima i koliko će koštati izrada, pa odlučujete na temelju brojki.' },
  ],
  schema: [service(
    'AI automatizacija poslovanja',
    'Automatizacija poslovnih procesa za male tvrtke i obrte: upiti u tablicu ili CRM, podsjetnici, izvještaji, obrada dokumenata i follow-up.',
    '/usluge/ai-automatizacija/',
    { serviceType: 'Automatizacija poslovnih procesa' }
  )],
};

/* ======================================================================
   /usluge/aplikacije-po-mjeri/
   ====================================================================== */
const aplikacije = {
  path: '/usluge/aplikacije-po-mjeri/',
  nav: '/usluge/',
  crumbs: [['/', 'Početna'], ['/usluge/', 'Usluge'], [null, 'Aplikacije po mjeri']],
  metaTitle: 'Izrada aplikacija po mjeri: interni alati i portali',
  description: 'Web aplikacije i interni alati po mjeri za male tvrtke: evidencije, nadzorne ploče, portali za klijente i loyalty kartice. Izvorni kod ostaje vama.',
  h1: 'Aplikacije po mjeri',
  lead: 'Kad gotov program traži da mijenjate način rada, a tablica više ne stiže, izrađujem web aplikaciju koja radi točno ono što vam treba, bez plaćanja funkcija koje ne koristite.',
  body: `
        <section class="section" aria-labelledby="primjeri-app-title">
            <div class="wrap">
                <div class="section-head">
                    <h2 id="primjeri-app-title">Što najčešće radim</h2>
                </div>
                <ul class="services-list">
                    <li>
                        <h3>Evidencija narudžbi i zaliha</h3>
                        <p>Umjesto tablice koju uređuju tri osobe: jedan popis, statusi, tko je što promijenio i izvoz u Excel kad zatreba.</p>
                    </li>
                    <li>
                        <h3>Nadzorna ploča</h3>
                        <p>Brojke iz webshopa, knjigovodstva, kalendara i tablica na jednom mjestu, osvježene same od sebe.</p>
                    </li>
                    <li>
                        <h3>Portal za klijente</h3>
                        <p>Klijent se prijavi i vidi status svog posla, dokumente i račune, umjesto da zove i pita.</p>
                    </li>
                    <li>
                        <h3>Rezervacije i termini</h3>
                        <p>Kalendar sa slobodnim terminima po uslugama i zaposlenicima, podsjetnici i pregled za vlasnika.</p>
                    </li>
                    <li>
                        <h3>Loyalty kartice</h3>
                        <p>Digitalna kartica s QR kodom, leveli po broju posjeta, ručno dodijeljeni level za stalne mušterije i profil mušterije.</p>
                    </li>
                    <li>
                        <h3>Interni alati za ured</h3>
                        <p>Obrasci, odobrenja i evidencije koje danas idu e-poštom i papirom, složeni u jedan jednostavan alat.</p>
                    </li>
                </ul>
            </div>
        </section>

        <section class="section" aria-labelledby="smisla-title">
            <div class="wrap page-split">
                <div class="prose">
                    <h2 id="smisla-title">Kad aplikacija po mjeri ima smisla</h2>
                    <p>Ima smisla kad posao radite na svoj način i to vam je prednost, kad isti podaci žive u tri tablice ili kad gotov program plaćate za deset korisnika, a koristite dvije funkcije.</p>
                    <p>Nema smisla ako postoji gotov alat od nekoliko eura mjesečno koji radi ono što trebate. Tada ću vam ga preporučiti, a ne prodavati izradu.</p>
                    <p>Krećemo od najmanje verzije koja rješava glavni problem. Kad je u upotrebi, dograđuje se ono što se pokaže potrebnim.</p>
                </div>
                <div class="prose">
                    <h2>Tehnologija i vlasništvo</h2>
                    <p>Aplikacije radim u TypeScriptu, Reactu i Next.js-u, s bazom PostgreSQL (Supabase), a za obradu podataka koristim Python. Rade u pregledniku na mobitelu i računalu, bez instalacije.</p>
                    <p>Izvorni kod svega što je izrađeno za vas, dokumentacija i pristupi ostaju vama, pa aplikaciju kasnije može održavati i netko drugi. Hosting je u EU kad aplikacija obrađuje osobne podatke.</p>
                </div>
            </div>
        </section>
${steps(STEPS_DEFAULT)}
${related('Povezano', [
    ['/usluge/ai-automatizacija/', 'AI automatizacija poslovanja', 'kad je dovoljno povezati postojeće programe'],
    ['/usluge/odrzavanje/', 'Održavanje i hosting', 'ažuriranja i podrška nakon predaje'],
    ['/o-meni/', 'O meni', 'tko radi posao i kako'],
  ])}`,
  faq: [
    { q: 'Koliko košta aplikacija po mjeri?', a: 'Ovisi o opsegu. Krećemo od najmanje verzije koja rješava glavni problem, a cijena i rok su fiksni i navedeni u pisanoj ponudi.' },
    { q: 'Radi li aplikacija na mobitelu?', a: 'Da. Web aplikacija radi u pregledniku na mobitelu, tabletu i računalu, a na mobitelu se može dodati na početni zaslon kao ikona.' },
    { q: 'Tko je vlasnik koda?', a: 'Vi. Dobivate izvorni kod svega što je izrađeno za vas, dokumentaciju i pristupe, s pravom da ga mijenjate i date drugom izvođaču.' },
    { q: 'Može li se aplikacija povezati s programima koje već koristim?', a: 'Da, ako ti programi imaju API ili izvoz podataka. To provjerimo na početku, prije ponude.' },
  ],
  schema: [service(
    'Aplikacije po mjeri',
    'Izrada web aplikacija i internih alata po mjeri: evidencije, nadzorne ploče, portali za klijente, rezervacije i loyalty kartice.',
    '/usluge/aplikacije-po-mjeri/',
    { serviceType: 'Razvoj programske podrške po mjeri' }
  )],
};

/* ======================================================================
   /usluge/odrzavanje/
   ====================================================================== */
const odrzavanje = {
  path: '/usluge/odrzavanje/',
  nav: '/usluge/',
  crumbs: [['/', 'Početna'], ['/usluge/', 'Usluge'], [null, 'Održavanje i hosting']],
  metaTitle: 'Održavanje web stranica i hosting',
  description: 'Mjesečno održavanje web stranica i aplikacija: ažuriranja, sigurnosne nadogradnje, kopije, nadzor dostupnosti i manje izmjene. Preuzimam i postojeće stranice.',
  h1: 'Održavanje web stranica i hosting',
  lead: 'Ažuriranja, sigurnosne nadogradnje, kopije i manje izmjene, da stranica i sustavi rade i iduće godine. Preuzimam i stranice koje je izradio netko drugi.',
  body: `
        <section class="section" aria-labelledby="ukljucuje-title">
            <div class="wrap page-split">
                <div class="prose">
                    <h2 id="ukljucuje-title">Što uključuje održavanje</h2>
                    <ul>
                        <li>redovita ažuriranja sustava i dodataka, npr. WordPressa i WooCommercea,</li>
                        <li>sigurnosne nadogradnje čim izađu,</li>
                        <li>redovite sigurnosne kopije, iz kojih se stranica može vratiti,</li>
                        <li>nadzor dostupnosti: ako stranica prestane raditi, saznam prije vas,</li>
                        <li>manje izmjene sadržaja: cijene, radno vrijeme, tekstovi i fotografije,</li>
                        <li>hosting i pomoć oko domene, e-pošte i Google Business profila.</li>
                    </ul>
                    <p>Nove funkcije i veće izmjene nisu dio održavanja. Za njih dobivate zasebnu ponudu, pa nema iznenađenja na računu.</p>
                </div>
                <aside class="price-box" aria-label="Cijena održavanja">
                    <p class="price-label">Za stranice koje izradim</p>
                    <p class="price"><strong>15 €</strong>/mj</p>
                    <p class="price-sub">hosting, održavanje i sitne izmjene</p>
                    <p class="price-note">Za postojeće stranice, webshopove i aplikacije cijena ovisi o sustavu i dobivate je nakon pregleda. Otkazni rok je 30 dana.</p>
                    <a href="/kontakt/" class="btn btn-primary">Zatraži pregled stranice</a>
                </aside>
            </div>
        </section>
${steps([
    ['Pregled', 'Provjerim verzije, sigurnost, kopije, brzinu i tko ima pristupe. Pregled dobivate pisano.'],
    ['Popis popravaka', 'Što je hitno, što može čekati i koliko košta. Odlučujete vi.'],
    ['Preuzimanje', 'Pristupi se prebacuju na vaše ime gdje je moguće, a prije ijedne promjene radi se puna kopija.'],
    ['Redovito održavanje', 'Ažuriranja, kopije i nadzor svaki mjesec, a za izmjene pošaljete poruku.'],
  ], 'Preuzimanje postojeće stranice', 'Ako se prethodni izvođač više ne javlja ili stranica nije ažurirana godinama, krećemo od pregleda.')}
${related('Povezano', [
    ['/usluge/izrada-web-stranica/', 'Izrada web stranica', 'kad je jeftinije napraviti novu nego krpati staru'],
    ['/javni-sektor/', 'Za javne naručitelje', 'godišnji ugovor o održavanju i preuzimanje od prethodnog izvođača'],
    ['/uvjeti-poslovanja.html', 'Uvjeti poslovanja', 'jamstvo, otkaz i predaja pristupa'],
  ])}`,
  faq: [
    { q: 'Možete li preuzeti stranicu koju je radio netko drugi?', a: 'Da. Krećem od pregleda stanja i pristupa, a nakon toga dobivate popis potrebnih popravaka i cijenu mjesečnog održavanja.' },
    { q: 'Što ako stranica bude hakirana ili prestane raditi?', a: 'Stranica se vraća iz zadnje ispravne kopije, a zatim se uklanja uzrok: zastarjeli dodatak, slaba lozinka ili ranjivost. Redovita ažuriranja i kopije postoje upravo zato da se to ne dogodi ili da se brzo popravi.' },
    { q: 'Mogu li otkazati održavanje?', a: 'Da, uz otkazni rok od 30 dana. Po prestanku predajem sve pristupe i zadnju sigurnosnu kopiju.' },
    { q: 'Uključuje li održavanje nove funkcije?', a: 'Ne. Manje izmjene sadržaja su uključene, a nove funkcije i veće promjene dobivaju zasebnu ponudu.' },
  ],
  schema: [service(
    'Održavanje web stranica i hosting',
    'Mjesečno održavanje web stranica i aplikacija: ažuriranja, sigurnosne nadogradnje, kopije, nadzor dostupnosti, hosting i manje izmjene.',
    '/usluge/odrzavanje/',
    {
      serviceType: 'Održavanje web stranica',
      offers: {
        '@type': 'Offer',
        price: '15',
        priceCurrency: 'EUR',
        description: 'Mjesečno održavanje i hosting za stranice koje izrađuje MangAI.',
        url: `${SITE}/usluge/odrzavanje/`,
      },
    }
  )],
};

/* ======================================================================
   /javni-sektor/
   ====================================================================== */
const javni = {
  path: '/javni-sektor/',
  nav: '/javni-sektor/',
  crumbs: [['/', 'Početna'], [null, 'Javni sektor']],
  metaTitle: 'Web stranice i e-usluge za općine, gradove i ustanove',
  description: 'Pristupačne web stranice (WCAG 2.1 AA), e-usluge za građane, AI asistent i održavanje za javne naručitelje. Jednostavna nabava i EOJN, e-račun i predaja izvornog koda.',
  h1: 'Za javne naručitelje',
  lead: 'Web stranice, e-usluge i održavanje za općine, gradove, škole, ustanove i turističke zajednice, uz urednu dokumentaciju, e-račun i predaju izvornog koda.',
  body: `
        <section class="section" aria-labelledby="gov-usluge-title">
            <div class="wrap">
                <div class="section-head">
                    <h2 id="gov-usluge-title">Što radim za javni sektor</h2>
                    <p>Usluge koje se najčešće nabavljaju jednostavnom nabavom ili preko EOJN-a, s jasnim opsegom i rokom.</p>
                </div>
                <ul class="services-list">
                    <li>
                        <h3>Web stranice dostupne svima</h3>
                        <p>Izrada i redizajn službenih stranica u skladu sa Zakonom o pristupačnosti mrežnih stranica (WCAG 2.1 AA), sa svim obveznim informacijama na jednom mjestu.</p>
                        <p class="examples"><strong>Uključuje:</strong> izjavu o pristupačnosti, CMS za djelatnike, obuku za uređivanje.</p>
                    </li>
                    <li>
                        <h3>Održavanje i hosting</h3>
                        <p>Redovita ažuriranja, sigurnosne nadogradnje, kopije i nadzor dostupnosti postojećih stranica i aplikacija.</p>
                        <p class="examples"><strong>Uključuje:</strong> godišnji ugovor o održavanju, preuzimanje od prethodnog izvođača.</p>
                    </li>
                    <li>
                        <h3>E-usluge za građane</h3>
                        <p>Digitalni obrasci, prijave i zahtjevi koji stižu ravno u ured, umjesto papira i skeniranja.</p>
                        <p class="examples"><strong>Uključuje:</strong> prijave na natječaje i programe, komunalne prijave, rezervacije prostora.</p>
                    </li>
                    <li>
                        <h3>AI asistent za građane i turiste</h3>
                        <p>Odgovara na česta pitanja na temelju vaših službenih dokumenata, na hrvatskom i stranim jezicima. <a href="/demo/opcina/">Pogledajte demo za općinu</a>.</p>
                        <p class="examples"><strong>Uključuje:</strong> asistent turističke zajednice, upute za građane, radno vrijeme i kontakti.</p>
                    </li>
                    <li>
                        <h3>Interni alati i automatizacija</h3>
                        <p>Manje aplikacije i automatizacije koje skraćuju administraciju u uredu.</p>
                        <p class="examples"><strong>Uključuje:</strong> evidencije, izvještaji, povezivanje postojećih sustava.</p>
                    </li>
                    <li>
                        <h3>Edukacija djelatnika</h3>
                        <p>Praktične radionice o sigurnom korištenju AI alata u svakodnevnom radu ustanove.</p>
                        <p class="examples"><strong>Uključuje:</strong> radionicu na lokaciji ili online, pisane upute za djelatnike.</p>
                    </li>
                </ul>
            </div>
        </section>

        <section class="section gov" aria-labelledby="obveze-title">
            <div class="wrap">
                <div class="section-head">
                    <h2 id="obveze-title">Što možete očekivati</h2>
                    <p>MangAI je mali obrt, ali posao predaje kao da ga preuzima revizija.</p>
                </div>
                <div class="gov-grid">
                    <ul class="commitments">
                        <li><strong>E-račun</strong><span>Račune izdajem kao e-račune, u skladu s propisima o elektroničkom izdavanju računa.</span></li>
                        <li><strong>Izvorni kod i prava ostaju vama</strong><span>Predajem kod, dokumentaciju i pristupe, pa sustav može održavati i netko drugi.</span></li>
                        <li><strong>Pristupačnost</strong><span>Web stranice radim prema WCAG 2.1 AA i Zakonu o pristupačnosti mrežnih stranica.</span></li>
                        <li><strong>GDPR</strong><span>Ugovor o obradi podataka i hosting u EU kad sustav obrađuje osobne podatke.</span></li>
                        <li><strong>Na terenu kad treba</strong><span>Sjedište je u Pločama, a na sastanke i primopredaju dolazim po dogovoru bilo gdje u Hrvatskoj.</span></li>
                    </ul>
                    <div class="cpv">
                        <h3>Područja nabave (CPV)</h3>
                        <p>Usluge koje nudim, prema zajedničkom rječniku javne nabave.</p>
                        <dl>
                            <div><dt>72000000</dt><dd>Usluge informacijske tehnologije</dd></div>
                            <div><dt>72230000</dt><dd>Razvoj programske podrške po mjeri</dd></div>
                            <div><dt>72413000</dt><dd>Izrada web stranica</dd></div>
                            <div><dt>72267000</dt><dd>Održavanje programske podrške</dd></div>
                            <div><dt>72220000</dt><dd>Savjetovanje o sustavima i tehnologiji</dd></div>
                            <div><dt>80500000</dt><dd>Usluge osposobljavanja</dd></div>
                        </dl>
                        <div class="gov-cta">
                            <p>Pošaljite poziv na dostavu ponude na <a class="inline" href="mailto:marko@mangai.hr">marko@mangai.hr</a>.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="section" aria-labelledby="nabava-title">
            <div class="wrap page-split">
                <div class="prose">
                    <h2 id="nabava-title">Kako izgleda nabava</h2>
                    <p>Većina ovih usluga nabavlja se jednostavnom nabavom, koja od 1. rujna 2026. za usluge vrijedi do 50.000 € bez PDV-a. Veće nabave idu kroz Elektronički oglasnik javne nabave (EOJN RH), gdje se javljam na objavljene postupke.</p>
                    <p>Na poziv za dostavu ponude odgovaram u traženom roku, s jasnim opsegom, cijenom, rokom i dokumentima koje naručitelj traži. Ako opis posla još pišete, pogledajte što bi u njega trebalo ući da stranica radi i nakon predaje.</p>
                </div>
                <div class="prose">
                    <h2>Korisni vodiči</h2>
                    <ul class="link-list compact">
                        <li><a href="/blog/nabava-web-stranice-jednostavna-nabava.html">Kako naručiti web stranicu kroz jednostavnu nabavu</a><span>novi pragovi i opis posla</span></li>
                        <li><a href="/blog/pristupacnost-web-stranica-javni-sektor.html">Pristupačnost web stranica u javnom sektoru</a><span>zakon, izjava i provjera u deset koraka</span></li>
                        <li><a href="/blog/sto-mora-imati-web-stranica-opcine.html">Što mora imati web stranica općine ili grada</a><span>popis obveznih informacija</span></li>
                    </ul>
                </div>
            </div>
        </section>`,
  faq: [
    { q: 'Javljate li se na pozive za dostavu ponuda?', a: 'Da. Poziv pošaljite na marko@mangai.hr, a na postupke objavljene u EOJN RH javljam se izravno. Ponudu šaljem u traženom roku.' },
    { q: 'Izdajete li e-račune?', a: 'Da. Svi računi izdaju se kao e-računi, u skladu s propisima o elektroničkom izdavanju računa.' },
    { q: 'Što dobivamo pri predaji?', a: 'Izvorni kod, dokumentaciju, pristupne podatke, izjavu o pristupačnosti za web stranice i obuku djelatnika za uređivanje. Domena, hosting i korisnički računi vode se na naručitelja kad god je to moguće.' },
    { q: 'Može li mali obrt biti ponuditelj?', a: 'Može. Obrt sudjeluje u jednostavnoj i javnoj nabavi kao i tvrtka, a uvjete sposobnosti određuje naručitelj u dokumentaciji o nabavi.' },
  ],
  schema: [service(
    'Web stranice i e-usluge za javne naručitelje',
    'Pristupačne web stranice prema WCAG 2.1 AA, e-usluge za građane, AI asistent, interni alati, održavanje i edukacija za općine, gradove i ustanove.',
    '/javni-sektor/',
    { serviceType: 'Usluge informacijske tehnologije', audience: { '@type': 'Audience', audienceType: 'Javni naručitelji' } }
  )],
};

/* ======================================================================
   /primjeri/
   ====================================================================== */
const DEMOS = [
  ['/demo/salon/', 'Beauty salon', 'Asistent odgovara na pitanja o uslugama i cijenama, prima rezervacije 0–24 i šalje podsjetnike, a vlasnica termine vidi odmah u kalendaru.'],
  ['/demo/nekretnine/', 'Nekretnine', 'Asistent odgovara na upite za oglase, postavlja prava pitanja o budžetu i rokovima te zakazuje razgled, a agent dobiva kvalificiran upit sa sažetkom.'],
  ['/demo/apartmani/', 'Apartmani i turizam', 'Asistent odgovara gostima na više jezika, provjerava slobodne datume i šalje upute za dolazak, a vi dobivate upite spremne za potvrdu.'],
  ['/demo/ordinacija/', 'Ordinacija i klinika', 'Asistent odgovara na česta pitanja pacijenata, prima zahtjeve za termin i šalje upute prije pregleda, a hitne slučajeve odmah upućuje na telefon ili 112.'],
  ['/demo/odvjetnik/', 'Odvjetnički ured', 'Asistent prikuplja osnovne podatke o predmetu prije konzultacija, bilježi rokove koje je stranka navela i zakazuje termin, a odvjetnik dobiva sažetak.'],
  ['/demo/agencija/', 'Marketinška agencija', 'Asistent pod vašim brendom kvalificira nove klijente, prikuplja brief i zakazuje uvodni sastanak, a tim dobiva sažetak s budžetom i ciljevima.'],
  ['/demo/opcina/', 'Općina ili grad', 'Asistent odgovara građanima iz službenih dokumenata, upućuje ih na prave obrasce i prima komunalne prijave, a djelatnici dobivaju razvrstane zahtjeve.'],
];

const primjeri = {
  path: '/primjeri/',
  nav: '/primjeri/',
  crumbs: [['/', 'Početna'], [null, 'Primjeri']],
  metaTitle: 'Primjeri AI asistenata po djelatnostima',
  description: 'Isprobajte AI asistenta za beauty salon, nekretnine, apartmane, ordinaciju, odvjetnički ured, agenciju i općinu. Odgovarate kao klijent, a ploča vlasnika puni se sama.',
  h1: 'Primjeri',
  lead: 'Probajte kako izgleda AI asistent za pojedinu djelatnost: odgovarate kao klijent, a ploča vlasnika puni se sama.',
  heroActions: false,
  body: `
        <section class="section" aria-label="Popis primjera">
            <div class="wrap">
                <ul class="demo-list demo-list-rich">
                    ${DEMOS.map(([href, sector, what]) => `<li><a href="${href}"><span class="demo-sector">${sector}</span><span class="demo-what">${what}</span><span class="demo-open">Isprobaj demo</span></a></li>`).join('\n                    ')}
                    <li><a href="/kontakt/"><span class="demo-sector">Vaša djelatnost?</span><span class="demo-what">Opišite kako radite, pa zajedno vidimo kako bi asistent izgledao kod vas.</span><span class="demo-open">Pošalji upit</span></a></li>
                </ul>
                <p class="demo-note">Demo prikazuje osnovni koncept s izmišljenim podacima. Prava verzija radi se prema vašim procesima, sustavima i vizualnom identitetu.</p>
            </div>
        </section>

        <section class="section" aria-labelledby="pravo-title">
            <div class="wrap page-split">
                <div class="prose">
                    <h2 id="pravo-title">Od primjera do pravog asistenta</h2>
                    <p>U pravoj verziji asistent odgovara iz vašeg cjenika, usluga, radnog vremena i čestih pitanja, poštuje pravila koja zajedno zapišemo i upisuje upite tamo gdje ih već pratite: u e-poštu, tablicu, kalendar ili CRM.</p>
                    <p>Može raditi na vašoj web stranici, na WhatsAppu ili na oba mjesta. Kako ga postavljam i od čega se sastoji cijena, pročitajte na stranici <a href="/usluge/ai-chatbot/">AI chatbot i asistent</a>.</p>
                </div>
                <div class="prose">
                    <h2>Web stranice</h2>
                    <p>Uz asistente izrađujem i web stranice za obrte i male tvrtke, od jednostavne stranice za salon ili servis do webshopa. Što je uključeno i koliko košta, pogledajte na stranici <a href="/usluge/izrada-web-stranica/">izrada web stranica</a>.</p>
                </div>
            </div>
        </section>`,
  faq: [
    { q: 'Jesu li primjeri pravi sustavi?', a: 'Primjeri rade s izmišljenim podacima i prikazuju koncept: razgovor s klijentom i ploču vlasnika. Prava verzija povezuje se s vašim podacima, kalendarom i kanalima.' },
    { q: 'Mogu li dobiti primjer za svoju djelatnost?', a: 'Da. Opišite kako radite i koja pitanja klijenti najčešće postavljaju, pa vam pokažem kako bi asistent izgledao kod vas.' },
  ],
  schema: [{
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Primjeri AI asistenata po djelatnostima',
    url: `${SITE}/primjeri/`,
    inLanguage: 'hr',
    about: { '@id': `${SITE}/#obrt` },
  }],
};

/* ======================================================================
   /o-meni/
   ====================================================================== */
const oMeni = {
  path: '/o-meni/',
  nav: null,
  crumbs: [['/', 'Početna'], [null, 'O meni']],
  metaTitle: 'O meni: Marko Škorić, obrt MangAI iz Ploča',
  description: 'MangAI je obrt Marka Škorića iz Ploča. Web stranice, aplikacije i AI rješenja radim sam, od prvog razgovora do predaje i održavanja.',
  h1: 'Jedan čovjek, bez agencijskog procesa',
  lead: 'Ja sam Marko Škorić, a MangAI je moj obrt iz Ploča. Web stranice, aplikacije i AI rješenja radim sam, od prvog razgovora do predaje i održavanja.',
  body: `
        <section class="section" aria-labelledby="zasto-title">
            <div class="wrap page-split">
                <div class="prose">
                    <h2 id="zasto-title">Zašto radim sam</h2>
                    <p>Ne prolazite kroz prodajnog predstavnika, voditelja projekta i podizvođača. Razgovarate sa mnom, ja radim posao i ja za njega odgovaram. Kad nešto ne radi, znate koga nazvati.</p>
                    <h2>Kako koristim AI</h2>
                    <p>Programiram u TypeScriptu, Reactu, Next.js-u, Pythonu i PostgreSQL-u, a AI alate koristim da bih radio brže. Svaku liniju koda i svaki tekst pregledavam prije predaje, a vaše povjerljive podatke ne unosim u alate koji ih koriste za treniranje modela.</p>
                    <h2>Za koga radim</h2>
                    <p>Za obrte, male tvrtke i udruge kojima treba stranica koja dovodi upite ili sustav koji preuzima ponavljajući posao, i za općine, gradove i ustanove kojima trebaju pristupačne stranice i e-usluge za građane.</p>
                    <h2>Gdje radim</h2>
                    <p>Sjedište obrta je u Pločama, u Dubrovačko-neretvanskoj županiji. Većinu posla radim na daljinu za cijelu Hrvatsku, a na sastanke i primopredaju dolazim po dogovoru.</p>
                    <p>Pravila suradnje, od ponude do predaje izvornog koda, napisana su u <a href="/uvjeti-poslovanja.html">uvjetima poslovanja</a>.</p>
                </div>
                <div class="about-plate-wrap">
                    <aside class="plate" aria-label="Podaci o obrtu">
                        <span class="plate-screw tl" aria-hidden="true"></span>
                        <span class="plate-screw tr" aria-hidden="true"></span>
                        <span class="plate-screw bl" aria-hidden="true"></span>
                        <span class="plate-screw br" aria-hidden="true"></span>
                        <p class="plate-name">MANGAI</p>
                        <p class="plate-kind">obrt za računalno programiranje i savjetovanje</p>
                        <p class="plate-kind plate-owner">vl. Marko Škorić</p>
                        <hr>
                        <address class="plate-contact">
                            <span>Vukovarska 5, 20340 Ploče</span>
                            <a href="tel:+385923557476">+385 92 355 7476</a>
                            <a href="mailto:marko@mangai.hr">marko@mangai.hr</a>
                        </address>
                        <p class="plate-note">Radim na daljinu za cijelu Hrvatsku, a po potrebi dolazim na teren.</p>
                    </aside>
                </div>
            </div>
        </section>
${steps(STEPS_DEFAULT, 'Kako radim', 'Isti postupak za mali obrt i za ustanovu, samo s više ili manje papira.')}

        <section class="section" aria-labelledby="alati-title">
            <div class="wrap">
                <div class="section-head">
                    <h2 id="alati-title">Alati s kojima radim</h2>
                </div>
                <ul class="tag-list">
                    <li>Claude</li><li>ChatGPT</li><li>Gemini</li><li>Cursor</li><li>n8n</li><li>Supabase</li><li>PostgreSQL</li><li>Next.js</li><li>React</li><li>TypeScript</li><li>Python</li><li>WhatsApp</li><li>Google Workspace</li><li>Microsoft 365</li><li>WordPress</li><li>WooCommerce</li><li>Docker</li>
                </ul>
            </div>
        </section>`,
  faq: [],
  schema: [
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'O meni',
      url: `${SITE}/o-meni/`,
      inLanguage: 'hr',
      about: { '@id': `${SITE}/#obrt` },
      mainEntity: { '@id': `${SITE}/o-meni/#marko` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': `${SITE}/o-meni/#marko`,
      name: 'Marko Škorić',
      jobTitle: 'Vlasnik i programer',
      worksFor: { '@id': `${SITE}/#obrt` },
      url: `${SITE}/o-meni/`,
      knowsAbout: ['Izrada web stranica', 'AI chatbotovi', 'Automatizacija poslovnih procesa', 'TypeScript', 'React', 'Next.js', 'Python', 'PostgreSQL'],
      address: { '@type': 'PostalAddress', addressLocality: 'Ploče', addressCountry: 'HR' },
    },
  ],
};

/* ======================================================================
   /kontakt/
   ====================================================================== */
const kontakt = {
  path: '/kontakt/',
  nav: null,
  crumbs: [['/', 'Početna'], [null, 'Kontakt']],
  metaTitle: 'Kontakt: pošaljite upit ili nazovite',
  description: 'Pošaljite upit za web stranicu, AI chatbot ili automatizaciju. Telefon +385 92 355 7476, e-pošta marko@mangai.hr, Ploče. Odgovaram unutar jednog do dva radna dana.',
  h1: 'Kontakt',
  lead: 'Napišite ukratko što trebate. Odgovaram unutar jednog do dva radna dana, a prvi razgovor je besplatan.',
  heroActions: false,
  cta: false,
  body: `
        <section class="section" id="contact" aria-label="Kontakt podaci i obrazac">
            <div class="wrap contact-grid">
                <div>
                    <address class="direct">
                        <div><span>Telefon</span><a href="tel:+385923557476">+385 92 355 7476</a></div>
                        <div><span>E-pošta</span><a href="mailto:marko@mangai.hr">marko@mangai.hr</a></div>
                        <div><span>Sjedište</span><strong>Vukovarska 5, 20340 Ploče</strong></div>
                    </address>
                    <div class="advisor">
                        <p>Niste sigurni što vam treba? Savjetnik vam u dva pitanja pomogne opisati upit.</p>
                        <button type="button" class="btn btn-ghost" data-open-chat="1" data-chat-flow="ai_savjetnik">Pokreni savjetnika</button>
                    </div>
                    <div class="prose contact-tips">
                        <h2>Što napisati u upitu</h2>
                        <ul>
                            <li>čime se bavite i tko su vam klijenti,</li>
                            <li>što vam danas oduzima vrijeme ili što nedostaje,</li>
                            <li>imate li već stranicu ili programe koje koristite,</li>
                            <li>okvirni rok i budžet, ako ih znate.</li>
                        </ul>
                        <p>Javni naručitelji mogu poslati poziv na dostavu ponude izravno na e-poštu.</p>
                    </div>
                </div>

                <div class="contact-form-wrapper">
                    <form id="contact-form" class="contact-form" action="https://formsubmit.co/info@mangai.hr" method="POST">
                        <input type="hidden" name="_captcha" value="false">
                        <input type="hidden" name="_subject" value="MangAI – novi upit s weba">
                        <input type="hidden" name="_template" value="table">
                        <input type="hidden" name="_next" value="https://mangai.hr/kontakt/?sent=true#contact">
                        <input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off">

                        <div class="form-group">
                            <label for="name">Ime i prezime</label>
                            <input type="text" id="name" name="ime" autocomplete="name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">E-pošta</label>
                            <input type="email" id="email" name="email" autocomplete="email" required>
                        </div>
                        <div class="form-group">
                            <label for="phone">Telefon <span class="optional">(nije obavezno)</span></label>
                            <input type="tel" id="phone" name="telefon" autocomplete="tel">
                        </div>
                        <div class="form-group">
                            <label for="who">Tko ste</label>
                            <select id="who" name="tko_ste" required>
                                <option value="Obrt ili tvrtka">Obrt ili tvrtka</option>
                                <option value="Udruga ili ustanova">Udruga ili ustanova</option>
                                <option value="Javni naručitelj">Javni naručitelj</option>
                                <option value="Privatna osoba">Privatna osoba</option>
                            </select>
                        </div>
                        <div class="form-group full">
                            <label for="description">Što trebate?</label>
                            <textarea id="description" name="opis" rows="5" required placeholder="Npr. nova web stranica za salon s cijenama i upitima za termin."></textarea>
                        </div>
                        <div class="form-group">
                            <label for="budget">Okvirni budžet <span class="optional">(nije obavezno)</span></label>
                            <select id="budget" name="budzet">
                                <option value="Još ne znam">Još ne znam</option>
                                <option value="Do 1.000 €">Do 1.000 €</option>
                                <option value="1.000–5.000 €">1.000–5.000 €</option>
                                <option value="5.000–15.000 €">5.000–15.000 €</option>
                                <option value="Više od 15.000 €">Više od 15.000 €</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="timeline">Kada želite krenuti <span class="optional">(nije obavezno)</span></label>
                            <select id="timeline" name="pocetak">
                                <option value="Što prije">Što prije</option>
                                <option value="Unutar 3 mjeseca">Unutar 3 mjeseca</option>
                                <option value="Kasnije">Kasnije</option>
                            </select>
                        </div>
                        <p class="form-consent">Podatke koristim samo za odgovor na vaš upit. Više u <a href="/privacy_hr.html">pravilima privatnosti</a>.</p>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Pošalji upit</button>
                            <span class="form-helper">ili nazovite 092 355 7476</span>
                        </div>
                    </form>
                    <div id="contact-success" class="contact-success" role="status" aria-live="polite" hidden>
                        <h2 class="h3">Upit je poslan</h2>
                        <p>Hvala. Javit ću vam se unutar jednog do dva radna dana.</p>
                    </div>
                </div>
            </div>
        </section>`,
  faq: [
    { q: 'Koliko brzo odgovarate?', a: 'Na upite odgovaram unutar jednog do dva radna dana. Za hitne stvari najbrže je nazvati na 092 355 7476.' },
    { q: 'Je li prvi razgovor besplatan?', a: 'Da. Prvi razgovor, telefonom ili uživo, ne naplaćujem i ne obvezuje vas ni na što.' },
  ],
  schema: [{
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Kontakt',
    url: `${SITE}/kontakt/`,
    inLanguage: 'hr',
    mainEntity: { '@id': `${SITE}/#obrt` },
  }],
  scripts: `    <script>
        (function () {
            var form = document.getElementById('contact-form');
            var success = document.getElementById('contact-success');
            var submitBtn = form && form.querySelector('button[type="submit"]');
            var url = new URL(window.location.href);
            if (url.searchParams.get('sent') === 'true' && form && success) {
                form.hidden = true;
                success.hidden = false;
                url.searchParams.delete('sent');
                history.replaceState({}, document.title, url.pathname + url.search + url.hash);
            }
            if (form && submitBtn) {
                form.addEventListener('submit', function () {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Šaljem…';
                });
            }
        })();
    </script>
`,
};

const pages = [usluge, web, chatbot, automatizacija, aplikacije, odrzavanje, javni, primjeri, oMeni, kontakt]
  .map((p) => ({ lastmod: LASTMOD, heroActions: true, cta: true, faq: [], schema: [], scripts: '', ...p }));

module.exports = { pages, PHONE_HREF };
