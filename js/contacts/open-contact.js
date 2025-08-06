import { getContactById } from "./load-contacts.js";
import { openEditContactLightbox, hideContactCard } from "./edit-contact.js";
import { getInitials, getRandomColor } from "./contact-style.js";
import { db } from "../firebase/firebase-init.js";
import { ref, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { closeAllContactOverlays } from "./contacts-utils.js";
import { mediaQuery, handleMediaQueryChange } from "./contact-responsive.js";

/** Sets up all click events for contact entries, edit, and delete buttons */
export function setupContactClickEvents() {
  setupEntryClick();
  setupEditBtns();
  setupDeleteBtns();
}

/** Adds click event to every contact list entry to open its details */
function setupEntryClick() {
  document.querySelectorAll(".contact-entry").forEach(el => {
    el.addEventListener("click", () => openContactDetails(el.dataset.contactId));
  });
}

/** Sets up the edit buttons for contact details */
function setupEditBtns() {
  setupBtn("current-edit", onEdit);
  setupBtn("current-edit-responsive", onEdit);
}

/** Handler for clicking the edit button: opens edit lightbox */
function onEdit() {
  const id = document.getElementById("showed-current-contact").dataset.contactId;
  openEditContactLightbox(id);
}

/** Sets up the delete buttons for contact details */
function setupDeleteBtns() {
  setupBtn("current-delete", onDelete);
  setupBtn("current-delete-responsive", onDelete);
}

/** Handler for clicking the delete button: deletes contact */
function onDelete() {
  const id = document.getElementById("showed-current-contact")?.dataset.contactId;
  if (id) deleteContact(id);
}

/** Adds a click event to a button by its ID */
function setupBtn(id, fn) {
  const el = document.getElementById(id);
  if (el) el.addEventListener("click", fn);
}

/** Opens the contact detail card for a specific contact */
async function openContactDetails(id) {
  closeAllContactOverlays();
  const contact = await getContactById(id);
  if (!contact) return;
  const card = document.getElementById("showed-current-contact");
  if (!card) return;
  fillContactDetails(contact, card);
  showContactCard(id, card);
}

/** Fills the contact details in the contact detail card */
function fillContactDetails(contact, card) {
  setContactField("current-icon", getInitials(contact.name), getRandomColor(contact.name));
  setContactText("current-name", contact.name);
  setContactLink("current-mail", contact.email, "mailto");
  setContactLink("current-phone", contact.phone, "tel");
}

/** Sets the icon initials and background color */
function setContactField(id, text, color) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = text;
    el.style.backgroundColor = color;
  }
}

/** Sets plain text to a given field */
function setContactText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

/** Sets link text and href for email or phone */
function setContactLink(id, value, prefix) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = value;
    el.href = `${prefix}:${value}`;
  }
}

/** Shows the contact detail card and triggers slide-in animation */
function showContactCard(id, card) {
  const rightSection = document.getElementById("right-section");
  if (rightSection && card) {
    rightSection.classList.remove("d-none");
    card.classList.remove("d-none");
    card.classList.add("show");
    rightSection.classList.remove("slide-in");
    void rightSection.offsetWidth;
    rightSection.classList.add("slide-in");
    handleMediaQueryChange(mediaQuery);
    document.getElementById('responsive-small-edit').classList.remove('d-none');
    if (window.innerWidth <= 1100) document.body.classList.add('no-scroll');
  }
}

/** Deletes a contact from Firebase and handles UI update */
async function deleteContact(id) {
  try {
    await remove(ref(db, `contacts/${id}`));
    hideContactCard();
    showSuccessMessage("Contact deleted!");
    showHideResponsiveBtns(true);
  } catch (error) {
    console.error("Error deleting contact:", error);
    showErrorMessage("Error deleting contact!");
  }
}

/** Shows or hides responsive edit/add buttons depending on state */
function showHideResponsiveBtns(isDelete = false) {
  const editBtn = document.getElementById('responsive-small-edit');
  const addBtn = document.getElementById('responsive-small-add');
  if (editBtn && addBtn) {
    if (isDelete) {
      editBtn.classList.add('d-none');
      addBtn.classList.remove('d-none');
    } else {
      editBtn.classList.remove('d-none');
      addBtn.classList.add('d-none');
    }
  }
}

/** Shows a green success message window */
function showSuccessMessage(message) {
  showMessage(message, false);
}

/** Shows a red error message window */
function showErrorMessage(message) {
  showMessage(message, true);
}

/** Displays a message (success or error) for 2 seconds */
function showMessage(message, isError) {
  const window = document.getElementById("confirmation-window");
  if (!window) return;
  window.querySelector("span").textContent = message;
  window.classList.remove("d-none");
  if (isError) window.classList.add("error");
  else window.classList.remove("error");
  setTimeout(() => {
    window.classList.add("d-none");
    window.classList.remove("error");
  }, 2000);
}

/** Closes the contact detail card and returns to the list (responsive) */
export function backToContactList() {
  document.getElementById('right-section').classList.replace('slide-in', 'd-none');
  handleMediaQueryChange(mediaQuery);
  showHideResponsiveBtns();
}
