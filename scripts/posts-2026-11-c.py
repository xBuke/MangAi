#!/usr/bin/env python3
"""SEO val 3: kratki sažetak „Ukratko“ na svim člancima + 2 nova članka (idempotentno).
Pokretanje (nakon posts-2026-11-b.py): python3 scripts/posts-2026-11-c.py && node scripts/generate-blog.js"""
import json, os

PATH = os.path.join(os.path.dirname(__file__), '../blog/posts.json')
TODAY = '2026-11-19'
WEB = '/usluge/izrada-web-stranica/'
BOT = '/usluge/ai-chatbot/'
AUT = '/usluge/ai-automatizacija/'

CTA = '''<h2>Pošaljite opis, ponuda stiže pismeno</h2>
<p>Najbrži put do ponude je kratak opis. Napišite mi na <a href="mailto:marko@mangai.hr">marko@mangai.hr</a> ili kroz <a href="/kontakt/">obrazac za kontakt</a>: što trebate, za koga i do kada. Na upit odgovaram unutar jednog do dva radna dana, a ponuda stiže pismeno s cijenom i rokom.</p>'''

UK = {
 'ai-asistent-za-obrt-i-malu-tvrtku': ('AI asistent preuzima ponavljajući posao: odgovore na iste upite, podsjetnike, pripremu ponuda i unos podataka. Odluke, cijene i odnos s klijentom ostaju vama.', BOT, 'AI chatbot i asistent za tvrtke'),
 'ai-chatbot-za-apartmane': ('AI chatbot na stranici apartmana odgovara gostima 0–24 na njihovom jeziku iz vaših podataka i šalje vam sažetak upita. Cijene i potvrdu rezervacije ostavite sebi.', BOT, 'AI chatbot za web stranicu i WhatsApp'),
 'cijena-ai-automatizacije-poslovanja': ('Cijenu AI automatizacije određuju broj procesa, sustava koje treba povezati i kvaliteta podataka, uz mjesečne troškove alata i održavanja. Isplativost se računa iz sati koje posao danas oduzima.', AUT, 'AI automatizacija poslovanja'),
 'web-stranica-za-obrt-i-malu-tvrtku': ('Obrtu treba jasna, brza stranica s uslugama, referencama i kontaktom, a ne deset dodataka. Najbrža ponuda dolazi iz kratkog opisa što radite, za koga i što želite da posjetitelj napravi.', WEB, 'Izrada web stranica'),
 'izrada-web-stranica-dalmacija-hrvatska': ('Izrađivač ne mora biti iz vašeg grada. Cijeli posao, od dogovora do predaje, radi se na daljinu, a lokalna vidljivost dolazi iz sadržaja stranice i Google profila.', WEB, 'Izrada web stranica za cijelu Hrvatsku'),
 'koliko-kosta-izrada-web-stranice': ('Cijena web stranice ovisi o opsegu: broju stranica, funkcijama, sadržaju i održavanju. Traži ponudu koja jasno kaže što je uključeno i tko je vlasnik stranice.', WEB, 'Izrada web stranica'),
 'vidljivost-u-ai-odgovorima-chatgpt-google': ('AI alati biraju jasne, činjenično točne i dobro strukturirane izvore. Pomažu jasan opis usluga, odgovori na stvarna pitanja i podaci koji se podudaraju na svim mjestima gdje se tvrtka pojavljuje.', WEB, 'Izrada web stranica'),
 'ai-chatbot-za-web-stranicu': ('AI chatbot odgovara posjetiteljima iz vaših podataka i prikuplja upite, uz jasna pravila što ne smije raditi sam. Prije narudžbe provjerite izvor odgovora, zaštitu podataka i što bot radi kad ne zna.', BOT, 'AI chatbot za web stranicu i WhatsApp'),
 'automatizacija-poslovnih-procesa-primjeri': ('Kreni od jednog procesa koji je čest, dosadan i svaki put isti: upiti, ponude, podsjetnici, obrada računa. Gdje su pravila jasna, dovoljna je obična automatizacija, a AI treba samo za slobodan tekst i dokumente.', AUT, 'AI automatizacija poslovanja'),
 'pristupacnost-web-stranica-javni-sektor': ('Javna tijela moraju imati pristupačnu stranicu i objavljenu izjavu o pristupačnosti. Stranicu možete sami provjeriti u nekoliko koraka, a nedostatke ispraviti prije nego ih netko prijavi.', WEB, 'Izrada web stranica'),
 'sto-mora-imati-web-stranica-opcine': ('Općine i gradovi moraju na službenoj stranici objaviti zakonom određene informacije. Važno ih je složiti tako da ih građani lako nađu, a ne samo formalno objaviti.', WEB, 'Izrada web stranica'),
 'nabava-web-stranice-jednostavna-nabava': ('Od 1. rujna 2026. prag za jednostavnu nabavu usluga iznosi 50.000 eura. Dobar opis posla s jasnim opsegom, rokovima i pravima nad stranicom štiti naručitelja.', WEB, 'Izrada web stranica'),
 'ai-implementacija-plan-roi-hrvatska': ('Uvođenje AI-a počinje procjenom spremnosti i jednim mjerljivim procesom, a ne velikim projektom. Uspjeh se mjeri ušteđenim satima i manjim brojem grešaka.', AUT, 'AI automatizacija poslovanja'),
 'ai-automatizacija-poslovanja-hrvatska': ('AI automatizacija znači da sustav preuzme ponavljajuće korake: upite, dokumente, podsjetnike i izvještaje. Najmanji rizik je pilot na jednom procesu s jasnim opsegom i rokom.', AUT, 'AI automatizacija poslovanja'),
 'ai-alati-male-tvrtke-hrvatska-2026': ('Mali tvrtkama najviše koriste AI alati za pisanje i odgovore, obradu dokumenata, korisničku podršku i automatizaciju. Odaberi alat prema poslu koji ti oduzima najviše sati, ne prema popularnosti.', AUT, 'AI automatizacija poslovanja'),
}
UK['ai-alati-male-tvrtke-hrvatska-2026'] = ('Malim tvrtkama najviše koriste AI alati za pisanje i odgovore, obradu dokumenata, korisničku podršku i automatizaciju. Alat birajte prema poslu koji vam oduzima najviše sati, ne prema popularnosti.', AUT, 'AI automatizacija poslovanja')
UK['automatizacija-poslovnih-procesa-primjeri'] = (UK['automatizacija-poslovnih-procesa-primjeri'][0].replace('Kreni od', 'Počnite od'), AUT, 'AI automatizacija poslovanja')
UK['web-stranica-za-obrt-i-malu-tvrtku'] = (UK['web-stranica-za-obrt-i-malu-tvrtku'][0], WEB, 'Izrada web stranica')
UK['koliko-kosta-izrada-web-stranice'] = (UK['koliko-kosta-izrada-web-stranice'][0].replace('Traži ponudu', 'Tražite ponudu'), WEB, 'Izrada web stranica')

