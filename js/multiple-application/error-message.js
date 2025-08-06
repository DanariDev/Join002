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
function resetErrors(input, errors) {
  input.classList.remove("input-error");
  errors.forEach(e => e.textContent = "");
}
function showError(input, errorElem, message) {
  input.classList.add("input-error");
  errorElem.forEach(e => e.textContent = message);
}
function nameCheck(id, hasError) {
  const input = document.getElementById(id);
  const error = document.querySelectorAll(".name-error");
  resetErrors(input, error);
  if (!input.value.trim()) { showError(input, error, "Please enter your name."); hasError = true; }
  return hasError;
}
function emailCheck(id, hasError) {
  const input = document.getElementById(id);
  const error = document.querySelectorAll(".email-error");
  resetErrors(input, error);
  const value = input.value.trim();
  if (!value) { showError(input, error, "Please enter your email."); hasError = true; }
  else if (!/^\S+@\S+\.\S+$/.test(value)) { showError(input, error, "Invalid email address!"); hasError = true; }
  return hasError;
}
function phoneCheck(id, hasError) {
  const input = document.getElementById(id);
  const error = document.querySelectorAll(".phone-error");
  resetErrors(input, error);
  const value = input.value.trim();
  if (!value) { showError(input, error, "Please enter your phone number."); hasError = true; }
  else if (!/^[+]?\d+$/.test(value)) { showError(input, error, "Invalid phone number!"); hasError = true; }
  return hasError;
}
function passwordCheck(id, hasError) {
  const input = document.getElementById(id);
  const error = document.querySelectorAll(".password-error");
  resetErrors(input, error);
  const value = input.value.trim();
  if (!value) { showError(input, error, "Please enter your password."); hasError = true; }
  else if (value.length < 6) { showError(input, error, "The password must be at least 6 characters long."); hasError = true; }
  return hasError;
}
function passwordRepeatCheck(id, hasError) {
  const input = document.getElementById(id);
  const error = document.querySelectorAll(".repeat-error");
  resetErrors(input, error);
  const value = input.value.trim();
  const pw = document.getElementById('password-input').value.trim();
  if (!value) { showError(input, error, "Please re-enter the password."); hasError = true; }
  else if (value !== pw) { showError(input, error, "The passwords do not match."); hasError = true; }
  return hasError;
}
function privacyCheckbox(id, hasError) {
  const checkbox = document.getElementById(id);
  const error = document.querySelectorAll(".checkbox-error");
  resetErrors(checkbox, error);
  if (!checkbox.checked) { showError(checkbox, error, "Please accept the privacy policy."); hasError = true; }
  return hasError;
}
function incorrectDataToAuthentication(emailId, pwId, code) {
  const emailInput = document.getElementById(emailId);
  const emailError = document.querySelectorAll(".email-error");
  resetErrors(emailInput, emailError);
  const pwInput = document.getElementById(pwId);
  const pwError = document.querySelectorAll(".password-error");
  resetErrors(pwInput, pwError);
  if (["auth/invalid-email", "auth/user-not-found", "auth/wrong-password", "auth/invalid-credential"].includes(code)) {
    showError(emailInput, emailError, "");
    showError(pwInput, pwError, "Invalid login credentials, please check your password and email.");
  } else {
    showError(emailInput, emailError, "");
    showError(pwInput, pwError, "An unexpected error occurred. Please contact customer support.");
  }
}
