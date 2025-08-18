import { db } from '../firebase/firebase-init.js';
import { ref, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

/**
 * Sets up drag and drop events for tasks and columns.
 */
export function setupDragAndDrop() {
  let draggedTask = null;
  setupTaskCardDrags(task => { draggedTask = task; });
  setupTaskColumnDrops(
    () => draggedTask,
    task => { draggedTask = task; }
  );
}

/**
 * Enables dragging on all task cards.
 * @param {Function} onDragStart - Callback function for drag start event.
 */
function setupTaskCardDrags(onDragStart) {
  document.querySelectorAll('.task-card').forEach(task => {
    task.addEventListener('dragstart', e => {
      onDragStart(e.target);
      e.dataTransfer.effectAllowed = 'move';
    });
  });
}

/**
 * Sets up drop zones on columns for drag and drop.
 * @param {Function} getDraggedTask - Function to get the dragged task.
 * @param {Function} resetDraggedTask - Function to reset the dragged task.
 */
function setupTaskColumnDrops(getDraggedTask, resetDraggedTask) {
  document.querySelectorAll('.task-column').forEach(column => {
    column.addEventListener('dragover', e => handleDragOver(e));
    column.addEventListener('drop', e => handleDrop(e, column, getDraggedTask, resetDraggedTask));
  });
}

/**
 * Handles drag over event to allow dropping.
 * @param {Event} e - The dragover event.
 */
function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

/**
 * Handles drop event: moves task and updates status in database.
 * @param {Event} e - The drop event.
 * @param {HTMLElement} column - The target column element.
 * @param {Function} getDraggedTask - Function to get the dragged task.
 * @param {Function} resetDraggedTask - Function to reset the dragged task.
 */
function handleDrop(e, column, getDraggedTask, resetDraggedTask) {
  e.preventDefault();
  const draggedTask = getDraggedTask();
  if (!draggedTask) return;
  column.appendChild(draggedTask);
  const newStatus = getStatusFromColumn(column);
  updateTaskStatus(draggedTask.dataset.taskId, newStatus);
  resetDraggedTask(null);
}

/**
 * Returns new status string based on column class.
 * @param {HTMLElement} column - The column element.
 * @returns {string|null} The status string or null if invalid.
 */
function getStatusFromColumn(column) {
  if (column.classList.contains('to-do-tasks')) return 'to-do';
  if (column.classList.contains('in-progress-tasks')) return 'in-progress';
  if (column.classList.contains('await-tasks')) return 'await-feedback';
  if (column.classList.contains('done-tasks')) return 'done';
  return null;
}

/**
 * Updates the task status in Firebase.
 * @param {string} taskId - The ID of the task to update.
 * @param {string} newStatus - The new status for the task.
 */
function updateTaskStatus(taskId, newStatus) {
  if (!taskId || !newStatus) return;
  const updates = {};
  updates['/tasks/' + taskId + '/status'] = newStatus;
  update(ref(db), updates)
    .catch(error => {
      console.error('Fehler beim Aktualisieren:', error);
    });
}