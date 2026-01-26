---
layout: layouts/base
title: search
permalink: /search/
eleventyNavigation: 
    key: search
    order: 5
---

## search

Looking for something specific? Try the search here - if you can't find what you're looking for don't hesitate to [contact me](/contactme)

<div class="search-container"> 
<input type="text" id="searchInput" placeholder="Search posts...">
</div>
<ul id="searchResults"></ul>

<script>
  // Fetch the JSON index
  fetch("{{ site.baseUrl }}/search.json")
    .then(response => response.json())
    .then(data => {
      const input = document.getElementById('searchInput');
      const resultsList = document.getElementById('searchResults');

      input.addEventListener('input', () => {
        const query = input.value.toLowerCase();
        const filteredPosts = data.filter(blogPost =>
          blogPost.title.toLowerCase().includes(query) ||
          blogPost.content.toLowerCase().includes(query)
        );

        // Clear and repopulate results
        resultsList.innerHTML = '';
        filteredPosts.forEach(blogPost => {
          const li = document.createElement('li');
          li.innerHTML = `<a href="${blogPost.url}">${blogPost.title}</a>`;
          resultsList.appendChild(li);
        });
      });
    })
    .catch(error => console.error('Error loading search index:', error));
</script>
