/**
 * Renders the progress bar and subtask count for a given card element.
 * Hides the bar if there are no subtasks.
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

/** Returns true if there are any subtasks */
function hasSubtasks(subtasks) {
  return subtasks && subtasks.length > 0;
}

/** Hides the progress bar and the subtask count */
function hideProgress(bar, countDiv) {
  bar.style.display = "none";
  countDiv.textContent = "";
}

/** Shows the progress bar */
function showProgress(bar) {
  bar.style.display = "block";
}

/** Returns the number of completed subtasks */
function countDone(subtasks) {
  return subtasks.filter(st => st.checked === true || st.checked === "true").length;
}

/** Calculates the percentage of done subtasks */
function calcPercent(done, total) {
  if (total === 0) return 0;
  return Math.round((done / total) * 100);
}

/** Returns the CSS class for the bar based on percent */
function getProgressClass(percent) {
  if (percent === 100) return "progress-100";
  if (percent >= 75) return "progress-75";
  if (percent >= 60) return "progress-60";
  if (percent >= 50) return "progress-50";
  if (percent > 0) return "progress-25";
  return "progress-0";
}

/** Sets the bar's CSS class */
function setBarClass(bar, progressClass) {
  bar.className = "progress-bar " + progressClass;
}

/** Sets the subtask count text */
function setCountText(countDiv, done, total) {
  countDiv.textContent = `${done}/${total}`;
}
