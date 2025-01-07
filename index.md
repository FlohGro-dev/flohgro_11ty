---
layout: layouts/base
---

{% include "std-icons.md" %}

{% for post in collections.latestBlogPost %}
## [{{ post.data.title }}]({{ site.baseUrl }}{{ post.url }}) ({{post.data.date | isoDate}})
{{ post.templateContent }}
{% endfor %}

---

# Recent Posts

{% for post in collections.recentBlogPostsWithoutLatest %}
## [{{ post.data.title }}]({{ site.baseUrl }}{{ post.url }}) ({{post.data.date | isoDate}})
{{ post.templateContent | truncate: 300 }}
{% endfor %}

---

## [All Posts](/archive/)
