/**
 * This function exchanges the links in the sidebar when you go on legal or privacy policy via the start/index page
 * 
 * 
 */
function init() {
    const { navLinkHideAllClass, topbarIcons, navLinkUnregistered, sidebarFooterLinks, sidebarFooter, specialLink } = initDomElements();

    if(localStorage.getItem('unregistered') == 'true'){
        navLinkHideAllClass.forEach((element) => {
            element.classList.add('d-none');
            if(localStorage.getItem('special-unregistered') == 'true'){
                specialLink.attributes[0].value = 'register.html';
                specialLink.children[1].innerHTML = 'Sign Up';
            }
        });

        topbarIcons.classList.add('d-none')
        navLinkUnregistered.classList.remove('d-none');
        sidebarFooterLinks.classList.add('unregistered-sidebar')
        sidebarFooter.classList.add('d-flex');
    }
}

/**
 * This function hands over Dom Elements of variables
 * 
 * @returns -The variables
 */
function initDomElements(){
    const navLinkHideAllClass = document.querySelectorAll(".nav-link-hide");
    const topbarIcons = document.getElementById('topbar-iconsID');
    const navLinkUnregistered = document.getElementById('nav-link-unregisteredID');
    const sidebarFooterLinks = document.getElementById('sidebar-footer-linksID');
    const sidebarFooter = document.getElementById('sidebar-footer');
    const specialLink= document.getElementById('nav-link-unregisteredID');

    return {navLinkHideAllClass, topbarIcons, navLinkUnregistered, sidebarFooterLinks, sidebarFooter, specialLink}
}

window.addEventListener("load", function() {
    init();
});