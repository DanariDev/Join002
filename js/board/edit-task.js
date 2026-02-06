import { showEditForm } from "./edit-task-form.js";
import { resetSelectedEditContacts } from "./edit-task-contacts.js";

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
