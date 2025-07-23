// js/register/main.js
import { initValidation } from './form.js';
import { initRegister } from './register.js';

window.addEventListener('DOMContentLoaded', () => {
  initValidation();
  initRegister();
});
