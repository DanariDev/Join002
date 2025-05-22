import { db } from "./firebase-config.js";
import { ref, push, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

function getContacts() {
    let snap = get(ref(db, "contacts"));
    snap.then(function(snapshot) {
        let data = snapshot.val();
        let contactList = [];
        if (data) {
            for (let key in data) {
                contactList.push(data[key].email);
            }
        }
        seedTasks(contactList);
    });
}

function getRandomFromArray(arr, count) {
    let shuffled = arr.sort(function() { return 0.5 - Math.random(); });
    let result = [];
    for (let i = 0; i < count && i < shuffled.length; i++) {
        result.push(shuffled[i]);
    }
    return result;
}

function createExampleTasks() {
    let tasks = [
        { title: "Login Seite finalisieren", description: "Farbwerte und Layout final abstimmen", dueDate: "2025-05-22", priority: "urgent", status: "todo", category: "User Story", subtasks: [{ text: "Farbwerte setzen", done: false }, { text: "Inputfelder checken", done: true }] },
        { title: "Board Ansicht umbauen", description: "Drag & Drop mit Animation testen", dueDate: "2025-05-24", priority: "medium", status: "in-progress", category: "Technical Task", subtasks: [] },
        { title: "Deadline Visualisierung", description: "Deadline dynamisch anzeigen auf Summary", dueDate: "2025-05-26", priority: "low", status: "done", category: "User Story", subtasks: [] }
    ];
    return tasks;
}

function seedTasks(contacts) {
    if (contacts.length == 0) {
        alert("Keine Kontakte gefunden!");
        return;
    }
    let exampleTasks = createExampleTasks();
    for (let i = 0; i < exampleTasks.length; i++) {
        exampleTasks[i].assignedTo = getRandomFromArray(contacts, 2);
        push(ref(db, "tasks"), exampleTasks[i]);
    }
    alert("Tasks wurden erfolgreich in Realtime Database gespeichert!");
}

export { seedTasks };
getContacts();