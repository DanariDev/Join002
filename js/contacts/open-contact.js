import { getContactById } from './load-contacts.js';
import { db } from '../firebase/firebase-init.js';
import { ref, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";


export function setupContactClickEvents() {
  document.querySelectorAll('.contact-entry').forEach(el => {
    el.addEventListener('click', () => openContactDetails(el.dataset.contactId));
  });
  document.getElementById('current-edit').addEventListener('click', () => {
    openEditContactLightbox(document.getElementById('showed-current-contact').dataset.contactId);
  });
  document.getElementById('current-edit-responsive').addEventListener('click', () => {
    openEditContactLightbox(document.getElementById('showed-current-contact').dataset.contactId);
  });
}

async function openContactDetails(id) {
  const contact = await getContactById(id);
  if (!contact) return;
  const card = document.getElementById('showed-current-contact');
  card.dataset.contactId = id;
  fillContactDetails(contact, card);
  showContactCard();
}

function fillContactDetails(contact, card) {
  document.getElementById('current-icon').textContent = getInitials(contact.name);
  document.getElementById('current-name').textContent = contact.name;
  document.getElementById('current-mail').textContent = contact.email;
  document.getElementById('current-mail').href = `mailto:${contact.email}`;
  document.getElementById('current-phone').textContent = contact.phone;
  document.getElementById('current-phone').href = `tel:${contact.phone}`;
}

function showContactCard() {
  const rightSection = document.getElementById('right-section');
  const contactCard = document.getElementById('showed-current-contact');
  rightSection.classList.remove('d-none');
  contactCard.classList.remove('d-none');
  contactCard.classList.add('show');
}

async function openEditContactLightbox(id) {
  const contact = await getContactById(id);
  if (!contact) return;
  const lightbox = document.getElementById('lightbox');
  lightbox.dataset.contactId = id;
  fillEditLightbox(contact);
  showEditLightbox();
  setupLightboxButtons(id);
}

function fillEditLightbox(contact) {
  document.getElementById('edit-name').value = contact.name;
  document.getElementById('edit-email').value = contact.email;
  document.getElementById('edit-phone').value = contact.phone;
}

function showEditLightbox() {
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightbox = document.getElementById('lightbox');
  lightboxOverlay.style.display = 'flex';
  lightbox.classList.add('show');
}

function setupLightboxButtons(id) {
  document.getElementById('saveBtn').onclick = () => saveContactChanges(id);
  document.getElementById('cancelBtn').onclick = closeEditLightbox;
  document.querySelector('.close-button').onclick = closeEditLightbox;
}

async function saveContactChanges(id) {
  const name = document.getElementById('edit-name').value;
  const email = document.getElementById('edit-email').value;
  const phone = document.getElementById('edit-phone').value;
  if (!name || !email || !phone) {
    alert('Bitte alle Felder ausfüllen!');
    return;
  }
  await update(ref(db, `contacts/${id}`), { name, email, phone });
  closeEditLightbox();
  showSuccessMessage();
}

function closeEditLightbox() {
  document.getElementById('lightbox-overlay').style.display = 'none';
  document.getElementById('lightbox').classList.remove('show');
}

function showSuccessMessage() {
  const confirmation = document.querySelector('.confirmation-window');
  confirmation.style.display = 'block';
  setTimeout(() => confirmation.style.display = 'none', 2000);
}

function getInitials(name) {
  const parts = name.split(' ');
  return parts.length === 1 ? parts[0][0] : parts[0][0] + parts[1][0];
}