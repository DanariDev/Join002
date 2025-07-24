import { initContactsList } from "./load-contacts.js";
import { setupContactClickEvents } from "./open-contact.js";
import { initAddContactOverlay } from "./create-contact.js";
import { renderSortedContacts } from "./contacts-list-utils.js";


// Hauptinitialisierung
window.addEventListener("DOMContentLoaded", async () => {
  await initContactsList(); // Kontakte aus DB laden
  setupContactClickEvents(); // Klicks für Anzeige & Bearbeiten
  initAddContactOverlay(); // "Neuer Kontakt"-Overlay aktivieren
  await import("./contacts-live-update.js"); // Live-Änderungen
});


