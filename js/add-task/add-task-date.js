/**
 * Initializes the due date input: sets min/default value and adds validation handlers.
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

/**
 * Sets the minimum and default value of the date input to today (German format).
 * @param {HTMLInputElement} dateInput - The input element for the due date.
 */
function setMinAndDefault(dateInput) {
  const todayISO = getTodayDateString();
  dateInput.min = todayISO;
  dateInput.value = formatGermanDate(todayISO);
}

/**
 * Validates the entered date (must be today or in the future).
 * Shows or hides the error message as needed.
 * @param {HTMLInputElement} dateInput - The input element for the due date.
 * @param {HTMLElement} errorMsg - The error message element.
 */
function validateDate(dateInput, errorMsg) {
  const value = dateInput.value.trim();
  const todayStr = getTodayDateString();

  if (value) {
    const isoDate = value;
    if (!isoDate || isoDate < todayStr) {
      showError(errorMsg, `Bitte ein Datum ab heute (${formatGermanDate(todayStr)}) wählen!`);
    } else {
      hideError(errorMsg);
    }
  } else {
    hideError(errorMsg);
  }
}

/**
 * Checks if a string is in German date format (DD.MM.YYYY).
 * @param {string} value - The date string to check.
 * @returns {boolean} True if the value is in German format, else false.
 */
function isGermanDateFormat(value) {
  return /^\d{2}\.\d{2}\.\d{4}$/.test(value);
}

/**
 * Shows an error message below the date field.
 * @param {HTMLElement} errorMsg - The error message element.
 * @param {string} msg - The message to display.
 */
function showError(errorMsg, msg) {
  if (errorMsg) errorMsg.textContent = msg;
}

/**
 * Hides the error message.
 * @param {HTMLElement} errorMsg - The error message element.
 */
function hideError(errorMsg) {
  if (errorMsg) errorMsg.textContent = '';
}

/**
 * Converts an ISO date string (YYYY-MM-DD) to German format (DD.MM.YYYY).
 * @param {string} isoDateStr - The ISO date string.
 * @returns {string} The formatted German date.
 */
function formatGermanDate(isoDateStr) {
  if (!isoDateStr) return '';
  const [year, month, day] = isoDateStr.split('-');
  return `${day}.${month}.${year}`;
}

/**
 * Converts a German date (DD.MM.YYYY) to ISO format (YYYY-MM-DD).
 * @param {string} germanDateStr - The German date string.
 * @returns {string|null} The ISO formatted date string, or null if invalid.
 */
function convertToISODate(germanDateStr) {
  const [day, month, year] = germanDateStr.split('.');
  if (!day || !month || !year) return null;
  return `${year}-${month}-${day}`;
}

/**
 * Gets today's date as a YYYY-MM-DD string.
 * @returns {string} Today's date in ISO format.
 */
function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}
