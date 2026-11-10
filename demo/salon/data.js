/* Generirano iz scripts/demo-content.py */
window.MANGAI_DEMO = {
 "hr": {
  "pageTitle": "AI asistent za beauty salone – demo",
  "title": "AI asistent za beauty salone",
  "lead": "Asistent odgovara na pitanja o uslugama i cijenama, prima rezervacije 0–24 i šalje podsjetnike, a vi termine vidite odmah u kalendaru.",
  "business": "Salon Lana",
  "assistant": "Salon Lana",
  "channel": "WhatsApp",
  "boardSubtitle": "Nadzorna ploča, danas",
  "kpis": [
   {
    "key": "book",
    "label": "Rezervacije ovaj tjedan",
    "value": 34
   },
   {
    "key": "q",
    "label": "Upiti preko asistenta",
    "value": 18
   },
   {
    "key": "noshow",
    "label": "Propušteni termini",
    "value": 2
   },
   {
    "key": "night",
    "label": "Rezervacije izvan radnog vremena",
    "value": 11
   }
  ],
  "tableTitle": "Rezervacije",
  "columns": [
   "Klijentica",
   "Usluga",
   "Termin",
   "Status"
  ],
  "rows": [
   [
    "Ana K.",
    "Šišanje i fen",
    "Danas 14:00",
    "Potvrđeno"
   ],
   [
    "Ivana M.",
    "Gel lak",
    "Danas 16:30",
    "Podsjetnik poslan"
   ],
   [
    "Petra L.",
    "Bojanje",
    "Sutra 10:00",
    "Potvrđeno"
   ]
  ],
  "inbox": [
   {
    "who": "Marija T.",
    "time": "prije 2 h",
    "summary": "Pitala cijenu keratinskog tretmana. Asistent poslao cjenik i ponudio termin.",
    "tag": "Cijena"
   },
   {
    "who": "Lucija P.",
    "time": "jučer 22:14",
    "summary": "Otkazala termin u petak; asistent ponudio slobodni termin u subotu, prihvaćeno.",
    "tag": "Promjena termina"
   }
  ],
  "automations": [
   {
    "label": "Podsjetnik 24 sata prije termina",
    "on": true
   },
   {
    "label": "Automatska potvrda rezervacije",
    "on": true
   },
   {
    "label": "Ponuda oslobođenog termina listi čekanja",
    "on": true
   },
   {
    "label": "Poruka nakon 6 tjedana bez posjeta",
    "on": false
   }
  ],
  "chat": {
   "opener": "Bok, imate li slobodan termin za gel lak ovaj tjedan?",
   "start": "s1",
   "steps": {
    "s1": {
     "bot": [
      "Bok! Naravno. Gel lak traje oko 60 minuta i košta 30 €.",
      "Slobodni termini ovaj tjedan:"
     ],
     "options": [
      {
       "label": "Četvrtak 11:00",
       "next": "s2"
      },
      {
       "label": "Četvrtak 17:30",
       "next": "s2"
      },
      {
       "label": "Subota 9:00",
       "next": "s2"
      }
     ]
    },
    "s2": {
     "bot": [
      "Odlično. Kako se zovete?"
     ],
     "options": [
      {
       "label": "Ana",
       "next": "s3"
      }
     ]
    },
    "s3": {
     "bot": [
      "Hvala, Ana! Termin je rezerviran.",
      "Dan prije stići će vam podsjetnik, a termin možete otkazati ili promijeniti odgovorom na ovu poruku."
     ],
     "event": {
      "row": [
       "Ana",
       "Gel lak",
       "Četvrtak",
       "Potvrđeno"
      ],
      "inbox": {
       "who": "Ana",
       "time": "upravo sada",
       "summary": "Rezervirala gel lak preko WhatsAppa. Podsjetnik zakazan dan prije.",
       "tag": "Nova rezervacija"
      },
      "kpi": {
       "book": 1,
       "q": 1
      },
      "toast": "Asistent je upisao novu rezervaciju u kalendar."
     },
     "end": true
    }
   }
  },
  "features": [
   "Odgovara na pitanja o uslugama, cijenama i radnom vremenu, i noću i vikendom.",
   "Prima rezervacije i promjene termina izravno u vaš kalendar.",
   "Šalje podsjetnike i nudi oslobođene termine, pa je manje praznih termina."
  ],
  "cta": "Želim ovo za svoj salon"
 },
 "en": {
  "pageTitle": "AI assistant for beauty salons – demo",
  "title": "AI assistant for beauty salons",
  "lead": "The assistant answers questions about services and prices, takes bookings around the clock and sends reminders, while you see appointments straight in your calendar.",
  "business": "Salon Lana",
  "assistant": "Salon Lana",
  "channel": "WhatsApp",
  "boardSubtitle": "Dashboard, today",
  "kpis": [
   {
    "key": "book",
    "label": "Bookings this week",
    "value": 34
   },
   {
    "key": "q",
    "label": "Enquiries via assistant",
    "value": 18
   },
   {
    "key": "noshow",
    "label": "No-shows",
    "value": 2
   },
   {
    "key": "night",
    "label": "Bookings outside hours",
    "value": 11
   }
  ],
  "tableTitle": "Bookings",
  "columns": [
   "Client",
   "Service",
   "Time",
   "Status"
  ],
  "rows": [
   [
    "Ana K.",
    "Cut and blow-dry",
    "Today 14:00",
    "Confirmed"
   ],
   [
    "Ivana M.",
    "Gel polish",
    "Today 16:30",
    "Reminder sent"
   ],
   [
    "Petra L.",
    "Colour",
    "Tomorrow 10:00",
    "Confirmed"
   ]
  ],
  "inbox": [
   {
    "who": "Marija T.",
    "time": "2 h ago",
    "summary": "Asked about keratin treatment price. Assistant sent the price list and offered a slot.",
    "tag": "Price"
   },
   {
    "who": "Lucija P.",
    "time": "yesterday 22:14",
    "summary": "Cancelled Friday; assistant offered a free Saturday slot, accepted.",
    "tag": "Reschedule"
   }
  ],
  "automations": [
   {
    "label": "Reminder 24 hours before",
    "on": true
   },
   {
    "label": "Automatic booking confirmation",
    "on": true
   },
   {
    "label": "Offer freed slots to the waiting list",
    "on": true
   },
   {
    "label": "Message after 6 weeks without a visit",
    "on": false
   }
  ],
  "chat": {
   "opener": "Hi, do you have a slot for gel polish this week?",
   "start": "s1",
   "steps": {
    "s1": {
     "bot": [
      "Hi! Of course. Gel polish takes about 60 minutes and costs €30.",
      "Free slots this week:"
     ],
     "options": [
      {
       "label": "Thursday 11:00",
       "next": "s2"
      },
      {
       "label": "Thursday 17:30",
       "next": "s2"
      },
      {
       "label": "Saturday 9:00",
       "next": "s2"
      }
     ]
    },
    "s2": {
     "bot": [
      "Great. What is your name?"
     ],
     "options": [
      {
       "label": "Ana",
       "next": "s3"
      }
     ]
    },
    "s3": {
     "bot": [
      "Thanks, Ana! Your appointment is booked.",
      "You will get a reminder the day before, and you can cancel or change it by replying to this message."
     ],
     "event": {
      "row": [
       "Ana",
       "Gel polish",
       "Thursday",
       "Confirmed"
      ],
      "inbox": {
       "who": "Ana",
       "time": "just now",
       "summary": "Booked gel polish via WhatsApp. Reminder scheduled for the day before.",
       "tag": "New booking"
      },
      "kpi": {
       "book": 1,
       "q": 1
      },
      "toast": "The assistant added a new booking to the calendar."
     },
     "end": true
    }
   }
  },
  "features": [
   "Answers questions about services, prices and opening hours, at night and at weekends too.",
   "Takes bookings and changes straight into your calendar.",
   "Sends reminders and offers freed slots, so fewer appointments go empty."
  ],
  "cta": "I want this for my salon"
 }
};
