import { db } from "./firebase-config.js";
import { ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { renderPopup } from "./task-overlay.js";


function $(s) {
  return document.querySelector(s);
};


function getColorForName(name) {
  const colors = [
    '#FF5733', '#33B5FF', '#33FF99', '#FF33EC', '#ffcb20',
    '#9D33FF', '#33FFDA', '#FF8C33', '#3385FF', '#FF3333'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  };
  return colors[Math.abs(hash) % colors.length];
};


function loadTasks() {
  document.getElementById('task-overlay')?.classList.add('d-none');
  const tasksRef = ref(db, 'tasks');
  onValue(tasksRef, function (snapshot) {
    const tasks = snapshot.val();
    if (!tasks) return;
    for (let id in tasks) {
      tasks[id].id = id;
      renderTask(tasks[id]);
    };
    setupDropTargets();
  }, { onlyOnce: true });
};


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
  const label = card.querySelector('.task-label');
  const text = label.textContent.trim();
  if (text === 'Technical Task') {
    label.classList.add('green-background');
  } else if (text === 'User Story') {
    label.classList.add('blue-background');
  };
};


function updateTaskCard(card, task) {
  card.querySelector('.task-label').textContent = task.category;
  card.querySelector('.task-title').textContent = task.title;
  card.querySelector('.task-desc').textContent = task.description;
  const initialsContainer = card.querySelector('.assigned-initials');
  initialsContainer.classList.add('display-flex');
  if (Array.isArray(task.assignedTo)) {
    task.assignedTo.forEach(name => {
      const initials = name
        .split(" ")
        .map(part => part[0]?.toUpperCase())
        .join("");
      const initialsDiv = document.createElement('div');
      initialsDiv.classList.add('initials-task');
      initialsDiv.textContent = initials;
      initialsDiv.style.backgroundColor = getColorForName(name);
      initialsContainer.appendChild(initialsDiv);
    });
  };
  const totalSubtasks = task.subtasks ? task.subtasks.length : 0;
  let doneSubtasks = 0;
  if (task.subtasks) {
    for (let i = 0; i < task.subtasks.length; i++) {
      if (task.subtasks[i].done) doneSubtasks++;
    };
  };
  card.querySelector('.task-count').textContent = doneSubtasks + '/' + totalSubtasks;
  const bar = card.querySelector('.progress-bar');
  let statusClass = task.status == 'todo' ? 'progress-25' : task.status == 'in-progress' ? 'progress-50' : task.status == 'await' ? 'progress-75' : 'progress-100';
  bar.classList.add(statusClass);
};


function setupTaskCardEvents(card, task) {
  card.ondragstart = function (e) {
    e.dataTransfer.setData('text', task.id);
    card.classList.add('dragging');
  };
  card.ondragend = function () {
    card.classList.remove('dragging');
  };
  card.onclick = () => renderPopup(task);
};


function setupDropTargets() {
  const columns = document.querySelectorAll('#board .task-column');
  for (let col of columns) {
    col.ondragover = function (element) {
      element.preventDefault();
      col.classList.add('drag-over');
    };
    col.ondragleave = function () {
      col.classList.remove('drag-over');
    };
    col.ondrop = function (element) {
      handleDrop(element, col);
    };
  };
};


function handleDrop(task, column) {
  task.preventDefault();
  column.classList.remove('drag-over');
  let id = task.dataTransfer.getData('text');
  let card = document.querySelector(`[data-id='${id}']`);
  let map = { 'to-do-tasks': 'todo', 'in-progress-tasks': 'in-progress', 'await-tasks': 'await', 'done-tasks': 'done' };
  let newStatus = map[column.classList[0]];
  if (!card || !newStatus) return;
  update(ref(db, 'tasks/' + id), { status: newStatus }).then(function () {
    column.appendChild(card);
    updateProgressBar(card, newStatus);
  });
};


function updateProgressBar(card, newStatus) {
  let bar = card.querySelector('.progress-bar');
  bar.className = 'progress-bar';
  let statusClass = newStatus == 'todo' ? 'progress-25' : newStatus == 'in-progress' ? 'progress-50' : newStatus == 'await' ? 'progress-75' : 'progress-100';
  bar.classList.add(statusClass);
};


loadTasks();
