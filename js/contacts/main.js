import { initContactsList } from "./load-contacts.js";
import { openContact } from "./open-contact.js";
import { editCurrentContact } from "./edit-contact.js";

window.addEventListener("load", () => {
  initContactsList();
});
