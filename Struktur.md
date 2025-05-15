Projekt Join - Struktur
1. Startseite

Login
Benutzername/Passwort
Gastzugang


Sign-up
Registrierungsformular


Authentifizierung

2. Summary

Übersicht (Gast/Registriert)
Navigation
Board
Add Task
Contacts
Help



3. Hauptfunktionen

Board
Ansicht
Tasks anzeigen/hinzufügen/löschen


Add Task
Formular
Speicherung


Contacts
Übersicht
Hinzufügen/Bearbeiten



4. Overlays

Task Edit
Contact Edit

5. Statische Seiten

Privacy Policy
Legal Notice
Help

6. Mobile

Startseite
Summary
Hauptfunktionen
Overlays
Statische Seiten

7. Team

P1: Auth/Summary
P2: Board
P3: Add Task
P4: Contacts

8. Zeitplan

Woche 1: Login/Summary
Woche 2-3: Hauptfunktionen
Woche 4: Overlays
Woche 5: Statische Seiten
Woche 6: Mobile

JOIN/
├── index.html                    ← Login
├── register.html                 ← Registrierung
├── summary.html                 ← Dashboard (Begrüßung + Übersicht)
├── board.html                    ← Kanban-Board (ToDo, Done etc.)
├── add-task.html                 ← Aufgabe hinzufügen
├── contacts.html                 ← Kontaktübersicht
├── legal.html                    ← Impressum & Datenschutz

├── css/
│   ├── global.css                ← Basiseinstellungen, Variablen, Reset
│   ├── layout.css                ← Layouts wie Header, Sidebar, etc.
│   ├── login.css                 ← Nur für Login/Register
│   ├── board.css                 ← Nur fürs Board
│   ├── contacts.css              ← Für die Kontaktansicht
│   └── overlays.css              ← Für Add/Edit-Overlays

├── js/
│   ├── firebase-config.js        ← Firebase Initialisierung
│   ├── auth.js                   ← Login/Logout, Guest, Sessioncheck
│   ├── board.js                  ← Board-Funktionalität (Drag & Drop, Taskload)
│   ├── task-form.js              ← Add-Task & Edit-Task Overlay
│   ├── contacts.js               ← Kontakte verwalten (CRUD)
│   └── utils.js                  ← Hilfsfunktionen (z.B. Zeitformatierung, ID gen)

├── templates/
│   ├── sidebar.html              ← Wiederverwendbare Sidebar
│   ├── header.html               ← Optional: Header mit Userinfo
│   └── task-card.html            ← HTML-Vorlage für eine Task-Karte

├── assets/
│   ├── img/
│   │   └── logo.svg              ← Logos, Icons, Avatare
│   └── fonts/                    ← Falls eigene Schriftarten

├── data/
│   └── sample-data.js            ← Dummy-Daten für Tests (Tasks, Contacts)

└── README.md                     ← Kurze Projektbeschreibung (optional)
