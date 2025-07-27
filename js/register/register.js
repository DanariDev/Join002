import { auth, db } from '../firebase/firebase-init.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { ref, set, push } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { checkInput } from "../multiple-application/error-message.js";

/**
 * This function ensures that it first checks whether the button (signUpBtn) is present. 
 * Then, an addEventListener for the click event is assigned to the button. 
 * When the button is clicked, it executes the "signup" function.
 */
export function initRegister() {
  const signUpBtn = document.getElementById('sign-up-btn');

  if (signUpBtn) {
    signUpBtn.addEventListener('click', signup)
  }
}

/**
 * This function first checks whether the five inputs meet the necessary requirements. 
 * If not, the function is aborted, and one or more hints are displayed. 
 * If the inputs are valid, it checks if a user account already exists for the provided email. 
 * If an account is found, a hint is shown, and the process is aborted. 
 * If the email is not yet registered, the user is saved and simultaneously added to an existing contact book. 
 * Afterward, the "startTransitionToSummary" function is executed.
 * 
 * @returns -If hasError is true, the function is aborted.
 */
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

/**
 * This function displays a notification window and shows a success or error message.
 * 
 * @param {string} message -This string passes the success or error message.
 * @param {string} type -This string indicates whether it is a success or error message.
 */
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

/**
 * This function first checks if the loading sequence exists. If it does, it is executed. 
 * Afterward, the user is redirected to the "summary.html" page.
 */
function startTransitionToSummary() {
  const overlay = document.getElementById("page-transition");
  if (overlay) overlay.classList.remove("hidden");

  setTimeout(() => {
    window.location.href = "summary.html";
  }, 500);
}
