#!/usr/bin/env python3
"""Dodaje članke iz studenog 2026. u blog/posts.json i en/blog/posts.json (idempotentno).
Pokretanje: python3 scripts/posts-2026-11.py && node scripts/generate-blog.js"""
import json, os

ROOT = os.path.join(os.path.dirname(__file__), '..')

def L(href, text):
    return f'<a href="{href}" rel="noopener">{text}</a>'

GOOGLE_AI = 'https://developers.google.com/search/docs/appearance/ai-features'
OPENAI_BOTS = 'https://developers.openai.com/api/docs/bots'
PPLX_BOTS = 'https://docs.perplexity.ai/docs/resources/perplexity-crawlers'
WA_PRICING = 'https://developers.facebook.com/docs/whatsapp/pricing'
AI_ACT = 'https://eur-lex.europa.eu/legal-content/HR/TXT/?uri=CELEX:32024R1689'
ERACUN = 'https://porezna-uprava.gov.hr/hr/izdavanje-i-primanje-eracuna-i-fiskalizacija-eracuna-azurirano-30-01-2026/8047'
BING_WMT = 'https://www.bing.com/webmasters'
GSC = 'https://search.google.com/search-console'

# =====================================================================
# 1. AI chatbot za web stranicu
# =====================================================================
chatbot_hr = {
 'slug': 'ai-chatbot-za-web-stranicu',
 'title_hr': 'AI chatbot za web stranicu i prodaju: što radi, koliko košta i što provjeriti prije narudžbe',
 'meta_title_hr': 'AI chatbot za web stranicu i prodaju: cijena, integracije i primjeri',
 'meta_description_hr': 'Što AI chatbot za prodaju stvarno radi, što je gotov alat a što rješenje po mjeri, koje integracije su jednostavne (kalendar, e-pošta) a koje ovise o drugima (WhatsApp) i od čega se sastoji cijena.',
 'excerpt_hr': 'Praktičan vodič za vlasnike malih tvrtki: što AI chatbot može i ne može, gotov alat ili rješenje po mjeri, WhatsApp i kalendar, stavke cijene, GDPR i AI Act te osam pitanja prije narudžbe.',
 'date': '2026-11-10',
 'author': 'MangAI',
 'keywords': ['AI chatbot za prodaju', 'AI chatbot za web stranicu', 'chatbot cijena', 'custom AI rješenja', 'AI integracije', 'WhatsApp chatbot'],
 'reading_time_minutes': 9,
 'content_html_hr': f'''<p>AI chatbot za web stranicu je program koji odgovara posjetiteljima na pitanja iz vaših podataka, prikuplja upite i rezervacije te vam šalje sažetak. Dobro postavljen chatbot ne zamjenjuje prodavača, nego preuzima ponavljajuća pitanja i upite koji stižu izvan radnog vremena. U ovom vodiču je pregled onoga što takav sustav stvarno radi, gdje se najbrže isplati, što utječe na cijenu i koja pitanja postaviti prije narudžbe.</p>
<h2>Što AI chatbot radi, a što ne</h2>
<p>Moderni chatbotovi rade na velikim jezičnim modelima, pa razumiju pitanja napisana svojim riječima i odgovaraju prirodno, na hrvatskom i na stranim jezicima. Ključna razlika između dobrog i lošeg chatbota nije model, nego ono iz čega odgovara i pravila koja ga ograničavaju.</p>
<p>Dobar AI chatbot:</p>
<ul>
<li>odgovara iz vaših podataka: cjenika, opisa usluga, radnog vremena, uvjeta i čestih pitanja,</li>
<li>postavlja nekoliko pitanja da upit bude potpun (što, kada, za koga, okvirni budžet),</li>
<li>upisuje upit ili rezervaciju i šalje vam kratak sažetak,</li>
<li>prepušta razgovor čovjeku kad nije siguran ili kad klijent to traži.</li>
</ul>
<p>Ono što chatbot ne bi smio raditi: izmišljati cijene i rokove kojih nema u podacima, obećavati ono što ne može provjeriti, davati pravne ili medicinske savjete i donositi odluke umjesto vas. To se rješava pravilima u postavkama i testiranjem na stvarnim pitanjima prije puštanja u rad.</p>
<h2>Chatbot za prodaju: gdje se najbrže isplati</h2>
<p>Najveći učinak obično je na tri mjesta:</p>
<ol>
<li><strong>Upiti izvan radnog vremena.</strong> Dio klijenata piše navečer i vikendom. Ako odgovor stigne tek sutradan, mnogi su se već javili drugome. Chatbot odgovori odmah i zabilježi upit.</li>
<li><strong>Kvalifikacija upita.</strong> Umjesto deset poruka „koliko košta?“ dobivate upite s potrebnim podacima: što klijent treba, do kada i s kojim budžetom. Na pozive trošite vrijeme samo kad ima smisla.</li>
<li><strong>Rezervacije i termini.</strong> Za salone, ordinacije, apartmane i usluge na terenu chatbot ponudi slobodne termine, upiše ih i pošalje podsjetnik.</li>
</ol>
<p>Kako to izgleda iz perspektive klijenta i vlasnika, možete isprobati u primjerima za {L('/demo/salon/', 'beauty salon')}, {L('/demo/nekretnine/', 'agenciju za nekretnine')} i {L('/demo/apartmani/', 'apartmane')}.</p>
<h2>Gotov alat ili rješenje po mjeri</h2>
<p><strong>Gotov alat</strong> je widget koji se plaća mjesečnom pretplatom. Postavlja se brzo, ali ste ograničeni na integracije i izgled koje alat nudi, a podaci i postavke ostaju kod pružatelja. Dobar je izbor kad trebate samo odgovore na česta pitanja.</p>
<p><strong>Rješenje po mjeri</strong> ima veći početni trošak izrade, ali se povezuje s vašim sustavima, ponaša se prema vašim pravilima, a izvorni kod i podaci ostaju vama. Isplati se kad chatbot treba upisivati podatke u vaš kalendar, tablicu ili CRM, kad imate posebna pravila (npr. različite cijene po sezoni) ili kad su podaci osjetljivi.</p>
<p>Česta srednja varijanta: krenuti s jednim jasnim zadatkom, npr. odgovori na pitanja i prikupljanje upita na web stranici, pa nakon mjesec dana dodati integracije za koje se pokazalo da trebaju.</p>
<h2>Integracije: što je jednostavno, a što ovisi o drugima</h2>
<p>Ovaj dio najčešće određuje i rok i cijenu, pa ga vrijedi razjasniti prije ponude.</p>
<ul>
<li><strong>Jednostavno:</strong> slanje sažetka e-poštom, upis u Google ili Excel tablicu, Google ili Outlook kalendar, obrazac na stranici te CRM i drugi sustavi koji imaju otvoreno sučelje (API).</li>
<li><strong>WhatsApp:</strong> za automatske odgovore treba WhatsApp Business Platform tvrtke Meta, verifikacija tvrtke i broj koji se koristi za to. Prema {L(WA_PRICING, 'Metinom cjeniku')}, od 1. srpnja 2025. naplaćuju se poruke poslane po odobrenom predlošku (marketinške, uslužne i za autentifikaciju), a cijena ovisi o zemlji i vrsti poruke. Obični odgovori unutar 24 sata od klijentove poruke su besplatni. Podsjetnik dan prije termina u pravilu je naplatna poruka po predlošku.</li>
<li><strong>Sustavi za rezervacije:</strong> ako već koristite gotov sustav za termine, sve ovisi o tome nudi li povezivanje. Ako ne nudi, chatbot može slati zahtjev za termin koji vi potvrđujete jednim klikom.</li>
<li><strong>Booking i Airbnb:</strong> slobodni datumi mogu se čitati preko channel managera ili kalendara u iCal formatu. Kalendari se osvježavaju s odmakom, pa je sigurnije da chatbot šalje upit na potvrdu nego da odmah potvrđuje rezervaciju.</li>
</ul>
<h2>Od čega se sastoji cijena</h2>
<p>Cijenu nije moguće pošteno reći bez opsega, ali stavke su uvijek iste. Dobra ponuda svaku navodi zasebno:</p>
<ol>
<li><strong>Izrada i postavljanje</strong> (jednokratno): priprema podataka, pravila ponašanja, izgled, integracije i testiranje.</li>
<li><strong>Korištenje AI modela</strong> (mjesečno, prema broju razgovora): za manju tvrtku obično manji iznos od pretplate na gotov alat, ali raste s prometom.</li>
<li><strong>Hosting</strong> (mjesečno ili godišnje), poželjno u EU.</li>
<li><strong>Poruke vanjskih servisa</strong>, npr. WhatsApp poruke po predlošku ili SMS.</li>
<li><strong>Održavanje</strong>: ažuriranje podataka, nadzor i dorade.</li>
</ol>
<p>Okvirne raspone za gotove alate i rješenja po mjeri opisali smo u članku {L('/blog/ai-automatizacija-poslovanja-hrvatska.html', 'AI automatizacija poslovanja u Hrvatskoj')}.</p>
<h2>GDPR i AI Act: što morate znati</h2>
<p>Chatbot obrađuje osobne podatke čim pita za ime, e-poštu ili broj telefona. Zato vam treba ugovor o obradi podataka s izvođačem, informacija o obradi u politici privatnosti i, gdje god je moguće, hosting i AI servisi u EU. Za zdravstvene i druge osjetljive podatke pravila su stroža i vrijedi ih prikupljati što manje.</p>
<p>Od 2. kolovoza 2026. primjenjuju se obveze transparentnosti iz {L(AI_ACT, 'Akta o umjetnoj inteligenciji')} (čl. 50.): ljudi moraju znati da razgovaraju s AI sustavom, osim kad je to očito iz konteksta. U praksi je dovoljno jasno napisati na početku razgovora da odgovara AI asistent i ponuditi kontakt s čovjekom.</p>
<h2>Osam pitanja prije narudžbe</h2>
<ol>
<li>Iz kojih podataka chatbot odgovara i tko ih ažurira?</li>
<li>Što chatbot radi kad ne zna odgovor?</li>
<li>Koje integracije su uključene u cijenu, a koje nisu?</li>
<li>Koji su mjesečni troškovi nakon izrade i tko ih plaća?</li>
<li>Gdje se čuvaju razgovori i koliko dugo?</li>
<li>Dobivate li izvorni kod i pristup svim računima?</li>
<li>Kako se mjeri uspjeh, npr. broj upita, rezervacija ili ušteđenih sati?</li>
<li>Kako izgleda testiranje prije puštanja u rad?</li>
</ol>
<p>MangAI izrađuje AI chatbotove po mjeri za male tvrtke, obrte i javne naručitelje, a svaka ponuda navodi sve stavke iz ovog članka. <a href="/kontakt/">Opišite ukratko što trebate</a> i dobit ćete pisani prijedlog.</p>
<h2>Izvori</h2>
<ul>
<li>{L(WA_PRICING, 'Pricing on the WhatsApp Business Platform, Meta')}</li>
<li>{L(AI_ACT, 'Uredba (EU) 2024/1689 o umjetnoj inteligenciji, EUR-Lex')}</li>
</ul>''',
 'faq_hr': [
  {'q': 'Koliko košta AI chatbot za web stranicu?', 'a': 'Cijena se sastoji od jednokratne izrade i mjesečnih troškova: korištenja AI modela, hostinga, eventualnih poruka vanjskih servisa (npr. WhatsApp) i održavanja. Gotovi alati plaćaju se pretplatom, a rješenje po mjeri ima veći početni trošak, ali kod i podaci ostaju vama.'},
  {'q': 'Može li AI chatbot raditi na WhatsAppu?', 'a': 'Može, preko Metine WhatsApp Business Platforme. Potrebni su verifikacija tvrtke i poseban broj, a Meta naplaćuje poruke poslane po predlošku, poput podsjetnika. Odgovori unutar 24 sata od klijentove poruke su besplatni.'},
  {'q': 'Što ako chatbot da krivi odgovor?', 'a': 'Rizik se smanjuje tako da chatbot odgovara samo iz vaših podataka, ima jasna pravila što ne smije obećavati i prepušta razgovor čovjeku kad nije siguran. Prije puštanja u rad testira se na stvarnim pitanjima.'},
  {'q': 'Moram li navesti da odgovara AI?', 'a': 'Da. Od 2. kolovoza 2026. Akt o umjetnoj inteligenciji traži da ljudi budu obaviješteni da razgovaraju s AI sustavom, osim kad je to očito iz konteksta.'},
 ],
}

