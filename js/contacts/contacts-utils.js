/**
 * Closes all contact-related overlays and hides the contact card.
 */
export function closeAllContactOverlays() {
  hideOverlay("add-contact-overlay");
  hideOverlay("lightbox-overlay");
  hideRightSection();
  hideContactCard();
}

/**
 * Adds "d-none" to the overlay element to hide it.
 * @param {string} id - The ID of the overlay element.
 */
function hideOverlay(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("d-none");
}

/**
 * Hides the right contact detail section.
 */
function hideRightSection() {
  const rightSection = document.getElementById("right-section");
  if (rightSection) rightSection.classList.add("d-none");
}

/**
 * Hides the currently shown contact card.
 */
function hideContactCard() {
  const contactCard = document.getElementById("showed-current-contact");
  if (!contactCard) return;
  contactCard.classList.add("d-none");
  contactCard.classList.remove("show");
}
