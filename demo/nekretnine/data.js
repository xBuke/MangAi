/* Generirano iz scripts/demo-content.py */
window.MANGAI_DEMO = {
 "hr": {
  "pageTitle": "AI asistent za agencije za nekretnine – demo",
  "title": "AI asistent za agencije za nekretnine",
  "lead": "Asistent odgovara na upite za oglase, postavlja prava pitanja o budžetu i rokovima te zakazuje razgled, a agent dobiva kvalificiran upit sa sažetkom.",
  "business": "Jadran Nekretnine",
  "assistant": "Jadran Nekretnine",
  "channel": "Web stranica",
  "boardSubtitle": "Nadzorna ploča, ovaj tjedan",
  "kpis": [
   {
    "key": "q",
    "label": "Upiti ovaj tjedan",
    "value": 24
   },
   {
    "key": "lead",
    "label": "Kvalificirani upiti",
    "value": 12
   },
   {
    "key": "view",
    "label": "Zakazani razgledi",
    "value": 8
   },
   {
    "key": "resp",
    "label": "Prosječni odgovor (min)",
    "value": 1
   }
  ],
  "tableTitle": "Razgledi",
  "columns": [
   "Klijent",
   "Nekretnina",
   "Termin",
   "Agent"
  ],
  "rows": [
   [
    "Tomislav B.",
    "Stan 68 m², Split",
    "Danas 17:00",
    "Maja"
   ],
   [
    "Obitelj Horvat",
    "Kuća s okućnicom, Kaštela",
    "Sutra 10:30",
    "Ivan"
   ]
  ],
  "inbox": [
   {
    "who": "Sara V.",
    "time": "prije 1 h",
    "summary": "Traži dvosoban stan do 220.000 € blizu škole. Kredit odobren. Predložena 3 oglasa.",
    "tag": "Vruć upit"
   },
   {
    "who": "Mark L.",
    "time": "jučer",
    "summary": "Strani kupac, pita o porezu na promet nekretnina. Asistent poslao opće informacije i proslijedio agentu.",
    "tag": "Za agenta"
   }
  ],
  "automations": [
   {
    "label": "Kvalifikacija upita (budžet, rok, financiranje)",
    "on": true
   },
   {
    "label": "Podsjetnik dan prije razgleda",
    "on": true
   },
   {
    "label": "Obavijest kupcu kad se pojavi sličan oglas",
    "on": true
   },
   {
    "label": "Tjedni sažetak upita za agente",
    "on": false
   }
  ],
  "chat": {
   "opener": "Je li stan na Žnjanu od 68 m² još dostupan?",
   "start": "s1",
   "steps": {
    "s1": {
     "bot": [
      "Dobar dan! Da, stan je dostupan. Cijena je 245.000 €, treći kat s liftom i pogledom na more.",
      "Kupujete li uz kredit ili gotovinom?"
     ],
     "options": [
      {
       "label": "Uz kredit, odobren je",
       "next": "s2"
      },
      {
       "label": "Gotovinom",
       "next": "s2"
      },
      {
       "label": "Još ne znam",
       "next": "s2"
      }
     ],
     "field": "financiranje"
    },
    "s2": {
     "bot": [
      "Hvala. Kada biste htjeli razgledati stan?"
     ],
     "options": [
      {
       "label": "Ovaj tjedan poslijepodne",
       "next": "s3"
      },
      {
       "label": "Vikend",
       "next": "s3"
      }
     ],
     "field": "razgled"
    },
    "s3": {
     "bot": [
      "Zakazao sam razgled za četvrtak u 17:30 s agenticom Majom. Poslat ću vam potvrdu i adresu.",
      "Želite li i obavijest kad se pojave slični stanovi?"
     ],
     "options": [
      {
       "label": "Da, može",
       "next": "s4"
      },
      {
       "label": "Ne treba",
       "next": "s4"
      }
     ],
     "field": "obavijesti"
    },
    "s4": {
     "bot": [
      "U redu. Vidimo se u četvrtak!"
     ],
     "event": {
      "row": [
       "Novi kupac",
       "Stan 68 m², Split",
       "Četvrtak 17:30",
       "Maja"
      ],
      "inbox": {
       "who": "Novi kupac",
       "time": "upravo sada",
       "summary": "Zainteresiran za stan na Žnjanu, kupnja uz kredit. Razgled zakazan, poslana potvrda.",
       "tag": "Kvalificiran"
      },
      "kpi": {
       "q": 1,
       "lead": 1,
       "view": 1
      },
      "toast": "Novi kvalificirani upit i razgled dodijeljen agentici Maji.",
      "set": {
       "agent": "Agentica Maja, četvrtak 17:30"
      },
      "actions": [
       "Razgled upisan u kalendar agentice Maje",
       "Potvrda s adresom poslana kupcu",
       "Sažetak upita poslan agentici"
      ]
     },
     "end": true
    }
   }
  },
  "features": [
   "Odgovara na upite za oglase u roku od minute, i izvan radnog vremena.",
   "Postavlja pitanja o budžetu, financiranju i rokovima, pa agent dobiva samo ozbiljne kupce.",
   "Zakazuje razglede u kalendar agenta i šalje podsjetnike."
  ],
  "cta": "Želim ovo za svoju agenciju",
  "theme": {
   "chrome": "browser",
   "accent": "#1F3A5F",
   "soft": "#EAF0F7"
  },
  "when": "Subota, 20:15",
  "site": {
   "url": "jadran-nekretnine.hr",
   "nav": [
    "Prodaja",
    "Najam",
    "Novogradnja"
   ],
   "tagline": "Stanovi i kuće u Splitu i okolici"
  },
  "record": {
   "title": "Kvalificirani upit",
   "fields": [
    {
     "key": "nekretnina",
     "label": "Nekretnina"
    },
    {
     "key": "financiranje",
     "label": "Financiranje"
    },
    {
     "key": "razgled",
     "label": "Željeni razgled"
    },
    {
     "key": "obavijesti",
     "label": "Obavijesti o sličnim stanovima"
    },
    {
     "key": "agent",
     "label": "Dodijeljeno"
    }
   ],
   "initial": {
    "nekretnina": "Stan 68 m², Žnjan"
   }
  }
 },
 "en": {
  "pageTitle": "AI assistant for real estate agencies – demo",
  "title": "AI assistant for real estate agencies",
  "lead": "The assistant answers listing enquiries, asks the right questions about budget and timing, and books viewings, so agents get qualified leads with a summary.",
  "business": "Jadran Real Estate",
  "assistant": "Jadran Real Estate",
  "channel": "Website",
  "boardSubtitle": "Dashboard, this week",
  "kpis": [
   {
    "key": "q",
    "label": "Enquiries this week",
    "value": 24
   },
   {
    "key": "lead",
    "label": "Qualified leads",
    "value": 12
   },
   {
    "key": "view",
    "label": "Viewings booked",
    "value": 8
   },
   {
    "key": "resp",
    "label": "Average reply (min)",
    "value": 1
   }
  ],
  "tableTitle": "Viewings",
  "columns": [
   "Client",
   "Property",
   "Time",
   "Agent"
  ],
  "rows": [
   [
    "Tomislav B.",
    "Flat 68 m², Split",
    "Today 17:00",
    "Maja"
   ],
   [
    "Horvat family",
    "House with garden, Kaštela",
    "Tomorrow 10:30",
    "Ivan"
   ]
  ],
  "inbox": [
   {
    "who": "Sara V.",
    "time": "1 h ago",
    "summary": "Looking for a 2-bed flat up to €220,000 near a school. Mortgage approved. 3 listings suggested.",
    "tag": "Hot lead"
   },
   {
    "who": "Mark L.",
    "time": "yesterday",
    "summary": "Foreign buyer asking about property transfer tax. General info sent, passed to an agent.",
    "tag": "For agent"
   }
  ],
  "automations": [
   {
    "label": "Lead qualification (budget, timing, financing)",
    "on": true
   },
   {
    "label": "Reminder the day before a viewing",
    "on": true
   },
   {
    "label": "Alert buyers when a similar listing appears",
    "on": true
   },
   {
    "label": "Weekly lead summary for agents",
    "on": false
   }
  ],
  "chat": {
   "opener": "Is the 68 m² flat in Žnjan still available?",
   "start": "s1",
   "steps": {
    "s1": {
     "bot": [
      "Hello! Yes, it is available. The price is €245,000, third floor with a lift and sea view.",
      "Are you buying with a mortgage or in cash?"
     ],
     "options": [
      {
       "label": "Mortgage, already approved",
       "next": "s2"
      },
      {
       "label": "Cash",
       "next": "s2"
      },
      {
       "label": "Not sure yet",
       "next": "s2"
      }
     ],
     "field": "financiranje"
    },
    "s2": {
     "bot": [
      "Thank you. When would you like to view the flat?"
     ],
     "options": [
      {
       "label": "This week, afternoon",
       "next": "s3"
      },
      {
       "label": "At the weekend",
       "next": "s3"
      }
     ],
     "field": "razgled"
    },
    "s3": {
     "bot": [
      "I have booked a viewing on Thursday at 17:30 with agent Maja. I will send you a confirmation and the address.",
      "Would you also like alerts when similar flats come up?"
     ],
     "options": [
      {
       "label": "Yes, please",
       "next": "s4"
      },
      {
       "label": "No thanks",
       "next": "s4"
      }
     ],
     "field": "obavijesti"
    },
    "s4": {
     "bot": [
      "Done. See you on Thursday!"
     ],
     "event": {
      "row": [
       "New buyer",
       "Flat 68 m², Split",
       "Thursday 17:30",
       "Maja"
      ],
      "inbox": {
       "who": "New buyer",
       "time": "just now",
       "summary": "Interested in the Žnjan flat, buying with a mortgage. Viewing booked, confirmation sent.",
       "tag": "Qualified"
      },
      "kpi": {
       "q": 1,
       "lead": 1,
       "view": 1
      },
      "toast": "New qualified lead and viewing assigned to Maja.",
      "set": {
       "agent": "Agent Maja, Thursday 17:30"
      },
      "actions": [
       "Viewing added to agent Maja’s calendar",
       "Confirmation with the address sent to the buyer",
       "Enquiry summary sent to the agent"
      ]
     },
     "end": true
    }
   }
  },
  "features": [
   "Answers listing enquiries within a minute, outside office hours too.",
   "Asks about budget, financing and timing, so agents only get serious buyers.",
   "Books viewings into the agent’s calendar and sends reminders."
  ],
  "cta": "I want this for my agency",
  "theme": {
   "chrome": "browser",
   "accent": "#1F3A5F",
   "soft": "#EAF0F7"
  },
  "when": "Saturday, 20:15",
  "site": {
   "url": "jadran-nekretnine.hr",
   "nav": [
    "For sale",
    "To rent",
    "New builds"
   ],
   "tagline": "Flats and houses in and around Split"
  },
  "record": {
   "title": "Qualified lead",
   "fields": [
    {
     "key": "nekretnina",
     "label": "Property"
    },
    {
     "key": "financiranje",
     "label": "Financing"
    },
    {
     "key": "razgled",
     "label": "Preferred viewing"
    },
    {
     "key": "obavijesti",
     "label": "Alerts for similar flats"
    },
    {
     "key": "agent",
     "label": "Assigned to"
    }
   ],
   "initial": {
    "nekretnina": "68 m² flat, Žnjan"
   }
  }
 }
};
