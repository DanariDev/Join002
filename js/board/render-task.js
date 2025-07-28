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

document.addEventListener('click', function (e) {
  const card = e.target.closest('.task-card');
  if (card) {
    const taskId = card.dataset.taskId;
    openTaskOverlay(taskId);
  }
});

function openTaskOverlay(taskId) {
  document.getElementById('task-overlay').classList.remove('d-none');
  const card = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
  if (!card) return;
  const category = card.querySelector('.task-label').textContent;
  const title = card.querySelector('.task-title').textContent;
  const desc = card.querySelector('.task-desc').textContent;
  const prioImg = card.querySelector('.priority-img');
  const prio = prioImg?.alt || '';
  document.getElementById('popup-category').innerHTML = `
    <span class="task-label" style="
      background:${category==='User Story' ? '#0038ff':'#00c7a3'};
      color:#fff;padding:5px 18px;border-radius:10px;font-weight:bold;display:inline-block;">
      ${category}
    </span>`;
  document.getElementById('popup-title').innerHTML = `
    <h2 style="font-size:2.8rem;margin:20px 0 10px 0;font-weight:900;">${title}</h2>`;
  document.getElementById('popup-description').innerHTML = `
    <div style="margin-bottom:10px;">${desc || ''}</div>`;
  document.getElementById('popup-due-date').innerHTML = `<b>Due date:</b> <span>-</span>`;
  document.getElementById('popup-priority').innerHTML = `<b>Priority:</b>
    <span style="color:${prio==='Urgent'?'#c93939':prio==='Medium'?'#ffaa00':'#5dc43e'}">${prio}</span>`;
  document.getElementById('overlay-close').onclick = function() {
    document.getElementById('task-overlay').classList.add('d-none');
  };
}
