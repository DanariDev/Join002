import { api } from "../api/client.js";
import { updateColumnPlaceholders } from "./board-placeholder.js";

/**
 * Deletes a task from Firebase by ID.
 * @param {string} taskId - The ID of the task to delete.
 */
export function deleteTask(taskId) {
  api.deleteTask(taskId)
    .then(() => handleDeleteSuccess(taskId))
    .catch(error => handleDeleteError(error));
}

/**
 * Handles successful task deletion: closes overlay.
 */
function handleDeleteSuccess(taskId) {
  const card = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
  if (card) card.remove();
  closeTaskOverlay();
  updateColumnPlaceholders();
}

/**
 * Handles task deletion errors and shows alert.
 * @param {Error} error - The error object.
 */
function handleDeleteError(error) {
  console.error('Fehler beim Löschen des Tasks:', error);
}

/**
 * Closes the task overlay and re-enables body scroll.
 */
function closeTaskOverlay() {
  document.getElementById('task-overlay').classList.add('d-none');
  document.getElementById("body").classList.remove('overflow-hidden');
}
