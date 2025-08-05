import { db } from '../firebase/firebase-init.js';
import { ref, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

export function deleteTask(taskId) {
  const taskRef = ref(db, 'tasks/' + taskId);
  remove(taskRef)
    .then(() => {
      console.log('Task erfolgreich gelöscht!');
      // Overlay nach dem Löschen schließen (optional)
      document.getElementById('task-overlay').classList.add('d-none');
      document.getElementById("body").classList.remove('overflow-hidden');
    })
    .catch(error => {
      console.error('Fehler beim Löschen des Tasks:', error);
      alert('Fehler beim Löschen. Bitte versuchen Sie es erneut.');
    });
}
