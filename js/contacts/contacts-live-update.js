import { db } from "../firebase/firebase-init.js";
import { ref, onChildAdded, onChildChanged, onChildRemoved } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getInitials, getRandomColor } from "./contact-style.js";
import { getContactById, createContactHTML, updateContactHTML } from "./load-contacts.js";
import { setupContactClickEvents } from "./open-contact.js";

const contactsRef = ref(db, "contacts");

onChildAdded(contactsRef, onContactAdded);
onChildChanged(contactsRef, onContactChanged);
onChildRemoved(contactsRef, onContactRemoved);

/* ========== Child Added ========== */
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

/* ========== Child Changed ========== */
function onContactChanged(snapshot) {
  const c = withId(snapshot);
  updateContactHTML(c);
  updateIfCurrentContact(c);
}
async function updateIfCurrentContact(c) {
  const card = document.getElementById("showed-current-contact");
  if (card && card.dataset.contactId === c.id) {
    const f = await getContactById(c.id);
    fillContactPanel(f);
  }
}

/* ========== Child Removed ========== */
function onContactRemoved(snapshot) {
  const id = snapshot.key;
  const el = document.getElementById(`contact-${id}`);
  if (el) el.remove();
}

/* ========== Hilfsfunktionen ========== */
function withId(snapshot) {
  let c = snapshot.val();
  c.id = snapshot.key;
  return c;
}

function fillContactPanel(c) {
  let i = document.getElementById("current-icon");
  let n = document.getElementById("current-name");
  let m = document.getElementById("current-mail");
  let p = document.getElementById("current-phone");
  if (!i || !n || !m || !p) return;
  setContactPanelFields(i, n, m, p, c);
}
function setContactPanelFields(i, n, m, p, c) {
  i.textContent = getInitials(c.name);
  i.style.backgroundColor = getRandomColor(c.name);
  n.textContent = c.name;
  m.textContent = c.email;
  m.href = `mailto:${c.email}`;
  p.textContent = c.phone;
  p.href = `tel:${c.phone}`;
}
