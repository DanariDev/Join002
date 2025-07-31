// board-add-task-overlay.js

import { db } from '../firebase/firebase-init.js';
import { ref, push, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// States
let subtasks = [];
let selectedContacts = [];
let allContacts = [];

export function initBoardOverlay() {
  // Overlay öffnen: Alle Plus- und Add Task-Buttons auf dem Board
  document.querySelectorAll('.add-task-btn, #add-task-button').forEach(btn => {
    btn.addEventListener('click', async function (e) {
      e.preventDefault();
      openBoardOverlay();
    });
  });

  // Overlay schließen ("X" und Cancel)
  document.getElementById('closeFormModal').onclick = closeBoardOverlay;
  document.getElementById('clear-btn').onclick = function (e) {
    e.preventDefault();
    resetBoardOverlay();
    closeBoardOverlay();
  };

  // Klick auf den Overlay-Hintergrund schließt das Overlay
  document.getElementById('add-task-overlay').addEventListener('click', function (e) {
    if (e.target === this) closeBoardOverlay();
  });

  // Prio-Buttons
  ['urgent-btn', 'medium-btn', 'low-btn'].forEach(btnId => {
    document.getElementById(btnId).addEventListener('click', function () {
      ['urgent-btn', 'medium-btn', 'low-btn'].forEach(id =>
        document.getElementById(id).classList.remove('selected', 'urgent-btn-active', 'medium-btn-active', 'low-btn-active')
      );
      if (btnId === 'urgent-btn') this.classList.add('selected', 'urgent-btn-active');
      if (btnId === 'medium-btn') this.classList.add('selected', 'medium-btn-active');
      if (btnId === 'low-btn') this.classList.add('selected', 'low-btn-active');
    });
  });

  // Kontakte Dropdown öffnen/schließen
  const contactSelect = document.getElementById('contacts-selected');
  const contactDropdown = document.getElementById('contacts-dropdown-list');
  contactSelect.onclick = function (e) {
    e.stopPropagation();
    contactDropdown.style.display = (contactDropdown.style.display === 'block') ? 'none' : 'block';
  };
  document.addEventListener('click', function (e) {
    if (!contactDropdown.contains(e.target) && e.target !== contactSelect) {
      contactDropdown.style.display = 'none';
    }
  });

  // Subtasks
  document.getElementById('subtask-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      addBoardSubtask();
      e.preventDefault();
    }
  });
  document.querySelector('.subtask-button').addEventListener('click', addBoardSubtask);
  document.getElementById('subtasks-list').addEventListener('click', function (e) {
    if (e.target.classList.contains('subtask-delete')) {
      const idx = e.target.getAttribute('data-idx');
      subtasks.splice(idx, 1);
      renderBoardSubtasks();
    }
  });

  // Task anlegen
  document.getElementById('create-btn').onclick = createBoardTask;
}

async function openBoardOverlay() {
  document.getElementById('add-task-overlay').classList.remove('d-none');
  document.getElementById('form-add-task').style.display = 'flex';

  // Kontakte laden
  allContacts = await loadAllBoardContacts();
  selectedContacts = [];
  renderBoardContactsDropdown();
  renderBoardSelectedContacts();
  document.getElementById('contacts-dropdown-list').style.display = 'none';

  // Prio & Subtasks zurücksetzen
  ['urgent-btn', 'medium-btn', 'low-btn'].forEach(id =>
    document.getElementById(id).classList.remove('selected', 'urgent-btn-active', 'medium-btn-active', 'low-btn-active')
  );
  document.getElementById('medium-btn').classList.add('selected', 'medium-btn-active');

  // Felder resetten
  resetBoardOverlay();
}

function resetBoardOverlay() {
  // Alle Inputs leeren
  document.getElementById('task-title').value = '';
  document.getElementById('task-description').value = '';
  document.getElementById('task-date').value = '';
  document.getElementById('task-category').selectedIndex = 0;

  // Prio zurücksetzen
  ['urgent-btn', 'medium-btn', 'low-btn'].forEach(id =>
    document.getElementById(id).classList.remove('selected', 'urgent-btn-active', 'medium-btn-active', 'low-btn-active')
  );
  document.getElementById('medium-btn').classList.add('selected', 'medium-btn-active');

  // Kontakte/Subtasks zurücksetzen
  selectedContacts = [];
  renderBoardContactsDropdown();
  renderBoardSelectedContacts();

  subtasks = [];
  renderBoardSubtasks();
}

