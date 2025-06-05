import { db } from "./firebase-config.js";
import { ref, onValue, update, push, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

let subtasks = [];
let contacts = [];

function getValue(selector) {
    const element = document.querySelector(selector);
    return element ? element.value.trim() : "";
};

function getColorForName(name) {
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

function getPriority() {
    if (document.getElementById('urgent-btn').classList.contains('urgent-btn-active')) {
        return 'urgent';
    };
    if (document.getElementById('medium-btn').classList.contains('medium-btn-active')) {
        return 'medium';
    };
    if (document.getElementById('low-btn').classList.contains('low-btn-active')) {
        return 'low';
    };
    return 'medium';
};

function renderSubtasks() {
    const list = document.getElementById('subtask-list');
    list.innerHTML = "";
    for (let i = 0; i < subtasks.length; i++) {
        const li = document.createElement('li');
        li.textContent = subtasks[i].text;
        list.appendChild(li);
    };
};

function addNewSubtask() {
    const input = document.getElementById('subtask');
    const text = input.value.trim();
    if (text) {
        subtasks.push({ text: text, done: false });
        input.value = "";
        renderSubtasks();
    };
};

let assignedTo = [];

function populateContactsDropdown() {
    const dropdownList = document.getElementById('contacts-dropdown-list');
    dropdownList.innerHTML = "";

    for (let contact of contacts.sort((selected, compare) => selected.name.localeCompare(compare.name))) {
        const initials = contact.name
            .split(" ")
            .map(part => part[0]?.toUpperCase())
            .join("");

        const color = getColorForName(contact.name);

        const item = document.createElement('div');
        item.innerHTML = `
        
            <label class="form-selected-contact">
                <input type="checkbox" value="${contact.email}" data-name="${contact.name}" />
                
                ${contact.name}<div class="assigned-initials" style="background-color: ${color};">${initials}</div>
            </label>
        `;
        dropdownList.appendChild(item);
    }

    dropdownList.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', function () {
            const email = this.value;
            const name = this.dataset.name;

            if (this.checked) {
                assignedTo.push({ email, name });
            } else {
                assignedTo = assignedTo.filter(c => c.email !== email);
            }

            updateAssignedToUI();
            updateCreateTaskBtn();
        });
    });
}

function updateAssignedToUI() {
    const selectedDiv = document.getElementById('contacts-selected');
    if (assignedTo.length === 0) {
        selectedDiv.textContent = 'Select contact(s)';
        return;
    }

    selectedDiv.innerHTML = '';
    assignedTo.forEach(contact => {
        const chip = document.createElement('div');
        chip.classList.add('contact-chip');
        chip.textContent = contact.name;
        selectedDiv.appendChild(chip);
    });
};

function loadContacts() {
    const snapshot = get(ref(db, 'contacts'));
    snapshot.then(function (snap) {
        const data = snap.val();
        contacts = data ? Object.values(data) : [];
        populateContactsDropdown();
    });
};

function createTask(event) {
    event.preventDefault();
    const task = {
        title: getValue('#title'),
        description: getValue('#description'),
        dueDate: getValue('#date'),
        category: getValue('#category'),
        assignedTo: assignedTo.map(c => c.name),
        priority: getPriority(),
        subtasks: subtasks,
        status: 'todo'
    };
    validateAndSaveTask(task);
};

function validateAndSaveTask(task) {
    if (!task.title || !task.dueDate || !task.category || !task.assignedTo) {
        alert("Bitte fülle alle Pflichtfelder aus!");
        return;
    };
    push(ref(db, 'tasks'), task).then(function () {
        alert("Aufgabe erfolgreich gespeichert!");
        resetForm();

        window.location.href = "board.html";
    });
};

function resetForm() {
    document.getElementById('add-task-form').reset();
    subtasks = [];
    renderSubtasks();
    updateCreateTaskBtn();
    updatePriorityButtons();
};

function updateCreateTaskBtn() {
    const title = getValue('#title');
    const date = getValue('#date');
    const category = getValue('#category');
    const hasContacts = assignedTo.length > 0;

    const allFilled = title && date && category && hasContacts;
    const createBtn = document.getElementById('create-task-btn');
    createBtn.disabled = !allFilled;
    createBtn.classList.toggle('disabled', !allFilled);
};

function updatePriorityButtons() {
    const buttons = document.querySelectorAll('.urgent-btn, .medium-btn, .low-btn');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    };
    const priority = getPriority();
    const activeBtn = document.querySelector("." + priority + "-btn");
    if (activeBtn) activeBtn.classList.add('active');
};

function togglePriorityBtnUrgent() {
    const btn = document.getElementById('urgent-btn');
    const img = btn.querySelector('img');
    btn.onclick = function () {
        const isActive = btn.classList.toggle(btn.id + '-active');
        const mediumBtn = document.getElementById('medium-btn');
        const lowBtn = document.getElementById('low-btn');
        mediumBtn.classList.remove(mediumBtn.id + '-active');
        lowBtn.classList.remove(lowBtn.id + '-active');
        img.src = isActive ? 'assets/img/urgent-btn-icon-hover.png' : 'assets/img/urgent-btn-icon.png';
        mediumBtn.querySelector('img').src = 'assets/img/medium-btn-icon.png';
        lowBtn.querySelector('img').src = 'assets/img/low-btn-icon.png';
    };
};

