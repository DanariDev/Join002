// open-contact.js
import { getContactById } from "./load-contacts.js";
import { openEditContactLightbox,hideContactCard } from "./edit-contact.js";
import { getInitials, getRandomColor } from "./contact-style.js";
import { db } from "../firebase/firebase-init.js";
import { ref, remove, } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { closeAllContactOverlays } from "./contacts-utils.js";
import {mediaQuery, handleMediaQueryChange} from "./contact-responsive.js";

/**
 * Sets up click events for contact entries, edit buttons, and delete button.
 */
export function setupContactClickEvents() {
  document.querySelectorAll(".contact-entry").forEach((el) => {
    el.addEventListener("click", () =>
      openContactDetails(el.dataset.contactId)
    );
  });
  document.getElementById("current-edit")?.addEventListener("click", () => {
    openEditContactLightbox(
      document.getElementById("showed-current-contact").dataset.contactId
    );
  });
  document
    .getElementById("current-edit-responsive")
    ?.addEventListener("click", () => {
      openEditContactLightbox(
        document.getElementById("showed-current-contact").dataset.contactId
      );
    });
  document.getElementById("current-delete")?.addEventListener("click", () => {
    const id = document.getElementById("showed-current-contact")?.dataset
      .contactId;
    if (id) deleteContact(id); // Funktion kommt gleich
  });
  document.getElementById("current-delete-responsive")?.addEventListener("click", () => {
    const id = document.getElementById("showed-current-contact")?.dataset
      .contactId;
    if (id) deleteContact(id);
  });
}

/**
 * Opens contact details card, fills with data, shows with animation.
 */
async function openContactDetails(id) {
  closeAllContactOverlays();
  const contact = await getContactById(id);
  if (!contact) return;
  const card = document.getElementById("showed-current-contact");
  if (!card) return;
  card.dataset.contactId = id;
  fillContactDetails(contact, card);
  showContactCard();

  handleMediaQueryChange(mediaQuery);
  document.getElementById('responsive-small-edit').classList.remove('d-none');

  // **Hier einfügen:**
  if (window.innerWidth <= 1100) {
    document.body.classList.add('no-scroll');
  }
}


/**
 * Fills contact details in the card (icon, name, mail, phone).
 */
function fillContactDetails(contact, card) {
  const fields = {
    icon: document.getElementById("current-icon"),
    name: document.getElementById("current-name"),
    mail: document.getElementById("current-mail"),
    phone: document.getElementById("current-phone"),
  };
  if (!fields.icon || !fields.name || !fields.mail || !fields.phone) return;
  fields.icon.textContent = getInitials(contact.name);
  fields.icon.style.backgroundColor = getRandomColor(contact.name);
  fields.name.textContent = contact.name;
  fields.mail.textContent = contact.email;
  fields.mail.href = `mailto:${contact.email}`;
  fields.phone.textContent = contact.phone;
  fields.phone.href = `tel:${contact.phone}`;
}

/**
 * Shows the contact card with slide-in animation.
 */
function showContactCard() {
  const rightSection = document.getElementById("right-section");
  const contactCard = document.getElementById("showed-current-contact");
  if (rightSection && contactCard) {
    rightSection.classList.remove("d-none");
    contactCard.classList.remove("d-none");
    contactCard.classList.add("show");
    // Reinswipen animieren:
    // Erst vorhandene Animation zurücksetzen (damit auch beim Wechsel der Effekt kommt)
    rightSection.classList.remove("slide-in");
    void rightSection.offsetWidth; // Trick zum Zurücksetzen der Animation
    rightSection.classList.add("slide-in");
  }
}

/**
 * Deletes contact from Firebase, hides card, shows success message.
 */
async function deleteContact(id) {
  try {
    await remove(ref(db, `contacts/${id}`));
    hideContactCard();
    showSuccessMessage("Contact deleted!");
    document.getElementById('responsive-small-edit').classList.add('d-none');
    document.getElementById('responsive-small-add').classList.remove('d-none');
  } catch (error) {
    console.error("Error deleting contact:", error);
    showErrorMessage("Error deleting contact!");
  }
}

/**
 * Shows success message in confirmation window, hides after 2 seconds.
 */
function showSuccessMessage(message) {
  const window = document.getElementById("confirmation-window");
  if (!window) return;
  window.querySelector("span").textContent = message;
  window.classList.remove("d-none");
  setTimeout(() => window.classList.add("d-none"), 2000);
}

/**
 * Shows error message in confirmation window, hides after 2 seconds.
 */
function showErrorMessage(message) {
  const window = document.getElementById("confirmation-window");
  if (!window) return;
  window.querySelector("span").textContent = message;
  window.classList.remove("d-none");
  window.classList.add("error");
  setTimeout(() => {
    window.classList.add("d-none");
    window.classList.remove("error");
  }, 2000);
}

export function backToContactList(){
  document.getElementById('right-section').classList.replace('slide-in', 'd-none');
  handleMediaQueryChange(mediaQuery);
  document.getElementById('responsive-small-edit').classList.add('d-none');
}