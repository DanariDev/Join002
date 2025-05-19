import { auth } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const db = getFirestore();

function signup() {
  let name = document.querySelector(".name_input");
  let email = document.querySelector(".email_input");
  let pass = document.querySelectorAll(".password_input")[0];
  if (!name || !email || !pass) return;
  createUserWithEmailAndPassword(auth, email.value, pass.value)
    .then((cred) => {
      return setDoc(doc(db, "users", cred.user.uid), {
        name: name.value,
        email: email.value,
      });
    })
    .then(() => {
      alert("Registrierung erfolgreich!");
      window.location.href = "index.html";
    })
    .catch((e) => alert("Fehler:\n" + e.message));
}

function login() {
  let email = document.querySelector(".email_input");
  let pass = document.querySelector(".password_input");
  if (!email || !pass) return;
  signInWithEmailAndPassword(auth, email.value, pass.value)
    .then(() => (window.location.href = "summary.html"))
    .catch((e) => alert("Login fehlgeschlagen:\n" + e.message));
}

function init() {
  let pfad = window.location.pathname;
  let form = document.getElementById("loginForm");
  if (!form) return;
  if (pfad.includes("register"))
    form.onsubmit = () => {
      signup();
      return false;
    };
  if (pfad.includes("login"))
    form.onsubmit = () => {
      login();
      return false;
    };
}

init();
