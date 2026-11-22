import { Fragment, useRef } from 'react';
import { motion } from 'motion/react';
import { useShop } from '@shared/shop.jsx';
import { Reveal, CountUp, Magnetic } from '@shared/fx.jsx';
import { gsap, useGSAP } from '@shared/gsap.js';
import { Photo } from '../components/Img.jsx';
import { ParallaxPhoto, SectionHead, EASE } from '../components/Bits.jsx';
import Dictionary from '../components/Dictionary.jsx';
import { href } from '../routes.js';
import { VARIETIES, CONTACT } from '../data.js';

function Hero({ lang, T }) {
  const ref = useRef(null);
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo('.hero-img', { scale: 1.18 }, { scale: 1.04, duration: 2.6, ease: 'power2.out' });
    gsap.to('.hero-media', { yPercent: 22, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-in', { opacity: 0, y: -60, ease: 'none', scrollTrigger: { trigger: ref.current, start: '30% top', end: '85% top', scrub: true } });
  }, { scope: ref });
  return (
    <section ref={ref} className="hero">
      <div className="hero-media"><Photo name="vinograd-jesen" eager className="hero-img" alt={T('Vinograd Govorko u jesen, pod brdima vrgoračkog kraja', 'The Govorko vineyard in autumn, below the hills of Vrgorac')} /></div>
      <div className="hero-shade" />
      <div className="hero-in wrap">
        <motion.p className="enter kicker" style={{ '--d': '0.2s' }}>
          <span>{T('Obiteljska boutique vinarija', 'Family boutique winery')}</span><span className="kicker-dot" aria-hidden="true"> · </span><span>{T('Vinogorje Vrgorac', 'Vrgorac wine region')}</span>
        </motion.p>
        <h1 className="hero-title">
          {T('Stare sorte Vrgorca, natrag na vinskoj karti.', 'The old grapes of Vrgorac, back on the wine list.').split(' ').map((w, i) => (
            <Fragment key={i}><span className="hw"><span className="hw-in" style={{ '--d': (0.3 + i * 0.07).toFixed(2) + 's' }}>{w}</span></span>{' '}</Fragment>
          ))}
        </h1>
        <motion.div className="enter hero-cta" style={{ '--d': '1.0s' }}>
          <Magnetic><a className="btn btn-bone" href={href('wines', lang)}>{T('Upoznaj vina', 'Meet the wines')}</a></Magnetic>
          <a className="btn btn-line" href={href('visit', lang) + '?upit=visit#upit'}>{T('Dogovori degustaciju', 'Book a tasting')}</a>
        </motion.div>
      </div>
      <motion.div className="enter-fade hero-scroll" aria-hidden="true" style={{ '--d': '1.6s' }}>
        <span /> {T('Skrolaj', 'Scroll')}
      </motion.div>
    </section>
  );
}

