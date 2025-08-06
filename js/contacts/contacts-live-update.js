import { db } from "../firebase/firebase-init.js";
import { ref, onChildAdded, onChildChanged, onChildRemoved } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getInitials, getRandomColor } from "./contact-style.js";
import { getContactById, createContactHTML, updateContactHTML } from "./load-contacts.js";
import { setupContactClickEvents } from "./open-contact.js";

/** Reference to the "contacts" collection in Firebase */
const contactsRef = ref(db, "contacts");

/* Listen for added, changed, and removed contacts in real time */
onChildAdded(contactsRef, onContactAdded);
onChildChanged(contactsRef, onContactChanged);
onChildRemoved(contactsRef, onContactRemoved);

/**
 * Adds a new contact element to the contact list when a contact is added in Firebase.
 * @param {DataSnapshot} snapshot - The Firebase snapshot object.
 */
function onContactAdded(snapshot) {
  const contact = withId(snapshot);
  if (document.getElementById(`contact-${contact.id}`)) return;
  const html = createContactHTML(contact);
  if (!html) return;
  const wrapper = document.querySelector("#contacts-list-wrapper");
  if (!wrapper) return;
  wrapper.append(html);
  setupContactClickEvents();
}

/**
 * Updates a contact element when the contact data changes in Firebase.
 * @param {DataSnapshot} snapshot - The Firebase snapshot object.
 */
function onContactChanged(snapshot) {
  const c = withId(snapshot);
  updateContactHTML(c);
  updateIfCurrentContact(c);
}

/**
 * Updates the contact panel if the currently viewed contact was changed.
 * @param {Object} c - The updated contact object.
 */
async function updateIfCurrentContact(c) {
  const card = document.getElementById("showed-current-contact");
  if (card && card.dataset.contactId === c.id) {
    const f = await getContactById(c.id);
    fillContactPanel(f);
  }
}

/**
 * Removes the contact element from the list when the contact is deleted in Firebase.
 * @param {DataSnapshot} snapshot - The Firebase snapshot object.
 */
function onContactRemoved(snapshot) {
  const id = snapshot.key;
  const el = document.getElementById(`contact-${id}`);
  if (el) el.remove();
}

/**
 * Adds the Firebase ID as 'id' property to the contact object.
 * @param {DataSnapshot} snapshot - The Firebase snapshot object.
 * @returns {Object} The contact object with ID.
 */
function withId(snapshot) {
  let c = snapshot.val();
  c.id = snapshot.key;
  return c;
}

/**
 * Fills the contact detail panel with the contact's information.
 * @param {Object} c - The contact object.
 */
function fillContactPanel(c) {
  let i = document.getElementById("current-icon");
  let n = document.getElementById("current-name");
  let m = document.getElementById("current-mail");
  let p = document.getElementById("current-phone");
  if (!i || !n || !m || !p) return;
  setContactPanelFields(i, n, m, p, c);
}

/**
 * Sets all relevant fields in the contact panel (initials, name, mail, phone).
 * @param {HTMLElement} i - The initials icon element.
 * @param {HTMLElement} n - The name element.
 * @param {HTMLElement} m - The mail element.
 * @param {HTMLElement} p - The phone element.
 * @param {Object} c - The contact object.
 */
function setContactPanelFields(i, n, m, p, c) {
  i.textContent = getInitials(c.name);
  i.style.backgroundColor = getRandomColor(c.name);
  n.textContent = c.name;
  m.textContent = c.email;
  m.href = `mailto:${c.email}`;
  p.textContent = c.phone;
  p.href = `tel:${c.phone}`;
}
