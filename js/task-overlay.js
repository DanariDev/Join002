import { db } from "./firebase-config.js";
import {
  ref,
  update,
  remove,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

import { openForm } from "./board.js";

initOverlayCloseHandler();

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


async function loadContactOptions(assignedTo) {
  const container = document.createElement('div');
  container.id = 'edit-assigned';
  container.className = 'assigned-list';
  const assignedList = Array.isArray(assignedTo)
    ? assignedTo
    : typeof assignedTo === 'string' && assignedTo.trim()
      ? [assignedTo.trim()] : [];
  assignedList.forEach((name) => {
    const initials = name
      .split(" ")
      .map(part => part[0]?.toUpperCase())
      .join("");
    const item = document.createElement('div');
    item.classList.add('assigned-item', 'display-flex');
    const initialsDiv = document.createElement('div');
    initialsDiv.classList.add('initials-task-overlay');
    initialsDiv.style.backgroundColor = getColorForName(name);
    initialsDiv.textContent = initials;
    const nameDiv = document.createElement('div');
    nameDiv.textContent = name;
    nameDiv.classList.add('full-name');
    item.appendChild(initialsDiv);
    item.appendChild(nameDiv);
    container.appendChild(item);
  });

  const wrapper = document.getElementById('popup-assigned');
  wrapper.innerHTML = `<p><span class="overlay-key">Assigned to:</span></p>`;
  wrapper.appendChild(container);
};

function taskPopupHtmlTemplate(task) {
  const formattedDate = task.dueDate.split('-').reverse().join('/');
  const selectedPriority = task.priority.charAt(0).toUpperCase() + task.priority.slice(1).toLowerCase();
  document.getElementById('popup-title').innerHTML = `<h3 id="edit-title" class="title-input">${task.title}</h3>`;
  document.getElementById('popup-description').innerHTML = `<p id="edit-description">${task.description}</p>`;
  document.getElementById('popup-due-date').innerHTML = `<p id="edit-due-date" class="tab-size"><span class="overlay-key">Due date:</span> ${formattedDate}</p>`;
  document.getElementById('popup-category').innerHTML = `<p class="task-label-overlay">${task.category}</p>`;
  loadContactOptions(task.assignedTo || []);
  document.getElementById('popup-priority').innerHTML = `<p><span class="overlay-key">Priority:</span> ${selectedPriority}</p>`;

}

function createPopupSubtask(task) {
  const subtaskList = document.getElementById('popup-subtasks');
  subtaskList.innerHTML = "";
  if (task.subtasks && task.subtasks.length > 0) {
    task.subtasks.forEach((subtask, i) => {
      const li = document.createElement('li');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = subtask.done;
      checkbox.onchange = () => toggleSubtask(task.id, i, checkbox.checked);
      const span = document.createElement('span');
      span.textContent = subtask.text;
      span.classList.add('subtask-overlay-list');
      li.appendChild(checkbox);
      li.append(" ");
      li.appendChild(span);
      subtaskList.appendChild(li);
    });
  };
}

export function renderPopup(task) {
  const overlay = document.getElementById('task-overlay');
  overlay.classList.replace('d-none', 'd-flex');
  overlay.dataset.taskId = task.id;

  taskPopupHtmlTemplate(task)
  createPopupSubtask(task)
  getLabelColor()

  document.getElementById('overlay-close').addEventListener('click', closePopup);
  document.getElementById('delete-task-btn').onclick = () => deleteTask(task.id);

  document.getElementById('edit-task-btn').onclick = () => editTask(task.id);
};

function getLabelColor() {
  const label = document.querySelector('.task-label-overlay');
  const text = label.textContent.trim();
  if (text === 'Technical Task') {
    label.classList.add('green-background');
  } else if (text === 'User Story') {
    label.classList.add('blue-background');
  };
};

function closePopup() {
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

function initOverlayCloseHandler() {
  document.addEventListener('click', function (event) {
    const taskOverlay = document.getElementById('task-overlay');
    const addTaskOverlay = document.getElementById('add-task-overlay');
    const taskContent = document.querySelector('#task-overlay .overlay-content');
    const formContent = document.querySelector('#add-task-overlay #form-add-task');

    if (
      taskOverlay?.classList.contains('d-flex') &&
      !taskContent?.contains(event.target) &&
      taskOverlay.contains(event.target)
    ) {
      closePopup();
    }

    if (
      addTaskOverlay?.style.display === 'flex' &&
      !formContent?.contains(event.target) &&
      addTaskOverlay.contains(event.target)
    ) {
      closePopup();
    }
  });
};

function toggleSubtask(taskId, index, checked) {
  const taskRef = ref(db, `tasks/${taskId}/subtasks/${index}`);
  update(taskRef, { done: checked });
};

function updateSubtaskText(taskId, index, text) {
  const taskRef = ref(db, `tasks/${taskId}/subtasks/${index}`);
  update(taskRef, { text: text });
};


function deleteTask(taskId) {
  if (confirm('Do you really want to delete this task?')) {
    remove(ref(db, `tasks/${taskId}`)).then(() => {
      closePopup();
      document.querySelector(`[data-id='${taskId}']`)?.remove();
    });
  };
};







async function editTask(taskId) {
  document.getElementById('task-overlay').classList.replace('d-none', 'd-flex');
  await openForm();

  const title = document.getElementById('edit-title').innerHTML.trim();
  const description = document.getElementById('edit-description').innerHTML.trim();

  const dueDate = document.getElementById('edit-due-date').textContent;
  const dateText = dueDate.replace('Due date:', '').trim();
  const [day, month, year] = dateText.split('/');
  const isoDate = `${year}-${month}-${day}`;

  const priority = document.getElementById('popup-priority').textContent;
  const priorityText = priority.replace('Priority:', '').trim();

  document.getElementById('title').value = title;
  document.getElementById('description').value = description;
  document.getElementById('date').value = isoDate;

  switch (priorityText) {
    case 'Urgent':
      document.getElementById('urgent-btn').classList.add('urgent-btn-active');
      break;
    case 'Medium':
      document.getElementById('medium-btn').classList.add('medium-btn-active');
      break;
    case 'Low':
      document.getElementById('low-btn').classList.add('low-btn-active');
      break;
    default:
      break;
  }

  const nameElements = document.querySelectorAll('.full-name');
  const selectedNames = Array.from(nameElements).map(el => el.textContent.trim());

  document.getElementById('contacts-selected').innerHTML = '';
  for (let index = 0; index < selectedNames.length; index++) {
    document.getElementById('contacts-selected').innerHTML += `
      <div class="contact-selected">${selectedNames[index]}</div>`;
  }

  await loadContactOptions();

  const checkboxes = document.querySelectorAll('input[type="checkbox"][data-name]');
  checkboxes.forEach(checkbox => {
    const contactName = checkbox.dataset.name.trim();
    console.log(contactName);
    checkbox.checked = selectedNames.includes(contactName);
  });

  console.log("TITLE:", title,
    "DESC:", description,
    "DATE:", dateText,
    "PRIO:", priorityText,
    "ISO.DATE:", isoDate,
    "SELECTED.NAMES:", selectedNames);
};