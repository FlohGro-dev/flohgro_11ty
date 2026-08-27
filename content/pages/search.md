---
layout: layouts/base
title: search
permalink: /search/
eleventyNavigation: 
    key: search
    order: 7
---

# search

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

  function highlight(text, query) {
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
  }

  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');

  // The index carries the full body of every post, so it is 395 KB. Fetching
  // it on page load made it compete with the page itself for anyone who never
  // typed anything. Deferring to first interaction removes it from initial
  // load entirely; the promise is memoised so it is only ever fetched once.
  let indexPromise = null;
  function loadIndex() {
    if (!indexPromise) {
      indexPromise = fetch("{{ site.baseUrl }}/search.json")
        .then(response => response.json())
        .catch(error => {
          console.error('Error loading search index:', error);
          indexPromise = null; // let a later keystroke retry
          return [];
        });
    }
    return indexPromise;
  }

  // Focus usually precedes the first keystroke, so the fetch is normally
  // already in flight by the time anything is typed.
  input.addEventListener('focus', loadIndex, { once: true });

  function render(data) {
    // Read the query after the await, not before, so a slow first fetch
    // cannot paint results for a query the visitor has already moved past.
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
      card.innerHTML = `<h3>${highlight(post.title, query)}</h3>` +
        (post.date ? `<time datetime="${post.date}">${post.date}</time>` : '') +
        (post.readingTime ? `<span class="reading-time">${post.readingTime}</span>` : '') +
        `<p>${highlight(excerpt, query)}</p>`;
      results.appendChild(card);
    });
  }

  input.addEventListener('input', () => {
    loadIndex().then(render);
  });
</script>
