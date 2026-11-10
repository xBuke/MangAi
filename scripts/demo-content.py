#!/usr/bin/env python3
"""Sadržaj demo primjera (HR/EN). Pokretanje: python3 scripts/demo-content.py
Generira demo/<id>/index.html i demo/<id>/data.js za svaki primjer."""
import json, os

ROOT = os.path.join(os.path.dirname(__file__), '..')

def S(bot, options=None, event=None, end=False):
    d = {'bot': bot}
    if options: d['options'] = [{'label': l, 'next': n} for l, n in options]
    if event: d['event'] = event
    if end: d['end'] = True
    return d

DEMOS = {}

# ---------------------------------------------------------------- SALON
DEMOS['salon'] = {
 'hr': {
  'pageTitle': 'AI asistent za beauty salone – demo',
  'title': 'AI asistent za beauty salone',
  'lead': 'Asistent odgovara na pitanja o uslugama i cijenama, prima rezervacije 0–24 i šalje podsjetnike, a vi termine vidite odmah u kalendaru.',
  'business': 'Salon Lana', 'assistant': 'Salon Lana', 'channel': 'WhatsApp', 'boardSubtitle': 'Nadzorna ploča, danas',
  'kpis': [{'key': 'book', 'label': 'Rezervacije ovaj tjedan', 'value': 34}, {'key': 'q', 'label': 'Upiti preko asistenta', 'value': 18}, {'key': 'noshow', 'label': 'Propušteni termini', 'value': 2}, {'key': 'night', 'label': 'Rezervacije izvan radnog vremena', 'value': 11}],
  'tableTitle': 'Rezervacije',
  'columns': ['Klijentica', 'Usluga', 'Termin', 'Status'],
  'rows': [['Ana K.', 'Šišanje i fen', 'Danas 14:00', 'Potvrđeno'], ['Ivana M.', 'Gel lak', 'Danas 16:30', 'Podsjetnik poslan'], ['Petra L.', 'Bojanje', 'Sutra 10:00', 'Potvrđeno']],
  'inbox': [{'who': 'Marija T.', 'time': 'prije 2 h', 'summary': 'Pitala cijenu keratinskog tretmana. Asistent poslao cjenik i ponudio termin.', 'tag': 'Cijena'}, {'who': 'Lucija P.', 'time': 'jučer 22:14', 'summary': 'Otkazala termin u petak; asistent ponudio slobodni termin u subotu, prihvaćeno.', 'tag': 'Promjena termina'}],
  'automations': [{'label': 'Podsjetnik 24 sata prije termina', 'on': True}, {'label': 'Automatska potvrda rezervacije', 'on': True}, {'label': 'Ponuda oslobođenog termina listi čekanja', 'on': True}, {'label': 'Poruka nakon 6 tjedana bez posjeta', 'on': False}],
  'chat': {'opener': 'Bok, imate li slobodan termin za gel lak ovaj tjedan?', 'start': 's1', 'steps': {
    's1': S(['Bok! Naravno. Gel lak traje oko 60 minuta i košta 30 €.', 'Slobodni termini ovaj tjedan:'], [('Četvrtak 11:00', 's2'), ('Četvrtak 17:30', 's2'), ('Subota 9:00', 's2')]),
    's2': S(['Odlično. Kako se zovete?'], [('Ana', 's3')]),
    's3': S(['Hvala, Ana! Termin je rezerviran.', 'Dan prije stići će vam podsjetnik, a termin možete otkazati ili promijeniti odgovorom na ovu poruku.'],
            event={'row': ['Ana', 'Gel lak', 'Četvrtak', 'Potvrđeno'], 'inbox': {'who': 'Ana', 'time': 'upravo sada', 'summary': 'Rezervirala gel lak preko WhatsAppa. Podsjetnik zakazan dan prije.', 'tag': 'Nova rezervacija'}, 'kpi': {'book': 1, 'q': 1}, 'toast': 'Asistent je upisao novu rezervaciju u kalendar.'}, end=True),
  }},
  'features': ['Odgovara na pitanja o uslugama, cijenama i radnom vremenu, i noću i vikendom.', 'Prima rezervacije i promjene termina izravno u vaš kalendar.', 'Šalje podsjetnike i nudi oslobođene termine, pa je manje praznih termina.'],
  'cta': 'Želim ovo za svoj salon',
 },
 'en': {
  'pageTitle': 'AI assistant for beauty salons – demo',
  'title': 'AI assistant for beauty salons',
  'lead': 'The assistant answers questions about services and prices, takes bookings around the clock and sends reminders, while you see appointments straight in your calendar.',
  'business': 'Salon Lana', 'assistant': 'Salon Lana', 'channel': 'WhatsApp', 'boardSubtitle': 'Dashboard, today',
  'kpis': [{'key': 'book', 'label': 'Bookings this week', 'value': 34}, {'key': 'q', 'label': 'Enquiries via assistant', 'value': 18}, {'key': 'noshow', 'label': 'No-shows', 'value': 2}, {'key': 'night', 'label': 'Bookings outside hours', 'value': 11}],
  'tableTitle': 'Bookings',
  'columns': ['Client', 'Service', 'Time', 'Status'],
  'rows': [['Ana K.', 'Cut and blow-dry', 'Today 14:00', 'Confirmed'], ['Ivana M.', 'Gel polish', 'Today 16:30', 'Reminder sent'], ['Petra L.', 'Colour', 'Tomorrow 10:00', 'Confirmed']],
  'inbox': [{'who': 'Marija T.', 'time': '2 h ago', 'summary': 'Asked about keratin treatment price. Assistant sent the price list and offered a slot.', 'tag': 'Price'}, {'who': 'Lucija P.', 'time': 'yesterday 22:14', 'summary': 'Cancelled Friday; assistant offered a free Saturday slot, accepted.', 'tag': 'Reschedule'}],
  'automations': [{'label': 'Reminder 24 hours before', 'on': True}, {'label': 'Automatic booking confirmation', 'on': True}, {'label': 'Offer freed slots to the waiting list', 'on': True}, {'label': 'Message after 6 weeks without a visit', 'on': False}],
  'chat': {'opener': 'Hi, do you have a slot for gel polish this week?', 'start': 's1', 'steps': {
    's1': S(['Hi! Of course. Gel polish takes about 60 minutes and costs €30.', 'Free slots this week:'], [('Thursday 11:00', 's2'), ('Thursday 17:30', 's2'), ('Saturday 9:00', 's2')]),
    's2': S(['Great. What is your name?'], [('Ana', 's3')]),
    's3': S(['Thanks, Ana! Your appointment is booked.', 'You will get a reminder the day before, and you can cancel or change it by replying to this message.'],
            event={'row': ['Ana', 'Gel polish', 'Thursday', 'Confirmed'], 'inbox': {'who': 'Ana', 'time': 'just now', 'summary': 'Booked gel polish via WhatsApp. Reminder scheduled for the day before.', 'tag': 'New booking'}, 'kpi': {'book': 1, 'q': 1}, 'toast': 'The assistant added a new booking to the calendar.'}, end=True),
  }},
  'features': ['Answers questions about services, prices and opening hours, at night and at weekends too.', 'Takes bookings and changes straight into your calendar.', 'Sends reminders and offers freed slots, so fewer appointments go empty.'],
  'cta': 'I want this for my salon',
 }
}

