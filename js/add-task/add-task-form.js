import { saveTaskToDB } from "./add-task-save.js";
import { getSelectedPriority } from "./add-task-priority.js";
import { getSelectedContactIds } from "./add-task-contacts.js";

/**
 * Initializes the add-task form: sets up create button event handler.
 */
export function initAddTaskForm() {
  const createBtn = document.getElementById("create-task-btn");
  if (!createBtn) return;

  const newBtn = createBtn.cloneNode(true);
  createBtn.parentNode.replaceChild(newBtn, createBtn);

  newBtn.addEventListener("click", handleFormSubmit);
}

/** Handles form submit: validates, then saves the task */
function handleFormSubmit(event) {
  event.preventDefault();
  clearAllFieldErrors();
  let valid = true;
  if (!validateTitle()) valid = false;
  if (!validateDueDate()) valid = false;
  if (!validateCategory()) valid = false;

  if (valid) saveTaskToDB(collectTaskData());
}

/** Shows an error message below a form field */
function showFieldError(field, message) {
  const errorDiv = document.getElementById(`error-${field}`);
  if (errorDiv) errorDiv.textContent = message;
}

/** Validates the title field */
function validateTitle() {
  const title = document.getElementById("title").value.trim();
  if (!title) {
    showFieldError("title", "Please enter a title!");
    return false;
  }
  return true;
}

/** Validates the due date field */
function validateDueDate() {
  const dueDate = document.getElementById("due-date").value;
  if (!dueDate) {
    showFieldError("due-date", "Please select a due date!");
    return false;
  }
  if(dueDate<getTodayDateString()){
    showFieldError("due-date", "Due date cannot be in the past!");
    return false;
  }
  return true;
}

/** Validates the category field */
function validateCategory() {
  const category = document.getElementById("category").value;
  if (!category) {
    showFieldError("category", "Please select a category!");
    return false;
  }
  clearFieldError("category");
  return true;
}

/** Clears the error message for a field */
function clearFieldError(field) {
  const errorDiv = document.getElementById(`error-${field}`);
  if (errorDiv) errorDiv.textContent = "";
}

/** Clears all form field error messages */
function clearAllFieldErrors() {
  clearFieldError("title");
  clearFieldError("due-date");
  clearFieldError("category");
}

/* --- Subtask logic --- */
/** Handles Enter key in subtask input */
function handleSubtaskInputKey(event) {
  if (event.key === "Enter") {
    addSubtask();
    event.preventDefault();
  }
}

/** Handles add subtask button click */
function handleSubtaskButtonClick() {
  addSubtask();
}

/** Handles clicking on subtask list for editing */
function handleSubtaskListClick(e) {
  if (e.target.tagName === "LI") {
    editSubtask(e.target);
  }
}

/* --- Event-Listener initialisieren --- */
document.getElementById("subtask").addEventListener("keydown", handleSubtaskInputKey);
document.querySelector(".subtask-button").addEventListener("click", handleSubtaskButtonClick);
document.getElementById("subtask-list").addEventListener("click", handleSubtaskListClick);

/** Adds a new subtask from input */
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

/** Creates a subtask list item element */
function createSubtaskListItem(value) {
  const li = document.createElement("li");
  li.textContent = value;
  li.classList.add('subtask-list');
  li.innerHTML += getSubtaskIconsHTML();
  return li;
}

/** Returns HTML for subtask edit/delete icons */
function getSubtaskIconsHTML() {
  return `<div class="subtask-icons-div">
    <img src="assets/img/edit.png" class="subtask-icon edit-subtask">
    <img src="assets/img/delete.png" class="subtask-icon delete-subtask">
  </div>`;
}

/** Adds listeners for edit/delete icons to a subtask */
function addSubtaskIconsListeners(li) {
  li.querySelector(".edit-subtask").addEventListener("click", iconEdit);
  li.querySelector(".delete-subtask").addEventListener("click", iconDelete);
}

/** Handler for edit icon click */
function iconEdit(e) {
  const li = e.target.closest("li");
  if (li) editSubtask(li);
}

/** Handler for delete icon click */
function iconDelete(e) {
  const li = e.target.closest("li");
  if (li) deleteSubtask(li);
}

/** Enables editing a subtask inline */
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

/** Finishes subtask edit and updates the DOM */
function finishEdit(li, input, oldValue) {
  const value = input.value.trim() || oldValue;
  li.textContent = value;
  li.classList.add('subtask-list');
  li.innerHTML += getSubtaskIconsHTML();
  addSubtaskIconsListeners(li);
}

/** Deletes a subtask from the list */
function deleteSubtask(li) {
  li.remove();
}

/** Collects all form values and returns a task object */
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

/** Gets all subtasks from the DOM as objects */
function getSubtasks() {
  const items = document.querySelectorAll("#subtask-list li");
  return Array.from(items).map(li => ({
    "task": li.textContent.trim(),
    "checked": "false"
  }));
}

/** Gets today's date as YYYY-MM-DD string */
function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}
