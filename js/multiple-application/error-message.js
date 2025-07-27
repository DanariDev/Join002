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
 * This function checks if the parameters are not "null" and executes them if applicable.
 * 
 * @param {*} nameCheckValue -If this value is to be checked, the appropriate ID must be provided here. If the value should not be checked, simply "null" (without quotes) will be used.
 * @param {*} emailCheckValue -If this value is to be checked, the appropriate ID must be provided here. If the value should not be checked, simply "null" (without quotes) will be used.
 * @param {*} phoneCheckValue -If this value is to be checked, the appropriate ID must be provided here. If the value should not be checked, simply "null" (without quotes) will be used.
 * @param {*} passwordCheckValue -If this value is to be checked, the appropriate ID must be provided here. If the value should not be checked, simply "null" (without quotes) will be used.
 * @param {*} passwordRepeatCheckValue -If this value is to be checked, the appropriate ID must be provided here. If the value should not be checked, simply "null" (without quotes) will be used.
 * @param {*} privacyCheckboxValue -If this value is to be checked, the appropriate ID must be provided here. If the value should not be checked, simply "null" (without quotes) will be used.
 * @param {*} errorCode -If this value is to be checked, the appropriate string of the error code must be provided here. If the value should not be checked, simply "null" (without quotes) will be used.
 * @returns -Here, either true or false is returned, depending on the value of "hasError".
 * 
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

/**
 * This function checks if the values are correct. 
 * If they are not, they are highlighted, 
 * and a hint is displayed indicating that something is wrong. 
 * Additionally, the value of "hasError" is returned.
 * 
 * @param {string} nameCheckValue -Here is the string of the input-name-id.
 * @param {boolean} hasError -Depending on whether the value is correct or not, the value is set to true or false here.
 * @returns -Here, either true or false is returned, depending on the value of "hasError".
 */
function nameCheck(nameCheckValue, hasError){
  const nameInput = document.getElementById(nameCheckValue);
  const nameError = document.querySelectorAll(".name-error");

  resetErrors(nameInput, nameError);
  const name = nameInput.value.trim();
    
  if(!name) { showError(nameInput, nameError, "Bitte Name eingeben."); hasError = true; }

  return hasError;
}

/**
 * This function checks if the values are correct. 
 * If they are not, they are highlighted, 
 * and a hint is displayed indicating that something is wrong. 
 * Additionally, the value of "hasError" is returned.
 * 
 * @param {string} emailCheckValue -Here is the string of the input-email-id.
 * @param {boolean} hasError -Depending on whether the value is correct or not, the value is set to true or false here.
 * @returns -Here, either true or false is returned, depending on the value of "hasError".
 */
function emailCheck(emailCheckValue, hasError){
  const emailInput = document.getElementById(emailCheckValue);
  const emailError = document.querySelectorAll(".email-error");

  resetErrors(emailInput, emailError);
  const email = emailInput.value.trim();
    
  if(!email) { showError(emailInput, emailError, "Bitte E-Mail eingeben."); hasError = true; }
  else if (!/^\S+@\S+\.\S+$/.test(email)) { showError(emailInput, emailError, "Ungültige E-Mail-Adresse!"); hasError = true; }

  return hasError;
}

/**
 * This function checks if the values are correct. 
 * If they are not, they are highlighted, 
 * and a hint is displayed indicating that something is wrong. 
 * Additionally, the value of "hasError" is returned.
 * 
 * @param {string} phoneCheckValue -Here is the string of the input-phone-id.
 * @param {boolean} hasError -Depending on whether the value is correct or not, the value is set to true or false here.
 * @returns -Here, either true or false is returned, depending on the value of "hasError".
 */
function phoneCheck (phoneCheckValue, hasError){
  const phoneInput = document.getElementById(phoneCheckValue);
  const phoneError = document.querySelectorAll(".phone-error");

  resetErrors(phoneInput, phoneError);
  const phone = phoneInput.value.trim();

  if(!phone) { showError(phoneInput, phoneError, "Bitte Telefonnummer eingeben."); hasError = true; }
  else if (!/^[+]?\d+$/.test(phone)) { showError(phoneInput, phoneError, "Ungültige Telefonnummer!"); hasError = true; }

  return hasError;
}

/**
 * This function checks if the values are correct. 
 * If they are not, they are highlighted, 
 * and a hint is displayed indicating that something is wrong. 
 * Additionally, the value of "hasError" is returned.
 * 
 * @param {string} passwortCheckValue -Here is the string of the input-passwort-id.
 * @param {boolean} hasError -Depending on whether the value is correct or not, the value is set to true or false here.
 * @returns -Here, either true or false is returned, depending on the value of "hasError".
 */
function passwordCheck (passwordCheckValue, hasError){
  const passwordInput = document.getElementById(passwordCheckValue);
  const passwordError = document.querySelectorAll(".password-error");

  resetErrors(passwordInput, passwordError);
  const password = passwordInput.value.trim();

  if(!password) { showError(passwordInput, passwordError, "Bitte Password eingeben."); hasError = true; }
  else if(password.length <6){ showError(passwordInput, passwordError, "Das Passwort muss mindestens 6 Zeichen lang sein."); hasError = true; }

  return hasError;
}

/**
 * This function checks if the values are correct. 
 * If they are not, they are highlighted, 
 * and a hint is displayed indicating that something is wrong. 
 * Additionally, the value of "hasError" is returned.
 * 
 * @param {string} passwordRepeatCheckValue -Here is the string of the input-password-repeat-id.
 * @param {boolean} hasError -Depending on whether the value is correct or not, the value is set to true or false here.
 * @returns -Here, either true or false is returned, depending on the value of "hasError".
 */
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

/**
 * This function checks if the values are correct. 
 * If they are not, they are highlighted, 
 * and a hint is displayed indicating that something is wrong. 
 * Additionally, the value of "hasError" is returned.
 * 
 * @param {string} privacyCheckboxValue -Here is the string of the input-privacy-Checkbox-id.
 * @param {boolean} hasError -Depending on whether the value is correct or not, the value is set to true or false here.
 * @returns -Here, either true or false is returned, depending on the value of "hasError".
 */
function privacyCheckbox (privacyCheckboxValue, hasError) {
  const checkbox = document.getElementById(privacyCheckboxValue);
  const checkboxError = document.querySelectorAll(".checkbox-error");

  resetErrors(checkbox, checkboxError);

  if (!checkbox.checked) { showError(checkbox, checkboxError, "Bitte akzeptiere die Datenschutzbestimmungen."); hasError = true; }
  
  return hasError;
}

/**
 * This function checks if the values email and/or password are valid for Firebase. 
 * If they don't match, they are highlighted, and a hint is displayed indicating that something is wrong.
 * 
 * @param {string} emailCheckValue - -Here is the string of the input-email-id.
 * @param {string} passwordCheckValue -Here is the string of the input-passwort-id.
 * @param {string} errorCode -Here is the string of the errorCode from Firebase.
 */
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
//Die Werte, die benötigt werden, müssen die passende -"ID"- haben. Die Werte, die nicht gebraucht werden, müssen mit -null- ersetzt werden.