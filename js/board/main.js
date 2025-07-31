import { loadTasks } from "./load-tasks.js";
import { initBoardOverlay } from "./board-add-task-overlay.js";

import { initSearch } from "./search.js";
import { deleteTask } from "./delete-task.js";
import { openEditTaskOverlay } from "./edit-task.js";
import { initEditTaskForm } from "./edit-task-form.js";
import { initEditContactsDropdown, setupEditDropdownOpenClose } from "./edit-task-contacts.js";

window.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  initBoardOverlay();  // <--- statt initOverlay()
  initSearch();
  initEditTaskForm();
  initEditContactsDropdown();
  setupEditDropdownOpenClose();
});
// Schließen des Task-Overlays mit ESC-Taste
document.addEventListener('keydown', function(e) {
  const overlay = document.getElementById('task-overlay');
  if (e.key === 'Escape' && overlay && !overlay.classList.contains('d-none')) {
    overlay.classList.add('d-none');
  }
});
window.addEventListener("DOMContentLoaded", () => {
  // ...deine bisherigen Inits...

  // Hier Outside-Click für Task-Overlay!
  const taskOverlay = document.getElementById('task-overlay');
  if (taskOverlay) {
    taskOverlay.addEventListener('click', function(e) {
      if (e.target === this) {
        taskOverlay.classList.add('d-none');
      }
    });
  }
});



