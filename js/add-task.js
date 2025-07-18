import { db } from "./firebase-config.js";
import { getColorForName } from "./createContacts.js";
import {
  ref,
  push,
  get,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { renderInitials } from "./utils.js";
let subtasks = [];
let contacts = [];
let assignedTo = [];
let contactDropdownClickState = 0;
/**
 * Retrieves the trimmed value of an element by CSS selector
 * @param {string} selector - CSS selector for the input element
 * @returns {string} - Trimmed value of the element or empty string if not found
 */
function getValue(selector) {
  const element = document.querySelector(selector);
  return element ? element.value.trim() : "";
}

/**
 * Determines the selected priority of the task
 * @returns {string} - Priority level ('urgent', 'medium', or 'low')
 */
function getPriority() {
  if (
    document
      .getElementById("urgent-btn")
      .classList.contains("urgent-btn-active")
  ) {
    return "urgent";
  }
  if (
    document
      .getElementById("medium-btn")
      .classList.contains("medium-btn-active")
  ) {
    return "medium";
  }
  if (document.getElementById("low-btn").classList.contains("low-btn-active")) {
    return "low";
  }
  return "medium";
}

/**
 * Renders the list of subtasks in the UI
 */
function renderSubtasks() {
  const list = document.getElementById("subtask-list");
  list.innerHTML = "";
  subtasks.forEach((s, i) => {
    list.appendChild(createSubtaskElement(s, i));
  });
}
function createSubtaskElement(s, i) {
  const li = document.createElement("li");
  li.className = "subtask-item";

  const span = document.createElement("span");
  span.className = "subtask-text";
  span.textContent = s.text;

  const icons = document.createElement("div");
  const editIcon = createSubtaskIcon("edit", () => makeSubtaskEditable(li, s, i));
  const deleteIcon = createSubtaskIcon("delete", () => deleteSubtask(i));
  icons.appendChild(editIcon);
  icons.appendChild(deleteIcon);

  li.append(span, icons);

  li.addEventListener("click", (e) => {
    const isIcon = e.target.closest(".subtask-icon");
    const isInput = li.querySelector("input");
    if (!isIcon && !isInput) {
      makeSubtaskEditable(li, s, i);
    }
  });

  return li;
}

function createSubtaskIcon(type, action) {
  const icon = document.createElement("img");
  icon.src = `assets/img/${type === "edit" ? "edit.png" : "delete.png"}`;
  icon.className = "subtask-icon";
  icon.onclick = action;
  return icon;
}

function makeSubtaskEditable(li, s, i) {
  const inputWrapper = document.createElement("div");
  inputWrapper.className = "subtask-edit-wrapper";

  const input = document.createElement("input");
  input.value = s.text;
  input.className = "subtask-edit-input";

  input.onblur = () => {
    subtasks[i].text = input.value.trim();
    renderSubtasks();
  };

  input.onkeydown = (e) => {
    if (e.key === "Enter") input.blur();
  };

  const editIcon = createSubtaskIcon("edit", () => makeSubtaskEditable(li, s, i));
  const deleteIcon = createSubtaskIcon("delete", () => deleteSubtask(i));

  inputWrapper.appendChild(input);
  inputWrapper.appendChild(editIcon);
  inputWrapper.appendChild(deleteIcon);

  // Leere das <li> und füge Wrapper hinzu
  li.innerHTML = "";
  li.appendChild(inputWrapper);
  input.focus();
}



function deleteSubtask(i) {
  subtasks.splice(i, 1);
  renderSubtasks();
}

/**
 * Adds a new subtask from the input field
 */
function addNewSubtask() {
  const input = document.getElementById("subtask");
  const text = input.value.trim();
  if (text) {
    subtasks.push({ text: text, done: false });
    input.value = "";
    renderSubtasks();
  }
}

/**
 * Creates a dropdown item for a contact
 * @param {Object} contact - Contact object with name and email
 * @returns {HTMLElement} - Dropdown item element
 */
function createDropdownItem(contact) {
  let name = contact.name;
  const initials = contact.name
    .split(" ")
    .map((p) => p[0]?.toUpperCase())
    .join("");
  const color = getColorForName(contact.name);
  const item = document.createElement("div");
  if (name == localStorage.getItem("userName")) name += " (you)";
  item.innerHTML = `
        <label class="form-selected-contact">
            <input type="checkbox" value="${contact.email}" data-name="${contact.name}" />
            ${name}
            <div class="assigned-initials" style="background-color:${color};">${initials}</div>
        </label>`;
  return item;
}

/**
 * Populates the contacts dropdown with sorted contacts
 */
function populateContactsDropdown(showOnlyAssigned = false) {
  const list = document.getElementById("contacts-dropdown-list");
  list.innerHTML = "";
  const filteredContacts = showOnlyAssigned
    ? contacts.filter((c) => assignedTo.some((a) => a.email === c.email))
    : contacts;

  filteredContacts
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((c) => list.appendChild(createContactItem(c)));
}

function createContactItem(contact) {
  const item = createDropdownItem(contact);
  const checkbox = item.querySelector('input[type="checkbox"]');
  if (assignedTo.some((a) => a.email === contact.email)) {
    checkbox.checked = true;
    item
      .querySelector(".form-selected-contact")
      .classList.add("form-selected-contact-active");
  }
  checkbox.addEventListener("change", handleCheckboxChange);
  return item;
}

function handleCheckboxChange({
  target: {
    value: email,
    dataset: { name },
    checked,
  },
}) {
  assignedTo = checked
    ? [...assignedTo, { email, name }]
    : assignedTo.filter((c) => c.email !== email);

  const contactElement = this.closest(".form-selected-contact");
  contactElement.classList.toggle("form-selected-contact-active", checked);

  updateAssignedToUI();
  updateCreateTaskBtn();
}

/**
 * Updates the UI to reflect selected contacts
 */
function updateAssignedToUI() {
  const container = document.getElementById("selected-contact-insignias");
  renderInitials(container, assignedTo);
}


/**
 * Loads contacts from Firebase and populates the dropdown
 */
function loadContacts() {
  const snapshot = get(ref(db, "contacts"));
  snapshot.then(function (snap) {
    const data = snap.val();
    contacts = data ? Object.values(data) : [];
    populateContactsDropdown();
  });
}

/**
 * Creates a new task and submits it to Firebase
 * @param {Event} event - Form submission event
 */
function createTask(event) {
  event.preventDefault();

  const task = {
    title: getValue("#title"),
    description: getValue("#description"),
    dueDate: getValue("#due-date"),
    category: getValue("#category"),
    assignedTo: assignedTo.map((c) => c.name),
    priority: getPriority(),
    subtasks: subtasks,
    status: "todo",
  };

  const taskRef = ref(db, "tasks");
  push(taskRef, task)
    .then(() => {
      resetForm();
      window.location.href = "board.html";
    })
    .catch((error) => {
      console.error("Fehler beim Erstellen des Tasks:", error);
    });
}

/**
 * Resets the task form to its initial state
 */
function resetForm() {
  document.getElementById("add-task-form").reset();
  subtasks = [];
  renderSubtasks();
  updateCreateTaskBtn();
  updatePriorityButtons();
}

/**
 * Updates the create task button's enabled state based on form completion
 */
function updateCreateTaskBtn() {
  const title = getValue("#title");
  const date = getValue("#due-date");
  const category = getValue("#category");
  const allFilled = title && date && category;
  const createBtn = document.getElementById("create-task-btn");
  createBtn.disabled = !allFilled;
  createBtn.classList.toggle("disabled", !allFilled);
}

/**
 * Updates the priority buttons' active state in the UI
 */
function updatePriorityButtons() {
  const buttons = document.querySelectorAll(
    ".urgent-btn, .medium-btn, .low-btn"
  );
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active");
  }
  const priority = getPriority();
  const activeBtn = document.querySelector("." + priority + "-btn");
  if (activeBtn) activeBtn.classList.add("active");
}

