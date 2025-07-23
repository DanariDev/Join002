// js/register/register.js
import { auth, db } from '../firebase/firebase-init.js';
import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  ref, set
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

export function initRegister() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('formValid', async (e) => {
    const { name, email, pass } = e.detail;
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await set(ref(db, `users/${cred.user.uid}`), {
        name,
        email,
        uid: cred.user.uid
      });
      window.location.href = 'summary.html';
    } catch (err) {
      showError('.email-error', 'E-Mail wird bereits verwendet');
    }
  });
}
