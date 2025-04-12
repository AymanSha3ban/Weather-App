const apiKey = '813d5004478546273e369feb15887dce';
let map;
let marker;
let currentLang = 'en';

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Set language
function setLanguage() {
    currentLang = document.getElementById('languageSelect').value;
    document.getElementById('title').innerText = currentLang === 'ar' ? 'تحقق من الطقس' : 'Check the Weather';
}

// Get weather data
async function getWeather() {
const city = document.getElementById('cityInput').value;
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=${currentLang}`;

const res = await fetch(url);
const data = await res.json();

if (data.cod !== 200) return alert(data.message);

document.getElementById('location').innerText = `${data.name}, ${data.sys.country}`;
document.getElementById('temperature').innerText = `${Math.round(data.main.temp)}°C`;
document.getElementById('description').innerText = data.weather[0].description;
document.getElementById('extra').innerText = `Humidity: ${data.main.humidity}% | Wind: ${data.wind.speed} m/s`;

// Extract the main weather condition
const weatherCondition = data.weather[0].main.toLowerCase(); // e.g., 'rain', 'snow', 'clear'

let videoSrc = '';

// Determine the video source based on the weather condition
if (weatherCondition.includes('rain')) {
videoSrc = 'videos/rain.mp4';  // Link to rain video
} else if (weatherCondition.includes('snow')) {
videoSrc = 'videos/snow.mp4';  // Link to snow video
} else if (weatherCondition.includes('clear')) {
videoSrc = 'videos/sunny.mp4'; // Link to sunny video
} else if (weatherCondition.includes('cloud')) {
videoSrc = 'videos/cloudy.mp4'; // Link to cloudy video
} else if (weatherCondition.includes('thunderstorm')) {
videoSrc = 'videos/storm.mp4'; // Link to thunderstorm video
} else if (weatherCondition.includes('drizzle')) {
videoSrc = 'videos/drizzle.mp4'; // Link to drizzle video
}

// Update the background video
document.getElementById('video-source').src = videoSrc;
document.getElementById('bg-video').load();

// Initialize or update the map
if (!map) {
map = L.map('map').setView([data.coord.lat, data.coord.lon], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);
marker = L.marker([data.coord.lat, data.coord.lon]).addTo(map);
} else {
map.setView([data.coord.lat, data.coord.lon], 10);
marker.setLatLng([data.coord.lat, data.coord.lon]);
}
}