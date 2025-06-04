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
  a.classList.toggle('display-none');
  b.classList.toggle('display-none');
};

function editContactOpenClose(load = true) {
  const e = document.getElementById('edit-contact-divID');
  const b = document.getElementById('add-edit-bodyID');
  e.classList.toggle('display-none');
  b.classList.toggle('display-none');
  if (load && !e.classList.contains('display-none')) editLoadContact();
};

function outsideClickCloseEdit(e) {
  const d = document.getElementById('edit-contact-divID');
  const ignore = e.target.closest('[onclick="editContactOpenClose()"]');
  const open = !d.classList.contains('display-none');
  if (open && !d.contains(e.target) && !ignore) editContactOpenClose(false);
};

document.addEventListener('click', outsideClickCloseEdit);

function restrictToNumbers(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.setAttribute('inputmode', 'numeric');
  el.setAttribute('pattern', '[0-9]+');
  el.addEventListener('beforeinput', e => {
    if (/[^0-9]/.test(e.data)) e.preventDefault();
  });
};

restrictToNumbers('add-phoneID');
restrictToNumbers('edit-phoneID');

function editDeleteMenuOpen(e) {
  const m = document.getElementById('edit-delete-divID');
  m.classList.add('display-flex');
  e.stopPropagation();
};

function editDeleteMenuClose() {
  const m = document.getElementById('edit-delete-divID');
  const open = [...m.classList].includes('display-flex');
  if (window.innerWidth <= 620 && open) m.classList.remove('display-flex');
};

function editLoadContact() {
  const name = document.getElementById('details-nameID').innerText;
  const eMail = document.getElementById('details-emailID').innerText;
  const phone = document.getElementById('details-phoneID').innerText;
  const img = document.getElementById('img-details-divID');
  img.style.backgroundColor = getColorForName(name);
  document.getElementById('edit-nameID').value = name;
  document.getElementById('edit-emailID').value = eMail;
  document.getElementById('edit-phoneID').value = phone;
  const text = document.getElementById('img-edit-divID');
  text.style.backgroundColor = getColorForName(name);
  text.innerHTML = img.innerHTML;
};

function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('button-new-contact-saveID');
  btn.disabled = true;
  saveContact();
};

async function saveContact(path = "/contacts", data = {}) {
  const d = collectDataForSaving(data);
  const r = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(d)
  });
  await r.json();
  emptyInputReloadList();
  showToast("Kontakt wurde erfolgreich erstellt.");
};

function collectDataForSaving() {
  const name = document.getElementById('add-nameID').value;
  const icon = n.split(' ').length > 1 ? n[0] + n.split(' ')[1][0] : n[0];
  return {
    email: document.getElementById('add-emailID').value,
    iconBackgroundColor: getColorForName(name),
    initials: icon.toUpperCase(),
    name: name,
    phone: document.getElementById('add-phoneID').value
  };
};

function emptyInputReloadList() {
  document.getElementById('add-nameID').value = "";
  document.getElementById('add-emailID').value = "";
  document.getElementById('add-phoneID').value = "";
  addContactOpenClose();
  initContactsList();
  document.getElementById('button-new-contact-saveID').disabled = false;
};

async function deleteCurrentContact() {
  const n = document.getElementById('details-nameID').innerText;
  if (!confirm(`Möchtest du den Kontakt "${n}" wirklich löschen?`)) return;
  const c = contacts.find(c => c.contact.name === n);
  if (!c) return;
  await fetch(`${BASE_URL}contacts/${c.id}.json`, { method: "DELETE" });
  backToContactsList();
  initContactsList();
  showToast("Kontakt wurde gelöscht.");
};

async function saveEditedContact(e) {
  e.preventDefault();
  const n = document.getElementById('edit-nameID').value;
  const mail = document.getElementById('edit-emailID').value;
  const phone = document.getElementById('edit-phoneID').value;
  const i = n.split(' ').length > 1 ? n[0] + n.split(' ')[1][0] : n[0];
  const c = contacts.find(c => c.contact.name === document.getElementById('details-nameID').innerText);
  if (!c) return;
  const data = {
    name: n,
    email: mail,
    phone: phone,
    initials: i.toUpperCase(),
    iconBackgroundColor: getColorForName(n) // ← geändert
  };
  await fetch(`${BASE_URL}contacts/${c.id}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  showToast("Änderung erfolgreich gespeichert.");
  editContactOpenClose(false);
  initContactsList();
  setTimeout(() => {
    contactDetailsLoad('', '', contacts.indexOf(c));
  }, 100);
};

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
};