# =====================================================================
# 2. Automatizacija poslovnih procesa: primjeri
# =====================================================================
auto_hr = {
 'slug': 'automatizacija-poslovnih-procesa-primjeri',
 'title_hr': 'Automatizacija poslovnih procesa: 12 primjera za male tvrtke i obrte',
 'meta_title_hr': 'Automatizacija poslovnih procesa: 12 primjera i kako odabrati prvi',
 'meta_description_hr': 'Konkretni primjeri automatizacije poslovnih procesa za male tvrtke i obrte: upiti, ponude, računi, podsjetnici i izvještaji. Kako odabrati prvi proces i kada treba AI, a kada je dovoljno pravilo.',
 'excerpt_hr': 'Dvanaest primjera automatizacije koje male tvrtke i obrti mogu uvesti bez velikog projekta, jednostavan način da odaberete prvi proces i razlika između automatizacije pravilima i AI-a.',
 'date': '2026-11-10',
 'author': 'MangAI',
 'keywords': ['automatizacija poslovnih procesa', 'usluge automatizacije', 'automatizacija procesa primjeri', 'agencija za automatizaciju', 'automatizacija za obrte', 'Make Zapier n8n'],
 'reading_time_minutes': 8,
 'content_html_hr': f'''<p>Automatizacija poslovnih procesa znači da ponavljajuće korake u poslu, poput prepisivanja upita, slanja podsjetnika ili slaganja izvještaja, umjesto vas obavlja softver. Za malu tvrtku ili obrt to ne mora biti veliki projekt: najčešće se krene s jednim procesom koji svaki tjedan oduzima nekoliko sati. U nastavku su primjeri koji se u praksi najčešće isplate i način na koji možete odabrati prvi.</p>
<h2>Automatizacija pravilima ili AI</h2>
<p>Velik dio automatizacije ne treba umjetnu inteligenciju. Ako je pravilo jasno, npr. „kad stigne obrazac, upiši ga u tablicu i pošalji potvrdu“, dovoljan je alat koji izvršava korake redom. Takva automatizacija je jeftina, predvidljiva i lako se održava.</p>
<p>AI ima smisla kad ulaz nije uredan: slobodno napisani upiti, e-pošta koju treba razvrstati, dokumenti iz kojih treba izvući podatke ili odgovori koje treba sastaviti. Najbolji rezultat obično daje kombinacija: AI razumije i razvrsta, a pravila odrađuju ostatak. Više o tome kada AI ima smisla pišemo u članku {L('/blog/ai-automatizacija-poslovanja-hrvatska.html', 'AI automatizacija poslovanja u Hrvatskoj')}.</p>
<h2>Kako odabrati prvi proces</h2>
<p>Zapišite tjedan dana sve što radite ručno i ponavlja se. Za svaki posao procijenite tri stvari:</p>
<ul>
<li><strong>Koliko često se ponavlja</strong> (dnevno, tjedno, mjesečno)?</li>
<li><strong>Koliko vremena traje</strong> svaki put?</li>
<li><strong>Koliko košta greška</strong>, npr. propušten upit, kriv iznos ili zaboravljen rok?</li>
</ul>
<p>Prvi kandidat je posao koji se često ponavlja, traje dulje i u kojem se greške skupo plaćaju, a pravila su mu jasna. Izbjegavajte za početak procese koje svatko radi drugačije, jer ih prvo treba dogovoriti, a tek onda automatizirati.</p>
<h2>12 primjera automatizacije</h2>
<h3>Upiti i prodaja</h3>
<ol>
<li><strong>Upiti s web obrasca u tablicu ili CRM.</strong> Svaki upit automatski se upiše s datumom i izvorom, a vi dobijete obavijest. Nijedan upit se ne izgubi u sandučiću.</li>
<li><strong>Automatski odgovor s korisnim informacijama.</strong> Klijent odmah dobije potvrdu, okvirni rok odgovora i odgovore na najčešća pitanja.</li>
<li><strong>Razvrstavanje upita.</strong> AI pročita upit i označi vrstu usluge, hitnost i grad, pa upit stigne pravoj osobi.</li>
<li><strong>Podsjetnik za ponude bez odgovora.</strong> Ako klijent nije odgovorio na ponudu za sedam dana, stigne vam podsjetnik ili klijentu ljubazna poruka.</li>
</ol>
<h3>Administracija i financije</h3>
<ol start="5">
<li><strong>Ponuda iz predloška.</strong> Iz podataka o upitu automatski se složi nacrt ponude koji samo provjerite i pošaljete.</li>
<li><strong>Podsjetnici za neplaćene račune.</strong> Prema datumu dospijeća šalje se podsjetnik, a vi dobijete popis otvorenih stavki.</li>
<li><strong>Prikupljanje ulaznih računa.</strong> Računi koji stižu e-poštom spremaju se u jednu mapu i tablicu za knjigovođu. Od 1. siječnja 2026. i obveznici izvan sustava PDV-a moraju moći {L(ERACUN, 'zaprimati eRačune')}, a izdavati ih od 1. siječnja 2027., pa je to dobar trenutak da se ovaj tok uredi.</li>
<li><strong>Mjesečni izvještaj.</strong> Broj upita, ponuda, rezervacija ili prodaje skupi se u jedan pregled koji stigne prvog u mjesecu.</li>
</ol>
<h3>Komunikacija s klijentima</h3>
<ol start="9">
<li><strong>Podsjetnici za termine.</strong> Dan prije termina klijent dobije poruku s mogućnošću potvrde ili promjene, a oslobođeni termin se ponudi drugima.</li>
<li><strong>Poruka nakon završenog posla.</strong> Zahvala, upute za korištenje i molba za recenziju na Google profilu.</li>
</ol>
<h3>Interni poslovi</h3>
<ol start="11">
<li><strong>Uvođenje novog klijenta ili djelatnika.</strong> Jednim unosom otvaraju se mapa, zadaci i pristupi koje treba dodijeliti.</li>
<li><strong>Sažeci sastanaka i e-pošte.</strong> AI složi kratak sažetak s dogovorenim zadacima i rokovima.</li>
</ol>
<h2>Kojim alatima</h2>
<p>Za povezivanje gotovih servisa najčešće se koriste alati poput Make, Zapier i n8n te Power Automate u okruženju Microsoft 365. n8n se može instalirati na vlastiti poslužitelj u EU, što je korisno kad su podaci osjetljivi. Kad gotovi alati ne pokrivaju vaš slučaj ili bi pretplate postale skupe, isplati se mala aplikacija po mjeri.</p>
<p>Važnije od alata je da je automatizacija dokumentirana i da znate tko je održava. Svaki tok treba imati obavijest kad nešto ne uspije, inače se greška otkrije tek kad klijent nazove.</p>
<h2>Kako izgleda suradnja</h2>
<ol>
<li><strong>Kratak razgovor</strong> o tome kako sada radite i gdje gubite vrijeme.</li>
<li><strong>Popis procesa</strong> s procjenom uštede i složenosti.</li>
<li><strong>Jedan pilot proces</strong> s fiksnom cijenom i rokom, najčešće gotov za nekoliko tjedana.</li>
<li><strong>Mjerenje</strong> nakon mjesec dana, pa odluka o sljedećem procesu.</li>
</ol>
<p>Tako rizik ostaje malen, a nakon prvog procesa vidite stvarnu uštedu umjesto obećanja. <a href="/kontakt/">Pošaljite upit</a> i navedite posao koji vam najviše smeta, a mi ćemo predložiti kako ga automatizirati.</p>
<h2>Izvori</h2>
<ul>
<li>{L(ERACUN, 'Izdavanje i primanje eRačuna i fiskalizacija eRačuna, Porezna uprava')}</li>
</ul>''',
 'faq_hr': [
  {'q': 'Što je automatizacija poslovnih procesa?', 'a': 'To je prepuštanje ponavljajućih koraka u poslu softveru, npr. upis upita u tablicu, slanje podsjetnika ili slaganje izvještaja. Cilj je manje ručnog rada i manje grešaka, uz ljudsku kontrolu nad odlukama.'},
  {'q': 'Treba li za automatizaciju AI?', 'a': 'Ne uvijek. Kad su pravila jasna, dovoljna je automatizacija pravilima. AI je koristan kad treba razumjeti slobodno napisan tekst, razvrstati poruke ili izvući podatke iz dokumenata.'},
  {'q': 'Koji proces automatizirati prvi?', 'a': 'Onaj koji se često ponavlja, traje dulje, ima jasna pravila i u kojem greške skupo koštaju. Najčešće su to upiti s web stranice, podsjetnici za termine ili podsjetnici za neplaćene račune.'},
  {'q': 'Koliko traje uvođenje automatizacije?', 'a': 'Jedan jasno definiran proces obično je u radu za nekoliko tjedana. Složeniji procesi i povezivanje više sustava rade se u fazama.'},
 ],
}

