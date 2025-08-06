/**
 * Initializes the task board search input and its event handler.
 */
export function initSearch() {
  const input = document.getElementById('search-input');
  if (input) input.addEventListener('input', onSearchInput);
}

/** Handles live input on the search field and filters board cards */
function onSearchInput(e) {
  const searchValue = getSearchValue(e.target);
  const allTaskCards = document.querySelectorAll('.task-card');
  let anyVisible = filterTaskCards(allTaskCards, searchValue);
  toggleNoResultsMsg(searchValue, anyVisible);
}

/** Gets the search value as lowercase string */
function getSearchValue(input) {
  return input.value.trim().toLowerCase();
}

/** Shows/hides each card depending on search value match */
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

/** Returns true if the card's title or description matches the search value */
function cardMatches(card, value) {
  const title = card.querySelector('.task-title').textContent.toLowerCase();
  const desc = card.querySelector('.task-desc').textContent.toLowerCase();
  return title.includes(value) || desc.includes(value);
}

/** Shows "no results" message if needed */
function toggleNoResultsMsg(searchValue, anyVisible) {
  const noResultsMsg = document.getElementById('no-results-message');
  if (!noResultsMsg) return;
  if (searchValue && !anyVisible) noResultsMsg.style.display = 'flex';
  else noResultsMsg.style.display = 'none';
}
