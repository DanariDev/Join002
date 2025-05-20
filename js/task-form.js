import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase config & init
const firebaseConfig = {
  apiKey: "AIzaSyC9E1VrPV6Nyo0rmKyBj9SxqH4X0xqEJys",
  authDomain: "join002-26fa4.firebaseapp.com",
  projectId: "join002-26fa4",
  storageBucket: "join002-26fa4.appspot.com",
  messagingSenderId: "588453967455",
  appId: "1:588453967455:web:85ca999cef839ddeb4dea",
  measurementId: "G-PHNGZQZS4Y"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let subtasks = [];
let contacts = [];

const createBtn = document.getElementById("create-task-btn");

function getValue(selector) {
  const el = document.querySelector(selector);
  return el ? el.value.trim() : "";
}

function getPriority() {
  if (document.querySelector(".urgent-btn.active")) return "urgent";
  if (document.querySelector(".medium-btn.active")) return "medium";
  if (document.querySelector(".low-btn.active")) return "low";
  return "medium";
}

function renderSubtasks() {
  const list = document.getElementById("subtask-list");
  list.innerHTML = "";
  subtasks.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t.text;
    list.appendChild(li);
  });
}

export function addNewSubtask() {
  const input = document.getElementById("subtask");
  const text = input?.value.trim();
  if (text) {
    subtasks.push({ text, done: false });
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

  contacts.forEach(c => {
    const option = document.createElement("option");
    option.value = c.id || c.name;
    option.textContent = c.name;
    select.appendChild(option);
  });
}

async function loadContacts() {
  const snap = await getDocs(collection(db, "contacts"));
  contacts = snap.docs.map(doc => doc.data());
  populateContactsDropdown();
}

async function createTask(event) {
  event.preventDefault();

  const task = {
    title: getValue("#title"),
    description: getValue("#description"),
    dueDate: getValue("#date"),
    category: getValue("#category"),
    assignedTo: getValue("#assigned-to"),
    priority: getPriority(),
    subtasks,
    status: "todo"
  };

  if (!task.title || !task.dueDate || !task.category || !task.assignedTo) {
    alert("Bitte fülle alle Pflichtfelder aus!");
    return;
  }

  try {
    await addDoc(collection(db, "Aufgaben"), task);
    alert("Aufgabe erfolgreich gespeichert!");
    document.getElementById("add-task-form").reset();
    subtasks = [];
    renderSubtasks();
    updateButtonState();
  } catch (error) {
    console.error("Fehler beim Speichern der Aufgabe:", error);
    alert("Fehler beim Speichern. Bitte versuche es erneut.");
  }
}

function updateButtonState() {
  const title = getValue("#title");
  const date = getValue("#date");
  const category = getValue("#category");
  const assignedTo = getValue("#assigned-to");

  const allFilled = title && date && category && assignedTo;
  createBtn.disabled = !allFilled;
  createBtn.classList.toggle("disabled", !allFilled);
}

function updatePriorityButtons() {
  const buttons = [
    { id: "urgent-btn", class: "urgent-btn-active" },
    { id: "medium-btn", class: "medium-btn-active" },
    { id: "low-btn", class: "low-btn-active" }
  ];

  buttons.forEach(btn => {
    const el = document.getElementById(btn.id);
    el.addEventListener("click", () => {
      buttons.forEach(b => {
        document.getElementById(b.id).classList.remove(b.class);
      });
      el.classList.add(btn.class);
    });
  });
}


["#title", "#date", "#category", "#assigned-to"].forEach(selector => {
  document.querySelector(selector).addEventListener("input", updateButtonState);
});


document.getElementById("add-task-form").addEventListener("submit", createTask);
document.querySelector(".subtask-button").addEventListener("click", addNewSubtask);


document.getElementById("clear-btn").addEventListener("click", () => {
  createBtn.disabled = true;
  createBtn.classList.add("disabled");
});

// Initialisierung
createBtn.disabled = true;
createBtn.classList.add("disabled");

loadContacts();
updatePriorityButtons();
