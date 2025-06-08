function init(){
    if(localStorage.getItem('unregistered') == 'true'){
        document.querySelectorAll(".nav-link-hide").forEach((element) => {
            element.classList.add('d-none');
        });
        document.getElementById('topbar-iconsID').classList.add('d-none')
        document.getElementById('nav-link-unregisteredID').classList.remove('d-none');

        document.getElementById('sidebar-footer-linksID').classList.add('unregistered-sidebar')
        document.getElementById('sidebar-footer').classList.add('d-flex');
    }
}