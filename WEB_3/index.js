const skyContainer = document.getElementById('sky-container');
const weatherFx = document.getElementById('weather-fx');
const navTemp = document.getElementById('nav-temp');
const navLocation = document.getElementById('nav-location');

// === IMÁGENES DE ALTA RESOLUCIÓN VERIFICADAS (Puro Cielo) ===
const skyImages = {
    // Cielo azul puro (El que ya probaste y te gustó)
    'day-clear': 'url("https://images.unsplash.com/photo-1601297183305-6df142704ea2?q=80&w=1920")',
    
    // Cielo de día nublado (Puras nubes blancas/grises desde abajo)
    'day-cloudy': 'url("https://images.unsplash.com/photo-1678038069651-c2fd8f978fc9?q=80&w=771&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    
    // Cielo gris oscuro y amenazante para la lluvia
    'day-rain': 'url("https://images.unsplash.com/photo-1627891858448-0b99239685fa?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    
    // Noche estrellada profunda (Solo estrellas y vacío)
    'night-clear': 'url("https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1920")',
    
    // Noche con nubes y algo de luna
    'night-cloudy': 'url("https://images.unsplash.com/photo-1672408096585-48eb6f9bccb0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGNpZWxvJTIwbm9jaGUlMjBudWJsYWRvfGVufDB8fDB8fHww")',
    
    // Noche ultra oscura (Ideal para que destaquen las gotas de lluvia CSS)
    'night-rain': 'url("https://media.istockphoto.com/id/154956880/es/foto/moonshine-paisaje-marino.webp?a=1&b=1&s=612x612&w=0&k=20&c=scFbcxGNs1zWzFpwp8Ib68BKZQlKCp-rEmenRiSdnE0=")',
    
    // Atardecer (Cielo con degradado naranja/rosado mirando hacia arriba)
    'dusk': 'url("https://images.unsplash.com/photo-1612527846486-ee50d5702d09?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")'
};

// === GENERADORES DE EFECTOS ===
function createRain(amount) {
    for (let i = 0; i < amount; i++) {
        const drop = document.createElement('div');
        drop.className = 'raindrop';
        drop.style.left = `${Math.random() * 100}vw`;
        drop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
        drop.style.animationDelay = `${Math.random() * -2}s`;
        weatherFx.appendChild(drop);
    }
}

function createStars(amount) {
    for (let i = 0; i < amount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 3;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.top = `${Math.random() * 100}vh`;
        star.style.left = `${Math.random() * 100}vw`;
        star.style.animationDuration = `${1 + Math.random() * 3}s`;
        weatherFx.appendChild(star);
    }
}

// === LÓGICA DE ASIGNACIÓN ===
function renderRealSky(weatherCode, isDay, currentHour) { 
    weatherFx.innerHTML = '';
    let selectedSkyKey = 'day-clear';

    if (currentHour >= 18 && currentHour <= 19) {
        selectedSkyKey = 'dusk';
    } else if (!isDay || currentHour >= 20 || currentHour <= 5) {
        if (weatherCode >= 51 && weatherCode <= 99) {
            selectedSkyKey = 'night-rain';
            createRain(150);
        } else if (weatherCode >= 1 && weatherCode <= 3) {
            selectedSkyKey = 'night-cloudy';
        } else {
            selectedSkyKey = 'night-clear';
            createStars(100);
        }
    } else {
        if (weatherCode >= 51 && weatherCode <= 99) {
            selectedSkyKey = 'day-rain';
            createRain(150);
        } else if (weatherCode >= 1 && weatherCode <= 3) {
            selectedSkyKey = 'day-cloudy';
        } else {
            selectedSkyKey = 'day-clear';
        }
    }

    skyContainer.style.backgroundImage = skyImages[selectedSkyKey];
    skyContainer.classList.add('moving-bg');
}

// === CONEXIÓN A LA API ===
async function fetchWeatherData(lat, lon, isFallback = false) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
        const response = await fetch(url);
        const data = await response.json();

        const { temperature, weathercode, is_day, time } = data.current_weather;
        const currentHour = new Date(time).getHours();

        navTemp.textContent = `${Math.round(temperature)}°C`;
        navLocation.textContent = isFallback ? "Simulación Local" : "Sincronizado";

        renderRealSky(weathercode, is_day, currentHour);

    } catch (error) {
        console.error("Error obteniendo clima:", error);
        navLocation.textContent = "Desconectado";
        renderRealSky(2, 1, 12);
    }
}

// === SISTEMA DE NAVEGACIÓN CINEMÁTICO ===
function setupHUDNavigation() {
    const navButtons = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view-section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.currentTarget.getAttribute('data-target');
            
            navButtons.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');

            views.forEach(view => view.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// === INICIALIZACIÓN ===
function initApp() {
    const fallbackLat = -33.0456;
    const fallbackLon = -71.6202;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => { fetchWeatherData(position.coords.latitude, position.coords.longitude); },
            (error) => { fetchWeatherData(fallbackLat, fallbackLon, true); }
        );
    } else {
        fetchWeatherData(fallbackLat, fallbackLon, true);
    }

    setupHUDNavigation();
}

initApp();