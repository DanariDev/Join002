import { auth } from '../firebase/firebase-init.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { checkInput } from "../multiple-application/error-message.js";

/**
 * This function ensures that it first checks whether both buttons ("userLoginBtn" and "guestBtn") are present. 
 * Then, an addEventListener for the click event is assigned to both buttons. 
 * When a click is performed, "userLoginBtn" executes the "loginUser" function, and "guestBtn" executes the "loginAsGuest" function.
 */
export function initFirebaseLogin() {
  const userLoginBtn = document.getElementById('userLogin');
  const guestBtn = document.getElementById('guestLogin');

  if (userLoginBtn) {
    userLoginBtn.addEventListener('click', loginUser)
  }

  if (guestBtn) {
    guestBtn.addEventListener('click', loginAsGuest);
  }
}

/**
 * Diese Funktion prüft zunächst, ob die beiden Eingaben die passenden Voraussetzungen erfüllen. 
 * Sollte dies nicht der Fall sein, wird die Funktion abgebrochen und ein oder mehrere Hinweise ausgegeben. 
 * Wenn die Eingaben korrekt sind, wird überprüft, ob es ein passendes Benutzerkonto gibt. 
 * Sollte dies nicht der Fall sein, wird ebenfalls ein Hinweis ausgegeben. Wird ein passendes Konto gefunden, wird die Funktion redirectToSummary ausgeführt.
 * 
 * @returns -If hasError is true, the function is aborted.
 */
async function loginUser() {
  const email = document.getElementById('email-input').value;
  const password = document.getElementById('password-input').value;
  let hasError = checkInput(null, "email-input", null, "password-input", null);
  if (hasError) return;

  signInWithEmailAndPassword(auth, email, password)
  .then(() => redirectToSummary())
  .catch((error) => {
    checkInput(null, "email-input", null, "password-input", null, null, error.code);
    console.clear();
  });
}

/**
 * This function is for guest access. 
 * First, the guest data is passed, and then the function "redirectToSummary" is executed.
 */
function loginAsGuest() {
  const email = 'guest@example.com';
  const password = 'guest123';
  signInWithEmailAndPassword(auth, email, password)
  .then(() => redirectToSummary())
  .catch((error) => {
    console.log('Ein unerwarteter Fehler ist aufgetreten. Fehlercode:' + error.code);
  });
}

/**
 * This function is used to redirect to the "summary.html" page.
 */
function redirectToSummary() {
  window.location.href = 'summary.html';
}
