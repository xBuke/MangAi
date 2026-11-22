import { motion } from 'motion/react';
import { useShop } from '@shared/shop.jsx';
import { Reveal, ScrollWords } from '@shared/fx.jsx';
import { Photo } from '../components/Img.jsx';
import { PageHero, SectionHead, EASE } from '../components/Bits.jsx';
import Year from '../components/Year.jsx';
import MapRegion from '../components/MapRegion.jsx';
import { VARIETIES, WINES } from '../data.js';
import { href } from '../routes.js';

export default function Vineyard({ route }) {
  const { t, L } = useShop();
  const lang = route.lang;
  const T = (hr, en) => (lang === 'en' ? en : hr);
  return (
    <>
      <PageHero route={route} photo="trsovi-ljeto" pos="center 45%" crumbs={[[t('nav.vineyard')]]}
        alt={T('Stari trsovi u ljeto pod vedrim nebom', 'Old vines in summer under a clear sky')}
        kicker={T('Vinogorje Vrgorac', 'Vrgorac wine region')}
        title={T('Pod brdima, uz stare trsove.', 'Below the hills, among old vines.')} />

      <section className="wrap sec-pad vy-intro">
        <ScrollWords className="vy-big" text={T('Vinogradi iz kojih dolazi naše grožđe stari su preko pedeset godina. Najstarije loze posadio je djed Branko i ne pada nam na pamet vadit ih.', 'The vineyards our grapes come from are more than fifty years old. Grandpa Branko planted the oldest vines, and we have no intention of pulling them out.')} />
        <div className="vy-side">
          <Reveal><p>{T('Vinogorje Vrgorac jedno je od najvećih u Hrvatskoj. Naši trsovi rastu u Dusini, u vrgoračkom kraju, a vino radimo u Metkoviću.', 'The Vrgorac wine region is one of the largest in Croatia. Our vines grow in Dusina, near Vrgorac, and we make the wine in Metković.')}</p></Reveal>
          <Reveal delay={0.08}><p>{T('Uz plavku, zlataricu vrgorsku, maraštinu i trbljan posadili smo nove nasade trnka, pošipa i merlota.', 'Alongside Plavka, Zlatarica Vrgorska, Maraština and Trbljan we have planted Trnak, Pošip and Merlot.')}</p></Reveal>
        </div>
      </section>

      <section className="sec-black" aria-labelledby="year-h">
        <div className="wrap sec-pad">
          <SectionHead id="year-h" kicker={T('Godina u vinogradu', 'A year in the vineyard')} title={T('Sedam trenutaka jedne berbe', 'Seven moments of one vintage')}>
            <p>{T('Klikni mjesec ili koristi strelice.', 'Pick a month or use the arrow keys.')}</p>
          </SectionHead>
          <Year lang={lang} />
        </div>
      </section>

      <section className="wrap sec-pad" aria-labelledby="var-h">
        <SectionHead id="var-h" kicker={T('Sorte', 'Grapes')} title={T('Što raste u našim redovima', 'What grows in our rows')} />
        <ul className="varieties">
          {VARIETIES.map((v, i) => (
            <motion.li key={v.name.hr} className="variety" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -10% 0px' }} transition={{ duration: 0.7, ease: EASE, delay: (i % 4) * 0.07 }}>
              <p className={'var-tag' + (v.old ? '' : ' new')}>{T(v.color === 'red' ? 'Crna' : 'Bijela', v.color === 'red' ? 'Red' : 'White')} · {v.old ? T('stari trs', 'old vines') : T('novi nasad', 'new planting')}</p>
              <p className="var-name">{L(v.name)}</p>
              <p className="var-wines">{v.wines.map((id, k) => {
                const w = WINES.find((x) => x.id === id);
                return <span key={id}>{k ? ', ' : ''}<a href={href('wine', lang, id)}>{w.name}</a></span>;
              })}</p>
            </motion.li>
          ))}
          <li className="variety variety-img"><Photo name="grozd-bijeli-2" alt={T('Grozd zlatarice na starom trsu', 'A Zlatarica bunch on an old vine')} sizes="(max-width: 700px) 50vw, 25vw" /></li>
        </ul>
      </section>

      <section className="sec-soft" aria-labelledby="map-h">
        <div className="wrap sec-pad map-sec">
          <div className="map-text">
            <Reveal><p className="kicker">{T('Gdje smo', 'Where we are')}</p></Reveal>
            <Reveal delay={0.05}><h2 id="map-h">{T('Od trsa u Dusini do podruma u Metkoviću', 'From the vines in Dusina to the cellar in Metković')}</h2></Reveal>
            <Reveal delay={0.1}><p className="lead">{T('Vrgorački kraj i dolina Neretve, između brda i mora. Klikni točku na karti.', 'The Vrgorac hills and the Neretva valley, between the mountains and the sea. Tap a point on the map.')}</p></Reveal>
          </div>
          <Reveal delay={0.1} className="map-wrap"><MapRegion lang={lang} /></Reveal>
        </div>
      </section>

      <section className="strip" aria-label={T('Fotografije iz vinograda', 'Photos from the vineyard')}>
        {[['zima-redovi', T('Goli redovi vinograda zimi', 'Bare rows in winter')], ['vinograd-proljece-ruze', T('Ruže na kraju redova u proljeće', 'Roses at the row ends in spring')], ['trsovi-ljeto', T('Stari trsovi u ljeto', 'Old vines in summer')], ['grozd-bijeli-1', T('Grozd bijelog grožđa', 'A bunch of white grapes')]].map(([n, alt], i) => (
          <Reveal key={n} delay={i * 0.06} className="strip-item"><Photo name={n} alt={alt} sizes="(max-width: 700px) 50vw, 25vw" /></Reveal>
        ))}
      </section>
    </>
  );
}
