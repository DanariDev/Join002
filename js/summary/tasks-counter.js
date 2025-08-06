import { db } from '../firebase/firebase-init.js';
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js';

export function initTaskCounters() {
  const tasksRef = ref(db, 'tasks');
  onValue(tasksRef, snapshot => {
    if (!snapshot.exists()) return;
    updateCounters(Object.values(snapshot.val()));
  });
}
function updateCounters(tasks) {
  setCount('#todo h2', countByStatus(tasks, 'to-do'));
  setCount('#done h2', countByStatus(tasks, 'done'));
  setCount('#urgent h2', countByPriority(tasks, 'urgent'));
  setCount('#atBoard h2', tasks.length);
  setCount('#onProgress h2', countByStatus(tasks, 'in-progress'));
  setCount('#awaitFeedback h2', countByStatus(tasks, 'await-feedback'));
}
function countByStatus(tasks, status) {
  return tasks.filter(t => t.status === status).length;
}
function countByPriority(tasks, priority) {
  return tasks.filter(t => t.priority === priority).length;
}
function setCount(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = value;
}
