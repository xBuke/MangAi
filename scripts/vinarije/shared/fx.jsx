/* Interaktivni elementi (vlastite implementacije, React + Motion + Lenis):
 * smooth scroll, split text, riječi koje se pale na scroll, brojači, magnetski gumbi,
 * 3D nagib, beskonačna traka ovisna o brzini scrolla, čaša koja se puni. */
import { useEffect, useRef, useState, useId } from 'react';
import Lenis from 'lenis';
import {
  motion, useInView, useScroll, useTransform, useSpring, useMotionValue, useAnimationFrame,
  useVelocity, useReducedMotion, animate
} from 'motion/react';

/* ---------- smooth scroll ---------- */
let lenisRef = null;
/* gsapLib = { gsap, ScrollTrigger } → Lenis se vrti na GSAP tickeru i javlja ScrollTriggeru */
export function useSmoothScroll(offset = -76, gsapLib = null) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ lerp: 0.09, anchors: { offset }, wheelMultiplier: 0.95 });
    lenisRef = lenis;
    if (gsapLib) {
      const { gsap, ScrollTrigger } = gsapLib;
      lenis.on('scroll', ScrollTrigger.update);
      const tick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      return () => { gsap.ticker.remove(tick); lenis.destroy(); lenisRef = null; };
    }
    let id;
    const raf = (t) => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); lenisRef = null; };
  }, [offset, gsapLib]);
}
export function lockScroll(on) {
  if (lenisRef) on ? lenisRef.stop() : lenisRef.start();
  document.body.classList.toggle('no-scroll', on);
}
export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisRef) lenisRef.scrollTo(el, { offset: -76 });
  else el.scrollIntoView({ behavior: 'smooth' });
}

/* ---------- tekst koji ulazi slovo po slovo ---------- */
export function SplitText({ text, as = 'span', className, delay = 0, stagger = 0.03, by = 'char', once = true }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '0px 0px -10% 0px' });
  const Tag = motion[as];
  const words = String(text).split(' ');
  let i = 0;
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} aria-hidden="true" className="split-word" style={{ display: 'inline-block', whiteSpace: 'pre' }}>
          {(by === 'char' ? [...w] : [w]).map((ch, ci) => {
            const n = i++;
            return (
              <span key={ci} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.08em', marginBottom: '-0.08em' }}>
                <motion.span
                  style={{ display: 'inline-block' }}
                  initial={{ y: '110%' }}
                  animate={inView ? { y: '0%' } : { y: '110%' }}
                  transition={{ duration: 0.8, ease: [0.2, 0.75, 0.15, 1], delay: delay + n * stagger }}
                >{ch}</motion.span>
              </span>
            );
          })}
          {wi < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}

/* ---------- paragraf čije se riječi "pale" dok skrolaš ---------- */
function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return <motion.span style={{ opacity }}>{children} </motion.span>;
}
export function ScrollWords({ text, className, as = 'p' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.88', 'end 0.55'] });
  const words = String(text).split(' ');
  const Tag = as;
  return (
    <Tag ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{w}</Word>
      ))}
    </Tag>
  );
}

/* ---------- lagani ulaz kad element uđe u ekran ---------- */
export function Reveal({ children, className, delay = 0, y = 28, as = 'div', ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.9, ease: [0.2, 0.75, 0.15, 1], delay }}
      {...rest}
    >{children}</Tag>
  );
}

