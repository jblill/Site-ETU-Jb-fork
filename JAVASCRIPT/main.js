function redirectTo(url, newTab = true) {
    if (url === "https://www.google.com/") {
        setTimeout(() => {
            if (newTab) {
                window.open(url, '_blank');
            } else {
                window.location.href = url;
            }
        }, 800); // Attente de 800 ms
    } else {
        if (newTab) {
            window.open(url, '_blank');
        } else {
            window.location.href = url;
        }
    }
}

function updateClock() {
    const clockElement = document.getElementById('clock');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);
updateClock();

document.addEventListener("DOMContentLoaded", () => {
    const mainHeader = document.getElementById("main-header");
    let lastScrollTop = 0;

    window.addEventListener("scroll", () => {
        const currentScrollTop = window.pageYOffset;

        if (currentScrollTop > lastScrollTop) {
            mainHeader.classList.remove("slide-down");
            mainHeader.classList.add("slide-up");
        } else {
            mainHeader.classList.remove("slide-up");
            mainHeader.classList.add("slide-down");
        }
        lastScrollTop = currentScrollTop;
    });

    const googleButton = document.querySelector('.google');
    if (googleButton) {
        googleButton.addEventListener('mouseenter', () => googleButton.classList.add('hovered'));
        googleButton.addEventListener('mouseleave', () => googleButton.classList.remove('hovered'));
        googleButton.addEventListener('click', () => {
            googleButton.classList.remove('hovered');
            googleButton.classList.add('clicked');
            setTimeout(() => googleButton.classList.remove('clicked'), 2000);
        });
    }
});

// Fonction pour afficher/masquer le menu
function toggleMenuById(menuId) {
    const menu = document.getElementById(menuId);
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    closeNav();
}

    

// Fonction pour changer le fichier CSS
function changeTheme(theme) {
    const link = document.getElementById('theme-link');
    link.href = theme;

    // Sauvegarder le thème sélectionné dans le stockage local
    localStorage.setItem('selected-theme', theme);

    // Masquer le menu après sélection
    document.getElementById('theme-menu').style.display = 'none';
    closeTheme()
}

// Appliquer le thème sauvegardé lors du chargement de la page
window.onload = function() {
const savedTheme = localStorage.getItem('selected-theme');
if (savedTheme) {
    document.getElementById('theme-link').href = savedTheme;
}
}

function closeTheme() {
    document.getElementById("myTheme").style.width = "0%";
}

function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}

function togglePanel(panelIdToToggle, panelIdToClose) {
    const panelToToggle = document.getElementById(panelIdToToggle);
    const panelToClose = document.getElementById(panelIdToClose);

    if (panelToClose.style.width === "100%") {
        panelToClose.style.width = "0%";
    }

    panelToToggle.style.width = panelToToggle.style.width === "100%" ? "0%" : "100%";
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        const requestFullScreen = document.documentElement.requestFullscreen ||
                                  document.documentElement.webkitRequestFullscreen ||
                                  document.documentElement.msRequestFullscreen;
        if (requestFullScreen) requestFullScreen.call(document.documentElement);
    } else {
        const exitFullScreen = document.exitFullscreen ||
                               document.webkitExitFullscreen ||
                               document.msExitFullscreen;
        if (exitFullScreen) exitFullScreen.call(document);
    }
}
