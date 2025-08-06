import { getContactById } from "./load-contacts.js";
import { db } from "../firebase/firebase-init.js";
import { ref, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getInitials, getRandomColor } from "./contact-style.js";
import { checkInput } from "../multiple-application/error-message.js";

/**
 * Opens the edit contact lightbox for a given contact ID.
 * @param {string} id - The contact ID.
 */
export async function openEditContactLightbox(id) {
  const contact = await getContactById(id);
  if (!contact) return;
  prepareEditLightbox(id, contact);
}

/**
 * Prepares and shows the edit contact lightbox with contact data.
 * @param {string} id - The contact ID.
 * @param {Object} contact - The contact object.
 */
function prepareEditLightbox(id, contact) {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  lightbox.dataset.contactId = id;
  fillEditLightbox(contact);
  showEditLightbox();
  setupLightboxButtons(id);
}

/**
 * Fills the edit form in the lightbox with contact data.
 * @param {Object} contact - The contact object.
 */
function fillEditLightbox(contact) {
  setFieldValue("edit-name", contact.name);
  setFieldValue("edit-email", contact.email);
  setFieldValue("edit-phone", contact.phone);
  setEditIcon(contact.name);
}

/**
 * Sets a value to an input field by ID.
 * @param {string} id - The input element ID.
 * @param {string} value - The value to set.
 */
function setFieldValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}

/**
 * Sets the initials and color in the edit icon circle.
 * @param {string} name - The contact's name.
 */
function setEditIcon(name) {
  const icon = document.getElementById("edit-initial-circle");
  if (!icon) return;
  icon.textContent = getInitials(name);
  icon.style.backgroundColor = getRandomColor(name);
}

/**
 * Shows the edit lightbox and removes errors/messages.
 */
function showEditLightbox() {
  removeInputErrors();
  removeAllErrorMessages();
  showLightboxElements();
}

/**
 * Removes error styling from all input fields.
 */
function removeInputErrors() {
  Array.from(document.getElementsByTagName('input')).forEach(e => e.classList.remove("input-error"));
}

/**
 * Removes all error messages from the edit form.
 */
function removeAllErrorMessages() {
  document.querySelectorAll(".error-message").forEach(d => d.textContent = "");
}

/**
 * Makes the lightbox and overlay visible.
 */
function showLightboxElements() {
  const overlay = document.getElementById("lightbox-overlay");
  const lightbox = document.getElementById("lightbox");
  if (overlay && lightbox) {
    overlay.classList.remove("d-none");
    overlay.classList.add("d-flex");
    lightbox.classList.add("show");
  }
}

/**
 * Sets up all buttons inside the lightbox with their handlers.
 * @param {string} id - The contact ID.
 */
function setupLightboxButtons(id) {
  setupBtn("saveBtn", () => saveContactChanges(id));
  setupBtn("cancelBtn", closeEditLightbox);
  setupBtn(".close-button", closeEditLightbox, true);
  setupBtn("deleteBtn", () => deleteContact(id));
  setupBtn("current-delete-responsive", () => deleteContact(id));
}

/**
 * Assigns a function to a button (by ID or class).
 * @param {string} id - The element ID or selector.
 * @param {Function} fn - The function to assign.
 * @param {boolean} [isClass=false] - If true, uses querySelector instead of getElementById.
 */
function setupBtn(id, fn, isClass = false) {
  const btn = isClass ? document.querySelector(id) : document.getElementById(id);
  if (btn) btn.onclick = fn;
}

/**
 * Saves the edited contact fields to Firebase.
 * @param {string} id - The contact ID.
 */
async function saveContactChanges(id) {
  const fields = getEditFields();
  let hasError = checkInput("edit-name", "edit-email", "edit-phone", null, null, null, null);
  if (hasError) return;
  try {
    await update(ref(db, `contacts/${id}`), fields);
    closeEditLightbox();
    showSuccessMessage();
  } catch (error) {
    console.error("Error updating contact:", error);
    showErrorMessage("Fehler beim Speichern!");
  }
}

/**
 * Deletes the contact from Firebase by ID.
 * @param {string} id - The contact ID.
 */
async function deleteContact(id) {
  try {
    await remove(ref(db, `contacts/${id}`));
    closeEditLightbox();
    showSuccessMessage("Kontakt gelöscht!");
  } catch (error) {
    console.error("Fehler beim Löschen:", error);
    showErrorMessage("Fehler beim Löschen!");
  }
}

