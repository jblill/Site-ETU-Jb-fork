function redirectTo(url) {
    window.open(url, '_blank');
}

function redirectToL(url) {
    window.location.href = url;
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

document.addEventListener("DOMContentLoaded", function () {
    const mainHeader = document.getElementById("main-header");
    let lastScrollTop = 0;

    window.addEventListener("scroll", function () {
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
});

function redirectToG(url) {
    setTimeout(() => {
        // Redirection vers l'URL
        window.open(url, '_blank');
    
        // Réinitialise le bouton après la redirection
        const googleButton = document.querySelector('.google');
        googleButton.classList.remove('clicked', 'hovered');
        googleButton.style = "";
    }, 800);
}

document.addEventListener("DOMContentLoaded", () => {
    const googleButton = document.querySelector('.google');

    googleButton.addEventListener('mouseenter', () => {
        googleButton.classList.add('hovered');
    });

    googleButton.addEventListener('mouseleave', () => {
        googleButton.classList.remove('hovered');
    });

    googleButton.addEventListener('click', () => {
        googleButton.classList.remove('hovered');
        googleButton.classList.add('clicked');
        setTimeout(() => {
            googleButton.classList.remove('clicked');
        }, 2000);
    });
});


// Fonction pour afficher/masquer le menu
function toggleMenu() {
const menu = document.getElementById('theme-menu');
menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
closeNav();
}

function toggleMenu2() {
    const menu = document.getElementById('sommaire-menu');
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

function toggleNav() {
    const nav = document.getElementById("myNav");
    const theme = document.getElementById("myTheme");

    // Fermer le menu des thèmes si ouvert
    if (theme.style.width === "100%") {
        theme.style.width = "0%";
    }

    // Basculer l'état de myNav
    nav.style.width = nav.style.width === "100%" ? "0%" : "100%";
}

function toggleTheme() {
    const theme = document.getElementById("myTheme");
    const nav = document.getElementById("myNav");

    // Fermer la navigation si ouverte
    if (nav.style.width === "100%") {
        nav.style.width = "0%";
    }

    // Basculer l'état de myTheme
    theme.style.width = theme.style.width === "100%" ? "0%" : "100%";
}


document.getElementById("veille").addEventListener("click", function () {
    if (!document.fullscreenElement) {
        // Passe en plein écran
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) { // Pour Safari
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { // Pour IE/Edge
            document.documentElement.msRequestFullscreen();
        }
    } else {
        // Quitte le plein écran
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { // Pour Safari
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // Pour IE/Edge
            document.msExitFullscreen();
        }
    }
});