web_obrt = {
 'slug': 'kako-napraviti-web-stranicu-za-obrt',
 'title_hr': 'Kako napraviti web stranicu za obrt: WordPress, Squarespace ili izrada po mjeri',
 'meta_title_hr': 'Web stranica za obrt: WordPress, Squarespace ili po mjeri?',
 'meta_description_hr': 'Otvarate obrt i trebate web stranicu? Usporedba triju putova: graditelj poput Squarespacea, WordPress i izrada po mjeri. Što koji traži od vas i kako odabrati.',
 'excerpt_hr': 'Za obrt su realna tri puta: graditelj stranica, WordPress ili izrada po mjeri. Što svaki traži od vas, gdje su skriveni troškovi i kako odabrati bez zabune.',
 'date': TODAY,
 'author': 'MangAI',
 'keywords': ['kako napraviti web stranicu za obrt', 'web stranica za obrt', 'WordPress ili Squarespace', 'web stranica za novi obrt', 'izrada web stranice po mjeri', 'prva web stranica za obrt'],
 'reading_time_minutes': 7,
 'content_html_hr': f'''<p>Kad otvarate obrt, web stranica često je prvo što vam treba, a pitanja su uvijek ista: napraviti je sam na Squarespaceu ili sličnom alatu, uzeti WordPress ili platiti nekome da je izradi. Nema jednog točnog odgovora, ali ima jasnih kriterija. Ovdje su tri puta, što svaki traži od vas i kad se koji isplati.</p>
<h2>Prije izbora alata: što stranica mora napraviti</h2>
<p>Većini obrta stranica treba za tri stvari: da vas ljudi nađu na Googleu, da vide što radite i da vas lako kontaktiraju. Webshop, rezervacije i korisnički računi trebaju samo neki. Zapišite prije odluke:</p>
<ul>
<li>koje usluge nudite i za koga,</li>
<li>što posjetitelj mora napraviti (nazvati, ispuniti upit, rezervirati),</li>
<li>trebate li više jezika,</li>
<li>tko će stranicu ažurirati poslije izrade.</li>
</ul>
<h2>Put 1: graditelj stranica (npr. Squarespace, Wix)</h2>
<p>Slažete stranicu iz gotovih predložaka, bez programiranja. Prednost je brz početak i da sve funkcionira unutar jednog servisa. Nedostaci su mjesečna ili godišnja pretplata koja traje dok stranicu imate, ograničenja predloška i teže prilagođavanje hrvatskim potrebama, a prelazak na drugu platformu obično znači izradu iznova. Dobar izbor ako imate vremena, volite sami slagati i trebate jednostavnu stranicu.</p>
<h2>Put 2: WordPress</h2>
<p>Vrlo raširen sustav s mnogo predložaka i dodataka. Fleksibilniji je od graditelja i stranica je vaša, ali traži više brige: hosting, ažuriranja, sigurnosne zakrpe i usklađivanje dodataka. Loše održavan WordPress često je spor i ranjiv. Dobar izbor ako vam trebaju posebne funkcije ili imate nekoga tko će ga održavati.</p>
<h2>Put 3: izrada po mjeri</h2>
<p>Stranica se izrađuje prema vašim uslugama, bez nepotrebnih dodataka. Obično je brža, lakša za održavanje i može biti jednostavna statična stranica koja se učitava gotovo trenutno. Vi ne trošite vrijeme na alat, ali plaćate izradu. Dobar izbor ako vam je vrijeme skuplje od izrade, želite jasnu ponudu i rok i ne želite brinuti o tehnici.</p>
<h2>Gdje su skriveni troškovi</h2>
<ul>
<li><strong>Domena i hosting:</strong> plaćaju se godišnje, bez obzira na put.</li>
<li><strong>Pretplate i dodaci:</strong> graditelji i WordPress dodaci često se naplaćuju zasebno.</li>
<li><strong>Vaše vrijeme:</strong> sati koje potrošite na slaganje i popravljanje također su trošak.</li>
<li><strong>Održavanje:</strong> pitajte tko radi ažuriranja i sigurnosne zakrpe i koliko to košta.</li>
<li><strong>Vlasništvo:</strong> provjerite možete li stranicu preseliti i koga sve dobivate pristup.</li>
</ul>
<p>Više o stavkama cijene pišemo u članku <a href="/blog/koliko-kosta-izrada-web-stranice.html">Koliko košta izrada web stranice</a>.</p>
<h2>Što ne smije izostati na stranici obrta</h2>
<ul>
<li>jasan naslov što radite i gdje (ili da radite na daljinu),</li>
<li>popis usluga s kratkim opisom,</li>
<li>kontakt koji se vidi bez traženja: telefon, e-pošta, obrazac,</li>
<li>pravni podaci obrta i politika privatnosti,</li>
<li>brzo učitavanje i izgled prilagođen mobitelu, jer većina posjeta dolazi s njega.</li>
</ul>
<p>Detalje o tome što staviti, a što izostaviti donosi članak <a href="/blog/web-stranica-za-obrt-i-malu-tvrtku.html">Web stranica za obrt i malu tvrtku</a>.</p>
<h2>Kako odabrati</h2>
<ol>
<li>Ako imate vremena i trebate nešto jednostavno, graditelj stranica je dovoljan.</li>
<li>Ako vam trebaju posebne funkcije i imate koga za održavanje, WordPress ima smisla.</li>
<li>Ako želite gotovu stranicu uz jasnu ponudu i rok, izrada po mjeri štedi najviše vremena.</li>
</ol>
<p>Ako se opredijelite za izradu po mjeri, pogledajte <a href="/usluge/izrada-web-stranica/">kako radimo izradu web stranica</a>.</p>
{CTA}''',
 'faq_hr': [
  {'q': 'Je li bolje za obrt WordPress ili Squarespace?', 'a': 'Ovisi o tome tko će stranicu održavati. Squarespace i slični graditelji jednostavniji su za početnike, a WordPress je fleksibilniji, ali traži hosting, ažuriranja i sigurnosne zakrpe.'},
  {'q': 'Treba li obrtu web stranica ako ima društvene mreže?', 'a': 'Preporučuje se. Stranica je vaša, može se naći na Googleu i njome upravljate sami, dok pravila i vidljivost na društvenim mrežama određuje treća strana.'},
  {'q': 'Što mi je potrebno prije izrade stranice?', 'a': 'Popis usluga, kontakt podaci, pravni podaci obrta i nekoliko fotografija vaših radova. Što je opis točniji, to je ponuda brža i preciznija.'},
  {'q': 'Koliko brzo dobivam ponudu?', 'a': 'Na upit odgovaram unutar jednog do dva radna dana, a ponuda stiže pismeno s cijenom i rokom.'}
 ],
 'ukratko': {'text': 'Za obrt su realna tri puta: graditelj stranica za jednostavnu stranicu uz vaše vrijeme, WordPress za posebne funkcije uz održavanje, ili izrada po mjeri za gotovu stranicu uz jasnu ponudu i rok. Odluku donosi to koliko vremena imate i tko će stranicu održavati.', 'href': WEB, 'label': 'Izrada web stranica'},
}

