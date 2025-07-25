import { saveTaskToDB } from "./add-task-save.js";
import { getSelectedPriority } from "./add-task-priority.js";

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

function addSubtask() {
  const input = document.getElementById("subtask");
  const value = input.value.trim();
  if (!value) return;
  const list = document.getElementById("subtask-list");
  const li = document.createElement("li");
  li.textContent = value;
  list.appendChild(li);
  input.value = "";
}
document.getElementById("subtask").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    addSubtask();
    e.preventDefault();
  }
});

document.querySelector(".subtask-button").addEventListener("click", addSubtask);
document.getElementById("subtask-list").addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    editSubtask(e.target);
  }
});

function editSubtask(li) {
  const oldValue = li.textContent;
  const input = document.createElement("input");
  input.type = "text";
  input.value = oldValue;
  li.textContent = "";
  li.appendChild(input);
  input.focus();

  input.addEventListener("blur", finishEdit);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") finishEdit();
  });

  function finishEdit() {
    li.textContent = input.value.trim() || oldValue;
  }
}
function collectTaskData() {
  return {
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    dueDate: document.getElementById("due-date").value,
    priority: getSelectedPriority(),
    category: document.getElementById("category").value,
    subtasks: getSubtasks(),  // <<-- NEU!
    createdAt: Date.now(),
  };
}

function getSubtasks() {
  const items = document.querySelectorAll("#subtask-list li");
  return Array.from(items).map(li => li.textContent.trim());
}