import { db } from "./firebase-config.js";
import { ref, push, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

async function getContacts() {
  const snap = await get(ref(db, "contacts"));
  const data = snap.val();
  const contactList = [];
  if (data) {
    for (let key in data) {
      contactList.push(data[key].email);
    }
  }
  seedTasks(contactList);
}

function getRandomFromArray(arr, count) {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function createExampleTasks() {
  return [
    {
      title: "Login Seite finalisieren",
      description: "Farbwerte und Layout final abstimmen",
      dueDate: "2025-05-22",
      priority: "urgent",
      status: "todo",
      category: "User Story",
      subtasks: [
        { text: "Farbwerte setzen", done: false },
        { text: "Inputfelder checken", done: true },
      ],
    },
    {
      title: "Board Ansicht umbauen",
      description: "Drag & Drop mit Animation testen",
      dueDate: "2025-05-24",
      priority: "medium",
      status: "in-progress",
      category: "Technical Task",
      subtasks: [],
    },
    {
      title: "Deadline Visualisierung",
      description: "Deadline dynamisch anzeigen auf Summary",
      dueDate: "2025-05-26",
      priority: "low",
      status: "done",
      category: "User Story",
      subtasks: [],
    },
  ];
}

function seedTasks(contacts) {
  if (contacts.length === 0) {
    alert("Keine Kontakte gefunden!");
    return;
  }

  const exampleTasks = createExampleTasks();
  for (let i = 0; i < exampleTasks.length; i++) {
    exampleTasks[i].assignedTo = getRandomFromArray(contacts, 2);
    push(ref(db, "tasks"), exampleTasks[i]);
  }

  alert("Tasks wurden erfolgreich in Realtime Database gespeichert!");
}

// Startet automatisch beim Laden
getContacts();
