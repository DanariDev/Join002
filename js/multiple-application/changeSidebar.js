function init() {
    const els = getDomElements();
    if (isUnregistered()) {
      handleUnregistered(els);
    } else {
      showAllNavLinks(els.navLinkHideAllClass);
    }
  }
  function getDomElements() {
    return {
      navLinkHideAllClass: document.querySelectorAll(".nav-link-hide"),
      topbarIcons: document.getElementById('topbar-iconsID'),
      navLinkUnregistered: document.getElementById('nav-link-unregisteredID'),
      sidebarFooterLinks: document.getElementById('sidebar-footer-linksID'),
      sidebarFooter: document.getElementById('sidebar-footer'),
      specialLink: document.getElementById('nav-link-unregisteredID'),
    };
  }
  function isUnregistered() {
    return localStorage.getItem('unregistered') == 'true';
  }
  function handleUnregistered(els) {
    if (localStorage.getItem('special-unregistered') == 'true') {
      els.specialLink.attributes[0].value = 'register.html';
      els.specialLink.children[1].innerHTML = 'Sign Up';
    }
    els.topbarIcons.classList.add('d-none');
    els.navLinkUnregistered.classList.remove('d-none');
    els.sidebarFooterLinks.classList.add('unregistered-sidebar');
    els.sidebarFooter.classList.add('d-flex');
  }
  function showAllNavLinks(navLinks) {
    navLinks.forEach(el => el.classList.remove('d-none'));
  }
  window.addEventListener("load", function () {
    init();
    if (localStorage.getItem('unregistered') == 'false') {
      document.getElementById('topbar-iconsID').classList.remove('d-none');
    }
  });
  