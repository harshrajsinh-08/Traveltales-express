document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Add cache busting to ensure fresh data
    const timestamp = new Date().getTime();
    const res = await fetch(`/profile.json?t=${timestamp}`);
    const profile = await res.json();

    // Profile Header
    const header = document.querySelector('#profile-header');
    header.innerHTML = `
      <div class="flex flex-col md:flex-row items-center gap-8">
        <div class="relative">
          <img
            src="${profile.image}"
            alt="${profile.name}"
            class="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div class="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
            <i class="bi bi-check text-white text-sm"></i>
          </div>
        </div>
        
        <div class="text-center md:text-left flex-1">
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-3">${profile.name}</h1>
          <p class="text-white/90 text-lg mb-4 max-w-2xl">${profile.bio}</p>
          
          <!-- Profile Details Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            ${profile.location ? `
              <div class="flex items-center justify-center md:justify-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <div class="bg-white/20 p-2 rounded-full">
                  <i class="bi bi-geo-alt text-white"></i>
                </div>
                <div class="text-left">
                  <p class="text-white/70 text-xs uppercase tracking-wide">Location</p>
                  <p class="text-white font-medium">${profile.location}</p>
                </div>
              </div>
            ` : ''}
            
            ${profile.website ? `
              <div class="flex items-center justify-center md:justify-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <div class="bg-white/20 p-2 rounded-full">
                  <i class="bi bi-globe text-white"></i>
                </div>
                <div class="text-left">
                  <p class="text-white/70 text-xs uppercase tracking-wide">Website</p>
                  <a href="${profile.website}" target="_blank" class="text-white font-medium hover:text-orange-200 underline">${profile.website.replace('https://', '').replace('http://', '')}</a>
                </div>
              </div>
            ` : ''}
            
            ${profile.phone ? `
              <div class="flex items-center justify-center md:justify-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <div class="bg-white/20 p-2 rounded-full">
                  <i class="bi bi-telephone text-white"></i>
                </div>
                <div class="text-left">
                  <p class="text-white/70 text-xs uppercase tracking-wide">Phone</p>
                  <p class="text-white font-medium">${profile.phone}</p>
                </div>
              </div>
            ` : ''}
            
            ${profile.dateOfBirth ? `
              <div class="flex items-center justify-center md:justify-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <div class="bg-white/20 p-2 rounded-full">
                  <i class="bi bi-calendar-heart text-white"></i>
                </div>
                <div class="text-left">
                  <p class="text-white/70 text-xs uppercase tracking-wide">Birthday</p>
                  <p class="text-white font-medium">${new Date(profile.dateOfBirth).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
              </div>
            ` : ''}
          </div>
          
          <!-- Badges -->
          <div class="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
            ${profile.badges.map(badge => `
              <span class="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/30 hover:bg-white/30 transition-colors">${badge}</span>
            `).join('')}
          </div>
          
          <!-- Action Button -->
          <div class="flex justify-center md:justify-start">
            <a href="/auth/profile/edit" class="bg-white text-orange-500 px-6 py-3 rounded-lg font-medium hover:bg-orange-50 transition-colors flex items-center gap-2 shadow-lg">
              <i class="bi bi-pencil"></i>
              Edit Profile
            </a>
          </div>
        </div>
      </div>
    `;

    // Travel Stats
    const statsContainer = document.querySelector('#travel-stats');
    statsContainer.innerHTML = `
      <div class="grid grid-cols-3 gap-4 text-center mb-6">
        <div>
          <h3 class="text-2xl font-bold text-orange-500">${profile.stats.places}</h3>
          <p class="text-gray-600">Places</p>
        </div>
        <div>
          <h3 class="text-2xl font-bold text-orange-500">${profile.stats.posts}</h3>
          <p class="text-gray-600">Posts</p>
        </div>
        <div>
          <h3 class="text-2xl font-bold text-orange-500">${profile.stats.followers}</h3>
          <p class="text-gray-600">Followers</p>
        </div>
      </div>
      <div class="border-t pt-4">
        <h3 class="font-semibold mb-3">Account Settings</h3>
        <div class="space-y-2">
          <a href="/auth/profile/edit" class="flex items-center text-gray-600 hover:text-orange-500 transition-colors">
            <i class="bi bi-pencil mr-2"></i>
            Edit Profile
          </a>
        </div>
      </div>
    `;

    // Upcoming Trips
    const tripsContainer = document.querySelector('#upcoming-trips');
    tripsContainer.innerHTML = profile.upcomingTrips.map(trip => `
      <li class="flex items-center">
        <i class="bi bi-calendar text-orange-500 mr-3"></i>
        <div>
          <h4 class="font-semibold">${trip.title}</h4>
          <p class="text-gray-600 text-sm">${trip.date}</p>
        </div>
      </li>
    `).join('');

    // Personal Information
    const personalInfoContainer = document.querySelector('#personal-info');
    const personalInfoItems = [];
    
    if (profile.email) {
      personalInfoItems.push(`
        <div class="flex items-center gap-3">
          <i class="bi bi-envelope text-orange-500"></i>
          <div>
            <p class="text-sm text-gray-500">Email</p>
            <p class="font-medium">${profile.email}</p>
          </div>
        </div>
      `);
    }
    
    if (profile.phone) {
      personalInfoItems.push(`
        <div class="flex items-center gap-3">
          <i class="bi bi-telephone text-orange-500"></i>
          <div>
            <p class="text-sm text-gray-500">Phone</p>
            <p class="font-medium">${profile.phone}</p>
          </div>
        </div>
      `);
    }
    
    if (profile.website) {
      personalInfoItems.push(`
        <div class="flex items-center gap-3">
          <i class="bi bi-globe text-orange-500"></i>
          <div>
            <p class="text-sm text-gray-500">Website</p>
            <a href="${profile.website}" target="_blank" class="font-medium text-orange-500 hover:underline">${profile.website}</a>
          </div>
        </div>
      `);
    }
    
    if (profile.dateOfBirth) {
      const birthDate = new Date(profile.dateOfBirth);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      personalInfoItems.push(`
        <div class="flex items-center gap-3">
          <i class="bi bi-calendar-heart text-orange-500"></i>
          <div>
            <p class="text-sm text-gray-500">Birthday</p>
            <p class="font-medium">${birthDate.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} (${age} years old)</p>
          </div>
        </div>
      `);
    }
    
    if (profile.gender) {
      personalInfoItems.push(`
        <div class="flex items-center gap-3">
          <i class="bi bi-person text-orange-500"></i>
          <div>
            <p class="text-sm text-gray-500">Gender</p>
            <p class="font-medium">${profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}</p>
          </div>
        </div>
      `);
    }
    
    if (personalInfoItems.length === 0) {
      personalInfoContainer.innerHTML = `
        <div class="text-center text-gray-500 py-4">
          <i class="bi bi-info-circle text-2xl mb-2"></i>
          <p>No personal information added yet.</p>
          <a href="/auth/profile/edit" class="text-orange-500 hover:underline text-sm">Add information</a>
        </div>
      `;
    } else {
      personalInfoContainer.innerHTML = personalInfoItems.join('');
    }

    // Recent Activity
    const activityContainer = document.querySelector('#recent-activity');
    activityContainer.innerHTML = profile.recentActivity.map(activity => `
      <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <i class="bi ${activity.icon} ${activity.color} text-xl"></i>
        <p class="text-gray-600">${activity.text}</p>
      </div>
    `).join('');

    // My Travel Stories
    const postsContainer = document.querySelector('#my-posts');
    postsContainer.innerHTML = profile.posts.map(post => `
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <img src="${post.image}" class="h-48 w-full object-cover"/>
        <div class="p-6">
          <h3 class="font-bold text-xl mb-2">${post.title}</h3>
          <p class="text-gray-600">${post.description}</p>
          <div class="mt-4 flex items-center justify-between">
            <span class="text-gray-500 text-sm">${post.date}</span>
            <div class="flex items-center space-x-3">
              <span class="text-gray-500"><i class="bi bi-heart"></i> ${post.likes}</span>
              <span class="text-gray-500"><i class="bi bi-chat"></i> ${post.comments}</span>
            </div>
          </div>
        </div>
      </div>
    `).join('');

  } catch (err) {
    console.error('Error loading full profile:', err);
  }
});

