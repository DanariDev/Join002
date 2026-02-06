import { db } from "../firebase/firebase-init.js";
import {
  ref,
  update,
  get,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import {
  setSelectedEditContacts,
  getSelectedEditContactIds,
} from "./edit-task-contacts.js";
import {
  getSelectedEditPriority,
  initEditPriorityButtons,
} from "./edit-task-priority.js";

/**
 * Initializes the save button handler for the edit task form.
 */
export function initEditTaskForm() {
  const btn = document.getElementById("editing-save-btn");
  if (btn) btn.addEventListener("click", onSaveEditClick);
}
/**
 * Removes all error and success messages in the overlay.
 */
function clearAllEditFieldErrors() {
  document.querySelectorAll(".error-message").forEach((el) => el.remove());
  document.querySelectorAll(".success-message").forEach((el) => el.remove());
}

/**
 * Handles click on save button: validates fields and saves task.
 * @param {Event} event - The click event.
 */
function onSaveEditClick(event) {
  event.preventDefault();
  clearAllEditFieldErrors();
  let valid = true;
  if (!validateEditTitle()) valid = false;
  if (!validateEditDueDate()) valid = false;
  if (!validateEditCategory()) valid = false;
  if (valid) saveEditedTask();
}

/**
 * Fills the edit form with task data.
 * @param {Object} task - The task object to fill the form.
 */
export function fillEditFormWithTask(task) {
  setSelectedEditContacts(task.assignedTo || []);
  setInputValue("editing-title", task.title || "");
  setInputValue("editing-description", task.description || "");
  setInputValue("editing-date", task.dueDate || "");
  setEditDateMinToday();
  setInputValue("editing-category", task.category || "");
  setEditPriority(task.priority);
  fillEditSubtasks(task.subtasks || []);
  enableSaveBtn();
  initEditPriorityButtons();
}

/**
 * Sets value for an input field by ID.
 * @param {string} id - The ID of the input field.
 * @param {string} value - The value to set.
 */
function setInputValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}

/**
 * Sets the minimum date for the due date input to today.
 */
function setEditDateMinToday() {
  const input = document.getElementById("editing-date");
  if (!input) return;
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  input.min = `${yyyy}-${mm}-${dd}`;
}

/**
 * Activates the correct priority button.
 * @param {string} priority - The priority to set (urgent, medium, low).
 */
function setEditPriority(priority) {
  document
    .querySelectorAll("#editing-priority-buttons .all-priority-btns")
    .forEach((btn) => btn.classList.remove("active"));
  if (priority === "urgent") activateBtn("editing-urgent-btn");
  else if (priority === "medium") activateBtn("editing-medium-btn");
  else if (priority === "low") activateBtn("editing-low-btn");
}

/**
 * Adds the "active" class to a button by ID.
 * @param {string} id - The ID of the button.
 */
function activateBtn(id) {
  const btn = document.getElementById(id);
  if (btn) btn.classList.add("active");
}

/**
 * Enables the save button.
 */
function enableSaveBtn() {
  const btn = document.getElementById("editing-save-btn");
  if (btn) {
    btn.disabled = false;
    btn.classList.remove("disabled");
  }
}

/**
 * Loads the edit form with a task by ID and opens overlay.
 * @param {string} taskId - The ID of the task to load.
 */
export function showEditForm(taskId) {
  const taskRef = ref(db, "tasks/" + taskId);
  get(taskRef).then((snapshot) => {
    if (!snapshot.exists()) return;
    fillEditFormWithTask(snapshot.val());
    openEditOverlay();
  });
}

/**
 * Opens the edit task overlay and disables body scroll.
 */
function openEditOverlay() {
  document
    .getElementById("edit-task-overlay")
    .classList.replace("d-none", "d-flex");
  document.getElementById("body").classList.add("overflow-hidden");
}

/**
 * Validates the title field.
 * @returns {boolean} True if valid, false otherwise.
 */
function validateEditTitle() {
  const v = getValue("editing-title");
  if (!v)
    return showEditFieldError("error-edit-title", "Please enter a title!");
  return true;
}

/**
 * Validates the due date field.
 * @returns {boolean} True if valid, false otherwise.
 */
