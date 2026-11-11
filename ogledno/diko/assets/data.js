/* Vinarija Điko (OPG Kalajžić) — sadržaj stranice i ponuda vina (demo cijene) */
window.SITE = {
  id: 'diko',
  orderPrefix: 'DIK',
  shipping: 5.9,
  freeShippingFrom: 60,
  labelFont: "'Archivo', 'Arial Black', sans-serif",
  labelSub: 'ĐIKO · DUSINA',
  titles: { hr: 'Vinarija Điko — Dusina, Vrgorac', en: 'Điko Winery — Dusina, Vrgorac' },

  products: [
    { id: 'marastina', name: 'Maraština', price: 13, vol: '0,75 l', type: 'white',
      kind: { hr: 'Bijelo', en: 'White' },
      grapes: { hr: 'maraština', en: 'Maraština' },
      note: { hr: 'Stara dalmatinska sorta, kod nas svježa i čista. Bijelo cvijeće, kruška i slana završnica. Uz školjke, ribu i ljetne večeri.', en: 'An old Dalmatian grape, kept fresh and clean. White flowers, pear and a saline finish. With shellfish, fish and summer evenings.' },
      bottle: { glass: 'flint', wine: '#ecdc95', label: '#deddd6', ink: '#23271d', band: '#cdb15a', cap: '#23271d' } },

    { id: 'dika', name: 'Dika', price: 16, vol: '0,75 l', type: 'white', tag: { hr: 'Sur lie', en: 'Sur lie' },
      kind: { hr: 'Bijelo, sur lie', en: 'White, sur lie' },
      grapes: { hr: 'maraština', en: 'Maraština' },
      note: { hr: 'Maraština koja je mjesecima odležala na finom talogu. Punija i kremastija, s orašastim tonovima. Dika znači ponos — i to nam ovo vino jest.', en: 'Maraština aged for months on its fine lees. Fuller and creamier, with nutty notes. Dika means pride — and that is what this wine is to us.' },
      bottle: { glass: 'flint', wine: '#e2c873', label: '#23271d', ink: '#deddd6', band: '#cdb15a', cap: '#cdb15a' } },

    { id: 'zlatarica', name: 'Zlatarica', price: 13, vol: '0,75 l', type: 'white',
      kind: { hr: 'Bijelo', en: 'White' },
      grapes: { hr: 'zlatarica vrgorska', en: 'Zlatarica Vrgorska' },
      note: { hr: 'Naša vrgorska sorta. Lepršava, citrusna, gotovo mediteranska. Najbolja ohlađena, na terasi, s pogledom na polje.', en: 'Our own Vrgorac grape. Lively, citrusy, almost Mediterranean. Best chilled, on a terrace, looking over the fields.' },
      bottle: { glass: 'flint', wine: '#f1e3a0', label: '#cdb15a', ink: '#23271d', band: '#23271d', cap: '#cdb15a' } },

    { id: 'rose', name: 'Rosé', price: 12, vol: '0,75 l', type: 'rose',
      kind: { hr: 'Rosé', en: 'Rosé' },
      grapes: { hr: 'crne sorte iz Dusine', en: 'red grapes from Dusina' },
      note: { hr: 'Lagan i svjež, s jagodom i malo citrusa. Vino za ručak koji se oduži.', en: 'Light and fresh, with strawberry and a touch of citrus. A wine for a lunch that runs long.' },
      bottle: { glass: 'flint', wine: '#f3a99c', label: '#deddd6', ink: '#5b1a2a', band: '#f3a99c', cap: '#5b1a2a' } },

    { id: 'merlot', name: 'Merlot', price: 15, vol: '0,75 l', type: 'red',
      kind: { hr: 'Crno', en: 'Red' },
      grapes: { hr: 'merlot', en: 'Merlot' },
      note: { hr: 'Meko, zrelo crveno voće i baršunasti tanini. Uz meso s gradela i dobro društvo.', en: 'Soft, ripe red fruit and velvety tannins. With grilled meat and good company.' },
      bottle: { glass: 'dark', label: '#deddd6', ink: '#5b1a2a', band: '#5b1a2a', cap: '#5b1a2a' } },

    { id: 'trnjak', name: 'Trnjak', price: 18, vol: '0,75 l', type: 'red',
      kind: { hr: 'Crno', en: 'Red' },
      grapes: { hr: 'trnjak (trnak)', en: 'Trnjak (Trnak)' },
      note: { hr: 'Autohtona vrgorska crna sorta. Iskren i izravan, ali bez grubosti — kupina, šljiva i malo bilja.', en: 'A native red grape of Vrgorac. Honest and direct, but never harsh — blackberry, plum and a hint of herbs.' },
      bottle: { glass: 'dark', label: '#5b1a2a', ink: '#deddd6', band: '#cdb15a', cap: '#23271d' } }
  ],

  renderProduct: function (p, h) {
    return '<article class="wine" id="vino-' + p.id + '">' +
      '<div class="wine-bottle">' + h.bottle(p) + '</div>' +
      '<div class="wine-id"><h3>' + p.name + '</h3><p>' + h.L(p.kind) + '<br>' + h.L(p.grapes) + '</p></div>' +
      '<p class="wine-note">' + h.L(p.note) + '</p>' +
      '<div class="wine-buy"><span class="price">' + h.money(p.price) + '</span><span class="vol">' + p.vol + '</span>' +
      '<button type="button" class="btn-add" data-add="' + p.id + '">' + h.t('shop.add') + '</button></div>' +
      '</article>';
  }
};

