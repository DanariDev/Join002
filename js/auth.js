import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  setDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

function signup() {
  const name = document.querySelector(".name_input")?.value.trim();
  const email = document.querySelector(".email_input")?.value.trim();
  const pass = document.querySelector(".password_input")?.value.trim();
  const repeat = document.querySelector(".password_repeat_input")?.value.trim();

  if (!name || !email || !pass || !repeat) {
    alert("Bitte alle Felder ausfüllen!");
    return;
  }

  if (pass !== repeat) {
    alert("Passwörter stimmen nicht überein!");
    return;
  }

  createUserWithEmailAndPassword(auth, email, pass)
    .then((cred) => {
      return setDoc(doc(db, "users", cred.user.uid), {
        name,
        email,
      }).then(() => {
        localStorage.setItem("isGuest", "false");
        localStorage.setItem("userName", name);
        alert("Registrierung erfolgreich!");
        window.location.href = "summary.html";
      });
    })
    .catch((e) => alert("Fehler bei Registrierung:\n" + e.message));
}

function login() {
  const email = document.querySelector(".email_input")?.value.trim();
  const pass = document.querySelector(".password_input")?.value.trim();

  if (!email || !pass) {
    alert("Bitte E-Mail und Passwort eingeben!");
    return;
  }

  signInWithEmailAndPassword(auth, email, pass)
    .then(async (cred) => {
      const userDoc = await getDoc(doc(db, "users", cred.user.uid));
      const name = userDoc.exists() ? userDoc.data().name : "User";
      localStorage.setItem("isGuest", "false");
      localStorage.setItem("userName", name);
      window.location.href = "summary.html";
    })
    .catch((e) => alert("Login fehlgeschlagen:\n" + e.message));
}

export function loginAsGuest() {
  localStorage.setItem("isGuest", "true");
  localStorage.removeItem("userName");
  window.location.href = "summary.html";
}

export function logout() {
  signOut(auth)
    .then(() => {
      localStorage.removeItem("isGuest");
      localStorage.removeItem("userName");
      window.location.href = "login.html";
    })
    .catch((e) => alert("Fehler beim Logout:\n" + e.message));
}

function init() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  const path = window.location.pathname;
  form.onsubmit = (e) => {
    e.preventDefault();
    if (path.includes("register")) signup();
    if (path.includes("login")) login();
    if (path.includes("index")) login();
  }

 
  const guestBtn = document.getElementById("guestLogin");
  if (guestBtn) {
    guestBtn.addEventListener("click", loginAsGuest);
  }
}

init();
