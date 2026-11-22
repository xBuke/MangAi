/* Vodoravni koraci (GSAP pin + x): sekcija stoji, koraci klize vodoravno, a paleta sekcije se mijenja.
 * Props: id, kickerKey, titleKey, prefix ('year.s' | 'proc.p'), arts (niz ključeva ilustracija), palette [[bg, ink, accent]…], label (tekst na boci). */
import { useRef } from 'react';
import { useShop } from './shop.jsx';
import { gsap, useGSAP } from './gsap.js';

const GRAPES = [[66, 140], [88, 132], [110, 138], [132, 130], [78, 120], [120, 116], [99, 110]];

function art(key, label) {
  switch (key) {
    case 'prune': return <g><path d="M100 200 V120 M100 140 C 80 120, 60 118, 46 100 M100 128 C 122 110, 142 108, 156 90" /><path d="M62 92 l -18 -10 M150 82 l 16 -12" strokeDasharray="3 5" /><path d="M120 40 l 34 34 M154 40 l -34 34" /><circle cx="116" cy="78" r="8" /><circle cx="158" cy="78" r="8" /><path d="M70 200 H 130" /></g>;
    case 'bud': return <g><path d="M100 200 V110" /><path d="M100 150 C 70 150, 52 130, 50 104 C 78 104, 98 122, 100 150 Z" /><path d="M100 128 C 128 128, 148 108, 150 80 C 122 80, 102 100, 100 128 Z" /><circle cx="100" cy="100" r="7" /><path d="M60 200 H 140" /></g>;
    case 'flower': return <g><path d="M100 200 V96 M100 150 C 80 140, 66 128, 62 110 M100 132 C 120 122, 134 110, 138 92" />{[[100, 70], [84, 80], [116, 80], [92, 96], [108, 96], [100, 112], [70, 102], [130, 84]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="5" /><path d={`M${x} ${y - 5} v-6 M${x - 5} ${y} h-6 M${x + 5} ${y} h6`} strokeWidth="1.4" /></g>)}<path d="M60 200 H 140" /></g>;
    case 'sun': return <g><circle cx="100" cy="80" r="26" />{[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <path key={a} d={`M${100 + Math.cos(a * Math.PI / 180) * 36} ${80 + Math.sin(a * Math.PI / 180) * 36} L ${100 + Math.cos(a * Math.PI / 180) * 50} ${80 + Math.sin(a * Math.PI / 180) * 50}`} />)}<path d="M40 200 C 50 170, 80 168, 92 182 C 100 162, 140 160, 160 200 Z" /><path d="M30 200 H 170" /></g>;
    case 'veraison': return <g><path d="M100 30 V64 M100 44 C 120 30, 140 34, 150 22" />{[[100, 74], [84, 84], [116, 84], [72, 98], [92, 98], [112, 98], [128, 98], [82, 114], [102, 114], [120, 114], [92, 130], [110, 130], [100, 146]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="9" fill={i % 3 === 0 ? 'currentColor' : 'none'} />)}<path d="M60 200 H 140" /></g>;
    case 'crate': return <g><path d="M40 150 H160 L150 200 H50 Z" /><path d="M46 172 H154" /><path d="M70 150 V200 M100 150 V200 M130 150 V200" strokeOpacity=".5" />{GRAPES.map(([x, y], i) => <g key={i} className="crate-grape" style={{ transformOrigin: `${x}px ${y}px` }}><circle cx={x - 6} cy={y - 4} r="6" fill="currentColor" /><circle cx={x + 6} cy={y - 4} r="6" fill="currentColor" /><circle cx={x} cy={y + 6} r="6" fill="currentColor" /></g>)}</g>;
    case 'barrel': return <g><ellipse cx="100" cy="120" rx="58" ry="66" /><path d="M48 92 H152 M48 148 H152" /><path d="M70 62 C 60 100, 60 140, 70 178 M130 62 C 140 100, 140 140, 130 178" strokeOpacity=".5" /><circle cx="100" cy="120" r="7" /><path d="M40 200 H160" /></g>;
    case 'bottle': return <g><path d="M90 20 H110 V64 C 110 76, 128 84, 128 102 V196 C 128 200, 124 204, 120 204 H80 C 76 204, 72 200, 72 196 V102 C 72 84, 90 76, 90 64 Z" /><rect x="78" y="128" width="44" height="48" /><path d="M86 150 H114" /><text x="100" y="146" textAnchor="middle" fontSize={label.length > 5 ? 9 : 11} fontWeight="900" fill="currentColor" stroke="none" fontFamily="inherit">{label}</text></g>;
    default: return null;
  }
}

