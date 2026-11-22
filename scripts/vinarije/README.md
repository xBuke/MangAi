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
- `shared/` — košarica i jezik (`shop.jsx`), boca (`Bottle.jsx`), čaša koja se puni, split text,
  riječi koje se pale na scroll, brojači, magnetski gumbi, 3D nagib, beskonačna traka (`fx.jsx`),
  ladica košarice, let boce u košaricu (`ui.jsx`), simulirani Stripe checkout (`Checkout.jsx`).
- `sites/govorko/` — Motion + Lenis. Hero "rječnik" s riječima koje se izmjenjuju, "Godina u Dusini"
  (zakvačena sekcija: grozd sazrijeva, čaša se puni), rječnik vina s filterima, ilustrirana SVG karta
  Dusina → Metković.
- `sites/diko/` — GSAP ScrollTrigger + Lenis na GSAP tickeru. Hero fotografija koja naraste preko ekrana,
  vodoravna berba s promjenom palete, izbornik vina (pozadina prati boju vina), beskonačna traka nagrada,
  galerija s prijelazom u fullscreen, prava karta (MapLibre GL + OpenFreeMap), čaša u kutu = napredak scrolla.

## Napomene
- Sve animacije imaju fallback za `prefers-reduced-motion` (Điko berba se tada slaže okomito).
- Checkout je simuliran: 4242 4242 4242 4242 prolazi, 4000 0000 0000 0002 je odbijena, 18+ obavezno.
- Slike su još uvijek hotlinkane sa stranica vinarija; kad stignu nova loga i fotografije, zamijeniti u
  `sites/*/App.jsx`, `Hero.jsx`, `Gallery.jsx` (Điko) i boje u `style.css`.
- Tekstovi i cijene su u `sites/*/data.js` (HR + EN).
