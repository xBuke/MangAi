/* Vina Govorko — vina i tekstovi stranice (HR + EN).
 * Opisi, sorte, alkohol i temperature su iz kataloga vinarije (studeni 2026).
 * Trnak nema opisa u katalogu: tekst je nacrt koji treba potvrditi vinar.
 * Prijedlozi jela (pair) nisu iz kataloga — prijedlog, za potvrdu. */
import { COMMON_I18N, mergeI18n } from '@shared/i18n-common.js';

export const CONTACT = {
  email: 'vinagovorko@hotmail.com',
  phone: '+385 98 915 7997',
  whatsapp: '385989157997',
  street: 'Kneza Branimira 18',
  city: '20350 Metković',
  maps: 'https://www.google.com/maps/search/?api=1&query=Kneza+Branimira+18,+20350+Metkovi%C4%87'
};

export const WINES = [
  {
    id: 'dispet', name: 'Dišpet', year: '2022', type: 'white', abv: '12', temp: [10, 12],
    kind: { hr: 'Bijelo suho vino', en: 'Dry white wine' },
    grapes: { hr: 'Zlatarica vrgorska, maraština, trbljan', en: 'Zlatarica Vrgorska, Maraština, Trbljan' },
    pos: { hr: 'im. m., dalm.', en: 'noun, Dalmatian' },
    meaning: { hr: 'inat, prkos.', en: 'spite, stubbornness.' },
    story: { hr: 'Naše prvo vino i prvo vino s etiketom iz Dusine.', en: 'Our first wine, and the first labelled wine ever made in Dusina.' },
    desc: {
      hr: 'Bijelo vino Dišpet kupaža je zlatarice vrgorske, maraštine i trbljana. Proizvedeno je u inoxu, uz 40 % vina iz barrique bačve. Nježne je žute boje, a u nosu dominiraju grejp i agrumi. Miris je vrlo ugodan i dopadljiv. Svježe i skladno vino.',
      en: 'Dišpet is a blend of Zlatarica Vrgorska, Maraština and Trbljan, made in stainless steel with 40% of the wine from a barrique barrel. Pale yellow, with grapefruit and citrus leading on the nose. A very pleasant, inviting aroma. Fresh and harmonious.'
    },
    color: { hr: 'Nježno žuta', en: 'Pale yellow' }, swatch: ['#efe5a8', '#e2cf72'],
    nose: { hr: 'Grejp, agrumi', en: 'Grapefruit, citrus' },
    palate: { hr: 'Svježe, skladno', en: 'Fresh, harmonious' },
    making: { hr: 'Inox, 40 % iz barrique bačve', en: 'Stainless steel, 40% from barrique' },
    pair: { hr: ['Aperitiv', 'Bijela riba', 'Salata od hobotnice'], en: ['Aperitif', 'White fish', 'Octopus salad'] },
    photo: 'grozd-bijeli-2'
  },
  {
    id: 'delozija', name: 'Đelozija', year: '2021', type: 'rose', abv: '12', temp: [8, 10],
    kind: { hr: 'Rosé, suho vino', en: 'Dry rosé' },
    grapes: { hr: 'Plavka, 40 % merlot', en: 'Plavka, 40% Merlot' },
    pos: { hr: 'im. ž., dalm. (tal. gelosia)', en: 'noun, Dalmatian (It. gelosia)' },
    meaning: { hr: 'ljubomora.', en: 'jealousy.' },
    story: { hr: 'Kažu da ga najviše piju žene, a moja kaže da je ljubomorna što sam stalno oko vina.', en: 'They say women drink it most, and my wife says she is jealous that I am always around wine.' },
    desc: {
      hr: 'Ružičasto vino Đelozija spoj je naše autohtone plavke i 40 % merlota. Maceracija je vrlo kratka, svega 30 minuta. Blijedo je ružičaste boje, intenzivnog, čistog i postojanog mirisa na maline, bilje i bijele šljive. Vitkog je tijela, atraktivno sočno, s puno crvenog voća i svježine na kraju.',
      en: 'Đelozija blends our native Plavka with 40% Merlot. Skin contact is very short, just 30 minutes. Pale pink, with an intense, clean and lasting aroma of raspberries, herbs and white plums. Slender, attractively juicy, with plenty of red fruit and freshness on the finish.'
    },
    color: { hr: 'Blijedo ružičasta', en: 'Pale pink' }, swatch: ['#f6c9bc', '#eba08f'],
    nose: { hr: 'Maline, bilje, bijela šljiva', en: 'Raspberry, herbs, white plum' },
    palate: { hr: 'Vitko, sočno, crveno voće', en: 'Slender, juicy, red fruit' },
    making: { hr: 'Maceracija 30 minuta', en: '30 minutes on skins' },
    pair: { hr: ['Pašta s kozicama', 'Pršut i sir', 'Ljetne salate'], en: ['Pasta with prawns', 'Prosciutto and cheese', 'Summer salads'] },
    photo: 'vinograd-proljece-ruze'
  },
  {
    id: 'brankic', name: 'Brankić', year: '2021', type: 'red', abv: '14', temp: [16, 18],
    kind: { hr: 'Crno suho vino', en: 'Dry red wine' },
    grapes: { hr: 'Merlot i plavka, pola-pola', en: 'Merlot and Plavka, half and half' },
    pos: { hr: 'im. m., od milja', en: 'noun, affectionate' },
    meaning: { hr: 'djed Branko, koji je u Dusini posadio 8.000 loza.', en: 'grandpa Branko, who planted 8,000 vines in Dusina.' },
    story: { hr: 'Crna kupaža iz starih trsova koje je posadio djed.', en: 'A red blend from the old vines grandpa planted.' },
    desc: {
      hr: 'Crno vino Brankić kupaža je merlota i plavke u jednakom omjeru. Maceracija je trajala 12 dana, a nakon taloženja vino je odležalo 12 mjeseci u barrique bačvama. Blagog je okusa, sočno, sa zrelim aromama koje podsjećaju na šljivu i trešnju. Srednjeg je tijela, elegantno u ustima, odlične ravnoteže, solidnog trajanja i čistog finiša.',
      en: 'Brankić blends Merlot and Plavka in equal parts. Twelve days of maceration, then, after settling, 12 months in barrique. Gentle and juicy, with ripe aromas of plum and cherry. Medium-bodied and elegant, well balanced, with good length and a clean finish.'
    },
    color: { hr: 'Rubin crvena', en: 'Ruby red' }, swatch: ['#7a1f2c', '#4a0f1a'],
    nose: { hr: 'Zrela šljiva, trešnja', en: 'Ripe plum, cherry' },
    palate: { hr: 'Srednje tijelo, elegantno', en: 'Medium body, elegant' },
    making: { hr: '12 dana maceracije, 12 mjeseci u barriqueu', en: '12 days on skins, 12 months in barrique' },
    pair: { hr: ['Janjetina ispod peke', 'Pašticada', 'Zreli sirevi'], en: ['Lamb under the bell', 'Pašticada', 'Aged cheeses'] },
    photo: 'plavka-grozd'
  },
  {
    id: 'bokun', name: 'Bokun', year: '2019', type: 'white', abv: '12', temp: [12, 14],
    kind: { hr: 'Bijelo suho vino, barrique', en: 'Dry white wine, barrique' },
    grapes: { hr: 'Zlatarica vrgorska, maraština, trbljan', en: 'Zlatarica Vrgorska, Maraština, Trbljan' },
    pos: { hr: 'im. m., dalm.', en: 'noun, Dalmatian' },
    meaning: { hr: 'komadić, zalogaj.', en: 'a small piece, a bite.' },
    story: { hr: 'Naše bijelo iz bačava. Bokun za posebne prilike.', en: 'Our white from the barrels. A little piece for special occasions.' },
    desc: {
      hr: 'Bijelo vino Bokun kupaža je zlatarice vrgorske, maraštine i trbljana. Fermentacija i odležavanje odvijali su se u barrique bačvama pod kontroliranim uvjetima. Intenzivnog je i slojevitog mirisa. Okus je zaobljen, punog tijela, s malo slasti na kraju.',
      en: 'Bokun is a blend of Zlatarica Vrgorska, Maraština and Trbljan, fermented and aged in barrique under controlled conditions. Intense, layered aroma. Round and full-bodied on the palate, with a touch of sweetness on the finish.'
    },
    color: { hr: 'Zlatno žuta', en: 'Golden yellow' }, swatch: ['#e9cf6a', '#c9a23b'],
    nose: { hr: 'Intenzivan, slojevit', en: 'Intense, layered' },
    palate: { hr: 'Zaobljen, puno tijelo', en: 'Round, full-bodied' },
    making: { hr: 'Fermentacija i odležavanje u barriqueu', en: 'Fermented and aged in barrique' },
    pair: { hr: ['Riba iz pećnice', 'Piletina u umaku', 'Tvrdi sir'], en: ['Oven-baked fish', 'Chicken in sauce', 'Hard cheese'] },
    photo: 'grozd-zlatni'
  },
  {
    id: 'posip', name: 'Pošip', year: '2022', type: 'white', abv: '13', temp: [10, 12],
    kind: { hr: 'Bijelo suho vino', en: 'Dry white wine' },
    grapes: { hr: 'Pošip', en: 'Pošip' },
    pos: { hr: 'im. m., sorta', en: 'noun, grape variety' },
    meaning: { hr: 'ona za koju su nam rekli da tu neće sazrit.', en: 'the one they told us would never ripen here.' },
    story: { hr: 'Posadili smo 2.000 cijepova unatoč svima. Sazrio je.', en: 'We planted 2,000 vines in spite of everyone. It ripened.' },
    desc: {
      hr: 'Bijelo vino Pošip dolazi od naše autohtone dalmatinske sorte. Nježne je žute boje. U nosu su prvo citrusi, limun i naranča, a kasnije se osjeti i marelica. Miris je zavodljiv, ali ne napadan. Vino je suho, ugodne svježine, citrusnih tonova, slasno i pitko.',
      en: 'Pošip comes from our native Dalmatian variety. Pale yellow. Citrus first on the nose, lemon and orange, then apricot. Seductive but never pushy. Dry and pleasantly fresh, with citrus notes, delicious and easy to drink.'
    },
    color: { hr: 'Nježno žuta', en: 'Pale yellow' }, swatch: ['#efe3a2', '#e1cc6e'],
    nose: { hr: 'Limun, naranča, marelica', en: 'Lemon, orange, apricot' },
    palate: { hr: 'Suho, svježe, citrusno', en: 'Dry, fresh, citrusy' },
    making: { hr: 'Mladi nasad pošipa', en: 'Young Pošip vineyard' },
    pair: { hr: ['Riba s gradela', 'Školjke na buzaru', 'Mladi sir'], en: ['Grilled fish', 'Mussels buzara', 'Fresh cheese'] },
    photo: 'grozd-bijeli-1'
  },
  {
    id: 'trnak', name: 'Trnak', year: '', type: 'red', abv: '', temp: [16, 18], draft: true,
    kind: { hr: 'Crno vino', en: 'Red wine' },
    grapes: { hr: 'Trnak', en: 'Trnak' },
    pos: { hr: 'im. m., vrgorska sorta', en: 'noun, Vrgorac variety' },
    meaning: { hr: 'stara crna sorta koju vraćamo na vinsku kartu.', en: 'an old red grape we are bringing back to the wine list.' },
    story: { hr: 'Nasad iz 2019., prva berba 2022. Malo boca, puno ponosa.', en: 'Planted in 2019, first harvest in 2022. Few bottles, lots of pride.' },
    desc: {
      hr: 'Trnak je stara crna sorta vrgoračkog kraja koja je gotovo nestala iz vinograda. Posadili smo ga u novom nasadu, uz pošip i merlot, jer želimo da se za ovu sortu ponovno zna. Opis vina i tehničke podatke uskoro dopunjujemo.',
      en: 'Trnak is an old red variety of the Vrgorac area that had almost disappeared from the vineyards. We planted it in our new vineyard, alongside Pošip and Merlot, because we want this grape to be known again. Tasting notes and technical details are coming soon.'
    },
    color: { hr: 'Tamno crvena', en: 'Deep red' }, swatch: ['#5e1422', '#350a13'],
    nose: null, palate: null,
    making: { hr: 'Novi nasad, posađen 2019.', en: 'New vineyard, planted 2019' },
    pair: { hr: ['Meso s roštilja', 'Pršut i suhomesnato'], en: ['Grilled meat', 'Prosciutto and cured meats'] },
    photo: 'trsovi-ljeto'
  },
  {
    id: 'arija', name: 'Arija', year: '2019', type: 'sparkling', abv: '12', temp: [8, 10],
    kind: { hr: 'Vrhunski pjenušac, rosé brut', en: 'Premium sparkling rosé, brut' },
    grapes: { hr: 'Plavka', en: 'Plavka' },
    pos: { hr: 'im. ž., dalm. (tal. aria)', en: 'noun, Dalmatian (It. aria)' },
    meaning: { hr: 'zrak. Vino s malo zraka u sebi.', en: 'air. A wine with a little air in it.' },
    story: { hr: 'Pjenušac od plavke, sorte od koje ga gotovo nitko ne radi.', en: 'A sparkling wine from Plavka, a grape almost nobody makes it from.' },
    desc: {
      hr: 'Pjenušac Arija nastao je od naše autohtone plavke. Grožđe za bazno vino posebno je birano, a maceracija je trajala 30 minuta. Arija je napravljena klasičnom metodom vrenja u boci, nakon čega je 24 mjeseca odležavala na talogu. Nježne je ružičaste boje, finog i sitnog perlanja, ugodne svježine, voćnih i cvjetnih aroma te mirisa na jagodu.',
      en: 'Arija is made from our native Plavka. The grapes for the base wine were specially selected and spent 30 minutes on the skins. It was made by the traditional method, with a second fermentation in the bottle, then aged 24 months on the lees. Delicate pink, with fine, small bubbles, pleasant freshness, fruity and floral aromas and a scent of strawberry.'
    },
    color: { hr: 'Nježno ružičasta', en: 'Delicate pink' }, swatch: ['#f4cdb8', '#e7a98f'],
    nose: { hr: 'Jagoda, cvijeće', en: 'Strawberry, flowers' },
    palate: { hr: 'Fino perlanje, svježe', en: 'Fine bubbles, fresh' },
    making: { hr: 'Vrenje u boci, 24 mjeseca na talogu', en: 'Bottle-fermented, 24 months on lees' },
    pair: { hr: ['Aperitiv', 'Kamenice', 'Jagode i deserti'], en: ['Aperitif', 'Oysters', 'Strawberries and desserts'] },
    photo: 'boce-nebo'
  }
];

