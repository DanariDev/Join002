/**
 * Generates a background color for initials based on the name
 * @param {string} name - The name of the contact
 * @returns {string} - A color value
 */
export function getColorForName(name) {
  const colors = ['#FF5733', '#33B5FF', '#33FF99', '#FF33EC', '#ffcb20', '#9D33FF', '#33FFDA', '#FF8C33', '#3385FF', '#FF3333'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Renders initials for assigned contacts in a container
 * @param {HTMLElement} container - The container element for initials
 * @param {Array<string>|Array<{name: string, email: string}>} assigned - Array of assigned names or contact objects
 * @param {string} [className='initials-task'] - CSS class for the initials element
 * @param {string} [youLabel=' (you)'] - Label to append for the current user
 */
export function renderInitials(container, assigned, className = 'initials-task', youLabel = ' (you)') {
  container.innerHTML = '';
  container.classList.add('d-flex');
  if (Array.isArray(assigned) && assigned.length > 0) {
    assigned.forEach(item => {
      const name = typeof item === 'string' ? item : item.name;
      const displayName = name === localStorage.getItem('userName') ? `${name}${youLabel}` : name;
      const initials = name.split(' ').map(p => p[0]?.toUpperCase()).join('').slice(0, 2);
      const initialsDiv = document.createElement('div');
      initialsDiv.classList.add(className);
      initialsDiv.textContent = initials;
      initialsDiv.style.backgroundColor = getColorForName(name);
      container.appendChild(initialsDiv);
    });
  }
}

/**
 * Retrieves the trimmed value of an element by CSS selector
 * @param {string} selector - CSS selector for the input element
 * @returns {string} - Trimmed value or empty string if not found
 */
export const getValue = (selector) => document.querySelector(selector)?.value.trim() || "";

/**
 * Loads contacts from Firebase
 * @param {Object} db - Firebase database instance
 * @returns {Promise<Array>} - Array of contacts
 */
export async function loadContacts(db) {
  const snapshot = await get(ref(db, "contacts"));
  return snapshot.val() ? Object.values(snapshot.val()) : [];
}

/**
 * Creates a dropdown item for a contact
 * @param {Object} contact - Contact object with name and email
 * @param {Array} assignedTo - Array of assigned contacts
 * @returns {HTMLElement} - Dropdown item element
 */
export function createDropdownItem(contact, assignedTo) {
  const name = contact.name === localStorage.getItem('userName') ? `${contact.name} (you)` : contact.name;
  const initials = contact.name.split(" ").map(p => p[0]?.toUpperCase()).join("");
  const color = getColorForName(contact.name);
  const item = document.createElement("div");
  item.innerHTML = `
    <label class="form-selected-contact ${assignedTo.some(a => a.email === contact.email) ? "form-selected-contact-active" : ""}">
      <input type="checkbox" value="${contact.email}" data-name="${contact.name}" ${assignedTo.some(a => a.email === contact.email) ? "checked" : ""} />
      ${name}
      <div class="assigned-initials" style="background-color:${color}">${initials}</div>
    </label>`;
  return item;
}

/**
 * Populates the contacts dropdown with sorted contacts
 * @param {string} listId - ID of the dropdown list element
 * @param {Array} contacts - Array of contacts
 * @param {Array} assignedTo - Array of assigned contacts
 * @param {boolean} showOnlyAssigned - Whether to show only assigned contacts
 * @param {Function} onChange - Callback for checkbox changes
 */
export function populateContactsDropdown(listId, contacts, assignedTo, showOnlyAssigned = false, onChange) {
  const list = document.getElementById(listId);
  list.innerHTML = showOnlyAssigned && !assignedTo.length
    ? `<div class="no-contacts-slected">No contacts were selected</div>`
    : contacts
        .filter(c => !showOnlyAssigned || assignedTo.some(a => a.email === c.email))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(c => {
          const item = createDropdownItem(c, assignedTo);
          const checkbox = item.querySelector('input[type="checkbox"]');
          checkbox.addEventListener("change", (e) => {
            const checked = e.target.checked;
            if (checked) assignedTo.push({ email: c.email, name: c.name });
            else assignedTo = assignedTo.filter(a => a.email !== c.email);
            item.querySelector(".form-selected-contact").classList.toggle("form-selected-contact-active", checked);
            if (onChange) onChange(assignedTo);
          });
          return item;
        })
        .map(item => item.outerHTML)
        .join("");
}

/**
 * Renders a list of subtasks
 * @param {string} listId - ID of the subtask list element
 * @param {Array} subtasks - Array of subtasks
 */
export function renderSubtasks(listId, subtasks) {
  const list = document.getElementById(listId);
  list.innerHTML = subtasks.map(sub => `<li>${sub.text}</li>`).join("");
}

/**
 * Adds a new subtask from an input field
 * @param {string} inputId - ID of the input element
 * @param {string} listId - ID of the subtask list
 * @param {Array} subtasks - Array to store subtasks
 */
export function addSubtask(inputId, listId, subtasks) {
  const text = getValue(`#${inputId}`);
  if (text) {
    subtasks.push({ text, done: false });
    document.getElementById(inputId).value = "";
    renderSubtasks(listId, subtasks);
  }
}