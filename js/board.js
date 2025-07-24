import { db } from './firebase/firebase-init.js';
import { ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const tasksRef = ref(db, 'tasks/');

onValue(tasksRef, (snapshot) => {
  const data = snapshot.val();

  
  document.querySelector('.to-do-tasks').innerHTML = '';
  document.querySelector('.in-progress-tasks').innerHTML = '';
  document.querySelector('.await-tasks').innerHTML = '';
  document.querySelector('.done-tasks').innerHTML = '';

  if (data) {
    
    Object.entries(data).forEach(([id, task]) => {
      task.id = id;
      renderTask(task);
    });
  }

  
  setupDragAndDrop();
});


function renderTask(task) {
  console.log(task); 

  const template = document.getElementById('task-template');
  const clone = template.content.cloneNode(true);

  
  const taskCard = clone.querySelector('.task-card');
  taskCard.setAttribute('draggable', 'true');
  taskCard.dataset.taskId = task.id;

  
  const labelDiv = clone.querySelector('.task-label');
  if (task.category === "Technical Task") {
    labelDiv.textContent = "Technical Task";
    labelDiv.style.background = "#00c7a3"; 
    labelDiv.style.color = "white";
  } else if (task.category === "User Story") {
    labelDiv.textContent = "User Story";
    labelDiv.style.background = "#0038ff"; 
    labelDiv.style.color = "white";
  } else {
    labelDiv.textContent = "";
  }
  labelDiv.style.padding = "2px 14px";
  labelDiv.style.borderRadius = "8px";
  labelDiv.style.fontWeight = "bold";
  labelDiv.style.fontSize = "14px";

  
  clone.querySelector('.task-title').textContent = task.title || '';
  clone.querySelector('.task-desc').textContent = task.description || '';

  
  const priorityImg = clone.querySelector('.priority-img');
  if (task.priority === "urgent") {
    priorityImg.src = "assets/img/urgent-btn-icon.png";
    priorityImg.alt = "Urgent";
  } else if (task.priority === "medium") {
    priorityImg.src = "assets/img/medium-btn-icon.png";
    priorityImg.alt = "Medium";
  } else if (task.priority === "low") {
    priorityImg.src = "assets/img/low-btn-icon.png";
    priorityImg.alt = "Low";
  } else {
    priorityImg.src = "";
    priorityImg.alt = "";
  }

  
  const progressBar = clone.querySelector('.progress-bar');
  const taskCount = clone.querySelector('.task-count');
  if (task.subtasks && task.subtasks.length > 0) {
    const completedCount = task.subtasks.filter(st => st.completed).length;
    const percent = Math.round((completedCount / task.subtasks.length) * 100);
    progressBar.style.width = percent + '%';
    taskCount.textContent = `${completedCount} / ${task.subtasks.length}`;
  } else {
    progressBar.style.width = '0%';
    taskCount.textContent = '0 / 0';
  }

  
  let col = '.to-do-tasks';
  if (task.status === 'in-progress') col = '.in-progress-tasks';
  else if (task.status === 'await-feedback') col = '.await-tasks';
  else if (task.status === 'done') col = '.done-tasks';

  document.querySelector(col).appendChild(clone);
}

function setupDragAndDrop() {
  let draggedTask = null;

  
  document.querySelectorAll('.task-card').forEach(task => {
    task.addEventListener('dragstart', e => {
      draggedTask = e.target;
      e.dataTransfer.effectAllowed = 'move';
    });
  });

  
  document.querySelectorAll('.task-column').forEach(column => {
    column.addEventListener('dragover', e => {
      e.preventDefault(); 
      e.dataTransfer.dropEffect = 'move';
    });

    column.addEventListener('drop', e => {
      e.preventDefault();
      if (!draggedTask) return;

      
      column.appendChild(draggedTask);

      
      let newStatus;
      if (column.classList.contains('to-do-tasks')) newStatus = 'to-do';
      else if (column.classList.contains('in-progress-tasks')) newStatus = 'in-progress';
      else if (column.classList.contains('await-tasks')) newStatus = 'await-feedback';
      else if (column.classList.contains('done-tasks')) newStatus = 'done';

      
      const taskId = draggedTask.dataset.taskId;

      
      const updates = {};
      updates['/tasks/' + taskId + '/status'] = newStatus;

      update(ref(db), updates)
        .then(() => console.log('Task-Status wurde aktualisiert:', newStatus))
        .catch(error => {
          console.error('Fehler beim Aktualisieren:', error);
          alert('Fehler beim Aktualisieren des Status.');
        });

      draggedTask = null;
    });
  });
}
