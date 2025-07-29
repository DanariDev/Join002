import { db } from '../firebase/firebase-init.js';
import { ref, update, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

export function openEditTaskOverlay(taskId) {
  document.getElementById('edit-task-overlay').classList.remove('d-none');
  loadTaskDataForEdit(taskId);
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
}

function setEditPrio(priority) {
  document.querySelectorAll('#editing-priority-buttons .all-priority-btns')
    .forEach(btn => btn.classList.remove('active'));
  if (priority === "urgent")
    document.getElementById('editing-urgent-btn').classList.add('active');
  else if (priority === "medium")
    document.getElementById('editing-medium-btn').classList.add('active');
  else if (priority === "low")
    document.getElementById('editing-low-btn').classList.add('active');
}

function setEditTaskHandlers(taskId) {
  document.getElementById('overlay-edit-close').onclick = closeEditOverlay;
  document.getElementById('editing-cancel-btn').onclick = closeEditOverlay;
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

function closeEditOverlay() {
  document.getElementById('edit-task-overlay').classList.add('d-none');
}
