import { loadTasks } from "./load-tasks.js";
import { initOverlay } from "./overlay.js";
import { initSearch } from "./search.js";
import { deleteTask } from "./delete-task.js";
import { openEditTaskOverlay } from "./edit-task.js";   
import { initEditTaskForm } from "./edit-task-form.js";  

window.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  initOverlay();
  initSearch();
  initEditTaskForm(); 
});
