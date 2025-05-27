import { db } from "./firebase-config.js";
import { ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { renderPopup } from "./task-overlay.js";

function $(s) {
    return document.querySelector(s);
}

function loadTasks() {

    document.getElementById("task-overlay")?.classList.add("d-none");

    let tasksRef = ref(db, "tasks");
    onValue(tasksRef, function (snapshot) {
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
    const label = c.querySelector('.task-label');
    const text = label.textContent.trim().toLowerCase();
    if (text === "technical") {
        label.classList.add('green-background');
    } else if (text === "user") {
        label.classList.add('blue-background');
    }
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
    c.ondragstart = function (e) {
        e.dataTransfer.setData("text", t.id);
        c.classList.add("dragging");
    };
    c.ondragend = function () {
        c.classList.remove("dragging");
    };
    c.onclick = () => renderPopup(t);
}


function setupDropTargets() {
    let cols = document.querySelectorAll(".board > div");
    for (let i = 0; i < cols.length; i++) {
        cols[i].ondragover = function (e) {
            e.preventDefault();
            cols[i].classList.add("drag-over");
        };
        cols[i].ondragleave = function () {
            cols[i].classList.remove("drag-over");
        };
        cols[i].ondrop = function (e) {
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
    update(ref(db, "tasks/" + id), { status: newStatus }).then(function () {
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

loadTasks();
