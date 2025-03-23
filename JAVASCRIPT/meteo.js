async function getMeteoAix() {
    try {
        const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=43.5297&longitude=5.4474&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,weathercode&timezone=Europe/Paris&forecast_days=7&current_weather=true");
        const data = await response.json();

        return data;
    } catch (error) {
        console.error("❌ Erreur lors de la récupération de la météo :", error);
        return null;
    }

}

function changeIcone(codeMeteo) {
    let icone;
    let background;

    switch (codeMeteo) {
        case 0:
            icone = "☀️"; // Ciel clair
            background = "../IMAGES/default.jpg";
            break;
        case 1:
            icone = "🌤️"; // Peu nuageux
            background = "../IMAGES/default.jpg";
            break;
        case 2:
            icone = "⛅️"; // Partiellement nuageux
            background = "../IMAGES/partiellement-nuageux.jpg";
            break;
        case 3:
            icone = "☁️"; // Couvert
            background = "../IMAGES/couvert.jpg";
            break;
        case 45:
            icone = "🌫️"; // Brouillard
            background = "../IMAGES/default.jpg";
            break;
        case 51:
            icone = "☀️🌧️"; // Bruine légère
            background = "../IMAGES/default.jpg";
            break;
        case 61:
            icone = "🌧️"; // Pluie légère
            background = "../IMAGES/default.jpg";
            break;
        case 63:
            icone = "🌧️🌧️"; // Pluie modérée
            background = "../IMAGES/default.jpg";
            break;
        case 65:
            icone = "🌧️🌧️🌧️"; // Pluie forte
            background = "../IMAGES/default.jpg";
            break;
        case 80:
            icone = "🌤️🌧️"; // Averses
            background = "../IMAGES/default.jpg";
            break;
        case 95:
            icone = "⛈️"; // Orages
            background = "../IMAGES/default.jpg";
            break;
        case 96:
            icone = "⛈️🧊"; // Orages avec grêle
            background = "../IMAGES/default.jpg";
            break
        default:
            icone = "💀"; // On verra si je suis le goat ou pas
            background = "../IMAGES/default.jpg";
            break
    }
    return { icone, background };
}

getMeteoAix().then(data => {
    if (data) {
        afficherPrevisionJour(0, data);
        initialiserCliquables(data);
    }
    else{
        console.log("Pas de data météo")
    }
});

function afficherMeteo(date, icone, temperature, vent, precipitations, min, max, background) {
    const meteo = document.getElementById("meteo");
    const meteoDate = document.getElementById("meteo-date");
    const meteoLogo = document.getElementById("meteo-logo");
    const temperatureEl = document.getElementById("temperature");
    const ventEl = document.getElementById("vent");
    const tempMin = document.getElementById("temp_min");
    const tempMax = document.getElementById("temp_max");
    const precipitationsEl = document.getElementById("precipitations");

    if (!meteoDate || !meteoLogo || !temperatureEl || !ventEl || !tempMin || !tempMax || !precipitationsEl) {
        console.warn("❌ Certains éléments météo sont introuvables dans le DOM.");
        return;
    }

    meteo.style.backgroundImage = `url('${background}')`;
    meteoDate.textContent = date;
    meteoLogo.textContent = icone;
    temperatureEl.textContent = `${temperature}°C`;
    ventEl.textContent = `🍃 ${vent} km/h`;
    precipitationsEl.textContent = `🌧️ ${precipitations} mm`;
    tempMin.textContent = `🌡️ Min : ${min}°C`;
    tempMax.textContent = `🌡️ Max : ${max}°C`;
}

function afficherPrevisionJour(index, data) {
    highlightJour(index);

    const dateISO = data.daily.time[index];
    const datePrevision = new Date(dateISO);

    const date = datePrevision.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long"
    });

    const temperature = `${data.current_weather.temperature}`;
    const vent = `${data.daily.windspeed_10m_max[index]}`;
    const min = `${data.daily.temperature_2m_min[index]}`;
    const max = `${data.daily.temperature_2m_max[index]}`;
    const pluie = `${data.daily.precipitation_sum[index]}`;
    const code = data.daily.weathercode[index];
    
    const { icone, background } = changeIcone(code);

    afficherMeteo(date, icone, temperature, vent, pluie, min, max, background);
}

function initialiserCliquables(data) {
    for (let i = 0; i < 7; i++) {
        const jourEl = document.getElementById(`jour${i + 1}`);
        if (jourEl) {
            jourEl.addEventListener("click", () => {
                afficherPrevisionJour(i, data);
            });
        }
    }
}

function highlightJour(index) {
    for (let i = 1; i <= 7; i++) {
        const el = document.getElementById(`jour${i}`);
        el.classList.remove("selected");
    }
    document.getElementById(`jour${index + 1}`).classList.add("selected");
}
