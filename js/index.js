localStorage.setItem('unregistered', 'false');
localStorage.setItem('special-unregistered', 'false');

/**
 * This function sets the value "unregistered" in the local storage on "True".
 * 
 * 
 */
function switchLinks(){
    localStorage.setItem('unregistered', 'true');
}

function specialSwitchLink() {
    localStorage.setItem('special-unregistered', 'true');
    switchLinks();
}

window.addEventListener("load", function() {
    document.getElementById('privacyPolicyID').addEventListener("click", switchLinks);
    document.getElementById('legalID').addEventListener("click", switchLinks);
    document.getElementById('privacyPolicyFormID')?.addEventListener("click", specialSwitchLink);
});
