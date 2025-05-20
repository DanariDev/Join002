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
    return `<div class="img-name-email-div" id="img-name-email-div${indexaAlphabet}${indexContacs}ID" onclick="contactDeletesLoad('${indexaAlphabet}${indexContacs}')"><div class="img-div" id="img-div${indexaAlphabet}${indexContacs}ID">${Object.values(groupedContacts)[indexaAlphabet][indexContacs].slice(0,1) + Object.values(groupedContacts)[indexaAlphabet][indexContacs].split(' ')[1].slice(0,1)}</div><div class="name-email-div"><span id=name${indexaAlphabet}${indexContacs}ID>${Object.values(groupedContacts)[indexaAlphabet][indexContacs]}</span><span class="email-span" id="email${indexaAlphabet}${indexContacs}ID">Email-address<span/></div>`;
}

function contactDeletesLoad(idNumber){
    document.getElementById('contacts-details-contentsID').classList.add('display-flex');
    document.getElementById('img-details-divID').style.backgroundColor = document.getElementById(`img-div${idNumber}ID`).style.backgroundColor;
    document.getElementById('img-details-divID').innerHTML = document.getElementById(`img-div${idNumber}ID`).innerHTML;
    document.getElementById('details-nameID').innerHTML = document.getElementById(`name${idNumber}ID`).innerHTML;
    document.getElementById('details-emailID').innerHTML = document.getElementById(`email${idNumber}ID`).innerHTML;

    for (let index = 0; index < document.getElementsByClassName('img-name-email-div').length; index++) {
        document.getElementsByClassName('img-name-email-div')[index].style ="";
    }
    document.getElementById(`img-name-email-div${idNumber}ID`).style.backgroundColor = '#2a3647';
    document.getElementById(`img-name-email-div${idNumber}ID`).style.color = 'white';
    
}