/**
 * Toggles the urgent priority button and updates its icon
 */
function togglePriorityBtnUrgent() {
  const btn = document.getElementById("urgent-btn");
  const img = btn.querySelector("img");
  btn.onclick = function () {
    const isActive = btn.classList.toggle(btn.id + "-active");
    const mediumBtn = document.getElementById("medium-btn");
    const lowBtn = document.getElementById("low-btn");
    mediumBtn.classList.remove(mediumBtn.id + "-active");
    lowBtn.classList.remove(lowBtn.id + "-active");
    img.src = isActive
      ? "assets/img/urgent-btn-icon-hover.png"
      : "assets/img/urgent-btn-icon.png";
    mediumBtn.querySelector("img").src = "assets/img/medium-btn-icon.png";
    lowBtn.querySelector("img").src = "assets/img/low-btn-icon.png";
  };
}

/**
 * Toggles the medium priority button and updates its icon
 */
function togglePriorityBtnMedium() {
  const btn = document.getElementById("medium-btn");
  const img = btn.querySelector("img");
  btn.onclick = function () {
    const isActive = btn.classList.toggle(btn.id + "-active");
    const urgentBtn = document.getElementById("urgent-btn");
    const lowBtn = document.getElementById("low-btn");
    urgentBtn.classList.remove(urgentBtn.id + "-active");
    lowBtn.classList.remove(lowBtn.id + "-active");
    img.src = isActive
      ? "assets/img/medium-btn-icon-hover.png"
      : "assets/img/medium-btn-icon.png";
    urgentBtn.querySelector("img").src = "assets/img/urgent-btn-icon.png";
    lowBtn.querySelector("img").src = "assets/img/low-btn-icon.png";
  };
}

