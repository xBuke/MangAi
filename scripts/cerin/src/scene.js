/* "Od mora do stola" — SVG scena u okruglom prozoru (okno broda).
 * Korak 1 more i brodić, 2 ulov (riba izleti iz mora), 3 gradele na drva, 4 tanjur, Pošip i lampice. */

const FISH_BODY = 'M-30 0 C -20 -15, 8 -17, 24 -5 C 28 -2, 31 0, 31 0 C 31 0, 28 2, 24 5 C 8 17, -20 15, -30 0 Z';
const FISH_TAIL = 'M-27 0 L -44 -13 C -40 -4, -40 4, -44 13 Z';
const SMALL = 'M-30 0 C -20 -15, 8 -17, 24 -5 L 31 0 L 24 5 C 8 17, -20 15, -30 0 Z M-27 0 L -44 -13 L -40 0 L -44 13 Z';
const BOWL = 'M-17 -32 C -17 -8, -11 3, 0 3 C 11 3, 17 -8, 17 -32 Z';

function surf(y, amp, period, len) {
  let d = `M0 ${y}`;
  for (let x = 0; x < len; x += period) {
    d += ` C ${x + period * 0.25} ${y - amp}, ${x + period * 0.25} ${y - amp}, ${x + period / 2} ${y}`;
    d += ` C ${x + period * 0.75} ${y + amp}, ${x + period * 0.75} ${y + amp}, ${x + period} ${y}`;
  }
  return d + ` V ${y + 10} H 0 Z`;
}

