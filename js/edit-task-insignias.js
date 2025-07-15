import { renderInitials } from "./utils.js"; // Neuer Import

/**
 * Zeigt die ausgewählten Kontakte im Edit-Fenster mit Farben
 * @param {Array} assignedTo - Liste der Namen
 */
export function updateEditingContactInsignias(assignedTo) {
  const container = document.getElementById("selected-contact-insignias-edit");
  if (!container) return;
  renderInitials(container, assignedTo, "assigned-initials"); // Verwende renderInitials
}