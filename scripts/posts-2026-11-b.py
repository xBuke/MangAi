#!/usr/bin/env python3
"""SEO val 2 (iz analize konkurencije): proširuje članak s primjerima na 15, dodaje članke
o cijeni AI automatizacije, AI chatbotu za apartmane i AI asistentu za obrt (idempotentno).
Pokretanje: python3 scripts/posts-2026-11-b.py && node scripts/generate-blog.js
Napomena: pokretati NAKON posts-2026-11.py (taj skript vraća staru verziju članka s 12 primjera)."""
import json, os

ROOT = os.path.join(os.path.dirname(__file__), '..')
PATH = os.path.join(ROOT, 'blog/posts.json')
TODAY = '2026-11-19'

CTA = '''<h2>Pošaljite opis, ponuda stiže pismeno</h2>
<p>Najbrži put do ponude je kratak opis. Napišite mi na <a href="mailto:marko@mangai.hr">marko@mangai.hr</a> ili kroz <a href="/kontakt/">obrazac za kontakt</a>: koji posao radite ručno, koliko se često ponavlja, koje programe koristite i što biste htjeli da preuzme sustav. Na upit odgovaram unutar jednog do dva radna dana, a ponuda stiže pismeno s cijenom i rokom. Što je opis točniji, to je ponuda brža i preciznija.</p>'''

data = json.load(open(PATH, encoding='utf-8'))

# ---------------------------------------------------------------- 1) 12 -> 15 primjera
for p in data:
    if p['slug'] != 'automatizacija-poslovnih-procesa-primjeri':
        continue
    p['title_hr'] = 'AI automatizacija poslovanja: 15 primjera za male tvrtke i obrte'
    p['meta_title_hr'] = 'AI automatizacija poslovanja: 15 primjera i kako odabrati prvi'
    p['meta_description_hr'] = 'Konkretni primjeri AI automatizacije poslovanja za male tvrtke i obrte: upiti, ponude, obrada računa, podsjetnici i izvještaji. Kako odabrati prvi proces i kad treba AI, a kad je dovoljno pravilo.'
    p['excerpt_hr'] = 'Petnaest primjera automatizacije koje male tvrtke i obrti mogu uvesti bez velikog projekta, jednostavan način da odaberete prvi proces i razlika između automatizacije pravilima i AI-a.'
    p['reading_time_minutes'] = 9
    p['updated'] = TODAY
    for k in ['AI automatizacija poslovanja primjeri', 'AI obrada računa', 'AI automatizacija za male tvrtke']:
        if k not in p['keywords']:
            p['keywords'].append(k)
    h = p['content_html_hr']
    if '<h2>15 primjera automatizacije</h2>' not in h:
        assert '<h2>12 primjera automatizacije</h2>' in h
        h = h.replace('<h2>12 primjera automatizacije</h2>', '<h2>15 primjera automatizacije</h2>')
        novo = '''<h3>Dokumenti i podaci</h3>
<ol start="13">
<li><strong>AI obrada računa i narudžbi.</strong> AI iz PDF-a, slike ili e-pošte izvuče dobavljača, iznos, datum i stavke i upiše ih u tablicu. Vi samo provjerite ono što sustav označi kao nesigurno.</li>
<li><strong>Prijedlozi odgovora na česta pitanja u e-pošti.</strong> AI pripremi odgovor iz vaših podataka, a vi ga pročitate, ispravite i pošaljete. Osjetljivi odgovori ostaju kod vas.</li>
<li><strong>Obavijest o rokovima.</strong> Istek ugovora, certifikata, servisa ili jamstva upisuje se u tablicu, a prije isteka stiže podsjetnik s popisom što treba obnoviti.</li>
</ol>
'''
        marker = '<h2>Kojim alatima</h2>'
        assert marker in h
        h = h.replace(marker, novo + marker)
        h = h.replace('Prvi kandidat je posao koji se često ponavlja', 'Prvi kandidat je posao koji se često ponavlja', 1)
        p['content_html_hr'] = h
    p['faq_hr'] = [f for f in p['faq_hr'] if 'AI obrada' not in f['q']] + [
        {'q': 'Može li AI automatski obrađivati račune?', 'a': 'Da. AI može iz računa u PDF-u, slici ili e-pošti izvući dobavljača, iznos, datum i stavke i upisati ih u tablicu ili program. Sve što je sustav označio kao nesigurno provjeravate vi prije knjiženja.'}
    ]

