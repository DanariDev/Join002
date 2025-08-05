// board-add-task-overlay.js

// import { db } from "../firebase/firebase-init.js";
// import {
//   ref,
//   push,
//   get,
// } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
// import { getRandomColor } from "../contacts/contact-style.js";
// States
// let subtasks = [];
// let selectedContacts = [];
// let allContacts = [];

import { initAddTaskForm } from "../add-task/add-task-form.js";
import { initPriorityButtons } from "../add-task/add-task-priority.js";
import { initDueDateInput } from "../add-task/add-task-date.js";
import { setupDropdownOpenClose, initContactsDropdown } from "../add-task/add-task-contacts.js";
import { clearForm } from "../add-task/add-task-save.js"

const mediaQuery = window.matchMedia("(max-width: 1100px)");

/**
 * Sets up event listener for DOM content loaded to initialize all add-task components.
 */
window.addEventListener("DOMContentLoaded", () => {
  initPriorityButtons();
  setupDropdownOpenClose();
  initContactsDropdown();         
  initDueDateInput();      
  initAddTaskForm();
});

export function initBoardOverlay() {
  document.querySelectorAll(".add-task-btn, #add-task-button").forEach((btn) => {
    btn.addEventListener("click", async function (e) {
      e.preventDefault();
      if (mediaQuery.matches){
        window.location.href ="add-task.html"
      }
      else{
        openBoardOverlay();
      }
    });
  });

  document.getElementById("closeFormModal").onclick = closeBoardOverlay;
  document.getElementById("clear-btn").onclick = function (e) {
    e.preventDefault();
    // resetBoardOverlay();
    closeBoardOverlay();
  };

  // Klick auf den Overlay-Hintergrund schließt das Overlay
  document
    .getElementById("add-task-overlay")
    .addEventListener("click", function (e) {
      if (e.target === this) closeBoardOverlay();
    });
}

async function openBoardOverlay() {
  document.getElementById("add-task-overlay").classList.remove("d-none");
  document.getElementById("body").classList.add('overflow-hidden');

  // Prio & Subtasks zurücksetzen
  ["urgent-btn", "medium-btn", "low-btn"].forEach((id) =>
    document
      .getElementById(id)
      .classList.remove(
        "selected",
        "urgent-btn-active",
        "medium-btn-active",
        "low-btn-active"
      )
  );
  document
    .getElementById("medium-btn")
    .classList.add("selected", "medium-btn-active");
}

export function closeBoardOverlay() {
  document.getElementById("add-task-overlay").classList.add("d-none");
  document.getElementById("body").classList.remove('overflow-hidden');
  clearForm();
}

// Schließen mit ESC-Taste
document.addEventListener("keydown", function (e) {
  const overlay = document.getElementById("add-task-overlay");
  if (e.key === "Escape" && !overlay.classList.contains("d-none")) {
    closeBoardOverlay();
  }
});
