import { fetchContacts } from "./fetch-tasks.js";

export function openTaskOverlay(task) {
  document.getElementById('edit-task-overlay').classList.remove('d-none');
  setOverlayCategory(task.category);
  setOverlayTitle(task.title);
  setOverlayDescription(task.description);
  setOverlayDueDate(task.dueDate);
  setOverlayPriority(task.priority);
  setOverlayAssigned(task.assignedTo);
  setOverlaySubtasks(task.subtasks);
  initContactsDropdown(task.assignedTo || []);
  initSubtaskInput();
  initPriorityButtons();
}

export function closeTaskOverlay() {
  document.getElementById('edit-task-overlay').classList.add('d-none');
}

function setOverlayCategory(category) {
  const el = document.getElementById('popup-category');
  el.textContent = category || '';
  el.className = 'task-label';
  if (category === "Technical Task") el.classList.add('green-background');
  if (category === "User Story") el.classList.add('blue-background');
}

function setOverlayTitle(title) {
  document.getElementById('popup-title').textContent = title || '';
}

function setOverlayDescription(desc) {
  document.getElementById('popup-description').textContent = desc || '';
}

function setOverlayDueDate(date) {
  const el = document.getElementById('popup-due-date');
  el.textContent = date ? `Due: ${date}` : '';
  el.className = 'overlay-key';
}

function setOverlayPriority(priority) {
  const el = document.getElementById('popup-priority');
  el.innerHTML = '';
  if (priority) {
    let icon = "";
    if (priority === "urgent") icon = '<img src="assets/img/urgent-btn-icon.png" alt="Urgent">';
    if (priority === "medium") icon = '<img src="assets/img/medium-btn-icon.png" alt="Medium">';
    if (priority === "low") icon = '<img src="assets/img/low-btn-icon.png" alt="Low">';
    el.innerHTML = `${icon} <span>${priority.charAt(0).toUpperCase() + priority.slice(1)}</span>`;
  }
  el.className = 'overlay-key';
}

function setOverlayAssigned(assigned) {
  const el = document.getElementById('popup-assigned');
  el.innerHTML = '';
  if (Array.isArray(assigned)) {
    assigned.forEach(person => {
      const span = document.createElement('span');
      span.textContent = getInitials(person);
      span.className = 'assigned-initials assigned-initials-board';
      el.appendChild(span);
    });
  }
}

function setOverlaySubtasks(subtasks) {
  const list = document.getElementById('popup-subtasks');
  list.innerHTML = '';
  if (Array.isArray(subtasks)) {
    subtasks.forEach(sub => {
      const li = document.createElement('li');
      li.textContent = sub;
      list.appendChild(li);
    });
  }
}

function getInitials(name) {
  if (!name) return "";
  return name.split(' ').map(w => w[0]?.toUpperCase() || '').join('').substring(0,2);
}

function initContactsDropdown(selectedContacts) {
  const dropdown = document.getElementById('editing-contacts-selected');
  const dropdownList = document.querySelector('.contacts-dropdown-list') || document.createElement('div');
  dropdownList.className = 'contacts-dropdown-list';
  dropdown.appendChild(dropdownList);
  fetchContacts(contacts => {
    dropdownList.innerHTML = '';
    contacts.forEach(contact => {
      const div = document.createElement('div');
      div.className = 'form-selected-contact';
      div.innerHTML = `<span class="full-name">${contact.name}</span><input type="checkbox" ${selectedContacts.includes(contact.name) ? 'checked' : ''}>`;
      div.querySelector('input').onchange = () => toggleContactSelection(contact.name, selectedContacts);
      dropdownList.appendChild(div);
    });
    dropdown.onclick = () => dropdownList.classList.toggle('show');
  });
}

function toggleContactSelection(name, selectedContacts) {
  const index = selectedContacts.indexOf(name);
  if (index === -1) selectedContacts.push(name);
  else selectedContacts.splice(index, 1);
  updateSelectedContactsDisplay(selectedContacts);
}

function updateSelectedContactsDisplay(selectedContacts) {
  const container = document.getElementById('selected-editing-contact-insignias');
  container.innerHTML = '';
  selectedContacts.forEach(name => {
    const span = document.createElement('span');
    span.textContent = getInitials(name);
    span.className = 'assigned-initials';
    container.appendChild(span);
  });
}

function initSubtaskInput() {
  const input = document.getElementById('editing-subtask-input');
  const button = document.querySelector('.subtask-button');
  const list = document.getElementById('editing-subtask-list');
  button.addEventListener('click', () => {
    if (input.value.trim()) {
      const li = document.createElement('li');
      li.textContent = input.value.trim();
      list.appendChild(li);
      input.value = '';
    }
  });
}

function initPriorityButtons() {
  const buttons = document.querySelectorAll('#editing-priority-buttons .prio-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });
}

const closeBtn = document.getElementById('overlay-close');
if (closeBtn) closeBtn.addEventListener('click', closeTaskOverlay);