export default function Home({ route }) {
  const { L } = useShop();
  const lang = route.lang;
  const T = (hr, en) => (lang === 'en' ? en : hr);
  return (
    <>
      <Hero lang={lang} T={T} />

      <section className="facts" aria-label={T('Ukratko', 'In short')}>
        <div className="wrap facts-in">
          <div><p className="fact-n"><CountUp to={50} />+</p><p>{T('godina stari trsovi plavke i zlatarice', 'year-old vines of Plavka and Zlatarica')}</p></div>
          <div><p className="fact-n">2014.</p><p>{T('naša vina na tržištu', 'our wines on the market')}</p></div>
          <div><p className="fact-n"><CountUp to={7} /></p><p>{T('sorti, većinom autohtonih dalmatinskih', 'grape varieties, mostly native Dalmatian')}</p></div>
          <div><p className="fact-n"><CountUp to={7} /></p><p>{T('vina, od pjenušca do barriquea', 'wines, from sparkling to barrique')}</p></div>
        </div>
      </section>

      <section className="intro wrap">
        <Reveal className="intro-media">
          <ParallaxPhoto name="plavka-stari-trs" sizes="(max-width: 900px) 100vw, 40vw" alt={T('Stari trs plavke s grozdovima', 'An old Plavka vine with bunches')} className="ratio-45" strength={14} />
          <p className="tag">{T('Plavka, trs star preko 50 godina', 'Plavka, a vine over 50 years old')}</p>
        </Reveal>
        <div className="intro-text">
          <Reveal><p className="kicker">{T('Obitelj Govorko', 'The Govorko family')}</p></Reveal>
          <Reveal delay={0.05}><h2>{T('Vino se kod nas radilo oduvijek. Na tržištu smo od 2014.', 'We have always made wine. Since 2014 it has been in bottles on the market.')}</h2></Reveal>
          <Reveal delay={0.1}><p className="lead">{T('Naša je vinarija nastala iz ljubavi prema vinu i želje da sačuvamo ono što su nam ostavili stariji. Grožđe dolazi iz vinograda starih preko pedeset godina, u Vinogorju Vrgorac, jednom od najvećih u Hrvatskoj.', 'Our winery grew out of a love of wine and a wish to keep what our elders left us. The grapes come from vineyards more than fifty years old in the Vrgorac wine region, one of the largest in Croatia.')}</p></Reveal>
          <Reveal delay={0.15}><p className="lead">{T('Uz stare trsove plavke, zlatarice vrgorske, maraštine i trbljana posadili smo i nove nasade trnka, pošipa i merlota.', 'Next to the old vines of Plavka, Zlatarica Vrgorska, Maraština and Trbljan, we have planted Trnak, Pošip and Merlot.')}</p></Reveal>
          <Reveal delay={0.2} as="blockquote" className="quote">{T('„Cilj nam je vratiti naše autohtone sorte na mjesto koje zaslužuju na vinskoj karti Hrvatske.”', '“Our goal is to return our native grapes to the place they deserve on the Croatian wine map.”')}</Reveal>
          <Reveal delay={0.25}><a className="link-arrow" href={href('family', lang)}>{T('Cijela priča obitelji', 'The whole family story')} <span aria-hidden="true">→</span></a></Reveal>
        </div>
      </section>

      <section className="sec-black" aria-labelledby="dict-h">
        <div className="wrap sec-pad">
          <SectionHead id="dict-h" kicker={T('Rječnik naših vina', 'A dictionary of our wines')} title={T('Sedam vina, sedam riječi', 'Seven wines, seven words')}>
            <p>{T('Svako vino nosi staru dalmatinsku riječ. Odaberi ime i pročitaj što znači i kako se pije.', 'Each wine carries an old Dalmatian word. Pick a name to read what it means and how to drink it.')}</p>
          </SectionHead>
          <Dictionary lang={lang} />
        </div>
      </section>

      <section className="wrap sec-pad" aria-labelledby="year-h">
        <SectionHead id="year-h" kicker={T('Godina u vinogradu', 'A year in the vineyard')} title={T('Od kapi na rezu do berbe', 'From the first drop to harvest')}>
          <a className="link-arrow" href={href('vineyard', lang)}>{T('Upoznaj vinograd', 'Meet the vineyard')} <span aria-hidden="true">→</span></a>
        </SectionHead>
        <div className="seasons">
          {[
            ['rezidba-kap', T('Zima', 'Winter'), T('Rezidba i prve suze loze', 'Pruning and the vine’s first tears'), T('Kap soka na orezanom trsu', 'A drop of sap on a pruned vine')],
            ['pupanje', T('Proljeće', 'Spring'), T('Pupanje pod planinom', 'Budburst below the mountain'), T('Prvi listovi na trsu', 'First leaves on the vine')],
            ['plavka-grozd', T('Ljeto', 'Summer'), T('Plavka dobiva boju', 'Plavka colours up'), T('Zreli grozd plavke', 'A ripe Plavka bunch')],
            ['grozd-zlatni', T('Jesen', 'Autumn'), T('Berba zlatarice i maraštine', 'Picking Zlatarica and Maraština'), T('Zlatni grozd bijelog grožđa', 'A golden bunch of white grapes')]
          ].map(([img, s, title, alt], i) => (
            <Reveal key={img} delay={i * 0.08} className={'season' + (i % 2 ? ' low' : '')}>
              <a href={href('vineyard', lang)}>
                <div className="season-img"><Photo name={img} alt={alt} sizes="(max-width: 700px) 50vw, 25vw" /></div>
                <p className="season-s">{s}</p>
                <p className="season-t">{title}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="band">
        <ParallaxPhoto name="trsovi-ljeto" alt="" className="band-bg" strength={24} />
        <div className="band-shade" />
        <div className="wrap band-in">
          <Reveal><p className="kicker kicker-light">{T('Sorte iz naših vinograda', 'Grapes from our vineyards')}</p></Reveal>
          <ul className="chips">
            {VARIETIES.map((v, i) => (
              <motion.li key={v.name.hr} className={'chip-v' + (v.old ? '' : ' new')}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: EASE, delay: i * 0.06 }}>
                {L(v.name)}
              </motion.li>
            ))}
          </ul>
          <p className="band-legend"><span className="lg-item"><span className="lg-old" /> {T('stari trsovi, preko 50 godina', 'old vines, over 50 years')}</span><span className="lg-item"><span className="lg-new" /> {T('novi nasadi', 'new plantings')}</span></p>
        </div>
      </section>

      <section className="wrap sec-pad split">
        <div className="split-text">
          <Reveal><p className="kicker">{T('Pokloni i poslovni darovi', 'Gifts and corporate gifts')}</p></Reveal>
          <Reveal delay={0.05}><h2>{T('Drvena kutija s natpisom, karta unutra.', 'A wooden box with our name, a map inside.')}</h2></Reveal>
          <Reveal delay={0.1}><p className="lead">{T('Pakiramo jednu bocu, kolekciju od pet vina ili šest boca u koferu. Za tvrtke slažemo darove po dogovoru.', 'We pack a single bottle, a five-wine collection or six bottles in a case. For companies we put gifts together on request.')}</p></Reveal>
          <Reveal delay={0.15}><a className="btn btn-gold" href={href('gifts', lang)}>{T('Pogledaj pakiranja', 'See the gift boxes')}</a></Reveal>
        </div>
        <div className="gift-grid">
          <Reveal className="gg-wide"><Photo name="kutija-5-boca" sizes="(max-width: 900px) 100vw, 50vw" alt={T('Drvena kutija s pet vina Govorko', 'A wooden box with five Govorko wines')} /></Reveal>
          <Reveal delay={0.1}><Photo name="kutija-karta" sizes="(max-width: 900px) 50vw, 25vw" alt={T('Otvorena drvena kutija s kartom u poklopcu', 'An open wooden box with a map in the lid')} /></Reveal>
          <Reveal delay={0.2}><Photo name="kofer-6-boca" sizes="(max-width: 900px) 50vw, 25vw" alt={T('Kofer sa šest boca i grbom Govorko', 'A six-bottle case with the Govorko crest')} /></Reveal>
        </div>
      </section>

      <section className="visit-cta">
        <div className="wrap visit-cta-in">
          <Reveal className="visit-cta-img"><Photo name="boce-nebo" sizes="(max-width: 900px) 100vw, 40vw" alt={T('Boce Govorko i čaša na nebu', 'Govorko bottles and a glass against the sky')} /></Reveal>
          <div>
            <Reveal><p className="kicker">{T('Posjet i upit', 'Visit and inquiries')}</p></Reveal>
            <Reveal delay={0.05}><h2>{T('Javi nam se, otvorit ćemo bocu.', 'Get in touch, we will open a bottle.')}</h2></Reveal>
            <Reveal delay={0.1}><p className="lead">{T('Degustacije u vinariji u Metkoviću dogovaramo unaprijed. Za narudžbe, restorane i poklone pošalji upit, a mi javljamo cijenu i dostupnost.', 'Tastings at the winery in Metković are by appointment. For orders, restaurants and gifts send an inquiry and we will reply with prices and availability.')}</p></Reveal>
            <Reveal delay={0.15} className="visit-btns">
              <a className="btn btn-bone" href={href('visit', lang) + '#upit'}>{T('Pošalji upit', 'Send an inquiry')}</a>
              <a className="btn btn-line" href={'https://wa.me/' + CONTACT.whatsapp} target="_blank" rel="noopener">WhatsApp</a>
            </Reveal>
            <Reveal delay={0.2}><p className="visit-addr">{CONTACT.street}, {CONTACT.city} · <a href={'tel:' + CONTACT.phone.replace(/\s/g, '')}>{CONTACT.phone}</a></p></Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
