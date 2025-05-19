import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
const db = getFirestore();

let subtasks = [];
let contacts = [];

function renderSubtasks() {
  const list = document.querySelector(".subtask-list");
  list.innerHTML = "";
  subtasks.forEach((t, i) => {
    const item = document.createElement("li");
    item.textContent = t.text;
    list.appendChild(item);
  });
}

function addSubtask() {
  const input = document.querySelector("#subtask");
  const text = input?.value.trim();
  if (text) {
    subtasks.push({ text, done: false });
    input.value = "";
    renderSubtasks();
  }
}

function getSelectedContacts() {
  const checkboxes = document.querySelectorAll(".contact-option:checked");
  return Array.from(checkboxes).map(cb => cb.value);
}

function getPriority() {
  if (document.querySelector(".urgent-btn.active")) return "urgent";
  if (document.querySelector(".medium-btn.active")) return "medium";
  if (document.querySelector(".low-btn.active")) return "low";
  return "medium";
}

async function createTask() {
  const title = document.querySelector("#title")?.value.trim();
  const description = document.querySelector("#description")?.value.trim();
  const date = document.querySelector("#date")?.value;
  const category = document.querySelector("#category")?.value;

  const task = {
    title, description, dueDate: date, category,
    assignedTo: getSelectedContacts(),
    priority: getPriority(),
    subtasks, status: "todo"
  };

  if (!title || !date || !category) return alert("Pflichtfelder fehlen");
  await addDoc(collection(db, "Aufgaben"), task);
  alert("Aufgabe gespeichert");
}

async function loadContacts() {
  const snapshot = await getDocs(collection(db, "contacts"));
  contacts = snapshot.docs.map(doc => doc.data());
  const wrapper = document.querySelector("#contacts-wrapper");
  wrapper.innerHTML = contacts.map(c => `
    <label><input type="checkbox" class="contact-option" value="${c.name}"> ${c.name}</label>
  `).join("");
}

loadContacts();
