import { initGreeting } from './greeting.js';
import { initTaskCounters } from './tasks-counter.js';
import { initDeadlineDate } from './deadline-date.js';

window.addEventListener('DOMContentLoaded', () => {
  initGreeting();
  initTaskCounters();
  initDeadlineDate();
});
