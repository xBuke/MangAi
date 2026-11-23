#!/usr/bin/env python3
"""Tjedni SEO val 2026-11-23: web stranica za frizere i salone, web stranica za apartmane,
Google profil i web stranica za lokalne obrte (idempotentno).
Pokretanje: python3 scripts/posts-2026-11-23-seo.py && node scripts/generate-blog.js"""
import json, os

ROOT = os.path.join(os.path.dirname(__file__), '..')
TODAY = '2026-11-23'

CTA = '''<h2>Pošaljite opis, ponuda stiže brzo</h2>
<p>Najbrži put do ponude je kratki opis. Pošaljite mi na <a href="mailto:marko@mangai.hr">marko@mangai.hr</a> ili kroz <a href="/kontakt/">obrazac za kontakt</a> kakvu stranicu želite: čime se bavite, koje cjeline trebate i imate li već logotip, tekstove i fotografije. Ponuda stiže brzo, s opsegom, rokom i fiksnim iznosom, bez obveze. MangAI je povoljan i brz, a cijelu izradu možemo odraditi na daljinu.</p>'''

frizer = {
 'slug': 'web-stranica-za-frizera-i-kozmeticki-salon',
 'title_hr': 'Web stranica za frizera i kozmetički salon: što mora imati da vam donese nove klijente',
 'meta_title_hr': 'Web stranica za frizera i kozmetički salon: što treba imati',
 'meta_description_hr': 'Što mora imati web stranica frizera, kozmetičkog salona ili brijačnice: usluge, cjenik, galerija, kontakt i upit za termin. Povoljno i brzo, ponuda na upit.',
 'excerpt_hr': 'Frizeri i saloni uglavnom ne trebaju veliku stranicu, nego jasnu: usluge, cjenik, radno vrijeme, fotografije radova i jednostavan način da klijent traži termin.',
 'date': TODAY,
 'author': 'MangAI',
 'keywords': ['web stranica za frizera', 'web stranica za kozmetički salon', 'web stranica za brijačnicu', 'izrada web stranice za salon', 'stranica za frizerski salon', 'povoljna izrada web stranica'],
 'reading_time_minutes': 5,
 'ukratko': {'text': 'Stranica salona treba odgovoriti na četiri pitanja: što radite, koliko košta, kako izgleda vaš rad i kako do termina. Dovoljna je mala, brza stranica prilagođena mobitelu, s jasnim kontaktom i galerijom.', 'href': '/usluge/izrada-web-stranica/', 'label': 'Izrada web stranica'},
 'content_html_hr': f'''<p>Većina klijenata frizera i kozmetičarki danas prvo pogleda mobitel: traže salon u blizini, listaju fotografije i traže način da dogovore termin. Ako te informacije ne nađu brzo, nazvat će sljedeći salon. Dobra vijest je da za to ne trebate veliku stranicu, nego jasnu.</p>
<h2>Što stranica salona mora imati</h2>
<ul>
<li><strong>Jasan naslov:</strong> što radite i gdje (npr. frizerski salon u vašem gradu), da i posjetitelj i Google odmah razumiju čime se bavite.</li>
<li><strong>Popis usluga:</strong> šišanje, bojanje, njega lica, manikura i druge usluge, svaka s kratkim opisom.</li>
<li><strong>Cjenik:</strong> klijenti vole znati okvir cijene prije dolaska. Ako se cijene često mijenjaju, dovoljan je cjenik s napomenom o datumu zadnje izmjene.</li>
<li><strong>Galerija radova:</strong> vlastite fotografije uvjerljivije su od stock slika. Nekoliko dobrih fotografija vrijedi više od stotinu prosječnih.</li>
<li><strong>Radno vrijeme, adresa i karta:</strong> na vidljivom mjestu, ne samo u podnožju.</li>
<li><strong>Kontakt i termin:</strong> gumb za poziv, poveznica za poruku i obrazac za upit za termin. Rezervacijski sustav nije uvjet za početak, a može se dodati kasnije.</li>
<li><strong>Prikaz na mobitelu:</strong> većina posjetitelja dolazi s mobitela, pa stranica mora biti brza i čitljiva na malom zaslonu.</li>
</ul>
<h2>Je li dovoljna društvena mreža?</h2>
<p>Instagram i Facebook dobri su za pokazivanje radova, ali ih ne kontrolirate: algoritam i pravila mijenjaju se bez vašeg utjecaja, a sadržaj se teško pretražuje. Vlastita stranica je mjesto koje je uvijek vaše, na kojem se jasno vide usluge, cjenik i kontakt, i na koje možete usmjeriti profile s društvenih mreža. Najbolje rade zajedno: mreže za inspiraciju, stranica za odluku i dogovor termina.</p>
<h2>Online termini: kad su potrebni</h2>
<p>Ako imate malo termina tjedno, obrazac za upit i poziv obično su dovoljni. Ako vam telefon stalno prekida rad ili primate puno upita izvan radnog vremena, razmislite o online rezervaciji ili o <a href="/usluge/ai-chatbot/">AI chatbotu</a> koji odgovara na česta pitanja. Kako to izgleda u praksi za male tvrtke, pročitajte u članku <a href="/blog/ai-asistent-za-obrt-i-malu-tvrtku.html">AI asistent za obrt i malu tvrtku</a>. Krenite s osnovom i dodajte rezervacije kad vidite da vam trebaju.</p>
<h2>Kako da vas lokalni klijenti nađu</h2>
<p>Uz stranicu pripremite i osnovnu SEO postavku: naslove, opise i kartu stranice, da vas Google može prikazati kad netko traži salon u vašem mjestu. Isto vrijedi za <a href="/blog/google-profil-i-web-stranica-za-lokalne-obrte.html">Google profil tvrtke</a>, koji se prikazuje na kartama. Opći pregled što vam treba za stranicu obrta imate u članku <a href="/blog/web-stranica-za-obrt-i-malu-tvrtku.html">web stranica za obrt i malu tvrtku</a>, a cijenu objašnjava <a href="/blog/koliko-kosta-izrada-web-stranice.html">koliko košta izrada web stranice</a>.</p>
<p>Primjere izrađenih stranica pogledajte na stranici <a href="/primjeri/">primjeri</a>, a opseg usluge na stranici <a href="/usluge/izrada-web-stranica/">izrada web stranica</a>.</p>
{CTA}''',
 'faq_hr': [
  {'q': 'Treba li frizeru web stranica ako ima Instagram?', 'a': 'Instagram je dobar za pokazivanje radova, ali stranicu kontrolirate vi: na njoj su usluge, cjenik, radno vrijeme i kontakt na jednom mjestu, i lakše je pronalazite preko Googlea. Najbolje je koristiti oboje.'},
  {'q': 'Što napisati na stranici kozmetičkog salona?', 'a': 'Popis usluga s kratkim opisom, okvirni cjenik, fotografije vlastitog rada, adresu, radno vrijeme i jasan način da klijent zatraži termin. Dodajte i nekoliko rečenica o vama i vašem iskustvu.'},
  {'q': 'Trebam li online rezervacije od prvog dana?', 'a': 'Ne. Za početak najčešće je dovoljan gumb za poziv i obrazac za upit za termin. Online rezervacije ili chatbot mogu se dodati kasnije, kad vidite da vam trebaju.'},
  {'q': 'Koliko brzo mogu dobiti ponudu za stranicu salona?', 'a': 'Ponuda stiže brzo nakon što pošaljete kratki opis salona i što želite na stranici. Pošaljite ga na marko@mangai.hr ili kroz obrazac za kontakt.'},
 ],
}

