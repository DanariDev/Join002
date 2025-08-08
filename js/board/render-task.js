import { openEditTaskOverlay } from "./edit-task.js";
import { showEditForm, initEditTaskForm } from "./edit-task-form.js";
import { getInitials, getRandomColor } from "../contacts/contact-style.js";
import { db } from "../firebase/firebase-init.js";
import { ref, get, onValue, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { deleteTask } from "./delete-task.js";
import { renderProgressBar } from "./progress-bar.js";

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

/**
 * Gets the selector for the task's board column.
 * @param {string} status - The task status.
 * @returns {string} The CSS selector for the column.
 */
function getTaskCol(status) {
  if (status === "in-progress") return ".in-progress-tasks";
  if (status === "await-feedback") return ".await-tasks";
  if (status === "done") return ".done-tasks";
  return ".to-do-tasks";
}

/**
 * Sets all properties and data on the rendered task card.
 * @param {DocumentFragment} clone - The cloned task template.
 * @param {Object} task - The task object.
 */
function setTaskProps(clone, task) {
  setLabel(clone, task);
  setTaskMainFields(clone, task);
  setPriority(clone, task);
  setProgress(clone, task);
  setTaskInitials(clone, task);
  setCardProps(clone, task);
}

/**
 * Sets main task fields (title, description).
 * @param {DocumentFragment} clone - The cloned task template.
 * @param {Object} task - The task object.
 */
function setTaskMainFields(clone, task) {
  clone.querySelector(".task-title").textContent = task.title || "";
  clone.querySelector(".task-desc").textContent = task.description || "";
}

/**
 * Renders assigned contact initials to the board card.
 * @param {DocumentFragment} clone - The cloned task template.
 * @param {Object} task - The task object.
 */
function setTaskInitials(clone, task) {
  const initialsDiv = clone.querySelector(".assigned-initials-board");
  renderAssignedContacts(task.assignedTo, initialsDiv);
}

/**
 * Sets attributes for the task card (draggable, id).
 * @param {DocumentFragment} clone - The cloned task template.
 * @param {Object} task - The task object.
 */
function setCardProps(clone, task) {
  const card = clone.querySelector(".task-card");
  card.setAttribute("draggable", "true");
  card.dataset.taskId = task.id;
}

/**
 * Sets the label style based on task category.
 * @param {DocumentFragment} clone - The cloned task template.
 * @param {Object} task - The task object.
 */
function setLabel(clone, task) {
  const labelDiv = clone.querySelector(".task-label");
  applyCategoryStyle(labelDiv, task.category);
}

/**
 * Applies the correct style to a category label.
 * @param {HTMLElement} labelEl - The label element.
 * @param {string} category - The task category.
 */
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

/**
 * Sets the priority icon for the task card.
 * @param {DocumentFragment} clone - The cloned task template.
 * @param {Object} task - The task object.
 */
function setPriority(clone, task) {
  const img = clone.querySelector(".priority-img");
  if (task.priority === "urgent") setPrioIcon(img, "urgent");
  else if (task.priority === "medium") setPrioIcon(img, "medium");
  else if (task.priority === "low") setPrioIcon(img, "low");
  else clearPrioIcon(img);
}

/**
 * Sets the icon src/alt for a given priority.
 * @param {HTMLImageElement} img - The image element for the priority icon.
 * @param {string} type - The priority type ("urgent", "medium", "low").
 */
function setPrioIcon(img, type) {
  img.src = `assets/img/${type}-btn-icon.png`;
  img.alt = capitalize(type);
}

/**
 * Clears the priority icon.
 * @param {HTMLImageElement} img - The image element for the priority icon.
 */
function clearPrioIcon(img) {
  img.src = ""; img.alt = "";
}

/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The string to capitalize.
 * @returns {string} The capitalized string.
 */
function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

/**
 * Sets the progress bar and subtask count for the task card.
 * @param {DocumentFragment} clone - The cloned task template.
 * @param {Object} task - The task object.
 */
function setProgress(clone, task) {
  renderProgressBar(task.subtasks, clone);
}

/**
 * Sets up click event listener for task cards to open the overlay.
 */
document.addEventListener("click", onTaskCardClick);

/**
 * Handles click on a task card to open its overlay.
 * @param {Event} e - The click event.
 */
function onTaskCardClick(e) {
  const card = e.target.closest(".task-card");
  if (card) openTaskOverlay(card.dataset.taskId);
}

/**
 * Opens the overlay and fills its content for a given task.
 * @param {string} taskId - The ID of the task.
 */
export function openTaskOverlay(taskId) {
  showTaskOverlay();
  const card = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
  if (!card) return;
  setTaskOverlayContent(card, taskId);
  setTaskOverlayHandlers(taskId);
}

/**
 * Shows the task overlay and disables body scroll.
 */
function showTaskOverlay() {
  document.getElementById("task-overlay").classList.remove("d-none");
  document.getElementById("body").classList.add('overflow-hidden');
}

/**
 * Fills the overlay fields with task data.
 * @param {HTMLElement} card - The task card element.
 * @param {string} taskId - The ID of the task.
 */
function setTaskOverlayContent(card, taskId) {
  fillOverlayMain(card, taskId);
  dueDateGenerate(taskId, formattedDate =>
    setPopupField('popup-due-date', `<b>Due date:</b> <span>${formattedDate}</span>`)
  );
  assignedToGenerate(taskId);
  applyOverlayCategoryStyle();
  subtaskGenerate(taskId);
}

/**
 * Fills main overlay fields (title, description, priority, category).
 * @param {HTMLElement} card - The task card element.
 * @param {string} taskId - The ID of the task.
 */
function fillOverlayMain(card, taskId) {
  setPopupField('popup-category', `<span class="task-label">${card.querySelector(".task-label").textContent}</span>`);
  setPopupField('popup-title', `<h2>${card.querySelector(".task-title").textContent}</h2>`);
  setPopupField('popup-description', `<div>${card.querySelector(".task-desc").textContent || ""}</div>`);
  fillOverlayPrio(card);
}

/**
 * Sets HTML content for a specified popup field.
 * @param {string} id - The ID of the popup field.
 * @param {string} html - The HTML content to set.
 */
function setPopupField(id, html) {
  document.getElementById(id).innerHTML = html;
}

/**
 * Fills the priority information in the overlay.
 * @param {HTMLElement} card - The task card element.
 */
function fillOverlayPrio(card) {
  const prioImg = card.querySelector(".priority-img");
  const prio = prioImg?.alt || "";
  setPopupField('popup-priority', `<b>Priority:</b>
    <div class="prio_spacing">
    <span>${prio}</span>
    <img src="assets/img/${prio.toLowerCase()}-btn-icon.png" alt="">
    </div>`);
}

/**
 * Applies category style to the overlay label.
 */
function applyOverlayCategoryStyle() {
  const labelSpan = document.querySelector("#popup-category .task-label");
  if (labelSpan) applyCategoryStyle(labelSpan, labelSpan.textContent);
}

/**
 * Generates assigned contact initials for the overlay.
 * @param {string} taskId - The ID of the task.
 */
function assignedToGenerate(taskId) {
  const container = document.getElementById("popup-assigned");
  container.innerHTML = "";
  const label = document.createElement("b");
  label.textContent = "Assigned To: ";
  container.appendChild(label);
  const initialGroupDiv = document.createElement("div");
  initialGroupDiv.className = "initial-group";
  container.appendChild(initialGroupDiv);
  const tasksRef = ref(db, 'tasks/' + taskId);
  onValue(tasksRef, snapshot => {
    const taskData = snapshot.val();
    if (taskData && taskData.assignedTo)
      renderAssignedContacts(taskData.assignedTo, initialGroupDiv);
    else
      initialGroupDiv.innerHTML = "<span>None assigned</span>";
  });
}

/**
 * Fills the due date field with a formatted date.
 * @param {string} taskId - The ID of the task.
 * @param {Function} callback - The callback to receive the formatted date.
 */
function dueDateGenerate(taskId, callback) {
  const tasksRef = ref(db, 'tasks/');
  onValue(tasksRef, snapshot => {
    const data = snapshot.val();
    if (data && data[taskId]) {
      const rawDate = data[taskId].dueDate;
      callback(formatDate(rawDate));
    }
  });
}

/**
 * Formats a date string to DD/MM/YYYY format.
 * @param {string} dateString - The raw date string (YYYY-MM-DD).
 * @returns {string} The formatted date string or empty string if invalid.
 */
function formatDate(dateString) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

/**
 * Updates subtask checked status and refreshes UI.
 * @param {string} taskId - The ID of the task.
 */
function subtaskGenerate(taskId) {
  const list = document.getElementById('popup-subtasks');
  list.innerHTML = "";
  const tasksRef = ref(db, 'tasks/' + taskId);
  get(tasksRef).then(snapshot => {
    const task = snapshot.val();
    renderSubtaskList(list, task, taskId);
  });
}

/**
 * Renders the list of subtasks (checkboxes) in the overlay.
 * @param {HTMLElement} list - The HTML element where the subtasks will be rendered.
 * @param {object} task - The task object containing the subtasks array.
 * @param {string} taskId - The id of the parent task.
 */
function renderSubtaskList(list, task, taskId) {
  if (!task || !task.subtasks) {
    list.innerHTML = "<li>No subtasks available</li>";
    return;
  }
  list.innerHTML = task.subtasks.map((st, i) => renderSingleSubtask(st, i, taskId)).join('');
  setSubtaskCheckboxEvents(list, taskId);
}


/**
 * Renders a single subtask as a list item with checkbox.
 * @param {object} subtask - The subtask object.
 * @param {number} index - The index of the subtask in the array.
 * @param {string} taskId - The id of the parent task.
 * @returns {string} - HTML string for the subtask list item.
 */
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


/**
 * Adds change events for subtask checkboxes (to update DB + progress).
 * @param {HTMLElement} list - The parent element containing the subtask checkboxes.
 * @param {string} taskId - The id of the task.
 */
function setSubtaskCheckboxEvents(list, taskId) {
  list.querySelectorAll('.custom-checkbox').forEach((cb, idx) => {
    cb.addEventListener('change', () => handleSubtaskChange(cb, idx, taskId));
  });
}


/**
 * Handles a checkbox change event for a subtask:
 * Updates the subtask's checked status in the database and updates the progress bar/list.
 * @param {HTMLInputElement} cb - The checkbox element.
 * @param {number} idx - The index of the subtask in the list.
 * @param {string} taskId - The id of the parent task.
 */
function handleSubtaskChange(cb, idx, taskId) {
  const tasksRef = ref(db, 'tasks/' + taskId);
  get(tasksRef).then(snap => {
    const freshTask = snap.val();
    if (!freshTask || !freshTask.subtasks || !freshTask.subtasks[idx]) return;
    freshTask.subtasks[idx].checked = cb.checked;
    update(tasksRef, { subtasks: freshTask.subtasks }).then(() => {
      updateProgressBarAndList(freshTask.subtasks, taskId);
    });
  });
}


/**
 * Updates the progress bar and subtask list for a task.
 * @param {Array<Object>} subtasks - Array of subtask objects.
 * @param {string} taskId - The ID of the task.
 */
function updateProgressBarAndList(subtasks, taskId) {
  const card = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
  if (card) renderProgressBar(subtasks, card);
  subtaskGenerate(taskId);
}

/**
 * Sets up handlers for overlay buttons (close, delete, edit).
 * @param {string} taskId - The ID of the task.
 */
function setTaskOverlayHandlers(taskId) {
  setOverlayBtn("overlay-close", () => closeOverlay());
  setOverlayBtn("delete-task-btn", () => deleteTask(taskId));
  setOverlayBtn("edit-task-btn", () => openEdit(taskId));
}

/**
 * Sets the click handler for an overlay button.
 * @param {string} id - The ID of the button.
 * @param {Function} fn - The callback function.
 */
function setOverlayBtn(id, fn) {
  const btn = document.getElementById(id);
  if (btn) btn.onclick = fn;
}

/**
 * Closes the task overlay and re-enables body scroll.
 */
function closeOverlay() {
  document.getElementById("task-overlay").classList.add("d-none");
  document.getElementById("body").classList.remove('overflow-hidden');
}

/**
 * Opens the edit overlay for a task.
 * @param {string} taskId - The ID of the task.
 */
function openEdit(taskId) {
  closeOverlay();
  window.currentEditTaskId = taskId;
  openEditTaskOverlay(taskId);
}

/**
 * Loads and renders assigned contact initials for a task.
 * @param {Array<string>} contactIds - Array of contact IDs.
 * @param {HTMLElement} container - The container for initials.
 */
async function renderAssignedContacts(contactIds, container) {
  if (!contactIds || contactIds.length === 0) {
    container.innerHTML = '';
    return;
  }
  const contacts = await getContactsFromDb();
  const toShow = collectContacts(contactIds, contacts);
  renderInitials(toShow, container);
}

/**
 * Fetches contacts from the database.
 * @returns {Object} The contacts object.
 */
async function getContactsFromDb() {
  const snap = await get(ref(db, "contacts"));
  if (!snap.exists()) return {};
  return snap.val();
}

/**
 * Collects contacts matching the provided IDs.
 * @param {Array<string>} ids - Array of contact IDs.
 * @param {Object} allContacts - All contacts from the database.
 * @returns {Array<Object>} Array of matching contact objects.
 */
function collectContacts(ids, allContacts) {
  let arr = [];
  ids.forEach(id => {
    let c = allContacts[id];
    if (!c) c = findContactByName(id, allContacts);
    if (c) arr.push(c);
  });
  arr.sort((selected, compare)=> selected.name.localeCompare(compare.name));
  return arr;
}

/**
 * Finds a contact by name in the contacts object.
 * @param {string} name - The contact name.
 * @param {Object} allContacts - All contacts from the database.
 * @returns {Object|undefined} The matching contact object or undefined.
 */
function findContactByName(name, allContacts) {
  for (const k in allContacts) {
    if (allContacts[k].name === name) return allContacts[k];
  }
}

/**
 * Renders contact initials in the container.
 * @param {Array<Object>} arr - Array of contact objects.
 * @param {HTMLElement} container - The container for initials.
 */
function renderInitials(arr, container) {
  container.innerHTML = '';
  let max = 3;
  arr.slice(0, max).forEach(c => addBubble(c, container));
  if (arr.length > max) addRestBubble(arr.length - max, container);
}

/**
 * Adds a contact initials bubble to the container.
 * @param {Object} contact - The contact object.
 * @param {HTMLElement} container - The container for initials.
 */
function addBubble(contact, container) {
  const span = document.createElement('span');
  span.className = 'initials-task';
  span.textContent = getInitials(contact.name);
  span.style.backgroundColor = getRandomColor(contact.name);
  container.appendChild(span);
}

/**
 * Adds a "+X" bubble for additional contacts.
 * @param {number} count - The number of additional contacts.
 * @param {HTMLElement} container - The container for initials.
 */
function addRestBubble(count, container) {
  const span = document.createElement('span');
  span.className = 'initials-task initials-extra';
  span.textContent = `+${count}`;
  span.style.backgroundColor = "#878787";
  container.appendChild(span);
}
