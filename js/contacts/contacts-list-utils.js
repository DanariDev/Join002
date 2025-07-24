// contacts-list-utils.js

/**
 * Sortiert und gruppiert Kontakte alphabetisch und rendert sie in die Kontaktliste.
 * @param {Array} contacts - Array aller Kontaktobjekte
 * @param {HTMLElement} wrapper - Der DOM-Container für die Liste (z.B. contacts-list-wrapper)
 * @param {Function} createContactHTML - Funktion zum Erstellen eines Kontakt-Elements
 * @param {Function} setupContactClickEvents - Funktion zum Setzen der Click-Events
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
