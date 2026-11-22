#!/usr/bin/env python3
"""Čerin demo (ogledno/cerin): makne online rezervacije, doda kontakt, "Od mora do stola",
traku jela, novu kartu (MapLibre) i učita fx.js/fx.css.

Uvijek kreće od verzije iz gita (BASE ref), pa se može pokretati više puta:
    python3 scripts/cerin/patch.py            # BASE = b4dc333 (prije ovih izmjena)
"""
import json, re, subprocess, sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
BASE = sys.argv[1] if len(sys.argv) > 1 else 'b4dc333'
VER = 'fx5'

CREDIT = {'hr': 'Izrada stranice:', 'en': 'Website by', 'de': 'Website von', 'it': 'Sito realizzato da'}

PAGES = {'hr': 'index.html', 'en': 'en/index.html', 'de': 'de/index.html', 'it': 'it/index.html'}

MOB = {'display': '+385 91 1500 282', 'tel': '+385911500282', 'wa': '385911500282'}
LAND = {'display': '+385 20 861 056', 'tel': '+38520861056'}
EMAIL = 'idon23@outlook.com'

def ic(path, cls=''):
    return (f'<svg class="ic {cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" '
            f'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">{path}</svg>')

PHONE = ic('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>')
LANDLINE = ic('<rect x="3" y="9" width="18" height="12" rx="2"/><path d="M7 9V6a5 5 0 0 1 10 0v3"/><circle cx="12" cy="15" r="2.4"/>')
CHAT = ic('<path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 21l2.1-5.6A8.4 8.4 0 1 1 21 11.5z"/><path d="M9 10.5c.4 1.6 1.9 3.2 3.6 3.8l1.3-1 2 .9-.4 1.6c-3.6.4-7.3-3.3-7-6.9l1.6-.4.9 2z"/>')
MAIL = ic('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>')
ARROW = ic('<path d="M5 12h14M13 5l7 7-7 7"/>')