function validateEditDueDate() {
  const dueDate = getValue("editing-date");
  if (!dueDate)
    return showEditFieldError(
      "error-edit-due-date",
      "Please select a due date!"
    );
  const selected = new Date(dueDate + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  if (selected < now)
    return showEditFieldError(
      "error-edit-due-date",
      "Due date cannot be in the past!"
    );
  return true;
}

/**
 * Validates the category field.
 * @returns {boolean} True if valid, false otherwise.
 */
function validateEditCategory() {
  const v = getValue("editing-category");
  if (!v)
    return showEditFieldError(
      "error-edit-category",
      "Please select a category!"
    );
  return true;
}

/**
 * Saves the edited task to the database.
 */
function saveEditedTask() {
  const taskId = window.currentEditTaskId;
  if (!taskId) return console.error("Keine TaskID!");
  const updates = collectUpdates();
  update(ref(db, "tasks/" + taskId), updates)
    .then(closeEditOverlay)
    .catch((error) => console.error("Fehler beim Speichern:", error));
}

/**
 * Collects all form fields and builds the update object.
 * @returns {Object} The task update object.
 */
function collectUpdates() {
  return {
    title: getValue("editing-title"),
    description: getValue("editing-description"),
    dueDate: getValue("editing-date"),
    priority: getSelectedEditPriority(),
    category: getValue("editing-category"),
    subtasks: getEditSubtasks(),
    assignedTo: getSelectedEditContactIds(),
  };
}

/**
 * Gets the value of a form field by ID.
 * @param {string} id - The ID of the field.
 * @returns {string} The trimmed field value.
 */
function getValue(id) {
  return document.getElementById(id).value.trim();
}

/**
 * Closes the edit overlay and re-enables body scroll.
 */
function closeEditOverlay() {
  document
    .getElementById("edit-task-overlay")
    .classList.replace("d-flex", "d-none");
  document.getElementById("body").classList.remove("overflow-hidden");
}

/**
 * Fills the subtasks list in the form.
 * @param {Array<Object>} subtasks - Array of subtask objects.
 */
function fillEditSubtasks(subtasks) {
  const list = document.getElementById("editing-subtask-list");
  if (!list) return;
  list.innerHTML = "";
  subtasks.forEach((st) => addSubtaskListItem(st.task));
}

/**
 * Gets all subtasks from the list.
 * @returns {Array<Object>} Array of subtask objects.
 */
function getEditSubtasks() {
  const items = document.querySelectorAll("#editing-subtask-list li");
  return Array.from(items).map((li) => ({
    task: li.textContent.trim(),
    checked: "false",
  }));
}

/**
 * Adds a subtask list item to the DOM.
 * @param {string} text - The subtask text.
 */
function addSubtaskListItem(text) {
  const list = document.getElementById("editing-subtask-list");
  const li = document.createElement("li");
  li.textContent = text;
  li.classList.add("subtask-list");
  li.innerHTML += subtaskIconsHtml();
  list.appendChild(li);
  attachSubtaskEvents();
}

/**
 * Returns the icons HTML for subtask actions.
 * @returns {string} The icons HTML string.
 */
function subtaskIconsHtml() {
  return `<div class="subtask-icons-div">
    <img src="assets/img/edit.png" class="subtask-icon edit-subtask-btn">
    <img src="assets/img/delete.png" class="subtask-icon delete-subtask-btn"></div>`;
}

/**
 * Adds all subtask events (edit/delete).
 */
function attachSubtaskEvents() {
  document
    .querySelectorAll(".edit-subtask-btn")
    .forEach(
      (el) => (el.onclick = (e) => editEditSubtask(e.target.closest("li")))
    );
  document
    .querySelectorAll(".delete-subtask-btn")
    .forEach(
      (el) => (el.onclick = (e) => deleteSubtask(e.target.closest("li")))
    );
}

/**
 * Adds a new subtask from input.
 */
function addEditSubtask() {
  const input = document.getElementById("editing-subtask");
  if (!input) return;
  const value = input.value.trim();
  if (!value) return;
  addSubtaskListItem(value);
  input.value = "";
}

/**
 * Edits a subtask list item.
 * @param {HTMLLIElement} li - The subtask list item.
 */
function editEditSubtask(li) {
  if (!li) return;
  const oldValue = li.firstChild.textContent || "";
  const input = document.createElement("input");
  input.type = "text";
  input.value = oldValue;
  li.innerHTML = "";
  li.appendChild(input);
  input.focus();
  input.onblur = () => finishEditSubtask(li, input, oldValue);
  input.onkeydown = (e) => {
    if (e.key === "Enter") finishEditSubtask(li, input, oldValue);
  };
}

/**
 * Finalizes subtask edit and updates the DOM.
 * @param {HTMLLIElement} li - The subtask list item.
 * @param {HTMLInputElement} input - The input element.
 * @param {string} oldValue - The previous subtask value.
 */
function finishEditSubtask(li, input, oldValue) {
  const text = input.value.trim() || oldValue;
  li.textContent = text;
  li.classList.add("subtask-list");
  li.innerHTML += subtaskIconsHtml();
  attachSubtaskEvents();
}

/**
 * Deletes a subtask from the list.
 * @param {HTMLLIElement} li - The subtask list item.
 */
function deleteSubtask(li) {
  if (li) li.remove();
}

/**
 * Sets up subtask input and button handlers.
 */
function initEditSubtaskEvents() {
  const input = document.getElementById("editing-subtask");
  if (input)
    input.onkeydown = (e) => {
      if (e.key === "Enter") {
        addEditSubtask();
        e.preventDefault();
      }
    };
  const btn = document.querySelector("#edit-task-overlay .subtask-button");
  if (btn) btn.onclick = addEditSubtask;
  const list = document.getElementById("editing-subtask-list");
  if (list)
    list.onclick = (e) => {
      if (e.target.tagName === "LI") editEditSubtask(e.target);
    };
}

initEditSubtaskEvents();