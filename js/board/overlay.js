import { db } from '../firebase/firebase-init.js';
import { ref, push, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

let subtasks = [];
let selectedContacts = [];
let allContacts = [];

export function initOverlay() {

  document.querySelectorAll('.add-task-btn, #add-task-button').forEach(btn => {
    btn.addEventListener('click', async function (e) {
      e.preventDefault();
      document.getElementById('add-task-overlay').classList.remove('d-none');
      document.getElementById('form-add-task').style.display = 'flex';

      // Prioritäts-Buttons richtig zurücksetzen
      ['urgent-btn', 'medium-btn', 'low-btn'].forEach(id =>
        document.getElementById(id).classList.remove('selected', 'urgent-btn-active', 'medium-btn-active', 'low-btn-active')
      );
      // Medium als Standard aktivieren
      document.getElementById('medium-btn').classList.add('selected', 'medium-btn-active');

      allContacts = await loadAllContacts();
      selectedContacts = [];
      renderContactsDropdown();
      renderSelectedContacts();
      closeContactsDropdown();
    });
  });

  document.getElementById('closeFormModal').addEventListener('click', function () {
    document.getElementById('add-task-overlay').classList.add('d-none');
    document.getElementById('form-add-task').style.display = 'none';
    subtasks = [];
    selectedContacts = [];
    renderSubtasks();
    renderSelectedContacts();
    closeContactsDropdown();
  });

  document.getElementById('add-task-overlay').addEventListener('click', function (e) {
    if (e.target === this) {
      this.classList.add('d-none');
      document.getElementById('form-add-task').style.display = 'none';
      subtasks = [];
      selectedContacts = [];
      renderSubtasks();
      renderSelectedContacts();
      closeContactsDropdown();
    }
  });

  // --- PRIORITÄTS-BUTTONS ---
  ['urgent-btn', 'medium-btn', 'low-btn'].forEach(btnId => {
    document.getElementById(btnId).addEventListener('click', function () {
      // Alle Prioritäts-Buttons deaktivieren
      ['urgent-btn', 'medium-btn', 'low-btn'].forEach(id => {
        document.getElementById(id).classList.remove('selected', 'urgent-btn-active', 'medium-btn-active', 'low-btn-active');
      });

      // Nur geklickten Button aktivieren mit richtiger Farbe
      if (btnId === 'urgent-btn') this.classList.add('selected', 'urgent-btn-active');
      if (btnId === 'medium-btn') this.classList.add('selected', 'medium-btn-active');
      if (btnId === 'low-btn') this.classList.add('selected', 'low-btn-active');
    });
  });

  // --- Kontakte-Dropdown-Logik ---
  const contactSelect = document.getElementById('contacts-selected');
  const contactDropdown = document.getElementById('contacts-dropdown-list');

  contactSelect.addEventListener('click', function(e) {
    e.stopPropagation();
    contactDropdown.style.display = contactDropdown.style.display === 'block' ? 'none' : 'block';
  });

  document.addEventListener('click', function(e) {
    if (!contactDropdown.contains(e.target) && e.target !== contactSelect) {
      contactDropdown.style.display = 'none';
    }
  });

  closeContactsDropdown();
}

// Hilfsfunktion, um Dropdown zu schließen
function closeContactsDropdown() {
  const dropdown = document.getElementById('contacts-dropdown-list');
  if (dropdown) dropdown.style.display = 'none';
}

// -------- SUBTASKS --------
function renderSubtasks() {
  const list = document.getElementById('subtasks-list');
  list.innerHTML = '';
  subtasks.forEach((subtask, idx) => {
    const txt = subtask.text || subtask;
    const li = document.createElement('li');
    li.classList.add('subtask-item');
    li.innerHTML = `
      <span class="subtask-text">${txt}</span>
      <img class="subtask-delete" src="assets/img/delete.png" alt="Delete" data-idx="${idx}" style="width:16px;cursor:pointer;">
    `;
    list.appendChild(li);
  });
}

function addSubtask() {
  const input = document.getElementById('subtask-input');
  const value = input.value.trim();
  if (!value) return;
  subtasks.push(value);
  input.value = '';
  renderSubtasks();
}

document.getElementById('subtask-input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    addSubtask();
    e.preventDefault();
  }
});
document.querySelector('.subtask-button').addEventListener('click', addSubtask);

document.getElementById('subtasks-list').addEventListener('click', function(e) {
  if (e.target.classList.contains('subtask-delete')) {
    const idx = e.target.getAttribute('data-idx');
    subtasks.splice(idx, 1);
    renderSubtasks();
  }
});

document.getElementById('closeFormModal').addEventListener('click', function () {
  subtasks = [];
  renderSubtasks();
});

// -------- Kontakte --------
async function loadAllContacts() {
  const contactsRef = ref(db, "contacts");
  const snapshot = await get(contactsRef);
  if (!snapshot.exists()) return [];
  return Object.entries(snapshot.val()).map(([id, data]) => ({
    id,
    ...data,
  }));
}

function renderContactsDropdown() {
  const list = document.getElementById('contacts-dropdown-list');
  list.innerHTML = '';
  allContacts.forEach(contact => {
    const div = document.createElement('div');
    div.className = 'contact-option';
    div.dataset.contactId = contact.id;
    div.textContent = contact.name + ' (' + contact.email + ')';
    if (selectedContacts.some(c => c.id === contact.id)) {
      div.classList.add('selected-contact');
    }
    div.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleContact(contact);
    });
    list.appendChild(div);
  });
}

function toggleContact(contact) {
  const idx = selectedContacts.findIndex(c => c.id === contact.id);
  if (idx === -1) {
    selectedContacts.push(contact);
  } else {
    selectedContacts.splice(idx, 1);
  }
  renderContactsDropdown();
  renderSelectedContacts();
}

function renderSelectedContacts() {
  const div = document.getElementById('selected-contact-insignias');
  div.innerHTML = '';
  selectedContacts.forEach(c => {
    const span = document.createElement('span');
    span.className = 'contact-insignia';
    span.textContent = c.name.split(' ').map(w => w[0]).join('').toUpperCase();
    div.appendChild(span);
  });
}

// -------- Task erstellen --------
document.getElementById('create-btn').addEventListener('click', function (e) {
  e.preventDefault();

  const title = document.getElementById('task-title').value.trim();
  const description = document.getElementById('task-description').value.trim();
  const dueDate = document.getElementById('task-date').value;
  const category = document.getElementById('task-category').value;

  let priority = 'medium';
  if (document.getElementById('urgent-btn').classList.contains('selected')) priority = 'urgent';
  if (document.getElementById('low-btn').classList.contains('selected')) priority = 'low';

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
      subtasks = [];
      selectedContacts = [];
      renderSubtasks();
      renderSelectedContacts();
      closeContactsDropdown();
      document.getElementById('add-task-overlay').classList.add('d-none');
    })
    .catch(error => {
      alert('Fehler beim Speichern: ' + error.message);
    });
});
