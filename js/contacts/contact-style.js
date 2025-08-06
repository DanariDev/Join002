/**
 * Generates initials from name (first two letters uppercase).
 */
export function getInitials(name) {
  return name
    .split(" ")
    .map(w => getFirstLetter(w))
    .join("")
    .slice(0, 2);
}

/** Returns the uppercase first letter of a word */
function getFirstLetter(word) {
  return word[0]?.toUpperCase() || "";
}

/**
 * Generates a deterministic random color based on name hash.
 */
export function getRandomColor(name) {
  const colors = getColorPalette();
  const hash = getNameHash(name);
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/** Returns the color palette for initials circles */
function getColorPalette() {
  return [
    "#29ABE2", // Blue
    "#FF7A00", // Orange
    "#2AD300", // Green
    "#FF5C5C", // Red
    "#6E52FF", // Purple
    "#FC71FF", // Pink
  ];
}

/** Generates a numeric hash from the name string */
function getNameHash(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i) * (i + 1);
    hash |= 0;
  }
  return hash;
}
