document.addEventListener('DOMContentLoaded', () => {
  const blogContainer = document.getElementById('blogs-container');

  fetch('/blogs.json')
    .then(response => response.json())
    .then(blogs => {
      blogContainer.innerHTML = ''; // Clear placeholder

      if (blogs.length === 0) {
        blogContainer.innerHTML = `<p class="text-gray-600 text-center col-span-3">
          No blogs yet. <a href="/blogs" class="text-orange-500 underline">Add one?</a>
        </p>`;
        return;
      }

      blogs.forEach(blog => {
        const card = document.createElement('div');
        card.className = "blog-card bg-white rounded-xl shadow-md overflow-hidden transition hover:-translate-y-1";

        card.innerHTML = `
          <img src="${blog.image}" alt="${blog.title}" class="h-48 w-full object-cover" />
          <div class="p-6">
            <h3 class="font-bold text-xl mb-2">${blog.title}</h3>
            <p class="text-gray-600">${blog.summary}</p>
            <a href="/blog/${blog.id}" class="text-orange-500 font-semibold hover:underline mt-3 inline-block">
              Read More →
            </a>
          </div>
        `;

        blogContainer.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Error loading blogs:", err);
      blogContainer.innerHTML = `<p class="col-span-3 text-center text-gray-500">Failed to load blogs.</p>`;
    });
});