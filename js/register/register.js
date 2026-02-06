import { checkInput } from "../multiple-application/error-message.js";
import { api, setAuth } from "../api/client.js";
import { t } from "../i18n/i18n.js";

/**
 * Initializes registration form (e.g. sets up button event).
 */
export function initRegister() {
  setupSignUpBtn();
}

/**
 * Adds click event listener to the sign-up button.
 */
function setupSignUpBtn() {
  const btn = document.getElementById('sign-up-btn');
  if (btn) btn.addEventListener('click', signup);
}

/**
 * Handles sign-up process: validation, user creation, notification, redirect.
 */
async function signup() {
  const name = getVal('name-input');
  const email = getVal('email-input');
  const password = getVal('password-input');
  let hasError = checkInput("name-input", "email-input", null, "password-input", "password-repeat-input", "privacy-checkbox");
  if (hasError) return;
  try {
    const { token, user } = await registerUser(name, email, password);
    setAuth(token, user);
    showNotification(t("common.registrationSuccess"), "success");
    setTimeout(startTransitionToSummary, 1000);
  } catch (e) {
    console.clear();
    const msg = e?.data?.error === "email_exists"
      ? t("common.emailExists")
      : t("common.registrationFailed") + "\n" + (e?.message || "");
    showNotification(msg, "error");
  }
}

/**
 * Registers user in Firebase Auth and adds user/contact to the database.
 * @param {string} name - The user's name.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 */
async function registerUser(name, email, password) {
  return await api.register(name, email, password);
}

/**
 * Returns initials (first two uppercase letters) from the full name.
 * @param {string} name - The user's full name.
 * @returns {string} - The initials.
 */
/**
 * Returns the value of an input field by id.
 * @param {string} id - The input field's id.
 * @returns {string} - The input's value.
 */
function getVal(id) {
  return document.getElementById(id).value;
}

/**
 * Shows notification box with a message and style (success/error).
 * @param {string} message - The notification message.
 * @param {string} [type="success"] - Notification type (success or error).
 */
function showNotification(message, type = "success") {
  const box = document.getElementById("notification");
  box.textContent = message;
  box.className = `notification ${type} show`;
  setTimeout(() => hideNotification(box), 4000);
}

/**
 * Hides the notification box (after a delay).
 * @param {HTMLElement} box - The notification box element.
 */
function hideNotification(box) {
  box.classList.remove("show");
  box.style.bottom = "-100px";
  box.style.opacity = "0";
}

/**
 * Starts the summary page transition after registration.
 */
function startTransitionToSummary() {
  const overlay = document.getElementById("page-transition");
  if (overlay) overlay.classList.remove("hidden");
  setTimeout(() => window.location.href = "summary.html", 500);
}
