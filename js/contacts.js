import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { db } from "./firebase-config.js";

let groupedContacts = [];

async function contactsList() {
  let contacts = [];

  const usersSnap = await getDocs(collection(db, "users"));
  usersSnap.forEach(doc => {
    const data = doc.data();
    if (data.name) contacts.push({ name: data.name, email: data.email || "" });
  });

  const contactsSnap = await getDocs(collection(db, "contacts"));
  contactsSnap.forEach(doc => {
    const data = doc.data();
    if (data.name) contacts.push({ name: data.name, email: data.email || "" });
  });

  // Duplikate filtern
  contacts = contacts.filter((c, i, arr) =>
    i === arr.findIndex(t => t.name === c.name && t.email === c.email)
  );

  sortContacts(contacts);
  generateSortedContacts();
}

function sortContacts(contacts) {
  groupedContacts = {};
  contacts.forEach(contact => {
    const firstLetter = contact.name.charAt(0).toUpperCase();
    if (!groupedContacts[firstLetter]) groupedContacts[firstLetter] = [];
    groupedContacts[firstLetter].push(contact);
  });
}

function generateSortedContacts() {
  const listContainer = document.getElementById('contacts-listID');
  listContainer.innerHTML = "";

  Object.keys(groupedContacts).forEach((letter, indexA) => {
    listContainer.innerHTML += createAlphabetDiv(letter);
    listContainer.innerHTML += createGroupList(indexA);

    groupedContacts[letter].forEach((_, indexB) => {
      document.getElementById(`group-list${indexA}ID`).innerHTML += createImgNameEmailDiv(indexA, indexB);
      document.getElementById(`img-div${indexA}${indexB}ID`).style.backgroundColor =
        `hsl(${Math.random() * 360}, ${(Math.random() * 20) + 50}%, ${(Math.random() * 20) + 50}%)`;
    });
  });
}

function createAlphabetDiv(letter) {
  return `<div class="alphabet-div"><span>${letter}</span><div class="separate-contacts-list"></div></div>`;
}

function createGroupList(indexA) {
  return `<div class="group-list" id="group-list${indexA}ID"></div>`;
}

function createImgNameEmailDiv(indexA, indexB) {
  const contact = Object.values(groupedContacts)[indexA][indexB];
  const initials = contact.name.split(" ").map(w => w[0]).join("").toUpperCase();
  return `
    <div class="img-name-email-div" id="img-name-email-div${indexA}${indexB}ID"
         onclick="contactDeletesLoad('${indexA}${indexB}')">
      <div class="img-div" id="img-div${indexA}${indexB}ID">${initials}</div>
      <div class="name-email-div">
        <span id=name${indexA}${indexB}ID>${contact.name}</span>
        <span class="email-span" id="email${indexA}${indexB}ID">${contact.email}</span>
      </div>
    </div>`;
}

function contactDeletesLoad(idNumber) {
  document.getElementById('contacts-details-contentsID').classList.add('display-flex');
  document.getElementById('img-details-divID').style.backgroundColor = document.getElementById(`img-div${idNumber}ID`).style.backgroundColor;
  document.getElementById('img-details-divID').innerHTML = document.getElementById(`img-div${idNumber}ID`).innerHTML;
  document.getElementById('details-nameID').innerHTML = document.getElementById(`name${idNumber}ID`).innerHTML;
  document.getElementById('details-emailID').innerHTML = document.getElementById(`email${idNumber}ID`).innerHTML;

  [...document.getElementsByClassName('img-name-email-div')].forEach(div => div.style = "");
  document.getElementById(`img-name-email-div${idNumber}ID`).style.backgroundColor = '#2a3647';
  document.getElementById(`img-name-email-div${idNumber}ID`).style.color = 'white';
}
export { contactsList };
