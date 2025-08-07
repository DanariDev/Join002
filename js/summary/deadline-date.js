import { db } from '../firebase/firebase-init.js';
import { ref, get } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js';

/**
 * Initializes deadline date loading: 
 * Fetches all tasks from the database, finds the next urgent deadline,
 * and updates the UI with the formatted date.
 */
export function initDeadlineDate() {
  const tasksRef = ref(db, 'tasks');
  get(tasksRef).then(snapshot => {
    if (!snapshot.exists()) return;
    const tasks = Object.values(snapshot.val());
    const date = getNextUrgentDeadline(tasks);
    updateDeadlineUI(date);
  });
}

/**
 * Returns the soonest dueDate from all tasks with priority "urgent".
 * Returns null if no urgent task is found.
 * @param {Array} tasks - List of all tasks.
 * @returns {string|null} - Next urgent dueDate or null.
 */
function getNextUrgentDeadline(tasks) {
  const urgent = tasks.filter(t => t.priority === 'urgent' && t.dueDate);
  const sorted = urgent.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  return sorted[0]?.dueDate || null;
}

/**
 * Updates the UI element with the nearest urgent deadline,
 * or displays "No urgent tasks" if there is none.
 * @param {string|null} dateStr - The date string to display.
 */
function updateDeadlineUI(dateStr) {
  const el = document.querySelector('#deadline-date');
  if (!el) return;
  el.textContent = formatDate(dateStr) || 'No urgent tasks';
}

/**
 * Formats a date string (YYYY-MM-DD) into "Month Day, Year".
 * Returns null if dateStr is missing.
 * @param {string} dateStr - Date string to format.
 * @returns {string|null} - Formatted date or null.
 */
function formatDate(dateStr) {
  if (!dateStr) return null;
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-US', options);
}
