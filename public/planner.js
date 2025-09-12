// Travel Planner JavaScript

document.addEventListener('DOMContentLoaded', () => {
  console.log('Planner.js loaded'); // Debug log
  
  const tripForm = document.getElementById('trip-form');
  
  if (tripForm) {
    console.log('Trip form found, adding event listener'); // Debug log
    tripForm.addEventListener('submit', handleTripFormSubmit);
  } else {
    console.error('Trip form not found!'); // Debug log
  }

  // Set minimum date to today
  const startDateInput = document.getElementById('start-date');
  if (startDateInput) {
    const today = new Date().toISOString().split('T')[0];
    startDateInput.min = today;
    console.log('Set minimum date to:', today); // Debug log
  }

  // Test button click
  const submitBtn = document.querySelector('#trip-form button[type="submit"]');
  if (submitBtn) {
    console.log('Submit button found'); // Debug log
  }
});

// Handle trip form submission
async function handleTripFormSubmit(e) {
  e.preventDefault();
  
  // Get form data directly from elements
  const tripData = {
    destination: document.getElementById('destination').value.trim(),
    days: parseInt(document.getElementById('days').value),
    startDate: document.getElementById('start-date').value,
    budget: parseFloat(document.getElementById('budget').value) || 0,
    travelStyle: document.getElementById('travel-style').value,
    interests: getSelectedInterests()
  };

  console.log('Trip data:', tripData); // Debug log

  // Validate required fields
  if (!tripData.destination || !tripData.days || !tripData.startDate) {
    showNotification('Please fill in all required fields', 'error');
    return;
  }

  if (tripData.days < 1 || tripData.days > 30) {
    showNotification('Duration must be between 1 and 30 days', 'error');
    return;
  }

  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Generating Plan...';
  submitBtn.disabled = true;

  try {
    await generateTripPlan(tripData);
    showNotification('Trip plan generated successfully!', 'success');
  } catch (error) {
    console.error('Error generating trip plan:', error);
    showNotification('Failed to generate trip plan. Please try again.', 'error');
  } finally {
    // Reset button
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

// Get selected interests from checkboxes
function getSelectedInterests() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  return Array.from(checkboxes).map(cb => cb.value);
}

// Generate trip plan
async function generateTripPlan(tripData) {
  try {
    // First, get destination details
    let destinationInfo = null;
    
    try {
      const destinationResponse = await fetch(`/api/destination/${encodeURIComponent(tripData.destination)}`);
      if (destinationResponse.ok) {
        destinationInfo = await destinationResponse.json();
      }
    } catch (error) {
      console.log('Could not fetch destination details, using default plan');
    }

    // Generate the trip plan
    const plan = createTripPlan(tripData, destinationInfo);
    displayTripPlan(plan);
    
    // Scroll to the plan
    setTimeout(() => {
      document.getElementById('trip-plan').scrollIntoView({ behavior: 'smooth' });
    }, 100);
    
  } catch (error) {
    console.error('Error in generateTripPlan:', error);
    throw error;
  }
}

// Create trip plan based on data
function createTripPlan(tripData, destinationInfo) {
  const plan = {
    destination: tripData.destination,
    duration: tripData.days,
    startDate: tripData.startDate,
    endDate: calculateEndDate(tripData.startDate, tripData.days),
    budget: tripData.budget,
    travelStyle: tripData.travelStyle,
    interests: tripData.interests,
    itinerary: [],
    recommendations: [],
    budgetBreakdown: calculateBudgetBreakdown(tripData.budget, tripData.days, tripData.travelStyle)
  };

  // Generate daily itinerary
  for (let day = 1; day <= tripData.days; day++) {
    const dayPlan = generateDayPlan(day, tripData, destinationInfo);
    plan.itinerary.push(dayPlan);
  }

  // Generate recommendations
  plan.recommendations = generateRecommendations(tripData, destinationInfo);

  return plan;
}

// Generate plan for a single day
function generateDayPlan(dayNumber, tripData, destinationInfo) {
  const dayPlan = {
    day: dayNumber,
    date: calculateDate(tripData.startDate, dayNumber - 1),
    activities: []
  };

  if (dayNumber === 1) {
    dayPlan.activities.push({
      time: '09:00',
      activity: 'Arrival and Check-in',
      description: 'Arrive at destination and check into accommodation',
      duration: '2 hours'
    });
    dayPlan.activities.push({
      time: '12:00',
      activity: 'Local Lunch',
      description: 'Try local cuisine at a recommended restaurant',
      duration: '1 hour'
    });
    dayPlan.activities.push({
      time: '14:00',
      activity: 'City Orientation Walk',
      description: 'Explore the local area and get familiar with surroundings',
      duration: '3 hours'
    });
  } else if (dayNumber === tripData.days) {
    dayPlan.activities.push({
      time: '09:00',
      activity: 'Last-minute Shopping',
      description: 'Buy souvenirs and local products',
      duration: '2 hours'
    });
    dayPlan.activities.push({
      time: '12:00',
      activity: 'Check-out and Departure',
      description: 'Check out from accommodation and head to departure point',
      duration: '2 hours'
    });
  } else {
    // Generate activities based on interests and destination info
    if (destinationInfo && destinationInfo.attractions) {
      const attraction = destinationInfo.attractions[Math.min(dayNumber - 2, destinationInfo.attractions.length - 1)];
      dayPlan.activities.push({
        time: '09:00',
        activity: `Visit ${attraction.name}`,
        description: `Explore ${attraction.name} - ${attraction.price_range}`,
        duration: '3 hours'
      });
    } else {
      dayPlan.activities.push({
        time: '09:00',
        activity: 'Sightseeing',
        description: 'Explore major attractions and landmarks',
        duration: '3 hours'
      });
    }

    dayPlan.activities.push({
      time: '13:00',
      activity: 'Lunch Break',
      description: 'Enjoy local cuisine',
      duration: '1 hour'
    });

    // Add interest-based activities
    if (tripData.interests.includes('culture')) {
      dayPlan.activities.push({
        time: '15:00',
        activity: 'Cultural Experience',
        description: 'Visit museums, temples, or cultural sites',
        duration: '2 hours'
      });
    } else if (tripData.interests.includes('adventure')) {
      dayPlan.activities.push({
        time: '15:00',
        activity: 'Adventure Activity',
        description: 'Trekking, water sports, or outdoor adventures',
        duration: '3 hours'
      });
    } else {
      dayPlan.activities.push({
        time: '15:00',
        activity: 'Leisure Time',
        description: 'Relax and explore at your own pace',
        duration: '2 hours'
      });
    }
  }

  return dayPlan;
}

// Generate recommendations
function generateRecommendations(tripData, destinationInfo) {
  const recommendations = [];

  // Accommodation recommendations
  if (tripData.travelStyle === 'budget') {
    recommendations.push({
      category: 'Accommodation',
      title: 'Budget Stays',
      items: ['Hostels', 'Guesthouses', 'Budget hotels', 'Dormitories']
    });
  } else if (tripData.travelStyle === 'luxury') {
    recommendations.push({
      category: 'Accommodation',
      title: 'Luxury Stays',
      items: ['5-star hotels', 'Luxury resorts', 'Heritage hotels', 'Boutique properties']
    });
  } else {
    recommendations.push({
      category: 'Accommodation',
      title: 'Mid-range Stays',
      items: ['3-star hotels', 'Business hotels', 'Serviced apartments', 'B&Bs']
    });
  }

  // Transportation recommendations
  if (destinationInfo) {
    recommendations.push({
      category: 'Transportation',
      title: 'Getting There',
      items: [
        destinationInfo.nearest_airport ? `Fly to ${destinationInfo.nearest_airport}` : 'Check nearby airports',
        destinationInfo.nearest_station ? `Train to ${destinationInfo.nearest_station}` : 'Check railway connections',
        'Local buses and taxis',
        'Rental cars available'
      ]
    });
  }

  // Food recommendations
  recommendations.push({
    category: 'Food & Dining',
    title: 'Must-try Local Cuisine',
    items: ['Street food tours', 'Local restaurants', 'Traditional thalis', 'Regional specialties']
  });

  // Packing recommendations
  const packingItems = ['Comfortable walking shoes', 'Sunscreen and hat', 'Camera', 'First aid kit'];
  
  if (tripData.interests.includes('adventure')) {
    packingItems.push('Adventure gear', 'Quick-dry clothes');
  }
  if (tripData.interests.includes('beaches')) {
    packingItems.push('Swimwear', 'Beach towel');
  }
  if (tripData.interests.includes('mountains')) {
    packingItems.push('Warm clothes', 'Trekking shoes');
  }

  recommendations.push({
    category: 'Packing',
    title: 'Essential Items',
    items: packingItems
  });

  return recommendations;
}

// Display the generated trip plan
function displayTripPlan(plan) {
  const planContainer = document.getElementById('trip-plan');
  const planContent = document.getElementById('plan-content');

  const html = `
    <div class="mb-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h3 class="text-2xl font-bold text-orange-500">${plan.destination}</h3>
          <p class="text-gray-600">${plan.duration} days • ${formatDate(plan.startDate)} to ${formatDate(plan.endDate)}</p>
        </div>
        <div class="mt-4 md:mt-0">
          <span class="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
            ${plan.travelStyle.charAt(0).toUpperCase() + plan.travelStyle.slice(1)} Travel
          </span>
        </div>
      </div>

      ${plan.budget > 0 ? `
        <div class="bg-blue-50 rounded-lg p-6 mb-8">
          <h4 class="text-lg font-bold mb-4">Budget Breakdown</h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
              <p class="text-2xl font-bold text-blue-600">₹${plan.budgetBreakdown.accommodation}</p>
              <p class="text-sm text-gray-600">Accommodation</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-green-600">₹${plan.budgetBreakdown.food}</p>
              <p class="text-sm text-gray-600">Food</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-purple-600">₹${plan.budgetBreakdown.transport}</p>
              <p class="text-sm text-gray-600">Transport</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-orange-600">₹${plan.budgetBreakdown.activities}</p>
              <p class="text-sm text-gray-600">Activities</p>
            </div>
          </div>
          <div class="text-center mt-4 pt-4 border-t border-blue-200">
            <p class="text-xl font-bold">Total Budget: ₹${plan.budget}</p>
            <p class="text-sm text-gray-600">Per day: ₹${Math.round(plan.budget / plan.duration)}</p>
          </div>
        </div>
      ` : ''}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Itinerary -->
      <div class="lg:col-span-2">
        <h4 class="text-xl font-bold mb-6">Daily Itinerary</h4>
        <div class="space-y-6">
          ${plan.itinerary.map(day => `
            <div class="bg-gray-50 rounded-lg p-6">
              <h5 class="text-lg font-bold mb-4">Day ${day.day} - ${formatDate(day.date)}</h5>
              <div class="space-y-3">
                ${day.activities.map(activity => `
                  <div class="flex items-start space-x-4">
                    <div class="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded min-w-[60px] text-center">
                      ${activity.time}
                    </div>
                    <div class="flex-1">
                      <h6 class="font-semibold">${activity.activity}</h6>
                      <p class="text-gray-600 text-sm">${activity.description}</p>
                      <p class="text-orange-500 text-xs font-medium">${activity.duration}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Recommendations -->
      <div>
        <h4 class="text-xl font-bold mb-6">Recommendations</h4>
        <div class="space-y-6">
          ${plan.recommendations.map(rec => `
            <div class="bg-white border border-gray-200 rounded-lg p-4">
              <h5 class="font-bold text-orange-500 mb-3">${rec.title}</h5>
              <ul class="space-y-2">
                ${rec.items.map(item => `
                  <li class="flex items-start">
                    <i class="bi bi-check-circle text-green-500 mr-2 mt-0.5 text-sm"></i>
                    <span class="text-sm text-gray-700">${item}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          `).join('')}
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 space-y-3">
          <button onclick="downloadPlan()" class="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition">
            <i class="bi bi-download mr-2"></i>
            Download Plan
          </button>
          <button onclick="sharePlan()" class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition">
            <i class="bi bi-share mr-2"></i>
            Share Plan
          </button>
        </div>
      </div>
    </div>
  `;

  planContent.innerHTML = html;
  planContainer.classList.remove('hidden');
}

// Utility functions
function calculateEndDate(startDate, days) {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + days - 1);
  return end.toISOString().split('T')[0];
}

function calculateDate(startDate, daysToAdd) {
  const start = new Date(startDate);
  const result = new Date(start);
  result.setDate(start.getDate() + daysToAdd);
  return result.toISOString().split('T')[0];
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function calculateBudgetBreakdown(totalBudget, days, travelStyle) {
  if (!totalBudget || totalBudget <= 0) {
    return { accommodation: 0, food: 0, transport: 0, activities: 0 };
  }

  let percentages;
  switch (travelStyle) {
    case 'budget':
      percentages = { accommodation: 0.3, food: 0.25, transport: 0.25, activities: 0.2 };
      break;
    case 'luxury':
      percentages = { accommodation: 0.5, food: 0.2, transport: 0.15, activities: 0.15 };
      break;
    case 'backpacking':
      percentages = { accommodation: 0.2, food: 0.3, transport: 0.3, activities: 0.2 };
      break;
    default: // mid-range
      percentages = { accommodation: 0.4, food: 0.25, transport: 0.2, activities: 0.15 };
  }

  return {
    accommodation: Math.round(totalBudget * percentages.accommodation),
    food: Math.round(totalBudget * percentages.food),
    transport: Math.round(totalBudget * percentages.transport),
    activities: Math.round(totalBudget * percentages.activities)
  };
}

// Budget calculator
function calculateBudget() {
  const days = parseInt(document.getElementById('days').value) || 1;
  const accCost = parseFloat(document.getElementById('acc-cost').value) || 0;
  const foodCost = parseFloat(document.getElementById('food-cost').value) || 0;
  const transportCost = parseFloat(document.getElementById('transport-cost').value) || 0;
  const activityCost = parseFloat(document.getElementById('activity-cost').value) || 0;

  const totalAccommodation = accCost * days;
  const totalFood = foodCost * days;
  const totalActivities = activityCost * days;
  const grandTotal = totalAccommodation + totalFood + transportCost + totalActivities;

  document.getElementById('budget-result').innerHTML = `
    <div class="text-center">
      <p class="text-2xl font-bold text-orange-500">₹${grandTotal.toLocaleString()}</p>
      <p class="text-sm text-gray-600">Total for ${days} days</p>
    </div>
  `;

  // Update the main budget field
  const budgetField = document.getElementById('budget');
  if (budgetField) {
    budgetField.value = grandTotal;
  }
}

// Weather check
async function checkWeather() {
  const city = document.getElementById('weather-city').value.trim();
  if (!city) {
    showNotification('Please enter a city name', 'error');
    return;
  }

  try {
    const response = await fetch(`/api/weather/${encodeURIComponent(city)}`);
    const weather = await response.json();

    document.getElementById('weather-result').innerHTML = `
      <div class="text-center">
        <p class="font-bold">${weather.city}</p>
        <p class="text-lg">${weather.temperature}°C</p>
        <p class="text-sm text-gray-600">${weather.condition}</p>
      </div>
    `;
  } catch (error) {
    document.getElementById('weather-result').innerHTML = `
      <p class="text-red-500 text-sm">Unable to fetch weather data</p>
    `;
  }
}

// Currency converter
async function convertCurrency() {
  const from = document.getElementById('from-currency').value;
  const to = document.getElementById('to-currency').value;
  const amount = parseFloat(document.getElementById('amount').value);

  if (!amount || amount <= 0) {
    showNotification('Please enter a valid amount', 'error');
    return;
  }

  try {
    const response = await fetch(`/api/currency/${from}/${to}/${amount}`);
    const result = await response.json();

    document.getElementById('conversion-result').innerHTML = `
      <div class="text-center">
        <p class="font-bold">${result.converted} ${result.to}</p>
        <p class="text-sm text-gray-600">Rate: 1 ${result.from} = ${result.rate} ${result.to}</p>
      </div>
    `;
  } catch (error) {
    document.getElementById('conversion-result').innerHTML = `
      <p class="text-red-500 text-sm">Unable to convert currency</p>
    `;
  }
}

// Download plan (placeholder)
function downloadPlan() {
  showNotification('Download feature coming soon!', 'info');
}

// Share plan (placeholder)
function sharePlan() {
  if (navigator.share) {
    navigator.share({
      title: 'My Travel Plan',
      text: 'Check out my travel plan created with TravelTales!',
      url: window.location.href
    });
  } else {
    // Fallback - copy to clipboard
    navigator.clipboard.writeText(window.location.href).then(() => {
      showNotification('Plan link copied to clipboard!', 'success');
    });
  }
}

// Notification function (if not already defined)
function showNotification(message, type = 'info') {
  console.log(`Notification: ${message} (${type})`); // Debug log
  
  if (window.TravelTales && window.TravelTales.showNotification) {
    window.TravelTales.showNotification(message, type);
  } else {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white transform translate-x-full transition-transform duration-300 ${
      type === 'error' ? 'bg-red-500' : 
      type === 'success' ? 'bg-green-500' : 
      'bg-blue-500'
    }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Slide in
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);

    // Slide out and remove
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}