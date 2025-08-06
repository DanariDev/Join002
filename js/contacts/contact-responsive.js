export const mediaQuery = window.matchMedia("(max-width: 1100px)");

/** Handles responsive design changes */
export function handleMediaQueryChange(e) {
  if (e.matches) {
    showResponsiveAdd();
    hideIfSlideIn();
  } else {
    hideResponsiveAdd();
  }
}

function showResponsiveAdd() {
  const el = document.getElementById('responsive-small-add');
  if (el) el.classList.remove('d-none');
}
function hideIfSlideIn() {
  const rightSection = document.getElementById('right-section');
  if (!rightSection) return;
  rightSection.classList.forEach(cls => {
    if (cls === 'slide-in') hideResponsiveAdd();
  });
}
function hideResponsiveAdd() {
  const el = document.getElementById('responsive-small-add');
  if (el) el.classList.add('d-none');
}
