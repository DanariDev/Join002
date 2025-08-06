/**
 * Initializes priority buttons: sets default and adds exclusive click handlers.
 */
export function initPriorityButtons() {
  const btns = getPriorityButtons();
  setDefaultPriority(btns);

  btns.forEach(({ id, class: activeClass }) => {
    const btn = document.getElementById(id);
    btn.addEventListener("click", () => setActivePriority(btns, id, activeClass));
  });
}

/**
 * Returns all priority button IDs and their "active" classes.
 * @returns {Array<Object>} Array of button info objects.
 */
function getPriorityButtons() {
  return [
    { id: "urgent-btn", class: "urgent-btn-active" },
    { id: "medium-btn", class: "medium-btn-active" },
    { id: "low-btn", class: "low-btn-active" }
  ];
}

/**
 * Sets medium priority as default if none is active.
 * @param {Array<Object>} btns - Array of button info objects.
 */
function setDefaultPriority(btns) {
  const noneActive = btns.every(({ id, class: activeClass }) =>
    !document.getElementById(id).classList.contains(activeClass)
  );
  if (noneActive) {
    document.getElementById("medium-btn").classList.add("medium-btn-active");
  }
}

/**
 * Handles exclusive active state for priority buttons.
 * @param {Array<Object>} btns - Array of button info objects.
 * @param {string} clickedId - ID of the clicked button.
 * @param {string} activeClass - Class name for the active state.
 */
function setActivePriority(btns, clickedId, activeClass) {
  btns.forEach(({ id, class: otherClass }) => {
    document.getElementById(id).classList.remove(otherClass);
  });
  document.getElementById(clickedId).classList.add(activeClass);
}

/**
 * Returns the selected priority value as string ("urgent", "medium", "low").
 * @returns {string} The selected priority.
 */
export function getSelectedPriority() {
  if (document.getElementById("urgent-btn").classList.contains("urgent-btn-active")) return "urgent";
  if (document.getElementById("medium-btn").classList.contains("medium-btn-active")) return "medium";
  if (document.getElementById("low-btn").classList.contains("low-btn-active")) return "low";
  return "medium";
}
