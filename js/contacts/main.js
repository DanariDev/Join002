import { initContactsList } from "./load-contacts.js";

window.addEventListener("DOMContentLoaded", async () => {
  await initContactsList(); 
  await import("./contacts-live-update.js"); 
});
