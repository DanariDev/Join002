function resetErrors(inputs, errors) {
  inputs.forEach(i => i.classList.remove("input-error"));
  errors.forEach(e => {
    e.textContent = "";
    e.style.display = "none";
  });
}

function showError(input, errorElem, message) {
  input.classList.add("input-error");
  errorElem.textContent = message;
  errorElem.style.display = "block";
}

function checkInput() {
  const nameInput = document.getElementById("edit-name");
  const emailInput = document.getElementById("edit-email");
  const phoneInput = document.getElementById("edit-phone");

  const nameError = document.querySelector(".name-error");
  const emailError = document.querySelector(".email-error");
  const phoneError = document.querySelector(".phone-error");

  resetErrors([nameInput, emailInput, phoneInput], [nameError, emailError, phoneError])

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();

  let hasError = false;

  if(!name) { showError(nameInput, nameError, "Bitte Name eingeben."); hasError = true; }

  if(!email) { showError(emailInput, emailError, "Bitte E-Mail eingeben."); hasError = true; }
  else if (!/^\S+@\S+\.\S+$/.test(email)) { showError(emailInput, emailError, "Ungültige E-Mail-Adresse!"); hasError = true; }

  if(!phone) { showError(phoneInput, phoneError, "Bitte Telefonnummer eingeben."); hasError = true; }
  else if (!/^[+]?\d+$/.test(phone)) { showError(phoneInput, phoneError, "Ungültige Telefonnummer!"); hasError = true; }

  return {hasError, name, email, phone};
}