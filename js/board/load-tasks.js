import { db } from '../firebase/firebase-init.js';
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { renderTask } from "./render-task.js";
import { setupDragAndDrop } from "./drag-drop.js";
import { updateColumnPlaceholders } from "./board-placeholder.js";

/**
 * Loads all tasks from the database and renders them into their board columns.
 */
export function loadTasks() {
  const tasksRef = ref(db, 'tasks/');
  onValue(tasksRef, (snapshot) => {
    const data = snapshot.val();
    clearColumns();
    if (data) Object.entries(data).forEach(([id, task]) => {
      task.id = id;
      renderTask(task);
    });
    setupDragAndDrop();
    updateColumnPlaceholders();
  });
}

/**
 * Clears all board columns before re-rendering tasks.
 */
function clearColumns() {
  getCol(".to-do-tasks").innerHTML = "";
  getCol(".in-progress-tasks").innerHTML = "";
  getCol(".await-tasks").innerHTML = "";
  getCol(".done-tasks").innerHTML = "";
}

/**
 * Gets a column element by its CSS selector.
 * @param {string} selector - The CSS selector for the column.
 * @returns {HTMLElement} The column element.
 */
function getCol(selector) {
  return document.querySelector(selector);
}