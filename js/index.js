localStorage.setItem('unregistered', 'false')

/**
 * This function sets the value "unregistered" in the local storage on "True".
 * 
 * 
 */
function switchLinks(){
    localStorage.setItem('unregistered', 'true');
}

window.addEventListener("load", function() {
    document.getElementById('privacyPolicyID').addEventListener("click", switchLinks);
    document.getElementById('legalID').addEventListener("click", switchLinks);
});
