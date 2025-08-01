import { db } from '../firebase/firebase-init.js';
import { ref, update, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { showEditForm } from './edit-task-form.js';
import { resetSelectedEditContacts } from './edit-task-contacts.js';

export function openEditTaskOverlay(taskId) {
  resetSelectedEditContacts(); // Overlay immer sauber starten
  showEditForm(taskId);
  setEditTaskHandlers(taskId);
}

function loadTaskDataForEdit(taskId) {
  const taskRef = ref(db, 'tasks/' + taskId);
  get(taskRef).then((snapshot) => {
    if (!snapshot.exists()) return;
    const task = snapshot.val();
    fillEditForm(task);
  });
}

function fillEditForm(task) {
  document.getElementById('editing-title').value = task.title || '';
  document.getElementById('editing-description').value = task.description || '';
  document.getElementById('editing-date').value = task.dueDate || '';
  setEditPrio(task.priority);
  // Hier ggf. assigned, category & subtasks nach deinem Bedarf ergänzen!
  document.getElementById('editing-category').value = task.category || '';
  setEditSubtasks(task.subtasks);
}

function setEditPrio(priority) {
  document.querySelectorAll('#editing-priority-buttons .all-priority-btns')
    .forEach(btn =>  btn.classList.remove('urgent-btn-active', 'medium-btn-active', 'low-btn-active'));
  if (priority === "urgent")
    document.getElementById('editing-urgent-btn').classList.add('urgent-btn-active');
  else if (priority === "medium")
    document.getElementById('editing-medium-btn').classList.add('medium-btn-active');
  else if (priority === "low")
    document.getElementById('editing-low-btn').classList.add('low-btn-active');
}

function setEditSubtasks(subtasks){
  if(subtasks == undefined) return;
  document.getElementById('editing-subtask-list').innerHTML ="";
  subtasks.forEach(subtask => {
    subtask.trim();
    document.getElementById('editing-subtask-list').innerHTML += `<li class="subtask-item"><span class="subtask-text">${subtask}</span>
      <img class="subtask-delete" src="assets/img/delete.png" alt="Delete" data-idx="0"></li>`
  })
}

function setEditTaskHandlers(taskId) {
  console.log('setEditTaskHandlers:', document.getElementById('overlay-edit-close'));
  document.getElementById('overlay-edit-close').onclick = closeEditOverlay;
  document.getElementById('editing-cancel-btn').onclick = closeEditOverlay;
  closeEditOverlayBackground();
  closeEditOverlayESC()
  document.getElementById('editing-save-btn').onclick = function (e) {
    e.preventDefault();
    saveEditTask(taskId);
  };
  // Prio-Buttons aktivieren:
  document.querySelectorAll('#editing-priority-buttons .all-priority-btns')
    .forEach(btn => btn.onclick = function () {
      document.querySelectorAll('#editing-priority-buttons .all-priority-btns')
        .forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
}

function saveEditTask(taskId) {
  const updates = {
    title: document.getElementById('editing-title').value,
    description: document.getElementById('editing-description').value,
    dueDate: document.getElementById('editing-date').value,
    priority: getSelectedEditPrio(),
    category: document.getElementById('editing-category').value,
    // Ergänze hier assigned/subtasks, falls gewünscht
  };
  update(ref(db, 'tasks/' + taskId), updates).then(closeEditOverlay);
}

function getSelectedEditPrio() {
  if (document.getElementById('editing-urgent-btn').classList.contains('active')) return "urgent";
  if (document.getElementById('editing-medium-btn').classList.contains('active')) return "medium";
  if (document.getElementById('editing-low-btn').classList.contains('active')) return "low";
  return "";
}

export function closeEditOverlay(event) {
  event.stopPropagation();
  resetSelectedEditContacts();
  document.getElementById('edit-task-overlay').classList.replace('d-flex','d-none');
}

function closeEditOverlayBackground(){
  const taskOverlay = document.getElementById('edit-task-overlay');
  if (taskOverlay) {
    taskOverlay.addEventListener('click', function(e) {
      if (e.target === this) {
        taskOverlay.classList.replace('d-flex','d-none');
      }
    });
  }
}

function closeEditOverlayESC(){
  document.addEventListener('keydown', function(e) {
    const overlay = document.getElementById('edit-task-overlay');
    if (e.key === 'Escape' && overlay && !overlay.classList.contains('d-none')) {
      overlay.classList.replace('d-flex','d-none');
    }
  });
}
