import { initRegister } from './register.js';

/**
 * This instruction ensures that the functions "initRegister" 
 * are called up after loading the Document Object Model (DOM) Content"
 */
window.addEventListener('DOMContentLoaded', () => {
  initRegister();
});
