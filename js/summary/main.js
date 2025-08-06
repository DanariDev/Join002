import { initGreeting } from "./greeting.js";
import { initTaskCounters } from "./tasks-counter.js";
import { initDeadlineDate } from "./deadline-date.js";

/**
 * Waits for the DOM to be ready and then initializes
 * greeting, task counters, and deadline date widgets.
 * Also handles the loader animation on page start.
 */
window.addEventListener("DOMContentLoaded", onDomLoaded);

/**
 * Main entry after DOMContentLoaded: 
 * Handles loader visibility and calls all summary initializations.
 */
function onDomLoaded() {
  handleSummaryLoader();
  initGreeting();
  initTaskCounters();
  initDeadlineDate();
}

/**
 * Shows the loading animation if the user just logged in,
 * then hides it after a short delay, or hides it immediately.
 */
function handleSummaryLoader() {
  const loader = document.getElementById("summary-loader");
  if (sessionStorage.getItem("showSummaryLoader") === "1") {
    loader.style.display = "flex";
    setTimeout(() => {
      loader.style.display = "none";
      sessionStorage.removeItem("showSummaryLoader");
    }, 1200);
  } else {
    loader.style.display = "none";
  }
}
