document.getElementById("search-input").addEventListener("input", function () {
    const searchTerm = this.value.trim().toLowerCase();
    const allTasks = document.querySelectorAll('.task-card');
    let foundResults = false;
  
    allTasks.forEach(card => {
      const title = card.querySelector('.task-title')?.textContent.toLowerCase() || "";
      const desc = card.querySelector('.task-desc')?.textContent.toLowerCase() || "";
  
      const matches = title.includes(searchTerm) || desc.includes(searchTerm);
  
      card.style.display = matches || searchTerm === "" ? "grid" : "none";
  
      if (matches) {
        foundResults = true;
      }
    });
  
    const noResultsMessage = document.getElementById("no-results-message");
    noResultsMessage.style.display = !foundResults && searchTerm !== "" ? "flex" : "none";
  });
  