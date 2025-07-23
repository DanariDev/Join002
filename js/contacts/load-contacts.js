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

function createContactHTML(contact) {
  const div = document.createElement('div');
  div.className = 'list-contact-wrapper';
  div.innerHTML = `
    <div class="initial-icon">${getInitials(contact.name)}</div>
    <div class="list-contact-information">
      <span class="list-name">${contact.name}</span>
      <span class="list-email">${contact.email}</span>
    </div>`;
  return div;
}

function getInitials(name) {
  return name
    .split(' ')
    .map(w => w[0]?.toUpperCase())
    .join('')
    .slice(0, 2);
}
