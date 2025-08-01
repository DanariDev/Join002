// create-contact.js
import { db } from "../firebase/firebase-init.js";
import { ref, push, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { setupContactClickEvents } from "./open-contact.js";
import { closeAllContactOverlays } from "./contacts-utils.js";
import { initContactsList } from "./load-contacts.js";
import { checkInput } from "../multiple-application/error-message.js"

/**
 * Initializes add contact button to open overlay and clear fields/errors.
 */
export function initAddContactOverlay() {
  const btn = document.getElementById("add-contact-btn-big");
  if (!btn) return;
  btn.addEventListener("click", () => {
    closeAllContactOverlays();
    document.getElementById('new-name').value ="";
    document.getElementById('new-email').value ="";
    document.getElementById('new-phone').value ="";
    document.getElementById("add-contact-overlay")?.classList.remove("d-none");

    Array.from(document.getElementsByTagName('input')).forEach(e => e.classList.remove("input-error"));
    document.querySelectorAll(".error-message").forEach(d => d.textContent = "");
  });
  responsiveAddContakt();
}

function responsiveAddContakt(){
  const responsiveBtn = document.getElementById("responsive-small-add");
  if (!responsiveBtn) return;
  responsiveBtn.addEventListener("click", () => {
    closeAllContactOverlays();
    document.getElementById('new-name').value ="";
    document.getElementById('new-email').value ="";
    document.getElementById('new-phone').value ="";
    document.getElementById("add-contact-overlay")?.classList.remove("d-none");

    Array.from(document.getElementsByTagName('input')).forEach(e => e.classList.remove("input-error"));
    document.querySelectorAll(".error-message").forEach(d => d.textContent = "");
  });
}

/**
 * Closes the add contact overlay.
 */
window.closeAddContactOverlay = function () {
  document.getElementById("add-contact-overlay")?.classList.add("d-none");
};

document.querySelector(".overlay-box").addEventListener("click", (event) => {
  event.stopPropagation(); // Verhindert, dass das Event an übergeordnete Elemente weitergegeben wird
});

/**
 * Opens the add contact overlay.
 */
function openAddContactOverlay() {
  const overlay = document.getElementById("add-contact-overlay");
  if (!overlay) {
    console.error("Overlay not found");
    return;
  }
  overlay.classList.remove("d-none");
}

/**
 * Renders (clears) the create form fields and sets button to create mode.
 */
function renderCreateForm() {
  const name = document.getElementById("edit-name");
  const email = document.getElementById("edit-email");
  const phone = document.getElementById("edit-phone");
  const saveBtn = document.getElementById("create-contact-btn");

  if (name) name.value = "";
  if (email) email.value = "";
  if (phone) phone.value = "";
  if (saveBtn) {
    saveBtn.innerHTML = 'Create contact <img src="assets/img/check.png">';
    saveBtn.onclick = createContact;
  }
}

/**
 * Creates a new contact in Firebase, closes overlay, refreshes list on success.
 */
async function createContact() {
  const name = document.getElementById("new-name")?.value;
  const email = document.getElementById("new-email")?.value;
  const phone = document.getElementById("new-phone")?.value;

  let hasError = checkInput("new-name", "new-email", "new-phone", null, null, null, null);
  if (hasError) return;

  try {
    const contactsRef = ref(db, "contacts");
    const newRef = push(contactsRef);
    await set(newRef, { name, email, phone });
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
 * Closes the add contact overlay.
 */
function closeAddContactOverlay() {
  const overlay = document.getElementById("add-contact-overlay");
  if (overlay) {
    overlay.classList.add("d-none");
  }
}

/**
 * Shows success message in confirmation window, hides after 2 seconds.
 */
function showSuccessMessage(message) {
  const box = document.getElementById("confirmation-window");
  const span = box?.querySelector("span");
  if (!box || !span) return;
  span.textContent = message;
  box.classList.remove("d-none", "error");
  box.style.display = "block";
  setTimeout(() => {
    box.style.display = "none";
    box.classList.add("d-none");
  }, 2000);
}

/**
 * Shows error message in confirmation window, hides after 2 seconds.
 */
function showErrorMessage(message) {
  const box = document.getElementById("confirmation-window");
  const span = box?.querySelector("span");
  if (!box || !span) return;
  span.textContent = message;
  box.classList.remove("d-none");
  box.classList.add("error");
  box.style.display = "block";
  setTimeout(() => {
    box.style.display = "none";
    box.classList.add("d-none");
    box.classList.remove("error");
  }, 2000);
}

document.getElementById("create-contact-btn").addEventListener("click", function (event) {
  event.preventDefault();
  createContact();
});