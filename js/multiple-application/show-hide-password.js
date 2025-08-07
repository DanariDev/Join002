/**
 * Toggles visibility of the password input field between "password" and "text".
 */
function togglePassword() {
  toggleInputType('password-input', 'show-hide-password');
}

/**
 * Toggles visibility of the repeat password input field between "password" and "text".
 */
function togglePasswordRepeat() {
  toggleInputType('password-repeat-input', 'show-hide-repeat-password');
}

/**
 * Changes the input type and updates the icon for show/hide password state.
 * @param {string} inputId - The id of the password input field.
 * @param {string} iconId - The id of the show/hide icon.
 */
function toggleInputType(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  if (input.type == "password") {
    input.type = "text";
    icon.style.backgroundImage = "url(./assets/img/show-password.png)";
  } else {
    input.type = "password";
    icon.style.backgroundImage = "url(./assets/img/hiden-password.png)";
  }
}

/**
 * Handles the password icon visibility and lock icon based on input length.
 * @param {string} input - The id of the password input field.
 * @param {string} icon - The id of the show/hide icon.
 */
function passwortLength(input, icon) {
  const pwInput = document.getElementById(input);
  pwInput?.addEventListener("input", () => {
    if (pwInput.value.length > 0) {
      pwInput.style.backgroundImage = "url('')";
      document.getElementById(icon).classList.remove('d-none');
    } else {
      pwInput.style.backgroundImage = "url(./assets/img/lock.png)";
      document.getElementById(icon).classList.add('d-none');
    }
  });
}

/**
 * Initializes show/hide password feature and icon logic on page load.
 */
function setupShowHideEvents() {
  passwortLength('password-input', 'show-hide-password');
  passwortLength('password-repeat-input', 'show-hide-repeat-password');
  document.getElementById('show-hide-password').addEventListener("click", togglePassword);
  document.getElementById('show-hide-repeat-password')?.addEventListener("click", togglePasswordRepeat);
}

/**
 * Sets up all password show/hide events on window load.
 */
window.addEventListener("load", setupShowHideEvents);
