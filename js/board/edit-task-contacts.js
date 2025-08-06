import { db } from "../firebase/firebase-init.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getInitials, getRandomColor } from "../contacts/contact-style.js";
import { renderSelectedEditInsignias as renderEditInsigniasBadges } from "./edit-contact-insignias.js";

let allEditContacts = [];
let selectedEditContacts = new Set();

/** Initializes the contacts dropdown for the edit overlay */
export function initEditContactsDropdown() {
  const dropdownList = document.getElementById("editing-contacts-dropdown-list");
  if (!dropdownList) return;
  const contactsRef = ref(db, "contacts");
  onValue(contactsRef, (snapshot) => {
    allEditContacts = [];
    snapshot.forEach((child) => {
      allEditContacts.push({ id: child.key, ...child.val() });
    });
    renderEditContactsDropdown();
    renderSelectedEditInsignias();
  });
}

/** Sets the selected contacts by array of IDs */
export function setSelectedEditContacts(ids) {
  selectedEditContacts = new Set(ids);
  renderEditContactsDropdown();
  renderSelectedEditInsignias();
}

/** Returns an array of selected contact IDs */
export function getSelectedEditContactIds() {
  return Array.from(selectedEditContacts);
}

/** Renders all contacts as selectable rows in the dropdown */
function renderEditContactsDropdown() {
  const dropdownList = document.getElementById("editing-contacts-dropdown-list");
  if (!dropdownList) return;
  dropdownList.innerHTML = "";
  allEditContacts.forEach((contact) => {
    dropdownList.appendChild(createEditContactRow(contact));
  });
}

/** Creates a single row for a contact in the edit dropdown */
function createEditContactRow(contact) {
  const row = document.createElement("div");
  row.className = "contacts-dropdown-item";
  if (selectedEditContacts.has(contact.id)) {
    row.classList.add("selected");
  }
  row.appendChild(createEditInitialsCircle(contact));
  row.appendChild(createEditContactName(contact));
  row.appendChild(createEditCheckbox(contact));
  const label = document.createElement("label");
  label.setAttribute("for", `contact-checkbox-${contact.id}`);
  row.appendChild(label);
  row.addEventListener("click", function (e) {
    e.stopPropagation();
    if (e.target.tagName !== "INPUT" && e.target.tagName !== "LABEL") {
      handleEditContactToggle(contact.id);
    }
  });
  return row;
}

/** Creates the initials circle for a contact */
function createEditInitialsCircle(contact) {
  const initials = document.createElement("div");
  initials.className = "contact-initials";
  initials.textContent = getInitials(contact.name);
  initials.style.background = getRandomColor(contact.name);
  return initials;
}

/** Creates the name element for a contact */
function createEditContactName(contact) {
  const name = document.createElement("span");
  name.className = "contact-name";
  name.textContent = contact.name;
  return name;
}

/** Creates a checkbox for contact selection */
function createEditCheckbox(contact) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "custom-checkbox";
  checkbox.checked = selectedEditContacts.has(contact.id);
  checkbox.addEventListener("change", () => handleEditContactToggle(contact.id));
  return checkbox;
}

/** Toggles a contact's selection in the edit dropdown */
function handleEditContactToggle(id) {
  if (selectedEditContacts.has(id)) {
    selectedEditContacts.delete(id);
  } else {
    selectedEditContacts.add(id);
  }
  renderEditContactsDropdown();
  renderSelectedEditInsignias();
}

/** Renders the insignia badges for all selected contacts */
export function renderSelectedEditInsignias() {
  const container = document.getElementById("selected-editing-contact-insignias");
  if (!container) return;
  // IDs → Kontaktobjekte
  const selectedContacts = allEditContacts.filter(c => selectedEditContacts.has(c.id));
  renderEditInsigniasBadges(selectedContacts, container);
}

/** Sets up the open/close logic for the edit contacts dropdown */
export function setupEditDropdownOpenClose() {
  const dropdown = document.getElementById("editing-contacts-dropdown");
  const selected = document.getElementById("editing-contacts-selected");
  const panel = document.getElementById("editing-contacts-dropdown-list");

  if (!dropdown || !selected || !panel) return;

  selected.addEventListener("click", (e) => {
    e.stopPropagation();
    panel.classList.toggle("d-none");
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      panel.classList.add("d-none");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      panel.classList.add("d-none");
    }
  });
}

/** Resets all selected contacts (clears set and UI) */
export function resetSelectedEditContacts() {
  selectedEditContacts.clear();
  renderEditContactsDropdown();
  renderSelectedEditInsignias();
}