izvodjac = {
 'slug': 'kako-prepoznati-pouzdanog-izvodjaca-ai-rjesenja',
 'title_hr': 'Kako prepoznati pouzdanog izvođača AI rješenja i što provjeriti prije ugovora',
 'meta_title_hr': 'Pouzdan izvođač AI rješenja: što provjeriti prije ugovora',
 'meta_description_hr': 'AI chatbot ili automatizacija od nepoznatog izvođača? Popis pitanja i upozorenja prije potpisa: opseg, vlasništvo, podaci, pilot, održavanje i način plaćanja.',
 'excerpt_hr': 'Kako procijeniti izvođača AI rješenja: pitanja prije ugovora, znakovi upozorenja i uvjeti koji štite vas, od opsega i vlasništva do pilota i plaćanja po fazama.',
 'date': TODAY,
 'author': 'MangAI',
 'keywords': ['pouzdan izvođač AI rješenja', 'kako odabrati izvođača AI chatbota', 'ugovor za AI rješenje', 'AI chatbot izvođač provjera', 'AI automatizacija ugovor', 'pitanja prije narudžbe AI'],
 'reading_time_minutes': 7,
 'content_html_hr': f'''<p>AI je novo područje, pa mnogi vlasnici tvrtki ne znaju kako procijeniti ponudu. Obećanja zvuče slično, a razlika između dobrog i lošeg izvođača vidi se tek nakon što je novac plaćen. Ovdje je popis što provjeriti prije ugovora, znakovi upozorenja i uvjeti koji vas štite.</p>
<h2>Prije svega: što točno dobivate</h2>
<p>Pouzdan izvođač prije ponude traži da razumije vaš posao. Ako ponuda stigne bez ijednog pitanja o vašem procesu, a sadrži velike riječi o „umjetnoj inteligenciji“, to je loš znak. Ponuda treba odgovoriti na:</p>
<ul>
<li>što rješenje radi, a što ne radi,</li>
<li>koje podatke koristi i odakle ih dobiva,</li>
<li>tko ga testira i na čemu,</li>
<li>što se događa kad pogriješi.</li>
</ul>
<h2>Pitanja koja treba postaviti</h2>
<ol>
<li><strong>Je li opseg napisan?</strong> Popis funkcija, rokovi i što nije uključeno. „Pametni chatbot“ nije opseg.</li>
<li><strong>Tko je vlasnik rješenja?</strong> Dobivate li pristupne podatke, dokumentaciju i po potrebi izvorni kod, ili ostajete vezani uz izvođača?</li>
<li><strong>Odakle chatbot uzima odgovore?</strong> Samo iz vaših podataka ili „iz glave“? Što radi kad ne zna?</li>
<li><strong>Što se događa s podacima?</strong> Koji se servisi koriste, gdje se podaci obrađuju, koriste li se za treniranje modela i sklapa li se ugovor o obradi podataka?</li>
<li><strong>Može li se krenuti s pilotom?</strong> Jedan proces s fiksnim opsegom i rokom manji je rizik od velikog projekta unaprijed.</li>
<li><strong>Kako se mjeri uspjeh?</strong> Dogovorite pokazatelje unaprijed, npr. ušteđene sate ili broj obrađenih upita.</li>
<li><strong>Tko održava rješenje poslije predaje?</strong> I koliko to košta mjesečno, uključujući korištenje AI modela.</li>
<li><strong>Kako se plaća?</strong> Plaćanje po fazama uz predaju svake faze smanjuje rizik, a puni iznos unaprijed za nejasan rezultat je upozorenje.</li>
</ol>
<h2>Znakovi upozorenja</h2>
<ul>
<li>Obećanje rezultata bez poznavanja vašeg posla („udvostručit ćemo prodaju“).</li>
<li>Ponuda bez opsega, roka i opisa što se predaje.</li>
<li>Nemogućnost da objasne jednostavnim jezikom kako rješenje radi.</li>
<li>Pritisak da se odluči odmah ili da se plati cijeli iznos unaprijed.</li>
<li>Nema reference, prethodnog rada ili mogućnosti da ga pogledate.</li>
<li>Izbjegavanje pitanja o podacima i vlasništvu.</li>
</ul>
<h2>Što traži zakon</h2>
<p>Ako rješenje obrađuje osobne podatke, vrijedi GDPR, a za neke AI sustave i europska pravila o umjetnoj inteligenciji. Čak i kad se neko pravilo na vas izravno ne odnosi, izvođač mora znati objasniti koje podatke obrađuje i zašto. Više o tome u članku <a href="/blog/ai-chatbot-za-web-stranicu.html">AI chatbot za web stranicu i prodaju</a>.</p>
<h2>Kako smanjiti rizik</h2>
<ol>
<li>Krenite s jednim jasno određenim procesom i fiksnim rokom.</li>
<li>Zatražite pisanu ponudu s opsegom, rokom i cijenom.</li>
<li>Isprobajte rješenje na stvarnim primjerima prije prihvaćanja.</li>
<li>Dogovorite tko ima pristup računima i podacima.</li>
<li>Prije ugovora izračunajte isplati li se, kako je opisano u članku <a href="/blog/cijena-ai-automatizacije-poslovanja.html">Cijena AI automatizacije poslovanja</a>.</li>
</ol>
<p>Kako mi radimo, možete vidjeti na stranici <a href="/usluge/ai-automatizacija/">AI automatizacija poslovanja</a>.</p>
{CTA}''',
 'faq_hr': [
  {'q': 'Kako znati da je ponuda za AI rješenje realna?', 'a': 'Realna ponuda opisuje što rješenje radi i ne radi, koje podatke koristi, rok, cijenu i što dobivate na kraju. Ako obećava rezultate bez poznavanja vašeg posla, treba biti oprezan.'},
  {'q': 'Treba li platiti unaprijed?', 'a': 'Bolje je plaćanje po fazama uz predaju svake faze. Puni iznos unaprijed za nejasan rezultat je upozorenje.'},
  {'q': 'Što ako mi AI rješenje ne bude odgovaralo?', 'a': 'Zato se preporučuje pilot na jednom procesu s fiksnim opsegom i rokom, uz testiranje na stvarnim primjerima prije prihvaćanja.'},
  {'q': 'Koliko brzo dobivam ponudu?', 'a': 'Na upit odgovaram unutar jednog do dva radna dana, a ponuda stiže pismeno s cijenom i rokom.'}
 ],
 'ukratko': {'text': 'Pouzdan izvođač prije ponude pita o vašem poslu, a ponuda jasno opisuje opseg, rok, podatke i vlasništvo. Krenite s pilotom na jednom procesu, plaćajte po fazama i izbjegavajte obećanja bez poznavanja vašeg posla.', 'href': AUT, 'label': 'AI automatizacija poslovanja'},
}

data = json.load(open(PATH, encoding='utf-8'))
for it in [web_obrt, izvodjac]:
    data = [d for d in data if d['slug'] != it['slug']]
    data.insert(0, it)
for d in data:
    if d['slug'] in UK:
        t, href, label = UK[d['slug']]
        d['ukratko'] = {'text': t, 'href': href, 'label': label}
data.sort(key=lambda d: d.get('date', ''), reverse=True)
with open(PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')
print('ok', len(data))
