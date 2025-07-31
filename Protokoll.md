# Join Projekt – Board Feature Checkliste

## ✅ Erledigte Aufgaben
- Tasks aus Firebase laden und im Board anzeigen
- Drag & Drop für Tasks
- Task-Suche (live filtering)
- Task-Detail-Overlay öffnen und Task löschen
- Task anlegen (Add Task) mit Formulardaten und Speicherung in Firebase
- Edit-Overlay öffnen und Task-Daten laden
- Kontakte (Initialen) auf Task-Card anzeigen
- Prio-Icons auf Task-Card korrekt anzeigen
- Subtasks: Fortschrittsbalken & Anzahl anzeigen
- Neuen Task im Overlay anlegen und in Firebase speichern
- Bearbeiten-Button im Task-Overlay öffnet Edit-Overlay
- Richtigen Task im Formular anzeigen
- Nach Speichern Overlay schließen und Board aktualisieren
- Keine doppelten IDs im HTML
- Add Task Overlay schließen über Cancel & Hintergrundklick

## ❗ Offene Aufgaben / ToDo
- Validierung & Fehlerhinweise für Pflichtfelder verbessern (User-friendly Fehlermeldungen)
- Subtasks mit Checkbox "erledigt" im Task-Detail-Overlay (statt nur Liste)
- Edit-Formular speichert ALLE Felder (assignedTo fehlt noch)
- Subtasks: Bearbeiten mit Status "erledigt/nicht"
- Fehlermeldungen & UX-Feedback verbessern (Toasts, Inline-Fehler)
- Responsive Design für Mobile weiter verbessern
- Overlays überall schließen bei ESC und Klick außerhalb (Task-Detail: ESC & Outside fehlt)
- Code modularisieren, doppelte Funktionen entfernen
- Leere Spalten mit Platzhaltertext anzeigen
- Code cleanup & Kommentare verbessern
- Ladezeiten & Live-Update testen

---

<<<<<<< HEAD
**Letztes Update:** 30.07.2025
=======
## 🔜 Was noch fehlt / noch nicht fertig ist

### 1. Task anlegen (Add Task)
- [x] **Neuen Task im Overlay anlegen und in Firebase speichern** (`overlay.js`)
  - [x] Alle Formulardaten (Titel, Beschreibung, Datum, Prio, Kategorie, Kontakte, Subtasks) speichern
  - [x] Nach dem Speichern Overlay schließen und Board aktualisieren
- [ ] **Validierung & Fehlerhinweise für Pflichtfelder verbessern**  
  - Current: Basic validation exists for title, due date, and category with an alert (`overlay.js`).
  - To do: Implement user-friendly error messages (e.g., inline error messages below fields instead of alerts) and ensure consistent validation styling (`overlay.css`).
- [ ] **Subtasks mit Checkbox "erledigt" im Task-Detail-Overlay**  
  - Current: Subtasks are displayed as a list without checkboxes (`render-task.js`).
  - To do: Add checkboxes to toggle subtask completion status and update Firebase (`tasks/subtask/completed`).

### 2. Tasks bearbeiten (Edit Task)
- [x] **Bearbeiten-Button im Task-Overlay öffnet Edit-Overlay** (`render-task.js`, `edit-task.js`)
  - [x] Richtigen Task im Formular anzeigen (`edit-task-form.js`, `showEditForm`)
- [ ] **Edit-Formular speichert ALLE Felder**  
  - Current: Saves title, description, due date, priority, category, and subtasks (`edit-task-form.js`).
  - To do: Add saving of `assignedTo` (contacts) to Firebase (`edit-task-contacts.js`, `saveEditedTask`).
- [x] **Nach Speichern Overlay schließen und Board aktualisieren** (`edit-task-form.js`, `saveEditedTask`)
- [ ] **Subtasks: Bearbeiten mit Status "erledigt/nicht"**  
  - Current: Subtasks can be added/edited as text but lack completion status (`edit-task-form.js`).
  - To do: Implement subtask completion status (checkboxes) and save to Firebase.

### 3. Anzeige & UI
- [ ] **Fehlermeldungen & UX-Feedback verbessern**  
  - Current: Alerts are used for errors in `overlay.js` and `edit-task-form.js`.
  - To do: Replace alerts with inline error messages (e.g., below form fields) and add success feedback (e.g., "Task gespeichert") using a toast or modal (`overlay.css`, new JS for toast notifications).
- [ ] **Responsive Design für Mobile verbessern**  
  - Current: Responsive elements exist (e.g., `responsive-show` in `buttons.css`), but mobile usability needs testing.
  - To do: Ensure overlays, forms, and drag-and-drop work smoothly on mobile devices. Adjust `board.html` and `main-content.css` for better mobile layout (e.g., stack columns vertically).

### 4. Sonstiges
- [ ] **Alle Overlays schließen bei ESC und Klick außerhalb**  
  - Current: Add Task overlay closes on outside click and ESC (`overlay.js`). Edit overlay closes on outside click but lacks ESC handling (`edit-task-contacts.js`).
  - To do: Add ESC key handling for Edit and Task Detail overlays (`edit-task.js`, `render-task.js`).
- [x] **Keine doppelten IDs im HTML**  
  - Verified: `board.html` has unique IDs (e.g., `add-task-overlay`, `edit-task-overlay`).
- [ ] **Code überall modular halten, keine Funktionen doppelt**  
  - Current: Some redundancy exists (e.g., `fillEditForm` in `edit-task.js` and `edit-task-form.js`, priority handling in multiple files).
  - To do: Consolidate duplicate functions (e.g., merge `fillEditForm` implementations, centralize priority logic in a shared module).
- [ ] **Leere Spalten mit Platzhaltertext anzeigen ("No tasks here...")**  
  - Current: Columns are cleared but show no placeholder (`load-tasks.js`).
  - To do: Add placeholder text or elements for empty columns (`task-cards.css`, `load-tasks.js`).

---

## 🛠️ Technische Pflege
- [ ] **Code cleanup & Kommentare prüfen**  
  - Current: Code has some comments, but inconsistent documentation and unused code (e.g., `clearEditFieldError` in `edit-task-form.js`).
  - To do: Standardize comments, remove unused functions, and ensure consistent naming (e.g., `taskId` vs. `id`).
- [ ] **Ladezeiten & Live-Update testen (Firebase OnValue)**  
  - Current: `onValue` in `load-tasks.js` and `edit-task-contacts.js` handles live updates.
  - To do: Test performance with large datasets and optimize Firebase queries if needed (e.g., limit data fetching).

---


>>>>>>> b301b9452df25e6fd27a50df3a396c4229cbe602
