import { db } from '../firebase/firebase-init.js';
import { ref, push } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

export function initOverlay() {
  
  document.querySelectorAll('.add-task-btn, #add-task-button').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      document.getElementById('add-task-overlay').classList.remove('d-none');
      document.getElementById('form-add-task').style.display = 'flex';

      
      ['urgent-btn', 'medium-btn', 'low-btn'].forEach(id => 
        document.getElementById(id).classList.remove('selected', 'urgent-btn-active', 'medium-btn-active', 'low-btn-active')
      );
      
      document.getElementById('medium-btn').classList.add('selected', 'medium-btn-active');
    });
  });

  
  document.getElementById('closeFormModal').addEventListener('click', function () {
    document.getElementById('add-task-overlay').classList.add('d-none');
    document.getElementById('form-add-task').style.display = 'none';
  });

  
  document.getElementById('add-task-overlay').addEventListener('click', function (e) {
    if (e.target === this) {
      this.classList.add('d-none');
      document.getElementById('form-add-task').style.display = 'none';
    }
  });

  
  ['urgent-btn', 'medium-btn', 'low-btn'].forEach(btnId => {
    document.getElementById(btnId).addEventListener('click', function () {
      ['urgent-btn', 'medium-btn', 'low-btn'].forEach(id => 
        document.getElementById(id).classList.remove('selected', 'urgent-btn-active', 'medium-btn-active', 'low-btn-active')
      );
      if (btnId === 'urgent-btn') this.classList.add('selected', 'urgent-btn-active');
      if (btnId === 'medium-btn') this.classList.add('selected', 'medium-btn-active');
      if (btnId === 'low-btn') this.classList.add('selected', 'low-btn-active');
    });
  });
}

let subtasks = [];

function renderSubtasks() {
  const list = document.getElementById('subtasks-list');
  list.innerHTML = '';
  subtasks.forEach((subtask, idx) => {
    const txt = subtask.text || subtask; 
    const li = document.createElement('li');
    li.classList.add('subtask-item');
    li.innerHTML = `
      <span class="subtask-text">${txt}</span>
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

document.getElementById('create-btn').addEventListener('click', function(e) {
  e.preventDefault();

  const title = document.getElementById('task-title').value.trim();
  const description = document.getElementById('task-description').value.trim();
  const dueDate = document.getElementById('task-date').value;
  const category = document.getElementById('task-category').value;

  let priority = 'medium';
  if (document.getElementById('urgent-btn').classList.contains('selected')) priority = 'urgent';
  if (document.getElementById('low-btn').classList.contains('selected')) priority = 'low';

  const task = {
    title,
    description,
    dueDate,
    category,
    priority,
    subtasks: subtasks,
    status: 'to-do', 
    
  };

  
  const tasksRef = ref(db, 'tasks/');
  push(tasksRef, task)
    .then(() => {
      subtasks = [];
      renderSubtasks();
      document.getElementById('add-task-overlay').classList.add('d-none');
    })
    .catch(error => {
      alert('Fehler beim Speichern: ' + error.message);
    });
});
