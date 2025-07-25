import { db } from '../firebase/firebase-init.js';
import { ref, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

export function setupDragAndDrop() {
  let draggedTask = null;
  document.querySelectorAll('.task-card').forEach(task => {
    task.addEventListener('dragstart', e => {
      draggedTask = e.target;
      e.dataTransfer.effectAllowed = 'move';
    });
  });
  document.querySelectorAll('.task-column').forEach(column => {
    column.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });
    column.addEventListener('drop', e => {
      e.preventDefault();
      if (!draggedTask) return;
      column.appendChild(draggedTask);
      let newStatus;
      if (column.classList.contains('to-do-tasks')) newStatus = 'to-do';
      else if (column.classList.contains('in-progress-tasks')) newStatus = 'in-progress';
      else if (column.classList.contains('await-tasks')) newStatus = 'await-feedback';
      else if (column.classList.contains('done-tasks')) newStatus = 'done';
      const taskId = draggedTask.dataset.taskId;
      const updates = {};
      updates['/tasks/' + taskId + '/status'] = newStatus;
      update(ref(db), updates)
        .then(() => console.log('Task-Status wurde aktualisiert:', newStatus))
        .catch(error => {
          console.error('Fehler beim Aktualisieren:', error);
        });
      draggedTask = null;
    });
  });
}
