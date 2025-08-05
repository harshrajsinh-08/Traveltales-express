document.addEventListener('DOMContentLoaded', () => {
  fetch('/blogs.json')
    .then(res => res.json())
    .then(blogs => {
      const container = document.getElementById('blogs-container');

      if (!blogs.length) {
        container.innerHTML = `
          <p class="text-gray-600 text-center col-span-3">
            No blogs yet. <a href="/blogs" class="text-orange-500 underline">Add one?</a>
          </p>
        `;
        return;
      }

      blogs.slice(0, 3).forEach(blog => {
        const card = document.createElement('div');
        card.className = "blog-card bg-white rounded-xl shadow-md overflow-hidden transition hover:-translate-y-1";

        card.innerHTML = `
          <img src="${blog.image}" class="h-48 w-full object-cover"/>
          <div class="p-6">
            <h3 class="font-bold text-xl mb-2">${blog.title}</h3>
            <p class="text-gray-600 mb-4">${blog.summary}</p>
            <a href="/blog/${blog.id}" class="text-orange-500 font-semibold hover:underline">Read More →</a>
          </div>
        `;

        container.appendChild(card);
      });
    });
});