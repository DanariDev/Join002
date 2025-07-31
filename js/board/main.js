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

