import { openEditTaskOverlay } from "./edit-task.js";
import { getInitials, getRandomColor } from "../contacts/contact-style.js";
import { deleteTask } from "./delete-task.js";
import { renderProgressBar } from "./progress-bar.js";
import { api } from "../api/client.js";

/**
 * Renders a single task into its board column.
 * @param {Object} task - The task object to render.
 */
export function renderTask(task) {
  const template = document.getElementById("task-template");
  const clone = template.content.cloneNode(true);
  setTaskProps(clone, task);
  const col = getTaskCol(task.status);
  document.querySelector(col).appendChild(clone);
}

function getTaskCol(status) {
  if (status === "in-progress") return ".in-progress-tasks";
  if (status === "await-feedback") return ".await-tasks";
  if (status === "done") return ".done-tasks";
  return ".to-do-tasks";
}

function setTaskProps(clone, task) {
  setLabel(clone, task);
  setTaskMainFields(clone, task);
  setPriority(clone, task);
  setProgress(clone, task);
  setTaskInitials(clone, task);
  setCardProps(clone, task);
}

function setTaskMainFields(clone, task) {
  clone.querySelector(".task-title").textContent = task.title || "";
  clone.querySelector(".task-desc").textContent = task.description || "";
}

function setTaskInitials(clone, task) {
  const initialsDiv = clone.querySelector(".assigned-initials-board");
  renderAssignedContacts(task.assignedTo, initialsDiv);
}

function setCardProps(clone, task) {
  const card = clone.querySelector(".task-card");
  card.setAttribute("draggable", "true");
  card.dataset.taskId = task.id;
}

function setLabel(clone, task) {
  const labelDiv = clone.querySelector(".task-label");
  applyCategoryStyle(labelDiv, task.category);
}

function applyCategoryStyle(labelEl, category) {
  labelEl.classList.remove("label-technical", "label-user");
  if (category === "Technical Task") {
    labelEl.textContent = "Technical Task";
    labelEl.classList.add("label-technical");
  } else if (category === "User Story") {
    labelEl.textContent = "User Story";
    labelEl.classList.add("label-user");
  } else {
    labelEl.textContent = "";
  }
}

function setPriority(clone, task) {
  const img = clone.querySelector(".priority-img");
  if (task.priority === "urgent") setPrioIcon(img, "urgent");
  else if (task.priority === "medium") setPrioIcon(img, "medium");
  else if (task.priority === "low") setPrioIcon(img, "low");
  else clearPrioIcon(img);
}

function setPrioIcon(img, type) {
  img.src = `assets/img/${type}-btn-icon.png`;
  img.alt = capitalize(type);
}

function clearPrioIcon(img) {
  img.src = ""; img.alt = "";
}

function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

function setProgress(clone, task) {
  renderProgressBar(task.subtasks, clone);
}

document.addEventListener("click", onTaskCardClick);

function onTaskCardClick(e) {
  const card = e.target.closest(".task-card");
  if (card) openTaskOverlay(card.dataset.taskId);
}

export function openTaskOverlay(taskId) {
  showTaskOverlay();
  const card = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
  if (!card) return;
  setTaskOverlayContent(card, taskId);
  setTaskOverlayHandlers(taskId);
}

function showTaskOverlay() {
  document.getElementById("task-overlay").classList.remove("d-none");
  document.getElementById("body").classList.add('overflow-hidden');
}

function setTaskOverlayContent(card, taskId) {
  fillOverlayMain(card, taskId);
  const task = getTask(taskId);
  const formattedDate = formatDate(task?.dueDate);
  setPopupField('popup-due-date', `<b>Due date:</b> <span>${formattedDate}</span>`);
  assignedToGenerate(task);
  applyOverlayCategoryStyle();
  subtaskGenerate(taskId);
}

function fillOverlayMain(card, taskId) {
  setPopupField('popup-category', `<span class="task-label">${card.querySelector(".task-label").textContent}</span>`);
  setPopupField('popup-title', `<h2>${card.querySelector(".task-title").textContent}</h2>`);
  setPopupField('popup-description', `<div>${card.querySelector(".task-desc").textContent || ""}</div>`);
  fillOverlayPrio(card);
}

function setPopupField(id, html) {
  document.getElementById(id).innerHTML = html;
}

