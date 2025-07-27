import { db } from '../firebase/firebase-init.js';
import { ref, get } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js';

/**
 * This function retrieves the task data from Firebase and passes it to the function "updateCounters".
 */
export function initTaskCounters() {
  const tasksRef = ref(db, 'tasks');
  get(tasksRef).then((snapshot) => {
    if (!snapshot.exists()) return;
    const tasks = Object.values(snapshot.val());
    updateCounters(tasks);
  });
}

/**
 * This function controls the retrieval and output of the values.
 * 
 * @param {Object} tasks -This object contains the task data located in Firebase.
 */
function updateCounters(tasks) {
  setCount('#todo h2', countByStatus(tasks, 'to-do'));
  setCount('#done h2', countByStatus(tasks, 'done'));
  setCount('#urgent h2', countByPriority(tasks, 'urgent'));
  setCount('#atBoard h2', tasks.length);
  setCount('#onProgress h2', countByStatus(tasks, 'in-progress'));
  setCount('#awaitFeedback h2', countByStatus(tasks, 'feedback'));
}

/**
 * This function retrieves all tasks with the same status.
 * 
 * @param {object} tasks -This object contains the task data located in Firebase.
 * @param {string} status -Here, it is specified which status should be counted.
 * @returns -The count is returned here.
 */
function countByStatus(tasks, status) {
  return tasks.filter(t => t.status === status).length;
}

/**
 * This function retrieves all tasks with the priority "urgent" status.
 * 
 * @param {object} tasks -This object contains the task data located in Firebase.
 * @param {string} priority -The priority is passed to "urgent" here.
 * @returns -The count is returned here.
 */
function countByPriority(tasks, priority) {
  return tasks.filter(t => t.priority === priority).length;
}


/**
 * This function outputs the count on the page.
 * 
 * @param {string} selector -The selector value is passed here.
 * @param {string} value -The previously count is passed here.
 */
function setCount(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = value;
}
