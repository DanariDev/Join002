import { db } from '../firebase/firebase-init.js';
import { ref, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

/** Deletes a task from Firebase by ID */
export function deleteTask(taskId) {
  const taskRef = ref(db, 'tasks/' + taskId);
  remove(taskRef)
    .then(() => handleDeleteSuccess())
    .catch(error => handleDeleteError(error));
}

/** Handles successful delete: closes overlay */
function handleDeleteSuccess() {
  console.log('Task erfolgreich gelöscht!');
  closeTaskOverlay();
}

/** Handles delete errors and shows alert */
function handleDeleteError(error) {
  console.error('Fehler beim Löschen des Tasks:', error);
  alert('Fehler beim Löschen. Bitte versuchen Sie es erneut.');
}

/** Closes the task overlay and re-enables scroll */
function closeTaskOverlay() {
  document.getElementById('task-overlay').classList.add('d-none');
  document.getElementById("body").classList.remove('overflow-hidden');
}
