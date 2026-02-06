import { renderTask } from "./render-task.js";
import { setupDragAndDrop } from "./drag-drop.js";
import { updateColumnPlaceholders } from "./board-placeholder.js";
import { api } from "../api/client.js";

/**
 * Loads all tasks from the database and renders them into their board columns.
 */
export function loadTasks() {
  api.getTasks()
    .then(({ tasks }) => {
      clearColumns();
      const list = tasks || [];
      window.tasksById = Object.fromEntries(list.map(t => [String(t.id), t]));
      list.forEach(task => renderTask(task));
      setupDragAndDrop();
      updateColumnPlaceholders();
    })
    .catch(() => {
      clearColumns();
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
