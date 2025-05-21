import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export async function loadTasks() {
  try {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    querySnapshot.forEach(doc => {
      const task = doc.data();
      renderTask(task);
    });
  } catch (error) {
    console.error("Fehler beim Laden der Aufgaben:", error);
  }
}

let groupedContacts = [];

function renderTask(task) {

  const subtasksHTML = task.subtasks?.map(s => `<li>${s.text}</li>`).join('') || '';
  const doneCount = task.subtasks?.filter(s => s.done === 'true').length || 0;
  const totalCount = task.subtasks?.length || 0;
  const progressText = `${doneCount}/${totalCount}`;

  const containerSelector = {
    todo: '.to-do-tasks',
    "in-progress": '.in-progress-tasks',
    await: '.await-tasks',
    done: '.done-tasks'
  }[task.status || 'todo'];

  const column = document.querySelector(containerSelector);
  if (!column) return;

  const taskCard = document.createElement('div');
  taskCard.className = 'task-card';
  console.log(`${task.subtasks}`);

  taskCard.innerHTML = `
  <div class="task-label label-${task.category}">${task.category}</div>
    <h4 class="task-title">${task.title}</h4>
    <p class="task-desc">${task.description}</p>

<div class="progress-bar-container">
            <div class="progress-bar progress-100"></div>
          </div>

          <div class="">${task.assignedTo}</div>

    <p class="d-none">Due: ${task.dueDate}</p>
    <p class="d-none">Priority: ${task.priority}</p>
     <ul class="d-none">${subtasksHTML}</ul>
     <div class="task-count">${progressText}</div>

  `;


  column.appendChild(taskCard);
}

loadTasks();
