localStorage.setItem('unregistered', 'false');
localStorage.setItem('special-unregistered', 'false');

/**
 * This function sets the value "unregistered" in the local storage to "true".
 */
function switchLinks() {
    localStorage.setItem('unregistered', 'true');
}

/**
 * This function sets the value "special-unregistered" in the local storage to "true".
 * Additionally, the "switchLinks" function is executed.
 */
function specialSwitchLink() {
    localStorage.setItem('special-unregistered', 'true');
    switchLinks();
}

/**
 * This instruction ensures that after the page loads, three buttons ("privacyPolicyID", "legalID", and "privacyPolicyFormID") each receive a click event listener. 
 * If the "privacyPolicyID" button is clicked, the switchLinks function is executed. 
 * If the "legalID" button is clicked, the switchLinks function is executed, and if the "privacyPolicyFormID" button is clicked, the "specialSwitchLink" function is executed.
 */
window.addEventListener("load", function () {
    document.getElementById('privacyPolicyID').addEventListener("click", switchLinks);
    document.getElementById('legalID').addEventListener("click", switchLinks);
    document.getElementById('privacyPolicyFormID')?.addEventListener("click", specialSwitchLink);
});