# ---------------------------------------------------------------- NEKRETNINE
DEMOS['nekretnine'] = {
 'hr': {
  'pageTitle': 'AI asistent za agencije za nekretnine – demo',
  'title': 'AI asistent za agencije za nekretnine',
  'lead': 'Asistent odgovara na upite za oglase, postavlja prava pitanja o budžetu i rokovima te zakazuje razgled, a agent dobiva kvalificiran upit sa sažetkom.',
  'business': 'Jadran Nekretnine', 'assistant': 'Jadran Nekretnine', 'channel': 'Web stranica', 'boardSubtitle': 'Nadzorna ploča, ovaj tjedan',
  'kpis': [{'key': 'q', 'label': 'Upiti ovaj tjedan', 'value': 24}, {'key': 'lead', 'label': 'Kvalificirani upiti', 'value': 12}, {'key': 'view', 'label': 'Zakazani razgledi', 'value': 8}, {'key': 'resp', 'label': 'Prosječni odgovor (min)', 'value': 1}],
  'tableTitle': 'Razgledi',
  'columns': ['Klijent', 'Nekretnina', 'Termin', 'Agent'],
  'rows': [['Tomislav B.', 'Stan 68 m², Split', 'Danas 17:00', 'Maja'], ['Obitelj Horvat', 'Kuća s okućnicom, Kaštela', 'Sutra 10:30', 'Ivan']],
  'inbox': [{'who': 'Sara V.', 'time': 'prije 1 h', 'summary': 'Traži dvosoban stan do 220.000 € blizu škole. Kredit odobren. Predložena 3 oglasa.', 'tag': 'Vruć upit'}, {'who': 'Mark L.', 'time': 'jučer', 'summary': 'Strani kupac, pita o porezu na promet nekretnina. Asistent poslao opće informacije i proslijedio agentu.', 'tag': 'Za agenta'}],
  'automations': [{'label': 'Kvalifikacija upita (budžet, rok, financiranje)', 'on': True}, {'label': 'Podsjetnik dan prije razgleda', 'on': True}, {'label': 'Obavijest kupcu kad se pojavi sličan oglas', 'on': True}, {'label': 'Tjedni sažetak upita za agente', 'on': False}],
  'chat': {'opener': 'Je li stan na Žnjanu od 68 m² još dostupan?', 'start': 's1', 'steps': {
    's1': S(['Dobar dan! Da, stan je dostupan. Cijena je 245.000 €, treći kat s liftom i pogledom na more.', 'Kupujete li uz kredit ili gotovinom?'], [('Uz kredit, odobren je', 's2'), ('Gotovinom', 's2'), ('Još ne znam', 's2')]),
    's2': S(['Hvala. Kada biste htjeli razgledati stan?'], [('Ovaj tjedan poslijepodne', 's3'), ('Vikend', 's3')]),
    's3': S(['Zakazao sam razgled za četvrtak u 17:30 s agenticom Majom. Poslat ću vam potvrdu i adresu.', 'Želite li i obavijest kad se pojave slični stanovi?'], [('Da, može', 's4'), ('Ne treba', 's4')]),
    's4': S(['U redu. Vidimo se u četvrtak!'],
            event={'row': ['Novi kupac', 'Stan 68 m², Split', 'Četvrtak 17:30', 'Maja'], 'inbox': {'who': 'Novi kupac', 'time': 'upravo sada', 'summary': 'Zainteresiran za stan na Žnjanu, kupnja uz kredit. Razgled zakazan, poslana potvrda.', 'tag': 'Kvalificiran'}, 'kpi': {'q': 1, 'lead': 1, 'view': 1}, 'toast': 'Novi kvalificirani upit i razgled dodijeljen agentici Maji.'}, end=True),
  }},
  'features': ['Odgovara na upite za oglase u roku od minute, i izvan radnog vremena.', 'Postavlja pitanja o budžetu, financiranju i rokovima, pa agent dobiva samo ozbiljne kupce.', 'Zakazuje razglede u kalendar agenta i šalje podsjetnike.'],
  'cta': 'Želim ovo za svoju agenciju',
 },
 'en': {
  'pageTitle': 'AI assistant for real estate agencies – demo',
  'title': 'AI assistant for real estate agencies',
  'lead': 'The assistant answers listing enquiries, asks the right questions about budget and timing, and books viewings, so agents get qualified leads with a summary.',
  'business': 'Jadran Real Estate', 'assistant': 'Jadran Real Estate', 'channel': 'Website', 'boardSubtitle': 'Dashboard, this week',
  'kpis': [{'key': 'q', 'label': 'Enquiries this week', 'value': 24}, {'key': 'lead', 'label': 'Qualified leads', 'value': 12}, {'key': 'view', 'label': 'Viewings booked', 'value': 8}, {'key': 'resp', 'label': 'Average reply (min)', 'value': 1}],
  'tableTitle': 'Viewings',
  'columns': ['Client', 'Property', 'Time', 'Agent'],
  'rows': [['Tomislav B.', 'Flat 68 m², Split', 'Today 17:00', 'Maja'], ['Horvat family', 'House with garden, Kaštela', 'Tomorrow 10:30', 'Ivan']],
  'inbox': [{'who': 'Sara V.', 'time': '1 h ago', 'summary': 'Looking for a 2-bed flat up to €220,000 near a school. Mortgage approved. 3 listings suggested.', 'tag': 'Hot lead'}, {'who': 'Mark L.', 'time': 'yesterday', 'summary': 'Foreign buyer asking about property transfer tax. General info sent, passed to an agent.', 'tag': 'For agent'}],
  'automations': [{'label': 'Lead qualification (budget, timing, financing)', 'on': True}, {'label': 'Reminder the day before a viewing', 'on': True}, {'label': 'Alert buyers when a similar listing appears', 'on': True}, {'label': 'Weekly lead summary for agents', 'on': False}],
  'chat': {'opener': 'Is the 68 m² flat in Žnjan still available?', 'start': 's1', 'steps': {
    's1': S(['Hello! Yes, it is available. The price is €245,000, third floor with a lift and sea view.', 'Are you buying with a mortgage or in cash?'], [('Mortgage, already approved', 's2'), ('Cash', 's2'), ('Not sure yet', 's2')]),
    's2': S(['Thank you. When would you like to view the flat?'], [('This week, afternoon', 's3'), ('At the weekend', 's3')]),
    's3': S(['I have booked a viewing on Thursday at 17:30 with agent Maja. I will send you a confirmation and the address.', 'Would you also like alerts when similar flats come up?'], [('Yes, please', 's4'), ('No thanks', 's4')]),
    's4': S(['Done. See you on Thursday!'],
            event={'row': ['New buyer', 'Flat 68 m², Split', 'Thursday 17:30', 'Maja'], 'inbox': {'who': 'New buyer', 'time': 'just now', 'summary': 'Interested in the Žnjan flat, buying with a mortgage. Viewing booked, confirmation sent.', 'tag': 'Qualified'}, 'kpi': {'q': 1, 'lead': 1, 'view': 1}, 'toast': 'New qualified lead and viewing assigned to Maja.'}, end=True),
  }},
  'features': ['Answers listing enquiries within a minute, outside office hours too.', 'Asks about budget, financing and timing, so agents only get serious buyers.', 'Books viewings into the agent’s calendar and sends reminders.'],
  'cta': 'I want this for my agency',
 }
}

