/* Responzivne slike (WebP u više širina) i boce na crnoj podlozi */
import M from '../imgmeta.js';
import { asset } from '../routes.js';

export function Photo({ name, alt, sizes = '100vw', className, eager = false, style }) {
  const m = M[name];
  const ws = m.w;
  const srcSet = ws.map((w) => `${asset(`img/${name}-${w}.webp`)} ${w}w`).join(', ');
  const def = ws.find((w) => w >= 1280) || ws[ws.length - 1];
  return (
    <img className={className} style={style} src={asset(`img/${name}-${def}.webp`)} srcSet={srcSet} sizes={sizes}
      alt={alt} width={def} height={Math.round(def / m.r)} loading={eager ? 'eager' : 'lazy'} decoding="async"
      fetchpriority={eager ? 'high' : undefined} />
  );
}

/* boca: crna podloga fotografije se stapa s tamnom stranicom (mix-blend-mode: lighten u CSS-u) */
export function BottleImg({ id, alt, big = false, className = '', eager = false }) {
  const name = 'boca-' + id;
  const m = M[name];
  const s = asset(`img/${name}-560.webp`), b = asset(`img/${name}-1100.webp`);
  const h = big ? 1100 : 560;
  return (
    <img className={'bottle-img ' + className} src={big ? b : s} srcSet={big ? undefined : `${s} 1x, ${b} 2x`} alt={alt}
      width={Math.round(h * m.r)} height={h} loading={eager ? 'eager' : 'lazy'} decoding="async" />
  );
}
