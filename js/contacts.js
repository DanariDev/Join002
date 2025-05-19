// Beispiel-Daten
let contacts = [
    "Anton Mayer", "Anja Schulz", "Benedikt Ziegler", "David Eisberg", 
    "Eva Fischer", "Emanuel Mauer"
];

let groupedContacts = [];

function contactsList(){
    contacts.forEach(element => {
        const firstLetter = element.charAt(0).toUpperCase();
        if (!groupedContacts[firstLetter]) {
            groupedContacts[firstLetter] = [];
        }
        groupedContacts[firstLetter].push(element);
    });

    for (let indexaAlphabet = 0; indexaAlphabet < Object.keys(groupedContacts).length; indexaAlphabet++) {
        document.getElementById('contacts-listID').innerHTML += `<div class="alphabet-div"><span>${Object.keys(groupedContacts)[indexaAlphabet]}</span><div class="separate-contacts-list"></div></div>`;
        document.getElementById('contacts-listID').innerHTML += `<div class="group-list" id="group-list${indexaAlphabet}ID"></div>`

        for (let indexContacs = 0; indexContacs < Object.values(groupedContacts)[indexaAlphabet].length; indexContacs++) {
            document.getElementById(`group-list${indexaAlphabet}ID`).innerHTML += `<div class="img-name-email-div"><div class="img-div" id="img-div${indexaAlphabet}${indexContacs}ID">${Object.values(groupedContacts)[indexaAlphabet][indexContacs].slice(0,1) + Object.values(groupedContacts)[indexaAlphabet][indexContacs].split(' ')[1].slice(0,1)}</div><div class="name-email-div"><span>${Object.values(groupedContacts)[indexaAlphabet][indexContacs]}</span><span class="email-span">E-mail<span/></div>`;
            document.getElementById(`img-div${indexaAlphabet}${indexContacs}ID`).style.backgroundColor = `hsl(${Math.random()* 360}, ${(Math.random() * 20) + 50}%, ${(Math.random() * 20) + 50}%`;
        }
    }
}