# ---------------------------------------------------------------- 2) cijena AI automatizacije
cijena = {
 'slug': 'cijena-ai-automatizacije-poslovanja',
 'title_hr': 'Cijena AI automatizacije poslovanja: od čega se sastoji i kako procijeniti isplati li se',
 'meta_title_hr': 'Cijena AI automatizacije poslovanja: što utječe na iznos',
 'meta_description_hr': 'Od čega se sastoji cijena AI automatizacije poslovanja, što je jednokratni a što mjesečni trošak i kako izračunati isplati li se. Pošaljite opis, ponuda stiže pismeno.',
 'excerpt_hr': 'Cijena AI automatizacije ovisi o procesu, a ne o „AI-ju“ kao takvom. Pregled stavki koje čine cijenu, mjesečnih troškova i jednostavan izračun isplati li se ulaganje.',
 'date': TODAY,
 'author': 'MangAI',
 'keywords': ['cijena AI automatizacije', 'cijena automatizacije poslovanja', 'koliko košta AI automatizacija', 'AI automatizacija cijena Hrvatska', 'isplati li se AI automatizacija', 'usluge automatizacije'],
 'reading_time_minutes': 7,
 'content_html_hr': f'''<p>Pitanje „koliko košta AI automatizacija?“ nema jedan odgovor, jer se ne kupuje jedan proizvod nego rješenje za konkretan posao. Zato ovdje nema cjenika, nego popis onoga što cijenu određuje, što se plaća jednokratno, što mjesečno i kako sami možete izračunati isplati li se. S tim možete usporediti bilo koju ponudu, uključujući našu.</p>
<h2>Što najviše utječe na cijenu</h2>
<ul>
<li><strong>Broj i složenost procesa.</strong> Jedan jasan proces, npr. upiti s web obrasca u tablicu uz automatski odgovor, bitno je manji posao od povezivanja pet procesa koji ovise jedan o drugome.</li>
<li><strong>Broj sustava koje treba povezati.</strong> E-pošta, tablice i kalendar povezuju se jednostavno. ERP, računovodstveni program ili stariji sustav bez API-ja traže više posla.</li>
<li><strong>Kvaliteta ulaznih podataka.</strong> Urednu tablicu lako je obraditi. Skenirani dokumenti, rukom pisani podaci i nedosljedni nazivi traže dodatnu pripremu i provjere.</li>
<li><strong>Koliko je AI uopće potreban.</strong> Gdje su pravila jasna, dovoljna je obična automatizacija i AI se ne plaća. AI dodaje trošak tek ondje gdje treba razumjeti slobodan tekst ili izvući podatke iz dokumenata.</li>
<li><strong>Razina nadzora.</strong> Osjetljive korake, poput slanja ponude klijentu ili plaćanja, sustav priprema, a vi odobravate. Što je više odobravanja i iznimki, to je rješenje složenije.</li>
</ul>
<h2>Jednokratni i ponavljajući troškovi</h2>
<p>Uz izradu računajte i troškove koji dolaze nakon nje:</p>
<ul>
<li><strong>Izrada i postavljanje:</strong> analiza procesa, izrada, testiranje na stvarnim podacima i predaja s dokumentacijom.</li>
<li><strong>Licence alata:</strong> neki alati za povezivanje naplaćuju se mjesečno prema broju izvršenja. Neki se mogu postaviti na vlastiti poslužitelj, što mijenja strukturu troška.</li>
<li><strong>Korištenje AI modela:</strong> naplaćuje se prema količini obrađenog teksta. Za mali obujam to je obično malen dio ukupnog troška, ali ga treba procijeniti unaprijed.</li>
<li><strong>Održavanje:</strong> servisi povremeno mijenjaju svoja sučelja pa automatizaciju treba nadzirati i prilagođavati. Dogovorite tko to radi.</li>
</ul>
<h2>Kako izračunati isplati li se</h2>
<p>Jednostavan račun dovoljan je za prvu odluku:</p>
<ol>
<li>Izmjerite koliko sati tjedno posao danas oduzima, jedan tjedan stvarno zapisujte.</li>
<li>Pomnožite sate s vrijednošću vašeg sata rada (ili sata djelatnika koji to radi).</li>
<li>Usporedite godišnju uštedu s ukupnim troškom kroz godinu dana: izrada plus mjesečni troškovi.</li>
<li>Dodajte ono što se teže mjeri: manje propuštenih upita, manje grešaka, brži odgovor klijentima.</li>
</ol>
<p>Ako račun ne ide u prilog automatizaciji, bolje je to znati prije početka. Takav izračun radimo zajedno prije ponude. Više o tome pišemo u članku <a href="/blog/ai-implementacija-plan-roi-hrvatska.html">AI implementacija i ROI za male tvrtke</a>.</p>
<h2>Na što paziti u ponudama</h2>
<ul>
<li><strong>Je li opseg jasno opisan?</strong> Ponuda treba reći što točno automatizacija radi, a što ne.</li>
<li><strong>Tko je vlasnik rješenja?</strong> Provjerite dobivate li pristupne podatke, dokumentaciju i po potrebi izvorni kod.</li>
<li><strong>Što je s greškama?</strong> Dobro rješenje javlja kad neki korak ne prođe, umjesto da greška ostane skrivena.</li>
<li><strong>Što se događa s podacima?</strong> Pitajte koriste li se poslovni API-ji koji ne koriste vaše podatke za treniranje modela i sklapa li se ugovor o obradi podataka.</li>
<li><strong>Postoji li pilot?</strong> Jedan proces s fiksnim opsegom i rokom manji je rizik od velikog projekta unaprijed.</li>
</ul>
<h2>Kako krenuti s malim rizikom</h2>
<p>Najpametniji prvi korak je jedan proces koji je čest, dosadan i svaki put isti. Primjere možete pogledati u članku <a href="/blog/automatizacija-poslovnih-procesa-primjeri.html">AI automatizacija poslovanja: 15 primjera</a>, a pregled usluge je na stranici <a href="/usluge/ai-automatizacija/">AI automatizacija poslovanja</a>. Nakon pilota i mjesec dana mjerenja odlučujete o sljedećem procesu na temelju stvarnih brojki.</p>
{CTA}''',
 'faq_hr': [
  {'q': 'Zašto nemate fiksni cjenik AI automatizacije?', 'a': 'Jer cijena ovisi o procesu: broju koraka, sustava koje treba povezati i kvaliteti podataka. Zato prvo prođemo vaš proces, a zatim dobivate pismenu ponudu s cijenom i rokom.'},
  {'q': 'Koji su mjesečni troškovi nakon izrade?', 'a': 'Mogući su licence alata za povezivanje, naplata korištenja AI modela prema količini obrađenog teksta i održavanje. Sve se procijeni unaprijed i navede u ponudi.'},
  {'q': 'Može li se krenuti s jednim procesom?', 'a': 'Da, i preporučuje se. Jedan jasno određen proces s fiksnim opsegom i rokom smanjuje rizik, a nakon mjerenja odlučujete o sljedećem koraku.'},
  {'q': 'Koliko brzo mogu dobiti ponudu?', 'a': 'Na upit odgovaram unutar jednog do dva radna dana. Što je opis posla točniji, to je ponuda brža, a stiže pismeno s cijenom i rokom.'}
 ],
}

