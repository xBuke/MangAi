// Sadržaj demoa. Stvarni podaci (izvor: muo.hr, tisak, izvješća MUO-a) i ogledni podaci (označeni: example).
// U produkciji sve ovo dolazi iz CMS-a (WordPress custom post types).

export const COLORS = {
  bordo: '#6B1F2E',
  teal: '#1F4E4A',
  kobalt: '#2E3E9E',
  oker: '#D9A441',
  cigla: '#C2452D',
  smeda: '#3B2A20',
  siva: '#8C8C8C',
  kamen: '#F2F0EC',
};

export const EXHIBITIONS = [
  {
    slug: 'muzej-u-malom',
    title: 'Muzej u malom',
    titleEn: 'Museum in Miniature',
    subtitle: 'Prvi pogled u budući stalni postav',
    subtitleEn: 'A first look at the future permanent display',
    status: 'current',
    place: 'MUO Galerija, Ilica 163a',
    loc: 'galerija',
    period: '[razdoblje trajanja]',
    curator: '[autor koncepcije]',
    price: '[cijena ulaznice]',
    color: COLORS.bordo,
    ink: '#ffffff',
    motif: 'vaza',
    lead: 'Izložba kojom je otvorena MUO Galerija sažeto najavljuje budući stalni postav Muzeja za umjetnost i obrt: svaku zbirku predstavlja jedan ili dva predmeta koji će se naći u novom postavu nakon povratka u obnovljenu zgradu na Trgu Republike Hrvatske.',
    body: [
      'MUO Galerija otvorena je u lipnju 2025. kao novi prostor Muzeja za susrete, izložbe, edukativna i kulturna događanja koja povezuju baštinu i suvremenost. Dok traje obnova matične zgrade, ovdje se publika upoznaje s onim što je čeka nakon ponovnog otvaranja.',
      'Predmeti iz zbirki namještaja, stakla, keramike, tekstila, metala, satova, fotografije, grafičkog i produkt dizajna izloženi su kao „trailer” stalnog postava – mala, gusta priča o tome kako su obrt, umjetnost i dizajn oblikovali svakodnevni život.',
    ],
    objects: ['stolica', 'casa', 'sat', 'tkanina', 'plakat', 'tanjur'],
  },
  {
    slug: 'portreti-s-filmskih-setova',
    title: 'Portreti s filmskih setova',
    titleEn: 'Portraits from Film Sets',
    subtitle: 'Hassan Abdelghani',
    subtitleEn: 'Hassan Abdelghani',
    status: 'upcoming',
    place: 'MUO Galerija, Ilica 163a',
    loc: 'galerija',
    period: '[razdoblje trajanja]',
    curator: '[kustos]',
    price: '[cijena ulaznice]',
    color: COLORS.teal,
    ink: '#ffffff',
    motif: 'fotoaparat',
    lead: 'Portreti nastali na filmskim setovima stižu u MUO Galeriju. [Opis izložbe unosi Muzej kroz CMS.]',
    body: ['[Tekst izložbe, popis radova i biografija autora.]'],
    objects: ['fotoaparat', 'plakat', 'lampa'],
  },
  {
    slug: 'mence-spirovska',
    title: 'Menče Spirovska – vizualne fascinacije Zagrebom',
    titleEn: 'Menče Spirovska – Visual Fascinations with Zagreb',
    subtitle: 'Gostovanje u Skoplju',
    subtitleEn: 'Guest exhibition in Skopje',
    status: 'guest',
    place: 'Nacionalna galerija Republike Sjeverne Makedonije, Skoplje',
    loc: 'vanjska',
    period: '[razdoblje trajanja]',
    curator: '[kustos]',
    price: '—',
    color: COLORS.kobalt,
    ink: '#ffffff',
    motif: 'plakat',
    lead: 'Jedna od dviju izložbi kojima se Muzej za umjetnost i obrt predstavio makedonskoj publici, povezujući hrvatsku i makedonsku kulturnu baštinu.',
    body: ['[Tekst izložbe unosi Muzej.]'],
    objects: ['plakat', 'kutija'],
  },
  {
    slug: 'stari-majstori-ljubljana',
    title: 'Stari majstori iz zbirke Muzeja za umjetnost i obrt',
    titleEn: 'Old Masters from the Museum of Arts and Crafts',
    subtitle: 'Narodna galerija, Ljubljana',
    subtitleEn: 'National Gallery of Slovenia, Ljubljana',
    status: 'archive',
    place: 'Narodna galerija, Ljubljana',
    loc: 'vanjska',
    period: '18. 9. 2024. – 9. 2. 2025.',
    curator: '[kustos]',
    price: '—',
    color: COLORS.smeda,
    ink: '#ffffff',
    motif: 'svijecnjak',
    lead: 'Gostovanje izbora djela starih majstora iz zbirki MUO-a u Narodnoj galeriji u Ljubljani.',
    body: ['[Tekst izložbe iz arhive.]'],
    objects: ['svijecnjak', 'tanjur'],
  },
];

