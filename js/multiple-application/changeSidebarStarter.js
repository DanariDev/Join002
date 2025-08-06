localStorage.setItem('unregistered', 'false');
localStorage.setItem('special-unregistered', 'false');

function switchLinks() {
  localStorage.setItem('unregistered', 'true');
}
function specialSwitchLink() {
  localStorage.setItem('special-unregistered', 'true');
  switchLinks();
}
function setupSidebarStarterEvents() {
  addClick('privacyPolicyID', switchLinks);
  addClick('legalID', switchLinks);
  addClick('privacyPolicyFormID', specialSwitchLink, true);
}
function addClick(id, fn, allowNull = false) {
  const el = document.getElementById(id);
  if (el || allowNull) el?.addEventListener("click", fn);
}
window.addEventListener("load", setupSidebarStarterEvents);
