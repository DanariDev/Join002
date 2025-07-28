import { loadTasks } from "./load-tasks.js";
window.addEventListener("DOMContentLoaded", () => {
  loadTasks();
});

// Overlay öffnen
document.querySelectorAll('.add-task-btn, #add-task-button').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('add-task-overlay').classList.remove('d-none');
    document.getElementById('form-add-task').style.display = 'block';
    // Formular leeren
    document.getElementById('add-task-form').reset();
    // Default-Prio setzen
    document.querySelectorAll('.prio-btn').forEach(b => b.classList.remove('selected'));
    document.querySelector('.prio-btn.medium').classList.add('selected');
  });
});

// Overlay schließen
document.getElementById('closeFormModal').addEventListener('click', function () {
  document.getElementById('add-task-overlay').classList.add('d-none');
  document.getElementById('form-add-task').style.display = 'none';
});

// Overlay schließen, wenn auf den dunklen Bereich geklickt wird
document.getElementById('add-task-overlay').addEventListener('click', function (e) {
  if (e.target === this) {
    this.classList.add('d-none');
    document.getElementById('form-add-task').style.display = 'none';
  }
});

// Priority-Buttons "selected"-Klasse umschalten
document.querySelectorAll('.prio-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.prio-btn').forEach(b => b.classList.remove('selected'));
    this.classList.add('selected');
  });
});


document.getElementById('search-input').addEventListener('input', function() {
  const searchValue = this.value.trim().toLowerCase();
  const allTaskCards = document.querySelectorAll('.task-card');
  let anyVisible = false;

  allTaskCards.forEach(card => {
    const title = card.querySelector('.task-title').textContent.toLowerCase();
    const desc = card.querySelector('.task-desc').textContent.toLowerCase();

    if (title.includes(searchValue) || desc.includes(searchValue)) {
      card.style.display = '';
      anyVisible = true;
    } else {
      card.style.display = 'none';
    }
  });

  
  const noResultsMsg = document.getElementById('no-results-message');
  if (searchValue && !anyVisible) {
    noResultsMsg.style.display = 'flex';
  } else {
    noResultsMsg.style.display = 'none';
  }
});

