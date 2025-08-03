import { db } from "../firebase/firebase-init.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { setSelectedEditContacts } from "./edit-task-contacts.js";

export function initEditTaskForm() {
  const saveBtn = document.getElementById("editing-save-btn");
  if (!saveBtn) return;
  saveBtn.addEventListener("click", (event) => {
    event.preventDefault();
    // Die Validierung und Speicherung wird jetzt von edit-task.js übernommen
    const taskId = window.currentEditTaskId;
    if (taskId) {
      const event = new Event("saveTask");
      document.dispatchEvent(event);
    }
  });
}

export function showEditForm(taskId) {
  const taskRef = ref(db, `tasks/${taskId}`);
  get(taskRef)
    .then((snapshot) => {
      if (!snapshot.exists()) {
        console.error(`Task with ID ${taskId} not found`);
        showEditFieldError("general", "Task not found. Please try again.");
        return;
      }
      const task = snapshot.val();
      fillEditFormWithTask(task);
      document.getElementById("edit-task-overlay").classList.replace("d-none", "d-flex");
    })
    .catch((error) => {
      console.error("Error loading task:", error);
      showEditFieldError("general", "Failed to load task data. Check your internet connection.");
    });
}

function fillEditFormWithTask(task) {
  setSelectedEditContacts(task.assignedTo || []);
  document.getElementById("editing-title").value = task.title || "";
  document.getElementById("editing-description").value = task.description || "";
  document.getElementById("editing-date").value = task.dueDate || "";
  document.getElementById("editing-category").value = task.category || "";
  setEditPriority(task.priority || "");
  fillEditSubtasks(task.subtasks || []);
}

function setEditPriority(priority) {
  document.querySelectorAll("#editing-priority-buttons .all-priority-btns").forEach((btn) =>
    btn.classList.remove("urgent-btn-active", "medium-btn-active", "low-btn-active")
  );
  if (priority) {
    document.getElementById(`editing-${priority}-btn`).classList.add(`${priority}-btn-active`);
  }
}

function fillEditSubtasks(subtasks) {
  const list = document.getElementById("editing-subtask-list");
  if (!list) return;
  list.innerHTML = "";
  subtasks.forEach((st) => {
    const li = document.createElement("li");
    li.textContent = st.task || st;
    li.dataset.completed = st.completed || false;
    list.appendChild(li);
  });
}

function showEditFieldError(field, message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  const fieldElement = document.getElementById(field);
  if (fieldElement) {
    fieldElement.parentElement.appendChild(errorDiv);
  } else {
    document.getElementById("edit-task-overlay")?.prepend(errorDiv);
  }
}

// Subtask handling
document.getElementById("editing-subtask")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addEditSubtask();
    e.preventDefault();
  }
});

document.querySelector("#edit-task-overlay .subtask-button")?.addEventListener("click", addEditSubtask);

document.getElementById("editing-subtask-list")?.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    editEditSubtask(e.target);
  }
});

function addEditSubtask() {
  const input = document.getElementById("editing-subtask");
  const value = input.value.trim();
  if (!value) return;
  const list = document.getElementById("editing-subtask-list");
  if (!list) return;
  const li = document.createElement("li");
  li.textContent = value;
  li.dataset.completed = false;
  list.appendChild(li);
  input.value = "";
}

function editEditSubtask(li) {
  const oldValue = li.textContent;
  const input = document.createElement("input");
  input.type = "text";
  input.value = oldValue;
  li.textContent = "";
  li.appendChild(input);
  input.focus();

  input.addEventListener("blur", finishEdit);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") finishEdit();
  });

  function finishEdit() {
    li.textContent = input.value.trim() || oldValue;
    li.dataset.completed = false;
  }
}