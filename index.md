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

<div class="recent-posts-list">
{% for post in collections.recentBlogPostsWithoutLatest %}
<a href="{{ site.baseUrl }}{{ post.url }}" class="related-post-card">
<h3>{{ post.data.title }}</h3>
<time datetime="{{ post.data.date | htmlDateString }}">{{ post.data.date | smartDate }}</time>
<span class="reading-time">{{ post.templateContent | readingTime }}</span>
<p>{% if post.data.summary %}{{ post.data.summary }}{% else %}{{ post.templateContent | truncate: 300 }}{% endif %}</p>
</a>
{% endfor %}
</div>

## [All Posts](/blog/)
