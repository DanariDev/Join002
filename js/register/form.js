// js/register/form.js
import { showError, clearErrors } from './ui.js';

export function initValidation() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const name = getVal('#name-input');
    const email = getVal('#email-input');
    const pass = getVal('#password-input');
    const repeat = getVal('#password-repeat-input');
    const accepted = document.getElementById('privacy-checkbox').checked;

    if (!validate(name, email, pass, repeat, accepted)) return;

    form.dispatchEvent(new CustomEvent('formValid', {
      detail: { name, email, pass }
    }));
  });
}

function getVal(id) {
  return document.querySelector(id)?.value.trim();
}

function validate(name, email, pass, repeat, accepted) {
  let valid = true;

  if (!name) valid = !showError('.name-error', 'Name fehlt') && valid;
  if (!email?.includes('@')) valid = !showError('.email-error', 'Ungültige E-Mail') && valid;
  if (pass.length < 6) valid = !showError('.password-error', 'Mind. 6 Zeichen') && valid;
  if (pass !== repeat) valid = !showError('.repeat-error', 'Passwörter stimmen nicht') && valid;
  if (!accepted) valid = !showError('.checkbox-error', 'Bitte akzeptieren') && valid;

  return valid;
}
