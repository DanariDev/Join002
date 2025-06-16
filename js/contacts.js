import { ref, set, push, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { db } from './firebase-config.js';

const BASE_URL = "https://join002-26fa4-default-rtdb.firebaseio.com/";
let contacts = [];
let groupedContacts = [];
let selectedContact = null;
const mediaQuery = window.matchMedia("(max-width: 800px)");


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
    document.getElementById('contacts-list-wrapper').innerHTML = "";
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


function generateSortedContacts() {
    const sortedLetters = Object.keys(groupedContacts).sort();

    for (let i = 0; i < sortedLetters.length; i++) {
        const letter = sortedLetters[i];
        document.getElementById('contacts-list-wrapper').innerHTML += createAlphabetAndGroupTemplate(letter);

        for (let x = 0; x < groupedContacts[letter].length; x++) {
            document.getElementById(`list-group-${letter}`).innerHTML += getInformation(letter, x);
        };
    };
    addContactOpenenigEvent()
    handleMediaQueryChange(mediaQuery);
};


function addContactOpenenigEvent() {
    document.querySelectorAll(".list-contact-wrapper").forEach(el => {
        const letter = el.dataset.letter;
        const index = parseInt(el.dataset.index);
        el.addEventListener('click', () => {
            findCurrentContact(`contact${letter}-${index}`, letter, index);
        });
    });
};


function createAlphabetAndGroupTemplate(letter) {
    return `
    <div class="list-alphabet">
      <span>${letter}</span>
      <div class="split-list-line"></div>
    </div>
    <div class="group-list" id="list-group-${letter}"></div>`;
};


function getInformation(letter, index) {
    const contact = groupedContacts[letter][index].contact;
    const initials = contact.initials;
    const name = contact.name;
    const email = contact.email;
    const bgColor = getColorForName(name);
    return informationTemplate(name, letter, index, bgColor, email, initials);
};


function informationTemplate(name, letter, index, bgColor, email, initials) {
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
    </div>`
};


function findCurrentContact(idNumber, letter, index) {
    const currentContact = groupedContacts[letter][index].contact;
    const card = document.getElementById('showed-current-contact');
    card.classList.replace('d-none', 'd-flex');
    const icon = document.getElementById('current-icon');
    icon.innerHTML = currentContact.initials;
    icon.style.backgroundColor = getColorForName(currentContact.name);
    fillCurrentContact(currentContact)
    showCurrentContact(idNumber)

    selectedContact = { id: groupedContacts[letter][index].id, name: currentContact.name, email: currentContact.email, phone: currentContact.phone, icon: currentContact.initials };

    setTimeout(() => card.classList.add('show'), 10);
};


function fillCurrentContact(currentContact) {
    document.getElementById('current-name').innerHTML = currentContact.name;

    const currentMail = document.getElementById('current-mail');
    currentMail.setAttribute('href', 'mailto:' + currentContact.email);
    currentMail.textContent = currentContact.email;

    const currentPhone = document.getElementById('current-phone');
    currentPhone.setAttribute('href', 'tel:' + currentContact.phone);
    currentPhone.textContent = currentContact.phone;
};


function showCurrentContact(idNumber) {
    document.getElementById('right-section').classList.remove('d-none');
    document.getElementById('responsive-small-edit').classList.remove('d-none');
    document.getElementById('responsive-small-add').classList.add('d-none');
    document.querySelectorAll('.choosen').forEach(el => el.classList.remove('choosen'));
    document.getElementById(idNumber).classList.add('choosen');
};


function openLightboxAdd() {
    document.getElementById('lightbox-overlay').classList.replace('d-none', 'd-flex');
    document.body.style.overflow = 'hidden';
    const lightbox = document.getElementById('lightbox');
    lightbox.innerHTML = '';
    lightbox.appendChild(document.createRange().createContextualFragment(leftAddingTemplate()));
    lightbox.appendChild(document.createRange().createContextualFragment(rightAddingTemplate()));

    setTimeout(() => {
        lightbox.classList.add('show');
        document.getElementById('create-btn').onclick = e => { e.preventDefault(); addContact(); };
        document.getElementById('cancel-btn').onclick = e => { e.preventDefault(); closeLightbox(); };
    }, 10);
};


function openLightboxEdit() {
    document.body.style.overflow = 'hidden';
    document.getElementById('lightbox-overlay').classList.replace('d-none', 'd-flex');
    const lightbox = document.getElementById('lightbox');
    lightbox.innerHTML = '';
    lightbox.appendChild(document.createRange().createContextualFragment(leftEditingTemplate()));
    lightbox.appendChild(document.createRange().createContextualFragment(rightEditingTemplate()));
    const icon = document.getElementById('edit-icon');
    icon.innerText = selectedContact.icon || '';
    icon.style.backgroundColor = getColorForName(selectedContact.name);
    document.getElementById('edit-name').value = selectedContact.name || '';
    document.getElementById('edit-email').value = selectedContact.email || '';
    document.getElementById('edit-phone').value = selectedContact.phone || '';
    addSaveAndDeleteEvent()
    setTimeout(() => lightbox.classList.add('show'), 10);
};


function addSaveAndDeleteEvent() {
    ['saveBtn', 'deleteBtn'].forEach(id => {
        document.getElementById(id).onclick = () => {
            if (selectedContact?.id) {
                id === 'saveBtn' ? saveContactEdits(selectedContact.id) : deleteContact(selectedContact.id);
            } else {
                alert('no contact found!');
            }
        };
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
    <input id="edit-name" type="text" placeholder="Name" required>
    <input id="edit-email" type="email" placeholder="Email" required>
    <input id="edit-phone" type="tel" placeholder="Phone" required>
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
   <input id="edit-name" type="text" placeholder="Name" required>
    <input id="edit-email" type="email" placeholder="Email" required>
    <input id="edit-phone" type="tel" placeholder="Phone" required>
        <div class="btns-lighbox">
            <button id="deleteBtn">Delete</button>
            <button id="saveBtn">Save<img src="/assets/img/check.png" alt="check"></button>
        </div>
    </div>
</div>`
};


async function saveContactEdits(contactId) {
    const name = document.getElementById('edit-name').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const phone = document.getElementById('edit-phone').value.trim();

    if (!name || !email || !phone) return alert('All Fields required!');
    try {
        await update(ref(db, 'contacts/' + contactId), { name, email, phone });
    } catch (error) {
        return alert('failure on saving');
    }
    document.getElementById('showed-current-contact').classList.replace('d-flex', 'd-none');
    closeLightbox();
    initContactsList()
};


async function deleteContact(contactId) {
    if (!contactId) return alert('No contact found!');
    if (!confirm('Do you really want to Delete this contact?')) return;
    try {
        await remove(ref(db, 'contacts/' + contactId));
        closeLightbox();
        await initContactsList();
    } catch (e) {
        return alert('failure on saving');
    }
    document.getElementById('showed-current-contact').classList.replace('d-flex', 'd-none');
};


async function addContact() {
    const name = document.getElementById('edit-name').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const phone = document.getElementById('edit-phone').value.trim();

    if (!name || !email || !phone) return alert('All Fields required!');
    try {
        const newContactRef = push(ref(db, 'contacts'));
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
    document.getElementById('responsive-small-edit').classList.add('d-none');
    document.getElementById('responsive-small-add').classList.remove('d-none');
};


function openEditResponsive() {

    document.getElementById('current-btns-responsive').classList.remove('d-none');
    document.getElementById('current-btns-responsive').classList.add('d-flex');
    document.getElementById('responsive-small-edit').classList.add('d-none');

    setTimeout(() => {
        document.getElementById('current-btns-responsive').classList.add('show');
    }, 200);

};


function closeEditResponsive() {
    document.getElementById('current-btns-responsive').classList.remove('show');
    document.getElementById('responsive-small-edit').classList.remove('d-none');

    setTimeout(() => {
        document.getElementById('current-btns-responsive').classList.add('d-none');
        document.getElementById('current-btns-responsive').classList.remove('d-flex');
    }, 200);
};


function handleMediaQueryChange(e) {
    if (e.matches) {
        document.getElementById('right-section').classList.add('d-none');
        document.getElementById('responsive-small-add').classList.remove('d-none');
        document.getElementById('current-btns-responsive').classList.add('d-none');
    } else {
        document.getElementById('right-section').classList.remove('d-none');
        document.getElementById('responsive-small-add').classList.add('d-none');
        document.getElementById('responsive-small-edit').classList.add('d-none');
    }
};


document.addEventListener('DOMContentLoaded', () => {
    mediaQuery.addEventListener('change', handleMediaQueryChange);
    document.getElementById('add-contact-btn-big').addEventListener('click', openLightboxAdd);
    document.getElementById('responsive-small-add').addEventListener('click', openLightboxAdd);
    document.getElementById('responsive-small-edit').addEventListener('click', openEditResponsive);
    document.getElementById('current-edit').addEventListener('click', openLightboxEdit);
    document.getElementById('lightbox-overlay').addEventListener('click', closeLightbox);
    document.getElementById('back-icon').addEventListener('click', closeShownContact);
    document.getElementById('right-section').addEventListener('click', closeEditResponsive);
    document.getElementById('current-delete').addEventListener('click', () => {
        if (selectedContact && selectedContact.id) {
            deleteContact(selectedContact.id);
        } else {
            alert('No contact found!');
        }
    });
    initContactsList();
});

