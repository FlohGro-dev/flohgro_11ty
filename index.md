---
layout: layouts/base
---

{% for post in collections.latestBlogPost %}
## [{{ post.data.title }}]({{ site.baseUrl }}{{ post.url }}) ({{post.data.date | isoDate}})
<p class="reading-time">{{ post.templateContent | readingTime }}</p>

{{ post.templateContent }}
{% endfor %}

---

# Recent Posts

{% for post in collections.recentBlogPostsWithoutLatest %}
## [{{ post.data.title }}]({{ site.baseUrl }}{{ post.url }}) ({{post.data.date | isoDate}})
<p class="reading-time">{{ post.templateContent | readingTime }}</p>

{% if post.data.summary %}{{ post.data.summary }}{% else %}{{ post.templateContent | truncate: 300 }}{% endif %}
{% endfor %}

---

## [All Posts](/archive/)
