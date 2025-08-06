import { loadTasks } from "./load-tasks.js";
import { initBoardOverlay } from "./board-add-task-overlay.js";
import { initSearch } from "./search.js";
import { deleteTask } from "./delete-task.js";
import { openEditTaskOverlay } from "./edit-task.js";
import { initBoardTaskSave } from "./board-task-save.js";
import { initEditTaskForm } from "./edit-task-form.js";
import { initEditContactsDropdown, setupEditDropdownOpenClose } from "./edit-task-contacts.js";
import { initAddContactsDropdown, setupAddDropdownOpenClose } from "./add-task-contacts.js";

/* ========== DOMContentLoaded INIT ========== */
window.addEventListener("DOMContentLoaded", onDomLoaded);
function onDomLoaded() {
  initBoardModules();
  initEditModules();
  initAddTaskModules();
  initTaskOverlayOutsideClick();
}
function initBoardModules() {
  loadTasks();
  initBoardOverlay();
  initSearch();
}
function initEditModules() {
  initBoardTaskSave();
  initEditTaskForm();
  initEditContactsDropdown();
  setupEditDropdownOpenClose();
}
function initAddTaskModules() {
  initAddContactsDropdown();
  setupAddDropdownOpenClose();
}
function initTaskOverlayOutsideClick() {
  const overlay = document.getElementById('task-overlay');
  if (!overlay) return;
  overlay.addEventListener('click', e => closeTaskOverlayOnClick(e, overlay));
}
function closeTaskOverlayOnClick(e, overlay) {
  if (e.target !== overlay) return;
  overlay.classList.add('d-none');
  document.getElementById("body").classList.remove('overflow-hidden');
}

/* ========== ESC zum Schließen ========== */
document.addEventListener('keydown', onEscKeyCloseOverlay);
function onEscKeyCloseOverlay(e) {
  if (e.key !== 'Escape') return;
  const overlay = document.getElementById('task-overlay');
  if (!overlay || overlay.classList.contains('d-none')) return;
  overlay.classList.add('d-none');
  document.getElementById("body").classList.remove('overflow-hidden');
}
