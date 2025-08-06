import { auth, db } from '../firebase/firebase-init.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

/**
 * Fetches and displays the user's initials in the topbar.
 * Shows "G" if guest is logged in.
 */
export function showUserInitials() {
  onAuthStateChanged(auth, user => {
    if (!user) return;
    if (user.email === 'guest@example.com') return insertInitials('G');
    loadUserInitials(user.uid);
  });
}

/**
 * Loads the user's name from the database and displays initials in the topbar.
 */
async function loadUserInitials(uid) {
  if (!uid) return;
  const userRef = ref(db, `users/${uid}`);
  const snapshot = await get(userRef);
  if (!snapshot.exists()) return;
  const name = snapshot.val().name || '';
  handleInitialDisplay(name);
}

/**
 * Generates initials from name and inserts into topbar.
 */
function handleInitialDisplay(name) {
  const initials = getInitials(name);
  insertInitials(initials || '?');
}

/**
 * Returns the first two uppercase initials from a name string.
 */
function getInitials(name) {
  return name
    .split(' ')
    .map(word => getFirstLetter(word))
    .join('')
    .slice(0, 2);
}

/**
 * Returns the first character of a word, uppercased.
 */
function getFirstLetter(word) {
  return word.charAt(0).toUpperCase();
}

/**
 * Inserts the given initials text into the topbar user icon.
 */
function insertInitials(initials) {
  const el = document.querySelector('.topbar-user');
  if (el) el.textContent = initials;
}
