document.getElementById("search-input").addEventListener("input", function () {
    const searchTerm = this.value.trim().toLowerCase();
    const allTasks = document.querySelectorAll('.task-card');
    allTasks.forEach(card => {
        const title = card.querySelector('.task-title')?.textContent.toLowerCase();
        const desc = card.querySelector('.task-desc')?.textContent.toLowerCase();
        const matches = title.includes(searchTerm) || desc.includes(searchTerm);
        card.style.display = (searchTerm === "" || matches) ? 'grid' : 'none';
    });
});
