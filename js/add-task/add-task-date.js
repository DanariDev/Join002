// add-task-date.js

export function initDueDateInput() {
  const dateInput = document.getElementById('due-date');
  const errorMsg = document.getElementById('error-message');
  if (!dateInput) return;

  setMinAndDefault(dateInput);
  dateInput.addEventListener('blur', () => validateDate(dateInput, errorMsg));
  dateInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      validateDate(dateInput, errorMsg);
      e.preventDefault();
    }
  });
}

function setMinAndDefault(dateInput) {
  const todayISO = getTodayDateString();
  dateInput.min = todayISO;
  dateInput.value = formatGermanDate(todayISO);
}

function validateDate(dateInput, errorMsg) {
  const value = dateInput.value.trim();
  const todayStr = getTodayDateString();

  if (isGermanDateFormat(value)) {
    const isoDate = convertToISODate(value);
    if (!isoDate || isoDate < todayStr) {
      showError(errorMsg, `Bitte ein Datum ab heute (${formatGermanDate(todayStr)}) wählen!`);
      dateInput.value = formatGermanDate(todayStr);
    } else {
      hideError(errorMsg);
    }
  } else {
    hideError(errorMsg);
  }
}

function isGermanDateFormat(value) {
  return /^\d{2}\.\d{2}\.\d{4}$/.test(value);
}

function showError(errorMsg, msg) {
  if (errorMsg) errorMsg.textContent = msg;
}

function hideError(errorMsg) {
  if (errorMsg) errorMsg.textContent = '';
}

function formatGermanDate(isoDateStr) {
  if (!isoDateStr) return '';
  const [year, month, day] = isoDateStr.split('-');
  return `${day}.${month}.${year}`;
}

function convertToISODate(germanDateStr) {
  const [day, month, year] = germanDateStr.split('.');
  if (!day || !month || !year) return null;
  return `${year}-${month}-${day}`;
}

function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}
