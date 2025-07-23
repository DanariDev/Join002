// js/login/main.js
import { initFormValidation } from './form.js';
import { initFirebaseLogin } from './auth.js';

window.addEventListener('DOMContentLoaded', () => {
  initFormValidation();
  initFirebaseLogin(); // ⬅️ Das hat gefehlt!
});

