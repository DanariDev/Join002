import { db } from '../firebase/firebase-init.js';
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js';

/**
 * Initializes task counters:
 * Subscribes to real-time updates from the database and updates all summary counters when tasks change.
 */
export function initTaskCounters() {
  const tasksRef = ref(db, 'tasks');
  onValue(tasksRef, snapshot => {
    if (!snapshot.exists()) return;
    updateCounters(Object.values(snapshot.val()));
  });
}

/**
 * Updates all summary boxes with the latest task counts (by status, priority, etc).
 * @param {Array} tasks - Array of all tasks.
 */
function updateCounters(tasks) {
  setCount('#todo h2', countByStatus(tasks, 'to-do'));
  setCount('#done h2', countByStatus(tasks, 'done'));
  setCount('#urgent h2', countByPriority(tasks, 'urgent'));
  setCount('#atBoard h2', tasks.length);
  setCount('#onProgress h2', countByStatus(tasks, 'in-progress'));
  setCount('#awaitFeedback h2', countByStatus(tasks, 'await-feedback'));
}

/**
 * Counts the number of tasks matching the given status.
 * @param {Array} tasks - Array of all tasks.
 * @param {string} status - The status to filter by.
 * @returns {number} - The count of tasks with that status.
 */
function countByStatus(tasks, status) {
  return tasks.filter(t => t.status === status).length;
}

/**
 * Counts the number of tasks matching the given priority (e.g., 'urgent').
 * @param {Array} tasks - Array of all tasks.
 * @param {string} priority - The priority to filter by.
 * @returns {number} - The count of tasks with that priority.
 */
function countByPriority(tasks, priority) {
  return tasks.filter(t => t.priority === priority).length;
}

/**
 * Updates the text content of a DOM element with the given selector.
 * @param {string} selector - CSS selector for the element.
 * @param {number} value - The value to display.
 */
function setCount(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = value;
}
