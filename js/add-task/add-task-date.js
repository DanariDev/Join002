export function initDueDateInput() {
  const dateInput = document.getElementById('due-date');
  if (!dateInput) return;

  const today = getTodayDateString();
  dateInput.value = today;
  dateInput.min = today;

  dateInput.addEventListener('input', () => {
    if (!dateInput.value) {
      dateInput.value = getTodayDateString();
    }
  });
}

function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}
