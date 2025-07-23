import { getContactById } from "./load-contacts.js";
import { openEditContactLightbox } from "./edit-contact.js";
import { getInitials, getRandomColor } from "./contact-style.js";
import { db } from "../firebase/firebase-init.js";
import {
  ref,
  remove,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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
}

async function openContactDetails(id) {
  const contact = await getContactById(id);
  if (!contact) return;
  const card = document.getElementById("showed-current-contact");
  if (!card) return;
  card.dataset.contactId = id;
  fillContactDetails(contact, card);
  showContactCard();
}

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

function showContactCard() {
  const rightSection = document.getElementById("right-section");
  const contactCard = document.getElementById("showed-current-contact");
  if (rightSection && contactCard) {
    rightSection.classList.remove("d-none");
    contactCard.classList.remove("d-none");
    contactCard.classList.add("show");
  }
}
async function deleteContact(id) {
  try {
    await remove(ref(db, `contacts/${id}`));
    closeEditLightbox(); // optional – falls Lightbox noch offen ist
    hideContactCard(); // entfernt die rechte Detailansicht
    showSuccessMessage("Contact deleted!");
  } catch (error) {
    console.error("Error deleting contact:", error);
    showErrorMessage("Error deleting contact!");
  }
}
function showSuccessMessage(message) {
  const window = document.getElementById("confirmation-window");
  if (!window) return;
  window.querySelector("span").textContent = message;
  window.classList.remove("d-none");
  setTimeout(() => window.classList.add("d-none"), 2000);
}

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
