import { loadTasks } from "./load-tasks.js";
window.addEventListener("DOMContentLoaded", () => {
  loadTasks();
});
// === ADD TASK OVERLAY HANDLING ===

// Alle Plus-Buttons holen (Board-Kopf & Spalten)
document.querySelectorAll('.add-task-btn, #add-task-button').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    // Overlay einblenden
    document.getElementById('add-task-overlay').classList.remove('d-none');
    document.getElementById('form-add-task').style.display = 'block';
    // Optional: Formular leeren oder vorbereiten (hier als Platzhalter)
    document.getElementById('formContainer').innerHTML = '<div style="text-align:center;opacity:0.5">Hier kommt das Formular!</div>';
  });
});

// Overlay per Schließen-Button wieder schließen
document.getElementById('closeFormModal').addEventListener('click', function () {
  document.getElementById('add-task-overlay').classList.add('d-none');
  document.getElementById('form-add-task').style.display = 'none';
});

// Overlay auch schließen, wenn auf den dunklen Hintergrund geklickt wird (optional, aber nice UX)
document.getElementById('add-task-overlay').addEventListener('click', function (e) {
  if (e.target === this) {
    this.classList.add('d-none');
    document.getElementById('form-add-task').style.display = 'none';
  }
});
