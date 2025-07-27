import { initFirebaseLogin } from './auth.js';

/**
 * This instruction ensures that the functions "initFirebaseLogin" 
 * are called up after loading the Document Object Model (DOM) Content"
 */
window.addEventListener('DOMContentLoaded', () => {
  initFirebaseLogin();
});

