import { ref, set, push, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { db } from './firebase-config.js';

const BASE_URL = "https://join002-26fa4-default-rtdb.firebaseio.com/";
let contacts = [];
let groupedContacts = [];
let selectedContact = null;
const mediaQuery = window.matchMedia("(max-width: 800px)");


// Colors
function getColorForName(name) {
    const colors = [
        "#FF5733", "#33B5FF", "#33FF99", "#FF33EC", "#ffcb20",
        "#9D33FF", "#33FFDA", "#FF8C33", "#3385FF", "#FF3333"
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    };
    return colors[Math.abs(hash) % colors.length];
};


// Load List
async function initContactsList() {
    await createList();
    sortList();
    generateSortedContacts();
};


async function getAllContacts(path) {
    const response = await fetch(BASE_URL + path + ".json");
    const data = await response.json();
    return data;
};


async function createList() {
    document.getElementById('recontacts-list-wrapper').innerHTML = "";
    contacts = [];
    groupedContacts = [];

    let contactResponse = await getAllContacts('contacts');
    let ContactKeysArray = Object.keys(contactResponse);

    for (let index = 0; index < ContactKeysArray.length; index++) {
        contacts.push({
            id: ContactKeysArray[index],
            contact: contactResponse[ContactKeysArray[index]]
        });
    };
};


// Sort List
function sortList() {
    contacts.sort((a, b) =>
        a.contact.name.localeCompare(b.contact.name)
    );

    groupedContacts = {};

    contacts.forEach((element) => {
        let firstLetter = element.contact.name.charAt(0).toUpperCase();

        if (!groupedContacts[firstLetter]) {
            groupedContacts[firstLetter] = [];
        };

        groupedContacts[firstLetter].push(element);
    });
};


// Render List
function generateSortedContacts() {
    const sortedLetters = Object.keys(groupedContacts).sort();

    for (let i = 0; i < sortedLetters.length; i++) {
        const letter = sortedLetters[i];
        document.getElementById('recontacts-list-wrapper').innerHTML += createAlphabetTemplate(letter);
        document.getElementById('recontacts-list-wrapper').innerHTML += createGroupTemplate(letter);

        for (let x = 0; x < groupedContacts[letter].length; x++) {
            document.getElementById(`list-group-${letter}`).innerHTML += getInformationTemplate(letter, x);
        };
    };
    document.querySelectorAll(".list-contact-wrapper").forEach(el => {
        const letter = el.dataset.letter;
        const index = parseInt(el.dataset.index);
        el.addEventListener('click', () => {
            showContact(`contact${letter}-${index}`, letter, index);
        });
    });

    handleMediaQueryChange(mediaQuery);
};


function createAlphabetTemplate(letter) {
    return `
    <div class="list-alphabet">
      <span>${letter}</span>
      <div class="split-list-line"></div>
    </div>`;
};


function createGroupTemplate(letter) {
    return `<div class="group-list" id="list-group-${letter}"></div>`;
};


function getInformationTemplate(letter, index) {
    const contact = groupedContacts[letter][index].contact;
    const initials = contact.initials;
    const name = contact.name;
    const email = contact.email;
    const bgColor = getColorForName(name);
    return `
    <div class="list-contact-wrapper"
         id="contact${letter}-${index}"
         data-letter="${letter}"
         data-index="${index}">
        <div class="initial-icon" style="background-color: ${bgColor};">${initials}</div>
        <div class="list-contact-information">
            <span class="list-name">${name}</span>
            <span class="list-email" id="email${letter}${index}">${email}</span>
        </div>
    </div>`;
};


// Open Contact
function showContact(idNumber, letter, index) {
    const contactEntry = groupedContacts[letter][index];
    const contact = contactEntry.contact;
    const card = document.getElementById('showed-current-contact');
    const name = document.getElementById('current-name');
    const mail = document.getElementById('current-mail');
    const phone = document.getElementById('current-phone');
    const icon = document.getElementById('current-icon');

    const choosenContact = document.getElementById(idNumber);
    document.querySelectorAll('.choosen').forEach(el => el.classList.remove('choosen'));
    choosenContact.classList.add('choosen')

    name.innerHTML = contact.name;
    mail.innerHTML = contact.email;
    phone.innerHTML = contact.phone;
    icon.innerHTML = contact.initials;
    icon.style.backgroundColor = getColorForName(contact.name);
    card.classList.remove('d-none');
    card.classList.add('d-flex');

    document.getElementById('right-section').classList.remove('d-none');

    selectedContact = {
        id: groupedContacts[letter][index].id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        icon: contact.initials
    };
    setTimeout(() => {
        card.classList.add('show');
    }, 10);
};


// Lightbox
function openLightboxAdd() {
    document.getElementById('lightbox-overlay').classList.remove('d-none');
    document.getElementById('lightbox-overlay').classList.add('d-flex');
    document.body.style.overflow = 'hidden';
    const lightbox = document.getElementById('lightbox');
    lightbox.innerHTML = '';
    const tempLeft = document.createElement('div');
    tempLeft.innerHTML = leftAddingTemplate();
    const leftSide = tempLeft.firstElementChild;
    const tempRight = document.createElement('div');
    tempRight.innerHTML = rightAddingTemplate();
    const rightSide = tempRight.firstElementChild;
    lightbox.appendChild(leftSide);
    lightbox.appendChild(rightSide);

    setTimeout(() => {
        lightbox.classList.add('show');

        document.getElementById('create-btn').addEventListener('click', (e) => {
            e.preventDefault();
            addContact();
        });
        document.getElementById('cancel-btn').addEventListener('click', (e) => {
            e.preventDefault();
            closeLightbox();
        });
    }, 10);
};


function openLightboxEdit() {
    document.getElementById('lightbox-overlay').classList.remove('d-none');
    document.getElementById('lightbox-overlay').classList.add('d-flex');
    document.body.style.overflow = 'hidden';
    const lightbox = document.getElementById('lightbox');
    lightbox.innerHTML = '';
    const tempLeft = document.createElement('div');
    tempLeft.innerHTML = leftEditingTemplate();
    const leftSide = tempLeft.firstElementChild;
    const tempRight = document.createElement('div');
    tempRight.innerHTML = rightEditingTemplate();
    const rightSide = tempRight.firstElementChild;
    lightbox.appendChild(leftSide);
    lightbox.appendChild(rightSide);

    setTimeout(() => {
        lightbox.classList.add('show');
    }, 10);

    const icon = document.getElementById('edit-icon');
    icon.innerText = selectedContact.icon || '';
    icon.style.backgroundColor = getColorForName(selectedContact.name);
    document.getElementById('edit-name').value = selectedContact.name || '';
    document.getElementById('edit-mail').value = selectedContact.email || '';
    document.getElementById('edit-phone').value = selectedContact.phone || '';
    document.getElementById('saveBtn').addEventListener('click', () => {
        if (selectedContact && selectedContact.id) {
            saveContactEdits(selectedContact.id);
        } else {
            alert('no contact found!');
        }
    });
    document.getElementById('deleteBtn').addEventListener('click', () => {
        if (selectedContact && selectedContact.id) {
            deleteContact(selectedContact.id);
        } else {
            alert('no contact found!');
        }
    });
};


function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('show');

    setTimeout(() => {
        document.getElementById('lightbox-overlay').classList.remove('d-flex');
        document.getElementById('lightbox-overlay').classList.add('d-none');
        document.body.style.overflow = 'auto';
    }, 400);
};


