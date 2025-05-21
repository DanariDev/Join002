function loadSidebar() {
    const isGuest = localStorage.getItem('isGuest') === 'true';
    const sidebarDiv = document.getElementById('change-sidebar');
    const file = isGuest ? 'sidebar-guest.html' : 'sidebar.html';

    fetch(file)
        .then(response => {
            if (!response.ok) throw new Error(`Fehler beim Laden der Sidebar: ${response.status}`);
            return response.text();
        })
        .then(html => {
            sidebarDiv.innerHTML = html;
            includeNestedHTML();
        })
        .catch(err => {
            sidebarDiv.innerHTML = '<p>Sidebar konnte nicht geladen werden.</p>';
            console.error(err);
        });
}

function includeNestedHTML() {
    const elements = document.querySelectorAll('[include-html]');
    elements.forEach(el => {
        const file = el.getAttribute('include-html');
        fetch(file)
            .then(response => response.text())
            .then(data => {
                el.innerHTML = data;
                el.removeAttribute('include-html');
                includeNestedHTML();
            })
            .catch(err => {
                el.innerHTML = '<p>Sidebar konnte nicht geladen werden.</p>';
                console.error(err);
            });
    });
}

window.addEventListener('DOMContentLoaded', loadSidebar);
