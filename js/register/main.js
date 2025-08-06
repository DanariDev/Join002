import { initRegister } from './register.js';

/**
 * Waits for DOMContentLoaded and then starts the registration page logic.
 */
window.addEventListener('DOMContentLoaded', onDomLoaded);

/**
 * Calls the register initialization (e.g., sets up button listeners).
 */
function onDomLoaded() {
  initRegister();
}