function leftAddingTemplate() {
    return `<div class="lightbox-left">
    <img class="join-logo-left" src="../assets/img/logo_dark.png" alt="Join Logo">
    <h2>Add Contact</h2>
    <div class="lightbox-subline">
        <span>Tasks are better with a team!</span>
        <div class="blue-line"></div>
    </div>
</div>`
};


function rightAddingTemplate() {
    return `<div class="lightbox-right">
    <img class="current-icon" src="../assets/img/person.png" alt="Person Icon">
<div class="editing-lighbox">
    <input id="edit-name" type="text" placeholder="Name">
    <input id="edit-mail" type="text" placeholder="Email">
    <input id="edit-phone" type="text" placeholder="Phone">
<div class="btns-lighbox">
<button id="cancel-btn">Cancel <span>X</span></button>
<button id="create-btn">Create Contact <img src="../assets/img/check.png" alt="check"></button>
</div>
</div>
</div>`
};


function leftEditingTemplate() {
    return `<div class="lightbox-left">
    <img class="join-logo-left" src="../assets/img/logo_dark.png" alt="Join Logo">
    <div class="lightbox-subline">
    <h2>Edit Contact</h2>
        <div class="blue-line"></div>
    </div>
</div>`
};


function rightEditingTemplate() {
    return `<div class="lightbox-right">
    <div id="edit-icon"></div>
    <div class="editing-lighbox">
        <input id="edit-name" type="text" placeholder="Name">
        <input id="edit-mail" type="text" placeholder="Email">
        <input id="edit-phone" type="text" placeholder="Phone">
        <div class="btns-lighbox">
            <button id="deleteBtn">Delete</button>
            <button id="saveBtn">Save<img src="../assets/img/check.png" alt="check"></button>
        </div>
    </div>
</div>`
};


