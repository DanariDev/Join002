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



---
**Idee**
- eigene Pop Up html erstellen mit aussehen von add-task html, wenn man auf Board add task+ drückt, wird auf die pop up html seite verlinkt. Style müssen wir  uns morgen nen Kopf machen.





**Stefan's Testlauf:**

## ✅✅✅✅✅✅✅ Erledigte Aufgaben: ✅✅✅✅✅✅✅✅✅✅✅

## ✅ Keine Aufgaben index.html:

## ✅ Keine Aufgaben register.html:

## ✅ Keine Aufgaben  add-task.html: 

## ✅ Keine Aufgaben  board.html: 


- ✅Hier wird, (warscheinlich aufgrund des derzeitigen fehlers im JS) auch der Responsive Button nicht mehr zurückgesetzt nach dem löschen. 
- edit-contact.js -> ca. Zeile 207

 <- (⁉️Bei mir tretten keine Fehler auf. Das mit dem Button hatte ich auch, aber Fehlermeldungen gab es weder im responsiven noch im normalen Modus beim Löschen (Buttons wurden korrigiert). LF ⁉️ )

Ich konnte auch keinen fehler mehr festellen. Keine ahnung aber ist wohl erledigt. (Stefan)



## ❗❗❗❗❗❗❗ Offene Aufgaben: ❗❗❗❗❗❗❗

## ❗ Offene Aufgaben summary.html: 

- Loadbalken in index einbauen nicht in summary


## ❗ Offene Aufgaben contacts.html:

- Beim öffnen eines kontaktes führt die Animation zu verschiebungen. (Kam noch zu keiner Lösung)


## (❗ Offene? ✅ Keine?) Aufgaben legal.html und privacy-policy.html:

- In beiden seiten ist Die Developer Akedemie noch vertreten. 
(Ich bin mir aber auch nicht sicher wo diese nun abschließend raus soll?)

(⁉️Das mit der Topbar ist erledigt. Das mit "Developer Akedemie" weiß ich auch nicht genau, ob das dableiben soll oder nicht. Können wir ja ggf. bei der Abgabe nachfragen. LF⁉️)


## ❗ Sonstiges ToDo:

- Code modularisieren, doppelte Funktionen entfernen
- Leere Spalten mit Platzhaltertext anzeigen
- Code cleanup & Kommentare verbessern
- Ladezeiten & Live-Update testen