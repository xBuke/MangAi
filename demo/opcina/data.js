/* Generirano iz scripts/demo-content.py */
window.MANGAI_DEMO = {
 "hr": {
  "pageTitle": "AI asistent za općine i gradove – demo",
  "title": "AI asistent za općine i gradove",
  "lead": "Asistent odgovara građanima iz službenih dokumenata općine, upućuje ih na prave obrasce i prima komunalne prijave, a djelatnici dobivaju uredno razvrstane zahtjeve.",
  "business": "Općina Primjerovo",
  "assistant": "Općina Primjerovo",
  "channel": "Službena web stranica",
  "boardSubtitle": "Pregled za jedinstveni upravni odjel",
  "assistantInitial": "O",
  "kpis": [
   {
    "key": "q",
    "label": "Odgovorena pitanja ovaj mjesec",
    "value": 412
   },
   {
    "key": "rep",
    "label": "Komunalne prijave",
    "value": 37
   },
   {
    "key": "open",
    "label": "Otvorene prijave",
    "value": 9
   },
   {
    "key": "calls",
    "label": "Poziva manje na centrali (%)",
    "value": 28
   }
  ],
  "tableTitle": "Komunalne prijave",
  "columns": [
   "Broj",
   "Vrsta",
   "Lokacija",
   "Status"
  ],
  "rows": [
   [
    "KP-2026-118",
    "Neispravna javna rasvjeta",
    "Ulica kralja Tomislava 12",
    "Proslijeđeno komunalnom redaru"
   ],
   [
    "KP-2026-117",
    "Oštećen kolnik",
    "Put do groblja",
    "U rješavanju"
   ],
   [
    "KP-2026-116",
    "Pun spremnik za otpad",
    "Trg kod škole",
    "Riješeno"
   ]
  ],
  "inbox": [
   {
    "who": "Građanin",
    "time": "prije 20 min",
    "summary": "Pitao rok za prijavu na natječaj za stipendije. Asistent naveo rok iz objavljenog natječaja i poslao link na obrazac.",
    "tag": "Stipendije"
   },
   {
    "who": "Građanka",
    "time": "jutros",
    "summary": "Pitala kako ishoditi rješenje o komunalnom doprinosu. Upućena na odjel i radno vrijeme za stranke.",
    "tag": "Za djelatnika"
   }
  ],
  "automations": [
   {
    "label": "Odgovori samo iz objavljenih dokumenata općine",
    "on": true
   },
   {
    "label": "Obavijest građaninu o promjeni statusa prijave",
    "on": true
   },
   {
    "label": "Usmjeravanje prijava nadležnoj službi",
    "on": true
   },
   {
    "label": "Mjesečno izvješće o najčešćim pitanjima",
    "on": true
   }
  ],
  "chat": {
   "opener": "Ne radi ulična rasvjeta u našoj ulici.",
   "start": "s1",
   "steps": {
    "s1": {
     "bot": [
      "Hvala na prijavi! Zabilježit ću je i proslijediti komunalnoj službi.",
      "U kojoj ulici i kod kojeg kućnog broja?"
     ],
     "options": [
      {
       "label": "Ulica Ivana Gundulića 7",
       "next": "s2"
      }
     ],
     "field": "lokacija"
    },
    "s2": {
     "bot": [
      "Je li ugašena jedna svjetiljka ili cijela ulica?"
     ],
     "options": [
      {
       "label": "Jedna svjetiljka",
       "next": "s3"
      },
      {
       "label": "Cijela ulica",
       "next": "s3"
      }
     ],
     "field": "opseg"
    },
    "s3": {
     "bot": [
      "Želite li obavijest kad prijava bude riješena?"
     ],
     "options": [
      {
       "label": "Da, na e-poštu",
       "next": "s4"
      },
      {
       "label": "Ne treba",
       "next": "s4"
      }
     ],
     "field": "obavijest"
    },
    "s4": {
     "bot": [
      "Prijava je zaprimljena pod brojem KP-2026-119 i proslijeđena komunalnom redaru.",
      "Popravke javne rasvjete u pravilu se rješavaju u nekoliko radnih dana, a o statusu ćemo vas obavijestiti."
     ],
     "event": {
      "row": [
       "KP-2026-119",
       "Neispravna javna rasvjeta",
       "{lokacija}",
       "Novo, proslijeđeno"
      ],
      "inbox": {
       "who": "Građanin",
       "time": "upravo sada",
       "summary": "Prijava neispravne rasvjete s točnom lokacijom. Automatski proslijeđeno komunalnom redaru.",
       "tag": "Komunalna prijava"
      },
      "kpi": {
       "rep": 1,
       "open": 1,
       "q": 1
      },
      "toast": "Nova komunalna prijava zaprimljena i usmjerena nadležnoj službi.",
      "set": {
       "status": "Proslijeđeno komunalnom redaru"
      },
      "actions": [
       "Prijava upisana pod brojem KP-2026-119",
       "Proslijeđena komunalnom redaru",
       "Zabilježen izbor građanina o obavijesti"
      ]
     },
     "end": true
    }
   }
  },
  "features": [
   "Odgovara građanima 0–24 isključivo iz objavljenih odluka, natječaja i obrazaca općine.",
   "Prima komunalne prijave s lokacijom i opisom te ih usmjerava nadležnoj službi.",
   "Rasterećuje centralu i šalteru daje mjesečni pregled najčešćih pitanja."
  ],
  "cta": "Želim ovo za našu općinu",
  "theme": {
   "chrome": "browser",
   "accent": "#1D4E89",
   "soft": "#E8EFF8"
  },
  "when": "Nedjelja, 22:05",
  "site": {
   "url": "opcina-primjerovo.hr",
   "nav": [
    "Općina",
    "Građani",
    "Dokumenti"
   ],
   "tagline": "Službene stranice Općine Primjerovo"
  },
  "record": {
   "title": "Komunalna prijava KP-2026-119",
   "fields": [
    {
     "key": "vrsta",
     "label": "Vrsta"
    },
    {
     "key": "lokacija",
     "label": "Lokacija"
    },
    {
     "key": "opseg",
     "label": "Opseg kvara"
    },
    {
     "key": "obavijest",
     "label": "Obavijest građaninu"
    },
    {
     "key": "status",
     "label": "Status"
    }
   ],
   "initial": {
    "vrsta": "Neispravna javna rasvjeta"
   }
  }
 },
 "en": {
  "pageTitle": "AI assistant for municipalities – demo",
  "title": "AI assistant for municipalities",
  "lead": "The assistant answers citizens from the municipality’s official documents, points them to the right forms and takes reports of local issues, so staff get neatly sorted requests.",
  "business": "Municipality of Primjerovo",
  "assistant": "Municipality of Primjerovo",
  "channel": "Official website",
  "boardSubtitle": "Overview for the administrative office",
  "assistantInitial": "M",
  "kpis": [
   {
    "key": "q",
    "label": "Questions answered this month",
    "value": 412
   },
   {
    "key": "rep",
    "label": "Issue reports",
    "value": 37
   },
   {
    "key": "open",
    "label": "Open reports",
    "value": 9
   },
   {
    "key": "calls",
    "label": "Fewer switchboard calls (%)",
    "value": 28
   }
  ],
  "tableTitle": "Issue reports",
  "columns": [
   "Number",
   "Type",
   "Location",
   "Status"
  ],
  "rows": [
   [
    "KP-2026-118",
    "Street light out",
    "Kralja Tomislava 12",
    "Passed to warden"
   ],
   [
    "KP-2026-117",
    "Damaged road",
    "Cemetery road",
    "In progress"
   ],
   [
    "KP-2026-116",
    "Full waste bin",
    "Square by the school",
    "Resolved"
   ]
  ],
  "inbox": [
   {
    "who": "Citizen",
    "time": "20 min ago",
    "summary": "Asked the deadline for the scholarship call. Assistant quoted the published deadline and linked the form.",
    "tag": "Scholarships"
   },
   {
    "who": "Citizen",
    "time": "this morning",
    "summary": "Asked how to obtain a utility contribution decision. Referred to the office and its opening hours.",
    "tag": "For staff"
   }
  ],
  "automations": [
   {
    "label": "Answer only from published documents",
    "on": true
   },
   {
    "label": "Notify citizens when a report changes status",
    "on": true
   },
   {
    "label": "Route reports to the responsible service",
    "on": true
   },
   {
    "label": "Monthly report of the most common questions",
    "on": true
   }
  ],
  "chat": {
   "opener": "The street lights in our street are not working.",
   "start": "s1",
   "steps": {
    "s1": {
     "bot": [
      "Thank you for reporting it! I will log it and pass it to the utility service.",
      "Which street and house number?"
     ],
     "options": [
      {
       "label": "Ivana Gundulića 7",
       "next": "s2"
      }
     ],
     "field": "lokacija"
    },
    "s2": {
     "bot": [
      "Is it one lamp or the whole street?"
     ],
     "options": [
      {
       "label": "One lamp",
       "next": "s3"
      },
      {
       "label": "The whole street",
       "next": "s3"
      }
     ],
     "field": "opseg"
    },
    "s3": {
     "bot": [
      "Would you like a notification when it is fixed?"
     ],
     "options": [
      {
       "label": "Yes, by email",
       "next": "s4"
      },
      {
       "label": "No thanks",
       "next": "s4"
      }
     ],
     "field": "obavijest"
    },
    "s4": {
     "bot": [
      "Your report is registered as KP-2026-119 and passed to the municipal warden.",
      "Street light repairs are usually handled within a few working days, and we will let you know the status."
     ],
     "event": {
      "row": [
       "KP-2026-119",
       "Faulty street lighting",
       "{lokacija}",
       "New, forwarded"
      ],
      "inbox": {
       "who": "Citizen",
       "time": "just now",
       "summary": "Street light report with exact location. Automatically passed to the municipal warden.",
       "tag": "Issue report"
      },
      "kpi": {
       "rep": 1,
       "open": 1,
       "q": 1
      },
      "toast": "New issue report received and routed to the responsible service.",
      "set": {
       "status": "Forwarded to the municipal warden"
      },
      "actions": [
       "Report logged as KP-2026-119",
       "Forwarded to the municipal warden",
       "Resident’s notification choice recorded"
      ]
     },
     "end": true
    }
   }
  },
  "features": [
   "Answers citizens around the clock, only from the municipality’s published decisions, calls and forms.",
   "Takes issue reports with location and description and routes them to the right service.",
   "Relieves the switchboard and gives a monthly overview of the most common questions."
  ],
  "cta": "I want this for our municipality",
  "theme": {
   "chrome": "browser",
   "accent": "#1D4E89",
   "soft": "#E8EFF8"
  },
  "when": "Sunday, 22:05",
  "site": {
   "url": "opcina-primjerovo.hr",
   "nav": [
    "Municipality",
    "Residents",
    "Documents"
   ],
   "tagline": "Official website of the Municipality of Primjerovo"
  },
  "record": {
   "title": "Municipal report KP-2026-119",
   "fields": [
    {
     "key": "vrsta",
     "label": "Type"
    },
    {
     "key": "lokacija",
     "label": "Location"
    },
    {
     "key": "opseg",
     "label": "Extent"
    },
    {
     "key": "obavijest",
     "label": "Notify the resident"
    },
    {
     "key": "status",
     "label": "Status"
    }
   ],
   "initial": {
    "vrsta": "Faulty street lighting"
   }
  }
 }
};
