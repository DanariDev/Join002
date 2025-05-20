function openMenu() {
    document.getElementById('menuID').classList.toggle('display-none');
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
  
  window.onload = function () {
    setTimeout(updateTopbarUser, 200);
  };
  