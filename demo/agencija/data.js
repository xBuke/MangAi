/* Generirano iz scripts/demo-content.py */
window.MANGAI_DEMO = {
 "hr": {
  "pageTitle": "AI asistent za marketinške agencije – demo",
  "title": "AI asistent za marketinške agencije",
  "lead": "Asistent pod vašim brendom kvalificira nove klijente, prikuplja brief i zakazuje uvodni sastanak, a tim dobiva sažetak s budžetom i ciljevima.",
  "business": "Studio Val",
  "assistant": "Studio Val",
  "channel": "Web stranica",
  "boardSubtitle": "Nadzorna ploča, ovaj mjesec",
  "kpis": [
   {
    "key": "lead",
    "label": "Novi upiti",
    "value": 19
   },
   {
    "key": "qual",
    "label": "Kvalificirani",
    "value": 11
   },
   {
    "key": "meet",
    "label": "Zakazani sastanci",
    "value": 6
   },
   {
    "key": "reply",
    "label": "Odgovoreno u 24 h (%)",
    "value": 100
   }
  ],
  "tableTitle": "Novi klijenti",
  "columns": [
   "Tvrtka",
   "Usluga",
   "Budžet",
   "Sljedeći korak"
  ],
  "rows": [
   [
    "Pekara Zrno",
    "Društvene mreže",
    "800 €/mj",
    "Sastanak u utorak"
   ],
   [
    "Hotel Mirna",
    "Kampanja za sezonu",
    "6.000 €",
    "Poslana ponuda"
   ]
  ],
  "inbox": [
   {
    "who": "Konoba Gušt",
    "time": "prije 4 h",
    "summary": "Traži novi logo i jelovnik. Budžet ispod minimuma; asistent poslao paket za male tvrtke.",
    "tag": "Mali budžet"
   },
   {
    "who": "Agro d.o.o.",
    "time": "jučer",
    "summary": "Postojeći klijent pita za izvještaj kampanje. Asistent poslao link na izvještaj.",
    "tag": "Postojeći klijent"
   }
  ],
  "automations": [
   {
    "label": "Kvalifikacija po budžetu i roku",
    "on": true
   },
   {
    "label": "Brief upitnik prije sastanka",
    "on": true
   },
   {
    "label": "Sinkronizacija s CRM-om",
    "on": true
   },
   {
    "label": "Tjedni izvještaj klijentima",
    "on": false
   }
  ],
  "chat": {
   "opener": "Trebamo pomoć oko Instagrama za naš restoran.",
   "start": "s1",
   "steps": {
    "s1": {
     "bot": [
      "Rado! Da vas spojim s pravom osobom, imam dva kratka pitanja.",
      "Koji je okvirni mjesečni budžet?"
     ],
     "options": [
      {
       "label": "Do 500 €",
       "next": "s2"
      },
      {
       "label": "500 – 1.500 €",
       "next": "s2"
      },
      {
       "label": "Više od 1.500 €",
       "next": "s2"
      }
     ]
    },
    "s2": {
     "bot": [
      "Hvala. Što vam je najvažnije u sljedeća 3 mjeseca?"
     ],
     "options": [
      {
       "label": "Više rezervacija",
       "next": "s3"
      },
      {
       "label": "Prepoznatljivost",
       "next": "s3"
      }
     ]
    },
    "s3": {
     "bot": [
      "Imamo slobodan termin za uvodni poziv u srijedu u 10:00. Odgovara li?"
     ],
     "options": [
      {
       "label": "Da",
       "next": "s4"
      },
      {
       "label": "Neki drugi dan",
       "next": "s4"
      }
     ]
    },
    "s4": {
     "bot": [
      "Dogovoreno. Poslat ću vam kratki upitnik o restoranu, da sastanak bude koristan od prve minute."
     ],
     "event": {
      "row": [
       "Novi restoran",
       "Instagram",
       "Prema odabiru",
       "Uvodni poziv"
      ],
      "inbox": {
       "who": "Novi restoran",
       "time": "upravo sada",
       "summary": "Instagram za restoran, cilj više rezervacija. Uvodni poziv zakazan, poslan upitnik.",
       "tag": "Kvalificiran"
      },
      "kpi": {
       "lead": 1,
       "qual": 1,
       "meet": 1
      },
      "toast": "Novi kvalificirani klijent i uvodni poziv u kalendaru."
     },
     "end": true
    }
   }
  },
  "features": [
   "Odgovara posjetiteljima vaše stranice pod vašim imenom i tonom.",
   "Kvalificira upite po budžetu, roku i cilju prije nego što potrošite vrijeme na poziv.",
   "Šalje brief upitnik i upisuje klijenta u CRM."
  ],
  "cta": "Želim ovo za svoju agenciju"
 },
 "en": {
  "pageTitle": "AI assistant for marketing agencies – demo",
  "title": "AI assistant for marketing agencies",
  "lead": "Under your brand, the assistant qualifies new clients, collects the brief and books an intro call, so the team gets a summary with budget and goals.",
  "business": "Studio Val",
  "assistant": "Studio Val",
  "channel": "Website",
  "boardSubtitle": "Dashboard, this month",
  "kpis": [
   {
    "key": "lead",
    "label": "New enquiries",
    "value": 19
   },
   {
    "key": "qual",
    "label": "Qualified",
    "value": 11
   },
   {
    "key": "meet",
    "label": "Calls booked",
    "value": 6
   },
   {
    "key": "reply",
    "label": "Answered within 24 h (%)",
    "value": 100
   }
  ],
  "tableTitle": "New clients",
  "columns": [
   "Company",
   "Service",
   "Budget",
   "Next step"
  ],
  "rows": [
   [
    "Zrno Bakery",
    "Social media",
    "€800/mo",
    "Call on Tuesday"
   ],
   [
    "Hotel Mirna",
    "Season campaign",
    "€6,000",
    "Quote sent"
   ]
  ],
  "inbox": [
   {
    "who": "Konoba Gušt",
    "time": "4 h ago",
    "summary": "Wants a new logo and menu. Budget below minimum; small-business package sent.",
    "tag": "Small budget"
   },
   {
    "who": "Agro Ltd",
    "time": "yesterday",
    "summary": "Existing client asking for the campaign report. Link to the report sent.",
    "tag": "Existing client"
   }
  ],
  "automations": [
   {
    "label": "Qualify by budget and timing",
    "on": true
   },
   {
    "label": "Brief questionnaire before the call",
    "on": true
   },
   {
    "label": "CRM sync",
    "on": true
   },
   {
    "label": "Weekly client report",
    "on": false
   }
  ],
  "chat": {
   "opener": "We need help with Instagram for our restaurant.",
   "start": "s1",
   "steps": {
    "s1": {
     "bot": [
      "Happy to help! Two quick questions so I can connect you with the right person.",
      "What is your rough monthly budget?"
     ],
     "options": [
      {
       "label": "Up to €500",
       "next": "s2"
      },
      {
       "label": "€500 – 1,500",
       "next": "s2"
      },
      {
       "label": "Over €1,500",
       "next": "s2"
      }
     ]
    },
    "s2": {
     "bot": [
      "Thanks. What matters most in the next 3 months?"
     ],
     "options": [
      {
       "label": "More bookings",
       "next": "s3"
      },
      {
       "label": "Brand awareness",
       "next": "s3"
      }
     ]
    },
    "s3": {
     "bot": [
      "We have a free slot for an intro call on Wednesday at 10:00. Does that work?"
     ],
     "options": [
      {
       "label": "Yes",
       "next": "s4"
      },
      {
       "label": "Another day",
       "next": "s4"
      }
     ]
    },
    "s4": {
     "bot": [
      "Agreed. I will send you a short questionnaire about the restaurant so the call is useful from the first minute."
     ],
     "event": {
      "row": [
       "New restaurant",
       "Instagram",
       "As chosen",
       "Intro call"
      ],
      "inbox": {
       "who": "New restaurant",
       "time": "just now",
       "summary": "Instagram for a restaurant, goal more bookings. Intro call booked, questionnaire sent.",
       "tag": "Qualified"
      },
      "kpi": {
       "lead": 1,
       "qual": 1,
       "meet": 1
      },
      "toast": "New qualified client and intro call in the calendar."
     },
     "end": true
    }
   }
  },
  "features": [
   "Answers visitors to your site in your name and tone.",
   "Qualifies enquiries by budget, timing and goal before you spend time on a call.",
   "Sends a brief questionnaire and records the client in your CRM."
  ],
  "cta": "I want this for my agency"
 }
};
