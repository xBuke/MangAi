#!/usr/bin/env python3
"""Tjedni SEO val 2026-11-23 (fokus: javna nabava i javni natječaji): tri članka (idempotentno).
Pokretanje: python3 scripts/posts-2026-11-23-seo.py && node scripts/generate-blog.js"""
import json, os

ROOT = os.path.join(os.path.dirname(__file__), '..')
TODAY = '2026-11-23'

CTA = '''<h2>Pošaljite opis ili poziv, ponuda stiže brzo</h2>
<p>Pošaljite mi opis kakvu stranicu ili uslugu želite na <a href="mailto:marko@mangai.hr">marko@mangai.hr</a> ili kroz <a href="/kontakt/">obrazac za kontakt</a>. Ako ste javni naručitelj, na isti naslov možete poslati poziv za dostavu ponude. Ponuda stiže brzo, s opsegom, rokom i jasnim iznosom, bez obveze. MangAI je povoljan i brz, a posao predajem tako da ga sutra može preuzeti i netko drugi: s izvornim kodom, dokumentacijom i pristupima. Više o javnoj nabavi na stranici <a href="/javni-sektor/">javni sektor</a>.</p>'''

isti_projekti = {
 'slug': 'isti-projekti-kao-javna-tijela-bez-velikog-proracuna',
 'title_hr': 'Isti projekti kao javna tijela, samo bez velikog proračuna: što općine naručuju, a možete imati i vi',
 'meta_title_hr': 'Projekti kao u javnoj nabavi, po mjeri male tvrtke',
 'meta_description_hr': 'Web stranice, e-usluge, interaktivne karte i AI asistenti koje naručuju općine, županije i ustanove dostupni su i manjim tvrtkama. Što se naručuje i kako krenuti povoljno i brzo.',
 'excerpt_hr': 'Rješenja koja javna tijela naručuju kroz javnu nabavu nisu rezervirana za velike proračune. Pregled što se najčešće naručuje i kako isto dobiti u opsegu koji odgovara vašoj tvrtki.',
 'date': TODAY,
 'author': 'MangAI',
 'keywords': ['javna nabava web stranica', 'što javna tijela naručuju', 'e-usluge za građane', 'web GIS karta', 'AI asistent za općinu', 'povoljna izrada web stranica', 'jednostavna nabava'],
 'reading_time_minutes': 6,
 'ukratko': {'text': 'Web stranice, e-usluge, interaktivne karte i AI asistenti koje javna tijela naručuju kroz nabavu isti su tehnički temelj kao i za privatne tvrtke. Razlika je u opsegu, pa se ista rješenja mogu dobiti povoljno i brzo.', 'href': '/javni-sektor/', 'label': 'Javni sektor'},
 'content_html_hr': f'''<p>U planovima nabave općina, gradova, županija, zavoda i fakulteta, objavljenima na Elektroničkom oglasniku javne nabave (EOJN), redovito se pojavljuju iste stavke: izrada web stranice, održavanje, e-usluge za građane, interaktivne karte i, sve češće, AI asistenti. Procijenjene vrijednosti takvih nabava kreću se od nekoliko tisuća do desetaka tisuća eura. Dobra vijest za sve ostale: tehnologija iza tih projekata nije rezervirana za javni sektor. Isto možete imati u opsegu koji odgovara vašoj tvrtki, obrtu ili udruzi.</p>
<h2>Što javna tijela najčešće naručuju</h2>
<ul>
<li><strong>Web stranice dostupne svima.</strong> Službene stranice s obveznim informacijama, usklađene sa Zakonom o pristupačnosti mrežnih stranica (WCAG 2.1 AA). Više u članku o <a href="/blog/pristupacnost-web-stranica-javni-sektor.html">pristupačnosti web stranica u javnom sektoru</a>.</li>
<li><strong>Održavanje i hosting.</strong> Redovita ažuriranja, sigurnosne kopije i nadzor dostupnosti, najčešće kao godišnji ugovor.</li>
<li><strong>E-usluge.</strong> Digitalni obrasci, prijave i zahtjevi koji stižu izravno u ured umjesto na papiru.</li>
<li><strong>Interaktivne karte (web GIS).</strong> Prikaz prostornih podataka, planova i lokacija na karti.</li>
<li><strong>AI asistenti.</strong> Odgovori na česta pitanja građana i turista na temelju službenih dokumenata, na više jezika.</li>
<li><strong>Interni alati i edukacija.</strong> Evidencije, izvještaji i radionice o sigurnoj uporabi AI alata.</li>
</ul>
<h2>Što od toga ima smisla i za privatnu tvrtku</h2>
<p>Gotovo sve. Pogledajte kako se isti pristup prevodi na manji opseg:</p>
<ul>
<li><strong>Web stranica</strong> brza i prilagođena mobitelu, s jasnim uslugama i kontaktom. Pregled na stranici <a href="/usluge/izrada-web-stranica/">izrada web stranica</a>.</li>
<li><strong>E-obrasci i upiti</strong> koji se sami upisuju u vašu e-poštu, tablicu ili CRM. To je isti princip kao prijava komunalnog problema kod općine.</li>
<li><strong>Karta</strong> poslovnica, terena ili ponude, ako vaša djelatnost ima prostornu komponentu.</li>
<li><strong>AI asistent</strong> koji odgovara iz vašeg cjenika i čestih pitanja. Kako to izgleda, pogledajte na stranici <a href="/usluge/ai-chatbot/">AI chatbot</a> i u <a href="/primjeri/">primjerima</a>.</li>
<li><strong>Automatizacija</strong> ponavljajućih poslova, na stranici <a href="/usluge/ai-automatizacija/">AI automatizacija</a>, te <a href="/usluge/aplikacije-po-mjeri/">aplikacije po mjeri</a> za specifične procese.</li>
</ul>
<h2>Kako krenuti povoljno i brzo</h2>
<ol>
<li><strong>Počnite s jednom cjelinom.</strong> Umjesto velikog projekta, odaberite jedan proces ili jednu stranicu koja vam donosi najviše koristi.</li>
<li><strong>Zapišite što želite.</strong> Javna tijela pišu opis predmeta nabave, a isto pomaže i vama: što točno treba raditi, tko to koristi i što je gotovo kad je gotovo.</li>
<li><strong>Tražite vlasništvo nad rezultatom.</strong> Izvorni kod, dokumentacija i pristupi trebaju biti vaši, kao što to traže i dobri naručitelji. Vidi <a href="/blog/nabava-web-stranice-jednostavna-nabava.html">kako naručiti web stranicu kroz jednostavnu nabavu</a>.</li>
<li><strong>Dodajte kasnije.</strong> Kad prva cjelina radi, širite je na sljedeću.</li>
</ol>
<h2>Za javne naručitelje</h2>
<p>Ako ste općina, grad, škola, ustanova ili turistička zajednica, isto vrijedi i za vas: web stranice, e-usluge i održavanje najčešće se nabavljaju jednostavnom nabavom, koja od 1. rujna 2026. za robu i usluge vrijedi do 50.000 eura bez PDV-a (Zakon o izmjenama i dopunama Zakona o javnoj nabavi, NN 48/2026). Na pozive za dostavu ponude odgovaram u traženom roku. Što dobivate i koje usluge radim, pogledajte na stranici <a href="/javni-sektor/">javni sektor</a>. Popis što mora imati službena stranica nalazi se u članku <a href="/blog/sto-mora-imati-web-stranica-opcine.html">što mora imati web stranica općine ili grada</a>.</p>
{CTA}''',
 'faq_hr': [
  {'q': 'Mogu li i mala tvrtka imati isti projekt kao općina ili ustanova?', 'a': 'Da. Tehnologija je ista, razlika je u opsegu. Mala tvrtka može krenuti s jednom stranicom, jednim obrascem ili jednim asistentom, a širiti kad vidi korist.'},
  {'q': 'Što javna tijela najčešće naručuju od web i IT usluga?', 'a': 'Izradu i održavanje web stranica, e-usluge za građane, interaktivne karte, AI asistente te interne alate i edukaciju djelatnika. Takve stavke možete pronaći u planovima nabave na EOJN-u.'},
  {'q': 'Do koje vrijednosti vrijedi jednostavna nabava?', 'a': 'Od 1. rujna 2026. zakon se ne primjenjuje na nabavu robe i usluga procijenjene vrijednosti manje od 50.000 eura bez PDV-a, a postupak se provodi prema općem aktu naručitelja (NN 48/2026).'},
  {'q': 'Koliko brzo mogu dobiti ponudu?', 'a': 'Ponuda stiže brzo nakon što pošaljete opis ili poziv za dostavu ponude na marko@mangai.hr ili kroz obrazac za kontakt.'},
 ],
}

