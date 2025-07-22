localStorage.setItem('unregistered', 'false');
localStorage.setItem('special-unregistered', 'false');

/**
 * This function sets the value "unregistered" in the local storage on "True".
 */
function switchLinks() {
    localStorage.setItem('unregistered', 'true');
}

/**
 * This function sets the value "special-unregistered" in the local storage on "True".
 */
function specialSwitchLink() {
    localStorage.setItem('special-unregistered', 'true');
    switchLinks();
}

/**
 * This function exchanges the "type" in the input-field "password" between "text" and 
 * "password". On the other hand, the icon is changed on the right side in the input field.
 */
function togglePassword() {
    const passwordInput = document.getElementById("password-input");
    const showHidePassword = document.getElementById("show-hide-password");

    if (passwordInput.type == "password") {
        passwordInput.type = "text";
        showHidePassword.style.backgroundImage = "url(./assets/img/show-password.png)";
    } else {
        passwordInput.type = "password";
        showHidePassword.style.backgroundImage = "url(./assets/img/hiden-password.png)";
    }
}

/**
 * This function exchanges the "type" in the input-field "password repeat" between "text" and 
 * "password". On the other hand, the icon is changed on the right side in the input field.
 */
function togglePasswordRepeat(){
    const passwordRepeatInput = document.getElementById("password-repeat-input");
    const showHideRepeatPassword = document.getElementById("show-hide-repeat-password");

    if (passwordRepeatInput.type == "password") {
        passwordRepeatInput.type = "text";
        showHideRepeatPassword.style.backgroundImage = "url(./assets/img/show-password.png)";
    } else {
        passwordRepeatInput.type = "password";
        showHideRepeatPassword.style.backgroundImage = "url(./assets/img/hiden-password.png)";
    }
}



window.addEventListener("load", function () {
    document.getElementById('privacyPolicyID').addEventListener("click", switchLinks);
    document.getElementById('legalID').addEventListener("click", switchLinks);
    document.getElementById('privacyPolicyFormID')?.addEventListener("click", specialSwitchLink);

    const passwortInput = document.getElementById('password-input')
    passwortInput.addEventListener("input", function() {
       if(passwortInput.value.length >0) {
        passwortInput.style.backgroundImage = "url('')";
        document.getElementById('show-hide-password').classList.remove('d-none');
       }
       else{
        passwortInput.style.backgroundImage = "url(./assets/img/lock.png)";
        document.getElementById('show-hide-password').classList.add('d-none');
       } 
    });

    const passwortRepeatInput = document.getElementById('password-repeat-input')
    passwortRepeatInput?.addEventListener("input", function() {
       if(passwortRepeatInput.value.length >0) {
        passwortRepeatInput.style.backgroundImage = "url('')";
        document.getElementById('show-hide-repeat-password').classList.remove('d-none');
       }
       else{
        passwortRepeatInput.style.backgroundImage = "url(./assets/img/lock.png)";
        document.getElementById('show-hide-repeat-password').classList.add('d-none');
       } 
    });

    document.getElementById('show-hide-password').addEventListener("click", togglePassword);
    document.getElementById('show-hide-repeat-password')?.addEventListener("click", togglePasswordRepeat);
});

