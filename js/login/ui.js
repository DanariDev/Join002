// js/login/ui.js
export function showError(selector, message) {
  const el = document.querySelector(selector);
  if (el) {
    el.textContent = message;
    el.style.visibility = 'visible';
  }

  const input = el?.closest('.input-wrapper')?.querySelector('input');
  if (input) input.classList.add('input-error');
}

export function clearErrors() {
  document.querySelectorAll('.error-message').forEach(el => {
    el.textContent = '';
    el.style.visibility = 'hidden';
  });

  document.querySelectorAll('.input-error').forEach(el =>
    el.classList.remove('input-error')
  );
}