# =====================================================================
# 3. Vidljivost u AI odgovorima (HR + EN)
# =====================================================================
aeo_hr = {
 'slug': 'vidljivost-u-ai-odgovorima-chatgpt-google',
 'title_hr': 'Kako se pojaviti u odgovorima ChatGPT-a i Googleovog AI sažetka: vodič za male tvrtke',
 'meta_title_hr': 'Vidljivost u AI odgovorima (AEO): ChatGPT, Google AI sažetak i Perplexity',
 'meta_description_hr': 'Kako AI pretraživači biraju izvore, što kaže Google o AI sažecima i kako u osam koraka povećati šansu da vašu tvrtku spomenu ChatGPT, Google i Perplexity. Bez trikova, s provjerenim izvorima.',
 'excerpt_hr': 'Sve više ljudi pita ChatGPT ili Google AI sažetak „koja tvrtka u Hrvatskoj radi…“. Kako AI alati biraju izvore, što stvarno pomaže, a što je mit, i kako izmjeriti rezultat.',
 'date': '2026-11-10',
 'author': 'MangAI',
 'keywords': ['AEO', 'GEO', 'vidljivost u AI odgovorima', 'ChatGPT pretraga', 'Google AI sažetak', 'SEO za AI', 'Perplexity'],
 'reading_time_minutes': 9,
 'content_html_hr': f'''<p>Ljudi sve češće ne upisuju u tražilicu dvije riječi, nego cijelo pitanje: „koja tvrtka radi AI automatizaciju u Hrvatskoj?“ ili „tko radi web stranice za općine?“. Odgovor im daju Googleov AI sažetak, ChatGPT, Perplexity ili Copilot, uz poveznice na nekoliko izvora. Optimizacija za takve odgovore zove se AEO (answer engine optimization) ili GEO (generative engine optimization). Dobra vijest za male tvrtke je da se uglavnom svodi na dobar SEO i jasno napisan sadržaj.</p>
<h2>Kako AI pretraživači biraju izvore</h2>
<p>AI asistenti ne odgovaraju samo „iz glave“. Kad pitanje traži aktualne informacije, pretražuju web i odgovor slažu iz stranica koje su pronašli. Zato vrijedi znati tko koga čita:</p>
<ul>
<li><strong>Google AI sažetak i AI način rada</strong> koriste Googleov indeks. {L(GOOGLE_AI, 'Google navodi')} da za pojavljivanje nema dodatnih zahtjeva ni posebne optimizacije: stranica mora biti indeksirana i smjeti se prikazati s isječkom u rezultatima.</li>
<li><strong>ChatGPT pretraga</strong> koristi OpenAI-jev crawler OAI-SearchBot. Prema {L(OPENAI_BOTS, 'dokumentaciji OpenAI-ja')}, stranice koje ga blokiraju ne prikazuju se u odgovorima ChatGPT pretrage. Crawler GPTBot služi za treniranje modela i postavlja se zasebno.</li>
<li><strong>Perplexity</strong> koristi svoj crawler {L(PPLX_BOTS, 'PerplexityBot')} za pronalaženje i povezivanje stranica u odgovorima.</li>
<li><strong>Microsoft Copilot</strong> oslanja se na tražilicu Bing.</li>
</ul>
<h2>Osam koraka koji stvarno pomažu</h2>
<h3>1. Pustite crawlere na stranicu</h3>
<p>Provjerite datoteku robots.txt i ne blokirajte Googlebot, Bingbot, OAI-SearchBot i PerplexityBot. Ako koristite Cloudflare ili sličnu zaštitu, provjerite i postavke blokiranja AI botova, jer mogu biti uključene bez da ste to primijetili. Ako ne želite da se vaš sadržaj koristi za treniranje modela, možete blokirati GPTBot, a i dalje se pojavljivati u ChatGPT pretrazi.</p>
<h3>2. Prijavite stranicu Googleu i Bingu</h3>
<p>Dodajte stranicu u {L(GSC, 'Google Search Console')} i {L(BING_WMT, 'Bing Webmaster Tools')} te pošaljite kartu stranice (sitemap.xml). Bing podržava i IndexNow, kojim tražilicu odmah obavijestite o novoj ili izmijenjenoj stranici.</p>
<h3>3. Ažurirajte Google profil tvrtke</h3>
<p>Google među preporukama izričito navodi ažurne podatke u Google profilu tvrtke. Kategorija, usluge, područje rada, radno vrijeme i opis trebaju se poklapati s onim na stranici. AI sažeci i karte često uzimaju podatke upravo odatle.</p>
<h3>4. Odgovorite na pitanje odmah</h3>
<p>Ako netko pita „koliko traje izrada web stranice?“, odgovor treba biti u prvoj rečenici ispod naslova, a objašnjenje nakon toga. Naslovi u obliku pitanja i kratka sekcija s čestim pitanjima pomažu i ljudima i AI-u da brzo pronađu odgovor. Pogledajte kakva pitanja ljudi postavljaju u izvješću o izvedbi u Search Consoleu: sve češće su to cijele rečenice.</p>
<h3>5. Budite konkretni</h3>
<p>AI alati radije citiraju stranice koje jasno kažu tko ste, što radite, za koga, gdje i pod kojim uvjetima. Rečenica „pružamo inovativna digitalna rješenja“ ne odgovara ni na jedno pitanje. „Izrađujemo web stranice za općine u skladu sa Zakonom o pristupačnosti, rok 4 do 8 tjedana“ odgovara na tri.</p>
<h3>6. Dodajte strukturirane podatke, ali iskreno</h3>
<p>Google kaže da za AI sažetke ne treba posebna schema.org oznaka. Strukturirani podaci o tvrtki, člancima i čestim pitanjima ipak pomažu tražilicama da razumiju stranicu. Važno je da se poklapaju s vidljivim sadržajem.</p>
<h3>7. Budite spomenuti i izvan svoje stranice</h3>
<p>Kad AI slaže popis tvrtki koje rade nešto, oslanja se na više izvora. Pomaže vas spominjanje u poslovnim imenicima, strukovnim udruženjima, lokalnim medijima, na stranicama partnera i u recenzijama na Google profilu. Neka podaci svugdje budu isti: naziv, mjesto, kontakt i opis djelatnosti.</p>
<h3>8. Mjerite rezultat</h3>
<p>Promet iz Googleovih AI značajki uključen je u izvješće o izvedbi u Search Consoleu. Posjeti iz ChatGPT-a u analitici se obično vide kao izvor chatgpt.com. Jednom mjesečno postavite ChatGPT-u, Perplexityju i Googleu nekoliko pitanja koja postavljaju vaši klijenti i zabilježite spominju li vas i koje stranice citiraju.</p>
<h2>Što ne pomaže</h2>
<ul>
<li><strong>Posebne „AI datoteke“.</strong> Google navodi da za AI sažetke ne trebaju nove strojno čitljive datoteke. Datoteke poput llms.txt ne štete, ali nema potvrde da ih veliki pretraživači koriste za odabir izvora.</li>
<li><strong>Masovno generirani članci.</strong> Deseci sličnih tekstova bez nove vrijednosti mogu se smatrati spamom i naštetiti cijeloj stranici. Bolje je napisati manje članaka koji odgovaraju na stvarna pitanja klijenata.</li>
<li><strong>Skriveni tekst i nabrajanje ključnih riječi.</strong> To nije pomagalo ni u klasičnom SEO-u.</li>
</ul>
<h2>A ako ne želite da AI prikazuje neki sadržaj</h2>
<p>Google podržava oznake nosnippet, data-nosnippet i max-snippet kojima ograničavate što se prikazuje u rezultatima i AI sažecima, a noindex potpuno isključuje stranicu iz pretrage. Za OpenAI se pristup uređuje u robots.txt, posebno za pretragu i posebno za treniranje.</p>
<p>MangAI izrađuje brze web stranice s urednim strukturiranim podacima i sadržajem pisanim za stvarna pitanja klijenata. <a href="/kontakt/">Pošaljite upit</a> za pregled vidljivosti vaše stranice.</p>
<h2>Izvori</h2>
<ul>
<li>{L(GOOGLE_AI, 'AI features and your website, Google Search Central')}</li>
<li>{L(OPENAI_BOTS, 'Overview of OpenAI Crawlers, OpenAI')}</li>
<li>{L(PPLX_BOTS, 'Perplexity Crawlers, Perplexity')}</li>
</ul>''',
 'faq_hr': [
  {'q': 'Što je AEO?', 'a': 'AEO (answer engine optimization) je prilagodba sadržaja kako bi ga AI asistenti i tražilice s AI odgovorima, poput ChatGPT-a i Googleova AI sažetka, lakše pronašli, razumjeli i citirali. Uglavnom se svodi na dobar SEO i jasne odgovore na pitanja klijenata.'},
  {'q': 'Treba li posebna optimizacija za Googleov AI sažetak?', 'a': 'Prema Googleu, ne. Stranica mora biti indeksirana i smjeti se prikazati s isječkom u rezultatima, a vrijede iste preporuke kao za klasični SEO.'},
  {'q': 'Kako se pojaviti u ChatGPT pretrazi?', 'a': 'Ne blokirajte crawler OAI-SearchBot u robots.txt, neka stranica bude indeksirana i jasno odgovara na pitanja. Blokiranje GPTBot-a za treniranje ne utječe na pojavljivanje u pretrazi.'},
  {'q': 'Kako izmjeriti vidljivost u AI odgovorima?', 'a': 'Promet iz Googleovih AI značajki vidi se u Search Consoleu, a posjeti iz ChatGPT-a u analitici kao izvor chatgpt.com. Korisno je i jednom mjesečno postaviti AI alatima pitanja koja postavljaju vaši klijenti i bilježiti spominju li vas.'},
 ],
}

