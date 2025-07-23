//contacts-live-update.js
import { db, ref, onChildAdded, onChildChanged, onChildRemoved } from "../firebase/firebase-init.js";
import { createContactHTML } from "./contact-style.js";
import { updateContactHTML } from "./load-contacts.js";

const contactsRef = ref(db, 'contacts');

onChildAdded(contactsRef, (snapshot) => {
  const contact = snapshot.val();
  contact.id = snapshot.key;
  if (document.getElementById(`contact-${contact.id}`)) return;
  const html = createContactHTML(contact);
  document.querySelector(".contact-list").append(html);
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
