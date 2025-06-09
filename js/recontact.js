const BASE_URL = "https://join002-26fa4-default-rtdb.firebaseio.com/";
let contacts = [];
let groupedContacts = [];
let selectedContactId = null;


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
    let response = await fetch(BASE_URL + path + ".json");
    return (responseToJson = await response.json());
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
}

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
    <div class="list-contact-wrapper" id="contact${letter}-${index}"
onclick="showContact('${letter}${index}','${letter}', ${index})">
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

    name.innerHTML = contact.name;
    mail.innerHTML = contact.email;
    phone.innerHTML = contact.phone;
    icon.innerHTML = contact.initials;
    icon.style.backgroundColor = getColorForName(contact.name);
    card.classList.remove('d-none');
    card.classList.add('d-flex');
};



document.addEventListener("DOMContentLoaded", function () {
    initContactsList();
});






//  Unfertig

// lightbox
function openLightboxAdd() {
    document.getElementById('lightbox-overlay').classList.remove('d-none');
    document.getElementById('lightbox-overlay').classList.add('d-flex');
    document.body.style.overflow = 'hidden';
    const lightbox = document.getElementById('lightbox');
    lightbox.innerHTML = '';
    const leftSide = renderLeftAdding();
    const rightSide = renderRightAdding();
    lightbox.appendChild(leftSide);
    lightbox.appendChild(rightSide);
}

function openLightboxEdit() {
    document.getElementById('lightbox-overlay').classList.remove('d-none');
    document.getElementById('lightbox-overlay').classList.add('d-flex');
    document.body.style.overflow = 'hidden';
    const lightbox = document.getElementById('lightbox');
    lightbox.innerHTML = '';
    const leftSide = renderLeftEditing();
    const rightSide = renderRightEditing();
    lightbox.appendChild(leftSide);
    lightbox.appendChild(rightSide);
}

function closeLightbox() {
    document.getElementById('lightbox-overlay').classList.remove('d-flex');
    document.getElementById('lightbox-overlay').classList.add('d-none');
    document.body.style.overflow = 'auto';
}

function renderLeftAdding() {
    const leftSide = document.createElement('div');
    leftSide.classList.add('lightbox-left');

    const img = document.createElement('img');
    img.src = '../assets/img/logo_dark.png';
    img.alt = 'Bild';

    const h2 = document.createElement('h2');
    h2.textContent = 'Add Contact';

    const span = document.createElement('span');
    span.textContent = 'Tasks are better with a team!';

    const balken = document.createElement('div');
    balken.classList.add('blue-line');

    leftSide.appendChild(img);
    leftSide.appendChild(h2);
    leftSide.appendChild(span);
    leftSide.appendChild(balken);

    return leftSide;
}

function renderRightAdding() {
    const rightSide = document.createElement('div');
    rightSide.classList.add('lightbox-right');

    const iconLightbox = document.createElement('div');
    iconLightbox.classList.add('icon');

    const nameInput = document.createElement('input');
    nameInput.placeholder = 'Name';

    const emailInput = document.createElement('input');
    emailInput.placeholder = 'Email';

    const phoneInput = document.createElement('input');
    phoneInput.placeholder = 'Phone';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';

    const createBtn = document.createElement('button');
    createBtn.textContent = 'Create Contact';

    rightSide.appendChild(iconLightbox);
    rightSide.appendChild(nameInput);
    rightSide.appendChild(emailInput);
    rightSide.appendChild(phoneInput);
    rightSide.appendChild(cancelBtn);
    rightSide.appendChild(createBtn);

    return rightSide;
}

function renderLeftEditing() {
    const leftSide = document.createElement('div');
    leftSide.classList.add('lightbox-left');

    const img = document.createElement('img');
    img.src = '../assets/img/logo_dark.png';
    img.alt = 'Bild';

    const h2 = document.createElement('h2');
    h2.textContent = 'Edit Contact';

    const balken = document.createElement('div');
    balken.classList.add('blue-line');

    leftSide.appendChild(img);
    leftSide.appendChild(h2);
    leftSide.appendChild(balken);

    return leftSide;
}

function renderRightEditing() {
    const rightSide = document.createElement('div');
    rightSide.classList.add('lightbox-right');

    const flex = document.createElement('div');
    flex.classList.add('d-flex');

    const iconLightbox = document.createElement('div');
    iconLightbox.classList.add('icon');

    const nameInput = document.createElement('input');
    nameInput.placeholder = 'Name';

    const emailInput = document.createElement('input');
    emailInput.placeholder = 'Email';

    const phoneInput = document.createElement('input');
    phoneInput.placeholder = 'Phone';

    const deleteBtn = document.createElement('button');
    deleteBtn.id = 'deleteBtn'
    deleteBtn.textContent = 'Delete';

    const saveBtn = document.createElement('button');
    saveBtn.id = 'saveBtn'
    saveBtn.textContent = 'Save';

    flex.appendChild(iconLightbox);
    flex.appendChild(nameInput);
    flex.appendChild(emailInput);
    flex.appendChild(phoneInput);
    flex.appendChild(deleteBtn);
    flex.appendChild(saveBtn);
    rightSide.appendChild(flex);

    return rightSide;
}