// contacts-utils.js

/**
 * Closes all contact-related overlays and hides the contact card.
 */
export function closeAllContactOverlays() {
  hideOverlay("add-contact-overlay");
  hideOverlay("lightbox-overlay");
  hideRightSection();
  hideContactCard();
}

function hideOverlay(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("d-none");
}
function hideRightSection() {
  const rightSection = document.getElementById("right-section");
  if (rightSection) rightSection.classList.add("d-none");
}
function hideContactCard() {
  const contactCard = document.getElementById("showed-current-contact");
  if (!contactCard) return;
  contactCard.classList.add("d-none");
  contactCard.classList.remove("show");
}
