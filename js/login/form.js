import { showError, clearErrors } from './ui.js';

export function initFormValidation() {
  const form = document.getElementById('loginForm');
  const loginBtn = form?.querySelector('.btn-primary');
  if (!form || !loginBtn) return;
  loginBtn.addEventListener('click', () => handleLoginClick(form));
}

function handleLoginClick(form) {
  event.preventDefault();
  clearErrors();

  const email = getVal(form, '#email-input');
  const password = getVal(form, '#password-input');
  if (!validate(email, password)) return;

  fireLoginEvent(form, email, password);
}

function getVal(form, selector) {
  return form.querySelector(selector)?.value.trim();
}

function validate(email, password) {
  let valid = true;
  if (!email?.includes('@')) valid = !showError('.email-error', 'Ungültige E-Mail') && valid;
  if (password.length < 6) valid = !showError('.password-error', 'Mind. 6 Zeichen') && valid;
  return valid;
}

function fireLoginEvent(form, email, password) {
  form.dispatchEvent(new CustomEvent('formValid', {
    detail: { email, password }
  }));
}
