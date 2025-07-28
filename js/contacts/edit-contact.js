// edit-contact.js
import { getContactById } from "./load-contacts.js";
import { db } from "../firebase/firebase-init.js";
import {
  ref,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getInitials, getRandomColor } from "./contact-style.js";
import { checkInput } from "../multiple-application/error-message.js"

/**
 * Opens the edit contact lightbox, fills fields with contact data, sets up buttons.
 */
export async function openEditContactLightbox(id) {
  const contact = await getContactById(id);
  if (!contact) return;
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  lightbox.dataset.contactId = id;
  fillEditLightbox(contact);
  showEditLightbox();
  setupLightboxButtons(id);
}

/**
 * Fills the edit lightbox fields with contact details.
 */
function fillEditLightbox(contact) {
  const fields = {
    name: document.getElementById("edit-name"),
    email: document.getElementById("edit-email"),
    phone: document.getElementById("edit-phone"),
    icon: document.getElementById("edit-initial-circle"),
  };
  if (!fields.name || !fields.email || !fields.phone || !fields.icon) return;
  fields.name.value = contact.name;
  fields.email.value = contact.email;
  fields.phone.value = contact.phone;
  fields.icon.textContent = getInitials(contact.name);
  fields.icon.style.backgroundColor = getRandomColor(contact.name);
}

/**
 * Shows the edit lightbox overlay and clears errors.
 */
function showEditLightbox() {
  const overlay = document.getElementById("lightbox-overlay");
  const lightbox = document.getElementById("lightbox");
  
  Array.from(document.getElementsByTagName('input')).forEach(e => e.classList.remove("input-error"));
  document.querySelectorAll(".error-message").forEach(d => d.textContent = "");

  if (overlay && lightbox) {
    overlay.classList.remove("d-none");
    overlay.classList.add("d-flex");
    lightbox.classList.add("show");
  }
}

/**
 * Sets up event listeners for save, cancel, close, and delete buttons in lightbox.
 */
function setupLightboxButtons(id) {
  const saveBtn = document.getElementById("saveBtn");
  if (saveBtn) saveBtn.onclick = () => saveContactChanges(id);
  const cancelBtn = document.getElementById("cancelBtn");
  if (cancelBtn) cancelBtn.onclick = closeEditLightbox;
  const closeBtn = document.querySelector(".close-button");
  if (closeBtn) closeBtn.onclick = closeEditLightbox;
  const deleteBtn = document.getElementById("deleteBtn");
  if (deleteBtn) deleteBtn.onclick = () => deleteContact(id);
}

/**
 * Saves changes to contact in Firebase, closes lightbox on success.
 */
async function saveContactChanges(id) {
  const fields = getEditFields();
  let hasError = checkInput("edit-name", "edit-email", "edit-phone", null, null, null, null);
  if (hasError) return;

  try {
    await update(ref(db, `contacts/${id}`), fields);
    closeEditLightbox();
    const card = document.getElementById("showed-current-contact");
    
    showSuccessMessage();
  } catch (error) {
    console.error("Error updating contact:", error);
    showErrorMessage("Fehler beim Speichern!");
  }
  
}

/**
 * Deletes contact from Firebase, closes lightbox on success.
 */
async function deleteContact(id) {
  try {
    await update(ref(db, `contacts/${id}`), fields);
  } catch (error) {
    console.error("Fehler beim Update:", error);
    showErrorMessage("Fehler beim Speichern!");
    return;
  }
  // UI-Update nur wenn Datenbank wirklich ok war!
  closeEditLightbox();
  showSuccessMessage("Kontakt gespeichert!");
  
}

/**
 * Closes the edit lightbox overlay.
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
 * Shows a success message that hides after 2 seconds.
 */
function showSuccessMessage(message = "Contact saved!") {
  const confirmation = document.querySelector(".confirmation-window");
  if (confirmation) {
    confirmation.textContent = message;
    confirmation.classList.remove("error");
    confirmation.classList.add("success");
    confirmation.style.display = "block";
    setTimeout(() => (confirmation.style.display = "none"), 2000);
  }
}

/**
 * Shows an error message that hides after 2 seconds.
 */
function showErrorMessage(message) {
  const confirmation = document.querySelector(".confirmation-window");
  if (confirmation) {
    confirmation.textContent = message;
    confirmation.classList.remove("success");
    confirmation.classList.add("error");
    confirmation.style.display = "block";
    setTimeout(() => (confirmation.style.display = "none"), 2000);
  }
}

/**
 * Hides the contact card and right section.
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
 * Retrieves edited fields from input elements.
 */
function getEditFields() {
  return {
    name: document.getElementById("edit-name")?.value,
    email: document.getElementById("edit-email")?.value,
    phone: document.getElementById("edit-phone")?.value,
  };
}

/**
 * Handles clicks outside the lightbox to close it.
 */
function handleOverlayClick(e) {
  const overlay = document.getElementById("lightbox-overlay");
  const lightbox = document.getElementById("lightbox");
  if (!overlay || !lightbox) return;
  const lightboxVisible = !overlay.classList.contains("d-none");
  if (
    lightboxVisible &&
    !lightbox.contains(e.target) &&
    !e.target.classList.contains("close-button") &&
    !e.target.closest("#current-edit") &&
    !e.target.closest("#current-edit-responsive")
  ) {
    closeEditLightbox();
  }
}

function responsiveEditDeleteMenuOpen(event){
  document.getElementById('current-btns-responsive').classList.remove('d-none');
  document.getElementById('body').classList.add('overflow-hidden');
  setTimeout(() => {document.getElementById('current-btns-responsive').classList.add('show');}, 1);
  document.getElementById('responsive-small-edit').classList.add('d-none');
  event.stopPropagation();
}

function responsiveEditDeleteMenuClose(){
  document.getElementById('current-btns-responsive').classList.remove('show');
  setTimeout(() => {
    document.getElementById('current-btns-responsive').classList.add('d-none');
    document.getElementById('body').classList.remove('overflow-hidden');
  }, 450);
  document.getElementById('responsive-small-edit').classList.remove('d-none');
}

document.addEventListener("click", handleOverlayClick);
document.getElementById('responsive-small-edit').addEventListener("click", responsiveEditDeleteMenuOpen);
document.getElementById('contacts-main').addEventListener("click", responsiveEditDeleteMenuClose)