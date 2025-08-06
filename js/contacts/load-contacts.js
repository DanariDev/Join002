import { db } from "../firebase/firebase-init.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { setupContactClickEvents } from "./open-contact.js";
import { getInitials, getRandomColor } from "./contact-style.js";
import { renderSortedContacts } from "./contacts-list-utils.js";

/**
 * Initializes the contact list: fetches from DB and renders them.
 */
export function initContactsList() {
  fetchContactsFromDb().then(contacts => {
    if (contacts && contacts.length) renderContacts(contacts);
  });
}

/**
 * Fetches all contacts from the Firebase database.
 * @returns {Promise<Array<Object>>} Array of contact objects.
 */
async function fetchContactsFromDb() {
  const contactsRef = ref(db, "contacts");
  const snapshot = await get(contactsRef);
  if (!snapshot.exists()) return [];
  return Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data }));
}

/**
 * Renders the sorted and grouped contacts in the contact list wrapper.
 * @param {Array<Object>} contacts - Array of contact objects.
 */
function renderContacts(contacts) {
  const wrapper = document.querySelector("#contacts-list-wrapper");
  renderSortedContacts(contacts, wrapper, createContactHTML, setupContactClickEvents);
}

/**
 * Creates a contact list entry as a DOM element.
 * @param {Object} contact - The contact object.
 * @returns {HTMLDivElement} The DOM element for the contact.
 */
export function createContactHTML(contact) {
  const div = document.createElement("div");
  div.className = "list-contact-wrapper";
  div.innerHTML = getContactHtml(contact);
  div.dataset.contactId = contact.id;
  div.id = `contact-${contact.id}`;
  div.classList.add("contact-entry");
  return div;
}

/**
 * Returns the HTML for a contact list entry (as string).
 * @param {Object} contact - The contact object.
 * @returns {string} HTML string for the contact.
 */
function getContactHtml(contact) {
  const initials = getInitials(contact.name);
  const color = getRandomColor(contact.name);
  return `
    <div class="initial-icon" style="background-color: ${color};">${initials}</div>
    <div class="list-contact-information">
      <span class="list-name">${contact.name}</span>
      <span class="list-email">${contact.email}</span>
    </div>`;
}

/**
 * Updates the HTML of an existing contact in the contact list.
 * @param {Object} contact - The updated contact object.
 */
export function updateContactHTML(contact) {
  const element = document.getElementById(`contact-${contact.id}`);
  if (!element) return;
  element.innerHTML = getContactHtml(contact);
}

/**
 * Loads a single contact from the DB by its ID.
 * @param {string} id - The contact ID.
 * @returns {Promise<Object|null>} The contact object or null if not found.
 */
export async function getContactById(id) {
  const contactRef = ref(db, `contacts/${id}`);
  const snapshot = await get(contactRef);
  if (!snapshot.exists()) return null;
  return { id, ...snapshot.val() };
}
