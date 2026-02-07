/**
 * Generates initials from a name (first two letters, uppercase).
 * @param {string} name - The full name.
 * @returns {string} The initials.
 */
export function getInitials(name) {
  return name
    .split(" ")
    .map(w => getFirstLetter(w))
    .join("")
    .slice(0, 2);
}

/**
 * Returns the uppercase first letter of a word.
 * @param {string} word - A single word.
 * @returns {string} The uppercase first letter.
 */
function getFirstLetter(word) {
  return word[0]?.toUpperCase() || "";
}

/**
 * Generates a deterministic random color based on name hash.
 * @param {string} name - The full name.
 * @returns {string} The color hex code.
 */
export function getRandomColor(name) {
  const colors = getColorPalette();
  const hash = getNameHash(name);
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/**
 * Returns the color palette for initials circles.
 * @returns {Array<string>} Array of color hex codes.
 */
function getColorPalette() {
  return [
    "#2F6F7E", // Deep teal
    "#3F5C8C", // Slate blue
    "#7A4E3A", // Clay
    "#4B6B4F", // Olive
    "#6B5A7A", // Muted violet
    "#2F3B4A", // Charcoal
  ];
}

/**
 * Generates a numeric hash from the name string.
 * @param {string} name - The name string.
 * @returns {number} The hash number.
 */
function getNameHash(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i) * (i + 1);
    hash |= 0;
  }
  return hash;
}
