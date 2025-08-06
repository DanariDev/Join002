import { initAddTaskForm } from "../add-task/add-task-form.js";
import { initPriorityButtons } from "../add-task/add-task-priority.js";
import { initDueDateInput } from "../add-task/add-task-date.js";
import { setupDropdownOpenClose, initContactsDropdown } from "../add-task/add-task-contacts.js";
import { clearForm } from "../add-task/add-task-save.js"

const mediaQuery = window.matchMedia("(max-width: 1100px)");

window.addEventListener("DOMContentLoaded", () => {
  initPriorityButtons();
  setupDropdownOpenClose();
  initContactsDropdown();
  initDueDateInput();
  initAddTaskForm();
});

export function initBoardOverlay() {
  document.querySelectorAll(".add-task-btn, #add-task-button").forEach((btn) =>
    btn.addEventListener("click", handleAddTaskBtnClick)
  );
  document.getElementById("closeFormModal").onclick = closeBoardOverlay;
  document.getElementById("clear-btn").onclick = handleClearBtnClick;
  addOverlayBackgroundListener();
}

function handleAddTaskBtnClick(e) {
  e.preventDefault();
  if (mediaQuery.matches) {
    window.location.href = "add-task.html";
  } else {
    openBoardOverlay();
  }
}

function handleClearBtnClick(e) {
  e.preventDefault();
  closeBoardOverlay();
}

function addOverlayBackgroundListener() {
  document
    .getElementById("add-task-overlay")
    .addEventListener("click", function (e) {
      if (e.target === this) closeBoardOverlay();
    });
}

async function openBoardOverlay() {
  showBoardOverlay();
  resetPriorityButtons();
}

function showBoardOverlay() {
  document.getElementById("add-task-overlay").classList.remove("d-none");
  document.getElementById("body").classList.add('overflow-hidden');
}

function resetPriorityButtons() {
  ["urgent-btn", "medium-btn", "low-btn"].forEach(resetPriorityButton);
  document.getElementById("medium-btn").classList.add("selected", "medium-btn-active");
}

function resetPriorityButton(id) {
  document
    .getElementById(id)
    .classList.remove("selected", "urgent-btn-active", "medium-btn-active", "low-btn-active");
}

export function closeBoardOverlay() {
  document.getElementById("add-task-overlay").classList.add("d-none");
  document.getElementById("body").classList.remove('overflow-hidden');
  clearForm();
}

// ESC schließt Overlay
document.addEventListener("keydown", function (e) {
  const overlay = document.getElementById("add-task-overlay");
  if (e.key === "Escape" && !overlay.classList.contains("d-none")) {
    closeBoardOverlay();
  }
});
