import { getContactById } from "./load-contacts.js";
import { openEditContactLightbox } from "./edit-contact.js";
import { getInitials, getRandomColor } from "./contact-style.js";

export function setupContactClickEvents() {
  document.querySelectorAll(".contact-entry").forEach((el) => {
    el.addEventListener("click", () => openContactDetails(el.dataset.contactId));
  });
  document.getElementById("current-edit")?.addEventListener("click", () => {
    openEditContactLightbox(
      document.getElementById("showed-current-contact").dataset.contactId
    );
  });
  document.getElementById("current-edit-responsive")?.addEventListener("click", () => {
    openEditContactLightbox(
      document.getElementById("showed-current-contact").dataset.contactId
    );
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