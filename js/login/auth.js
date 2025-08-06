import { auth } from '../firebase/firebase-init.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { checkInput } from "../multiple-application/error-message.js";

/**
 * Initializes Firebase login logic: sets up event listeners for user and guest login buttons.
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
 * Validates input, tries to sign in with Firebase, and handles errors.
 */
async function loginUser() {
  const email = getInputValue('email-input');
  const password = getInputValue('password-input');
  let hasError = checkInput(null, "email-input", null, "password-input", null);
  if (hasError) return;
  signInWithEmailAndPassword(auth, email, password)
    .then(redirectToSummary)
    .catch(error => handleLoginError(error));
}

/**
 * Returns the value of an input field by id.
 */
function getInputValue(id) {
  return document.getElementById(id).value;
}

/**
 * Handles login errors and displays error messages via checkInput().
 */
function handleLoginError(error) {
  checkInput(null, "email-input", null, "password-input", null, null, error.code);
  console.clear();
}

/**
 * Handles guest login: logs in with a preset guest account.
 */
function loginAsGuest() {
  signInWithEmailAndPassword(auth, 'guest@example.com', 'guest123')
    .then(redirectToSummary)
    .catch(error => {
      console.log('An unexpected error occurred. Error code:' + error.code);
    });
}

/**
 * Redirects to the summary page and sets a flag to show the loader on load.
 */
function redirectToSummary() {
  sessionStorage.setItem('showSummaryLoader', '1');
  window.location.href = 'summary.html';
}
