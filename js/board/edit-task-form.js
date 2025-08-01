// edit-task-form.js
import { db } from '../firebase/firebase-init.js';
import { ref, update, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { setSelectedEditContacts } from "./edit-task-contacts.js";
import { getSelectedEditContactIds } from "./edit-task-contacts.js";



/**
 * Initialisiert das Edit-Formular für Tasks.
 * Ruft beim Klick auf Save die Validierung & Speicherung auf.
 */
export function initEditTaskForm() {
  const saveBtn = document.getElementById("editing-save-btn");
  if (!saveBtn) return;
  saveBtn.addEventListener("click", function (event) {
    event.preventDefault();
    clearAllEditFieldErrors();
    let valid = true;
    if (!validateEditTitle()) valid = false;
    if (!validateEditDueDate()) valid = false;
    if (!validateEditCategory()) valid = false;
    if (valid) saveEditedTask();
  });
}

/**
 * Füllt das Edit-Formular mit den Daten einer bestehenden Task.
 */
export function fillEditFormWithTask(task) {
  setSelectedEditContacts(task.assignedTo || []);
  document.getElementById('editing-title').value = task.title || '';
  document.getElementById('editing-description').value = task.description || '';
  document.getElementById('editing-date').value = task.dueDate || '';
  document.getElementById('editing-category').value = task.category || '';
  document.getElementById('editing-title').value = task.title || '';
  setEditPriority(task.priority);
  fillEditSubtasks(task.subtasks || []);
  // Assigned und Kontakte ggf. ergänzen!
}

function setEditPriority(priority) {
  document.querySelectorAll('#editing-priority-buttons .all-priority-btns')
    .forEach(btn => btn.classList.remove('active'));
  if (priority === "urgent")
    document.getElementById('editing-urgent-btn').classList.add('active');
  else if (priority === "medium")
    document.getElementById('editing-medium-btn').classList.add('active');
  else if (priority === "low")
    document.getElementById('editing-low-btn').classList.add('active');
}

/**
 * Füllt die Subtasks in die Liste.
 */
function fillEditSubtasks(subtasks) {
  const list = document.getElementById("editing-subtask-list");
  list.innerHTML = "";
  subtasks.forEach(st => {
    const li = document.createElement("li");
    li.textContent = st.task;
    list.appendChild(li);
  });
}

/**
 * Holt die Task-Daten, trägt sie ins Formular ein und zeigt das Edit-Overlay.
 */
export function showEditForm(taskId) {
  const taskRef = ref(db, 'tasks/' + taskId);
  get(taskRef).then(snapshot => {
    if (!snapshot.exists()) return;
    fillEditFormWithTask(snapshot.val());
    document.getElementById('edit-task-overlay').classList.replace('d-none', 'd-flex');
  });
}

/**
 * Validierungsfunktionen für Edit.
 */
function validateEditTitle() {
  const title = document.getElementById("editing-title").value.trim();
  if (!title) {
    showEditFieldError("editing-title", "Please enter a title!");
    return false;
  }
  return true;
}
function validateEditDueDate() {
  const dueDate = document.getElementById("editing-date").value;
  if (!dueDate) {
    showEditFieldError("editing-date", "Please select a due date!");
    return false;
  }
  return true;
}
function validateEditCategory() {
  const category = document.getElementById("editing-category").value;
  if (!category) {
    showEditFieldError("editing-category", "Please select a category!");
    return false;
  }
  clearEditFieldError("editing-category");
  return true;
}

function showEditFieldError(field, message) {
  // Optional: Einblenden an passender Stelle
  alert(message); // Oder ein eigenes Error-Feld!
}

function clearEditFieldError(field) { /* ...optional... */ }
function clearAllEditFieldErrors() { /* ...optional... */ }

/**
 * Speichert die Änderungen in die DB.
 */
function saveEditedTask() {
  const taskId = window.currentEditTaskId; 
  if (!taskId) return;
  const updates = {
    title: document.getElementById('editing-title').value.trim(),
    description: document.getElementById('editing-description').value.trim(),
    dueDate: document.getElementById('editing-date').value,
    priority: getSelectedEditPriority(),
    category: document.getElementById('editing-category').value,
    subtasks: getEditSubtasks(taskId),
    assignedTo: getSelectedEditContactIds(),
    // assigned usw. ergänzen!
  };
  update(ref(db, 'tasks/' + taskId), updates)
    .then(() => document.getElementById('edit-task-overlay').classList.add('d-none'));
}

function getSelectedEditPriority() {
  if (document.getElementById('editing-urgent-btn').classList.contains('active')) return "urgent";
  if (document.getElementById('editing-medium-btn').classList.contains('active')) return "medium";
  if (document.getElementById('editing-low-btn').classList.contains('active')) return "low";
  return "";
}

function getEditSubtasks() {
  const items = document.querySelectorAll("#editing-subtask-list li");
  return Array.from(items).map(li => ({
    "task" : li.textContent.trim(),
    "checked": "false"
  }));
}

// Subtasks hinzufügen/bearbeiten wie bei Add Task
document.getElementById("editing-subtask").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    addEditSubtask();
    e.preventDefault();
  }
});
document.querySelector("#edit-task-overlay .subtask-button").addEventListener("click", addEditSubtask);
document.getElementById("editing-subtask-list").addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    editEditSubtask(e.target);
  }
});

function addEditSubtask() {
  const input = document.getElementById("editing-subtask");
  const value = input.value.trim();
  if (!value) return;
  const list = document.getElementById("editing-subtask-list");
  const li = document.createElement("li");
  li.textContent = value;
  list.appendChild(li);
  input.value = "";
}

function editEditSubtask(li) {
  const oldValue = li.textContent;
  const input = document.createElement("input");
  input.type = "text";
  input.value = oldValue;
  li.textContent = "";
  li.appendChild(input);
  input.focus();

  input.addEventListener("blur", finishEdit);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") finishEdit();
  });

  function finishEdit() {
    li.textContent = input.value.trim() || oldValue;
  }
}