export const STATUS_LABEL = {
  current: { hr: 'U tijeku', en: 'Now on' },
  upcoming: { hr: 'Uskoro', en: 'Coming soon' },
  guest: { hr: 'Gostovanje', en: 'On tour' },
  archive: { hr: 'Arhiva', en: 'Archive' },
};

// Ogledna događanja – datumi su relativni u odnosu na današnji dan (izračun u pregledniku),
// kako bi demo uvijek izgledao „živo” i pokazao automatsko premještanje u arhivu.
export const EVENTS = [
  { id: 'e1', type: 'Vodstvo', title: 'Kustosko vodstvo kroz izložbu Muzej u malom', loc: 'galerija', place: 'MUO Galerija, Ilica 163a', day: 2, time: '18:00', dur: 60, audience: 'Odrasli', price: 'Uz ulaznicu', exhibition: 'muzej-u-malom' },
  { id: 'e2', type: 'Radionica', title: 'Obiteljska radionica: uzorak na tkanini', loc: 'galerija', place: 'MUO Galerija, Ilica 163a', day: 3, time: '11:00', dur: 90, audience: 'Obitelji', price: '[cijena]', exhibition: 'muzej-u-malom' },
  { id: 'e3', type: 'Promocija', title: 'Promocija knjige „Razgled/nica povijesnoga Gospića”', loc: 'vanjska', place: '[lokacija promocije]', day: 5, time: '18:00', dur: 60, audience: 'Za sve', price: 'Ulaz slobodan' },
  { id: 'e4', type: 'Izložba', title: 'Otvorenje: Portreti s filmskih setova – Hassan Abdelghani', loc: 'galerija', place: 'MUO Galerija, Ilica 163a', day: 7, time: '19:00', dur: 90, audience: 'Za sve', price: 'Ulaz slobodan', exhibition: 'portreti-s-filmskih-setova' },
  { id: 'e5', type: 'Predavanje', title: 'Stari majstori iz zbirki MUO-a – predavanje uz novu monografiju', loc: 'galerija', place: 'MUO Galerija, Ilica 163a', day: 9, time: '18:00', dur: 75, audience: 'Odrasli', price: 'Ulaz slobodan' },
  { id: 'e6', type: 'Radionica', title: 'Školska radionica: kako nastaje staklo', loc: 'galerija', place: 'MUO Galerija, Ilica 163a', day: 11, time: '10:00', dur: 90, audience: 'Škole', price: '[cijena]' },
  { id: 'e7', type: 'Vodstvo', title: 'Taktilno vodstvo za slijepe i slabovidne', loc: 'galerija', place: 'MUO Galerija, Ilica 163a', day: 14, time: '17:00', dur: 60, audience: 'Osobe s invaliditetom', price: 'Ulaz slobodan', exhibition: 'muzej-u-malom' },
  { id: 'e8', type: 'Koncert', title: 'Zvuk zbirke: koncert na povijesnim instrumentima', loc: 'galerija', place: 'MUO Galerija, Ilica 163a', day: 18, time: '19:30', dur: 75, audience: 'Za sve', price: '[cijena]' },
  { id: 'e9', type: 'Radionica', title: 'Vrtićka radionica: oblici i boje', loc: 'galerija', place: 'MUO Galerija, Ilica 163a', day: 23, time: '10:00', dur: 45, audience: 'Vrtići', price: '[cijena]' },
  { id: 'e10', type: 'Predavanje', title: 'Zgrada i obnova: predavanje o povratku na Trg', loc: 'vanjska', place: '[lokacija]', day: 30, time: '18:00', dur: 60, audience: 'Za sve', price: 'Ulaz slobodan' },
  { id: 'p1', type: 'Promocija', title: 'Interliber: Egon Schiele ponovno pred publikom', loc: 'vanjska', place: 'Interliber, Zagreb', day: -9, time: '12:00', dur: 60, audience: 'Za sve', price: 'Ulaznica sajma' },
  { id: 'p2', type: 'Predavanje', title: 'Promocija znanstvene monografije o starim majstorima', loc: 'galerija', place: 'MUO Galerija, Ilica 163a', day: -14, time: '18:00', dur: 60, audience: 'Odrasli', price: 'Ulaz slobodan' },
];

export const EVENT_TYPES = ['Izložba', 'Radionica', 'Vodstvo', 'Predavanje', 'Promocija', 'Koncert'];
export const AUDIENCES = ['Za sve', 'Odrasli', 'Obitelji', 'Škole', 'Vrtići', 'Osobe s invaliditetom'];

