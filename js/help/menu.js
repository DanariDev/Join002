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
    e.stopPropagation(); // Klick nicht an body weitergeben
    menu.classList.toggle('d-none');
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.clear(); // Optional: falls du dort was speicherst
    sessionStorage.clear(); // Auch das
    window.location.href = 'index.html'; // Zurück zur Login-Seite
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !userIcon.contains(e.target)) {
      menu.classList.add('d-none');
    }
  });
}