export default function HSteps({ id, kickerKey, titleKey, prefix, arts, palette, label = '' }) {
  const { t } = useShop();
  const ref = useRef(null);
  const track = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const panels = gsap.utils.toArray('.proc-panel', ref.current);
      const dist = () => track.current.scrollWidth - window.innerWidth;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: 'top top', end: () => '+=' + dist() * 1.1, scrub: 0.6, pin: true, invalidateOnRefresh: true, anticipatePin: 1 }
      });
      tl.to(track.current, { x: () => -dist(), ease: 'none', duration: panels.length - 1 }, 0);
      tl.to(ref.current.querySelector('.proc-bar span'), { scaleX: 1, ease: 'none', duration: panels.length - 1 }, 0);
      /* fromTo s izričitim početnim bojama: GSAP inače ne pročita CSS varijablu postavljenu inline */
      palette.forEach(([bg, ink, acc], i) => {
        if (i === 0) return;
        const [pb, pi, pa] = palette[i - 1];
        tl.fromTo(ref.current, { '--p-bg': pb, '--p-ink': pi, '--p-acc': pa }, { '--p-bg': bg, '--p-ink': ink, '--p-acc': acc, duration: 0.6, ease: 'none', immediateRender: i === 1 }, i - 0.8);
      });
      const crate = arts.indexOf('crate');
      if (crate >= 0) {
        gsap.from(ref.current.querySelectorAll('.crate-grape'), {
          scale: 0, y: -60, opacity: 0, stagger: 0.12, ease: 'back.out(2)',
          scrollTrigger: { trigger: panels[crate], containerAnimation: tl, start: 'left 85%', end: 'left 35%', scrub: 0.5 }
        });
      }
      panels.forEach((p) => {
        gsap.fromTo(p.querySelector('.proc-art'), { xPercent: 10, rotate: 5 }, {
          xPercent: -10, rotate: -4, ease: 'none',
          scrollTrigger: { trigger: p, containerAnimation: tl, start: 'left right', end: 'right left', scrub: true }
        });
      });
    });
  }, { scope: ref });

  const [bg0, ink0, acc0] = palette[0];
  return (
    <section className="proc" id={id} ref={ref} aria-labelledby={id + '-title'} style={{ '--p-bg': bg0, '--p-ink': ink0, '--p-acc': acc0 }}>
      <div className="proc-head">
        <p className="kicker">{t(kickerKey)}</p>
        <h2 id={id + '-title'}>{t(titleKey)}</h2>
      </div>
      <div className="proc-track" ref={track}>
        {arts.map((a, i) => (
          <article className="proc-panel" key={i} aria-labelledby={`${id}-t${i}`}>
            <span className="proc-no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <div className="proc-copy">
              <p className="proc-m">{t(`${prefix}${i + 1}.m`)}</p>
              <h3 id={`${id}-t${i}`}>{t(`${prefix}${i + 1}.t`)}</h3>
              <p>{t(`${prefix}${i + 1}.p`)}</p>
            </div>
            <svg className="proc-art" viewBox="0 0 200 220" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">{art(a, label)}</svg>
          </article>
        ))}
      </div>
      <div className="proc-bar" aria-hidden="true"><span /></div>
    </section>
  );
}
