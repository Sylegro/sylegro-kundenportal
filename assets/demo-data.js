// Sylegro Kundenportal – Demo-/Testkunden
// WICHTIG: Reine Platzhalterdaten für den Prototyp. Keine echten Kunden,
// Verträge oder Rechnungen. Die "Passwörter" liegen hier im Klartext im
// Frontend-Code, weil es (noch) keinen echten Server/keine Datenbank gibt.
// Für echte Kundendaten braucht es zwingend ein richtiges Backend
// (siehe Hinweis "Sicherheit" in der README).

const SYLEGRO_DEMO_CUSTOMERS = [
  {
    id: "muster-gmbh",
    firma: "Muster GmbH",
    username: "uhr-muster",
    password: "demo2026",
    services: ["uhr"], // Unterhaltsreinigung
    objekt: "Musterstrasse 12, 8000 Zürich",
    vertraege: [
      { nr: "V-2024-004", titel: "Unterhaltsreinigung Musterstrasse 12", start: "01.01.2024", laufzeit: "3 Jahre, jährlich kündbar" }
    ],
    rechnungen: [
      { nr: "R-2026-118", datum: "01.09.2026", betrag: "CHF 1'240.00", status: "offen" },
      { nr: "R-2026-096", datum: "01.08.2026", betrag: "CHF 1'240.00", status: "bezahlt" }
    ]
  },
  {
    id: "beispiel-ag",
    firma: "Beispiel AG",
    username: "spez-beispiel",
    password: "demo2026",
    services: ["spezial"], // Spezialreinigung
    objekt: "Industriestrasse 7, 8952 Schlieren",
    vertraege: [
      { nr: "V-2026-021", titel: "Rahmenvertrag Spezialreinigung nach Bedarf", start: "15.03.2026", laufzeit: "Unbefristet" }
    ],
    rechnungen: [
      { nr: "R-2026-102", datum: "20.08.2026", betrag: "CHF 3'480.00", status: "offen" }
    ]
  },
  {
    id: "wohnbau-muster",
    firma: "Wohnbau Muster Verwaltung AG",
    username: "hw-wohnbau",
    password: "demo2026",
    services: ["hauswartung"], // Hauswartung
    objekt: "Bahnhofstrasse 4, 8400 Winterthur",
    vertraege: [
      { nr: "V-2023-011", titel: "Hauswartung Bahnhofstrasse 4", start: "01.04.2023", laufzeit: "5 Jahre" }
    ],
    rechnungen: [
      { nr: "R-2026-090", datum: "01.09.2026", betrag: "CHF 890.00", status: "offen" },
      { nr: "R-2026-078", datum: "01.08.2026", betrag: "CHF 890.00", status: "bezahlt" }
    ]
  }
];
