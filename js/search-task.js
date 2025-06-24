/**
 * Adds an input event listener to the search input field to filter tasks based on search term
 */
document.getElementById("search-input").addEventListener("input", function () {
    /**
     * The search term entered by the user, trimmed and converted to lowercase
     * @type {string}
     */
    const searchTerm = this.value.trim().toLowerCase();
    
    /**
     * All task card elements in the DOM
     * @type {NodeList}
     */
    const allTasks = document.querySelectorAll('.task-card');

    allTasks.forEach(card => {
        /**
         * The task title text, converted to lowercase
         * @type {string}
         */
        const title = card.querySelector('.task-title')?.textContent.toLowerCase();
        
        /**
         * The task description text, converted to lowercase
         * @type {string}
         */
        const desc = card.querySelector('.task-desc')?.textContent.toLowerCase();
        
        /**
         * Whether the search term matches the title or description
         * @type {boolean}
         */
        const matches = title.includes(searchTerm) || desc.includes(searchTerm);

        /**
         * Sets the display style of the task card based on whether it matches the search term
         * Shows the card if the search term is empty or if it matches the title/description
         */
        card.style.display = (searchTerm === "" || matches) ? 'grid' : 'none';
    });
});