L = {
    'hr': {
        'meta_cut': ' Rezervirajte stol online.',
        'contact': 'Kontakt', 'call': 'Nazovite nas', 'touch': 'Javite nam se',
        'c': {
            'kicker': 'Kontakt', 'title': 'Javite nam se',
            'lead': 'Za stol, peku ili bilo kakvo pitanje najbrže je nazvati ili poslati poruku na WhatsApp. Peku pripremamo dan ranije, pa je naručite na vrijeme.',
            'mob': 'Mobitel', 'land': 'Fiksni', 'wa': 'WhatsApp', 'waText': 'Pošaljite poruku', 'mail': 'E-mail',
            'hours': 'Svaki dan 18:00 – 24:00 · ljetna sezona',
        },
        'st': {
            'kicker': 'Od mora do stola', 'title': 'Put jednog ulova', 'hint': 'Skrolajte', 'stamp': 'Dobar tek!',
            'steps': [
                ('More', 'Jadran ispred Prižbe', 'Prižba je mirna uvala na južnoj obali Korčule, okrenuta otvorenom moru i zalasku sunca.'),
                ('Ulov', 'Riba dana', 'Bijela riba je onakva kakvu more toga dana da. Na jelovniku je kao ulov dana, po kilogramu.'),
                ('Vatra', 'Gradele na drva', 'Riba i plodovi mora peku se na gradelama na drva, jednostavno, kako se na otoku oduvijek radi.'),
                ('Stol', 'Na vašem stolu', 'Uz krumpir na mornarski, blitvu i čašu korčulanskog Pošipa, dok sunce zalazi nad Prižbom.'),
            ],
        },
        'mq': [['Riba s gradela', 'Jastog alla Prižba', 'Škampi na buzaru', 'Hobotnica ispod peke', 'Crni rižot', 'Žrnovski makaruni'],
               ['Pošip', 'Grk', 'Rukatac', 'Cetinka', 'Rožata', 'Peka na drva']],
        'map': {
            'label': 'Karta okolice restorana', 'places': 'Mjesta u blizini', 'here': 'Ovdje smo', 'dist': 'km zračnom linijom',
            'fallback': 'Karta se trenutno ne može učitati.', 'open': 'Otvori u Google kartama',
            'win': 'Za zumiranje karte držite Ctrl i skrolajte', 'mac': 'Za zumiranje karte držite ⌘ i skrolajte', 'mob': 'Kartu pomičite s dva prsta',
            'pl': {
                'cerin': ('Restoran Čerin', 'Prižba', 'Danca 50, na samoj obali uvale Prižba.'),
                'blato': ('Blato', 'Najbliže mjesto', 'Najbliže veće mjesto. Cesta za Prižbu spušta se iz Blata prema jugu.'),
                'vela': ('Vela Luka', 'Trajekt', 'Trajektna luka na zapadu otoka, s linijom za Split.'),
                'smokvica': ('Smokvica', 'Vinogradi', 'Mjesto u čijim je vinogradima nastao Pošip.'),
                'korcula': ('Korčula', 'Stari grad', 'Povijesni grad na istočnom kraju otoka.'),
            },
        },
        'top': 'Natrag na vrh',
    },
    'en': {
        'meta_cut': ' Book a table online.',
        'contact': 'Contact', 'call': 'Call us', 'touch': 'Get in touch',
        'c': {
            'kicker': 'Contact', 'title': 'Get in touch',
            'lead': 'For a table, peka or any question, the quickest way is to call or send a WhatsApp message. Peka is prepared a day in advance, so order it in time.',
            'mob': 'Mobile', 'land': 'Landline', 'wa': 'WhatsApp', 'waText': 'Send a message', 'mail': 'Email',
            'hours': 'Daily 18:00 – 24:00 · summer season',
        },
        'st': {
            'kicker': 'From sea to table', 'title': 'The journey of a catch', 'hint': 'Scroll', 'stamp': 'Enjoy!',
            'steps': [
                ('Sea', 'The Adriatic off Prižba', 'Prižba is a quiet bay on Korčula’s south coast, facing the open sea and the sunset.'),
                ('Catch', 'Fish of the day', 'White fish is whatever the sea brings that day. It’s on the menu as catch of the day, priced per kilo.'),
                ('Fire', 'Wood-fired grill', 'Fish and seafood are cooked on a wood-fired grill, simply, the way it has always been done on the island.'),
                ('Table', 'On your table', 'With sailor-style potatoes, chard and a glass of Korčula Pošip, as the sun sets over Prižba.'),
            ],
        },
        'mq': [['Grilled fish', 'Lobster alla Prižba', 'Scampi buzara', 'Octopus under the peka', 'Black risotto', 'Žrnovo makaruni'],
               ['Pošip', 'Grk', 'Rukatac', 'Cetinka', 'Rožata', 'Wood-fired peka']],
        'map': {
            'label': 'Map of the area around the restaurant', 'places': 'Places nearby', 'here': 'We are here', 'dist': 'km as the crow flies',
            'fallback': 'The map can’t be loaded right now.', 'open': 'Open in Google Maps',
            'win': 'Use Ctrl + scroll to zoom the map', 'mac': 'Use ⌘ + scroll to zoom the map', 'mob': 'Use two fingers to move the map',
            'pl': {
                'cerin': ('Čerin Restaurant', 'Prižba', 'Danca 50, right on the shore of Prižba bay.'),
                'blato': ('Blato', 'Nearest town', 'The nearest larger village. The road to Prižba runs south from Blato.'),
                'vela': ('Vela Luka', 'Ferry', 'Ferry port on the west of the island, with a line to Split.'),
                'smokvica': ('Smokvica', 'Vineyards', 'The village whose vineyards gave the world Pošip.'),
                'korcula': ('Korčula Town', 'Old town', 'The historic town on the eastern tip of the island.'),
            },
        },
        'top': 'Back to top',
    },
    'de': {
        'meta_cut': ' Jetzt online reservieren.',
        'contact': 'Kontakt', 'call': 'Anrufen', 'touch': 'Kontakt aufnehmen',
        'c': {
            'kicker': 'Kontakt', 'title': 'Melden Sie sich',
            'lead': 'Für einen Tisch, Peka oder jede Frage rufen Sie am besten an oder schreiben uns per WhatsApp. Peka bereiten wir einen Tag vorher zu, bitte rechtzeitig bestellen.',
            'mob': 'Mobil', 'land': 'Festnetz', 'wa': 'WhatsApp', 'waText': 'Nachricht senden', 'mail': 'E-Mail',
            'hours': 'Täglich 18:00 – 24:00 · Sommersaison',
        },
        'st': {
            'kicker': 'Vom Meer auf den Tisch', 'title': 'Der Weg eines Fangs', 'hint': 'Scrollen', 'stamp': 'Guten Appetit!',
            'steps': [
                ('Meer', 'Die Adria vor Prižba', 'Prižba ist eine ruhige Bucht an der Südküste von Korčula, mit Blick aufs offene Meer und den Sonnenuntergang.'),
                ('Fang', 'Fisch des Tages', 'Weißer Fisch ist, was das Meer an diesem Tag bringt. Auf der Karte steht er als Fang des Tages, nach Kilo.'),
                ('Feuer', 'Grill über Holzfeuer', 'Fisch und Meeresfrüchte kommen auf den Grill über Holzfeuer, schlicht, so wie man es auf der Insel immer gemacht hat.'),
                ('Tisch', 'Auf Ihrem Tisch', 'Mit Kartoffeln nach Seemannsart, Mangold und einem Glas Pošip von Korčula, während die Sonne über Prižba untergeht.'),
            ],
        },
        'mq': [['Fisch vom Grill', 'Hummer alla Prižba', 'Scampi buzara', 'Oktopus unter der Peka', 'Schwarzes Risotto', 'Žrnovski Makaruni'],
               ['Pošip', 'Grk', 'Rukatac', 'Cetinka', 'Rožata', 'Peka aus dem Holzfeuer']],
        'map': {
            'label': 'Karte der Umgebung des Restaurants', 'places': 'Orte in der Nähe', 'here': 'Hier sind wir', 'dist': 'km Luftlinie',
            'fallback': 'Die Karte kann gerade nicht geladen werden.', 'open': 'In Google Maps öffnen',
            'win': 'Strg + Scrollen zum Zoomen der Karte', 'mac': '⌘ + Scrollen zum Zoomen der Karte', 'mob': 'Karte mit zwei Fingern bewegen',
            'pl': {
                'cerin': ('Restaurant Čerin', 'Prižba', 'Danca 50, direkt am Ufer der Bucht von Prižba.'),
                'blato': ('Blato', 'Nächster Ort', 'Der nächste größere Ort. Die Straße nach Prižba führt von Blato nach Süden.'),
                'vela': ('Vela Luka', 'Fähre', 'Fährhafen im Westen der Insel, mit Verbindung nach Split.'),
                'smokvica': ('Smokvica', 'Weinberge', 'Der Ort, in dessen Weinbergen der Pošip entstanden ist.'),
                'korcula': ('Korčula (Stadt)', 'Altstadt', 'Die historische Stadt an der Ostspitze der Insel.'),
            },
        },
        'top': 'Nach oben',
    },
    'it': {
        'meta_cut': ' Prenota online.',
        'contact': 'Contatti', 'call': 'Chiamaci', 'touch': 'Contattaci',
        'c': {
            'kicker': 'Contatti', 'title': 'Scriveteci o chiamateci',
            'lead': 'Per un tavolo, la peka o qualsiasi domanda, il modo più rapido è chiamare o scrivere su WhatsApp. La peka si prepara il giorno prima: ordinatela per tempo.',
            'mob': 'Cellulare', 'land': 'Fisso', 'wa': 'WhatsApp', 'waText': 'Invia un messaggio', 'mail': 'E-mail',
            'hours': 'Tutti i giorni 18:00 – 24:00 · stagione estiva',
        },
        'st': {
            'kicker': 'Dal mare alla tavola', 'title': 'Il viaggio di un pescato', 'hint': 'Scorri', 'stamp': 'Buon appetito!',
            'steps': [
                ('Mare', 'L’Adriatico davanti a Prižba', 'Prižba è una baia tranquilla sulla costa sud di Korčula, aperta sul mare e sul tramonto.'),
                ('Pescato', 'Pesce del giorno', 'Il pesce bianco è quello che il mare offre quel giorno. In menù è il pescato del giorno, al chilo.'),
                ('Fuoco', 'Griglia a legna', 'Pesce e frutti di mare si cuociono sulla griglia a legna, in modo semplice, come si è sempre fatto sull’isola.'),
                ('Tavola', 'Sulla vostra tavola', 'Con patate alla marinara, bietole e un bicchiere di Pošip di Korčula, mentre il sole tramonta su Prižba.'),
            ],
        },
        'mq': [['Pesce alla griglia', 'Astice alla Prižba', 'Scampi alla buzara', 'Polpo sotto la peka', 'Risotto nero', 'Makaruni di Žrnovo'],
               ['Pošip', 'Grk', 'Rukatac', 'Cetinka', 'Rožata', 'Peka a legna']],
        'map': {
            'label': 'Mappa dei dintorni del ristorante', 'places': 'Luoghi vicini', 'here': 'Siamo qui', 'dist': 'km in linea d’aria',
            'fallback': 'Al momento la mappa non si può caricare.', 'open': 'Apri in Google Maps',
            'win': 'Usa Ctrl + scorrimento per lo zoom', 'mac': 'Usa ⌘ + scorrimento per lo zoom', 'mob': 'Usa due dita per spostare la mappa',
            'pl': {
                'cerin': ('Ristorante Čerin', 'Prižba', 'Danca 50, proprio sulla riva della baia di Prižba.'),
                'blato': ('Blato', 'Paese vicino', 'Il paese più vicino. La strada per Prižba scende da Blato verso sud.'),
                'vela': ('Vela Luka', 'Traghetto', 'Porto dei traghetti a ovest dell’isola, con la linea per Spalato.'),
                'smokvica': ('Smokvica', 'Vigneti', 'Il paese nei cui vigneti è nato il Pošip.'),
                'korcula': ('Korčula (città)', 'Città vecchia', 'La città storica sulla punta orientale dell’isola.'),
            },
        },
        'top': 'Torna su',
    },
}


