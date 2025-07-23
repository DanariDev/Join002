import { auth, db } from '../firebase/firebase-init.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

/**
 * This function checks whether and what value the user has, or if it is a guest login. 
 * If the user check is successful, the function test1 will be executed. 
 * If the guest check is successful, the function test2 will be executed. 
 * If neither check is successful, the process will be aborted.
 */
export function showUserInitials() {
  onAuthStateChanged(auth, (user) => {
    if (!user) return;
    if (user.email === 'guest@example.com') {
      return insertInitials('G');
    }
    loadUserInitials(user.uid);
  });
}

/**
 * This function retrieves the user's name using the user ID (uid) and passes it to the handleInitialDisplay function. 
 * If the user ID has no value, the function will be aborted.
 * 
 * @param {string} uid -This string contains the value of the user ID.
 * @returns -If no value is present, the process will be aborted here.
 */
async function loadUserInitials(uid) {
  const userRef = ref(db, `users/${uid}`);
  const snapshot = await get(userRef);
  if (!snapshot.exists()) return;

  const name = snapshot.val().name || '';
  handleInitialDisplay(name);
}

/**
 * This function passes the name to the getInitials function. Then, the adjusted value is passed to the insertInitials function.
 * 
 * @param {string} name -This string has the name of the user
 */
function handleInitialDisplay(name) {
  const initials = getInitials(name);
  insertInitials(initials || '?');
}

/**
 * This function create the initials based on the name
 * 
 * @param {string} name - Name of the user
 * @returns - gives the initials of the name back
 */
function getInitials(name) {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
}

/**
 * This function assigns the initial value to the topbar menu icon
 * 
 * @param {string} initials -This variable has the value for the initial
 */
function insertInitials(initials) {
  const el = document.querySelector('.topbar-user');
  if (el) el.textContent = initials;
}