sudjelovanje = {
 'slug': 'kako-obrt-i-mala-tvrtka-mogu-sudjelovati-u-javnoj-nabavi',
 'title_hr': 'Kako obrt i mala tvrtka mogu sudjelovati u javnoj nabavi: od plana nabave do ponude',
 'meta_title_hr': 'Kako sudjelovati u javnoj nabavi: obrt i mala tvrtka',
 'meta_description_hr': 'Prvi koraci za obrte i male tvrtke u javnoj nabavi: praćenje EOJN-a, plan nabave, pravilnik naručitelja, uvjeti sposobnosti i priprema ponude. Pregled bez žargona.',
 'excerpt_hr': 'Javna nabava nije samo za velike tvrtke. Kako pratiti objave, pročitati pozive, procijeniti uvjete sposobnosti i pripremiti ponudu kao obrt ili mala tvrtka.',
 'date': TODAY,
 'author': 'MangAI',
 'keywords': ['javna nabava za obrte', 'kako sudjelovati u javnoj nabavi', 'EOJN', 'javni natječaji za male tvrtke', 'poziv za dostavu ponude', 'jednostavna nabava ponuditelj', 'uvjeti sposobnosti'],
 'reading_time_minutes': 7,
 'ukratko': {'text': 'Obrt i mala tvrtka mogu biti ponuditelji u jednostavnoj i javnoj nabavi. Pratite EOJN i planove nabave, pročitajte pravilnik i uvjete sposobnosti prije ponude te ponudite jasan opseg, rok i cijenu bez PDV-a.', 'href': '/javni-sektor/', 'label': 'Javni sektor'},
 'content_html_hr': f'''<p>Javna nabava često izgleda kao teren velikih tvrtki, ali to nije točno. Obrt ili mala tvrtka mogu biti ponuditelji kao i svaka druga tvrtka, a uvjete sposobnosti određuje naručitelj u dokumentaciji o nabavi. Za manje vrijednosti, osobito nakon izmjena zakona, postupak je jednostavniji nego što se čini. Ovo je pregled prvih koraka.</p>
<h2>1. Znajte tko nabavlja i što</h2>
<p>Većina javnih nabava objavljuje se na <strong>Elektroničkom oglasniku javne nabave (EOJN RH)</strong>. Uz objavljene postupke, naručitelji tamo objavljuju i <strong>planove nabave</strong>: popise onoga što namjeravaju kupiti u godini, s predmetom, okvirnom procijenjenom vrijednošću i planiranim razdobljem. Plan je koristan jer pokazuje što će se tražiti prije nego što postupak počne.</p>
<h2>2. Razlikujte jednostavnu i javnu nabavu</h2>
<p>Od 1. rujna 2026. zakon se ne primjenjuje na nabavu robe i usluga procijenjene vrijednosti manje od 50.000 eura bez PDV-a (prije 26.540 eura) ni na radove manje od 100.000 eura (prije 66.360 eura), prema Zakonu o izmjenama i dopunama Zakona o javnoj nabavi (NN 48/2026). Takva se nabava naziva jednostavnom i provodi se prema općem aktu (pravilniku) naručitelja. Veće nabave idu kroz postupke propisane zakonom. Pravilnik je ključan dokument: određuje koliko se ponuda traži, kako se pozivaju ponuditelji i koji su rokovi. Mnogi naručitelji objavljuju ga na svojim mrežnim stranicama.</p>
<h2>3. Pročitajte uvjete prije nego što krenete pisati ponudu</h2>
<p>Svaki poziv ima kriterije sposobnosti. Neki su blagi, na primjer upis u odgovarajući registar i potvrda da račun nije bio blokiran u određenom razdoblju. Drugi traže reference iz zadnjih godina, minimalni godišnji promet ili stručni kadar. Zato nije svaka nabava za svakog ponuditelja, i to je normalno. Pročitajte kriterije prvi, a tek onda trošite vrijeme na ponudu.</p>
<h2>4. Pripremite ponudu koja se može usporediti</h2>
<ul>
<li><strong>Jasan opseg:</strong> što točno isporučujete i što nije uključeno.</li>
<li><strong>Rok:</strong> kad počinjete, kad je gotovo i što ovisi o naručitelju.</li>
<li><strong>Cijena bez PDV-a:</strong> ponude se uspoređuju bez PDV-a, pa je tako i napišite. Obrti izvan sustava PDV-a PDV ne obračunavaju.</li>
<li><strong>Održavanje kao zasebna stavka</strong>, ako je predmet web stranica ili sustav.</li>
<li><strong>Tražena dokumentacija:</strong> dokazi o sposobnosti, izjave i obrasci, točno onako kako piše u pozivu.</li>
</ul>
<h2>5. Predaja kroz EOJN i poštivanje roka</h2>
<p>Ponude se često predaju elektronički kroz modul u EOJN-u, a rok je strog: ponuda poslana nakon roka ne ulazi u razmatranje. Neki naručitelji u jednostavnoj nabavi pozive šalju i izravno e-poštom odabranim ponuditeljima, pa je korisno da vas naručitelji poznaju i da imate jasno opisane usluge na stranici.</p>
<h2>6. Račun i primopredaja</h2>
<p>Računi javnim naručiteljima izdaju se kao e-računi. Pri predaji posla dobri naručitelji traže izvorni kod, dokumentaciju i pristupe, pa ih pripremite od početka. Što bi opis posla trebao sadržavati, objašnjava članak <a href="/blog/nabava-web-stranice-jednostavna-nabava.html">kako naručiti web stranicu kroz jednostavnu nabavu</a>, koji je koristan i ponuditeljima, jer pokazuje što naručitelj treba.</p>
<h2>Kako se ja javljam na pozive</h2>
<p>Javljam se na pozive za dostavu ponuda i na postupke objavljene na EOJN-u za web stranice, održavanje, e-usluge i AI asistente za javna tijela. Pregled što radim i po kojim CPV područjima nalazi se na stranici <a href="/javni-sektor/">javni sektor</a>. Primjere pogledajte na <a href="/primjeri/">primjerima</a>.</p>
{CTA}''',
 'faq_hr': [
  {'q': 'Može li obrt sudjelovati u javnoj nabavi?', 'a': 'Može. Obrt sudjeluje u jednostavnoj i javnoj nabavi kao i tvrtka, a uvjete sposobnosti određuje naručitelj u dokumentaciji o nabavi.'},
  {'q': 'Gdje pronaći javne nabave i planove nabave?', 'a': 'Na Elektroničkom oglasniku javne nabave (EOJN RH), gdje se objavljuju postupci i planovi nabave naručitelja. Jednostavnu nabavu mnogi naručitelji objavljuju i na vlastitim mrežnim stranicama.'},
  {'q': 'Moram li imati reference da bih se javio?', 'a': 'Ovisi o pozivu. Neki naručitelji traže reference ili minimalni promet, a drugi samo osnovne uvjete poput upisa u registar. Kriterije uvijek pročitajte prije pripreme ponude.'},
  {'q': 'Je li cijena u ponudi s PDV-om ili bez?', 'a': 'Ponude se uspoređuju bez PDV-a, pa se cijena u pravilu navodi bez PDV-a. Obrti izvan sustava PDV-a PDV ne obračunavaju.'},
 ],
}

