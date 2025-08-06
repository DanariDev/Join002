import { getContactById } from "./load-contacts.js";
import { openEditContactLightbox, hideContactCard } from "./edit-contact.js";
import { getInitials, getRandomColor } from "./contact-style.js";
import { db } from "../firebase/firebase-init.js";
import { ref, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { closeAllContactOverlays } from "./contacts-utils.js";
import { mediaQuery, handleMediaQueryChange } from "./contact-responsive.js";

export function setupContactClickEvents() {
  setupEntryClick();
  setupEditBtns();
  setupDeleteBtns();
}
function setupEntryClick() {
  document.querySelectorAll(".contact-entry").forEach(el => {
    el.addEventListener("click", () => openContactDetails(el.dataset.contactId));
  });
}
function setupEditBtns() {
  setupBtn("current-edit", onEdit);
  setupBtn("current-edit-responsive", onEdit);
}
function onEdit() {
  const id = document.getElementById("showed-current-contact").dataset.contactId;
  openEditContactLightbox(id);
}
function setupDeleteBtns() {
  setupBtn("current-delete", onDelete);
  setupBtn("current-delete-responsive", onDelete);
}
function onDelete() {
  const id = document.getElementById("showed-current-contact")?.dataset.contactId;
  if (id) deleteContact(id);
}
function setupBtn(id, fn) {
  const el = document.getElementById(id);
  if (el) el.addEventListener("click", fn);
}
async function openContactDetails(id) {
  closeAllContactOverlays();
  const contact = await getContactById(id);
  if (!contact) return;
  const card = document.getElementById("showed-current-contact");
  if (!card) return;
  fillContactDetails(contact, card);
  showContactCard(id, card);
}
function fillContactDetails(contact, card) {
  setContactField("current-icon", getInitials(contact.name), getRandomColor(contact.name));
  setContactText("current-name", contact.name);
  setContactLink("current-mail", contact.email, "mailto");
  setContactLink("current-phone", contact.phone, "tel");
}
function setContactField(id, text, color) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = text;
    el.style.backgroundColor = color;
  }
}
function setContactText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
function setContactLink(id, value, prefix) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = value;
    el.href = `${prefix}:${value}`;
  }
}
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
function showSuccessMessage(message) {
  showMessage(message, false);
}
function showErrorMessage(message) {
  showMessage(message, true);
}
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
export function backToContactList() {
  document.getElementById('right-section').classList.replace('slide-in', 'd-none');
  handleMediaQueryChange(mediaQuery);
  showHideResponsiveBtns();
}
