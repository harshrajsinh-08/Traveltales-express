document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('stories-container');

  fetch('/stories.json')
    .then(response => response.json())
    .then(stories => {
      container.innerHTML = ''; // Clear any placeholder content

      stories.forEach(story => {
        const card = document.createElement('div');
        card.className = "story-card bg-white rounded-xl shadow-md overflow-hidden transition hover:-translate-y-1";

        card.innerHTML = `
          <img src="${story.image}" alt="${story.title}" class="h-48 w-full object-cover" />
          <div class="p-6">
            <h3 class="font-bold text-xl mb-2">${story.title}</h3>
            <p class="text-gray-600">${story.summary}</p>
            <a href="/story/${story.id}" class="text-orange-500 font-semibold hover:underline mt-3 inline-block">
              Read More →
            </a>
          </div>
        `;

        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Error loading stories:", err);
      container.innerHTML = `<p class="col-span-3 text-center text-gray-500">Failed to load stories.</p>`;
    });
});