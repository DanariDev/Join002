import { initGreeting } from "./greeting.js";
import { initTaskCounters } from "./tasks-counter.js";
import { initDeadlineDate } from "./deadline-date.js";

window.addEventListener("DOMContentLoaded", onDomLoaded);

function onDomLoaded() {
  handleSummaryLoader();
  initGreeting();
  initTaskCounters();
  initDeadlineDate();
}
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