export const NEWS = [
  { date: '17. 11. 2026.', title: 'Portreti s filmskih setova Hassana Abdelghanija stižu u MUO Galeriju', titleEn: 'Portraits from film sets by Hassan Abdelghani arrive at MUO Gallery' },
  { date: '16. 11. 2026.', title: 'Gospić kakav pamtimo – kako je nekad izgledao grad i život u njemu', titleEn: 'Gospić as we remember it' },
  { date: '11. 11. 2026.', title: 'Interliber: Egon Schiele ponovno pred publikom', titleEn: 'Interliber: Egon Schiele back before the public' },
  { date: '6. 11. 2026.', title: 'Predstavljena nova opsežna znanstvena monografija o starim majstorima', titleEn: 'New monograph on the Old Masters presented' },
  { date: '30. 10. 2026.', title: 'Muzej za umjetnost i obrt predstavio se makedonskoj publici s dvije izložbe', titleEn: 'MUO presents two exhibitions to audiences in North Macedonia' },
];

const C = COLORS;
export const COLLECTIONS = [
  ['Namještaj', 'Furniture', C.bordo, '#fff', 'stolica'],
  ['Staklo', 'Glass', C.kobalt, '#fff', 'casa'],
  ['Keramika', 'Ceramics', C.oker, '#111', 'tanjur'],
  ['Tekstil', 'Textiles', C.teal, '#fff', 'tkanina'],
  ['Satovi', 'Clocks and watches', C.kamen, '#111', 'sat'],
  ['Metal', 'Metalwork', C.siva, '#111', 'svijecnjak'],
  ['Grafički dizajn', 'Graphic design', C.cigla, '#fff', 'plakat'],
  ['Produkt dizajn', 'Product design', '#ffffff', '#111', 'lampa'],
  ['Novija fotografija', 'Modern photography', '#2B2B2B', '#fff', 'fotoaparat'],
  ['Glazbeni instrumenti', 'Musical instruments', '#9C6B3C', '#fff', 'violina'],
  ['Slikarstvo', 'Painting', C.smeda, '#fff', 'plakat'],
  ['Skulptura', 'Sculpture', '#BFB6A8', '#111', 'vaza'],
  ['Arhitektura', 'Architecture', '#D8D2C4', '#111', 'zgrada'],
  ['Bjelokost', 'Ivory', '#EFE7D6', '#111', 'kutija'],
  ['Devocionalije', 'Devotional objects', '#4A3B5C', '#fff', 'svijecnjak'],
  ['Starija fotografija', 'Early photography', '#6E6258', '#fff', 'fotoaparat'],
  ['Fotografska oprema', 'Photographic equipment', '#1E1E1E', '#fff', 'fotoaparat'],
  ['Grafika', 'Prints', '#A33B3B', '#fff', 'plakat'],
  ['Oslikana pozlaćena koža', 'Painted gilt leather', '#B88A2E', '#111', 'tkanina'],
  ['Tiskarstvo i knjigoveštvo', 'Printing and bookbinding', '#35524A', '#fff', 'kutija'],
  ['Varia', 'Varia', '#7C8A99', '#111', 'kutija'],
  ['Zbirka Anke Gvozdanović', 'Anka Gvozdanović Collection', '#5E2A3A', '#fff', 'vaza'],
].map(([name, nameEn, color, ink, motif], i) => ({ name, nameEn, color, ink, motif, n: i + 1, slug: name.toLowerCase().replace(/[čć]/g, 'c').replace(/š/g, 's').replace(/ž/g, 'z').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-') }));

// Predmeti za „Zid predmeta” – ilustracije, bez izmišljenih atribucija.
export const WALL = Array.from({ length: 36 }, (_, i) => {
  const col = COLLECTIONS[i % COLLECTIONS.length];
  const motifs = ['vaza', 'stolica', 'sat', 'tanjur', 'svijecnjak', 'plakat', 'fotoaparat', 'tkanina', 'kutija', 'casa', 'lampa', 'violina'];
  const names = { vaza: 'Vaza', stolica: 'Stolica', sat: 'Sat', tanjur: 'Tanjur', svijecnjak: 'Svijećnjak', plakat: 'Plakat', fotoaparat: 'Fotoaparat', tkanina: 'Tkanina', kutija: 'Kutija', casa: 'Pehar', lampa: 'Svjetiljka', violina: 'Violina' };
  const motif = motifs[(i * 5) % motifs.length];
  return { id: `p${i + 1}`, motif, name: names[motif], collection: col.name, color: col.color, ink: col.ink };
});

// Primjer radnog vremena MUO Galerije (potvrđuje Muzej). 0 = nedjelja.
export const HOURS = {
  0: ['10:00', '14:00'],
  1: null,
  2: ['10:00', '19:00'],
  3: ['10:00', '19:00'],
  4: ['10:00', '19:00'],
  5: ['10:00', '19:00'],
  6: ['10:00', '17:00'],
};