def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')


FISH = '<svg class="mq__fish" viewBox="0 0 40 20" aria-hidden="true"><path d="M2 10c6-7 16-8 26-3l8-5-2 8 2 8-8-5C18 18 8 17 2 10z" fill="currentColor"/><circle cx="9" cy="9" r="1.4" fill="var(--navy-900)"/></svg>'


def marquee(t):
    rows = []
    for i, items in enumerate(t['mq']):
        seq = ''.join(f'<span>{esc(x)}</span>{FISH}' for x in items)
        rows.append(f'<div class="mq__row{" mq__row--alt" if i else ""}" data-dir="{-1 if i == 0 else 1}"><div class="mq__track">{seq}{seq}</div></div>')
    return f'\n  <div class="mq" aria-hidden="true">{"".join(rows)}</div>\n'


ON = ' class="is-on"'


def seatable(t):
    s = t['st']
    lis = ''.join(
        f'<li{ON if i == 0 else ""}><span class="st__m"><b>{i + 1:02d}</b> {esc(m)}</span>'
        f'<h3 class="st__t">{esc(ti)}</h3><p class="st__p">{esc(p)}</p></li>'
        for i, (m, ti, p) in enumerate(s['steps']))
    return f'''
  <section class="st" id="from-sea" aria-labelledby="st-title">
    <div class="st__pin">
      <div class="st__text">
        <p class="kicker">{esc(s['kicker'])}</p>
        <h2 id="st-title">{esc(s['title'])}</h2>
        <ol class="st__rail"><span class="st__fill" aria-hidden="true"></span>{lis}</ol>
        <p class="st__hint" aria-hidden="true">{esc(s['hint'])} <span>↓</span></p>
      </div>
      <div class="st__stage" aria-hidden="true">
        <div class="st__svg" data-scene></div>
        <p class="st__stamp">{esc(s['stamp'])}</p>
        <p class="st__no"><b>01</b>/04</p>
      </div>
    </div>
  </section>
'''


