
export function getColorForName(name) {
    const colors = [
        '#FF5733', '#33B5FF', '#33FF99', '#FF33EC', '#ffcb20',
        '#9D33FF', '#33FFDA', '#FF8C33', '#3385FF', '#FF3333'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    };
    return colors[Math.abs(hash) % colors.length];
};


export function createCard(assignedList) {
    const card = document.createElement('div');
    card.id = 'edit-assigned';
    card.className = 'assigned-list';
    assignedList.forEach(name => card.appendChild(createAssignedItem(name)));
    return card;
};


function createAssignedItem(name) {
    const item = document.createElement('div');
    item.classList.add('assigned-item', 'd-flex');
    item.appendChild(createInitialsDiv(name));
    item.appendChild(createNameDiv(name));
    return item;
};


function createInitialsDiv(name) {
    const div = document.createElement('div');
    div.classList.add('initials-task-overlay');
    div.style.backgroundColor = getColorForName(name);
    div.textContent = name
        .split(" ")
        .map(part => part[0]?.toUpperCase())
        .join("");
    return div;
};


function createNameDiv(name) {
    const div = document.createElement('div');
    div.classList.add('full-name');
    // if(name == localStorage.getItem('userName')) name += ' (you)';
    div.textContent = name;
    return div;
};