window.SITE.i18n = window.mergeI18n(window.COMMON_I18N, {
  hr: {
    'nav.name': 'Ime', 'nav.wines': 'Vina', 'nav.awards': 'Nagrade', 'nav.visit': 'Dusina',
    'hero.line': 'Obiteljska vinarija iz Dusine, u srcu vrgoračkog vinogorja.',
    'hero.cta': 'Naruči vina',
    'name.title': 'Ime koje nosimo s ponosom',
    'name.p1': 'Điko je obiteljski nadimak Kalajžića. Vinariju smo nazvali po njemu iz poštovanja prema onima koji su u Dusini sadili lozu prije nas.',
    'name.p2': 'Godinama smo uzgajali grožđe za vino i za stol. 2021. smo prvi put izašli s vlastitim etiketama — i od tada ne stajemo.',
    'name.k1': 'Vinogradi', 'name.v1': 'oko 3 ha',
    'name.k2': 'Položaji', 'name.v2': 'više mikrolokacija oko Dusine',
    'name.k3': 'Prva berba u boci', 'name.v3': '2021.',
    'name.k4': 'Sorte', 'name.v4': 'maraština, zlatarica, trnjak, merlot',
    'wines.title': 'Vina',
    'wines.lead': 'Šest vina iz Dusine. Narudžbe šaljemo po cijeloj Hrvatskoj.',
    'awards.title': 'Naša vina nagrađivana su na',
    'awards.note': 'Svaka medalja je potvrda da Dusina ima što reći.',
    'gal.title': 'Iz vinograda i podruma',
    'visit.title': 'Dođi u Dusinu',
    'visit.lead': 'Degustacije i obilaske dogovaramo izravno. Nazovi ili pošalji poruku, pa ćemo naći termin koji ti odgovara.',
    'visit.addr': 'Adresa', 'visit.phone': 'Mobitel', 'visit.mail': 'E-mail', 'visit.social': 'Pratite nas',
    'visit.map': 'Upute do vinarije',
    'foot.opg': 'Vinarija Điko · OPG Kalajžić · Dusina 52, 21276 Vrgorac'
  },
  en: {
    'nav.name': 'The name', 'nav.wines': 'Wines', 'nav.awards': 'Awards', 'nav.visit': 'Dusina',
    'hero.line': 'A family winery from Dusina, in the heart of the Vrgorac wine region.',
    'hero.cta': 'Order wines',
    'name.title': 'A name we carry with pride',
    'name.p1': 'Điko is the Kalajžić family nickname. We named the winery after it out of respect for those who planted vines in Dusina before us.',
    'name.p2': 'For years we grew grapes for wine and for the table. In 2021 we released our own labels for the first time — and we have not stopped since.',
    'name.k1': 'Vineyards', 'name.v1': 'about 3 ha',
    'name.k2': 'Sites', 'name.v2': 'several micro-locations around Dusina',
    'name.k3': 'First bottled vintage', 'name.v3': '2021',
    'name.k4': 'Grapes', 'name.v4': 'Maraština, Zlatarica, Trnjak, Merlot',
    'wines.title': 'Wines',
    'wines.lead': 'Six wines from Dusina. We ship across Croatia.',
    'awards.title': 'Our wines have won awards at',
    'awards.note': 'Every medal is proof that Dusina has something to say.',
    'gal.title': 'From the vineyard and the cellar',
    'visit.title': 'Come to Dusina',
    'visit.lead': 'We arrange tastings and visits directly. Call or send a message and we will find a time that suits you.',
    'visit.addr': 'Address', 'visit.phone': 'Phone', 'visit.mail': 'Email', 'visit.social': 'Follow us',
    'visit.map': 'Directions to the winery',
    'foot.opg': 'Điko Winery · OPG Kalajžić · Dusina 52, 21276 Vrgorac, Croatia'
  }
});
