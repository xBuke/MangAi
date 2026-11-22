/* Vinarija Điko (OPG Kalajžić) — sadržaj stranice i ponuda vina (bez cijena — sve ide na upit) */
import { COMMON_I18N, mergeI18n } from '@shared/i18n-common.js';

export const PRODUCTS = [
 {
  "id": "marastina",
  "name": "Maraština",
  "vol": "0,75 l",
  "type": "white",
  "kind": {
   "hr": "Bijelo",
   "en": "White"
  },
  "grapes": {
   "hr": "maraština",
   "en": "Maraština"
  },
  "note": {
   "hr": "Stara dalmatinska sorta, kod nas svježa i čista. Bijelo cvijeće, kruška i slana završnica. Uz školjke, ribu i ljetne večeri.",
   "en": "An old Dalmatian grape, kept fresh and clean. White flowers, pear and a saline finish. With shellfish, fish and summer evenings."
  },
  "bottle": {
   "glass": "flint",
   "wine": "#ecdc95",
   "label": "#deddd6",
   "ink": "#23271d",
   "band": "#cdb15a",
   "cap": "#23271d"
  },
  "tint": "#e8e0b4"
 },
 {
  "id": "dika",
  "name": "Dika",
  "vol": "0,75 l",
  "type": "white",
  "tag": {
   "hr": "Sur lie",
   "en": "Sur lie"
  },
  "kind": {
   "hr": "Bijelo, sur lie",
   "en": "White, sur lie"
  },
  "grapes": {
   "hr": "maraština",
   "en": "Maraština"
  },
  "note": {
   "hr": "Maraština koja je mjesecima odležala na finom talogu. Punija i kremastija, s orašastim tonovima. Dika znači ponos — i to nam ovo vino jest.",
   "en": "Maraština aged for months on its fine lees. Fuller and creamier, with nutty notes. Dika means pride — and that is what this wine is to us."
  },
  "bottle": {
   "glass": "flint",
   "wine": "#e2c873",
   "label": "#23271d",
   "ink": "#deddd6",
   "band": "#cdb15a",
   "cap": "#cdb15a"
  },
  "tint": "#ddc985"
 },
 {
  "id": "zlatarica",
  "name": "Zlatarica",
  "vol": "0,75 l",
  "type": "white",
  "kind": {
   "hr": "Bijelo",
   "en": "White"
  },
  "grapes": {
   "hr": "zlatarica vrgorska",
   "en": "Zlatarica Vrgorska"
  },
  "note": {
   "hr": "Naša vrgorska sorta. Lepršava, citrusna, gotovo mediteranska. Najbolja ohlađena, na terasi, s pogledom na polje.",
   "en": "Our own Vrgorac grape. Lively, citrusy, almost Mediterranean. Best chilled, on a terrace, looking over the fields."
  },
  "bottle": {
   "glass": "flint",
   "wine": "#f1e3a0",
   "label": "#cdb15a",
   "ink": "#23271d",
   "band": "#23271d",
   "cap": "#cdb15a"
  },
  "tint": "#efe3a2"
 },
 {
  "id": "rose",
  "name": "Rosé",
  "vol": "0,75 l",
  "type": "rose",
  "kind": {
   "hr": "Rosé",
   "en": "Rosé"
  },
  "grapes": {
   "hr": "crne sorte iz Dusine",
   "en": "red grapes from Dusina"
  },
  "note": {
   "hr": "Lagan i svjež, s jagodom i malo citrusa. Vino za ručak koji se oduži.",
   "en": "Light and fresh, with strawberry and a touch of citrus. A wine for a lunch that runs long."
  },
  "bottle": {
   "glass": "flint",
   "wine": "#f3a99c",
   "label": "#deddd6",
   "ink": "#5b1a2a",
   "band": "#f3a99c",
   "cap": "#5b1a2a"
  },
  "tint": "#f1c3b7"
 },
 {
  "id": "merlot",
  "name": "Merlot",
  "vol": "0,75 l",
  "type": "red",
  "kind": {
   "hr": "Crno",
   "en": "Red"
  },
  "grapes": {
   "hr": "merlot",
   "en": "Merlot"
  },
  "note": {
   "hr": "Meko, zrelo crveno voće i baršunasti tanini. Uz meso s gradela i dobro društvo.",
   "en": "Soft, ripe red fruit and velvety tannins. With grilled meat and good company."
  },
  "bottle": {
   "glass": "dark",
   "label": "#deddd6",
   "ink": "#5b1a2a",
   "band": "#5b1a2a",
   "cap": "#5b1a2a"
  },
  "tint": "#5b1a2a"
 },
 {
  "id": "trnjak",
  "name": "Trnjak",
  "vol": "0,75 l",
  "type": "red",
  "kind": {
   "hr": "Crno",
   "en": "Red"
  },
  "grapes": {
   "hr": "trnjak (trnak)",
   "en": "Trnjak (Trnak)"
  },
  "note": {
   "hr": "Autohtona vrgorska crna sorta. Iskren i izravan, ali bez grubosti — kupina, šljiva i malo bilja.",
   "en": "A native red grape of Vrgorac. Honest and direct, but never harsh — blackberry, plum and a hint of herbs."
  },
  "bottle": {
   "glass": "dark",
   "label": "#5b1a2a",
   "ink": "#deddd6",
   "band": "#cdb15a",
   "cap": "#23271d"
  },
  "tint": "#3d1520"
 }
];