function fillOverlayPrio(card) {
  const prioImg = card.querySelector(".priority-img");
  const prio = prioImg?.alt || "";
  setPopupField('popup-priority', `<b>Priority:</b>
    <div class="prio_spacing">
    <span>${prio}</span>
    <img src="assets/img/${prio.toLowerCase()}-btn-icon.png" alt="">
    </div>`);
}

function applyOverlayCategoryStyle() {
  const labelSpan = document.querySelector("#popup-category .task-label");
  if (labelSpan) applyCategoryStyle(labelSpan, labelSpan.textContent);
}

async function assignedToGenerate(task) {
  const container = document.getElementById("popup-assigned");
  container.innerHTML = "";
  const label = document.createElement("b");
  label.textContent = "Assigned To: ";
  container.appendChild(label);
  const initialGroupDiv = document.createElement("div");
  initialGroupDiv.className = "initial-group";
  container.appendChild(initialGroupDiv);
  if (task && task.assignedTo && task.assignedTo.length)
    renderAssignedContacts(task.assignedTo, initialGroupDiv);
  else
    initialGroupDiv.innerHTML = "<span>None assigned</span>";
}

function formatDate(dateString) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

function subtaskGenerate(taskId) {
  const list = document.getElementById('popup-subtasks');
  list.innerHTML = "";
  const task = getTask(taskId);
  renderSubtaskList(list, task, taskId);
}

function renderSubtaskList(list, task, taskId) {
  if (!task || !task.subtasks) {
    list.innerHTML = "<li>No subtasks available</li>";
    return;
  }
  list.innerHTML = task.subtasks.map((st, i) => renderSingleSubtask(st, i, taskId)).join('');
  setSubtaskCheckboxEvents(list, taskId);
}

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

function setSubtaskCheckboxEvents(list, taskId) {
  list.querySelectorAll('.custom-checkbox').forEach((cb, idx) => {
    cb.addEventListener('change', () => handleSubtaskChange(cb, idx, taskId));
  });
}

function handleSubtaskChange(cb, idx, taskId) {
  const task = getTask(taskId);
  if (!task || !task.subtasks || !task.subtasks[idx]) return;
  task.subtasks[idx].checked = cb.checked ? "true" : "false";
  updateTask(taskId, task).then(() => {
    updateProgressBarAndList(task.subtasks, taskId);
  });
}

function updateProgressBarAndList(subtasks, taskId) {
  const card = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
  if (card) renderProgressBar(subtasks, card);
  subtaskGenerate(taskId);
}

function setTaskOverlayHandlers(taskId) {
  setOverlayBtn("overlay-close", () => closeOverlay());
  setOverlayBtn("delete-task-btn", () => deleteTask(taskId));
  setOverlayBtn("edit-task-btn", () => openEdit(taskId));
}

function setOverlayBtn(id, fn) {
  const btn = document.getElementById(id);
  if (btn) btn.onclick = fn;
}

function closeOverlay() {
  document.getElementById("task-overlay").classList.add("d-none");
  document.getElementById("body").classList.remove('overflow-hidden');
}

function openEdit(taskId) {
  closeOverlay();
  window.currentEditTaskId = taskId;
  openEditTaskOverlay(taskId);
}

async function renderAssignedContacts(contactIds, container) {
  if (!contactIds || contactIds.length === 0) {
    container.innerHTML = '';
    return;
  }
  const contacts = await getContacts();
  const toShow = collectContacts(contactIds, contacts);
  renderInitials(toShow, container);
}

async function getContacts() {
  if (window.contactsById) return window.contactsById;
  const { contacts } = await api.getContacts();
  window.contactsById = Object.fromEntries((contacts || []).map(c => [String(c.id), c]));
  return window.contactsById;
}

function collectContacts(ids, allContacts) {
  let arr = [];
  ids.forEach(id => {
    let c = allContacts[String(id)];
    if (!c) c = findContactByName(id, allContacts);
    if (c) arr.push(c);
  });
  arr.sort((selected, compare)=> selected.name.localeCompare(compare.name));
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
  container.appendChild(span);
}

function getTask(taskId) {
  return window.tasksById ? window.tasksById[String(taskId)] : null;
}

async function updateTask(taskId, task) {
  await api.updateTask(taskId, {
    title: task.title,
    description: task.description,
    category: task.category,
    dueDate: task.dueDate,
    priority: task.priority,
    status: task.status,
    assignedTo: task.assignedTo || [],
    subtasks: task.subtasks || []
  });
}
