// add-task-date.js

/**
 * Initializes due date input: sets min to today, default value to German format today,
 * adds blur and keydown listeners for validation.
 */
export function initDueDateInput() {
  const dateInput = document.getElementById('due-date');
  const currenttoday = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
  dateInput.min = currenttoday;
  const errorMsg = document.getElementById('error-message');
  if (!dateInput) return;

  // Heute im deutschen Format vorbereiten
  const today = getTodayDateString();
  dateInput.value = formatGermanDate(today);

  // Prüfen auf blur (Feld verlassen) oder Enter
  dateInput.addEventListener('blur', validateDate);
  dateInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      validateDate();
      e.preventDefault();
    }
  });

  function validateDate() {
    const value = dateInput.value.trim();
    const todayStr = getTodayDateString();

    // Nur prüfen bei deutschem Format TT.MM.JJJJ
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(value)) {
      const isoDate = convertToISODate(value);
      if (!isoDate || isoDate < todayStr) {
        showError(`Bitte ein Datum ab heute (${formatGermanDate(todayStr)}) wählen!`);
        dateInput.value = formatGermanDate(todayStr);
      } else {
        hideError();
      }
    } else {
      // Kein Fehler bei leerem/falschem Format
      hideError();
    }
  }

  function showError(msg) {
    if (errorMsg) {
      errorMsg.textContent = msg;
      errorMsg.style.color = 'red';
    }
  }
  function hideError() {
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
}

/**
 * Returns today's date as ISO string (YYYY-MM-DD).
 */
function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}