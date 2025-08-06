import { auth } from '../firebase/firebase-init.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { checkInput } from "../multiple-application/error-message.js";

export function initFirebaseLogin() {
  setupUserLoginBtn();
  setupGuestLoginBtn();
}
function setupUserLoginBtn() {
  const btn = document.getElementById('userLogin');
  if (btn) btn.addEventListener('click', loginUser);
}
function setupGuestLoginBtn() {
  const btn = document.getElementById('guestLogin');
  if (btn) btn.addEventListener('click', loginAsGuest);
}

async function loginUser() {
  const email = getInputValue('email-input');
  const password = getInputValue('password-input');
  let hasError = checkInput(null, "email-input", null, "password-input", null);
  if (hasError) return;
  signInWithEmailAndPassword(auth, email, password)
    .then(redirectToSummary)
    .catch(error => handleLoginError(error));
}
function getInputValue(id) {
  return document.getElementById(id).value;
}
function handleLoginError(error) {
  checkInput(null, "email-input", null, "password-input", null, null, error.code);
  console.clear();
}

function loginAsGuest() {
  signInWithEmailAndPassword(auth, 'guest@example.com', 'guest123')
    .then(redirectToSummary)
    .catch(error => {
      console.log('Ein unerwarteter Fehler ist aufgetreten. Fehlercode:' + error.code);
    });
}

function redirectToSummary() {
  sessionStorage.setItem('showSummaryLoader', '1');
  window.location.href = 'summary.html';
}
