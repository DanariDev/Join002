import { db } from "../firebase/firebase-init.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { renderTaskCard } from "./render-task-card.js";

export function initTaskFetching(addTaskToBoard, onAllRendered) {
  if (!addTaskToBoard) {
    console.error("addTaskToBoard fehlt!");
    return;
  }
  const tasksRef = ref(db, "tasks");
  onValue(tasksRef, snapshot => {
    clearBoard();
    const tasks = snapshot.val() || {};
    console.log("Geladene Aufgaben:", tasks); // Testausgabe
    Object.entries(tasks).forEach(([id, task]) => addTaskToBoard({ ...task, id }));
    if (typeof onAllRendered === "function") onAllRendered();
  }, error => console.error("Fehler beim Laden:", error));
}

export function fetchContacts(callback) {
  const contactsRef = ref(db, "contacts");
  onValue(contactsRef, snapshot => {
    const contacts = snapshot.val() || {};
    const contactList = Object.entries(contacts).map(([id, contact]) => ({ ...contact, id }));
    callback(contactList);
  });
}

function clearBoard() {
  document.querySelectorAll('.task-column').forEach(col => col.innerHTML = "");
}