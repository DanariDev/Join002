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
 * Saves a task object to Firebase Realtime Database under "tasks" reference.
 * Shows success message on save, clears form; shows error on failure.
 */
export async function saveTaskToDB(task) {
  try {
    const tasksRef = ref(db, "tasks");
    const newTaskRef = push(tasksRef);
    await set(newTaskRef, task);
    showSuccess("Task successfully created!");
    clearForm();

    window.location.pathname.split('/').filter(Boolean).forEach(element => {
      if (element == 'add-task.html') {
        setTimeout(function () {
          window.location.href = 'board.html';
        }, 1000);
      }
      if (element == 'board.html') {
        closeBoardOverlay();
      }
    });

  } catch (err) {
    showError("Saving failed! " + (err?.message || ""));
  }
}

/**
 * Displays a success message in a box that hides after 2.5 seconds.
 */
function showSuccess(msg) {
  const box = document.getElementById("success-message");
  if (!box) return;
  box.textContent = msg;
  box.classList.remove("d-none");
  setTimeout(() => {
    box.classList.add("d-none");
  }, 2500); // Box verschwindet nach 2,5 Sekunden
}

/**
 * Displays an error message in a box that hides after 3.5 seconds.
 */
function showError(msg) {
  const box = document.getElementById("error-message-popup");
  if (!box) return;
  box.textContent = msg;
  box.classList.remove("d-none");
  setTimeout(() => {
    box.classList.add("d-none");
  }, 3500); // Fehler bleibt etwas länger sichtbar
}

/**
 * Resets the form, sets due date to today, clears subtasks and selected contacts.
 */
export function clearForm() {
  document.getElementById("add-task-form").reset();

  const dateInput = document.getElementById("due-date");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = "";
    dateInput.min = today;
  }

  document.querySelectorAll('.all-priority-btns')
    .forEach(btn => btn.classList.remove('low-btn-active', 'medium-btn-active', 'urgent-btn-active'));

  document.getElementById('medium-btn').classList.add('medium-btn-active');

  const subtaskList = document.getElementById("subtask-list");
  if (subtaskList) subtaskList.innerHTML = "";

  document.getElementById('error-title').innerText = "";
  document.getElementById('error-due-date').innerText = "";
  document.getElementById('error-category').innerText = "";

  resetSelectedContacts();
}


document.getElementById('clear-btn').addEventListener('click', clearForm);