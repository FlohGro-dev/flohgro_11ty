---
layout: layouts/base
---

{% for post in collections.latestBlogPost %}
## [{{ post.data.title }}]({{ site.baseUrl }}{{ post.url }})
<ul class="post-metadata">
<li><time datetime="{{ post.data.date | htmlDateString }}">{{ post.data.date | smartDate }}</time></li>
<li class="reading-time">{{ post.templateContent | readingTime }}</li>
</ul>

{{ post.templateContent }}
{% endfor %}

---

<div id="reading-end"></div>

# Recent Posts

{% for post in collections.recentBlogPostsWithoutLatest %}
## [{{ post.data.title }}]({{ site.baseUrl }}{{ post.url }})
<ul class="post-metadata">
<li><time datetime="{{ post.data.date | htmlDateString }}">{{ post.data.date | smartDate }}</time></li>
<li class="reading-time">{{ post.templateContent | readingTime }}</li>
</ul>

{% if post.data.summary %}{{ post.data.summary }}{% else %}{{ post.templateContent | truncate: 300 }}{% endif %}
{% endfor %}

---

## [All Posts](/archive/)
