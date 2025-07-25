export function renderTask(task) {
  const template = document.getElementById('task-template');
  const clone = template.content.cloneNode(true);
  setTaskProps(clone, task);
  let col = '.to-do-tasks';
  if (task.status === 'in-progress') col = '.in-progress-tasks';
  else if (task.status === 'await-feedback') col = '.await-tasks';
  else if (task.status === 'done') col = '.done-tasks';
  document.querySelector(col).appendChild(clone);
}

function setTaskProps(clone, task) {
  setLabel(clone, task);
  clone.querySelector('.task-title').textContent = task.title || '';
  clone.querySelector('.task-desc').textContent = task.description || '';
  setPriority(clone, task);
  setProgress(clone, task);
  clone.querySelector('.task-card').setAttribute('draggable', 'true');
  clone.querySelector('.task-card').dataset.taskId = task.id;
}

function setLabel(clone, task) {
  const labelDiv = clone.querySelector('.task-label');
  if (task.category === "Technical Task") {
    labelDiv.textContent = "Technical Task";
    labelDiv.style.background = "#00c7a3";
  } else if (task.category === "User Story") {
    labelDiv.textContent = "User Story";
    labelDiv.style.background = "#0038ff";
  } else labelDiv.textContent = "";
  labelDiv.style.color = "white";
  labelDiv.style.padding = "2px 14px";
  labelDiv.style.borderRadius = "8px";
  labelDiv.style.fontWeight = "bold";
  labelDiv.style.fontSize = "14px";
}
function setPriority(clone, task) {
  const img = clone.querySelector('.priority-img');
  if (task.priority === "urgent") {
    img.src = "assets/img/urgent-btn-icon.png";
    img.alt = "Urgent";
  } else if (task.priority === "medium") {
    img.src = "assets/img/medium-btn-icon.png";
    img.alt = "Medium";
  } else if (task.priority === "low") {
    img.src = "assets/img/low-btn-icon.png";
    img.alt = "Low";
  } else {
    img.src = "";
    img.alt = "";
  }
}
function setProgress(clone, task) {
  const bar = clone.querySelector('.progress-bar');
  const count = clone.querySelector('.task-count');
  if (task.subtasks && task.subtasks.length > 0) {
    const completed = task.subtasks.filter(st => st.completed).length;
    const percent = Math.round((completed / task.subtasks.length) * 100);
    bar.style.width = percent + '%';
    count.textContent = `${completed} / ${task.subtasks.length}`;
  } else {
    bar.style.width = '0%';
    count.textContent = '0 / 0';
  }
}
