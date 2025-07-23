import { db } from "../firebase/firebase-init.js";
import {
  ref,
  onChildAdded,
  onChildChanged,
  onChildRemoved
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

import { createContactHTML, updateContactHTML } from "./load-contacts.js";
import { setupContactClickEvents } from "./open-contact.js";

console.log("📡 [contacts-live-update] Live-Update wird geladen...");

const contactsRef = ref(db, "contacts");

onChildAdded(contactsRef, (snapshot) => {
  console.log("📥 Neuer Kontakt aus DB erkannt!");

  const contact = snapshot.val();
  contact.id = snapshot.key;

  console.log("➡️ Kontakt-Daten:", contact);

  // Prüfen, ob der Kontakt schon im DOM ist
  if (document.getElementById(`contact-${contact.id}`)) {
    console.log(`⚠️ Kontakt ${contact.id} existiert bereits im DOM. Überspringe...`);
    return;
  }

  const html = createContactHTML(contact);
  if (!html) {
    console.error("❌ createContactHTML hat nichts zurückgegeben!");
    return;
  }

  const wrapper = document.querySelector("#contacts-list-wrapper");
  if (!wrapper) {
    console.error("❌ #contacts-list-wrapper NICHT gefunden!");
    return;
  }

  console.log("✅ Füge Kontakt in DOM ein:", html);
  wrapper.append(html);

  console.log("🎯 setupContactClickEvents wird aufgerufen...");
  setupContactClickEvents();
});

onChildChanged(contactsRef, (snapshot) => {
  const contact = snapshot.val();
  contact.id = snapshot.key;
  console.log("🔁 Kontakt geändert:", contact);
  updateContactHTML(contact);
});

onChildRemoved(contactsRef, (snapshot) => {
  const id = snapshot.key;
  const el = document.getElementById(`contact-${id}`);
  if (el) {
    console.log("🗑️ Kontakt entfernt:", id);
    el.remove();
  }
});