function closeBoardOverlay() {
  document.getElementById('add-task-overlay').classList.add('d-none');
  document.getElementById('form-add-task').style.display = 'none';
}

// --- Kontakte / Chips ---
async function loadAllBoardContacts() {
  const contactsRef = ref(db, "contacts");
  const snapshot = await get(contactsRef);
  if (!snapshot.exists()) return [];
  return Object.entries(snapshot.val()).map(([id, data]) => ({
    id,
    ...data,
  }));
}
function renderBoardContactsDropdown() {
  const list = document.getElementById('contacts-dropdown-list');
  list.innerHTML = '';
  allContacts.forEach(contact => {
    const div = document.createElement('div');
    div.className = 'contact-option';
    div.dataset.contactId = contact.id;
    div.textContent = contact.name + (contact.email ? ` (${contact.email})` : '');
    if (selectedContacts.some(c => c.id === contact.id)) {
      div.classList.add('selected-contact');
    }
    div.onclick = function (e) {
      e.stopPropagation();
      toggleBoardContact(contact);
    };
    list.appendChild(div);
  });
}
function toggleBoardContact(contact) {
  const idx = selectedContacts.findIndex(c => c.id === contact.id);
  if (idx === -1) {
    selectedContacts.push(contact);
  } else {
    selectedContacts.splice(idx, 1);
  }
  renderBoardContactsDropdown();
  renderBoardSelectedContacts();
}
function renderBoardSelectedContacts() {
  const div = document.getElementById('selected-contact-insignias');
  div.innerHTML = '';
  selectedContacts.forEach(c => {
    const span = document.createElement('span');
    span.className = 'contact-insignia';
    span.textContent = c.name.split(' ').map(w => w[0]).join('').toUpperCase();
    div.appendChild(span);
  });
}

// --- Subtasks ---
function renderBoardSubtasks() {
  const list = document.getElementById('subtasks-list');
  list.innerHTML = '';
  subtasks.forEach((subtask, idx) => {
    const txt = typeof subtask === 'string' ? subtask : subtask.text;
    const li = document.createElement('li');
    li.className = 'subtask-item';
    li.innerHTML = `<span class="subtask-text">${txt}</span>
      <img class="subtask-delete" src="assets/img/delete.png" alt="Delete" data-idx="${idx}" style="width:16px;cursor:pointer;">`;
    list.appendChild(li);
  });
}
function addBoardSubtask() {
  const input = document.getElementById('subtask-input');
  const value = input.value.trim();
  if (!value) return;
  subtasks.push(value);
  input.value = '';
  renderBoardSubtasks();
}

// --- Task anlegen (wie Add Task) ---
function createBoardTask(e) {
  e.preventDefault();

  const title = document.getElementById('task-title').value.trim();
  const description = document.getElementById('task-description').value.trim();
  const dueDate = document.getElementById('task-date').value;
  const category = document.getElementById('task-category').value;

  let priority = 'medium';
  if (document.getElementById('urgent-btn').classList.contains('selected')) priority = 'urgent';
  if (document.getElementById('low-btn').classList.contains('selected')) priority = 'low';

  if (!title || !dueDate || !category) {
    alert('Bitte fülle alle Pflichtfelder aus (Titel, Fälligkeitsdatum, Kategorie).');
    return;
  }

  const task = {
    title,
    description,
    dueDate,
    category,
    priority,
    subtasks: subtasks,
    assignedTo: selectedContacts.map(c => c.id),
    status: 'to-do',
  };

  const tasksRef = ref(db, 'tasks/');
  push(tasksRef, task)
    .then(() => {
      resetBoardOverlay();
      closeBoardOverlay();
    })
    .catch(error => {
      alert('Fehler beim Speichern: ' + error.message);
    });
}

// --- Initialisierung aufrufen (im board/main.js z.B.) ---
initBoardOverlay();
