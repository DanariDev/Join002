import { auth } from '../firebase/firebase-init.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { checkInput } from "../multiple-application/error-message.js";


export function initFirebaseLogin() {
  const userLoginBtn = document.getElementById('userLogin');
  const guestBtn = document.getElementById('guestLogin');

  if (userLoginBtn) {
    userLoginBtn.addEventListener('click', loginUser)
  }

  if (guestBtn) {
    guestBtn.addEventListener('click', loginAsGuest);
  }
}

async function loginUser() {
  const email = document.getElementById('email-input').value;
  const password = document.getElementById('password-input').value;
  let hasError = checkInput(null, "email-input", null, "password-input", null);
  if (hasError) return;

  signInWithEmailAndPassword(auth, email, password)
  .then(() => redirectToSummary())
  .catch((error) => {
    checkInput(null, "email-input", null, "password-input", null, null, error.code);
    console.clear();
  });
}

function loginAsGuest() {
  const email = 'guest@example.com';
  const password = 'guest123';
  signInWithEmailAndPassword(auth, email, password)
  .then(() => redirectToSummary())
}

function redirectToSummary() {
  window.location.href = 'summary.html';
}
