const BASE_URL = "https://join002-26fa4-default-rtdb.firebaseio.com/";
let contacts = [];
let groupedContacts = [];
let selectedContactId = null;

function getColorForName(name) {
  const colors = [
    "#FF5733",
    "#33B5FF",
    "#33FF99",
    "#FF33EC",
    "#ffcb20",
    "#9D33FF",
    "#33FFDA",
    "#FF8C33",
    "#3385FF",
    "#FF3333",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

async function initContactsList() {
  await onLoadContacts();
  sortContacts();
  generateSortedContacts();
}

async function onLoadContacts() {
  document.getElementById("contacts-list").innerHTML = "";
  contacts = [];
  groupedContacts = [];

  let contactResponse = await getAllContacts("contacts");
  let ContactKeysArray = Object.keys(contactResponse);

  for (let index = 0; index < ContactKeysArray.length; index++) {
    contacts.push({
      id: ContactKeysArray[index],
      contact: contactResponse[ContactKeysArray[index]],
    });
  }
}

async function getAllContacts(path) {
  let response = await fetch(BASE_URL + path + ".json");
  return (responseToJson = await response.json());
}

function sortContacts() {
  contacts.sort((selected, compare) =>
    selected.contact.name.localeCompare(compare.contact.name)
  );
  contacts.forEach((element) => {
    let firstLetter = element.contact.name.charAt(0).toUpperCase();
    if (!groupedContacts[firstLetter]) {
      groupedContacts[firstLetter] = [];
    }
    groupedContacts[firstLetter].push(element);
  });
}

function generateSortedContacts() {
  for (
    let indexaAlphabet = 0;
    indexaAlphabet < Object.keys(groupedContacts).length;
    indexaAlphabet++
  ) {
    document.getElementById("contacts-list").innerHTML +=
      createAlphabetDiv(indexaAlphabet);
    document.getElementById("contacts-list").innerHTML +=
      createGroupList(indexaAlphabet);

    for (
      let indexContacs = 0;
      indexContacs < Object.values(groupedContacts)[indexaAlphabet].length;
      indexContacs++
    ) {
      document.getElementById(`group-list${indexaAlphabet}ID`).innerHTML +=
        createImgNameEmailDiv(indexaAlphabet, indexContacs);
    }
  }
}

function createAlphabetDiv(indexaAlphabet) {
  return `
    <div class="list-alphabet">
    <span>${Object.keys(groupedContacts)[indexaAlphabet]}</span>
    <div class="split-list-line">
    </div>
    </div>`;
}

function createGroupList(indexaAlphabet) {
  return `<div class="group-list" id="group-list${indexaAlphabet}ID"></div>`;
}

function createImgNameEmailDiv(indexaAlphabet, indexContacs) {
  const contact =
    Object.values(groupedContacts)[indexaAlphabet][indexContacs].contact;
  const initials = contact.initials;
  const name = contact.name;
  const email = contact.email;
  const bgColor = getColorForName(name);
  return `
    <div class="contact-wrapper" id="contact${indexaAlphabet}${indexContacs}" 
         onclick="contactDetailsLoad('${indexaAlphabet}${indexContacs}','${indexaAlphabet}','${indexContacs}'), toContactDetails()">
        <div class="initial-icon" style="background-color: ${bgColor};">${initials}</div>
        <div class="contact-details">
            <span class="list-showed-name">${name}</span>
            <span class="list-showed-email" id="email${indexaAlphabet}${indexContacs}">${email}</span>
        </div>
    </div>`;
}

function contactDetailsLoad(idNumber, indexaAlphabet, indexContacs) {
  const contactEntry =
    Object.values(groupedContacts)[indexaAlphabet][indexContacs]; 

  const contact = contactEntry.contact;
  selectedContactId = contactEntry.id; 

  setText("popout-name", contact.name);
  setText("popout-email", contact.email);
  setAttr("popout-email", "href", `mailto:${contact.email}`);
  setText("popout-phone", contact.phone);
  setAttr("popout-phone", "href", `tel:${contact.phone}`);
  setText("popout-icon", contact.initials);
  setStyle("popout-icon", "backgroundColor", getColorForName(contact.name));
  document.getElementById("showed-contact").classList.remove("d-none");
}

function backToContactsList() {
  document.getElementById("right-section").classList.remove("display-flex");
  document.querySelectorAll(".contact-wrapper").forEach((element) => {
    element.style = "";
  });
  document
    .getElementById("contacts-details-contentsID")
    .classList.remove("display-flex");
}

function toContactDetails() {
  document.getElementById("right-section").classList.add("display-flex");
}
function saveEditedContact(e) {
  e.preventDefault();
  let name = getValue("edit-nameID");
  let email = getValue("edit-emailID");
  let phone = getValue("edit-phoneID");
  let id = currentContactId();
  let contact = { name, email, phone, initials: getInitials(name) };
  fetch(BASE_URL + "contacts/" + id + ".json", {
    method: "PUT",
    body: JSON.stringify(contact),
  }).then(() => applyEdit(contact, id));
}
function applyEdit(contact, id) {
    const index = contacts.findIndex(c => c.id === id);
    contacts[index].contact = contact;
    regroupContacts();
    rerenderContacts();
    loadDetails(contact, id);
  
    // Fenster richtig schließen (nur das Edit-Fenster!)
    document.getElementById("edit-contact-divID").classList.add("display-none");
    document.getElementById("add-edit-bodyID").classList.add("display-none");
  
    // Eingaben leeren
    setInput("edit-nameID", "");
    setInput("edit-emailID", "");
    setInput("edit-phoneID", "");
    setText("img-edit-divID", "");
  }
  
  
function getValue(id) {
  return document.getElementById(id).value;
}
function getInitials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}
function currentContactId() {
  return selectedContactId;
}

function regroupContacts() {
  groupedContacts = {};
  contacts.forEach((c) => {
    let letter = c.contact.name.charAt(0).toUpperCase();
    if (!groupedContacts[letter]) groupedContacts[letter] = [];
    groupedContacts[letter].push(c);
  });
}
function rerenderContacts() {
  document.getElementById("contacts-list").innerHTML = "";
  sortContacts();
  generateSortedContacts();
}
function loadDetails(c, id) {
  setText("popout-name", c.name);
  setText("popout-email", c.email);
  setAttr("popout-email", "href", `mailto:${c.email}`);
  setText("popout-phone", c.phone);
  setAttr("popout-phone", "href", `tel:${c.phone}`);
  setText("popout-icon", c.initials);
  setStyle("popout-icon", "backgroundColor", getColorForName(c.name));
  document.getElementById("edit-contact-divID").classList.add("display-none");
  document.getElementById("showed-contact").classList.remove("d-none");
}
function setText(id, val) {
  document.getElementById(id).innerHTML = val;
}
function setAttr(id, attr, val) {
  document.getElementById(id).setAttribute(attr, val);
}
function setStyle(id, prop, val) {
  document.getElementById(id).style[prop] = val;
}
function setInput(id, val) {
  document.getElementById(id).value = val;
}
function prefillEditForm() {
    if (!selectedContactId) return;
    let c = contacts.find((c) => c.id === selectedContactId).contact;
    setInput("edit-nameID", c.name);
    setInput("edit-emailID", c.email);
    setInput("edit-phoneID", c.phone);
  
    // NEU:
    setText("img-edit-divID", c.initials);
    setStyle("img-edit-divID", "backgroundColor", getColorForName(c.name));
  }
  

function editContactOpenClose() {
    document.getElementById('edit-contact-divID').classList.toggle('display-none');
    document.getElementById('add-edit-bodyID').classList.toggle('display-none'); // <- wichtig!
    prefillEditForm();
  }
  
