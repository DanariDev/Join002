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
    document.getElementById('contacts-listID').innerHTML = "";
    contacts = [];
    groupedContacts = [];

    let contactResponse = await getAllContacts("contacts")
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
    let response = await fetch(BASE_URL + path + ".json");
    return responseToJson = await response.json();
};


function sortContacts() {
    contacts.sort((a, b) => a.contact.name.localeCompare(b.contact.name));
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
        document.getElementById('contacts-listID').innerHTML += createAlphabetDiv(indexaAlphabet);
        document.getElementById('contacts-listID').innerHTML += createGroupList(indexaAlphabet);

        for (let indexContacs = 0; indexContacs < Object.values(groupedContacts)[indexaAlphabet].length; indexContacs++) {
            document.getElementById(`group-list${indexaAlphabet}ID`).innerHTML += createImgNameEmailDiv(indexaAlphabet, indexContacs)
        };
    };
};


function createAlphabetDiv(indexaAlphabet) {
    return `<div class="alphabet-div"><span>${Object.keys(groupedContacts)[indexaAlphabet]}</span><div class="separate-contacts-list"></div></div>`;
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
    <div class="img-name-email-div" id="img-name-email-div${indexaAlphabet}${indexContacs}ID" 
         onclick="contactDetailsLoad('${indexaAlphabet}${indexContacs}','${indexaAlphabet}','${indexContacs}'), toContactDetails()">
        <div class="img-div" id="img-div${indexaAlphabet}${indexContacs}ID" style="background-color: ${bgColor};">${initials}</div>
        <div class="name-email-div">
            <span id="name${indexaAlphabet}${indexContacs}ID">${name}</span>
            <span class="email-span" id="email${indexaAlphabet}${indexContacs}ID">${email}</span>
        </div>
    </div>`;
};


function contactDetailsLoad(idNumber, indexaAlphabet, indexContacs) {
    const nameElement = document.getElementById('details-nameID');
    const icon = document.getElementById('img-details-divID');
    const detailDiv = document.getElementById('contacts-details-contentsID');
    const eMail = document.getElementById('details-emailID');
    const phone = document.getElementById('details-phoneID');
    const contact = Object.values(groupedContacts)[indexaAlphabet][indexContacs].contact;

    nameElement.innerHTML = contact.name;
    icon.innerHTML = contact.initials;
    icon.style.backgroundColor = getColorForName(contact.name);
    detailDiv.classList.add('display-flex');
    eMail.innerHTML = contact.email;
    phone.innerHTML = contact.phone;
};


function backToContactsList() {
    document.getElementById('contact-details-divID').classList.remove('display-flex');
    document.querySelectorAll('.img-name-email-div').forEach(element => {
        element.style = "";
    });
    document.getElementById('contacts-details-contentsID').classList.remove('display-flex');
};


function toContactDetails() {
    document.getElementById('contact-details-divID').classList.add('display-flex');
};