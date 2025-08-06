// add-task-priority.js

/**
 * Initializes priority buttons: sets medium as default if none active, adds click listeners to toggle active classes exclusively.
 */
// add-task-priority.js

/**
 * Initializes priority buttons: sets medium as default if none active, adds click listeners.
 */
export function initPriorityButtons() {
  const btns = getPriorityButtons();

  setDefaultPriority(btns);

  btns.forEach(({ id, class: activeClass }) => {
    const btn = document.getElementById(id);
    btn.addEventListener("click", () => setActivePriority(btns, id, activeClass));
  });
}

function getPriorityButtons() {
  return [
    { id: "urgent-btn", class: "urgent-btn-active" },
    { id: "medium-btn", class: "medium-btn-active" },
    { id: "low-btn", class: "low-btn-active" }
  ];
}

function setDefaultPriority(btns) {
  const noneActive = btns.every(({ id, class: activeClass }) =>
    !document.getElementById(id).classList.contains(activeClass)
  );
  if (noneActive) {
    document.getElementById("medium-btn").classList.add("medium-btn-active");
  }
}

function setActivePriority(btns, clickedId, activeClass) {
  btns.forEach(({ id, class: otherClass }) => {
    document.getElementById(id).classList.remove(otherClass);
  });
  document.getElementById(clickedId).classList.add(activeClass);
}

/**
 * Returns the selected priority string based on active button class.
 */
export function getSelectedPriority() {
  if (document.getElementById("urgent-btn").classList.contains("urgent-btn-active")) return "urgent";
  if (document.getElementById("medium-btn").classList.contains("medium-btn-active")) return "medium";
  if (document.getElementById("low-btn").classList.contains("low-btn-active")) return "low";
  return "medium";
}
