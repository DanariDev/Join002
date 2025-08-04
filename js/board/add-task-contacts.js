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

/**
 * Zeichnet alle Kontakte als auswählbare Listenelemente ins Add-Dropdown.
 */
function renderAddContactsDropdown() {
  const dropdownList = document.getElementById("contacts-dropdown-list");
  dropdownList.innerHTML = "";
  allAddContacts.forEach((contact) => {
    dropdownList.appendChild(createAddContactRow(contact));
  });
}

/**
 * Erstellt eine Zeile für einen Kontakt mit Initialen, Name, Checkbox.
 */
function createAddContactRow(contact) {
  const row = document.createElement("div");
  row.className = "contacts-dropdown-item";
  if (selectedAddContacts.has(contact.id)) {
    row.classList.add("selected");
  }
  row.appendChild(createAddInitialsCircle(contact));
  row.appendChild(createAddContactName(contact));
  row.appendChild(createAddCheckbox(contact));
  row.addEventListener("click", function(e) {
    e.stopPropagation();
    if (e.target.tagName !== "INPUT") {
      handleAddContactToggle(contact.id);
    }
  });
  return row;
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
  checkbox.checked = selectedAddContacts.has(contact.id);
  checkbox.addEventListener("change", () => handleAddContactToggle(contact.id));
  return checkbox;
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

/**
 * Zeichnet die "Badges" der ausgewählten Kontakte im Add-Overlay.
 */
export function renderSelectedAddInsignias() {
  const container = document.getElementById("selected-contact-insignias");
  container.innerHTML = "";
  const selected = allAddContacts.filter(c => selectedAddContacts.has(c.id));
  const maxToShow = 3;
  selected.slice(0, maxToShow).forEach(c => container.appendChild(createAddInsignia(c)));
  if (selected.length > maxToShow) {
    const more = document.createElement("div");
    more.className = "contact-insignia contact-insignia-more";
    more.textContent = `+${selected.length - maxToShow}`;
    more.title = "Weitere Kontakte ausgewählt";
    container.appendChild(more);
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

/**
 * Gibt die aktuell ausgewählten Kontakt-IDs zurück (z. B. zum Speichern).
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

  // Panel auf/zu beim Klick aufs Feld
  selected.addEventListener("click", (e) => {
    e.stopPropagation();
    panel.classList.toggle("d-none");
  });

  // Bei Klick außerhalb schließen
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      panel.classList.add("d-none");
    }
  });

  // ESC schließt Panel
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      panel.classList.add("d-none");
    }
  });
}
export function resetSelectedAddContacts() {
  selectedAddContacts.clear();
  renderAddContactsDropdown();
  renderSelectedAddInsignias();
}