// edit-task-contacts.js
import { db } from "../firebase/firebase-init.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getInitials, getRandomColor } from "../contacts/contact-style.js";
import { renderSelectedEditInsignias as renderEditInsigniasBadges } from "./edit-contact-insignias.js";


let allEditContacts = [];
let selectedEditContacts = new Set();

/**
 * Initialisiert das Kontakte-Dropdown für das Edit-Overlay.
 */
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

/**
 * Markiert alle Kontakte, die per ID im Set stehen. Nach jedem Setzen neu rendern!
 */
export function setSelectedEditContacts(ids) {
  selectedEditContacts = new Set(ids);
  renderEditContactsDropdown();
  renderSelectedEditInsignias();
}

/**
 * Gibt das Array der aktuell gewählten Kontakt-IDs zurück.
 */
export function getSelectedEditContactIds() {
  return Array.from(selectedEditContacts);
}

/**
 * Zeichnet alle Kontakte als auswählbare Listenelemente ins Edit-Dropdown.
 */
function renderEditContactsDropdown() {
  const dropdownList = document.getElementById("editing-contacts-dropdown-list");
  if (!dropdownList) return;
  dropdownList.innerHTML = "";
  allEditContacts.forEach((contact) => {
    dropdownList.appendChild(createEditContactRow(contact));
  });
}

function createEditContactRow(contact) {
  const row = document.createElement("div");
  row.className = "contacts-dropdown-item";
  if (selectedEditContacts.has(contact.id)) {
    row.classList.add("selected");
  }
  row.appendChild(createEditInitialsCircle(contact));
  row.appendChild(createEditContactName(contact));
  row.appendChild(createEditCheckbox(contact));
  row.addEventListener("click", function (e) {
    e.stopPropagation();
    if (e.target.tagName !== "INPUT") {
      handleEditContactToggle(contact.id);
    }
  });
  return row;
}

function createEditInitialsCircle(contact) {
  const initials = document.createElement("div");
  initials.className = "contact-initials";
  initials.textContent = getInitials(contact.name);
  initials.style.background = getRandomColor(contact.name);
  return initials;
}

function createEditContactName(contact) {
  const name = document.createElement("span");
  name.className = "contact-name";
  name.textContent = contact.name;
  return name;
}

function createEditCheckbox(contact) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = selectedEditContacts.has(contact.id);
  checkbox.addEventListener("change", () => handleEditContactToggle(contact.id));
  return checkbox;
}

function handleEditContactToggle(id) {
  if (selectedEditContacts.has(id)) {
    selectedEditContacts.delete(id);
  } else {
    selectedEditContacts.add(id);
  }
  renderEditContactsDropdown();
  renderSelectedEditInsignias();
}

/**
 * Zeichnet die "Badges" der ausgewählten Kontakte im Edit-Overlay.
 */
export function renderSelectedEditInsignias() {
  const container = document.getElementById("selected-editing-contact-insignias");
  if (!container) return;
  // IDs → Kontaktobjekte
  const selectedContacts = allEditContacts.filter(c => selectedEditContacts.has(c.id));
  renderEditInsigniasBadges(selectedContacts, container);
}


function createEditInsignia(contact) {
  const insignia = document.createElement("div");
  insignia.className = "contact-insignia";
  insignia.textContent = getInitials(contact.name);
  insignia.title = contact.name;
  insignia.style.background = getRandomColor(contact.name);
  return insignia;
}

/**
 * Öffnen/Schließen-Logik fürs Edit-Dropdown.
 */
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

/**
 * Optional: Set zurücksetzen, z.B. beim Schließen des Overlays.
 */
export function resetSelectedEditContacts() {
  selectedEditContacts.clear();
  renderEditContactsDropdown();
  renderSelectedEditInsignias();
}
