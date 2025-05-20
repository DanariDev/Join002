import {
  getFirestore, collection, addDoc, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
const db = getFirestore();

let subtasks = [];
let contacts = [];
let selectedContacts = [];

function getValue(sel) {
  const el = document.querySelector(sel);
  return el ? el.value.trim() : "";
}

function getPriority() {
  if (document.querySelector(".urgent-btn.active")) return "urgent";
  if (document.querySelector(".medium-btn.active")) return "medium";
  if (document.querySelector(".low-btn.active")) return "low";
  return "medium";
}

function renderSubtasks() {
  const list = document.querySelector(".subtask-list");
  list.innerHTML = "";
  subtasks.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t.text;
    list.appendChild(li);
  });
}

function addSubtask() {
  const input = document.getElementById("subtask");
  const text = input?.value.trim();
  if (text) {
    subtasks.push({ text, done: false });
    input.value = "";
    renderSubtasks();
  }
}

function renderChips() {
  const wrapper = document.getElementById("selected-contacts");
  wrapper.innerHTML = "";
  selectedContacts.forEach(name => {
    const chip = document.createElement("div");
    chip.className = "contact-chip";
    chip.innerHTML = `${name}<span onclick="removeContact('${name}')">×</span>`;
    wrapper.appendChild(chip);
  });
}

function removeContact(name) {
  selectedContacts = selectedContacts.filter(n => n !== name);
  renderChips();
}

function toggleDropdown() {
  document.getElementById("contacts-dropdown-list").classList.toggle("show");
}

function setupDropdown() {
  const list = document.getElementById("contacts-dropdown-list");
  list.innerHTML = "";
  contacts.forEach(c => {
    const item = document.createElement("div");
    item.textContent = c.name;
    item.onclick = () => {
      if (!selectedContacts.includes(c.name)) selectedContacts.push(c.name);
      renderChips();
    };
    list.appendChild(item);
  });
}

async function loadContacts() {
  const snap = await getDocs(collection(db, "contacts"));
  contacts = snap.docs.map(d => d.data());
  setupDropdown();
}

async function createTask() {
  const task = {
    title: getValue("#title"),
    description: getValue("#description"),
    dueDate: getValue("#date"),
    category: getValue("#category"),
    assignedTo: selectedContacts,
    priority: getPriority(),
    subtasks,
    status: "todo"
  };

  if (!task.title || !task.dueDate || !task.category)
    return alert("Pflichtfelder fehlen");
  await addDoc(collection(db, "Aufgaben"), task);
  alert("Aufgabe gespeichert");
}

document.getElementById("contacts-dropdown").onclick = toggleDropdown;
window.removeContact = removeContact;

loadContacts();
