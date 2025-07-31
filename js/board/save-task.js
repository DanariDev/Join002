import { db } from "../firebase/firebase-init.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { closeTaskOverlay } from "./overlay-handler.js";

export function saveEditedTask(taskId, selectedContacts) {
  const form = document.getElementById('edit-task-form');
  const taskData = {
    title: form.querySelector('#editing-title').value || '',
    description: form.querySelector('#editing-description').value || '',
    dueDate: form.querySelector('#editing-due-date').value || '',
    priority: form.querySelector('.prio-btn.selected')?.dataset.priority || '',
    category: form.querySelector('#editing-category').value || '',
    assignedTo: selectedContacts || [],
    subtasks: getSubtasksFromForm()
  };
  const taskRef = ref(db, `tasks/${taskId}`);
  set(taskRef, taskData).then(() => closeTaskOverlay());
}

function getSubtasksFromForm() {
  const subtaskList = document.getElementById('editing-subtask-list');
  return Array.from(subtaskList.querySelectorAll('li')).map(li => li.textContent.trim());
}