// add-edit-contact.js (aufgeräumt und funktionsbereit)

function getColorForName(name) {
  const colors = [
    '#FF5733', '#33B5FF', '#33FF99', '#FF33EC', '#ffcb20',
    '#9D33FF', '#33FFDA', '#FF8C33', '#3385FF', '#FF3333'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function addContactOpenClose() {
  const a = document.getElementById('add-contact-divID');
  const b = document.getElementById('add-edit-bodyID');
  if (!a || !b) return; // Sicherheitsprüfung
  a.classList.toggle('d-none');
  b.classList.toggle('d-none');
  console.log("Add Contact toggled");

}

function outsideClickCloseEdit(e) {
  const d = document.getElementById('edit-contact-divID');
  const ignore = e.target.closest('[onclick="editContactOpenClose()"]');
  const open = d && !d.classList.contains('d-none');
  if (open && !d.contains(e.target) && !ignore) editContactOpenClose(false);
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

function editDeleteMenuOpen(e) {
  const m = document.getElementById('edit-delete-divID');
  if (m) m.classList.add('dispaly-flex');
  e.stopPropagation();
}

function editDeleteMenuClose() {
  const m = document.getElementById('edit-delete-divID');
  if (!m) return; // Sicherheitsprüfung: Wenn das Element nicht existiert, abbrechen
  const open = [...m.classList].includes('display-flex');
  if (window.innerWidth <= 620 && open) m.classList.remove('display-flex');
}

function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('button-new-contact-saveID');
  btn.disabled = true;
  saveContact();
}

async function saveContact(path = "/contacts", data = {}) {
  const d = collectDataForSaving();
  const r = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(d)
  });
  await r.json();
  emptyInputReloadList();
  showToast("Kontakt wurde erfolgreich erstellt.");
}

function collectDataForSaving() {
  const name = document.getElementById('add-nameID').value;
  const icon = name.split(' ').length > 1 ? name[0] + name.split(' ')[1][0] : name[0];
  return {
    email: document.getElementById('add-emailID').value,
    iconBackgroundColor: getColorForName(name),
    initials: icon.toUpperCase(),
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

  const editDiv = document.getElementById('edit-contact-divID');
  if (editDiv && !editDiv.classList.contains('d-none')) {
    editContactOpenClose();
  }
}

function showToast(msg) {
  let t = document.createElement('div');
  t.innerText = msg;
  t.style.position = 'fixed';
  t.style.bottom = '32px';
  t.style.right = '32px';
  t.style.padding = '16px';
  t.style.backgroundColor = '#2a3647';
  t.style.color = 'white';
  t.style.borderRadius = '8px';
  t.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}