import { loadTasks } from "./load-tasks.js";
import { initBoardOverlay } from "./board-add-task-overlay.js";
import { initSearch } from "./search.js";
import { deleteTask } from "./delete-task.js";
import { openEditTaskOverlay } from "./edit-task.js";
import { initBoardTaskSave } from "./board-task-save.js";
import { initEditTaskForm } from "./edit-task-form.js";
import { initEditContactsDropdown, setupEditDropdownOpenClose } from "./edit-task-contacts.js";
import { initAddContactsDropdown, setupAddDropdownOpenClose } from "./add-task-contacts.js";
import { updateColumnPlaceholders } from './board-placeholder.js';

/**
 * Initializes all modules and event handlers on DOM ready.
 */
window.addEventListener("DOMContentLoaded", onDomLoaded);

/**
 * Handles DOMContentLoaded event to initialize all modules.
 */
function onDomLoaded() {
  initBoardModules();
  initEditModules();
  initAddTaskModules();
  initTaskOverlayOutsideClick();
}

/**
 * Initializes board and task modules: loads tasks, overlays, search.
 */
function initBoardModules() {
  loadTasks();
  initBoardOverlay();
  initSearch();
}

/**
 * Initializes task edit modules.
 */
function initEditModules() {
  initBoardTaskSave();
  initEditTaskForm();
  initEditContactsDropdown();
  setupEditDropdownOpenClose();
}

/**
 * Initializes add task modules (contacts, dropdown).
 */
function initAddTaskModules() {
  initAddContactsDropdown();
  setupAddDropdownOpenClose();
}

/**
 * Enables clicking outside the overlay to close the task overlay.
 */
function initTaskOverlayOutsideClick() {
  const overlay = document.getElementById('task-overlay');
  if (!overlay) return;
  overlay.addEventListener('click', e => closeTaskOverlayOnClick(e, overlay));
}

/**
 * Closes the task overlay if clicking on the background.
 * @param {Event} e - The click event.
 * @param {HTMLElement} overlay - The task overlay element.
 */
function closeTaskOverlayOnClick(e, overlay) {
  if (e.target !== overlay) return;
  overlay.classList.add('d-none');
  document.getElementById("body").classList.remove('overflow-hidden');
}

/**
 * Handles Escape key to close the task overlay.
 * @param {Event} e - The keyboard event.
 */
function onEscKeyCloseOverlay(e) {
  if (e.key !== 'Escape') return;
  const overlay = document.getElementById('task-overlay');
  if (!overlay || overlay.classList.contains('d-none')) return;
  overlay.classList.add('d-none');
  document.getElementById("body").classList.remove('overflow-hidden');
}