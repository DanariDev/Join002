export function renderTaskCard(task) {
  const template = document.getElementById("task-template");
  if (!template) {
    console.error("task-template nicht gefunden!");
    return document.createElement("div");
  }
  const card = template.content.cloneNode(true);
  setTaskLabel(card, task.category);
  setTaskTexts(card, task);
  card.querySelector('.task-card').setAttribute('data-id', task.id);
  return card;
}

function setTaskLabel(card, category) {
  const label = card.querySelector(".task-label");
  label.textContent = category || "";
  label.classList.remove("green-background", "blue-background");
  if (category === "Technical Task") label.classList.add("green-background");
  else if (category === "User Story") label.classList.add("blue-background");
}

function setTaskTexts(card, task) {
  card.querySelector(".task-title").textContent = task.title || "";
  card.querySelector(".task-desc").textContent = task.description || "";
}
