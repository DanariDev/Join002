import { initAddTaskForm } from "./add-task-form.js";
import { initPriorityButtons } from "./add-task-priority.js";
import { initDueDateInput } from "./add-task-date.js"; // falls du das Datumfeld extra initialisierst

window.addEventListener("DOMContentLoaded", () => {
  initPriorityButtons();
  initDueDateInput();      
  initAddTaskForm();
});
