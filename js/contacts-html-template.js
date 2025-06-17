function createAlphabetAndGroupTemplate(letter) {
    return `
    <div class="list-alphabet">
      <span>${letter}</span>
      <div class="split-list-line"></div>
    </div>
    <div class="group-list" id="list-group-${letter}"></div>`;
};


function informationTemplate(name, letter, index, bgColor, email, initials) {
    return `
    <div class="list-contact-wrapper"
         id="contact${letter}-${index}"
         data-letter="${letter}"
         data-index="${index}">
        <div class="initial-icon" style="background-color: ${bgColor};">${initials}</div>
        <div class="list-contact-information">
            <span class="list-name">${name}</span>
            <span class="list-email" id="email${letter}${index}">${email}</span>
        </div>
    </div>`
};


function leftAddingTemplate() {
    return `<div class="lightbox-left">
    <img class="join-logo-left" src="../assets/img/logo_dark.png" alt="Join Logo">
    <h2>Add Contact</h2>
    <div class="lightbox-subline">
        <span>Tasks are better with a team!</span>
        <div class="blue-line"></div>
    </div>
</div>`
};


function rightAddingTemplate() {
    return `<div class="lightbox-right">
    <img class="current-icon" src="../assets/img/person.png" alt="Person Icon">
<div class="editing-lighbox">
    <input id="edit-name" type="text" placeholder="Name" required>
    <input id="edit-email" type="email" placeholder="Email" required>
    <input id="edit-phone" type="tel" placeholder="Phone" required>
<div class="btns-lighbox">
<button id="cancel-btn">Cancel <span>X</span></button>
<button id="create-btn">Create Contact <img src="../assets/img/check.png" alt="check"></button>
</div>
</div>
</div>`
};


function leftEditingTemplate() {
    return `<div class="lightbox-left">
    <img class="join-logo-left" src="../assets/img/logo_dark.png" alt="Join Logo">
    <div class="lightbox-subline">
    <h2>Edit Contact</h2>
        <div class="blue-line"></div>
    </div>
</div>`
};


function rightEditingTemplate() {
    return `<div class="lightbox-right">
    <div id="edit-icon"></div>
    <div class="editing-lighbox">
   <input id="edit-name" type="text" placeholder="Name" required>
    <input id="edit-email" type="email" placeholder="Email" required>
    <input id="edit-phone" type="tel" placeholder="Phone" required>
        <div class="btns-lighbox">
            <button id="deleteBtn">Delete</button>
            <button id="saveBtn">Save<img src="/assets/img/check.png" alt="check"></button>
        </div>
    </div>
</div>`
};