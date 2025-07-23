// js/login/auth.js
import { auth } from '../firebase/firebase-init.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


export function initFirebaseLogin() {
  const form = document.getElementById('loginForm');
  const guestBtn = document.getElementById('guestLogin');

  if (form) {
    form.addEventListener('formValid', (e) => {
      const { email, password } = e.detail;
      loginUser(email, password);
    });
  }

  if (guestBtn) {
    guestBtn.addEventListener('click', loginAsGuest);
  }
}

function loginUser(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then(() => redirectToSummary())
    .catch(() => showLoginError());
}

function loginAsGuest() {
  const email = 'guest@example.com';
  const password = 'guest123';
  loginUser(email, password);
}

function redirectToSummary() {
  window.location.href = 'summary.html';
}

function showLoginError() {
  const msg = document.querySelector('.password-error');
  if (msg) {
    msg.textContent = 'E-Mailadresse oder Passwort falsch!';
    msg.style.visibility = 'visible';
  }
}
