function addContactOpenClose(){
    document.getElementById('add-contact-divID').classList.toggle('display-none');
    document.getElementById('add-edit-bodyID').classList.toggle('display-none');
}

function editContactOpenClose(){
    document.getElementById('edit-contact-divID').classList.toggle('display-none');
    document.getElementById('add-edit-bodyID').classList.toggle('display-none');
    editLoadContact();
}

function editLoadContact(){
    document.getElementById('edit-nameID').value = document.getElementById('details-nameID').innerText;
    document.getElementById('edit-emailID').value = document.getElementById('details-emailID').innerText;
    document.getElementById('edit-phoneID').value = document.getElementById('details-phoneID').innerText;

    document.getElementById('img-edit-divID').style.backgroundColor = document.getElementById('img-details-divID').style.backgroundColor;
    document.getElementById('img-edit-divID').innerHTML = document.getElementById('img-details-divID').innerHTML;
}

function handleSubmit(event) {
    event.preventDefault();
    document.getElementById('button-new-contact-saveID').disabled = true;
    saveContact();
}

async function saveContact(path = "/contacts", data= {}){
    let response = await fetch(BASE_URL + path + ".json",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(collectDataForSaving(data))
    });
    await response.json();
    emptyInputReloadList();
}

function collectDataForSaving(data){
    data = {
        "email" : document.getElementById('add-emailID').value,
        "iconBackgroundColor" : `hsl(${Math.random()* 360}, ${(Math.random() * 20) + 50}%, ${(Math.random() * 20) + 50}%`,
        "initials" : CreateInitials(),
        "name" : document.getElementById('add-nameID').value,
        "phone" : document.getElementById('add-phoneID').value
    }

    return data;
}

function CreateInitials(){
    let initials = document.getElementById('add-nameID').value;
    if (initials.split(' ').length > 1) {
         initials = initials.slice(0,1) + document.getElementById('add-nameID').value.split(' ')[1].slice(0,1);
    }

    else{
         initials =initials.slice(0,1);
    }
    return initials.toUpperCase();
}

function emptyInputReloadList(){
    document.getElementById('add-nameID').value = "";
    document.getElementById('add-emailID').value = "";
    document.getElementById('add-phoneID').value = "";
    addContactOpenClose();
    initContactsList();
    document.getElementById('button-new-contact-saveID').disabled = false;
}