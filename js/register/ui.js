// js/register/ui.js
export function showError(selector, message) {
  const el = document.querySelector(selector);
  if (!el) return false;
  el.textContent = message;
  el.style.visibility = 'visible';
  el.previousElementSibling?.classList.add('input-error');
  return true;
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
