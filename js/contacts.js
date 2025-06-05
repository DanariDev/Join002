const BASE_URL = "https://join002-26fa4-default-rtdb.firebaseio.com/";
let contacts = [];
let groupedContacts = [];


function getColorForName(name) {
    const colors = [
        '#FF5733', '#33B5FF', '#33FF99', '#FF33EC', '#ffcb20',
        '#9D33FF', '#33FFDA', '#FF8C33', '#3385FF', '#FF3333'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    };
    return colors[Math.abs(hash) % colors.length];
};


async function initContactsList() {
    await onLoadContacts();
    sortContacts();
    generateSortedContacts();
};


async function onLoadContacts() {
    document.getElementById('contacts-list').innerHTML = "";
    contacts = [];
    groupedContacts = [];

    let contactResponse = await getAllContacts('contacts')
    let ContactKeysArray = Object.keys(contactResponse)

    for (let index = 0; index < ContactKeysArray.length; index++) {
        contacts.push(
            {
                id: ContactKeysArray[index],
                contact: contactResponse[ContactKeysArray[index]],
            }
        );
    };
};


async function getAllContacts(path) {
    let response = await fetch(BASE_URL + path + '.json');
    return responseToJson = await response.json();
};


function sortContacts() {
    contacts.sort((selected, compare) => selected.contact.name.localeCompare(compare.contact.name));
    contacts.forEach(element => {
        let firstLetter = element.contact.name.charAt(0).toUpperCase();
        if (!groupedContacts[firstLetter]) {
            groupedContacts[firstLetter] = [];
        };
        groupedContacts[firstLetter].push(element);
    });
};


function generateSortedContacts() {
    for (let indexaAlphabet = 0; indexaAlphabet < Object.keys(groupedContacts).length; indexaAlphabet++) {
        document.getElementById('contacts-list').innerHTML += createAlphabetDiv(indexaAlphabet);
        document.getElementById('contacts-list').innerHTML += createGroupList(indexaAlphabet);

        for (let indexContacs = 0; indexContacs < Object.values(groupedContacts)[indexaAlphabet].length; indexContacs++) {
            document.getElementById(`group-list${indexaAlphabet}ID`).innerHTML += createImgNameEmailDiv(indexaAlphabet, indexContacs)
        };
    };
};


function createAlphabetDiv(indexaAlphabet) {
    return `
    <div class="list-alphabet">
    <span>${Object.keys(groupedContacts)[indexaAlphabet]}</span>
    <div class="split-list-line">
    </div>
    </div>`;
};


function createGroupList(indexaAlphabet) {
    return `<div class="group-list" id="group-list${indexaAlphabet}ID"></div>`
};


function createImgNameEmailDiv(indexaAlphabet, indexContacs) {
    const contact = Object.values(groupedContacts)[indexaAlphabet][indexContacs].contact;
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
};


function contactDetailsLoad(idNumber, indexaAlphabet, indexContacs) {
    const nameElement = document.getElementById('popout-name');
    const icon = document.getElementById('popout-icon');
    const detailDiv = document.getElementById('showed-contact');
    const eMail = document.getElementById('popout-email');
    const phone = document.getElementById('popout-phone');
    const contact = Object.values(groupedContacts)[indexaAlphabet][indexContacs].contact;

    nameElement.innerHTML = contact.name;
    icon.innerHTML = contact.initials;
    icon.style.backgroundColor = getColorForName(contact.name);
    detailDiv.classList.remove('d-none');
    eMail.innerHTML = contact.email;
    phone.innerHTML = contact.phone;
};


function backToContactsList() {
    document.getElementById('right-section').classList.remove('display-flex');
    document.querySelectorAll('.contact-wrapper').forEach(element => {
        element.style = "";
    });
    document.getElementById('contacts-details-contentsID').classList.remove('display-flex');
};


function toContactDetails() {
    document.getElementById('right-section').classList.add('display-flex');
};