aeo_en = {
 'slug': 'vidljivost-u-ai-odgovorima-chatgpt-google',
 'title_en': 'How to show up in ChatGPT and Google AI Overviews: a guide for small businesses in Croatia',
 'meta_title_en': 'AI search visibility (AEO) for small businesses in Croatia',
 'meta_description_en': 'How AI search tools choose their sources, what Google says about AI Overviews, and eight practical steps to make ChatGPT, Google and Perplexity more likely to mention your business.',
 'excerpt_en': 'More people ask ChatGPT or Google “which company in Croatia does…”. How AI tools pick sources, what actually helps, what is a myth, and how to measure results.',
 'date': '2026-11-10',
 'author': 'MangAI',
 'keywords': ['AEO', 'GEO', 'AI search visibility', 'ChatGPT search', 'Google AI Overviews', 'SEO Croatia'],
 'reading_time_minutes': 8,
 'content_html_en': f'''<p>People increasingly type a whole question instead of two keywords: “which company does AI automation in Croatia?” or “what affordable consultants can improve my visibility in AI chat results?”. The answer comes from Google AI Overviews, ChatGPT, Perplexity or Copilot, with links to a few sources. Optimising for these answers is called AEO (answer engine optimisation) or GEO (generative engine optimisation). The good news for small businesses: it mostly comes down to solid SEO and clearly written content.</p>
<h2>How AI search tools choose sources</h2>
<p>When a question needs current information, AI assistants search the web and build the answer from the pages they find. So it helps to know who reads what:</p>
<ul>
<li><strong>Google AI Overviews and AI Mode</strong> use Google’s index. {L(GOOGLE_AI, 'Google says')} there are no additional requirements or special optimisations: a page must be indexed and eligible to be shown with a snippet.</li>
<li><strong>ChatGPT search</strong> uses OpenAI’s OAI-SearchBot. According to {L(OPENAI_BOTS, 'OpenAI’s documentation')}, sites that opt out of it are not shown in ChatGPT search answers. GPTBot is used for model training and is controlled separately.</li>
<li><strong>Perplexity</strong> uses its own crawler, {L(PPLX_BOTS, 'PerplexityBot')}, to find and link pages in its answers.</li>
<li><strong>Microsoft Copilot</strong> relies on Bing.</li>
</ul>
<h2>Eight steps that actually help</h2>
<h3>1. Let the crawlers in</h3>
<p>Check robots.txt and do not block Googlebot, Bingbot, OAI-SearchBot or PerplexityBot. If you use Cloudflare or a similar service, also check its AI bot blocking settings. You can block GPTBot to keep your content out of training and still appear in ChatGPT search.</p>
<h3>2. Submit your site to Google and Bing</h3>
<p>Add the site to {L(GSC, 'Google Search Console')} and {L(BING_WMT, 'Bing Webmaster Tools')} and submit your sitemap. Bing also supports IndexNow, which notifies it immediately about new or changed pages.</p>
<h3>3. Keep your Google Business Profile up to date</h3>
<p>Google explicitly recommends keeping Business Profile information current. Category, services, service area, hours and description should match your website.</p>
<h3>4. Answer the question straight away</h3>
<p>If someone asks “how long does a website take?”, the answer belongs in the first sentence under the heading, with the explanation after it. Question-style headings and a short FAQ help both people and AI find the answer. Look at the queries in your Search Console performance report: more and more of them are full sentences.</p>
<h3>5. Be specific</h3>
<p>AI tools prefer pages that clearly say who you are, what you do, for whom, where and on what terms. “We provide innovative digital solutions” answers nothing. “We build accessible websites for municipalities, delivered in 4 to 8 weeks” answers three questions.</p>
<h3>6. Add honest structured data</h3>
<p>Google says no special schema.org markup is needed for AI features. Structured data about your business, articles and FAQs still helps search engines understand the page, as long as it matches the visible content.</p>
<h3>7. Get mentioned beyond your own site</h3>
<p>When AI compiles a list of companies, it draws on several sources: business directories, industry associations, local media, partner sites and reviews. Keep your name, location, contact and description consistent everywhere.</p>
<h3>8. Measure</h3>
<p>Traffic from Google’s AI features is included in the Search Console performance report. Visits from ChatGPT usually show up in analytics with chatgpt.com as the source. Once a month, ask ChatGPT, Perplexity and Google the questions your customers ask and note whether you are mentioned and which pages are cited.</p>
<h2>What does not help</h2>
<ul>
<li><strong>Special “AI files”.</strong> Google says no new machine-readable files are needed. Files such as llms.txt do no harm, but there is no confirmation that major search tools use them to pick sources.</li>
<li><strong>Mass-produced articles.</strong> Dozens of similar texts with no new value can be treated as spam and hurt the whole site.</li>
<li><strong>Hidden text and keyword stuffing.</strong> These did not work in classic SEO either.</li>
</ul>
<h2>Limiting what AI shows</h2>
<p>Google supports nosnippet, data-nosnippet and max-snippet to limit what appears in results and AI features, while noindex removes a page from search entirely. For OpenAI, access is set in robots.txt, separately for search and for training.</p>
<p>MangAI builds fast websites with clean structured data and content written around real customer questions. <a href="/en/#contact">Send an enquiry</a> for a review of your site’s visibility.</p>
<h2>Sources</h2>
<ul>
<li>{L(GOOGLE_AI, 'AI features and your website, Google Search Central')}</li>
<li>{L(OPENAI_BOTS, 'Overview of OpenAI Crawlers, OpenAI')}</li>
<li>{L(PPLX_BOTS, 'Perplexity Crawlers, Perplexity')}</li>
</ul>''',
 'faq_en': [
  {'q': 'What is AEO?', 'a': 'AEO (answer engine optimisation) means making your content easy for AI assistants and AI search features, such as ChatGPT and Google AI Overviews, to find, understand and cite. It mostly comes down to good SEO and clear answers to customer questions.'},
  {'q': 'Do I need special optimisation for Google AI Overviews?', 'a': 'According to Google, no. A page must be indexed and eligible for a snippet, and the usual SEO best practices apply.'},
  {'q': 'How do I appear in ChatGPT search?', 'a': 'Do not block OAI-SearchBot in robots.txt, make sure the site is indexed and answers questions clearly. Blocking GPTBot for training does not affect search visibility.'},
 ],
}

def upsert(path, items):
    data = json.load(open(path, encoding='utf-8'))
    for it in items:
        data = [d for d in data if d['slug'] != it['slug']]
        data.insert(0, it)
    data.sort(key=lambda d: d.get('date', ''), reverse=True)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write('\n')

upsert(os.path.join(ROOT, 'blog/posts.json'), [auto_hr, chatbot_hr, aeo_hr])
upsert(os.path.join(ROOT, 'en/blog/posts.json'), [aeo_en])
print('ok')
