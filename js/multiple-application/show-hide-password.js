function togglePassword() {
    toggleInputType('password-input', 'show-hide-password');
  }
  function togglePasswordRepeat() {
    toggleInputType('password-repeat-input', 'show-hide-repeat-password');
  }
  function toggleInputType(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (input.type == "password") {
      input.type = "text";
      icon.style.backgroundImage = "url(./assets/img/show-password.png)";
    } else {
      input.type = "password";
      icon.style.backgroundImage = "url(./assets/img/hiden-password.png)";
    }
  }
  function passwortLength(input, icon) {
    const pwInput = document.getElementById(input);
    pwInput?.addEventListener("input", () => {
      if (pwInput.value.length > 0) {
        pwInput.style.backgroundImage = "url('')";
        document.getElementById(icon).classList.remove('d-none');
      } else {
        pwInput.style.backgroundImage = "url(./assets/img/lock.png)";
        document.getElementById(icon).classList.add('d-none');
      }
    });
  }
  function setupShowHideEvents() {
    passwortLength('password-input', 'show-hide-password');
    passwortLength('password-repeat-input', 'show-hide-repeat-password');
    document.getElementById('show-hide-password').addEventListener("click", togglePassword);
    document.getElementById('show-hide-repeat-password')?.addEventListener("click", togglePasswordRepeat);
  }
  window.addEventListener("load", setupShowHideEvents);
  