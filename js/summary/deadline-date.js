import { db } from '../firebase/firebase-init.js';
import { ref, get } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js';

/**
 * This function retrieves the task data from Firebase and passes it to the function "getNextUrgentDeadline". 
 * Subsequently, the values by the function "getNextUrgentDeadline" are passed to the function "updateDeadlineUI".
 */
export function initDeadlineDate() {
  const tasksRef = ref(db, 'tasks');
  get(tasksRef).then((snapshot) => {
    if (!snapshot.exists()) return;
    const tasks = Object.values(snapshot.val());
    const date = getNextUrgentDeadline(tasks);
    updateDeadlineUI(date);
  });
}

/**
 * This function determines the nearest appointment with the priority "urgent".
 * 
 * @param {object} tasks -This object contains the task data located in Firebase.
 * @returns -The nearest appointment is returned here. If none is found, null is returned.
 */
function getNextUrgentDeadline(tasks) {
  const urgent = tasks.filter(t => t.priority === 'urgent' && t.dueDate);
  const sorted = urgent.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  return sorted[0]?.dueDate || null;
}

/**
 * This function outputs the nearest appointment after the date has been reformatted with the function "formatDate". 
 * If no appointment is found, "No urgent tasks" is displayed.
 * 
 * @param {*} dateStr -Here is the nearest appointment, or null.
 * @returns -If the querySelector does not exist, the function is stopped here.
 */
function updateDeadlineUI(dateStr) {
  const el = document.querySelector('#deadline-date');
  if (!el) return;
  el.textContent = formatDate(dateStr) || 'No urgent tasks';
}

/**
 * This function converts a date like "2025-01-01" into "January 1, 2025". 
 * If no date is present, the process is aborted and null is returned.
 * 
 * @param {string} dateStr -Here is the nearest appointment, or null.
 * @returns1 -If no date is present, the process is aborted and null is returned.
 * @returns2 -The reformatted date is returned here.
 */
function formatDate(dateStr) {
  if (!dateStr) return null;
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-US', options);
}
