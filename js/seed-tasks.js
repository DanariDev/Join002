import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC9E1VrPV6Nyo0rmKyBj9SxqH4X0xqEJys",
  authDomain: "join002-26fa4.firebaseapp.com",
  projectId: "join002-26fa4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getContacts() {
  const snap = await getDocs(collection(db, "contacts"));
  return snap.docs.map(d => d.data().name);
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
      dueDate: Timestamp.fromDate(new Date("2025-05-22")),
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
      dueDate: Timestamp.fromDate(new Date("2025-05-24")),
      priority: "medium",
      status: "in progress",
      category: "Technical Task",
      subtasks: []
    },
    {
      title: "Deadline Visualisierung",
      description: "Deadline dynamisch anzeigen auf Summary",
      dueDate: Timestamp.fromDate(new Date("2025-05-26")),
      priority: "low",
      status: "done",
      category: "User Story",
      subtasks: []
    }
  ];

  for (let task of exampleTasks) {
    task.assignedTo = getRandomFromArray(contacts, 2); // max. 2 zufällige Kontakte
    await addDoc(collection(db, "Aufgaben"), task);
  }

  alert("Tasks wurden mit echten Firebase-Kontakten gespeichert!");
}

seedTasks();
