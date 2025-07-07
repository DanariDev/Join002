/**
 * This function creates a template for the alphabet and group
 * 
 * @param {string} letter -hands over the letters of the alphabet
 * @returns -return the HTML template for the alphabet and the group 
 */
function createAlphabetAndGroupTemplate(letter) {
    return `
    <div class="list-alphabet">
      <span>${letter}</span>
      <div class="split-list-line"></div>
    </div>
    <div class="group-list" id="list-group-${letter}"></div>`;
};

/**
 * This function creates a template contact information
 * 
 * @param {string} name -hands over the name of the contact
 * @param {string} letter -hands over the first letter of contact
 * @param {number} index -hands over the index of the contact
 * @param {string} bgColor -hands over the background color of the contact
 * @param {string} email -hands over the email of the contact
 * @param {string} initials -hands over the initials of the contact
 * @returns -return the HTML template for the contact information
 */
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

/**
 * This function creates a template for the left site of the contact-adding-overlay
 * 
 * @returns -return the HTML template for the left site of the contact-adding-overlay
 */
function leftAddingTemplate() {
    return `<div class="lightbox-left">
    <img class="join-logo-left" src="assets/img/logo_dark.png" alt="Join Logo">
    <h2>Add Contact</h2>
    <span>Tasks are better with a team!</span>
</div>`
};

/**
 * This function creates a template for the right site of the contact-adding-overlay
 * 
 * @returns return the HTML template for the right site of the contact-adding-overlay
 */
function rightAddingTemplate() {
    return `<div class="lightbox-right">
    <button class="close-button" id="lightbox-ol-close-btn">X</button>
    <img class="current-icon" src="assets/img/person.png" alt="Person Icon">
<div class="editing-lighbox">
    <div>
        <input id="edit-name" type="text" placeholder="Name" required>
        <div class="error-message name-error"></div>
    </div>
    <div>
        <input id="edit-email" type="email" placeholder="Email" required>
        <div class="error-message email-error"></div>
    </div>
    <div>
        <input id="edit-phone" type="tel" placeholder="Phone" required>
        <div class="error-message phone-error"></div>
    </div>
<div class="btns-lighbox">
<button id="cancel-btn">Cancel <span>X</span></button>
<button id="create-btn">Create Contact <img src="assets/img/check.png" alt="check"></button>
</div>
</div>
</div>`
};

/**
 * This function creates a template for the left site of the contact-editing-overlay
 * 
 * @returns -return the HTML template for the left site of the contact-editing-overlay
 */
function leftEditingTemplate() {
    return `<div class="lightbox-left">
    <img class="join-logo-left" src="assets/img/logo_dark.png" alt="Join Logo">
    <div class="lightbox-subline"></div>
    <h2 class="edit-contact-h2">Edit Contact</h2>
</div>`
};

/**
 * This function creates a template for the right site of the contact-editing-overlay
 * 
 * @returns return the HTML template for the right site of the contact-editing-overlay
 */
function rightEditingTemplate() {
    return `<div class="lightbox-right">
    <button class="close-button" id="lightbox-ol-close-btn">X</button>
    <div id="edit-icon"></div>
    <div class="editing-lighbox">
    <div>
        <input id="edit-name" type="text" placeholder="Name" required>
        <div class="error-message name-error"></div>
    </div>
    <div>
        <input id="edit-email" type="email" placeholder="Email" required>
        <div class="error-message email-error"></div>
    </div>
    <div>
        <input id="edit-phone" type="tel" placeholder="Phone" required>
        <div class="error-message phone-error"></div>
    </div>
        <div class="btns-lighbox">
            <button id="deleteBtn">Delete</button>
            <button id="saveBtn">Save<img src="assets/img/check.png" alt="check"></button>
        </div>
    </div>
</div>`
};