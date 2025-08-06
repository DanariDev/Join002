// add-task-form.js
import { saveTaskToDB } from "./add-task-save.js";
import { getSelectedPriority } from "./add-task-priority.js";
import { getSelectedContactIds } from "./add-task-contacts.js";

/**
 * Initializes the add-task form.
 */
export function initAddTaskForm() {
  const createBtn = document.getElementById("create-task-btn");
  if (!createBtn) return;

  const newBtn = createBtn.cloneNode(true);
  createBtn.parentNode.replaceChild(newBtn, createBtn);

  newBtn.addEventListener("click", handleFormSubmit);
}

function handleFormSubmit(event) {
  event.preventDefault();
  clearAllFieldErrors();
  let valid = true;
  if (!validateTitle()) valid = false;
  if (!validateDueDate()) valid = false;
  if (!validateCategory()) valid = false;

  if (valid) saveTaskToDB(collectTaskData());
}

function showFieldError(field, message) {
  const errorDiv = document.getElementById(`error-${field}`);
  if (errorDiv) errorDiv.textContent = message;
}

function validateTitle() {
  const title = document.getElementById("title").value.trim();
  if (!title) {
    showFieldError("title", "Please enter a title!");
    return false;
  }
  return true;
}

function validateDueDate() {
  const dueDate = document.getElementById("due-date").value;
  if (!dueDate) {
    showFieldError("due-date", "Please select a due date!");
    return false;
  }
  return true;
}

function validateCategory() {
  const category = document.getElementById("category").value;
  if (!category) {
    showFieldError("category", "Please select a category!");
    return false;
  }
  clearFieldError("category");
  return true;
}

function clearFieldError(field) {
  const errorDiv = document.getElementById(`error-${field}`);
  if (errorDiv) errorDiv.textContent = "";
}

function clearAllFieldErrors() {
  clearFieldError("title");
  clearFieldError("due-date");
}

/* --- Subtask-Logik modular --- */
function handleSubtaskInputKey(event) {
  if (event.key === "Enter") {
    addSubtask();
    event.preventDefault();
  }
}

function handleSubtaskButtonClick() {
  addSubtask();
}

function handleSubtaskListClick(e) {
  if (e.target.tagName === "LI") {
    editSubtask(e.target);
  }
}

/* --- Event-Listener initialisieren --- */
document.getElementById("subtask").addEventListener("keydown", handleSubtaskInputKey);
document.querySelector(".subtask-button").addEventListener("click", handleSubtaskButtonClick);
document.getElementById("subtask-list").addEventListener("click", handleSubtaskListClick);

function addSubtask() {
  const input = document.getElementById("subtask");
  const value = input.value.trim();
  if (!value) return;
  const list = document.getElementById("subtask-list");
  const li = createSubtaskListItem(value);
  list.appendChild(li);
  input.value = "";
  addSubtaskIconsListeners(li);
}

function createSubtaskListItem(value) {
  const li = document.createElement("li");
  li.textContent = value;
  li.classList.add('subtask-list');
  li.innerHTML += getSubtaskIconsHTML();
  return li;
}

function getSubtaskIconsHTML() {
  return `<div class="subtask-icons-div">
    <img src="assets/img/edit.png" class="subtask-icon edit-subtask">
    <img src="assets/img/delete.png" class="subtask-icon delete-subtask">
  </div>`;
}

function addSubtaskIconsListeners(li) {
  li.querySelector(".edit-subtask").addEventListener("click", iconEdit);
  li.querySelector(".delete-subtask").addEventListener("click", iconDelete);
}

function iconEdit(e) {
  const li = e.target.closest("li");
  if (li) editSubtask(li);
}

function iconDelete(e) {
  const li = e.target.closest("li");
  if (li) deleteSubtask(li);
}

function editSubtask(li) {
  const oldValue = li.firstChild.textContent || li.textContent;
  const input = document.createElement("input");
  input.type = "text";
  input.value = oldValue;
  li.textContent = "";
  li.appendChild(input);
  input.focus();

  input.addEventListener("blur", () => finishEdit(li, input, oldValue));
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") finishEdit(li, input, oldValue);
  });
}

function finishEdit(li, input, oldValue) {
  const value = input.value.trim() || oldValue;
  li.textContent = value;
  li.classList.add('subtask-list');
  li.innerHTML += getSubtaskIconsHTML();
  addSubtaskIconsListeners(li);
}

function deleteSubtask(li) {
  li.remove();
}

function collectTaskData() {
  return {
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    dueDate: document.getElementById("due-date").value,
    priority: getSelectedPriority(),
    category: document.getElementById("category").value,
    subtasks: getSubtasks(),
    createdAt: Date.now(),
    assignedTo: getSelectedContactIds(),
  };
}

function getSubtasks() {
  const items = document.querySelectorAll("#subtask-list li");
  return Array.from(items).map(li => ({
    "task": li.textContent.trim(),
    "checked": "false"
  }));
}
