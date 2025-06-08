async function initSidbarTopbar(){
    // await loadSidbar();
    // await loadTopbar();
    generateInitialsTopBarMenu()
}

async function loadSidbar(){
    try{
        const reponse = await fetch('../sidebar.html');
        const html = await reponse.text();
        document.getElementById('sidebarID').innerHTML = html;
    }
    catch (error) {
        console.error('Fehler beim Laden des Headers:', error );
    }
}

async function loadTopbar(){
    try{
        const reponse = await fetch('../templates/topbar.html');
        const html = await reponse.text();
        document.getElementById('topbarID').innerHTML = html;
    }
    catch (error) {
        console.error('Fehler beim Laden des Headers:', error );
    }
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

function openMenu() {
    document.getElementById('menuID').classList.toggle('display-none');
}