# ---------------------------------------------------------------- ORDINACIJA
DEMOS['ordinacija'] = {
 'hr': {
  'pageTitle': 'AI asistent za ordinacije i klinike – demo',
  'title': 'AI asistent za ordinacije i klinike',
  'lead': 'Asistent odgovara na česta pitanja pacijenata, prima zahtjeve za termin i šalje upute prije pregleda, a hitne slučajeve odmah upućuje na telefon ili 112.',
  'business': 'Poliklinika Mare', 'assistant': 'Poliklinika Mare', 'channel': 'Web stranica', 'boardSubtitle': 'Nadzorna ploča, danas',
  'kpis': [{'key': 'req', 'label': 'Zahtjevi za termin', 'value': 28}, {'key': 'booked', 'label': 'Naručeni pacijenti', 'value': 42}, {'key': 'calls', 'label': 'Poziva manje nego prošli mjesec', 'value': 31}, {'key': 'noshow', 'label': 'Nedolasci', 'value': 3}],
  'tableTitle': 'Zahtjevi za termin',
  'columns': ['Pacijent', 'Vrsta pregleda', 'Željeni termin', 'Status'],
  'rows': [['Ivan R.', 'Kontrola tlaka', 'Ponedjeljak ujutro', 'Naručen'], ['Ema S.', 'Dermatološki pregled', 'Što prije', 'Čeka potvrdu']],
  'inbox': [{'who': 'Zdenka M.', 'time': 'prije 30 min', 'summary': 'Pitala treba li natašte za vađenje krvi. Asistent poslao upute za pripremu.', 'tag': 'Upute'}, {'who': 'Anonimno', 'time': 'jutros', 'summary': 'Opisala jaku bol u prsima. Asistent odmah uputio na 112 i nije nastavio razgovor.', 'tag': 'Hitno, upućeno na 112'}],
  'automations': [{'label': 'Podsjetnik dan prije pregleda', 'on': True}, {'label': 'Slanje uputa za pripremu nakon narudžbe', 'on': True}, {'label': 'Upućivanje hitnih slučajeva na 112', 'on': True}, {'label': 'Anketa zadovoljstva nakon pregleda', 'on': False}],
  'chat': {'opener': 'Kako se mogu naručiti na vađenje krvi?', 'start': 's1', 'steps': {
    's1': S(['Dobar dan! Vađenje krvi radimo radnim danom od 7 do 10 sati, uz prethodnu najavu.', 'Imate li uputnicu ili dolazite privatno?'], [('Imam uputnicu', 's2'), ('Privatno', 's2')]),
    's2': S(['U redu. Koji dan vam odgovara?'], [('Utorak', 's3'), ('Srijeda', 's3'), ('Petak', 's3')]),
    's3': S(['Zahtjev je zaprimljen za 7:30. Sestra će ga potvrditi do kraja dana.', 'Važno: dođite natašte, bez hrane 12 sati prije. Vodu smijete piti.', 'Ovaj asistent ne daje medicinske savjete. Kod hitnih stanja nazovite 112.'],
            event={'row': ['Novi pacijent', 'Vađenje krvi', 'Odabrani dan 7:30', 'Čeka potvrdu'], 'inbox': {'who': 'Novi pacijent', 'time': 'upravo sada', 'summary': 'Zahtjev za vađenje krvi uz uputnicu. Poslane upute za pripremu natašte.', 'tag': 'Novi termin'}, 'kpi': {'req': 1}, 'toast': 'Novi zahtjev čeka potvrdu sestre.'}, end=True),
  }},
  'features': ['Odgovara na pitanja o radnom vremenu, uputnicama, cijenama i pripremi za pregled.', 'Prima zahtjeve za termin, a osoblje ih potvrđuje jednim klikom.', 'Ne daje dijagnoze; hitne slučajeve odmah upućuje na 112 ili telefon ordinacije.'],
  'cta': 'Želim ovo za svoju ordinaciju',
 },
 'en': {
  'pageTitle': 'AI assistant for clinics – demo',
  'title': 'AI assistant for clinics',
  'lead': 'The assistant answers common patient questions, takes appointment requests and sends preparation instructions, and immediately refers emergencies to 112 or the phone.',
  'business': 'Mare Clinic', 'assistant': 'Mare Clinic', 'channel': 'Website', 'boardSubtitle': 'Dashboard, today',
  'kpis': [{'key': 'req', 'label': 'Appointment requests', 'value': 28}, {'key': 'booked', 'label': 'Patients booked', 'value': 42}, {'key': 'calls', 'label': 'Fewer calls than last month', 'value': 31}, {'key': 'noshow', 'label': 'No-shows', 'value': 3}],
  'tableTitle': 'Appointment requests',
  'columns': ['Patient', 'Type', 'Preferred time', 'Status'],
  'rows': [['Ivan R.', 'Blood pressure check', 'Monday morning', 'Booked'], ['Ema S.', 'Dermatology check', 'As soon as possible', 'Awaiting confirmation']],
  'inbox': [{'who': 'Zdenka M.', 'time': '30 min ago', 'summary': 'Asked whether fasting is needed for a blood test. Preparation instructions sent.', 'tag': 'Instructions'}, {'who': 'Anonymous', 'time': 'this morning', 'summary': 'Described severe chest pain. Assistant immediately referred to 112 and did not continue.', 'tag': 'Urgent, referred to 112'}],
  'automations': [{'label': 'Reminder the day before', 'on': True}, {'label': 'Preparation instructions after booking', 'on': True}, {'label': 'Refer emergencies to 112', 'on': True}, {'label': 'Satisfaction survey after the visit', 'on': False}],
  'chat': {'opener': 'How can I book a blood test?', 'start': 's1', 'steps': {
    's1': S(['Hello! Blood tests are done on weekdays from 7 to 10 am, by appointment.', 'Do you have a referral or are you coming privately?'], [('I have a referral', 's2'), ('Privately', 's2')]),
    's2': S(['Fine. Which day suits you?'], [('Tuesday', 's3'), ('Wednesday', 's3'), ('Friday', 's3')]),
    's3': S(['Your request for 7:30 is received. A nurse will confirm it by the end of the day.', 'Important: come fasting, no food for 12 hours before. Water is fine.', 'This assistant does not give medical advice. In an emergency, call 112.'],
            event={'row': ['New patient', 'Blood test', 'Chosen day 7:30', 'Awaiting confirmation'], 'inbox': {'who': 'New patient', 'time': 'just now', 'summary': 'Blood test request with referral. Fasting instructions sent.', 'tag': 'New appointment'}, 'kpi': {'req': 1}, 'toast': 'A new request is waiting for the nurse to confirm.'}, end=True),
  }},
  'features': ['Answers questions about hours, referrals, prices and preparation.', 'Takes appointment requests that staff confirm with one click.', 'Gives no diagnoses; emergencies are referred to 112 or the clinic phone.'],
  'cta': 'I want this for my clinic',
 }
}

