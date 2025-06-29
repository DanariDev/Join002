function initSidbarTopbar(){
    generateInitialsTopBarMenu()
}

/**
 * This function either sets a "G" or the Inicials in the user in the top bar menu icon
 * 
 * 
 */
function generateInitialsTopBarMenu(){
    if (!localStorage.getItem('userName')) {
        document.getElementsByClassName('topbar-user')[0].innerText = "G";
    }
    else{
        NoOrMoreSpaces();
    }
}

/**
 * This function checks whether the Initials should have one or two characters
 * 
 * 
 */
function NoOrMoreSpaces(){
    if(localStorage.getItem('userName').split(' ').length > 1) {
        document.getElementsByClassName('topbar-user')[0].innerText = localStorage.getItem('userName').slice(0,1) + localStorage.getItem('userName').split(' ')[1].slice(0,1);
    }
    else{
        document.getElementsByClassName('topbar-user')[0].innerText = localStorage.getItem('userName').slice(0,1);
    }
}

/**
 * Opens or closes the topbar user menu when the user icon is clicked
 * @param {Event} event - Click event
 */
function openMenu(event) {
  event.stopPropagation(); // Prevent click from bubbling up to body
  const menu = document.getElementById('menuID');
  menu.classList.toggle('d-none'); // Show/hide the menu
}

/**
 * This function closes the topbar menu when you press the body
 * 
 * 
 */
function closeTopbarMenu(){
    const menu = document.getElementById('menuID');
    if (!menu.classList.contains('d-none')) {
        menu.classList.add('d-none');
    }
}