# ---------------------------------------------------------------- 3) chatbot za apartmane
apartmani = {
 'slug': 'ai-chatbot-za-apartmane',
 'title_hr': 'AI chatbot za apartmane i iznajmljivače: što može preuzeti od gostiju i što provjeriti',
 'meta_title_hr': 'AI chatbot za apartmane: gosti dobivaju odgovor 0–24',
 'meta_description_hr': 'AI chatbot za apartmane odgovara gostima na hrvatskom, engleskom, njemačkom i talijanskom iz vaših podataka, 0–24. Što može preuzeti, što ne smije i kako do ponude.',
 'excerpt_hr': 'Gosti pitaju isto: parking, check-in, Wi-Fi, plaža, cijena. AI chatbot na stranici apartmana odgovara iz vaših podataka na jeziku gosta, a vama šalje sažetak upita.',
 'date': TODAY,
 'author': 'MangAI',
 'keywords': ['AI chatbot za apartmane', 'chatbot za iznajmljivače', 'chatbot za turizam', 'AI asistent za apartmane', 'odgovori gostima automatski', 'chatbot za web stranicu apartmana'],
 'reading_time_minutes': 6,
 'content_html_hr': f'''<p>Iznajmljivači znaju da se isti upiti ponavljaju cijelu sezonu, često usred večeri ili vikendom, na više jezika. Dobro postavljen <a href="/usluge/ai-chatbot/">AI chatbot</a> na stranici apartmana preuzima taj dio posla: gost dobije odgovor odmah, a vama stiže sažetak ozbiljnih upita.</p>
<h2>Što gosti najčešće pitaju</h2>
<ul>
<li>ima li parking i je li besplatan,</li>
<li>kako i kada je prijava (check-in) i odjava (check-out),</li>
<li>ima li Wi-Fi, klima uređaj, perilica, kuhinja,</li>
<li>jesu li dopušteni kućni ljubimci,</li>
<li>koliko je plaža ili trgovina udaljena,</li>
<li>je li termin slobodan i kako poslati upit.</li>
</ul>
<p>Na sva pitanja iz prva četiri retka odgovor je isti za svakog gosta, pa ga chatbot može dati iz podataka koje ste mu vi dali.</p>
<h2>Što chatbot radi za vas</h2>
<ul>
<li><strong>Odgovara 0–24</strong> iz vaših podataka: opis smještaja, kućni red, upute za dolazak, okolica.</li>
<li><strong>Odgovara na jeziku gosta</strong>: hrvatski, engleski, njemački, talijanski i drugi, što je u turizmu posebno korisno.</li>
<li><strong>Prima upite</strong> za termin i šalje vam sažetak e-poštom ili u tablicu, tako da ništa ne propadne usred sezone.</li>
<li><strong>Zna svoje granice.</strong> Kad ne zna odgovor, ne izmišlja, nego predlaže da vas gost nazove ili ostavi kontakt.</li>
</ul>
<h2>Što chatbot ne bi smio raditi sam</h2>
<p>Cijene, dostupnost i potvrda rezervacije ostaju pod vašom kontrolom. Chatbot može prikupiti datum, broj osoba i kontakt, a potvrdu šaljete vi, osim ako ste s njim dogovorili drukčije. Isto vrijedi za odgovore koji traže procjenu (kašnjenje, reklamacija, izuzetak): njih sustav priprema, a odlučujete vi.</p>
<h2>Što provjeriti prije narudžbe</h2>
<ul>
<li>Odgovara li chatbot samo iz vaših podataka, a ne „iz glave“?</li>
<li>Što radi kad ne zna odgovor?</li>
<li>Možete li sami vidjeti razgovore i sažetke?</li>
<li>Može li se dodati na stranicu koju već imate, ili treba nova?</li>
<li>Kako se obrađuju osobni podaci gostiju?</li>
</ul>
<p>Općenitije o chatbotovima, što rade i koliko koštaju, pročitajte u članku <a href="/blog/ai-chatbot-za-web-stranicu.html">AI chatbot za web stranicu i prodaju</a>. Ako vam treba i stranica za apartmane, pogledajte <a href="/usluge/izrada-web-stranica/">izradu web stranica</a>.</p>
{CTA}''',
 'faq_hr': [
  {'q': 'Može li chatbot odgovarati gostima na njemačkom i talijanskom?', 'a': 'Da. Odgovara na jeziku na kojem mu gost piše: hrvatskom, engleskom, njemačkom, talijanskom i drugima.'},
  {'q': 'Može li se chatbot dodati na stranicu apartmana koju već imam?', 'a': 'Da. Dodaje se na većinu postojećih stranica, uključujući WordPress, bez izrade nove stranice.'},
  {'q': 'Što ako chatbot ne zna odgovor?', 'a': 'Ne izmišlja. Ponudi da vas gost nazove ili ostavi kontakt, a vama stiže sažetak upita.'},
  {'q': 'Tko potvrđuje rezervaciju?', 'a': 'Potvrdu i cijenu najčešće potvrđujete vi. Chatbot prikuplja podatke o terminu i kontakt, a drukčije se može dogovoriti.'}
 ],
}

