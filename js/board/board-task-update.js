import { db } from "../firebase/firebase-init.js";
import { ref, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { loadTasks } from "./load-tasks.js";

/**
 * Updates a task in the database after editing.
 * @param {string} taskId - The ID of the task to update.
 */
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

/**
 * Gets all edit form values as an object.
 * @returns {Object} The task fields object.
 */
function getEditTaskFields() {
  return {
    title: getFieldValue("#editing-title"),
    description: getFieldValue("#editing-description"),
    dueDate: getFieldValue("#editing-date"),
    category: getFieldValue("#editing-category"),
    priority: getPriorityFromBtn(),
  };
}

/**
 * Gets the value from a field by selector.
 * @param {string} selector - The CSS selector for the field.
 * @returns {string} The trimmed field value.
 */
function getFieldValue(selector) {
  return document.querySelector(selector).value.trim();
}

/**
 * Gets the selected priority from the edit form.
 * @returns {string|undefined} The selected priority or undefined.
 */
function getPriorityFromBtn() {
  const btn = document.querySelector(".urgent-btn-active, .medium-btn-active, .low-btn-active");
  return btn?.dataset.priority;
}

/**
 * Checks if all required fields are filled.
 * @param {string} title - The task title.
 * @param {string} description - The task description.
 * @param {string} dueDate - The task due date.
 * @param {string} priority - The task priority.
 * @returns {boolean} True if all fields are valid, false otherwise.
 */
function allFieldsValid(title, description, dueDate, priority) {
  return title && description && dueDate && priority;
}

/**
 * Updates the task in Firebase.
 * @param {string} taskId - The ID of the task to update.
 * @param {Object} newData - The updated task data.
 */
async function updateTaskInDB(taskId, newData) {
  const taskRef = ref(db, `tasks/${taskId}`);
  await update(taskRef, newData);
}

/**
 * Closes the edit overlay after saving.
 */
function closeEditOverlay() {
  document.getElementById("edit-task-overlay").classList.replace("d-flex", "d-none");
}