// contacts-data.js

import { db } from './firebase-config.js';
import { ref, get, set, push, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

/** Fetch all contacts from the Realtime Database */
export async function fetchContacts() {
  const snapshot = await get(ref(db, 'contacts'));
  return snapshot.exists() ? snapshot.val() : {};
}

/** Add a new contact to the database */
export async function addContact(contact) {
  const contactRef = push(ref(db, 'contacts'));
  await set(contactRef, contact);
}

/** Update an existing contact by ID */
export async function updateContact(id, updatedData) {
  await update(ref(db, 'contacts/' + id), updatedData);
}

/** Delete a contact by ID */
export async function removeContact(id) {
  await remove(ref(db, 'contacts/' + id));
}

/** Remove a user entry from the 'users' collection based on their email */
export async function removeUserByEmail(email) {
  if (!email) return;
  const snapshot = await get(ref(db, 'users'));
  const users = snapshot.val();
  if (!users) return;
  for (let uid in users) {
    if (users[uid].email === email) {
      await remove(ref(db, 'users/' + uid));
      break;
    }
  }
}

/** Remove a contact's name from all task assignments */
export async function removeContactFromAllTasks(contactName) {
  if (!contactName) return;
  const snapshot = await get(ref(db, 'tasks'));
  const tasks = snapshot.val();
  if (!tasks) return;

  for (let taskId in tasks) {
    const task = tasks[taskId];
    const oldAssigned = task.assignedTo || [];
    const newAssigned = oldAssigned.filter(n => n !== contactName);

    if (newAssigned.length !== oldAssigned.length) {
      await update(ref(db, 'tasks/' + taskId), { assignedTo: newAssigned });
    }
  }
}

/** Get initials from a given full name */
export function getInitials(name) {
  const parts = name.trim().split(" ");
  return parts.map(p => p[0]?.toUpperCase()).join('').slice(0, 2);
}

/** Generate a consistent color for a given name */
export function getColorForName(name) {
  const colors = ["#29ABE2", "#FF7A00", "#2AD300", "#FF5C5C", "#6E52FF", "#FC71FF"];
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return colors[sum % colors.length];
}