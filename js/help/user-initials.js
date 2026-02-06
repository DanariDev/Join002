import { api, getAuthUser, setAuth } from "../api/client.js";

/**
 * Fetches and displays the user's initials in the topbar.
 * Shows "G" if guest is logged in.
 */
export function showUserInitials() {
  const cached = getAuthUser();
  if (cached?.initials) return insertInitials(cached.initials);
  if (cached?.name) return insertInitials(getInitials(cached.name));
  api.me()
    .then(({ user }) => {
      if (user) {
        setAuth(null, user);
        insertInitials(user.initials || getInitials(user.name || ''));
      }
    })
    .catch(() => {});
}

/**
 * Loads the user's name from the database and displays initials in the topbar.
 * @param {string} uid - The user's unique ID from Firebase.
 */
// API already returns initials or name

/**
 * Returns the first two uppercase initials from a name string.
 * @param {string} name - The user's full name.
 * @returns {string} - The initials (max 2 letters).
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
 * @param {string} word - A single word.
 * @returns {string} - The first uppercase letter of the word.
 */
function getFirstLetter(word) {
  return word.charAt(0).toUpperCase();
}

/**
 * Inserts the given initials text into the topbar user icon.
 * @param {string} initials - The initials to display.
 */
function insertInitials(initials) {
  const el = document.querySelector('.topbar-user');
  if (el) el.textContent = initials;
}
