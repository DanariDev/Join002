/**
 * Opens or closes the topbar user menu when the user icon is clicked
 * @param {Event} event - Click event
 */
function openMenu(event) {
  event.stopPropagation(); // Prevent click from bubbling up to body
  const menu = document.getElementById('menuID');
  if (menu) menu.classList.toggle('d-none'); // Show/hide the menu
}

/**
 * Converts a full name into initials
 * Example: "John Doe" → "JD"
 * @param {string} name - Full name of the user
 * @returns {string} - Initials in uppercase
 */
function getInitials(name) {
  return name
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase();
}

/**
 * Updates the topbar user circle with the user's initials
 * If the user is a guest, shows just "G"
 */
function updateTopbarUser() {
  const el = document.querySelector('.topbar-user');
  if (!el) return;

  const isGuest = localStorage.getItem("isGuest") === "true";
  const name = localStorage.getItem("userName") || "User";

  el.textContent = isGuest ? "G" : getInitials(name);
}

/**
 * Closes the menu if the user clicks outside of it
 * @param {MouseEvent} e - Global click event
 */
function closeMenuIfOutsideClick(e) {
  const menu = document.getElementById('menuID');
  const button = document.querySelector('.topbar-user');
  if (!menu || menu.classList.contains('d-none')) return;

  // If the click is outside both the menu and the button, close the menu
  if (!menu.contains(e.target) && !button.contains(e.target)) {
    menu.classList.add('d-none');
  }
}

/**
 * Runs after the page is fully loaded
 * - Updates the user display in the topbar
 * - Registers click-away handler for closing the menu
 * - Optionally runs contactsList() if it exists
 */
window.onload = function () {
  setTimeout(updateTopbarUser, 200); // Delay to ensure localStorage is ready
  document.body.onclick = closeMenuIfOutsideClick;

  if (typeof contactsList === "function") {
    contactsList(); // Optional function to load contacts
  }
};
