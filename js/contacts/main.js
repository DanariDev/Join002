import { initContactsList } from "./load-contacts.js";



window.addEventListener("DOMContentLoaded", async () => {
  await import("./contacts-live-update.js"); // Nur noch live laden!
});

