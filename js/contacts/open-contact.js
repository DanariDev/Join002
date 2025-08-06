// open-contact.js

import { getContactById } from "./load-contacts.js";
import { openEditContactLightbox, hideContactCard } from "./edit-contact.js";
import { getInitials, getRandomColor } from "./contact-style.js";
import { db } from "../firebase/firebase-init.js";
import { ref, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { closeAllContactOverlays } from "./contacts-utils.js";
import { mediaQuery, handleMediaQueryChange } from "./contact-responsive.js";

/**
 * Sets up all click events for contacts, edit & delete buttons.
 */
export function setupContactClickEvents() {
  setupContactListEvents();
  setupEditEvents();
  setupDeleteEvents();
}

/**
 * Adds click event to each contact in the list to open details.
 */
function setupContactListEvents() {
  document.querySelectorAll(".contact-entry").forEach(el => {
    el.onclick = null;
    el.addEventListener("click", () =>
      openContactDetails(el.dataset.contactId)
    );
  });
}

/**
 * Sets up click events for all edit buttons.
 */
function setupEditEvents() {
  setupBtn("current-edit", handleEdit);
  setupBtn("current-edit-responsive", handleEdit);
}

/**
 * Handler for edit: opens edit contact lightbox.
 */
function handleEdit() {
  const id = getCurrentContactId();
  if (id) openEditContactLightbox(id);
}

/**
 * Sets up click events for all delete buttons.
 */
function setupDeleteEvents() {
  setupBtn("current-delete", handleDelete);
  setupBtn("current-delete-responsive", handleDelete);
}

/**
 * Handler for delete: removes contact from database.
 */
function handleDelete() {
  const id = getCurrentContactId();
  if (id) deleteContact(id);
}

/**
 * Gets the current contact ID from the detail card.
 */
function getCurrentContactId() {
  return document.getElementById("showed-current-contact")?.dataset.contactId;
}

/**
 * Adds a click event to a button by its ID.
 */
function setupBtn(id, fn) {
  const btn = document.getElementById(id);
  if (btn) {
    btn.onclick = null;
    btn.addEventListener("click", fn);
  }
}

/**
 * Opens the contact detail card, fills and animates it.
 */
async function openContactDetails(id) {
  closeAllContactOverlays();
  const contact = await getContactById(id);
  if (!contact) return;
  setContactCardData(id, contact);
  showContactCard();
  setResponsiveState();
}

/**
 * Sets contact card dataset & fills info.
 */
function setContactCardData(id, contact) {
  const card = document.getElementById("showed-current-contact");
  if (!card) return;
  card.dataset.contactId = id;
  fillContactDetails(contact);
}

/**
 * Fills the contact detail card fields.
 */
function fillContactDetails(contact) {
  setInitials(contact.name);
  setContactField("current-name", contact.name);
  setContactLink("current-mail", contact.email, "mailto");
  setContactLink("current-phone", contact.phone, "tel");
}

/**
 * Sets the initials circle with color.
 */
function setInitials(name) {
  const icon = document.getElementById("current-icon");
  if (icon) {
    icon.textContent = getInitials(name);
    icon.style.backgroundColor = getRandomColor(name);
  }
}

/**
 * Sets text for a contact detail field.
 */
function setContactField(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

/**
 * Sets a link field (mail/phone) in contact card.
 */
function setContactLink(id, value, prefix) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = value;
    el.href = `${prefix}:${value}`;
  }
}

/**
 * Shows the contact card with animation.
 */
function showContactCard() {
  const rightSection = document.getElementById("right-section");
  const card = document.getElementById("showed-current-contact");
  if (rightSection && card) {
    rightSection.classList.remove("d-none");
    card.classList.remove("d-none");
    card.classList.add("show");
    rightSection.classList.remove("slide-in");
    void rightSection.offsetWidth;
    rightSection.classList.add("slide-in");
  }
}

/**
 * Handles responsive/mobile state for the UI.
 */
function setResponsiveState() {
  handleMediaQueryChange(mediaQuery);
  document.getElementById('responsive-small-edit')?.classList.remove('d-none');
  if (window.innerWidth <= 1100)
    document.body.classList.add('no-scroll');
}

/**
 * Deletes contact from Firebase and UI.
 */
async function deleteContact(id) {
  try {
    await remove(ref(db, `contacts/${id}`));
    hideContactCard();
    showSuccessMessage("Contact deleted!");
    toggleResponsiveAddBtn(true);
  } catch (error) {
    console.error("Error deleting contact:", error);
    showErrorMessage("Error deleting contact!");
  }
}

/**
 * Shows the responsive add button after delete.
 */
function toggleResponsiveAddBtn(isDelete) {
  document.getElementById('responsive-small-edit')?.classList.add('d-none');
  document.getElementById('responsive-small-add')?.classList.remove('d-none');
}

/**
 * Shows a success message for 2 seconds.
 */
function showSuccessMessage(message) {
  const window = document.getElementById("confirmation-window");
  if (!window) return;
  window.querySelector("span").textContent = message;
  window.classList.remove("d-none");
  window.style.display = "block";    // Sichtbar machen!
  setTimeout(() => {
    window.classList.add("d-none");
    window.style.display = "none";   // Wieder verstecken!
  }, 2000);
}

/**
 * Shows an error message for 2 seconds.
 */
function showErrorMessage(message) {
  const window = document.getElementById("confirmation-window");
  if (!window) return;
  window.querySelector("span").textContent = message;
  window.classList.remove("d-none");
  window.classList.add("error");
  window.style.display = "block";    // Sichtbar machen!
  setTimeout(() => {
    window.classList.add("d-none");
    window.classList.remove("error");
    window.style.display = "none";   // Wieder verstecken!
  }, 2000);
}

/**
 * Displays a confirmation/error message.
 */
function showMessage(message, isError) {
  const win = document.getElementById("confirmation-window");
  console.log('confirmation-window:', win);
  const span = win?.querySelector("span");
  console.log('confirmation span:', span);
  if (!win || !span) return; // <-- Nur hier ist return erlaubt!
  span.textContent = message;
  win.classList.remove("d-none");
  if (isError) win.classList.add("error");
  else win.classList.remove("error");
  setTimeout(() => {
    win.classList.add("d-none");
    win.classList.remove("error");
  }, 2000);
}
// <--- ab hier KEIN return mehr!


/**
 * Closes the contact card and returns to list.
 */
export function backToContactList() {
  document.getElementById('right-section')?.classList.replace('slide-in', 'd-none');
  handleMediaQueryChange(mediaQuery);
  document.getElementById('responsive-small-edit')?.classList.add('d-none');
}
