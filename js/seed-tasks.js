
import { db, auth } from "./firebase-config.js";
import {
  ref,
  onValue,
  update,
  push,
  get,
  child,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

function $(s) {
  return document.querySelector(s);
}

// === SUMMARY ===
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const isGuest = localStorage.getItem("isGuest") === "true";
  let name = "User";

  if (isGuest) {
    name = "Guest";
  } else {
    const snap = await get(child(ref(db), `users/${user.uid}`));
    if (snap.exists()) name = snap.val().name;
  }

  showGreeting(name);
  loadTasksForSummary();
});

function showGreeting(name) {
  const el = $("#summary-greeting");
  if (!el) return;
  el.innerHTML = name === "Guest"
    ? `Good morning,<br><span>Guest</span>`
    : `Good morning,<br><span>${name}</span>`;
}

function loadTasksForSummary() {
  onValue(ref(db, "tasks"), (snapshot) => {
    const tasksObj = snapshot.val();
    if (!tasksObj) return;
    const tasks = Object.values(tasksObj);
    updateSummary(tasks);
  });
}

function updateSummary(tasks) {
  set(".todo .metric h2", count(tasks, "status", "todo"));
  set(".done .metric h2", count(tasks, "status", "done"));
  set(".mini:nth-child(1) h2", tasks.length);
  set(".mini:nth-child(2) h2", count(tasks, "status", "in progress"));
  set(".mini:nth-child(3) h2", count(tasks, "status", "awaiting feedback"));
  set(".urgent .metric h2", count(tasks, "priority", "urgent"));
  showDeadline(tasks);
}

function set(sel, val) {
  const el = $(sel);
  if (el) el.textContent = val;
}

function count(arr, key, val) {
  return arr.filter((t) => t[key]?.toLowerCase() === val).length;
}

function showDeadline(tasks) {
  const dates = tasks
    .filter(t => t.dueDate)
    .map(t => new Date(t.dueDate))
    .filter(d => d > new Date())
    .sort((a, b) => a - b);

  const date = dates[0] || new Date();
  $("#deadline-date").textContent = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// === SEED TASKS ===
async function getContacts() {
  const snap = await get(ref(db, "contacts"));
  const data = snap.val();
  return data ? Object.values(data).map(d => d.name) : [];
}

function getRandomFromArray(arr, count = 1) {
  return arr.sort(() => 0.5 - Math.random()).slice(0, count);
}

async function seedTasks() {
  const contacts = await getContacts();
  if (contacts.length === 0) return alert("Keine Kontakte gefunden!");

  const exampleTasks = [
    {
      title: "Login Seite finalisieren",
      description: "Farbwerte und Layout final abstimmen",
      dueDate: "2025-05-22",
      priority: "urgent",
      status: "todo",
      category: "User Story",
      subtasks: [
        { text: "Farbwerte setzen", done: false },
        { text: "Inputfelder checken", done: true }
      ]
    },
    {
      title: "Board Ansicht umbauen",
      description: "Drag & Drop mit Animation testen",
      dueDate: "2025-05-24",
      priority: "medium",
      status: "in progress",
      category: "Technical Task",
      subtasks: []
    },
    {
      title: "Deadline Visualisierung",
      description: "Deadline dynamisch anzeigen auf Summary",
      dueDate: "2025-05-26",
      priority: "low",
      status: "done",
      category: "User Story",
      subtasks: []
    }
  ];

  for (let task of exampleTasks) {
    task.assignedTo = getRandomFromArray(contacts, 2);
    await push(ref(db, "tasks"), task);
  }

  alert("Tasks wurden erfolgreich in Realtime Database gespeichert!");
}


