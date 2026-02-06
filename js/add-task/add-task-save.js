import { resetSelectedContacts } from "./add-task-contacts.js";
import { closeBoardOverlay } from "../board/board-add-task-overlay.js"
import { api } from "../api/client.js";
import { t } from "../i18n/i18n.js";

/**
 * Saves a task object to Firebase and resets form/UI after success.
 * @param {Object} task - The task object to save.
 * @returns {Promise<void>}
 */
export async function saveTaskToDB(task) {
  try {
    await pushTaskToDB(task);
    showSuccess(t("common.taskSaved"));
    clearForm();
    handleRedirects();
  } catch (err) {
    showError("Saving failed! " + (err?.message || ""));
  }
}

/**
 * Pushes the new task object into Firebase DB.
 * @param {Object} task - The task object to push.
 * @returns {Promise<void>}
 */
async function pushTaskToDB(task) {
  await api.createTask(task);
}

/**
 * Redirects or closes overlay based on current page.
 */
function handleRedirects() {
  getPathElements().forEach(element => {
    if (element == 'add-task.html') {
      setTimeout(() => {
        window.location.href = 'board.html';
      }, 1000);
    }
    if (element == 'board.html') {
      closeBoardOverlay();
    }
  });
}

/**
 * Splits pathname to check where we are.
 * @returns {Array<string>} Array of path elements.
 */
function getPathElements() {
  return window.location.pathname.split('/').filter(Boolean);
}

/**
 * Shows success message (green).
 * @param {string} msg - The message to display.
 */
function showSuccess(msg) {
  const box = document.getElementById("success-message");
  if (!box) return;
  box.textContent = msg;
  box.classList.remove("d-none");
  setTimeout(() => box.classList.add("d-none"), 2500);
}

/**
 * Shows error message (red).
 * @param {string} msg - The error message to display.
 */
function showError(msg) {
  const box = document.getElementById("error-message-popup");
  if (!box) return;
  box.textContent = msg;
  box.classList.remove("d-none");
  setTimeout(() => box.classList.add("d-none"), 3500);
}

/**
 * Resets the form and all fields, errors, subtasks and contacts.
 */
export function clearForm() {
  resetFormFields();
  resetDateInput();
  resetPriorityButtons();
  clearSubtasks();
  clearAllErrors();
  resetSelectedContacts();
}

/**
 * Resets form fields via form.reset().
 */
function resetFormFields() {
  const form = document.getElementById("add-task-form");
  if (form) form.reset();
}

/**
 * Sets date input to today.
 */
function resetDateInput() {
  const dateInput = document.getElementById("due-date");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = "";
    dateInput.min = today;
  }
}

/**
 * Resets all priority buttons, sets medium as default.
 */
function resetPriorityButtons() {
  document.querySelectorAll('.all-priority-btns')
    .forEach(btn => btn.classList.remove('low-btn-active', 'medium-btn-active', 'urgent-btn-active'));
  document.getElementById('medium-btn').classList.add('medium-btn-active');
}

/**
 * Clears the subtask list in the form.
 */
function clearSubtasks() {
  const subtaskList = document.getElementById("subtask-list");
  if (subtaskList) subtaskList.innerHTML = "";
}

/**
 * Clears all field error messages.
 */
function clearAllErrors() {
  setErrorText('error-title', "");
  setErrorText('error-due-date', "");
  setErrorText('error-category', "");
}

/**
 * Sets error message for a given field.
 * @param {string} id - The element ID.
 * @param {string} value - The error message.
 */
function setErrorText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value;
}

// Event: Clear-Button resets all form fields and UI
document.getElementById('clear-btn').addEventListener('click', clearForm);
