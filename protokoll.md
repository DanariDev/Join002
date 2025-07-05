Protokoll der Loom-Aufnahme: Zu überarbeitende Punkte für das Projekt
Basierend auf der Loom-Aufnahme hier eine Zusammenfassung der Punkte, die im Projekt überarbeitet oder verbessert werden müssen:
1. Setup-Seite

Join-Logo-Animation:✅
Problem: Animation ist zu groß.
Lösung: Größe der Animation reduzieren.
Zusätzlich: Der Container sollte nicht mitbewegt werden. Stattdessen soll die Animation als Overlay fungieren, das sanft ausfadet.


Container-Design:✅
Problem: Container wirkt gestreckt, enthält einen unpassenden Schatten, und die Karte sollte weiß sein.
Lösung: Design an Vorlage anpassen (weiße Karte, Schatten entfernen, Proportionen korrigieren).


Button-Design:✅
Problem: Buttons haben Standardrahmen (grau/schwarz), Gasblock sollte weiß sein.
Lösung: Button- und Gasblock-Design exakt nach Vorlage umsetzen (weißer Gasblock, passende Rahmen).


Links:✅
Problem: Links sind zu klein und schwer lesbar, selbst auf großem Bildschirm.
Lösung: Schriftgröße der Links erhöhen für bessere Lesbarkeit.



2. Mobile Ansicht

Animation:✅
Problem: Animation auf Mobilgeräten muss überprüft werden.
Lösung: Sicherstellen, dass die Animation wie auf der Desktop-Version korrekt als Overlay ausfadet.


Layout:✅
Problem: Inhalte wirken gequetscht, insbesondere Input-Felder und Buttons.
Lösung: Mehr Platz für Input-Felder und Buttons schaffen, Abstände gemäß Design-Vorlage anpassen.


Abstände:✅
Problem: Signup-Bereich benötigt mehr Abstand.
Lösung: Abstände im Signup-Bereich gemäß Design-Vorlage optimieren.



3. Registrierung (Signup)

Bilder:✅
Problem: Bilder laufen ineinander.
Lösung: Design überprüfen und Bilder korrekt anzeigen.


Validierung:
Problem: Fehlende oder unzureichende Validierung bei der Registrierung:
Passwörter, die nicht übereinstimmen, werden nicht sofort erkannt.
Fehlerhafte E-Mail-Adressen (z. B. test.com) werden akzeptiert.
Fehlermeldungen (z. B. „Passwords don’t match“) fehlen oder sind inkonsistent.


Lösung:
Sofortige Validierung für Passwortübereinstimmung und E-Mail-Format implementieren.
Fehlermeldungen wie in der Vorlage anzeigen (z. B. unter dem Formular).
Sicherstellen, dass Registrierung bei ungültigen Daten nicht durchläuft.




Funktionalität:✅
Problem: Registrierung funktioniert teilweise trotz Fehlermeldungen (z. B. Login mit test2.com).
Lösung: Registrierungsprozess überprüfen und sicherstellen, dass er bei ungültigen Daten korrekt abbricht.



4. Kontakte-Seite

Validierung:✅
Problem: Eingabe ungültiger E-Mail-Adressen wird nicht abgefangen.
Lösung: Validierung für E-Mail-Felder implementieren, um ungültige Eingaben zu verhindern.


Abstände:
Problem: Zu wenig Abstand zu den Seitenrändern.
Lösung: Abstände gemäß Design-Vorlage anpassen.


Kontakt-Auswahl:✅
Problem: Nach Aktionen wie Editieren oder Löschen bleibt der Kontakt nicht ausgewählt.
Lösung: Sicherstellen, dass der Kontakt nach solchen Aktionen ausgewählt bleibt.



5. Allgemeine Hinweise

Design-Treue:
Überall sicherstellen, dass das Design exakt der Vorlage entspricht (Farben, Abstände, Proportionen).


GitHub-Commits:
Commits sehen sauber und ausgeglichen aus, keine Änderungen erforderlich.


Nächste Schritte:
Überarbeitete Version erneut einreichen.
Weitere Tests durchführen, um die genannten Punkte zu validieren.



Empfehlung: Besonders die Registrierungsfunktion und die Design-Treue (z. B. Animation, Button-Styles, Abstände) sollten priorisiert werden, da diese Punkte kritisch für die Nutzererfahrung sind.
Falls weitere Fragen oder Klarstellungen benötigt werden, bitte Rückmeldung geben!