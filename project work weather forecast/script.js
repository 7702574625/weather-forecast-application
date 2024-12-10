// API key and base URL for OpenWeatherMap
const apiKey = "aa6e817c2287d486b5e2d7a534f2a5bd";  // Your API key
const apiBaseUrl = 'https://api.openweathermap.org/data/2.5';

// Event listeners for buttons
document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value;
    if (city) {
        fetchWeatherData(city);
        fetchForecastData(city);
    } else {
        alert('Please enter a city name.');
    }
});

document.getElementById('location-btn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherData(null, latitude, longitude);
                fetchForecastData(null, latitude, longitude);
            },
            () => {
                alert('Unable to retrieve your location.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});

// Fetch current weather data from API
function fetchWeatherData(city, lat = null, lon = null) {
    let url = '';
    if (city) {
        url = `${apiBaseUrl}/weather?q=${city}&appid=${apiKey}&units=metric`;
    } else if (lat && lon) {
        url = `${apiBaseUrl}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    } else {
        alert('Invalid request parameters.');
        return;
    }

    console.log('Fetching weather data from URL:', url); // Debugging: check API URL

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            console.log('Weather data response:', data); // Log the API response
            if (data.cod === 200) {
                displayWeatherData(data);
            } else {
                alert(data.message || 'Error fetching weather data.');
            }
        })
        .catch((err) => {
            console.error('Error fetching weather data:', err); // Debugging: Log any errors
            alert('Error connecting to the API.');
        });
}

// Fetch 5-day forecast data from API
function fetchForecastData(city, lat = null, lon = null) {
    let url = '';
    if (city) {
        url = `${apiBaseUrl}/forecast?q=${city}&appid=${apiKey}&units=metric`;
    } else if (lat && lon) {
        url = `${apiBaseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    } else {
        alert('Invalid request parameters.');
        return;
    }

    console.log('Fetching forecast data from URL:', url); // Debugging: check API URL

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            console.log('Forecast data response:', data); // Log the API response
            if (data.cod === "200") { 
                displayForecastData(data);
            } else {
                alert(data.message || 'Error fetching forecast data.');
            }
        })
        .catch((err) => {
            console.error('Error fetching forecast data:', err); 
            alert('Error connecting to the API.');
        });
}

// Displaying the current weather data
function displayWeatherData(data) {
    const weatherDetails = document.getElementById('weather-details');
    weatherDetails.innerHTML = `
        <p><strong>Location:</strong> ${data.name}, ${data.sys.country}</p>
        <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
        <p><strong>Conditions:</strong> ${data.weather[0].description}</p>
    `;
}

// Display 5-day forecast data
function displayForecastData(data) {
    const forecastDetails = document.getElementById('forecast-details');
    forecastDetails.innerHTML = '';

    // Iterating through the forecast data and display daily forecast
    for (let i = 0; i < data.list.length; i += 8) {  // OpenWeather's forecast returns 3-hour intervals
        const forecast = data.list[i];
        const date = new Date(forecast.dt * 1000);
        const day = date.toLocaleString('en-us', { weekday: 'long' });
        const temp = forecast.main.temp;
        const description = forecast.weather[0].description;

        forecastDetails.innerHTML += `
            <div class="forecast-item">
                <h3>${day}</h3>
                <p><strong>${temp}°C</strong></p>
                <p>${description}</p>
            </div>
        `;
    }
}
