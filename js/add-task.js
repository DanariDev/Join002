import { db } from "./firebase-config.js";
import { ref, push, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getValue, loadContacts, populateContactsDropdown, renderSubtasks, addSubtask } from "./utils.js";

let subtasks = [], contacts = [], assignedTo = [], contactDropdownClickState = 0;

function getPriority() {
  if (document.getElementById("urgent-btn").classList.contains("urgent-btn-active")) return "urgent";
  if (document.getElementById("medium-btn").classList.contains("medium-btn-active")) return "medium";
  if (document.getElementById("low-btn").classList.contains("low-btn-active")) return "low";
  return "medium";
}

function createTask(event) {
  event.preventDefault();
  const task = {
    title: getValue("#title"),
    description: getValue("#description"),
    dueDate: getValue("#date"),
    category: getValue("#category"),
    assignedTo: assignedTo.map(c => c.name),
    priority: getPriority(),
    subtasks: subtasks,
    status: "todo"
  };
  validateAndSaveTask(task);
}

function validateAndSaveTask(task) {
  if (!task.title || !task.dueDate || !task.category || !task.assignedTo.length) {
    alert("Bitte fülle alle Pflichtfelder aus!");
    return;
  }
  push(ref(db, "tasks"), task).then(() => {
    resetForm();
    localStorage.setItem("wasSavedTask", "true");
    window.location.href = "board.html";
  });
}

function resetForm() {
  document.getElementById("add-task-form").reset();
  subtasks = [];
  assignedTo = [];
  renderSubtasks("subtask-list", subtasks);
  updateCreateTaskBtn();
  setupPriorityButtons();
}

function updateCreateTaskBtn() {
  const allFilled = getValue("#title") && getValue("#date") && getValue("#category") && assignedTo.length;
  const createBtn = document.getElementById("create-task-btn");
  createBtn.disabled = !allFilled;
  createBtn.classList.toggle("disabled", !allFilled);
}

function setupPriorityButtons() {
  const btns = [
    { id: "urgent-btn", icon: "urgent-btn-icon" },
    { id: "medium-btn", icon: "medium-btn-icon" },
    { id: "low-btn", icon: "low-btn-icon" }
  ];
  btns.forEach(({ id, icon }) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.onclick = () => {
      btns.forEach(b => document.getElementById(b.id).classList.toggle(`${b.id}-active`, b.id === id));
      btns.forEach(b => {
        const img = document.getElementById(b.id).querySelector("img");
        img.src = `assets/img/${b.icon}${document.getElementById(b.id).classList.contains(`${b.id}-active`) ? "-hover" : ""}.png`;
      });
    };
    btn.onmouseover = () => btn.querySelector("img").src = `assets/img/${icon}-hover.png`;
    btn.onmouseout = () => !btn.classList.contains(`${id}-active`) && (btn.querySelector("img").src = `assets/img/${icon}.png`);
  });
}

function initDropdownHandling() {
  const dropdown = document.getElementById("contacts-dropdown-list");
  const toggle = document.getElementById("contacts-selected");
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    contactDropdownClickState = (contactDropdownClickState + 1) % 3;
    dropdown.classList.toggle("show", contactDropdownClickState !== 0);
    populateContactsDropdown("contacts-dropdown-list", contacts, assignedTo, contactDropdownClickState === 2, () => {
      updateCreateTaskBtn();
    });
    if (contactDropdownClickState === 0) renderInitials(document.getElementById("selected-contact-insignias"), assignedTo, "assigned-initials");
  });
  document.addEventListener("mousedown", (e) => {
    if (!e.composedPath().some(el => el?.id === "contacts-dropdown-list" || el?.id === "contacts-selected")) {
      dropdown.classList.remove("show");
      contactDropdownClickState = 0;
      renderInitials(document.getElementById("selected-contact-insignias"), assignedTo, "assigned-initials");
    }
  });
}

function init() {
  const createBtn = document.getElementById("create-task-btn");
  createBtn.disabled = true;
  createBtn.classList.add("disabled");
  document.getElementById("add-task-form").onsubmit = createTask;
  document.querySelector(".subtask-button").onclick = () => addSubtask("subtask", "subtask-list", subtasks);
  document.getElementById("clear-btn").onclick = resetForm;
  document.getElementById("subtask").addEventListener("keypress", e => e.key === "Enter" && (e.preventDefault(), addSubtask("subtask", "subtask-list", subtasks)));
  ["#title", "#date", "#category"].forEach(id => document.querySelector(id)?.addEventListener("input", updateCreateTaskBtn));
  document.addEventListener("keypress", e => e.key === "Enter" && e.target.type === "text" && e.preventDefault());
  initDropdownHandling();
  loadContacts(db).then(data => {
    contacts = data;
    populateContactsDropdown("contacts-dropdown-list", contacts, assignedTo);
  });
  setupPriorityButtons();
}

export function addTaskOverlayLoad() {
  resetForm();
  init();
  loadContacts(db).then(data => {
    contacts = data;
    populateContactsDropdown("contacts-dropdown-list", contacts, assignedTo);
  });
}

if (window.location.pathname.includes("add-task.html")) addTaskOverlayLoad();