function quad(t, a, b, c) { return (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c; }

export function sceneSVG() {
  const school = [
    [250, 0.32, 13, 0, 1], [290, 0.26, 17, -6, 1], [228, 0.22, 15, -11, 1], [305, 0.3, 19, -3, -1], [270, 0.2, 21, -14, -1], [318, 0.24, 16, -9, 1]
  ].map(([y, s, dur, delay, dir]) =>
    `<g class="s-f${dir < 0 ? ' s-f--r' : ''}" style="animation-duration:${dur}s;animation-delay:${delay}s"><path transform="translate(0 ${y}) scale(${dir * s} ${s})" d="${SMALL}"/></g>`).join('');

  const bubbles = [[60, 360, 0], [118, 330, -2.2], [214, 370, -1.1], [306, 350, -3], [352, 300, -0.6], [160, 380, -3.6]]
    .map(([x, y, d], i) => `<circle class="s-b" cx="${x}" cy="${y}" r="${1.6 + (i % 3)}" style="animation-delay:${d}s"/>`).join('');

  const stars = [[60, 70], [96, 46], [140, 82], [182, 40], [230, 66], [262, 30], [300, 78], [338, 54], [118, 120], [320, 120], [74, 128], [210, 104], [356, 96], [168, 128]]
    .map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${0.7 + (i % 3) * 0.45}" class="s-star" style="animation-delay:${(i % 5) * 0.6}s"/>`).join('');

  const bulbs = Array.from({ length: 9 }, (_, i) => {
    const t = (i + 1) / 10;
    const x = quad(t, 22, 200, 378), y = quad(t, 92, 176, 92);
    return `<g class="s-bulb" style="animation-delay:${(i % 4) * 0.4}s"><circle cx="${x.toFixed(1)}" cy="${(y + 7).toFixed(1)}" r="11" fill="#f6d58c" opacity=".28"/><circle cx="${x.toFixed(1)}" cy="${(y + 7).toFixed(1)}" r="4" fill="#fff0c7"/></g>`;
  }).join('');

  const flames = [[150, 40, 0], [174, 54, -0.3], [200, 62, -0.15], [226, 52, -0.45], [250, 40, -0.2]]
    .map(([x, h, d]) => `<path class="s-flame" style="animation-delay:${d}s" transform="translate(${x} 326)" d="M0 0 C -13 -${h * 0.3}, -7 -${h * 0.62}, 0 -${h} C 7 -${h * 0.62}, 13 -${h * 0.3}, 0 0 Z" fill="url(#st-flame)"/>`).join('');

  const grate = Array.from({ length: 15 }, (_, i) => `<path d="M${100 + i * 14} 252 L ${92 + i * 15.2} 262"/>`).join('');

  const bolts = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    return `<circle cx="${(200 + Math.cos(a) * 190).toFixed(1)}" cy="${(200 + Math.sin(a) * 190).toFixed(1)}" r="3.2"/>`;
  }).join('');

  return `<svg class="scene" viewBox="-8 -8 416 416" xmlns="http://www.w3.org/2000/svg" focusable="false">
<defs>
  <clipPath id="st-c"><circle cx="200" cy="200" r="178"/></clipPath>
  <linearGradient id="st-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b3a63"/><stop offset=".5" stop-color="#b9774f"/><stop offset=".92" stop-color="#f2cf86"/></linearGradient>
  <linearGradient id="st-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d4c77"/><stop offset=".55" stop-color="#132a45"/><stop offset="1" stop-color="#08131f"/></linearGradient>
  <radialGradient id="st-sun"><stop offset="0" stop-color="#fff3d1"/><stop offset=".45" stop-color="#f6d58c" stop-opacity=".7"/><stop offset="1" stop-color="#f6d58c" stop-opacity="0"/></radialGradient>
  <linearGradient id="st-flame" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#d9581f"/><stop offset=".55" stop-color="#e7b24f"/><stop offset="1" stop-color="#fff0c7"/></linearGradient>
  <linearGradient id="st-night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#08131f"/><stop offset=".7" stop-color="#132a45"/><stop offset="1" stop-color="#1b3a63"/></linearGradient>
  <linearGradient id="st-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3522"/><stop offset="1" stop-color="#1e150d"/></linearGradient>
  <clipPath id="st-fish"><path d="${FISH_BODY}"/></clipPath>
  <clipPath id="st-bowl"><path d="${BOWL}"/></clipPath>
</defs>
<g clip-path="url(#st-c)">
  <rect x="0" y="0" width="400" height="400" fill="url(#st-sky)"/>
  <g class="s-sun"><circle cx="268" cy="150" r="66" fill="url(#st-sun)"/><circle cx="268" cy="150" r="22" fill="#fff0c7"/></g>
  <rect class="s-night" x="0" y="0" width="400" height="400" fill="url(#st-night)" opacity="0"/>
  <g class="s-stars" fill="#f3e7cf" opacity="0">${stars}</g>
  <g class="s-sea">
    <rect x="0" y="182" width="400" height="300" fill="url(#st-sea)"/>
    <g class="s-glint" fill="#f6d58c">
      <rect x="244" y="190" width="48" height="2.2" rx="1.1" opacity=".55"/><rect x="252" y="198" width="34" height="2" rx="1" opacity=".42"/>
      <rect x="240" y="207" width="26" height="1.8" rx=".9" opacity=".32"/><rect x="262" y="214" width="30" height="1.6" rx=".8" opacity=".26"/>
    </g>
    <g class="s-surf"><path d="${surf(180, 4, 50, 800)}" fill="#1d4c77"/></g>
    <g class="s-surf s-surf--2"><path d="${surf(184, 2.5, 80, 880)}" fill="none" stroke="#f3e7cf" stroke-opacity=".22" stroke-width="1.2"/></g>
    <g class="s-school" fill="#f3e7cf" fill-opacity=".38">${school}</g>
    <g class="s-bubbles" fill="none" stroke="#f3e7cf" stroke-opacity=".5">${bubbles}</g>
    <g class="s-boat"><g class="s-bob">
      <path d="M-38 -3 L 38 -3 L 27 12 L -29 12 Z" fill="#f3e7cf"/>
      <path d="M-35 2 L 35 2" stroke="#a8741b" stroke-width="2"/>
      <rect x="-16" y="-17" width="20" height="14" rx="2" fill="#fbf8f2"/>
      <rect x="-12" y="-13" width="5" height="5" fill="#1b3a63"/><rect x="-4" y="-13" width="5" height="5" fill="#1b3a63"/>
      <path d="M-6 -17 V -48" stroke="#f3e7cf" stroke-width="1.6"/>
      <path d="M-6 -48 L 9 -43 L -6 -38 Z" fill="#e7b24f"/>
      <path d="M18 -3 L 44 -34" stroke="#6b4a2a" stroke-width="1.8" stroke-linecap="round"/>
      <line class="s-line" x1="44" y1="-34" x2="44" y2="-30" stroke="#f3e7cf" stroke-width="1" stroke-opacity=".85"/>
    </g></g>
  </g>
  <g class="s-splash" fill="#f3e7cf">
    <ellipse cx="180" cy="182" rx="22" ry="4" fill="none" stroke="#f3e7cf" stroke-width="1.6"/>
    <circle cx="166" cy="164" r="2.6"/><circle cx="174" cy="152" r="2"/><circle cx="188" cy="150" r="2.4"/><circle cx="197" cy="162" r="2"/><circle cx="160" cy="174" r="1.8"/><circle cx="200" cy="174" r="1.6"/>
  </g>
  <g class="s-grill">
    <g class="s-smoke" fill="none" stroke="#f3e7cf" stroke-width="2" stroke-linecap="round" stroke-opacity=".35">
      <path d="M176 214 C 168 196, 186 186, 176 166 C 168 150, 184 140, 178 122"/>
      <path d="M204 210 C 196 192, 214 182, 204 162 C 196 146, 212 136, 206 118" style="animation-delay:-1.3s"/>
      <path d="M230 214 C 222 196, 240 186, 230 166 C 222 150, 238 140, 232 122" style="animation-delay:-2.4s"/>
    </g>
    <path d="M104 262 L 92 344 M296 262 L 308 344" stroke="#3a4048" stroke-width="4" stroke-linecap="round"/>
    <g transform="translate(200 334)"><rect x="-66" y="-7" width="132" height="14" rx="7" fill="#6b4a2a" transform="rotate(-8)"/><rect x="-62" y="-7" width="124" height="14" rx="7" fill="#57391f" transform="rotate(9)"/></g>
    <g class="s-embers" fill="#e7672a"><circle cx="160" cy="328" r="2.4"/><circle cx="186" cy="332" r="1.8"/><circle cx="214" cy="327" r="2.2"/><circle cx="240" cy="331" r="1.8"/></g>
    ${flames}
    <path d="M100 252 L 300 252 L 312 262 L 88 262 Z" fill="none" stroke="#2a2f36" stroke-width="3" stroke-linejoin="round"/>
    <g stroke="#2a2f36" stroke-width="1.6">${grate}</g>
  </g>
  <g class="s-lights" opacity="0">
    <path d="M22 92 Q 200 176 378 92" fill="none" stroke="#f3e7cf" stroke-opacity=".4" stroke-width="1.2"/>
    ${bulbs}
  </g>
  <g class="s-table"><path d="M-10 248 L 410 248 L 410 410 L -10 410 Z" fill="url(#st-wood)"/><path d="M-10 248 H 410" stroke="#e7b24f" stroke-opacity=".35" stroke-width="1.5"/><path d="M40 300 H 140 M220 330 H 360 M80 362 H 200" stroke="#000" stroke-opacity=".18" stroke-width="1.2"/></g>
  <g class="s-plate">
    <ellipse cx="200" cy="284" rx="132" ry="26" fill="#08131f" opacity=".35"/>
    <ellipse cx="200" cy="270" rx="132" ry="31" fill="#fbf8f2"/>
    <ellipse cx="200" cy="268" rx="106" ry="22" fill="none" stroke="#e7b24f" stroke-width="1.4"/>
  </g>
  <g class="s-side">
    <g fill="#ecd58a" stroke="#c9a65a" stroke-width="1"><ellipse cx="116" cy="262" rx="13" ry="9"/><ellipse cx="134" cy="270" rx="12" ry="8"/><ellipse cx="128" cy="254" rx="10" ry="7"/></g>
    <g fill="#4f7a3a"><circle cx="120" cy="258" r="1.6"/><circle cx="132" cy="266" r="1.4"/><circle cx="126" cy="252" r="1.3"/><circle cx="138" cy="261" r="1.5"/><circle cx="264" cy="276" r="1.5"/><circle cx="246" cy="280" r="1.3"/></g>
    <g transform="translate(272 262) rotate(-14)"><path d="M-15 0 A 15 15 0 0 1 15 0 Z" fill="#f4d03f" stroke="#d9b02a" stroke-width="1.2"/><path d="M0 0 L -9 -11 M0 0 L 0 -14 M0 0 L 9 -11" stroke="#fbeaa0" stroke-width="1"/></g>
  </g>
  <g class="s-catch"><g class="s-catch-in">
    <path d="${FISH_TAIL}" fill="#c98f3a"/>
    <path class="s-body" d="${FISH_BODY}" fill="#e7b24f"/>
    <g clip-path="url(#st-fish)"><path d="M-30 -4 C -10 -10, 10 -8, 30 -2" stroke="#f2cf86" stroke-width="3" fill="none" opacity=".8"/>
      <g class="s-marks" stroke="#4a2c14" stroke-width="2.6" stroke-linecap="round" opacity="0"><path d="M-18 -14 L -26 14"/><path d="M-4 -16 L -12 16"/><path d="M10 -14 L 2 16"/></g></g>
    <path d="M-6 -12 C -2 -22, 8 -20, 10 -11 Z" fill="#c98f3a"/>
    <path d="M0 4 C 4 9, 9 9, 12 5" stroke="#a8741b" stroke-width="1.4" fill="none"/>
    <circle cx="19" cy="-3" r="2.6" fill="#0d1d30"/><circle cx="19.8" cy="-3.8" r=".8" fill="#fff"/>
  </g></g>
  <g class="s-glass"><g transform="translate(334 236)">
    <rect class="s-wine" x="-17" y="-20" width="34" height="24" fill="#f2d98a" clip-path="url(#st-bowl)"/>
    <path d="${BOWL}" fill="#f3e7cf" fill-opacity=".1" stroke="#f3e7cf" stroke-width="1.6"/>
    <path d="M0 3 V 26 M-11 26 H 11" stroke="#f3e7cf" stroke-width="1.6" stroke-linecap="round"/>
  </g></g>
</g>
<circle cx="200" cy="200" r="181" fill="none" stroke="#e7b24f" stroke-width="9"/>
<circle cx="200" cy="200" r="187.5" fill="none" stroke="#a8741b" stroke-width="1.4"/>
<circle cx="200" cy="200" r="176" fill="none" stroke="#08131f" stroke-opacity=".5" stroke-width="2"/>
<g fill="#f2cf86" stroke="#a8741b" stroke-width="1">${bolts}</g>
</svg>`;
}
