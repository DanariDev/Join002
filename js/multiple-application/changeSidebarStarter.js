// Set initial state in localStorage to "not unregistered"
localStorage.setItem('unregistered', 'false');
localStorage.setItem('special-unregistered', 'false');

/**
 * Sets 'unregistered' in localStorage to true (standard unregistered mode).
 */
function switchLinks() {
  localStorage.setItem('unregistered', 'true');
}

/**
 * Sets both 'special-unregistered' and 'unregistered' in localStorage to true.
 * Used for special unregistered mode (e.g. privacy policy sign-up).
 */
function specialSwitchLink() {
  localStorage.setItem('special-unregistered', 'true');
  switchLinks();
}

/**
 * Sets up all event listeners for sidebar-related links on page load.
 */
function setupSidebarStarterEvents() {
  addClick('privacyPolicyID', switchLinks);
  addClick('legalID', switchLinks);
  addClick('privacyPolicyFormID', specialSwitchLink, true);
}

/**
 * Adds a click event listener to an element by id (optionally allows null).
 * @param {string} id - The id of the target element.
 * @param {function} fn - The callback function to execute on click.
 * @param {boolean} [allowNull=false] - Allow for missing element (optional).
 */
function addClick(id, fn, allowNull = false) {
  const el = document.getElementById(id);
  if (el || allowNull) el?.addEventListener("click", fn);
}

/**
 * Runs event setup on window load.
 */
window.addEventListener("load", setupSidebarStarterEvents);
