#!/usr/bin/env python3
"""Dodaje SEO članke (cijena, regija, obrt) u blog/posts.json (idempotentno).
Pokretanje: python3 scripts/posts-2026-11-seo.py && node scripts/generate-blog.js"""
import json, os

ROOT = os.path.join(os.path.dirname(__file__), '..')

CTA = '''<h2>Pošaljite opis, ponudu dobivate brzo</h2>
<p>Najbrži put do cijene je kratki opis. Napišite mi na <a href="mailto:marko@mangai.hr">marko@mangai.hr</a> ili kroz <a href="/kontakt/">obrazac za kontakt</a>: čime se bavite, kakvu stranicu zamišljate (koliko cjelina, treba li web shop, rezervacije ili više jezika) i imate li već logotip, tekstove i fotografije. Ne trebate znati tehničke pojmove, dovoljno je opisati vlastitim riječima. Na temelju toga šaljem pisanu ponudu s opsegom, rokom i fiksnim iznosom, bez obveze.</p>'''

cijena_hr = {
 'slug': 'koliko-kosta-izrada-web-stranice',
 'title_hr': 'Koliko košta izrada web stranice 2026.: od čega se cijena sastoji i kako do povoljne ponude',
 'meta_title_hr': 'Izrada web stranice cijena 2026.: što utječe na cijenu | MangAI',
 'meta_description_hr': 'Od čega se sastoji cijena izrade web stranice, što je jednokratni a što godišnji trošak i kako povoljno i brzo doći do ponude. Pošaljite opis, ponuda stiže brzo.',
 'excerpt_hr': 'Cijena web stranice ovisi o opsegu, a ne o „marki“ izrađivača. Pregled stavki koje čine cijenu, skrivenih troškova i načina da dobijete jasnu, povoljnu ponudu u kratkom roku.',
 'date': '2026-11-19',
 'author': 'MangAI',
 'keywords': ['izrada web stranice cijena', 'koliko košta web stranica', 'cijena web stranice', 'povoljna izrada web stranica', 'brza izrada web stranica', 'ponuda za web stranicu'],
 'reading_time_minutes': 6,
 'content_html_hr': f'''<p>„Koliko košta web stranica?“ jedno je od najčešćih pitanja malih poduzetnika, a odgovor „ovisi“ nikome ne pomaže. Zato ovdje stoji od čega se cijena stvarno sastoji, što možete sami smanjiti i što provjeriti prije nego potpišete ponudu. Cilj je da znate što plaćate i da dobijete povoljnu, jasnu cijenu u kratkom roku.</p>
<h2>Što najviše utječe na cijenu web stranice</h2>
<ul>
<li><strong>Opseg.</strong> Jednostavna prezentacijska stranica (početna, usluge, o nama, kontakt) bitno je jeftinija od stranice s desecima cjelina, blogom i više jezika.</li>
<li><strong>Funkcionalnosti.</strong> Obrazac za upit je jednostavan. Web shop, online rezervacije, korisnički računi ili chatbot dodaju posao i troškove.</li>
<li><strong>Sadržaj.</strong> Ako već imate tekstove, logotip i fotografije, stranica se izrađuje brže i povoljnije. Pisanje tekstova i dizajn identiteta zasebne su stavke.</li>
<li><strong>Dizajn.</strong> Prilagodba gotovog, provjerenog predloška košta manje od potpuno novog dizajna.</li>
<li><strong>Tehnologija.</strong> Statična, brza stranica ima manje troškova održavanja od složenog sustava koji traži stalna ažuriranja.</li>
</ul>
<h2>Jednokratni i ponavljajući troškovi</h2>
<p>Pri usporedbi ponuda gledajte ukupni trošak kroz nekoliko godina, a ne samo cijenu izrade. Uz izradu obično dolaze:</p>
<ul>
<li><strong>domena</strong> (naziv, npr. vasatvrtka.hr), koja se plaća godišnje,</li>
<li><strong>hosting</strong>, odnosno poslužitelj na kojem stranica radi,</li>
<li><strong>održavanje</strong>: sigurnosne nadogradnje, sigurnosne kopije i sitne izmjene, vidi <a href="/usluge/odrzavanje/">održavanje i hosting</a>,</li>
<li>po potrebi <strong>dodaci</strong>: e-pošta na vlastitoj domeni, plaćanje karticom, vanjski servisi.</li>
</ul>
<p>Provjerite je li domena registrirana na vas i dobivate li pristupne podatke i izvorni kod. Ako ne, kasnije ste vezani uz izrađivača i teško mijenjate suradnika.</p>
<h2>Na čemu se može uštedjeti, a na čemu ne</h2>
<p>Povoljno ne znači loše. Ušteda je razumna kad radite na opsegu: krenite s najvažnijim stranicama, a ostalo dodajte kasnije. Isto vrijedi za gotov predložak prilagođen vašem poslu i za sadržaj koji već imate. Ne štedite na brzini učitavanja, prikazu na mobitelu, osnovnoj SEO pripremi (naslovi, opisi, karta stranice) i sigurnosti, jer to određuje hoće li vas klijenti uopće naći i hoće li vam stranica donositi upite. Više o tome u članku <a href="/blog/sto-mora-imati-web-stranica-opcine.html">što mora imati dobra web stranica</a>.</p>
<h2>Pitanja koja postavite svakom izrađivaču</h2>
<ol>
<li>Što je točno uključeno u cijenu, a što se naplaćuje zasebno?</li>
<li>Je li cijena fiksna i što ako se opseg promijeni?</li>
<li>Tko je vlasnik domene, sadržaja i izvornog koda?</li>
<li>Koliko traje izrada i što je potrebno od mene da se ne zaustavi?</li>
<li>Što se događa nakon predaje: tko održava stranicu i po kojoj cijeni?</li>
</ol>
<p>Pogledajte i <a href="/primjeri/">primjere izrađenih stranica</a> i <a href="/usluge/izrada-web-stranica/">uslugu izrade web stranica</a>.</p>
{CTA}''',
 'faq_hr': [
  {'q': 'Koliko košta izrada web stranice?', 'a': 'Cijena ovisi o opsegu, funkcionalnostima i sadržaju koji već imate. Jednostavna prezentacijska stranica je povoljna, a web shop ili rezervacije dodaju trošak. Najbrži put do točnog iznosa je kratki opis stranice, nakon čega šaljem pisanu ponudu s fiksnim iznosom.'},
  {'q': 'Što još plaćam osim izrade web stranice?', 'a': 'Obično domenu i hosting godišnje te održavanje po dogovoru. Ostali troškovi, poput e-pošte na domeni ili plaćanja karticom, ovise o tome što stranica treba raditi.'},
  {'q': 'Koliko brzo mogu dobiti ponudu?', 'a': 'Ponudu šaljem brzo nakon što dobijem opis stranice. Što je opis jasniji (djelatnost, broj cjelina, funkcionalnosti), to je ponuda točnija.'},
  {'q': 'Tko je vlasnik stranice i domene nakon izrade?', 'a': 'Vi. Domena je na vaše ime, a dobivate pristupne podatke i izvorni kod. Time ne ovisite o jednom izrađivaču.'},
 ],
}

