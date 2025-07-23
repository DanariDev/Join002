import { showUserInitials } from './user-initials.js';
import { setupTopbarMenu } from './menu.js';

/**
 * This instruction ensures that the functions "showUserInitials" and "setupTopbarMenu" are called up after loading the page
 */
window.addEventListener('DOMContentLoaded', () => {
  showUserInitials();
  setupTopbarMenu();
});

