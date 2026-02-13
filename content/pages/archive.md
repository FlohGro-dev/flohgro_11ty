---
layout: layouts/base
title: blog
permalink: /blog/
eleventyNavigation:
    key: blog
    order: 1
---

# All Posts

<div class="recent-posts-list">
{% for blogPost in collections.blogPosts %}
<a href="{{ site.baseUrl }}{{ blogPost.url }}" class="related-post-card">
<h3>{{ blogPost.data.title }}</h3>
<time datetime="{{ blogPost.data.date | htmlDateString }}">{{ blogPost.data.date | smartDate }}</time>
<span class="reading-time">{{ blogPost.templateContent | readingTime }}</span>
{%- assign filteredTags = blogPost.data.tags | filterTagList -%}
{%- if filteredTags.size > 0 -%}
<span class="card-tags">{%- for tag in filteredTags -%}{%- if forloop.index <= 3 -%}<span>{{ tag }}</span>{%- endif -%}{%- endfor -%}{%- if filteredTags.size > 3 -%}<span class="card-tags-more">+{{ filteredTags.size | minus: 3 }}</span>{%- endif -%}</span>
{%- endif -%}
<p>{% if blogPost.data.summary %}{{ blogPost.data.summary }}{% else %}{{ blogPost.templateContent | truncate: 300 }}{% endif %}</p>
</a>
{% endfor %}
</div>
