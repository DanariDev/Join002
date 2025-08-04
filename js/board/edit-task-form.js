// js/board/edit-task-form.js

import { db } from "../firebase/firebase-init.js";
import {
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { setSelectedEditContacts } from "./edit-task-contacts.js";
import { updateTask } from "./board-task-update.js";

export function initEditTaskForm() {
  const saveBtn = document.getElementById("editing-save-btn");
  if (!saveBtn) return;

  saveBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    const taskId = window.currentEditTaskId;
    if (taskId) {
      await updateTask(taskId);
    }
  });
}

export function showEditForm(taskId) {
  const taskRef = ref(db, `tasks/${taskId}`);
  get(taskRef).then((snapshot) => {
    if (!snapshot.exists()) {
      console.error("Task nicht gefunden:", taskId);
      return;
    }

    const task = snapshot.val();

    // 🎯 Korrekte IDs laut HTML verwenden
    document.querySelector("#editing-title").value = task.title || "";
    document.querySelector("#editing-description").value =
      task.description || "";
    document.querySelector("#editing-date").value = task.dueDate || "";

    document
      .querySelectorAll("#editing-priority-buttons .all-priority-btns")
      .forEach((btn) => {
        btn.classList.remove(
          "urgent-btn-active",
          "medium-btn-active",
          "low-btn-active"
        );
      });

    if (task.priority === "urgent") {
      document
        .getElementById("editing-urgent-btn")
        .classList.add("urgent-btn-active");
    } else if (task.priority === "medium") {
      document
        .getElementById("editing-medium-btn")
        .classList.add("medium-btn-active");
    } else if (task.priority === "low") {
      document
        .getElementById("editing-low-btn")
        .classList.add("low-btn-active");
    }

    setSelectedEditContacts(task.assignedTo || []);
    document.getElementById("editing-category").value = task.category || "";
    generateEditSubtasks(task.subtasks || []);
    document
      .getElementById("edit-task-overlay")
      .classList.replace("d-none", "d-flex");
  });
}

function generateEditSubtasks(subtasks) {
  const ul = document.getElementById("editing-subtask-list");
  ul.innerHTML = "";
  subtasks.forEach((subtask, index) => {
    const li = document.createElement("li");
    li.textContent = subtask.task;
    li.dataset.completed = subtask.completed ? "true" : "false";
    ul.appendChild(li);
  });
}
export function setEditTaskHandlers(taskId) {
  const saveBtn = document.querySelector("#editing-save-btn");
  if (!saveBtn) {
    console.warn("Speicher-Button #editing-save-btn nicht gefunden.");
    return;
  }

  saveBtn.disabled = false;
  saveBtn.classList.remove("disabled");

  saveBtn.onclick = async (event) => {
    event.preventDefault(); // wichtig, wenn Button in <form> liegt
    await updateTask(taskId);
  };
}
