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
- Validierung & Fehlerhinweise für Pflichtfelder verbessern (User-friendly Fehlermeldungen)
- Overlays überall schließen bei ESC und Klick außerhalb (Task-Detail: ESC & Outside fehlt)
- Progress Bar leiste wieder einbauen. Diese ist noch vorhanden hat aber noch keine funktionen. Für jede als abgeschlossene subtask muss der balken steigen.
- Im Edit Task fenster im board, fehlt die background farbe der Priority buttons wenn diese ausgewählt wurden.
- Der Name bei der begrüßung wird zeitversetzt mit dem begrüßungstext angezeigt.
  idee: Lässt sich warscheinlich mit opacity schön lösen, wenn der name langsam eingeblendet wird statt zu "ploppen". 
  - greetings.js -> ca. Zeile 23
  - Die angezeigten Zahlen stimmen nicht ganz mit dem Stand der tatsächlich Task's im Board überein (Await feedback wird nicht richtig aktualisiert.) 
- task.counter.js -> ca. Zeile 21
- Die subtask müssen im Edit Task und bei Add-Task icons erhalten und darüber auch löschbar sein.
- Beim öffnen eines kontaktes führt die Animation zu verschiebungen. (Kam noch zu keiner Lösung)


---
**Idee**
- eigene Pop Up html erstellen mit aussehen von add-task html, wenn man auf Board add task+ drückt, wird auf die pop up html seite verlinkt. Style müssen wir  uns morgen nen Kopf machen.





**Stefan's Testlauf:**

## ✅✅✅✅✅✅✅ Erledigte Aufgaben: ✅✅✅✅✅✅✅✅✅✅✅

## ✅ Keine Aufgaben index.html:

## ✅ Keine Aufgaben register.html:

## ✅ Keine Aufgaben  add-task.html: 

## ✅ Keine Aufgaben  board.html: 






## ❗ Sonstiges ToDo:

- Ladezeiten & Live-Update testen
- render-task.js umfasst durch die Dokumentation über 400 Zeilen (ob das relevant sein wird, weiß ich nicht).