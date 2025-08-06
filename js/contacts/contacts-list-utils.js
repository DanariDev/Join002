/**
 * Sorts and groups contacts alphabetically, then renders them into the contact list wrapper.
 * @param {Array<Object>} contacts - Array of contact objects.
 * @param {HTMLElement} wrapper - The container element for the contact list.
 * @param {Function} createContactHTML - Function to create the contact HTML element.
 * @param {Function} [setupContactClickEvents] - Optional function to set up click events.
 */
export function renderSortedContacts(contacts, wrapper, createContactHTML, setupContactClickEvents) {
  if (!wrapper) return;
  clearWrapper(wrapper);
  sortContacts(contacts);
  renderGroupedContacts(contacts, wrapper, createContactHTML);
  if (setupContactClickEvents) setupContactClickEvents();
}

/**
 * Clears all children from the given wrapper element.
 * @param {HTMLElement} wrapper - The container to clear.
 */
function clearWrapper(wrapper) {
  wrapper.innerHTML = "";
}

/**
 * Sorts the contacts array alphabetically by contact name.
 * @param {Array<Object>} contacts - Array of contact objects.
 */
function sortContacts(contacts) {
  contacts.sort((a, b) => a.name.localeCompare(b.name, 'de', { sensitivity: 'base' }));
}

/**
 * Renders contacts grouped by their first letter with dividers.
 * @param {Array<Object>} contacts - Array of contact objects.
 * @param {HTMLElement} wrapper - The container element.
 * @param {Function} createContactHTML - Function to create the contact HTML element.
 */
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

/**
 * Returns the uppercase first letter of the contact's name.
 * @param {Object} contact - The contact object.
 * @returns {string} The uppercase first letter.
 */
function getFirstLetter(contact) {
  return contact.name[0].toUpperCase();
}

/**
 * Creates a divider element for a given letter.
 * @param {string} letter - The letter for the divider.
 * @returns {HTMLDivElement} The divider element.
 */
function createDivider(letter) {
  const divider = document.createElement("div");
  divider.className = "contact-divider";
  divider.textContent = letter;
  return divider;
}
