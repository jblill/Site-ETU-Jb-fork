document.addEventListener("DOMContentLoaded", function () {
    function getURLParam(param) {
        let urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    let selectedGroup = localStorage.getItem("selectedGroup") || getURLParam("groupe") || "1G1A";
    localStorage.setItem("selectedGroup", selectedGroup);
    let groupeSelect = document.getElementById("groupe");
    if (groupeSelect) {
        groupeSelect.value = selectedGroup;
    }
    
    function filterEventsForToday(events) {
        let now = new Date();
        let today = new Date();
        today.setHours(0, 0, 0, 0);

        let tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        return events.filter(event => {
            let eventStart = new Date(event.start);
            return eventStart >= today && eventStart < tomorrow;
        });
    }

    function updateDayAt19H(calendar) {
        let now = new Date();
        let targetHour = 19;
        let timeUntilUpdate = ((targetHour - now.getHours()) * 60 * 60 * 1000)
            - (now.getMinutes() * 60 * 1000) - (now.getSeconds() * 1000);

        if (timeUntilUpdate < 0) {
            timeUntilUpdate += 24 * 60 * 60 * 1000;
        }

        setTimeout(() => {
            loadTodayCalendar();
            updateDayAt19H(calendar);
        }, timeUntilUpdate);
    }

    window.loadTodayCalendar = function () {
        let githubICSUrl = `https://raw.githubusercontent.com/TORCHIN-Maxence-24020376/EDT/main/edt_data/${selectedGroup}.ics`;

        fetch(githubICSUrl)
            .then(response => response.ok ? response.text() : Promise.reject("Erreur de chargement"))
            .then(data => {
                let events = parseICS(data);
                let todayEvents = filterEventsForToday(events);

                let calendarEl = document.getElementById("calendar");
                let calendar = new FullCalendar.Calendar(calendarEl, {
                    locale: "fr",
                    initialView: "timeGridDay",
                    nowIndicator: true,
                    slotMinTime: "08:00:00",
                    slotMaxTime: "19:00:00",
                    height: "auto",
                    allDaySlot: false,
                    expandRows: true,
                    events: todayEvents,

                    eventDidMount: function (info) {
                        let salle = info.event.extendedProps ? info.event.extendedProps.salle : null;
                        let salleUrl = info.event.extendedProps ? info.event.extendedProps.salleUrl : null;
                        let professeur = info.event.extendedProps ? info.event.extendedProps.professeur : null;
            
                        let contentEl = document.createElement("div");
                        contentEl.classList.add("event-details");
            
                        // Affichage de la salle
                        if (salle) {
                            let salleEl = document.createElement("div");
                            salleEl.classList.add("salle-info");
                            salleEl.innerHTML = salleUrl
                                ? `<p onclick="afficheSalle('${salleUrl}')" style="cursor: pointer;" >📍 <strong>${salle}</strong></p>`
                                : `📍 <strong>${salle}</strong>`;
                            contentEl.appendChild(salleEl);
                        }
            
                        // Affichage du professeur (nom + prénom)
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
                        
                        let title = info.event.title || "";
            
                        let match = title.match(/([RS]\d+(?:\.[A-Z]?(?:&[A-Z])?\.\d+|\.[A-Z]?\.\w+|\.\d+)|S\d+\.[A-Z]?\.\d+)/);
                        if (match) {
                            let resourceClass = "resource-" + match[1]
                                .replace(/\./g, "-")
                                .replace(/&/g, "")
                                .replace(/\s/g, "");
                    
                            info.el.classList.add(resourceClass);
            
                        }
            
                        // Appliquer la classe Examen
                        if (info.event.title.includes("Examen") || info.event.title.includes("Soutenance") || info.event.title.includes("Présentation") || info.event.title.includes("Evaluation")) {
                            info.el.classList.add("exam-event");
                        }
            
                        // Appliquer la classe SAE
                        if (info.event.title.match(/S\d+\.\d+/)) {
                            info.el.classList.add("SAE");
                        }
            
                        // Appliquer la classe autonomie
                        if (info.event.title.toLowerCase().includes("autonomie") || 
                        (info.event.extendedProps.description && info.event.extendedProps.description.toLowerCase().includes("autonomie"))) {
                        info.el.classList.add("autonomie");
                        }
                        // Appliquer la classe vacance
                        if (info.event.title.includes("Vacances") || info.event.title.includes("Ferié")){
                        info.el.classList.add("vacances");
                        }
                    }
                });

                calendar.render();
                updateDayAt19H(calendar);
            })
            .catch(error => console.error("❌ Erreur lors du chargement de l'EDT:", error));
    };

    loadTodayCalendar();

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
            
                // Nettoyage des lignes
                let cleanedDesc = desc
                    .replace(/\\n/g, " ")
                    .replace(/Groupe|Modifié le:|\(|\)|\//g, "")
                    .replace(/\d+/g, "")
                    .replace(/\s+/g, " ")
                    .replace(/-/g, " ")
                    .replace(/ère année/g, "")
                    .replace(/ème année/g, "")
                    .replace(/ère Année/g, "")
                    .replace(/ème Année/g, "")
                    .replace(/:/g,"")
                    .replace(/A an/g, "")
                    .replace(/ an /g, "")
                    .replace(/G[A-Z] /g, "")
                    
                    .trim();
    
            
                // Ce qui reste après nettoyage est le nom du professeur
                if (cleanedDesc) {
                    event.extendedProps.professeur = cleanedDesc;
                } else {
                    event.extendedProps.professeur = "";
                }
            }
            
            
             else if (line.startsWith("END:VEVENT")) {
                events.push(event);
            } else if (line.startsWith("SUMMARY:")) {
                let title = line.replace("SUMMARY:", "").trim();
                event.title = title;
            
                // Détection d'examen
                if (title.match(/examen|contrôle|partiel|évaluation|test/i)) {
                    event.extendedProps.isExam = true;
                }
            }
        
        }
        return events;
    }

    function formatICSTime(icsTime) {
        let dateObj = new Date(
            Date.UTC(
                parseInt(icsTime.substring(0, 4)),
                parseInt(icsTime.substring(4, 6)) - 1,
                parseInt(icsTime.substring(6, 8)),
                parseInt(icsTime.substring(9, 11)),
                parseInt(icsTime.substring(11, 13)),
                parseInt(icsTime.substring(13, 15)) 
            )
        );
    
        let offset = dateObj.getTimezoneOffset() / -60;
        dateObj.setHours(dateObj.getHours() + offset);
            return dateObj.toISOString().replace("Z", "");

        }
});