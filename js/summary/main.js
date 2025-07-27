import { initGreeting } from './greeting.js';
import { initTaskCounters } from './tasks-counter.js';
import { initDeadlineDate } from './deadline-date.js';

/**
 * This instruction ensures that the functions "initGreeting", "initTaskCounters" and "initDeadlineDate" 
 * are called up after loading the Document Object Model (DOM) Content"
 */
window.addEventListener('DOMContentLoaded', () => {
  initGreeting();
  initTaskCounters();
  initDeadlineDate();
});
