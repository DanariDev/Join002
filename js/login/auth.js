import { checkInput } from "../multiple-application/error-message.js";
import { api, setAuth } from "../api/client.js";

/**
 * Initializes login logic: sets up event listeners for user and guest login buttons.
 */
export function initFirebaseLogin() {
  setupUserLoginBtn();
  setupGuestLoginBtn();
}

/**
 * Adds click event listener to the normal user login button.
 */
function setupUserLoginBtn() {
  const btn = document.getElementById('userLogin');
  if (btn) btn.addEventListener('click', loginUser);
}

/**
 * Adds click event listener to the guest login button.
 */
function setupGuestLoginBtn() {
  const btn = document.getElementById('guestLogin');
  if (btn) btn.addEventListener('click', loginAsGuest);
}

/**
 * Handles user login:
 * Validates input, tries to sign in via API, and handles errors.
 */
async function loginUser() {
  const email = getInputValue('email-input');
  const password = getInputValue('password-input');
  let hasError = checkInput(null, "email-input", null, "password-input", null);
  if (hasError) return;
  api.login(email, password)
    .then(({ token, user }) => {
      setAuth(token, user);
      redirectToSummary();
    })
    .catch(error => handleLoginError(error));
}

/**
 * Returns the value of an input field by id.
 * @param {string} id - The id of the input field.
 * @returns {string} - The value of the input field.
 */
function getInputValue(id) {
  return document.getElementById(id).value;
}

/**
 * Handles login errors and displays error messages via checkInput().
 * @param {object} error - The error object from API.
 */
function handleLoginError(error) {
  checkInput(null, "email-input", null, "password-input", null, null, error?.data?.error || "login_failed");
  console.clear();
}

/**
 * Handles guest login via API.
 */
function loginAsGuest() {
  api.guest()
    .then(({ token, user }) => {
      setAuth(token, user);
      redirectToSummary();
    })
    .catch(() => {
      console.error('Guest login failed.');
    });
}

/**
 * Redirects to the summary page and sets a flag to show the loader on load.
 */
function redirectToSummary() {
  sessionStorage.setItem('showSummaryLoader', '1');
  window.location.href = 'summary.html';
}
