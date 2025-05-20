import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  setDoc,
  doc,
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
        email
      });
    })
    .then(() => {
      alert("Registrierung erfolgreich!");
      window.location.href = "summary.html";
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
    .then(() => window.location.href = "summary.html")
    .catch(e => alert("Login fehlgeschlagen:\n" + e.message));
}

function init() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  const path = window.location.pathname;
  form.onsubmit = (e) => {
    e.preventDefault();
    if (path.includes("register")) signup();
    if (path.includes("login")) login();
  };
}

init();