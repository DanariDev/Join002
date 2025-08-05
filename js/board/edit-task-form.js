// edit-task-form.js
import { db } from "../firebase/firebase-init.js";
import {
  ref,
  update,
  get,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { setSelectedEditContacts } from "./edit-task-contacts.js";
import { getSelectedEditContactIds } from "./edit-task-contacts.js";
import { getSelectedEditPriority, initEditPriorityButtons } from "./edit-task-priority.js";

/**
 * Initialisiert das Edit-Formular für Tasks.
 * Ruft beim Klick auf Save die Validierung & Speicherung auf.
 */
export function initEditTaskForm() {
  const saveBtn = document.getElementById("editing-save-btn");
  if (!saveBtn) return;

  saveBtn.addEventListener("click", async (event) => {
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
  document.getElementById("editing-title").value = task.title || "";
  document.getElementById("editing-description").value = task.description || "";
  document.getElementById("editing-date").value = task.dueDate || "";
  setEditDateMinToday();

  document.getElementById("editing-category").value = task.category || "";
  setEditPriority(task.priority);
  fillEditSubtasks(task.subtasks || []);
  // Assigned und Kontakte ggf. ergänzen!
  const saveBtn = document.getElementById("editing-save-btn");
  if (saveBtn) {
    saveBtn.disabled = false;
    saveBtn.classList.remove("disabled");
  }
  // Priority-Button-Handler neu initialisieren!
  initEditPriorityButtons();
  function setEditDateMinToday() {
  const input = document.getElementById("editing-date");
  if (input) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    input.min = `${yyyy}-${mm}-${dd}`;
  }
}

}

function setEditPriority(priority) {
  document
    .querySelectorAll("#editing-priority-buttons .all-priority-btns")
    .forEach((btn) => btn.classList.remove("active"));
  if (priority === "urgent")
    document.getElementById("editing-urgent-btn").classList.add("active");
  else if (priority === "medium")
    document.getElementById("editing-medium-btn").classList.add("active");
  else if (priority === "low")
    document.getElementById("editing-low-btn").classList.add("active");
}

/**
 * Füllt die Subtasks in die Liste.
 */
function fillEditSubtasks(subtasks) {
  const list = document.getElementById("editing-subtask-list");
  list.innerHTML = "";
  subtasks.forEach((st) => {
    const li = document.createElement("li");
    li.textContent = st.task;
    li.classList.add('subtask-list');
    li.innerHTML += `<div class="subtask-icons-div"><img src="assets/img/edit.png" id="edit-subtask" class="subtask-icon"><img src="assets/img/delete.png" id="delete-subtask" class="subtask-icon"></div>`;
    list.appendChild(li);
    document.querySelectorAll("#edit-subtask").forEach(element=> element.addEventListener("click", iconEdit));
    document.querySelectorAll("#delete-subtask").forEach(element=> element.addEventListener("click", iconDelete));
  });
}

/**
 * Holt die Task-Daten, trägt sie ins Formular ein und zeigt das Edit-Overlay.
 */
export function showEditForm(taskId) {
  const taskRef = ref(db, "tasks/" + taskId);
  get(taskRef).then((snapshot) => {
    if (!snapshot.exists()) return;
    fillEditFormWithTask(snapshot.val());
    document
      .getElementById("edit-task-overlay")
      .classList.replace("d-none", "d-flex");
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

function clearEditFieldError(field) {
  /* ...optional... */
}
function clearAllEditFieldErrors() {
  /* ...optional... */
}

/**
 * Speichert die Änderungen in die DB.
 */
function saveEditedTask() {
  const taskId = window.currentEditTaskId;
  console.log("Speicherfunktion ausgeführt!");
  if (!taskId) {
    console.error("Keine TaskID!");
    return;
  }
  const updates = {
    title: document.getElementById("editing-title").value.trim(),
    description: document.getElementById("editing-description").value.trim(),
    dueDate: document.getElementById("editing-date").value,
    priority: getSelectedEditPriority(),
    category: document.getElementById("editing-category").value,
    subtasks: getEditSubtasks(),
    assignedTo: getSelectedEditContactIds(),
  };
  console.log("TaskID:", taskId);
  console.log("Updates:", updates);
  update(ref(db, "tasks/" + taskId), updates)
    .then(() => {
      // Das Overlay-Fenster schließen (sichtbar ausblenden)
      document.getElementById("edit-task-overlay").classList.replace("d-flex", "d-none");
    })
    .catch((error) => {
      console.error("Fehler beim Speichern:", error);
    });
}

function getEditSubtasks() {
  const items = document.querySelectorAll("#editing-subtask-list li");
  return Array.from(items).map((li) => ({
    task: li.textContent.trim(),
    checked: "false",
  }));
}

// Subtasks hinzufügen/bearbeiten wie bei Add Task
document
  .getElementById("editing-subtask")
  .addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      addEditSubtask();
      e.preventDefault();
    }
  });
document
  .querySelector("#edit-task-overlay .subtask-button")
  .addEventListener("click", addEditSubtask);
document
  .getElementById("editing-subtask-list")
  .addEventListener("click", function (e) {
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
  li.classList.add('subtask-list');
  li.innerHTML += `<div class="subtask-icons-div"><img src="assets/img/edit.png" id="edit-subtask" class="subtask-icon"><img src="assets/img/delete.png" id="delete-subtask" class="subtask-icon"></div>`;
  list.appendChild(li);
  input.value = "";
  document.querySelectorAll("#edit-subtask").forEach(element=> element.addEventListener("click", iconEdit));
  document.querySelectorAll("#delete-subtask").forEach(element=> element.addEventListener("click", iconDelete));
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
    li.classList.add('subtask-list');
    li.innerHTML += `<div class="subtask-icons-div"><img src="assets/img/edit.png" id="edit-subtask" class="subtask-icon"><img src="assets/img/delete.png" id="delete-subtask" class="subtask-icon"></div>`;
    document.querySelectorAll("#edit-subtask").forEach(element=> element.addEventListener("click", iconEdit));
    document.querySelectorAll("#delete-subtask").forEach(element=> element.addEventListener("click", iconDelete));
  }
}

function deleteSubtask(li){
  li.remove();
}

function iconEdit(e) {
  if (e.target.parentNode.parentNode.tagName === "LI") {
    editEditSubtask(e.target.parentNode.parentNode);
  }
}

function iconDelete(e){
  if (e.target.parentNode.parentNode.tagName === "LI") {
    deleteSubtask(e.target.parentNode.parentNode);
  }
}
