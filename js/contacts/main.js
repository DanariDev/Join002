import { initContactsList } from "./load-contacts.js";
import { setupContactClickEvents, backToContactList } from "./open-contact.js";
import { initAddContactOverlay } from "./create-contact.js";
import { renderSortedContacts } from "./contacts-list-utils.js";
import { mediaQuery, handleMediaQueryChange } from "./contact-responsive.js";

/** Initializes the app once the DOM is fully loaded */
window.addEventListener("DOMContentLoaded", onDomLoaded);

/** Loads all contacts, sets up events and responsive handlers */
async function onDomLoaded() {
  await loadContacts();
  setupContactClickEvents();
  initAddContactOverlay();
  await importLiveUpdates();
  setupBackIcon();
  handleMediaQueryChange(mediaQuery);
}

/** Loads and renders the contact list from the database */
async function loadContacts() {
  await initContactsList();
}

/** Dynamically imports the live update module for real-time contact changes */
async function importLiveUpdates() {
  await import("./contacts-live-update.js");
}

/** Sets up the back icon click event to return to the contact list */
function setupBackIcon() {
  const icon = document.getElementById('back-icon');
  if (icon) icon.addEventListener('click', backToContactList);
}
