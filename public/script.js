// TravelTales Main JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initializeSearch();
  initializeAnimations();
  initializeFormValidation();
});

// Search functionality
function initializeSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  
  if (!searchInput) return;

  // Sample search data
  const destinations = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata',
    'Jaipur', 'Goa', 'Kerala', 'Rajasthan', 'Kashmir',
    'Manali', 'Shimla', 'Darjeeling', 'Ooty', 'Munnar'
  ];

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    
    if (query.length < 2) {
      searchResults.classList.add('hidden');
      return;
    }

    const matches = destinations.filter(dest => 
      dest.toLowerCase().includes(query)
    ).slice(0, 5);

    if (matches.length > 0) {
      searchResults.innerHTML = matches.map(dest => `
        <div class="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0" 
             onclick="selectDestination('${dest}')">
          <i class="bi bi-geo-alt text-orange-500 mr-2"></i>
          ${dest}
        </div>
      `).join('');
      searchResults.classList.remove('hidden');
    } else {
      searchResults.classList.add('hidden');
    }
  });

  // Hide results when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.classList.add('hidden');
    }
  });
}

// Select destination from search
function selectDestination(destination) {
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  
  if (searchInput) {
    searchInput.value = destination;
    searchResults.classList.add('hidden');
  }
}

// Initialize scroll animations
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fadeIn');
      }
    });
  }, observerOptions);

  // Observe all cards and sections
  document.querySelectorAll('.story-card, .blog-card, section').forEach(el => {
    observer.observe(el);
  });
}

// Form validation
function initializeFormValidation() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;

      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('border-red-500');
          
          // Remove error styling on input
          field.addEventListener('input', () => {
            field.classList.remove('border-red-500');
          }, { once: true });
        }
      });

      if (!isValid) {
        e.preventDefault();
        showNotification('Please fill in all required fields', 'error');
      }
    });
  });
}

// Notification system
function showNotification(message, type = 'info') {
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
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Export functions for global use
window.TravelTales = {
  showNotification,
  selectDestination,
  debounce
};