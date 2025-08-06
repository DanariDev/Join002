import { getContactById } from "./load-contacts.js";
import { db } from "../firebase/firebase-init.js";
import { ref, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getInitials, getRandomColor } from "./contact-style.js";
import { checkInput } from "../multiple-application/error-message.js"

export async function openEditContactLightbox(id) {
  const contact = await getContactById(id);
  if (!contact) return;
  prepareEditLightbox(id, contact);
}
function prepareEditLightbox(id, contact) {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  lightbox.dataset.contactId = id;
  fillEditLightbox(contact);
  showEditLightbox();
  setupLightboxButtons(id);
}
function fillEditLightbox(contact) {
  setFieldValue("edit-name", contact.name);
  setFieldValue("edit-email", contact.email);
  setFieldValue("edit-phone", contact.phone);
  setEditIcon(contact.name);
}
function setFieldValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}
function setEditIcon(name) {
  const icon = document.getElementById("edit-initial-circle");
  if (!icon) return;
  icon.textContent = getInitials(name);
  icon.style.backgroundColor = getRandomColor(name);
}
function showEditLightbox() {
  removeInputErrors();
  removeAllErrorMessages();
  showLightboxElements();
}
function removeInputErrors() {
  Array.from(document.getElementsByTagName('input')).forEach(e => e.classList.remove("input-error"));
}
function removeAllErrorMessages() {
  document.querySelectorAll(".error-message").forEach(d => d.textContent = "");
}
function showLightboxElements() {
  const overlay = document.getElementById("lightbox-overlay");
  const lightbox = document.getElementById("lightbox");
  if (overlay && lightbox) {
    overlay.classList.remove("d-none");
    overlay.classList.add("d-flex");
    lightbox.classList.add("show");
  }
}
function setupLightboxButtons(id) {
  setupBtn("saveBtn", () => saveContactChanges(id));
  setupBtn("cancelBtn", closeEditLightbox);
  setupBtn(".close-button", closeEditLightbox, true);
  setupBtn("deleteBtn", () => deleteContact(id));
  setupBtn("current-delete-responsive", () => deleteContact(id));
}
function setupBtn(id, fn, isClass = false) {
  const btn = isClass ? document.querySelector(id) : document.getElementById(id);
  if (btn) btn.onclick = fn;
}
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
export function closeEditLightbox() {
  const overlay = document.getElementById("lightbox-overlay");
  const lightbox = document.getElementById("lightbox");
  if (overlay && lightbox) {
    overlay.classList.add("d-none");
    overlay.classList.remove("d-flex");
    lightbox.classList.remove("show");
  }
}
function showSuccessMessage(message = "Contact saved!") {
  showMessage(message, false);
}
function showErrorMessage(message) {
  showMessage(message, true);
}
function showMessage(message, isError) {
  const confirmation = document.querySelector(".confirmation-window");
  if (!confirmation) return;
  confirmation.textContent = message;
  confirmation.classList.remove("error", "success");
  confirmation.classList.add(isError ? "error" : "success");
  confirmation.style.display = "block";
  setTimeout(() => (confirmation.style.display = "none"), 2000);
}
export function hideContactCard() {
  const rightSection = document.getElementById("right-section");
  const contactCard = document.getElementById("showed-current-contact");
  if (rightSection && contactCard) {
    rightSection.classList.add("d-none");
    contactCard.classList.add("d-none");
    contactCard.classList.remove("show");
  }
}
function getEditFields() {
  return {
    name: document.getElementById("edit-name")?.value,
    email: document.getElementById("edit-email")?.value,
    phone: document.getElementById("edit-phone")?.value,
  };
}
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
function responsiveEditDeleteMenuOpen(event) {
  showResponsiveBtns();
  hideResponsiveEditBtn();
  event.stopPropagation();
}
function showResponsiveBtns() {
  document.getElementById('current-btns-responsive').classList.remove('d-none');
  document.getElementById('body').classList.add('overflow-hidden');
  setTimeout(() => {
    document.getElementById('current-btns-responsive').classList.add('show');
  }, 1);
}
function hideResponsiveEditBtn() {
  document.getElementById('responsive-small-edit').classList.add('d-none');
}
function responsiveEditDeleteMenuClose() {
  document.getElementById('current-btns-responsive').classList.remove('show');
  setTimeout(() => {
    document.getElementById('current-btns-responsive').classList.add('d-none');
    document.getElementById('body').classList.remove('overflow-hidden');
  }, 450);
  document.getElementById('responsive-small-edit').classList.remove('d-none');
}

/* === EventListener === */
document.addEventListener("click", handleOverlayClick);
document.getElementById('responsive-small-edit').addEventListener("click", responsiveEditDeleteMenuOpen);
document.getElementById('contacts-main').addEventListener("click", responsiveEditDeleteMenuClose);
