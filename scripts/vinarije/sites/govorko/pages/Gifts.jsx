import { motion } from 'motion/react';
import { useShop } from '@shared/shop.jsx';
import { Reveal, Tilt } from '@shared/fx.jsx';
import { Photo } from '../components/Img.jsx';
import { Crumbs, EASE } from '../components/Bits.jsx';
import { href } from '../routes.js';

export default function Gifts({ route }) {
  const { t } = useShop();
  const lang = route.lang;
  const T = (hr, en) => (lang === 'en' ? en : hr);
  const packs = [
    ['kutija-karta', T('1 boca', '1 bottle'), T('Drvena kutija s kartom', 'Wooden box with a map'), T('Natpis Vina Govorko utisnut na poklopcu, karta s unutarnje strane. Vino biraš po želji.', 'Vina Govorko pressed into the lid, a map on the inside. You choose the wine.'), T('Otvorena drvena kutija s kartom u poklopcu', 'An open wooden box with a map in the lid')],
    ['kutija-5-boca', T('5 boca', '5 bottles'), T('Kolekcija u drvu', 'The collection in wood'), T('Brankić, Dišpet, Bokun, Pošip i Đelozija jedno do drugog. Najbolji način da netko upozna sva naša vina.', 'Brankić, Dišpet, Bokun, Pošip and Đelozija side by side. The best way to get to know all our wines.'), T('Drvena kutija s pet vina Govorko', 'A wooden box with five Govorko wines')],
    ['kofer-6-boca', T('6 boca', '6 bottles'), T('Kofer s grbom', 'The crested case'), T('Šest boca u koferu s grbom obitelji u poklopcu. Za veće prilike i poslovne partnere.', 'Six bottles in a case with the family crest in the lid. For bigger occasions and business partners.'), T('Kofer sa šest boca i grbom Govorko', 'A six-bottle case with the Govorko crest')]
  ];
  return (
    <>
      <section className="gifts-hero">
        <div className="gh-text">
          <Crumbs route={route} items={[[t('nav.gifts')]]} />
          <motion.p className="kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>{T('Pokloni i poslovni darovi', 'Gifts and corporate gifts')}</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE }}>{T('Vino koje se pamti i po kutiji.', 'A wine remembered for its box, too.')}</motion.h1>
          <motion.p className="lead" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.15 }}>
            {T('Drvo s utisnutim imenom, kofer sa šest boca ili cijela kolekcija u jednoj kutiji. Za rođendane, svadbe, zahvale i poslovne partnere.', 'Wood with our name pressed in, a six-bottle case or the whole collection in one box. For birthdays, weddings, thank-yous and business partners.')}
          </motion.p>
          <motion.div className="hero-cta" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.3 }}>
            <a className="btn btn-bone" href="#pakiranja">{T('Pakiranja', 'Gift boxes')}</a>
            <a className="btn btn-line" href="#tvrtke">{T('Za tvrtke', 'For companies')}</a>
          </motion.div>
        </div>
        <motion.div className="gh-img" initial={{ clipPath: 'inset(0 0 0 100%)' }} animate={{ clipPath: 'inset(0 0 0 0%)' }} transition={{ duration: 1.3, ease: EASE, delay: 0.1 }}>
          <Photo name="kofer-6-boca" eager sizes="(max-width: 900px) 100vw, 45vw" alt={T('Otvoreni kofer sa šest boca i grbom Vina Govorko', 'An open case with six bottles and the Vina Govorko crest')} />
        </motion.div>
      </section>

      <section id="pakiranja" className="wrap sec-pad" aria-labelledby="packs-h">
        <p className="kicker">{T('Pakiranja', 'Gift boxes')}</p>
        <h2 id="packs-h" className="h-lg">{T('Tri načina da pokloniš Govorko', 'Three ways to give Govorko')}</h2>
        <div className="packs">
          {packs.map(([img, n, title, text, alt], i) => (
            <Reveal key={img} delay={i * 0.08} as="article" className="pack">
              <Tilt max={6} scale={1.02} className="pack-img"><Photo name={img} alt={alt} sizes="(max-width: 900px) 100vw, 33vw" /></Tilt>
              <div className="pack-body">
                <p className="pack-n">{n}</p>
                <h3>{title}</h3>
                <p>{text}</p>
                <a className="link-arrow small" href={href('visit', lang) + '?upit=gift#upit'}>{T('Upit za ovo pakiranje', 'Ask about this box')} →</a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="detail-pair">
        <Reveal className="dp-a"><Photo name="kutija-drvo-logo" alt={T('Poklopac drvene kutije s natpisom Vina Govorko', 'The lid of a wooden box with Vina Govorko pressed into it')} sizes="(max-width: 900px) 100vw, 40vw" /></Reveal>
        <Reveal delay={0.1} className="dp-b"><Photo name="kutija-otvorena" alt={T('Boca u drvenoj kutiji na slami, karta na poklopcu', 'A bottle on straw in a wooden box, a map in the lid')} sizes="(max-width: 900px) 100vw, 60vw" /></Reveal>
      </section>

      <section id="tvrtke" className="wrap sec-pad corp">
        <div>
          <Reveal><p className="kicker">{T('Poslovni darovi', 'Corporate gifts')}</p></Reveal>
          <Reveal delay={0.05}><h2>{T('Darovi za partnere i zaposlenike, s pričom iz Vrgorca', 'Gifts for partners and staff, with a story from Vrgorac')}</h2></Reveal>
        </div>
        <ol className="steps">
          {[
            [T('Javi nam koliko i do kada', 'Tell us how many and by when'), T('Broj darova, rok i okvirni budžet.', 'Number of gifts, deadline and a rough budget.')],
            [T('Zajedno složimo vina i pakiranje', 'We choose wines and packaging together'), T('Jedna boca, kolekcija ili kofer, kako tebi paše.', 'A single bottle, the collection or a case, whatever suits you.')],
            [T('Dogovorimo preuzimanje', 'We arrange pick-up'), T('U vinariji u Metkoviću ili kako se dogovorimo.', 'At the winery in Metković, or as agreed.')]
          ].map(([a, b], i) => (
            <Reveal key={i} delay={i * 0.08} as="li" className="step"><span className="step-n">0{i + 1}</span><span><strong>{a}</strong><span>{b}</span></span></Reveal>
          ))}
          <li className="step-cta"><a className="btn btn-bone" href={href('visit', lang) + '?upit=gift#upit'}>{T('Pošalji upit za darove', 'Send a gift inquiry')}</a></li>
        </ol>
      </section>
    </>
  );
}
