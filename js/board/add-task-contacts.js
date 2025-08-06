import { db } from "../firebase/firebase-init.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getInitials, getRandomColor } from "../contacts/contact-style.js";

let allAddContacts = [];
let selectedAddContacts = new Set();

/**
 * Initialisiert das Kontakte-Dropdown für das Add-Overlay.
 */
export function initAddContactsDropdown() {
  const dropdownList = document.getElementById("contacts-dropdown-list");
  if (!dropdownList) return;
  const contactsRef = ref(db, "contacts");
  onValue(contactsRef, (snapshot) => {
    allAddContacts = [];
    snapshot.forEach((child) => {
      allAddContacts.push({ id: child.key, ...child.val() });
    });
    renderAddContactsDropdown();
  });
}

function renderAddContactsDropdown() {
  const dropdownList = document.getElementById("contacts-dropdown-list");
  dropdownList.innerHTML = "";
  allAddContacts.forEach((contact) => dropdownList.appendChild(createAddContactRow(contact)));
}

function createAddContactRow(contact) {
  const row = document.createElement("div");
  row.className = "contacts-dropdown-item";
  if (selectedAddContacts.has(contact.id)) {
    row.classList.add("selected");
  }
  addContactRowContent(row, contact);
  addContactRowClickHandler(row, contact);
  return row;
}

function addContactRowContent(row, contact) {
  row.appendChild(createAddInitialsCircle(contact));
  row.appendChild(createAddContactName(contact));
  row.appendChild(createAddCheckbox(contact));
}

function addContactRowClickHandler(row, contact) {
  row.addEventListener("click", function (e) {
    e.stopPropagation();
    if (e.target.tagName !== "INPUT") {
      handleAddContactToggle(contact.id);
    }
  });
}

function createAddInitialsCircle(contact) {
  const initials = document.createElement("div");
  initials.className = "contact-initials";
  initials.textContent = getInitials(contact.name);
  initials.style.background = getRandomColor(contact.name);
  return initials;
}

function createAddContactName(contact) {
  const name = document.createElement("span");
  name.className = "contact-name";
  name.textContent = contact.name;
  return name;
}

function createAddCheckbox(contact) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "custom-checkbox";
  checkbox.id = `checkbox-${contact.id}`;
  checkbox.checked = selectedAddContacts.has(contact.id);
  checkbox.addEventListener("change", () => handleAddContactToggle(contact.id));
  const label = document.createElement("label");
  label.setAttribute("for", `checkbox-${contact.id}`);
  label.className = "custom-checkbox-label";
  const container = document.createElement("div");
  container.appendChild(checkbox);
  container.appendChild(label);
  return container;
}

function handleAddContactToggle(id) {
  if (selectedAddContacts.has(id)) {
    selectedAddContacts.delete(id);
  } else {
    selectedAddContacts.add(id);
  }
  renderAddContactsDropdown();
  renderSelectedAddInsignias();
}

export function renderSelectedAddInsignias() {
  const container = document.getElementById("selected-contact-insignias");
  container.innerHTML = "";
  const selected = allAddContacts.filter(c => selectedAddContacts.has(c.id));
  const maxToShow = 3;
  selected.slice(0, maxToShow).forEach(c => container.appendChild(createAddInsignia(c)));
  if (selected.length > maxToShow) {
    container.appendChild(createMoreInsignia(selected.length - maxToShow));
  }
}

function createAddInsignia(contact) {
  const insignia = document.createElement("div");
  insignia.className = "contact-insignia";
  insignia.textContent = getInitials(contact.name);
  insignia.title = contact.name;
  insignia.style.background = getRandomColor(contact.name);
  return insignia;
}

function createMoreInsignia(num) {
  const more = document.createElement("div");
  more.className = "contact-insignia contact-insignia-more";
  more.textContent = `+${num}`;
  more.title = "Weitere Kontakte ausgewählt";
  return more;
}

/**
 * Gibt die aktuell ausgewählten Kontakt-IDs zurück.
 */
export function getSelectedAddContactIds() {
  return Array.from(selectedAddContacts);
}

/**
 * Öffnen/Schließen-Logik fürs Add-Dropdown.
 */
export function setupAddDropdownOpenClose() {
  const dropdown = document.getElementById("contacts-dropdown");
  const selected = document.getElementById("contacts-selected");
  const panel = document.getElementById("contacts-dropdown-list");

  if (!dropdown || !selected || !panel) return;

  selected.addEventListener("click", (e) => handleDropdownClick(e, panel));
  document.addEventListener("click", (e) => handleDocumentClick(e, dropdown, panel));
  document.addEventListener("keydown", (e) => handleEscapeKey(e, panel));
}

function handleDropdownClick(e, panel) {
  e.stopPropagation();
  panel.classList.toggle("d-none");
}

function handleDocumentClick(e, dropdown, panel) {
  if (!dropdown.contains(e.target)) {
    panel.classList.add("d-none");
  }
}

function handleEscapeKey(e, panel) {
  if (e.key === "Escape") {
    panel.classList.add("d-none");
  }
}

export function resetSelectedAddContacts() {
  selectedAddContacts.clear();
  renderAddContactsDropdown();
  renderSelectedAddInsignias();
}