# ---------------------------------------------------------------- 4) AI asistent za obrt
obrt = {
 'slug': 'ai-asistent-za-obrt-i-malu-tvrtku',
 'title_hr': 'AI asistent za obrt i malu tvrtku: što može preuzeti, a što treba ostati vama',
 'meta_title_hr': 'AI asistent za obrt i malu tvrtku: što stvarno preuzima',
 'meta_description_hr': 'Što AI asistent može preuzeti u obrtu ili maloj tvrtki: odgovore na upite, ponude, podsjetnike i obradu računa. Što ostaje vama i kako krenuti s jednim poslom.',
 'excerpt_hr': 'AI asistent nije zamjena za vas, nego za ponavljajući posao: odgovori na upite, podsjetnici, ponude i unos podataka. Pregled što ima smisla preuzeti i kako krenuti.',
 'date': TODAY,
 'author': 'MangAI',
 'keywords': ['AI asistent za obrt', 'AI asistent za tvrtke', 'AI za male tvrtke', 'AI usluge', 'poslovni AI asistent', 'AI za obrtnike'],
 'reading_time_minutes': 6,
 'content_html_hr': f'''<p>Vlasnik obrta ili male tvrtke najčešće sam odgovara na upite, piše ponude, šalje podsjetnike i prepisuje podatke, a usput radi svoj stvarni posao. <strong>AI asistent</strong> je način da dio tog ponavljajućeg posla preuzme sustav, a odluke ostanu kod vas.</p>
<h2>Što AI asistent može preuzeti</h2>
<ul>
<li><strong>Odgovore na česta pitanja</strong> klijenata, na web stranici ili WhatsAppu, iz vaših podataka (<a href="/usluge/ai-chatbot/">AI chatbot i asistent</a>).</li>
<li><strong>Prikupljanje upita</strong>: upit se upiše u tablicu ili CRM, razvrsta i dodijeli, a vi dobijete obavijest.</li>
<li><strong>Nacrte ponuda i odgovora</strong> koje samo pročitate, ispravite i pošaljete.</li>
<li><strong>Podsjetnike</strong> za termine, neplaćene račune i redovite servise.</li>
<li><strong>Unos podataka iz dokumenata</strong>: računi, narudžbe i e-pošta pretvore se u redove u tablici (<a href="/usluge/ai-automatizacija/">AI automatizacija poslovanja</a>).</li>
<li><strong>Tjedni ili mjesečni pregled</strong> brojki na jednom mjestu.</li>
</ul>
<h2>Što treba ostati vama</h2>
<ul>
<li>cijene, popusti i izuzeci,</li>
<li>potvrda ponude i ugovora,</li>
<li>plaćanja i sve što se ne može poništiti,</li>
<li>odgovori na reklamacije i osjetljive razgovore.</li>
</ul>
<p>Sustav takve korake priprema, a vi odobravate. Tako dobivate brzinu bez rizika da asistent „obeća“ nešto u vaše ime.</p>
<h2>Kako krenuti</h2>
<ol>
<li>Tjedan dana zapisujte što radite ručno i ponavlja se.</li>
<li>Odaberite jedan posao koji je čest, dosadan i svaki put isti.</li>
<li>Izračunajte koliko sati tjedno oduzima i je li ušteda veća od ulaganja.</li>
<li>Počnite s jednim asistentom ili jednom automatizacijom, pa tek onda širite.</li>
</ol>
<p>Konkretne primjere nalazite u članku <a href="/blog/automatizacija-poslovnih-procesa-primjeri.html">AI automatizacija poslovanja: 15 primjera</a>, a o cijeni u članku <a href="/blog/cijena-ai-automatizacije-poslovanja.html">cijena AI automatizacije poslovanja</a>. Ako vam prvo treba web stranica, pogledajte <a href="/blog/web-stranica-za-obrt-i-malu-tvrtku.html">web stranicu za obrt i malu tvrtku</a>.</p>
{CTA}''',
 'faq_hr': [
  {'q': 'Što je AI asistent za tvrtku?', 'a': 'To je softver koji preuzima ponavljajući posao, poput odgovora na česta pitanja, prikupljanja upita, nacrta ponuda i podsjetnika. Odluke i osjetljivi koraci ostaju kod vas.'},
  {'q': 'Treba li mi AI asistent ako imam samo nekoliko klijenata tjedno?', 'a': 'Ne nužno. Smisla ima kad vam ponavljajući posao oduzima sate tjedno. Prije ponude zajedno izračunamo isplati li se, a ako se ne isplati, reći ću vam.'},
  {'q': 'Mogu li krenuti samo s jednim poslom?', 'a': 'Da, i to je preporuka. Jedan jasan proces s fiksnim opsegom i rokom smanjuje rizik, a nakon mjerenja odlučujete što dalje.'},
  {'q': 'Koliko brzo dobivam ponudu?', 'a': 'Na upit odgovaram unutar jednog do dva radna dana, a ponuda stiže pismeno s cijenom i rokom.'}
 ],
}

for it in [cijena, apartmani, obrt]:
    data = [d for d in data if d['slug'] != it['slug']]
    data.insert(0, it)
data.sort(key=lambda d: d.get('date', ''), reverse=True)
with open(PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')
print('ok')
