import { initGreeting } from "./greeting.js";
import { initTaskCounters } from "./tasks-counter.js";
import { initDeadlineDate } from "./deadline-date.js";

/**
 * This instruction ensures that the functions "initGreeting", "initTaskCounters" and "initDeadlineDate"
 * are called up after loading the Document Object Model (DOM) Content"
 */
window.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("showSummaryLoader") === "1") {
    document.getElementById("summary-loader").style.display = "flex";

    // Nach z.B. 1200ms Loader ausblenden (je nach Animation/Feeling)
    setTimeout(() => {
      document.getElementById("summary-loader").style.display = "none";
      // Danach das Flag wieder löschen!
      sessionStorage.removeItem("showSummaryLoader");
    }, 1200); // oder was sich smooth anfühlt
  } else {
    // Sicherstellen, dass der Loader wirklich ausgeblendet bleibt
    document.getElementById("summary-loader").style.display = "none";
  }
  initGreeting();
  initTaskCounters();
  initDeadlineDate();
});
