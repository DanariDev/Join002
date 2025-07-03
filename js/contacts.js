import {
  ref,
  set,
  push,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { db } from "./firebase-config.js";

const BASE_URL = "https://join002-26fa4-default-rtdb.firebaseio.com/";
let contacts = [];
let groupedContacts = [];
let selectedContact = null;
const mediaQuery = window.matchMedia("(max-width: 800px)");

/**
 * Generates a color for a given name based on a hash function
 *
 * @param {string} name - The name to generate a color for
 * @returns {string} - A hex color code
 */
function getColorForName(name) {
  const colors = [
    "#FF5733",
    "#33B5FF",
    "#33FF99",
    "#FF33EC",
    "#ffcb20",
    "#9D33FF",
    "#33FFDA",
    "#FF8C33",
    "#3385FF",
    "#FF3333",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Initializes the contacts list by creating and sorting it
 */
async function initContactsList() {
  await createList();
  sortList();
  generateSortedContacts();
}

/**
 * Fetches all contacts from Firebase
 *
 * @param {string} path - The Firebase database path
 * @returns {Object} - The contacts data
 */
async function getAllContacts(path) {
  const response = await fetch(BASE_URL + path + ".json");
  const data = await response.json();
  return data;
}

/**
 * Creates the contacts list from Firebase data
 */
async function createList() {
  document.getElementById("contacts-list-wrapper").innerHTML = "";
  contacts = [];
  groupedContacts = [];

  let contactResponse = await getAllContacts("contacts");
  let ContactKeysArray = Object.keys(contactResponse);

  for (let index = 0; index < ContactKeysArray.length; index++) {
    contacts.push({
      id: ContactKeysArray[index],
      contact: contactResponse[ContactKeysArray[index]],
    });
  }
}

/**
 * Sorts contacts alphabetically and groups them by first letter
 */
function sortList() {
  contacts.sort((a, b) => a.contact.name.localeCompare(b.contact.name));

  groupedContacts = {};

  contacts.forEach((element) => {
    let firstLetter = element.contact.name.charAt(0).toUpperCase();
    if (!groupedContacts[firstLetter]) {
      groupedContacts[firstLetter] = [];
    }
    groupedContacts[firstLetter].push(element);
  });
}

/**
 * Generates HTML for sorted contacts grouped by first letter
 */
function generateSortedContacts() {
  const sortedLetters = Object.keys(groupedContacts).sort();

  for (let i = 0; i < sortedLetters.length; i++) {
    const letter = sortedLetters[i];
    document.getElementById("contacts-list-wrapper").innerHTML +=
      createAlphabetAndGroupTemplate(letter);

    for (let x = 0; x < groupedContacts[letter].length; x++) {
      document.getElementById(`list-group-${letter}`).innerHTML +=
        getInformation(letter, x);
    }
  }
  addContactOpenenigEvent();
  handleMediaQueryChange(mediaQuery);
}

/**
 * Adds click event listeners to contact elements
 */
function addContactOpenenigEvent() {
  document.querySelectorAll(".list-contact-wrapper").forEach((el) => {
    const letter = el.dataset.letter;
    const index = parseInt(el.dataset.index);
    el.addEventListener("click", () => {
      findCurrentContact(`contact${letter}-${index}`, letter, index);
    });
  });
}

/**
 * Generates contact information HTML
 *
 * @param {string} letter - The first letter of the contact's name
 * @param {number} index - The index of the contact in the group
 * @returns {string} - HTML template for contact information
 */
function getInformation(letter, index) {
  const contact = groupedContacts[letter][index].contact;
  const initials = contact.initials;
  const name = contact.name;
  const email = contact.email;
  const bgColor = getColorForName(name);
  return informationTemplate(name, letter, index, bgColor, email, initials);
}

/**
 * Finds and displays the selected contact
 *
 * @param {string} idNumber - The contact's HTML element ID
 * @param {string} letter - The first letter of the contact's name
 * @param {number} index - The index of the contact in the group
 */
function findCurrentContact(idNumber, letter, index) {
  const currentContact = groupedContacts[letter][index].contact;
  const card = document.getElementById("showed-current-contact");
  card.classList.replace("d-none", "d-flex");
  const icon = document.getElementById("current-icon");
  icon.innerHTML = currentContact.initials;
  icon.style.backgroundColor = getColorForName(currentContact.name);
  fillCurrentContact(currentContact);
  showCurrentContact(idNumber);

  selectedContact = {
    id: groupedContacts[letter][index].id,
    name: currentContact.name,
    email: currentContact.email,
    phone: currentContact.phone,
    icon: currentContact.initials,
  };

  setTimeout(() => card.classList.add("show"), 10);
}

/**
 * Fills the current contact card with information
 *
 * @param {Object} currentContact - The contact object to display
 */
function fillCurrentContact(currentContact) {
  document.getElementById("current-name").innerHTML = currentContact.name;

  const currentMail = document.getElementById("current-mail");
  currentMail.setAttribute("href", "mailto:" + currentContact.email);
  currentMail.textContent = currentContact.email;

  const currentPhone = document.getElementById("current-phone");
  currentPhone.setAttribute("href", "tel:" + currentContact.phone);
  currentPhone.textContent = currentContact.phone;
}

/**
 * Shows the selected contact's details
 *
 * @param {string} idNumber - The contact's HTML element ID
 */
function showCurrentContact(idNumber) {
  document.getElementById("right-section").classList.remove("d-none");
  document.getElementById("responsive-small-edit").classList.remove("d-none");
  document.getElementById("responsive-small-add").classList.add("d-none");
  document
    .querySelectorAll(".choosen")
    .forEach((el) => el.classList.remove("choosen"));
  document.getElementById(idNumber).classList.add("choosen");
}

/**
 * Opens the lightbox for adding a new contact
 */
function openLightboxAdd() {
  document
    .getElementById("lightbox-overlay")
    .classList.replace("d-none", "d-flex");
  document.body.style.overflow = "hidden";
  const lightbox = document.getElementById("lightbox");
  lightbox.innerHTML = "";
  lightbox.appendChild(
    document.createRange().createContextualFragment(leftAddingTemplate())
  );
  lightbox.appendChild(
    document.createRange().createContextualFragment(rightAddingTemplate())
  );

  setTimeout(() => {
    lightbox.classList.add("show");
    document.getElementById("create-btn").onclick = (e) => {
      e.preventDefault();
      addContact();
    };
    document.getElementById("cancel-btn").onclick = (e) => {
      e.preventDefault();
      closeLightbox();
    };
  }, 10);
}

/**
 * Opens the lightbox for editing an existing contact
 */
function openLightboxEdit() {
  document.body.style.overflow = "hidden";
  document
    .getElementById("lightbox-overlay")
    .classList.replace("d-none", "d-flex");
  const lightbox = document.getElementById("lightbox");
  lightbox.innerHTML = "";
  lightbox.appendChild(
    document.createRange().createContextualFragment(leftEditingTemplate())
  );
  lightbox.appendChild(
    document.createRange().createContextualFragment(rightEditingTemplate())
  );
  const icon = document.getElementById("edit-icon");
  icon.innerText = selectedContact.icon || "";
  icon.style.backgroundColor = getColorForName(selectedContact.name);
  document.getElementById("edit-name").value = selectedContact.name || "";
  document.getElementById("edit-email").value = selectedContact.email || "";
  document.getElementById("edit-phone").value = selectedContact.phone || "";
  addSaveAndDeleteEvent();
  setTimeout(() => lightbox.classList.add("show"), 10);
}

/**
 * Adds event listeners for save and delete buttons in edit lightbox
 */
function addSaveAndDeleteEvent() {
  ["saveBtn", "deleteBtn"].forEach((id) => {
    document.getElementById(id).onclick = () => {
      if (selectedContact?.id) {
        id === "saveBtn"
          ? saveContactEdits(selectedContact.id)
          : deleteContact(selectedContact.id);
      } else {
        alert("no contact found!");
      }
    };
  });
}

/**
 * Closes the lightbox
 */
function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.classList.remove("show");

  setTimeout(() => {
    document.getElementById("lightbox-overlay").classList.remove("d-flex");
    document.getElementById("lightbox-overlay").classList.add("d-none");
    document.body.style.overflow = "auto";
  }, 400);
}

/**
 * Saves edits to an existing contact
 *
 * @param {string} contactId - The ID of the contact to update
 */
async function saveContactEdits(contactId) {
  const name = document.getElementById("edit-name").value.trim();
  const email = document.getElementById("edit-email").value.trim();
  const phone = document.getElementById("edit-phone").value.trim();

  if (!name || !email || !phone) return alert("All Fields required!");
  try {
    await update(ref(db, "contacts/" + contactId), { name, email, phone });
  } catch (error) {
    return alert("failure on saving");
  }
  document
    .getElementById("showed-current-contact")
    .classList.replace("d-flex", "d-none");
  closeLightbox();
  initContactsList();
}

/**
 * Deletes a contact
 *
 * @param {string} contactId - The ID of the contact to delete
 */
async function deleteContact(contactId) {
  if (!contactId) return alert("No contact found!");
  if (!confirm("Do you really want to Delete this contact?")) return;

  await removeContactFromFirebase(contactId);
  await removeContactFromTasks(selectedContact?.name);
  await updateUIAfterContactDeletion();
}
async function removeContactFromFirebase(contactId) {
  try {
    await remove(ref(db, "contacts/" + contactId));
  } catch (e) {
    alert("Fehler beim Löschen aus Firebase: " + e.message);
  }
}
async function removeContactFromTasks(name) {
  if (!name) return;
  const snapshot = await get(ref(db, "tasks"));
  const tasks = snapshot.val();
  if (!tasks) return;

  for (let taskId in tasks) {
    const oldAssigned = tasks[taskId].assignedTo || [];
    const filtered = oldAssigned.filter((n) => n !== name);
    if (filtered.length !== oldAssigned.length) {
      await update(ref(db, "tasks/" + taskId), { assignedTo: filtered });
    }
  }
}
async function updateUIAfterContactDeletion() {
  closeLightbox();
  document
    .getElementById("showed-current-contact")
    .classList.replace("d-flex", "d-none");
  await initContactsList();
}

/**
 * Adds a new contact to Firebase
 */
async function addContact() {
  const name = document.getElementById("edit-name").value.trim();
  const email = document.getElementById("edit-email").value.trim();
  const phone = document.getElementById("edit-phone").value.trim();
  if (!name || !email || !phone) return alert("All Fields required!");
  try {
    const newContactRef = push(ref(db, "contacts"));
    await set(newContactRef, {
      name: name,
      email: email,
      phone: phone,
      initials: name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase(),
    });
    closeLightbox();
    await initContactsList();
  } catch (error) {
    alert("failed to Set New contact!");
  }
}

/**
 * Closes the shown contact details
 */
function closeShownContact() {
  document.getElementById("right-section").classList.add("d-none");
  document.getElementById("responsive-small-edit").classList.add("d-none");
  document.getElementById("responsive-small-add").classList.remove("d-none");
}

/**
 * Opens the responsive edit menu
 */
function openEditResponsive() {
  document.getElementById("current-btns-responsive").classList.remove("d-none");
  document.getElementById("current-btns-responsive").classList.add("d-flex");
  document.getElementById("responsive-small-edit").classList.add("d-none");

  setTimeout(() => {
    document.getElementById("current-btns-responsive").classList.add("show");
  }, 200);
}

/**
 * Closes the responsive edit menu
 */
function closeEditResponsive() {
  document.getElementById("current-btns-responsive").classList.remove("show");
  document.getElementById("responsive-small-edit").classList.remove("d-none");

  setTimeout(() => {
    document.getElementById("current-btns-responsive").classList.add("d-none");
    document
      .getElementById("current-btns-responsive")
      .classList.remove("d-flex");
  }, 200);
}

/**
 * Handles media query changes for responsive design
 *
 * @param {MediaQueryList} e - The media query event
 */
function handleMediaQueryChange(e) {
  if (e.matches) {
    document.getElementById("right-section").classList.add("d-none");
    document.getElementById("responsive-small-add").classList.remove("d-none");
    document.getElementById("current-btns-responsive").classList.add("d-none");
  } else {
    document.getElementById("right-section").classList.remove("d-none");
    document.getElementById("responsive-small-add").classList.add("d-none");
    document.getElementById("responsive-small-edit").classList.add("d-none");
  }
}

/**
 * Initializes event listeners on DOM content loaded
 */
document.addEventListener("DOMContentLoaded", () => {
  mediaQuery.addEventListener("change", handleMediaQueryChange);
  document
    .getElementById("add-contact-btn-big")
    .addEventListener("click", openLightboxAdd);
  document
    .getElementById("responsive-small-add")
    .addEventListener("click", openLightboxAdd);
  document
    .getElementById("responsive-small-edit")
    .addEventListener("click", openEditResponsive);
  document
    .getElementById("current-edit")
    .addEventListener("click", openLightboxEdit);
  document
    .getElementById("current-edit-responsive")
    .addEventListener("click", openLightboxEdit);
  document
    .getElementById("lightbox-overlay")
    .addEventListener("click", closeLightbox);
  document
    .getElementById("back-icon")
    .addEventListener("click", closeShownContact);
  document
    .getElementById("right-section")
    .addEventListener("click", closeEditResponsive);
  document.getElementById("current-delete").addEventListener("click", () => {
    if (selectedContact && selectedContact.id) {
      deleteContact(selectedContact.id);
    } else {
      alert("No contact found!");
    }
  });

  document
    .getElementById("current-delete-responsive")
    .addEventListener("click", () => {
      if (selectedContact && selectedContact.id) {
        deleteContact(selectedContact.id);
      } else {
        alert("No contact found!");
      }
      document
        .getElementById("current-btns-responsive")
        .classList.replace("d-flex", "d-none");
      document
        .getElementById("current-btns-responsive")
        .classList.remove("show");
    });

  initContactsList();
});
