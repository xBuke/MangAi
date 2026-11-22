# Čerin demo — efekti (ogledno/cerin)

Stranica je statična (HTML za HR/EN/DE/IT u `ogledno/cerin/`). Ovdje je izvor za `js/fx/` i skripta
kojom su s demo stranice maknute online rezervacije.

```bash
cd scripts/cerin
npm install
npm run build              # → ogledno/cerin/js/fx/ (fx.js + karta i MapLibre worker kao zasebni chunkovi)
python3 patch.py b4dc333   # ponovno primijeni izmjene HTML-a na verziju prije efekata (tekstovi su u patch.py)
```

- `src/fx.js` — Lenis (samo miš), hero slova + valovi, okno u kutu (napredak scrolla), naslovi, brojači,
  citat koji se pali, traka jela, "Od mora do stola" (sticky + GSAP timeline), nagib kartica, galerija, kontakt.
- `src/scene.js` — SVG scena u okruglom oknu (more → ulov → gradele → tanjur s Pošipom).
- `src/school.js` — jato ribica na platnu iza kontakta (bježe od kursora/prsta).
- `src/map.js` — MapLibre + OpenFreeMap karta kao kod Điko (mjesta na Korčuli, let kamere, udaljenost).
- Stilovi: `ogledno/cerin/css/fx.css`; `css/maplibre-gl.css` se učitava tek uz kartu.
- `prefers-reduced-motion`: bez animacija, "Od mora do stola" prikazuje sve korake i završnu scenu.
