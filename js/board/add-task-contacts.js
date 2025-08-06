import { db } from "../firebase/firebase-init.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getInitials, getRandomColor } from "../contacts/contact-style.js";

let allAddContacts = [];
let selectedAddContacts = new Set();

/**
 * Initializes the contact dropdown for the add task overlay.
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
 * Renders all contacts into the add contact dropdown.
 */
function renderAddContactsDropdown() {
  const dropdownList = document.getElementById("contacts-dropdown-list");
  dropdownList.innerHTML = "";
  allAddContacts.forEach((contact) => dropdownList.appendChild(createAddContactRow(contact)));
}

/**
 * Creates a row for a contact in the dropdown.
 * @param {Object} contact - The contact object.
 * @returns {HTMLDivElement} The contact row element.
 */
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

/**
 * Adds initials, name, and checkbox to a contact row.
 * @param {HTMLDivElement} row - The contact row element.
 * @param {Object} contact - The contact object.
 */
function addContactRowContent(row, contact) {
  row.appendChild(createAddInitialsCircle(contact));
  row.appendChild(createAddContactName(contact));
  row.appendChild(createAddCheckbox(contact));
}

/**
 * Handles clicks on a contact row for selection.
 * @param {HTMLDivElement} row - The contact row element.
 * @param {Object} contact - The contact object.
 */
function addContactRowClickHandler(row, contact) {
  row.addEventListener("click", function (e) {
    e.stopPropagation();
    if (e.target.tagName !== "INPUT") {
      handleAddContactToggle(contact.id);
    }
  });
}

/**
 * Creates the initials circle for the contact.
 * @param {Object} contact - The contact object.
 * @returns {HTMLDivElement} The initials circle element.
 */
function createAddInitialsCircle(contact) {
  const initials = document.createElement("div");
  initials.className = "contact-initials";
  initials.textContent = getInitials(contact.name);
  initials.style.background = getRandomColor(contact.name);
  return initials;
}

/**
 * Creates the contact name element.
 * @param {Object} contact - The contact object.
 * @returns {HTMLSpanElement} The contact name element.
 */
function createAddContactName(contact) {
  const name = document.createElement("span");
  name.className = "contact-name";
  name.textContent = contact.name;
  return name;
}

/**
 * Creates the checkbox for the contact row.
 * @param {Object} contact - The contact object.
 * @returns {HTMLDivElement} The checkbox container element.
 */
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

/**
 * Toggles selection of a contact in the dropdown.
 * @param {string} id - The contact ID.
 */
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
 * Renders the selected contacts as insignias (up to 3 + more counter).
 */
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

/**
 * Creates an insignia (badge) for a selected contact.
 * @param {Object} contact - The contact object.
 * @returns {HTMLDivElement} The insignia element.
 */
function createAddInsignia(contact) {
  const insignia = document.createElement("div");
  insignia.className = "contact-insignia";
  insignia.textContent = getInitials(contact.name);
  insignia.title = contact.name;
  insignia.style.background = getRandomColor(contact.name);
  return insignia;
}

/**
 * Creates a "+X" insignia if more than 3 contacts are selected.
 * @param {number} num - The number of additional contacts.
 * @returns {HTMLDivElement} The more insignia element.
 */
function createMoreInsignia(num) {
  const more = document.createElement("div");
  more.className = "contact-insignia contact-insignia-more";
  more.textContent = `+${num}`;
  more.title = "Weitere Kontakte ausgewählt";
  return more;
}

/**
 * Returns the IDs of all currently selected contacts.
 * @returns {Array<string>} Array of selected contact IDs.
 */
export function getSelectedAddContactIds() {
  return Array.from(selectedAddContacts);
}

/**
 * Sets up the open/close logic for the contacts dropdown.
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

/**
 * Handles click to open/close the dropdown panel.
 * @param {Event} e - The click event.
 * @param {HTMLElement} panel - The dropdown panel element.
 */
function handleDropdownClick(e, panel) {
  e.stopPropagation();
  panel.classList.toggle("d-none");
}

/**
 * Closes the dropdown if a click happens outside.
 * @param {Event} e - The click event.
 * @param {HTMLElement} dropdown - The dropdown container element.
 * @param {HTMLElement} panel - The dropdown panel element.
 */
function handleDocumentClick(e, dropdown, panel) {
  if (!dropdown.contains(e.target)) {
    panel.classList.add("d-none");
  }
}

/**
 * Closes the dropdown when pressing Escape.
 * @param {Event} e - The keyboard event.
 * @param {HTMLElement} panel - The dropdown panel element.
 */
function handleEscapeKey(e, panel) {
  if (e.key === "Escape") {
    panel.classList.add("d-none");
  }
}

/**
 * Resets the selected contacts set and UI.
 */
export function resetSelectedAddContacts() {
  selectedAddContacts.clear();
  renderAddContactsDropdown();
  renderSelectedAddInsignias();
}