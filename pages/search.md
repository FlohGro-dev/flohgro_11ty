---
layout: layouts/base
title: search
eleventyNavigation: 
    key: search
    order: 5
---

{% include "std-icons.md" %}

## search

<div class="search-container"> 
<input type="text" id="searchInput" placeholder="Search posts...">
</div>
<ul id="searchResults"></ul>

<script>
  // Fetch the JSON index
  fetch('/search.json')
    .then(response => response.json())
    .then(data => {
      const input = document.getElementById('searchInput');
      const resultsList = document.getElementById('searchResults');

      input.addEventListener('input', () => {
        const query = input.value.toLowerCase();
        const filteredPosts = data.filter(post =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query)
        );

        // Clear and repopulate results
        resultsList.innerHTML = '';
        filteredPosts.forEach(post => {
          const li = document.createElement('li');
          li.innerHTML = `<a href="${post.url}">${post.title}</a>`;
          resultsList.appendChild(li);
        });
      });
    })
    .catch(error => console.error('Error loading search index:', error));
</script>
