/**
 * Initializes the task board search input and its event handler.
 */
export function initSearch() {
  const input = document.getElementById('search-input');
  if (input) input.addEventListener('input', onSearchInput);
}

/**
 * Handles input on the search field and filters board cards.
 * @param {Event} e - The input event.
 */
function onSearchInput(e) {
  const searchValue = getSearchValue(e.target);
  const allTaskCards = document.querySelectorAll('.task-card');
  let anyVisible = filterTaskCards(allTaskCards, searchValue);
  toggleNoResultsMsg(searchValue, anyVisible);
}

/**
 * Gets the search value as a lowercase string.
 * @param {HTMLInputElement} input - The search input element.
 * @returns {string} The trimmed lowercase search value.
 */
function getSearchValue(input) {
  return input.value.trim().toLowerCase();
}

/**
 * Filters task cards based on the search value.
 * @param {NodeList} cards - The task card elements.
 * @param {string} value - The search value.
 * @returns {boolean} True if any cards are visible, false otherwise.
 */
function filterTaskCards(cards, value) {
  let anyVisible = false;
  cards.forEach(card => {
    if (cardMatches(card, value)) {
      card.style.display = '';
      anyVisible = true;
    } else {
      card.style.display = 'none';
    }
  });
  return anyVisible;
}

/**
 * Checks if a card's title or description matches the search value.
 * @param {HTMLElement} card - The task card element.
 * @param {string} value - The search value.
 * @returns {boolean} True if the card matches, false otherwise.
 */
function cardMatches(card, value) {
  const title = card.querySelector('.task-title').textContent.toLowerCase();
  const desc = card.querySelector('.task-desc').textContent.toLowerCase();
  return title.includes(value) || desc.includes(value);
}

/**
 * Shows or hides the "no results" message based on search results.
 * @param {string} searchValue - The search value.
 * @param {boolean} anyVisible - Whether any cards are visible.
 */
function toggleNoResultsMsg(searchValue, anyVisible) {
  const noResultsMsg = document.getElementById('no-results-message');
  if (!noResultsMsg) return;
  if (searchValue && !anyVisible) noResultsMsg.style.display = 'flex';
  else noResultsMsg.style.display = 'none';
}