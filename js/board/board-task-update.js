import { db } from "../firebase/firebase-init.js";
import { ref, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { loadTasks } from "./load-tasks.js";

export async function updateTask(taskId) {
  try {
    const { title, description, dueDate, category, priority } = getEditTaskFields();
    if (!allFieldsValid(title, description, dueDate, priority)) {
      alert("Bitte fülle alle Pflichtfelder aus!");
      return;
    }
    await updateTaskInDB(taskId, { title, description, dueDate, priority, category });
    closeEditOverlay();
    loadTasks();
  } catch (err) {
    console.error("❌ Fehler beim Aktualisieren:", err);
  }
}

function getEditTaskFields() {
  return {
    title: getFieldValue("#editing-title"),
    description: getFieldValue("#editing-description"),
    dueDate: getFieldValue("#editing-date"),
    category: getFieldValue("#editing-category"),
    priority: getPriorityFromBtn(),
  };
}

function getFieldValue(selector) {
  return document.querySelector(selector).value.trim();
}

function getPriorityFromBtn() {
  const btn = document.querySelector(".urgent-btn-active, .medium-btn-active, .low-btn-active");
  return btn?.dataset.priority;
}

function allFieldsValid(title, description, dueDate, priority) {
  return title && description && dueDate && priority;
}

async function updateTaskInDB(taskId, newData) {
  const taskRef = ref(db, `tasks/${taskId}`);
  await update(taskRef, newData);
}

function closeEditOverlay() {
  document.getElementById("edit-task-overlay").classList.replace("d-flex", "d-none");
}
