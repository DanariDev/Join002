import { db } from '../firebase/firebase-init.js';
import { ref, get } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js';
import { getInitials, getRandomColor } from './contact-style.js';

export function initContactsList() {
  const contactsRef = ref(db, 'contacts');
  get(contactsRef).then(snapshot => {
    if (!snapshot.exists()) return;
    const contacts = Object.values(snapshot.val()).map((contact, index) => ({
      ...contact,
      id: Object.keys(snapshot.val())[index]
    }));
    renderContacts(contacts);
  });
}

export async function getContactById(id) {
  const contactRef = ref(db, `contacts/${id}`);
  const snapshot = await get(contactRef);
  if (!snapshot.exists()) return null;
  const contact = snapshot.val();
  contact.id = id;
  return contact;
}

function renderContacts(contacts) {
  const wrapper = document.querySelector('#contacts-list-wrapper');
  if (!wrapper) return;
  wrapper.innerHTML = '';
  contacts.forEach(contact => addContactToList(contact, wrapper));
}

function addContactToList(contact, wrapper) {
  const html = createContactHTML(contact);
  html.dataset.contactId = contact.id;
  html.classList.add('contact-entry');
  wrapper.append(html);
}

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

export function updateContactHTML(contact) {
  const el = document.getElementById(`contact-${contact.id}`);
  if (!el) return;
  updateContactElement(contact, el);
}

function updateContactElement(contact, el) {
  const initials = getInitials(contact.name);
  const color = getRandomColor(contact.name);
  el.querySelector('.initial-icon').textContent = initials;
  el.querySelector('.initial-icon').style.backgroundColor = color;
  el.querySelector('.list-name').textContent = contact.name;
  el.querySelector('.list-email').textContent = contact.email;
}