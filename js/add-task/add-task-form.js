import { saveTaskToDB } from "./add-task-save.js";
import { getSelectedPriority } from "./add-task-priority.js"; // <--- diese Zeile ergänzen!

export function initAddTaskForm() {
  const createBtn = document.getElementById("create-task-btn");
  if (!createBtn) return;
  createBtn.addEventListener("click", function (event) {
    event.preventDefault();
    clearAllFieldErrors();
    let valid = true;
    if (!validateTitle()) valid = false;
    if (!validateDueDate()) valid = false;
    if (!validateCategory()) valid = false;
    // weitere Checks hier...
    if (valid) saveTaskToDB(collectTaskData());
  });
}

function handleCreateTask() {
  clearAllFieldErrors();
  if (!validateTitle() | !validateDueDate()) return;
  saveTaskToDB(collectTaskData());
}
function showFieldError(field, message) {
  const errorDiv = document.getElementById(`error-${field}`);
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.color = "red";
  }
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
function validateCategory() {
  const category = document.getElementById("category").value;
  if (!category) {
    showFieldError("category", "Please select a category!");
    return false;
  }
  clearFieldError("category");
  return true;
}

function collectTaskData() {
  return {
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    dueDate: document.getElementById("due-date").value,
    priority: getSelectedPriority(),
    createdAt: Date.now(),
  };
}
function clearFieldError(field) {
  const errorDiv = document.getElementById(`error-${field}`);
  if (errorDiv) {
    errorDiv.textContent = "";
  }
}

function clearAllFieldErrors() {
  clearFieldError("title");
  clearFieldError("due-date");
}


