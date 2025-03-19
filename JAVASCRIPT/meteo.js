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
            background = "../IMAGES/";
            break;
        case 1:
            icone = "🌤️"; // Peu nuageux
            background = "../IMAGES/";
            break;
        case 2:
            icone = "⛅️"; // Partiellement nuageux
            background = "../IMAGES/";
            break;
        case 3:
            icone = "☁️"; // Couvert
            background = "../IMAGES/";
            break;
        case 45:
            icone = "🌫️"; // Brouillard
            background = "../IMAGES/";
            break;
        case 51:
            icone = "☀️🌧️"; // Bruine légère
            background = "../IMAGES/";
            break;
        case 61:
            icone = "🌧️"; // Pluie légère
            background = "../IMAGES/";
            break;
        case 63:
            icone = "🌧️🌧️"; // Pluie modérée
            background = "../IMAGES/";
            break;
        case 65:
            icone = "🌧️🌧️🌧️"; // Pluie forte
            background = "../IMAGES/";
            break;
        case 80:
            icone = "🌤️🌧️"; // Averses
            background = "../IMAGES/";
            break;
        case 95:
            icone = "⛈️"; // Orages
            background = "../IMAGES/";
            break;
        case 96:
            icone = "⛈️🧊"; // Orages avec grêle
            background = "../IMAGES/";
            break
        default:
            icone = "💀"; // On verra si je suis le goat ou pas
            background = "../IMAGES/";
    }
    return (icone,background);
}

getMeteoAix().then(data => {
    if (data) {
        temperature = data.current_weather.temperature
        vent = data.current_weather.windspeed
        codeMeteo = data.current_weather.weathercode
        prevision = data.daily

        icone,background = changeIcone(codeMeteo);

        console.log(icone)
        console.log(background)
        console.log("Température actuelle :", data.current_weather.temperature, "°C");
        console.log("Vent actuel :", data.current_weather.windspeed, "km/h");
        console.log("Code météo actuel :", data.current_weather.weathercode);
        console.log("Prévisions :", data.daily);
    }
    else{
        console.log("Pas de data météo")
    }
});