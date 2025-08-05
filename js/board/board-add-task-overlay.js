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

  // Prio-Buttons
  // ["urgent-btn", "medium-btn", "low-btn"].forEach((btnId) => {
  //   document.getElementById(btnId).addEventListener("click", function () {
  //     ["urgent-btn", "medium-btn", "low-btn"].forEach((id) =>
  //       document
  //         .getElementById(id)
  //         .classList.remove(
  //           "selected",
  //           "urgent-btn-active",
  //           "medium-btn-active",
  //           "low-btn-active"
  //         )
  //     );
  //     if (btnId === "urgent-btn")
  //       this.classList.add("selected", "urgent-btn-active");
  //     if (btnId === "medium-btn")
  //       this.classList.add("selected", "medium-btn-active");
  //     if (btnId === "low-btn") this.classList.add("selected", "low-btn-active");
  //   });
  // });

  // Subtasks
  // document
  //   .getElementById("subtask-input")
  //   .addEventListener("keydown", function (e) {
  //     if (e.key === "Enter") {
  //       addBoardSubtask();
  //       e.preventDefault();
  //     }
  //   });
  // document
  //   .querySelector(".subtask-button")
  //   .addEventListener("click", addBoardSubtask);
  // document
  //   .getElementById("subtasks-list")
  //   .addEventListener("click", function (e) {
  //     if (e.target.classList.contains("subtask-delete")) {
  //       const idx = e.target.getAttribute("data-idx");
  //       subtasks.splice(idx, 1);
  //       renderBoardSubtasks();
  //     }
  //   });

  // Task anlegen
  // document.getElementById("create-btn").onclick = createBoardTask;

  // Hide errors on input
  // ["task-title", "task-date", "task-category"].forEach((id) => {
  //   document
  //     .getElementById(id)
  //     .addEventListener("input", () => hideRequiredError(id));
  // });
}

async function openBoardOverlay() {
  document.getElementById("add-task-overlay").classList.remove("d-none");
  // document.getElementById("form-add-task").style.display = "flex";

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

  // Felder resetten + Fehler ausblenden
  // resetBoardOverlay();
  // hideAllRequiredErrors();
}

// function resetBoardOverlay() {
//   document.getElementById("task-title").value = "";
//   document.getElementById("task-description").value = "";
//   document.getElementById("task-date").value = "";
//   document.getElementById("task-category").selectedIndex = 0;
//   ["urgent-btn", "medium-btn", "low-btn"].forEach((id) =>
//     document
//       .getElementById(id)
//       .classList.remove(
//         "selected",
//         "urgent-btn-active",
//         "medium-btn-active",
//         "low-btn-active"
//       )
//   );
//   document
//     .getElementById("medium-btn")
//     .classList.add("selected", "medium-btn-active");
//   subtasks = [];
//   renderBoardSubtasks();
//   hideAllRequiredErrors();
// }

export function closeBoardOverlay() {
  document.getElementById("add-task-overlay").classList.add("d-none");
  clearForm();
}

// --- Subtasks ---
// function renderBoardSubtasks() {
//   const list = document.getElementById("subtasks-list");
//   list.innerHTML = "";
//   subtasks.forEach((subtask, idx) => {
//     const txt = typeof subtask === "string" ? subtask : subtask.text;
//     const li = document.createElement("li");
//     li.className = "subtask-item";
//     li.innerHTML = `<span class="subtask-text">${txt}</span>
//       <img class="subtask-delete" src="assets/img/delete.png" alt="Delete" data-idx="${idx}" style="width:16px;cursor:pointer;">`;
//     list.appendChild(li);
//   });
// }
// function addBoardSubtask() {
//   const input = document.getElementById("subtask-input");
//   const value = input.value.trim();
//   if (!value) return;
//   subtasks.push(value);
//   input.value = "";
//   renderBoardSubtasks();
// }

// --- Task anlegen (mit Required Fehlermeldungen) ---
// function createBoardTask(e) {
//   e.preventDefault();

//   let valid = true;

//   const title = document.getElementById("task-title").value.trim();
//   const dueDate = document.getElementById("task-date").value;
//   const category = document.getElementById("task-category").value;

//   if (!title) {
//     showRequiredError("task-title");
//     valid = false;
//   }
//   if (!dueDate) {
//     showRequiredError("task-date");
//     valid = false;
//   }
//   if (!category) {
//     showRequiredError("task-category");
//     valid = false;
//   }

//   if (!valid) return;

//   const description = document.getElementById("task-description").value.trim();

//   let priority = "medium";
//   if (document.getElementById("urgent-btn").classList.contains("selected"))
//     priority = "urgent";
//   if (document.getElementById("low-btn").classList.contains("selected"))
//     priority = "low";

//   const task = {
//     title,
//     description,
//     dueDate,
//     category,
//     priority,
//     subtasks: subtasks,
//     assignedTo: selectedContacts.map((c) => c.id),
//     status: "to-do",
//   };

//   const tasksRef = ref(db, "tasks/");
//   push(tasksRef, task)
//     .then(() => {
//       resetBoardOverlay();
//       closeBoardOverlay();
//     })
//     .catch((error) => {
//       alert("Fehler beim Speichern: " + error.message);
//     });
// }

// --- Required Fehlermeldungen anzeigen/ausblenden ---
// function showRequiredError(inputId) {
//   const input = document.getElementById(inputId);
//   if (!input) return;
//   const span = input.nextElementSibling;
//   if (span && span.classList.contains("required-explain")) {
//     span.style.display = "inline";
//     span.style.color = "red";
//   }
// }
// function hideRequiredError(inputId) {
//   const input = document.getElementById(inputId);
//   if (!input) return;
//   const span = input.nextElementSibling;
//   if (span && span.classList.contains("required-explain")) {
//     span.style.display = "none";
//   }
// }
// function hideAllRequiredErrors() {
//   document.querySelectorAll(".required-explain").forEach((span) => {
//     span.style.display = "none";
//   });
// }

// Schließen mit ESC-Taste
document.addEventListener("keydown", function (e) {
  const overlay = document.getElementById("add-task-overlay");
  if (e.key === "Escape" && !overlay.classList.contains("d-none")) {
    closeBoardOverlay();
  }
});