export const VARIETIES = [
  { name: { hr: 'Plavka', en: 'Plavka' }, color: 'red', old: true, wines: ['delozija', 'brankic', 'arija'] },
  { name: { hr: 'Zlatarica vrgorska', en: 'Zlatarica Vrgorska' }, color: 'white', old: true, wines: ['dispet', 'bokun'] },
  { name: { hr: 'Maraština', en: 'Maraština' }, color: 'white', old: true, wines: ['dispet', 'bokun'] },
  { name: { hr: 'Trbljan', en: 'Trbljan' }, color: 'white', old: true, wines: ['dispet', 'bokun'] },
  { name: { hr: 'Trnak', en: 'Trnak' }, color: 'red', old: false, wines: ['trnak'] },
  { name: { hr: 'Pošip', en: 'Pošip' }, color: 'white', old: false, wines: ['posip'] },
  { name: { hr: 'Merlot', en: 'Merlot' }, color: 'red', old: false, wines: ['brankic', 'delozija'] }
];

export const SEASONS = [
  { img: 'rezidba-zima', month: { hr: 'Siječanj', en: 'January' }, title: { hr: 'Rezidba', en: 'Pruning' }, text: { hr: 'Po hladnom režemo stare trsove. Svaki rez odlučuje koliko će grozdova trs nositi.', en: 'In the cold we prune the old vines. Every cut decides how many bunches a vine will carry.' }, alt: { hr: 'Orezani trs zimi, planine u pozadini', en: 'Pruned vine in winter, mountains behind' } },
  { img: 'rezidba-kap', month: { hr: 'Ožujak', en: 'March' }, title: { hr: 'Loza zaplače', en: 'The vine weeps' }, text: { hr: 'Kad se zemlja ugrije, sok krene i na svakom rezu stoji kap. Znak da se trs probudio.', en: 'When the soil warms up the sap rises and a drop forms on every cut. The vine is awake.' }, alt: { hr: 'Kap soka na orezanoj lozi', en: 'A drop of sap on a pruned vine' } },
  { img: 'pupanje', month: { hr: 'Travanj', en: 'April' }, title: { hr: 'Pupanje', en: 'Budburst' }, text: { hr: 'Iz starog drva izlaze prvi listovi. Tada se najviše bojimo kasnog mraza.', en: 'The first leaves break from the old wood. This is when we fear late frost the most.' }, alt: { hr: 'Prvi listovi na trsu u zoru', en: 'First leaves on the vine at dawn' } },
  { img: 'vinograd-proljece-ruze', month: { hr: 'Svibanj', en: 'May' }, title: { hr: 'Ruže na kraju reda', en: 'Roses at the end of the row' }, text: { hr: 'Vinograd ozeleni, a ruže na početku redova cvjetaju. Stari vinogradari su po njima prvi vidjeli bolest.', en: 'The vineyard turns green and the roses at the row ends bloom. Old growers read disease in them first.' }, alt: { hr: 'Zeleni redovi i crvene ruže', en: 'Green rows and red roses' } },
  { img: 'plavka-grozd', month: { hr: 'Kolovoz', en: 'August' }, title: { hr: 'Plavka dobiva boju', en: 'Plavka colours up' }, text: { hr: 'Grozdovi plavke potamne, a bijelo grožđe postaje zlatno. Probamo bobice i čekamo pravi trenutak.', en: 'Plavka darkens and the white grapes turn golden. We taste the berries and wait for the right moment.' }, alt: { hr: 'Zreli grozd plavke', en: 'Ripe Plavka bunch' } },
  { img: 'grozd-zlatni', month: { hr: 'Rujan', en: 'September' }, title: { hr: 'Berba', en: 'Harvest' }, text: { hr: 'Kad grožđe dođe u pravu ravnotežu slatkoće i svježine, beremo sortu po sortu.', en: 'When the grapes reach the right balance of sweetness and freshness, we pick variety by variety.' }, alt: { hr: 'Zlatni grozd spreman za berbu', en: 'Golden bunch ready to pick' } },
  { img: 'vinograd-jesen', month: { hr: 'Studeni', en: 'November' }, title: { hr: 'Vinograd se odmara', en: 'The vineyard rests' }, text: { hr: 'Lišće požuti, a vino je u podrumu u Metkoviću. Polje pod brdima ostaje tiho do rezidbe.', en: 'The leaves turn yellow and the wine is in the cellar in Metković. The field below the hills stays quiet until pruning.' }, alt: { hr: 'Vinograd u jesen pod planinama', en: 'The vineyard in autumn below the mountains' } }
];