# ---------------------------------------------------------------- ODVJETNIK
DEMOS['odvjetnik'] = {
 'hr': {
  'pageTitle': 'AI asistent za odvjetničke urede – demo',
  'title': 'AI asistent za odvjetničke urede',
  'lead': 'Asistent prikuplja osnovne podatke o predmetu prije konzultacija, provjerava rokove koje je stranka navela i zakazuje termin, a odvjetnik dobiva sažetak prije prvog razgovora.',
  'business': 'Ured Perić', 'assistant': 'Odvjetnički ured Perić', 'channel': 'Web stranica', 'boardSubtitle': 'Nadzorna ploča, ovaj tjedan',
  'kpis': [{'key': 'q', 'label': 'Novi upiti', 'value': 9}, {'key': 'cons', 'label': 'Zakazane konzultacije', 'value': 5}, {'key': 'urgent', 'label': 'Upiti s rokom do 8 dana', 'value': 2}, {'key': 'time', 'label': 'Ušteđeni sati unosa', 'value': 6}],
  'tableTitle': 'Konzultacije',
  'columns': ['Stranka', 'Područje', 'Termin', 'Napomena'],
  'rows': [['Josip K.', 'Radno pravo', 'Sutra 9:00', 'Otkaz uručen prije 5 dana'], ['D. d.o.o.', 'Trgovački ugovori', 'Petak 13:00', 'Pregled ugovora o najmu']],
  'inbox': [{'who': 'Martina G.', 'time': 'prije 3 h', 'summary': 'Nasljeđivanje nekretnine, troje nasljednika. Prikupljeni podaci i popis dokumenata za donijeti.', 'tag': 'Nasljedno pravo'}, {'who': 'Anonimno', 'time': 'jučer', 'summary': 'Pitanje izvan djelokruga ureda (kazneno pravo). Asistent ljubazno uputio na Hrvatsku odvjetničku komoru.', 'tag': 'Upućeno dalje'}],
  'automations': [{'label': 'Sažetak predmeta prije konzultacija', 'on': True}, {'label': 'Upozorenje kad stranka navede kratak rok', 'on': True}, {'label': 'Popis dokumenata koje stranka treba donijeti', 'on': True}, {'label': 'Podsjetnik dan prije konzultacija', 'on': False}],
  'chat': {'opener': 'Dobio sam otkaz, trebam savjet.', 'start': 's1', 'steps': {
    's1': S(['Žao mi je zbog toga. Mogu prikupiti osnovne podatke i dogovoriti konzultacije s odvjetnicom.', 'Napomena: ovo nije pravni savjet.', 'Kada vam je otkaz uručen?'], [('Prije manje od 8 dana', 's2'), ('Prije više od 8 dana', 's2')]),
    's2': S(['Hvala, to je važno zbog rokova. Je li otkaz pisani i imate li ugovor o radu?'], [('Imam oboje', 's3'), ('Samo otkaz', 's3')]),
    's3': S(['Mogu vas naručiti na konzultacije sutra u 11:00 ili u četvrtak u 15:00.'], [('Sutra 11:00', 's4'), ('Četvrtak 15:00', 's4')]),
    's4': S(['Termin je rezerviran. Ponesite otkaz, ugovor o radu i zadnje tri platne liste.', 'Odvjetnica će prije razgovora dobiti sažetak vašeg slučaja.'],
            event={'row': ['Nova stranka', 'Radno pravo', 'Odabrani termin', 'Rok može biti kratak, provjeriti'], 'inbox': {'who': 'Nova stranka', 'time': 'upravo sada', 'summary': 'Otkaz ugovora o radu, ima pisani otkaz i ugovor. Konzultacije zakazane, stranka upućena što donijeti.', 'tag': 'Radno pravo'}, 'kpi': {'q': 1, 'cons': 1, 'urgent': 1}, 'toast': 'Nove konzultacije zakazane; označen mogući kratak rok.'}, end=True),
  }},
  'features': ['Prikuplja osnovne podatke o predmetu i dokumentima prije prvog razgovora.', 'Označava upite s kratkim rokovima da ih ured vidi odmah.', 'Ne daje pravne savjete; upite izvan djelokruga ljubazno upućuje dalje.'],
  'cta': 'Želim ovo za svoj ured',
 },
 'en': {
  'pageTitle': 'AI assistant for law offices – demo',
  'title': 'AI assistant for law offices',
  'lead': 'The assistant collects the basics of a matter before a consultation, flags deadlines the client mentions and books the meeting, so the lawyer gets a summary in advance.',
  'business': 'Perić Law', 'assistant': 'Perić Law Office', 'channel': 'Website', 'boardSubtitle': 'Dashboard, this week',
  'kpis': [{'key': 'q', 'label': 'New enquiries', 'value': 9}, {'key': 'cons', 'label': 'Consultations booked', 'value': 5}, {'key': 'urgent', 'label': 'Enquiries with deadline under 8 days', 'value': 2}, {'key': 'time', 'label': 'Admin hours saved', 'value': 6}],
  'tableTitle': 'Consultations',
  'columns': ['Client', 'Area', 'Time', 'Note'],
  'rows': [['Josip K.', 'Employment', 'Tomorrow 9:00', 'Dismissal served 5 days ago'], ['D. Ltd', 'Commercial contracts', 'Friday 13:00', 'Lease agreement review']],
  'inbox': [{'who': 'Martina G.', 'time': '3 h ago', 'summary': 'Inheritance of property, three heirs. Details collected and list of documents to bring sent.', 'tag': 'Inheritance'}, {'who': 'Anonymous', 'time': 'yesterday', 'summary': 'Question outside the office’s practice (criminal law). Politely referred to the Croatian Bar Association.', 'tag': 'Referred'}],
  'automations': [{'label': 'Matter summary before consultations', 'on': True}, {'label': 'Alert when a client mentions a short deadline', 'on': True}, {'label': 'List of documents to bring', 'on': True}, {'label': 'Reminder the day before', 'on': False}],
  'chat': {'opener': 'I have been dismissed from my job and need advice.', 'start': 's1', 'steps': {
    's1': S(['I am sorry to hear that. I can collect the basics and arrange a consultation with the lawyer.', 'Note: this is not legal advice.', 'When was the dismissal served?'], [('Less than 8 days ago', 's2'), ('More than 8 days ago', 's2')]),
    's2': S(['Thank you, that matters for deadlines. Is the dismissal in writing, and do you have your employment contract?'], [('I have both', 's3'), ('Only the dismissal', 's3')]),
    's3': S(['I can book a consultation tomorrow at 11:00 or Thursday at 15:00.'], [('Tomorrow 11:00', 's4'), ('Thursday 15:00', 's4')]),
    's4': S(['Booked. Please bring the dismissal, your contract and your last three payslips.', 'The lawyer will receive a summary of your case before the meeting.'],
            event={'row': ['New client', 'Employment', 'Chosen time', 'Deadline may be short, check'], 'inbox': {'who': 'New client', 'time': 'just now', 'summary': 'Employment dismissal, has written notice and contract. Consultation booked, told what to bring.', 'tag': 'Employment'}, 'kpi': {'q': 1, 'cons': 1, 'urgent': 1}, 'toast': 'New consultation booked; possible short deadline flagged.'}, end=True),
  }},
  'features': ['Collects the basics of a matter and its documents before the first meeting.', 'Flags enquiries with short deadlines so the office sees them at once.', 'Gives no legal advice; out-of-scope questions are politely referred elsewhere.'],
  'cta': 'I want this for my office',
 }
}

