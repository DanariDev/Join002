export function initTaskCardClicks(openOverlay) {
  document.querySelectorAll('.task-column').forEach(column => {
    column.addEventListener('click', function (event) {
      const card = event.target.closest('.task-card');
      if (card) {
        const id = card.getAttribute('data-id');
        if (id) openOverlay(id);
      }
    });
  });
}