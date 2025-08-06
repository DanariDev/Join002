// contacts-list-utils.js

/**
 * Sorts and groups contacts alphabetically, renders them into the contact list wrapper.
 */
export function renderSortedContacts(contacts, wrapper, createContactHTML, setupContactClickEvents) {
  if (!wrapper) return;
  clearWrapper(wrapper);
  sortContacts(contacts);
  renderGroupedContacts(contacts, wrapper, createContactHTML);
  if (setupContactClickEvents) setupContactClickEvents();
}

function clearWrapper(wrapper) {
  wrapper.innerHTML = "";
}

function sortContacts(contacts) {
  contacts.sort((a, b) => a.name.localeCompare(b.name, 'de', { sensitivity: 'base' }));
}

function renderGroupedContacts(contacts, wrapper, createContactHTML) {
  let currentLetter = null;
  contacts.forEach(contact => {
    const letter = getFirstLetter(contact);
    if (letter !== currentLetter) {
      currentLetter = letter;
      wrapper.append(createDivider(currentLetter));
    }
    wrapper.append(createContactHTML(contact));
  });
}

function getFirstLetter(contact) {
  return contact.name[0].toUpperCase();
}

function createDivider(letter) {
  const divider = document.createElement("div");
  divider.className = "contact-divider";
  divider.textContent = letter;
  return divider;
}