apartmani = {
 'slug': 'web-stranica-za-apartmane-i-iznajmljivace',
 'title_hr': 'Web stranica za apartmane i iznajmljivače: više izravnih upita i manje ovisnosti o platformama',
 'meta_title_hr': 'Web stranica za apartmane: izravni upiti gostiju',
 'meta_description_hr': 'Što treba imati web stranica apartmana ili sobe za iznajmljivanje: fotografije, opis, lokacija, cjenik, kalendar, više jezika i obrazac za upit. Povoljno i brzo.',
 'excerpt_hr': 'Platforme za rezervacije donose goste, ali vlastita stranica donosi izravne upite i povratne goste. Što mora imati, na kojim jezicima i kako je povezati s oglasima.',
 'date': TODAY,
 'author': 'MangAI',
 'keywords': ['web stranica za apartmane', 'web stranica za iznajmljivače', 'izrada web stranice za apartmane', 'stranica za smještaj', 'izravne rezervacije apartmana', 'web stranica za sobe'],
 'reading_time_minutes': 6,
 'ukratko': {'text': 'Vlastita stranica ne zamjenjuje platforme, nego uz njih donosi izravne upite i povratne goste. Treba joj jasan opis smještaja, dobre fotografije, lokacija, jezici gostiju i jednostavan upit.', 'href': '/usluge/izrada-web-stranica/', 'label': 'Izrada web stranica'},
 'content_html_hr': f'''<p>Većina iznajmljivača gosta dobiva preko platformi za rezervacije. To je praktično, ali platforme obično naplaćuju proviziju, a gost ostaje „gost platforme“, ne vaš. Vlastita web stranica ne mora zamijeniti oglase, nego ih dopuniti: gost koji pronađe vaš smještaj, vidi sve na jednom mjestu i pošalje izravan upit.</p>
<h2>Što stranica apartmana mora imati</h2>
<ul>
<li><strong>Jasan opis smještaja:</strong> vrsta (apartman, soba, kuća), broj osoba, površina, oprema, pravila boravka.</li>
<li><strong>Dobre fotografije:</strong> svjetle, aktualne i u pravom redoslijedu (vanjski izgled, dnevni boravak, spavaće sobe, kupaonica, pogled). Gosti odluku donose gledajući slike.</li>
<li><strong>Lokacija:</strong> karta, udaljenost do plaže, centra, trgovine i prijevoza, bez pretjerivanja.</li>
<li><strong>Cjenik i uvjeti:</strong> sezone, minimalni boravak, depozit i otkazni uvjeti. Ako ih ne želite objaviti, napišite kako da gost traži ponudu.</li>
<li><strong>Kalendar ili raspoloživost:</strong> jednostavna napomena o slobodnim terminima ili poveznica na kalendar, uz obrazac za upit.</li>
<li><strong>Jezici gostiju:</strong> uz hrvatski, najčešće engleski i njemački, ovisno o gostima koje primate.</li>
<li><strong>Kontakt:</strong> telefon, e-pošta, poruka i obrazac za upit, na vidljivom mjestu.</li>
</ul>
<h2>Platforme i vlastita stranica: kako rade zajedno</h2>
<p>Ne morate birati. Oglasi na platformama donose vidljivost, a stranica donosi izravan kontakt i mjesto na koje možete poslati goste koji se vraćaju. Dosljedno koristite iste fotografije, nazive i podatke na svim mjestima, a na stranici navedite kako gost može izravno upitati za termin. Provjerite i uvjete pojedine platforme prije nego što goste upućujete izvan nje.</p>
<h2>Pravila oglašavanja smještaja</h2>
<p>Za oglašavanje smještaja u Hrvatskoj postoje obveze, primjerice oznaka kategorije i podaci o objektu. Točne zahtjeve provjerite kod nadležne turističke zajednice ili ureda, jer se propisi mijenjaju. Stranicu se može pripremiti tako da sadrži podatke koje trebate objaviti.</p>
<h2>Odgovori gostima izvan radnog vremena</h2>
<p>Gosti upite šalju u bilo koje doba, često navečer i na više jezika. Ako vam to oduzima vrijeme, razmislite o chatbotu koji odgovara na česta pitanja (dolazak, parking, kućni ljubimci, plaža), a složenije upite prosljeđuje vama. Detalje i što provjeriti prije nego ga uvedete pročitajte u članku <a href="/blog/ai-chatbot-za-apartmane.html">AI chatbot za apartmane i iznajmljivače</a>, a opću ponudu pogledajte na stranici <a href="/usluge/ai-chatbot/">AI chatbot</a>.</p>
<h2>Kako da vas gosti pronađu</h2>
<p>Pripremite SEO osnove (naslovi, opisi, karta stranice) i uredite <a href="/blog/google-profil-i-web-stranica-za-lokalne-obrte.html">Google profil tvrtke</a>, koji gosti vide na kartama. Opći savjeti dostupni su u članku <a href="/blog/web-stranica-za-obrt-i-malu-tvrtku.html">web stranica za obrt i malu tvrtku</a>, a o troškovima pišemo u članku <a href="/blog/koliko-kosta-izrada-web-stranice.html">koliko košta izrada web stranice</a>.</p>
<p>Pogledajte <a href="/primjeri/">primjere izrađenih stranica</a> i <a href="/usluge/izrada-web-stranica/">uslugu izrade web stranica</a>.</p>
{CTA}''',
 'faq_hr': [
  {'q': 'Treba li mi web stranica ako imam oglase na platformama?', 'a': 'Ne moraju se isključivati: platforme donose vidljivost, a vlastita stranica donosi izravne upite i mjesto na koje upućujete goste koji se vraćaju. Tako ste manje ovisni o jednom kanalu.'},
  {'q': 'Na kojim jezicima treba biti stranica apartmana?', 'a': 'Uz hrvatski, najčešće engleski i njemački, ali ovisi o tome koje goste primate. Pogledajte iz kojih zemalja dolaze vaši gosti i prilagodite jezike tome.'},
  {'q': 'Što napisati u opisu apartmana?', 'a': 'Vrstu smještaja, broj osoba, opremu, lokaciju s udaljenostima, pravila boravka i kako do rezervacije. Pišite konkretno i bez pretjerivanja, jer gosti uspoređuju opis i fotografije.'},
  {'q': 'Koliko brzo mogu dobiti ponudu za stranicu apartmana?', 'a': 'Ponuda stiže brzo nakon što pošaljete opis smještaja i što želite na stranici. Pošaljite ga na marko@mangai.hr ili kroz obrazac za kontakt.'},
 ],
}

