function initSidbarTopbar(){
    generateInitialsTopBarMenu()
}

function generateInitialsTopBarMenu(){
    if (!localStorage.getItem('userName')) {
        document.getElementsByClassName('topbar-user')[0].innerText = "G";
    }
    else{
        NoOrMoreSpaces();
    }
}

function NoOrMoreSpaces(){
    if(document.getElementById('add-nameID').value.split(' ').length > 1) {
        document.getElementsByClassName('topbar-user')[0].innerText = localStorage.getItem('userName').slice(0,1) + localStorage.getItem('userName').split(' ')[1].slice(0,1);
    }
    else{
        document.getElementsByClassName('topbar-user')[0].innerText = localStorage.getItem('userName').slice(0,1);
    }
}

function closeTopbarMenu(){
    const menu = document.getElementById('menuID');
    if (!menu.classList.contains('d-none')) {
        menu.classList.add('d-none');
    }
}