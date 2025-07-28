// load-contacts.js
import { db } from "../firebase/firebase-init.js";
import {
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { setupContactClickEvents } from "./open-contact.js";
import { getInitials, getRandomColor } from "./contact-style.js";
import { renderSortedContacts } from "./contacts-list-utils.js";

/**
 * Initializes contacts list by fetching from Firebase and rendering.
 */
export function initContactsList() {
  const contactsRef = ref(db, "contacts");
  get(contactsRef).then((snapshot) => {
    if (!snapshot.exists()) return;
    const contacts = Object.entries(snapshot.val()).map(([id, data]) => ({
      id,
      ...data,
    }));
    renderContacts(contacts);
  });
}

/**
 * Renders sorted contacts using utility function.
 */
function renderContacts(contacts) {
  const wrapper = document.querySelector("#contacts-list-wrapper");
  renderSortedContacts(contacts, wrapper, createContactHTML, setupContactClickEvents);
}

/**
 * Creates HTML element for a contact entry.
 */
function createContactHTML(contact) {
  const div = document.createElement("div");
  div.className = "list-contact-wrapper";

  const initials = getInitials(contact.name);
  const color = getRandomColor(contact.name);

  div.innerHTML = `
    <div class="initial-icon" style="background-color: ${color};">${initials}</div>
    <div class="list-contact-information">
      <span class="list-name">${contact.name}</span>
      <span class="list-email">${contact.email}</span>
    </div>`;
  div.dataset.contactId = contact.id;
  div.id = `contact-${contact.id}`;
  div.classList.add("contact-entry");

  return div;
}
export { createContactHTML };

/**
 * Updates HTML of an existing contact entry.
 */
export function updateContactHTML(contact) {
  const element = document.getElementById(`contact-${contact.id}`);
  if (!element) return;

  const initials = getInitials(contact.name);
  const color = getRandomColor(contact.name);

  element.innerHTML = `
    <div class="initial-icon" style="background-color: ${color};">${initials}</div>
    <div class="list-contact-information">
      <span class="list-name">${contact.name}</span>
      <span class="list-email">${contact.email}</span>
    </div>`;
}

/**
 * Fetches a single contact by ID from Firebase.
 */
export async function getContactById(id) {
  const contactRef = ref(db, `contacts/${id}`);
  const snapshot = await get(contactRef);
  if (!snapshot.exists()) return null;
  return { id, ...snapshot.val() };
}