import { db } from "./firebase-config.js";
import { ref, onValue, update, push, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

let subtasks = [];
let contacts = [];
let assignedTo = [];

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
    if (document.getElementById('editing-urgent-btn').classList.contains('urgent-btn-active')) {
        return 'urgent';
    };
    if (document.getElementById('editing-medium-btn').classList.contains('medium-btn-active')) {
        return 'medium';
    };
    if (document.getElementById('editing-low-btn').classList.contains('low-btn-active')) {
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


function createDropdownItem(contact) {
    const initials = contact.name.split(" ").map(p => p[0]?.toUpperCase()).join("");
    const color = getColorForName(contact.name);
    const item = document.createElement('div');
    item.innerHTML = `
        <label class="form-selected-contact">
            <input type="checkbox" value="${contact.email}" data-name="${contact.name}" />
            ${contact.name}
            <div class="assigned-initials" style="background-color:${color};">${initials}</div>
        </label>`;
    return item;
};


function populateContactsDropdown() {
    const list = document.getElementById('contacts-dropdown-list');
    list.innerHTML = "";
    contacts.sort((a, b) => a.name.localeCompare(b.name)).forEach(c => {
        list.appendChild(createDropdownItem(c));
    });
    list.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const { value: email, dataset: { name }, checked } = checkbox;
            assignedTo = checked
                ? [...assignedTo, { email, name }]
                : assignedTo.filter(c => c.email !== email);
            updateAssignedToUI();
            updateCreateTaskBtn();
        });
    });
};


function updateAssignedToUI() {
    const selectedDiv = document.getElementById('contacts-selected');
    if (assignedTo.length === 0) {
        selectedDiv.textContent = 'Select contact(s)';
        return;
    }

    selectedDiv.innerHTML = '';
    assignedTo.forEach(contact => {
        const selectedContact = document.createElement('div');
        selectedContact.classList.add('contact-selected');
        selectedContact.textContent = contact.name;
        selectedDiv.appendChild(selectedContact);
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
        btn.onmouseover = () => img.src = `assets/img/${icon}-hover.png`;
        btn.onmouseout = () => {
            if (!btn.classList.contains(`${id}-active`))
                img.src = `assets/img/${icon}.png`;
        };
    });
};


function init() {
    const createBtn = document.getElementById('create-task-btn');
    createBtn.disabled = true;
    createBtn.classList.add('disabled');
    document.getElementById('add-task-form').onsubmit = createTask;
    document.querySelector('.subtask-button').onclick = addNewSubtask;
    document.getElementById('clear-btn').onclick = clearForm;
    initDropdownHandling();
    document.getElementById('subtask').addEventListener('keypress', e => {
        if (e.key === 'Enter') e.preventDefault(), addNewSubtask();
    });
    updateInputs();
};


function initDropdownHandling() {
    const dropdown = document.getElementById('contacts-dropdown-list');
    const toggle = document.getElementById('contacts-selected');

    toggle.addEventListener('click', () => dropdown.classList.toggle('show'));

    document.addEventListener('click', e => {
        if (!dropdown.contains(e.target) && !toggle.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
};


function clearForm() {
    const createBtn = document.getElementById('create-task-btn');
    createBtn.disabled = true;
    createBtn.classList.add('disabled');
    document.querySelectorAll('.all-priority-btns').forEach(btn => {
        btn.classList.remove('urgent-btn-active', 'medium-btn-active', 'low-btn-active');
        btn.querySelector('img').src = `assets/img/${btn.id}-icon.png`;
    });
    assignedTo = [];
    updateAssignedToUI();
    document.querySelectorAll('#contacts-dropdown-list input[type="checkbox"]').forEach(checkBox => checkBox.checked = false);
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