/* ---------- brojač ---------- */
export function CountUp({ to, from = 0, duration = 1.8, format = (n) => Math.round(n).toLocaleString('hr-HR'), className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const [val, setVal] = useState(from);
  useEffect(() => {
    if (!inView) return;
    const c = animate(from, to, { duration, ease: [0.2, 0.7, 0.2, 1], onUpdate: setVal });
    return () => c.stop();
  }, [inView, from, to, duration]);
  return <span ref={ref} className={className}>{format(val)}</span>;
}

/* ---------- magnetski element (prati kursor) ---------- */
export function Magnetic({ children, strength = 0.35, className }) {
  const ref = useRef(null);
  const x = useSpring(0, { stiffness: 220, damping: 16 });
  const y = useSpring(0, { stiffness: 220, damping: 16 });
  const reduce = useReducedMotion();
  const move = (e) => {
    if (reduce || e.pointerType === 'touch') return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => { x.set(0); y.set(0); };
  return (
    <motion.span ref={ref} className={className} style={{ x, y, display: 'inline-flex' }} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </motion.span>
  );
}

/* ---------- 3D nagib (za boce) ---------- */
export function Tilt({ children, max = 14, className, scale = 1.04 }) {
  const ref = useRef(null);
  const rx = useSpring(0, { stiffness: 180, damping: 14 });
  const ry = useSpring(0, { stiffness: 180, damping: 14 });
  const s = useSpring(1, { stiffness: 180, damping: 14 });
  const reduce = useReducedMotion();
  const move = (e) => {
    if (reduce || e.pointerType === 'touch') return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * max * 2); rx.set(-py * max * 2); s.set(scale);
  };
  const leave = () => { rx.set(0); ry.set(0); s.set(1); };
  return (
    <motion.div ref={ref} className={className} onPointerMove={move} onPointerLeave={leave}
      style={{ rotateX: rx, rotateY: ry, scale: s, transformPerspective: 700 }}>
      {children}
    </motion.div>
  );
}

/* ---------- beskonačna traka; brzina scrolla je ubrzava ---------- */
export function VelocityMarquee({ children, baseVelocity = -3, className }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useVelocity(scrollY);
  const smooth = useSpring(vel, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [-1500, 0, 1500], [-4, 0, 4], { clamp: false });
  const dir = useRef(1);
  const reduce = useReducedMotion();
  const x = useTransform(baseX, (v) => `${((((v + 50) % 50) + 50) % 50) - 50}%`);
  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = dir.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1; else if (f > 0) dir.current = 1;
    move += dir.current * move * f;
    baseX.set(baseX.get() + move);
  });
  return (
    <div className={className} style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
      <motion.div style={{ x, display: 'inline-flex', flexWrap: 'nowrap' }}>
        <span style={{ display: 'inline-flex' }}>{children}</span>
        <span style={{ display: 'inline-flex' }} aria-hidden="true">{children}</span>
      </motion.div>
    </div>
  );
}

/* ---------- tekst koji se "premetne" u novu riječ ---------- */
const GLYPHS = 'abcčćdđefghijklmnoprsštuvzž';
export function Scramble({ text, className, duration = 700 }) {
  const [out, setOut] = useState(text);
  const prev = useRef(text);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setOut(text); prev.current = text; return; }
    const from = prev.current, to = text, len = Math.max(from.length, to.length);
    const start = performance.now();
    let id;
    const tick = (now) => {
      const k = Math.min(1, (now - start) / duration);
      let s = '';
      for (let i = 0; i < len; i++) {
        const settle = (i + 1) / len;
        if (k >= settle) s += to[i] || '';
        else if (k > settle - 0.45) s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        else s += from[i] || '';
      }
      setOut(s);
      if (k < 1) id = requestAnimationFrame(tick); else prev.current = to;
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [text, duration]);
  return <span className={className} aria-label={text}><span aria-hidden="true">{out}</span></span>;
}

/* ---------- čaša vina; level je MotionValue 0..1 ---------- */
export function WineGlass({ level, wine = '#5a1f3a', glass = 'rgba(28,43,39,.55)', className, showBubbles = false, label }) {
  const uid = useId().replace(/:/g, '');
  const BOTTOM = 204, TOP = 62;
  const y = useTransform(level, (v) => BOTTOM - Math.max(0, Math.min(1, v)) * (BOTTOM - TOP));
  const bowl = 'M44 18 C 34 110, 52 196, 100 206 C 148 196, 166 110, 156 18 Z';
  return (
    <svg className={className} viewBox="0 0 200 360" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <defs>
        <clipPath id={'b' + uid}><path d={bowl} /></clipPath>
        <linearGradient id={'w' + uid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={wine} stopOpacity=".86" />
          <stop offset="1" stopColor={wine} stopOpacity="1" />
        </linearGradient>
        <linearGradient id={'h' + uid} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".18" stopColor="#fff" stopOpacity=".55" />
          <stop offset=".3" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#b${uid})`}>
        <motion.g style={{ y }}>
          <g className="glass-wave">
            <path d="M-200 6 q 25 -9 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 V 260 H -200 Z" fill={`url(#w${uid})`} />
          </g>
          <g className="glass-wave glass-wave-2" opacity=".35">
            <path d="M-200 4 q 25 7 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 V 260 H -200 Z" fill={wine} />
          </g>
          {showBubbles && [30, 60, 90, 120, 150].map((bx, i) => (
            <circle key={i} className="glass-bubble" cx={bx + 10} cy={180} r={1.8 + (i % 2)} fill="#fff" opacity=".6" style={{ animationDelay: `${i * 0.5}s` }} />
          ))}
        </motion.g>
        <rect x="40" y="0" width="120" height="220" fill={`url(#h${uid})`} />
      </g>
      <path d={bowl} fill="none" stroke={glass} strokeWidth="2.2" />
      <path d="M96 206 L 96 318 M104 206 L 104 318" stroke={glass} strokeWidth="2.2" />
      <path d="M60 330 C 70 318, 130 318, 140 330 C 130 338, 70 338, 60 330 Z" fill="none" stroke={glass} strokeWidth="2.2" />
    </svg>
  );
}

export { motion, useScroll, useTransform, useSpring, useMotionValue, useInView, useReducedMotion, animate };
