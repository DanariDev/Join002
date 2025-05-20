// Beispiel-Daten 
let contacts = [
    "Anton Mayer", "Anja Schulz", "Benedikt Ziegler", "David Eisberg", 
    "Eva Fischer", "Emanuel Mauer",
];

let groupedContacts = [];

function contactsList(){
    sortContacts();
    generateSortedContacts();
}

function sortContacts(){
    contacts.forEach(element => {
        let firstLetter = element.charAt(0).toUpperCase();
        if (!groupedContacts[firstLetter]) {
            groupedContacts[firstLetter] = [];
        }
        groupedContacts[firstLetter].push(element);
    });
}

function generateSortedContacts(){
    for (let indexaAlphabet = 0; indexaAlphabet < Object.keys(groupedContacts).length; indexaAlphabet++) {
        document.getElementById('contacts-listID').innerHTML += createAlphabetDiv(indexaAlphabet);
        document.getElementById('contacts-listID').innerHTML += createGroupList(indexaAlphabet);

        for (let indexContacs = 0; indexContacs < Object.values(groupedContacts)[indexaAlphabet].length; indexContacs++) {
            document.getElementById(`group-list${indexaAlphabet}ID`).innerHTML += createImgNameEmailDiv(indexaAlphabet, indexContacs)
            document.getElementById(`img-div${indexaAlphabet}${indexContacs}ID`).style.backgroundColor = `hsl(${Math.random()* 360}, ${(Math.random() * 20) + 50}%, ${(Math.random() * 20) + 50}%`;
        }
    }
}

function createAlphabetDiv(indexaAlphabet){
    return `<div class="alphabet-div"><span>${Object.keys(groupedContacts)[indexaAlphabet]}</span><div class="separate-contacts-list"></div></div>`;
}

function createGroupList(indexaAlphabet){
    return `<div class="group-list" id="group-list${indexaAlphabet}ID"></div>`
}

function createImgNameEmailDiv(indexaAlphabet, indexContacs){
    return `<div class="img-name-email-div"><div class="img-div" id="img-div${indexaAlphabet}${indexContacs}ID">${Object.values(groupedContacts)[indexaAlphabet][indexContacs].slice(0,1) + Object.values(groupedContacts)[indexaAlphabet][indexContacs].split(' ')[1].slice(0,1)}</div><div class="name-email-div"><span>${Object.values(groupedContacts)[indexaAlphabet][indexContacs]}</span><span class="email-span">E-mail<span/></div>`;
}

