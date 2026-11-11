/* Vina Govorko — sadržaj stranice i ponuda vina (demo cijene) */
window.SITE = {
  id: 'govorko',
  orderPrefix: 'GOV',
  shipping: 5.9,
  freeShippingFrom: 60,
  labelFont: "'Gloock', Georgia, serif",
  labelSub: 'GOVORKO · DUSINA',
  titles: { hr: 'Vina Govorko — obiteljska vinarija iz Metkovića', en: 'Vina Govorko — family winery from Metković' },

  products: [
    { id: 'dispet', name: 'Dišpet', price: 12, vol: '0,75 l', type: 'white',
      kind: { hr: 'Bijelo', en: 'White' },
      grapes: { hr: 'zlatarica vrgorska, trbljan, maraština', en: 'Zlatarica Vrgorska, Trbljan, Maraština' },
      pos: { hr: 'im. m., dalm.', en: 'noun, Dalmatian' },
      meaning: { hr: 'inat, prkos.', en: 'spite, stubbornness.' },
      note: { hr: 'Naše prvo vino i prvo vino s etiketom iz Dusine. Grejp, limun i malo mandarine, a ispod toga dalmatinsko bilje. Svježe, za aperitiv ili uz bijelu ribu.', en: 'Our first wine and the first labelled wine ever made in Dusina. Grapefruit, lemon and a hint of mandarin over Dalmatian herbs. Fresh — an aperitif, or with white fish.' },
      bottle: { glass: 'flint', wine: '#e9d98a', label: '#f4f2ea', ink: '#1c2b27', band: '#e3761c', cap: '#1c2b27' } },

    { id: 'delozija', name: 'Đelozija', price: 12, vol: '0,75 l', type: 'rose',
      kind: { hr: 'Rosé', en: 'Rosé' },
      grapes: { hr: 'plavka', en: 'Plavka' },
      pos: { hr: 'im. ž., dalm. (tal. gelosia)', en: 'noun, Dalmatian (It. gelosia)' },
      meaning: { hr: 'ljubomora.', en: 'jealousy.' },
      note: { hr: 'Rosé od plavke, svijetao i voćan. Kažu da ga najviše piju žene — a moja kaže da je ljubomorna što sam stalno oko vina.', en: 'A rosé of Plavka, bright and fruity. They say women drink it most — and my wife says she is jealous that I am always around wine.' },
      bottle: { glass: 'flint', wine: '#f0a49a', label: '#f4f2ea', ink: '#5a1f3a', band: '#5a1f3a', cap: '#c9867c' } },

    { id: 'brankic', name: 'Brankić', price: 15, vol: '0,75 l', type: 'red',
      kind: { hr: 'Crno', en: 'Red' },
      grapes: { hr: 'plavka, vranac', en: 'Plavka, Vranac' },
      pos: { hr: 'im. m., od milja', en: 'noun, affectionate' },
      meaning: { hr: 'djed Branko, koji je u Dusini posadio 8.000 loza.', en: 'grandpa Branko, who planted 8,000 vines in Dusina.' },
      note: { hr: 'Crna kupaža iz starih trsova koje je posadio djed. Tamno voće, mekani tanini, vino za stol i dug razgovor.', en: 'A red blend from the old vines grandpa planted. Dark fruit and soft tannins — a wine for the table and a long conversation.' },
      bottle: { glass: 'dark', label: '#f4f2ea', ink: '#1c2b27', band: '#5a1f3a', cap: '#5a1f3a' } },

    { id: 'posip', name: 'Pošip', price: 16, vol: '0,75 l', type: 'white',
      kind: { hr: 'Bijelo', en: 'White' },
      grapes: { hr: 'pošip', en: 'Pošip' },
      pos: { hr: 'im. m., sorta', en: 'noun, grape variety' },
      meaning: { hr: 'ona za koju su nam rekli da u Dusini neće sazrit.', en: 'the one they told us would never ripen in Dusina.' },
      note: { hr: 'Posadili smo 2.000 cijepova unatoč svima. Sazrio je. Puno, zrelo bijelo s mineralnim krajem.', en: 'We planted 2,000 vines in spite of everyone. It ripened. A full, ripe white with a mineral finish.' },
      bottle: { glass: 'flint', wine: '#e6cf74', label: '#1c2b27', ink: '#f4f2ea', band: '#e3761c', cap: '#e3761c' } },

    { id: 'trnak', name: 'Trnak', price: 19, vol: '0,75 l', type: 'red',
      kind: { hr: 'Crno', en: 'Red' },
      grapes: { hr: 'trnak', en: 'Trnak' },
      pos: { hr: 'im. m., vrgorska sorta', en: 'noun, Vrgorac variety' },
      meaning: { hr: 'autohtona crna sorta koju vraćamo na vinsku kartu.', en: 'a native red grape we are bringing back to the wine list.' },
      note: { hr: 'Nasad iz 2019., prva berba 2022. Kupina, šljiva i začinsko bilje, živa kiselina. Malo boca, puno ponosa.', en: 'Planted in 2019, first harvest in 2022. Blackberry, plum and herbs with lively acidity. Few bottles, lots of pride.' },
      bottle: { glass: 'dark', label: '#e3761c', ink: '#1c2b27', band: '#1c2b27', cap: '#1c2b27' } },

    { id: 'bokun', name: 'Bokun', price: 22, vol: '0,75 l', type: 'white',
      kind: { hr: 'Bijelo, barrique', en: 'White, barrique' },
      grapes: { hr: 'odležano u hrastu', en: 'oak-aged' },
      pos: { hr: 'im. m., dalm.', en: 'noun, Dalmatian' },
      meaning: { hr: 'komadić, zalogaj.', en: 'a small piece, a bite.' },
      note: { hr: 'Naše bijelo iz bačava. Slojevito, kremasto, s notama vanilije i zrelog voća. Bokun za posebne prilike.', en: 'Our white from the barrels. Layered and creamy, with vanilla and ripe fruit. A little piece for special occasions.' },
      bottle: { glass: 'amber', label: '#f4f2ea', ink: '#1c2b27', band: '#a6ae8a', cap: '#a6ae8a' } },

    { id: 'pjenusac', name: 'Pjenušac', price: 24, vol: '0,75 l', type: 'sparkling',
      kind: { hr: 'Pjenušac', en: 'Sparkling' },
      grapes: { hr: 'plavka', en: 'Plavka' },
      pos: { hr: 'im. m.', en: 'noun' },
      meaning: { hr: 'plavka s mjehurićima. Rijetka stvar.', en: 'Plavka with bubbles. A rare thing.' },
      note: { hr: 'Pjenušac od plavke, sorte od koje ga gotovo nitko ne radi. Fini mjehurić, crveno voće, za proslave i bez povoda.', en: 'Sparkling wine from Plavka, a grape almost nobody makes it from. Fine bubbles and red fruit, for celebrations or none at all.' },
      bottle: { glass: 'green', label: '#f4f2ea', ink: '#5a1f3a', band: '#e3761c', cap: '#e3761c' } }
  ],

  renderProduct: function (p, h) {
    return '<article class="entry" id="vino-' + p.id + '">' +
      '<div class="entry-bottle">' + h.bottle(p) + '</div>' +
      '<div class="entry-body">' +
        '<h3 class="entry-word">' + p.name + '</h3>' +
        '<p class="entry-pos">' + h.L(p.pos) + '</p>' +
        '<p class="entry-def"><span class="sense">1.</span> ' + h.L(p.meaning) + '</p>' +
        '<p class="entry-def"><span class="sense">2.</span> ' + h.L(p.kind).toLowerCase() + ' ' + h.t('w.from') + ' ' + h.L(p.grapes) + '. ' + h.L(p.note) + '</p>' +
        '<div class="entry-buy"><span class="price">' + h.money(p.price) + '<small> / ' + p.vol + '</small></span>' +
        '<button type="button" class="btn-add" data-add="' + p.id + '">' + h.t('shop.add') + '</button></div>' +
      '</div></article>';
  }
};

