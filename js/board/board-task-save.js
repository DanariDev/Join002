// js/board/board-task-save.js

import { db } from "../firebase/firebase-init.js";
import { ref, push } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { loadTasks } from "./load-tasks.js";
import { clearForm } from "../add-task/add-task-save.js";

export function initBoardTaskSave() {
  const form = document.querySelector("#add-task-form");
  if (!form) return;

  const saveBtn = form.querySelector("#add-task-btn");
  if (!saveBtn) return;

  saveBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const task = getTaskFromForm(form);
    if (!task) return;

    const taskRef = ref(db, "tasks/");
    await push(taskRef, task);

    clearForm();
    closeOverlay();
    loadTasks();
  });
}

function getTaskFromForm(form) {
  try {
    const title = form.querySelector("[name='title']").value.trim();
    const description = form.querySelector("[name='description']").value.trim();
    const dueDate = form.querySelector("[name='dueDate']").value;
    const priority = form.querySelector(".priority-button.selected")?.dataset.priority;
    const status = "todo";

    if (!title || !description || !dueDate || !priority) return null;

    return {
      title,
      description,
      dueDate,
      priority,
      status,
      subtasks: [],
      contacts: []
    };
  } catch (e) {
    console.error("Form-Auslesen fehlgeschlagen:", e);
    return null;
  }
}

function closeOverlay() {
  document.getElementById("add-task-overlay")?.classList.add("hidden");
}
