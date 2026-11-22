/* Jato ribica na platnu iza kontakta. Ribice plivaju zajedno (poravnanje, kohezija, razmak)
 * i bježe od kursora / prsta. Crta se samo dok je sekcija na ekranu. */

export function school(canvas, { reduce = false } = {}) {
  const ctx = canvas.getContext('2d');
  const sec = canvas.parentElement;
  let W = 0, H = 0, dpr = 1, raf = 0, on = false;
  const ptr = { x: -9999, y: -9999, t: 0 };
  const fish = [];
  const N = () => (W < 700 ? 26 : 48);

  function resize() {
    const r = sec.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    while (fish.length < N()) fish.push(spawn());
    fish.length = N();
  }
  function spawn() {
    const a = Math.random() * Math.PI * 2;
    return {
      x: Math.random() * W, y: H * (0.15 + Math.random() * 0.75),
      vx: Math.cos(a) * 1.2, vy: Math.sin(a) * 0.4,
      s: 0.55 + Math.random() * 0.75, gold: Math.random() < 0.4, ph: Math.random() * 6.28
    };
  }

  function step(dt) {
    const R = 70, SEP = 22, maxV = 2.1, minV = 0.6;
    for (const f of fish) {
      let ax = 0, ay = 0, cx = 0, cy = 0, sx = 0, sy = 0, n = 0;
      for (const o of fish) {
        if (o === f) continue;
        const dx = o.x - f.x, dy = o.y - f.y, d2 = dx * dx + dy * dy;
        if (d2 > R * R) continue;
        n++; ax += o.vx; ay += o.vy; cx += o.x; cy += o.y;
        if (d2 < SEP * SEP) { const d = Math.sqrt(d2) || 1; sx -= dx / d; sy -= dy / d; }
      }
      if (n) {
        f.vx += (ax / n - f.vx) * 0.045 + (cx / n - f.x) * 0.0009 + sx * 0.06;
        f.vy += (ay / n - f.vy) * 0.045 + (cy / n - f.y) * 0.0009 + sy * 0.06;
      }
      /* bijeg od kursora */
      const px = f.x - ptr.x, py = f.y - ptr.y, pd2 = px * px + py * py;
      if (pd2 < 150 * 150) { const d = Math.sqrt(pd2) || 1, k = (1 - d / 150) * 0.9; f.vx += (px / d) * k; f.vy += (py / d) * k; }
      /* drži ih u vodi (gore-dolje), lijevo-desno prolaze kroz rub */
      if (f.y < H * 0.1) f.vy += 0.06; if (f.y > H * 0.92) f.vy -= 0.06;
      f.vy += Math.sin(f.ph += 0.02) * 0.01;
      const sp = Math.hypot(f.vx, f.vy), lim = pd2 < 150 * 150 ? maxV * 2.2 : maxV;
      if (sp > lim) { f.vx = (f.vx / sp) * lim; f.vy = (f.vy / sp) * lim; }
      else if (sp < minV) { f.vx = (f.vx / (sp || 1)) * minV; f.vy = (f.vy / (sp || 1)) * minV; }
      f.x += f.vx * dt; f.y += f.vy * dt;
      if (f.x < -30) f.x = W + 30; else if (f.x > W + 30) f.x = -30;
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    for (const f of fish) {
      const a = Math.atan2(f.vy, f.vx);
      const wag = Math.sin(t * 0.012 + f.ph * 3) * 0.35;
      ctx.save();
      ctx.translate(f.x, f.y); ctx.rotate(a); ctx.scale(f.s, f.s);
      ctx.fillStyle = f.gold ? 'rgba(231,178,79,.55)' : 'rgba(243,231,207,.28)';
      ctx.beginPath();
      ctx.moveTo(12, 0);
      ctx.bezierCurveTo(6, -6, -6, -6, -10, 0);
      ctx.bezierCurveTo(-6, 6, 6, 6, 12, 0);
      ctx.fill();
      ctx.rotate(wag);
      ctx.beginPath();
      ctx.moveTo(-9, 0); ctx.lineTo(-17, -5); ctx.lineTo(-15, 0); ctx.lineTo(-17, 5); ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  let last = 0;
  function loop(t) {
    const dt = Math.min(3, last ? (t - last) / 16.67 : 1); last = t;
    step(dt); draw(t);
    if (on) raf = requestAnimationFrame(loop);
  }
  function start() { if (on || reduce) return; on = true; last = 0; raf = requestAnimationFrame(loop); }
  function stop() { on = false; cancelAnimationFrame(raf); }

  resize();
  if (reduce) { for (let i = 0; i < 40; i++) step(1); draw(0); }
  new ResizeObserver(() => { resize(); if (reduce) draw(0); }).observe(sec);
  let vis = false;
  new IntersectionObserver(([e]) => { vis = e.isIntersecting; vis ? start() : stop(); }, { rootMargin: '80px' }).observe(sec);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : vis && start()));

  const setPtr = (e) => { const r = canvas.getBoundingClientRect(); ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; };
  sec.addEventListener('pointermove', setPtr, { passive: true });
  sec.addEventListener('pointerdown', setPtr, { passive: true });
  sec.addEventListener('pointerleave', () => { ptr.x = ptr.y = -9999; });
  /* dodir: nakon što prst ode, ribice se vrate */
  sec.addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') setTimeout(() => { ptr.x = ptr.y = -9999; }, 600); });
}
