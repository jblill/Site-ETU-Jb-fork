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
    const veilleElement = document.getElementById("veille");

    if (!document.fullscreenElement) {
        veilleElement.style.display = "block";
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

// Ajoute un gestionnaire d'événements pour détecter les changements de plein écran
document.addEventListener("fullscreenchange", () => {
    const veilleElement = document.getElementById("veille");
    if (!document.fullscreenElement) {
        veilleElement.style.display = "none";
    }
});

// Données des salles avec leurs configurations réseau
const roomConfig = {
    I002: { ip: "10.203.28.***", Passerelle: "10.203.28.1" },
    I004: { ip: "10.203.28.***", Passerelle: "10.203.28.1" },
    I009: { ip: "10.203.28.***", Passerelle: "10.203.28.1" },
    I010: { ip: "10.203.9.***", Passerelle: "10.203.9.1" },
    I102: { ip: "10.203.28.***", Passerelle: "10.203.28.1"},
    I104: { ip: "10.203.28.***", Passerelle: "10.203.28.1" },
    I106: { ip: "10.203.28.***", Passerelle: "10.203.28.1"},
};

// Met à jour les champs en fonction de la salle sélectionnée
function updateReseauConfig() {
    const room = document.getElementById("select-salle").value;
    const config = roomConfig[room] || { ip: "", Passerelle: "" };

    // Mise à jour des champs
    document.getElementById("ip").value = config.ip;
    document.getElementById("Passerelle").value = config.Passerelle;
}

document.addEventListener("DOMContentLoaded", function () {
    const header = document.getElementById("main-header");

    // Objets contenant les IDs des déclencheurs et des menus associés
    const menus = {
        "navigation": "navigation-contenu",
        "theme": "theme-contenu"
    };

    let timeouts = {};

    // Fonction pour mettre à jour la position du menu sous le header
    function updateMenuPosition(menuId) {
        const headerHeight = header.offsetHeight;
        const menu = document.getElementById(menuId);
        if (menu) {
            menu.style.top = headerHeight + "px"; // Place le menu juste en dessous du header
        }
    }

    // Fonction pour afficher un menu
    function showMenu(menuId) {
        clearTimeout(timeouts[menuId]); // Annule la fermeture du menu s'il y a un timeout en cours
        updateMenuPosition(menuId);
        const menu = document.getElementById(menuId);
        if (menu) {
            menu.style.maxHeight = menu.scrollHeight + "px"; // Déroulement fluide
        }
    }

    // Fonction pour cacher un menu après un délai
    function hideMenu(menuId) {
        timeouts[menuId] = setTimeout(() => {
            const menu = document.getElementById(menuId);
            if (menu) {
                menu.style.maxHeight = "0px"; // Fermeture fluide
            }
        }, 300);
    }

    // Initialiser la mise à jour des positions des menus
    Object.values(menus).forEach(menuId => updateMenuPosition(menuId));

    // Mise à jour de la position des menus au redimensionnement de la fenêtre
    window.addEventListener("resize", () => {
        Object.values(menus).forEach(updateMenuPosition);
    });

    // Ajouter les événements pour chaque menu
    Object.entries(menus).forEach(([triggerId, menuId]) => {
        const trigger = document.getElementById(triggerId);
        const menu = document.getElementById(menuId);

        if (trigger && menu) {
            trigger.addEventListener("mouseenter", () => showMenu(menuId));
            menu.addEventListener("mouseenter", () => showMenu(menuId));

            trigger.addEventListener("mouseleave", () => hideMenu(menuId));
            menu.addEventListener("mouseleave", () => hideMenu(menuId));
        }
    });
});

function afficheSalle(salleURL) {
    localStorage.setItem("salleCiblee", salleURL);
    
    redirectTo(salleURL, false);
}

document.addEventListener("DOMContentLoaded", function () {
    let salleCiblee = localStorage.getItem("salleCiblee");

    if (salleCiblee) {

        // 🔹 Extraire uniquement l'ID après `#`
        let salleId = salleCiblee.split("#")[1]; 
        if (!salleId) {
            console.warn("⚠️ Aucun ID trouvé après `#` dans :", salleCiblee);
            return;
        }

        // 🔄 Décodage pour gérer les %20 → espaces
        let salleIdDecoded = decodeURIComponent(salleId);

        // 🔍 Recherche de la salle avec les deux formats d'ID
        function highlightSalle() {
            let salleElement = document.getElementById(salleIdDecoded) || document.getElementById(salleId);

            if (salleElement) {
                salleElement.style.backgroundColor = "orange";
                salleElement.style.color = "white";
                salleElement.style.fontWeight = "bold";
                localStorage.removeItem("salleCiblee"); // Nettoyage après application
            } else {
                console.warn("❌ Salle introuvable :", salleIdDecoded);
            }
        }

        // 🔄 Petit délai pour laisser la page charger avant d'appliquer la couleur
        setTimeout(highlightSalle, 500);
    }
});
