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
