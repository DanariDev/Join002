import { loadTasks } from "./load-tasks.js";
import { initOverlay } from "./overlay.js";
import { initSearch } from "./search.js";
import { deleteTask } from "./delete-task.js";

// Starte alle Module nach dem Laden der Seite
window.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  initOverlay();
  initSearch();
  // Die deleteTask-Funktion wird durch den Button im Overlay verwendet,
  // muss also nicht explizit hier initialisiert werden.
});
