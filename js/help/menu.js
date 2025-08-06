export function setupTopbarMenu() {
  const userIcon = document.querySelector('.topbar-user');
  const menu = document.getElementById('menuID');
  const logoutBtn = document.getElementById('log-out-buttonID');
  if (!userIcon || !menu || !logoutBtn) return;
  setupUserIcon(userIcon, menu);
  setupLogoutBtn(logoutBtn);
  setupOutsideClick(menu, userIcon);
}

function setupUserIcon(userIcon, menu) {
  userIcon.addEventListener('click', e => {
    e.stopPropagation();
    menu.classList.toggle('d-none');
    menu.classList.toggle('d-flex');
  });
}
function setupLogoutBtn(logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'index.html';
  });
}
function setupOutsideClick(menu, userIcon) {
  document.addEventListener('click', e => {
    if (!menu.contains(e.target) && !userIcon.contains(e.target)) {
      menu.classList.add('d-none');
      menu.classList.remove('d-flex');
    }
  });
}
