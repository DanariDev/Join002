import { db } from "../firebase/firebase-init.js";
import {
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getInitials, getRandomColor } from "../contacts/contact-style.js";

let allContacts = [];
let selectedContacts = new Set();

// ...IMPORTS und Variablen wie gehabt...

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

// --- NEU: KURZE Funktionen zum Rendern der Dropdown-Liste ---
function renderContactsDropdown() {
  const dropdownList = document.getElementById("contacts-dropdown-list");
  dropdownList.innerHTML = "";
  allContacts.forEach(contact => addContactRowToDropdown(dropdownList, contact));
}

function addContactRowToDropdown(dropdownList, contact) {
  const row = createContactRow(contact);
  dropdownList.appendChild(row);
}

function createContactRow(contact) {
  const row = document.createElement("div");
  row.className = "contacts-dropdown-item";
  setSelectedClass(row, contact.id);
  addContactRowContent(row, contact);
  addClickHandlerToContactRow(row, contact);
  return row;
}

function setSelectedClass(row, contactId) {
  if (selectedContacts.has(contactId)) {
    row.classList.add("selected");
  }
}

function addContactRowContent(row, contact) {
  row.appendChild(createInitialsCircle(contact));
  row.appendChild(createContactName(contact));
  row.appendChild(createCheckbox(contact));
  row.appendChild(createContactLabel(contact));
}

function createContactLabel(contact) {
  const label = document.createElement("label");
  label.setAttribute("for", `contact-checkbox-${contact.id}`);
  return label;
}

function addClickHandlerToContactRow(row, contact) {
  row.addEventListener("click", function (e) {
    e.stopPropagation();
    if (e.target.tagName !== "INPUT" && e.target.tagName !== "LABEL") {
      handleContactToggle(contact.id);
    }
  });
}

// --- REST wie gehabt, da kurz genug ---
function createInitialsCircle(contact) {
  const initials = document.createElement("div");
  initials.className = "contact-initials";
  initials.textContent = getInitials(contact.name);
  initials.style.background = getRandomColor(contact.name);
  return initials;
}

function createContactName(contact) {
  const name = document.createElement("span");
  name.className = "contact-name";
  name.textContent = contact.name;
  return name;
}

function createCheckbox(contact) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "custom-checkbox";
  checkbox.id = `contact-checkbox-${contact.id}`;
  checkbox.checked = selectedContacts.has(contact.id);
  checkbox.addEventListener("change", () => handleContactToggle(contact.id));
  return checkbox;
}

function filterContacts(filter) {
  if (!filter) return allContacts;
  return allContacts.filter(
    (c) =>
      c.name.toLowerCase().includes(filter.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(filter.toLowerCase()))
  );
}

function handleContactToggle(id) {
  if (selectedContacts.has(id)) {
    selectedContacts.delete(id);
  } else {
    selectedContacts.add(id);
  }
  renderContactsDropdown();
  renderSelectedInsignias();
}

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
    more.title = "More contacts selected";
    container.appendChild(more);
  }
}

function createInsignia(contact) {
  const insignia = document.createElement("div");
  insignia.className = "contact-insignia";
  insignia.textContent = getInitials(contact.name);
  insignia.title = contact.name;
  insignia.style.background = getRandomColor(contact.name);
  return insignia;
}

export function getSelectedContactIds() {
  return Array.from(selectedContacts);
}

export function setupDropdownOpenClose() {
  const dropdown = document.getElementById("contacts-dropdown");
  const selected = document.getElementById("contacts-selected");
  const panel = document.getElementById("contacts-dropdown-panel");

  if (!dropdown || !selected || !panel) return;

  selected.addEventListener("click", openClose);

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

export function resetSelectedContacts() {
  selectedContacts.clear();
  renderContactsDropdown();
  renderSelectedInsignias();
}

function openClose(event) {
  const panel = document.getElementById("contacts-dropdown-panel");
  event.stopPropagation();
  panel.classList.toggle("d-none");
}
