
import { db } from './firebase-config.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';


async function loadTasksFromFirestore() {
    const tasksCol = collection(db, 'Aufgaben');
    const tasksSnapshot = await getDocs(tasksCol);
    const tasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    tasks.forEach(renderTaskToColumn);
}


 * @param { Object } task
    */
function renderTaskToColumn(task) {
    const column = document.querySelector(`[data-status="${task.status}"]`);
    if (!column) return;

    const card = document.createElement('div');
    card.classList.add('task-card');

    card.innerHTML = `
    <div class="task-label ${task.category === 'Technical Task' ? 'label-technical' : 'label-user-story'}">${task.category}</div>
    <div class="task-title">${task.title}</div>
    <div class="task-desc">${task.description}</div>
    <div class="progress-bar-container">
      <div class="progress-bar progress-${getProgressPercent(task)}"></div>
    </div>
    <div class="task-footer">
      <div class="avatar-group">
        ${(task.assignedTo || []).map(a => `<div class="avatar">${a}</div>`).join('')}
      </div>
      <div class="task-count">${task.doneSubtasks || 0}/${task.totalSubtasks || 0}</div>
    </div>
  `;

    column.appendChild(card);
}


 * @param { Object } task
    * @returns { number }
 */
function getProgressPercent(task) {
    if (!task.totalSubtasks || task.totalSubtasks === 0) return 0;
    const percent = (task.doneSubtasks / task.totalSubtasks) * 100;
    if (percent === 100) return 100;
    if (percent >= 75) return 75;
    if (percent >= 50) return 50;
    if (percent >= 25) return 25;
    return 0;
}


window.addEventListener('DOMContentLoaded', loadTasksFromFirestore);