asistent = {
 'slug': 'ai-asistent-za-opcinu-grad-i-turisticku-zajednicu',
 'title_hr': 'AI asistent za općinu, grad i turističku zajednicu: što može, što ne smije i kako ga naručiti',
 'meta_title_hr': 'AI asistent za općinu, grad i turističku zajednicu',
 'meta_description_hr': 'Što AI asistent može raditi za općinu, grad ili turističku zajednicu: odgovori građanima na temelju službenih dokumenata, prijave problema i više jezika. Što provjeriti prije nabave.',
 'excerpt_hr': 'AI asistent može rasteretiti ured odgovorima na česta pitanja građana i turista, ali samo ako odgovara iz službenih dokumenata. Što može, granice i kako ga opisati u nabavi.',
 'date': TODAY,
 'author': 'MangAI',
 'keywords': ['AI asistent za općinu', 'chatbot za grad', 'AI za javni sektor', 'asistent turističke zajednice', 'e-usluge za građane', 'AI chatbot javna nabava', 'nabava AI asistenta'],
 'reading_time_minutes': 7,
 'ukratko': {'text': 'AI asistent za javno tijelo treba odgovarati samo iz službenih dokumenata, jasno se označiti kao AI, prosljeđivati složene slučajeve djelatnicima i imati pristupačno sučelje. Opišite to u nabavi.', 'href': '/usluge/ai-chatbot/', 'label': 'AI chatbot'},
 'content_html_hr': f'''<p>Građani i turisti u općinu ili turističku zajednicu stalno pitaju slično: radno vrijeme, koji obrazac, kome prijaviti kvar, kamo na izlet. AI asistent može preuzeti dio tih pitanja, ali samo ako je dobro postavljen. Za javno tijelo to znači odgovore iz službenih izvora, a ne „opće znanje“ modela.</p>
<h2>Što asistent može raditi</h2>
<ul>
<li><strong>Odgovarati na česta pitanja</strong> na temelju vaših službenih dokumenata i stranica: radno vrijeme, kontakti, obrasci, rokovi, upute.</li>
<li><strong>Voditi kroz obrazac</strong> polje po polje, s provjerom unosa, umjesto da građanin sam pogađa što treba upisati.</li>
<li><strong>Primati prijave</strong> komunalnih problema s opisom, lokacijom i fotografijom, koje stižu odgovornoj osobi. Primjer toka pogledajte u demu „Općina ili grad“ na stranici <a href="/primjeri/">primjeri</a>.</li>
<li><strong>Odgovarati na više jezika</strong>, što je osobito korisno turističkim zajednicama.</li>
<li><strong>Proslijediti složeni slučaj</strong> djelatniku s već prikupljenim podacima.</li>
</ul>
<h2>Što asistent ne smije</h2>
<ul>
<li><strong>Izmišljati.</strong> Ako odgovora nema u službenim izvorima, asistent to treba reći i uputiti na ured.</li>
<li><strong>Davati pravno obvezujuće odgovore.</strong> Upute o postupku su informacija, a ne odluka.</li>
<li><strong>Zamijeniti službenika</strong> u odlučivanju. Odluke i dalje donosi nadležna osoba.</li>
<li><strong>Prikrivati da je AI.</strong> Korisnik mora jasno vidjeti da razgovara s AI asistentom.</li>
</ul>
<h2>Što provjeriti prije nabave</h2>
<ol>
<li><strong>Izvori znanja:</strong> iz kojih dokumenata asistent odgovara, tko ih održava i kako se ažuriraju.</li>
<li><strong>Zaštita podataka:</strong> gdje se podaci obrađuju, ima li ugovor o obradi podataka i što se sprema. Poželjan je hosting u EU. Više u članku o <a href="/blog/kako-prepoznati-pouzdanog-izvodjaca-ai-rjesenja.html">prepoznavanju pouzdanog izvođača AI rješenja</a>.</li>
<li><strong>Pristupačnost:</strong> sučelje usklađeno s WCAG 2.1 AA, upravljivo tipkovnicom.</li>
<li><strong>Nadzor:</strong> uvid u pitanja bez odgovora, da možete dopuniti izvore.</li>
<li><strong>Vlasništvo i održavanje:</strong> izvorni kod, pristupi i održavanje kao zasebna stavka, da se izvođač može zamijeniti.</li>
</ol>
<h2>Kako to opisati u pozivu za ponudu</h2>
<p>Navedite izvore znanja, jezike, kanale (web stranica, po potrebi i drugi), što asistent smije i ne smije, tko ažurira sadržaj, razdoblje održavanja i način predaje. Ako vrijednost nabave ostaje ispod praga od 50.000 eura bez PDV-a, riječ je o jednostavnoj nabavi koja se provodi prema pravilniku naručitelja. Kako napisati opis posla, pogledajte u članku <a href="/blog/nabava-web-stranice-jednostavna-nabava.html">kako naručiti web stranicu kroz jednostavnu nabavu</a>, a što službena stranica mora imati u članku <a href="/blog/sto-mora-imati-web-stranica-opcine.html">što mora imati web stranica općine ili grada</a>.</p>
<p>Opću ponudu pogledajte na stranici <a href="/usluge/ai-chatbot/">AI chatbot</a>, a usluge za javne naručitelje na stranici <a href="/javni-sektor/">javni sektor</a>.</p>
{CTA}''',
 'faq_hr': [
  {'q': 'Može li AI asistent zamijeniti službenika?', 'a': 'Ne. Asistent odgovara na česta pitanja, vodi kroz obrasce i prima prijave, ali odluke i složene slučajeve preuzima nadležna osoba.'},
  {'q': 'Kako spriječiti da asistent izmišlja odgovore?', 'a': 'Asistent treba odgovarati samo iz službenih dokumenata i stranica koje mu zadate, a kad odgovora nema, to reći i uputiti korisnika na ured.'},
  {'q': 'Treba li korisnik znati da razgovara s AI?', 'a': 'Da. Asistent mora biti jasno označen kao AI, tako da korisnik zna s čim razgovara.'},
  {'q': 'Kako naručiti AI asistenta za općinu ili turističku zajednicu?', 'a': 'U pozivu za dostavu ponude opišite izvore znanja, jezike, što asistent smije i ne smije, tko ažurira sadržaj i razdoblje održavanja. Poziv pošaljite na marko@mangai.hr ili kroz obrazac za kontakt.'},
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

upsert(os.path.join(ROOT, 'blog/posts.json'), [isti_projekti, sudjelovanje, asistent])
print('ok')
