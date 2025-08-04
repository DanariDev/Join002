export function initEditPriorityButtons() {
  document.querySelectorAll("#editing-priority-buttons .all-priority-btns").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll("#editing-priority-buttons .all-priority-btns").forEach(b =>
        b.classList.remove("active")
      );
      btn.classList.add("active");
    };
  });
}

export function getSelectedEditPriority() {
  if (document.getElementById("editing-urgent-btn").classList.contains("active")) return "urgent";
  if (document.getElementById("editing-medium-btn").classList.contains("active")) return "medium";
  if (document.getElementById("editing-low-btn").classList.contains("active")) return "low";
  return "";
}
