import { saveTaskToDB } from "./add-task-save.js";
import { getSelectedPriority } from "./add-task-priority.js"; // <--- diese Zeile ergänzen!

export function initAddTaskForm() {
  const form = document.getElementById("add-task-form");
  const createBtn = document.getElementById("create-task-btn");
  if (!form || !createBtn) return;

  createBtn.addEventListener("click", (event) => {
    event.preventDefault();
    handleCreateTask();
  });
}

function handleCreateTask() {
  clearAllFieldErrors();
  if (!validateTitle() | !validateDueDate()) return;
  saveTaskToDB(collectTaskData());
}

function validateTitle() {
  const title = document.getElementById("title").value.trim();
  if (!title) {
    showFieldError("title", "Please enter a title!");
    return false;
  }
  return true;
}

function validateDueDate() {
  const dueDate = document.getElementById("due-date").value;
  if (!dueDate) {
    showFieldError("due-date", "Please select a due date!");
    return false;
  }
  return true;
}

function collectTaskData() {
  return {
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    dueDate: document.getElementById("due-date").value,
    priority: getSelectedPriority(),         // <---- HIER EINFÜGEN!
    createdAt: Date.now(),
  };
}

function clearAllFieldErrors() {
  clearFieldError("title");
  clearFieldError("due-date");
}

// showError, showFieldError und clearFieldError bleiben wie gehabt
