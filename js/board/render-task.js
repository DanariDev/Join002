import { openEditTaskOverlay } from "./edit-task.js";
import { showEditForm, initEditTaskForm } from "./edit-task-form.js";
import { getInitials, getRandomColor } from "../contacts/contact-style.js"; // Pfad prüfen!
import { db } from "../firebase/firebase-init.js";
import {
  ref,
  get,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { deleteTask } from "./delete-task.js";

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
function setProgress(clone, task) {
  const bar = clone.querySelector(".progress-bar");
  const count = clone.querySelector(".task-count");
  if (task.subtasks && task.subtasks.length > 0) {
    const completed = task.subtasks.filter((st) => st.completed).length;
    const percent = Math.round((completed / task.subtasks.length) * 100);
    bar.style.width = percent + "%";
    count.textContent = `${completed} / ${task.subtasks.length}`;
  } else {
    bar.style.width = "0%";
    count.textContent = "0 / 0";
  }
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
  document.getElementById(
    "popup-category"
  ).innerHTML = `<span class="task-label">${category}</span>`;
  document.getElementById("popup-title").innerHTML = `<h2>${title}</h2>`;
  document.getElementById("popup-description").innerHTML = `<div>${
    desc || ""
  }</div>`;
  document.getElementById(
    "popup-due-date"
  ).innerHTML = `<b>Due date:</b> <span>-</span>`;
  document.getElementById(
    "popup-priority"
  ).innerHTML = `<b>Priority:</b> <span>${prio}</span>`;
  const labelSpan = document.querySelector("#popup-category .task-label");
  if (labelSpan) applyCategoryStyle(labelSpan, category);
  subtaskGenerate(taskId);
}

function subtaskGenerate(taskId){
  document.getElementById('popup-subtasks').innerHTML ="";
  const tasksRef = ref(db, 'tasks/');
  onValue(tasksRef, (snapshot) => {
    const data = snapshot.val();
    if (data) Object.entries(data).forEach((element) => {
      if(element[0] == taskId){
        if(element[1].subtasks != undefined) element[1].subtasks.forEach(subtask => {
          document.getElementById('popup-subtasks').innerHTML += `<li><input type="checkbox" name="" id=""></input> ${subtask}</li>`;
        })
      }
    });
  });
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