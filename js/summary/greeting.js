import { api, getAuthUser, setAuth } from "../api/client.js";
import { t } from "../i18n/i18n.js";

/**
 * Initializes the personalized greeting.
 * Sets the greeting time and fetches the user's name (if not guest).
 * Returns a Promise so other loaders can wait for greeting to finish.
 * @returns {Promise<void>}
 */
export function initGreeting() {
  return new Promise(resolve => {
    setGreetingTime();
    setGreetingName().then(resolve);
  });
}

/**
 * Sets the greeting message (Good morning/afternoon/evening) based on current time.
 */
function setGreetingTime() {
  const field = document.querySelector("#summary-greeting-time");
  const h = new Date().getHours();
  if (h < 12) field.textContent = t("common.goodMorning");
  else if (h < 18) field.textContent = t("common.goodAfternoon");
  else field.textContent = t("common.goodEvening");
}

/**
 * Loads and displays the current user's name,
 * or shows nothing if guest is logged in.
 * @param {object} user - The current Firebase user object.
 */
async function setGreetingName() {
  const nameField = document.querySelector("#summary-greeting-name");
  const cached = getAuthUser();
  if (cached?.email === "guest@join.local") {
    nameField.textContent = "";
    return;
  }
  if (cached?.name) {
    nameField.textContent = cached.name;
    return;
  }
  try {
    const { user } = await api.me();
    if (user) {
      setAuth(null, user);
      nameField.textContent = user.name || "";
      return;
    }
  } catch (e) {}
  nameField.textContent = "";
}

/**
 * Hides the loader overlay after a short delay,
 * and makes the body visible.
 */
function hideLoader() {
  const loader = document.getElementById('summary-loader');
  setTimeout(() => {
    if (loader) loader.style.display = 'none';
    document.body.classList.remove('hidden');
  }, 900);
}

/**
 * On DOMContentLoaded, initializes greeting, task counters, and deadline.
 * Hides loader when everything is ready.
 */
window.addEventListener('DOMContentLoaded', async () => {
  await initGreeting();
  if (window.initTaskCounters) await window.initTaskCounters();
  if (window.initDeadlineDate) await window.initDeadlineDate();
  hideLoader();
});
