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

/**
 * This function swaps the icon in the password input field if the input field is not empty.
 * Additionally, it checks if the password input field exists.
 * 
 * @param {string} input -This string returns the ID of the input field.
 * @param {string} icon -This string returns the ID of the icon (div).
 */
function passwortLength(input, icon){
    const passwortInput = document.getElementById(input)
    passwortInput?.addEventListener("input", function() {
       if(passwortInput.value.length >0) {
        passwortInput.style.backgroundImage = "url('')";
        document.getElementById(icon).classList.remove('d-none');
       }
       else{
        passwortInput.style.backgroundImage = "url(./assets/img/lock.png)";
        document.getElementById(icon).classList.add('d-none');
       } 
    });
}

/**
 * This statement ensures that after the page loads, the same function is executed twice with different values. 
 * Additionally, the two icons (divs) ("show-hide-password" and "show-hide-repeat-password"), if both are present, will each receive a click event listener. 
 * If only "show-hide-password" is present, it will be the only one assigned a click event listener. 
 * If the "show-hide-password" icon is clicked, the "togglePassword" function is executed. 
 * If the "show-hide-repeat-password" icon is clicked, the "togglePasswordRepeat" function is executed.
 */
window.addEventListener("load", function () {
    passwortLength('password-input', 'show-hide-password');
    passwortLength('password-repeat-input', 'show-hide-repeat-password');

    document.getElementById('show-hide-password').addEventListener("click", togglePassword);
    document.getElementById('show-hide-repeat-password')?.addEventListener("click", togglePasswordRepeat);
});