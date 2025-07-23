import { auth, db } from '../firebase/firebase-init.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

export function showUserInitials() {
  onAuthStateChanged(auth, (user) => {
    if (!user) return;
    if (user.email === 'guest@example.com') {
      return insertInitials('G');
    }
    loadUserInitials(user.uid);
  });
}

async function loadUserInitials(uid) {
  const userRef = ref(db, `users/${uid}`);
  const snapshot = await get(userRef);
  if (!snapshot.exists()) return;

  const name = snapshot.val().name || '';
  handleInitialDisplay(name);
}

function handleInitialDisplay(name) {
  const initials = getInitials(name);
  insertInitials(initials || '?');
}

function getInitials(name) {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
}

function insertInitials(initials) {
  const el = document.querySelector('.topbar-user');
  if (el) el.textContent = initials;
}
