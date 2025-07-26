// js/register/register.js
import { auth, db } from '../firebase/firebase-init.js';
import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  ref, set, push
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { checkInput } from "../multiple-application/error-message.js";

export function initRegister() {
  const signUpBtn = document.getElementById('sign-up-btn');

  if (signUpBtn) {
    signUpBtn.addEventListener('click', signup)
  }
}

async function signup() {
  const name = document.getElementById('name-input').value;
  const email = document.getElementById('email-input').value;
  const password = document.getElementById('password-input').value;

  let hasError = checkInput("name-input", "email-input", null, "password-input", "password-repeat-input", "privacy-checkbox");
  if (hasError) return;

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await set(ref(db, `users/${cred.user.uid}`), { name, email });
    let initials = name.split(" ").map(n => n[0].toUpperCase()).join("").slice(0, 2);
    await set(push(ref(db, "contacts")), { name, email, initials });
    showNotification("registration successfuly!", "success");
    setTimeout(() => {
      startTransitionToSummary();
    }, 1000);
  } catch (e) {
    console.clear();
    const msg = e.code === "auth/email-already-in-use"
      ? "This email address is already in use."
      : "Registrierung fehlgeschlagen:\n" + e.message;
    showNotification(msg, "error");
  }
}


function showNotification(message, type = "success") {
  const box = document.getElementById("notification");
  box.textContent = message;
  box.className = `notification ${type} show`;

  setTimeout(() => {
    box.classList.remove("show");
    box.style.bottom = "-100px";
    box.style.opacity = "0";
  }, 4000);
}

function startTransitionToSummary() {
  const overlay = document.getElementById("page-transition");
  if (overlay) overlay.classList.remove("hidden");

  setTimeout(() => {
    window.location.href = "summary.html";
  }, 500);
}
