import { db } from "../firebase/firebase-init.js";
import { ref, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { loadTasks } from "./load-tasks.js";

/** Updates a task in the database after editing */
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

/** Gets all edit form values as an object */
function getEditTaskFields() {
  return {
    title: getFieldValue("#editing-title"),
    description: getFieldValue("#editing-description"),
    dueDate: getFieldValue("#editing-date"),
    category: getFieldValue("#editing-category"),
    priority: getPriorityFromBtn(),
  };
}

/** Gets the value from a field by selector */
function getFieldValue(selector) {
  return document.querySelector(selector).value.trim();
}

/** Gets the selected priority from the edit form */
function getPriorityFromBtn() {
  const btn = document.querySelector(".urgent-btn-active, .medium-btn-active, .low-btn-active");
  return btn?.dataset.priority;
}

/** Checks if all required fields are filled */
function allFieldsValid(title, description, dueDate, priority) {
  return title && description && dueDate && priority;
}

/** Updates the task in Firebase */
async function updateTaskInDB(taskId, newData) {
  const taskRef = ref(db, `tasks/${taskId}`);
  await update(taskRef, newData);
}

/** Closes the edit overlay after saving */
function closeEditOverlay() {
  document.getElementById("edit-task-overlay").classList.replace("d-flex", "d-none");
}
