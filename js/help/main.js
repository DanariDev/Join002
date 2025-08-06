import { showUserInitials } from './user-initials.js';
import { setupTopbarMenu } from './menu.js';

/**
 * Waits for DOMContentLoaded and then initializes user initials and topbar menu.
 */
window.addEventListener('DOMContentLoaded', onDomLoaded);

/**
 * Main entry point after DOM is loaded:
 * Displays user initials in the topbar and sets up the user menu events.
 */
function onDomLoaded() {
  showUserInitials();
  setupTopbarMenu();
}
