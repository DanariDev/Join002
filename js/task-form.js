
import { db, auth } from "./firebase-config.js";
import { ref, onValue, update, push, get, child } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

function $(s) {
  return document.querySelector(s);
}

function loadTasks() {
  const tasksRef = ref(db, 'tasks');
  onValue(tasksRef, (snapshot) => {
    const tasks = snapshot.val();
    if (!tasks) return;
    Object.entries(tasks).forEach(([id, t]) => {
      t.id = id;
      renderTask(t);
    });
    setupDropTargets();
  });
}

function renderTask(t) {
  const colMap = {
    todo: '.to-do-tasks',
    'in-progress': '.in-progress-tasks',
    await: '.await-tasks',
    done: '.done-tasks'
  };
  const target = $(colMap[t.status || 'todo']);
  if (!target) return;

  const tpl = document.querySelector('#task-template');
  const c = tpl.content.cloneNode(true).querySelector('.task-card');

  c.dataset.id = t.id;
  c.draggable = true;

  c.querySelector('.task-label').textContent = t.category;
  c.querySelector('.task-title').textContent = t.title;
  c.querySelector('.task-desc').textContent = t.description;
  c.querySelector('.task-count').textContent = `${t.subtasks?.length || 0}/${t.subtasks?.length || 0}`;

  const bar = c.querySelector('.progress-bar');
  const statusClass = {
    'todo': 'progress-25',
    'in-progress': 'progress-50',
    'await': 'progress-75',
    'done': 'progress-100'
  }[t.status || 'todo'];
  bar.classList.add(statusClass);

  c.ondragstart = e => {
    e.dataTransfer.setData("text", t.id);
    c.classList.add('dragging');
  };

  c.ondragend = () => c.classList.remove('dragging');

  target.appendChild(c);
}

function setupDropTargets() {
  document.querySelectorAll('.board > div').forEach(col => {
    col.ondragover = e => {
      e.preventDefault();
      col.classList.add('drag-over');
    };
    col.ondragleave = () => col.classList.remove('drag-over');
    col.ondrop = e => handleDrop(e, col);
  });
}

function handleDrop(e, col) {
  e.preventDefault();
  col.classList.remove('drag-over');

  const id = e.dataTransfer.getData('text');
  const card = document.querySelector(`[data-id="${id}"]`);
  const map = {
    'to-do-tasks': 'todo',
    'in-progress-tasks': 'in-progress',
    'await-tasks': 'await',
    'done-tasks': 'done'
  };
  const newStatus = map[col.classList[0]];
  if (!card || !newStatus) return;

  update(ref(db, `tasks/${id}`), { status: newStatus }).then(() => {
    col.appendChild(card);
    const bar = card.querySelector('.progress-bar');
    bar.className = 'progress-bar';
    const statusClass = {
      'todo': 'progress-25',
      'in-progress': 'progress-50',
      'await': 'progress-75',
      'done': 'progress-100'
    }[newStatus];
    bar.classList.add(statusClass);
  });
}

// === TASK FORM ===
const createBtn = document.getElementById('create-task-btn');
let subtasks = [];
let contacts = [];

function getValue(selector) {
  const element = document.querySelector(selector);
  return element ? element.value.trim() : "";
}

function getPriority() {
  if (document.querySelector('.urgent-btn.active')) return 'urgent';
  if (document.querySelector('.medium-btn.active')) return 'medium';
  if (document.querySelector('.low-btn.active')) return 'low';
  return 'medium';
}

function renderSubtasks() {
  const list = document.getElementById('subtask-list');
  list.innerHTML = "";
  subtasks.forEach(t => {
    const li = document.createElement('li');
    li.textContent = t.text;
    list.appendChild(li);
  });
}

export function addNewSubtask() {
  const input = document.getElementById('subtask');
  const text = input?.value.trim();
  if (text) {
    subtasks.push({ text, done: false });
    input.value = "";
    renderSubtasks();
  }
}

function populateContactsDropdown() {
  const select = document.getElementById('assigned-to');
  const placeholder = document.createElement('option');
  placeholder.textContent = "Select contacts to assign";
  placeholder.disabled = true;
  placeholder.selected = true;
  placeholder.hidden = true;
  select.appendChild(placeholder);
  contacts.forEach(c => {
    const option = document.createElement('option');
    option.value = c.id || c.name;
    option.textContent = c.name;
    select.appendChild(option);
  });
}

async function loadContacts() {
  const snapshot = await get(ref(db, 'contacts'));
  const data = snapshot.val();
  contacts = data ? Object.values(data) : [];
  populateContactsDropdown();
}

async function createTask(event) {
  event.preventDefault();
  const task = {
    title: getValue('#title'),
    description: getValue('#description'),
    dueDate: getValue('#date'),
    category: getValue('#category'),
    assignedTo: getValue('#assigned-to'),
    priority: getPriority(),
    subtasks: subtasks,
    status: "todo"
  };

  if (!task.title || !task.dueDate || !task.category || !task.assignedTo) {
    alert("Bitte fülle alle Pflichtfelder aus!");
    return;
  }

  try {
    await push(ref(db, 'tasks'), task);
    alert("Aufgabe erfolgreich gespeichert!");
    document.getElementById('add-task-form').reset();
    subtasks = [];
    renderSubtasks();
    updateCreateTaskBtn();
    updatePriorityButtons();
  } catch (error) {
    console.error("Fehler beim Speichern der Aufgabe:", error);
    alert("Fehler beim Speichern. Bitte versuche es erneut.");
  }
}

function checkFilledForm() {
  ['#title', '#date', '#category', '#assigned-to'].forEach(selector => {
    document.querySelector(selector).addEventListener('input', updateCreateTaskBtn);
  });
}

function updateCreateTaskBtn() {
  const title = getValue('#title');
  const date = getValue('#date');
  const category = getValue('#category');
  const assignedTo = getValue('#assigned-to');
  const allFilled = title && date && category && assignedTo;
  createBtn.disabled = !allFilled;
  createBtn.classList.toggle('disabled', !allFilled);
}

function init() {
  createBtn.disabled = true;
  createBtn.classList.add("disabled");
  document.getElementById('add-task-form').addEventListener('submit', createTask);
  document.querySelector('.subtask-button').addEventListener('click', addNewSubtask);
  document.getElementById('clear-btn').addEventListener('click', () => {
    createBtn.disabled = true;
    createBtn.classList.add('disabled');
  });
}

init();
loadContacts();
updatePriorityButtons();
togglePriorityBtnUrgent();
togglePriorityBtnMedium();
togglePriorityBtnLow();
checkFilledForm();
