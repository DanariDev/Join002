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


## ❗ Offene Aufgaben / ToDo

- Code modularisieren, doppelte Funktionen entfernen
- Leere Spalten mit Platzhaltertext anzeigen
- Code cleanup & Kommentare verbessern
- Ladezeiten & Live-Update testen

---
**Idee**
- eigene Pop Up html erstellen mit aussehen von add-task html, wenn man auf Board add task+ drückt, wird auf die pop up html seite verlinkt. Style müssen wir  uns morgen nen Kopf machen.



**Stefan's Testlauf:**

Ich habe hier ein ersten Testlauf gemacht um alles auf Herz und Nieren zu Prüfen.
Style anpassungen und kleinere fixes wrden im Teslauf gleich korrigiert.
Alle übrigen Auffälligkeiten wurden im Protokoll festgehalten.

Wir Sind gut dabei, fehlt nicht mehr viel 👍

Ich habe "versucht", als hilfestellung die ungefähre Position der fehlerquelle einzuschränken.
- (siehe: beispiel.js -> ca. Zeile xx)

## ✅ Keine Aufgaben index.html:

## ✅ Keine Aufgaben register.html:

## ❗ Offene Aufgaben summary.html: 
 



## ❗ Summary:

- Loadblaken in index einbauen nicht in sumamry

 
## ❗ Offene Aufgaben add-task.html: 
- Style anpassungen im Formular: 
Unter der rubrik "Assigned To:", müssen die checkboxen wie im board gestylt werden.
Hier müssen auch die kontakte wenn sie ausgewählt werden, die hintergrundfarbe wie beim hovern beibehalten.

(Das übernehme ich morgen selber 👍)


## ❗ Offene Aufgaben board.html: 
 - ✅Der hintergrund sollte nicht scrollbar sein sobald man im layout eine Task öffnet oder Editiert.
 - ✅render-task.js -> ca. Zeile 89

✅idee: das könnte mit html "overflow: none;" über javascript verknüpft werden (vermute ich). Dann müsste allerdings das ganze beim der function zum schließen wieder auf ✅"overflow: auto;" zurück.


- ✅Der Add-Task Button, unserer Grid colum's (to Do, In Progress usw.) versucht im responsive Layout noch ein Add-Task Formular zu öffnen, wie in unserer Desktop ansicht. 
- ✅board-add-task-overlay.js -> ca. Zeile 32

✅(Hier sollte es genauso gelöst werden wie wir es mit dem Großen Add-Task Button taten. Wenn Responsive, weiterleitung zu Add-Task.html.)


- Im Edit Task fenster: 
- - Es kann ein Datum aus der vergangenheit gewählt werden.
- - Fehlermeldungen kommen hier noch über das Html anstatt unsere "error-massage".
- - Assigned-To fehlt es an hover farben und checkbox styling.(Übernehme ich selber 👍)
- - Category Feld ist im Design überlagert.(Übernehme ich selber 👍)


## ❗ Offene Aufgaben contacts.html:
- ✅Nur im Responsive Layout: Wird im Responsive Layout ein geöffneter Kontakt gelöscht, wird hier eine Custom-Fehlermeldung und Fehlermeldungen in der Konsole angezeigt.
- ✅Hier wird, (warscheinlich aufgrund des derzeitigen fehlers im JS) auch der Responsive Button nicht mehr zurückgesetzt nach dem löschen. 
- edit-contact.js -> ca. Zeile 207 <- (⁉️Bei mir tretten keine Fehler auf. Das mit dem Button hatte ich auch, aber Fehlermeldungen gab es weder im responsiven noch im normalen Modus beim Löschen (Buttons wurden korrigiert). LF ⁉️ )

- Beim öffnen eines kontaktes führt die Animation zu verschiebungen. (Kam noch zu keiner Lösung)

## (❗ Offene? ✅ Keine?) Aufgaben legal.html und privacy-policy.html:

-✅ Wenn man als NICHT Angemeldeter User die privacy-policy.html oder Legal-notice.html besucht, wird die topbar kurz sichtbar. Ähnlich wie bei der Sidebar zuvor.
(Da wird er sonst nur wieder sein "Langsames Internet Trick" -ding auspacken können. :D)

- In beiden seiten ist Die Developer Akedemie noch vertreten. 
(Ich bin mir aber auch nicht sicher wo diese nun abschließend raus soll?)

(⁉️Das mit der Topbar ist erledigt. Das mit "Developer Akedemie" weiß ich auch nicht genau, ob das dableiben soll oder nicht. Können wir ja ggf. bei der Abgabe nachfragen. LF⁉️)