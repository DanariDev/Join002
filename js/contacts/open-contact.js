import { getContactById } from './load-contacts.js';

export function setupContactClickEvents() {
  const contactElements = document.querySelectorAll('.contact-entry');

  contactElements.forEach((el) => {
    el.addEventListener('click', () => {
      const contactId = el.dataset.contactId;
      openContactDetails(contactId);
    });
  });
}

async function openContactDetails(id) {
  const contact = await getContactById(id);
  if (!contact) return;

  const rightSection = document.getElementById('right-section');
  const contactCard = document.getElementById('showed-current-contact');

  // Fülle die Felder
  document.getElementById('current-icon').textContent = getInitials(contact.name);
  document.getElementById('current-name').textContent = contact.name;
  document.getElementById('current-mail').textContent = contact.email;
  document.getElementById('current-mail').href = `mailto:${contact.email}`;
  document.getElementById('current-phone').textContent = contact.phone;
  document.getElementById('current-phone').href = `tel:${contact.phone}`;

  // Zeige den rechten Bereich
  rightSection.classList.remove('d-none');
  contactCard.classList.remove('d-none');
  rightSection.classList.add('slide-in');
}

function getInitials(name) {
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0][0];
  return parts[0][0] + parts[1][0];
}
