function openMenu() {
  const menu = document.getElementById('menuID');
  if (menu) menu.classList.toggle('d-none');
}

function getInitials(name) {
  return name
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase();
}

function updateTopbarUser() {
  const el = document.querySelector('.topbar-user');
  if (!el) return;
  const isGuest = localStorage.getItem("isGuest") === "true";
  const name = localStorage.getItem("userName") || "User";
  el.textContent = isGuest ? "G" : getInitials(name);
}

function closeMenuIfOutsideClick(e) {
  const menu = document.getElementById('menuID');
  const button = document.querySelector('.topbar-user');
  if (!menu || menu.classList.contains('d-none')) return;
  if (!menu.contains(e.target) && !button.contains(e.target)) {
    menu.classList.add('d-none');
  }
}


window.onload = function () {
  setTimeout(updateTopbarUser, 200);
  document.body.onclick = closeMenuIfOutsideClick;

  if (typeof contactsList === "function") {
    contactsList();
  }
};
