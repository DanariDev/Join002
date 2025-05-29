function addContactOpenClose() {
    const addDiv = document.getElementById('add-contact-divID');
    const body = document.getElementById('add-edit-bodyID');
    addDiv.classList.toggle('display-none');
    body.classList.toggle('display-none');
  }
  
  function editContactOpenClose(load = true) {
    const editDiv = document.getElementById('edit-contact-divID');
    const body = document.getElementById('add-edit-bodyID');
    editDiv.classList.toggle('display-none');
    body.classList.toggle('display-none');
    if (load && !editDiv.classList.contains('display-none')) editLoadContact();
  }
  
  function outsideClickCloseEdit(e) {
    const div = document.getElementById('edit-contact-divID');
    const ignoreClick = e.target.closest('[onclick="editContactOpenClose()"]');
    const isOpen = !div.classList.contains('display-none');
    if (isOpen && !div.contains(e.target) && !ignoreClick) editContactOpenClose(false);
  }
  
  document.addEventListener('click', outsideClickCloseEdit);
  
  function restrictToNumbers(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.setAttribute('inputmode', 'numeric');
    el.setAttribute('pattern', '[0-9]+');
    el.addEventListener('beforeinput', e => {
      if (/[^0-9]/.test(e.data)) e.preventDefault();
    });
  }
  
  restrictToNumbers('add-phoneID');
  restrictToNumbers('edit-phoneID');
  
  function editDeleteMenuOpen(event) {
    const menu = document.getElementById('edit-delete-divID');
    menu.classList.add('display-flex');
    event.stopPropagation();
  }
  
  function editDeleteMenuClose() {
    const menu = document.getElementById('edit-delete-divID');
    const isOpen = [...menu.classList].includes('display-flex');
    if (window.innerWidth <= 620 && isOpen) {
      menu.classList.remove('display-flex');
    }
  }
  
  function editLoadContact() {
    const name = document.getElementById('details-nameID').innerText;
    const email = document.getElementById('details-emailID').innerText;
    const phone = document.getElementById('details-phoneID').innerText;
    const imgDiv = document.getElementById('img-details-divID');
    document.getElementById('edit-nameID').value = name;
    document.getElementById('edit-emailID').value = email;
    document.getElementById('edit-phoneID').value = phone;
    const editImgDiv = document.getElementById('img-edit-divID');
    editImgDiv.style.backgroundColor = imgDiv.style.backgroundColor;
    editImgDiv.innerHTML = imgDiv.innerHTML;
  }
  
  function handleSubmit(event) {
    event.preventDefault();
    const saveBtn = document.getElementById('button-new-contact-saveID');
    saveBtn.disabled = true;
    saveContact();
  }
  
  async function saveContact(path = "/contacts", data = {}) {
    const contactData = collectDataForSaving(data);
    const response = await fetch(BASE_URL + path + ".json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactData)
    });
    await response.json();
    emptyInputReloadList();
    showToast("Kontakt wurde erfolgreich erstellt.");
  }
  
  function collectDataForSaving(data) {
    const nameInput = document.getElementById('add-nameID');
    const name = nameInput.value;
    const initials = name.split(' ').length > 1
      ? name[0] + name.split(' ')[1][0]
      : name[0];
    return {
      email: document.getElementById('add-emailID').value,
      iconBackgroundColor: `hsl(${Math.random()*360}, ${(Math.random()*20)+50}%, ${(Math.random()*20)+50}%)`,
      initials: initials.toUpperCase(),
      name: name,
      phone: document.getElementById('add-phoneID').value
    };
  }
  
  function emptyInputReloadList() {
    document.getElementById('add-nameID').value = "";
    document.getElementById('add-emailID').value = "";
    document.getElementById('add-phoneID').value = "";
    addContactOpenClose();
    initContactsList();
    document.getElementById('button-new-contact-saveID').disabled = false;
  }
  
  async function deleteCurrentContact() {
    const name = document.getElementById('details-nameID').innerText;
    if (!confirm(`Möchtest du den Kontakt "${name}" wirklich löschen?`)) return;
    const contact = contacts.find(c => c.contact.name === name);
    if (!contact) return;
    await fetch(`${BASE_URL}contacts/${contact.id}.json`, { method: "DELETE" });
    backToContactsList();
    initContactsList();
    showToast("Kontakt wurde gelöscht.");
  }
  
  async function saveEditedContact(event) {
    event.preventDefault();
    const name = document.getElementById('edit-nameID').value;
    const email = document.getElementById('edit-emailID').value;
    const phone = document.getElementById('edit-phoneID').value;
    const initials = name.split(' ').length > 1
      ? name[0] + name.split(' ')[1][0]
      : name[0];
    const contact = contacts.find(c => c.contact.name === document.getElementById('details-nameID').innerText);
    if (!contact) return;
    const updatedData = {
      name,
      email,
      phone,
      initials: initials.toUpperCase(),
      iconBackgroundColor: document.getElementById('img-edit-divID').style.backgroundColor
    };
    await fetch(`${BASE_URL}contacts/${contact.id}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData)
    });
    showToast("Änderung erfolgreich gespeichert.");
    editContactOpenClose(false);
    initContactsList();
    setTimeout(() => {
      contactDeletesLoad('', '', contacts.indexOf(contact));
    }, 100);
  }
  
  function showToast(message) {
    let toast = document.createElement('div');
    toast.innerText = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '32px';
    toast.style.right = '32px';
    toast.style.padding = '16px';
    toast.style.backgroundColor = '#2a3647';
    toast.style.color = 'white';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
  