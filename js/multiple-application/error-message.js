/**
 * This function resets the error message
 * 
 * @param {object} inputs -delivers the input-Dom value
 * @param {object} errors -delivers the error-div-Dom value
 */
function resetErrors(inputs, errors) {
  inputs.classList.remove("input-error");
  errors.forEach(e => e.textContent = "");
}

/**
 * This function sets the error message
 * 
 * @param {object} input -delivers the input-Dom value
 * @param {object} errorElem -delivers the error-div-Dom value
 * @param {string} message -delivers the message value
 */
function showError(input, errorElem, message) {
  input.classList.add("input-error");
  errorElem.forEach(e => e.textContent = message);
}

/**
 * This function checks whether the values ​​fit in the input fields
 * 
 * @returns -There becomes the values of "has error", "name", "email", "phone" return
 */
export function checkInput(nameCheckValue = null, emailCheckValue = null, phoneCheckValue = null, passwordCheckValue = null, passwordRepeatCheckValue = null, privacyCheckboxValue = null, errorCode = null) {
  let hasError = false

  if(nameCheckValue != null) hasError = nameCheck(nameCheckValue, hasError);
  if(emailCheckValue != null) hasError = emailCheck(emailCheckValue, hasError);
  if(phoneCheckValue != null) hasError = phoneCheck(phoneCheckValue, hasError);
  if(passwordCheckValue != null) hasError = passwordCheck(passwordCheckValue, hasError);
  if(passwordRepeatCheckValue != null) hasError = passwordRepeatCheck(passwordRepeatCheckValue, hasError);
  if(privacyCheckboxValue != null) hasError = privacyCheckbox(privacyCheckboxValue, hasError);
  if(errorCode != null) incorrectDataToAuthentication(emailCheckValue, passwordCheckValue, errorCode);

  return hasError;
}

function nameCheck(nameCheckValue, hasError){
  const nameInput = document.getElementById(nameCheckValue);
  const nameError = document.querySelectorAll(".name-error");

  resetErrors(nameInput, nameError);
  const name = nameInput.value.trim();
    
  if(!name) { showError(nameInput, nameError, "Bitte Name eingeben."); hasError = true; }

  return hasError;
}

function emailCheck(emailCheckValue, hasError){
  const emailInput = document.getElementById(emailCheckValue);
  const emailError = document.querySelectorAll(".email-error");

  resetErrors(emailInput, emailError);
  const email = emailInput.value.trim();
    
  if(!email) { showError(emailInput, emailError, "Bitte E-Mail eingeben."); hasError = true; }
  else if (!/^\S+@\S+\.\S+$/.test(email)) { showError(emailInput, emailError, "Ungültige E-Mail-Adresse!"); hasError = true; }

  return hasError;
}

function phoneCheck (phoneCheckValue, hasError){
  const phoneInput = document.getElementById(phoneCheckValue);
  const phoneError = document.querySelectorAll(".phone-error");

  resetErrors(phoneInput, phoneError);
  const phone = phoneInput.value.trim();

  if(!phone) { showError(phoneInput, phoneError, "Bitte Telefonnummer eingeben."); hasError = true; }
  else if (!/^[+]?\d+$/.test(phone)) { showError(phoneInput, phoneError, "Ungültige Telefonnummer!"); hasError = true; }

  return hasError;
}

function passwordCheck (passwordCheckValue, hasError){
  const passwordInput = document.getElementById(passwordCheckValue);
  const passwordError = document.querySelectorAll(".password-error");

  resetErrors(passwordInput, passwordError);
  const password = passwordInput.value.trim();

  if(!password) { showError(passwordInput, passwordError, "Bitte Password eingeben."); hasError = true; }
  else if(password.length <6){ showError(passwordInput, passwordError, "Das Passwort muss mindestens 6 Zeichen lang sein."); hasError = true; }

  return hasError;
}

function passwordRepeatCheck (passwordRepeatCheckValue, hasError){
  const passwordRepeatInput = document.getElementById(passwordRepeatCheckValue);
  const passwordRepeatError = document.querySelectorAll(".repeat-error");

  resetErrors(passwordRepeatInput, passwordRepeatError)
  const passwordRepeat = passwordRepeatInput.value.trim();
  const password = document.getElementById('password-input').value.trim();

  if(!passwordRepeat) { showError(passwordRepeatInput, passwordRepeatError, "Bitte das Passwort wiederholt eingeben."); hasError = true; }
  else if(passwordRepeat != password){ showError(passwordRepeatInput, passwordRepeatError, "Stimmt mit dem Passwort nicht überein"); hasError = true; }

  return hasError;
}

function privacyCheckbox (privacyCheckboxValue, hasError) {
  const checkbox = document.getElementById(privacyCheckboxValue);
  const checkboxError = document.querySelectorAll(".checkbox-error");

  resetErrors(checkbox, checkboxError);

  if (!checkbox.checked) { showError(checkbox, checkboxError, "Bitte akzeptiere die Datenschutzbestimmungen."); hasError = true; }
  
  return hasError;
}

function incorrectDataToAuthentication(emailCheckValue, passwordCheckValue, errorCode){
  const emailInput = document.getElementById(emailCheckValue);
  const emailError = document.querySelectorAll(".email-error");
  resetErrors(emailInput, emailError);

  const passwordInput = document.getElementById(passwordCheckValue);
  const passwordError = document.querySelectorAll(".password-error");
  resetErrors(passwordInput, passwordError);

  if (errorCode == 'auth/invalid-email' || errorCode == 'auth/user-not-found' || errorCode == 'auth/wrong-password'|| errorCode == 'auth/invalid-credential') {
    showError(emailInput, emailError, "");
    showError(passwordInput, passwordError, "Ungültige Anmeldedaten, bitte prüfen Sie Passwort und E-mail");
  } 
  else {
    showError(emailInput, emailError, "");
    showError(passwordInput, passwordError, "Es ist ein unerwarteter Fehler aufgetreten. Bitte kontaktieren Sie den Kundensupport.");
  }
}



//vorlage -> checkInput(Name, Email, Phone, Password, PasswordRepeat, privacyCheckbox, errorCode)
//die werte die benötigt werden, die passende -ID- einfügen, die nihct gebraucht werden -null- einsetzten