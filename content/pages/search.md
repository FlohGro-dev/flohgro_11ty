---
layout: layouts/base
title: search
permalink: /search/
eleventyNavigation: 
    key: search
    order: 6
---

## search

Looking for something specific? Try the search here - if you can't find what you're looking for don't hesitate to [contact me](/contactme)

<div class="search-container">
<input type="text" id="searchInput" placeholder="Search posts...">
</div>
<div id="searchResults" class="recent-posts-list"></div>

<script>
  function truncate(str, len) {
    if (!str) return '';
    if (str.length <= len) return str;
    return str.substring(0, len) + '...';
  }

  fetch("{{ site.baseUrl }}/search.json")
    .then(response => response.json())
    .then(data => {
      const input = document.getElementById('searchInput');
      const results = document.getElementById('searchResults');

      input.addEventListener('input', () => {
        const query = input.value.toLowerCase();
        const filtered = data.filter(post =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query)
        );

        results.innerHTML = '';
        filtered.forEach(post => {
          const excerpt = post.summary || truncate(post.content, 300);
          const card = document.createElement('a');
          card.href = post.url;
          card.className = 'related-post-card';
          card.innerHTML = `<h3>${post.title}</h3>` +
            (post.date ? `<time datetime="${post.date}">${post.date}</time>` : '') +
            (post.readingTime ? `<span class="reading-time">${post.readingTime}</span>` : '') +
            `<p>${excerpt}</p>`;
          results.appendChild(card);
        });
      });
    })
    .catch(error => console.error('Error loading search index:', error));
</script>
