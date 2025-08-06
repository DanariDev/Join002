import { getInitials, getRandomColor } from "../contacts/contact-style.js";

/**
 * Renders up to 3 selected contact insignias (badges) and a +X badge if more
 * @param {Array} selectedContacts - Array of selected contact objects
 * @param {HTMLElement} container - Target container for insignias
 */
export function renderSelectedEditInsignias(selectedContacts, container) {
  if (!container) return;
  container.innerHTML = "";

  // Show up to 3 insignias, then +X if more
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

/** Creates a single insignia for a contact */
function createInsignia(contact) {
  const insignia = document.createElement("div");
  insignia.className = "contact-insignia";
  insignia.textContent = getInitials(contact.name);
  insignia.title = contact.name;
  insignia.style.background = getRandomColor(contact.name);
  return insignia;
}
