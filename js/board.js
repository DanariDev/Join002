import { db } from "./firebase-config.js";
import { ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { renderPopup } from "./task-overlay.js";
import { addTaskOverlayLoad } from "./add-task.js";
import { renderInitials } from "./utils.js";
import { setupTaskCardEvents, setupDropTargets } from "./dragDrop.js";

/**
 * Utility function to select a DOM element
 * @param {string} selector - CSS selector for the DOM element
 * @returns {HTMLElement|null} - Selected DOM element or null
 */
function $(selector) {
  return document.querySelector(selector);
}

/**
 * Loads tasks from Firebase and renders them on the board
 */
function loadTasks() {
  document.getElementById('task-overlay')?.classList.add('d-none');
  const tasksRef = ref(db, 'tasks');
  onValue(tasksRef, (snapshot) => {
    const tasks = snapshot.val();
    if (!tasks) {
      addPlaceholders();
      return;
    }
    for (let id in tasks) {
      tasks[id].id = id;
      renderTask(tasks[id]);
    }
    setupDropTargets();
    addPlaceholders();
  }, { onlyOnce: true });
}

/**
 * Renders a single task card in the appropriate column
 * @param {Object} task - Task data including id, status, category, etc.
 */
function renderTask(task) {
  const colMap = {
    todo: '.to-do-tasks',
    'in-progress': '.in-progress-tasks',
    await: '.await-tasks',
    done: '.done-tasks'
  };
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
  addPlaceholders();
}

/**
 * Updates the task label with appropriate styling based on category
 * @param {HTMLElement} card - Task card element
 * @param {Object} task - Task data
 */
function updateTaskLabel(card, task) {
  const label = card.querySelector('.task-label');
  const text = label.textContent.trim();
  if (text === 'Technical Task') {
    label.classList.add('green-background');
  } else if (text === 'User Story') {
    label.classList.add('blue-background');
  }
}

/**
 * Updates the task card with task data including title, description, priority, and subtasks
 * @param {HTMLElement} card - Task card element
 * @param {Object} task - Task data
 */
function updateTaskCard(card, task) {
  card.querySelector('.task-label').textContent = task.category;
  card.querySelector('.task-title').textContent = task.title;
  card.querySelector('.task-desc').textContent = task.description;
  const initialsContainer = card.querySelector('.assigned-initials');
  if (task.priority === 'low') card.querySelector('.priority-img').setAttribute('src', './assets/img/low-btn-icon.png');
  if (task.priority === 'medium') card.querySelector('.priority-img').setAttribute('src', './assets/img/medium-btn-icon.png');
  if (task.priority === 'urgent') card.querySelector('.priority-img').setAttribute('src', './assets/img/urgent-btn-icon.png');
  renderInitials(initialsContainer, task.assignedTo);
  updateSubtaskCount(card, task.subtasks);
  updateProgressBar(card, task.subtasks);
}

/**
 * Updates the subtask count and visibility of progress bar
 * @param {HTMLElement} card - Task card element
 * @param {Array} subtasks - Array of subtasks
 */
function updateSubtaskCount(card, subtasks) {
  const totalSubtasks = subtasks ? subtasks.length : 0;
  let doneSubtasks = 0;
  if (subtasks) {
    for (let i = 0; i < subtasks.length; i++) {
      if (subtasks[i].done) doneSubtasks++;
    }
  }
  card.querySelector('.task-count').textContent = `${doneSubtasks}/${totalSubtasks} Subtasks`;
  if (doneSubtasks <= 0) card.querySelector('.progress-bar-container').classList.add('d-none');
  else card.querySelector('.progress-bar-container').classList.remove('d-none');
  if (totalSubtasks <= 0) card.querySelector('.progress-bar-task-conter-div').classList.add('d-none');
  else card.querySelector('.progress-bar-task-conter-div').classList.remove('d-none');
}

/**
 * Adds placeholders to empty columns
 */
export function addPlaceholders() {
  const columns = document.querySelectorAll('.task-column');
  columns.forEach(column => {
    const placeholder = column.querySelector('.placeholder');
    const taskCards = column.querySelectorAll('.task-card');
    if (taskCards.length > 0 && placeholder) {
      placeholder.remove();
    }
    if (taskCards.length === 0 && !placeholder) {
      const newPlaceholder = document.createElement('div');
      newPlaceholder.className = 'placeholder';
      newPlaceholder.innerText = 'No tasks To do';
      column.appendChild(newPlaceholder);
    }
  });
}

/**
 * Updates the progress bar based on subtask completion
 * @param {HTMLElement} card - Task card element
 * @param {Array} subtasks - Array of subtasks
 */
function updateProgressBar(card, subtasks) {
  const bar = card.querySelector('.progress-bar');
  bar.className = 'progress-bar';
  if (!Array.isArray(subtasks) || subtasks.length === 0) {
    bar.style.width = '0%';
    return;
  }
  const total = subtasks.length;
  const done = subtasks.filter(st => st.done).length;
  const percentage = Math.round((done / total) * 100);
  bar.style.width = `${percentage}%`;
}

/**
 * Loads the task form HTML for the add-task overlay
 */
async function loadTaskForm() {
  try {
    const response = await fetch('add-task.html');
    if (!response.ok) throw new Error(`Failed to fetch add-task.html: ${response.statusText}`);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const form = doc.getElementById('add-task-form');
    document.getElementById('formContainer').innerHTML = '';
    document.getElementById('formContainer').appendChild(form);
    loadEventListeners();
  } catch (error) {
    console.error('Error loading task form:', error);
  }
}

/**
 * Opens the Add-Task overlay
 */
export async function openForm() {
  await loadTaskForm();
  document.getElementById('form-add-task').style.display = 'block';
  document.getElementById('add-task-overlay').style.display = 'flex';
  addTaskOverlayLoad();
}

/**
 * Closes the add-task and task overlays
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
}

/**
 * Sets up event listeners for the board
 */
function loadEventListeners() {
  document.getElementById('closeFormModal').addEventListener('click', () => closeForm());
  document.getElementById('add-task-button').addEventListener('click', openForm);
  document.querySelectorAll('.add-task-btn').forEach(btn => btn.addEventListener('click', openForm));
}

/**
 * Prevents a link (a-tag) from opening
 * @param {Event} event - PointerEvent
 */
function handleClick(event) {
  event.preventDefault();
}

/**
 * Handles media query changes for Add-Task link
 * @param {MediaQueryList} event - MediaQueryList event
 */
function handleMediaQueryChange(event) {
  const responsiveLinkElements = document.querySelectorAll('#responsive-link-add-task');
  responsiveLinkElements.forEach(element => {
    if (event.matches) element.addEventListener('click', handleClick);
    else element.removeEventListener('click', handleClick);
  });
}

// Initialize tasks and event listeners
loadTasks();
loadEventListeners();
handleMediaQueryChange(window.matchMedia('(min-width: 801px)'));

// Show confirmation window if a task was saved
if (localStorage.getItem('wasSavedTask') === 'true') {
  document.getElementById('confirmation-window').classList.remove('d-none');
  setTimeout(() => {
    document.getElementById('confirmation-window').classList.add('d-none');
  }, 2000);
  localStorage.removeItem('wasSavedTask');
}