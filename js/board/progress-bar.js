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

/* ========== Helferfunktionen ========== */
function hasSubtasks(subtasks) {
  return subtasks && subtasks.length > 0;
}
function hideProgress(bar, countDiv) {
  bar.style.display = "none";
  countDiv.textContent = "";
}
function showProgress(bar) {
  bar.style.display = "block";
}
function countDone(subtasks) {
  return subtasks.filter(st => st.checked === true || st.checked === "true").length;
}
function calcPercent(done, total) {
  if (total === 0) return 0;
  return Math.round((done / total) * 100);
}
function getProgressClass(percent) {
  if (percent === 100) return "progress-100";
  if (percent >= 75) return "progress-75";
  if (percent >= 60) return "progress-60";
  if (percent >= 50) return "progress-50";
  if (percent > 0) return "progress-25";
  return "progress-0";
}
function setBarClass(bar, progressClass) {
  bar.className = "progress-bar " + progressClass;
}
function setCountText(countDiv, done, total) {
  countDiv.textContent = `${done}/${total}`;
}
