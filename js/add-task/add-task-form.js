import { saveTaskToDB } from './add-task-save.js';

export function initAddTaskForm() {
  const form = document.getElementById('add-task-form');
  const createBtn = document.getElementById('create-task-btn');
  if (!form || !createBtn) return;

  createBtn.addEventListener('click', (event) => {
    event.preventDefault();
    handleCreateTask();
  });
}

function handleCreateTask() {
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const dueDate = document.getElementById('due-date').value;

  if (!title) {
    showError('Please enter a title.');
    return;
  }

  if (!dueDate) {
    showError('Please select a due date.');
    return;
  }

  // Optional: Hier weitere Felder hinzufügen, wenn später erweitert!
  const task = {
    title,
    description,
    dueDate,
    createdAt: Date.now()
  };

  saveTaskToDB(task);
}

function showError(msg) {
  // Einfaches Error-Handling (Verbesserbar mit eigener Feedback.js)
  const errorMsg = document.getElementById('error-message');
  if (errorMsg) {
    errorMsg.textContent = msg;
    setTimeout(() => (errorMsg.textContent = ''), 2500);
  } else {
    alert(msg);
  }
}
