// Checks if the screen width is below 1100px
export const mediaQuery = window.matchMedia("(max-width: 1100px)");

/** Handles responsive design changes when the media query state changes */
export function handleMediaQueryChange(e) {
  if (e.matches) {
    showResponsiveAdd();
    hideIfSlideIn();
  } else {
    hideResponsiveAdd();
  }
}

/** Shows the responsive 'add contact' button for small screens */
function showResponsiveAdd() {
  const el = document.getElementById('responsive-small-add');
  if (el) el.classList.remove('d-none');
}

/** Hides the responsive 'add contact' button if right-section is slided in */
function hideIfSlideIn() {
  const rightSection = document.getElementById('right-section');
  if (!rightSection) return;
  rightSection.classList.forEach(cls => {
    if (cls === 'slide-in') hideResponsiveAdd();
  });
}

/** Hides the responsive 'add contact' button */
function hideResponsiveAdd() {
  const el = document.getElementById('responsive-small-add');
  if (el) el.classList.add('d-none');
}
