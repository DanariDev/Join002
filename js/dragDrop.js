import { db } from "./firebase-config.js";
import { ref, update, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { renderPopup } from "./task-overlay.js";
import { addPlaceholders } from "./board.js"; // Import, da handleDrop addPlaceholders verwendet

/**
 * Sets up drag and click event listeners for a task card
 * @param {HTMLElement} card - Task card element
 * @param {Object} task - Task data
 */
export function setupTaskCardEvents(card, task) {
  // Desktop Drag
  card.ondragstart = (e) => {
    e.dataTransfer.setData('text', task.id);
    card.classList.add('dragging');
  };
  card.ondragend = () => card.classList.remove('dragging');

  // Klick öffnet Task
  card.onclick = () => renderPopup(task);

  // 📱 Touch Drag (Mobile)
  const isMobile = window.matchMedia('(max-width: 1100px)').matches;

  card.addEventListener("touchstart", (e) => {
    card.classList.add("dragging");
    card.style.position = "absolute";
    card.style.zIndex = "1000";
    if (isMobile) {
      // Scrollen während Drag verhindern
      document.body.style.touchAction = 'none';
    }
  });

  card.addEventListener("touchmove", (e) => {
    e.preventDefault(); // Verhindert Scrollen während des Drags
    const touch = e.touches[0];
    // Präzise Positionierung des Elements
    card.style.left = `${touch.clientX - card.offsetWidth / 2}px`;
    card.style.top = `${touch.clientY - card.offsetHeight / 2}px`;
  });

  card.addEventListener("touchend", (e) => {
    card.classList.remove("dragging");
    card.style.position = "";
    card.style.left = "";
    card.style.top = "";
    if (isMobile) {
      // Scrollen wieder erlauben
      document.body.style.touchAction = '';
    }

    const dropTarget = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    const column = dropTarget.closest(".task-column");
    if (!column) return;

    const map = {
      'to-do-tasks': 'todo',
      'in-progress-tasks': 'in-progress',
      'await-tasks': 'await',
      'done-tasks': 'done'
    };

    const newStatus = map[column.classList[0]];
    if (!newStatus) return;

    update(ref(db, `tasks/${task.id}`), { status: newStatus }).then(() => {
      column.appendChild(card);
      addPlaceholders();
    }).catch((error) => {
      console.error('Error updating task status:', error);
    });
  });
}

/**
 * Sets up drop targets for task columns
 */
export function setupDropTargets() {
  const columns = document.querySelectorAll('#board .task-column');
  columns.forEach(col => {
    col.ondragover = (e) => {
      e.preventDefault();
      col.classList.add('drag-over');
    };
    col.ondragleave = () => col.classList.remove('drag-over');
    col.ondrop = (e) => handleDrop(e, col);
  });
}

/**
 * Handles dropping a task into a new column and updates its status
 * @param {Event} event - Drag event
 * @param {HTMLElement} column - Target column element
 */
function handleDrop(event, column) {
  event.preventDefault();
  column.classList.remove('drag-over');
  const id = event.dataTransfer.getData('text');
  const card = document.querySelector(`[data-id='${id}']`);
  const map = {
    'to-do-tasks': 'todo',
    'in-progress-tasks': 'in-progress',
    'await-tasks': 'await',
    'done-tasks': 'done'
  };
  const newStatus = map[column.classList[0]];
  if (!card || !newStatus) return;
  update(ref(db, `tasks/${id}`), { status: newStatus }).then(() => {
    column.appendChild(card);
    addPlaceholders();
    const taskRef = ref(db, `tasks/${id}`);
    onValue(taskRef, (snapshot) => {
      const task = snapshot.val();
      if (task && Array.isArray(task.subtasks)) {
        updateProgressBar(card, task.subtasks);
      }
    }, { onlyOnce: true });
  }).catch((error) => {
    console.error('Error updating task status:', error);
  });
}