def contact(t):
    c = t['c']
    cards = [
        (f'tel:{MOB["tel"]}', PHONE, c['mob'], MOB['display'], ''),
        (f'tel:{LAND["tel"]}', LANDLINE, c['land'], LAND['display'], ''),
        (f'https://wa.me/{MOB["wa"]}', CHAT, c['wa'], c['waText'], ' target="_blank" rel="noopener"'),
        (f'mailto:{EMAIL}', MAIL, c['mail'], EMAIL, ''),
    ]
    cs = ''.join(
        f'<li><a class="cc" href="{h}"{extra}><span class="cc__ic">{i}</span><span class="cc__l">{esc(l)}</span>'
        f'<span class="cc__v">{esc(v)}</span><span class="cc__go">{ARROW}</span></a></li>'
        for h, i, l, v, extra in cards)
    return f'''<section class="contact" id="contact" aria-labelledby="contact-title">
    <canvas class="contact__fish" aria-hidden="true"></canvas>
    <div class="wrap contact__in">
      <div class="contact__head">
        <p class="kicker">{esc(c['kicker'])}</p>
        <h2 id="contact-title">{esc(c['title'])}</h2>
        <p class="lead">{esc(c['lead'])}</p>
        <p class="contact__hours">{esc(c['hours'])}</p>
      </div>
      <ul class="cc__list">{cs}</ul>
    </div>
  </section>'''


