// contact-style.js

/**
 * Generates initials from name (first two letters uppercase).
 */
export function getInitials(name) {
  return name
    .split(" ")
    .map((w) => w[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
}

/**
 * Generates a deterministic random color based on name hash.
 */
export function getRandomColor(name) {
  const colors = [
    "#29ABE2", // Blau
    "#FF7A00", // Orange
    "#2AD300", // Grün
    "#FF5C5C", // Rot
    "#6E52FF", // Lila
    "#FC71FF", // Pink
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i) * (i + 1);
    hash |= 0; // Force 32bit
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
}