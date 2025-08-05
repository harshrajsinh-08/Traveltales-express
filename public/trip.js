let planMap;
let planMarker;

document.addEventListener('DOMContentLoaded', () => {
  const destinationInput = document.getElementById('destinationInput');

  // Trigger search on Enter key
  if (destinationInput) {
    destinationInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        fetchTripData();
      }
    });
  }
});

function handleSearch() {
  const searchInput = document.getElementById('searchInput');
  const destination = searchInput?.value.trim();

  if (!destination) {
    alert('Please enter a city name.');
    return;
  }

  document.getElementById('plan-trip').scrollIntoView({ behavior: 'smooth' });
  document.getElementById('destinationInput').value = destination;

  fetchTripData(destination);
}

function fetchTripData(cityName = null) {
  const destinationInput = document.getElementById('destinationInput');
  const destination = cityName || destinationInput.value.trim();
  const card = document.getElementById('location-card');

  if (!destination) {
    alert('Please enter a city name.');
    return;
  }

  document.getElementById('plan-trip').scrollIntoView({ behavior: 'smooth' });
  showPlanMap(destination);

  card.classList.add('hidden', 'opacity-0');

  fetch('/trips.json')
    .then(res => res.json())
    .then(data => {
      const key = Object.keys(data).find(
        city => city.toLowerCase() === destination.toLowerCase()
      );
      const cityData = key ? data[key] : null;

      if (!cityData) {
        card.innerHTML = `
          <div class="text-center text-gray-500 text-lg py-12">
            No data found for <span class="font-semibold">${destination}</span>.
          </div>`;
        card.classList.remove('hidden');
        setTimeout(() => card.classList.remove('opacity-0'), 50);
        return;
      }

      const cityNameUpper = key.toUpperCase();

      // Premium Layout with Hover Effect
      const html = `
        <div class="rounded-xl overflow-hidden shadow-xl bg-white animate-fadeIn">

          ${cityData.city_image ? `
            <div class="relative overflow-hidden group">
              <div class="relative h-64">
                <img src="${cityData.city_image}" 
                     class="absolute inset-0 w-full h-full object-cover transition-all duration-700 transform group-hover:scale-125 group-hover:z-50 group-hover:shadow-2xl"
                     alt="${cityNameUpper}"/>
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-0"></div>
                <div class="absolute bottom-4 left-0 right-0 text-center px-2 transition-all duration-500 group-hover:bottom-6">
                  <h3 class="text-4xl font-extrabold text-white drop-shadow-lg tracking-wide transition-all duration-500 group-hover:scale-110">
                    ${cityNameUpper}
                  </h3>
                  <p class="text-white/80 text-sm italic mt-1 transition-opacity duration-500 group-hover:opacity-100">
                    Discover top attractions and travel tips
                  </p>
                </div>
              </div>
            </div>
          ` : ''}

          <div class="p-6 space-y-6">

            <div class="bg-gray-50 p-5 rounded-xl shadow-sm space-y-3 border border-gray-100">
              <p class="text-gray-700"><strong>How to Reach:</strong> ${cityData.how_to_reach || 'Information not available'}</p>
              <p class="text-gray-700"><strong>Nearest Railway Station:</strong> ${cityData.nearest_station || 'N/A'}</p>
              <p class="text-gray-700"><strong>Nearest Airport:</strong> ${cityData.nearest_airport || 'N/A'}</p>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-gray-800 mb-3">Top Attractions</h4>
              <ul class="space-y-3">
                ${cityData.attractions.map(a => `
                  <li class="flex justify-between items-center bg-white px-5 py-4 rounded-lg shadow-sm hover:shadow-md transition duration-300 border border-gray-100">
                    <span class="text-gray-800 font-medium">${a.name}</span>
                    <span class="text-orange-500 font-semibold">${a.price_range}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>
        </div>
      `;

      card.innerHTML = html;
      card.classList.remove('hidden');
      setTimeout(() => card.classList.remove('opacity-0'), 50);
    })
    .catch(err => {
      console.error(err);
      alert('Failed to fetch trip data.');
    });
}

function showPlanMap(city) {
  const mapDiv = document.getElementById("map");
  mapDiv.classList.remove("hidden");

  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city + ", India")}`)
    .then(res => res.json())
    .then(data => {
      if (!data || data.length === 0) {
        alert("Could not find this location on the map.");
        return;
      }

      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);

      if (!planMap) {
        planMap = L.map("map").setView([lat, lon], 12);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(planMap);
      } else {
        planMap.setView([lat, lon], 12);
      }

      if (planMarker) {
        planMarker.setLatLng([lat, lon]);
      } else {
        planMarker = L.marker([lat, lon]).addTo(planMap);
      }
    })
    .catch(err => console.error(err));
}