export function initOverlay() {
  // Overlay öffnen
  document.querySelectorAll('.add-task-btn, #add-task-button').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      document.getElementById('add-task-overlay').classList.remove('d-none');
      document.getElementById('form-add-task').style.display = 'flex';
      document.getElementById('add-task-form').reset();
      document.querySelectorAll('.prio-btn').forEach(b => b.classList.remove('selected'));
      document.querySelector('.prio-btn.medium').classList.add('selected');
    });
  });

  // Overlay schließen
  document.getElementById('closeFormModal').addEventListener('click', function () {
    document.getElementById('add-task-overlay').classList.add('d-none');
    document.getElementById('form-add-task').style.display = 'none';
  });

  // Overlay schließen beim Klick auf den Hintergrund
  document.getElementById('add-task-overlay').addEventListener('click', function (e) {
    if (e.target === this) {
      this.classList.add('d-none');
      document.getElementById('form-add-task').style.display = 'none';
    }
  });

  // Priority-Buttons umschalten
  document.querySelectorAll('.prio-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.prio-btn').forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
    });
  });
}
