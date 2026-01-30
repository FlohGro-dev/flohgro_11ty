---
layout: layouts/base
title: blog
permalink: /blog/
eleventyNavigation:
    key: blog
    order: 1
---

## All Posts

<div class="recent-posts-list">
{% for blogPost in collections.blogPosts %}
<a href="{{ site.baseUrl }}{{ blogPost.url }}" class="related-post-card">
<h3>{{ blogPost.data.title }}</h3>
<time datetime="{{ blogPost.data.date | htmlDateString }}">{{ blogPost.data.date | smartDate }}</time>
<span class="reading-time">{{ blogPost.templateContent | readingTime }}</span>
<p>{% if blogPost.data.summary %}{{ blogPost.data.summary }}{% else %}{{ blogPost.templateContent | truncate: 300 }}{% endif %}</p>
</a>
{% endfor %}
</div>
