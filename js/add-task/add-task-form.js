// add-task-form.js
import { saveTaskToDB } from "./add-task-save.js";
import { getSelectedPriority } from "./add-task-priority.js";
import { getSelectedContactIds } from "./add-task-contacts.js";

/**
 * Initializes the add-task form: adds click listener to create button for validation and saving.
 */
export function initAddTaskForm() {
  const createBtn = document.getElementById("create-task-btn");
  if (!createBtn) return;

  const newBtn = createBtn.cloneNode(true);
  createBtn.parentNode.replaceChild(newBtn, createBtn);

  newBtn.addEventListener("click", function (event) {
    event.preventDefault();
    clearAllFieldErrors();
    let valid = true;
    if (!validateTitle()) valid = false;
    if (!validateDueDate()) valid = false;
    if (!validateCategory()) valid = false;

    if (valid) saveTaskToDB(collectTaskData());
  });
}

/**
 * Handles task creation: clears errors, validates title and due date, saves if valid.
 */
function handleCreateTask() {
  clearAllFieldErrors();
  if (!validateTitle() | !validateDueDate()) return;
  saveTaskToDB(collectTaskData());
}

/**
 * Displays error message for a specific field.
 */
function showFieldError(field, message) {
  const errorDiv = document.getElementById(`error-${field}`);
  if (errorDiv) {
    errorDiv.textContent = message;
    // errorDiv.style.color = "red";
  }
}

/**
 * Validates title field: checks if non-empty, shows error if not.
 */
function validateTitle() {
  const title = document.getElementById("title").value.trim();
  if (!title) {
    showFieldError("title", "Please enter a title!");
    return false;
  }
  return true;
}

/**
 * Validates due date field: checks if selected, shows error if not.
 */
function validateDueDate() {
  const dueDate = document.getElementById("due-date").value;
  if (!dueDate) {
    showFieldError("due-date", "Please select a due date!");
    return false;
  }
  return true;
}

/**
 * Validates category field: checks if selected, shows error if not, clears error otherwise.
 */
function validateCategory() {
  const category = document.getElementById("category").value;
  if (!category) {
    showFieldError("category", "Please select a category!");
    return false;
  }
  clearFieldError("category");
  return true;
}

/**
 * Clears error message for a specific field.
 */
function clearFieldError(field) {
  const errorDiv = document.getElementById(`error-${field}`);
  if (errorDiv) {
    errorDiv.textContent = "";
  }
}

/**
 * Clears all field errors (title, due-date).
 */
function clearAllFieldErrors() {
  clearFieldError("title");
  clearFieldError("due-date");
}

/**
 * Adds a new subtask to the list from input value if non-empty, clears input.
 */
function addSubtask() {
  const input = document.getElementById("subtask");
  const value = input.value.trim();
  if (!value) return;
  const list = document.getElementById("subtask-list");
  const li = document.createElement("li");
  li.textContent = value;
  li.classList.add('subtask-list');
  li.innerHTML += `<div class="subtask-icons-div"><img src="assets/img/edit.png" id="edit-subtask" class="subtask-icon"><img src="assets/img/delete.png" class="subtask-icon"></div>`;
  list.appendChild(li);
  input.value = "";
}

document.getElementById("subtask").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    addSubtask();
    e.preventDefault();
  }
});

document.querySelector(".subtask-button").addEventListener("click", addSubtask);
document.getElementById("subtask-list").addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    editSubtask(e.target);
  }
});

/**
 * Edits a subtask li element: replaces text with input, restores on blur or enter.
 */
function editSubtask(li) {
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
    li.innerHTML += `<div class="subtask-icons-div"><img src="assets/img/edit.png" class="subtask-icon"><img src="assets/img/delete.png" class="subtask-icon"></div>`;
  }
}

/**
 * Collects all task data from form fields into an object, including subtasks.
 */
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

/**
 * Retrieves array of subtask texts from list items.
 */
function getSubtasks() {
  const items = document.querySelectorAll("#subtask-list li");
  return Array.from(items).map(li => ({
    "task" : li.textContent.trim(),
    "checked": "false"
  }));
}