export const SITE = {
  id: 'diko',
  labelFont: "'Archivo', 'Arial Black', sans-serif",
  labelSub: 'ĐIKO · DUSINA',
  titles: { hr: 'Vinarija Điko — Dusina, Vrgorac', en: 'Điko Winery — Dusina, Vrgorac' },
  products: PRODUCTS,
  i18n: mergeI18n(COMMON_I18N, {
 "hr": {
  "nav.name": "Ime",
  "nav.wines": "Vina",
  "nav.awards": "Nagrade",
  "nav.visit": "Dusina",
  "nav.inq": "Upit",
  "visit.inq": "Pošalji upit za degustaciju",
  "hero.line": "Obiteljska vinarija iz Dusine, u srcu vrgoračkog vinogorja.",
  "hero.cta": "Pogledaj vina",
  "name.title": "Ime koje nosimo s ponosom",
  "name.p1": "Điko je obiteljski nadimak Kalajžića. Vinariju smo nazvali po njemu iz poštovanja prema onima koji su u Dusini sadili lozu prije nas.",
  "name.p2": "Godinama smo uzgajali grožđe za vino i za stol. 2021. smo prvi put izašli s vlastitim etiketama — i od tada ne stajemo.",
  "name.k1": "Vinogradi",
  "name.v1": "oko 3 ha",
  "name.k2": "Položaji",
  "name.v2": "više mikrolokacija oko Dusine",
  "name.k3": "Prva berba u boci",
  "name.v3": "2021.",
  "name.k4": "Sorte",
  "name.v4": "maraština, zlatarica, trnjak, merlot",
  "wines.title": "Vina",
  "wines.lead": "Šest vina iz Dusine. Dodaj ona koja te zanimaju u upit, a mi ti javimo cijenu i dostavu.",
  "awards.title": "Naša vina nagrađivana su na",
  "awards.note": "Svaka medalja je potvrda da Dusina ima što reći.",
  "gal.title": "Iz vinograda i podruma",
  "visit.title": "Dođi u Dusinu",
  "visit.lead": "Degustacije i obilaske dogovaramo izravno. Pošalji upit, nazovi ili napiši poruku, pa ćemo naći termin koji ti odgovara.",
  "visit.addr": "Adresa",
  "visit.phone": "Mobitel",
  "visit.mail": "E-mail",
  "visit.social": "Pratite nas",
  "visit.map": "Upute do vinarije",
  "foot.opg": "Vinarija Điko · OPG Kalajžić · Dusina 52, 21276 Vrgorac",
  "nav.process": "Berba",
  "nav.map": "Karta",
  "hero.scroll": "Skrolaj",
  "num.k1": "hektara vinograda",
  "num.k2": "prva berba u boci",
  "num.k3": "vina u ponudi",
  "num.k4": "sorte iz Dusine",
  "proc.kicker": "Od trsa do boce",
  "proc.title": "Jedna godina, šest koraka",
  "proc.p1.m": "Zima",
  "proc.p1.t": "Rezidba",
  "proc.p1.p": "Režemo lozu na više položaja oko Dusine. Svaki ima svoj karakter, pa i svoj rez.",
  "proc.p2.m": "Proljeće",
  "proc.p2.t": "Buđenje",
  "proc.p2.p": "Kamen se zagrije i loza krene. Pazimo na svaki pup, jer o njima ovisi cijela godina.",
  "proc.p3.m": "Ljeto",
  "proc.p3.t": "Sunce i kamen",
  "proc.p3.p": "Danju vrgoračko sunce peče, a noću kamen vraća toplinu. Tako grožđe skuplja šećer i miris.",
  "proc.p4.m": "Rujan",
  "proc.p4.t": "Berba",
  "proc.p4.p": "Beremo ručno, u kašete, rano ujutro dok je još svježe. Svaka sorta kad je ona spremna, ne kad nama paše.",
  "proc.p5.m": "Jesen",
  "proc.p5.t": "Podrum",
  "proc.p5.p": "Maraština za Diku ostaje mjesecima na finom talogu. Strpljenje je pola posla.",
  "proc.p6.m": "Godinu poslije",
  "proc.p6.t": "Boca",
  "proc.p6.p": "Etiketa Điko i put prema tvom stolu. Narudžbe šaljemo po cijeloj Hrvatskoj.",
  "proc.crate": "kašeta",
  "sel.aria": "Odaberi vino",
  "sel.prev": "Prethodno vino",
  "sel.next": "Sljedeće vino",
  "gal.open": "Otvori fotografiju",
  "gal.close": "Zatvori",
  "gal.prev": "Prethodna",
  "gal.next": "Sljedeća",
  "map.kicker": "Karta",
  "map.title": "Dusina i okolica",
  "map.lead": "Dusina je selo na rubu vrgoračkog polja, na pola puta između Makarske i delte Neretve. Odaberi mjesto i pogledaj koliko smo blizu.",
  "map.dist": "km zračne linije od vinarije",
  "map.here": "Ovdje smo",
  "map.fallback": "Karta se trenutno ne može učitati. Upute do vinarije otvori na Google kartama.",
  "map.reset": "Natrag na vinariju",
  "map.g.win": "Za zum drži Ctrl i skrolaj",
  "map.g.mac": "Za zum drži ⌘ i skrolaj",
  "map.g.mob": "Kartu pomičeš s dva prsta",
  "pl.vinarija.n": "Vinarija Điko",
  "pl.vinarija.r": "Dusina 52",
  "pl.vinarija.p": "Tu nas nađeš. Degustacije i obilaske dogovaramo izravno, javi se pa ćemo naći termin.",
  "pl.vrgorac.n": "Vrgorac",
  "pl.vrgorac.r": "Središte vinogorja",
  "pl.vrgorac.p": "Gradić iznad polja i rodni grad Tina Ujevića. Po njemu se zove vinogorje kojem pripada Dusina.",
  "pl.bacina.n": "Baćinska jezera",
  "pl.bacina.r": "Predah na putu",
  "pl.bacina.p": "Sedam jezera između brda i mora. Dobro mjesto za stat prije ili poslije degustacije.",
  "pl.ploce.n": "Ploče",
  "pl.ploce.r": "Najbliže more",
  "pl.ploce.p": "Grad i luka na moru, na rubu delte Neretve. Najbliža obala od Dusine.",
  "pl.opuzen.n": "Delta Neretve",
  "pl.opuzen.r": "Opuzen",
  "pl.opuzen.p": "Kanali, mandarine i ravnica do mora. Spoji degustaciju i izlet u deltu.",
  "pl.makarska.n": "Makarska",
  "pl.makarska.r": "Ako si na rivijeri",
  "pl.makarska.p": "Ljetuješ na Makarskoj rivijeri? Preko brda do nas nije daleko.",
  "glass.aria": "Natočeno",
  "glass.go": "Idi na vina"
 },
 "en": {
  "nav.name": "The name",
  "nav.wines": "Wines",
  "nav.awards": "Awards",
  "nav.visit": "Dusina",
  "nav.inq": "Enquiry",
  "visit.inq": "Enquire about a tasting",
  "hero.line": "A family winery from Dusina, in the heart of the Vrgorac wine region.",
  "hero.cta": "See the wines",
  "name.title": "A name we carry with pride",
  "name.p1": "Điko is the Kalajžić family nickname. We named the winery after it out of respect for those who planted vines in Dusina before us.",
  "name.p2": "For years we grew grapes for wine and for the table. In 2021 we released our own labels for the first time — and we have not stopped since.",
  "name.k1": "Vineyards",
  "name.v1": "about 3 ha",
  "name.k2": "Sites",
  "name.v2": "several micro-locations around Dusina",
  "name.k3": "First bottled vintage",
  "name.v3": "2021",
  "name.k4": "Grapes",
  "name.v4": "Maraština, Zlatarica, Trnjak, Merlot",
  "wines.title": "Wines",
  "wines.lead": "Six wines from Dusina. Add the ones you like to your enquiry and we will reply with prices and shipping.",
  "awards.title": "Our wines have won awards at",
  "awards.note": "Every medal is proof that Dusina has something to say.",
  "gal.title": "From the vineyard and the cellar",
  "visit.title": "Come to Dusina",
  "visit.lead": "We arrange tastings and visits directly. Call or send a message and we will find a time that suits you.",
  "visit.addr": "Address",
  "visit.phone": "Phone",
  "visit.mail": "Email",
  "visit.social": "Follow us",
  "visit.map": "Directions to the winery",
  "foot.opg": "Điko Winery · OPG Kalajžić · Dusina 52, 21276 Vrgorac, Croatia",
  "nav.process": "Harvest",
  "nav.map": "Map",
  "hero.scroll": "Scroll",
  "num.k1": "hectares of vineyards",
  "num.k2": "first bottled vintage",
  "num.k3": "wines on offer",
  "num.k4": "grape varieties from Dusina",
  "proc.kicker": "From vine to bottle",
  "proc.title": "One year, six steps",
  "proc.p1.m": "Winter",
  "proc.p1.t": "Pruning",
  "proc.p1.p": "We prune on several sites around Dusina. Each has its own character, and its own cut.",
  "proc.p2.m": "Spring",
  "proc.p2.t": "Waking up",
  "proc.p2.p": "The stone warms up and the vines start. We watch every bud, because the whole year depends on them.",
  "proc.p3.m": "Summer",
  "proc.p3.t": "Sun and stone",
  "proc.p3.p": "By day the Vrgorac sun burns, by night the stone gives the warmth back. That's how the grapes gather sugar and aroma.",
  "proc.p4.m": "September",
  "proc.p4.t": "Harvest",
  "proc.p4.p": "We pick by hand, into crates, early in the morning while it's still cool. Each variety when it's ready, not when it suits us.",
  "proc.p5.m": "Autumn",
  "proc.p5.t": "Cellar",
  "proc.p5.p": "The Maraština for Dika stays on its fine lees for months. Patience is half the job.",
  "proc.p6.m": "A year later",
  "proc.p6.t": "Bottle",
  "proc.p6.p": "The Điko label and the road to your table. We ship across Croatia.",
  "proc.crate": "crate",
  "sel.aria": "Choose a wine",
  "sel.prev": "Previous wine",
  "sel.next": "Next wine",
  "gal.open": "Open photo",
  "gal.close": "Close",
  "gal.prev": "Previous",
  "gal.next": "Next",
  "map.kicker": "Map",
  "map.title": "Dusina and around",
  "map.lead": "Dusina is a village at the edge of the Vrgorac field, halfway between Makarska and the Neretva delta. Pick a place and see how close we are.",
  "map.dist": "km as the crow flies from the winery",
  "map.here": "We are here",
  "map.fallback": "The map can't load right now. Open directions to the winery in Google Maps.",
  "map.reset": "Back to the winery",
  "map.g.win": "Use Ctrl + scroll to zoom the map",
  "map.g.mac": "Use ⌘ + scroll to zoom the map",
  "map.g.mob": "Use two fingers to move the map",
  "pl.vinarija.n": "Điko Winery",
  "pl.vinarija.r": "Dusina 52",
  "pl.vinarija.p": "This is where you'll find us. We arrange tastings and visits directly — get in touch and we'll find a time.",
  "pl.vrgorac.n": "Vrgorac",
  "pl.vrgorac.r": "Heart of the region",
  "pl.vrgorac.p": "A small town above the field and the birthplace of poet Tin Ujević. The wine region Dusina belongs to is named after it.",
  "pl.bacina.n": "Baćina lakes",
  "pl.bacina.r": "A stop on the way",
  "pl.bacina.p": "Seven lakes between the hills and the sea. A good place to stop before or after a tasting.",
  "pl.ploce.n": "Ploče",
  "pl.ploce.r": "Nearest sea",
  "pl.ploce.p": "A town and port on the sea at the edge of the Neretva delta. The nearest coast from Dusina.",
  "pl.opuzen.n": "Neretva delta",
  "pl.opuzen.r": "Opuzen",
  "pl.opuzen.p": "Canals, mandarin groves and flatland all the way to the sea. Combine a tasting with a trip to the delta.",
  "pl.makarska.n": "Makarska",
  "pl.makarska.r": "If you're on the riviera",
  "pl.makarska.p": "Holidaying on the Makarska riviera? Over the hills, we're not far.",
  "glass.aria": "Poured",
  "glass.go": "Go to wines"
 }
})
};
