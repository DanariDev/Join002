import { db } from './firebase-config.js';
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


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
  })
};

export function addNewSubtask() {
  const input = document.getElementById('subtask');
  const text = input?.value.trim();
  if (text) {
    subtasks.push({ text, done: 'false' });
    input.value = "";
    renderSubtasks();
  }
};

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
  })
};

async function loadContacts() {
  const snap = await getDocs(collection(db, 'contacts'));
  contacts = snap.docs.map(doc => doc.data());
  populateContactsDropdown();
};


// Noch zu lang
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
    await addDoc(collection(db, 'tasks'), task);
    alert("Aufgabe erfolgreich gespeichert!");
    document.getElementById('add-task-form').reset();
    subtasks = [];
    renderSubtasks();
    updateCreateTaskBtn();
    updatePriorityButtons()
  } catch (error) {
    console.error("Fehler beim Speichern der Aufgabe:", error);
    alert("Fehler beim Speichern. Bitte versuche es erneut.");
  }
};

function checkFilledForm() {
  ['#title', '#date', '#category', '#assigned-to'].forEach(selector => {
    document.querySelector(selector).addEventListener('input', updateCreateTaskBtn);
  });
};

function updateCreateTaskBtn() {
  const title = getValue('#title');
  const date = getValue('#date');
  const category = getValue('#category');
  const assignedTo = getValue('#assigned-to');
  const allFilled = title && date && category && assignedTo;
  createBtn.disabled = !allFilled;
  createBtn.classList.toggle('disabled', !allFilled);
};

// Noch zu lang
function updatePriorityButtons() {
  const buttons = [
    {
      id: "urgent-btn",
      class: "urgent-btn-active",
      defaultImg: "assets/img/urgent-btn-icon.png",
      activeImg: "assets/img/urgent-btn-icon-hover.png"
    },
    {
      id: "medium-btn",
      class: "medium-btn-active",
      defaultImg: "assets/img/medium-btn-icon.png",
      activeImg: "assets/img/medium-btn-icon-hover.png"
    },
    {
      id: "low-btn",
      class: "low-btn-active",
      defaultImg: "assets/img/low-btn-icon.png",
      activeImg: "assets/img/low-btn-icon-hover.png"
    }
  ];

  buttons.forEach(btn => {
    const array = document.getElementById(btn.id);
    array.addEventListener('click', () => {
      buttons.forEach(b => {
        const otherBtn = document.getElementById(b.id);
        otherBtn.classList.remove(b.class);
        const img = otherBtn.querySelector('img');
        if (img) img.src = b.defaultImg;
      });

      array.classList.add(btn.class);
      const img = array.querySelector('img');
      if (img) img.src = btn.activeImg;
    });
  });
};

function togglePriorityBtnUrgent() {
  document.getElementById('urgent-btn').addEventListener('mouseover', function () {
    const img = this.querySelector('img');
    if (!this.classList.contains('urgent-btn-active')) {
      img.src = 'assets/img/urgent-btn-icon-hover.png';
    }
  });
  document.getElementById('urgent-btn').addEventListener('mouseout', function () {
    const img = this.querySelector('img');
    if (!this.classList.contains('urgent-btn-active')) {
      img.src = 'assets/img/urgent-btn-icon.png';
    }
  })
};

function togglePriorityBtnMedium() {
  document.getElementById('medium-btn').addEventListener('mouseover', function () {
    const img = this.querySelector('img');
    if (!this.classList.contains('medium-btn-active')) {
      img.src = 'assets/img/medium-btn-icon-hover.png';
    }
  });
  document.getElementById('medium-btn').addEventListener('mouseout', function () {
    const img = this.querySelector('img');
    if (!this.classList.contains('medium-btn-active')) {
      img.src = 'assets/img/medium-btn-icon.png';
    }
  })
};

function togglePriorityBtnLow() {
  document.getElementById('low-btn').addEventListener('mouseover', function () {
    const img = this.querySelector('img');
    if (!this.classList.contains('low-btn-active')) {
      img.src = 'assets/img/low-btn-icon-hover.png';
    }
  });
  document.getElementById('low-btn').addEventListener('mouseout', function () {
    const img = this.querySelector('img');
    if (!this.classList.contains('low-btn-active')) {
      img.src = 'assets/img/low-btn-icon.png';
    }
  })
};

function init() {
  createBtn.disabled = true;
  createBtn.classList.add("disabled");
  document.getElementById('add-task-form').addEventListener('submit', createTask);
  document.querySelector('.subtask-button').addEventListener('click', addNewSubtask);
  document.getElementById('clear-btn').addEventListener('click', () => {
    createBtn.disabled = true;
    createBtn.classList.add('disabled');
  })
};

init()
loadContacts();
updatePriorityButtons();
togglePriorityBtnUrgent()
togglePriorityBtnMedium()
togglePriorityBtnLow()
checkFilledForm()