/**
 * Initializes the due date input: sets min/default, adds validation handlers.
 */
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

/** Sets min and default value to today in German format */
function setMinAndDefault(dateInput) {
  const todayISO = getTodayDateString();
  dateInput.min = todayISO;
  dateInput.value = formatGermanDate(todayISO);
}

/** Validates the entered date (must be today or future) */
function validateDate(dateInput, errorMsg) {
  const value = dateInput.value.trim();
  const todayStr = getTodayDateString();

  if (value) {
    const isoDate = value;
    if (!isoDate || isoDate < todayStr) {
      showError(errorMsg, `Bitte ein Datum ab heute (${formatGermanDate(todayStr)}) wählen!`);
      // dateInput.value = todayStr;
    } else {
      hideError(errorMsg);
    }
  } else {
    hideError(errorMsg);
  }
}

/** Checks for German date format (DD.MM.YYYY) */
function isGermanDateFormat(value) {
  return /^\d{2}\.\d{2}\.\d{4}$/.test(value);
}

/** Shows an error message below the date field */
function showError(errorMsg, msg) {
  if (errorMsg) errorMsg.textContent = msg;
}

/** Hides the error message */
function hideError(errorMsg) {
  if (errorMsg) errorMsg.textContent = '';
}

/** Converts an ISO date string (YYYY-MM-DD) to German format */
function formatGermanDate(isoDateStr) {
  if (!isoDateStr) return '';
  const [year, month, day] = isoDateStr.split('-');
  return `${day}.${month}.${year}`;
}

/** Converts a German date (DD.MM.YYYY) to ISO (YYYY-MM-DD) */
function convertToISODate(germanDateStr) {
  const [day, month, year] = germanDateStr.split('.');
  if (!day || !month || !year) return null;
  return `${year}-${month}-${day}`;
}

/** Gets today's date as YYYY-MM-DD string */
function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}
