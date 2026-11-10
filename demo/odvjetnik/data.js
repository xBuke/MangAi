/* Generirano iz scripts/demo-content.py */
window.MANGAI_DEMO = {
 "hr": {
  "pageTitle": "AI asistent za odvjetničke urede – demo",
  "title": "AI asistent za odvjetničke urede",
  "lead": "Asistent prikuplja osnovne podatke o predmetu prije konzultacija, provjerava rokove koje je stranka navela i zakazuje termin, a odvjetnik dobiva sažetak prije prvog razgovora.",
  "business": "Ured Perić",
  "assistant": "Odvjetnički ured Perić",
  "channel": "Web stranica",
  "boardSubtitle": "Nadzorna ploča, ovaj tjedan",
  "kpis": [
   {
    "key": "q",
    "label": "Novi upiti",
    "value": 9
   },
   {
    "key": "cons",
    "label": "Zakazane konzultacije",
    "value": 5
   },
   {
    "key": "urgent",
    "label": "Upiti s rokom do 8 dana",
    "value": 2
   },
   {
    "key": "time",
    "label": "Ušteđeni sati unosa",
    "value": 6
   }
  ],
  "tableTitle": "Konzultacije",
  "columns": [
   "Stranka",
   "Područje",
   "Termin",
   "Napomena"
  ],
  "rows": [
   [
    "Josip K.",
    "Radno pravo",
    "Sutra 9:00",
    "Otkaz uručen prije 5 dana"
   ],
   [
    "D. d.o.o.",
    "Trgovački ugovori",
    "Petak 13:00",
    "Pregled ugovora o najmu"
   ]
  ],
  "inbox": [
   {
    "who": "Martina G.",
    "time": "prije 3 h",
    "summary": "Nasljeđivanje nekretnine, troje nasljednika. Prikupljeni podaci i popis dokumenata za donijeti.",
    "tag": "Nasljedno pravo"
   },
   {
    "who": "Anonimno",
    "time": "jučer",
    "summary": "Pitanje izvan djelokruga ureda (kazneno pravo). Asistent ljubazno uputio na Hrvatsku odvjetničku komoru.",
    "tag": "Upućeno dalje"
   }
  ],
  "automations": [
   {
    "label": "Sažetak predmeta prije konzultacija",
    "on": true
   },
   {
    "label": "Upozorenje kad stranka navede kratak rok",
    "on": true
   },
   {
    "label": "Popis dokumenata koje stranka treba donijeti",
    "on": true
   },
   {
    "label": "Podsjetnik dan prije konzultacija",
    "on": false
   }
  ],
  "chat": {
   "opener": "Dobio sam otkaz, trebam savjet.",
   "start": "s1",
   "steps": {
    "s1": {
     "bot": [
      "Žao mi je zbog toga. Mogu prikupiti osnovne podatke i dogovoriti konzultacije s odvjetnicom.",
      "Napomena: ovo nije pravni savjet.",
      "Kada vam je otkaz uručen?"
     ],
     "options": [
      {
       "label": "Prije manje od 8 dana",
       "next": "s2"
      },
      {
       "label": "Prije više od 8 dana",
       "next": "s2"
      }
     ]
    },
    "s2": {
     "bot": [
      "Hvala, to je važno zbog rokova. Je li otkaz pisani i imate li ugovor o radu?"
     ],
     "options": [
      {
       "label": "Imam oboje",
       "next": "s3"
      },
      {
       "label": "Samo otkaz",
       "next": "s3"
      }
     ]
    },
    "s3": {
     "bot": [
      "Mogu vas naručiti na konzultacije sutra u 11:00 ili u četvrtak u 15:00."
     ],
     "options": [
      {
       "label": "Sutra 11:00",
       "next": "s4"
      },
      {
       "label": "Četvrtak 15:00",
       "next": "s4"
      }
     ]
    },
    "s4": {
     "bot": [
      "Termin je rezerviran. Ponesite otkaz, ugovor o radu i zadnje tri platne liste.",
      "Odvjetnica će prije razgovora dobiti sažetak vašeg slučaja."
     ],
     "event": {
      "row": [
       "Nova stranka",
       "Radno pravo",
       "Odabrani termin",
       "Rok može biti kratak, provjeriti"
      ],
      "inbox": {
       "who": "Nova stranka",
       "time": "upravo sada",
       "summary": "Otkaz ugovora o radu, ima pisani otkaz i ugovor. Konzultacije zakazane, stranka upućena što donijeti.",
       "tag": "Radno pravo"
      },
      "kpi": {
       "q": 1,
       "cons": 1,
       "urgent": 1
      },
      "toast": "Nove konzultacije zakazane; označen mogući kratak rok."
     },
     "end": true
    }
   }
  },
  "features": [
   "Prikuplja osnovne podatke o predmetu i dokumentima prije prvog razgovora.",
   "Označava upite s kratkim rokovima da ih ured vidi odmah.",
   "Ne daje pravne savjete; upite izvan djelokruga ljubazno upućuje dalje."
  ],
  "cta": "Želim ovo za svoj ured"
 },
 "en": {
  "pageTitle": "AI assistant for law offices – demo",
  "title": "AI assistant for law offices",
  "lead": "The assistant collects the basics of a matter before a consultation, flags deadlines the client mentions and books the meeting, so the lawyer gets a summary in advance.",
  "business": "Perić Law",
  "assistant": "Perić Law Office",
  "channel": "Website",
  "boardSubtitle": "Dashboard, this week",
  "kpis": [
   {
    "key": "q",
    "label": "New enquiries",
    "value": 9
   },
   {
    "key": "cons",
    "label": "Consultations booked",
    "value": 5
   },
   {
    "key": "urgent",
    "label": "Enquiries with deadline under 8 days",
    "value": 2
   },
   {
    "key": "time",
    "label": "Admin hours saved",
    "value": 6
   }
  ],
  "tableTitle": "Consultations",
  "columns": [
   "Client",
   "Area",
   "Time",
   "Note"
  ],
  "rows": [
   [
    "Josip K.",
    "Employment",
    "Tomorrow 9:00",
    "Dismissal served 5 days ago"
   ],
   [
    "D. Ltd",
    "Commercial contracts",
    "Friday 13:00",
    "Lease agreement review"
   ]
  ],
  "inbox": [
   {
    "who": "Martina G.",
    "time": "3 h ago",
    "summary": "Inheritance of property, three heirs. Details collected and list of documents to bring sent.",
    "tag": "Inheritance"
   },
   {
    "who": "Anonymous",
    "time": "yesterday",
    "summary": "Question outside the office’s practice (criminal law). Politely referred to the Croatian Bar Association.",
    "tag": "Referred"
   }
  ],
  "automations": [
   {
    "label": "Matter summary before consultations",
    "on": true
   },
   {
    "label": "Alert when a client mentions a short deadline",
    "on": true
   },
   {
    "label": "List of documents to bring",
    "on": true
   },
   {
    "label": "Reminder the day before",
    "on": false
   }
  ],
  "chat": {
   "opener": "I have been dismissed from my job and need advice.",
   "start": "s1",
   "steps": {
    "s1": {
     "bot": [
      "I am sorry to hear that. I can collect the basics and arrange a consultation with the lawyer.",
      "Note: this is not legal advice.",
      "When was the dismissal served?"
     ],
     "options": [
      {
       "label": "Less than 8 days ago",
       "next": "s2"
      },
      {
       "label": "More than 8 days ago",
       "next": "s2"
      }
     ]
    },
    "s2": {
     "bot": [
      "Thank you, that matters for deadlines. Is the dismissal in writing, and do you have your employment contract?"
     ],
     "options": [
      {
       "label": "I have both",
       "next": "s3"
      },
      {
       "label": "Only the dismissal",
       "next": "s3"
      }
     ]
    },
    "s3": {
     "bot": [
      "I can book a consultation tomorrow at 11:00 or Thursday at 15:00."
     ],
     "options": [
      {
       "label": "Tomorrow 11:00",
       "next": "s4"
      },
      {
       "label": "Thursday 15:00",
       "next": "s4"
      }
     ]
    },
    "s4": {
     "bot": [
      "Booked. Please bring the dismissal, your contract and your last three payslips.",
      "The lawyer will receive a summary of your case before the meeting."
     ],
     "event": {
      "row": [
       "New client",
       "Employment",
       "Chosen time",
       "Deadline may be short, check"
      ],
      "inbox": {
       "who": "New client",
       "time": "just now",
       "summary": "Employment dismissal, has written notice and contract. Consultation booked, told what to bring.",
       "tag": "Employment"
      },
      "kpi": {
       "q": 1,
       "cons": 1,
       "urgent": 1
      },
      "toast": "New consultation booked; possible short deadline flagged."
     },
     "end": true
    }
   }
  },
  "features": [
   "Collects the basics of a matter and its documents before the first meeting.",
   "Flags enquiries with short deadlines so the office sees them at once.",
   "Gives no legal advice; out-of-scope questions are politely referred elsewhere."
  ],
  "cta": "I want this for my office"
 }
};
