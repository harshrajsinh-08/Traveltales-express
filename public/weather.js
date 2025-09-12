// Weather JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // Set current date
  document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Add enter key listener to city input
  const cityInput = document.getElementById('city-input');
  if (cityInput) {
    cityInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        getWeather();
      }
    });
  }
});

// Get weather for entered city
async function getWeather() {
  const cityInput = document.getElementById('city-input');
  const city = cityInput.value.trim();

  if (!city) {
    showNotification('Please enter a city name', 'error');
    return;
  }

  await getWeatherForCity(city);
}

// Get weather for specific city
async function getWeatherForCity(city) {
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error');
  const weatherContainer = document.getElementById('weather-container');

  // Show loading state
  loadingEl.classList.remove('hidden');
  errorEl.classList.add('hidden');
  weatherContainer.classList.add('hidden');

  try {
    const response = await fetch(`/api/weather/${encodeURIComponent(city)}`);
    
    if (!response.ok) {
      throw new Error('Weather data not available');
    }

    const weather = await response.json();
    displayWeather(weather);

  } catch (error) {
    console.error('Weather fetch error:', error);
    errorEl.classList.remove('hidden');
  } finally {
    loadingEl.classList.add('hidden');
  }
}

// Display weather data
function displayWeather(weather) {
  // Update city name
  document.getElementById('city-name').textContent = weather.city;

  // Update current weather
  document.getElementById('temperature').textContent = `${weather.temperature}°C`;
  document.getElementById('condition').textContent = weather.condition;
  document.getElementById('humidity').textContent = `${weather.humidity}%`;

  // Update weather icon based on condition
  const iconEl = document.getElementById('weather-icon');
  const condition = weather.condition.toLowerCase();
  
  if (condition.includes('sunny') || condition.includes('clear')) {
    iconEl.textContent = '☀️';
  } else if (condition.includes('cloudy')) {
    iconEl.textContent = '☁️';
  } else if (condition.includes('rainy') || condition.includes('rain')) {
    iconEl.textContent = '🌧️';
  } else if (condition.includes('storm')) {
    iconEl.textContent = '⛈️';
  } else {
    iconEl.textContent = '🌤️';
  }

  // Update forecast
  const forecastContainer = document.getElementById('forecast-container');
  forecastContainer.innerHTML = weather.forecast.map(day => `
    <div class="bg-gray-50 rounded-lg p-4 text-center">
      <h4 class="font-bold mb-2">${day.day}</h4>
      <div class="text-3xl mb-2">${getWeatherIcon(day.condition)}</div>
      <p class="text-xl font-bold text-blue-600">${day.temp}°C</p>
      <p class="text-gray-600 text-sm">${day.condition}</p>
    </div>
  `).join('');

  // Show weather container
  document.getElementById('weather-container').classList.remove('hidden');

  // Update city input
  document.getElementById('city-input').value = weather.city;

  // Scroll to weather display
  document.getElementById('weather-container').scrollIntoView({ behavior: 'smooth' });
}

// Get weather icon for condition
function getWeatherIcon(condition) {
  const cond = condition.toLowerCase();
  
  if (cond.includes('sunny') || cond.includes('clear')) {
    return '☀️';
  } else if (cond.includes('cloudy')) {
    return '☁️';
  } else if (cond.includes('rainy') || cond.includes('rain')) {
    return '🌧️';
  } else if (cond.includes('storm')) {
    return '⛈️';
  } else {
    return '🌤️';
  }
}

// Show notification function
function showNotification(message, type = 'info') {
  if (window.TravelTales && window.TravelTales.showNotification) {
    window.TravelTales.showNotification(message, type);
  } else {
    // Fallback notification
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${
      type === 'error' ? 'bg-red-500' : 
      type === 'success' ? 'bg-green-500' : 
      'bg-blue-500'
    }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  }
}