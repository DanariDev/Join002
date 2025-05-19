window.addEventListener("load", () => {
  showGreeting();
  showDate();
});

function showGreeting() {
  const el = document.querySelector("#summary-greeting");
  const isGuest = false; // später dynamisch prüfen (Loginstatus)
  const name = "Sofia Müller"; // später aus Firebase holen

  if (isGuest) {
    el.innerHTML = `Good morning`;
  } else {
    el.innerHTML = `Good morning,<br><span>${name}</span>`;
  }
}

function showDate() {
  const el = document.querySelector("#deadline-date");
  const now = new Date();
  const opts = { year: 'numeric', month: 'long', day: 'numeric' };
  el.textContent = now.toLocaleDateString('en-US', opts);
}
