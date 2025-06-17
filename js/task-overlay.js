import { db } from "./firebase-config.js";
import {
  ref,
  update,
  remove,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";


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








function $(s) {
  return document.querySelector(s);
};


function loadContactOptions(assignedTo) {
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

  const wrapper = $('#popup-assigned');
  wrapper.innerHTML = `<p><span class="overlay-key">Assigned to:</span></p>`;
  wrapper.appendChild(container);
};

function taskPopupHtmlTemplate(task) {

  const selectedCategory = task.category;
  const formattedDate = task.dueDate.split('-').reverse().join('/');
  const selectedPriority = task.priority.charAt(0).toUpperCase() + task.priority.slice(1).toLowerCase();
  document.getElementById('popup-title').innerHTML = `<h3 id="edit-title" class="title-input">${task.title}</h3>`;
  document.getElementById('popup-description').innerHTML = `<p id="edit-description" class="description-input">${task.description}</p>`;
  document.getElementById('popup-due-date').innerHTML = `<p id="edit-due-date" class="tab-size"><span class="overlay-key">Due date:</span> ${formattedDate}</p>`;
  document.getElementById('popup-category').innerHTML = `<p class="task-label-overlay">${selectedCategory}</p>`;
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
  document.getElementById('edit-task-btn').textContent = 'Edit';
};

function getLabelColor() {
  const label = document.querySelector('.task-label-overlay');
  const text = label.textContent.trim();
  if (text === 'Technical Task') {
    label.classList.add('green-background');
  } else if (text === 'User Story') {
    label.classList.add('blue-background');
  };
}

function closePopup() {
  const overlay = document.getElementById('task-overlay');
  overlay.classList.replace('d-flex', 'd-none');
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

function editTask(taskId) {

};