const UI = {
  hr: {
    'nav.wines': 'Vina', 'nav.vineyard': 'Vinograd', 'nav.family': 'Obitelj', 'nav.gifts': 'Pokloni', 'nav.visit': 'Posjet',
    'nav.home': 'Početna', 'nav.menu': 'Izbornik', 'nav.inquiry': 'Pošalji upit', 'nav.skip': 'Preskoči na sadržaj',
    'list.label': 'Lista upita',
    'kind.white': 'Bijela', 'kind.rose': 'Rosé', 'kind.sparkling': 'Pjenušac', 'kind.red': 'Crna',
    'f.all': 'Sva vina', 'f.white': 'Bijela', 'f.pink': 'Rosé i pjenušac', 'f.red': 'Crna',
    'w.grapes': 'Sorte', 'w.abv': 'Alkohol', 'w.temp': 'Posluživanje', 'w.vol': 'Boca', 'w.region': 'Područje', 'w.regionv': 'Srednja i južna Dalmacija',
    'w.year': 'Berba', 'w.making': 'U podrumu', 'w.color': 'Boja', 'w.nose': 'Miris', 'w.palate': 'Okus', 'w.pair': 'Uz što ga otvaramo',
    'w.more': 'Sve o vinu', 'w.add': 'Dodaj na listu upita', 'w.added': 'Na listi upita', 'w.sheet': 'Katalog vina (PDF)',
    'w.related': 'Probaj i ova', 'w.prev': 'Prethodno vino', 'w.next': 'Sljedeće vino', 'w.draft': 'Opis uskoro',
    'w.from': 'Iz vinograda', 'w.fromlink': 'Upoznaj vinograd',
    'foot.wines': 'Vina', 'foot.winery': 'Vinarija', 'foot.contact': 'Kontakt', 'foot.age': 'Vina prodajemo samo punoljetnim osobama.',
    'list.empty': 'Lista je prazna. Dodaj vina koja te zanimaju, pa nam pošalji upit.',
    'list.go': 'Nastavi na upit', 'list.browse': 'Pogledaj vina'
  },
  en: {
    'nav.wines': 'Wines', 'nav.vineyard': 'Vineyard', 'nav.family': 'Family', 'nav.gifts': 'Gifts', 'nav.visit': 'Visit',
    'nav.home': 'Home', 'nav.menu': 'Menu', 'nav.inquiry': 'Send an inquiry', 'nav.skip': 'Skip to content',
    'list.label': 'Inquiry list',
    'kind.white': 'White', 'kind.rose': 'Rosé', 'kind.sparkling': 'Sparkling', 'kind.red': 'Red',
    'f.all': 'All wines', 'f.white': 'White', 'f.pink': 'Rosé & sparkling', 'f.red': 'Red',
    'w.grapes': 'Grapes', 'w.abv': 'Alcohol', 'w.temp': 'Serve at', 'w.vol': 'Bottle', 'w.region': 'Region', 'w.regionv': 'Central and Southern Dalmatia',
    'w.year': 'Vintage', 'w.making': 'In the cellar', 'w.color': 'Colour', 'w.nose': 'Nose', 'w.palate': 'Palate', 'w.pair': 'What we open it with',
    'w.more': 'All about', 'w.add': 'Add to inquiry list', 'w.added': 'On your inquiry list', 'w.sheet': 'Wine catalogue (PDF)',
    'w.related': 'Try these too', 'w.prev': 'Previous wine', 'w.next': 'Next wine', 'w.draft': 'Notes coming soon',
    'w.from': 'From the vineyard', 'w.fromlink': 'Meet the vineyard',
    'foot.wines': 'Wines', 'foot.winery': 'Winery', 'foot.contact': 'Contact', 'foot.age': 'We sell wine to adults only.',
    'list.empty': 'Your list is empty. Add the wines you are interested in, then send us an inquiry.',
    'list.go': 'Continue to inquiry', 'list.browse': 'Browse wines'
  }
};

