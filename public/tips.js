// Travel Tips JavaScript

document.addEventListener('DOMContentLoaded', () => {
  loadTips();
});

// Sample tips data
const tipsData = [
  {
    id: 1,
    title: 'Best Time to Visit India',
    content: 'October to March is generally the best time to visit most parts of India. The weather is pleasant and perfect for sightseeing.',
    category: 'planning',
    icon: 'bi-calendar-check'
  },
  {
    id: 2,
    title: 'Packing Essentials',
    content: 'Pack light, comfortable clothes suitable for the climate. Always carry a first-aid kit, sunscreen, and comfortable walking shoes.',
    category: 'packing',
    icon: 'bi-bag-check'
  },
  {
    id: 3,
    title: 'Local Transportation',
    content: 'Use local trains and buses for authentic experiences and budget travel. Book train tickets in advance, especially during peak season.',
    category: 'transport',
    icon: 'bi-train-front'
  },
  {
    id: 4,
    title: 'Food Safety',
    content: 'Drink bottled water and eat at busy local restaurants for fresh food. Avoid raw vegetables and unpeeled fruits from street vendors.',
    category: 'health',
    icon: 'bi-shield-check'
  },
  {
    id: 5,
    title: 'Cultural Etiquette',
    content: 'Respect local customs and dress modestly at religious sites. Remove shoes before entering temples and homes.',
    category: 'culture',
    icon: 'bi-people'
  },
  {
    id: 6,
    title: 'Money Matters',
    content: 'Carry cash as many places don\'t accept cards. Keep small denominations handy for tips and small purchases.',
    category: 'planning',
    icon: 'bi-wallet2'
  },
  {
    id: 7,
    title: 'Health Precautions',
    content: 'Get necessary vaccinations before travel. Carry basic medicines and stay hydrated, especially in hot weather.',
    category: 'health',
    icon: 'bi-heart-pulse'
  },
  {
    id: 8,
    title: 'Language Tips',
    content: 'Learn basic Hindi phrases. English is widely spoken in tourist areas, but local language helps in remote places.',
    category: 'culture',
    icon: 'bi-chat-dots'
  },
  {
    id: 9,
    title: 'Smart Packing',
    content: 'Pack according to the season and region. Layers work best as temperatures can vary throughout the day.',
    category: 'packing',
    icon: 'bi-backpack'
  },
  {
    id: 10,
    title: 'Transportation Apps',
    content: 'Download useful apps like IRCTC for trains, Ola/Uber for cabs, and Google Translate for communication.',
    category: 'transport',
    icon: 'bi-phone'
  },
  {
    id: 11,
    title: 'Bargaining Skills',
    content: 'Bargaining is common in markets. Start at 50% of the quoted price and negotiate. Fixed-price shops don\'t allow bargaining.',
    category: 'culture',
    icon: 'bi-currency-rupee'
  },
  {
    id: 12,
    title: 'Emergency Contacts',
    content: 'Keep emergency numbers handy: Police (100), Fire (101), Ambulance (102). Save local embassy contacts if you\'re a foreign tourist.',
    category: 'health',
    icon: 'bi-telephone'
  }
];

// Load and display tips
function loadTips(category = 'all') {
  const container = document.getElementById('tips-container');
  
  let filteredTips = tipsData;
  if (category !== 'all') {
    filteredTips = tipsData.filter(tip => tip.category === category);
  }

  container.innerHTML = filteredTips.map(tip => `
    <div class="tip-card bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
      <div class="flex items-start space-x-4">
        <div class="flex-shrink-0">
          <i class="${tip.icon} text-2xl text-orange-500"></i>
        </div>
        <div class="flex-1">
          <h3 class="text-xl font-bold mb-3">${tip.title}</h3>
          <p class="text-gray-600 leading-relaxed">${tip.content}</p>
          <div class="mt-4">
            <span class="inline-block bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
              ${tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // Add animation
  const cards = container.querySelectorAll('.tip-card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.transition = 'all 0.3s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 100);
  });
}

// Filter tips by category
function filterTips(category) {
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active', 'bg-orange-500', 'text-white');
    btn.classList.add('bg-gray-200', 'text-gray-700');
  });

  event.target.classList.remove('bg-gray-200', 'text-gray-700');
  event.target.classList.add('active', 'bg-orange-500', 'text-white');

  // Load filtered tips
  loadTips(category);
}

// Search functionality (if needed)
function searchTips(query) {
  const filteredTips = tipsData.filter(tip => 
    tip.title.toLowerCase().includes(query.toLowerCase()) ||
    tip.content.toLowerCase().includes(query.toLowerCase())
  );

  const container = document.getElementById('tips-container');
  container.innerHTML = filteredTips.map(tip => `
    <div class="tip-card bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
      <div class="flex items-start space-x-4">
        <div class="flex-shrink-0">
          <i class="${tip.icon} text-2xl text-orange-500"></i>
        </div>
        <div class="flex-1">
          <h3 class="text-xl font-bold mb-3">${tip.title}</h3>
          <p class="text-gray-600 leading-relaxed">${tip.content}</p>
          <div class="mt-4">
            <span class="inline-block bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
              ${tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}