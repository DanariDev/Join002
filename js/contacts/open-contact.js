// open-contact.js

import { getContactById } from "./load-contacts.js";
import { openEditContactLightbox, hideContactCard } from "./edit-contact.js";
import { getInitials, getRandomColor } from "./contact-style.js";
import { closeAllContactOverlays } from "./contacts-utils.js";
import { mediaQuery, handleMediaQueryChange } from "./contact-responsive.js";
import { api } from "../api/client.js";

/**
 * Sets up all click events for contact list, edit and delete buttons.
 */
export function setupContactClickEvents() {
  setupContactListEvents();
  setupEditEvents();
  setupDeleteEvents();
}

/**
 * Adds click events to each contact entry in the list.
 */
function setupContactListEvents() {
  document.querySelectorAll(".contact-entry").forEach(el => {
    el.onclick = null;
    el.addEventListener("click", () => openContactDetails(el.dataset.contactId));
  });
}

/**
 * Adds click events for edit buttons (desktop & responsive).
 */
function setupEditEvents() {
  setupBtn("current-edit", handleEdit);
  setupBtn("current-edit-responsive", handleEdit);
}

/**
 * Handles edit button click: opens the edit contact lightbox.
 */
function handleEdit() {
  const id = getCurrentContactId();
  if (id) openEditContactLightbox(id);
}

/**
 * Adds click events for delete buttons (desktop & responsive).
 */
function setupDeleteEvents() {
  setupBtn("current-delete", handleDelete);
  setupBtn("current-delete-responsive", handleDelete);
}

/**
 * Handles delete button click: deletes the contact from database.
 */
function handleDelete() {
  const id = getCurrentContactId();
  if (id) deleteContact(id);
}

/**
 * Returns the current contact ID from detail card.
 * @returns {string|undefined} The contact ID.
 */
function getCurrentContactId() {
  return document.getElementById("showed-current-contact")?.dataset.contactId;
}

/**
 * Adds a click event to a button by its ID.
 * @param {string} id - Button element ID.
 * @param {function} fn - Callback function.
 */
function setupBtn(id, fn) {
  const btn = document.getElementById(id);
  if (btn) {
    btn.onclick = null;
    btn.addEventListener("click", fn);
  }
}

/**
 * Opens the contact detail card, fills all fields and animates it.
 * @param {string} id - Contact ID.
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
 * Sets contact card dataset and fills details.
 * @param {string} id - Contact ID.
 * @param {Object} contact - Contact data object.
 */
function setContactCardData(id, contact) {
  const card = document.getElementById("showed-current-contact");
  if (!card) return;
  card.dataset.contactId = id;
  fillContactDetails(contact);
}

/**
 * Fills all fields in the contact detail card.
 * @param {Object} contact - Contact data object.
 */
function fillContactDetails(contact) {
  setInitials(contact.name);
  setContactField("current-name", contact.name);
  setContactLink("current-mail", contact.email, "mailto");
  setContactLink("current-phone", contact.phone, "tel");
}

/**
 * Sets the initials circle with a color.
 * @param {string} name - Contact name.
 */
function setInitials(name) {
  const icon = document.getElementById("current-icon");
  if (icon) {
    icon.textContent = getInitials(name);
    icon.style.backgroundColor = getRandomColor(name);
  }
}

/**
 * Sets the text of a contact detail field.
 * @param {string} id - Field element ID.
 * @param {string} text - Field text.
 */
function setContactField(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

/**
 * Sets a link field (mail or phone) in the contact card.
 * @param {string} id - Element ID.
 * @param {string} value - Link value (email/phone).
 * @param {string} prefix - Link prefix ("mailto"/"tel").
 */
function setContactLink(id, value, prefix) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = value;
    el.href = `${prefix}:${value}`;
  }
}

/**
 * Shows the contact card and plays the slide-in animation.
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
 * Handles responsive/mobile UI state after showing a contact.
 */
function setResponsiveState() {
  handleMediaQueryChange(mediaQuery);
  document.getElementById('responsive-small-edit')?.classList.remove('d-none');
  if (window.innerWidth <= 1100)
    document.body.classList.add('no-scroll');
}

/**
 * Deletes contact from Firebase and hides card on success.
 * @param {string} id - Contact ID.
 */
async function deleteContact(id) {
  try {
    await api.deleteContact(id);
    hideContactCard();
    showSuccessMessage("Contact deleted!");
    toggleResponsiveAddBtn(true);
  } catch (error) {
    showErrorMessage("Error deleting contact!");
  }
}

/**
 * Shows the responsive add button after deleting a contact.
 * @param {boolean} isDelete - Always true for delete.
 */
function toggleResponsiveAddBtn(isDelete) {
  document.getElementById('responsive-small-edit')?.classList.add('d-none');
  document.getElementById('responsive-small-add')?.classList.remove('d-none');
}

/**
 * Shows a success message for 2 seconds.
 * @param {string} message - Message text.
 */
function showSuccessMessage(message) {
  const msgWindow = document.getElementById("confirmation-window");
  if (!msgWindow) return;
  msgWindow.querySelector("span").textContent = message;
  msgWindow.classList.remove("d-none");
  msgWindow.style.display = "block";
  setTimeout(() => {
    msgWindow.classList.add("d-none");
    msgWindow.style.display = "none";
  }, 2000);
}

/**
 * Shows an error message for 2 seconds.
 * @param {string} message - Message text.
 */
function showErrorMessage(message) {
  const msgWindow = document.getElementById("confirmation-window");
  if (!msgWindow) return;
  msgWindow.querySelector("span").textContent = message;
  msgWindow.classList.remove("d-none");
  msgWindow.classList.add("error");
  msgWindow.style.display = "block";
  setTimeout(() => {
    msgWindow.classList.add("d-none");
    msgWindow.classList.remove("error");
    msgWindow.style.display = "none";
  }, 2000);
}

/**
 * Shows a confirmation or error message.
 * @param {string} message - The message text.
 * @param {boolean} isError - Whether it's an error message.
 */
/**
 * Closes the contact card and shows the contact list.
 */
export function backToContactList() {
  document.getElementById('right-section')?.classList.replace('slide-in', 'd-none');
  handleMediaQueryChange(mediaQuery);
  document.getElementById('responsive-small-edit')?.classList.add('d-none');
}
