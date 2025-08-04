import { openEditTaskOverlay } from "./edit-task.js";
import { showEditForm, initEditTaskForm } from "./edit-task-form.js";
import { getInitials, getRandomColor } from "../contacts/contact-style.js"; // Pfad prüfen!
import { db } from "../firebase/firebase-init.js";
import {
  ref,
  get,
  onValue,
  update 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { deleteTask } from "./delete-task.js";
import { renderProgressBar } from "./progress-bar.js";


// Task ins Board rendern
export function renderTask(task) {
  const template = document.getElementById("task-template");
  const clone = template.content.cloneNode(true);
  setTaskProps(clone, task);
  let col = ".to-do-tasks";
  if (task.status === "in-progress") col = ".in-progress-tasks";
  else if (task.status === "await-feedback") col = ".await-tasks";
  else if (task.status === "done") col = ".done-tasks";
  document.querySelector(col).appendChild(clone);
}

// Task-Eigenschaften setzen und Kontakte rendern
function setTaskProps(clone, task) {
  setLabel(clone, task);
  clone.querySelector(".task-title").textContent = task.title || "";
  clone.querySelector(".task-desc").textContent = task.description || "";
  setPriority(clone, task);
  setProgress(clone, task);

  // Debug-Ausgaben
  console.log("TASK-DATEN:", task);
  const initialsDiv = clone.querySelector(".assigned-initials-board");
  renderAssignedContacts(task.assignedTo, initialsDiv);

  clone.querySelector(".task-card").setAttribute("draggable", "true");
  clone.querySelector(".task-card").dataset.taskId = task.id;
}

// Label-Style
function setLabel(clone, task) {
  const labelDiv = clone.querySelector(".task-label");
  applyCategoryStyle(labelDiv, task.category);
}

function applyCategoryStyle(labelEl, category) {
  if (category === "Technical Task") {
    labelEl.textContent = "Technical Task";
    labelEl.style.background = "#00c7a3";
  } else if (category === "User Story") {
    labelEl.textContent = "User Story";
    labelEl.style.background = "#0038ff";
  } else {
    labelEl.textContent = "";
    labelEl.style.background = "transparent";
  }
}

// Prio-Icon
function setPriority(clone, task) {
  const img = clone.querySelector(".priority-img");
  if (task.priority === "urgent") {
    img.src = "assets/img/urgent-btn-icon.png";
    img.alt = "Urgent";
  } else if (task.priority === "medium") {
    img.src = "assets/img/medium-btn-icon.png";
    img.alt = "Medium";
  } else if (task.priority === "low") {
    img.src = "assets/img/low-btn-icon.png";
    img.alt = "Low";
  } else {
    img.src = "";
    img.alt = "";
  }
}

// Fortschritt/Subtasks
// In render-task.js:
function setProgress(clone, task) {
  renderProgressBar(task.subtasks, clone);
}


// Card-Overlay öffnen beim Klick
document.addEventListener("click", function (e) {
  const card = e.target.closest(".task-card");
  if (card) {
    const taskId = card.dataset.taskId;
    openTaskOverlay(taskId);
  }
});

// Overlay-Funktionen
export function openTaskOverlay(taskId) {
  document.getElementById("task-overlay").classList.remove("d-none");
  const card = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
  if (!card) return;
  setTaskOverlayContent(card, taskId);
  setTaskOverlayHandlers(taskId);
}

function setTaskOverlayContent(card, taskId) {
  const category = card.querySelector(".task-label").textContent;
  const title = card.querySelector(".task-title").textContent;
  const desc = card.querySelector(".task-desc").textContent;
  const prioImg = card.querySelector(".priority-img");
  const prio = prioImg?.alt || "";

  document.getElementById("popup-category").innerHTML = `<span class="task-label">${category}</span>`;
  document.getElementById("popup-title").innerHTML = `<h2>${title}</h2>`;
  document.getElementById("popup-description").innerHTML = `<div>${desc || ""}</div>`;
  document.getElementById("popup-priority").innerHTML = `<b>Priority:</b>
  <div class="prio_spacing">
  <span>${prio}</span>
  <img src="assets/img/${prio}-btn-icon.png" alt="">
  </div>`;
  dueDateGenerate(taskId, (formattedDate) => {
    document.getElementById('popup-due-date').innerHTML = `<b>Due date:</b> <span>${formattedDate}</span>`;
  });

  assignedToGenerate(taskId);
  console.log("TASKID:" + taskId.assignedTo);


  const labelSpan = document.querySelector("#popup-category .task-label");
  if (labelSpan) applyCategoryStyle(labelSpan, category);
  subtaskGenerate(taskId);
  console.log("Card:" + card, "taskID:" + taskId);
}

function assignedToGenerate(taskId) {
  const container = document.getElementById("popup-assigned");
  container.innerHTML = ""; // Vorherigen Inhalt leeren

  // Label "Assigned To:"
  const label = document.createElement("b");
  label.textContent = "Assigned To: ";
  container.appendChild(label);

  // Initialen-Gruppe in eigenen Container mit class="initial-group"
  const initialGroupDiv = document.createElement("div");
  initialGroupDiv.className = "initial-group";
  container.appendChild(initialGroupDiv);

  // Daten aus Firebase holen
  const tasksRef = ref(db, 'tasks/' + taskId);
  onValue(tasksRef, (snapshot) => {
    const taskData = snapshot.val();
    if (taskData && taskData.assignedTo) {
      renderAssignedContacts(taskData.assignedTo, initialGroupDiv);
    } else {
      initialGroupDiv.innerHTML = "<span>None assigned</span>";
    }
  });
}


function dueDateGenerate(taskId, callback) {
  const tasksRef = ref(db, 'tasks/');
  onValue(tasksRef, (snapshot) => {
    const data = snapshot.val();
    if (data && data[taskId]) {
      const rawDate = data[taskId].dueDate;
      const formattedDate = formatDate(rawDate);
      callback(formattedDate);
    }
  });
}

function formatDate(dateString) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

// 1. Einstiegspunkt: Generiere die Subtask-Liste im Overlay
function subtaskGenerate(taskId) {
  const list = document.getElementById('popup-subtasks');
  list.innerHTML = "";
  const tasksRef = ref(db, 'tasks/' + taskId);
  get(tasksRef).then((snapshot) => {
    const task = snapshot.val();
    renderSubtaskList(list, task, taskId);
  });
}


// 2. Rendere alle Subtasks als Checkboxen
function renderSubtaskList(list, task, taskId) {
  if (!task || !task.subtasks) {
    list.innerHTML = "<li>No subtasks available</li>";
    return;
  }
  list.innerHTML = task.subtasks.map((st, i) => renderSingleSubtask(st, i, taskId)).join('');
  setSubtaskCheckboxEvents(list, taskId);
}

// 3. Rendere eine Subtask-Zeile
function renderSingleSubtask(subtask, index, taskId) {
  const subtaskId = `subtask-${taskId}-${index}`;
  const checked = subtask.checked === true || subtask.checked === "true" ? "checked" : "";
  return `
    <li>
      <input type="checkbox" class="custom-checkbox" id="${subtaskId}" name="subtask-${index}" ${checked}>
      <label for="${subtaskId}"></label>
      <span>${subtask.task}</span>
    </li>
  `;
}

// 4. Setze Eventhandler für alle Checkboxen
function setSubtaskCheckboxEvents(list, taskId) {
  const checkboxes = list.querySelectorAll('.custom-checkbox');
  checkboxes.forEach((cb, idx) => {
    cb.addEventListener('change', () => handleSubtaskChange(cb, idx, taskId));
  });
}

// 5. Beim Abhaken: Status speichern, neu rendern und Balken updaten
function handleSubtaskChange(cb, idx, taskId) {
  const tasksRef = ref(db, 'tasks/' + taskId);
  get(tasksRef).then((snap) => {
    const freshTask = snap.val();
    if (!freshTask || !freshTask.subtasks || !freshTask.subtasks[idx]) return;
    freshTask.subtasks[idx].checked = cb.checked;
    update(tasksRef, { subtasks: freshTask.subtasks }).then(() => {
      const card = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
      if (card) renderProgressBar(freshTask.subtasks, card);
      // Subtasks nach dem Speichern NEU rendern, damit alles aktuell ist
      subtaskGenerate(taskId);
    });
  });
}


// 6. Fortschrittsbalken & Overlay-Subtasks neu zeichnen
function updateProgressBarAndList(subtasks, taskId) {
  const card = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
  if (card) renderProgressBar(subtasks, card);
  subtaskGenerate(taskId);
}

function setTaskOverlayHandlers(taskId) {
  document.getElementById("overlay-close").onclick = function () {
    document.getElementById("task-overlay").classList.add("d-none");
  };
  document.getElementById("delete-task-btn").onclick = function () {
    deleteTask(taskId);
  };
  document.getElementById("edit-task-btn").onclick = function () {
    document.getElementById("task-overlay").classList.add("d-none");
    window.currentEditTaskId = taskId;
    openEditTaskOverlay(taskId);
  };
}

async function renderAssignedContacts(contactIds, container) {
  if (!contactIds || contactIds.length === 0) {
    container.innerHTML = '';
    return;
  }
  const contacts = await getContactsFromDb();
  const toShow = collectContacts(contactIds, contacts);
  renderInitials(toShow, container);
}

async function getContactsFromDb() {
  const snap = await get(ref(db, "contacts"));
  if (!snap.exists()) return {};
  return snap.val();
}

function collectContacts(ids, allContacts) {
  let arr = [];
  ids.forEach(id => {
    let c = allContacts[id];
    if (!c) c = findContactByName(id, allContacts);
    if (c) arr.push(c);
  });
  return arr;
}

function findContactByName(name, allContacts) {
  for (const k in allContacts) {
    if (allContacts[k].name === name) return allContacts[k];
  }
}

function renderInitials(arr, container) {
  container.innerHTML = '';
  let max = 3;
  arr.slice(0, max).forEach(c => addBubble(c, container));
  if (arr.length > max) addRestBubble(arr.length - max, container);
}

function addBubble(contact, container) {
  const span = document.createElement('span');
  span.className = 'initials-task';
  span.textContent = getInitials(contact.name);
  span.style.backgroundColor = getRandomColor(contact.name);
  container.appendChild(span);
}

function addRestBubble(count, container) {
  const span = document.createElement('span');
  span.className = 'initials-task initials-extra';
  span.textContent = `+${count}`;
  span.style.backgroundColor = "#878787";
  container.appendChild(span);
}