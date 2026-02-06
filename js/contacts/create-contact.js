import { db } from "../firebase/firebase-init.js";
import { ref, push, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { setupContactClickEvents } from "./open-contact.js";
import { initContactsList } from "./load-contacts.js";
import { checkInput } from "../multiple-application/error-message.js";

/**
 * Initializes all 'add contact' overlay buttons and events.
 */
export function initAddContactOverlay() {
  setupBigAddBtn();
  setupResponsiveAddBtn();
}

/**
 * Sets up the big 'Add Contact' button click event.
 */
function setupBigAddBtn() {
  const btn = document.getElementById("add-contact-btn-big");
  if (!btn) return;
  btn.addEventListener("click", onAddContactBtnClick);
}

/**
 * Handles the click on the big add contact button: resets form, shows overlay, clears errors.
 */
function onAddContactBtnClick() {
  resetContactForm();
  showAddContactOverlay();
  clearErrors();
}

/**
 * Resets the add contact form input fields.
 */
function resetContactForm() {
  setInputValue("new-name", "");
  setInputValue("new-email", "");
  setInputValue("new-phone", "");
}

/**
 * Sets the value of an input by ID.
 * @param {string} id - The element ID.
 * @param {string} value - The value to set.
 */
function setInputValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}

/**
 * Shows the add contact overlay.
 */
function showAddContactOverlay() {
  document.getElementById("add-contact-overlay")?.classList.remove("d-none");
}

/**
 * Clears error styles and error messages from all input fields.
 */
function clearErrors() {
  Array.from(document.getElementsByTagName('input')).forEach(e => e.classList.remove("input-error"));
  document.querySelectorAll(".error-message").forEach(d => d.textContent = "");
}

/**
 * Sets up the responsive add button for mobile view.
 */
function setupResponsiveAddBtn() {
  const responsiveBtn = document.getElementById("responsive-small-add");
  if (!responsiveBtn) return;
  responsiveBtn.addEventListener("click", onAddContactBtnClick);
}

/**
 * Makes the close function globally available (for overlay close icon).
 */
window.closeAddContactOverlay = function () {
  closeAddContactOverlay();
};

/**
 * Hides the add contact overlay.
 */
function closeAddContactOverlay() {
  document.getElementById("add-contact-overlay")?.classList.add("d-none");
}

/**
 * Prevents click events from bubbling inside the overlay box.
 */
document.querySelector(".overlay-box").addEventListener("click", e => e.stopPropagation());

/**
 * Renders the create contact form and sets up the save button.
 */
function renderCreateForm() {
  setInputValue("edit-name", "");
  setInputValue("edit-email", "");
  setInputValue("edit-phone", "");
  const saveBtn = document.getElementById("create-contact-btn");
  if (saveBtn) {
    saveBtn.innerHTML = 'Create contact <img src="assets/img/check.png">';
    saveBtn.onclick = createContact;
  }
}

/**
 * Handles creating and saving a new contact to Firebase.
 * Validates input, saves to DB, and updates the contact list.
 * Shows success or error message.
 * @returns {Promise<void>}
 */
async function createContact() {
  const name = getValue("new-name");
  const email = getValue("new-email");
  const phone = getValue("new-phone");
  let hasError = checkInput("new-name", "new-email", "new-phone", null, null, null, null);
  if (hasError) return;
  try {
    await saveContactToDb({ name, email, phone });
    closeAddContactOverlay();
    showSuccessMessage("Kontakt erstellt!");
    await initContactsList();
    setupContactClickEvents();
  } catch (err) {
    console.error("Fehler beim Erstellen:", err);
    showErrorMessage("Fehler beim Erstellen des Kontakts!");
  }
}

/**
 * Gets the value of an input field by ID.
 * @param {string} id - The input element ID.
 * @returns {string|undefined} The input value.
 */
function getValue(id) {
  return document.getElementById(id)?.value;
}

/**
 * Saves a contact object to Firebase Database.
 * @param {Object} contact - The contact object.
 * @returns {Promise<void>}
 */
async function saveContactToDb(contact) {
  const contactsRef = ref(db, "contacts");
  const newRef = push(contactsRef);
  await set(newRef, contact);
}

/**
 * Shows a green success message in the confirmation window.
 * @param {string} message - The success message text.
 */
function showSuccessMessage(message) {
  showMessage(message, false);
}

/**
 * Shows a red error message in the confirmation window.
 * @param {string} message - The error message text.
 */
function showErrorMessage(message) {
  showMessage(message, true);
}

/**
 * Shows a confirmation or error message for 2 seconds.
 * @param {string} message - The message text.
 * @param {boolean} isError - True if error, false if success.
 */
function showMessage(message, isError) {
  const box = document.getElementById("confirmation-window");
  const span = box?.querySelector("span");
  if (!box || !span) return;
  span.textContent = message;
  box.classList.remove("d-none", "error");
  if (isError) box.classList.add("error");
  box.style.display = "block";
  setTimeout(() => hideMessage(box), 2000);
}

/**
 * Hides the confirmation/error message window.
 * @param {HTMLElement} box - The confirmation window element.
 */
function hideMessage(box) {
  box.style.display = "none";
  box.classList.add("d-none");
  box.classList.remove("error");
}

/**
 * Handles the click on the "Create Contact" button.
 */
document.getElementById("create-contact-btn").addEventListener("click", function (event) {
  event.preventDefault();
  createContact();
});
