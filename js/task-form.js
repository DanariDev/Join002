import { db } from "./firebase-config.js";
import { ref, onValue, update, push, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

let subtasks = [];
let contacts = [];

function $(s) {
    return document.querySelector(s);
}

function loadTasks() {
    let tasksRef = ref(db, "tasks");
    onValue(tasksRef, function(snapshot) {
        let tasks = snapshot.val();
        if (!tasks) return;
        for (let id in tasks) {
            tasks[id].id = id;
            renderTask(tasks[id]);
        }
        setupDropTargets();
    }, { onlyOnce: true });
}

function renderTask(t) {
    let colMap = { todo: ".to-do-tasks", "in-progress": ".in-progress-tasks", await: ".await-tasks", done: ".done-tasks" };
    let target = $(colMap[t.status] || ".to-do-tasks");
    if (!target) return;
    let tpl = document.querySelector("#task-template");
    let c = tpl.content.cloneNode(true).querySelector(".task-card");
    c.dataset.id = t.id;
    c.draggable = true;
    updateTaskCard(c, t);
    setupTaskCardEvents(c, t);
    target.appendChild(c);
}

function updateTaskCard(c, t) {
    c.querySelector(".task-label").textContent = t.category;
    c.querySelector(".task-title").textContent = t.title;
    c.querySelector(".task-desc").textContent = t.description;
    let totalSubtasks = t.subtasks ? t.subtasks.length : 0;
    let doneSubtasks = 0;
    if (t.subtasks) {
        for (let i = 0; i < t.subtasks.length; i++) {
            if (t.subtasks[i].done) doneSubtasks++;
        }
    }
    c.querySelector(".task-count").textContent = doneSubtasks + "/" + totalSubtasks;
    let bar = c.querySelector(".progress-bar");
    let statusClass = t.status == "todo" ? "progress-25" : t.status == "in-progress" ? "progress-50" : t.status == "await" ? "progress-75" : "progress-100";
    bar.classList.add(statusClass);
}

function setupTaskCardEvents(c, t) {
    c.ondragstart = function(e) {
        e.dataTransfer.setData("text", t.id);
        c.classList.add("dragging");
    };
    c.ondragend = function() {
        c.classList.remove("dragging");
    };
}

function setupDropTargets() {
    let cols = document.querySelectorAll(".board > div");
    for (let i = 0; i < cols.length; i++) {
        cols[i].ondragover = function(e) {
            e.preventDefault();
            cols[i].classList.add("drag-over");
        };
        cols[i].ondragleave = function() {
            cols[i].classList.remove("drag-over");
        };
        cols[i].ondrop = function(e) {
            handleDrop(e, cols[i]);
        };
    }
}

function handleDrop(e, col) {
    e.preventDefault();
    col.classList.remove("drag-over");
    let id = e.dataTransfer.getData("text");
    let card = document.querySelector("[data-id='" + id + "']");
    let map = { "to-do-tasks": "todo", "in-progress-tasks": "in-progress", "await-tasks": "await", "done-tasks": "done" };
    let newStatus = map[col.classList[0]];
    if (!card || !newStatus) return;
    update(ref(db, "tasks/" + id), { status: newStatus }).then(function() {
        col.appendChild(card);
        updateProgressBar(card, newStatus);
    });
}

function updateProgressBar(card, newStatus) {
    let bar = card.querySelector(".progress-bar");
    bar.className = "progress-bar";
    let statusClass = newStatus == "todo" ? "progress-25" : newStatus == "in-progress" ? "progress-50" : newStatus == "await" ? "progress-75" : "progress-100";
    bar.classList.add(statusClass);
}

function getValue(selector) {
    let element = document.querySelector(selector);
    return element ? element.value.trim() : "";
}

function getPriority() {
    if (document.querySelector(".urgent-btn.active")) return "urgent";
    if (document.querySelector(".medium-btn.active")) return "medium";
    if (document.querySelector(".low-btn.active")) return "low";
    return "medium";
}

function renderSubtasks() {
    let list = document.getElementById("subtask-list");
    list.innerHTML = "";
    for (let i = 0; i < subtasks.length; i++) {
        let li = document.createElement("li");
        li.textContent = subtasks[i].text;
        list.appendChild(li);
    }
}

function addNewSubtask() {
    let input = document.getElementById("subtask");
    let text = input.value.trim();
    if (text) {
        subtasks.push({ text: text, done: false });
        input.value = "";
        renderSubtasks();
    }
}

function populateContactsDropdown() {
    let select = document.getElementById("assigned-to");
    let placeholder = document.createElement("option");
    placeholder.textContent = "Select contacts to assign";
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.hidden = true;
    select.appendChild(placeholder);
    addContactOptions(select);
}

function addContactOptions(select) {
    for (let i = 0; i < contacts.length; i++) {
        let option = document.createElement("option");
        option.value = contacts[i].email;
        option.textContent = contacts[i].name;
        select.appendChild(option);
    }
}

function loadContacts() {
    let snapshot = get(ref(db, "contacts"));
    snapshot.then(function(snap) {
        let data = snap.val();
        contacts = data ? Object.values(data) : [];
        populateContactsDropdown();
    });
}

function createTask(event) {
    event.preventDefault();
    let task = {
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
    push(ref(db, "tasks"), task).then(function() {
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
    let title = getValue("#title");
    let date = getValue("#date");
    let category = getValue("#category");
    let assignedTo = getValue("#assigned-to");
    let allFilled = title && date && category && assignedTo;
    let createBtn = document.getElementById("create-task-btn");
    createBtn.disabled = !allFilled;
    createBtn.classList.toggle("disabled", !allFilled);
}

function updatePriorityButtons() {
    let buttons = document.querySelectorAll(".urgent-btn, .medium-btn, .low-btn");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
    }
    let priority = getPriority();
    let activeBtn = document.querySelector("." + priority + "-btn");
    if (activeBtn) activeBtn.classList.add("active");
}

function togglePriorityBtnUrgent() {
    let btn = document.querySelector(".urgent-btn");
    btn.onclick = function() {
        btn.classList.toggle("active");
        document.querySelector(".medium-btn").classList.remove("active");
        document.querySelector(".low-btn").classList.remove("active");
    };
}

function togglePriorityBtnMedium() {
    let btn = document.querySelector(".medium-btn");
    btn.onclick = function() {
        btn.classList.toggle("active");
        document.querySelector(".urgent-btn").classList.remove("active");
        document.querySelector(".low-btn").classList.remove("active");
    };
}

function togglePriorityBtnLow() {
    let btn = document.querySelector(".low-btn");
    btn.onclick = function() {
        btn.classList.toggle("active");
        document.querySelector(".urgent-btn").classList.remove("active");
        document.querySelector(".medium-btn").classList.remove("active");
    };
}

function init() {
    let createBtn = document.getElementById("create-task-btn");
    createBtn.disabled = true;
    createBtn.classList.add("disabled");
    document.getElementById("add-task-form").onsubmit = createTask;
    document.querySelector(".subtask-button").onclick = addNewSubtask;
    document.getElementById("clear-btn").onclick = clearForm;
    updateInputs();
}

function clearForm() {
    let createBtn = document.getElementById("create-task-btn");
    createBtn.disabled = true;
    createBtn.classList.add("disabled");
}

function updateInputs() {
    let inputs = ["#title", "#date", "#category", "#assigned-to"];
    for (let i = 0; i < inputs.length; i++) {
        let input = document.querySelector(inputs[i]);
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