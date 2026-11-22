/* "Od trsa do boce" — vodoravni scroll (GSAP pin + x) koji usput mijenja paletu sekcije,
 * a u koraku berbe kašeta se puni grozdovima. */
import { useRef } from 'react';
import { useShop } from '@shared/shop.jsx';
import { gsap, ScrollTrigger, useGSAP } from './gsap-setup.js';

const PALETTE = [
  ['#deddd6', '#23271d', '#9c7f2a'],
  ['#cdd2bb', '#23271d', '#5d6b3a'],
  ['#e5d08a', '#23271d', '#7a5a14'],
  ['#5b1a2a', '#f1e9dc', '#e3c97a'],
  ['#2f2520', '#e8e0d0', '#cdb15a'],
  ['#23271d', '#deddd6', '#cdb15a']
];

const ART = [
  /* rezidba: trs i škare */
  <g key="a"><path d="M100 200 V120 M100 140 C 80 120, 60 118, 46 100 M100 128 C 122 110, 142 108, 156 90" /><path d="M62 92 l -18 -10 M150 82 l 16 -12" strokeDasharray="3 5" /><path d="M120 40 l 34 34 M154 40 l -34 34" /><circle cx="116" cy="78" r="8" /><circle cx="158" cy="78" r="8" /><path d="M70 200 H 130" /></g>,
  /* buđenje: izdanak */
  <g key="b"><path d="M100 200 V110" /><path d="M100 150 C 70 150, 52 130, 50 104 C 78 104, 98 122, 100 150 Z" /><path d="M100 128 C 128 128, 148 108, 150 80 C 122 80, 102 100, 100 128 Z" /><circle cx="100" cy="100" r="7" /><path d="M60 200 H 140" /></g>,
  /* sunce i kamen */
  <g key="c"><circle cx="100" cy="80" r="26" />{[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <path key={a} d={`M${100 + Math.cos(a * Math.PI / 180) * 36} ${80 + Math.sin(a * Math.PI / 180) * 36} L ${100 + Math.cos(a * Math.PI / 180) * 50} ${80 + Math.sin(a * Math.PI / 180) * 50}`} />)}<path d="M40 200 C 50 170, 80 168, 92 182 C 100 162, 140 160, 160 200 Z" /><path d="M30 200 H 170" /></g>,
  /* berba: kašeta (grozdovi se dodaju animacijom) */
  <g key="d"><path d="M40 150 H160 L150 200 H50 Z" /><path d="M46 172 H154" /><path d="M70 150 V200 M100 150 V200 M130 150 V200" strokeOpacity=".5" />
    {[[66, 140], [88, 132], [110, 138], [132, 130], [78, 120], [120, 116], [99, 110]].map(([x, y], i) => (
      <g key={i} className="crate-grape" style={{ transformOrigin: `${x}px ${y}px` }}>
        <circle cx={x - 6} cy={y - 4} r="6" fill="currentColor" /><circle cx={x + 6} cy={y - 4} r="6" fill="currentColor" /><circle cx={x} cy={y + 6} r="6" fill="currentColor" />
      </g>
    ))}</g>,
  /* podrum: bačva */
  <g key="e"><ellipse cx="100" cy="120" rx="58" ry="66" /><path d="M48 92 H152 M48 148 H152" /><path d="M70 62 C 60 100, 60 140, 70 178 M130 62 C 140 100, 140 140, 130 178" strokeOpacity=".5" /><circle cx="100" cy="120" r="7" /><path d="M40 200 H160" /></g>,
  /* boca */
  <g key="f"><path d="M90 20 H110 V64 C 110 76, 128 84, 128 102 V196 C 128 200, 124 204, 120 204 H80 C 76 204, 72 200, 72 196 V102 C 72 84, 90 76, 90 64 Z" /><rect x="78" y="128" width="44" height="48" /><path d="M86 150 H114" /><text x="100" y="146" textAnchor="middle" fontSize="11" fontWeight="900" fill="currentColor" stroke="none" fontFamily="Archivo, sans-serif">ĐIKO</text></g>
];

export default function Process() {
  const { t } = useShop();
  const ref = useRef(null);
  const track = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const panels = gsap.utils.toArray('.proc-panel');
      const dist = () => track.current.scrollWidth - window.innerWidth;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: 'top top', end: () => '+=' + dist() * 1.1, scrub: 0.8, pin: true, invalidateOnRefresh: true, anticipatePin: 1 }
      });
      tl.to(track.current, { x: () => -dist(), ease: 'none', duration: panels.length - 1 }, 0);
      tl.to('.proc-bar span', { scaleX: 1, ease: 'none', duration: panels.length - 1 }, 0);
      PALETTE.forEach(([bg, ink, acc], i) => {
        if (i === 0) return;
        tl.to(ref.current, { '--p-bg': bg, '--p-ink': ink, '--p-acc': acc, duration: 0.6, ease: 'none' }, i - 0.8);
      });
      /* kašeta se puni dok panel berbe ulazi na ekran */
      gsap.from('.crate-grape', {
        scale: 0, y: -60, opacity: 0, stagger: 0.12, ease: 'back.out(2)',
        scrollTrigger: { trigger: panels[3], containerAnimation: tl, start: 'left 85%', end: 'left 35%', scrub: 0.5 }
      });
      /* lagana paralaksa ilustracija */
      panels.forEach((p) => {
        gsap.fromTo(p.querySelector('.proc-art'), { xPercent: 10, rotate: 5 }, {
          xPercent: -10, rotate: -4, ease: 'none',
          scrollTrigger: { trigger: p, containerAnimation: tl, start: 'left right', end: 'right left', scrub: true }
        });
      });
      return () => ScrollTrigger.refresh();
    });
  }, { scope: ref });

  return (
    <section className="proc" id="berba" ref={ref} aria-labelledby="proc-title">
      <div className="proc-head">
        <p className="kicker">{t('proc.kicker')}</p>
        <h2 id="proc-title">{t('proc.title')}</h2>
      </div>
      <div className="proc-track" ref={track}>
        {ART.map((art, i) => (
          <article className="proc-panel" key={i} aria-labelledby={`proc-t${i}`}>
            <span className="proc-no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <div className="proc-copy">
              <p className="proc-m">{t(`proc.p${i + 1}.m`)}</p>
              <h3 id={`proc-t${i}`}>{t(`proc.p${i + 1}.t`)}</h3>
              <p>{t(`proc.p${i + 1}.p`)}</p>
            </div>
            <svg className="proc-art" viewBox="0 0 200 220" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">{art}</svg>
          </article>
        ))}
      </div>
      <div className="proc-bar" aria-hidden="true"><span /></div>
    </section>
  );
}
