# 🛠 Join Review – Verbesserungen laut Video-Feedback

## ✅ Bereits verbessert:
- Fehlermeldung bei Login: `"E-Mail address or password is incorrect"` ist korrekt umgesetzt.
- Keine `alert()`-Meldungen mehr, sondern schöne In-App-Notifications.
- Eingabefelder im Sign-Up wackeln nicht mehr bei Fehlermeldungen.
- Lorem Ipsum aus Privacy Policy entfernt und durch echten Text ersetzt.
- `dueDate` kann nicht mehr in der Vergangenheit liegen.

---

## 🚧 Was noch verbessert werden muss:

### 🖥 Allgemeines Layout
- ✅ **Content-Begrenzung** liegt aktuell bei `1044px`, sollte aber eher `1440px` oder `1920px` sein.
- ✅ Buttons `Add Task` Clear & Create Task sehen noch deutlich anders aus als im Figma-Design.
- ✅ Icons auf den Buttons fehlen oder unterscheiden sich vom Design.
- ✅ Assigned To ist aktuell **Pflichtfeld**, muss **optional** sein.
- ✅ Buttons `Add Task` Clear & Create Task sehen noch deutlich anders aus als im Figma-Design.
- ✅ Icons auf den Buttons fehlen oder unterscheiden sich vom Design.
- ✅ Assigned To ist aktuell **Pflichtfeld**, muss **optional** sein.

---

### 🧾 Sign-Up / Formulare
- ✅ Bei Fehlermeldungen ist der Abstand zu den Eingabefeldern zu gering – mehr **Vertical Padding** nötig.
- ✅ Design-Details beim Select "Assigned To" weichen ab (Name & Checkbox neben dem Icon statt Space-Between).
- ✅ Wenn zu viele Personen ausgewählt werden, muss ein **“+X”** Indikator eingeblendet werden (z. B. `+10`).
- ✅ Aktuell wird bei "No contacts selected" eine weiße Box eingeblendet – bitte **ganz entfernen**, da kein Pflichtfeld.

---

### 📋 Subtasks
- ✅ Subtasks lassen sich nur über den kleinen Button bearbeiten – **es soll durch Klick auf die ganze Zeile** gehen.
- ✅ Subtask-Zeile soll einen **Hover-Effekt** bekommen (hellgrau o. ä.).
- ✅ Action-Buttons (Edit, Delete) sollen **in der Subtask-Zeile** angezeigt werden, nicht als extra Bereich.
- ✅ Rahmen und Farbgebung der Buttons sind aktuell zu **dunkel/schwarz** – orientiere dich am Design.
- ✅ Scrollbar soll von Anfang an da sein – aktuell verschieben sich die Buttons erst nach mehreren Einträgen.
  - Besser: Fixe Höhe für Liste setzen und Scrollbar direkt aktivieren, statt Elemente "nach unten zu schieben".

---

## 📝 Hinweise:
- Nutzt konsequent die Figma-Dateien als optische Vorlage.
- Kleine Abstände (Padding/Margin) machen oft den Unterschied.
- Auf Mobil-Ansicht achten – insbesondere bei Privacy Policy ist etwas durcheinander.

---



## To Do:

## Login:

- Intro Animation wird noch in der größe falsch verschoben.

## legal Notice:

- Developer Akademie entfernen


## Board:

- Firebase Daten werden nicht vollständig gelöscht beim deleten einer Task


## Contacts:

- nach dem öffnen und schließen eines Contactes werden die menu reiter nicht korrekt zurückgesetzt





Viel Erfolg bei der Umsetzung! 💪
