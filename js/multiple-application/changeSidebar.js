/**
 * Initializes the sidebar logic on page load:
 * Decides which sidebar elements to show based on registration state.
 */
function init() {
  const els = getDomElements();
  if (isUnregistered()) {
    handleUnregistered(els);
  } else {
    showAllNavLinks(els.navLinkHideAllClass);
  }
}

/**
 * Collects all relevant DOM elements for sidebar and nav.
 * @returns {object} - Collection of relevant sidebar and nav elements.
 */
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

/**
 * Checks if the user is in 'unregistered' mode via localStorage.
 * @returns {boolean} - True if user is unregistered.
 */
function isUnregistered() {
  return localStorage.getItem('unregistered') == 'true';
}

/**
 * Handles all changes to the sidebar for unregistered users,
 * including changing links and hiding/showing specific elements.
 * @param {object} els - The elements collection from getDomElements().
 */
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

/**
 * Shows all navigation links (removes 'd-none' class).
 * @param {NodeList} navLinks - List of sidebar links to show.
 */
function showAllNavLinks(navLinks) {
  navLinks.forEach(el => el.classList.remove('d-none'));
}

/**
 * Handles sidebar logic on window load and shows/hides topbar icons.
 */
window.addEventListener("load", function () {
  init();
  if (localStorage.getItem('unregistered') == 'false') {
    document.getElementById('topbar-iconsID').classList.remove('d-none');
  }
});
