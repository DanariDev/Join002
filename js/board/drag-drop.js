import { db } from '../firebase/firebase-init.js';
import { ref, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

/** Sets up drag & drop events for tasks and columns */
export function setupDragAndDrop() {
  let draggedTask = null;
  setupTaskCardDrags(task => { draggedTask = task; });
  setupTaskColumnDrops(
    () => draggedTask,
    task => { draggedTask = task; }
  );
}

/** Enables dragging on all task cards */
function setupTaskCardDrags(onDragStart) {
  document.querySelectorAll('.task-card').forEach(task => {
    task.addEventListener('dragstart', e => {
      onDragStart(e.target);
      e.dataTransfer.effectAllowed = 'move';
    });
  });
}

/** Sets up drop zones on columns for drag & drop */
function setupTaskColumnDrops(getDraggedTask, resetDraggedTask) {
  document.querySelectorAll('.task-column').forEach(column => {
    column.addEventListener('dragover', e => handleDragOver(e));
    column.addEventListener('drop', e => handleDrop(e, column, getDraggedTask, resetDraggedTask));
  });
}

/** Handles drag over event (needed for drop) */
function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

/** Handles drop event: moves task and updates status in DB */
function handleDrop(e, column, getDraggedTask, resetDraggedTask) {
  e.preventDefault();
  const draggedTask = getDraggedTask();
  if (!draggedTask) return;
  column.appendChild(draggedTask);
  const newStatus = getStatusFromColumn(column);
  updateTaskStatus(draggedTask.dataset.taskId, newStatus);
  resetDraggedTask(null);
}

/** Returns new status string based on column class */
function getStatusFromColumn(column) {
  if (column.classList.contains('to-do-tasks')) return 'to-do';
  if (column.classList.contains('in-progress-tasks')) return 'in-progress';
  if (column.classList.contains('await-tasks')) return 'await-feedback';
  if (column.classList.contains('done-tasks')) return 'done';
  return null;
}

/** Updates the task status in Firebase */
function updateTaskStatus(taskId, newStatus) {
  if (!taskId || !newStatus) return;
  const updates = {};
  updates['/tasks/' + taskId + '/status'] = newStatus;
  update(ref(db), updates)
    .then(() => console.log('Task-Status wurde aktualisiert:', newStatus))
    .catch(error => {
      console.error('Fehler beim Aktualisieren:', error);
    });
}
