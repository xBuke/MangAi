# Demo stranica vinarije Điko (ogledno/diko)

> Vina Govorko je preseljena u zaseban repo **xBuke/govorko** i živi na **vinagovorko.hr**.
> Stari URL `mangai.hr/ogledno/govorko/*` 301 preusmjerava tamo (`vercel.json`).

Izvorni React kod za demo stranicu Điko. Build ide izravno u `/ogledno/diko/`
u rootu repoa, a Vercel ga servira kao statične datoteke. Ova mapa se ne deploya (`scripts/` je u `.vercelignore`).

```bash
cd scripts/vinarije
npm install
npm run build          # Điko → /ogledno/diko/
npm run dev:diko       # lokalni razvoj
```

## Struktura
- `shared/` — lista za upit i jezik (`shop.jsx`), boca (`Bottle.jsx`), animacijski elementi (`fx.jsx`),
  ladica liste, let boce, mala čaša u kutu (`ui.jsx`), obrazac upita (`Inquiry.jsx`),
  sekcija s čašom koja se puni (`GlassYear.jsx`), vodoravni koraci s promjenom palete (`HSteps.jsx`),
  GSAP postavke (`gsap.js`).

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
  Adrese i brojevi: `sites/diko/App.jsx`.
- Slike su još uvijek hotlinkane sa stranica vinarija; kad stignu nova loga i fotografije, zamijeniti u
  `sites/*/App.jsx`, `Hero.jsx`, `Gallery.jsx` (Điko) i boje u `style.css`.
- Tekstovi su u `sites/*/data.js` i `shared/i18n-common.js` (HR + EN).