// Kontakte abändern
async function saveContactEdits(contactId) {
    const name = document.getElementById('edit-name').value.trim();
    const email = document.getElementById('edit-mail').value.trim();
    const phone = document.getElementById('edit-phone').value.trim();
    if (!name || !email || !phone) {
        alert('All Fields required!');
        return;
    }
    try {
        const contactRef = ref(db, 'contacts/' + contactId);
        await update(contactRef, {
            name: name,
            email: email,
            phone: phone
        });
        closeLightbox();
    } catch (error) {
        alert('failure on saving');
    }
    const card = document.getElementById('showed-current-contact');
    card.classList.add('d-none');
    card.classList.remove('d-flex');
    closeLightbox();
    initContactsList()
};


async function deleteContact(contactId) {
    if (!contactId) {
        alert('No contact found!');
        return;
    }
    const confirmed = confirm('Do you really want to Delete this contact?');
    if (!confirmed) return;
    try {
        const contactRef = ref(db, 'contacts/' + contactId);
        await remove(contactRef);
        closeLightbox();
        await initContactsList();
    } catch (error) {
        alert('failure on saving');
    }
    const card = document.getElementById('showed-current-contact');
    card.classList.add('d-none');
    card.classList.remove('d-flex');
};

async function addContact() {
    const name = document.getElementById('edit-name').value.trim();
    const email = document.getElementById('edit-mail').value.trim();
    const phone = document.getElementById('edit-phone').value.trim();
    if (!name || !email || !phone) {
        alert('All Fields required!');
        return;
    }
    try {
        const contactsRef = ref(db, 'contacts');
        const newContactRef = push(contactsRef);
        await set(newContactRef, {
            name: name,
            email: email,
            phone: phone,
            initials: name.split(' ').map(n => n[0]).join('').toUpperCase()
        });
        closeLightbox();
        await initContactsList();
    } catch (error) {
        alert('failed to Set New contact!');
    }
};

function closeShownContact() {
    document.getElementById('right-section').classList.add('d-none');
}


document.addEventListener('DOMContentLoaded', () => {
    mediaQuery.addEventListener("change", handleMediaQueryChange);
    document.getElementById('add-recontact-btn-big').addEventListener('click', openLightboxAdd);
    document.getElementById('current-edit').addEventListener('click', openLightboxEdit);
    document.getElementById('lightbox-overlay').addEventListener('click', closeLightbox);
    document.getElementById('back-icon').addEventListener('click', closeShownContact);
    document.getElementById('current-delete').addEventListener('click', () => {
        if (selectedContact && selectedContact.id) {
            deleteContact(selectedContact.id);
        } else {
            alert('No contact found!');
        }
    });
    initContactsList();
});


// Media quarry

function handleMediaQueryChange(e) {
    if (e.matches) {
        document.getElementById('right-section').classList.add('d-none');
    } else {
        document.getElementById('right-section').classList.remove('d-none');
    }
}

handleMediaQueryChange(mediaQuery);

