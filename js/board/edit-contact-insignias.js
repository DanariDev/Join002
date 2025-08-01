// edit-contact-insignias.js

import { getInitials, getRandomColor } from "../contacts/contact-style.js";

/**
 * Zeigt Initialen-Badges (max 3) und bei mehr "+X" Badge an.
 * @param {Array} selectedContacts - Array der ausgewählten Kontaktobjekte
 * @param {HTMLElement} container - Ziel-Container (z.B. div#selected-editing-contact-insignias)
 */
export function renderSelectedEditInsignias(selectedContacts, container) {
  if (!container) return;
  container.innerHTML = "";

  // Max. 3 Insignias, dann +X
  const visible = selectedContacts.slice(0, 3);
  visible.forEach(c => {
    container.appendChild(createInsignia(c));
  });

  if (selectedContacts.length > 3) {
    const moreCount = selectedContacts.length - 3;
    const plusBadge = document.createElement("div");
    plusBadge.className = "contact-insignia contact-insignia-plus";
    plusBadge.textContent = `+${moreCount}`;
    plusBadge.title = `${moreCount} weitere Kontakt${moreCount > 1 ? "e" : ""}`;
    container.appendChild(plusBadge);
  }
}

function createInsignia(contact) {
  const insignia = document.createElement("div");
  insignia.className = "contact-insignia";
  insignia.textContent = getInitials(contact.name);
  insignia.title = contact.name;
  insignia.style.background = getRandomColor(contact.name);
  return insignia;
}
