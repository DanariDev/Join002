
import { db } from "./firebase-config.js";
import { ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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

loadTasks();
