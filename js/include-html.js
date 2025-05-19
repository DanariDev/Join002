function includeHTML() {
  const elements = document.querySelectorAll('[include-html]');
  elements.forEach(el => {
    const file = el.getAttribute('include-html');
    fetch(file)
      .then(response => response.text())
      .then(data => {
        el.innerHTML = data;
        el.removeAttribute('include-html');
        includeHTML(); // Für verschachtelte Includes
      })
      .catch(err => {
        el.innerHTML = "Sidebar konnte nicht geladen werden.";
        console.error(err);
      });
  });
}
window.addEventListener('DOMContentLoaded', includeHTML);
