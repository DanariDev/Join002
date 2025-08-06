import { db } from "../firebase/firebase-init.js";
import { ref, push } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { loadTasks } from "./load-tasks.js";
import { clearForm } from "../add-task/add-task-save.js";

/**
 * Initializes the save logic for board tasks.
 */
export function initBoardTaskSave() {
  const form = document.querySelector("#add-task-form");
  if (!form) return;

  const saveBtn = form.querySelector("#add-task-btn");
  if (!saveBtn) return;

  saveBtn.addEventListener("click", (e) => handleSaveClick(e, form));
}

/**
 * Handles save button click: validates and saves task to the database.
 * @param {Event} e - The click event.
 * @param {HTMLFormElement} form - The task form element.
 */
async function handleSaveClick(e, form) {
  e.preventDefault();
  const task = getTaskFromForm(form);
  if (!task) return;
  await saveTaskToDB(task);
  clearForm();
  closeOverlay();
  loadTasks();
}

/**
 * Gets all form values and returns a task object.
 * @param {HTMLFormElement} form - The task form element.
 * @returns {Object|null} The task object or null if invalid.
 */
function getTaskFromForm(form) {
  try {
    const title = getValue(form, "[name='title']");
    const description = getValue(form, "[name='description']");
    const dueDate = getValue(form, "[name='dueDate']");
    const priority = getSelectedPriority(form);
    const status = "todo";
    if (!title || !description || !dueDate || !priority) return null;
    return createTaskObj(title, description, dueDate, priority, status);
  } catch (e) {
    console.error("Form-Auslesen fehlgeschlagen:", e);
    return null;
  }
}

/**
 * Gets the value of a form field by selector.
 * @param {HTMLFormElement} form - The task form element.
 * @param {string} selector - The CSS selector for the field.
 * @returns {string|undefined} The trimmed field value or undefined.
 */
function getValue(form, selector) {
  return form.querySelector(selector)?.value.trim();
}

/**
 * Gets the selected priority from the form.
 * @param {HTMLFormElement} form - The task form element.
 * @returns {string|undefined} The selected priority or undefined.
 */
function getSelectedPriority(form) {
  return form.querySelector(".priority-button.selected")?.dataset.priority;
}

/**
 * Creates a new task object.
 * @param {string} title - The task title.
 * @param {string} description - The task description.
 * @param {string} dueDate - The task due date.
 * @param {string} priority - The task priority.
 * @param {string} status - The task status.
 * @returns {Object} The task object.
 */
function createTaskObj(title, description, dueDate, priority, status) {
  return {
    title,
    description,
    dueDate,
    priority,
    status,
    subtasks: [],
    contacts: []
  };
}

/**
 * Saves the new task to the database.
 * @param {Object} task - The task object to save.
 */
async function saveTaskToDB(task) {
  const taskRef = ref(db, "tasks/");
  await push(taskRef, task);
}

/**
 * Closes the overlay after saving.
 */
function closeOverlay() {
  document.getElementById("add-task-overlay")?.classList.add("hidden");
}