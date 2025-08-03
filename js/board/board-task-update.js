// js/board/board-task-update.js

import { db } from "../firebase/firebase-init.js";
import { ref, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { loadTasks } from "./load-tasks.js";

export async function updateTask(taskId) {
  try {
    const title = document.querySelector("#editing-title").value.trim();
    const description = document.querySelector("#editing-description").value.trim();
    const dueDate = document.querySelector("#editing-date").value;
    const category = document.querySelector("#editing-category").value;
    const priorityBtn = document.querySelector(".urgent-btn-active, .medium-btn-active, .low-btn-active");
    const priority = priorityBtn?.dataset.priority;

    if (!title || !description || !dueDate || !priority) {
      alert("Bitte fülle alle Pflichtfelder aus!");
      return;
    }

    const taskRef = ref(db, `tasks/${taskId}`);
    const newData = {
      title,
      description,
      dueDate,
      priority,
      category,
    };

    await update(taskRef, newData);

    document.getElementById("edit-task-overlay").classList.replace("d-flex", "d-none");
    loadTasks();
  } catch (err) {
    console.error("❌ Fehler beim Aktualisieren:", err);
  }
}
