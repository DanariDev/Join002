import { showUserInitials } from './user-initials.js';
import { setupTopbarMenu } from './menu.js';

window.addEventListener('DOMContentLoaded', onDomLoaded);

function onDomLoaded() {
  showUserInitials();
  setupTopbarMenu();
}