/**
 * Toggles the low priority button and updates its icon
 */
function togglePriorityBtnLow() {
  const btn = document.getElementById("low-btn");
  const img = btn.querySelector("img");
  btn.onclick = function () {
    const isActive = btn.classList.toggle(btn.id + "-active");
    const urgentBtn = document.getElementById("urgent-btn");
    const mediumBtn = document.getElementById("medium-btn");
    urgentBtn.classList.remove(urgentBtn.id + "-active");
    mediumBtn.classList.remove(mediumBtn.id + "-active");
    img.src = isActive
      ? "assets/img/low-btn-icon-hover.png"
      : "assets/img/low-btn-icon.png";
    urgentBtn.querySelector("img").src = "assets/img/urgent-btn-icon.png";
    mediumBtn.querySelector("img").src = "assets/img/medium-btn-icon.png";
  };
}

/**
 * Adds hover effects to priority buttons
 */
function hoverPriorityBtns() {
  const btns = [
    { id: "urgent-btn", icon: "urgent-btn-icon" },
    { id: "medium-btn", icon: "medium-btn-icon" },
    { id: "low-btn", icon: "low-btn-icon" },
  ];
  btns.forEach(({ id, icon }) => {
    const btn = document.getElementById(id);
    const img = btn.querySelector("img");
    btn.onmouseout = () => {
      if (!btn.classList.contains(`${id}-active`))
        img.src = `assets/img/${icon}.png`;
    };
  });
}
function validateDateField() {
  const dateInput = document.getElementById("due-date");
  const errorMessage = document.getElementById("error-message");
  const today = new Date().toISOString().split("T")[0];

  if (dateInput.value < today) {
    errorMessage.textContent = "The due date cannot be in the past.";
    errorMessage.style.color = "red";
    dateInput.value = "";
    return false;
  } else {
    errorMessage.textContent = "";
    return true;
  }
}

/**
 * Initializes event listeners and form state
 */
