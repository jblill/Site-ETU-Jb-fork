
document.addEventListener("DOMContentLoaded", function () {
    var selectGroupe = document.getElementById("groupe");

    // 📁 Liste des groupes détectés dans edt_data
    var groupes = [
        "1G1A", "1G1B", "1G2A", "1G2B", "1G3A", "1G3B", "1G4A",
        "2GA1-1", "2GA1-2", "2GA2-1", "2GA2-2", "2GB-1", "2GB-2",
        "3A1-1", "3A1-2", "3A2-1", "3A2-2", "3B-1", "3B-2"
    ];

    // 🏗️ Génère les options dynamiquement
    selectGroupe.innerHTML = groupes.map(g =>
        `<option value="${g}">${g}</option>`
    ).join("");

    // 🛠️ Vérifie si un groupe était déjà sélectionné
    const savedGroup = localStorage.getItem("selectedGroup");
    if (savedGroup && groupes.includes(savedGroup)) {
        selectGroupe.value = savedGroup;
    }

    // 📅 Charge l'emploi du temps au changement de groupe
    selectGroupe.addEventListener("change", function () {
        localStorage.setItem("selectedGroup", this.value);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    var calendarEl = document.getElementById("calendar");
    var selectGroupe = document.getElementById("groupe");

    if (typeof FullCalendar === "undefined") {
        console.error("❌ FullCalendar.js n'est pas chargé !");
        return;
    }

    const savedGroup = localStorage.getItem("selectedGroup");
    if (savedGroup) {
        selectGroupe.value = savedGroup;
    }

    var calendar = new FullCalendar.Calendar(calendarEl, {
        locale: "fr",
        initialView: "timeGridWeek",
        nowIndicator: true,
        slotMinTime: "08:00:00",
        slotMaxTime: "19:00:00",
        height: "150vh",
        contentHeight: "auto",

        allDaySlot: false,
        expandRows: true,
        hiddenDays: [0], // ✅ Supprime le dimanche
        events: [],
        slotEventOverlap: false,


        // 📌 Affichage des événements avec salle + professeurs
        eventDidMount: function (info) {
            let salle = info.event.extendedProps ? info.event.extendedProps.salle : null;
            let salleUrl = info.event.extendedProps ? info.event.extendedProps.salleUrl : null;
            let professeur = info.event.extendedProps ? info.event.extendedProps.professeur : null;

            let contentEl = document.createElement("div");
            contentEl.classList.add("event-details");

            // 📍 Affichage de la salle
            if (salle) {
                let salleEl = document.createElement("div");
                salleEl.classList.add("salle-info");
                salleEl.innerHTML = salleUrl
                    ? `<p onclick="afficheSalle('${salleUrl}')" style="cursor: pointer;" >📍 <strong>${salle}</strong></p>`
                    : `📍 <strong>${salle}</strong>`;
                contentEl.appendChild(salleEl);
            }

            // 👨‍🏫 Affichage du professeur (nom + prénom)
            if (professeur && professeur !== "Inconnu") {
                let profEl = document.createElement("div");
                profEl.classList.add("prof-info");
                profEl.innerHTML = `👨‍🏫 <strong>${professeur}</strong>`;
                contentEl.appendChild(profEl);
            }

            let titleEl = info.el.querySelector(".fc-event-title");
            if (titleEl) {
                titleEl.insertAdjacentElement("afterend", contentEl);
            }
            
            // 🔍 Détection améliorée des ressources (ex: R4.A.L1, R3.02, S2.04, etc.)
            let title = info.event.title || "";

            // 🔍 Détection améliorée des ressources
            let match = title.match(/([RS]\d+(?:\.[A-Z]?(?:&[A-Z])?\.\d+|\.[A-Z]?\.\w+|\.\d+)|S\d+\.[A-Z]?\.\d+)/);
            if (match) {
                let resourceClass = "resource-" + match[1]
                    .replace(/\./g, "-")
                    .replace(/&/g, "")
                    .replace(/\s/g, "");
        
                info.el.classList.add(resourceClass);

            }

            // 🎯 FAIRE CLIGNOTER LES EXAMENS
            if (info.event.title.includes("Examen") || info.event.title.includes("Soutenance") || info.event.title.includes("Présentation") || info.event.title.includes("Evaluation")) {
                info.el.classList.add("exam-event");
            }

            // 📌 Appliquer la classe `.SAE` si c'est un module `Sx.xx`
            if (info.event.title.match(/S\d+\.\d+/)) {
                info.el.classList.add("SAE");
            }

            // 📌 Appliquer la classe `.autonomie` si le cours est en autonomie
            if (info.event.title.toLowerCase().includes("autonomie") || 
            (info.event.extendedProps.description && info.event.extendedProps.description.toLowerCase().includes("autonomie"))) {
            info.el.classList.add("autonomie");
            }

             // 🔍 Récupère la couleur de fond de l'événement
            let backgroundColor = window.getComputedStyle(info.el).backgroundColor;

            // 🔍 Fonction pour vérifier si la couleur de fond est foncée ou claire
            function isDarkColor(color) {
                let rgb = color.match(/\d+/g);
                if (!rgb) return false; // Cas de couleur non valide
                let brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
                return brightness < 128; // Retourne `true` si la couleur est foncée
            }
        }
    });

    calendar.render();

    window.loadCalendar = function () {
        var selectedGroup = selectGroupe.value;
        console.log("🔍 Chargement de l'EDT pour :", selectedGroup);
    
        localStorage.setItem("selectedGroup", selectedGroup);
    
        fetch(`/edt_data/${selectedGroup}.ics`)
            .then((response) => response.text())
            .then((data) => {
                let events = parseICS(data);
    
                calendar.removeAllEvents();
                calendar.addEventSource(events);
            })
            .catch((error) => console.error("❌ Erreur lors du chargement du fichier .ics :", error));
    };

    loadCalendar();

    function parseICS(icsData) {
        let events = [];
        let lines = icsData.split("\n");
        let event = {};

        for (let line of lines) {
            if (line.startsWith("BEGIN:VEVENT")) {
                event = {};
            } else if (line.startsWith("SUMMARY:")) {
                event.title = line.replace("SUMMARY:", "").trim();
            } else if (line.startsWith("DTSTART:")) {
                event.start = formatICSTime(line.replace("DTSTART:", "").trim());
            } else if (line.startsWith("DTEND:")) {
                event.end = formatICSTime(line.replace("DTEND:", "").trim());
            } else if (line.startsWith("LOCATION:")) {
                let salle = line.replace("LOCATION:", "").trim();
                event.extendedProps = {
                    salle: salle || "Salle inconnue",
                    salleUrl: salle ? `carte.html#${encodeURIComponent(salle)}` : null,
                    professeur: "Inconnu",
                };
            } else if (line.startsWith("DESCRIPTION:")) {
                let desc = line.replace("DESCRIPTION:", "").trim();

                // 🔍 Recherche du professeur avec plusieurs formats possibles
                let profMatch = desc.match(/(?:Prof|ENSEIGNANT|Intervenant|RESPONSABLE|Instructor|Speaker|Docent):?\s*([\p{L}\s-]+)/iu);
                if (profMatch) {
                    event.extendedProps.professeur = profMatch[1].trim();
                } else {
                    // 🔍 Essaye de détecter un nom complet (ex: "Jean Dupont")
                    let nameMatch = desc.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/);
                    if (nameMatch) {
                        event.extendedProps.professeur = nameMatch[1].trim();
                    }
                }
            } else if (line.startsWith("END:VEVENT")) {
                events.push(event);
            } else if (line.startsWith("SUMMARY:")) {
                let title = line.replace("SUMMARY:", "").trim();
                event.title = title;
            
                // 🔍 Vérifie si c'est un examen (ajoute d'autres mots-clés si besoin)
                if (title.match(/examen|contrôle|partiel|évaluation|test/i)) {
                    event.extendedProps.isExam = true; // ✅ Marque cet événement comme un examen
                }
            }
        
        }
        return events;
    }

    function formatICSTime(icsTime) {
        let dateObj = new Date(
            Date.UTC(
                parseInt(icsTime.substring(0, 4)), // Année
                parseInt(icsTime.substring(4, 6)) - 1, // Mois (0-indexed)
                parseInt(icsTime.substring(6, 8)), // Jour
                parseInt(icsTime.substring(9, 11)), // Heures
                parseInt(icsTime.substring(11, 13)), // Minutes
                parseInt(icsTime.substring(13, 15)) // Secondes
            )
        );
    
        // ✅ Convertir automatiquement en heure locale avec fuseau correct
        let offset = dateObj.getTimezoneOffset() / -60; // Décalage horaire en heures
        dateObj.setHours(dateObj.getHours() + offset);
    
        return dateObj.toISOString().replace("Z", ""); // Retourne un format compatible YYYY-MM-DDTHH:MM:SS
    }
});
