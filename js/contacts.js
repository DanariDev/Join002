import {
  ref,
  set,
  push,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { db } from "./firebase-config.js";
import {
  fetchContacts,
  addContact,
  updateContact,
  removeContact,
  removeUserByEmail,
  removeContactFromAllTasks,
  getInitials,
  getColorForName,
} from "./contacts-data.js";

const mediaQuery = window.matchMedia("(max-width: 1100px)");
let contacts = [],
  groupedContacts = [],
  selectedContact = null;

/** Initializes and displays the contacts list */
async function initContactsList() {
  await createList();
  sortList();
  generateSortedContacts();
}

/** Fetches contacts from Firebase and builds list */
async function createList() {
  getElement("contacts-list-wrapper").innerHTML = "";
  contacts = [];
  groupedContacts = [];
  const data = await fetchContacts();
  Object.keys(data).forEach((key) =>
    contacts.push({ id: key, contact: data[key] })
  );
}

/** Sorts contacts and groups by first letter */
function sortList() {
  contacts.sort((a, b) => a.contact.name.localeCompare(b.contact.name));
  groupedContacts = {};
  contacts.forEach((el) => {
    let letter = el.contact.name[0].toUpperCase();
    groupedContacts[letter] = groupedContacts[letter] || [];
    groupedContacts[letter].push(el);
  });
}

/** Generates HTML for grouped contacts */
function generateSortedContacts() {
  Object.keys(groupedContacts)
    .sort()
    .forEach((letter) => {
      getElement("contacts-list-wrapper").innerHTML +=
        createAlphabetAndGroupTemplate(letter);
      groupedContacts[letter].forEach((_, x) => {
        getElement(`list-group-${letter}`).innerHTML += getInformation(
          letter,
          x
        );
      });
    });
  setupContactEvents();
  handleMediaQueryChange(mediaQuery);
}

/** Sets up click events for contact elements */
function setupContactEvents() {
  document.querySelectorAll(".list-contact-wrapper").forEach((el) => {
    const letter = el.dataset.letter,
      index = parseInt(el.dataset.index);
    el.onclick = () =>
      findCurrentContact(`contact${letter}-${index}`, letter, index);
  });
}

/** Creates HTML for a contact entry */
function getInformation(letter, index) {
  const {
    contact: { initials, name, email },
  } = groupedContacts[letter][index];
  return informationTemplate(
    name,
    letter,
    index,
    getColorForName(name),
    email,
    initials
  );
}

/** Selects and displays a contact */
function findCurrentContact(idNumber, letter, index) {
  const contact = groupedContacts[letter][index].contact;
  selectedContact = { id: groupedContacts[letter][index].id, ...contact };
  showContactCard(contact, idNumber);
  setTimeout(
    () => getElement("showed-current-contact").classList.add("show"),
    10
  );
  document.getElementById('responsive-small-edit').classList.remove('d-none');
}

/** Shows contact card with details */
function showContactCard(contact, idNumber) {
  const card = getElement("showed-current-contact");
  card.classList.replace("d-none", "d-flex");
  const icon = getElement("current-icon");
  icon.innerHTML = contact.initials;
  icon.style.backgroundColor = getColorForName(contact.name);
  fillCurrentContact(contact);
  showCurrentContact(idNumber);
}

/** Fills contact card with data */
function fillCurrentContact({ name, email, phone }) {
  getElement("current-name").innerHTML = name;
  const mail = getElement("current-mail");
  mail.href = `mailto:${email}`;
  mail.textContent = email;
  const phoneEl = getElement("current-phone");
  phoneEl.href = `tel:${phone}`;
  phoneEl.textContent = phone;
}

/** Highlights selected contact */
function showCurrentContact(idNumber) {
  toggleElements("right-section", "responsive-small-edit", null, false);
  getElement("responsive-small-add").classList.add("d-none");
  document
    .querySelectorAll(".choosen")
    .forEach((el) => el.classList.remove("choosen"));
  getElement(idNumber).classList.add("choosen");
}

/** Opens lightbox for add/edit contact */
function openLightbox(mode) {
  const overlay = getElement("lightbox-overlay");
  overlay.classList.replace("d-none", "d-flex");
  document.body.style.overflow = "hidden";
  const lightbox = getElement("lightbox");
  lightbox.innerHTML = "";
  renderLightboxTemplates(mode, lightbox);
  setupLightboxEvents(mode);
  getElement("lightbox-ol-close-btn").onclick = closeLightbox;
  closeEditResponsive();
}

/** Renders lightbox templates */
function renderLightboxTemplates(mode, lightbox) {
  const left = mode === "add" ? leftAddingTemplate() : leftEditingTemplate();
  const right = mode === "add" ? rightAddingTemplate() : rightEditingTemplate();
  lightbox.appendChild(document.createRange().createContextualFragment(left));
  lightbox.appendChild(document.createRange().createContextualFragment(right));
  if (mode === "edit") fillEditForm();
  setTimeout(() => lightbox.classList.add("show"), 10);
}

/** Fills edit form with contact data */
function fillEditForm() {
  if (!selectedContact) return;
  const icon = getElement("edit-icon");
  icon.innerText = selectedContact.initials || "";
  icon.style.backgroundColor = getColorForName(selectedContact.name);
  getElement("edit-name").value = selectedContact.name || "";
  getElement("edit-email").value = selectedContact.email || "";
  getElement("edit-phone").value = selectedContact.phone || "";
}

/** Sets up lightbox button events */
function setupLightboxEvents(mode) {
  if (mode === "add") {
    getElement("create-btn").onclick = (e) => {
      e.preventDefault();
      addNewContact();
    };
    getElement("cancel-btn").onclick = (e) => {
      e.preventDefault();
      closeLightbox();
    };
  } else {
    getElement("saveBtn").onclick = () =>
      selectedContact?.id
        ? saveContactEdits(selectedContact.id)
        : alert("No contact!");
    getElement("deleteBtn").onclick = () =>
      selectedContact?.id
        ? opendeleteContactQuery(selectedContact.id)
        : alert("No contact!");
  }
}

/** Closes the lightbox */
function closeLightbox() {
  getElement("lightbox").classList.remove("show");
  setTimeout(() => {
    getElement("lightbox-overlay").classList.replace("d-flex", "d-none");
    document.body.style.overflow = "auto";
  }, 400);
}

/** Saves edited contact data */
async function saveContactEdits(contactId) {
  const { hasError, name, email, phone } = checkInput();
  if (hasError) return;

  await updateContact(contactId, {
    name,
    email,
    phone,
    initials: getInitials(name),
  });
  updateUIAfterEdit();
  closeEditResponsive();
}

/** Updates UI after edit/delete */
function updateUIAfterEdit() {
  const lastId = selectedContact?.id;
  getElement("showed-current-contact").classList.replace("d-flex", "d-none");
  getElement("current-btns-responsive").classList.replace("d-flex", "d-none");
  closeLightbox();
  initContactsList().then(() => {
    if (!lastId) return;
    const match = contacts.find((c) => c.id === lastId);
    if (!match) return;
    selectedContact = { id: match.id, ...match.contact };
    const index = findContactIndex(match.id);
    const letter = match.contact.name[0].toUpperCase();
    showContactCard(match.contact, `contact${letter}-${index}`);
    getElement("showed-current-contact").classList.add("show");
  });
}

/**
 * This function opens delete Query and assigns an on-click function to the buttons and the query-body
 * 
 * @param {string} contactId -This string is assigned here so that the correct contact is deleted
 */
function opendeleteContactQuery(contactId) {
  document.getElementById('query-window').classList.remove('d-none');
  document.getElementById("cancel-delete-button").onclick = () => deleteContactQuery(false, contactId, event);
  document.getElementById("query-window").onclick = () => deleteContactQuery(false, contactId, event);
  document.getElementById("yes-delete-button").onclick = () => deleteContactQuery(true, contactId, event);
}

/**
 * This functions carry out the query as to whether or not should be deleted
 * 
 * @param {boolean} deleteC - Gives back whether or not should be deleted
 * @param {string} contactId -This string is assigned here so that the correct contact is deleted
 * @param {object} event - Event is needed to stop propagation
 */
function deleteContactQuery(deleteC, contactId, event) {
  event.stopPropagation();
  document.getElementById('query-window').classList.add('d-none');
  deleteContact(contactId, deleteC);
}

/** Deletes a contact */
async function deleteContact(contactId, deleteC) {
  if (!contactId || !deleteC) {
    document.getElementById('responsive-small-edit').classList.remove('d-none');
    return;
  }

  try {
    await removeContact(contactId);
    await removeContactFromAllTasks(selectedContact?.name);
    await removeUserByEmail(selectedContact?.email);
    selectedContact = null;
    updateUIAfterEdit();
  } catch (e) {
    alert("Delete failed: " + e.message);
  }
}


/** Adds a new contact */
async function addNewContact() {
  const { hasError, name, email, phone } = checkInput();
  if (hasError) return;
  await addContact({ name, email, phone, initials: getInitials(name) });
  closeLightbox();
  initContactsList();
  document.getElementById('confirmation-window').classList.remove('d-none');
  setTimeout(() => { document.getElementById('confirmation-window').classList.add("d-none"); }, 3000);
}

/** Hides contact details */
function closeShownContact() {
  toggleElements(
    "right-section",
    "responsive-small-edit",
    "responsive-small-add",
    true
  );
  document.getElementById('responsive-small-edit').classList.remove('d-none');
}

/** Opens responsive edit menu */
function openEditResponsive() {
  document.getElementsByTagName('body')[0].style.overflow = 'hidden';
  document.getElementById('current-btns-responsive').classList.add('d-flex');
  toggleElements(
    "current-btns-responsive",
    "responsive-small-edit",
    null,
    false
  );
  setTimeout(
    () => getElement("current-btns-responsive").classList.add("show"),
    200
  );
}

/** Closes responsive edit menu */
function closeEditResponsive() {
  getElement("current-btns-responsive").classList.remove("show");
  setTimeout(
    () => {
      toggleElements(
        "current-btns-responsive",
        "responsive-small-edit",
        null,
        true
      ),
        document.getElementById('current-btns-responsive').classList.remove('d-flex'),
        document.getElementsByTagName('body')[0].removeAttribute('style')
    },
    200
  );
}

/** Handles responsive design changes */
function handleMediaQueryChange(e) {
  if (e.matches)
    toggleElements("right-section", null, "responsive-small-add", true);
  else
    toggleElements(
      "right-section",
      "responsive-small-add",
      "responsive-small-edit",
      false
    );
}

/** Gets DOM element by ID */
function getElement(id) {
  return document.getElementById(id);
}

/** Toggles element visibility */
function toggleElements(showId, hideId1, hideId2, reverse) {
  if (showId)
    getElement(showId).classList[reverse ? "add" : "remove"]("d-none");
  if (hideId1)
    getElement(hideId1).classList[reverse ? "remove" : "add"]("d-none");
  if (hideId2)
    getElement(hideId2).classList[reverse ? "remove" : "add"]("d-none");
}

/** Sets up all click events */
function setupEvents() {
  getElement("add-contact-btn-big").onclick = () => openLightbox("add");
  getElement("responsive-small-add").onclick = () => openLightbox("add");
  getElement("responsive-small-edit").onclick = openEditResponsive;
  getElement("current-edit").onclick = () => openLightbox("edit");
  getElement("current-edit-responsive").onclick = () => openLightbox("edit");
  getElement("lightbox-overlay").onclick = closeLightbox;
  getElement("back-icon").onclick = closeShownContact;
  getElement("right-section").onclick = closeEditResponsive;
  getElement("current-delete").onclick = () =>
    selectedContact?.id
      ? opendeleteContactQuery(selectedContact.id)
      : alert("No contact!");
  getElement("current-delete-responsive").onclick = () => {
    if (selectedContact?.id) opendeleteContactQuery(selectedContact.id);
    toggleElements("current-btns-responsive", null, null, true);
    getElement("current-btns-responsive").classList.remove("show");
  };
  mediaQuery.onchange = handleMediaQueryChange;
  initContactsList();
}
function findContactIndex(id) {
  for (let letter in groupedContacts) {
    const index = groupedContacts[letter].findIndex((c) => c.id === id);
    if (index !== -1) return index;
  }
  return 0;
}

setupEvents();
window.addEventListener('resize', closeEditResponsive);