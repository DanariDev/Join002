export function closeAllContactOverlays() {
  document.getElementById("add-contact-overlay")?.classList.add("d-none");
  document.getElementById("lightbox-overlay")?.classList.add("d-none");
  const rightSection = document.getElementById("right-section");
  if (rightSection) rightSection.classList.add("d-none");
  const contactCard = document.getElementById("showed-current-contact");
  if (contactCard) {
    contactCard.classList.add("d-none");
    contactCard.classList.remove("show");
  }
}
