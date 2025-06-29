import { db } from "./firebase-config.js";
import { ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { renderPopup } from "./task-overlay.js";
import { loadContacts, init } from "./add-task.js"; // Importiere die Funktionen direkt

/**
 * This function creates a Dom element
 * @param {Object} s -Information of the Dom element
 */
function $(s) {
  return document.querySelector(s);
};

/**
 * This function creates background color for initials
 * @param {string} name -The name of the contact
 * @returns -Gives back a color value
 */
function getColorForName(name) {
  const colors = ['#FF5733', '#33B5FF', '#33FF99', '#FF33EC', '#ffcb20', '#9D33FF', '#33FFDA', '#FF8C33', '#3385FF', '#FF3333'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Loads tasks into the board
 */
function loadTasks() {
  document.getElementById('task-overlay')?.classList.add('d-none');
  const tasksRef = ref(db, 'tasks');
  onValue(tasksRef, (snapshot) => {
    const tasks = snapshot.val();
    if (!tasks) return;
    for (let id in tasks) {
      tasks[id].id = id;
      renderTask(tasks[id]);
    }
    setupDropTargets();
  }, { onlyOnce: true });
};

/**
 * Renders a single task
 * @param {Object} task -Hands over the information of a task
 */
function renderTask(task) {
  const colMap = { todo: '.to-do-tasks', 'in-progress': '.in-progress-tasks', await: '.await-tasks', done: '.done-tasks' };
  const target = $(colMap[task.status] || '.to-do-tasks');
  if (!target) return;
  const template = document.querySelector('#task-template');
  const card = template.content.cloneNode(true).querySelector('.task-card');
  card.dataset.id = task.id;
  card.draggable = true;
  updateTaskCard(card, task);
  setupTaskCardEvents(card, task);
  target.appendChild(card);
  updateTaskLabel(card, task);
};

/**
 * Updates task label based on category
 * @param {Object} card -Hands over the information of the card
 * @param {Object} task -Hands over the information of a task
 */
function updateTaskLabel(card, task) {
  const label = card.querySelector('.task-label');
  const text = label.textContent.trim();
  if (text === 'Technical Task') {
    label.classList.add('green-background');
  } else if (text === 'User Story') {
    label.classList.add('blue-background');
  }
};

/**
 * Updates the task card with task data
 * @param {Object} card -Hands over the information of the card
 * @param {Object} task -Hands over the information of a task
 */
function updateTaskCard(card, task) {
  card.querySelector('.task-label').textContent = task.category;
  card.querySelector('.task-title').textContent = task.title;
  card.querySelector('.task-desc').textContent = task.description;
  const initialsContainer = card.querySelector('.assigned-initials');
  initialsContainer.classList.add('d-flex');
  updateInitials(initialsContainer, task.assignedTo);
  updateSubtaskCount(card, task.subtasks);
  updateProgressBar(card, task.status);
};

/**
 * Updates initials for assigned contacts
 * @param {Object} initialsContainer -Container for initials
 * @param {Array} assignedTo -Array of assigned names
 */
function updateInitials(initialsContainer, assignedTo) {
  if (Array.isArray(assignedTo.sort((a, b) => a.localeCompare(b)))) {
    assignedTo.forEach(name => {
      const initials = name.split(" ").map(part => part[0]?.toUpperCase()).join("");
      const initialsDiv = document.createElement('div');
      initialsDiv.classList.add('initials-task');
      initialsDiv.textContent = initials;
      initialsDiv.style.backgroundColor = getColorForName(name);
      initialsContainer.appendChild(initialsDiv);
    });
  }
};

/**
 * Updates subtask count on card
 * @param {Object} card -Hands over the information of the card
 * @param {Array} subtasks -Array of subtasks
 */
function updateSubtaskCount(card, subtasks) {
  const totalSubtasks = subtasks ? subtasks.length : 0;
  let doneSubtasks = 0;
  if (subtasks) {
    for (let i = 0; i < subtasks.length; i++) {
      if (subtasks[i].done) doneSubtasks++;
    }
  }
  card.querySelector('.task-count').textContent = doneSubtasks + '/' + totalSubtasks;
};

/**
 * Sets up drag and click events for task card
 * @param {Object} card -Hands over the information of the card
 * @param {Object} task -Hands over the information of a task
 */
function setupTaskCardEvents(card, task) {
  card.ondragstart = (e) => {
    e.dataTransfer.setData('text', task.id);
    card.classList.add('dragging');
  };
  card.ondragend = () => card.classList.remove('dragging');
  card.onclick = () => renderPopup(task);
};

/**
 * Sets up drop targets for columns
 */
function setupDropTargets() {
  const columns = document.querySelectorAll('#board .task-column');
  columns.forEach(col => {
    col.ondragover = (e) => { e.preventDefault(); col.classList.add('drag-over'); };
    col.ondragleave = () => col.classList.remove('drag-over');
    col.ondrop = (e) => handleDrop(e, col);
  });
};

/**
 * Handles dropping a task into a new column
 * @param {Object} event -Drag event
 * @param {Object} column -Hands over the information of the column
 */
function handleDrop(event, column) {
  event.preventDefault();
  column.classList.remove('drag-over');
  const id = event.dataTransfer.getData('text');
  const card = document.querySelector(`[data-id='${id}']`);
  const map = { 'to-do-tasks': 'todo', 'in-progress-tasks': 'in-progress', 'await-tasks': 'await', 'done-tasks': 'done' };
  const newStatus = map[column.classList[0]];
  if (!card || !newStatus) return;
  update(ref(db, 'tasks/' + id), { status: newStatus }).then(() => {
    column.appendChild(card);
    updateProgressBar(card, newStatus);
  });
};

/**
 * Updates the progress bar based on status
 * @param {Object} card -Hands over the information of the card
 * @param {string} newStatus -Hands over the status name
 */
function updateProgressBar(card, newStatus) {
  const bar = card.querySelector(".progress-bar");
  bar.className = "progress-bar";
  const statusClass = newStatus === "todo" ? "progress-25" :
                     newStatus === "in-progress" ? "progress-50" :
                     newStatus === "await" ? "progress-75" : "progress-100";
  bar.classList.add(statusClass);
};

loadTasks();
loadEventListeners();

// ADD TASK OVERLAY

/**
 * Loads the add task script
 */
function loadScript() {
  // Nicht mehr benötigt, da direkt importiert
}

/**
 * Loads the task form HTML
 */
async function loadTaskForm() {
  const response = await fetch('add-task.html');
  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const form = doc.getElementById('add-task-form');
  document.getElementById('formContainer').innerHTML = '';
  document.getElementById('formContainer').appendChild(form);
};

/**
 * Initializes the Add Task form with contacts
 */
function initializeAddTaskForm() {
  loadContacts(); // Lädt die Kontakte
  init(); // Initialisiert das Formular
}

/**
 * Opens the Add-Tasks-Overlay
 */
export async function openForm() {
  await loadTaskForm();
  document.getElementById('form-add-task').style.display = 'block';
  document.getElementById('add-task-overlay').style.display = 'flex';
  initializeAddTaskForm(); // Initialisiert das Formular nach dem Laden
};

/**
 * Closes the add-tasks-overlay
 */
function closeForm() {
  const taskOverlay = document.getElementById('task-overlay');
  const addTaskOverlay = document.getElementById('add-task-overlay');
  if (taskOverlay?.classList.contains('d-flex')) {
    taskOverlay.classList.replace('d-flex', 'd-none');
  }
  if (addTaskOverlay?.style.display === 'flex') {
    addTaskOverlay.style.display = 'none';
    document.getElementById('form-add-task').style.display = 'none';
  }
};

/**
 * Sets up event listeners for the board
 */
function loadEventListeners() {
  document.getElementById('closeFormModal').addEventListener('click', () => closeForm());
  document.getElementById('add-task-button').addEventListener('click', openForm);
  document.querySelectorAll('.add-task-btn').forEach(btn => btn.addEventListener('click', openForm));
};

/**
 * Prevents a link (a-tag) from opening
 * @param {object} event -PointerEvent gives back
 */
function handleClick(event) {
  event.preventDefault();
};

/**
 * Handles media query changes for Add-Task link
 * @param {object} event -MediaQueryList gives back
 */
function handleMediaQueryChange(event) {
  const responsiveLinkElements = document.querySelectorAll("#responsive-link-add-task");
  responsiveLinkElements.forEach(element => {
    if (event.matches) element.addEventListener("click", handleClick);
    else element.removeEventListener("click", handleClick);
  });
};

handleMediaQueryChange(window.matchMedia("(min-width: 801px)"));