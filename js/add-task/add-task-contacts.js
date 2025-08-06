import { db } from "../firebase/firebase-init.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getInitials, getRandomColor } from "../contacts/contact-style.js";

let allContacts = [];
let selectedContacts = new Set();

/**
 * Initializes the contact dropdown and loads all contacts from the database.
 * Fetches contacts from Firebase and triggers the dropdown rendering.
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
 * Renders all contacts into the dropdown list.
 */
function renderContactsDropdown() {
  const dropdownList = document.getElementById("contacts-dropdown-list");
  dropdownList.innerHTML = "";
  allContacts.forEach(contact => addContactRowToDropdown(dropdownList, contact));
}

/**
 * Adds a single contact row to the dropdown list.
 * @param {HTMLElement} dropdownList - The dropdown container element.
 * @param {Object} contact - The contact object to add.
 */
function addContactRowToDropdown(dropdownList, contact) {
  const row = createContactRow(contact);
  dropdownList.appendChild(row);
}

/**
 * Creates a contact row element.
 * @param {Object} contact - The contact object.
 * @returns {HTMLElement} The row element.
 */
function createContactRow(contact) {
  const row = document.createElement("div");
  row.className = "contacts-dropdown-item";
  setSelectedClass(row, contact.id);
  addContactRowContent(row, contact);
  addClickHandlerToContactRow(row, contact);
  return row;
}

/**
 * Adds "selected" class to the row if the contact is selected.
 * @param {HTMLElement} row - The row element.
 * @param {string} contactId - The contact's ID.
 */
function setSelectedClass(row, contactId) {
  if (selectedContacts.has(contactId)) {
    row.classList.add("selected");
  }
}

/**
 * Fills a row with initials, name, checkbox, and label.
 * @param {HTMLElement} row - The row element.
 * @param {Object} contact - The contact object.
 */
function addContactRowContent(row, contact) {
  row.appendChild(createInitialsCircle(contact));
  row.appendChild(createContactName(contact));
  row.appendChild(createCheckbox(contact));
  row.appendChild(createContactLabel(contact));
}

/**
 * Adds click event to a row for toggling selection.
 * @param {HTMLElement} row - The row element.
 * @param {Object} contact - The contact object.
 */
function addClickHandlerToContactRow(row, contact) {
  row.addEventListener("click", function (e) {
    e.stopPropagation();
    if (e.target.tagName !== "INPUT" && e.target.tagName !== "LABEL") {
      handleContactToggle(contact.id);
    }
  });
}

/**
 * Creates the initials circle for the contact.
 * @param {Object} contact - The contact object.
 * @returns {HTMLElement} The initials div.
 */
function createInitialsCircle(contact) {
  const initials = document.createElement("div");
  initials.className = "contact-initials";
  initials.textContent = getInitials(contact.name);
  initials.style.background = getRandomColor(contact.name);
  return initials;
}

/**
 * Creates a span with the contact's name.
 * @param {Object} contact - The contact object.
 * @returns {HTMLElement} The name span.
 */
function createContactName(contact) {
  const name = document.createElement("span");
  name.className = "contact-name";
  name.textContent = contact.name;
  return name;
}

/**
 * Creates a checkbox for the contact row.
 * @param {Object} contact - The contact object.
 * @returns {HTMLInputElement} The checkbox element.
 */
function createCheckbox(contact) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "custom-checkbox";
  checkbox.id = `contact-checkbox-${contact.id}`;
  checkbox.checked = selectedContacts.has(contact.id);
  checkbox.addEventListener("change", () => handleContactToggle(contact.id));
  return checkbox;
}

/**
 * Creates a label for the contact checkbox (for accessibility).
 * @param {Object} contact - The contact object.
 * @returns {HTMLLabelElement} The label element.
 */
function createContactLabel(contact) {
  const label = document.createElement("label");
  label.setAttribute("for", `contact-checkbox-${contact.id}`);
  return label;
}

/**
 * Toggles contact selection (add/remove from selected contacts).
 * @param {string} id - The contact's ID.
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
 * Shows up to 3 selected contacts as insignias (+X for more).
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
    more.title = "More contacts selected";
    container.appendChild(more);
  }
}

/**
 * Creates an insignia (badge) for a selected contact.
 * @param {Object} contact - The contact object.
 * @returns {HTMLElement} The insignia element.
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
 * Returns an array of currently selected contact IDs.
 * @returns {Array<string>} Array of selected contact IDs.
 */
export function getSelectedContactIds() {
  return Array.from(selectedContacts);
}

/**
 * Sets up open/close events for the dropdown panel.
 */
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

/**
 * Resets selection and UI for contacts (e.g., after save/clear).
 */
export function resetSelectedContacts() {
  selectedContacts.clear();
  renderContactsDropdown();
  renderSelectedInsignias();
}

/**
 * Toggles the dropdown panel open/close.
 * @param {Event} event - The event object.
 */
function openClose(event) {
  const panel = document.getElementById("contacts-dropdown-panel");
  event.stopPropagation();
  panel.classList.toggle("d-none");
}
