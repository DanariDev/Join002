export { db } from "../firebase/firebase-init.js";
import { ref, update, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { showEditForm } from "./edit-task-form.js";
import { resetSelectedEditContacts, getSelectedEditContactIds } from "./edit-task-contacts.js";

/**
 * Opens the edit task overlay for a given task ID.
 * @param {string} taskId - The ID of the task to edit.
 */
export function openEditTaskOverlay(taskId) {
  window.currentEditTaskId = taskId;
  resetSelectedEditContacts();
  showEditForm(taskId);
  setEditTaskHandlers(taskId);
}

/**
 * Sets all event handlers for the edit overlay.
 * @param {string} taskId - The ID of the task to edit.
 */
function setEditTaskHandlers(taskId) {
  const overlay = document.getElementById("edit-task-overlay");
  const closeBtn = document.getElementById("overlay-edit-close");
  const cancelBtn = document.getElementById("editing-cancel-btn");
  const saveBtn = document.getElementById("editing-save-btn");

  setupOverlayCloseHandlers(overlay, closeBtn, cancelBtn);
  setupOverlayKeyboardHandler(overlay);
  setupEditTaskSaveHandler(saveBtn, taskId);
}


/**
 * Sets click handlers for closing the edit overlay.
 * @param {HTMLElement} overlay - The overlay element.
 * @param {HTMLElement} closeBtn - The close button element.
 * @param {HTMLElement} cancelBtn - The cancel button element.
 */
function setupOverlayCloseHandlers(overlay, closeBtn, cancelBtn) {
  closeBtn.onclick = closeEditOverlay;
  cancelBtn.onclick = closeEditOverlay;
  overlay.onclick = (e) => {
    if (e.target === overlay) closeEditOverlay();
  };
}


/**
 * Sets handler to close overlay when Escape is pressed.
 * @param {HTMLElement} overlay - The overlay element.
 */
function setupOverlayKeyboardHandler(overlay) {
  document.onkeydown = (e) => {
    if (e.key === "Escape" && !overlay.classList.contains("d-none")) {
      closeEditOverlay();
    }
  };
}


/**
 * Sets up the save event handler for the edit overlay.
 * @param {HTMLElement} saveBtn - The save button element.
 * @param {string} taskId - The task ID.
 */
function setupEditTaskSaveHandler(saveBtn, taskId) {
  document.addEventListener("saveTask", async (e) => {
    e.preventDefault();
  });

  saveBtn.onclick = (e) => {
    e.preventDefault();
    const saveEvent = new Event("saveTask");
    document.dispatchEvent(saveEvent);
  };
}


/**
 * Gets the current subtask list from the edit overlay.
 * @returns {Array<Object>} Array of subtask objects.
 */
function getEditSubtasks() {
  const items = document.querySelectorAll("#editing-subtask-list li");
  return Array.from(items).map((li) => ({
    task: li.textContent.trim(),
    completed: li.dataset.completed === "true",
  }));
}

/**
 * Closes the edit overlay and resets selected contacts.
 */
function closeEditOverlay() {
  resetSelectedEditContacts();
  const overlay = document.getElementById("edit-task-overlay");
  if (overlay) {
    overlay.classList.replace("d-flex", "d-none");
    document.getElementById("body").classList.remove('overflow-hidden');
  }
}

/**
 * Shows an error message under a field or in the overlay.
 * @param {string} field - The field ID or name.
 * @param {string} message - The error message.
 */
function showEditFieldError(field, message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  const fieldElement = document.getElementById(field);
  if (fieldElement) {
    fieldElement.parentElement.appendChild(errorDiv);
  } else {
    document.getElementById("edit-task-overlay")?.prepend(errorDiv);
  }
}

/**
 * Shows a success message at the bottom of the overlay.
 * @param {string} message - The success message.
 */
function showSuccessMessage(message) {
  const successDiv = document.createElement("div");
  successDiv.className = "success-message";
  successDiv.textContent = message;
  const overlay = document.getElementById("edit-task-overlay");
  if (overlay) {
    overlay.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 3000);
  }
}

/**
 * Removes all error and success messages in the overlay.
 */
function clearAllEditFieldErrors() {
  document.querySelectorAll(".error-message").forEach((el) => el.remove());
  document.querySelectorAll(".success-message").forEach((el) => el.remove());
}