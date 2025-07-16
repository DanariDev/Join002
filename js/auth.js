import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  ref,
  set,
  get,
  child,
  push
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

/**
 * With this function, a new user is registered and stored on the Firebase
 *
 * @returns -return alert("Passwörter stimmen nicht überein!");
 */
async function signup() {
  const nameInput = document.getElementById("name-input");
  const emailInput = document.getElementById("email-input");
  const passInput = document.getElementById("password-input");
  const repeatInput = document.getElementById("password-repeat-input");
  const checkbox = document.getElementById("privacy-checkbox");

  const nameError = document.querySelector(".name-error");
  const emailError = document.querySelector(".email-error");
  const passError = document.querySelector(".password-error");
  const repeatError = document.querySelector(".repeat-error");
  const checkboxError = document.querySelector(".checkbox-error");

  resetErrors([nameInput, emailInput, passInput, repeatInput, checkbox], [nameError, emailError, passError, repeatError, checkboxError]);

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const pass = passInput.value.trim();
  const repeat = repeatInput.value.trim();

  let hasError = false;
  if (!name) { showError(nameInput, nameError, "Bitte Namen eingeben."); hasError = true; }
  if (!email) { showError(emailInput, emailError, "Bitte E-Mail eingeben."); hasError = true; }
  else if (!/^\S+@\S+\.\S+$/.test(email)) { showError(emailInput, emailError, "Ungültige E-Mail-Adresse!"); hasError = true; }
  if (!pass) { showError(passInput, passError, "Bitte Passwort eingeben."); hasError = true; }
  if (!repeat) { showError(repeatInput, repeatError, "Bitte Passwort bestätigen."); hasError = true; }
  else if (pass !== repeat) { showError(repeatInput, repeatError, "Passwörter stimmen nicht überein!"); hasError = true; }
  if (!checkbox.checked) { showError(checkbox, checkboxError, "Bitte akzeptiere die Datenschutzbestimmungen."); hasError = true; }
  if (hasError) return;

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await set(ref(db, `users/${cred.user.uid}`), { name, email });
    let initials = name.split(" ").map(n => n[0].toUpperCase()).join("").slice(0, 2);
    await set(push(ref(db, "contacts")), { name, email, initials });
    localStorage.setItem("isGuest", "false");
    localStorage.setItem("userName", name);
    alert("Registrierung erfolgreich!");
    window.location.href = "summary.html";
  } catch (e) {
    alert("Fehler bei Registrierung:\n" + e.message);
  }
}



/**
 * With this function a user logged in. It is checked whether email and password fit a user
 *
 * @returns -alert("Bitte E-Mail und Passwort eingeben!");
 */
function login() {
  const emailInput = document.querySelector(".email-input");
  const passInput = document.querySelector(".password-input");
  const emailError = document.querySelector(".email-error");
  const passError = document.querySelector(".password-error");

  resetErrors([emailInput, passInput], [emailError, passError]);

  const email = emailInput.value.trim();
  const pass = passInput.value.trim();
  let hasError = false;

  if (!email) { showError(emailInput, emailError, "Bitte E-Mail eingeben."); hasError = true; }
  else if (!/^\S+@\S+\.\S+$/.test(email)) { showError(emailInput, emailError, "Ungültige E-Mail-Adresse!"); hasError = true; }
  if (!pass) { showError(passInput, passError, "Bitte Passwort eingeben."); hasError = true; }
  if (hasError) return;

  signInWithEmailAndPassword(auth, email, pass)
    .then(async cred => {
      const snap = await get(child(ref(db), `users/${cred.user.uid}`));
      const name = snap.exists() ? snap.val().name : "User";
      localStorage.setItem("isGuest", "false");
      localStorage.setItem("userName", name);
      window.location.href = "summary.html";
    })
    .catch(e => {
      showError(passInput, passError, "Login fehlgeschlagen: E-mail und Passwort stimmen nicht überein!");
    });
}


/**
 * This function can be registered with a guest login
 *
 *
 */
export function loginAsGuest() {
  localStorage.setItem("isGuest", "true");
  localStorage.removeItem("userName");
  window.location.href = "summary.html";
}

/**
 * This function logs off a user
 *
 *
 */
export function logout() {
  signOut(auth)
    .then(() => {
      localStorage.removeItem("isGuest");
      localStorage.removeItem("userName");
    })
    .catch((e) => alert("Fehler beim Logout:\n" + e.message));
}

/**
 * This function ensures that the buttons have a click event
 *
 * @returns -stop
 */
function init() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.onsubmit = (e) => {
    e.preventDefault();
    login();
  };

  const guestBtn = document.getElementById("guestLogin");
  if (guestBtn) guestBtn.addEventListener("click", loginAsGuest);

  const registerForm = document.getElementById("loginForm");
  if (registerForm && window.location.pathname.includes("register.html")) {
    registerForm.onsubmit = (e) => {
      e.preventDefault();
      signup();
    };
  }
}

function resetErrors(inputs, errors) {
  inputs.forEach(i => i.classList.remove("input-error"));
  errors.forEach(e => {
    e.textContent = "";
    e.style.display = "none";
  });
}

function showError(input, errorElem, message) {
  input.classList.add("input-error");
  errorElem.textContent = message;
  errorElem.style.display = "block";
}

init();
