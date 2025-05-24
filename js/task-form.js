import { db } from "./firebase-config.js";
import { ref, onValue, update, push, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

let subtasks = [];
let contacts = [];

function $(s) {
    return document.querySelector(s);
}


function getValue(selector) {
    const element = document.querySelector(selector);
    return element ? element.value.trim() : "";
}

function getPriority() {
    if (document.getElementById("urgent-btn").classList.contains("active")) {
        return "urgent";
    }
    if (document.getElementById("medium-btn").classList.contains("active")) {
        return "medium";
    }
    if (document.getElementById("low-btn").classList.contains("active")) {
        return "low";
    }
    return "medium";
}

function renderSubtasks() {
    const list = document.getElementById("subtask-list");
    list.innerHTML = "";
    for (let i = 0; i < subtasks.length; i++) {
        const li = document.createElement("li");
        li.textContent = subtasks[i].text;
        list.appendChild(li);
    }
}

function addNewSubtask() {
    const input = document.getElementById("subtask");
    const text = input.value.trim();
    if (text) {
        subtasks.push({ text: text, done: false });
        input.value = "";
        renderSubtasks();
    }
}

function populateContactsDropdown() {
    const select = document.getElementById("assigned-to");
    const placeholder = document.createElement("option");
    placeholder.textContent = "Select contacts to assign";
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.hidden = true;
    select.appendChild(placeholder);
    addContactOptions(select);
}

function addContactOptions(select) {
    for (let i = 0; i < contacts.length; i++) {
        const option = document.createElement("option");
        option.value = contacts[i].email;
        option.textContent = contacts[i].name;
        select.appendChild(option);
    }
}

function loadContacts() {
    const snapshot = get(ref(db, "contacts"));
    snapshot.then(function (snap) {
        const data = snap.val();
        contacts = data ? Object.values(data) : [];
        populateContactsDropdown();
    });
}

function createTask(event) {
    event.preventDefault();
    const task = {
        title: getValue("#title"),
        description: getValue("#description"),
        dueDate: getValue("#date"),
        category: getValue("#category"),
        assignedTo: getValue("#assigned-to"),
        priority: getPriority(),
        subtasks: subtasks,
        status: "todo"
    };
    validateAndSaveTask(task);
}

function validateAndSaveTask(task) {
    if (!task.title || !task.dueDate || !task.category || !task.assignedTo) {
        alert("Bitte fülle alle Pflichtfelder aus!");
        return;
    }
    push(ref(db, "tasks"), task).then(function () {
        alert("Aufgabe erfolgreich gespeichert!");
        resetForm();
    });
}

function resetForm() {
    document.getElementById("add-task-form").reset();
    subtasks = [];
    renderSubtasks();
    updateCreateTaskBtn();
    updatePriorityButtons();
}

function updateCreateTaskBtn() {
    const title = getValue("#title");
    const date = getValue("#date");
    const category = getValue("#category");
    const assignedTo = getValue("#assigned-to");
    const allFilled = title && date && category && assignedTo;
    const createBtn = document.getElementById("create-task-btn");
    createBtn.disabled = !allFilled;
    createBtn.classList.toggle("disabled", !allFilled);
}

function updatePriorityButtons() {
    const buttons = document.querySelectorAll(".urgent-btn, .medium-btn, .low-btn");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
    }
    const priority = getPriority();
    const activeBtn = document.querySelector("." + priority + "-btn");
    if (activeBtn) activeBtn.classList.add("active");
}

function togglePriorityBtnUrgent() {
    const btn = document.getElementById("urgent-btn");
    const img = btn.querySelector("img");
    btn.onclick = function () {
        const isActive = btn.classList.toggle(btn.id + "-active");
        const mediumBtn = document.getElementById("medium-btn");
        const lowBtn = document.getElementById("low-btn");
        mediumBtn.classList.remove(mediumBtn.id + "-active");
        lowBtn.classList.remove(lowBtn.id + "-active");
        img.src = isActive ? "assets/img/urgent-btn-icon-hover.png" : "assets/img/urgent-btn-icon.png";
        mediumBtn.querySelector("img").src = "assets/img/medium-btn-icon.png";
        lowBtn.querySelector("img").src = "assets/img/low-btn-icon.png";
    };
}


function togglePriorityBtnMedium() {
    const btn = document.getElementById("medium-btn");
    const img = btn.querySelector("img");
    btn.onclick = function () {
        const isActive = btn.classList.toggle(btn.id + "-active");
        const urgentBtn = document.getElementById("urgent-btn");
        const lowBtn = document.getElementById("low-btn");
        urgentBtn.classList.remove(urgentBtn.id + "-active");
        lowBtn.classList.remove(lowBtn.id + "active");
        img.src = isActive ? "assets/img/medium-btn-icon-hover.png" : "assets/img/medium-btn-icon.png";
        urgentBtn.querySelector("img").src = "assets/img/urgent-btn-icon.png";
        lowBtn.querySelector("img").src = "assets/img/low-btn-icon.png";
    };
}



function togglePriorityBtnLow() {
    const btn = document.getElementById("low-btn");
    const img = btn.querySelector("img");
    btn.onclick = function () {
        const isActive = btn.classList.toggle(btn.id + "-active");
        const urgentBtn = document.getElementById("urgent-btn");
        const mediumBtn = document.getElementById("medium-btn");
        urgentBtn.classList.remove(urgentBtn.id + "-active");
        mediumBtn.classList.remove(mediumBtn.id + "-active");
        img.src = isActive ? "assets/img/low-btn-icon-hover.png" : "assets/img/low-btn-icon.png";
        urgentBtn.querySelector("img").src = "assets/img/urgent-btn-icon.png";
        mediumBtn.querySelector("img").src = "assets/img/medium-btn-icon.png";
    };
}


function init() {
    const createBtn = document.getElementById("create-task-btn");
    createBtn.disabled = true;
    createBtn.classList.add("disabled");
    document.getElementById("add-task-form").onsubmit = createTask;
    document.querySelector(".subtask-button").onclick = addNewSubtask;
    document.getElementById("clear-btn").onclick = clearForm;
    updateInputs();
}

function clearForm() {
    const createBtn = document.getElementById("create-task-btn");
    createBtn.disabled = true;
    createBtn.classList.add("disabled");
}

function updateInputs() {
    const inputs = ["#title", "#date", "#category", "#assigned-to"];
    for (let i = 0; i < inputs.length; i++) {
        const input = document.querySelector(inputs[i]);
        input.oninput = updateCreateTaskBtn;
    }
}

init();
loadContacts();
updatePriorityButtons();
togglePriorityBtnUrgent();
togglePriorityBtnMedium();
togglePriorityBtnLow();
updateInputs();