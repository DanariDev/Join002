import { db } from "./firebase-config.js";
import { createCard, getColorForName } from "./createContacts.js";
import {
    ref,
    update,
    remove,
    get,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

let editingSubtasks = [];
let assignedTo = [];

async function loadContactOptions(assignedTo) {
    const assignedList = Array.isArray(assignedTo)
        ? assignedTo
        : (typeof assignedTo === 'string' && assignedTo.trim())
            ? [assignedTo.trim()] : [];
    const wrapper = document.getElementById('popup-assigned');
    wrapper.innerHTML = `<span class="overlay-key">Assigned to:</span>`;
    wrapper.appendChild(createCard(assignedList));
};

function taskPopupHtmlTemplate(task) {
    const formattedDate = task.dueDate.split('-').reverse().join('/');
    const selectedPriority = task.priority.charAt(0).toUpperCase() + task.priority.slice(1).toLowerCase();
    document.getElementById('popup-title').innerHTML = `<h3 id="edit-title" class="title-input">${task.title}</h3>`;
    document.getElementById('popup-description').innerHTML = `<p id="edit-description">${task.description}</p>`;
    document.getElementById('popup-due-date').innerHTML = `<p id="edit-due-date" class="tab-size"><span class="overlay-key">Due date:</span> ${formattedDate}</p>`;
    document.getElementById('popup-category').innerHTML = `<p class="task-label-overlay">${task.category}</p>`;
    loadContactOptions(task.assignedTo || []);
    document.getElementById('popup-priority').innerHTML = `<p><span class="overlay-key">Priority:</span> ${selectedPriority}</p>`;
};

function createSubtaskItem(task, subtask, index) {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = subtask.done;
    checkbox.onchange = () => toggleSubtask(task.id, index, checkbox.checked);
    const span = document.createElement('span');
    span.textContent = subtask.text;
    span.classList.add('subtask-overlay-list');
    li.appendChild(checkbox);
    li.append(" ");
    li.appendChild(span);
    return li;
};

function createPopupSubtask(task) {
    const subtaskList = document.getElementById('popup-subtasks');
    subtaskList.innerHTML = "";
    if (!task.subtasks || task.subtasks.length === 0) return;
    task.subtasks.forEach((subtask, i) => {
        const li = createSubtaskItem(task, subtask, i);
        subtaskList.appendChild(li);
    });
};

export function renderPopup(task) {
    const overlay = document.getElementById('task-overlay');
    overlay.classList.replace('d-none', 'd-flex');
    overlay.dataset.taskId = task.id;
    taskPopupHtmlTemplate(task)
    createPopupSubtask(task)
    getLabelColor()
    document.getElementById('overlay-close').addEventListener('click', closePopup);
    document.getElementById('delete-task-btn').onclick = () => opendeleteQuery(task.id);
    document.getElementById('edit-task-btn').onclick = () => editTask(task.id);
};

function getLabelColor() {
    const label = document.querySelector('.task-label-overlay');
    const text = label.textContent.trim();
    if (text === 'Technical Task') {
        label.classList.add('green-background');
    } else if (text === 'User Story') {
        label.classList.add('blue-background');
    };
};

function closePopup() {
    const taskOverlay = document.getElementById('task-overlay');
    const addTaskOverlay = document.getElementById('add-task-overlay');
    const editTaskOverlay = document.getElementById('edit-task-overlay');
    document.getElementById('formContainer').innerHTML = '';
    if (taskOverlay?.classList.contains('d-flex')) {
        taskOverlay.classList.replace('d-flex', 'd-none');
    }
    if (addTaskOverlay?.style.display === 'flex') {
        addTaskOverlay.style.display = 'none';
        document.getElementById('form-add-task').style.display = 'none';
    }
    if (editTaskOverlay?.classList.contains('d-flex')) {
        editTaskOverlay.classList.replace('d-flex', 'd-none');
    }
    location.reload();
};

function initOverlayCloseHandler() {
    document.addEventListener('click', function (event) {
        const configs = [
            {
                overlay: document.getElementById('task-overlay'),
                content: document.querySelector('#task-overlay .overlay-content'),
                isVisible: el => el?.classList.contains('d-flex')
            },
            {
                overlay: document.getElementById('add-task-overlay'),
                content: document.querySelector('#add-task-overlay #form-add-task'),
                isVisible: el => el?.style.display === 'flex'
            },
            {
                overlay: document.getElementById('edit-task-overlay'),
                content: document.querySelector('#edit-task-overlay .edit-task-main'),
                isVisible: el => el?.classList.contains('d-flex')
            }
        ];
        for (const { overlay, content, isVisible } of configs) {
            if (isVisible(overlay) && !content?.contains(event.target) && overlay.contains(event.target)) {
                closePopup();
                break;
            }
        }
    });
};

function toggleSubtask(taskId, index, checked) {
    const taskRef = ref(db, `tasks/${taskId}/subtasks/${index}`);
    update(taskRef, { done: checked });
};

/**
 * This function opens delete Query and assigns an on-click function to the buttons and the query-body
 * 
 * @param {string} taskId -This string is assigned here so that the correct task is deleted
 */
function opendeleteQuery(taskId){
  document.getElementById('query-window').classList.remove('d-none');
  document.getElementById("cancel-delete-button").onclick = () => deleteQuery(false, taskId, event);
  document.getElementById("query-window").onclick = () => deleteQuery(false, taskId, event);
  document.getElementById("yes-delete-button").onclick = () => deleteQuery(true, taskId, event);
}

/**
 * This functions carry out the query as to whether or not should be deleted
 * 
 * @param {boolean} deleteT - Gives back whether or not should be deleted
 * @param {string} taskId -This string is assigned here so that the correct task is deleted
 * @param {object} event - Event is needed to stop propagation
 */
function deleteQuery(deleteT, taskId, event){
  event.stopPropagation();
  document.getElementById('query-window').classList.add('d-none');
  deleteTask(taskId, deleteT);
}

function deleteTask(taskId, deleteT) {
    if (deleteT) {
        remove(ref(db, `tasks/${taskId}`)).then(() => {
            closePopup();
            document.querySelector(`[data-id='${taskId}']`)?.remove();
        });
    }
};

async function loadContacts() {
    const snapshot = await get(ref(db, 'contacts'));
    const data = snapshot.val();
    return data ? Object.values(data) : [];
};

function updateAssignedToUI() {
    const selectedDiv = document.getElementById('editing-contacts-selected');
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

async function editTask(taskId) {
    const taskData = getCurrentValues();
    openEditOverlay();
    fillTaskForm(taskData);
    prepareSubtasks(taskData.subtasks);
    setupPriorityButtons(taskData.priority);
    await setupContactsDropdown(taskData.assignedTo);
    updateSaveEditBtn();
};

function openEditOverlay() {
    const overlay = document.getElementById('edit-task-overlay');
    overlay.classList.replace('d-none', 'd-flex');
    document.getElementById('editing-cancel-btn').addEventListener('click', closePopup);
};

function fillTaskForm(task) {
    document.getElementById('editing-title').value = task.title;
    document.getElementById('editing-description').value = task.description;
    document.getElementById('editing-date').value = formatDateToInput(task.dueDate);
    document.getElementById('editing-category').value = task.category;
};

function prepareSubtasks(subtasks) {
    editingSubtasks = (Array.isArray(subtasks) ? subtasks : []).map(sub => ({
        text: typeof sub === 'string' ? sub : (sub?.text || ''),
        done: !!sub?.done
    }));
    renderEditingSubtasks();
};

function setupPriorityButtons(priorityValue) {
    const priorities = ['urgent', 'medium', 'low'];
    const current = priorityValue?.toLowerCase();
    priorities.forEach(prio => {
        const btn = document.getElementById(`editing-${prio}-btn`);
        btn.classList.remove(`${prio}-btn-active`);
        btn.onclick = () => {
            priorities.forEach(other =>
                document.getElementById(`editing-${other}-btn`).classList.remove(`${other}-btn-active`)
            );
            btn.classList.add(`${prio}-btn-active`);
            updateSaveEditBtn();
        };
        if (prio === current) btn.classList.add(`${prio}-btn-active`);
    });
};

async function setupContactsDropdown(assignedNames) {
    const allContacts = await loadContacts();
    allContacts.sort((a, b) => a.name.localeCompare(b.name))
    const dropdownList = document.getElementById('editing-contacts-dropdown-list');
    const dropdownSelected = document.getElementById('editing-contacts-selected');
    assignedTo = [];
    dropdownList.innerHTML = '';
    dropdownSelected.innerHTML = '';
    dropdownList.classList.remove('show');
    allContacts.forEach(contact => {
        const entry = createContactEntry(contact, assignedNames);
        dropdownList.appendChild(entry.wrapper);
        if (entry.checked) assignedTo.push({ name: contact.name, email: contact.email });
    });
    updateAssignedToUI();
    dropdownSelected.onclick = (e) => {
        e.stopPropagation();
        dropdownList.classList.toggle('show');
    };
    window.addEventListener('click', (event) => {
        if (
            !dropdownList.contains(event.target) &&
            !dropdownSelected.contains(event.target)
        ) {
            dropdownList.classList.remove('show');
        }
    });
};

function createContactEntry(contact, assignedNames) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = contact.email;
    checkbox.dataset.name = contact.name;
    checkbox.checked = assignedNames.includes(contact.name);
    checkbox.onclick = e => e.stopPropagation();

    checkbox.onchange = () => {
        if (checkbox.checked) {
            assignedTo.push({ name: contact.name, email: contact.email });
        } else {
            assignedTo = assignedTo.filter(c => c.email !== contact.email);
        }
        updateAssignedToUI();
        updateSaveEditBtn();
    };
    const initials = contact.name
        .split(' ')
        .map(part => part[0]?.toUpperCase())
        .join('')
        .slice(0, 2);

    const editInitials = document.createElement('div');
    editInitials.classList.add('assigned-initials');
    editInitials.textContent = initials;
    editInitials.style.backgroundColor = getColorForName(contact.name);
    const label = document.createElement('label');
    label.textContent = contact.name;
    label.classList.add('form-selected-contact');
    label.prepend(checkbox);
    label.appendChild(editInitials);
    const wrapper = document.createElement('div');
    wrapper.classList.add('contact-entry');
    wrapper.appendChild(label);
    return { wrapper, checked: checkbox.checked };
};

function updateSaveEditBtn() {
    const title = document.getElementById('editing-title').value.trim();
    const description = document.getElementById('editing-description').value.trim();
    const date = document.getElementById('editing-date').value;
    const category = document.getElementById('editing-category').value;
    const saveBtn = document.getElementById('editing-save-btn');
    const allFilled = title && description && date && category && assignedTo.length > 0;
    saveBtn.disabled = !allFilled;
    saveBtn.classList.toggle('disabled', !allFilled);
};

function formatDateToInput(dateStr) {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

function getCurrentValues() {
    const category = document.querySelector('.task-label-overlay').textContent;
    const title = document.getElementById('edit-title').innerHTML.trim();
    const description = document.getElementById('edit-description').innerHTML.trim();
    const dueDate = document.getElementById('edit-due-date').textContent.replace('Due date:', '').trim();
    const priority = document.getElementById('popup-priority').textContent.replace('Priority:', '').trim();
    const names = document.querySelectorAll('#edit-assigned .full-name');
    const assignedTo = Array.from(names).map(el => el.textContent.trim());
    const subtaskElements = document.querySelectorAll('#popup-subtasks .subtask-overlay-list');
    const subtasks = Array.from(subtaskElements).map(el => el.textContent.trim());
    return { category, title, description, dueDate, priority, assignedTo, subtasks };
};

function addSubtaskFromInput() {
    const input = document.getElementById('editing-subtask');
    const text = input.value.trim();
    if (!text) return;
    editingSubtasks.push({ text, done: false });
    renderEditingSubtasks();
    input.value = '';
    updateSaveEditBtn?.();
};

function renderEditingSubtasks() {
    const ul = document.getElementById('editing-subtask-list');
    ul.innerHTML = '';
    editingSubtasks.forEach((sub, index) => {
        const image = document.createElement('img');
        image.src = './assets/img/delete.png';
        const li = document.createElement('li');
        li.textContent = sub.text;
        li.dataset.index = index;
        li.appendChild(image);
        image.addEventListener('click', () => {
            editingSubtasks.splice(index, 1);
            renderEditingSubtasks();
            updateSaveEditBtn?.();
        });
        ul.appendChild(li);
    });
};

async function handleSaveEditTask() {
    const taskId = document.getElementById('task-overlay').dataset.taskId;
    if (!taskId) return;
    const title = document.getElementById('editing-title').value.trim();
    const description = document.getElementById('editing-description').value.trim();
    const dueDate = document.getElementById('editing-date').value;
    const category = document.getElementById('editing-category').value;
    const priority = ['urgent', 'medium', 'low'].find(prio =>
        document.getElementById(`editing-${prio}-btn`).classList.contains(`${prio}-btn-active`)
    );
    const fullTask = {
        id: taskId,
        title,
        description,
        dueDate,
        category,
        priority,
        assignedTo: assignedTo.map(a => a.name),
        subtasks: editingSubtasks
    };
    await update(ref(db, `tasks/${taskId}`), fullTask);
    closePopup();
};

function initSubtaskInputAndSaveListener() {
    document.getElementById('editing-subtask').addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSubtaskFromInput();
        }
    });
    document.querySelector('.subtask-button').addEventListener('click', addSubtaskFromInput);
    document.getElementById('editing-save-btn').addEventListener('click', handleSaveEditTask);
};

function init() {
    initOverlayCloseHandler();
    initSubtaskInputAndSaveListener()
};

init()