regija_hr = {
 'slug': 'izrada-web-stranica-dalmacija-hrvatska',
 'title_hr': 'Izrada web stranica u Dalmaciji i cijeloj Hrvatskoj: povoljno, brzo i na daljinu',
 'meta_title_hr': 'Izrada web stranica Dalmacija, Split, Dubrovnik, Zagreb | MangAI',
 'meta_description_hr': 'Povoljna i brza izrada web stranica za tvrtke i obrte u Dalmaciji, Splitu, Dubrovniku, Zagrebu i cijeloj Hrvatskoj. Radim na daljinu, pošaljite opis i dobijte ponudu.',
 'excerpt_hr': 'Ne trebate izrađivača iz svog grada da biste dobili dobru stranicu. Kako izgleda suradnja na daljinu, što dobivate i kako lokalno biti vidljiv u Dalmaciji i cijeloj Hrvatskoj.',
 'date': '2026-11-19',
 'author': 'MangAI',
 'keywords': ['izrada web stranica Dalmacija', 'izrada web stranica Split', 'izrada web stranica Dubrovnik', 'izrada web stranica Zagreb', 'izrada web stranica Ploče', 'web stranica na daljinu', 'povoljna izrada web stranica'],
 'reading_time_minutes': 5,
 'content_html_hr': f'''<p>MangAI je obrt iz Ploča u Dubrovačko-neretvanskoj županiji, a stranice izrađujem za tvrtke, obrte i ustanove u Dalmaciji i cijeloj Hrvatskoj. Većina posla odvija se na daljinu, pa za dobru stranicu u Splitu, Dubrovniku, Zagrebu ili na otoku ne trebate izrađivača iz susjedstva. Dovoljni su telefon, e-pošta i jasan opis što trebate.</p>
<h2>Kako izgleda suradnja na daljinu</h2>
<ol>
<li><strong>Opis.</strong> Pošaljete kratki opis: čime se bavite i kakvu stranicu zamišljate.</li>
<li><strong>Ponuda.</strong> Brzo dobivate pisanu ponudu s opsegom, rokom i fiksnim iznosom.</li>
<li><strong>Izrada.</strong> Radim u kratkim koracima i pokazujem napredak, pa izmjene stižu na vrijeme.</li>
<li><strong>Predaja.</strong> Dobivate stranicu, upute i pristupne podatke. Održavanje je po dogovoru.</li>
</ol>
<p>Na sastanak ili primopredaju dolazim po dogovoru, osobito u široj okolici Ploča, Metkovića, Opuzena, Makarske i Dubrovnika.</p>
<h2>Za koga izrađujem stranice</h2>
<ul>
<li>obrte i male tvrtke (frizeri, ugostitelji, obrtnici, apartmani, ordinacije),</li>
<li>udruge, općine i ustanove kojima trebaju pristupačne stranice, vidi <a href="/javni-sektor/">javni sektor</a>,</li>
<li>tvrtke koje uz stranicu žele <a href="/usluge/ai-chatbot/">AI chatbot</a> za odgovore na pitanja i prikupljanje upita.</li>
</ul>
<h2>Kako lokalno biti vidljiv u Googleu</h2>
<p>Ljudi često traže „uslugu + grad“, na primjer „frizer Ploče“ ili „apartmani Makarska“. Da bi vas Google povezao s mjestom, stranica treba:</p>
<ul>
<li>jasno navesti grad i područje djelovanja u naslovu, opisu i tekstu,</li>
<li>imati stranicu za svaku uslugu, a po potrebi i za svaku lokaciju,</li>
<li>imati vidljive podatke za kontakt (adresa, telefon, radno vrijeme) na svakoj stranici,</li>
<li>biti povezana s vašim <strong>Google Business Profilom</strong>, koji često donosi više upita od same stranice,</li>
<li>biti brza i pregledna na mobitelu, jer većina lokalnih pretraga dolazi s mobitela.</li>
</ul>
<p>Sve to ulazi u osnovnu SEO pripremu svake stranice koju izrađujem. Za usporedbu troškova pogledajte članak <a href="/blog/koliko-kosta-izrada-web-stranice.html">koliko košta izrada web stranice</a>.</p>
<h2>Zašto povoljno, a brzo</h2>
<p>Radim sam, bez posrednika, voditelja projekta i podizvođača. Zato nema troškova koji bi se prelili na vas, a odluke se donose odmah. Pogledajte <a href="/primjeri/">primjere</a> i <a href="/usluge/izrada-web-stranica/">uslugu izrade web stranica</a>.</p>
{CTA}''',
 'faq_hr': [
  {'q': 'Izrađujete li web stranice izvan Ploča?', 'a': 'Da. Radim na daljinu za cijelu Hrvatsku, uključujući Split, Dubrovnik i Zagreb. Na sastanke i primopredaju dolazim po dogovoru.'},
  {'q': 'Moram li se osobno sastati da bih naručio stranicu?', 'a': 'Ne. Dovoljan je opis e-poštom ili kratki razgovor telefonom. Sastanak je moguć ako ga želite.'},
  {'q': 'Kako da me klijenti iz mog grada nađu na Googleu?', 'a': 'Stranica treba navesti grad i usluge, imati kontakt podatke na vidljivom mjestu i biti povezana s Google Business Profilom. To je dio osnovne SEO pripreme.'},
  {'q': 'Koliko brzo dobivam ponudu?', 'a': 'Brzo nakon što pošaljete opis stranice. Ponuda je pisana, s opsegom, rokom i fiksnim iznosom.'},
 ],
}

