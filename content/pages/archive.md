---
layout: layouts/base
title: archive
permalink: /archive/
eleventyNavigation: 
    key: archive
    order: 4
---

{% include "std-icons.md" %}

## archive of all posts

{% for blogPost in collections.blogPosts %}
  - [{{ blogPost.data.title }}]({{ baseUrl }}{{ blogPost.url }}) - {{ blogPost.data.date | isoDate }}
{% endfor %}
