// contacts-list-utils.js

/**
 * Sorts and groups contacts alphabetically, renders them into the contact list wrapper.
 * @param {Array} contacts - Array of contact objects
 * @param {HTMLElement} wrapper - DOM container for the list
 * @param {Function} createContactHTML - Function to create contact HTML element
 * @param {Function} setupContactClickEvents - Function to set up click events
 */
export function renderSortedContacts(contacts, wrapper, createContactHTML, setupContactClickEvents) {
  if (!wrapper) return;
  wrapper.innerHTML = "";

  // Alphabetisch sortieren (case-insensitive)
  contacts.sort((a, b) => a.name.localeCompare(b.name, 'de', { sensitivity: 'base' }));

  // Nach Anfangsbuchstaben gruppieren
  let currentLetter = null;
  contacts.forEach(contact => {
    const letter = contact.name[0].toUpperCase();
    if (letter !== currentLetter) {
      currentLetter = letter;
      const divider = document.createElement("div");
      divider.className = "contact-divider";
      divider.textContent = currentLetter;
      wrapper.append(divider);
    }
    wrapper.append(createContactHTML(contact));
  });

  if (setupContactClickEvents) setupContactClickEvents();
}