# ---------------------------------------------------------------- AGENCIJA
DEMOS['agencija'] = {
 'hr': {
  'pageTitle': 'AI asistent za marketinške agencije – demo',
  'title': 'AI asistent za marketinške agencije',
  'lead': 'Asistent pod vašim brendom kvalificira nove klijente, prikuplja brief i zakazuje uvodni sastanak, a tim dobiva sažetak s budžetom i ciljevima.',
  'business': 'Studio Val', 'assistant': 'Studio Val', 'channel': 'Web stranica', 'boardSubtitle': 'Nadzorna ploča, ovaj mjesec',
  'kpis': [{'key': 'lead', 'label': 'Novi upiti', 'value': 19}, {'key': 'qual', 'label': 'Kvalificirani', 'value': 11}, {'key': 'meet', 'label': 'Zakazani sastanci', 'value': 6}, {'key': 'reply', 'label': 'Odgovoreno u 24 h (%)', 'value': 100}],
  'tableTitle': 'Novi klijenti',
  'columns': ['Tvrtka', 'Usluga', 'Budžet', 'Sljedeći korak'],
  'rows': [['Pekara Zrno', 'Društvene mreže', '800 €/mj', 'Sastanak u utorak'], ['Hotel Mirna', 'Kampanja za sezonu', '6.000 €', 'Poslana ponuda']],
  'inbox': [{'who': 'Konoba Gušt', 'time': 'prije 4 h', 'summary': 'Traži novi logo i jelovnik. Budžet ispod minimuma; asistent poslao paket za male tvrtke.', 'tag': 'Mali budžet'}, {'who': 'Agro d.o.o.', 'time': 'jučer', 'summary': 'Postojeći klijent pita za izvještaj kampanje. Asistent poslao link na izvještaj.', 'tag': 'Postojeći klijent'}],
  'automations': [{'label': 'Kvalifikacija po budžetu i roku', 'on': True}, {'label': 'Brief upitnik prije sastanka', 'on': True}, {'label': 'Sinkronizacija s CRM-om', 'on': True}, {'label': 'Tjedni izvještaj klijentima', 'on': False}],
  'chat': {'opener': 'Trebamo pomoć oko Instagrama za naš restoran.', 'start': 's1', 'steps': {
    's1': S(['Rado! Da vas spojim s pravom osobom, imam dva kratka pitanja.', 'Koji je okvirni mjesečni budžet?'], [('Do 500 €', 's2'), ('500 – 1.500 €', 's2'), ('Više od 1.500 €', 's2')]),
    's2': S(['Hvala. Što vam je najvažnije u sljedeća 3 mjeseca?'], [('Više rezervacija', 's3'), ('Prepoznatljivost', 's3')]),
    's3': S(['Imamo slobodan termin za uvodni poziv u srijedu u 10:00. Odgovara li?'], [('Da', 's4'), ('Neki drugi dan', 's4')]),
    's4': S(['Dogovoreno. Poslat ću vam kratki upitnik o restoranu, da sastanak bude koristan od prve minute.'],
            event={'row': ['Novi restoran', 'Instagram', 'Prema odabiru', 'Uvodni poziv'], 'inbox': {'who': 'Novi restoran', 'time': 'upravo sada', 'summary': 'Instagram za restoran, cilj više rezervacija. Uvodni poziv zakazan, poslan upitnik.', 'tag': 'Kvalificiran'}, 'kpi': {'lead': 1, 'qual': 1, 'meet': 1}, 'toast': 'Novi kvalificirani klijent i uvodni poziv u kalendaru.'}, end=True),
  }},
  'features': ['Odgovara posjetiteljima vaše stranice pod vašim imenom i tonom.', 'Kvalificira upite po budžetu, roku i cilju prije nego što potrošite vrijeme na poziv.', 'Šalje brief upitnik i upisuje klijenta u CRM.'],
  'cta': 'Želim ovo za svoju agenciju',
 },
 'en': {
  'pageTitle': 'AI assistant for marketing agencies – demo',
  'title': 'AI assistant for marketing agencies',
  'lead': 'Under your brand, the assistant qualifies new clients, collects the brief and books an intro call, so the team gets a summary with budget and goals.',
  'business': 'Studio Val', 'assistant': 'Studio Val', 'channel': 'Website', 'boardSubtitle': 'Dashboard, this month',
  'kpis': [{'key': 'lead', 'label': 'New enquiries', 'value': 19}, {'key': 'qual', 'label': 'Qualified', 'value': 11}, {'key': 'meet', 'label': 'Calls booked', 'value': 6}, {'key': 'reply', 'label': 'Answered within 24 h (%)', 'value': 100}],
  'tableTitle': 'New clients',
  'columns': ['Company', 'Service', 'Budget', 'Next step'],
  'rows': [['Zrno Bakery', 'Social media', '€800/mo', 'Call on Tuesday'], ['Hotel Mirna', 'Season campaign', '€6,000', 'Quote sent']],
  'inbox': [{'who': 'Konoba Gušt', 'time': '4 h ago', 'summary': 'Wants a new logo and menu. Budget below minimum; small-business package sent.', 'tag': 'Small budget'}, {'who': 'Agro Ltd', 'time': 'yesterday', 'summary': 'Existing client asking for the campaign report. Link to the report sent.', 'tag': 'Existing client'}],
  'automations': [{'label': 'Qualify by budget and timing', 'on': True}, {'label': 'Brief questionnaire before the call', 'on': True}, {'label': 'CRM sync', 'on': True}, {'label': 'Weekly client report', 'on': False}],
  'chat': {'opener': 'We need help with Instagram for our restaurant.', 'start': 's1', 'steps': {
    's1': S(['Happy to help! Two quick questions so I can connect you with the right person.', 'What is your rough monthly budget?'], [('Up to €500', 's2'), ('€500 – 1,500', 's2'), ('Over €1,500', 's2')]),
    's2': S(['Thanks. What matters most in the next 3 months?'], [('More bookings', 's3'), ('Brand awareness', 's3')]),
    's3': S(['We have a free slot for an intro call on Wednesday at 10:00. Does that work?'], [('Yes', 's4'), ('Another day', 's4')]),
    's4': S(['Agreed. I will send you a short questionnaire about the restaurant so the call is useful from the first minute.'],
            event={'row': ['New restaurant', 'Instagram', 'As chosen', 'Intro call'], 'inbox': {'who': 'New restaurant', 'time': 'just now', 'summary': 'Instagram for a restaurant, goal more bookings. Intro call booked, questionnaire sent.', 'tag': 'Qualified'}, 'kpi': {'lead': 1, 'qual': 1, 'meet': 1}, 'toast': 'New qualified client and intro call in the calendar.'}, end=True),
  }},
  'features': ['Answers visitors to your site in your name and tone.', 'Qualifies enquiries by budget, timing and goal before you spend time on a call.', 'Sends a brief questionnaire and records the client in your CRM.'],
  'cta': 'I want this for my agency',
 }
}

