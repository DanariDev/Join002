// edit-task.js
export { db } from "../firebase/firebase-init.js";
import { ref, update, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { showEditForm } from "./edit-task-form.js";
import { resetSelectedEditContacts, getSelectedEditContactIds } from "./edit-task-contacts.js";

/** Opens the edit task overlay for a given task ID */
export function openEditTaskOverlay(taskId) {
  window.currentEditTaskId = taskId;
  resetSelectedEditContacts();
  showEditForm(taskId);
  setEditTaskHandlers(taskId);
}

/** Sets all event handlers for the edit overlay */
function setEditTaskHandlers(taskId) {
  const overlay = document.getElementById("edit-task-overlay");
  const closeBtn = document.getElementById("overlay-edit-close");
  const cancelBtn = document.getElementById("editing-cancel-btn");
  const saveBtn = document.getElementById("editing-save-btn");

  // Close handlers
  closeBtn.onclick = closeEditOverlay;
  cancelBtn.onclick = closeEditOverlay;
  overlay.onclick = (e) => { if (e.target === overlay) closeEditOverlay(); };
  document.onkeydown = (e) => { if (e.key === "Escape" && !overlay.classList.contains("d-none")) closeEditOverlay(); };

  // Save handler via custom event
  document.addEventListener("saveTask", async (e) => {
    e.preventDefault();
    console.log("Save event triggered for taskId:", taskId);
    // if (await validateEditForm()) {
    //   await saveEditTask(taskId);
    // }
  });

  // Ensure save button triggers the event
  saveBtn.onclick = (e) => {
    e.preventDefault();
    console.log("Save button clicked for taskId:", taskId);
    const saveEvent = new Event("saveTask");
    document.dispatchEvent(saveEvent);
  };
}

/** Gets the current subtask list from the edit overlay */
function getEditSubtasks() {
  const items = document.querySelectorAll("#editing-subtask-list li");
  return Array.from(items).map((li) => ({
    task: li.textContent.trim(),
    completed: li.dataset.completed === "true",
  }));
}

/** Closes the edit overlay and resets selected contacts */
function closeEditOverlay() {
  resetSelectedEditContacts();
  const overlay = document.getElementById("edit-task-overlay");
  if (overlay){
    overlay.classList.replace("d-flex", "d-none");
    document.getElementById("body").classList.remove('overflow-hidden');
  }
}

/** Shows an error message under a field or in the overlay */
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

/** Shows a success message at the bottom of the overlay */
function showSuccessMessage(message) {
  const successDiv = document.createElement("div");
  successDiv.className = "success-message";
  successDiv.textContent = message;
  const overlay = document.getElementById("edit-task-overlay");
  if (overlay) {
    overlay.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 3000); // Remove after 3 seconds
  }
}

/** Removes all error and success messages in the overlay */
function clearAllEditFieldErrors() {
  document.querySelectorAll(".error-message").forEach((el) => el.remove());
  document.querySelectorAll(".success-message").forEach((el) => el.remove());
}