/**
 * Closes the edit lightbox and overlay.
 */
export function closeEditLightbox() {
  const overlay = document.getElementById("lightbox-overlay");
  const lightbox = document.getElementById("lightbox");
  if (overlay && lightbox) {
    overlay.classList.add("d-none");
    overlay.classList.remove("d-flex");
    lightbox.classList.remove("show");
  }
}

/**
 * Shows a success message in the confirmation window.
 * @param {string} [message="Contact saved!"] - The message to show.
 */
function showSuccessMessage(message = "Contact saved!") {
  showMessage(message, false);
}

/**
 * Shows an error message in the confirmation window.
 * @param {string} message - The error message.
 */
function showErrorMessage(message) {
  showMessage(message, true);
}

/**
 * Shows a confirmation (success/error) message for 2 seconds.
 * @param {string} message - The message to show.
 * @param {boolean} isError - True if error, false if success.
 */
function showMessage(message, isError) {
  const confirmation = document.querySelector(".confirmation-window");
  if (!confirmation) return;
  confirmation.textContent = message;
  confirmation.classList.remove("error", "success");
  confirmation.classList.add(isError ? "error" : "success");
  confirmation.style.display = "block";
  setTimeout(() => (confirmation.style.display = "none"), 2000);
}

/**
 * Hides the contact card and right section panel.
 */
export function hideContactCard() {
  const rightSection = document.getElementById("right-section");
  const contactCard = document.getElementById("showed-current-contact");
  if (rightSection && contactCard) {
    rightSection.classList.add("d-none");
    contactCard.classList.add("d-none");
    contactCard.classList.remove("show");
  }
}

/**
 * Collects the edited fields from the edit form.
 * @returns {Object} The edited contact fields.
 */
function getEditFields() {
  return {
    name: document.getElementById("edit-name")?.value,
    email: document.getElementById("edit-email")?.value,
    phone: document.getElementById("edit-phone")?.value,
  };
}

/**
 * Handles closing the lightbox if clicking outside of it.
 * @param {MouseEvent} e - The click event.
 */
function handleOverlayClick(e) {
  const overlay = document.getElementById("lightbox-overlay");
  const lightbox = document.getElementById("lightbox");
  if (!overlay || !lightbox) return;
  const visible = !overlay.classList.contains("d-none");
  if (
    visible &&
    !lightbox.contains(e.target) &&
    !e.target.classList.contains("close-button") &&
    !e.target.closest("#current-edit") &&
    !e.target.closest("#current-edit-responsive")
  ) {
    closeEditLightbox();
  }
}

/**
 * Opens the responsive edit/delete menu.
 * @param {MouseEvent} event - The click event.
 */
function responsiveEditDeleteMenuOpen(event) {
  showResponsiveBtns();
  hideResponsiveEditBtn();
  event.stopPropagation();
}

/**
 * Shows the responsive edit/delete buttons.
 */
function showResponsiveBtns() {
  document.getElementById('current-btns-responsive').classList.remove('d-none');
  document.getElementById('body').classList.add('overflow-hidden');
  setTimeout(() => {
    document.getElementById('current-btns-responsive').classList.add('show');
  }, 1);
}

/**
 * Hides the responsive edit button.
 */
function hideResponsiveEditBtn() {
  document.getElementById('responsive-small-edit').classList.add('d-none');
}

/**
 * Closes the responsive edit/delete menu.
 */
function responsiveEditDeleteMenuClose() {
  document.getElementById('current-btns-responsive').classList.remove('show');
  setTimeout(() => {
    document.getElementById('current-btns-responsive').classList.add('d-none');
    document.getElementById('body').classList.remove('overflow-hidden');
  }, 450);
  document.getElementById('responsive-small-edit').classList.remove('d-none');
}

/* === EventListener === */

/**
 * Handles click outside the lightbox to close it.
 */
document.addEventListener("click", handleOverlayClick);

/**
 * Handles click on responsive small edit button to open menu.
 */
document.getElementById('responsive-small-edit').addEventListener("click", responsiveEditDeleteMenuOpen);

/**
 * Handles click on contacts main to close responsive menu.
 */
document.getElementById('contacts-main').addEventListener("click", responsiveEditDeleteMenuClose);