# ---------------------------------------------------------------- OPĆINA (novo)
DEMOS['opcina'] = {
 'hr': {
  'pageTitle': 'AI asistent za općine i gradove – demo',
  'title': 'AI asistent za općine i gradove',
  'lead': 'Asistent odgovara građanima iz službenih dokumenata općine, upućuje ih na prave obrasce i prima komunalne prijave, a djelatnici dobivaju uredno razvrstane zahtjeve.',
  'business': 'Općina Primjerovo', 'assistant': 'Općina Primjerovo', 'channel': 'Službena web stranica', 'boardSubtitle': 'Pregled za jedinstveni upravni odjel',
  'assistantInitial': 'O',
  'kpis': [{'key': 'q', 'label': 'Odgovorena pitanja ovaj mjesec', 'value': 412}, {'key': 'rep', 'label': 'Komunalne prijave', 'value': 37}, {'key': 'open', 'label': 'Otvorene prijave', 'value': 9}, {'key': 'calls', 'label': 'Poziva manje na centrali (%)', 'value': 28}],
  'tableTitle': 'Komunalne prijave',
  'columns': ['Broj', 'Vrsta', 'Lokacija', 'Status'],
  'rows': [['KP-2026-118', 'Neispravna javna rasvjeta', 'Ulica kralja Tomislava 12', 'Proslijeđeno komunalnom redaru'], ['KP-2026-117', 'Oštećen kolnik', 'Put do groblja', 'U rješavanju'], ['KP-2026-116', 'Pun spremnik za otpad', 'Trg kod škole', 'Riješeno']],
  'inbox': [{'who': 'Građanin', 'time': 'prije 20 min', 'summary': 'Pitao rok za prijavu na natječaj za stipendije. Asistent naveo rok iz objavljenog natječaja i poslao link na obrazac.', 'tag': 'Stipendije'}, {'who': 'Građanka', 'time': 'jutros', 'summary': 'Pitala kako ishoditi rješenje o komunalnom doprinosu. Upućena na odjel i radno vrijeme za stranke.', 'tag': 'Za djelatnika'}],
  'automations': [{'label': 'Odgovori samo iz objavljenih dokumenata općine', 'on': True}, {'label': 'Obavijest građaninu o promjeni statusa prijave', 'on': True}, {'label': 'Usmjeravanje prijava nadležnoj službi', 'on': True}, {'label': 'Mjesečno izvješće o najčešćim pitanjima', 'on': True}],
  'chat': {'opener': 'Ne radi ulična rasvjeta u našoj ulici.', 'start': 's1', 'steps': {
    's1': S(['Hvala na prijavi! Zabilježit ću je i proslijediti komunalnoj službi.', 'U kojoj ulici i kod kojeg kućnog broja?'], [('Ulica Ivana Gundulića 7', 's2')]),
    's2': S(['Je li ugašena jedna svjetiljka ili cijela ulica?'], [('Jedna svjetiljka', 's3'), ('Cijela ulica', 's3')]),
    's3': S(['Želite li obavijest kad prijava bude riješena?'], [('Da, na e-poštu', 's4'), ('Ne treba', 's4')]),
    's4': S(['Prijava je zaprimljena pod brojem KP-2026-119 i proslijeđena komunalnom redaru.', 'Popravke javne rasvjete u pravilu se rješavaju u nekoliko radnih dana, a o statusu ćemo vas obavijestiti.'],
            event={'row': ['KP-2026-119', 'Neispravna javna rasvjeta', 'Ulica Ivana Gundulića 7', 'Novo, proslijeđeno'], 'inbox': {'who': 'Građanin', 'time': 'upravo sada', 'summary': 'Prijava neispravne rasvjete s točnom lokacijom. Automatski proslijeđeno komunalnom redaru.', 'tag': 'Komunalna prijava'}, 'kpi': {'rep': 1, 'open': 1, 'q': 1}, 'toast': 'Nova komunalna prijava zaprimljena i usmjerena nadležnoj službi.'}, end=True),
  }},
  'features': ['Odgovara građanima 0–24 isključivo iz objavljenih odluka, natječaja i obrazaca općine.', 'Prima komunalne prijave s lokacijom i opisom te ih usmjerava nadležnoj službi.', 'Rasterećuje centralu i šalteru daje mjesečni pregled najčešćih pitanja.'],
  'cta': 'Želim ovo za našu općinu',
 },
 'en': {
  'pageTitle': 'AI assistant for municipalities – demo',
  'title': 'AI assistant for municipalities',
  'lead': 'The assistant answers citizens from the municipality’s official documents, points them to the right forms and takes reports of local issues, so staff get neatly sorted requests.',
  'business': 'Municipality of Primjerovo', 'assistant': 'Municipality of Primjerovo', 'channel': 'Official website', 'boardSubtitle': 'Overview for the administrative office',
  'assistantInitial': 'M',
  'kpis': [{'key': 'q', 'label': 'Questions answered this month', 'value': 412}, {'key': 'rep', 'label': 'Issue reports', 'value': 37}, {'key': 'open', 'label': 'Open reports', 'value': 9}, {'key': 'calls', 'label': 'Fewer switchboard calls (%)', 'value': 28}],
  'tableTitle': 'Issue reports',
  'columns': ['Number', 'Type', 'Location', 'Status'],
  'rows': [['KP-2026-118', 'Street light out', 'Kralja Tomislava 12', 'Passed to warden'], ['KP-2026-117', 'Damaged road', 'Cemetery road', 'In progress'], ['KP-2026-116', 'Full waste bin', 'Square by the school', 'Resolved']],
  'inbox': [{'who': 'Citizen', 'time': '20 min ago', 'summary': 'Asked the deadline for the scholarship call. Assistant quoted the published deadline and linked the form.', 'tag': 'Scholarships'}, {'who': 'Citizen', 'time': 'this morning', 'summary': 'Asked how to obtain a utility contribution decision. Referred to the office and its opening hours.', 'tag': 'For staff'}],
  'automations': [{'label': 'Answer only from published documents', 'on': True}, {'label': 'Notify citizens when a report changes status', 'on': True}, {'label': 'Route reports to the responsible service', 'on': True}, {'label': 'Monthly report of the most common questions', 'on': True}],
  'chat': {'opener': 'The street lights in our street are not working.', 'start': 's1', 'steps': {
    's1': S(['Thank you for reporting it! I will log it and pass it to the utility service.', 'Which street and house number?'], [('Ivana Gundulića 7', 's2')]),
    's2': S(['Is it one lamp or the whole street?'], [('One lamp', 's3'), ('The whole street', 's3')]),
    's3': S(['Would you like a notification when it is fixed?'], [('Yes, by email', 's4'), ('No thanks', 's4')]),
    's4': S(['Your report is registered as KP-2026-119 and passed to the municipal warden.', 'Street light repairs are usually handled within a few working days, and we will let you know the status.'],
            event={'row': ['KP-2026-119', 'Street light out', 'Ivana Gundulića 7', 'New, passed on'], 'inbox': {'who': 'Citizen', 'time': 'just now', 'summary': 'Street light report with exact location. Automatically passed to the municipal warden.', 'tag': 'Issue report'}, 'kpi': {'rep': 1, 'open': 1, 'q': 1}, 'toast': 'New issue report received and routed to the responsible service.'}, end=True),
  }},
  'features': ['Answers citizens around the clock, only from the municipality’s published decisions, calls and forms.', 'Takes issue reports with location and description and routes them to the right service.', 'Relieves the switchboard and gives a monthly overview of the most common questions.'],
  'cta': 'I want this for our municipality',
 }
}

