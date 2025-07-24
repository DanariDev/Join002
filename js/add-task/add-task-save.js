import { db } from '../firebase/firebase-init.js';
import { ref, push, set } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js';
import { getSelectedPriority } from './add-task-priority.js';

export async function saveTaskToDB(task) {
  try {
    const tasksRef = ref(db, 'tasks');
    const newTaskRef = push(tasksRef);
    await set(newTaskRef, task);
    showSuccess('Task successfully created!');
    clearForm();
  } catch (err) {
    showError('Saving failed! ' + (err?.message || ''));
  }
}

function showSuccess(msg) {
  alert(msg); // Hier gern durch dein Feedback-Popup ersetzen!
}

function showError(msg) {
  alert(msg); // Hier gern durch dein Feedback-Popup ersetzen!
}

function clearForm() {
  document.getElementById('add-task-form').reset();
  // Heute als Datum wieder einstellen:
  const dateInput = document.getElementById('due-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.min = today;
  }
}
