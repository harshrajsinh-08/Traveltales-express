document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Add cache busting to ensure fresh data
    const timestamp = new Date().getTime();
    const res = await fetch(`/profile.json?t=${timestamp}`);
    const profile = await res.json();

    const container = document.getElementById("profile-container");
    if (!container) return;

    container.innerHTML = `
      <div class="flex-shrink-0">
        <img src="${profile.image}" 
             alt="${profile.name}" 
             class="h-32 w-32 rounded-full object-cover border-4 border-orange-500"/>
      </div>
      <div class="flex-1">
        <h3 class="text-2xl font-bold">${profile.name}</h3>
        <p class="text-gray-600">${profile.bio}</p>

        <div class="mt-4 flex flex-wrap gap-2">
          ${profile.badges
            .map(
              (badge) => `
            <span class="badge bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              ${badge}
            </span>
          `
            )
            .join("")}
        </div>

        <div class="mt-4">
          <a href="/profile" 
             class="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition">
            View Full Profile →
          </a>
        </div>
      </div>
    `;
  } catch (err) {
    console.error("Error loading profile:", err);
  }
});
