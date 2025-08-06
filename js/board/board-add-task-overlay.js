import { initAddTaskForm } from "../add-task/add-task-form.js";
import { initPriorityButtons } from "../add-task/add-task-priority.js";
import { initDueDateInput } from "../add-task/add-task-date.js";
import { setupDropdownOpenClose, initContactsDropdown } from "../add-task/add-task-contacts.js";
import { clearForm } from "../add-task/add-task-save.js"

const mediaQuery = window.matchMedia("(max-width: 1100px)");

/**
 * Initializes the overlay and its forms on DOMContentLoaded.
 */
window.addEventListener("DOMContentLoaded", () => {
  initPriorityButtons();
  setupDropdownOpenClose();
  initContactsDropdown();
  initDueDateInput();
  initAddTaskForm();
});

/**
 * Sets up all overlay open/close events and buttons for the board.
 */
export function initBoardOverlay() {
  document.querySelectorAll(".add-task-btn, #add-task-button").forEach((btn) =>
    btn.addEventListener("click", handleAddTaskBtnClick)
  );
  document.getElementById("closeFormModal").onclick = closeBoardOverlay;
  document.getElementById("clear-btn").onclick = handleClearBtnClick;
  addOverlayBackgroundListener();
}

/**
 * Handles click on add-task button: opens overlay or redirects to page (mobile).
 * @param {Event} e - The click event.
 */
function handleAddTaskBtnClick(e) {
  e.preventDefault();
  if (mediaQuery.matches) {
    window.location.href = "add-task.html";
  } else {
    openBoardOverlay();
  }
}

/**
 * Handles click on clear/cancel button: closes overlay.
 * @param {Event} e - The click event.
 */
function handleClearBtnClick(e) {
  e.preventDefault();
  closeBoardOverlay();
}

/**
 * Adds click event to overlay background to close overlay when clicking outside.
 */
function addOverlayBackgroundListener() {
  document
    .getElementById("add-task-overlay")
    .addEventListener("click", function (e) {
      if (e.target === this) closeBoardOverlay();
    });
}

/**
 * Opens the board overlay and resets priority selection.
 */
async function openBoardOverlay() {
  showBoardOverlay();
  resetPriorityButtons();
}

/**
 * Shows the overlay and disables body scroll.
 */
function showBoardOverlay() {
  document.getElementById("add-task-overlay").classList.remove("d-none");
  document.getElementById("body").classList.add('overflow-hidden');
}

/**
 * Resets all priority buttons to default (medium selected).
 */
function resetPriorityButtons() {
  ["urgent-btn", "medium-btn", "low-btn"].forEach(resetPriorityButton);
  document.getElementById("medium-btn").classList.add("selected", "medium-btn-active");
}

/**
 * Removes selection/highlight from a single priority button.
 * @param {string} id - The ID of the priority button.
 */
function resetPriorityButton(id) {
  document
    .getElementById(id)
    .classList.remove("selected", "urgent-btn-active", "medium-btn-active", "low-btn-active");
}

/**
 * Closes the board overlay, re-enables body scroll, and clears the form.
 */
export function closeBoardOverlay() {
  document.getElementById("add-task-overlay").classList.add("d-none");
  document.getElementById("body").classList.remove('overflow-hidden');
  clearForm();
}

/**
 * Closes the overlay when the Escape key is pressed.
 * @param {Event} e - The keyboard event.
 */
document.addEventListener("keydown", function (e) {
  const overlay = document.getElementById("add-task-overlay");
  if (e.key === "Escape" && !overlay.classList.contains("d-none")) {
    closeBoardOverlay();
  }
});