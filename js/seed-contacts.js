import { db } from "./firebase-config.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const contacts = [
  { name: "Anton Mayer", email: "antom@gmail.com" },
  { name: "Anja Schulz", email: "schulz@hotmail.com" },
  { name: "Benedikt Ziegler", email: "benedikt@gmail.com" },
  { name: "David Eisenberg", email: "davidberg@gmail.com" },
  { name: "Eva Fischer", email: "eva@gmail.com" },
  { name: "Emmanuel Mauer", email: "emmanuelma@gmail.com" },
];

function seedContacts() {
  contacts.forEach((c) => {
    const initials = c.name.split(" ")[0][0].toUpperCase() + c.name.split(" ")[1][0].toUpperCase();
    const safeEmail = c.email.replace(/\./g, "_");
    set(ref(db, "contacts/" + safeEmail), {
      name: c.name,
      email: c.email,
      initials: initials,
    });
  });
  alert("Kontakte wurden erfolgreich gespeichert!");
}

seedContacts();