function togglePriorityBtnMedium() {
    const btn = document.getElementById('medium-btn');
    const img = btn.querySelector('img');
    btn.onclick = function () {
        const isActive = btn.classList.toggle(btn.id + '-active');
        const urgentBtn = document.getElementById('urgent-btn');
        const lowBtn = document.getElementById('low-btn');
        urgentBtn.classList.remove(urgentBtn.id + '-active');
        lowBtn.classList.remove(lowBtn.id + '-active');
        img.src = isActive ? 'assets/img/medium-btn-icon-hover.png' : 'assets/img/medium-btn-icon.png';
        urgentBtn.querySelector('img').src = 'assets/img/urgent-btn-icon.png';
        lowBtn.querySelector('img').src = 'assets/img/low-btn-icon.png';
    };
};

function togglePriorityBtnLow() {
    const btn = document.getElementById('low-btn');
    const img = btn.querySelector('img');
    btn.onclick = function () {
        const isActive = btn.classList.toggle(btn.id + '-active');
        const urgentBtn = document.getElementById('urgent-btn');
        const mediumBtn = document.getElementById('medium-btn');
        urgentBtn.classList.remove(urgentBtn.id + '-active');
        mediumBtn.classList.remove(mediumBtn.id + '-active');
        img.src = isActive ? 'assets/img/low-btn-icon-hover.png' : 'assets/img/low-btn-icon.png';
        urgentBtn.querySelector('img').src = 'assets/img/urgent-btn-icon.png';
        mediumBtn.querySelector('img').src = 'assets/img/medium-btn-icon.png';
    };
};

function hoverPriorityBtns() {
    const btns = [
        { id: 'urgent-btn', icon: 'urgent-btn-icon' },
        { id: 'medium-btn', icon: 'medium-btn-icon' },
        { id: 'low-btn', icon: 'low-btn-icon' }
    ];

    btns.forEach(({ id, icon }) => {
        const btn = document.getElementById(id);
        const img = btn.querySelector('img');
        btn.addEventListener("mouseover", () => {
            img.src = `assets/img/${icon}-hover.png`;
        });
        btn.addEventListener("mouseout", () => {
            if (!btn.classList.contains(`${id}-active`)) {
                img.src = `assets/img/${icon}.png`;
            };
        });
    });
};

function init() {
    const createBtn = document.getElementById('create-task-btn');
    createBtn.disabled = true;
    createBtn.classList.add('disabled');
    document.getElementById('add-task-form').onsubmit = createTask;
    document.querySelector('.subtask-button').onclick = addNewSubtask;
    document.getElementById('clear-btn').onclick = clearForm;
    document.getElementById('contacts-selected').addEventListener('click', () => {
        document.getElementById('contacts-dropdown-list').classList.toggle('show');
    });
    document.addEventListener('click', function (event) {
        const dropdown = document.getElementById('contacts-dropdown-list');
        const toggle = document.getElementById('contacts-selected');
        if (!dropdown.contains(event.target) && !toggle.contains(event.target)) {
            dropdown.classList.remove('show');
        }
    });
    document.getElementById('subtask').addEventListener('keypress', function (evt) {
        if (evt.key === 'Enter') {
            evt.preventDefault();
            addNewSubtask();
        }
    });

    updateInputs();
};

function clearForm() {
    const createBtn = document.getElementById('create-task-btn');
    const priorityBtns = document.querySelectorAll('.all-priority-btns');
    createBtn.disabled = true;
    createBtn.classList.add('disabled');
    priorityBtns.forEach(btn => {
        btn.classList.remove('urgent-btn-active', 'medium-btn-active', 'low-btn-active');
        const img = btn.querySelector('img');
        if (btn.id === 'urgent-btn') img.src = 'assets/img/urgent-btn-icon.png';
        if (btn.id === 'medium-btn') img.src = 'assets/img/medium-btn-icon.png';
        if (btn.id === 'low-btn') img.src = 'assets/img/low-btn-icon.png';
    });
    assignedTo = [];
    updateAssignedToUI();
    const checkboxes = document.querySelectorAll('#contacts-dropdown-list input[type="checkbox"]');
    checkboxes.forEach(checkBox => checkBox.checked = false);
    subtasks = [];
    renderSubtasks();
};


function updateInputs() {
    const inputs = ['#title', '#date', '#category'];
    for (let i = 0; i < inputs.length; i++) {
        const input = document.querySelector(inputs[i]);
        if (input) input.oninput = updateCreateTaskBtn;
    }
};

function stopEnterKeySubmit() {
    document.removeEventListener('keypress', handleEnterKey);
    document.addEventListener('keypress', handleEnterKey);
};

function handleEnterKey(evt) {
    const node = evt.target;
    if (evt.key === 'Enter' && node.type === 'text') {
        evt.preventDefault();
    }
};

init();
loadContacts();
updatePriorityButtons();
togglePriorityBtnUrgent();
togglePriorityBtnMedium();
togglePriorityBtnLow();
hoverPriorityBtns();
updateInputs();
stopEnterKeySubmit();