google = {
 'slug': 'google-profil-i-web-stranica-za-lokalne-obrte',
 'title_hr': 'Google profil tvrtke i web stranica: kako da vas lokalni kupci pronađu na kartama i u pretrazi',
 'meta_title_hr': 'Google profil tvrtke i web stranica za lokalne obrte',
 'meta_description_hr': 'Kako urediti Google profil tvrtke i povezati ga s web stranicom da vas lokalni kupci pronađu na Google kartama. Koraci, česte pogreške i što pripremiti.',
 'excerpt_hr': 'Kad netko traži frizera, restoran ili majstora u blizini, prvo vidi kartu. Što staviti u Google profil tvrtke, zašto su podaci važni i kako ga povezati s vlastitom stranicom.',
 'date': TODAY,
 'author': 'MangAI',
 'keywords': ['google profil tvrtke', 'google moj posao', 'google karte tvrtka', 'lokalni SEO', 'kako se pojaviti na google kartama', 'web stranica za lokalne obrte'],
 'reading_time_minutes': 6,
 'ukratko': {'text': 'Google profil tvrtke besplatan je način da se pojavite na kartama i u lokalnoj pretrazi. Uredite točne podatke, fotografije i radno vrijeme, povežite ga sa stranicom i odgovarajte na recenzije.', 'href': '/usluge/izrada-web-stranica/', 'label': 'Izrada web stranica'},
 'content_html_hr': f'''<p>Kad netko u pretraživaču ili na karti potraži „frizer“, „restoran“ ili „električar“ u svom mjestu, Google često prvo prikaže kartu s nekoliko tvrtki. Taj prikaz ne dolazi s vaše web stranice, nego iz Google profila tvrtke (ranije poznatog kao Google Moj posao). Ako ga nemate ili je zapušten, propuštate upite koji već imaju namjeru kupnje.</p>
<h2>Što je Google profil tvrtke</h2>
<p>To je besplatan profil koji prikazuje podatke o vašoj tvrtki u pretrazi i na kartama: naziv, adresu, radno vrijeme, telefon, fotografije, recenzije i poveznicu na stranicu. Za uređivanje trebate potvrditi da ste vlasnik ili ovlaštena osoba, a način potvrde ovisi o tvrtki i može se razlikovati.</p>
<h2>Što uredite u profilu</h2>
<ul>
<li><strong>Točni osnovni podaci:</strong> naziv, adresa, telefon i radno vrijeme. Isti podaci trebaju biti na stranici i na društvenim mrežama.</li>
<li><strong>Kategorija djelatnosti:</strong> odaberite onu koja najtočnije opisuje što radite, uz dodatne kategorije ako ih imate.</li>
<li><strong>Opis:</strong> nekoliko jasnih rečenica o tome što radite i za koga, bez pretjerivanja.</li>
<li><strong>Usluge ili proizvodi:</strong> popis onoga što nudite.</li>
<li><strong>Fotografije:</strong> izvana, iznutra i radova. Redovito ih dopunjavajte.</li>
<li><strong>Poveznica na stranicu:</strong> uputite na stranicu koja odgovara upitu (početna ili stranica usluge).</li>
<li><strong>Recenzije:</strong> odgovarajte na njih, i na pohvale i na kritike, ljubazno i činjenično.</li>
</ul>
<p>Google navodi da potpuni i točni podaci pomažu da vas lakše pronađu, ali nitko ne može jamčiti određeno mjesto na karti. Zato pišite stvarne podatke i ažurirajte ih kad se nešto promijeni (praznici, selidba, novo radno vrijeme).</p>
<h2>Zašto je profil dobar samo uz dobru stranicu</h2>
<p>Profil privuče pogled, a stranica odlučuje. Tko klikne na poveznicu, želi vidjeti usluge, cjenik ili okvir cijena, fotografije radova i način da vas kontaktira. Ako stranice nema ili se loše prikazuje na mobitelu, dio posjetitelja odustaje. Zato profil i stranica rade zajedno: profil donosi posjetitelje, a stranica ih pretvara u upite.</p>
<h2>Česte pogreške</h2>
<ul>
<li>različiti podaci u profilu, na stranici i na društvenim mrežama (telefon, radno vrijeme, adresa),</li>
<li>zastarjelo radno vrijeme, osobito oko praznika,</li>
<li>pogrešna ili preširoka kategorija,</li>
<li>premalo ili stare fotografije,</li>
<li>neodgovorene recenzije,</li>
<li>poveznica na stranicu koja se sporo učitava ili je neprilagođena mobitelu.</li>
</ul>
<h2>Što pripremiti prije početka</h2>
<ol>
<li>točan naziv, adresu, telefon i radno vrijeme,</li>
<li>nekoliko dobrih fotografija prostora i radova,</li>
<li>kratki opis i popis usluga,</li>
<li>adresu stranice na koju profil upućuje.</li>
</ol>
<p>Za konkretne djelatnosti pogledajte članke <a href="/blog/web-stranica-za-frizera-i-kozmeticki-salon.html">web stranica za frizera i kozmetički salon</a> i <a href="/blog/web-stranica-za-apartmane-i-iznajmljivace.html">web stranica za apartmane i iznajmljivače</a>. Što još treba stranica obrta, objašnjava <a href="/blog/web-stranica-za-obrt-i-malu-tvrtku.html">web stranica za obrt i malu tvrtku</a>, a kako se pojaviti i u AI odgovorima pročitajte u članku <a href="/blog/vidljivost-u-ai-odgovorima-chatgpt-google.html">vidljivost u odgovorima ChatGPT-a i Googlea</a>.</p>
<p>Primjere stranica pogledajte na <a href="/primjeri/">primjerima</a>, a ponudu stranice na <a href="/usluge/izrada-web-stranica/">izradi web stranica</a>.</p>
{CTA}''',
 'faq_hr': [
  {'q': 'Je li Google profil tvrtke besplatan?', 'a': 'Da, profil je besplatan. Za uređivanje morate potvrditi da ste vlasnik ili ovlaštena osoba.'},
  {'q': 'Treba li mi web stranica ako imam Google profil?', 'a': 'Profil je dobar za prikaz na karti, ali posjetitelji žele vidjeti usluge, fotografije i način kontakta. Stranica ih pretvara u upite i daje vam mjesto koje u potpunosti kontrolirate.'},
  {'q': 'Mogu li jamčiti da ću biti prvi na karti?', 'a': 'Ne. Točni, potpuni i ažurni podaci pomažu da vas lakše pronađu, ali nitko ne može jamčiti određeno mjesto.'},
  {'q': 'Koliko brzo mogu dobiti ponudu za stranicu?', 'a': 'Ponuda stiže brzo nakon što pošaljete kratki opis tvrtke i što želite na stranici. Pošaljite ga na marko@mangai.hr ili kroz obrazac za kontakt.'},
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

upsert(os.path.join(ROOT, 'blog/posts.json'), [frizer, apartmani, google])
print('ok')
