// task-overlay.js

import { db } from "./firebase-config.js";
import {
  ref,
  update,
  remove,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

function $(s) {
  return document.querySelector(s);
}

const categoryOptions = `
  <select id="edit-category">
    <option value="technical">Technical Task</option>
    <option value="user">User Story</option>
  </select>`;

const priorityOptions = `
  <select id="edit-priority">
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="urgent">Urgent</option>
  </select>`;

function loadContactOptions(selected) {
  const refDb = ref(db);
  get(child(refDb, "contacts"))
    .then((snap) => {
      if (!snap.exists()) return;
      const contacts = snap.val();
      const select = document.createElement("select");
      select.id = "edit-assigned";
      select.className = "title-input";
      for (let key in contacts) {
        const opt = document.createElement("option");
        opt.value = contacts[key].name;
        opt.textContent = contacts[key].name;
        if (contacts[key].name === selected) opt.selected = true;
        select.appendChild(opt);
      }
      $("#popup-assigned").innerHTML = "Assigned to:";
      $("#popup-assigned").appendChild(select);
    });
}

export function renderPopup(task) {
  const overlay = $("#task-overlay");
  const content = $(".overlay-content");

  overlay.dataset.taskId = task.id;

  $("#popup-title").innerHTML = `<input id="edit-title" class="title-input" value="${task.title}" />`;
  $("#popup-description").innerHTML = `<textarea id="edit-description" class="description-input">${task.description}</textarea>`;
  $("#popup-due-date").innerHTML = `Due: <input type="date" id="edit-due-date" class="date-input" value="${task.dueDate}" />`;
  $("#popup-category").innerHTML = `Category: ${categoryOptions}`;
  loadContactOptions(task.assignedTo);
  $("#popup-priority").innerHTML = `Priority: ${priorityOptions}`;

  $("#edit-category").value = task.category;
  $("#edit-priority").value = task.priority;

  const subtaskList = $("#popup-subtasks");
  subtaskList.innerHTML = "";
  if (task.subtasks && task.subtasks.length > 0) {
    task.subtasks.forEach((s, i) => {
      const li = document.createElement("li");
      const input = document.createElement("input");
      input.value = s.text;
      input.classList.add("title-input");
      input.onchange = () => updateSubtaskText(task.id, i, input.value);
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = s.done;
      checkbox.onchange = () => toggleSubtask(task.id, i, checkbox.checked);
      li.appendChild(checkbox);
      li.append(" ");
      li.appendChild(input);
      subtaskList.appendChild(li);
    });
  }

  overlay.classList.remove("d-none");
  overlay.style.display = "flex";

  $(".overlay-close").onclick = () => closePopup();
  overlay.onclick = (e) => {
    if (e.target === overlay) closePopup();
  };

  $("#delete-task-btn").onclick = () => deleteTask(task.id);
  $("#edit-task-btn").textContent = "Save";
  $("#edit-task-btn").onclick = () => saveTaskEdits(task.id);
}

function closePopup() {
  const overlay = $("#task-overlay");
  overlay.classList.add("d-none");
  overlay.style.display = "none";
}

function toggleSubtask(taskId, index, checked) {
  const taskRef = ref(db, `tasks/${taskId}/subtasks/${index}/done`);
  update(taskRef, { ".value": checked });
}

function updateSubtaskText(taskId, index, text) {
  const taskRef = ref(db, `tasks/${taskId}/subtasks/${index}/text`);
  update(taskRef, { ".value": text });
}

function saveTaskEdits(taskId) {
  const updatedTask = {
    title: $("#edit-title").value,
    description: $("#edit-description").value,
    dueDate: $("#edit-due-date").value,
    category: $("#edit-category").value,
    assignedTo: $("#edit-assigned").value,
    priority: $("#edit-priority").value,
  };
  update(ref(db, `tasks/${taskId}`), updatedTask).then(closePopup);
}

function deleteTask(taskId) {
  if (confirm("Do you really want to delete this task?")) {
    remove(ref(db, `tasks/${taskId}`)).then(() => {
      closePopup();
      document.querySelector(`[data-id='${taskId}']`)?.remove();
    });
  }
}

// Example:
// renderPopup(taskObj);
