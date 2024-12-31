---
layout: layouts/home
---

{% include "std-icons.md" %}

{% for post in collections.latestPost %}
## [{{ post.data.title }}]({{ site.baseUrl }}{{ post.url }}) ({{post.data.date | isoDate}})
{{ post.templateContent }}
{% endfor %}

---

# Recent Posts

{% for post in collections.recentPostsWithoutLatest %}
## [{{ post.data.title }}]({{ site.baseUrl }}{{ post.url }}) ({{post.data.date | isoDate}})
{{ post.templateContent | truncate: 300 }}
{% endfor %}

---

## [All Posts](/pages/archive/)