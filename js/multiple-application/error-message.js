/**
 * Runs validation checks for all specified fields.
 * Returns true if any validation fails, false if all pass.
 * Can also handle login error codes for feedback.
 * @returns {boolean} - True if there are validation errors.
 */
import { t } from "../i18n/i18n.js";

export function checkInput(
  nameCheckValue = null, emailCheckValue = null, phoneCheckValue = null,
  passwordCheckValue = null, passwordRepeatCheckValue = null,
  privacyCheckboxValue = null, errorCode = null
) {
  let hasError = false;
  if (nameCheckValue) hasError = nameCheck(nameCheckValue, hasError);
  if (emailCheckValue) hasError = emailCheck(emailCheckValue, hasError);
  if (phoneCheckValue) hasError = phoneCheck(phoneCheckValue, hasError);
  if (passwordCheckValue) hasError = passwordCheck(passwordCheckValue, hasError);
  if (passwordRepeatCheckValue) hasError = passwordRepeatCheck(passwordRepeatCheckValue, hasError);
  if (privacyCheckboxValue) hasError = privacyCheckbox(privacyCheckboxValue, hasError);
  if (errorCode) incorrectDataToAuthentication(emailCheckValue, passwordCheckValue, errorCode);
  return hasError;
}

/**
 * Removes error styling and error text from the given input and error elements.
 * @param {HTMLElement} input - The input element.
 * @param {NodeList} errors - List of error elements.
 */
function resetErrors(input, errors) {
  input.classList.remove("input-error");
  errors.forEach(e => e.textContent = "");
}

/**
 * Adds error styling and sets the error message on the given elements.
 * @param {HTMLElement} input - The input element.
 * @param {NodeList} errorElem - List of error elements.
 * @param {string} message - The error message.
 */
function showError(input, errorElem, message) {
  input.classList.add("input-error");
  errorElem.forEach(e => e.textContent = message);
}

/**
 * Validates the name field: must not be empty.
 * @param {string} id - The id of the name input field.
 * @param {boolean} hasError - Current error state.
 * @returns {boolean} - Updated error state.
 */
function nameCheck(id, hasError) {
  const input = document.getElementById(id);
  const error = document.querySelectorAll(".name-error");
  resetErrors(input, error);
  if (!input.value.trim()) { showError(input, error, t("common.errors.nameRequired")); hasError = true; }
  return hasError;
}

/**
 * Validates the email field: must not be empty and must be a valid email.
 * @param {string} id - The id of the email input field.
 * @param {boolean} hasError - Current error state.
 * @returns {boolean} - Updated error state.
 */
function emailCheck(id, hasError) {
  const input = document.getElementById(id);
  const error = document.querySelectorAll(".email-error");
  resetErrors(input, error);
  const value = input.value.trim();
  if (!value) { showError(input, error, t("common.errors.emailRequired")); hasError = true; }
  else if (!/^\S+@\S+\.\S+$/.test(value)) { showError(input, error, t("common.errors.emailInvalid")); hasError = true; }
  return hasError;
}

/**
 * Validates the phone number field: must not be empty, must contain only digits (and optional +).
 * @param {string} id - The id of the phone input field.
 * @param {boolean} hasError - Current error state.
 * @returns {boolean} - Updated error state.
 */
function phoneCheck(id, hasError) {
  const input = document.getElementById(id);
  const error = document.querySelectorAll(".phone-error");
  resetErrors(input, error);
  const value = input.value.trim();
  if (!value) { showError(input, error, t("common.errors.phoneRequired")); hasError = true; }
  else if (!/^[+]?\d+$/.test(value)) { showError(input, error, t("common.errors.phoneInvalid")); hasError = true; }
  return hasError;
}

/**
 * Validates the password field: must not be empty and at least 6 characters long.
 * @param {string} id - The id of the password input field.
 * @param {boolean} hasError - Current error state.
 * @returns {boolean} - Updated error state.
 */
function passwordCheck(id, hasError) {
  const input = document.getElementById(id);
  const error = document.querySelectorAll(".password-error");
  resetErrors(input, error);
  const value = input.value.trim();
  if (!value) { showError(input, error, t("common.errors.passwordRequired")); hasError = true; }
  else if (value.length < 6) { showError(input, error, t("common.errors.passwordShort")); hasError = true; }
  return hasError;
}

/**
 * Validates the password repeat field: must not be empty and must match the original password.
 * @param {string} id - The id of the repeat password input field.
 * @param {boolean} hasError - Current error state.
 * @returns {boolean} - Updated error state.
 */
function passwordRepeatCheck(id, hasError) {
  const input = document.getElementById(id);
  const error = document.querySelectorAll(".repeat-error");
  resetErrors(input, error);
  const value = input.value.trim();
  const pw = document.getElementById('password-input').value.trim();
  if (!value) { showError(input, error, t("common.errors.passwordRepeatRequired")); hasError = true; }
  else if (value !== pw) { showError(input, error, t("common.errors.passwordMismatch")); hasError = true; }
  return hasError;
}

/**
 * Validates the privacy policy checkbox: must be checked.
 * @param {string} id - The id of the privacy checkbox.
 * @param {boolean} hasError - Current error state.
 * @returns {boolean} - Updated error state.
 */
function privacyCheckbox(id, hasError) {
  const checkbox = document.getElementById(id);
  const error = document.querySelectorAll(".checkbox-error");
  resetErrors(checkbox, error);
  if (!checkbox.checked) { showError(checkbox, error, t("common.errors.privacyRequired")); hasError = true; }
  return hasError;
}

/**
 * Handles authentication errors during login.
 * Shows appropriate error message depending on the Firebase error code.
 * @param {string} emailId - The id of the email input field.
 * @param {string} pwId - The id of the password input field.
 * @param {string} code - The Firebase error code.
 */
function incorrectDataToAuthentication(emailId, pwId, code) {
  const emailInput = document.getElementById(emailId);
  const emailError = document.querySelectorAll(".email-error");
  resetErrors(emailInput, emailError);
  const pwInput = document.getElementById(pwId);
  const pwError = document.querySelectorAll(".password-error");
  resetErrors(pwInput, pwError);
  if (["auth/invalid-email", "auth/user-not-found", "auth/wrong-password", "auth/invalid-credential"].includes(code)) {
    showError(emailInput, emailError, "");
    showError(pwInput, pwError, t("common.errors.loginInvalid"));
  } else {
    showError(emailInput, emailError, "");
    showError(pwInput, pwError, t("common.errors.unexpectedError"));
  }
}