def patch(lang, html):
    t = L[lang]
    root = '' if lang == 'hr' else '../'

    # meta i JSON-LD bez online rezervacija
    assert t['meta_cut'] in html, (lang, 'meta')
    html = html.replace(t['meta_cut'], '')
    html = html.replace('"acceptsReservations":true,', '')

    # CTA u zaglavlju i podnožju → kontakt
    n_before = html.count('href="#reserve"')
    html = re.sub(r'(<a class="btn btn--gold nav__cta") href="#reserve">[^<]*</a>', rf'\1 href="#contact">{esc(t["contact"])}</a>', html)
    html = re.sub(r'(<a class="btn btn--gold btn--sm top__cta") href="#reserve">[^<]*</a>', rf'\1 href="#contact">{esc(t["contact"])}</a>', html)
    html = re.sub(r'<li><a href="#reserve">[^<]*</a></li>', f'<li><a href="#contact">{esc(t["contact"])}</a></li>', html)
    # stavka "Kontakt" u izborniku (prije lokacije)
    html = re.sub(r'(<li><a href="#visit">)', f'<li><a href="#contact">{esc(t["contact"])}</a></li>\\1', html, count=1)

    # hero gumbi: jelovnik + kontakt
    m = re.search(r'<div class="hero__cta">\s*<a class="btn btn--gold" href="#reserve">.*?</a>\s*<a class="btn btn--ghost" href="#menu">([^<]*)</a>\s*</div>', html, re.S)
    assert m, (lang, 'hero cta')
    html = html.replace(m.group(0), f'<div class="hero__cta">\n        <a class="btn btn--gold" href="#menu">{m.group(1)} {ARROW}</a>\n        <a class="btn btn--ghost" href="#contact">{esc(t["touch"])}</a>\n      </div>')

    # rezervacije → kontakt
    html, k = re.subn(r'<section class="reserve" id="reserve".*?</section>', contact(t), html, flags=re.S)
    assert k == 1, (lang, 'reserve')

    # plutajući gumb na mobitelu → poziv
    html, k = re.subn(r'<a class="fab" href="#reserve"[^>]*>[^<]*</a>',
                      f'<a class="fab" href="tel:{MOB["tel"]}">{PHONE} {esc(t["call"])}</a>', html)
    assert k == 1, (lang, 'fab')
    assert 'href="#reserve"' not in html, (lang, 'reserve left', n_before)

    # traka jela + "od mora do stola" između priče i preporuka
    html, k = re.subn(r'(\n  <section class="highlights")', marquee(t) + seatable(t) + r'\1', html, count=1)
    assert k == 1

    # lokacija: Google iframe → MapLibre karta (kao Điko)
    m = re.search(r'<section class="visit" id="visit".*?</section>', html, re.S)
    v = m.group(0)
    head = re.search(r'(<p class="kicker">.*?</p>\s*<h2 id="visit-title">.*?</h2>\s*<p class="lead">.*?</p>)', v, re.S).group(1)
    info = re.search(r'<dl class="info">.*?</dl>', v, re.S).group(0)
    mt = t['map']
    newv = f'''<section class="visit" id="visit" aria-labelledby="visit-title">
    <div class="wrap">
      <div class="visit__head">
        {head}
      </div>
      {info}
      <div class="mapx">
        <div class="mapx__box" role="region" aria-label="{esc(mt['label'])}"><div class="mapx__load" aria-hidden="true"></div></div>
        <aside class="mapx__side" aria-label="{esc(mt['places'])}">
          <ul class="mapx__places"></ul>
          <div class="mapx__detail" aria-live="polite"></div>
        </aside>
      </div>
    </div>
  </section>'''
    html = html.replace(v, newv)

    # hero: ime za slovo-po-slovo + valovi
    html = html.replace('<span class="hero__name">Čerin</span>',
                        '<span class="hero__name"><span class="sr">Čerin</span><span class="hero__chars" aria-hidden="true">Čerin</span></span>'
                        '<svg class="hero__line" viewBox="0 0 320 24" aria-hidden="true"><path d="M2 12 C 22 2, 42 2, 62 12 S 102 22, 122 12 S 162 2, 182 12 S 222 22, 242 12 S 282 2, 302 12 L 318 12"/></svg>')
    html = re.sub(r'(<ul class="hero__facts wrap">.*?</ul>)',
                  r'\1\n    <div class="waves" aria-hidden="true"><i class="w1"></i><i class="w2"></i><i class="w3"></i></div>', html, count=1, flags=re.S)

    # potpis izrade u podnožju
    html = re.sub(r'(<p class="foot__copy">.*?</p>)', r'\1\n    <p class="foot__credit">' + CREDIT[lang] + ' <a href="https://mangai.hr/" target="_blank" rel="noopener">mangai.hr</a></p>', html, count=1)
    # koordinate sa stare stranice su bile u moru → OpenStreetMap (Restoran Čerin, Prižba)
    html = html.replace('42.893611', '42.906849').replace('16.830277', '16.791747')

    # CERIN konfiguracija: bez rezervacija, s tekstovima za efekte
    m = re.search(r'<script>window\.CERIN=(\{.*?\})</script>', html)
    cfg = json.loads(m.group(1))
    cfg.pop('res', None)
    cfg['fx'] = {'map': {k: v for k, v in mt.items()}, 'top': t['top'], 'call': t['call'], 'ver': VER}
    cfg['fx']['map']['pl'] = {k: {'n': a, 'r': b, 'p': c} for k, (a, b, c) in mt['pl'].items()}
    html = html.replace(m.group(0), '<script>window.CERIN=' + json.dumps(cfg, ensure_ascii=False, separators=(',', ':')) + '</script>')

    # stilovi i skripta efekata
    html = re.sub(r'(<link rel="stylesheet" href="css/style\.css\?v=)[^"]*(">)', rf'\g<1>{VER}\2\n<link rel="stylesheet" href="css/fx.css?v={VER}">', html)
    html = re.sub(r'(<link rel="stylesheet" href="\.\./css/style\.css\?v=)[^"]*(">)', rf'\g<1>{VER}\2\n<link rel="stylesheet" href="../css/fx.css?v={VER}">', html)
    html = re.sub(r'(<script src="(?:\.\./)?js/app\.js\?v=)[^"]*(" defer></script>)',
                  rf'\g<1>{VER}\2\n<script type="module" src="{root}js/fx/fx.js?v={VER}"></script>', html)
    assert 'fx.css' in html and 'fx/fx.js' in html, (lang, 'assets')
    return html


def main():
    for lang, rel in PAGES.items():
        path = f'ogledno/cerin/{rel}'
        src = subprocess.run(['git', 'show', f'{BASE}:{path}'], cwd=REPO, capture_output=True, text=True, check=True).stdout
        out = patch(lang, src)
        (REPO / path).write_text(out)
        print('ok', path, len(src), '→', len(out))


if __name__ == '__main__':
    main()
