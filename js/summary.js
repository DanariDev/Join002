import { db, auth } from "./firebase-config.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const isGuest = localStorage.getItem("isGuest") === "true";
  let name;

  if (isGuest) {
    name = "Guest";
  } else {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    name = userDoc.exists() ? userDoc.data().name : "User";
  }

  showGreeting(name);
  const tasks = await loadTasks();
  updateSummary(tasks);
});

function showGreeting(name) {
  const el = q("#summary-greeting");
  if (!el) return;
  el.innerHTML = name === "Guest"
    ? `Good morning Guest`
    : `Good morning,<br><span>${name}</span>`;
}

function q(sel) {
  return document.querySelector(sel);
}

async function loadTasks() {
  const snap = await getDocs(collection(db, "Aufgaben"));
  return snap.docs.map((d) => d.data());
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
  const el = q(sel);
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
  q("#deadline-date").textContent = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

