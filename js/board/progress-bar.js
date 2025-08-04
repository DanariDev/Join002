export function renderProgressBar(subtasks, cardElement) {
  const bar = cardElement.querySelector(".progress-bar");
  const countDiv = cardElement.querySelector(".task-count");

  if (!subtasks || subtasks.length === 0) {
    bar.className = "progress-bar progress-0";
    countDiv.textContent = "0/0";
    return;
  }
  const done = subtasks.filter(st => st.checked === true || st.checked === "true").length;
  const total = subtasks.length;
  let percent = Math.round((done / total) * 100);

  let progressClass = "progress-0";
  if (percent === 100) progressClass = "progress-100";
  else if (percent >= 75) progressClass = "progress-75";
  else if (percent >= 60) progressClass = "progress-60";
  else if (percent >= 50) progressClass = "progress-50";
  else if (percent >= 25) progressClass = "progress-25";
  else if (percent > 0) progressClass = "progress-25";

  bar.className = "progress-bar " + progressClass;
  countDiv.textContent = `${done}/${total}`;
}
