import {
  getDatabase,
  ref,
  get
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { app } from "../firebase/firebase-init.js";
import { getInitials, getRandomColor } from "./contact-style.js";

const db = getDatabase(app);

export function initContactsList() {
  const refContacts = ref(db, 'contacts');
  get(refContacts).then(snapshot => {
    if (!snapshot.exists()) return;
    renderContacts(Object.values(snapshot.val()));
  });
}

function renderContacts(contacts) {
  const wrapper = document.querySelector('#contacts-list-wrapper');
  if (!wrapper) return;
  wrapper.innerHTML = '';
  contacts.forEach(c => wrapper.appendChild(createContactHTML(c)));
}

function createContactHTML(contact) {
  const initials = getInitials(contact.name);
  const color = getRandomColor(contact.name);
  const div = document.createElement('div');
  div.className = 'list-contact-wrapper';
  div.dataset.email = contact.email;
  div.innerHTML = `
    <div class="initial-icon" style="background-color:${color}">${initials}</div>
    <div class="list-contact-information">
      <span class="list-name">${contact.name}</span>
      <span class="list-email">${contact.email}</span>
    </div>`;
  return div;
}