# ---------------------------------------------------------------- APARTMANI (novo)
DEMOS['apartmani'] = {
 'hr': {
  'pageTitle': 'AI asistent za apartmane i turizam – demo',
  'title': 'AI asistent za apartmane i turističke zajednice',
  'lead': 'Asistent odgovara gostima na više jezika, provjerava slobodne datume i šalje upute za dolazak, a vi dobivate upite spremne za potvrdu.',
  'business': 'Apartmani Bura', 'assistant': 'Apartmani Bura', 'channel': 'WhatsApp i web', 'boardSubtitle': 'Nadzorna ploča, sezona 2027.',
  'kpis': [{'key': 'q', 'label': 'Upiti ovaj tjedan', 'value': 46}, {'key': 'direct', 'label': 'Izravne rezervacije', 'value': 14}, {'key': 'lang', 'label': 'Jezika na kojima odgovara', 'value': 6}, {'key': 'night', 'label': 'Upiti noću', 'value': 19}],
  'tableTitle': 'Upiti za rezervaciju',
  'columns': ['Gost', 'Smještaj', 'Datumi', 'Status'],
  'rows': [['Familie Weber', 'Apartman A2 (4+1)', '12.–19. 7.', 'Čeka uplatu predujma'], ['Lukas P.', 'Studio S1', '3.–6. 6.', 'Potvrđeno']],
  'inbox': [{'who': 'Giulia R.', 'time': 'prije 1 h', 'summary': 'Na talijanskom pitala za parking i kućne ljubimce. Odgovoreno: parking uključen, ljubimci uz doplatu.', 'tag': 'IT'}, {'who': 'Tom H.', 'time': 'noćas 2:10', 'summary': 'Kasni dolazak. Poslane upute za samostalni ulaz i kod sefa s ključem.', 'tag': 'Dolazak'}],
  'automations': [{'label': 'Odgovori na jeziku gosta', 'on': True}, {'label': 'Upute za dolazak dan prije', 'on': True}, {'label': 'Podsjetnik za uplatu predujma', 'on': True}, {'label': 'Molba za recenziju nakon odlaska', 'on': True}],
  'chat': {'opener': 'Hallo! Habt ihr im August ein Apartment für 4 Personen frei?', 'start': 's1', 'steps': {
    's1': S(['Hallo! Ja, im August haben wir das Apartment A2 für 4+1 Personen mit Meerblick frei.', 'Für welche Daten?'], [('10.–17. August', 's2'), ('17.–24. August', 's2')]),
    's2': S(['Verfügbar! Der Preis beträgt 1.120 € für 7 Nächte, Parkplatz und WLAN inklusive.', 'Soll ich die Daten für Sie reservieren?'], [('Ja, bitte', 's3'), ('Erst überlegen', 's3')]),
    's3': S(['Danke! Die Anfrage ist gespeichert. Der Gastgeber bestätigt sie heute und sendet die Zahlungsdaten für die Anzahlung.'],
            event={'row': ['Neuer Gast (DE)', 'Apartman A2 (4+1)', 'Kolovoz, 7 noći', 'Čeka potvrdu'], 'inbox': {'who': 'Novi gost', 'time': 'upravo sada', 'summary': 'Na njemačkom tražio apartman za 4 osobe u kolovozu. Datumi slobodni, upit čeka vašu potvrdu.', 'tag': 'DE'}, 'kpi': {'q': 1, 'direct': 1}, 'toast': 'Novi upit za rezervaciju čeka vašu potvrdu.'}, end=True),
  }},
  'features': ['Odgovara gostima na njemačkom, engleskom, talijanskom i drugim jezicima, i noću.', 'Provjerava slobodne datume i cijene te šalje upit vama na potvrdu.', 'Šalje upute za dolazak, podsjetnike za uplatu i molbu za recenziju.'],
  'cta': 'Želim ovo za svoj smještaj',
 },
 'en': {
  'pageTitle': 'AI assistant for holiday rentals – demo',
  'title': 'AI assistant for holiday rentals and tourist boards',
  'lead': 'The assistant answers guests in several languages, checks available dates and sends arrival instructions, while you get enquiries ready to confirm.',
  'business': 'Bura Apartments', 'assistant': 'Bura Apartments', 'channel': 'WhatsApp and web', 'boardSubtitle': 'Dashboard, 2027 season',
  'kpis': [{'key': 'q', 'label': 'Enquiries this week', 'value': 46}, {'key': 'direct', 'label': 'Direct bookings', 'value': 14}, {'key': 'lang', 'label': 'Languages it answers in', 'value': 6}, {'key': 'night', 'label': 'Enquiries at night', 'value': 19}],
  'tableTitle': 'Booking enquiries',
  'columns': ['Guest', 'Unit', 'Dates', 'Status'],
  'rows': [['Familie Weber', 'Apartment A2 (4+1)', '12–19 Jul', 'Awaiting deposit'], ['Lukas P.', 'Studio S1', '3–6 Jun', 'Confirmed']],
  'inbox': [{'who': 'Giulia R.', 'time': '1 h ago', 'summary': 'Asked in Italian about parking and pets. Answered: parking included, pets for a fee.', 'tag': 'IT'}, {'who': 'Tom H.', 'time': 'last night 2:10', 'summary': 'Late arrival. Self check-in instructions and key box code sent.', 'tag': 'Arrival'}],
  'automations': [{'label': 'Reply in the guest’s language', 'on': True}, {'label': 'Arrival instructions the day before', 'on': True}, {'label': 'Deposit payment reminder', 'on': True}, {'label': 'Review request after departure', 'on': True}],
  'chat': {'opener': 'Hallo! Habt ihr im August ein Apartment für 4 Personen frei?', 'start': 's1', 'steps': {
    's1': S(['Hallo! Ja, im August haben wir das Apartment A2 für 4+1 Personen mit Meerblick frei.', 'Für welche Daten?'], [('10.–17. August', 's2'), ('17.–24. August', 's2')]),
    's2': S(['Verfügbar! Der Preis beträgt 1.120 € für 7 Nächte, Parkplatz und WLAN inklusive.', 'Soll ich die Daten für Sie reservieren?'], [('Ja, bitte', 's3'), ('Erst überlegen', 's3')]),
    's3': S(['Danke! Die Anfrage ist gespeichert. Der Gastgeber bestätigt sie heute und sendet die Zahlungsdaten für die Anzahlung.'],
            event={'row': ['New guest (DE)', 'Apartment A2 (4+1)', 'August, 7 nights', 'Awaiting confirmation'], 'inbox': {'who': 'New guest', 'time': 'just now', 'summary': 'Asked in German for a 4-person apartment in August. Dates free, enquiry awaiting your confirmation.', 'tag': 'DE'}, 'kpi': {'q': 1, 'direct': 1}, 'toast': 'A new booking enquiry is waiting for your confirmation.'}, end=True),
  }},
  'features': ['Answers guests in German, English, Italian and other languages, at night too.', 'Checks available dates and prices and sends the enquiry to you to confirm.', 'Sends arrival instructions, payment reminders and a review request.'],
  'cta': 'I want this for my rental',
 }
}

