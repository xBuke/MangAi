import { useId } from 'react';

const GLASS = { green: '#2f4a32', flint: '#d9dfd6', amber: '#5a3b1c', dark: '#1f2a22' };

/* SVG ilustracija boce — boje i etiketa dolaze iz product.bottle */
export default function Bottle({ p, font = 'Georgia, serif', sub = '', className = 'bottle' }) {
  const uid = useId().replace(/:/g, '');
  const b = p.bottle || {};
  const glass = GLASS[b.glass] || b.glass || GLASS.green;
  const wine = b.wine || '#6b1d2f';
  const lab = b.label || '#f3efe6';
  const ink = b.ink || '#1b1b1b';
  const cap = b.cap || '#1b1b1b';
  const showWine = b.glass === 'flint';
  const sparkling = p.type === 'sparkling';
  const name = p.name.length > 9 ? p.name.slice(0, 9) : p.name;
  const fs = name.length > 7 ? 11 : 13;
  const d = sparkling
    ? 'M46 6h28v30c0 10 16 18 16 34v176c0 6-4 10-10 10H40c-6 0-10-4-10-10V70c0-16 16-24 16-34z'
    : 'M49 6h22v44c0 12 19 20 19 38v158c0 6-4 10-10 10H40c-6 0-10-4-10-10V88c0-18 19-26 19-38z';
  const g = 'g' + uid, k = 'k' + uid;
  return (
    <svg className={className} viewBox="0 0 120 262" role="img" aria-label={p.name}>
      <defs>
        <linearGradient id={g} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".22" stopColor="#fff" stopOpacity=".28" />
          <stop offset=".34" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".25" />
        </linearGradient>
        <clipPath id={k}><path d={d} /></clipPath>
      </defs>
      <g clipPath={`url(#${k})`}>
        <path d={d} fill={glass} />
        {showWine && <rect x="20" y="112" width="80" height="150" fill={wine} opacity=".92" />}
        <rect x="20" y="0" width="80" height="262" fill={`url(#${g})`} />
      </g>
      <rect x={sparkling ? 44 : 47} y="2" width={sparkling ? 32 : 26} height={sparkling ? 34 : 26} rx="3" fill={cap} />
      <rect x="34" y="132" width="52" height="78" rx="2" fill={lab} />
      <rect x="34" y="132" width="52" height="5" fill={b.band || wine} />
      <text x="60" y="172" textAnchor="middle" fontFamily={font} fontSize={fs} fill={ink}>{name}</text>
      <text x="60" y="190" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="5.5" letterSpacing=".6" fill={ink} opacity=".7">{sub}</text>
    </svg>
  );
}
