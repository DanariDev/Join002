// contacts-live-update.js
import { db } from "../firebase/firebase-init.js";
import {
  ref,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

import { getInitials, getRandomColor } from "./contact-style.js";
import {
  getContactById,
  createContactHTML,
  updateContactHTML,
} from "./load-contacts.js";
import { setupContactClickEvents } from "./open-contact.js";

/**
 * Sets up real-time listeners for contacts: adds, updates, or removes contacts dynamically in the UI.
 */
const contactsRef = ref(db, "contacts");

onChildAdded(contactsRef, (snapshot) => {
  const contact = snapshot.val();
  contact.id = snapshot.key;

  if (document.getElementById(`contact-${contact.id}`)) return;

  const html = createContactHTML(contact);
  if (!html) return;

  const wrapper = document.querySelector("#contacts-list-wrapper");
  if (!wrapper) return;

  wrapper.append(html);
  setupContactClickEvents();
});

onChildChanged(contactsRef, async (snapshot) => {
  const c = snapshot.val();
  c.id = snapshot.key;
  updateContactHTML(c);
  const card = document.getElementById("showed-current-contact");
  if (card && card.dataset.contactId === c.id) {
    const f = await getContactById(c.id);
    fillContactPanel(f);
  }
});

onChildRemoved(contactsRef, (snapshot) => {
  const id = snapshot.key;
  const el = document.getElementById(`contact-${id}`);
  if (el) el.remove();
});

/**
 * Fills the contact panel with details like initials, name, email, phone.
 */
function fillContactPanel(c) {
  let i = document.getElementById("current-icon");
  let n = document.getElementById("current-name");
  let m = document.getElementById("current-mail");
  let p = document.getElementById("current-phone");
  if (!i || !n || !m || !p) return;
  i.textContent = getInitials(c.name);
  i.style.backgroundColor = getRandomColor(c.name);
  n.textContent = c.name;
  m.textContent = c.email;
  m.href = `mailto:${c.email}`;
  p.textContent = c.phone;
  p.href = `tel:${c.phone}`;
}