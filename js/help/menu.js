/**
 * This function ensures that the top bar menu can be opened and closed. 
 * In addition, the values are reset when you press the logout button
 * 
 * @returns - If userIcon, menu or logoutBtn does not exist, the function will be stopped here
 */
export function setupTopbarMenu() {
  const userIcon = document.querySelector('.topbar-user');
  const menu = document.getElementById('menuID');
  const logoutBtn = document.getElementById('log-out-buttonID');

  if (!userIcon || !menu || !logoutBtn) return;

  userIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('d-none');
    menu.classList.toggle('d-flex');
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'index.html';
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !userIcon.contains(e.target)) {
      menu.classList.add('d-none');
    }
  });
}
