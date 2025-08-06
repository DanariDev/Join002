/**
 * Updates placeholders for empty task columns.
 */
export function updateColumnPlaceholders() {
  showIfEmpty("to-do-tasks", "No tasks in 'To do'");
  showIfEmpty("in-progress-tasks", "No tasks in 'In Progress'");
  showIfEmpty("await-tasks", "No tasks in 'Await Feedback'");
  showIfEmpty("done-tasks", "No tasks in 'Done'");
}

/**
 * Adds placeholder text if a column has no tasks.
 * @param {string} columnClass - The CSS class of the column.
 * @param {string} message - The placeholder message.
 */
function showIfEmpty(columnClass, message) {
  const col = document.querySelector(`.${columnClass}`);
  if (!col) return;
  col.querySelectorAll('.placeholder').forEach(p => p.remove());
  if (col.children.length === 0) {
    const el = document.createElement('div');
    el.className = 'placeholder';
    el.textContent = message;
    col.appendChild(el);
  }
}