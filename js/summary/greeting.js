import { auth, db } from "../firebase/firebase-init.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

export function initGreeting() {
  const nameField = document.querySelector("#summary-greeting-name");
  const timeField = document.querySelector("#summary-greeting-time");

  const time = new Date().getHours();
  if (time < 12) {
    timeField.textContent = "Good morning,";
  } else if (time < 18) {
    timeField.textContent = "Good afternoon,";
  } else {
    timeField.textContent = "Good evening,";
  }

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const isGuest = user.email === "guest@example.com";
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);

      if (isGuest) {
        nameField.textContent = "Guest";
      } else if (snapshot.exists()) {
        const data = snapshot.val();
        nameField.textContent = data.name;
      } else {
        nameField.textContent = "Unbekannt";
      }
    } else {
      nameField.textContent = "Guest";
    }
  });
}
