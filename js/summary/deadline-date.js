import { db } from '../firebase/firebase-init.js';
import { ref, get } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js';

export function initDeadlineDate() {
  const tasksRef = ref(db, 'tasks');
  get(tasksRef).then(snapshot => {
    if (!snapshot.exists()) return;
    const tasks = Object.values(snapshot.val());
    const date = getNextUrgentDeadline(tasks);
    updateDeadlineUI(date);
  });
}
function getNextUrgentDeadline(tasks) {
  const urgent = tasks.filter(t => t.priority === 'urgent' && t.dueDate);
  const sorted = urgent.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  return sorted[0]?.dueDate || null;
}
function updateDeadlineUI(dateStr) {
  const el = document.querySelector('#deadline-date');
  if (!el) return;
  el.textContent = formatDate(dateStr) || 'No urgent tasks';
}
function formatDate(dateStr) {
  if (!dateStr) return null;
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-US', options);
}
