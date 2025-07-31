# Board Funktionen: To-Do-Liste

## 🟢 Grundfunktionen (bereits vorhanden)
- [x] Tasks aus Firebase laden und im Board anzeigen
- [x] Drag & Drop für Tasks zwischen Spalten inkl. Status-Update in Firebase
- [x] Task-Suche (live filtering)
- [x] Task-Detail-Overlay öffnen und Task löschen

---

## 🔜 Was noch fehlt / noch nicht fertig ist

### 1. Task anlegen (Add Task)
- [ ] **Neuen Task im Overlay anlegen und in Firebase speichern**  
  - [ ] Alle Formulardaten (Titel, Beschreibung, Datum, Prio, Kategorie, Kontakte, Subtasks) speichern
  - [ ] Nach dem Speichern Overlay schließen und Board aktualisieren
  - [ ] Validierung & Fehlerhinweise für Pflichtfelder
- [ ] **Subtasks anlegen (mit Checkbox "erledigt" beim Task selbst)**

### 2. Tasks bearbeiten (Edit Task)
- [ ] **Bearbeiten-Button im Task-Overlay öffnet Edit-Overlay**  
  - [ ] Richtigen Task im Formular anzeigen
- [ ] **Edit-Formular speichert ALLE Felder**  
  - [ ] Titel, Beschreibung, Datum, Prio, Kategorie  
  - [ ] Kontakte (Assigned To)  
  - [ ] Subtasks (inkl. Status "erledigt/nicht")  
- [ ] Nach Speichern Overlay schließen und Board aktualisieren

### 3. Anzeige & UI
- [ ] **Kontakte (Initialen) auf Task-Card anzeigen**
- [ ] **Prio-Icons auf Task-Card korrekt anzeigen**
- [ ] **Subtasks: Fortschrittsbalken & Anzahl richtig anzeigen**
- [ ] **Fehlermeldungen & UX-Feedback verbessern** (z.B. "Task gespeichert", Fehler beim Speichern)

### 4. Sonstiges
- [ ] **Alle Overlays schließen bei ESC und Klick außerhalb**
- [ ] **Keine doppelten IDs im HTML**
- [ ] **Code überall modular halten, keine Funktionen doppelt**
- [ ] **Leere Spalten mit Platzhaltertext anzeigen ("No tasks here...")**

---

## 🛠️ Technische Pflege
- [ ] **Code cleanup & Kommentare prüfen**
- [ ] **Ladezeiten & Live-Update testen (Firebase OnValue)**
