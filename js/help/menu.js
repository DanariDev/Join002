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
