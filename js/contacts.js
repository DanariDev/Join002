import { ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { db } from "./firebase-config.js";

let groupedContacts = [];

function contactsList() {
    let contactsRef = ref(db, "contacts");
    onValue(contactsRef, function(snapshot) {
        let contacts = [];
        let data = snapshot.val();
        if (data) {
            for (let key in data) {
                let contact = data[key];
                if (contact.name && contact.email) {
                    contacts.push({ name: contact.name, email: contact.email, initials: contact.initials });
                }
            }
        }
        loadUsers(contacts);
    }, { onlyOnce: true });
}

function loadUsers(contacts) {
    let usersRef = ref(db, "users");
    onValue(usersRef, function(snapshot) {
        let usersData = snapshot.val();
        if (usersData) {
            for (let key in usersData) {
                let user = usersData[key];
                if (user.name && user.email) {
                    let initials = user.name.split(" ")[0][0] + user.name.split(" ")[1][0];
                    contacts.push({ name: user.name, email: user.email, initials: initials.toUpperCase() });
                }
            }
        }
        filterAndSortContacts(contacts);
    }, { onlyOnce: true });
}

function filterAndSortContacts(contacts) {
    let uniqueContacts = [];
    for (let i = 0; i < contacts.length; i++) {
        let isDuplicate = false;
        for (let j = 0; j < uniqueContacts.length; j++) {
            if (contacts[i].name == uniqueContacts[j].name && contacts[i].email == uniqueContacts[j].email) {
                isDuplicate = true;
            }
        }
        if (!isDuplicate) uniqueContacts.push(contacts[i]);
    }
    sortContacts(uniqueContacts);
    generateSortedContacts();
}

function sortContacts(contacts) {
    groupedContacts = {};
    for (let i = 0; i < contacts.length; i++) {
        let firstLetter = contacts[i].name[0].toUpperCase();
        if (!groupedContacts[firstLetter]) {
            groupedContacts[firstLetter] = [];
        }
        groupedContacts[firstLetter].push(contacts[i]);
    }
}

function generateSortedContacts() {
    let listContainer = document.getElementById("contacts-listID");
    listContainer.innerHTML = "";
    for (let letter in groupedContacts) {
        listContainer.innerHTML += createAlphabetDiv(letter);
        listContainer.innerHTML += createGroupList(letter);
        for (let i = 0; i < groupedContacts[letter].length; i++) {
            appendContactDiv(letter, i);
        }
    }
}

function appendContactDiv(letter, indexB) {
    let groupList = document.getElementById("group-list" + letter + "ID");
    let indexA = letter.charCodeAt(0) - 65; 
    groupList.innerHTML += createImgNameEmailDiv(indexA, indexB);
    let imgDiv = document.getElementById("img-div" + indexA + indexB + "ID");
    let hue = Math.random() * 360;
    imgDiv.style.backgroundColor = "hsl(" + hue + ", 50%, 50%)";
}

function createAlphabetDiv(letter) {
    let html = "<div class='alphabet-div'><span>" + letter + "</span>";
    html += "<div class='separate-contacts-list'></div></div>";
    return html;
}

function createGroupList(letter) {
    return "<div class='group-list' id='group-list" + letter + "ID'></div>";
}

function createImgNameEmailDiv(indexA, indexB) {
    let letter = String.fromCharCode(65 + indexA);
    let contact = groupedContacts[letter][indexB];
    let html = "<div class='img-name-email-div' id='img-name-email-div" + indexA + indexB + "ID'";
    html += " onclick=\"contactDeletesLoad('" + indexA + indexB + "')\">";
    html += "<div class='img-div' id='img-div" + indexA + indexB + "ID'>" + contact.initials + "</div>";
    html += "<div class='name-email-div'>";
    html += "<span id='name" + indexA + indexB + "ID'>" + contact.name + "</span>";
    html += "<span class='email-span' id='email" + indexA + indexB + "ID'>" + contact.email + "</span>";
    html += "</div></div>";
    return html;
}

function contactDeletesLoad(idNumber) {
    let details = document.getElementById("contacts-details-contentsID");
    details.classList.add("display-flex");
    let imgDetails = document.getElementById("img-details-divID");
    imgDetails.style.backgroundColor = document.getElementById("img-div" + idNumber + "ID").style.backgroundColor;
    imgDetails.innerHTML = document.getElementById("img-div" + idNumber + "ID").innerHTML;
    document.getElementById("details-nameID").innerHTML = document.getElementById("name" + idNumber + "ID").innerHTML;
    document.getElementById("details-emailID").innerHTML = document.getElementById("email" + idNumber + "ID").innerHTML;
    updateContactDivStyles(idNumber);
}

function updateContactDivStyles(idNumber) {
    let divs = document.getElementsByClassName("img-name-email-div");
    for (let i = 0; i < divs.length; i++) {
        divs[i].style = "";
    }
    let selectedDiv = document.getElementById("img-name-email-div" + idNumber + "ID");
    selectedDiv.style.backgroundColor = "#2a3647";
    selectedDiv.style.color = "white";
}

function addNewContact(name, email) {
    let initials = name.split(" ")[0][0] + name.split(" ")[1][0];
    initials = initials.toUpperCase();
    let contactsRef = ref(db, "contacts/" + email.replace(".", "_"));
    set(contactsRef, {
        name: name,
        email: email,
        initials: initials
    });
    console.log("Kontakt " + name + " wurde hinzugefügt.");
}

export { contactsList, addNewContact };