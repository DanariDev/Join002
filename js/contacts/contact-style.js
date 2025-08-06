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
function getColorPalette() {
  return [
    "#29ABE2", // Blau
    "#FF7A00", // Orange
    "#2AD300", // Grün
    "#FF5C5C", // Rot
    "#6E52FF", // Lila
    "#FC71FF", // Pink
  ];
}
function getNameHash(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i) * (i + 1);
    hash |= 0;
  }
  return hash;
}