export const SITE = {
  id: 'govorko',
  products: WINES,
  i18n: mergeI18n(COMMON_I18N, UI)
};

/* naslovi i opisi stranica za <head> (prerender) */
export const META = {
  home: {
    hr: ['Vina Govorko — obiteljska vinarija, Vinogorje Vrgorac', 'Obiteljska boutique vinarija Govorko iz Metkovića. Vinogradi stari preko 50 godina u Vinogorju Vrgorac, autohtone sorte plavka, zlatarica, maraština, trbljan i trnak.'],
    en: ['Vina Govorko — family winery, Vrgorac wine region', 'Govorko is a family boutique winery from Metković, Croatia. Vineyards over 50 years old in the Vrgorac wine region, native Plavka, Zlatarica, Maraština, Trbljan and Trnak.']
  },
  wines: {
    hr: ['Naša vina — Vina Govorko', 'Sedam vina iz Vinogorja Vrgorac: Dišpet, Đelozija, Brankić, Bokun, Pošip, Trnak i pjenušac Arija. Opisi, sorte i temperature posluživanja.'],
    en: ['Our wines — Vina Govorko', 'Seven wines from the Vrgorac wine region: Dišpet, Đelozija, Brankić, Bokun, Pošip, Trnak and the sparkling Arija. Notes, grapes and serving temperatures.']
  },
  vineyard: {
    hr: ['Vinograd u Vinogorju Vrgorac — Vina Govorko', 'Stari trsovi plavke, zlatarice vrgorske, maraštine i trbljana te novi nasadi trnka, pošipa i merlota. Godina u vinogradu, od rezidbe do berbe.'],
    en: ['Our vineyard in the Vrgorac wine region — Vina Govorko', 'Old vines of Plavka, Zlatarica Vrgorska, Maraština and Trbljan, and new plantings of Trnak, Pošip and Merlot. A year in the vineyard, from pruning to harvest.']
  },
  family: {
    hr: ['Obitelj Govorko — priča vinarije', 'Kako su deset rabljenih bačava, djedovi trsovi i malo inata postali vinarija Govorko u Metkoviću.'],
    en: ['The Govorko family — our story', 'How ten used barrels, grandpa’s vines and a bit of stubbornness became the Govorko winery in Metković.']
  },
  gifts: {
    hr: ['Poklon pakiranja i poslovni darovi — Vina Govorko', 'Drvena kutija s kartom, kolekcija pet vina u drvu i kofer sa šest boca. Pokloni za prilike i poslovne partnere, na upit.'],
    en: ['Gift boxes and corporate gifts — Vina Govorko', 'A wooden box with a map, a five-wine collection in wood and a six-bottle case. Gifts for occasions and business partners, on request.']
  },
  visit: {
    hr: ['Posjet, degustacije i upit — Vina Govorko', 'Dogovori degustaciju u vinariji u Metkoviću ili pošalji upit za vina, restorane i poklone. Kneza Branimira 18, Metković.'],
    en: ['Visit, tastings and inquiries — Vina Govorko', 'Book a tasting at the winery in Metković or send an inquiry for wines, restaurants and gifts. Kneza Branimira 18, Metković.']
  }
};
