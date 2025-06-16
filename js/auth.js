
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
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

/**
 * With this function, a new user is registered and stored on the Firebase
 * 
 * @returns 
 */
async function signup() {
  const name = document.querySelector(".name-input")?.value.trim();
  const email = document.querySelector(".email-input")?.value.trim();
  const pass = document.querySelector(".password-input")?.value.trim();
  const repeat = document.getElementById("password-repeat-input")?.value.trim();
  if (!name || !email || !pass || !repeat) return alert("Bitte alle Felder ausfüllen!");
  if (pass !== repeat) return alert("Passwörter stimmen nicht überein!");

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await set(ref(db, `users/${cred.user.uid}`), { name, email });
    const initials = name.split(" ")[0][0].toUpperCase() + name.split(" ")[1][0].toUpperCase();
    await set(ref(db, `contacts/${email.replace(/\./g, "_")}`), { name, email, initials });

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
 * @returns 
 */
function login() {
  const email = document.querySelector(".email-input")?.value.trim();
  const pass = document.querySelector(".password-input")?.value.trim();
  if (!email || !pass) return alert("Bitte E-Mail und Passwort eingeben!");

  signInWithEmailAndPassword(auth, email, pass)
    .then(async (cred) => {
      const snap = await get(child(ref(db), `users/${cred.user.uid}`));
      const name = snap.exists() ? snap.val().name : "User";
      localStorage.setItem("isGuest", "false");
      localStorage.setItem("userName", name);
      window.location.href = "summary.html";
    })
    .catch((e) => alert("Login fehlgeschlagen:\n" + e.message));
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
 * @returns
 */
function init() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  const path = window.location.pathname;
  form.onsubmit = (e) => {
    e.preventDefault();
    if (path.includes("register")) signup();
    if (path.includes("index")) login();
  };

  const guestBtn = document.getElementById("guestLogin");
  if (guestBtn) guestBtn.addEventListener("click", loginAsGuest);
}

init();
