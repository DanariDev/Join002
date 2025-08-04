// edit-task.js
export { db } from "../firebase/firebase-init.js";
import { ref, update, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { showEditForm } from "./edit-task-form.js";
import { resetSelectedEditContacts, getSelectedEditContactIds } from "./edit-task-contacts.js";

export function openEditTaskOverlay(taskId) {
  window.currentEditTaskId = taskId;
  resetSelectedEditContacts();
  showEditForm(taskId);
  setEditTaskHandlers(taskId);
}

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
    if (await validateEditForm()) {
      await saveEditTask(taskId);
    }
  });

  // Ensure save button triggers the event
  saveBtn.onclick = (e) => {
    e.preventDefault();
    console.log("Save button clicked for taskId:", taskId);
    const saveEvent = new Event("saveTask");
    document.dispatchEvent(saveEvent);
  };
}

function getEditSubtasks() {
  const items = document.querySelectorAll("#editing-subtask-list li");
  return Array.from(items).map((li) => ({
    task: li.textContent.trim(),
    completed: li.dataset.completed === "true",
  }));
}

function closeEditOverlay() {
  resetSelectedEditContacts();
  const overlay = document.getElementById("edit-task-overlay");
  if (overlay) overlay.classList.replace("d-flex", "d-none");
}

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

function clearAllEditFieldErrors() {
  document.querySelectorAll(".error-message").forEach((el) => el.remove());
  document.querySelectorAll(".success-message").forEach((el) => el.remove());
}
