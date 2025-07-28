// add-task-priority.js

/**
 * Initializes priority buttons: sets medium as default if none active, adds click listeners to toggle active classes exclusively.
 */
export function initPriorityButtons() {
  const btns = [
    { id: "urgent-btn", class: "urgent-btn-active" },
    { id: "medium-btn", class: "medium-btn-active" },
    { id: "low-btn", class: "low-btn-active" }
  ];

  // Standard: Medium aktiv, falls nichts gesetzt
  if (
    !document.getElementById("urgent-btn").classList.contains("urgent-btn-active") &&
    !document.getElementById("medium-btn").classList.contains("medium-btn-active") &&
    !document.getElementById("low-btn").classList.contains("low-btn-active")
  ) {
    document.getElementById("medium-btn").classList.add("medium-btn-active");
  }

  btns.forEach(({ id, class: activeClass }) => {
    const btn = document.getElementById(id);
    btn.addEventListener("click", () => {
      btns.forEach(({ id: otherId, class: otherClass }) => {
        document.getElementById(otherId).classList.remove(otherClass);
      });
      btn.classList.add(activeClass);
    });
  });
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