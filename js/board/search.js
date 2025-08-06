export function initSearch() {
  const input = document.getElementById('search-input');
  if (input) input.addEventListener('input', onSearchInput);
}
function onSearchInput(e) {
  const searchValue = getSearchValue(e.target);
  const allTaskCards = document.querySelectorAll('.task-card');
  let anyVisible = filterTaskCards(allTaskCards, searchValue);
  toggleNoResultsMsg(searchValue, anyVisible);
}
function getSearchValue(input) {
  return input.value.trim().toLowerCase();
}
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
function cardMatches(card, value) {
  const title = card.querySelector('.task-title').textContent.toLowerCase();
  const desc = card.querySelector('.task-desc').textContent.toLowerCase();
  return title.includes(value) || desc.includes(value);
}
function toggleNoResultsMsg(searchValue, anyVisible) {
  const noResultsMsg = document.getElementById('no-results-message');
  if (!noResultsMsg) return;
  if (searchValue && !anyVisible) noResultsMsg.style.display = 'flex';
  else noResultsMsg.style.display = 'none';
}
