import { db } from "../firebase/firebase-init.js";
import {
  ref,
  onChildAdded,
  onChildChanged,
  onChildRemoved
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

import { createContactHTML, updateContactHTML } from "./load-contacts.js";
import { setupContactClickEvents } from "./open-contact.js";

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

onChildChanged(contactsRef, (snapshot) => {
  const contact = snapshot.val();
  contact.id = snapshot.key;
  updateContactHTML(contact);
});

onChildRemoved(contactsRef, (snapshot) => {
  const id = snapshot.key;
  const el = document.getElementById(`contact-${id}`);
  if (el) el.remove();
});
