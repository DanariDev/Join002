import { initAddTaskForm } from "./add-task-form.js";
import { initPriorityButtons } from "./add-task-priority.js";
import { initDueDateInput } from "./add-task-date.js";
import { setupDropdownOpenClose, initContactsDropdown } from "./add-task-contacts.js";

/**
 * Initializes all modules for the add-task page on DOM ready.
 * Calls all necessary init functions when the DOM is fully loaded.
 */
window.addEventListener("DOMContentLoaded", () => {
  initPriorityButtons();
  setupDropdownOpenClose();
  initContactsDropdown();
  initDueDateInput();
  initAddTaskForm();
});
