export function initSearch() {
  document.getElementById('search-input').addEventListener('input', function () {
    const searchValue = this.value.trim().toLowerCase();
    const allTaskCards = document.querySelectorAll('.task-card');
    let anyVisible = false;

    allTaskCards.forEach(card => {
      const title = card.querySelector('.task-title').textContent.toLowerCase();
      const desc = card.querySelector('.task-desc').textContent.toLowerCase();
      if (title.includes(searchValue) || desc.includes(searchValue)) {
        card.style.display = '';
        anyVisible = true;
      } else {
        card.style.display = 'none';
      }
    });

    const noResultsMsg = document.getElementById('no-results-message');
    if (searchValue && !anyVisible) {
      noResultsMsg.style.display = 'flex';
    } else {
      noResultsMsg.style.display = 'none';
    }
  });
}
