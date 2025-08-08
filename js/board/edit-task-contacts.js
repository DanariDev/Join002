import { db } from "../firebase/firebase-init.js";
import {
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getInitials, getRandomColor } from "../contacts/contact-style.js";
import { renderSelectedEditInsignias as renderEditInsigniasBadges } from "./edit-contact-insignias.js";

let allEditContacts = [];
let selectedEditContacts = new Set();

/**
 * Initializes the contacts dropdown for the edit overlay.
 */
export function initEditContactsDropdown() {
  const dropdownList = document.getElementById(
    "editing-contacts-dropdown-list"
  );
  if (!dropdownList) return;
  const contactsRef = ref(db, "contacts");
  onValue(contactsRef, (snapshot) => {
    allEditContacts = [];
    snapshot.forEach((child) => {
      allEditContacts.push({ id: child.key, ...child.val() });
    });
     allEditContacts.sort((selected, compare)=> selected.name.localeCompare(compare.name));
    renderEditContactsDropdown();
    renderSelectedEditInsignias();
  });
}

/**
 * Sets the selected contacts by array of IDs.
 * @param {Array<string>} ids - Array of contact IDs to select.
 */
export function setSelectedEditContacts(ids) {
  selectedEditContacts = new Set(ids);
  renderEditContactsDropdown();
  renderSelectedEditInsignias();
}

/**
 * Returns an array of selected contact IDs.
 * @returns {Array<string>} Array of selected contact IDs.
 */
export function getSelectedEditContactIds() {
  return Array.from(selectedEditContacts);
}

/**
 * Renders all contacts as selectable rows in the dropdown.
 */
function renderEditContactsDropdown() {
  const dropdownList = document.getElementById(
    "editing-contacts-dropdown-list"
  );
  if (!dropdownList) return;
  dropdownList.innerHTML = "";
  allEditContacts.forEach((contact) => {
    dropdownList.appendChild(createEditContactRow(contact));
  });
}

/**
 * Creates a single row for a contact in the edit dropdown.
 * @param {Object} contact - The contact object.
 * @returns {HTMLDivElement} The contact row element.
 */
function createEditContactRow(contact) {
  const row = document.createElement("div");
  row.className = "contacts-dropdown-item";
  if (selectedEditContacts.has(contact.id)) {
    row.classList.add("selected");
  }
  appendEditContactElements(row, contact);
  setupEditContactRowClick(row, contact.id);
  return row;
}

/**
 * Appends initials, name, checkbox and label to the contact row.
 * @param {HTMLDivElement} row - The row element.
 * @param {Object} contact - The contact object.
 */
function appendEditContactElements(row, contact) {
  row.appendChild(createEditInitialsCircle(contact));
  row.appendChild(createEditContactName(contact));
  row.appendChild(createEditCheckbox(contact));
  const label = document.createElement("label");
  label.setAttribute("for", `contact-checkbox-${contact.id}`);
  row.appendChild(label);
}

/**
 * Sets up the click event for the contact row (toggles selection).
 * @param {HTMLDivElement} row - The row element.
 * @param {string} contactId - The contact's id.
 */
function setupEditContactRowClick(row, contactId) {
  row.addEventListener("click", function (e) {
    e.stopPropagation();
    if (e.target.tagName !== "INPUT" && e.target.tagName !== "LABEL") {
      handleEditContactToggle(contactId);
    }
  });
}

/**
 * Creates the initials circle for a contact.
 * @param {Object} contact - The contact object.
 * @returns {HTMLDivElement} The initials circle element.
 */
function createEditInitialsCircle(contact) {
  const initials = document.createElement("div");
  initials.className = "contact-initials";
  initials.textContent = getInitials(contact.name);
  initials.style.background = getRandomColor(contact.name);
  return initials;
}

/**
 * Creates the name element for a contact.
 * @param {Object} contact - The contact object.
 * @returns {HTMLSpanElement} The contact name element.
 */
function createEditContactName(contact) {
  const name = document.createElement("span");
  name.className = "contact-name";
  name.textContent = contact.name;
  return name;
}

/**
 * Creates a checkbox for contact selection.
 * @param {Object} contact - The contact object.
 * @returns {HTMLInputElement} The checkbox element.
 */
function createEditCheckbox(contact) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "custom-checkbox";
  checkbox.checked = selectedEditContacts.has(contact.id);
  checkbox.addEventListener("change", () =>
    handleEditContactToggle(contact.id)
  );
  return checkbox;
}

/**
 * Toggles a contact's selection in the edit dropdown.
 * @param {string} id - The contact ID.
 */
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
 * Renders the insignia badges for all selected contacts.
 */
export function renderSelectedEditInsignias() {
  const container = document.getElementById(
    "selected-editing-contact-insignias"
  );
  if (!container) return;
  const selectedContacts = allEditContacts.filter((c) =>
    selectedEditContacts.has(c.id)
  );
  renderEditInsigniasBadges(selectedContacts, container);
}

/**
 * Sets up the open/close logic for the edit contacts dropdown.
 */
export function setupEditDropdownOpenClose() {
  const dropdown = document.getElementById("editing-contacts-dropdown");
  const selected = document.getElementById("editing-contacts-selected");
  const panel = document.getElementById("editing-contacts-dropdown-list");

  if (!dropdown || !selected || !panel) return;

  setupDropdownToggle(selected, panel);
  setupDropdownCloseOnClick(dropdown, panel);
  setupDropdownCloseOnEscape(panel);
}

/**
 * Toggles the dropdown panel when the selected element is clicked.
 * @param {HTMLElement} selected - The element that triggers the dropdown.
 * @param {HTMLElement} panel - The dropdown panel element.
 */
function setupDropdownToggle(selected, panel) {
  selected.addEventListener("click", (e) => {
    e.stopPropagation();
    panel.classList.toggle("d-none");
  });
}

/**
 * Closes the dropdown if a click happens outside of it.
 * @param {HTMLElement} dropdown - The dropdown container.
 * @param {HTMLElement} panel - The dropdown panel element.
 */
function setupDropdownCloseOnClick(dropdown, panel) {
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      panel.classList.add("d-none");
    }
  });
}

/**
 * Closes the dropdown when Escape key is pressed.
 * @param {HTMLElement} panel - The dropdown panel element.
 */
function setupDropdownCloseOnEscape(panel) {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      panel.classList.add("d-none");
    }
  });
}

/**
 * Resets all selected contacts (clears set and UI).
 */
export function resetSelectedEditContacts() {
  selectedEditContacts.clear();
  renderEditContactsDropdown();
  renderSelectedEditInsignias();
}
