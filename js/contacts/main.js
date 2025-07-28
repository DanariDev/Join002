// main.js
import { initContactsList } from "./load-contacts.js";
import { setupContactClickEvents, backToContactList } from "./open-contact.js";
import { initAddContactOverlay } from "./create-contact.js";
import { renderSortedContacts } from "./contacts-list-utils.js";
import {mediaQuery, handleMediaQueryChange} from "./contact-responsive.js";

/**
 * Main initialization: loads contacts, sets up events, initializes add overlay, imports live updates.
 */
window.addEventListener("DOMContentLoaded", async () => {
  await initContactsList(); // Kontakte aus DB laden
  setupContactClickEvents(); // Klicks für Anzeige & Bearbeiten
  initAddContactOverlay(); // "Neuer Kontakt"-Overlay aktivieren
  await import("./contacts-live-update.js"); // Live-Änderungen
  document.getElementById('back-icon').addEventListener('click', backToContactList)
  handleMediaQueryChange(mediaQuery);
});



// export const mediaQuery = window.matchMedia("(max-width: 1100px)");

// /** Handles responsive design changes */
// export function handleMediaQueryChange(e) {
//   if (e.matches){
//     document.getElementById('responsive-small-add').classList.remove('d-none');
//     document.getElementById('right-section').classList.forEach(e => { 
//       if(e == 'slide-in'){
//         document.getElementById('responsive-small-add').classList.add('d-none');
//       }
//     });
//   }
//   else
//     document.getElementById('responsive-small-add').classList.add('d-none');
// }

// handleMediaQueryChange(mediaQuery);
