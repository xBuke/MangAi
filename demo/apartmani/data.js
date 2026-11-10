/* Generirano iz scripts/demo-content.py */
window.MANGAI_DEMO = {
 "hr": {
  "pageTitle": "AI asistent za apartmane i turizam – demo",
  "title": "AI asistent za apartmane i turističke zajednice",
  "lead": "Asistent odgovara gostima na više jezika, provjerava slobodne datume i šalje upute za dolazak, a vi dobivate upite spremne za potvrdu.",
  "business": "Apartmani Bura",
  "assistant": "Apartmani Bura",
  "channel": "WhatsApp i web",
  "boardSubtitle": "Nadzorna ploča, sezona 2027.",
  "kpis": [
   {
    "key": "q",
    "label": "Upiti ovaj tjedan",
    "value": 46
   },
   {
    "key": "direct",
    "label": "Izravne rezervacije",
    "value": 14
   },
   {
    "key": "lang",
    "label": "Jezika na kojima odgovara",
    "value": 6
   },
   {
    "key": "night",
    "label": "Upiti noću",
    "value": 19
   }
  ],
  "tableTitle": "Upiti za rezervaciju",
  "columns": [
   "Gost",
   "Smještaj",
   "Datumi",
   "Status"
  ],
  "rows": [
   [
    "Familie Weber",
    "Apartman A2 (4+1)",
    "12.–19. 7.",
    "Čeka uplatu predujma"
   ],
   [
    "Lukas P.",
    "Studio S1",
    "3.–6. 6.",
    "Potvrđeno"
   ]
  ],
  "inbox": [
   {
    "who": "Giulia R.",
    "time": "prije 1 h",
    "summary": "Na talijanskom pitala za parking i kućne ljubimce. Odgovoreno: parking uključen, ljubimci uz doplatu.",
    "tag": "IT"
   },
   {
    "who": "Tom H.",
    "time": "noćas 2:10",
    "summary": "Kasni dolazak. Poslane upute za samostalni ulaz i kod sefa s ključem.",
    "tag": "Dolazak"
   }
  ],
  "automations": [
   {
    "label": "Odgovori na jeziku gosta",
    "on": true
   },
   {
    "label": "Upute za dolazak dan prije",
    "on": true
   },
   {
    "label": "Podsjetnik za uplatu predujma",
    "on": true
   },
   {
    "label": "Molba za recenziju nakon odlaska",
    "on": true
   }
  ],
  "chat": {
   "opener": "Hallo! Habt ihr im August ein Apartment für 4 Personen frei?",
   "start": "s1",
   "steps": {
    "s1": {
     "bot": [
      "Hallo! Ja, im August haben wir das Apartment A2 für 4+1 Personen mit Meerblick frei.",
      "Für welche Daten?"
     ],
     "options": [
      {
       "label": "10.–17. August",
       "next": "s2"
      },
      {
       "label": "17.–24. August",
       "next": "s2"
      }
     ]
    },
    "s2": {
     "bot": [
      "Verfügbar! Der Preis beträgt 1.120 € für 7 Nächte, Parkplatz und WLAN inklusive.",
      "Soll ich die Daten für Sie reservieren?"
     ],
     "options": [
      {
       "label": "Ja, bitte",
       "next": "s3"
      },
      {
       "label": "Erst überlegen",
       "next": "s3"
      }
     ]
    },
    "s3": {
     "bot": [
      "Danke! Die Anfrage ist gespeichert. Der Gastgeber bestätigt sie heute und sendet die Zahlungsdaten für die Anzahlung."
     ],
     "event": {
      "row": [
       "Neuer Gast (DE)",
       "Apartman A2 (4+1)",
       "Kolovoz, 7 noći",
       "Čeka potvrdu"
      ],
      "inbox": {
       "who": "Novi gost",
       "time": "upravo sada",
       "summary": "Na njemačkom tražio apartman za 4 osobe u kolovozu. Datumi slobodni, upit čeka vašu potvrdu.",
       "tag": "DE"
      },
      "kpi": {
       "q": 1,
       "direct": 1
      },
      "toast": "Novi upit za rezervaciju čeka vašu potvrdu."
     },
     "end": true
    }
   }
  },
  "features": [
   "Odgovara gostima na njemačkom, engleskom, talijanskom i drugim jezicima, i noću.",
   "Provjerava slobodne datume i cijene te šalje upit vama na potvrdu.",
   "Šalje upute za dolazak, podsjetnike za uplatu i molbu za recenziju."
  ],
  "cta": "Želim ovo za svoj smještaj"
 },
 "en": {
  "pageTitle": "AI assistant for holiday rentals – demo",
  "title": "AI assistant for holiday rentals and tourist boards",
  "lead": "The assistant answers guests in several languages, checks available dates and sends arrival instructions, while you get enquiries ready to confirm.",
  "business": "Bura Apartments",
  "assistant": "Bura Apartments",
  "channel": "WhatsApp and web",
  "boardSubtitle": "Dashboard, 2027 season",
  "kpis": [
   {
    "key": "q",
    "label": "Enquiries this week",
    "value": 46
   },
   {
    "key": "direct",
    "label": "Direct bookings",
    "value": 14
   },
   {
    "key": "lang",
    "label": "Languages it answers in",
    "value": 6
   },
   {
    "key": "night",
    "label": "Enquiries at night",
    "value": 19
   }
  ],
  "tableTitle": "Booking enquiries",
  "columns": [
   "Guest",
   "Unit",
   "Dates",
   "Status"
  ],
  "rows": [
   [
    "Familie Weber",
    "Apartment A2 (4+1)",
    "12–19 Jul",
    "Awaiting deposit"
   ],
   [
    "Lukas P.",
    "Studio S1",
    "3–6 Jun",
    "Confirmed"
   ]
  ],
  "inbox": [
   {
    "who": "Giulia R.",
    "time": "1 h ago",
    "summary": "Asked in Italian about parking and pets. Answered: parking included, pets for a fee.",
    "tag": "IT"
   },
   {
    "who": "Tom H.",
    "time": "last night 2:10",
    "summary": "Late arrival. Self check-in instructions and key box code sent.",
    "tag": "Arrival"
   }
  ],
  "automations": [
   {
    "label": "Reply in the guest’s language",
    "on": true
   },
   {
    "label": "Arrival instructions the day before",
    "on": true
   },
   {
    "label": "Deposit payment reminder",
    "on": true
   },
   {
    "label": "Review request after departure",
    "on": true
   }
  ],
  "chat": {
   "opener": "Hallo! Habt ihr im August ein Apartment für 4 Personen frei?",
   "start": "s1",
   "steps": {
    "s1": {
     "bot": [
      "Hallo! Ja, im August haben wir das Apartment A2 für 4+1 Personen mit Meerblick frei.",
      "Für welche Daten?"
     ],
     "options": [
      {
       "label": "10.–17. August",
       "next": "s2"
      },
      {
       "label": "17.–24. August",
       "next": "s2"
      }
     ]
    },
    "s2": {
     "bot": [
      "Verfügbar! Der Preis beträgt 1.120 € für 7 Nächte, Parkplatz und WLAN inklusive.",
      "Soll ich die Daten für Sie reservieren?"
     ],
     "options": [
      {
       "label": "Ja, bitte",
       "next": "s3"
      },
      {
       "label": "Erst überlegen",
       "next": "s3"
      }
     ]
    },
    "s3": {
     "bot": [
      "Danke! Die Anfrage ist gespeichert. Der Gastgeber bestätigt sie heute und sendet die Zahlungsdaten für die Anzahlung."
     ],
     "event": {
      "row": [
       "New guest (DE)",
       "Apartment A2 (4+1)",
       "August, 7 nights",
       "Awaiting confirmation"
      ],
      "inbox": {
       "who": "New guest",
       "time": "just now",
       "summary": "Asked in German for a 4-person apartment in August. Dates free, enquiry awaiting your confirmation.",
       "tag": "DE"
      },
      "kpi": {
       "q": 1,
       "direct": 1
      },
      "toast": "A new booking enquiry is waiting for your confirmation."
     },
     "end": true
    }
   }
  },
  "features": [
   "Answers guests in German, English, Italian and other languages, at night too.",
   "Checks available dates and prices and sends the enquiry to you to confirm.",
   "Sends arrival instructions, payment reminders and a review request."
  ],
  "cta": "I want this for my rental"
 }
};
