import { motion } from 'motion/react';
import { Reveal, ScrollWords } from '@shared/fx.jsx';
import { Photo } from '../components/Img.jsx';
import { PageHero, ParallaxPhoto, EASE } from '../components/Bits.jsx';
import { useShop } from '@shared/shop.jsx';
import { href } from '../routes.js';

export default function Family({ route }) {
  const { t } = useShop();
  const lang = route.lang;
  const T = (hr, en) => (lang === 'en' ? en : hr);
  const steps = [
    [T('Prije 50+ godina', '50+ years ago'), T('Djed Branko sadi loze', 'Grandpa Branko plants the vines'), T('U Dusini posadi 8.000 loza plavke, zlatarice, maraštine i trbljana. Ti trsovi i danas rađaju.', 'In Dusina he plants 8,000 vines of Plavka, Zlatarica, Maraština and Trbljan. Those vines still bear fruit today.')],
    [T('Godinama', 'For years'), T('Grožđe ide prekupcima', 'The grapes go to middlemen'), T('Grožđe iz Dusine prodavalo se po pijacama. Vino se radilo samo za kuću.', 'The grapes from Dusina were sold at the markets. Wine was made only for the family.')],
    [T('Jedno jutro', 'One morning'), T('Deset bačava ispred kuće', 'Ten barrels outside the house'), T('Šleper s deset rabljenih hrastovih bačava stane ispred kuće u Metkoviću. Bačve završe u staroj mesnici.', 'A truck with ten used oak barrels pulls up outside the house in Metković. The barrels end up in the old butcher shop.')],
    ['2014.', T('Prva vina na tržištu', 'Our first wines on the market'), T('Dišpet je naše prvo vino. Ako se ne proda, popit ćemo ga. Prodalo se.', 'Dišpet is our first wine. If it doesn’t sell, we’ll drink it. It sold.')],
    ['2019.', T('Novi nasadi', 'New vineyards'), T('Uz stare trsove sadimo trnak, pošip i merlot. Za pošip su nam govorili da tu neće sazrit.', 'Next to the old vines we plant Trnak, Pošip and Merlot. People told us Pošip would never ripen here.')],
    [T('Danas', 'Today'), T('Sedam vina', 'Seven wines'), T('Od pjenušca Arije do Brankića iz barriquea, sve iz vlastitog grožđa.', 'From the sparkling Arija to Brankić from barrique, all from our own grapes.')]
  ];
  return (
    <>
      <PageHero route={route} photo="plavka-stari-trs" pos="center 40%" crumbs={[[t('nav.family')]]}
        alt={T('Stari trs plavke koji je posadio djed', 'An old Plavka vine planted by grandpa')}
        kicker={T('Obitelj Govorko', 'The Govorko family')}
        title={T('Sve je počelo šleperom ispred kuće.', 'It all started with a truck outside the house.')} />

      <section className="wrap sec-pad story">
        <div className="story-text">
          <Reveal><p className="lead-xl">{T('Jedno jutro ćaći je ispred kuće u Metkoviću stao šleper. Šofer je pozvonio, a ćaća me nazvao u Zagreb pitat šta se događa. Rekao sam mu da sve unesu u prostor gdje je bila stara mesnica i da ništa ne brine.', 'One morning a truck pulled up outside my dad’s house in Metković. The driver rang the bell and dad called me in Zagreb to ask what was going on. I told him to carry everything into the old butcher shop downstairs and not to worry.')}</p></Reveal>
          <Reveal delay={0.05}><p>{T('U kamionu je bilo deset rabljenih hrastovih bačava koje smo braća i ja našli dok sam završavao agronomiju. Te bačve su nas, praktički, odvele tu gdje smo danas.', 'In the truck were ten used oak barrels my brothers and I had found while I was finishing my agronomy degree. Those barrels pretty much led us to where we are today.')}</p></Reveal>
          <Reveal delay={0.1}><p>{T('Grožđe iz Dusine godinama se prodavalo prekupcima po pijacama. Rekao sam ćaći: ajmo ga ostavit doma i napravit vino. Ako se ne proda, popit ćemo ga. Prodalo se. Od 2014. naša su vina na tržištu.', 'For years, grapes from Dusina were sold to middlemen at the markets. I told dad: let’s keep them and make wine. If it doesn’t sell, we’ll drink it. It sold. Our wines have been on the market since 2014.')}</p></Reveal>
          <Reveal delay={0.15}><p className="sign">Ivan Govorko<span>{T('vinar', 'winemaker')}</span></p></Reveal>
        </div>
        <Reveal className="story-media"><Photo name="boce-nebo" sizes="(max-width: 900px) 100vw, 40vw" alt={T('Vina Govorko na nebu', 'Govorko wines against the sky')} /></Reveal>
      </section>

      <section className="sec-black" aria-labelledby="tl-h">
        <div className="wrap sec-pad">
          <p className="kicker">{T('Kroz godine', 'Through the years')}</p>
          <h2 id="tl-h" className="h-lg">{T('Od djedovih loza do sedam vina', 'From grandpa’s vines to seven wines')}</h2>
          <ol className="timeline">
            <motion.span className="tl-line" aria-hidden="true" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, margin: '0px 0px -20% 0px' }} transition={{ duration: 2.4, ease: EASE }} />
            {steps.map(([when, title, text], i) => (
              <motion.li key={i} className={'tl-item' + (i % 2 ? ' r' : '')} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -12% 0px' }} transition={{ duration: 0.8, ease: EASE }}>
                <span className="tl-dot" aria-hidden="true" />
                <p className="tl-when">{when}</p>
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band band-tall">
        <ParallaxPhoto name="zima-redovi" alt="" className="band-bg" strength={24} />
        <div className="band-shade" />
        <div className="wrap band-in">
          <ScrollWords className="band-quote" text={T('Cilj nam je vratiti naše autohtone sorte na mjesto koje zaslužuju na vinskoj karti Hrvatske.', 'Our goal is to return our native grapes to the place they deserve on the Croatian wine map.')} />
          <Reveal><a className="btn btn-bone" href={href('wines', lang)}>{T('Upoznaj naša vina', 'Meet our wines')}</a></Reveal>
        </div>
      </section>
    </>
  );
}
