/* Generirano iz scripts/demo-content.py */
window.MANGAI_DEMO = {
 "hr": {
  "pageTitle": "AI asistent za ordinacije i klinike – demo",
  "title": "AI asistent za ordinacije i klinike",
  "lead": "Asistent odgovara na česta pitanja pacijenata, prima zahtjeve za termin i šalje upute prije pregleda, a hitne slučajeve odmah upućuje na telefon ili 112.",
  "business": "Poliklinika Mare",
  "assistant": "Poliklinika Mare",
  "channel": "Web stranica",
  "boardSubtitle": "Nadzorna ploča, danas",
  "kpis": [
   {
    "key": "req",
    "label": "Zahtjevi za termin",
    "value": 28
   },
   {
    "key": "booked",
    "label": "Naručeni pacijenti",
    "value": 42
   },
   {
    "key": "calls",
    "label": "Poziva manje nego prošli mjesec",
    "value": 31
   },
   {
    "key": "noshow",
    "label": "Nedolasci",
    "value": 3
   }
  ],
  "tableTitle": "Zahtjevi za termin",
  "columns": [
   "Pacijent",
   "Vrsta pregleda",
   "Željeni termin",
   "Status"
  ],
  "rows": [
   [
    "Ivan R.",
    "Kontrola tlaka",
    "Ponedjeljak ujutro",
    "Naručen"
   ],
   [
    "Ema S.",
    "Dermatološki pregled",
    "Što prije",
    "Čeka potvrdu"
   ]
  ],
  "inbox": [
   {
    "who": "Zdenka M.",
    "time": "prije 30 min",
    "summary": "Pitala treba li natašte za vađenje krvi. Asistent poslao upute za pripremu.",
    "tag": "Upute"
   },
   {
    "who": "Anonimno",
    "time": "jutros",
    "summary": "Opisala jaku bol u prsima. Asistent odmah uputio na 112 i nije nastavio razgovor.",
    "tag": "Hitno, upućeno na 112"
   }
  ],
  "automations": [
   {
    "label": "Podsjetnik dan prije pregleda",
    "on": true
   },
   {
    "label": "Slanje uputa za pripremu nakon narudžbe",
    "on": true
   },
   {
    "label": "Upućivanje hitnih slučajeva na 112",
    "on": true
   },
   {
    "label": "Anketa zadovoljstva nakon pregleda",
    "on": false
   }
  ],
  "chat": {
   "opener": "Kako se mogu naručiti na vađenje krvi?",
   "start": "s1",
   "steps": {
    "s1": {
     "bot": [
      "Dobar dan! Vađenje krvi radimo radnim danom od 7 do 10 sati, uz prethodnu najavu.",
      "Imate li uputnicu ili dolazite privatno?"
     ],
     "options": [
      {
       "label": "Imam uputnicu",
       "next": "s2"
      },
      {
       "label": "Privatno",
       "next": "s2"
      }
     ]
    },
    "s2": {
     "bot": [
      "U redu. Koji dan vam odgovara?"
     ],
     "options": [
      {
       "label": "Utorak",
       "next": "s3"
      },
      {
       "label": "Srijeda",
       "next": "s3"
      },
      {
       "label": "Petak",
       "next": "s3"
      }
     ]
    },
    "s3": {
     "bot": [
      "Zahtjev je zaprimljen za 7:30. Sestra će ga potvrditi do kraja dana.",
      "Važno: dođite natašte, bez hrane 12 sati prije. Vodu smijete piti.",
      "Ovaj asistent ne daje medicinske savjete. Kod hitnih stanja nazovite 112."
     ],
     "event": {
      "row": [
       "Novi pacijent",
       "Vađenje krvi",
       "Odabrani dan 7:30",
       "Čeka potvrdu"
      ],
      "inbox": {
       "who": "Novi pacijent",
       "time": "upravo sada",
       "summary": "Zahtjev za vađenje krvi uz uputnicu. Poslane upute za pripremu natašte.",
       "tag": "Novi termin"
      },
      "kpi": {
       "req": 1
      },
      "toast": "Novi zahtjev čeka potvrdu sestre."
     },
     "end": true
    }
   }
  },
  "features": [
   "Odgovara na pitanja o radnom vremenu, uputnicama, cijenama i pripremi za pregled.",
   "Prima zahtjeve za termin, a osoblje ih potvrđuje jednim klikom.",
   "Ne daje dijagnoze; hitne slučajeve odmah upućuje na 112 ili telefon ordinacije."
  ],
  "cta": "Želim ovo za svoju ordinaciju"
 },
 "en": {
  "pageTitle": "AI assistant for clinics – demo",
  "title": "AI assistant for clinics",
  "lead": "The assistant answers common patient questions, takes appointment requests and sends preparation instructions, and immediately refers emergencies to 112 or the phone.",
  "business": "Mare Clinic",
  "assistant": "Mare Clinic",
  "channel": "Website",
  "boardSubtitle": "Dashboard, today",
  "kpis": [
   {
    "key": "req",
    "label": "Appointment requests",
    "value": 28
   },
   {
    "key": "booked",
    "label": "Patients booked",
    "value": 42
   },
   {
    "key": "calls",
    "label": "Fewer calls than last month",
    "value": 31
   },
   {
    "key": "noshow",
    "label": "No-shows",
    "value": 3
   }
  ],
  "tableTitle": "Appointment requests",
  "columns": [
   "Patient",
   "Type",
   "Preferred time",
   "Status"
  ],
  "rows": [
   [
    "Ivan R.",
    "Blood pressure check",
    "Monday morning",
    "Booked"
   ],
   [
    "Ema S.",
    "Dermatology check",
    "As soon as possible",
    "Awaiting confirmation"
   ]
  ],
  "inbox": [
   {
    "who": "Zdenka M.",
    "time": "30 min ago",
    "summary": "Asked whether fasting is needed for a blood test. Preparation instructions sent.",
    "tag": "Instructions"
   },
   {
    "who": "Anonymous",
    "time": "this morning",
    "summary": "Described severe chest pain. Assistant immediately referred to 112 and did not continue.",
    "tag": "Urgent, referred to 112"
   }
  ],
  "automations": [
   {
    "label": "Reminder the day before",
    "on": true
   },
   {
    "label": "Preparation instructions after booking",
    "on": true
   },
   {
    "label": "Refer emergencies to 112",
    "on": true
   },
   {
    "label": "Satisfaction survey after the visit",
    "on": false
   }
  ],
  "chat": {
   "opener": "How can I book a blood test?",
   "start": "s1",
   "steps": {
    "s1": {
     "bot": [
      "Hello! Blood tests are done on weekdays from 7 to 10 am, by appointment.",
      "Do you have a referral or are you coming privately?"
     ],
     "options": [
      {
       "label": "I have a referral",
       "next": "s2"
      },
      {
       "label": "Privately",
       "next": "s2"
      }
     ]
    },
    "s2": {
     "bot": [
      "Fine. Which day suits you?"
     ],
     "options": [
      {
       "label": "Tuesday",
       "next": "s3"
      },
      {
       "label": "Wednesday",
       "next": "s3"
      },
      {
       "label": "Friday",
       "next": "s3"
      }
     ]
    },
    "s3": {
     "bot": [
      "Your request for 7:30 is received. A nurse will confirm it by the end of the day.",
      "Important: come fasting, no food for 12 hours before. Water is fine.",
      "This assistant does not give medical advice. In an emergency, call 112."
     ],
     "event": {
      "row": [
       "New patient",
       "Blood test",
       "Chosen day 7:30",
       "Awaiting confirmation"
      ],
      "inbox": {
       "who": "New patient",
       "time": "just now",
       "summary": "Blood test request with referral. Fasting instructions sent.",
       "tag": "New appointment"
      },
      "kpi": {
       "req": 1
      },
      "toast": "A new request is waiting for the nurse to confirm."
     },
     "end": true
    }
   }
  },
  "features": [
   "Answers questions about hours, referrals, prices and preparation.",
   "Takes appointment requests that staff confirm with one click.",
   "Gives no diagnoses; emergencies are referred to 112 or the clinic phone."
  ],
  "cta": "I want this for my clinic"
 }
};
