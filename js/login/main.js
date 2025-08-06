import { initFirebaseLogin } from './auth.js';

/**
 * Waits for the DOM to be ready and then starts the login logic.
 */
window.addEventListener('DOMContentLoaded', onDomLoaded);

/**
 * Entry point: initializes Firebase login.
 */
function onDomLoaded() {
  initFirebaseLogin();
}
