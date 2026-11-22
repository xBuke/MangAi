import { motion } from 'motion/react';
import { useShop } from '@shared/shop.jsx';
import { Reveal } from '@shared/fx.jsx';
import { BottleImg } from '../components/Img.jsx';
import { Crumbs, AddToList, ParallaxPhoto, EASE } from '../components/Bits.jsx';
import { WINES } from '../data.js';
import { href, asset } from '../routes.js';

/* skala temperature 4–20 °C s označenim rasponom posluživanja */
function TempScale({ temp }) {
  const min = 4, max = 20, pct = (v) => ((v - min) / (max - min)) * 100;
  return (
    <div className="temp" role="img" aria-label={`${temp[0]}–${temp[1]} °C`}>
      <div className="temp-track" />
      <motion.div className="temp-range" style={{ left: pct(temp[0]) + '%', width: pct(temp[1]) - pct(temp[0]) + '%' }}
        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE, delay: 0.2 }} />
      <span className="temp-l">{min} °C</span><span className="temp-r">{max} °C</span>
    </div>
  );
}

export default function Wine({ route }) {
  const { t, L } = useShop();
  const lang = route.lang;
  const T = (hr, en) => (lang === 'en' ? en : hr);
  const i = WINES.findIndex((w) => w.id === route.wine);
  const w = WINES[i];
  const prev = WINES[(i - 1 + WINES.length) % WINES.length];
  const next = WINES[(i + 1) % WINES.length];
  const related = WINES.filter((x) => x.id !== w.id && (x.type === w.type || (w.type !== 'red' && x.type !== 'red'))).slice(0, 3);
  const notes = [['w.color', w.color], ['w.nose', w.nose], ['w.palate', w.palate]].filter(([, v]) => v);

  return (
    <>
      <section className="wine-hero">
        <div className="wine-stage">
          <motion.div className="wine-bottle" initial={{ opacity: 0, y: 80, rotate: -6 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 1.3, ease: EASE }}>
            <BottleImg id={w.id} big eager alt={(lang === 'en' ? 'Bottle of ' : 'Boca vina ') + w.name + ', Vina Govorko'} />
          </motion.div>
        </div>
        <div className="wine-info">
          <Crumbs route={route} items={[[t('nav.wines'), href('wines', lang)], [w.name]]} />
          <motion.p className="kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>{L(w.kind)}{w.year ? ` · ${t('w.year')} ${w.year}.` : ''}</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.1 }}>{w.name}</motion.h1>

          <motion.div className="entry" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}>
            <p className="entry-head"><strong>{w.name.toLowerCase()}</strong> <em>{L(w.pos)}</em></p>
            <p className="entry-meaning">{L(w.meaning)}</p>
            <p className="entry-story">{L(w.story)}</p>
          </motion.div>

          <p className="wine-desc">{L(w.desc)}</p>

          {notes.length > 0 && (
            <div className="notes">
              {notes.map(([k, v], n) => (
                <Reveal key={k} delay={n * 0.06} className="note">
                  <p className="note-k">{t(k)}</p>
                  <p className="note-v">{L(v)}</p>
                  {k === 'w.color' && <div className="note-swatch" style={{ background: `linear-gradient(90deg, ${w.swatch[0]}, ${w.swatch[1]})` }} />}
                </Reveal>
              ))}
            </div>
          )}

          <div className="serve">
            <p className="note-k">{t('w.temp')}</p>
            <TempScale temp={w.temp} />
            <p className="serve-v">{w.temp[0]}–{w.temp[1]} °C</p>
          </div>

          <dl className="specs">
            <div><dt>{t('w.grapes')}</dt><dd>{L(w.grapes)}</dd></div>
            <div><dt>{t('w.region')}</dt><dd>{t('w.regionv')}</dd></div>
            <div><dt>{t('w.abv')}</dt><dd>{w.abv ? w.abv + ' % vol.' : '—'}</dd></div>
            <div><dt>{t('w.vol')}</dt><dd>0,75 l</dd></div>
            <div className="span2"><dt>{t('w.making')}</dt><dd>{L(w.making)}</dd></div>
          </dl>

          <div className="pair">
            <p className="note-k">{t('w.pair')}</p>
            <ul>{L(w.pair).map((p) => <li key={p}>{p}</li>)}</ul>
          </div>

          <div className="wine-actions">
            <AddToList id={w.id} />
            <a className="btn btn-line" href={asset('vina-govorko-katalog.pdf')} download>{t('w.sheet')}</a>
          </div>
        </div>
      </section>

      <section className="wine-from">
        <ParallaxPhoto name={w.photo} alt="" className="wf-bg" strength={20} />
        <div className="wf-shade" />
        <div className="wrap wf-in">
          <Reveal><p className="kicker kicker-light">{t('w.from')}</p></Reveal>
          <Reveal delay={0.05}><p className="wf-text">{T('Grožđe za naša vina raste u Vinogorju Vrgorac, pod brdima, u vinogradima starim preko pedeset godina i u novim nasadima.', 'The grapes for our wines grow in the Vrgorac wine region, below the hills, in vineyards over fifty years old and in new plantings.')}</p></Reveal>
          <Reveal delay={0.1}><a className="link-arrow light" href={href('vineyard', lang)}>{t('w.fromlink')} <span aria-hidden="true">→</span></a></Reveal>
        </div>
      </section>

      <nav className="wine-pn wrap" aria-label={T('Ostala vina', 'Other wines')}>
        <a href={href('wine', lang, prev.id)} className="pn prev"><span className="pn-k">← {t('w.prev')}</span><span className="pn-n">{prev.name}</span></a>
        <a href={href('wine', lang, next.id)} className="pn next"><span className="pn-k">{t('w.next')} →</span><span className="pn-n">{next.name}</span></a>
      </nav>

      <section className="wrap sec-pad-sm">
        <h2 className="h-md">{t('w.related')}</h2>
        <div className="related">
          {related.map((x, n) => (
            <Reveal key={x.id} delay={n * 0.08}>
              <a className="rel" href={href('wine', lang, x.id)}>
                <BottleImg id={x.id} alt="" />
                <span><span className="rel-n">{x.name}</span><span className="rel-k">{L(x.kind)}</span></span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
