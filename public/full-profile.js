document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/profile.json');
    const profile = await res.json();

    // Profile Header
    const header = document.querySelector('#profile-header');
    header.innerHTML = `
      <div class="flex flex-col md:flex-row items-center gap-8">
        <img
          src="${profile.image}"
          alt="${profile.name}"
          class="h-32 w-32 rounded-full object-cover border-4 border-white"
        />
        <div class="text-center md:text-left">
          <h1 class="text-3xl font-bold text-white mb-2">${profile.name}</h1>
          <p class="text-white/90">${profile.bio}</p>
          <div class="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
            ${profile.badges.map(badge => `
              <span class="badge bg-white/20">${badge}</span>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Travel Stats
    const statsContainer = document.querySelector('#travel-stats');
    statsContainer.innerHTML = `
      <div class="grid grid-cols-3 gap-4 text-center">
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

    // Recent Activity
    const activityContainer = document.querySelector('#recent-activity');
    activityContainer.innerHTML = profile.recentActivity.map(activity => `
      <div class="flex items-center">
        <i class="bi ${activity.icon} ${activity.color} mr-3"></i>
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