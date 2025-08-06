// add-task-save.js
import { db } from "../firebase/firebase-init.js";
import {
  ref,
  push,
  set,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getSelectedPriority } from "./add-task-priority.js";
import { resetSelectedContacts } from "./add-task-contacts.js";
import { closeBoardOverlay } from "../board/board-add-task-overlay.js"

/**
 * Saves a task object to Firebase Realtime Database.
 */
export async function saveTaskToDB(task) {
  try {
    await pushTaskToDB(task);
    showSuccess("Task successfully created!");
    clearForm();
    handleRedirects();
  } catch (err) {
    showError("Saving failed! " + (err?.message || ""));
  }
}

async function pushTaskToDB(task) {
  const tasksRef = ref(db, "tasks");
  const newTaskRef = push(tasksRef);
  await set(newTaskRef, task);
}

function handleRedirects() {
  getPathElements().forEach(element => {
    if (element == 'add-task.html') {
      setTimeout(() => {
        window.location.href = 'board.html';
      }, 1000);
    }
    if (element == 'board.html') {
      closeBoardOverlay();
    }
  });
}

function getPathElements() {
  return window.location.pathname.split('/').filter(Boolean);
}

function showSuccess(msg) {
  const box = document.getElementById("success-message");
  if (!box) return;
  box.textContent = msg;
  box.classList.remove("d-none");
  setTimeout(() => box.classList.add("d-none"), 2500);
}

function showError(msg) {
  const box = document.getElementById("error-message-popup");
  if (!box) return;
  box.textContent = msg;
  box.classList.remove("d-none");
  setTimeout(() => box.classList.add("d-none"), 3500);
}

/**
 * Resets the form and UI fields.
 */
export function clearForm() {
  resetFormFields();
  resetDateInput();
  resetPriorityButtons();
  clearSubtasks();
  clearAllErrors();
  resetSelectedContacts();
}

function resetFormFields() {
  const form = document.getElementById("add-task-form");
  if (form) form.reset();
}

function resetDateInput() {
  const dateInput = document.getElementById("due-date");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = "";
    dateInput.min = today;
  }
}

function resetPriorityButtons() {
  document.querySelectorAll('.all-priority-btns')
    .forEach(btn => btn.classList.remove('low-btn-active', 'medium-btn-active', 'urgent-btn-active'));
  document.getElementById('medium-btn').classList.add('medium-btn-active');
}

function clearSubtasks() {
  const subtaskList = document.getElementById("subtask-list");
  if (subtaskList) subtaskList.innerHTML = "";
}

function clearAllErrors() {
  setErrorText('error-title', "");
  setErrorText('error-due-date', "");
  setErrorText('error-category', "");
}

function setErrorText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value;
}

// Event: Clear-Button
document.getElementById('clear-btn').addEventListener('click', clearForm);
