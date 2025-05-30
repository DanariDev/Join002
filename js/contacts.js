const BASE_URL = "https://join002-26fa4-default-rtdb.firebaseio.com/";
let contacts = [];
let groupedContacts = [];


async function initContactsList() {
    await onLoadContacts();
    sortContacts();
    generateSortedContacts();
}

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
        )
    }
}

async function getAllContacts(path) {
    let response = await fetch(BASE_URL + path + ".json");
    return responseToJson = await response.json();
}

function sortContacts() {
    contacts.sort((a, b) => a.contact.name.localeCompare(b.contact.name));
    contacts.forEach(element => {
        let firstLetter = element.contact.name.charAt(0).toUpperCase();
        if (!groupedContacts[firstLetter]) {
            groupedContacts[firstLetter] = [];
        }
        groupedContacts[firstLetter].push(element);
    });
}

function generateSortedContacts() {
    for (let indexaAlphabet = 0; indexaAlphabet < Object.keys(groupedContacts).length; indexaAlphabet++) {
        document.getElementById('contacts-listID').innerHTML += createAlphabetDiv(indexaAlphabet);
        document.getElementById('contacts-listID').innerHTML += createGroupList(indexaAlphabet);

        for (let indexContacs = 0; indexContacs < Object.values(groupedContacts)[indexaAlphabet].length; indexContacs++) {
            document.getElementById(`group-list${indexaAlphabet}ID`).innerHTML += createImgNameEmailDiv(indexaAlphabet, indexContacs)
            document.getElementById(`img-div${indexaAlphabet}${indexContacs}ID`).style.backgroundColor = Object.values(groupedContacts)[indexaAlphabet][indexContacs].contact.iconBackgroundColor; //`hsl(${Math.random()* 360}, ${(Math.random() * 20) + 50}%, ${(Math.random() * 20) + 50}%`;
        }
    }
}

function createAlphabetDiv(indexaAlphabet) {
    return `<div class="alphabet-div"><span>${Object.keys(groupedContacts)[indexaAlphabet]}</span><div class="separate-contacts-list"></div></div>`;
}

function createGroupList(indexaAlphabet) {
    return `<div class="group-list" id="group-list${indexaAlphabet}ID"></div>`
}

//function createImgNameEmailDiv(indexaAlphabet, indexContacs){
//    return `<div class="img-name-email-div" id="img-name-email-div${indexaAlphabet}${indexContacs}ID" onclick="contactDetailsLoad('${indexaAlphabet}${indexContacs}','${indexaAlphabet}','${indexContacs}'), toContactDetails()"><div class="img-div" id="img-div${indexaAlphabet}${indexContacs}ID">${Object.values(groupedContacts)[indexaAlphabet][indexContacs].contact.initials}</div><div class="name-email-div"><span id=name${indexaAlphabet}${indexContacs}ID>${Object.values(groupedContacts)[indexaAlphabet][indexContacs].contact.name}</span><span class="email-span" id="email${indexaAlphabet}${indexContacs}ID">${Object.values(groupedContacts)[indexaAlphabet][indexContacs].contact.email}<span/></div>`;
//}

// Vorschlag für diese function mit geringerer Fehleranfälligkeit und übersichtlicherer Struktur //
function createImgNameEmailDiv(indexaAlphabet, indexContacs) {
    const contact = Object.values(groupedContacts)[indexaAlphabet][indexContacs].contact;
    const initials = contact.initials;
    const name = contact.name;
    const email = contact.email;
    return `
    <div class="img-name-email-div" id="img-name-email-div${indexaAlphabet}${indexContacs}ID" 
         onclick="contactDetailsLoad('${indexaAlphabet}${indexContacs}','${indexaAlphabet}','${indexContacs}'), toContactDetails()">
        <div class="img-div" id="img-div${indexaAlphabet}${indexContacs}ID">${initials}</div>
        <div class="name-email-div">
            <span id="name${indexaAlphabet}${indexContacs}ID">${name}</span>
            <span class="email-span" id="email${indexaAlphabet}${indexContacs}ID">${email}</span>
        </div>
    </div>`;
}

function contactDetailsLoad(idNumber, indexaAlphabet, indexContacs) {
    document.getElementById('contacts-details-contentsID').classList.add('display-flex');
    document.getElementById('img-details-divID').style.backgroundColor = Object.values(groupedContacts)[indexaAlphabet][indexContacs].contact.iconBackgroundColor;

    document.getElementById('img-details-divID').innerHTML = Object.values(groupedContacts)[indexaAlphabet][indexContacs].contact.initials;
    document.getElementById('details-nameID').innerHTML = Object.values(groupedContacts)[indexaAlphabet][indexContacs].contact.name;
    document.getElementById('details-emailID').innerHTML = Object.values(groupedContacts)[indexaAlphabet][indexContacs].contact.email;
    document.getElementById('details-phoneID').innerHTML = Object.values(groupedContacts)[indexaAlphabet][indexContacs].contact.phone;

    for (let index = 0; index < document.getElementsByClassName('img-name-email-div').length; index++) {
        document.getElementsByClassName('img-name-email-div')[index].style = "";
    }
    document.getElementById(`img-name-email-div${idNumber}ID`).style.backgroundColor = '#2a3647';
    document.getElementById(`img-name-email-div${idNumber}ID`).style.color = 'white';

}

function backToContactsList() {
    document.getElementById('contact-details-divID').classList.remove('display-flex');
    document.querySelectorAll('.img-name-email-div').forEach(element => {
        element.style = "";
    });
    document.getElementById('contacts-details-contentsID').classList.remove('display-flex');
}

function toContactDetails() {
    document.getElementById('contact-details-divID').classList.add('display-flex');
}