obrt_hr = {
 'slug': 'web-stranica-za-obrt-i-malu-tvrtku',
 'title_hr': 'Web stranica za obrt i malu tvrtku: što vam treba, što ne treba i kako do brze ponude',
 'meta_title_hr': 'Web stranica za obrt i malu tvrtku: što treba imati | MangAI',
 'meta_description_hr': 'Što stvarno treba imati web stranica obrta ili male tvrtke, bez nepotrebnog dodavanja. Povoljno i brzo: opišite što trebate i dobijte ponudu.',
 'excerpt_hr': 'Obrtu ne treba skupa stranica s deset dodataka, nego jasna, brza stranica koja donosi upite. Što staviti, što izostaviti i što napisati u upitu da ponuda bude točna.',
 'date': '2026-11-19',
 'author': 'MangAI',
 'keywords': ['web stranica za obrt', 'web stranica za malu tvrtku', 'izrada web stranice za obrt', 'jeftina web stranica', 'brza izrada web stranice', 'ponuda za web stranicu'],
 'reading_time_minutes': 5,
 'content_html_hr': f'''<p>Većina obrta i malih tvrtki ne treba stranicu s mnogo funkcija. Treba stranicu na kojoj potencijalni klijent u nekoliko sekundi vidi što radite, gdje ste i kako vas kontaktirati. Takva stranica je povoljna, brzo se izradi i donosi upite.</p>
<h2>Što stranica obrta mora imati</h2>
<ul>
<li><strong>Jasan naslov:</strong> što radite i za koga, uz grad ili područje.</li>
<li><strong>Usluge:</strong> kratki opis svake usluge, po mogućnosti na zasebnoj stranici.</li>
<li><strong>Kontakt na vidljivom mjestu:</strong> telefon, e-pošta, adresa, radno vrijeme i obrazac za upit.</li>
<li><strong>Dokaz:</strong> fotografije radova, reference ili mišljenja klijenata, ako ih imate.</li>
<li><strong>Prikaz na mobitelu:</strong> većina posjetitelja dolazi s mobitela.</li>
<li><strong>Osnovna SEO priprema:</strong> naslovi, opisi i karta stranice, da vas Google može pronaći.</li>
<li><strong>Podaci o tvrtki i pravila privatnosti</strong>, u skladu sa zakonom.</li>
</ul>
<h2>Što možete ostaviti za kasnije</h2>
<p>Web shop, online rezervacije, više jezika i blog korisni su kad ih zaista trebate, ali nisu uvjet za početak. Krenite s osnovom i širite je kad vidite što klijenti traže. Tako je početni trošak manji, a stranica prije online. Ako vam treba automatizacija upita, razmislite o <a href="/usluge/ai-chatbot/">chatbotu</a>, ali tek kad stranica radi.</p>
<h2>Što napisati u upitu da ponuda bude točna</h2>
<ul>
<li>čime se bavite i na kojem području radite,</li>
<li>koliko cjelina zamišljate (npr. početna, usluge, galerija, kontakt),</li>
<li>trebate li rezervacije, web shop ili više jezika,</li>
<li>imate li logotip, tekstove i fotografije ili ih treba pripremiti,</li>
<li>imate li postojeću stranicu ili domenu,</li>
<li>do kada bi stranica trebala biti gotova.</li>
</ul>
<p>Cijenu i rokove detaljnije objašnjava članak <a href="/blog/koliko-kosta-izrada-web-stranice.html">koliko košta izrada web stranice</a>. Za primjere pogledajte <a href="/primjeri/">izrađene stranice</a>.</p>
{CTA}''',
 'faq_hr': [
  {'q': 'Što mi treba za web stranicu obrta?', 'a': 'Jasan opis usluga, kontakt podaci, nekoliko fotografija i logotip, ako ga imate. Ostalo, poput tekstova i pripreme za Google, mogu pripremiti ja.'},
  {'q': 'Treba li mi web shop ili je dovoljna prezentacijska stranica?', 'a': 'Ako ne prodajete proizvode online, prezentacijska stranica s obrascem za upit najčešće je dovoljna i povoljnija. Web shop se može dodati kasnije.'},
  {'q': 'Koliko brzo mogu dobiti ponudu i stranicu?', 'a': 'Ponudu šaljem brzo nakon što dobijem opis. Rok izrade ovisi o opsegu i dogovara se unaprijed, a jednostavne stranice izrađuju se brže.'},
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

upsert(os.path.join(ROOT, 'blog/posts.json'), [cijena_hr, regija_hr, obrt_hr])
print('ok')