function init() {
  const dateInput =
    document.getElementById("date") ?? document.getElementById("due-date");
  const createBtn = document.getElementById("create-task-btn");
  const today = new Date().toISOString().split("T")[0];
  createBtn.disabled = true;
  createBtn.classList.add("disabled");
  createBtn.addEventListener("click", (e) => {
    e.preventDefault();
    createTask(e);
  });
  document.getElementById("add-task-form").onsubmit = createTask;
  document.querySelector(".subtask-button").onclick = addNewSubtask;
  document.getElementById("clear-btn").onclick = clearForm;
  initDropdownHandling();

  document.getElementById("subtask").addEventListener("keypress", (e) => {
    if (e.key === "Enter") e.preventDefault(), addNewSubtask();
  });

  updateInputs();

  dateInput.addEventListener("blur", validateDateField);
  dateInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      validateDateField();
    }
  });

  dateInput.min = today;
  dateInput.value = today;
}

/**
 * Initializes dropdown toggle behavior for contacts selection
 */
function initDropdownHandling() {
  const dropdown = document.getElementById("contacts-dropdown-list");
  const toggle = document.getElementById("contacts-selected");

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    contactDropdownClickState++;

    if (contactDropdownClickState === 1) {
      dropdown.classList.add("show");
      populateContactsDropdown(false); // Alle Kontakte
    } else if (contactDropdownClickState === 2) {
      populateContactsDropdown(true); // Nur ausgewählte
      if (document.querySelectorAll(".form-selected-contact").length < 1) {
        document.getElementById("contacts-dropdown-list").innerHTML = ``;
      }
    } else {
      dropdown.classList.remove("show");
      contactDropdownClickState = 0;
      updateAssignedToUI();
    }
  });

  // Kontakt-Auswahl offen lassen beim Klicken
  document.addEventListener("mousedown", (e) => {
    const path = e.composedPath ? e.composedPath() : e.path || [];
    const isInside = path.some(
      (el) =>
        el?.id === "contacts-dropdown-list" || el?.id === "contacts-selected"
    );

    if (!isInside) {
      dropdown.classList.remove("show");
      contactDropdownClickState = 0;
    }
  });
}

/**
 * Clears the form and resets all fields
 */
function clearForm() {
  const createBtn = document.getElementById("create-task-btn");
  createBtn.disabled = true;
  createBtn.classList.add("disabled");
  document.querySelectorAll(".all-priority-btns").forEach((btn) => {
    btn.classList.remove("urgent-btn-active", "low-btn-active");
    btn.querySelector("img").src = `assets/img/${btn.id}-icon.png`;
  });
  assignedTo = [];
  updateAssignedToUI();
  document
    .querySelectorAll('#contacts-dropdown-list input[type="checkbox"]')
    .forEach((checkBox) => (checkBox.checked = false));
  subtasks = [];
  renderSubtasks();
}

/**
 * Adds input event listeners to form fields to update the create button
 */
function updateInputs() {
  const inputs = ["#title", "#date", "#category"];
  for (let i = 0; i < inputs.length; i++) {
    const input = document.querySelector(inputs[i]);
    if (input) input.oninput = updateCreateTaskBtn;
  }
}

/**
 * Prevents form submission on Enter key for text inputs
 */
function stopEnterKeySubmit() {
  document.removeEventListener("keypress", handleEnterKey);
  document.addEventListener("keypress", handleEnterKey);
}

/**
 * Handles Enter key press to prevent form submission
 * @param {KeyboardEvent} evt - Keypress event
 */
function handleEnterKey(evt) {
  const node = evt.target;
  if (evt.key === "Enter" && node.type === "text") {
    evt.preventDefault();
  }
}

/**
 * This function loads the add-task-overlay on the board side
 */
export function addTaskOverlayLoad() {
  clearForm();
  init();
  loadContacts();
  updatePriorityButtons();
  togglePriorityBtnUrgent();
  togglePriorityBtnMedium();
  togglePriorityBtnLow();
  hoverPriorityBtns();
  updateInputs();
  stopEnterKeySubmit();
}

window.location.pathname.split("/").forEach((element) => {
  if (element == "add-task.html") {
    addTaskOverlayLoad();
  }
});
