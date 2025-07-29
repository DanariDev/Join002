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

let subtasks = []; 

function renderSubtasks() {
  const list = document.getElementById('subtasks-list');
  list.innerHTML = '';
  subtasks.forEach((subtask, idx) => {
    const li = document.createElement('li');
    li.classList.add('subtask-item');
    li.innerHTML = `
      <span class="subtask-text">${subtask}</span>
      <img class="subtask-delete" src="assets/img/delete.png" alt="Delete" data-idx="${idx}" style="width:16px;cursor:pointer;">
    `;
    list.appendChild(li);
  });
}


function addSubtask() {
  const input = document.getElementById('subtask-input');
  const value = input.value.trim();
  if (!value) return;
  subtasks.push(value);
  input.value = '';
  renderSubtasks();
}


document.getElementById('subtask-input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    addSubtask();
    e.preventDefault();
  }
});
document.querySelector('.subtask-button').addEventListener('click', addSubtask);


document.getElementById('subtasks-list').addEventListener('click', function(e) {
  if (e.target.classList.contains('subtask-delete')) {
    const idx = e.target.getAttribute('data-idx');
    subtasks.splice(idx, 1);
    renderSubtasks();
  }
});


document.getElementById('closeFormModal').addEventListener('click', function () {
  subtasks = [];
  renderSubtasks();
});

