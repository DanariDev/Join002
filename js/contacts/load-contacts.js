import { db } from '../firebase/firebase-init.js';
import { ref, get } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js';

export function initContactsList() {
  const contactsRef = ref(db, 'contacts');
  get(contactsRef).then(snapshot => {
    if (!snapshot.exists()) return;
    const contacts = Object.values(snapshot.val());
    renderContacts(contacts);
  });
}

function renderContacts(contacts) {
  const wrapper = document.querySelector('#contacts-list-wrapper');
  if (!wrapper) return;
  wrapper.innerHTML = '';
  contacts.forEach(contact => wrapper.append(createContactHTML(contact)));
}

import { getInitials, getRandomColor } from './contact-style.js';

function createContactHTML(contact) {
  const div = document.createElement('div');
  div.className = 'list-contact-wrapper';

  const initials = getInitials(contact.name);
  const color = getRandomColor(contact.name);

  div.innerHTML = `
    <div class="initial-icon" style="background-color: ${color};">${initials}</div>
    <div class="list-contact-information">
      <span class="list-name">${contact.name}</span>
      <span class="list-email">${contact.email}</span>
    </div>`;
  return div;
}



