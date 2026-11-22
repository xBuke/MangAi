# Demo stranice vinarija (ogledno/govorko, ogledno/diko)

Izvorni React kod za dvije demo stranice. Build ide izravno u `/ogledno/govorko/` i `/ogledno/diko/`
u rootu repoa, a Vercel ih servira kao statične datoteke. Ova mapa se ne deploya (`scripts/` je u `.vercelignore`).

```bash
cd scripts/vinarije
npm install
npm run build          # obje stranice
npm run dev:govorko    # lokalni razvoj (ili dev:diko)
```

## Struktura
- `shared/` — lista za upit i jezik (`shop.jsx`), boca (`Bottle.jsx`), animacijski elementi (`fx.jsx`),
  ladica liste, let boce, mala čaša u kutu (`ui.jsx`), obrazac upita (`Inquiry.jsx`),
  sekcija s čašom koja se puni (`GlassYear.jsx`), vodoravni koraci s promjenom palete (`HSteps.jsx`),
  GSAP postavke (`gsap.js`).
- `sites/govorko/` — višestranična stranica (tamni smjer po katalogu vinarije, rječnik vina). Rute su u `routes.js`
  (HR + EN: početna, vina, 7 stranica vina, vinograd, obitelj, pokloni, posjet). Build: klijent + SSR (`entry-server.jsx`)
  + `prerender.mjs`, koji svaku rutu zapiše u vlastiti `index.html` s naslovom, opisom, canonical/hreflang i JSON-LD,
  te `sitemap.xml`. Slike su lokalne (`public/img/*.webp`, popis u `imgmeta.js`), fontovi su self-hosted (Fontsource),
  favicon je izrađen iz grba. Katalog za restorane: `public/vina-govorko-katalog.pdf`. Base je `/ogledno/govorko/`
  (u `vite.config.js` i `index.html`); kad stranica prijeđe na vlastitu domenu, promijeniti base i `SITE_ORIGIN`.
- `sites/diko/` — hero s fotografijom i znakom Điko (bez pina), berba sa čašom koja se puni (6 koraka),
  izbornik vina (pozadina prati boju vina), traka nagrada, galerija s fullscreen prijelazom,
  prava karta (MapLibre GL + OpenFreeMap).

## Mobitel / performanse
- Lenis (smooth scroll) radi samo na mišu; na dodirnim uređajima ostaje nativni scroll.
- Na mobitelu nema `backdrop-filter`; animacije valova i traka staju kad nisu na ekranu.
- Efekti vezani uz scroll pišu izravno u DOM/CSS varijable umjesto React re-rendera.
- Test: `python3 perf.py <site> 4` (Playwright, CPU 4× usporen) — vidi `/home/claude/tests` u sesiji.

## Napomene
- Sve animacije imaju fallback za `prefers-reduced-motion` (Điko berba se tada slaže okomito).
- Nema webshopa ni cijena. Posjetitelj slaže listu vina i šalje upit (narudžba, degustacija, restorani/trgovine,
  pokloni/događaji). Poruka se složi sama i otvara se e-mail (mailto:) ili WhatsApp (wa.me) vinarije.
  Adrese i brojevi: Govorko `sites/govorko/data.js` (`CONTACT`), Điko `sites/diko/App.jsx`.
- Slike su još uvijek hotlinkane sa stranica vinarija; kad stignu nova loga i fotografije, zamijeniti u
  `sites/*/App.jsx`, `Hero.jsx`, `Gallery.jsx` (Điko) i boje u `style.css`.
- Tekstovi su u `sites/*/data.js` i `shared/i18n-common.js` (HR + EN).