PAGE = '''<!DOCTYPE html>
<html lang="hr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex,follow">
    <title>{title} | MangAI</title>
    <meta name="theme-color" content="#ECEFEA">
    <link rel="icon" href="/favicon.ico">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="preload" href="/assets/fonts/bricolage-grotesque-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/assets/fonts/public-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="/assets/fonts/fonts.css">
    <link rel="stylesheet" href="/home.css">
    <link rel="stylesheet" href="/demo/demo-app.css">
</head>
<body>
    <a class="skip-link" href="#main">Preskoči na sadržaj</a>
    <div id="demo-root" data-vertical="{id}"></div>
    <script src="/demo/{id}/data.js"></script>
    <script src="/demo/demo-app.js"></script>
</body>
</html>
'''

for vid, d in DEMOS.items():
    folder = os.path.join(ROOT, 'demo', vid)
    os.makedirs(folder, exist_ok=True)
    with open(os.path.join(folder, 'data.js'), 'w', encoding='utf-8') as f:
        f.write('/* Generirano iz scripts/demo-content.py */\nwindow.MANGAI_DEMO = ' + json.dumps(d, ensure_ascii=False, indent=1) + ';\n')
    with open(os.path.join(folder, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(PAGE.format(title=d['hr']['pageTitle'], id=vid))
    print('demo', vid)