window.SITE.i18n = window.mergeI18n(window.COMMON_I18N, {
  hr: {
    'nav.story': 'Priča', 'nav.vineyard': 'Vinograd', 'nav.wines': 'Vina', 'nav.visit': 'Posjet',
    'hero.pos': 'im. m., dalm.',
    'hero.d1': 'inat, prkos.',
    'hero.d2': 'bijelo vino iz Dusine. Prvo vino s etiketom u selu gdje su svi govorili da se dobro vino ne može napraviti.',
    'hero.ex': 'Pr. Napravili smo ga iz čistog dišpeta.',
    'hero.lead': 'Vina Govorko — obiteljska vinarija. Podrum u Metkoviću, vinogradi u Dusini.',
    'hero.cta': 'Pogledaj vina',
    'hero.cta2': 'Naša priča',
    'story.title': 'Sve je počelo šleperom ispred kuće',
    'story.p1': 'Jedno jutro ćaći je ispred kuće u Metkoviću stao šleper. Šofer je pozvonio, a ćaća me nazvao u Zagreb pitat šta se događa. Rekao sam mu da sve unesu u prostor gdje je bila stara mesnica i da ništa ne brine.',
    'story.p2': 'U kamionu je bilo deset rabljenih hrastovih bačava koje smo braća i ja našli dok sam završavao agronomiju. Te bačve su nas, praktički, odvele tu gdje smo danas.',
    'story.p3': 'Grožđe iz Dusine godinama se prodavalo prekupcima po pijacama. Rekao sam ćaći: ajmo ga ostavit doma i napravit vino. Ako se ne proda, popit ćemo ga. Prodalo se. Od 2015. smo registrirani i radimo bocu.',
    'story.cap': 'Vinarija Govorko, Metković',
    'story.sign': 'Ivan Govorko, vinar',
    'vy.title': 'Dusina, selo vinogradara',
    'vy.lead': 'Naši vinogradi su u Dusini, u vinogorju Vrgorac, jednom od najvećih u Hrvatskoj. Najstarije loze posadio je djed Branko prije više od pedeset godina i ne pada nam na pamet vadit ih.',
    'vy.k1': 'Vinogorje', 'vy.v1': 'Vrgorac, Dusina',
    'vy.k2': 'Vinogradi', 'vy.v2': 'oko 2 ha',
    'vy.k3': 'Stare loze', 'vy.v3': 'plavka, vranac, zlatarica vrgorska, maraština, trbljan',
    'vy.k4': 'Novi nasadi', 'vy.v4': 'pošip, trnak, merlot',
    'vy.k5': 'Podrum', 'vy.v5': 'Metković, Kneza Branimira 18',
    'vy.note': 'Kad smo između redova posijali ječam i grašak za zelenu gnojidbu, pola sela nas je pitalo jesmo li normalni. Jesmo. Samo radimo za bocu, a ne za pijacu.',
    'wines.title': 'Rječnik naših vina',
    'wines.lead': 'Svako naše vino nosi riječ iz kraja. Evo što znače — i kako ih naručiti.',
    'w.from': 'od sorti',
    'visit.title': 'Navrati na čašu',
    'visit.lead': 'Degustacije radimo u podrumu u Metkoviću, uz najavu. Javi se par dana ranije i dogovorit ćemo termin.',
    'visit.addr': 'Adresa', 'visit.phone': 'Mobitel', 'visit.mail': 'E-mail', 'visit.social': 'Pratite nas',
    'visit.map': 'Otvori na karti',
    'foot.slogan': 'Drink wine, feel fine.',
    'foot.opg': 'OPG Govorko · Kneza Branimira 18, 20350 Metković',
    'gal.aria': 'Fotografije iz vinarije'
  },
  en: {
    'nav.story': 'Story', 'nav.vineyard': 'Vineyard', 'nav.wines': 'Wines', 'nav.visit': 'Visit',
    'hero.pos': 'noun, Dalmatian dialect',
    'hero.d1': 'spite, stubbornness.',
    'hero.d2': 'a white wine from Dusina. The first labelled wine from a village where everyone said good wine could not be made.',
    'hero.ex': 'E.g. We made it out of pure dišpet.',
    'hero.lead': 'Vina Govorko — a family winery. Cellar in Metković, vineyards in Dusina.',
    'hero.cta': 'See the wines',
    'hero.cta2': 'Our story',
    'story.title': 'It all started with a truck outside the house',
    'story.p1': 'One morning a truck pulled up outside my dad\'s house in Metković. The driver rang the bell and dad called me in Zagreb to ask what was going on. I told him to carry everything into the old butcher shop downstairs and not to worry.',
    'story.p2': 'In the truck were ten used oak barrels my brothers and I had found while I was finishing my agronomy degree. Those barrels pretty much led us to where we are today.',
    'story.p3': 'For years, grapes from Dusina were sold to middlemen at the markets. I told dad: let\'s keep them and make wine. If it doesn\'t sell, we\'ll drink it. It sold. We registered in 2015 and started bottling.',
    'story.cap': 'Vina Govorko, Metković',
    'story.sign': 'Ivan Govorko, winemaker',
    'vy.title': 'Dusina, a village of winegrowers',
    'vy.lead': 'Our vineyards are in Dusina, in the Vrgorac wine region, one of the largest in Croatia. The oldest vines were planted by grandpa Branko more than fifty years ago, and we have no intention of pulling them out.',
    'vy.k1': 'Region', 'vy.v1': 'Vrgorac, Dusina',
    'vy.k2': 'Vineyards', 'vy.v2': 'about 2 ha',
    'vy.k3': 'Old vines', 'vy.v3': 'Plavka, Vranac, Zlatarica Vrgorska, Maraština, Trbljan',
    'vy.k4': 'New plantings', 'vy.v4': 'Pošip, Trnak, Merlot',
    'vy.k5': 'Cellar', 'vy.v5': 'Metković, Kneza Branimira 18',
    'vy.note': 'When we sowed barley and peas between the rows as green manure, half the village asked if we had lost our minds. We hadn\'t. We just grow for the bottle, not for the market.',
    'wines.title': 'A dictionary of our wines',
    'wines.lead': 'Each of our wines carries a word from home. Here is what they mean — and how to order them.',
    'w.from': 'from',
    'visit.title': 'Drop by for a glass',
    'visit.lead': 'We host tastings in our cellar in Metković, by appointment. Get in touch a few days ahead and we will set a time.',
    'visit.addr': 'Address', 'visit.phone': 'Phone', 'visit.mail': 'Email', 'visit.social': 'Follow us',
    'visit.map': 'Open in maps',
    'foot.slogan': 'Drink wine, feel fine.',
    'foot.opg': 'OPG Govorko · Kneza Branimira 18, 20350 Metković, Croatia',
    'gal.aria': 'Photos from the winery'
  }
});
