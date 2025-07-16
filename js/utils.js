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

  const maxIcons = 3;
  const visible = assigned.slice(0, maxIcons);
  const hiddenCount = assigned.length - maxIcons;

  visible.forEach(item => {
    const name = typeof item === 'string' ? item : item.name;
    const displayName = name === localStorage.getItem('userName') ? `${name}${youLabel}` : name;
    const initials = name.split(' ').map(part => part[0]?.toUpperCase()).join('').slice(0, 2);
    
    const initialsDiv = document.createElement('div');
    initialsDiv.classList.add(className);
    initialsDiv.textContent = initials;
    initialsDiv.style.backgroundColor = getColorForName(name);
    container.appendChild(initialsDiv);
  });

  if (hiddenCount > 0) {
    const moreDiv = document.createElement('div');
    moreDiv.classList.add(className, 'initials-extra');
    moreDiv.textContent = `+${hiddenCount}`;
    moreDiv.title = `${hiddenCount} weitere Person${hiddenCount > 1 ? 'en' : ''}`;
    container.appendChild(moreDiv);
  }
}
