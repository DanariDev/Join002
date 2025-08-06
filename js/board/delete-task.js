import { db } from '../firebase/firebase-init.js';
import { ref, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

/**
 * Deletes a task from Firebase by ID.
 * @param {string} taskId - The ID of the task to delete.
 */
export function deleteTask(taskId) {
  const taskRef = ref(db, 'tasks/' + taskId);
  remove(taskRef)
    .then(() => handleDeleteSuccess())
    .catch(error => handleDeleteError(error));
}

/**
 * Handles successful task deletion: closes overlay.
 */
function handleDeleteSuccess() {
  console.log('Task erfolgreich gelöscht!');
  closeTaskOverlay();
}

/**
 * Handles task deletion errors and shows alert.
 * @param {Error} error - The error object.
 */
function handleDeleteError(error) {
  console.error('Fehler beim Löschen des Tasks:', error);
  alert('Fehler beim Löschen. Bitte versuchen Sie es erneut.');
}

/**
 * Closes the task overlay and re-enables body scroll.
 */
function closeTaskOverlay() {
  document.getElementById('task-overlay').classList.add('d-none');
  document.getElementById("body").classList.remove('overflow-hidden');
}