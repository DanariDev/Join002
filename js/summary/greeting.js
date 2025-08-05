import { auth, db } from "../firebase/firebase-init.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

/**
 * Zeigt den persönlichen Gruß samt Name nach Login – erst nach dem Laden sichtbar!
 */
export function initGreeting() {
  return new Promise((resolve) => {
    const nameField = document.querySelector("#summary-greeting-name");
    const timeField = document.querySelector("#summary-greeting-time");

    // Begrüßungstext setzen
    const time = new Date().getHours();
    if (time < 12) {
      timeField.textContent = "Good morning,";
    } else if (time < 18) {
      timeField.textContent = "Good afternoon,";
    } else {
      timeField.textContent = "Good evening,";
    }

    // Erst, wenn Auth-State geladen ist, wird alles angezeigt
    onAuthStateChanged(auth, async (user) => {
      if (user && user.email !== "guest@example.com") {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists() && snapshot.val().name) {
          nameField.textContent = snapshot.val().name;
        } else {
          nameField.textContent = "Unbekannt";
        }
      } else {
        nameField.textContent = "";
      }
      resolve(); // Loader kann jetzt ausgeblendet werden
    });
  });
}

/**
 * Blendet den Loader aus und zeigt die Seite an (hidden-Klasse weg!)
 */
function hideLoader() {
  const loader = document.getElementById('summary-loader');
  setTimeout(() => {
    if (loader) loader.style.display = 'none';
    document.body.classList.remove('hidden');
  }, 900); // 900ms künstliches Delay – passt du an, wie du willst!
}


/**
 * Ruft alle wichtigen Initialisierungen auf und entfernt dann den Loader.
 * ACHTUNG: Die init-Funktionen müssen ggf. als Promise angepasst werden, wenn du weitere async-Initialisierungen hast.
 */
window.addEventListener('DOMContentLoaded', async () => {
  // Seite am Anfang ausblenden (falls du das noch nicht im HTML hast)
  // document.body.classList.add('hidden'); // Nur einmal nötig, am besten schon im HTML
  await initGreeting();
  if (window.initTaskCounters) await window.initTaskCounters();
  if (window.initDeadlineDate) await window.initDeadlineDate();
  hideLoader(); // Loader ausblenden, Seite zeigen
});
