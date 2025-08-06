import { auth, db } from "../firebase/firebase-init.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

export function initGreeting() {
  return new Promise(resolve => {
    setGreetingTime();
    onAuthStateChanged(auth, async user => {
      await setGreetingName(user);
      resolve();
    });
  });
}
function setGreetingTime() {
  const field = document.querySelector("#summary-greeting-time");
  const h = new Date().getHours();
  if (h < 12) field.textContent = "Good morning,";
  else if (h < 18) field.textContent = "Good afternoon,";
  else field.textContent = "Good evening,";
}
async function setGreetingName(user) {
  const nameField = document.querySelector("#summary-greeting-name");
  if (user && user.email !== "guest@example.com") {
    const snap = await get(ref(db, `users/${user.uid}`));
    nameField.textContent = snap.exists() && snap.val().name ? snap.val().name : "Unbekannt";
  } else {
    nameField.textContent = "";
  }
}
function hideLoader() {
  const loader = document.getElementById('summary-loader');
  setTimeout(() => {
    if (loader) loader.style.display = 'none';
    document.body.classList.remove('hidden');
  }, 900);
}
window.addEventListener('DOMContentLoaded', async () => {
  await initGreeting();
  if (window.initTaskCounters) await window.initTaskCounters();
  if (window.initDeadlineDate) await window.initDeadlineDate();
  hideLoader();
});
