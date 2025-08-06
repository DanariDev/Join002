import { db } from "../firebase/firebase-init.js";
import { ref, push } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { loadTasks } from "./load-tasks.js";
import { clearForm } from "../add-task/add-task-save.js";

/** Initializes the save logic for board tasks */
export function initBoardTaskSave() {
  const form = document.querySelector("#add-task-form");
  if (!form) return;

  const saveBtn = form.querySelector("#add-task-btn");
  if (!saveBtn) return;

  saveBtn.addEventListener("click", (e) => handleSaveClick(e, form));
}

/** Handles save button click: validates and saves task to DB */
async function handleSaveClick(e, form) {
  e.preventDefault();
  const task = getTaskFromForm(form);
  if (!task) return;
  await saveTaskToDB(task);
  clearForm();
  closeOverlay();
  loadTasks();
}

/** Gets all form values and returns a task object */
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

/** Gets the value of a form field by selector */
function getValue(form, selector) {
  return form.querySelector(selector)?.value.trim();
}

/** Returns the selected priority from form */
function getSelectedPriority(form) {
  return form.querySelector(".priority-button.selected")?.dataset.priority;
}

/** Creates a new task object */
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

/** Saves the new task to the database */
async function saveTaskToDB(task) {
  const taskRef = ref(db, "tasks/");
  await push(taskRef, task);
}

/** Closes the overlay after saving */
function closeOverlay() {
  document.getElementById("add-task-overlay")?.classList.add("hidden");
}
