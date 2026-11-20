// Linijske ilustracije predmeta (zamjena za fotografije dok ih Muzej ne dostavi).
// Svaka funkcija vraća <svg> s danom bojom crte. viewBox je 200×200.

const wrap = (inner, stroke, sw = 1.6, label = '') =>
  `<svg viewBox="0 0 200 200" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'} focusable="false">${inner}</svg>`;

export const OBJECTS = {
  vaza: (c) => wrap(`<path d="M82 30h36M86 30c0 18-30 30-30 78 0 34 18 58 44 58s44-24 44-58c0-48-30-60-30-78"/><path d="M60 92c26 8 54 8 80 0M57 118c28 9 58 9 86 0"/><path d="M78 140c14 6 30 6 44 0"/><ellipse cx="100" cy="30" rx="18" ry="4"/>`, c),
  stolica: (c) => wrap(`<path d="M72 26c-10 0-16 10-16 24 0 30 10 50 14 66"/><path d="M128 26c10 0 16 10 16 24 0 30-10 50-14 66"/><path d="M72 26c8-6 48-6 56 0"/><ellipse cx="100" cy="64" rx="22" ry="26"/><ellipse cx="100" cy="118" rx="44" ry="10"/><path d="M60 122l-8 58M140 122l8 58M76 126l-4 50M124 126l4 50"/><ellipse cx="100" cy="160" rx="34" ry="7"/>`, c),
  sat: (c) => wrap(`<circle cx="100" cy="108" r="58"/><circle cx="100" cy="108" r="50"/><path d="M100 64v8M100 144v8M56 108h8M136 108h8M69 77l6 6M125 133l6 6M69 139l6-6M125 83l6-6"/><path d="M100 108V80M100 108l18 12"/><circle cx="100" cy="108" r="3"/><path d="M92 50h16v-12H92zM96 38v-8h8v8"/><circle cx="100" cy="24" r="6"/>`, c),
  tanjur: (c) => wrap(`<circle cx="100" cy="100" r="78"/><circle cx="100" cy="100" r="62"/><circle cx="100" cy="100" r="34"/>${Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; const x = 100 + Math.cos(a) * 70; const y = 100 + Math.sin(a) * 70; return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4"/>`; }).join('')}<path d="M100 74c10 10 10 42 0 52-10-10-10-42 0-52zM74 100c10-10 42-10 52 0-10 10-42 10-52 0z"/>`, c),
  svijecnjak: (c) => wrap(`<path d="M94 22c0 8 12 8 12 0 0-6-6-12-6-12s-6 6-6 12z"/><path d="M92 34h16v34H92z"/><path d="M80 68h40l-6 10H86z"/><path d="M96 78v40c-10 4-14 12-14 20h36c0-8-4-16-14-20V78"/><path d="M70 160c0-12 14-22 30-22s30 10 30 22z"/><path d="M60 170h80"/>`, c),
  plakat: (c) => wrap(`<rect x="44" y="20" width="112" height="160"/><circle cx="100" cy="80" r="34"/><path d="M44 120h112M66 120l34-74 34 74"/><path d="M58 140h84M58 152h60M58 164h70"/>`, c),
  fotoaparat: (c) => wrap(`<rect x="30" y="64" width="140" height="92" rx="6"/><path d="M70 64l10-18h40l10 18"/><circle cx="100" cy="110" r="32"/><circle cx="100" cy="110" r="22"/><circle cx="100" cy="110" r="10"/><rect x="138" y="74" width="20" height="10"/><path d="M42 64v-8h16v8"/>`, c),
  tkanina: (c) => wrap(`<path d="M30 36c20-10 120-10 140 0v128c-20 10-120 10-140 0z"/>${Array.from({ length: 5 }, (_, r) => Array.from({ length: 5 }, (_, k) => { const x = 50 + k * 25; const y = 56 + r * 24; return `<path d="M${x} ${y - 8}l8 8-8 8-8-8z"/>`; }).join('')).join('')}<path d="M30 164l-6 12M48 168l-4 12M66 170l-2 12M84 171v12M102 171v12M120 171v12M138 170l2 12M156 168l4 12M170 164l6 12"/>`, c),
  kutija: (c) => wrap(`<path d="M36 80l64-28 64 28-64 28z"/><path d="M36 80v62l64 28 64-28V80"/><path d="M100 108v62"/><path d="M52 92l48 20 48-20"/><path d="M84 60c8-14 24-14 32 0"/>`, c),
  casa: (c) => wrap(`<path d="M64 24h72c0 40-12 70-36 76-24-6-36-36-36-76z"/><path d="M68 48h64"/><path d="M100 100v54"/><path d="M70 170c0-10 14-16 30-16s30 6 30 16z"/><path d="M84 30l-4 40M100 30v50M116 30l4 40"/>`, c),
  lampa: (c) => wrap(`<path d="M58 70c0-30 18-48 42-48s42 18 42 48z"/><path d="M58 70h84"/><path d="M100 70v80"/><path d="M76 160c0-8 10-12 24-12s24 4 24 12v8H76z"/><path d="M78 40c8-8 16-10 22-10"/>`, c),
  violina: (c) => wrap(`<path d="M100 20v40"/><rect x="94" y="12" width="12" height="10" rx="3"/><path d="M100 60c-22 0-30 14-26 28 3 10-10 12-10 30 0 26 16 50 36 50s36-24 36-50c0-18-13-20-10-30 4-14-4-28-26-28z"/><path d="M88 108c-4 6-4 14 0 20M112 108c4 6 4 14 0 20"/><path d="M92 146h16"/><path d="M98 60v86M102 60v86"/>`, c),
  zgrada: (c) => wrap(`<path d="M20 180V90h160v90"/><path d="M10 90L100 36l90 54"/><path d="M100 36V18"/><circle cx="100" cy="66" r="10"/><path d="M44 180v-56h22v56M134 180v-56h22v56M86 180v-66h28v66"/><path d="M44 112h22M134 112h22M20 100h160"/>`, c, 1.8),
};

export const OBJECT_KEYS = Object.keys(OBJECTS).filter((k) => k !== 'zgrada');

export function objectSvg(key, color = '#111111') {
  return (OBJECTS[key] || OBJECTS.vaza)(color);
}

// Veliki vektorski uzorak tkanine za duboki zum: niti postaju vidljive tek pri povećanju.
export function textileSvg() {
  const size = 1600;
  const cell = 200;
  let motifs = '';
  for (let y = 0; y < size / cell; y++) {
    for (let x = 0; x < size / cell; x++) {
      const cx = x * cell + cell / 2;
      const cy = y * cell + cell / 2;
      const alt = (x + y) % 2 === 0;
      motifs += alt
        ? `<g transform="translate(${cx} ${cy})"><path d="M0 -70 L60 0 L0 70 L-60 0Z" fill="#6B1F2E"/><path d="M0 -44 L38 0 L0 44 L-38 0Z" fill="#D9A441"/><circle r="12" fill="#1F4E4A"/><path d="M0 -70V-96M0 70V96M-60 0H-96M60 0H96" stroke="#1F4E4A" stroke-width="6"/></g>`
        : `<g transform="translate(${cx} ${cy})"><circle r="56" fill="none" stroke="#6B1F2E" stroke-width="10"/>${Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return `<ellipse cx="${(Math.cos(a) * 34).toFixed(1)}" cy="${(Math.sin(a) * 34).toFixed(1)}" rx="12" ry="5" transform="rotate(${(a * 180) / Math.PI} ${(Math.cos(a) * 34).toFixed(1)} ${(Math.sin(a) * 34).toFixed(1)})" fill="#2E3E9E"/>`; }).join('')}<circle r="8" fill="#D9A441"/></g>`;
    }
  }
  // Niti (osnova i potka) – fine linije vidljive pri zumu
  let threads = '';
  for (let i = 0; i <= size; i += 4) {
    threads += `<path d="M${i} 0V${size}" stroke="#000" stroke-opacity="${i % 8 === 0 ? 0.07 : 0.035}" stroke-width="0.6"/>`;
    threads += `<path d="M0 ${i}H${size}" stroke="#fff" stroke-opacity="${i % 8 === 0 ? 0.08 : 0.04}" stroke-width="0.6"/>`;
  }
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Ilustracija tkanine s geometrijskim uzorkom, uvećava se do razine niti" focusable="false"><rect width="${size}" height="${size}" fill="#F2E6D0"/>${motifs}<g>${threads}</g></svg>`;
}
