import { db } from "./firebase-config.js";
import {
  ref,
  onValue,
  update,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { renderPopup } from "./task-overlay.js";

function $(s) {
  return document.querySelector(s);
}

function getColorForName(name) {
  var colors = [
    "#FF5733",
    "#33B5FF",
    "#33FF99",
    "#FF33EC",
    "#ffcb20",
    "#9D33FF",
    "#33FFDA",
    "#FF8C33",
    "#3385FF",
    "#FF3333",
  ];
  var hash = 0;
  for (var i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + (hash * 32 - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function loadTasks() {
  var taskOverlay = document.getElementById("task-overlay");
  taskOverlay.classList.add("d-none");
  taskOverlay.style.display = "none";

  var tasksRef = ref(db, "tasks");
  onValue(
    tasksRef,
    function (snapshot) {
      var tasks = snapshot.val();
      if (tasks) {
        for (var id in tasks) {
          tasks[id].id = id;
          renderTask(tasks[id]);
        }
        setupDropTargets();
      }
    },
    { onlyOnce: true }
  );
}

function renderTask(task) {
  var colMap = {
    todo: ".to-do-tasks",
    "in-progress": ".in-progress-tasks",
    await: ".await-tasks",
    done: ".done-tasks",
  };
  var target = $(colMap[task.status] || ".to-do-tasks");
  var template = document.querySelector("#task-template");
  var card = template.content.cloneNode(true).querySelector(".task-card");
  card.dataset.id = task.id;
  card.draggable = true;
  updateTaskCard(card, task);
  setupTaskCardEvents(card, task);
  target.appendChild(card);
  var label = card.querySelector(".task-label");
  var text = label.textContent.trim();
  if (text == "Technical Task") {
    label.classList.add("green-background");
  } else if (text == "User Story") {
    label.classList.add("blue-background");
  }
}

function updateTaskCard(card, task) {
  card.querySelector(".task-label").textContent = task.category;
  card.querySelector(".task-title").textContent = task.title;
  card.querySelector(".task-desc").textContent = task.description;
  var initialsContainer = card.querySelector(".assigned-initials");
  initialsContainer.classList.add("display-flex");
  var assignedTo = task.assignedTo.sort();
  for (var i = 0; i < assignedTo.length; i++) {
    var name = assignedTo[i];
    var initials = name
      .split(" ")
      .map((part) => part[0].toUpperCase())
      .join("");
    var initialsDiv = document.createElement("div");
    initialsDiv.classList.add("initials-task");
    initialsDiv.textContent = initials;
    initialsDiv.style.backgroundColor = getColorForName(name);
    initialsContainer.appendChild(initialsDiv);
  }
  var totalSubtasks = task.subtasks ? task.subtasks.length : 0;
  var doneSubtasks = 0;
  if (task.subtasks) {
    for (var j = 0; j < task.subtasks.length; j++) {
      if (task.subtasks[j].done) doneSubtasks++;
    }
  }
  card.querySelector(".task-count").textContent =
    doneSubtasks + "/" + totalSubtasks;
  var bar = card.querySelector(".progress-bar");
  var statusClass =
    task.status == "todo"
      ? "progress-25"
      : task.status == "in-progress"
        ? "progress-50"
        : task.status == "await"
          ? "progress-75"
          : "progress-100";
  bar.classList.add(statusClass);
}

function setupTaskCardEvents(card, task) {
  card.ondragstart = function (e) {
    e.dataTransfer.setData("text", task.id);
    card.classList.add("dragging");
  };
  card.ondragend = function () {
    card.classList.remove("dragging");
  };
  card.onclick = function (e) {
    if (e.isTrusted) {
      renderPopup(task);
    }
  };
}

function setupDropTargets() {
  let cols = document.querySelectorAll(".task-column");
  for (let i = 0; i < cols.length; i++) {
    let col = cols[i];
    col.ondragover = e => {
      e.preventDefault();
      col.classList.add("drag-over");
    };
    col.ondragleave = () => col.classList.remove("drag-over");
    col.ondrop = e => {
      col.classList.remove("drag-over");
      handleDrop(e, col);
    };
  }
}


function handleDrop(e, col) {
  e.preventDefault();
  col.classList.remove('drag-over');
  let id = e.dataTransfer.getData('text');
  let card = document.querySelector('[data-id="' + id + '"]');
  let map = {
    'to-do-tasks': 'todo',
    'in-progress-tasks': 'in-progress',
    'await-tasks': 'await',
    'done-tasks': 'done'
  };
  let cls = [...col.classList].find(c => map[c]);
  if (!card || !map[cls]) return;
  update(ref(db, 'tasks/' + id), { status: map[cls] }).then(() => {
    col.appendChild(card);
    updateProgressBar(card, map[cls]);
  });
}


function updateProgressBar(card, newStatus) {
  var bar = card.querySelector(".progress-bar");
  bar.className = "progress-bar";
  var statusClass =
    newStatus == "todo"
      ? "progress-25"
      : newStatus == "in-progress"
        ? "progress-50"
        : newStatus == "await"
          ? "progress-75"
          : "progress-100";
  bar.classList.add(statusClass);
}

function initAddTaskOverlay() {
  var addTaskOverlay = document.querySelector('[data-overlay="add-task"]');
  addTaskOverlay.classList.add("d-none");
  addTaskOverlay.style.display = "none";

  var addTaskButtons = document.querySelectorAll(".add-task-btn");
  var addTaskForm = document.querySelector("#add-task-form");
  var cancelButton = addTaskOverlay.querySelector(".cancel-btn");
  var closeButton = addTaskOverlay.querySelector(".overlay-close");
  var prioButtons = addTaskOverlay.querySelectorAll(".prio-btn");
  var subtaskInput = addTaskOverlay.querySelector("#task-subtask");
  var addSubtaskButton = addTaskOverlay.querySelector(".add-subtask-btn");
  var subtaskList = addTaskOverlay.querySelector("#subtask-list");

  for (var i = 0; i < addTaskButtons.length; i++) {
    var button = addTaskButtons[i];
    var newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
  }

  var updatedButtons = document.querySelectorAll(".add-task-btn");
  for (var j = 0; j < updatedButtons.length; j++) {
    updatedButtons[j].onclick = function (e) {
      if (e.isTrusted) {
        var status = this.getAttribute("data-status");
        document.querySelector("#task-status").value = status;
        addTaskOverlay.dataset.userOpened = "true";
        addTaskOverlay.classList.remove("d-none");
        addTaskOverlay.style.display = "flex";
        validateAddTaskForm();
      }
    };
  }

  cancelButton.onclick = function () {
    addTaskOverlay.classList.add("d-none");
    addTaskOverlay.style.display = "none";
    delete addTaskOverlay.dataset.userOpened;
    resetAddTaskForm();
  };

  closeButton.onclick = function () {
    addTaskOverlay.classList.add("d-none");
    addTaskOverlay.style.display = "none";
    delete addTaskOverlay.dataset.userOpened;
    resetAddTaskForm();
  };

  addTaskOverlay.onclick = function (e) {
    if (e.target == addTaskOverlay) {
      addTaskOverlay.classList.add("d-none");
      addTaskOverlay.style.display = "none";
      delete addTaskOverlay.dataset.userOpened;
      resetAddTaskForm();
    }
  };

  for (var k = 0; k < prioButtons.length; k++) {
    prioButtons[k].onclick = function () {
      for (var l = 0; l < prioButtons.length; l++) {
        prioButtons[l].classList.remove("active");
      }
      this.classList.add("active");
      document.querySelector("#task-priority").value =
        this.getAttribute("data-prio");
    };
  }

  addSubtaskButton.onclick = function () {
    addSubtask(subtaskInput, subtaskList);
  };

  subtaskInput.onkeypress = function (e) {
    if (e.key == "Enter") {
      e.preventDefault();
      addSubtask(subtaskInput, subtaskList);
    }
  };

  addTaskForm.oninput = function () {
    validateAddTaskForm();
  };

  addTaskForm.onsubmit = function (e) {
    e.preventDefault();
    var formData = new FormData(addTaskForm);
    var task = {
      title: formData.get("title"),
      description: formData.get("description"),
      assignedTo: formData.getAll("assigned"),
      dueDate: formData.get("dueDate"),
      priority: formData.get("priority"),
      category: formData.get("category"),
      status: formData.get("status"),
      subtasks: [],
    };
    var subtaskItems = subtaskList.children;
    for (var m = 0; m < subtaskItems.length; m++) {
      task.subtasks.push({
        title: subtaskItems[m].textContent,
        done: false,
      });
    }
    addTaskOverlay.classList.add("d-none");
    addTaskOverlay.style.display = "none";
    delete addTaskOverlay.dataset.userOpened;
    resetAddTaskForm();
  };

  setTimeout(function () {
    if (
      window.getComputedStyle(addTaskOverlay).display != "none" &&
      !addTaskOverlay.dataset.userOpened
    ) {
      addTaskOverlay.classList.add("d-none");
      addTaskOverlay.style.display = "none";
    }
  }, 1000);
}

function addSubtask(input, list) {
  var subtaskText = input.value.trim();
  if (subtaskText) {
    var li = document.createElement("li");
    li.textContent = subtaskText;
    list.appendChild(li);
    input.value = "";
  }
}

function validateAddTaskForm() {
  var form = document.querySelector("#add-task-form");
  var title = form.querySelector("#task-title").value.trim();
  var dueDate = form.querySelector("#task-due-date").value;
  var category = form.querySelector("#task-category").value;
  var createButton = form.querySelector(".create-btn");
  if (title && dueDate && category) {
    createButton.disabled = false;
  } else {
    createButton.disabled = true;
  }
}

function resetAddTaskForm() {
  var form = document.querySelector("#add-task-form");
  var subtaskList = document.querySelector("#subtask-list");
  var taskStatus = document.querySelector("#task-status");
  var prioButtons = form.querySelectorAll(".prio-btn");
  form.reset();
  subtaskList.innerHTML = "";
  taskStatus.value = "";
  for (var i = 0; i < prioButtons.length; i++) {
    prioButtons[i].classList.remove("active");
  }
  var mediumButton = form.querySelector('.prio-btn[data-prio="medium"]');
  if (mediumButton) {
    mediumButton.classList.add("active");
  }
  document.querySelector("#task-priority").value = "medium";
  validateAddTaskForm();
}

document.addEventListener("DOMContentLoaded", function () {
  initAddTaskOverlay();
  setTimeout(function () {
    loadTasks();
  }, 500);
});
