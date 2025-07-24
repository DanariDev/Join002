import { initAddTaskForm } from "./add-task-form.js";
import { initPriorityButtons } from "./add-task-priority.js";
import { initDueDateInput } from "./add-task-date.js";
import { setupDropdownOpenClose, initContactsDropdown } from "./add-task-contacts.js";

window.addEventListener("DOMContentLoaded", () => {
  initPriorityButtons();
  setupDropdownOpenClose();
  initContactsDropdown();         
  initDueDateInput();      
  initAddTaskForm();
});
