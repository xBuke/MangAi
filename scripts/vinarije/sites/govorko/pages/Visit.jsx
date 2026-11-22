import { useEffect } from 'react';
import { useShop } from '@shared/shop.jsx';
import { Reveal } from '@shared/fx.jsx';
import Inquiry from '@shared/Inquiry.jsx';
import { PageHero } from '../components/Bits.jsx';
import { Photo } from '../components/Img.jsx';
import { CONTACT } from '../data.js';

export default function Visit({ route }) {
  const { t, setInqType } = useShop();
  const lang = route.lang;
  const T = (hr, en) => (lang === 'en' ? en : hr);

  /* ?upit=order|visit|b2b|gift — vrsta upita s drugih stranica */
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('upit');
    if (['order', 'visit', 'b2b', 'gift'].includes(q)) setInqType(q);
    if (window.location.hash === '#upit') {
      const el = document.getElementById('upit');
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    }
  }, [setInqType]);

  const tel = CONTACT.phone.replace(/\s/g, '');
  return (
    <>
      <PageHero route={route} photo="rezidba-zima" pos="center 40%" crumbs={[[t('nav.visit')]]}
        alt={T('Orezani trs u vinogradu, planine u pozadini', 'A pruned vine in the vineyard, mountains behind')}
        kicker={T('Posjet i degustacije', 'Visits and tastings')}
        title={T('Dođi u Metković. Otvorit ćemo bocu.', 'Come to Metković. We will open a bottle.')} />

      <section className="wrap sec-pad visit">
        <div className="visit-cards">
          <Reveal className="vcard">
            <p className="kicker">{T('Degustacija', 'Tasting')}</p>
            <h2>{T('Uz najavu', 'By appointment')}</h2>
            <p>{T('Degustacije u vinariji dogovaramo unaprijed. Javi nam dan i koliko vas dolazi, a mi ćemo potvrditi termin.', 'We arrange tastings at the winery in advance. Tell us the day and how many of you are coming, and we will confirm.')}</p>
            <a className="link-arrow small" href="?upit=visit#upit" onClick={(e) => { e.preventDefault(); setInqType('visit'); document.getElementById('upit').scrollIntoView({ behavior: 'smooth' }); }}>{T('Dogovori degustaciju', 'Book a tasting')} →</a>
          </Reveal>
          <Reveal delay={0.06} className="vcard">
            <p className="kicker">{T('Vinarija', 'Winery')}</p>
            <h2>{CONTACT.street}</h2>
            <p>{CONTACT.city}</p>
            <a className="link-arrow small" href={CONTACT.maps} target="_blank" rel="noopener">{T('Upute za dolazak', 'Directions')} →</a>
          </Reveal>
          <Reveal delay={0.12} className="vcard">
            <p className="kicker">{T('Telefon i WhatsApp', 'Phone and WhatsApp')}</p>
            <h2><a href={'tel:' + tel}>{CONTACT.phone}</a></h2>
            <p><a href={'mailto:' + CONTACT.email}>{CONTACT.email}</a></p>
            <a className="link-arrow small" href={'https://wa.me/' + CONTACT.whatsapp} target="_blank" rel="noopener">{T('Piši na WhatsApp', 'Message on WhatsApp')} →</a>
          </Reveal>
        </div>
        <Reveal className="visit-photo"><Photo name="kutija-5-boca" alt={T('Pet vina Govorko u drvenoj kutiji', 'Five Govorko wines in a wooden box')} sizes="100vw" /></Reveal>
      </section>

      <div className="inq-wrap">
        <div className="wrap">
          <Inquiry winery="Vina Govorko" email={CONTACT.email} whatsapp={CONTACT.whatsapp} />
        </div>
      </div>
    </>
  );
}
