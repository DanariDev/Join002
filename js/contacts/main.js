import { initContactsList } from "./load-contacts.js";
import { setupContactClickEvents, backToContactList } from "./open-contact.js";
import { initAddContactOverlay } from "./create-contact.js";
import { renderSortedContacts } from "./contacts-list-utils.js";
import { mediaQuery, handleMediaQueryChange } from "./contact-responsive.js";

window.addEventListener("DOMContentLoaded", onDomLoaded);

async function onDomLoaded() {
  await loadContacts();
  setupContactClickEvents();
  initAddContactOverlay();
  await importLiveUpdates();
  setupBackIcon();
  handleMediaQueryChange(mediaQuery);
}
async function loadContacts() {
  await initContactsList();
}
async function importLiveUpdates() {
  await import("./contacts-live-update.js");
}
function setupBackIcon() {
  const icon = document.getElementById('back-icon');
  if (icon) icon.addEventListener('click', backToContactList);
}
