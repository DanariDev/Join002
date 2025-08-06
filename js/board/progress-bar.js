/**
 * Renders the progress bar and subtask count for a given card element.
 * Hides the bar if there are no subtasks.
 * @param {Array<Object>} subtasks - Array of subtask objects.
 * @param {HTMLElement} cardElement - The task card element.
 */
export function renderProgressBar(subtasks, cardElement) {
  const bar = cardElement.querySelector(".progress-bar");
  const countDiv = cardElement.querySelector(".task-count");
  if (!hasSubtasks(subtasks)) {
    hideProgress(bar, countDiv);
    return;
  }
  showProgress(bar);
  const done = countDone(subtasks);
  const total = subtasks.length;
  const percent = calcPercent(done, total);
  const progressClass = getProgressClass(percent);
  setBarClass(bar, progressClass);
  setCountText(countDiv, done, total);
}

/**
 * Checks if there are any subtasks.
 * @param {Array<Object>} subtasks - Array of subtask objects.
 * @returns {boolean} True if there are subtasks, false otherwise.
 */
function hasSubtasks(subtasks) {
  return subtasks && subtasks.length > 0;
}

/**
 * Hides the progress bar and the subtask count.
 * @param {HTMLElement} bar - The progress bar element.
 * @param {HTMLElement} countDiv - The subtask count element.
 */
function hideProgress(bar, countDiv) {
  bar.style.display = "none";
  countDiv.textContent = "";
}

/**
 * Shows the progress bar.
 * @param {HTMLElement} bar - The progress bar element.
 */
function showProgress(bar) {
  bar.style.display = "block";
}

/**
 * Counts the number of completed subtasks.
 * @param {Array<Object>} subtasks - Array of subtask objects.
 * @returns {number} The number of completed subtasks.
 */
function countDone(subtasks) {
  return subtasks.filter(st => st.checked === true || st.checked === "true").length;
}

/**
 * Calculates the percentage of completed subtasks.
 * @param {number} done - The number of completed subtasks.
 * @param {number} total - The total number of subtasks.
 * @returns {number} The percentage of completed subtasks.
 */
function calcPercent(done, total) {
  if (total === 0) return 0;
  return Math.round((done / total) * 100);
}

/**
 * Returns the CSS class for the progress bar based on percentage.
 * @param {number} percent - The completion percentage.
 * @returns {string} The CSS class for the progress bar.
 */
function getProgressClass(percent) {
  if (percent === 100) return "progress-100";
  if (percent >= 75) return "progress-75";
  if (percent >= 60) return "progress-60";
  if (percent >= 50) return "progress-50";
  if (percent > 0) return "progress-25";
  return "progress-0";
}

/**
 * Sets the CSS class for the progress bar.
 * @param {HTMLElement} bar - The progress bar element.
 * @param {string} progressClass - The CSS class to apply.
 */
function setBarClass(bar, progressClass) {
  bar.className = "progress-bar " + progressClass;
}

/**
 * Sets the subtask count text.
 * @param {HTMLElement} countDiv - The subtask count element.
 * @param {number} done - The number of completed subtasks.
 * @param {number} total - The total number of subtasks.
 */
function setCountText(countDiv, done, total) {
  countDiv.textContent = `${done}/${total}`;
}