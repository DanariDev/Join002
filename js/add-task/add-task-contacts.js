import { db } from "../firebase/firebase-init.js";
import {
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getInitials, getRandomColor } from "../contacts/contact-style.js";

let allContacts = [];
let selectedContacts = new Set();

/**
 * Initializes the contacts dropdown by setting up a real-time listener on Firebase "contacts" reference.
 * Updates allContacts array and renders the dropdown.
 */
export function initContactsDropdown() {
  const dropdownList = document.getElementById("contacts-dropdown-list");
  if (!dropdownList) return;
  const contactsRef = ref(db, "contacts");
  onValue(contactsRef, (snapshot) => {
    allContacts = [];
    snapshot.forEach((child) => {
      allContacts.push({ id: child.key, ...child.val() });
    });
    renderContactsDropdown();
  });
}

/**
 * Sets up a real-time listener for contacts (similar to initContactsDropdown, possibly redundant).
 */
function setupContactsListener() {
  const contactsRef = ref(db, "contacts");
  onValue(contactsRef, (snapshot) => {
    allContacts = [];
    snapshot.forEach((child) => {
      allContacts.push({ id: child.key, ...child.val() });
    });
    renderContactsDropdown();
  });
}

/**
 * Renders the contacts list in the dropdown UI by creating rows for each contact.
 */
function renderContactsDropdown() {
  const dropdownList = document.getElementById("contacts-dropdown-list");
  dropdownList.innerHTML = "";
  allContacts.forEach((contact) => {
    dropdownList.appendChild(createContactRow(contact));
  });
}

/**
 * Filters contacts based on a search string (by name or email, case-insensitive). Not used in current code.
 */
function filterContacts(filter) {
  if (!filter) return allContacts;
  return allContacts.filter(
    (c) =>
      c.name.toLowerCase().includes(filter.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(filter.toLowerCase()))
  );
}

/**
 * Creates a DOM row element for a contact in the dropdown, including initials, name, checkbox, and click handler.
 */
function createContactRow(contact) {
  const row = document.createElement("div");
  row.className = "contacts-dropdown-item";
  if (selectedContacts.has(contact.id)) {
    row.classList.add("selected");
  }
  row.appendChild(createInitialsCircle(contact));
  row.appendChild(createContactName(contact));
  row.appendChild(createCheckbox(contact));
  row.addEventListener("click", function(e) {
    e.stopPropagation();
    if (e.target.tagName !== "INPUT") {
      handleContactToggle(contact.id);
    }
  });
  
  return row;
}

/**
 * Creates a circle element with contact initials and random background color.
 */
function createInitialsCircle(contact) {
  const initials = document.createElement("div");
  initials.className = "contact-initials";
  initials.textContent = getInitials(contact.name);
  initials.style.background = getRandomColor(contact.name);
  return initials;
}

/**
 * Creates a span element for the contact's name.
 */
function createContactName(contact) {
  const name = document.createElement("span");
  name.className = "contact-name";
  name.textContent = contact.name;
  return name;
}

/**
 * Creates a checkbox for selecting the contact, with change handler.
 */
function createCheckbox(contact) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = selectedContacts.has(contact.id);
  checkbox.addEventListener("change", () => handleContactToggle(contact.id));
  return checkbox;
}

/**
 * Toggles selection of a contact ID in the Set, then re-renders dropdown and selected insignias.
 */
function handleContactToggle(id) {
  if (selectedContacts.has(id)) {
    selectedContacts.delete(id);
  } else {
    selectedContacts.add(id);
  }
  renderContactsDropdown();
  renderSelectedInsignias();
}

/**
 * Renders visual insignias for selected contacts in a container.
 */
function renderSelectedInsignias() {
  const container = document.getElementById("selected-contact-insignias");
  container.innerHTML = "";
  const selected = allContacts.filter(c => selectedContacts.has(c.id));
  const maxToShow = 3;
  selected.slice(0, maxToShow).forEach(c => container.appendChild(createInsignia(c)));
  if (selected.length > maxToShow) {
    const more = document.createElement("div");
    more.className = "contact-insignia contact-insignia-more";
    more.textContent = `+${selected.length - maxToShow}`;
    more.title = "Weitere Kontakte ausgewählt";
    container.appendChild(more);
  }
}


/**
 * Creates an insignia element (badge) for a selected contact with initials and color.
 */
function createInsignia(contact) {
  const insignia = document.createElement("div");
  insignia.className = "contact-insignia";
  insignia.textContent = getInitials(contact.name);
  insignia.title = contact.name;
  insignia.style.background = getRandomColor(contact.name);
  return insignia;
}

/**
 * Returns an array of selected contact IDs.
 */
export function getSelectedContactIds() {
  return Array.from(selectedContacts);
}

/**
 * Sets up event listeners to open/close the dropdown panel on click or escape key.
 */
export function setupDropdownOpenClose() {
  const dropdown = document.getElementById("contacts-dropdown");
  const selected = document.getElementById("contacts-selected");
  const panel = document.getElementById("contacts-dropdown-panel");

  if (!dropdown || !selected || !panel) return;

  // Panel auf/zu schalten beim Klick auf das Eingabefeld
  selected.addEventListener("click", openClose);

  // Bei Klick außerhalb Panel schließen
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      panel.classList.add("d-none");
    }
  });

  // Escape schließt Panel
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      panel.classList.add("d-none");
    }
  });
}
export function resetSelectedContacts() {
  selectedContacts.clear();
  renderContactsDropdown();
  renderSelectedInsignias();
}

function openClose(event){
  const panel = document.getElementById("contacts-dropdown-panel");
  event.stopPropagation();
  panel.classList.toggle("d-none");
}
