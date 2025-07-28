import { db } from "../firebase/firebase-init.js";
import {
  ref,
  push,
  set,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getSelectedPriority } from "./add-task-priority.js";

export async function saveTaskToDB(task) {
  try {
    const tasksRef = ref(db, "tasks");
    const newTaskRef = push(tasksRef);
    await set(newTaskRef, task);
    showSuccess("Task successfully created!");
    clearForm();
  } catch (err) {
    showError("Saving failed! " + (err?.message || ""));
  }
}

function showSuccess(msg) {
  const box = document.getElementById("success-message");
  if (!box) return;
  box.textContent = msg;
  box.classList.remove("d-none");
  setTimeout(() => {
    box.classList.add("d-none");
  }, 2500); // Box verschwindet nach 2,5 Sekunden
}

function showError(msg) {
  const box = document.getElementById("error-message-popup");
  if (!box) return;
  box.textContent = msg;
  box.classList.remove("d-none");
  setTimeout(() => {
    box.classList.add("d-none");
  }, 3500); // Fehler bleibt etwas länger sichtbar
}

function clearForm() {
  document.getElementById("add-task-form").reset();

  const dateInput = document.getElementById("due-date");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
    dateInput.min = today;
  }

  const subtaskList = document.getElementById("subtask-list");
  if (subtaskList) subtaskList.innerHTML = "";

  if (window.selectedContacts) {
    selectedContacts.clear();
    if (typeof renderContactsDropdown === "function") renderContactsDropdown();
    if (typeof renderSelectedInsignias === "function")
      renderSelectedInsignias();
  }
}

document.getElementById('clear-btn').addEventListener('click', clearForm);
